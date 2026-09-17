import { CheckCircle2, Printer, Stamp, Truck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { NOTARY_FEE } from "@/lib/notary";
import { DENOMINATIONS } from "@/lib/stamp-paper";
import { inr } from "@/lib/utils";

/**
 * Physical stamp paper, said plainly — what buyers mean when they search for
 * "physical", "hard copy" or "bond paper". Every line here restates what the
 * rate card and the FAQ already promise.
 */

const SHEETS = DENOMINATIONS.map((d) => d.label);
const HUNDRED = DENOMINATIONS.find((d) => d.value === 100);

const CARDS = [
  {
    icon: Truck,
    title: "Physical (hard copy) stamp paper",
    body: `The original, government-issued non-judicial sheet, in ${SHEETS.slice(0, -1).join(", ")} and ${SHEETS[SHEETS.length - 1]}. A rider brings it to your door, and a document that needs a higher value goes on a combination of sheets.`,
    points: [
      "Delivered to your door — same day in Chennai",
      HUNDRED ? `${HUNDRED.label} sheet for ${inr(HUNDRED.price)}` : "Priced before you order",
      "Serial number printed on your invoice",
    ],
  },
  {
    icon: Printer,
    title: "Printed, signed and attested",
    body: "Send your draft, or write it here, and it comes back printed on the stamp paper with the margins a sub-registrar expects. Signed in ink, it is the hard copy most rent agreements, affidavits, indemnity bonds and powers of attorney in Tamil Nadu are executed on.",
    points: [
      "Your draft printed on it if you send one",
      `Notary attestation for ${inr(NOTARY_FEE)}`,
      "Told the right denomination before you order",
    ],
  },
];

export function StampPaperFormats() {
  return (
    <section id="physical-stamp-paper" className="section scroll-mt-20 border-t border-line bg-canvas">
      <div className="container-page">
        <SectionHeading
          eyebrow="Physical stamp paper"
          icon={Stamp}
          title="Physical non-judicial stamp paper — the hard copy, delivered"
          body="Tell us what you are executing and we will say which denomination it needs before you order."
        />

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2" amount={0.1}>
          {CARDS.map(({ icon: Icon, title, body, points }) => (
            <StaggerItem key={title}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft">
                <span className="grid size-11 place-items-center rounded-xl bg-navy-950 text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-[17px] font-bold text-navy-950">{title}</h3>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-navy-500">{body}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-5">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[13.5px] text-navy-600">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[14px] leading-relaxed text-navy-500">
            Many people in Tamil Nadu ask for the physical sheet as bond paper or
            முத்திரைத்தாள் — it is the same non-judicial stamp paper.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
