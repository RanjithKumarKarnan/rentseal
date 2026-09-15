import type { PageMeta } from "@/seo/meta";
import { ArrowRight, FileStack } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { DistrictIndex } from "@/components/site/district-index";
import { ButtonLink } from "@/components/ui/button";
import { DISTRICTS } from "@/lib/districts";
import { BUILDER_START, SITE } from "@/lib/site";

const title = "Rental Agreement in Tamil Nadu — All 38 Districts";
const description =
  "A legally valid rental agreement anywhere in Tamil Nadu, e-stamped at the government rate. Pick your district for its Sub-Registrar Offices.";

export const meta: PageMeta = {
  title,
  description,
  alternates: { canonical: "/rental-agreement" },
  openGraph: { title, description },
};

const crumbs = [{ label: "Home", href: "/" }, { label: "Rental agreement" }];

export default function RentalAgreementIndex() {
  return (
    <>
      <PageHero
        eyebrow="District-wise coverage"
        icon={FileStack}
        crumbs={crumbs}
        title="Rental agreements, district by district across Tamil Nadu"
        body={`We draft, e-stamp and e-sign rental agreements in all ${DISTRICTS.length} districts of the state. Each district page carries its own Sub-Registrar Offices, the towns we deliver to, and the delivery promise that applies there.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={BUILDER_START} size="lg" className="group">
            Create agreement
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/templates" variant="secondary" size="lg">
            See all templates
          </ButtonLink>
        </div>
      </PageHero>

      <DistrictIndex base="rental-agreement" noun="Rental agreements" />

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Rental agreement coverage by district — Tamil Nadu",
            numberOfItems: DISTRICTS.length,
            itemListElement: DISTRICTS.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Rental agreement in ${d.name}`,
              url: `${SITE.url}/rental-agreement/${d.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
