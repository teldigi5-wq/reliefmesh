/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    // Baseline hardening headers on every route, plus a CSP scoped to what
    // this app actually loads:
    //  - script-src: 'self' for all bundled/webpack-loaded scripts, plus a
    //    hash allowlisting the one static inline script in layout.tsx (the
    //    pre-hydration dark-mode flash guard). No 'unsafe-inline' for
    //    scripts — that's the directive that actually matters for XSS.
    //  - style-src: needs 'unsafe-inline' because Leaflet (map.tsx,
    //    sos-map.tsx) and Recharts both set inline style="" attributes
    //    directly via JS, not through this app's own stylesheets. There's
    //    no practical hash/nonce option for third-party libraries doing
    //    that, so this is a deliberate, scoped exception — not a blanket
    //    "unsafe-inline" on everything.
    //  - img-src: 'self' plus OpenStreetMap's tile servers, which both map
    //    components load tiles from directly.
    //  - connect-src: 'self' only — the Nominatim geocoding calls go
    //    through this app's own /api/geo/* proxy, never hit from the
    //    browser directly.
    // Verify against the real app after deploying (browser console shows
    // any CSP violation immediately) — this was written against what the
    // code imports, not tested in a live browser from here.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'sha256-MJIF6Dq3OeA0sDwXxCTAXN7sK2uVohQTgggZoXhBBjM='",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.tile.openstreetmap.org",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

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
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
