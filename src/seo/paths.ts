import { TEMPLATE_IDS } from "@/lib/agreement-templates";
import { DISTRICTS } from "@/lib/districts";
import { SERVICES } from "@/lib/services";
import { AGREEMENT_TYPES } from "@/lib/site";

/**
 * Every URL the build writes a page for. Anything not listed here is a 404 on
 * the server — a district or service slug that does not exist, for instance.
 */
export function prerenderPaths(): string[] {
  const paths = [
    "/",
    "/about",
    "/certificates",
    "/contact",
    "/faq",
    "/how-it-works",
    "/legal/privacy",
    "/legal/refund",
    "/legal/terms",
    "/pricing",
    "/rental-agreement",
    "/search",
    "/sitemap",
    "/stamp-paper",
    "/templates",
    "/success",
    "/create",
    ...DISTRICTS.map((d) => `/rental-agreement/${d.slug}`),
    ...DISTRICTS.map((d) => `/stamp-paper/${d.slug}`),
    ...SERVICES.map((s) => `/services/${s.slug}`),
    // The four bare instruments and every template each get a drafting URL.
    ...AGREEMENT_TYPES.map((t) => `/create/${t.id}`),
    ...TEMPLATE_IDS.map((id) => `/create/${id}`),
  ];
  return [...new Set(paths)];
}
