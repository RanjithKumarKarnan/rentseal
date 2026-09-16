import { Outlet, ScrollRestoration } from "react-router";
import { MotionProvider } from "@/components/ui/motion-provider";
import { DISTRICTS } from "@/lib/districts";
import { SITE } from "@/lib/site";
import { HeadManager } from "@/seo/head-manager";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/logo.png`,
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: "₹300 – ₹5,500",
  // SITE.address, in the parts schema.org wants. This read "Prestige Polygon,
  // 471 Anna Salai, Teynampet 600018" — an address the business is not at —
  // while every page showed the Mogappair one, and Google trusts neither when
  // the two disagree.
  address: {
    "@type": "PostalAddress",
    streetAddress: "4/434, J J Nagar, Mogappair West",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600037",
    addressCountry: "IN",
  },
  areaServed: DISTRICTS.map((d) => ({
    "@type": "AdministrativeArea",
    name: `${d.name} district`,
    containedInPlace: { "@type": "State", name: "Tamil Nadu" },
  })),
  knowsLanguage: ["en-IN", "ta-IN"],
  // Sunday is simply absent. In schema.org an unlisted day is a closed one, and
  // that is what puts "Closed" against Sunday in a Google listing rather than
  // leaving someone to guess.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: SITE.hours.weekday.opens,
      closes: SITE.hours.weekday.closes,
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": `${SITE.url}/#organization` },
  inLanguage: "en-IN",
  // Restored now that /search actually exists and answers ?q= — it was removed
  // while it pointed at a route that was never built. Note that Google retired
  // the sitelinks searchbox rich result in 2023, so this is for correctness and
  // other consumers rather than a Google feature.
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Around every page.
 *
 * The document itself — fonts, Tag Manager, the parts of <head> that never
 * change — is index.html. Each page's own head tags come from its `meta` export
 * (src/seo/meta.ts).
 */
export function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-navy-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <MotionProvider>
        <Outlet />
      </MotionProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
      />
      <ScrollRestoration />
      <HeadManager />
    </>
  );
}
