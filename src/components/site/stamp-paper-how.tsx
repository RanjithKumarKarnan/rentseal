import { ArrowRight, FileText, Lock, ShieldCheck, Timer, Truck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { LEAD_ANCHOR } from "@/lib/site";

/**
 * How ordering stamp paper works, and why to order it here.
 *
 * The copy is the client's own, with one correction. Their draft said "No
 * branch visits — complete the entire process online", and the process is not
 * entirely online: nothing is charged on the site, the office rings to confirm
 * the order and takes payment on that call. What the customer is actually
 * spared is the queue at the vendor's counter, so that is what it says.
 */

const STEPS = [
  {
    icon: FileText,
    step: "Step 1",
    title: "Fill in the details",
    body: "Enter your requirements — the denomination, what the paper is for, and the executant's details — through our secure form.",
  },
  {
    icon: ShieldCheck,
    step: "Step 2",
    title: "We verify and authorise",
    body: "Your request is checked for compliance and the government authorised non-judicial stamp paper is prepared against it.",
  },
  {
    icon: Truck,
    step: "Step 3",
    title: "Delivered to your door",
    body: "The original non-judicial stamp paper reaches the address you gave us — authorised, and ready to use.",
  },
];

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Government authorised",
    body: "Every sheet comes through a licensed stamp vendor, and carries a number you can check against the Registration Department's own records.",
  },
  {
    icon: Timer,
    title: "No queue at the counter",
    body: "You never stand in line at a stamp vendor. Fill the form, take one call from us to confirm, and the paper comes to you.",
  },
  {
    icon: Truck,
    title: "Delivered across Tamil Nadu",
    body: "Same day inside Chennai by Porter at cost, ₹100 next day, ₹200 express anywhere in Tamil Nadu, and ₹100 in two to three working days.",
  },
  {
    icon: Lock,
    title: "Handled in confidence",
    body: "Your details are used to prepare your document and nothing else. Aadhaar and PAN are masked in the interface and never written to a log.",
  },
];

export function StampPaperHow() {
  return (
    <>
      <section id="how-it-works" className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            icon={FileText}
            title="Three steps, and the paper is at your door"
            body="No branch visit, no queue at the vendor's counter. Nothing is charged on this site — we ring you to confirm the order and take payment on that call."
          />

          <Stagger className="mt-12 grid gap-5 md:grid-cols-3" amount={0.15}>
            {STEPS.map(({ icon: Icon, step, title, body }) => (
              <StaggerItem key={step}>
                <div className="relative flex h-full flex-col rounded-2xl border border-line bg-canvas p-6 transition-all duration-300 hover:border-brand-300 hover:bg-white hover:shadow-lift">
                  <span className="grid size-12 place-items-center rounded-xl bg-navy-950 text-white">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-5 text-[11px] font-bold tracking-[0.14em] text-brand-700 uppercase">
                    {step}
                  </p>
                  <h3 className="mt-1.5 font-display text-[17px] font-bold text-navy-950">
                    {title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[14px] leading-[1.7] text-navy-500">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center">
              <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
                Get started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line bg-canvas">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why order here"
            icon={ShieldCheck}
            title="Genuine paper, and you can prove it"
            body="The point of non-judicial stamp paper is that it stands up later. Everything below is something you can check rather than take on trust."
          />

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2" amount={0.1}>
            {REASONS.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title}>
                <div className="flex h-full gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[15.5px] font-bold text-navy-950">{title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-[1.7] text-navy-500">{body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
