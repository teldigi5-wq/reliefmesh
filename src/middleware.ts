import { NextRequest, NextResponse } from "next/server";

// Sessions are first-party HttpOnly cookies, scoped to a single hostname.
// Redirect known secondary production aliases to the one public website URL,
// so navigation between Vercel aliases cannot appear to log users out.
// Preview deployments and custom domains are left untouched.
const CANONICAL_HOST = "reliefmesh-theta.vercel.app";
const SECONDARY_HOSTS = new Set([
  "reliefmesh-teldigi5-wq.vercel.app",
  "reliefmesh-git-main-teldigi5-wq.vercel.app",
]);

export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") return NextResponse.next();

  const host = request.nextUrl.hostname.toLowerCase();
  if (!SECONDARY_HOSTS.has(host)) return NextResponse.next();

  const redirect = request.nextUrl.clone();
  redirect.protocol = "https:";
  redirect.hostname = CANONICAL_HOST;
  redirect.port = "";
  return NextResponse.redirect(redirect, 307);
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|icons/|reliefmesh/).*)"],
};
