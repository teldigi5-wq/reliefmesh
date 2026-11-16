import { describe, it, expect } from "vitest";
import { timingSafeEqualStrings } from "@/lib/security/timing-safe-equal";
import { checkRateLimit } from "@/lib/security/rate-limit";

describe("timingSafeEqualStrings", () => {
  it("returns true for identical strings", () => {
    expect(timingSafeEqualStrings("super-secret", "super-secret")).toBe(true);
  });

  it("returns false for different strings of the same length", () => {
    expect(timingSafeEqualStrings("super-secret", "super-wrong!")).toBe(false);
  });

  it("returns false for strings of different lengths without throwing", () => {
    expect(() => timingSafeEqualStrings("short", "a-much-longer-value")).not.toThrow();
    expect(timingSafeEqualStrings("short", "a-much-longer-value")).toBe(false);
  });

  it("returns false when comparing against an empty string", () => {
    expect(timingSafeEqualStrings("", "anything")).toBe(false);
  });
});

describe("checkRateLimit", () => {
  it("allows requests up to the configured max within the window", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const result = checkRateLimit(key, { max: 3, windowMs: 60_000 });
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests once the max is exceeded within the window", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, { max: 3, windowMs: 60_000 });
    }
    const blocked = checkRateLimit(key, { max: 3, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const keyA = `a-${Date.now()}-${Math.random()}`;
    const keyB = `b-${Date.now()}-${Math.random()}`;
    checkRateLimit(keyA, { max: 1, windowMs: 60_000 });
    const blockedA = checkRateLimit(keyA, { max: 1, windowMs: 60_000 });
    const allowedB = checkRateLimit(keyB, { max: 1, windowMs: 60_000 });
    expect(blockedA.allowed).toBe(false);
    expect(allowedB.allowed).toBe(true);
  });
});
