import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, IdCard, ScrollText, Store, Users } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/ui/motion";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { CERTIFICATE_CATEGORIES, CERTIFICATE_SERVICES } from "@/lib/certificates";
import { LEAD_ANCHOR, SITE } from "@/lib/site";
import { inr } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certificates & Registrations — Tamil Nadu",
  description:
    "Community, income, nativity and OBC certificates, ration card, voter ID, PAN, passport and MSME registration — what each costs and which documents to bring.",
  alternates: { canonical: "/certificates" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Online Works" }];

const CATEGORY_ICON = {
  Identity: IdCard,
  "Revenue certificate": ScrollText,
  "Ration & welfare": Users,
  Business: Store,
} as const;

export default function CertificatesPage() {
  const priced = CERTIFICATE_SERVICES.filter((s) => s.price !== null).map((s) => s.price as number);

  return (
    <>
      <PageHero
        eyebrow="Online works"
        icon={FileCheck2}
        crumbs={CRUMBS}
        title="Every certificate, and exactly what to bring"
        body={`We file ${CERTIFICATE_SERVICES.length} government applications — from a ration card to a passport. The useful part of this page is the document list against each one: turn up with the right papers and it is done in a single visit instead of three.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={LEAD_ANCHOR} size="lg">
            Tell us what you need
          </ButtonLink>
          <ButtonLink href={`tel:${SITE.phone.replace(/\s/g, "")}`} variant="secondary" size="lg">
            Call {SITE.phone}
          </ButtonLink>
        </div>
      </PageHero>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What it costs"
            title={`From ${inr(Math.min(...priced))} to ${inr(Math.max(...priced))}`}
            body="Our fee for preparing and filing the application. Any government fee payable on the application itself is separate and is told to you before we file."
          />

          <div className="mt-12 space-y-14">
            {CERTIFICATE_CATEGORIES.map((category, ci) => {
              const rows = CERTIFICATE_SERVICES.filter((s) => s.category === category);
              if (!rows.length) return null;
              const Icon = CATEGORY_ICON[category];

              return (
                <div key={category}>
                  <h2 className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                    <Icon className="size-4" />
                    {category}
                    <span className="font-medium tracking-normal normal-case">
                      · {rows.length}
                    </span>
                  </h2>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {rows.map((service, i) => (
                      <Reveal key={service.id} delay={Math.min(ci * 0.04 + i * 0.04, 0.3)}>
                        <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:border-brand-300 hover:shadow-lift">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-[16px] leading-snug font-bold text-navy-950">
                              {service.name}
                            </h3>
                            {service.popular ? <Badge tone="dark">Popular</Badge> : null}
                          </div>

                          <p className="tnum mt-2 font-display text-[22px] font-bold text-navy-950">
                            {service.price === null ? (
                              <span className="text-[15px] font-semibold text-navy-500">
                                Price on request
                              </span>
                            ) : (
                              inr(service.price)
                            )}
                          </p>

                          <p className="mt-2 text-[13px] leading-relaxed text-navy-500">
                            {service.blurb}
                          </p>

                          <div className="mt-4 border-t border-line pt-4">
                            <p className="text-[11px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                              Bring these
                            </p>
                            <ul className="mt-2.5 space-y-1.5">
                              {service.documents.map((doc) => (
                                <li key={doc} className="flex items-start gap-2">
                                  <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                                  <span className="text-[12.5px] leading-snug text-navy-600">
                                    {doc}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {service.note ? (
                              <p className="mt-3 text-[11.5px] leading-relaxed text-navy-400 italic">
                                {service.note}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-canvas p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-xl">
              <h2 className="font-display text-[19px] font-bold tracking-tight text-navy-950">
                Not sure which certificate you need?
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-navy-500">
                Tell us what the certificate is for — a college admission, a passport, a pension,
                a bank — and we will tell you which one to apply for and what it takes.
              </p>
            </div>
            <ButtonLink href={LEAD_ANCHOR} size="lg" className="shrink-0">
              Ask us
            </ButtonLink>
          </div>
        </div>
      </section>

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
