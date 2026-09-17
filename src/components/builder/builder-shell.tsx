import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/components/ui/link";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  CloudOff,
  Eye,
  FileText,
  IndianRupee,
  Loader2,
  Receipt,
  Sparkles,
  X,
} from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { clauseStats, specFor } from "@/lib/clauses";
import { calculateStampDuty } from "@/lib/stamp-duty";
import { isNotaryMandatory } from "@/lib/notary";
import { stampPaperDateOf } from "@/lib/backdating";
import { describeSheets } from "@/lib/stamp-paper";
import { AGREEMENT_TYPES } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { AgreementDocument } from "./agreement-document";
import { ClausesStep, PartyStep, PropertyStep, TermsStep } from "./steps";
import { ReviewAndSendStep } from "./review-payment";
import { VehicleStep } from "./vehicle-step";
import { TemplateQuestionsStep } from "./template-questions";
import { cn, inr } from "@/lib/utils";
import type { AgreementType } from "@/lib/types";

type Step = { key: string; label: string; short: string };

const LETTING_STEPS: Step[] = [
  { key: "property", label: "Property", short: "Property" },
  { key: "landlord", label: "Landlord details", short: "Landlord" },
  { key: "tenant", label: "Tenant details", short: "Tenant" },
  { key: "terms", label: "Agreement terms", short: "Terms" },
  { key: "clauses", label: "Additional clauses", short: "Clauses" },
  { key: "review", label: "Review and send", short: "Review" },
];

/**
 * A verbatim deed asks only what it prints.
 *
 * The sixteen Tamil deeds and the service provider agreement each carry a
 * different set of tokens — a loan deed names two people and a date, a house
 * rent needs the property and the rent as well — so the questions come from
 * the document rather than from a fixed six-step form. See template-fields.ts.
 */
const VERBATIM_STEPS: Step[] = [
  { key: "who", label: "Who is signing", short: "Parties" },
  { key: "particulars", label: "The particulars", short: "Details" },
  { key: "clauses", label: "Additional clauses", short: "Clauses" },
  { key: "review", label: "Review and send", short: "Review" },
];

/**
 * A sale asks different questions, so it gets different steps.
 *
 * There is no property, no rent and no term to agree, and the price and
 * handover belong with the vehicle rather than in a terms step of their own —
 * which leaves five steps instead of six.
 */
const SALE_STEPS: Step[] = [
  { key: "vehicle", label: "Vehicle", short: "Vehicle" },
  { key: "landlord", label: "Seller details", short: "Seller" },
  { key: "tenant", label: "Buyer details", short: "Buyer" },
  { key: "clauses", label: "Additional clauses", short: "Clauses" },
  { key: "review", label: "Review and send", short: "Review" },
];

function SaveIndicator() {
  const { saving, savedAt } = useAgreement();
  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-navy-400">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  if (savedAt) {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600">
        <Cloud className="size-3.5" />
        Draft saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-navy-400">
      <CloudOff className="size-3.5" />
      Not saved yet
    </span>
  );
}

/** Which part of the deed each step is writing, so the preview can follow along. */
const DOC_SECTION: Record<string, string | null> = {
  property: "property",
  vehicle: "property",
  who: "landlord",
  particulars: "terms",
  landlord: "landlord",
  tenant: "landlord",
  terms: "terms",
  clauses: "clauses",
  review: null,
};

/**
 * The instrument, filling in as the form is answered.
 *
 * Sits on the left of the form at xl and up, at full size rather than the
 * scaled-down thumbnail it used to be — the point of a live preview is that you
 * can read the sentence your answer just wrote.
 */
