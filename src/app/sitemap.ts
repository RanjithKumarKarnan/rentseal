import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { DISTRICTS } from "@/lib/districts";
import { SITE } from "@/lib/site";

/**
 * Only indexable routes. The agreement builder at /create is live and linked
 * from the nav, but each of its pages sets robots noindex — a half-filled draft
 * is not a landing page — so it stays out of here. The calculator and account
 * pages under src/app/_disabled are not built at all.
 *
 * Two location families are generated from DISTRICTS — rental agreement and
 * stamp paper — giving 38 pages each plus their index.
 */
// Written to a file at build time; a static site has no server to answer it on request.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stamped at build time. A hard-coded date goes stale the day after it is
  // written, and a wrong lastModified is worse than none: a crawler that has
  // been told nothing changed has no reason to come back.
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = (
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
    ] satisfies MetadataRoute.Sitemap
  ).map((page) => ({ ...page, lastModified }));

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE.url}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  /** Metro and major-city districts rank above the long tail. */
  const priorityFor = (zone: string) => (zone === "state" ? 0.6 : 0.8);

  const rentalPages: MetadataRoute.Sitemap = DISTRICTS.map((d) => ({
    url: `${SITE.url}/rental-agreement/${d.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: priorityFor(d.zone),
  }));

  const stampPages: MetadataRoute.Sitemap = DISTRICTS.map((d) => ({
    url: `${SITE.url}/stamp-paper/${d.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: priorityFor(d.zone),
  }));

  return [...staticPages, ...servicePages, ...rentalPages, ...stampPages];
}
