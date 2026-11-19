import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

/**
 * Safe, read-only session check. The HttpOnly authentication cookie is never
 * exposed to JavaScript. The server checks that the account remains active.
 * The login UI uses this endpoint to skip a redundant login.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, {
        status: 401,
        headers: { "Cache-Control": "no-store, private" },
      });
    }
    return NextResponse.json({ authenticated: true, role: session.role }, {
      headers: { "Cache-Control": "no-store, private" },
    });
  } catch {
    // An unavailable database must not be mistaken for an expired session.
    return NextResponse.json({ error: "Session verification temporarily unavailable" }, {
      status: 503,
      headers: { "Cache-Control": "no-store, private" },
    });
  }
}
