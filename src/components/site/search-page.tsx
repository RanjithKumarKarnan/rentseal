import Link from "@/components/ui/link";
import { useSearchParams } from "react-router";
import { useHydrated } from "@/lib/use-hydrated";
import { ArrowRight, MapPin, Search as SearchIcon } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/ui/motion";
import { DISTRICTS } from "@/lib/districts";
import { POPULAR_SEARCHES, search, type DocKind, type SearchResult } from "@/lib/search";
import { SITE } from "@/lib/site";

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Search" }];

const KIND_ORDER: DocKind[] = ["District", "Agreement", "Non-judicial stamp paper", "Page", "Question"];

const KIND_STYLE: Record<DocKind, string> = {
  District: "bg-brand-50 text-brand-700 border-brand-200/80",
  Agreement: "bg-violet-50 text-violet-700 border-violet-200/80",
  "Non-judicial stamp paper": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Page: "bg-navy-100 text-navy-600 border-line",
  Question: "bg-amber-50 text-amber-700 border-amber-200/80",
};

function ResultRow({ r }: { r: SearchResult }) {
  return (
    <li>
      <Link
        href={r.href}
        className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
      >
        <span
          className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border ${KIND_STYLE[r.kind]}`}
        >
          {r.kind === "District" ? <MapPin className="size-4" /> : <SearchIcon className="size-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[16px] font-bold text-navy-950">{r.title}</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ${KIND_STYLE[r.kind]}`}
            >
              {r.kind}
            </span>
          </span>
          <span className="mt-1 block text-[14px] leading-relaxed text-navy-500">
            {r.description}
          </span>
          <span className="mt-2 block text-[12.5px] text-navy-400">{r.href}</span>
        </span>
        <ArrowRight className="mt-1 size-4 shrink-0 text-navy-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600" />
      </Link>
    </li>
  );
}

/**
 * The query lives in the URL, and a static site has no server to read it on,
 * so the results are worked out here in the browser.
 */
export function SearchFromUrl() {
  const [params] = useSearchParams();
  // Empty until hydrated: the build wrote this page without a query, and the
  // first render in the browser has to match that HTML.
  const query = useHydrated() ? (params.get("q") ?? "").trim() : "";
  return <SearchView query={query} />;
}

export function SearchView({ query }: { query: string }) {
  const results = query.length > 1 ? search(query, 40) : [];

  // Groups are ordered by their best-scoring member, not by a fixed kind order —
  // otherwise a query like "₹20 stamp paper" buried the denomination under every
  // district that merely shares the words "stamp paper".
  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: results.filter((r) => r.kind === kind),
  }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.items[0].score - a.items[0].score);

  return (
    <>
      <PageHero
        eyebrow="Search"
        icon={SearchIcon}
        crumbs={CRUMBS}
        title={query ? `Results for “${query}”` : "Search LP Stamp Paper"}
        body={
          query
            ? `${results.length} ${results.length === 1 ? "match" : "matches"} across districts, agreement types, non-judicial stamp paper and help articles.`
            : `Find a district, an agreement type, a denomination or an answer — across all ${DISTRICTS.length} districts of Tamil Nadu.`
        }
      >
        {/* A plain GET form, so the page can be linked to directly. */}
        <form action="/search" method="get" role="search" className="w-full max-w-xl">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white p-1.5 shadow-card focus-within:border-brand-400">
            <SearchIcon className="ml-2.5 size-[18px] shrink-0 text-navy-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Chennai, lease deed, ₹100 non-judicial stamp paper…"
              aria-label="Search LP Stamp Paper"
              className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-navy-950 outline-none placeholder:text-navy-400"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-lg bg-brand-600 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Search
            </button>
          </div>
        </form>
      </PageHero>

      <section className="section">
        <div className="container-page">
          {!query ? (
            <Reveal>
              <div className="rounded-2xl border border-line bg-white p-7 sm:p-9">
                <p className="text-[13px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                  Popular searches
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {POPULAR_SEARCHES.map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="rounded-full border border-line bg-canvas px-4 py-2.5 text-[14px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:bg-white hover:text-brand-700"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
                  <Link
                    href="/rental-agreement"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                  >
                    Browse all {DISTRICTS.length} districts
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                  >
                    Read the FAQ
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : results.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-line bg-white p-9 text-center">
                <h2 className="font-display text-[20px] font-bold text-navy-950">
                  Nothing matched “{query}”
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-navy-500">
                  Try a district or town name, an agreement type, or a denomination — for example
                  Madurai, Hosur, lease deed or ₹100.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="rounded-full border border-line bg-canvas px-4 py-2.5 text-[13.5px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:bg-white hover:text-brand-700"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand-700 underline underline-offset-4"
                >
                  Ask us instead
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="space-y-12">
              {grouped.map((group) => (
                <div key={group.kind}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                    <h2 className="font-display text-[18px] font-bold text-navy-950">
                      {group.kind === "District"
                        ? "Districts"
                        : group.kind === "Question"
                          ? "Questions"
                          : group.kind === "Page"
                            ? "Pages"
                            : group.kind}
                    </h2>
                    <span className="tnum shrink-0 text-[13px] font-semibold text-navy-400">
                      {group.items.length}
                    </span>
                  </div>
                  <ul className="mt-5 grid gap-3">
                    {group.items.map((r) => (
                      <ResultRow key={r.id} r={r} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
