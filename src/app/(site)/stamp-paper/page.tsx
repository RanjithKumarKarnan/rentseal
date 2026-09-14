import type { Metadata } from "next";
import { ArrowRight, Stamp } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { DistrictIndex } from "@/components/site/district-index";
import { StampPaperHow } from "@/components/site/stamp-paper-how";
import { StampPaperRates } from "@/components/site/stamp-paper-rates";
import { ButtonLink } from "@/components/ui/button";
import { DISTRICTS } from "@/lib/districts";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

const title = "Government Authorised Stamp Paper — Tamil Nadu";
const description =
  "Genuine, government authorised stamp paper delivered anywhere in Tamil Nadu. ₹100 paper for ₹120, ₹500 for ₹550, ₹1,000 for ₹1,100 and ₹5,000 for ₹5,500. Printing and notary attestation available.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/stamp-paper" },
  openGraph: { title, description },
};

const crumbs = [{ label: "Home", href: "/" }, { label: "Stamp paper" }];

export default function StampPaperIndex() {
  return (
    <>
      <PageHero
        eyebrow="District-wise delivery"
        icon={Stamp}
        crumbs={crumbs}
        title="Government authorised stamp paper, delivered to your doorstep"
        body="Fill in the details online and receive genuine, government authorised stamp paper at your door — the face value plus a stated procurement charge, with delivery quoted before you confirm. Same day in Chennai by Porter, ₹100 next day, and ₹100 to ₹200 anywhere else in Tamil Nadu. We can print your draft on it and get it attested too."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Get started
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink
            href="/rental-agreement"
            variant="secondary"
            size="lg"
            className="border-brand-600 bg-brand-50/40 text-brand-700 hover:border-brand-700 hover:bg-brand-50 hover:text-brand-800"
          >
            Get the agreement drafted too
          </ButtonLink>
        </div>
      </PageHero>

      <StampPaperRates />

      <StampPaperHow />

      <DistrictIndex base="stamp-paper" noun="Stamp paper" />

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Stamp paper delivery by district — Tamil Nadu",
            numberOfItems: DISTRICTS.length,
            itemListElement: DISTRICTS.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Stamp paper in ${d.name}`,
              url: `${SITE.url}/stamp-paper/${d.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
