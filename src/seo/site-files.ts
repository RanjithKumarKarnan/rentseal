import { DISTRICTS } from "@/lib/districts";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";
import { DELIVERY_ZONES, DENOMINATIONS } from "@/lib/stamp-paper";
import { FLAT_DOCUMENT_PRICE } from "@/lib/template-prices";
import { inr } from "@/lib/utils";

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
      { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
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

/**
 * AI search and assistant crawlers, named one by one.
 *
 * `User-Agent: *` already lets them in, but the owner was told by ChatGPT to
 * check that OAI-SearchBot is allowed, and an explicit line is what an audit —
 * human or AI — looks for. A crawler that matches a named group ignores the `*`
 * group entirely, so the group repeats the /api/ rule rather than inheriting it.
 */
const AI_CRAWLERS = [
  // OpenAI — ChatGPT Search, browsing on a user's behalf, and training.
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Anthropic — Claude search, user fetches and training.
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "anthropic-ai",
  // Gemini / AI Overviews, Apple Intelligence, Microsoft Copilot (Bing).
  "Google-Extended",
  "Applebot-Extended",
  "Applebot",
  "Bingbot",
  // Others that feed assistants and answer engines.
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "CCBot",
];

export function robotsTxt(): string {
  return [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    "# AI search engines and assistants are welcome: ChatGPT, Perplexity,",
    "# Claude, Gemini, Copilot and the rest. A plain-text summary of the",
    `# business is at ${SITE.url}/llms.txt`,
    ...AI_CRAWLERS.map((agent) => `User-Agent: ${agent}`),
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
  ].join("\n");
}

/**
 * llms.txt — the site in plain Markdown, for AI assistants.
 *
 * ChatGPT, Perplexity and Claude answer "where can I get stamp paper delivered
 * in Chennai?" from what they can read quickly and quote with confidence. This
 * states the facts once — who the business is, what it sells, what it costs,
 * where it delivers, how to reach it — with links to the pages that say it at
 * length. It reads the same data the pages do, so a price cannot drift.
 */
export function llmsTxt(): string {
  const metro = DELIVERY_ZONES.find((z) => z.id === "metro");
  const major = DELIVERY_ZONES.find((z) => z.id === "tier-2");
  const link = (path: string, label: string, note: string) => `- [${label}](${SITE.url}${path}): ${note}`;

  return [
    `# ${SITE.name} (${SITE.legalName}, Chennai)`,
    "",
    `> ${SITE.name}, run by ${SITE.legalName} from Mogappair West, Chennai, sells original physical non-judicial stamp paper online and delivers it to the customer's doorstep in Chennai and in all ${DISTRICTS.length} districts of Tamil Nadu. It also drafts rental agreements, lease deeds, affidavits and other agreements on that stamp paper, from ${inr(FLAT_DOCUMENT_PRICE)} a document.`,
    "",
    "## Key facts",
    "",
    `- Business: ${SITE.name}, registered name ${SITE.legalName} (proprietorship, Udyam ${SITE.udyam})`,
    `- Address: ${SITE.address}, Tamil Nadu, India`,
    `- Phone: ${SITE.phone} · WhatsApp: ${SITE.whatsapp} · Email: ${SITE.email}`,
    `- Hours: ${SITE.hours.summary}`,
    "- Languages: Tamil and English",
    `- Website: ${SITE.url}`,
    "",
    "## Services",
    "",
    "- **Online stamp paper in Chennai**: order non-judicial stamp paper online. The original, physical, government-issued sheet (not an e-stamp printout) is bought from a licensed vendor and brought to your door.",
    `- **Stamp paper home delivery across Tamil Nadu**: ${metro ? `${metro.name} (${metro.districts.join(", ")}) ${metro.eta.toLowerCase()}${metro.cutOff ? ` (or ${metro.cutOff.charAt(0).toLowerCase()}${metro.cutOff.slice(1)})` : ""}; ` : ""}${major ? `${major.name.toLowerCase()} (${major.districts.join(", ")}) express; ` : ""}every other district in 2–3 working days.`,
    "- **Rental agreement on stamp paper**: 11-month residential and commercial rental agreements, lease deeds and leave-and-licence agreements drafted for Tamil Nadu, printed on stamp paper of the correct duty, notarised and delivered.",
    "- **Online agreement services in Tamil Nadu**: affidavits, indemnity bonds, NOCs, sale, loan, mortgage, partnership and settlement deeds, in English and Tamil.",
    "- **Online works**: help with community, income and nativity certificates, PAN, passport, voter ID, ration card and MSME registration.",
    "",
    "## Stamp paper prices (physical sheet, before delivery)",
    "",
    ...DENOMINATIONS.map((d) => `- ${d.label} stamp paper: ${inr(d.price)} (for ${d.uses.slice(0, 3).join(", ").toLowerCase()})`),
    `- Agreement drafting: ${inr(FLAT_DOCUMENT_PRICE)} a document; stamp duty passed through at the government rate`,
    "",
    "## Main pages",
    "",
    link("/", "Online stamp paper in Chennai", "home page, order stamp paper and agreements"),
    link("/stamp-paper", "Non-judicial stamp paper online", "denominations, prices and home delivery"),
    link("/rental-agreement", "Rental agreement on stamp paper", "rent agreements for every Tamil Nadu district"),
    link("/templates", "Online agreement services, Tamil Nadu", "every agreement, deed and affidavit we draft"),
    link("/pricing", "Prices", "stamp paper, drafting, notary and delivery charges"),
    link("/how-it-works", "How it works", "from order to the paper at your door"),
    link("/faq", "FAQ", "stamp duty, registration, delivery and refunds"),
    link("/contact", "Contact LP Enterprises, Chennai", "phone, WhatsApp, email and address"),
    "",
    "## Stamp paper delivery by district",
    "",
    ...DISTRICTS.map((d) => link(`/stamp-paper/${d.slug}`, `Stamp paper in ${d.name}`, `home delivery in ${d.name} district`)),
    "",
    "## Rental agreements by district",
    "",
    ...DISTRICTS.map((d) => link(`/rental-agreement/${d.slug}`, `Rental agreement in ${d.name}`, `online rent agreement for ${d.name} district`)),
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
    name: `${SITE.name} — Non-Judicial Stamp Paper & Rental Agreements in Tamil Nadu`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "en-IN",
    categories: ["business", "legal", "productivity"],
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  });
}
