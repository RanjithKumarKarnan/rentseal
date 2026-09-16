import type { PageMeta } from "@/seo/meta";
import Link from "@/components/ui/link";
import { useParams, type Params } from "react-router";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  FileCheck2,
  MapPin,
  PackageCheck,
  Stamp,
  Truck,
} from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ZONE_META, getDistrict, nearbyDistricts, stampPaperFaqs } from "@/lib/districts";
import { DENOMINATIONS, DELIVERY_RULES, STAMP_USE_CASES } from "@/lib/stamp-paper";
import { LEAD_ANCHOR, SITE } from "@/lib/site";
import { inr } from "@/lib/utils";
import NotFound from "@/pages/not-found";

export function meta({ district: slug = "" }: Params): PageMeta {
  const district = getDistrict(slug);
  if (!district) return {};

  const zone = ZONE_META[district.zone];
  // "Delivery" where the name leaves room for it inside 60 characters — the
  // four shortest districts. The rest keep the plain form.
  const withDelivery = `Non-Judicial Stamp Paper Delivery in ${district.name}`;
  const title = withDelivery.length <= 43 ? withDelivery : `Non-Judicial Stamp Paper in ${district.name}`;
  const description = `Non-judicial stamp paper home delivery in ${district.name} district, ${zone.eta.toLowerCase()}. ₹100 sheet for ₹120, ₹500 for ₹550, and e-Stamps of any value.`;

  return {
    title,
    description,
    alternates: { canonical: `/stamp-paper/${district.slug}` },
    openGraph: { title, description },
    keywords: [
      `stamp paper ${district.name}`,
      `e-stamp paper ${district.name}`,
      `buy stamp paper in ${district.hq}`,
      `non judicial stamp paper ${district.name}`,
      `stamp paper home delivery ${district.name}`,
      `stamp paper online ${district.name}`,
      `bond paper ${district.name}`,
      `stamp paper delivery ${district.name}`,
      ...district.towns.map((t) => `stamp paper ${t}`),
    ],
  };
}

