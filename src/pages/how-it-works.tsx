import type { PageMeta } from "@/seo/meta";
import { Route } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { FaqSection } from "@/components/landing/faq-section";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { LEAD_ANCHOR, SITE } from "@/lib/site";
import { rentAgreementPrice } from "@/lib/stamp-duty";

export const meta: PageMeta = {
  title: "How It Works — Form to Signed Agreement",
  description:
    "Every step explained: the form, the clauses, the confirming call, payment, e-stamping, Aadhaar e-signing and delivery on non-judicial stamp paper.",
  alternates: { canonical: "/how-it-works" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "How It Works" }];

const DETAIL = [
  {
    n: "01",
    title: "You answer questions, not a legal form",
    body: "We ask about the property, the two parties, the money and the house rules — in the order a person would naturally think about them. Nothing is phrased in legalese, every field has a one-line explanation, and nothing is mandatory until it actually matters. Your answers save to your device as you type, so closing the tab costs you nothing.",
    aside: "About 40 fields. Most people finish in six to ten minutes.",
  },
  {
    n: "02",
    title: "The clauses assemble themselves",
    body: "This is the part that replaces a typist. Say the flat is semi-furnished and an inventory clause plus Schedule B appear. Set a lock-in of six months and a reciprocal lock-in clause is written for both sides — not just the tenant. Allow commercial use and trade-licence, GST and fit-out obligations are added. You never draft anything.",
    aside: "20 clause rules, 8 of them conditional on your answers.",
  },
  {
    n: "03",
    title: "You read the whole thing before anything is charged",
    body: "The full document sits beside the form the entire time, updating as you type. Anything you have not filled in shows as a shaded blank so gaps are impossible to miss. Nothing is added later — what you read is what gets stamped.",
    aside: "Expand it to full screen at any point.",
  },
  {
    n: "04",
    title: "You send it, and we call you",
    body: "Sending costs nothing and commits you to nothing. Your draft lands with our team along with everything you entered — the parties, the property, the term, the rent. Someone reads it, rings the number you gave, confirms the details and the final figure, and takes payment on that call. There is no checkout on this website.",
    aside: "Within 30 minutes during working hours.",
  },
  {
    n: "05",
    title: "We pay the government, at cost",
    body: "Stamp duty is computed at 1% of the total rent over the term plus the deposit and remitted in full to the Government of Tamil Nadu. It appears as its own line on your invoice, separate from our fee, and GST is charged only on our fee. If the Registration Department debits a different figure, we refund the difference.",
    aside: "Duty and registration fee shown separately, always.",
  },
  {
    n: "06",
    title: "Both parties sign from wherever they are",
    body: "Each party gets a link on the mobile number you entered. They verify with an Aadhaar OTP and sign. This carries the same legal effect as a wet signature under Section 3A of the Information Technology Act, 2000. Nobody has to be in the same room, or the same city.",
    aside: "Typically both signatures land within the hour.",
  },
  {
    n: "07",
    title: "It arrives, three ways at once",
    body: "The finished PDF downloads immediately, goes to both parties by email, and arrives on WhatsApp. It also stays in your dashboard permanently — so when you need it three years later for a deposit dispute or a bank KYC, it is one search away. We remind you 45 days before it expires.",
    aside: "Premium adds a printed stamped copy by courier.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="The process"
        icon={Route}
        crumbs={CRUMBS}
        title="What actually happens between your first click and a signed agreement"
        body="No black box. Here is every step, including the parts where a human being is involved and the parts where the law says you still have to show up in person."
      >
        <ButtonLink href={LEAD_ANCHOR} size="lg">
          Start my order
        </ButtonLink>
      </PageHero>

      <HowItWorks />

      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="In detail"
            title="The same four steps, with nothing left out"
            body="If you want to know exactly what we do with your data, your money and your document — this is it."
          />

          <div className="mx-auto mt-16 max-w-3xl">
            <ol className="space-y-10">
              {DETAIL.map((item, i) => (
                <Reveal key={item.n} delay={i * 0.05}>
                  <li className="relative border-l-2 border-line pl-8 pb-2">
                    <span className="absolute -top-1 -left-[17px] grid size-8 place-items-center rounded-full border-2 border-line bg-white font-display text-[12px] font-bold text-navy-950">
                      {item.n}
                    </span>
                    <h3 className="font-display text-[19px] font-bold text-navy-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.75] text-navy-600">{item.body}</p>
                    <p className="mt-3 inline-block rounded-lg border border-line bg-canvas px-3.5 py-2 text-[12.5px] font-medium text-navy-500">
                      {item.aside}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Features />
      <FaqSection limit={10} />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to create a rental agreement online in Tamil Nadu",
            totalTime: "PT10M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              currency: "INR",
              value: String(rentAgreementPrice("standard")),
            },
            step: DETAIL.map((d, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: d.title,
              text: d.body,
            })),
          }),
        }}
      />
    </>
  );
}
