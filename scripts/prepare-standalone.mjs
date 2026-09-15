#!/usr/bin/env node
/**
 * Puts the static assets beside the standalone server.
 *
 * `output: "standalone"` (next.config.ts) traces everything the server needs
 * into .next/standalone, but leaves out public/ and .next/static on the theory
 * that a CDN serves those. This site has no CDN, so without them every page
 * loads with no CSS, no JS and no logo. Copied in, server.js serves them itself.
 *
 * Runs as the second half of `npm run build`.
 */
import { cpSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const standalone = new URL(".next/standalone/", root);

if (!existsSync(standalone)) {
  console.error('[standalone] .next/standalone is missing — is output: "standalone" set in next.config.ts?');
  process.exit(1);
}

cpSync(new URL("public/", root), new URL("public/", standalone), { recursive: true });
cpSync(new URL(".next/static/", root), new URL(".next/static/", standalone), { recursive: true });

console.log("[standalone] copied public/ and .next/static into .next/standalone");
