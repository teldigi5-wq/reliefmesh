/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    // Baseline hardening headers on every route. Deliberately no
    // Content-Security-Policy here: Leaflet and Recharts inject inline
    // styles, and a CSP tight enough to matter needs to be tuned against
    // the running app rather than guessed at — add one once there's a
    // browser to verify it against.
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
