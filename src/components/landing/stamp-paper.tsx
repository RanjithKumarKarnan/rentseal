import Link from "@/components/ui/link";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  Bike,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Stamp,
  Truck,
} from "lucide-react";
import { DELIVERY_RULES, DELIVERY_ZONES, DENOMINATIONS } from "@/lib/stamp-paper";
import { LEAD_ANCHOR } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { StampSheet } from "@/components/ui/stamp-sheet";
import { cn, inr } from "@/lib/utils";

export function StampPaper() {
  const [selected, setSelected] = useState(100);
  const active = DENOMINATIONS.find((d) => d.value === selected) ?? DENOMINATIONS[0];

  return (
    <section id="stamp-paper" className="section scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Non-judicial stamp paper, delivered"
          icon={Stamp}
          title="Licensed non-judicial stamp paper at your door, anywhere in Tamil Nadu"
          body="No hunting for a vendor who has shut for lunch, no queue at the treasury. Tell us the denomination and the address — we fetch the paper and a rider brings it to you, with the face value and our charge shown separately."
        />

        <div className="mt-11 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* ── Denominations ──────────────────────────────── */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-[18px] font-bold text-navy-950">
                    Choose your denomination
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-navy-500">
                    Four physical denominations from ₹120, and e-Stamp certificates for any
                    value. The paper is delivered; the e-Stamp is emailed.
                  </p>
                </div>
                <Badge tone="emerald" className="hidden shrink-0 sm:inline-flex">
                  <BadgeIndianRupee className="size-3" />
                  Priced up front
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {DENOMINATIONS.map((d) => {
                  const isActive = d.value === selected;
                  return (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelected(d.value)}
                      aria-pressed={isActive}
                      className={cn(
                        "relative rounded-xl border p-4 text-left transition-all duration-200",
                        isActive
                          ? "border-brand-600 bg-brand-600 text-white shadow-[0_8px_24px_-8px_rgb(37_99_235/0.55)]"
                          : "border-line bg-white hover:border-navy-300 hover:bg-navy-50/60",
                      )}
                    >
                      {d.popular ? (
                        <span
                          className={cn(
                            "absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase",
                            isActive ? "bg-white text-brand-700" : "bg-navy-950 text-white",
                          )}
                        >
                          Most used
                        </span>
                      ) : null}
                      <StampSheet
                        value={d.value}
                        label={d.label}
                        className={cn(
                          "mb-2.5 rounded-[3px] shadow-sm ring-1",
                          isActive ? "ring-white/40" : "ring-navy-950/10",
                        )}
                      />
                      <span
                        className={cn(
                          "block font-display text-[20px] font-bold tracking-tight",
                          isActive ? "text-white" : "text-navy-950",
                        )}
                      >
                        {d.label}
                      </span>
                      <span
                        className={cn(
                          "tnum mt-0.5 block text-[11.5px] leading-snug",
                          isActive ? "text-white/70" : "text-navy-400",
                        )}
                      >
                        {d.value === 0
                          ? "Emailed, any value"
                          : d.price === null
                            ? "Price on request"
                            : `${inr(d.price)} a sheet`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* What it's used for */}
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 rounded-2xl border border-line bg-white p-5"
              >
                <p className="text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                  {active.label} is commonly used for
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {active.uses.map((use) => (
                    <li
                      key={use}
                      className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-navy-600"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      {use}
                    </li>
                  ))}
                </ul>
                {active.note ? (
                  <p className="mt-3.5 border-t border-line pt-3.5 text-[12.5px] leading-relaxed text-navy-500">
                    {active.note}
                  </p>
                ) : null}
              </motion.div>

              <ButtonLink href={LEAD_ANCHOR} size="lg" fullWidth className="mt-5 group">
                Order {active.label} non-judicial stamp paper
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
            </div>
          </Reveal>

          {/* ── Delivery ───────────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-3xl border border-line bg-navy-950 p-6 text-white sm:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-white/10">
                  <Truck className="size-5 text-brand-400" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold">
                  Delivered across all 38 districts
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                  Same day inside Chennai by Porter at cost, ₹100 next day, and ₹100 to ₹200
                  everywhere else in Tamil Nadu depending on how fast you need it.
                </p>

                <ul className="mt-6 space-y-3">
                  {DELIVERY_ZONES.map((zone) => (
                    <li
                      key={zone.id}
                      className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-white">{zone.name}</p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">
                          {zone.districts.slice(0, 4).join(", ")}
                          {zone.districts.length > 4 ? ` +${zone.districts.length - 4} more` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="flex items-center justify-end gap-1.5 text-[13px] font-bold text-emerald-400">
                          <Clock3 className="size-3.5" />
                          {zone.eta}
                        </p>
                        <p className="tnum mt-0.5 text-[11.5px] text-white/45">
                          {inr(zone.charge)} delivery
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2 rounded-xl bg-white/[0.07] p-4">
                  {[
                    `Delivery is free above ${inr(DELIVERY_RULES.freeAbovePaperValue)} of physical paper`,
                    `Free everywhere on ${DELIVERY_RULES.bulkFreeFrom} sheets or more`,
                    "e-Stamp certificates are emailed, so nothing is delivered and their value does not count towards that threshold",
                  ].map((line) => (
                    <p key={line} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-white/70">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Licensed source",
                    body: "Procured through authorised vendors and the state e-Stamp channel. Every sheet is verifiable.",
                  },
                  {
                    icon: Bike,
                    title: "Priced before you order",
                    body: "The face value and our charge are shown separately, and delivery is quoted on the call. Nothing appears at the door.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-line bg-canvas p-5">
                    <item.icon className="size-5 text-brand-600" />
                    <h4 className="mt-3.5 font-display text-[14.5px] font-bold text-navy-950">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-500">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/*
          The six "which denomination do I need" cards used to sit here. They
          are roughly 1,700px of scroll on a phone and they already appear, in
          full, on all 38 /stamp-paper/[district] pages — which is where someone
          asking that question actually lands from search. A single line does
          the job here.
        */}
        <Reveal>
          <p className="mt-9 text-center text-[14px] text-navy-500">
            Not sure which denomination you need?{" "}
            <Link
              href="/stamp-paper"
              className="font-semibold text-brand-700 underline underline-offset-4"
            >
              See what each one is used for
            </Link>
            , or tell us what you are executing and we will confirm it before you order.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
