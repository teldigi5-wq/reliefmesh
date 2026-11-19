import { NextRequest, NextResponse } from "next/server";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

/** Signed, role-restricted WhatsApp SOS ingestion. No phone number/JID is sent. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const caseIdSchema = z.string().regex(/^RM-[A-F0-9]{8}$/);
const bodySchema = z.discriminatedUnion("operation", [
  z.object({
    operation: z.literal("upsert"),
    caseId: caseIdSchema,
    latitude: z.number().finite().gte(-90).lte(90),
    longitude: z.number().finite().gte(-180).lte(180),
    sharedAt: z.number().int().positive(),
  }).strict(),
  z.object({
    operation: z.literal("remove"),
    caseId: caseIdSchema,
    sharedAt: z.number().int().positive(),
  }).strict(),
]);

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized integration" }, { status: 401 });

export async function POST(req: NextRequest) {
  const secret = process.env.WHATSAPP_SOS_INGEST_SECRET;
  if (!secret || secret.length < 32)
    return NextResponse.json({ error: "Integration not configured" }, { status: 503 });

  const timestampText = req.headers.get("x-reliefmesh-timestamp") ?? "";
  const signature = req.headers.get("x-reliefmesh-signature") ?? "";
  if (!/^\d{13}$/.test(timestampText) || !/^sha256=[0-9a-f]{64}$/.test(signature))
    return unauthorized();
  const timestamp = Number(timestampText);
  if (!Number.isSafeInteger(timestamp) || Math.abs(Date.now() - timestamp) > 300_000)
    return unauthorized();

  const raw = await req.text();
  if (Buffer.byteLength(raw) > 2048)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  const expected = createHmac("sha256", secret).update(timestampText + "." + raw).digest();
  const provided = Buffer.from(signature.slice(7), "hex");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected))
    return unauthorized();

  let parsed;
  try { parsed = bodySchema.safeParse(JSON.parse(raw)); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid incident data" }, { status: 400 });

  const { caseId, sharedAt } = parsed.data;
  if (sharedAt > Date.now() + 300_000 || sharedAt < Date.now() - 86_400_000)
    return NextResponse.json({ error: "Stale location" }, { status: 422 });

  // Stable disabled service reporter; it cannot log into the website.
  const email = "whatsapp-relay-" +
    createHash("sha256").update(secret).digest("hex").slice(0, 20) +
    "@internal.reliefmesh.invalid";
  const title = "WhatsApp SOS · " + caseId;

  if (parsed.data.operation === "remove") {
    const relay = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (relay) {
      await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtext(${title}))`;
        const existing = await tx.incident.findFirst({
          where: { reportedById: relay.id, title },
        });
        if (existing) await tx.incident.delete({ where: { id: existing.id } });
      });
    }
    return NextResponse.json({ accepted: true, removed: true, caseId }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { latitude, longitude } = parsed.data;
  const reporter = await prisma.user.upsert({
    where: { email },
    create: {
      email, fullName: "WhatsApp SOS relay",
      passwordHash: randomBytes(48).toString("hex"),
      role: "CITIZEN", isActive: false,
    },
    update: { isActive: false },
    select: { id: true },
  });
  const description =
    "Unverified SOS submitted via a registered ReliefMesh WhatsApp bot account. " +
    "Coordinates were shared voluntarily. This is not an official emergency dispatch.";

  // Transaction-scoped advisory lock prevents duplicate pins under retries.
  // Alert the WEBSITE's active admins/operators, regardless of whether any
  // WhatsApp OPERATOR account exists. This is in-app only: WhatsApp requires
  // a separate verified, opted-in recipient mapping.
  const result = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtext(${title}))`;
    const existing = await tx.incident.findFirst({
      where: { reportedById: reporter.id, title },
    });

    let incidentId: string;
    let created = false;
    let updated = false;

    if (existing) {
      if (existing.status === "CLOSED" || existing.status === "RESOLVED")
        return { id: existing.id, created: false, updated: false, websiteRecipients: 0, websiteNotificationsCreated: 0 };

      await tx.incident.update({
        where: { id: existing.id }, data: { latitude, longitude },
      });
      incidentId = existing.id;
      updated = true;
      // Fresh repeated SOS reconfirmations are represented by updatedAt.
    } else {
      const incident = await tx.incident.create({
        data: {
          title, description, category: "OTHER", severity: "HIGH",
          status: "REPORTED", latitude, longitude,
          reportedById: reporter.id,
        },
      });
      incidentId = incident.id;
      created = true;
    }

    const staff = await tx.user.findMany({
      where: { isActive: true, role: { in: ["ADMIN", "OPERATOR"] } },
      select: { id: true },
    });

    // Dedupe by incident, role-recipient and time window inside the same
    // serialised transaction. This protects notification inboxes when the
    // bot retries a successful SOS webhook.
    const cutoff = new Date(Date.now() - 2 * 60_000);
    const recent = staff.length ? await tx.notification.findMany({
      where: {
        relatedIncidentId: incidentId, type: "EMERGENCY_UPDATE",
        userId: { in: staff.map(u => u.id) },
        createdAt: { gte: cutoff },
      },
      select: { userId: true },
    }) : [];
    const alreadyNotified = new Set(recent.map(n => n.userId));
    const needsNotification = staff.filter(u => !alreadyNotified.has(u.id));
    if (needsNotification.length) {
      await tx.notification.createMany({
        data: needsNotification.map(u => ({
          userId: u.id,
          type: "EMERGENCY_UPDATE",
          title: created ? `New WhatsApp SOS: ${caseId}` : `WhatsApp SOS updated: ${caseId}`,
          message: "Unverified SOS report received. Open the case to review its shared location and coordinate assistance.",
          relatedIncidentId: incidentId,
        })),
      });
    }

    return { id: incidentId, created, updated, websiteRecipients: staff.length, websiteNotificationsCreated: needsNotification.length };
  });

  return NextResponse.json({
    accepted: true, caseId, incidentId: result.id,
    created: result.created, locationUpdated: result.updated,
    websiteEligibleRecipients: result.websiteRecipients,
    websiteNotificationsCreated: result.websiteNotificationsCreated,
    dashboardPath: "/incidents/" + result.id,
    disclaimer: "Website notifications are in-app only. WhatsApp recipients require opt-in; no official responder dispatch is implied.",
  }, {
    status: result.created ? 201 : 200,
    headers: { "Cache-Control": "no-store" },
  });
}
