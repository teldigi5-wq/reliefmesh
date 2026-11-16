import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  destroySession();
  // The dashboard's logout button is a plain <form method="post">, which
  // does a full browser navigation to this route — a JSON response would
  // just render as raw text on screen. 303 See Other turns that POST into
  // a GET against /login, same as any other form-triggered redirect.
  return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
}
