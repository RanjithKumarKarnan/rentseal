#!/usr/bin/env node
/**
 * Tells Bing, Yandex, Seznam and Naver about every page at once (IndexNow).
 *
 * ChatGPT Search and Microsoft Copilot answer largely from Bing's index, so a
 * page Bing has not crawled is a page ChatGPT cannot recommend. Run this after
 * a deploy has gone live:
 *
 *   npm run indexnow
 *
 * It reads the live sitemap, so it submits exactly what is published. The key
 * is public by design — IndexNow checks it at https://www.lpstamppaper.in/<key>.txt
 * (public/<key>.txt here) to prove the submitter owns the site.
 */
const SITE = "https://www.lpstamppaper.in";
const KEY = "f80077aac7e4420b8f0b38ffe88ec11e";

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap.xml: HTTP ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
urlList.push(`${SITE}/llms.txt`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});
// 200 = accepted, 202 = accepted and the key is still being checked.
console.log(`[indexnow] submitted ${urlList.length} URLs → HTTP ${res.status} ${await res.text()}`);
if (res.status >= 300) process.exit(1);
