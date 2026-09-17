import { BadgeCheck, FileCheck2, Receipt, RefreshCw, Scale, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Replaces the testimonial carousel.
 *
 * That section carried six named reviews with cities and job titles, none of
 * which were real. Invented social proof is the fastest way for a legal-services
 * business to lose the trust it is trying to buy, and it cannot be corrected
 * later — the names are already published.
 *
 * These are commitments instead: each one is a decision we control, true from
 * the first order, and specific enough to be held to.
 */
const COMMITMENTS = [
  {
    icon: Receipt,
    title: "Government charges at cost",
    body: "Stamp duty and registration fees pass through at exactly the rate the state levies, shown as a separate line on your invoice. We earn the platform fee and nothing else, and GST applies to that fee alone.",
  },
  {
    icon: BadgeCheck,
    title: "Every certificate is verifiable",
    body: "Each sheet carries a serial number you can check against the Registration Department's records. We print it on your invoice so you can verify us without asking us.",
  },
  {
    icon: Scale,
    title: "We tell you when you don't need us",
    body: "If an 11-month agreement does the job, we will not sell you a registered lease. If your term crosses 12 months we flag the registration you cannot avoid, before you pay rather than after.",
  },
  {
    icon: FileCheck2,
    title: "You see the document before you commit",
    body: "The full agreement is on screen while you fill it in. Clauses appear and disappear as your answers change, so nothing in the final PDF is boilerplate you never read.",
  },
  {
    icon: RefreshCw,
    title: "Refunds without a process",
    body: "Cancel before the stamp paper is procured and you get everything back — no form, no questions. After that, the paper's value is genuinely gone, but our fee comes back in full if the fault is ours.",
  },
  {
    icon: ShieldCheck,
    title: "Your identity data stays yours",
    body: "Aadhaar and PAN are encrypted at rest, masked everywhere in the interface, and never written to a log. We do not sell data and we do not pass it to anyone but the stamping authority.",
  },
];

export function Commitments() {
  return (
    <section className="section border-y border-line bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="What we commit to"
          icon={ShieldCheck}
          title="Six promises, in writing"
          body="We would rather be judged on what we guarantee than on numbers you cannot check. Each of these applies to your first order."
        />

        <Stagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" amount={0.1}>
          {COMMITMENTS.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="h-full p-6">
                <span className="grid size-10 place-items-center rounded-xl border border-brand-200/80 bg-brand-50/70 text-brand-700">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-[16.5px] font-bold text-navy-950">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-navy-500">{item.body}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
