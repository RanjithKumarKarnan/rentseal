import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileStack,
  ListChecks,
  Sparkles,
  Users,
} from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { Commitments } from "@/components/landing/commitments";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES, getService } from "@/lib/services";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.metaTitle, description: service.metaDescription },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Agreements", href: "/#agreement-types" },
    { label: service.name },
  ];

  return (
    <>
      <PageHero
        eyebrow={service.name}
        icon={FileStack}
        crumbs={crumbs}
        title={service.h1}
        body={service.intro}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* The drafter, not the catalogue: this page is already about one
              instrument, so it opens that one rather than asking again.
              BUILDER_START points at the catalogue now, and building the URL
              from it produced /templates/residential, which is nothing. */}
          <ButtonLink href={`/create/${service.id}`} size="lg" className="group">
            Draft this agreement
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href={LEAD_ANCHOR} variant="secondary" size="lg">
            Talk to us first
          </ButtonLink>
        </div>
      </PageHero>

      {/* Who it's for */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-700 uppercase">
                  <Users className="size-3.5" />
                  Who this is for
                </span>
                <h2 className="mt-5 text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.15] font-bold text-navy-950">
                  Is this the right instrument for you?
                </h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-navy-500">
                  Picking the wrong one is the most expensive mistake in a rental. If none of
                  these describe your situation, tell us and we will point you to the right one —
                  even if it is cheaper.
                </p>
                <ButtonLink href="/contact" variant="secondary" size="md" className="mt-6">
                  Not sure? Ask us
                </ButtonLink>
              </div>
            </Reveal>

            <div>
              <Stagger className="space-y-3" amount={0.1}>
                {service.whoFor.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      <p className="text-[15px] leading-relaxed text-navy-700">{item}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.2}>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {service.included.map((item) => (
                    <Card key={item.title} className="p-6">
                      <Sparkles className="size-5 text-brand-600" />
                      <h3 className="mt-4 font-display text-[16px] font-bold text-navy-950">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-[1.7] text-navy-500">{item.body}</p>
                    </Card>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Clause list */}
      <section className="section border-y border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="What's inside"
            icon={ListChecks}
            title={`Every clause in your ${service.name.toLowerCase()}`}
            body="Some appear always, others only when your answers call for them. Nothing is boilerplate you didn't ask for."
          />

          <Reveal delay={0.12}>
            <ul className="mx-auto mt-14 grid max-w-4xl gap-x-8 gap-y-1 sm:grid-cols-2">
              {service.clauses.map((clause, i) => (
                <li
                  key={clause}
                  className="flex items-center gap-3 border-b border-line py-3.5 text-[14.5px] text-navy-700 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                >
                  <span className="tnum w-6 shrink-0 text-[12px] font-bold text-navy-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {clause}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Watch out */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Before you download a free template"
            icon={AlertTriangle}
            title="Three things cheap templates get wrong"
            body="These are the failures we see most often when someone brings us an agreement that has already gone wrong."
          />

          <Stagger className="mt-14 grid gap-5 lg:grid-cols-3" amount={0.1}>
            {service.watchOut.map((item, i) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
                  <span className="grid size-9 place-items-center rounded-lg bg-amber-500 font-display text-[14px] font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-[16.5px] font-bold text-navy-950">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.7] text-navy-600">{item.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Commitments />

      {/* Service FAQs */}
      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading title={`${service.name} — common questions`} />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
            <Accordion items={service.faqs} defaultOpen={0} />
            <p className="mt-8 text-center text-[14px] text-navy-500">
              More answers in the{" "}
              <Link href="/faq" className="font-semibold text-brand-700 underline underline-offset-4">
                full FAQ
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* Other services */}
      <section className="section">
        <div className="container-page">
          <SectionHeading title="Other agreement types" align="left" />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {SERVICES.filter((s) => s.slug !== service.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="group rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card"
              >
                <h3 className="font-display text-[16.5px] font-bold text-navy-950">{other.name}</h3>
                <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-navy-500">
                  {other.intro}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700">
                  Read more
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            serviceType: service.name,
            description: service.metaDescription,
            url: `${SITE.url}/services/${service.slug}`,
            // Points at the organisation defined once in the root layout rather
            // than restating its name, address and hours on every service page.
            provider: { "@id": `${SITE.url}/#organization` },
            areaServed: { "@type": "State", name: "Tamil Nadu" },
            // Drafting starts at ₹300 across the catalogue — the same floor the
            // homepage's priceRange states, so the two never disagree.
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "300",
              url: `${SITE.url}/services/${service.slug}`,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
