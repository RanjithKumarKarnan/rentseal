import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * GA4, only when a Measurement ID is set. It is read from NEXT_PUBLIC_GA_ID,
 * the name the site has always used, so no .env or host setting has to change.
 * Send GA4 through EITHER this tag OR a GA4 tag inside GTM, never both, or every
 * hit is counted twice.
 */
function analytics(id: string | undefined): Plugin {
  return {
    name: "lp-analytics",
    transformIndexHtml(html) {
      if (!id || !/^G-[A-Z0-9]+$/.test(id)) return html;
      const tags = [
        `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
        `<script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');</script>`,
      ];
      return html.replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), analytics(process.env.NEXT_PUBLIC_GA_ID || env.NEXT_PUBLIC_GA_ID)],
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
    server: { port: 3011 },
    // The social-card renderer loads its fonts and WebAssembly from disk, so
    // the Node build leaves it to be imported from node_modules as it is.
    ssr: { external: ["@vercel/og"] },
    // The browser build goes to dist/ — the folder the deploy uploads. The Node
    // build of the same app (`vite build --ssr`) exists only so
    // scripts/prerender.mjs can render each page, and is deleted after.
    build: isSsrBuild
      ? { outDir: "dist-ssr", copyPublicDir: false }
      : {
          outDir: "dist",
          // The one large chunk is the PDF renderer (~1.2 MB), which is fetched
          // only when someone sends a drafted agreement.
          chunkSizeWarningLimit: 1300,
        },
  };
});
