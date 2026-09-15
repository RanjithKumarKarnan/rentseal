import Link from "@/components/ui/link";
import { HelpCircle, MessageCircle, Phone } from "lucide-react";
import { FAQS, SITE } from "@/lib/site";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export function FaqSection({ limit = 8 }: { limit?: number }) {
  const items = FAQS.slice(0, limit);

  return (
    <section id="faq" className="section bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Questions"
          icon={HelpCircle}
          title="The things people ask before they trust us with a legal document"
          body="Straight answers, including the ones that are inconvenient for us."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <Accordion items={items} defaultOpen={0} />
            {limit < FAQS.length ? (
              <p className="mt-6 text-center text-[14px] text-navy-500">
                <Link
                  href="/faq"
                  className="font-semibold text-brand-700 underline underline-offset-4"
                >
                  Read all {FAQS.length} questions
                </Link>
              </p>
            ) : null}
          </Reveal>

          <Reveal delay={0.12}>
            <div className="sticky top-24 rounded-2xl border border-line bg-navy-950 p-7 text-white">
              <div className="grid size-11 place-items-center rounded-xl bg-white/10">
                <MessageCircle className="size-5 text-emerald-400" />
              </div>
              <h3 className="mt-5 font-display text-[18px] font-bold">Still unsure?</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-white/60">
                Talk to a real person in Tamil or English before you spend a rupee.
                We would rather answer your question than take a payment you regret.
              </p>

              <div className="mt-6 space-y-2.5">
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-3 transition-colors hover:bg-white/[0.12]"
                >
                  <MessageCircle className="size-4 shrink-0 text-emerald-400" />
                  <span>
                    <span className="block text-[13.5px] font-semibold">WhatsApp us</span>
                    <span className="block text-[12px] text-white/45">Usually replies in 4 minutes</span>
                  </span>
                </a>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-3 transition-colors hover:bg-white/[0.12]"
                >
                  <Phone className="size-4 shrink-0 text-brand-400" />
                  <span>
                    <span className="block text-[13.5px] font-semibold">{SITE.phone}</span>
                    <span className="block text-[12px] text-white/45">{SITE.hours.summary}</span>
                  </span>
                </a>
              </div>

              <ButtonLink href="/contact" size="md" fullWidth className="mt-5">
                Send a message
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** FAQPage structured data — emitted next to the visible accordion. */
export function FaqSchema({ limit = FAQS.length }: { limit?: number }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.slice(0, limit).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
