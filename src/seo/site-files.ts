import { DISTRICTS } from "@/lib/districts";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

/*
 * sitemap.xml, robots.txt and manifest.webmanifest — written by the build
 * (scripts/prerender.mjs) into dist/.
 */

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

/**
 * Only indexable routes. The agreement builder at /create is live and linked
 * from the nav, but each of its pages sets robots noindex — a half-filled draft
 * is not a landing page — so it stays out of here.
 *
 * Two location families are generated from DISTRICTS — rental agreement and
 * stamp paper — giving 38 pages each plus their index.
 */
export function sitemap(): SitemapEntry[] {
  // Stamped at build time. A hard-coded date goes stale the day after it is
  // written, and a wrong lastModified is worse than none: a crawler that has
  // been told nothing changed has no reason to come back.
  const lastModified = new Date();

  const staticPages: SitemapEntry[] = (
    [
      { url: SITE.url, changeFrequency: "weekly", priority: 1 },
      { url: `${SITE.url}/rental-agreement`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE.url}/stamp-paper`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE.url}/templates`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE.url}/how-it-works`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE.url}/pricing`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE.url}/faq`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${SITE.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
      { url: `${SITE.url}/certificates`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE.url}/sitemap`, changeFrequency: "monthly", priority: 0.4 },
      { url: `${SITE.url}/legal/terms`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE.url}/legal/privacy`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE.url}/legal/refund`, changeFrequency: "yearly", priority: 0.3 },
    ] satisfies Omit<SitemapEntry, "lastModified">[]
  ).map((page) => ({ ...page, lastModified }));

  const servicePages: SitemapEntry[] = SERVICES.map((service) => ({
    url: `${SITE.url}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  /** Metro and major-city districts rank above the long tail. */
  const priorityFor = (zone: string) => (zone === "state" ? 0.6 : 0.8);

  const rentalPages: SitemapEntry[] = DISTRICTS.map((d) => ({
    url: `${SITE.url}/rental-agreement/${d.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: priorityFor(d.zone),
  }));

  const stampPages: SitemapEntry[] = DISTRICTS.map((d) => ({
    url: `${SITE.url}/stamp-paper/${d.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: priorityFor(d.zone),
  }));

  return [...staticPages, ...servicePages, ...rentalPages, ...stampPages];
}

export function sitemapXml(): string {
  const urls = sitemap().map((entry) =>
    [
      "<url>",
      `<loc>${entry.url}</loc>`,
      `<lastmod>${entry.lastModified.toISOString()}</lastmod>`,
      `<changefreq>${entry.changeFrequency}</changefreq>`,
      `<priority>${entry.priority}</priority>`,
      "</url>",
    ].join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function robotsTxt(): string {
  return [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Host: ${SITE.url}`,
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
  ].join("\n");
}

/**
 * Web app manifest, linked from every page. It gives the site an installable
 * name, a theme colour for the mobile browser chrome, and an icon — the small
 * signals a search engine and a phone both read when they decide how a
 * bookmarked or "add to home screen" site should look.
 */
export function manifestJson(): string {
  return JSON.stringify({
    name: `${SITE.name} — Stamp Paper & Rental Agreements in Tamil Nadu`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "en-IN",
    categories: ["business", "legal", "productivity"],
    icons: [
      { src: "/logo.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "256x256", type: "image/png", purpose: "maskable" },
    ],
  });
}
