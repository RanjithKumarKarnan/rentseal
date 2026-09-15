/**
 * The order desk's settings — SMTP and Telegram — as the PHP file
 * public/api/orders.php reads.
 *
 * Shared by the build (scripts/write-orders-config.mjs puts it beside
 * dist/api/orders.php for Hostinger) and `npm run dev` (vite.config.ts hands it
 * to PHP's built-in server), so both send with exactly the same settings.
 */

/** Picks the order desk's settings out of an environment (.env merged with the shell's). */
export function ordersConfig(env) {
  const get = (name) => (env[name] ?? "").trim();
  return {
    smtp_host: get("SMTP_HOST"),
    smtp_port: get("SMTP_PORT") || "465",
    smtp_user: get("SMTP_USER"),
    smtp_pass: get("SMTP_PASS"),
    order_email: get("ORDER_EMAIL"),
    telegram_bot_token: get("TELEGRAM_BOT_TOKEN"),
    telegram_chat_id: get("TELEGRAM_CHAT_ID"),
  };
}

/** A PHP single-quoted string: only the backslash and the quote need escaping. */
const php = (value) => `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

/** The settings as a PHP file that returns them. */
export function ordersConfigPhp(config) {
  return [
    "<?php",
    "// Written from .env by scripts/orders-config.mjs.",
    "// Change .env and rebuild rather than editing this on the server.",
    "return [",
    ...Object.entries(config).map(([key, value]) => `    '${key}' => ${php(value)},`),
    "];",
    "",
  ].join("\n");
}

/** Which of the two channels the settings turn on. */
export function channels(config) {
  return {
    mail: Boolean(config.smtp_host && config.smtp_user && config.smtp_pass),
    telegram: Boolean(config.telegram_bot_token && config.telegram_chat_id),
  };
}
