/**
 * Minimal in-memory rate limiter for a single-instance deployment.
 *
 * This is deliberately simple: it is NOT distributed (won't work correctly
 * behind multiple server instances/processes) and resets on restart. That's
 * an acceptable tradeoff for a hackathon demo on one server. For a real
 * production rollout, replace this with a shared store (Redis, etc.) behind
 * the same `checkRateLimit` call signature — nothing else needs to change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count, retryAfterMs: 0 };
}

// Keeps memory bounded on a long-running dev server — not essential, but
// cheap insurance against an unbounded Map. Not calling .unref() here
// deliberately: it's one harmless timer, and avoiding it sidesteps any
// Node-vs-DOM lib typing ambiguity in this tsconfig.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000);

export function clientIpFrom(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}
