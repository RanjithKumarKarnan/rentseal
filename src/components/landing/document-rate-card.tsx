import Link from "@/components/ui/link";
import { ReceiptText } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { NOTARY_FEE, isNotaryMandatory } from "@/lib/notary";
import { DENOMINATIONS } from "@/lib/stamp-paper";
import { templatePrice } from "@/lib/template-prices";
import { getTemplatesByCategory } from "@/lib/templates";
import { inr } from "@/lib/utils";

/**
 * The office's rate card, document by document.
 *
 * Every figure is read from template-prices.ts — the list the builder quotes
 * from — so this table and the order form cannot disagree. Shipping is left out
 * on purpose: it depends on where the paper goes, and is quoted separately.
 */

const HUNDRED = DENOMINATIONS.find((d) => d.value === 100);

export function DocumentRateCard() {
  const groups = getTemplatesByCategory();
  const count = groups.reduce((n, g) => n + g.templates.length, 0);

  return (
    <section id="rate-card" className="section scroll-mt-20 border-t border-line bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Rate card"
          icon={ReceiptText}
          title={`What each of the ${count} documents costs to draft`}
          body={`This is the price on every plan. Non-judicial stamp paper is charged at its own rate${HUNDRED?.price ? ` (${HUNDRED.label} sheet for ${inr(HUNDRED.price)})` : ""}, notary attestation is ${inr(NOTARY_FEE)} where you want it or the document needs it, and shipping is quoted separately.`}
        />

        <Stagger className="mt-12 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3" amount={0.05}>
          {groups.map(({ category, templates }) => (
            <StaggerItem key={category}>
              <div className="overflow-hidden rounded-2xl border border-line bg-canvas/60">
                <h3 className="border-b border-line bg-navy-50 px-5 py-3 font-display text-[14.5px] font-bold text-navy-950">
                  {category}
                  <span className="ml-2 text-[12px] font-medium text-navy-400">{templates.length}</span>
                </h3>
                <ul className="divide-y divide-line">
                  {templates.map((template) => (
                    <li key={template.id}>
                      <Link
                        href={`/create/${template.id}`}
                        className="flex items-start justify-between gap-4 px-5 py-2.5 transition-colors hover:bg-white"
                      >
                        <span className="min-w-0 text-[13.5px] leading-snug text-navy-700">
                          {template.name}
                          {isNotaryMandatory(template.id) ? (
                            <span className="mt-0.5 block text-[11.5px] text-navy-400">
                              + {inr(NOTARY_FEE)} notary, required
                            </span>
                          ) : null}
                        </span>
                        <span className="tnum shrink-0 text-[14px] font-bold text-navy-950">
                          {inr(templatePrice(template.id))}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <p className="mt-8 text-[13px] leading-relaxed text-navy-500">
            Government stamp duty and registration fees pass through at cost. GST applies to our
            charges alone. Tap any document to start drafting it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
