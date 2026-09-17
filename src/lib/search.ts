import { DISTRICTS, NOTABLE_TOWNS, ZONE_META } from "./districts";
import { SERVICES } from "./services";
import { DENOMINATIONS } from "./stamp-paper";
import { FAQS } from "./site";

/**
 * Search over the whole site, built from the same data the pages render.
 *
 * There is no backend and no search service — the index is assembled at module
 * load from DISTRICTS, SERVICES, DENOMINATIONS and FAQS, so it can never drift
 * out of step with what is actually published. Add a district and it becomes
 * searchable in the same commit.
 */

export type DocKind = "District" | "Agreement" | "Non-judicial stamp paper" | "Page" | "Question";

export interface SearchDoc {
  id: string;
  title: string;
  href: string;
  kind: DocKind;
  description: string;
  /** Alternate spellings, town names and anything else worth matching on. */
  keywords: string[];
}

export interface SearchResult extends SearchDoc {
  score: number;
}

/* ─────────────────────────── Static pages ─────────────────────────── */

const PAGES: SearchDoc[] = [
  {
    id: "page-home",
    title: "Home",
    href: "/",
    kind: "Page",
    description:
      "Non-judicial stamp paper and rental agreements delivered across all 38 districts of Tamil Nadu.",
    keywords: ["lp", "lp stamp paper", "home", "start", "order"],
  },
  {
    id: "page-rental-index",
    title: "Rental agreements by district",
    href: "/rental-agreement",
    kind: "Page",
    description: "Every district in Tamil Nadu, grouped by region, with local SRO details.",
    keywords: ["districts", "coverage", "locations", "rental agreement", "city"],
  },
  {
    id: "page-stamp-index",
    title: "Non-judicial stamp paper by district",
    href: "/stamp-paper",
    kind: "Page",
    description: "Non-judicial paper and e-Stamp certificates delivered across the state.",
    keywords: ["districts", "delivery", "coverage", "stamp paper", "non-judicial stamp paper", "non judicial", "e-stamp", "estamp",
               "physical stamp paper", "hard copy stamp paper", "hardcopy", "original stamp paper", "bond paper",
               "stamp paper near me", "stamp vendor", "home delivery"],
  },
  {
    id: "page-pricing",
    title: "Pricing",
    href: "/pricing",
    kind: "Page",
    description: "Every deed priced individually from ₹300, on Basic, Standard or Premium — what each plan adds.",
    keywords: ["price", "cost", "plans", "fees", "charges", "how much", "300", "350", "400"],
  },
  {
    id: "page-how",
    title: "How it works",
    href: "/how-it-works",
    kind: "Page",
    description: "Every step between your first click and a signed, e-stamped agreement.",
    keywords: ["process", "steps", "procedure", "timeline", "how long", "esign", "aadhaar"],
  },
  {
    id: "page-faq",
    title: "Frequently asked questions",
    href: "/faq",
    kind: "Page",
    description: "Non-judicial stamp paper, delivery, legal validity, stamp duty, process, refunds.",
    keywords: ["faq", "questions", "help", "support", "doubts"],
  },
  {
    id: "page-about",
    title: "About LP Stamp Paper",
    href: "/about",
    kind: "Page",
    description: "Why we started, what we believe, and who is behind the company.",
    keywords: ["about", "company", "team", "story", "who"],
  },
  {
    id: "page-certificates",
    title: "Certificates and registrations",
    href: "/certificates",
    kind: "Page",
    description: "PAN, voter ID, ration card, passport, community, income, nativity, OBC and MSME — fees and the documents to bring.",
    keywords: ["certificate", "pan", "voter id", "ration card", "passport", "community", "income",
               "nativity", "obc", "msme", "udyam", "widow", "unmarried", "nativity", "epic"],
  },
  {
    id: "page-create",
    title: "Create an agreement",
    href: "/create",
    kind: "Page",
    description: "The seven-step drafter — answer the questions and the deed writes itself.",
    keywords: ["create", "draft", "make", "build", "new", "start", "agreement", "online"],
  },
  {
    id: "page-sitemap",
    title: "Site map",
    href: "/sitemap",
    kind: "Page",
    description: "Every page on LP Stamp Paper, grouped by what you are trying to do.",
    keywords: ["site map", "sitemap", "index", "all pages", "navigation", "where"],
  },
  {
    id: "page-contact",
    title: "Contact and support",
    href: "/contact",
    kind: "Page",
    description: "Phone, WhatsApp and email in Tamil and English, Monday to Saturday 9.30am to 5pm.",
    keywords: ["contact", "phone", "call", "whatsapp", "email", "support", "help", "tamil"],
  },
  {
    id: "page-terms",
    title: "Terms of service",
    href: "/legal/terms",
    kind: "Page",
    description: "The terms you agree to when you use LP Stamp Paper.",
    keywords: ["terms", "legal", "conditions", "disclaimer"],
  },
  {
    id: "page-privacy",
    title: "Privacy policy",
    href: "/legal/privacy",
    kind: "Page",
    description: "What we collect, why, and how Aadhaar and PAN are protected.",
    keywords: ["privacy", "data", "aadhaar", "pan", "security", "encryption"],
  },
  {
    id: "page-refund",
    title: "Refund policy",
    href: "/legal/refund",
    kind: "Page",
    description: "Full refund before the e-stamp is procured; government duty is not refundable.",
    keywords: ["refund", "cancel", "cancellation", "money back"],
  },
];

