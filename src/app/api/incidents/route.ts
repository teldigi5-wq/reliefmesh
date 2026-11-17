import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { createIncidentSchema } from "@/lib/validation/incident";
import { PermissionError } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const incidents = await incidentService.listIncidents({
    id: session.userId,
    role: session.role,
  });
  return NextResponse.json(incidents);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Keyed per-user (not per-IP): the thing being limited is one account
  // spamming fabricated incidents, which an IP-based key wouldn't catch
  // for anyone behind shared/NATed IPs and would over-block unfairly.
  const rateLimit = checkRateLimit(`incident-create:${session.userId}`, {
    max: 10,
    windowMs: 10 * 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many reports submitted recently. Please wait a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = createIncidentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const incident = await incidentService.reportIncident(parsed.data, {
      id: session.userId,
      role: session.role,
    });
    return NextResponse.json(incident, { status: 201 });
  } catch (err) {
    if (err instanceof PermissionError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }
}
