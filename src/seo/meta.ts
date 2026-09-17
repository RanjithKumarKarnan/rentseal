import type { Params } from "react-router";
import { SITE } from "@/lib/site";
import { OG_DEFAULT, OG_SIZE, type OgImage } from "./og";

/**
 * The <head> of every page.
 *
 * A page says what it wants in a `meta` export. Whatever it leaves out comes
 * from SITE_META, a whole field at a time: a page that sets its own openGraph
 * gets only its own, not a blend with the site's. That is how the site's
 * metadata has always been resolved (it was built on Next.js, which merges the
 * same way), so every page keeps exactly the tags it had.
 *
 * The build writes these tags into each pre-rendered page; <HeadManager> keeps
 * them in step in the browser as the visitor moves between pages.
 */

export interface Robots {
  index?: boolean;
  follow?: boolean;
  "max-video-preview"?: number;
  "max-image-preview"?: "none" | "standard" | "large";
  "max-snippet"?: number;
}

export interface PageMeta {
  /** Shown as "<title> | LP Stamp Paper". */
  title?: string;
  description?: string;
  keywords?: string[];
  alternates?: { canonical?: string };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
  };
  twitter?: { card?: string; title?: string; description?: string };
  robots?: Robots & { googleBot?: Robots };
}

/** What a route puts in the head: its page's meta, and its own social card if it has one. */
export interface RouteHead {
  meta?: PageMeta | ((params: Params) => PageMeta);
  /**
   * The route's own card. Without one a page shares the site-wide card, unless
   * it sets its own openGraph — see tagsForMatches.
   */
  og?: OgImage | ((params: Params) => OgImage);
  /** The 404 page, which is marked noindex on top of everything else. */
  notFound?: boolean;
}

const SOCIAL_TITLE = `${SITE.name} — Non-judicial stamp paper and rental agreements for Tamil Nadu`;

/** For pages that set no title of their own. */
const DEFAULT_TITLE = `${SITE.name} — Rental Agreement Online in Tamil Nadu | e-Stamp & e-Sign`;