/* ─────────────────────────── Index assembly ─────────────────────────── */

function buildIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [...PAGES];

  for (const d of DISTRICTS) {
    // Towns that are not districts still need to find their parent district.
    const aliases = NOTABLE_TOWNS.filter((t) => t.slug === d.slug).map((t) => t.town);
    const localNames = [...d.towns, ...d.sroTowns, d.hq, ...aliases];
    const zone = ZONE_META[d.zone];

    docs.push({
      id: `rental-${d.slug}`,
      title: `Rental agreement in ${d.name}`,
      href: `/rental-agreement/${d.slug}`,
      kind: "District",
      description: `${d.sroTowns.length} Sub-Registrar Offices · ${d.region}`,
      keywords: [
        d.name,
        d.slug,
        ...localNames,
        "rental agreement",
        "rent agreement",
        "lease",
        "tenancy",
        "11 month",
        d.region,
      ],
    });

    docs.push({
      id: `stamp-${d.slug}`,
      title: `Non-judicial stamp paper in ${d.name}`,
      href: `/stamp-paper/${d.slug}`,
      kind: "District",
      description: `${zone.eta} delivery · ₹${zone.charge} · ${d.region}`,
      keywords: [
        d.name,
        d.slug,
        ...localNames,
        "stamp paper",
        "e-stamp",
        "estamp",
        "non judicial",
        "bond paper",
        "physical stamp paper",
        "hard copy",
        d.region,
      ],
    });
  }

  for (const s of SERVICES) {
    docs.push({
      id: `service-${s.slug}`,
      title: s.name,
      href: `/services/${s.slug}`,
      kind: "Agreement",
      description: s.intro,
      keywords: [s.name, s.slug, s.id, ...s.clauses.slice(0, 8)],
    });
  }

  for (const d of DENOMINATIONS) {
    docs.push({
      id: `denom-${d.value}`,
      title: `${d.label} non-judicial stamp paper`,
      href: "/stamp-paper",
      kind: "Non-judicial stamp paper",
      description:
        d.price === null ? d.uses.join(" · ") : `${d.price} rupees a sheet · ${d.uses.join(" · ")}`,
      keywords: [
        d.label,
        `${d.value}`,
        `rs ${d.value}`,
        `₹${d.value}`,
        `${d.value} rupee`,
        "stamp paper",
        "non judicial",
        "denomination",
        ...(d.value > 0 ? ["physical stamp paper", "hard copy"] : ["e-stamp", "estamp"]),
        ...d.uses,
      ],
    });
  }

  FAQS.forEach((f, i) => {
    docs.push({
      id: `faq-${i}`,
      title: f.q,
      href: "/faq",
      kind: "Question",
      description: f.a.slice(0, 150) + (f.a.length > 150 ? "…" : ""),
      keywords: [f.category, ...f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 3)],
    });
  });

  return docs;
}

export const SEARCH_INDEX: SearchDoc[] = buildIndex();

/* ─────────────────────────── Query ─────────────────────────── */

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[₹.,'"()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenise = (s: string) => normalise(s).split(" ").filter(Boolean);

/**
 * Words that carry no signal in a query like "how much does it cost".
 * They still count if the query is nothing but stopwords, so "how it works"
 * does not become an empty search.
 */
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "does", "for",
  "from", "get", "how", "i", "in", "is", "it", "many", "me", "much", "my", "of",
  "on", "or", "the", "to", "want", "what", "when", "where", "which", "who",
  "will", "with", "you", "your",
]);

/** Drop stopwords unless that would leave nothing to search on. */
function contentTokens(tokens: string[]): string[] {
  const kept = tokens.filter((t) => !STOPWORDS.has(t));
  return kept.length > 0 ? kept : tokens;
}

