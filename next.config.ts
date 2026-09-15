import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Runs as a Node server, not a folder of static files: /api/orders sends the
  // order mail and Telegram notice, and the redirects and headers below need a
  // server too. `standalone` bundles one into .next/standalone/server.js, and
  // scripts/prepare-standalone.mjs copies the assets in beside it after a build.
  output: "standalone",
  // A stray lockfile in $HOME makes Turbopack guess the wrong root; pin it here.
  turbopack: {
    root: path.resolve("."),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
  /**
   * The location pages moved from a mixed city/district list to the 38 official
   * districts. These two slugs were towns, not districts — keep the old URLs
   * alive so nothing already indexed 404s.
   */
  async redirects() {
    const moved: Array<[string, string]> = [
      ["trichy", "tiruchirappalli"],
      ["hosur", "krishnagiri"],
      ["ooty", "nilgiris"],
      ["nagercoil", "kanyakumari"],
      ["karaikudi", "sivaganga"],
      ["villupuram", "viluppuram"],
      ["kanchipuram", "kancheepuram"],
      ["tirupattur", "tirupathur"],
    ];
    return moved.flatMap(([from, to]) => [
      { source: `/rental-agreement/${from}`, destination: `/rental-agreement/${to}`, permanent: true },
      { source: `/stamp-paper/${from}`, destination: `/stamp-paper/${to}`, permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
