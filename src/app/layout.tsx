import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Source_Serif_4 } from "next/font/google";
import { DISTRICTS } from "@/lib/districts";
import { MotionProvider } from "@/components/ui/motion-provider";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Headings are set in a serif on purpose.
 *
 * The site was previously Inter + Plus Jakarta Sans, which is the default
 * pairing of every generated landing page on the internet right now — geometric,
 * extrabold, and completely anonymous. A business that sells stamped legal
 * instruments should not look like a SaaS template.
 *
 * Source Serif reads the way the documents themselves do: institutional,
 * readable at size, and old enough to imply the company has been here a while.
 */
const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Rental Agreement Online in Tamil Nadu | e-Stamp & e-Sign`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
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
    "e-stamp paper Tamil Nadu",
    "affidavit format Tamil Nadu",
  ],
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  applicationName: SITE.name,
  category: "Legal Services",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Rental agreements for Tamil Nadu in 10 minutes`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Rental agreements for Tamil Nadu in 10 minutes`,
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
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: "₹300 – ₹5,500",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Prestige Polygon, 471 Anna Salai, Teynampet",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600018",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRR9VW2H"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PRR9VW2H');`}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-navy-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
        />
      </body>
    </html>
  );
}
