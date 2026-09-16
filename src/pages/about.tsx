import type { PageMeta } from "@/seo/meta";
import { Building2, Heart, Lock, Scale, ShieldCheck, Users } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Commitments } from "@/components/landing/commitments";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "About Us — Legal Documents People Can Read",
  description:
    "LP Stamp Paper supplies non-judicial stamp paper and drafts plain-English agreements for Tamil Nadu. Based in Chennai, serving all 38 districts.",
  alternates: { canonical: "/about" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "About" }];

const VALUES = [
  {
    icon: Scale,
    title: "The government's rate is the government's rate",
    body: "We do not mark up stamp duty, not by a rupee. It appears as its own line on every invoice, and if the Registration Department debits less than we collected, we refund the difference automatically.",
  },
  {
    icon: Heart,
    title: "Plain English is not dumbing down",
    body: "A clause you cannot read is a clause you cannot rely on. Every sentence in our templates has been rewritten until an ordinary person can follow it — without losing a word of legal effect.",
  },
  {
    icon: ShieldCheck,
    title: "We will talk you out of a sale",
    body: "If an 11-month agreement does what you need, we will say so rather than sell you registration. Support is measured on questions resolved, not on conversions.",
  },
  {
    icon: Lock,
    title: "Your Aadhaar is not our asset",
    body: "Identity numbers are encrypted at rest, masked everywhere in the interface, never written to a log, and never sold or shared. Only the last four digits ever reach the document.",
  },
];

/**
 * This was a five-entry company timeline — founding year, two named founder
 * roles, a ₹2,00,000 anecdote, and a 42,800-agreement milestone. None of it was
 * verifiable, and a fabricated history is a strange foundation for a business
 * that sells accuracy.
 *
 * What replaces it is how the service actually works. It is all true on day one
 * and it answers the question an About page is really being asked: what happens
 * to my money and my document.
 */
const PRINCIPLES = [
  {
    step: "01",
    title: "You pay the state directly, at the state's rate",
    body: "Stamp duty in Tamil Nadu is 1% of the total rent across the term plus any deposit. That amount goes to the Government of Tamil Nadu in full. It appears as its own line on your invoice, and we take nothing from it — our platform fee is separate, and GST applies to that fee alone.",
  },
  {
    step: "02",
    title: "Everything we hand you can be checked without us",
    body: "Non-judicial paper comes through licensed stamp vendors, and e-Stamp certificates through the state's authorised channel. Each carries a serial or certificate number, printed on your invoice, that you can verify against the Registration Department's own records.",
  },
  {
    step: "03",
    title: "The eleven-month term is a legal choice, not a sales one",
    body: "Section 17(1)(d) of the Registration Act, 1908 makes registration compulsory at twelve months. Below that, e-stamping alone makes an agreement admissible in evidence. We default to eleven months because it is what most lettings need — and we tell you the moment your term crosses the line.",
  },
  {
    step: "04",
    title: "Signing happens on your own phone",
    body: "Both parties sign with an Aadhaar OTP, which has the same legal effect as a handwritten signature under Section 3A of the Information Technology Act, 2000. Only a registered instrument of twelve months or more requires anyone to appear at a Sub-Registrar Office, and no online service can remove that.",
  },
  {
    step: "05",
    title: "We are a document service, not your lawyer",
    body: "We draft, stamp, notarise and deliver. Attestation is performed by an independent notary public appointed under the Notaries Act, 1952 — that is their act, not ours. We do not provide legal advice or representation, and we say so on every page.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About LP Stamp Paper"
        icon={Building2}
        crumbs={CRUMBS}
        title="Legal documents that ordinary people can actually read"
        body="An unstamped agreement can be refused in evidence under Section 35 of the Indian Stamp Act — which is how people lose deposits they were always entitled to. We exist to make the stamped, signed, admissible version the easy one to get, anywhere in Tamil Nadu."
      >
        <ButtonLink href={LEAD_ANCHOR} size="lg">
          Start my order
        </ButtonLink>
      </PageHero>

      <TrustBar />

      {/* Values */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we hold to"
            icon={Heart}
            title="Four positions we won't trade away"
            body="Legal technology gets a bad name when it optimises for conversion over the customer's actual interest. These are the guardrails."
          />

          <Stagger className="mt-16 grid gap-5 md:grid-cols-2" amount={0.1}>
            {VALUES.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="h-full p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-navy-950 text-white">
                    <value.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[17.5px] font-bold text-navy-950">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.75] text-navy-600">{value.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="section border-y border-line bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="How we got here" title="Five years, one problem" />

          <div className="mx-auto mt-16 max-w-3xl">
            <ol className="space-y-8">
              {PRINCIPLES.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.06}>
                  <li className="relative border-l-2 border-line pl-8 pb-2">
                    <span className="absolute -top-0.5 -left-[13px] size-6 rounded-full border-[5px] border-white bg-brand-600" />
                    <p className="tnum font-display text-[13px] font-bold tracking-wide text-brand-700">
                      {item.step}
                    </p>
                    <h3 className="mt-1 font-display text-[18px] font-bold text-navy-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.75] text-navy-600">{item.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Company facts */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="The legal bit"
            icon={Users}
            title="Who you are actually dealing with"
            body="A technology company, not a law firm. We say so plainly because the difference matters."
          />

          <Reveal delay={0.12}>
            <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-line bg-white">
              <dl className="divide-y divide-line">
                {([
                  ["Registered name", SITE.legalName],
                  // Rendered only once real numbers are supplied — see SITE in
                  // lib/site.ts. Publishing an invented CIN or GSTIN is not a
                  // placeholder, it is a false statement about the company.
                  ...(SITE.cin ? [["CIN", SITE.cin]] : []),
                  ...(SITE.gstin ? [["GSTIN", SITE.gstin]] : []),
                  ...(SITE.udyam ? [["Udyam registration", SITE.udyam]] : []),
                  ["Registered office", SITE.address],
                  ["Notarisation", "By an independent notary public appointed under the Notaries Act, 1952"],
                  ["Data handling", "Encrypted in transit and at rest; Aadhaar and PAN masked and never logged"],
                  ["Payment", "Taken by our team on the confirming call — the website collects none of it"],
                ] as Array<[string, string]>).map(([label, value]) => (
                  <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-[200px_1fr] sm:gap-4">
                    <dt className="text-[13.5px] font-semibold text-navy-500">{label}</dt>
                    <dd className="text-[14.5px] text-navy-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-canvas p-6 text-[14px] leading-[1.75] text-navy-600">
              <strong className="font-semibold text-navy-950">To be completely clear:</strong>{" "}
              LP Stamp Paper is a technology platform. We do not practise law and we do not represent
              you in a dispute. Notary attestation is performed by an independent notary
              public appointed under the Notaries Act, 1952, who is
              responsible for their own professional opinion. If your matter needs
              representation, we will tell you and point you toward it.
            </p>
          </Reveal>
        </div>
      </section>

      <Commitments />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
