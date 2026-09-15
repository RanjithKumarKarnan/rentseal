import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchFromUrl, SearchView } from "@/components/site/search-page";
import { DISTRICTS } from "@/lib/districts";

export const metadata: Metadata = {
  title: "Search",
  description: `Search rental agreements, stamp paper and delivery across all ${DISTRICTS.length} districts of Tamil Nadu.`,
  alternates: { canonical: "/search" },
  // Internal search result pages are low value to index and can open an
  // unbounded crawl space. Left crawlable but not indexed, so the SearchAction
  // target stays fetchable.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  // The results depend on ?q=, which only the browser can read on a static
  // site. Until it has, this is the empty search page — also what a crawler sees.
  return (
    <Suspense fallback={<SearchView query="" />}>
      <SearchFromUrl />
    </Suspense>
  );
}
