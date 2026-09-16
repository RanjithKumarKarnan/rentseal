import { useMemo, useState } from "react";
import { LayoutGrid, Search, X } from "lucide-react";
import { PageHero, type Crumb } from "@/components/site/page-hero";
import { TemplateLibrary } from "./template-library";
import { TEMPLATES } from "@/lib/templates";
import { TAMIL_TEMPLATE_IDS } from "@/lib/tamil-templates";

/**
 * The catalogue, with its search.
 *
 * The hero used to carry a Start drafting button, which sent people to a second
 * grid of the same fifty-five documents one route away — the page they were
 * already on. What is actually hard here is not starting, it is finding: the
 * list is long enough that "godown", "affidavit" or "ஜாமீன்" is a faster way in
 * than scrolling nine categories.
 *
 * The field and the grid share a component because they share the query. It
 * costs nothing: the catalogue is a static list compiled into the bundle, so
 * filtering is a substring test over fifty-five rows and needs no request.
 */

const ENGLISH_COUNT = TEMPLATES.length - TAMIL_TEMPLATE_IDS.length;

const CRUMBS: Crumb[] = [{ label: "Home", href: "/" }, { label: "Templates" }];

export function TemplateCatalogue() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  // Name, description, category and term all searched together, so "11 months",
  // "warehouse" and "Tamil" each find something. Tamil deeds are matched on
  // their Tamil name because that is the name they are listed under.
  const results = useMemo(() => {
    if (!term) return TEMPLATES;
    return TEMPLATES.filter((t) =>
      `${t.name} ${t.description} ${t.category} ${t.term}`.toLowerCase().includes(term),
    );
  }, [term]);

  return (
    <>
      <PageHero
        eyebrow="Template library"
        icon={LayoutGrid}
        crumbs={CRUMBS}
        title={`${ENGLISH_COUNT} agreement and affidavit formats, and ${TAMIL_TEMPLATE_IDS.length} Tamil deeds`}
        body="Every document here is a Tamil Nadu compliant draft — lettings, leases, sale deeds, business contracts, affidavits and the office’s own Tamil deeds. Search for the one that matches your situation and the right clauses come with it."
      >
        <div className="max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-navy-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — rent, warehouse, affidavit, loan, ஜாமீன்…"
              aria-label={`Search ${TEMPLATES.length} agreement and deed templates`}
              className="h-[58px] w-full rounded-2xl border border-line bg-white pr-12 pl-12 text-[15.5px] text-navy-950 shadow-soft transition-colors outline-none placeholder:text-navy-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear the search"
                className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <p className="mt-3 text-[13.5px] text-navy-500" aria-live="polite">
            {term
              ? `${results.length} of ${TEMPLATES.length} documents match “${query.trim()}”.`
              : `Or browse all ${TEMPLATES.length} below — lettings, leases, sale, business contracts, deeds, affidavits and Tamil.`}
          </p>
        </div>
      </PageHero>

      <TemplateLibrary templates={results} query={query.trim()} onClear={() => setQuery("")} />
    </>
  );
}
