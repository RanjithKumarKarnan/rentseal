import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { channels, ordersConfig, ordersConfigPhp } from "./scripts/orders-config.mjs";

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

/** A free local port, so PHP never collides with another dev server or project. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address() as AddressInfo;
      probe.close(() => resolve(port));
    });
  });
}

/**
 * Orders in `npm run dev`.
 *
 * The order desk is PHP (public/api/orders.php), and the Vite dev server cannot
 * run PHP — it hands the file back as text. So in development PHP's own
 * built-in server runs it, with the same .env settings the build writes for
 * Hostinger, and Vite forwards the form posts to it. The email and Telegram
 * notice are real. Without PHP on the machine the forms say they could not
 * send, rather than pretend they did.
 */
function ordersInDev(env: Record<string, string>): Plugin {
  let port = 0;
  return {
    name: "lp-orders-dev",
    apply: "serve",
    async config() {
      port = await freePort();
      return { server: { proxy: { "/api/orders.php": `http://127.0.0.1:${port}` } } };
    },
    configureServer(server) {
      const log = server.config.logger;
      const config = ordersConfig(env);
      const { mail, telegram } = channels(config);

      // Outside the source tree, readable only by this user, and deleted when
      // the dev server stops. orders.php finds it through ORDERS_CONFIG.
      const dir = mkdtempSync(path.join(tmpdir(), "lp-orders-"));
      const file = path.join(dir, "orders-config.php");
      writeFileSync(file, ordersConfigPhp(config), { mode: 0o600 });

      const php = spawn("php", ["-S", `127.0.0.1:${port}`, "-t", "public"], {
        env: { ...process.env, ORDERS_CONFIG: file },
        stdio: ["ignore", "ignore", "pipe"],
      });
      php.on("error", () =>
        log.warn(
          "[orders] PHP is not installed, so the forms cannot send from `npm run dev` (brew install php). The built site is unaffected.",
        ),
      );
      // PHP's error_log() lines — [mail], [telegram], [orders] — and its own failures.
      php.stderr?.on("data", (chunk: Buffer) => {
        for (const line of String(chunk).split("\n")) {
          if (/\[(mail|telegram|orders)\]|PHP (Fatal|Parse|Warning)|Failed to listen/.test(line)) {
            log.info(line.trim());
          }
        }
      });
      log.info(
        `[orders] forms send through PHP on :${port} — email ${mail ? "on" : "OFF"}, Telegram ${telegram ? "on" : "OFF"}`,
      );

      const stop = () => {
        php.kill();
        rmSync(dir, { recursive: true, force: true });
      };
      server.httpServer?.once("close", stop);
      process.once("exit", stop);
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      analytics(process.env.NEXT_PUBLIC_GA_ID || env.NEXT_PUBLIC_GA_ID),
      ordersInDev({ ...env, ...process.env } as Record<string, string>),
    ],
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
