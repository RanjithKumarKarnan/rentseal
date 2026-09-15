#!/usr/bin/env node
/**
 * Writes dist/api/orders-config.php — the order desk's credentials — from .env.
 *
 * public/api/orders.php sends the order mail and the Telegram notice from
 * Hostinger, and PHP there cannot see this project's .env files. So the build
 * reads them — the shell's environment first, then .env.production.local,
 * .env.local, .env.production and .env, the order Vite reads them in — and
 * leaves a PHP file of the values beside orders.php. Uploading dist/ carries it
 * along. public/.htaccess refuses to serve it, and dist/ is ignored by git.
 *
 * Runs as the last step of `npm run build`.
 */
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { channels, ordersConfig, ordersConfigPhp } from "./orders-config.mjs";

const root = new URL("../", import.meta.url);

if (!existsSync(new URL("dist/api/orders.php", root))) {
  console.error("[orders] dist/api/orders.php is missing — did `vite build` run first?");
  process.exit(1);
}

const config = ordersConfig({ ...loadEnv("production", fileURLToPath(root), ""), ...process.env });
writeFileSync(new URL("dist/api/orders-config.php", root), ordersConfigPhp(config));

const { mail, telegram } = channels(config);
console.log(
  `[orders] wrote dist/api/orders-config.php — email ${mail ? "on" : "OFF"}, Telegram ${telegram ? "on" : "OFF"}`,
);
if (!mail && !telegram) {
  console.warn("[orders] neither channel is set, so every order will fail. See docs/order-email.md");
}
