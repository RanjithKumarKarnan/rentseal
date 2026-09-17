import { CheckCircle2, Mail, Stamp, Truck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { DENOMINATIONS } from "@/lib/stamp-paper";

/**
 * Physical stamp paper or an e-Stamp — the choice most buyers are making when
 * they search, whether they call it "physical", "hard copy" or "bond paper".
 * Every line here restates what the rate card and the FAQ already promise.
 */

const SHEETS = DENOMINATIONS.filter((d) => d.value > 0).map((d) => d.label);

const FORMATS = [
  {
    icon: Truck,
    title: "Physical (hard copy) stamp paper",
    body: `The original, government-issued non-judicial sheet, in ${SHEETS.slice(0, -1).join(", ")} and ${SHEETS[SHEETS.length - 1]}. Your document is printed on it, signed in ink and kept as the hard copy — what most rent agreements, affidavits, indemnity bonds and powers of attorney in Tamil Nadu are executed on.`,
    points: [
      "Delivered to your door — same day in Chennai",
      "Your draft printed on it if you send one",
      "₹100 sheet for ₹120",
    ],
  },
  {
    icon: Mail,
    title: "e-Stamp certificate",
    body: "A certificate for the exact duty an instrument attracts, from ₹1 upward. It is emailed rather than delivered, and it is what a lease deed, sale agreement or mortgage needs when the duty is a specific figure.",
    points: [
      "Emailed within minutes",
      "Any value from ₹1",
      "Government duty passed through at cost",
    ],
  },
];

export function StampPaperFormats() {
  return (
    <section id="physical-or-e-stamp" className="section scroll-mt-20 border-t border-line bg-canvas">
      <div className="container-page">
        <SectionHeading
          eyebrow="Physical or e-Stamp?"
          icon={Stamp}
          title="Physical stamp paper, hard copy delivered — or an e-Stamp by email"
          body="We supply both. Tell us what you are executing and we will say which one it needs before you order."
        />

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2" amount={0.1}>
          {FORMATS.map(({ icon: Icon, title, body, points }) => (
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
