import type { PageMeta } from "@/seo/meta";
import Link from "@/components/ui/link";
import {
  ArrowRight,
  FileSignature,
  Map as MapIcon,
  MessageCircle,
  Scale,
  Stamp,
} from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/ui/motion";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { AGREEMENT_TYPES, BUILDER_START, LEAD_ANCHOR, SITE } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";
import { DISTRICTS } from "@/lib/districts";

export const meta: PageMeta = {
  title: "Site Map — Every Page on LP Stamp Paper",
  description:
    "The whole of LP Stamp Paper on one page: the two ways to order, every agreement type, all 38 district pages, pricing, help and legal.",
  alternates: { canonical: "/sitemap" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Site map" }];

/** The two things a visitor can actually be here to do. */
const JOURNEYS = [
  {
    icon: FileSignature,
    tone: "brand" as const,
    kicker: "Path 1",
    title: "I need an agreement drawn up",
    lead: "You answer the questions and the deed writes itself as you go. Nothing is charged here — you send it to us, we ring you to confirm, and payment is taken on that call.",
    steps: [
      { label: "Pick the instrument", href: "/create", note: "Residential, commercial, lease deed or leave & licence." },
      { label: "Not sure which? Read the differences", href: "/services/residential-rental-agreement", note: "Each type has a page explaining who it is for." },
      { label: "Or start from a situation", href: "/templates", note: "24 ready drafts — shop lease, PG stay, warehouse, and so on." },
      { label: "Fill the six steps and send it", href: "/create", note: "Property, landlord, tenant, terms, clauses, review and send." },
      { label: "Check what it will cost", href: "/pricing", note: "Stamp duty at government rate plus a fixed fee, confirmed on the call." },
    ],
    cta: { label: "Start drafting", href: BUILDER_START },
  },
  {
    icon: Stamp,
    tone: "emerald" as const,
    kicker: "Path 2",
    title: "I just need stamp paper",
    lead: "Licensed non-judicial paper and e-Stamp certificates brought to your address — ₹100 paper for ₹120, up to ₹5,000, with printing and notary attestation available. Nothing charged until we have spoken.",
    steps: [
      { label: "See denominations and delivery charges", href: "/stamp-paper", note: "₹100, ₹500, ₹1,000 and ₹5,000 sheets, or an e-Stamp for any value." },
      { label: "Check the rate card and your district", href: "/stamp-paper", note: "Same day in Chennai by Porter, 2–3 days statewide." },
      { label: "Tell us what you need", href: LEAD_ANCHOR, note: "We call back with a firm quote before anything is charged." },
    ],
    cta: { label: "Order stamp paper", href: LEAD_ANCHOR },
  },
];

const SECTIONS = [
  {
    heading: "Draw up an agreement",
    icon: FileSignature,
    links: [
      { label: "Choose an agreement type", href: "/create" },
      ...AGREEMENT_TYPES.map((t) => ({
        label: `Draft a ${t.name}`,
        href: `/create/${t.id}`,
      })),
      { label: `All ${TEMPLATES.length} templates`, href: "/templates" },
    ],
  },
  {
    heading: "Read up on the instruments",
    icon: Scale,
    links: AGREEMENT_TYPES.map((t) => ({
      label: t.name,
      href: `/services/${t.slug}`,
    })),
  },
  {
    heading: "Stamp paper",
    icon: Stamp,
    links: [
      { label: "Stamp paper and e-Stamp delivery", href: "/stamp-paper" },
      { label: "Denominations and prices", href: "/#stamp-paper" },
      { label: "Delivery coverage and timelines", href: "/#delivery" },
      { label: "Bulk orders for firms", href: LEAD_ANCHOR },
    ],
  },
  {
    heading: "Certificates and registrations",
    icon: Stamp,
    links: [
      { label: "All certificates and fees", href: "/certificates" },
      { label: "PAN card", href: "/certificates" },
      { label: "Voter ID", href: "/certificates" },
      { label: "Ration card", href: "/certificates" },
      { label: "Passport", href: "/certificates" },
      { label: "MSME / Udyam registration", href: "/certificates" },
    ],
  },
  {
    heading: "Before you pay",
    icon: MessageCircle,
    links: [
      { label: "Pricing and what is included", href: "/pricing" },
      { label: "How it works, step by step", href: "/how-it-works" },
      { label: "Frequently asked questions", href: "/faq" },
      { label: "About LP Stamp Paper", href: "/about" },
      { label: "Contact and support", href: "/contact" },
      { label: "Search the site", href: "/search" },
    ],
  },
  {
    heading: "Legal",
    icon: Scale,
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refund" },
      { label: "Disclaimer", href: "/legal/terms#disclaimer" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <>
      <PageHero
        eyebrow="Site map"
        icon={MapIcon}
        crumbs={CRUMBS}
        title="Everything on LP Stamp Paper, and the order to use it in"
        body="Two things bring people here: an agreement that needs drawing up, or stamp paper that needs delivering. Either way you tell us what you need, we call you to confirm it, payment is taken on that call, and then we deliver — nothing is charged on the website itself."
      />

      {/* ── The two journeys ───────────────────────────────── */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Where to start"
            title="Two paths, and they do not overlap"
            body="Pick the one that matches why you are here. Everything else on the site supports one of these two."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {JOURNEYS.map((journey, i) => (
              <Reveal key={journey.title} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        journey.tone === "brand"
                          ? "grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white"
                          : "grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white"
                      }
                    >
                      <journey.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                        {journey.kicker}
                      </p>
                      <h3 className="font-display text-[19px] font-bold tracking-tight text-navy-950">
                        {journey.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-[14.5px] leading-relaxed text-navy-500">
                    {journey.lead}
                  </p>

                  <ol className="mt-6 flex-1 space-y-3.5">
                    {journey.steps.map((step, n) => (
                      <li key={step.label} className="flex gap-3.5">
                        <span className="tnum mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line bg-canvas text-[11.5px] font-bold text-navy-500">
                          {n + 1}
                        </span>
                        <span className="min-w-0">
                          <Link
                            href={step.href}
                            className="text-[14px] font-semibold text-navy-950 underline-offset-4 hover:text-brand-700 hover:underline"
                          >
                            {step.label}
                          </Link>
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">
                            {step.note}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-7">
                    <ButtonLink
                      href={journey.cta.href}
                      variant={journey.tone === "brand" ? "primary" : "emerald"}
                      size="lg"
                      fullWidth
                      className="group"
                    >
                      {journey.cta.label}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Every page ─────────────────────────────────────── */}
      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Every page"
            title="The full index"
            body="If you know what you are looking for, it is on this list."
          />

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section, i) => (
              <Reveal key={section.heading} delay={i * 0.05}>
                <div>
                  <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                    <section.icon className="size-3.5" />
                    {section.heading}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.label + link.href}>
                        <Link
                          href={link.href}
                          className="text-[14px] leading-snug text-navy-600 underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Districts ──────────────────────────────────────── */}
      <section className="section border-t border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow="All 38 districts"
            title="Your district, on two tracks"
            body="Each district has a rental agreement page and a stamp paper page — stamp duty, the Sub-Registrar offices with jurisdiction, and how long delivery takes there."
          />

          <div className="mt-10 space-y-8">
            {[
              { label: "Rental agreement in…", base: "/rental-agreement" },
              { label: "Stamp paper in…", base: "/stamp-paper" },
            ].map((track) => (
              <Reveal key={track.base}>
                <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                  <h3 className="text-[11px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                    {track.label}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
                    {DISTRICTS.map((d) => (
                      <li key={d.slug}>
                        <Link
                          href={`${track.base}/${d.slug}`}
                          className="text-[13.5px] text-navy-600 underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
                        >
                          {d.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
