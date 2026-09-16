import type { PageMeta } from "@/seo/meta";
import { BreadcrumbSchema } from "@/components/site/page-hero";
import { TemplateCatalogue } from "@/components/landing/template-catalogue";
import { SITE } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";
import { TAMIL_TEMPLATE_IDS } from "@/lib/tamil-templates";

/**
 * The Tamil deeds are inside TEMPLATES, not alongside it, so the total is the
 * length of the one list. Adding the two together billed the sixteen Tamil
 * deeds twice and advertised seventy-one documents where there are fifty-five.
 */
const ENGLISH_COUNT = TEMPLATES.length - TAMIL_TEMPLATE_IDS.length;

const title = "Agreement & Affidavit Formats, Tamil Nadu";
const description = `${ENGLISH_COUNT} English formats and ${TAMIL_TEMPLATE_IDS.length} Tamil deeds: rent agreement, lease, sale, loan, mortgage, indemnity, affidavit and NOC, for non-judicial stamp paper.`;

export const meta: PageMeta = {
  title,
  description,
  alternates: { canonical: "/templates" },
  openGraph: { title, description },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Templates" }];

export default function TemplatesPage() {
  return (
    <>
      <TemplateCatalogue />
      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
