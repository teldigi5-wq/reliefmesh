import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { reverseGeocode } from "@/lib/geo/nominatim";
import { checkRateLimit, clientIpFrom } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip = clientIpFrom(req);
  const rateLimit = checkRateLimit(`geo-reverse:${ip}`, {
    max: 20,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many location lookups. Slow down a moment." },
      { status: 429 }
    );
  }

  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lng = Number(req.nextUrl.searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const label = await reverseGeocode(lat, lng);
    return NextResponse.json({ label });
  } catch {
    return NextResponse.json(
      { error: "Location lookup is temporarily unavailable" },
      { status: 502 }
    );
  }
}
