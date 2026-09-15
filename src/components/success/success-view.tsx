import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/link";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  FileSignature,
  Loader2,
  Mail,
  MessageCircle,
  PenTool,
  Phone,
  Scale,
  Stamp,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const PIPELINE = [
  {
    id: "received",
    icon: Check,
    title: "Draft received",
    body: "It is in front of our team with everything you entered.",
    ms: 0,
  },
  {
    id: "call",
    icon: Phone,
    title: "We call to confirm",
    body: "Within 30 minutes in working hours. We check the details and take payment on that call.",
    ms: 900,
  },
  {
    id: "lawyer",
    icon: Scale,
    title: "Notary attestation",
    body: "A notary public attests the signatures once both parties have signed.",
    ms: 1400,
  },
  {
    id: "stamp",
    icon: Stamp,
    title: "e-Stamp procured and affixed",
    body: "Duty remitted to the Government of Tamil Nadu. Certificate attached to page 1.",
    ms: 3000,
  },
  {
    id: "sign",
    icon: PenTool,
    title: "Signature links sent",
    body: "Both parties get an Aadhaar OTP link. The agreement is final once both sign.",
    ms: 4600,
  },
  {
    id: "deliver",
    icon: MessageCircle,
    title: "Delivered on email and WhatsApp",
    body: "A copy also lives in your dashboard permanently.",
    ms: 6200,
  },
] as const;

export function SuccessView({ agreementId }: { agreementId: string }) {
  const [stage, setStage] = useState(0);
  const fired = useRef(false);

  // Celebrate once, then walk the delivery pipeline.
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      const burst = (particleRatio: number, opts: confetti.Options) =>
        confetti({
          origin: { y: 0.62 },
          colors: ["#2563EB", "#10B981", "#0F172A", "#F59E0B", "#93C5FD"],
          particleCount: Math.floor(220 * particleRatio),
          ...opts,
        });
      burst(0.25, { spread: 26, startVelocity: 55 });
      burst(0.2, { spread: 60 });
      burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      burst(0.1, { spread: 120, startVelocity: 45 });
    }

    const timers = PIPELINE.map((step, i) =>
      setTimeout(() => setStage(i + 1), step.ms + 600),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const done = stage >= PIPELINE.length;

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-500 shadow-[0_12px_40px_-12px_rgb(16_185_129/0.7)]"
          >
            <BadgeCheck className="size-10 text-white" strokeWidth={2.2} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 text-[clamp(2rem,5vw,3rem)] leading-[1.1] font-bold tracking-[-0.03em] text-navy-950"
          >
That&apos;s it — we have your agreement.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 text-[17px] leading-[1.7] text-navy-600"
          >
            Draft{" "}
            <span className="font-semibold text-navy-950">{agreementId}</span> is with our team.
            Nothing has been charged — someone will call you to confirm the details and take
            payment, and then we stamp it and get it to you. Quote that number if you call us
            first.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          >
            {/*
              No download here, deliberately.

              The finished instrument is the thing being paid for, and handing
              over a copy before the confirming call gives it away — the same
              reason printing and copying are off in the drafter, and the same
              reason the deed is emailed to the office and not to the customer.
              This used to be a "Download PDF" button that called window.print(),
              which was both a policy hole and a lie about what it did: it opens
              a print dialog for this page, not the agreement.

              What someone actually wants at this point is to reach a person, so
              that is what the buttons do.
            */}
            <ButtonLink href={`tel:${SITE.phone.replace(/\s/g, "")}`} size="lg">
              <Phone className="size-[18px]" />
              Call {SITE.phone}
            </ButtonLink>
            <ButtonLink
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
              variant="secondary"
              size="lg"
            >
              <MessageCircle className="size-[18px]" />
              WhatsApp us
            </ButtonLink>
          </motion.div>
        </div>

        {/* Pipeline */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-line bg-navy-50 px-6 py-4">
              <h2 className="font-display text-[15px] font-bold text-navy-950">
                What happens next
              </h2>
              <Badge tone={done ? "emerald" : "brand"}>
                {done ? (
                  <>
                    <Check className="size-3" strokeWidth={3.5} />
                    Complete
                  </>
                ) : (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    In progress
                  </>
                )}
              </Badge>
            </div>

            <ol className="divide-y divide-line">
              {PIPELINE.map((step, i) => {
                const complete = stage > i;
                const active = stage === i;
                return (
                  <li key={step.id} className="flex items-start gap-4 px-6 py-5">
                    <span
                      className={cn(
                        "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500",
                        complete
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-brand-600 text-white"
                            : "bg-navy-100 text-navy-400",
                      )}
                    >
                      {complete ? (
                        <Check className="size-4" strokeWidth={3} />
                      ) : active ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <step.icon className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-[14.5px] font-semibold transition-colors",
                          complete || active ? "text-navy-950" : "text-navy-400",
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-navy-500">
                        {step.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Delivery destinations */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Mail,
                tint: "text-brand-600 bg-brand-50",
                title: "Sent to your email",
                body: "The stamped PDF and the invoice, to both parties.",
              },
              {
                icon: MessageCircle,
                tint: "text-emerald-600 bg-emerald-50",
                title: "Sent on WhatsApp",
                body: `From ${SITE.whatsapp}. Save the number.`,
              },
            ].map((d) => (
              <div key={d.title} className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", d.tint)}>
                  <d.icon className="size-5" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-navy-950">{d.title}</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-500">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Signature nudge */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-navy-950 p-6 text-white sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
                <FileSignature className="size-5 text-brand-400" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[16.5px] font-bold">
                  One thing still needs you
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                  Both parties complete an Aadhaar OTP to finalise the agreement. We set that up
                  on the confirming call and send the link to each number you entered — there is
                  nothing to do until then.
                </p>
                {/*
                  This pointed at /dashboard, which does not exist, so both
                  buttons on this page were 404s. Telling someone to track their
                  signature somewhere they cannot reach is worse than not
                  offering it, so it says who to ask instead.
                */}
                <p className="mt-4 text-[13.5px] text-white/45">
                  Quote {agreementId} if you ring us before we ring you.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[13.5px] text-navy-500">
            Something not right?{" "}
            <Link href="/contact" className="font-semibold text-brand-700 underline underline-offset-4">
              Tell us within 48 hours
            </Link>{" "}
            and we will re-issue at cost.
          </p>
        </div>
      </div>
    </div>
  );
}