function DocumentRail({
  onOpenPreview,
  section,
}: {
  onOpenPreview: () => void;
  section: string | null;
}) {
  const { draft } = useAgreement();
  const scroller = useRef<HTMLDivElement>(null);

  // Moving to a new step brings the clause that step writes into view.
  useEffect(() => {
    const box = scroller.current;
    if (!box || !section) return;
    const target = box.querySelector<HTMLElement>(`[data-doc="${section}"]`);
    if (!target) return;
    const top =
      target.getBoundingClientRect().top -
      box.getBoundingClientRect().top +
      box.scrollTop -
      12;
    box.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [section]);

  return (
    <div className="flex max-h-[calc(100vh-152px)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="flex shrink-0 items-center justify-between border-b border-line bg-navy-50 px-5 py-3">
        <h2 className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
          <FileText className="size-4 text-navy-500" />
          Live document
        </h2>
        <button
          type="button"
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-700 hover:underline"
        >
          <Eye className="size-3.5" />
          Expand
        </button>
      </div>
      <div ref={scroller} className="scroll-slim flex-1 overflow-y-auto bg-navy-50/50 p-4">
        <div className="rounded-xl bg-white p-5 shadow-card">
          <AgreementDocument draft={draft} />
        </div>
      </div>
    </div>
  );
}

/** Running cost and clause count, under the form rather than beside it. */
function CostRail() {
  const { draft } = useAgreement();
  const stats = useMemo(() => clauseStats(draft), [draft]);
  const breakdown = useMemo(
    () =>
      calculateStampDuty({
        monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
        securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
        durationMonths: draft.terms.durationMonths,
        plan: draft.plan,
        registerAnyway: draft.options.registrationRequired,
        lawyerReview: draft.options.lawyerReview,
        notaryRequired: isNotaryMandatory(draft.templateId),
        stampPaperDate: stampPaperDateOf(draft),
        extraPrintedCopies: draft.options.extraPrintedCopies,
        softCopy: draft.options.softCopy,
        templateId: draft.templateId,
        stampPaperValue: draft.options.stampPaperValue,
        stampPaperSheets: draft.options.stampPaperSheets,
        documentPages: draft.options.documentPages,
      }),
    [draft],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Cost */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3">
          <Receipt className="size-4 text-navy-500" />
          <h2 className="text-[13px] font-bold text-navy-950">Running total</h2>
        </div>
        <dl className="divide-y divide-line">
          {[
            { label: "This document", value: breakdown.documentFee, hint: "Drafting fee" },
            breakdown.stampPaperFee > 0
              ? { label: "Non-judicial stamp paper", value: breakdown.stampPaperFee, hint: describeSheets(draft.options.stampPaperSheets) }
              : null,
            breakdown.extraPageFee > 0
              ? { label: "Extra pages", value: breakdown.extraPageFee, hint: `${draft.options.documentPages} sheets · ₹50 past the first` }
              : null,
            { label: "Stamp duty", value: breakdown.stampDuty, hint: "1% · Govt of TN" },
            breakdown.registrationRequired
              ? { label: "Registration fee", value: breakdown.registrationFee, hint: "1% · Govt of TN" }
              : null,
            breakdown.lawyerFee > 0
              ? {
                  label: "Notary attestation",
                  value: breakdown.lawyerFee,
                  hint: isNotaryMandatory(draft.templateId) ? "Notary public · required" : "Notary public",
                }
              : null,
            breakdown.printedCopiesFee + breakdown.softCopyFee > 0
              ? {
                  label: "Extra copies",
                  value: breakdown.printedCopiesFee + breakdown.softCopyFee,
                  hint: [
                    draft.options.extraPrintedCopies
                      ? `${draft.options.extraPrintedCopies} printed`
                      : "",
                    draft.options.softCopy ? "soft copy" : "",
                  ]
                    .filter(Boolean)
                    .join(" · "),
                }
              : null,
            breakdown.backdatingFee > 0
              ? {
                  label: "Older-dated paper",
                  value: breakdown.backdatingFee,
                  hint: `${breakdown.backdatingMonths} month${breakdown.backdatingMonths === 1 ? "" : "s"} back`,
                }
              : null,
            { label: "GST", value: breakdown.gst, hint: "18% on our fee" },
          ]
            .filter(Boolean)
            .map((row) => {
              const r = row as { label: string; value: number; hint: string };
              return (
                <div key={r.label} className="flex items-start justify-between px-5 py-2.5">
                  <dt className="text-[13px] text-navy-600">
                    {r.label}
                    <span className="block text-[11px] text-navy-400">{r.hint}</span>
                  </dt>
                  <dd className="tnum text-[13.5px] font-semibold text-navy-950">{inr(r.value)}</dd>
                </div>
              );
            })}
          <div className="flex items-center justify-between bg-navy-950 px-5 py-3.5">
            <dt className="text-[13px] font-semibold text-white/70">Total</dt>
            <motion.dd
              key={breakdown.total}
              initial={{ opacity: 0.5, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className="tnum font-display text-[19px] font-bold text-white"
            >
              {inr(breakdown.total)}
            </motion.dd>
          </div>
        </dl>
      </div>

      {/* Clause counter */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
            <Sparkles className="size-4 text-brand-600" />
            Clauses generated
          </h2>
          <span className="tnum font-display text-[19px] font-bold text-navy-950">
            {stats.total}
          </span>
        </div>
        {stats.triggers.length ? (
          <>
            <p className="mt-2.5 text-[12px] text-navy-500">
              {stats.conditional} added from your answers:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <AnimatePresence initial={false}>
                {stats.triggers.map((trigger) => (
                  <motion.span
                    key={trigger}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
                  >
                    {trigger}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <p className="mt-2.5 text-[12px] text-navy-500">
            Answer more questions and conditional clauses will appear here.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * `embedded` drops the chrome that only makes sense on a page of its own — the
 * logo bar, the site footer, the full-viewport height — so the same drafter can
 * sit inside a section of another page. Everything else is identical: same
 * store, same steps, same live document.
 */
export function BuilderShell({
  type,
  embedded = false,
}: {
  type: AgreementType;
  embedded?: boolean;
}) {
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);
  const { draft, carriedOver, dismissCarriedOver, reset } = useAgreement();
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  // The route names the instrument the user arrived on, but the template
  // picker can move the draft across instruments — a warehouse is commercial
  // even if they came in through /create/residential. So the heading follows
  // the draft, not the URL.
  const meta = AGREEMENT_TYPES.find((t) => t.id === draft.type) ??
    AGREEMENT_TYPES.find((t) => t.id === type);

  // AGREEMENT_TYPES names only the four letting instruments, so a deed, an
  // affidavit or a sale agreement had no name to print and the notice read
  // "Now drafting a ." The document's own name is the right answer for all of
  // them, and a better one than the instrument even where an instrument exists.
  const draftingName =
    TEMPLATES.find((t) => t.id === draft.templateId)?.name ?? meta?.name ?? specFor(draft).deedTitle;

  // Reconciling the restored draft against the route is the provider's job and
  // it does it once, at hydration. Repeating it here on every change of
  // draft.type undid the template picker the moment it moved instrument:
  // choosing Warehouse switched the draft to a 36-month commercial letting and
  // this effect immediately pulled it back to an 11-month residential one.

  useEffect(() => {
    if (embedded) {
      // Bring the drafter back into view without dragging the host page to its
      // own top — the section above it is not what the user is working on.
      root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, embedded]);

  const family = specFor(draft).family;
  const STEPS =
    family === "verbatim" ? VERBATIM_STEPS : family === "sale" ? SALE_STEPS : LETTING_STEPS;
  // A sale has one step fewer than a letting, so switching template at the last
  // step would index past the end of the list. Clamped on read rather than
  // written back, so the position is restored if they switch back.
  const stepIndex = Math.min(step, STEPS.length - 1);
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);
  // The last step is the whole width — it already contains the document.
  const isFinalStep = STEPS[stepIndex].key === "review";

  const body = () => {
    switch (STEPS[stepIndex].key) {
      case "property":
        return <PropertyStep />;
      case "vehicle":
        return <VehicleStep />;
      case "who":
        return <TemplateQuestionsStep which="parties" />;
      case "particulars":
        return <TemplateQuestionsStep which="details" />;
      case "landlord":
        return <PartyStep which="landlord" />;
      case "tenant":
        return <PartyStep which="tenant" />;
      case "terms":
        return <TermsStep />;
      case "clauses":
        return <ClausesStep />;
      case "review":
        return <ReviewAndSendStep onSent={() => navigate(`/success?id=${draft.id}`)} />;
    }
  };

  return (
    <div ref={root} className={cn("flex flex-col bg-canvas", !embedded && "min-h-screen")}>
      {/* Embedded gets a slim identity strip instead of a second site header. */}
      {embedded ? (
        <div className="no-print border-b border-line bg-white">
          <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
            <div>
              <p className="text-[13.5px] font-semibold text-navy-950">{meta?.name}</p>
              <p className="text-[11.5px] text-navy-400">{draft.id}</p>
            </div>
            <SaveIndicator />
          </div>
          <div className="h-[3px] w-full bg-navy-100">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ) : null}

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header
        className={cn(
          "no-print sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur-xl",
          embedded && "hidden",
        )}
      >
        <div className="container-page flex h-[62px] items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Logo />
            <div className="hidden border-l border-line pl-5 lg:block">
              <p className="text-[13.5px] font-semibold text-navy-950">{meta?.name}</p>
              <p className="text-[11.5px] text-navy-400">{draft.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SaveIndicator />
            <ButtonLink href="/" variant="ghost" size="sm" className="hidden sm:inline-flex">
              <X className="size-4" />
              Save &amp; exit
            </ButtonLink>
          </div>
        </div>

        {/* Progress */}
        <div className="h-[3px] w-full bg-navy-100">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 to-emerald-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      {/* ── Stepper ─────────────────────────────────────────── */}
      <nav aria-label="Progress" className="no-print border-b border-line bg-white">
        <div
          className={cn(
            "scroll-slim flex items-center gap-1 overflow-x-auto py-3",
            embedded ? "px-5 sm:px-6" : "container-page",
          )}
        >
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStep(i)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
                  current
                    ? "bg-brand-600 text-white"
                    : done
                      ? "text-emerald-700 hover:bg-emerald-50"
                      : "text-navy-400 hover:bg-navy-100",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                    current
                      ? "bg-white/20 text-white"
                      : done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-navy-100 text-navy-500",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3.5} /> : i + 1}
                </span>
                {s.short}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Body ────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1",
          embedded ? "px-5 py-7 sm:px-6" : "container-page py-8 lg:py-12",
        )}
      >
        <div
          className={cn(
            "grid gap-8",
            !isFinalStep &&
              "lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]",
          )}
        >
          <div className="min-w-0 lg:order-2">
            {/* Twelve of the drafting pages had no h1 at all: the letting and
                sale steps open with one, the verbatim deeds open with the
                document bar. Naming the page is what a screen reader reads
                first, so it is stated here for every template and shown to
                everyone else by the bar below. */}
            <h1 className="sr-only">Create a {draftingName}</h1>
            {/* Switching instrument keeps the parties and the address and
                nothing else — say so, rather than letting it look like the old
                draft simply came back. */}
            {carriedOver ? (
              <div className="no-print mb-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/70 p-4">
                <p className="max-w-xl text-[13px] leading-relaxed text-navy-700">
                  <span className="font-semibold text-navy-950">
                    Now drafting a {draftingName}.
                  </span>{" "}
                  We kept the parties and the property address from your last draft. The
                  term, clauses and everything else start fresh from this instrument.
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => reset(type)}>
                    Start blank
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!px-2.5"
                    aria-label="Dismiss"
                    onClick={dismissCarriedOver}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[stepIndex].key}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8"
              >
                {body()}
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            {!isFinalStep ? (
              <div className="no-print mt-6 flex items-center justify-between gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={stepIndex === 0}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>

                <div className="flex items-center gap-3">
                  <span className="hidden text-[13px] text-navy-400 sm:inline">
                    Step {stepIndex + 1} of {STEPS.length}
                  </span>
                  <Button
                    size="lg"
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="group"
                  >
                    {STEPS[stepIndex + 1]?.key === "review" ? "Review and send" : "Continue"}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="no-print mt-6">
                <Button variant="ghost" size="lg" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="size-4" />
                  Back to the clauses
                </Button>
              </div>
            )}

            {!isFinalStep ? (
              <div className="no-print mt-6 hidden lg:block">
                <CostRail />
              </div>
            ) : null}

            {/* Below xl the document and costs live behind the preview sheet. */}
            <div className="no-print mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 lg:hidden">
              <div className="flex items-center gap-2.5">
                <IndianRupee className="size-4 text-navy-400" />
                <span className="text-[13px] text-navy-500">Running total</span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(true)}>
                <Eye className="size-4" />
                Preview agreement
              </Button>
            </div>
          </div>

          {!isFinalStep ? (
            <aside className="no-print hidden lg:order-1 lg:block">
              <div className={cn("sticky", embedded ? "top-[88px]" : "top-[124px]")}>
                <DocumentRail
                  onOpenPreview={() => setPreviewOpen(true)}
                  section={DOC_SECTION[STEPS[stepIndex].key]}
                />
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {/* ── Expanded preview ────────────────────────────────── */}
      <AnimatePresence>
        {previewOpen ? (
          <motion.div
            className="no-print fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
              onClick={() => setPreviewOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-3 top-6 bottom-6 mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lift sm:inset-x-6"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-[16px] font-bold text-navy-950">
                    Live document
                  </h2>
                  <Badge tone="brand">{clauseStats(draft).total} clauses</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="!px-2.5"
                    aria-label="Close preview"
                    onClick={() => setPreviewOpen(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="scroll-slim flex-1 overflow-y-auto bg-navy-50 p-4 sm:p-8">
                <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-card sm:p-12">
                  <AgreementDocument draft={draft} animate={false} />
                </div>
              </div>
              <div className="shrink-0 border-t border-line bg-white px-5 py-3 lg:hidden">
                <SummaryRailMobile />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <footer
        className={cn(
          "no-print border-t border-line bg-white py-6",
          embedded && "hidden",
        )}
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-navy-400">
          <p>Your draft is stored on this device until you pay. Nothing is shared with anyone.</p>
          <Link href="/legal/privacy" className="font-medium underline underline-offset-4">
            How we handle your data
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SummaryRailMobile() {
  const { draft } = useAgreement();
  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
    notaryRequired: isNotaryMandatory(draft.templateId),
    stampPaperDate: stampPaperDateOf(draft),
    templateId: draft.templateId,
    stampPaperValue: draft.options.stampPaperValue,
    stampPaperSheets: draft.options.stampPaperSheets,
    documentPages: draft.options.documentPages,
  });
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-navy-500">
        Stamp duty {inr(breakdown.stampDuty)} · Fee {inr(breakdown.platformFee + breakdown.gst)}
      </span>
      <span className="tnum text-[16px] font-bold text-navy-950">{inr(breakdown.total)}</span>
    </div>
  );
}
