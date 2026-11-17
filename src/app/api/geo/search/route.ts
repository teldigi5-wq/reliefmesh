import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { searchLocations } from "@/lib/geo/nominatim";
import { checkRateLimit, clientIpFrom } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Nominatim's own usage policy caps unauthenticated use at ~1 req/sec
  // total; this keeps any one user (or a runaway autocomplete loop) from
  // burning that whole shared budget by themselves.
  const ip = clientIpFrom(req);
  const rateLimit = checkRateLimit(`geo-search:${ip}`, {
    max: 20,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many location searches. Slow down a moment." },
      { status: 429 }
    );
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchLocations(q);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Location search is temporarily unavailable" },
      { status: 502 }
    );
  }
}
