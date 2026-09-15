import { SearchFromUrl } from "@/components/site/search-page";
import { DISTRICTS } from "@/lib/districts";
import type { PageMeta } from "@/seo/meta";

export const meta: PageMeta = {
  title: "Search",
  description: `Search rental agreements, stamp paper and delivery across all ${DISTRICTS.length} districts of Tamil Nadu.`,
  alternates: { canonical: "/search" },
  // Internal search result pages are low value to index and can open an
  // unbounded crawl space. Left crawlable but not indexed, so the SearchAction
  // target stays fetchable.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  // The results depend on ?q=. The build writes this page without one — the
  // empty search, which is also what a crawler sees — and the browser fills the
  // results in once it has taken over.
  return <SearchFromUrl />;
}