/** Questions rank below places and services unless the query is clearly a question. */
const KIND_WEIGHT: Record<DocKind, number> = {
  District: 1,
  Agreement: 1,
  "Non-judicial stamp paper": 0.95,
  Page: 0.9,
  Question: 0.7,
};

interface IndexedDoc {
  doc: SearchDoc;
  title: string;
  keywords: string[];
  description: string;
  /** Every distinct term in the document, for rarity weighting. */
  terms: Set<string>;
}

const INDEXED: IndexedDoc[] = SEARCH_INDEX.map((doc) => {
  const title = normalise(doc.title);
  const keywords = doc.keywords.map(normalise);
  const description = normalise(doc.description);
  return {
    doc,
    title,
    keywords,
    description,
    terms: new Set([...tokenise(title), ...keywords.flatMap(tokenise), ...tokenise(description)]),
  };
});

/**
 * Document frequency per term.
 *
 * Without this, "stamp paper" scored a direct keyword hit on all 38 stamp paper
 * district pages, so searching "100 stamp paper" or "stamp duty" buried the
 * denomination and the duty answer under a wall of districts. Terms that appear
 * in most documents now carry almost no weight, and rare ones — a district name,
 * "deed", "duty", "refund" — decide the ranking.
 */
const DOC_FREQUENCY = new Map<string, number>();
for (const entry of INDEXED) {
  for (const term of entry.terms) {
    DOC_FREQUENCY.set(term, (DOC_FREQUENCY.get(term) ?? 0) + 1);
  }
}

const TOTAL_DOCS = INDEXED.length;

/** Rarity of a term, 0.2 for near-universal terms up to ~5 for a unique one. */
function idf(term: string): number {
  const df = DOC_FREQUENCY.get(term) ?? 0;
  return Math.max(0.2, Math.log((TOTAL_DOCS + 1) / (df + 1)));
}

/** How informative a multi-word phrase is — driven by its rarest word. */
const phraseWeight = (tokens: string[]) =>
  tokens.length ? Math.max(...tokens.map(idf)) : 0.2;

function scoreDoc(entry: IndexedDoc, query: string, tokens: string[]): number {
  const { title, keywords, description } = entry;
  const weight = phraseWeight(tokens);

  let score = 0;

  // Whole-query matches, scaled by how much the phrase actually narrows things.
  if (title === query) score += 400;
  else if (title.startsWith(query)) score += 150 * weight;
  else if (title.includes(query)) score += 90 * weight;

  if (keywords.some((k) => k === query)) score += 120 * weight;
  else if (keywords.some((k) => k.startsWith(query))) score += 55 * weight;
  else if (keywords.some((k) => k.includes(query))) score += 25 * weight;

  if (description.includes(query)) score += 15 * weight;

  // Per-token, each weighted by rarity.
  let matched = 0;
  for (const t of tokens) {
    const w = idf(t);
    let hit = 0;
    if (title === t) hit += 60;
    else if (title.split(" ").includes(t)) hit += 30;
    else if (title.includes(t)) hit += 14;

    if (keywords.some((k) => k === t)) hit += 26;
    else if (keywords.some((k) => k.split(" ").includes(t))) hit += 14;
    else if (keywords.some((k) => k.includes(t))) hit += 6;

    if (description.includes(t)) hit += 5;

    if (hit > 0) matched += 1;
    score += hit * w;
  }

  if (matched === 0) return 0;
  // A query where only some words land is a much weaker match than one where
  // all of them do.
  if (tokens.length > 1) score *= matched / tokens.length;

  return score * KIND_WEIGHT[entry.doc.kind];
}

export function search(rawQuery: string, limit = 8): SearchResult[] {
  const query = normalise(rawQuery);
  if (query.length < 2) return [];
  const tokens = contentTokens(query.split(" ").filter(Boolean));

  const scored = INDEXED.map((entry) => ({
    ...entry.doc,
    score: scoreDoc(entry, query, tokens),
  })).filter((r) => r.score > 0);

  if (scored.length === 0) return [];

  // Drop the long tail of documents that merely share a common word with the
  // query — otherwise every district shows up for "stamp duty".
  const best = Math.max(...scored.map((r) => r.score));
  const floor = best * 0.22;

  return scored
    .filter((r) => r.score >= floor)
    .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
    .slice(0, limit);
}

/** Shown in the empty state of the search dialog. */
export const POPULAR_SEARCHES = [
  "Rental agreement in Chennai",
  "Non-judicial stamp paper in Coimbatore",
  "₹100 non-judicial stamp paper",
  "Physical stamp paper",
  "Hosur",
  "Stamp duty",
  "Pricing",
] as const;
