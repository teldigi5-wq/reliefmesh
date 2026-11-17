import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const SESSION_COOKIE_NAME = "reliefmesh_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add it to .env (see .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  role: Role;
  email: string;
}

// Returns the raw signed token in addition to setting the cookie. The web
// app ignores the return value (the cookie is all it needs); the mobile app
// has no cookie jar, so the login route hands this same token back in the
// JSON response body for it to store (in SecureStore) and send as
// "Authorization: Bearer <token>" on every request instead.
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  // Cookie first (the web app's path); fall back to a bearer token for
  // clients with no cookie jar (the mobile app). Checking the header via
  // headers() rather than threading the request through every caller keeps
  // every existing getSession() call site — most of them server components
  // with no request object in scope — unchanged.
  const cookieToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  const authHeader = headers().get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;
  const token = cookieToken ?? bearerToken;
  if (!token) return null;

  let tokenPayload: SessionPayload;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    tokenPayload = payload as unknown as SessionPayload;
  } catch {
    return null;
  }

  // The JWT's role/email are a snapshot from login time and are trusted
  // for up to SESSION_DURATION_SECONDS (7 days) if taken at face value —
  // long enough that a demoted admin, a disabled account, or a changed
  // role would stay fully privileged until the token expires on its own.
  // Re-checking against the database on every request closes that gap at
  // the cost of one extra query per authenticated request; for this app's
  // scale that's a reasonable trade for not trusting a week-old claim
  // about who someone currently is.
  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.userId },
    select: { role: true, isActive: true, email: true },
  });

  if (!user || !user.isActive) return null;

  return {
    userId: tokenPayload.userId,
    role: user.role,
    email: user.email,
  };
}

export function destroySession(): void {
  cookies().delete(SESSION_COOKIE_NAME);
}
