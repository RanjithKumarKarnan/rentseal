import { Check, Scale, X } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { LogoMark } from "@/components/ui/logo";
import { CHEAPEST_TEMPLATE_PRICE } from "@/lib/template-prices";
import { inr } from "@/lib/utils";

const ROWS = [
  { label: "Time to a signed document", old: "3–5 days", now: "Under 10 minutes" },
  { label: "Trips to the Sub-Registrar", old: "1–2 visits, half a day each", now: "None for 11-month agreements" },
  { label: "Drafting", old: "Typist copy-pastes a generic template", old2: true, now: "Clauses generated from your actual answers" },
  { label: "Non-judicial stamp paper", old: "Hunt for a licensed vendor", now: "Procured and delivered to your door" },
  { label: "Signatures", old: "Both parties in the same room", now: "Aadhaar OTP from anywhere" },
  { label: "Notarisation", old: "Find a notary, queue, pay cash", now: "Arranged for you" },
  { label: "Your copy in three years", old: "A folder, if you kept it", now: "In your dashboard, always" },
  { label: "Cost", old: "₹1,500–4,000 in fees and running around", now: `From ${inr(CHEAPEST_TEMPLATE_PRICE)} plus government duty` },
];

export function Comparison() {
  return (
    <section className="section relative overflow-hidden bg-navy-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 size-[560px] rounded-full bg-brand-600/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-40 size-[460px] rounded-full bg-emerald-500/10 blur-[120px]"
      />

      <div className="relative container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase backdrop-blur">
              <Scale className="size-3.5" />
              The old way vs LP Stamp Paper
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-[clamp(1.85rem,4.2vw,2.85rem)] leading-[1.12] font-bold text-white">
              You already know how this normally goes.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-[16.5px] leading-[1.7] text-white/55">
              A typist near the court, a stamp vendor who is closed, and a friend who
              &ldquo;knows someone&rdquo;. Here is the same job, done differently.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] backdrop-blur-sm">
            {/* header */}
            <div className="grid grid-cols-[1fr_1fr] border-b border-white/10 sm:grid-cols-[1.3fr_1fr_1fr]">
              <div className="hidden p-5 sm:block" />
              <div className="border-l border-white/10 p-5 text-center">
                <p className="text-[13px] font-bold tracking-wide text-white/40 uppercase">
                  The usual way
                </p>
              </div>
              <div className="border-l border-white/10 bg-brand-600/12 p-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <LogoMark className="size-5" />
                  <p className="text-[13px] font-bold tracking-wide text-white uppercase">
                    LP Stamp Paper
                  </p>
                </div>
              </div>
            </div>

            {ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_1fr] border-b border-white/[0.07] last:border-0 sm:grid-cols-[1.3fr_1fr_1fr]"
              >
                <div className="col-span-2 px-5 pt-4 pb-1 sm:col-span-1 sm:py-5">
                  <p className="text-[14.5px] font-semibold text-white/85">{row.label}</p>
                </div>
                <div className="flex items-start gap-2.5 border-white/10 p-5 sm:border-l">
                  <X className="mt-0.5 size-4 shrink-0 text-rose-400/70" />
                  <p className="text-[13.5px] leading-snug text-white/45">{row.old}</p>
                </div>
                <div className="flex items-start gap-2.5 border-l border-white/10 bg-brand-600/[0.09] p-5">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" strokeWidth={3} />
                  <p className="text-[13.5px] leading-snug font-medium text-white/90">{row.now}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
