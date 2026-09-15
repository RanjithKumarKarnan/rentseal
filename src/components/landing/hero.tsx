import Link from "@/components/ui/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileSignature,
  MapPin,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Stamp,
  Truck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { BUILDER_START, LEAD_ANCHOR } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const PROOF_POINTS = [
  { icon: Truck, label: "Same-day delivery in Chennai" },
  { icon: MapPin, label: "All 38 districts covered" },
  { icon: Stamp, label: "₹100 paper for ₹120" },
  { icon: FileSignature, label: "Agreements in 10 minutes" },
];

/** The document mock that anchors the hero — an agreement mid-generation. */
function AgreementMock() {
  return (
    <div className="relative rounded-2xl border border-line bg-white p-6 shadow-lift sm:p-7">
      {/* window chrome */}
      <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <span className="ml-1.5 text-[11.5px] font-semibold tracking-wide text-navy-400">
            LP-2026-448120 · Draft
          </span>
        </div>
        <Badge tone="emerald" className="gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Auto-saved
        </Badge>
      </div>

      {/* title block */}
      <div className="text-center">
        <p className="text-[9px] font-bold tracking-[0.22em] text-navy-400 uppercase">
          Government of Tamil Nadu · e-Stamp
        </p>
        {/* Set as text, not a heading. It is the title printed on a drawing
            of an agreement, and marking it up as h3 put a level-three heading
            straight under the page's h1 in the outline. */}
        <p className="mt-2 font-display text-[15px] font-bold tracking-tight text-navy-950">
          RESIDENTIAL RENTAL AGREEMENT
        </p>
        <p className="mt-1 text-[10.5px] text-navy-400">
          Executed at Chennai on 12 August 2026
        </p>
      </div>

      {/* body lines */}
      <div className="mt-5 space-y-4">
        {[
          { label: "1. Grant of Tenancy", widths: [100, 94, 68] },
          { label: "2. Rent", widths: [100, 82] },
          { label: "3. Security Deposit", widths: [100, 97, 55] },
        ].map((block) => (
          <div key={block.label}>
            <p className="mb-1.5 text-[10.5px] font-bold tracking-tight text-navy-800">
              {block.label}
            </p>
            <div className="space-y-1.5">
              {block.widths.map((w, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded-full bg-navy-100"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${w}%`, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.09, ease: EASE }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* a clause appearing live */}
      <motion.div
        initial={{ opacity: 0, y: 10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
        className="mt-4 overflow-hidden"
      >
        <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold text-brand-700">
            <Sparkles className="size-3" />
            CLAUSE ADDED — Pets allowed
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-brand-200/70" />
            <div className="h-1.5 w-[72%] rounded-full bg-brand-200/70" />
          </div>
        </div>
      </motion.div>

      {/* signature row */}
      <div className="mt-6 flex items-end justify-between border-t border-dashed border-line pt-4">
        {["Landlord", "Tenant"].map((role, i) => (
          <div key={role} className="w-[42%]">
            <svg viewBox="0 0 120 28" className="h-7 w-full text-navy-800" aria-hidden="true">
              <motion.path
                d={
                  i === 0
                    ? "M4 20c8-14 14 6 20-2s8-12 14-4 10 12 18 2 14-8 22-2 12 4 18 0"
                    : "M4 18c6-10 12 8 18 0s10-14 16-6 8 14 16 4 12-6 20-2 16 2 22-2"
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 2 + i * 0.35, ease: "easeInOut" }}
              />
            </svg>
            <div className="mt-1 border-t border-navy-300 pt-1.5">
              <p className="text-[9.5px] font-semibold text-navy-500">{role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* stamp */}
      <motion.div
        initial={{ opacity: 0, scale: 1.6, rotate: -24 }}
        animate={{ opacity: 1, scale: 1, rotate: -14 }}
        transition={{ duration: 0.55, delay: 2.9, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute right-5 bottom-16 sm:right-7"
      >
        <div className="grid size-[76px] place-items-center rounded-full border-[2.5px] border-emerald-600/60 text-center">
          <div className="grid size-[64px] place-items-center rounded-full border border-emerald-600/40">
            <div>
              <BadgeCheck className="mx-auto size-4 text-emerald-600" />
              <p className="mt-0.5 text-[7px] font-bold tracking-[0.1em] text-emerald-700 uppercase">
                e-Stamped
              </p>
              <p className="text-[6.5px] font-semibold text-emerald-600/80">TN · ₹3,200</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Floating chip that orbits the document. */
function FloatChip({
  className,
  delay,
  icon: Icon,
  title,
  sub,
  tint,
}: {
  className?: string;
  delay: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  tint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={cn("absolute z-10 hidden sm:block", className)}
    >
      <div className="animate-float rounded-xl border border-line bg-white/95 p-3 shadow-lift backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg text-white", tint)}>
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] leading-tight font-bold text-navy-950">{title}</p>
            <p className="text-[10.5px] leading-tight text-navy-500">{sub}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      {/* backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid" />
        {/* Two 600px blurred colour blobs sat here — the standard generated-hero
            backdrop. A single, much fainter wash keeps depth without the glow. */}
        <div className="absolute -top-40 -right-52 size-[520px] rounded-full bg-brand-400/[0.055] blur-[140px]" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-16 lg:grid-cols-[1.02fr_1fr] lg:gap-12 xl:gap-20">
          {/* ── Copy ───────────────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-navy-600 shadow-soft backdrop-blur">
                <span className="rounded-full bg-navy-950 px-2.5 py-1 text-[11px] font-bold text-white">
                  NEW
                </span>
                Same-day stamp paper delivery across Chennai
                <ArrowRight className="size-3.5 text-navy-400" />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              className="mt-6 text-[clamp(2.2rem,5.6vw,3.7rem)] leading-[1.06] font-bold tracking-[-0.035em] text-navy-950"
            >
              {/*
                The office's own line, and it earns the h1 because it answers
                the question the page is actually asked: is this a download, or
                does something arrive? Physical, and at your door.

                "delivered" was a gradient-filled word with an animated
                hand-drawn underline beneath it. Both are decoration every
                generated hero reaches for; the emphasis comes from the typeface.
              */}
              Physical stamp paper and agreements,
              <br className="hidden sm:block" />{" "}
              <em className="italic font-normal text-brand-800">
                delivered to your doorstep
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
              className="mt-7 max-w-xl text-[17.5px] leading-[1.65] text-navy-600"
            >
              Real, licensed non-judicial stamp paper from ₹120 a sheet, carried to your
              address anywhere in Tamil Nadu — same day in Chennai. And when the agreement
              needs writing too, we draft it from ₹300, print it on the paper, get it
              attested and bring both to you, without you visiting a single office.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
              className="mt-9"
            >
              {/*
                Both halves of the business, side by side. The hero sold stamp
                paper and nothing else, so the drafter — the thing the rest of
                the page is about — was four sections down the scroll before it
                was named. Denominations moves under the buttons: it is an
                anchor to a section of this same page, which is not the same
                order of decision as the two above it.
              */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={LEAD_ANCHOR} size="xl" className="group">
                  Order stamp paper
                  <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
                <ButtonLink href={BUILDER_START} variant="primary" size="xl" className="group">
                  <FileSignature className="size-[18px]" />
                  Create agreement
                  <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
              </div>

              <Link
                href="/#stamp-paper"
                className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-navy-600 transition-colors hover:text-navy-950"
              >
                <PlayCircle className="size-[18px] text-navy-400" />
                See denominations and prices
              </Link>
            </motion.div>

            {/* proof points */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.36 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
            >
              {PROOF_POINTS.map((point) => (
                <li key={point.label} className="flex items-center gap-2 text-[13.5px] font-medium text-navy-600">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  {point.label}
                </li>
              ))}
            </motion.ul>

            {/* social proof */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44, ease: EASE }}
              className="mt-9 border-t border-line pt-7"
            >
              {/*
                A star rating and a customer count stood here. Both were
                invented, and an unverifiable number is worth less than a
                verifiable one — so this states what the service guarantees
                instead, which is true from the first order.
              */}
              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white/70 p-4 backdrop-blur-sm sm:p-5">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <BadgeCheck className="size-[18px]" />
                </span>
                <div>
                  <p className="text-[13.5px] font-bold text-navy-950">
                    Don&apos;t take our word for it — check the certificate
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-navy-500">
                    Stamp duty is paid in full to the Government of Tamil Nadu, and every sheet
                    and e-Stamp carries a number you can verify against the Registration
                    Department&apos;s own records. We print it on your invoice.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Visual ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="relative mx-auto w-full max-w-[440px] lg:max-w-none"
          >
            {/* glow behind document */}
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-12 bottom-12 rounded-[24px] bg-brand-600/[0.10] blur-3xl"
            />

            <div className="relative">
              <AgreementMock />

              <FloatChip
                className="-top-6 -left-8 lg:-left-14"
                delay={1.2}
                icon={Stamp}
                title="e-Stamp affixed"
                sub="₹3,200 paid to Govt. of TN"
                tint="bg-brand-600"
              />
              <FloatChip
                className="-right-2 bottom-32 lg:-right-4"
                delay={2.4}
                icon={Truck}
                title="Out for delivery"
                sub="Adyar, Chennai — arriving by 4pm"
                tint="bg-emerald-500"
              />
              <FloatChip
                className="-bottom-8 left-2 lg:-left-10"
                delay={3.2}
                icon={ShieldCheck}
                title="Notarised"
                sub="Signatures attested by a notary"
                tint="bg-navy-950"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
