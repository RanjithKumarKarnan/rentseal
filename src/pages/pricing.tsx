import type { PageMeta } from "@/seo/meta";
import { Tag } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { PricingCards } from "@/components/landing/pricing-cards";
import { FaqSection } from "@/components/landing/faq-section";
import { Comparison } from "@/components/landing/comparison";
import { SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "Pricing — Agreements and Deeds from ₹300",
  description:
    "Every deed priced on its own, from ₹300. Stamp duty passed through at government rate and itemised on every invoice. GST applies to our fee alone.",
  alternates: { canonical: "/pricing" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Pricing" }];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        icon={Tag}
        crumbs={CRUMBS}
        align="center"
        title="Pay for the work, not for the paperwork"
        body="Our fee is fixed and visible. Stamp duty is a government charge that passes straight through — you can check it against the Registration Department's own rate before you pay."
      />

      <PricingCards withHeading={false} />
      <Comparison />
      <FaqSection limit={14} />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
