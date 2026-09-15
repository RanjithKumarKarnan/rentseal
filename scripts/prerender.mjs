#!/usr/bin/env node
/**
 * Writes a finished HTML file for every page.
 *
 * The site is plain files on Hostinger, and search engines and link previews
 * (WhatsApp, Facebook) read the HTML they are sent — so every page is built as
 * a complete document, not an empty shell for JavaScript to fill. The browser
 * then takes the page over (React hydrates it) and navigation from there is
 * instant.
 *
 * `vite build` leaves the browser bundle and dist/index.html, which is the
 * template. `vite build --ssr` leaves a Node build of the same app in
 * dist-ssr/. This renders each URL with that, fills the template, and writes
 * sitemap.xml, robots.txt, the web manifest and the social cards beside the
 * pages. dist-ssr/ is deleted afterwards; nothing from it is uploaded.
 *
 * Runs as part of `npm run build`.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

// React and the rest load their production builds, as they do in the browser.
process.env.NODE_ENV ??= "production";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const server = await import(new URL("dist-ssr/entry-server.js", root).href);
const template = readFileSync(new URL("index.html", dist), "utf8");

if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
  console.error("[prerender] dist/index.html is missing the <!--app-head--> / <!--app-html--> markers");
  process.exit(1);
}

function write(file, content) {
  const target = new URL(file, dist);
  mkdirSync(new URL("./", target), { recursive: true });
  writeFileSync(target, content);
}

const page = ({ head, html }) =>
  template.replace("<!--app-head-->", head).replace("<!--app-html-->", html);

/** /create has no page of its own: it sends visitors on to the catalogue. */
const redirectPage = (to) =>
  `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${to}"><title>LP Stamp Paper</title></head><body><a href="${to}">Continue to ${to}</a></body></html>\n`;

// /about → about.html, the layout the site has always had on the server;
// public/.htaccess serves it at /about.
const fileFor = (path) => (path === "/" ? "index.html" : `${path.slice(1)}.html`);

const paths = server.prerenderPaths();
for (const path of paths) {
  const result = await server.render(path);
  write(fileFor(path), "redirect" in result ? redirectPage(result.redirect) : page(result));
}
write("404.html", page(await server.render("/404")));

write("sitemap.xml", server.sitemapXml());
write("robots.txt", server.robotsTxt());
write("manifest.webmanifest", server.manifestJson());

const cards = server.ogCards();
for (const card of cards) {
  write(card.path.slice(1), Buffer.from(await card.image().arrayBuffer()));
}

rmSync(new URL("dist-ssr/", root), { recursive: true, force: true });
console.log(
  `[prerender] wrote ${paths.length} pages, 404.html, sitemap.xml, robots.txt, manifest.webmanifest and ${cards.length} social cards`,
);
