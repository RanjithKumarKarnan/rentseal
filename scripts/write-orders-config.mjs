#!/usr/bin/env node
/**
 * Writes dist/api/orders-config.php — the order desk's credentials — from .env.
 *
 * public/api/orders.php sends the order mail and the Telegram notice from
 * Hostinger, and PHP there cannot see this project's .env files. So the build
 * reads them the way Next does — the shell's environment first, then
 * .env.production.local, .env.local, .env.production and .env — and leaves a
 * PHP file of the values beside orders.php. Uploading dist/ carries it along.
 * public/.htaccess refuses to serve it, and dist/ is ignored by git.
 *
 * Runs as the second half of `npm run build`.
 */
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const root = new URL("../", import.meta.url);

if (!existsSync(new URL("dist/api/orders.php", root))) {
  console.error(
    '[orders] dist/api/orders.php is missing — are output: "export" and distDir: "dist" set in next.config.ts?',
  );
  process.exit(1);
}

nextEnv.loadEnvConfig(fileURLToPath(root), false, { info() {}, error: console.error });

const env = (name) => (process.env[name] ?? "").trim();
const config = {
  smtp_host: env("SMTP_HOST"),
  smtp_port: env("SMTP_PORT") || "465",
  smtp_user: env("SMTP_USER"),
  smtp_pass: env("SMTP_PASS"),
  order_email: env("ORDER_EMAIL"),
  telegram_bot_token: env("TELEGRAM_BOT_TOKEN"),
  telegram_chat_id: env("TELEGRAM_CHAT_ID"),
};

/** A PHP single-quoted string: only the backslash and the quote need escaping. */
const php = (value) => `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

writeFileSync(
  new URL("dist/api/orders-config.php", root),
  [
    "<?php",
    "// Written by scripts/write-orders-config.mjs from .env at build time.",
    "// Change .env and rebuild rather than editing this on the server.",
    "return [",
    ...Object.entries(config).map(([key, value]) => `    '${key}' => ${php(value)},`),
    "];",
    "",
  ].join("\n"),
);

const mail = Boolean(config.smtp_host && config.smtp_user && config.smtp_pass);
const telegram = Boolean(config.telegram_bot_token && config.telegram_chat_id);
console.log(
  `[orders] wrote dist/api/orders-config.php — email ${mail ? "on" : "OFF"}, Telegram ${telegram ? "on" : "OFF"}`,
);
if (!mail && !telegram) {
  console.warn("[orders] neither channel is set, so every order will fail. See docs/order-email.md");
}
