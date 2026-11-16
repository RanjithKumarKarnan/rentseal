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
import { PLANS, SITE } from "@/lib/site";
import { rentAgreementPrice } from "@/lib/stamp-duty";
import { DENOMINATIONS } from "@/lib/stamp-paper";

export const meta: PageMeta = {
  // The owner's target phrase for the home page is "online stamp paper Chennai".
  title: "Online Stamp Paper in Chennai, Delivered Home",
  description:
    "Online stamp paper in Chennai: original non-judicial stamp paper from ₹120, delivered to your doorstep across Tamil Nadu. Rental agreements from ₹350.",
  alternates: { canonical: "/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Non-judicial stamp paper supply, delivery and rental agreement drafting",
  alternateName: ["Physical stamp paper delivery", "Hard copy stamp paper delivery", "Bond paper delivery"],
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "State", name: "Tamil Nadu" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Non-judicial stamp paper and agreement services",
    itemListElement: [
      ...DENOMINATIONS.filter((d) => d.value > 0).map((d) => ({
        "@type": "Offer",
        name: `${d.label} non-judicial stamp paper (physical sheet)`,
        // What the customer pays for the sheet, not its face value — an
        // assistant quoting this should say ₹120 for a ₹100 sheet, as the page does.
        price: String(d.price),
        priceCurrency: "INR",
      })),
      ...PLANS.map((plan) => ({
        "@type": "Offer",
        name: `Rental agreement — ${plan.name}`,
        price: String(rentAgreementPrice(plan.id)),
        priceCurrency: "INR",
      })),
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
      <FaqSection limit={6} />

      {/* Schema must describe what is actually on the page — it marked up eight
          questions while ten were rendered. */}
      <FaqSchema limit={6} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <WhatsAppFab />
    </>
  );
}
