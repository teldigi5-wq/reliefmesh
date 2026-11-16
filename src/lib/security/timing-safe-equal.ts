import { timingSafeEqual } from "crypto";

/**
 * Constant-time string comparison. Node's crypto.timingSafeEqual requires
 * equal-length buffers, so unequal lengths are handled by comparing against
 * a same-length dummy first — this avoids a length-based timing leak too.
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Still do a constant-time comparison against a buffer of B's length
    // so the function takes the same time whether or not lengths matched,
    // then return false — lengths differ, so they can never be equal.
    timingSafeEqual(Buffer.alloc(bufB.length), bufB);
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}