export const SITE_META: PageMeta = {
  description: SITE.description,
  // Google does not read this tag for ranking — the titles, headings and copy
  // carry these phrases where it does look. Kept because other engines and
  // tools still read it.
  keywords: [
    "non judicial stamp paper",
    "non judicial stamp paper online",
    "physical stamp paper",
    "physical stamp paper online",
    "physical stamp paper home delivery",
    "hard copy stamp paper",
    "hard copy stamp paper delivery",
    "original stamp paper",
    "stamp paper online",
    "buy stamp paper online",
    "stamp paper near me",
    "stamp vendor near me",
    "stamp paper price",
    "stamp paper for rent agreement",
    "stamp paper for affidavit",
    "500 rupees stamp paper",
    "e-stamp vs physical stamp paper",
    "buy stamp paper online Tamil Nadu",
    "stamp paper home delivery Chennai",
    "stamp paper online Chennai",
    "100 rupees stamp paper",
    "bond paper Chennai",
    "e-stamp paper Chennai",
    "stamp paper Mogappair",
    "stamp paper Anna Nagar",
    "rent agreement Chennai",
    "online rent agreement Chennai",
    "house rent agreement Tamil Nadu",
    "rent agreement format Tamil Nadu",
    "affidavit Chennai",
    "notary Chennai",
    "முத்திரைத்தாள்",
    "rental agreement online",
    "rental agreement Tamil Nadu",
    "rental agreement Chennai",
    "online rent agreement Coimbatore",
    "e-stamp rental agreement",
    "lease agreement Tamil Nadu",
    "leave and license agreement",
    "commercial rental agreement Chennai",
    "11 month rental agreement",
    "non judicial stamp paper Chennai",
    "non-judicial stamp paper Tamil Nadu",
    "e-stamp paper Tamil Nadu",
    "affidavit format Tamil Nadu",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE.name,
    title: SOCIAL_TITLE,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export type HeadTag =
  | { tag: "title"; text: string }
  | { tag: "meta" | "link"; attrs: Record<string, string> };

/**
 * "/about" → "https://www.lpstamppaper.in/about", "/" → "https://www.lpstamppaper.in/".
 *
 * The home page keeps its slash because that is the address a browser shows and
 * a crawler requests for it. Written without one, SEO checkers compare the two
 * strings and report the home page as canonicalised to another URL.
 */
const absolute = (path: string) => (/^https?:/.test(path) ? path : `${SITE.url}${path}`);

/** "index, follow, max-video-preview:-1, …", in the order crawlers have always been sent it. */
function robotsContent(robots: Robots) {
  const parts: string[] = [];
  if (robots.index !== undefined) parts.push(robots.index ? "index" : "noindex");
  if (robots.follow !== undefined) parts.push(robots.follow ? "follow" : "nofollow");
  for (const key of ["max-video-preview", "max-image-preview", "max-snippet"] as const) {
    if (robots[key] !== undefined) parts.push(`${key}:${robots[key]}`);
  }
  return parts.join(", ");
}

export function headTags(page: PageMeta, og: OgImage | undefined, notFound = false): HeadTag[] {
  const m: PageMeta = { ...SITE_META };
  for (const [key, value] of Object.entries(page)) {
    if (value !== undefined) (m as Record<string, unknown>)[key] = value;
  }

  const tags: HeadTag[] = [];
  const named = (name: string, content: string) => tags.push({ tag: "meta", attrs: { name, content } });
  const property = (prop: string, content: string) =>
    tags.push({ tag: "meta", attrs: { property: prop, content } });

  if (notFound) named("robots", "noindex");
  tags.push({ tag: "title", text: page.title ? `${page.title} | ${SITE.name}` : DEFAULT_TITLE });
  if (m.description) named("description", m.description);
  if (m.keywords?.length) named("keywords", m.keywords.join(","));
  if (m.robots) {
    named("robots", robotsContent(m.robots));
    if (m.robots.googleBot) named("googlebot", robotsContent(m.robots.googleBot));
  }
  if (m.alternates?.canonical) {
    tags.push({ tag: "link", attrs: { rel: "canonical", href: absolute(m.alternates.canonical) } });
  }

  const graph = m.openGraph ?? {};
  if (graph.title) property("og:title", graph.title);
  if (graph.description) property("og:description", graph.description);
  if (graph.url) property("og:url", absolute(graph.url));
  if (graph.siteName) property("og:site_name", graph.siteName);
  if (graph.locale) property("og:locale", graph.locale);
  if (og) {
    property("og:image", absolute(og.path));
    property("og:image:type", "image/png");
    property("og:image:width", String(OG_SIZE.width));
    property("og:image:height", String(OG_SIZE.height));
    if (og.alt) property("og:image:alt", og.alt);
  }
  if (graph.type) property("og:type", graph.type);

  const twitter = m.twitter ?? {};
  if (twitter.card) named("twitter:card", twitter.card);
  if (twitter.title) named("twitter:title", twitter.title);
  if (twitter.description) named("twitter:description", twitter.description);
  if (og) {
    named("twitter:image", absolute(og.path));
    if (og.alt) named("twitter:image:alt", og.alt);
    named("twitter:image:type", "image/png");
    named("twitter:image:width", String(OG_SIZE.width));
    named("twitter:image:height", String(OG_SIZE.height));
  }

  return tags;
}

/** The head for whatever the router matched: the deepest route that says anything about itself. */
export function tagsForMatches(matches: ReadonlyArray<{ handle?: unknown; params: Params }>): HeadTag[] {
  const match = [...matches].reverse().find((m) => m.handle);
  const head = (match?.handle ?? {}) as RouteHead;
  const params = match?.params ?? {};
  const meta = typeof head.meta === "function" ? head.meta(params) : (head.meta ?? {});
  const own = typeof head.og === "function" ? head.og(params) : head.og;
  // A page with no card of its own shares the site-wide one — unless it sets
  // its own openGraph, which replaces the site's whole openGraph block, card
  // included. /templates is the one page like that today, and it has always
  // been shared without an image.
  const og = own ?? (meta.openGraph ? undefined : OG_DEFAULT);
  return headTags(meta, og, head.notFound);
}

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The tags as HTML, for the build to write into a page. Marked so the browser can swap them. */
export function renderHead(tags: HeadTag[]): string {
  return tags
    .map((t) =>
      t.tag === "title"
        ? `<title data-page-meta>${escape(t.text)}</title>`
        : `<${t.tag} ${Object.entries(t.attrs)
            .map(([key, value]) => `${key}="${escape(value)}"`)
            .join(" ")} data-page-meta>`,
    )
    .join("\n    ");
}

/** The same tags, put into the live document when the page changes in the browser. */
export function applyHead(tags: HeadTag[]) {
  document.head.querySelectorAll("[data-page-meta]").forEach((el) => el.remove());
  for (const t of tags) {
    if (t.tag === "title") {
      document.title = t.text;
      continue;
    }
    const el = document.createElement(t.tag);
    for (const [key, value] of Object.entries(t.attrs)) el.setAttribute(key, value);
    el.setAttribute("data-page-meta", "");
    document.head.append(el);
  }
}
