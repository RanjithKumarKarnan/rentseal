import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Built as static files for Hostinger's public_html: `next build` writes the
  // whole site to out/, index.html included, and nothing runs on a server. What
  // used to need one ships beside the pages instead — public/.htaccess has the
  // clean URLs, the old district redirects and the security headers, and
  // public/api/orders.php sends the order mail and Telegram notice.
  output: "export",
  // A stray lockfile in $HOME makes Turbopack guess the wrong root; pin it here.
  turbopack: {
    root: path.resolve("."),
  },
  // There is no server to resize images on request, so they ship as they are.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
