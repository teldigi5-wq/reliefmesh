/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    // Baseline hardening headers on every route. Deliberately no
    // Content-Security-Policy here: a sha256-hash-based script-src broke
    // client-side hydration site-wide, because Next.js App Router streams
    // each page's RSC payload into the browser via its own per-request
    // inline <script> tags (self.__next_f.push(...)) — those aren't
    // static, so they can't be hash-allowlisted, and a static hash list
    // blocks all of them. A CSP that doesn't break the app needs a
    // request-scoped nonce threaded through middleware.ts (which this app
    // doesn't have) and real browser testing before it ships again — not
    // something to guess at a second time two days before judging.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), payment=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
