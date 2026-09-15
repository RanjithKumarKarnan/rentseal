import type { PageMeta } from "@/seo/meta";
import { HelpCircle } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { FaqSchema } from "@/components/landing/faq-section";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { FAQS, SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "Frequently Asked Questions",
  description:
    "Legal validity, stamp duty, registration, delivery, renewals and refunds — straight answers about creating a rental agreement online in Tamil Nadu.",
  alternates: { canonical: "/faq" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "FAQ" }];

const CATEGORIES = Array.from(new Set(FAQS.map((f) => f.category)));

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        icon={HelpCircle}
        crumbs={CRUMBS}
        title="Questions, answered properly"
        body="Including the ones that cost us money to answer honestly — like when you don't need to register, and when you don't need us at all."
      >
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-line bg-white px-4 py-2 text-[13.5px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:text-brand-700"
            >
              {cat}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-14">
            {CATEGORIES.map((cat, i) => {
              const items = FAQS.filter((f) => f.category === cat);
              return (
                <section key={cat} id={cat.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28">
                  <Reveal delay={i * 0.04}>
                    <h2 className="mb-5 font-display text-[22px] font-bold tracking-tight text-navy-950">
                      {cat}
                      <span className="ml-2.5 text-[14px] font-medium text-navy-400">
                        {items.length} question{items.length === 1 ? "" : "s"}
                      </span>
                    </h2>
                    <Accordion items={items} />
                  </Reveal>
                </section>
              );
            })}
          </div>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-line bg-navy-950 p-8 text-center text-white sm:p-10">
              <h2 className="font-display text-[22px] font-bold">
                Your question isn&apos;t here?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/60">
                Ask us before you pay. We would much rather talk you out of a purchase you don&apos;t
                need than deal with a refund later.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg">
                  Ask a question
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  variant="ghost"
                  size="lg"
                  className="border border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  WhatsApp us
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <FaqSchema />
      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