export default function StampPaperDistrictPage() {
  const { district: slug = "" } = useParams();
  const district = getDistrict(slug);
  if (!district) return <NotFound />;

  const zone = ZONE_META[district.zone];
  const nearby = nearbyDistricts(district);
  const faqs = stampPaperFaqs(district);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Non-judicial stamp paper", href: "/stamp-paper" },
    { label: district.name },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${district.name} District · ${zone.label}`}
        icon={Stamp}
        crumbs={crumbs}
        title={`Non-judicial stamp paper in ${district.name}, with home delivery`}
        body={`Licensed non-judicial stamp paper — bond paper, as most people call it — and e-Stamp certificates anywhere in ${district.name} district — the face value plus a stated procurement charge, never a figure you find out at the door. ${zone.eta} delivery${zone.cutOff ? ` — ${zone.cutOff.toLowerCase()}` : ""}, and no queue at the vendor's counter.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Order non-judicial stamp paper for {district.name}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink
            href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
            variant="secondary"
            size="lg"
          >
            Get a quote on WhatsApp
          </ButtonLink>
        </div>
        <p className="mt-4 text-[13.5px] text-navy-500">
          {zone.eta} delivery · ₹100 paper for ₹120 · Free above ₹2,000 of physical paper
        </p>
      </PageHero>

      {/* Delivery facts */}
      <section className="section">
        <div className="container-page">
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" amount={0.1}>
            {[
              {
                icon: Clock3,
                label: `Delivery to ${district.name}`,
                value: zone.eta,
                sub: zone.cutOff ?? `${zone.label} zone`,
              },
              {
                icon: Truck,
                label: "Delivery charge",
                value: inr(zone.charge),
                sub: `free above ${inr(DELIVERY_RULES.freeAbovePaperValue)} of physical paper`,
              },
              {
                icon: PackageCheck,
                label: "Bulk orders",
                value: `${DELIVERY_RULES.bulkFreeFrom}+ sheets`,
                sub: "ship free anywhere in the district",
              },
              {
                icon: BadgeCheck,
                label: "Taluks covered",
                value: `${district.sroTowns.length}`,
                sub: `every one in ${district.name}`,
              },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="h-full p-6">
                  <stat.icon className="size-5 text-brand-600" />
                  <p className="mt-4 text-[12px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 font-display text-[26px] font-bold tracking-tight text-navy-950">
                    <Counter value={stat.value} />
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-navy-500">{stat.sub}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-line bg-white p-7 sm:p-9">
              <h2 className="font-display text-[20px] font-bold text-navy-950">
                What {district.name} buys non-judicial stamp paper for
              </h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-navy-600">{district.economy}</p>
              <p className="mt-3 text-[15px] leading-[1.75] text-navy-600">{district.demand}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Denominations */}
      <section className="section border-y border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow={`In stock for ${district.name}`}
            icon={Stamp}
            title="Every denomination, priced before you order"
            body="Each sheet is the face value printed on it plus our charge for fetching it, and both figures are shown. Delivery is quoted separately before you confirm, and government stamp duty on an e-Stamp passes through at cost."
          />

          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
            {DENOMINATIONS.map((d) => (
              <StaggerItem key={d.label}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas/60 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-[24px] font-bold tracking-tight text-navy-950">
                        {d.label}
                      </p>
                      <p className="tnum mt-0.5 text-[12.5px] font-semibold text-brand-700">
                        {d.price === null
                          ? "Price on request"
                          : `${inr(d.price)} a sheet · ${inr(d.price - d.value)} ours`}
                      </p>
                    </div>
                    {d.popular ? (
                      <span className="shrink-0 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                        Most used
                      </span>
                    ) : null}
                  </div>
                  <ul className="mt-4 flex flex-1 flex-wrap items-start content-start gap-1.5">
                    {d.uses.map((use) => (
                      <li
                        key={use}
                        className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-navy-600"
                      >
                        {use}
                      </li>
                    ))}
                  </ul>
                  {d.note ? (
                    <p className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-navy-500">
                      {d.note}
                    </p>
                  ) : null}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Use cases */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Which one do you need?"
            icon={FileCheck2}
            title={`Common instruments we stamp for ${district.name}`}
            body="Tell us what you are executing and we will tell you the denomination before you order — including when only an e-Stamp for the exact duty will do."
          />

          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
            {STAMP_USE_CASES.map((useCase) => (
              <StaggerItem key={useCase.title}>
                <Card className="h-full p-6">
                  <span className="inline-flex rounded-full border border-brand-200/80 bg-brand-50/70 px-3 py-1 text-[11.5px] font-bold tracking-wide text-brand-700 uppercase">
                    {useCase.denomination}
                  </span>
                  <h3 className="mt-4 font-display text-[16.5px] font-bold text-navy-950">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-navy-500">{useCase.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Where we deliver inside the district */}
      <section className="section border-y border-line bg-white">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-canvas/60 p-7">
                <h2 className="flex items-center gap-2.5 font-display text-[18px] font-bold text-navy-950">
                  <MapPin className="size-5 text-brand-600" />
                  Delivering across {district.name}
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-navy-600">
                  We reach every taluk in the district. These are the towns we deliver to most
                  often — if yours is not listed, it is still covered.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {[...district.towns, ...district.sroTowns]
                    .filter((t, i, arr) => arr.indexOf(t) === i)
                    .map((town) => (
                      <li
                        key={town}
                        className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-navy-600"
                      >
                        {town}
                      </li>
                    ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-canvas/60 p-7">
                <h2 className="flex items-center gap-2.5 font-display text-[18px] font-bold text-navy-950">
                  <BadgeCheck className="size-5 text-brand-600" />
                  Verify what we deliver
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-navy-600">
                  Everything is procured through licensed stamp vendors and the state&apos;s
                  authorised e-Stamping channel. Every sheet or certificate carries a serial number
                  you can check yourself against the Registration Department&apos;s records — we
                  print it on your invoice so you never have to ask us for it.
                </p>
                <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] leading-relaxed text-emerald-900">
                  Need it faster than {zone.eta.toLowerCase()}? An e-Stamp certificate is emailed
                  within minutes — where your instrument allows one, there is nothing to deliver
                  and no delivery charge at all.
                </p>
                <Link
                  href={`/rental-agreement/${district.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                >
                  Need the agreement drafted as well?
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* District-specific FAQs — deliberately not the generic set, so 38 pages
          do not ship the same eight answers. */}
      <section id="faq" className="section scroll-mt-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={`${district.name} — common questions`}
            title={`Buying non-judicial stamp paper in ${district.name}, answered`}
            body={`Delivery, denominations and verification, with the numbers that apply to ${district.name} rather than a state average.`}
          />
          <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
            <Accordion items={faqs} defaultOpen={0} />
            <p className="mt-8 text-center text-[14px] text-navy-500">
              Something not covered here?{" "}
              <Link href="/faq" className="font-semibold text-brand-700 underline underline-offset-4">
                Read the full FAQ
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-semibold text-brand-700 underline underline-offset-4">
                ask us directly
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* Nearby districts */}
      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading title={`Non-judicial stamp paper elsewhere in ${district.region}`} align="left" />
          <div className="mt-8 flex flex-wrap gap-2.5">
            {nearby.map((other) => (
              <Link
                key={other.slug}
                href={`/stamp-paper/${other.slug}`}
                className="rounded-full border border-line bg-canvas px-4 py-2.5 text-[14px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:bg-white hover:text-brand-700"
              >
                Non-judicial stamp paper in {other.name}
              </Link>
            ))}
          </div>
          <Link
            href="/stamp-paper"
            className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand-700 underline underline-offset-4"
          >
            See all 38 districts
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: `${SITE.name} — Non-judicial stamp paper, ${district.name}`,
            description: `Non-judicial stamp paper and e-Stamp certificate supply and delivery across ${district.name} district, Tamil Nadu.`,
            url: `${SITE.url}/stamp-paper/${district.slug}`,
            telephone: SITE.phone,
            priceRange: "₹120 – ₹5,500",
            areaServed: {
              "@type": "AdministrativeArea",
              name: `${district.name} district`,
              containedInPlace: { "@type": "State", name: "Tamil Nadu" },
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: district.hq,
              addressRegion: "Tamil Nadu",
              addressCountry: "IN",
            },
            parentOrganization: { "@id": `${SITE.url}/#organization` },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${SITE.url}/stamp-paper/${district.slug}#faq`,
            mainEntity: faqs.map((f) => ({
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
