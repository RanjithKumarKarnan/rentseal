import type { PageMeta } from "@/seo/meta";
import { AgreementTypes } from "@/components/landing/agreement-types";
import { Certificates } from "@/components/landing/certificates";
import { Cities } from "@/components/landing/cities";
import { LeadForm } from "@/components/landing/lead-form";
import { FaqSchema, FaqSection } from "@/components/landing/faq-section";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StampPaper } from "@/components/landing/stamp-paper";
import { Commitments } from "@/components/landing/commitments";
import { TrustBar } from "@/components/landing/trust-bar";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { SITE } from "@/lib/site";
import { DENOMINATIONS } from "@/lib/stamp-paper";

export const meta: PageMeta = {
  title: "Stamp Paper & Rental Agreements in Tamil Nadu",
  description: SITE.description,
  alternates: { canonical: "/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Stamp paper supply, delivery and rental agreement drafting",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "State", name: "Tamil Nadu" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Stamp paper and agreement services",
    itemListElement: [
      ...DENOMINATIONS.filter((d) => d.value > 0).map((d) => ({
        "@type": "Offer",
        name: `${d.label} non-judicial stamp paper`,
        price: String(d.value),
        priceCurrency: "INR",
      })),
      { "@type": "Offer", name: "Rental agreement — Basic", price: "350", priceCurrency: "INR" },
      { "@type": "Offer", name: "Rental agreement — Standard", price: "800", priceCurrency: "INR" },
      { "@type": "Offer", name: "Rental agreement — Premium", price: "1500", priceCurrency: "INR" },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      {/*
        Kept deliberately short. This page ran to 26 screens, which is not a
        landing page, it is a brochure — and most of the length was repetition:
        four separate sections all making the "no markup, no office visit" case.

        Moved off: the 25-card template library (now /templates, where it is
        indexable and does not cost every visitor 3,700px of scroll) and the
        old-way comparison table (already on /pricing, and it restated what
        How it works and Commitments already say).

        Also cut: Features. How it works, Features and Commitments were three
        consecutive sections all arguing why to use us. The full thirteen
        features remain on /how-it-works, where the reader has asked for them.
      */}
      <Hero />
      <TrustBar />
      <StampPaper />
      <Cities />
      <LeadForm />
      <AgreementTypes />
      <Certificates />
      <HowItWorks />
      <Commitments />
      <FaqSection limit={5} />

      {/* Schema must describe what is actually on the page — it marked up eight
          questions while ten were rendered. */}
      <FaqSchema limit={5} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <WhatsAppFab />
    </>
  );
}
