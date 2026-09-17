import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  Lock,
  MapPin,
  Phone,
  Copy,
  Plus,
  Receipt,
  Scale,
  X,
} from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { PLANS, SITE } from "@/lib/site";
import { agreementRow } from "@/lib/orders";
import { submitOrder } from "@/lib/submit-order";
import { checkPincode } from "@/lib/pincode";
import { calculateStampDuty, planExtra, splitGovernmentAndService } from "@/lib/stamp-duty";
import { templatePrice } from "@/lib/template-prices";
import {
  NOTARY_EXTRA_SHEET_FEE,
  NOTARY_MANDATORY_REASON,
  NOTARY_SHEETS_INCLUDED,
  isNotaryMandatory,
  notaryFeeForPages,
} from "@/lib/notary";
import {
  DENOMINATIONS,
  PRICED_DENOMINATIONS,
  sheetsPrice,
  stampPaperPrice,
} from "@/lib/stamp-paper";
import { propertyAddress } from "@/lib/clauses";
import { TEMPLATES } from "@/lib/templates";
import { BACKDATE_FEE_PER_MONTH, backdateLabel, stampPaperDateOf } from "@/lib/backdating";
import { TEMPLATE_SPECS } from "@/lib/agreement-templates";
import { collectsExecutionDate, fieldsForTemplate } from "@/lib/template-fields";
import { COPY_PAGE_FEE, printedCopyUnitPrice } from "@/lib/copies";
import { Stepper } from "@/components/ui/stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { AgreementDocument } from "./agreement-document";
import { StepIntro } from "./steps";
import { cn, formatDate, inr } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

/* ═════════════════ 6. Review and send ═════════════════ */

export function ReviewAndSendStep({ onSent }: { onSent: () => void }) {
  const { draft } = useAgreement();
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const [notes, setNotes] = useState("");

  /*
    What is missing depends on the deed, not on a fixed letting shape.

    This list was written for the four lettings and applied to all sixty-two.
    An affidavit was told it still needed a tenant's name, a tenant's mobile
    number, a monthly rent, a deposit and a property address — none of which it
    contains or ever asks for — under a heading saying the agreement "is not
    valid until they are filled". Worst of all was the tenant's mobile: the
    verbatim deeds collect one contact number, on landlord.phone, so
    tenant.phone had no input anywhere and could never be satisfied.

    So the required set is derived from the questions the builder actually
    asked. A letting keeps every check it had; a verbatim deed is held only to
    the fields its own wording prints.
  */
  const spec = TEMPLATE_SPECS[draft.templateId];
  const isLetting = !spec?.body?.length;
  const asks = new Set(isLetting ? [] : fieldsForTemplate(spec).map((f) => f.path));
  const wants = (path: string) => isLetting || asks.has(path);

  const missing: string[] = [];
  if (!draft.landlord.fullName) missing.push(`${isLetting ? "Landlord's" : spec.roleA} full name`);
  if (wants("tenant.fullName") && !draft.tenant.fullName) {
    missing.push(`${isLetting ? "Tenant's" : spec.roleB || "Second party"} full name`);
  }
  if (wants("property") && !draft.property.doorNo && !draft.property.street) {
    missing.push("Property address");
  }
  if (wants("terms.monthlyRent") && !draft.terms.monthlyRent) missing.push("Monthly rent");
  if (wants("terms.securityDeposit") && !draft.terms.securityDeposit) {
    missing.push("Security deposit");
  }
  // One number to ring is the requirement. A letting signs both parties with an
  // OTP each, so it needs both; a deed collects a single contact.
  if (!draft.landlord.phone) missing.push(isLetting ? "Landlord's mobile number" : "Mobile number");
  if (isLetting && !draft.tenant.phone) missing.push("Tenant's mobile number");
  // A wrong PIN is worse than a blank one — it looks filled in, and it is what
  // the rider goes by. Only asked where the deed carries an address at all.
  if (wants("property")) {
    const pin = checkPincode(draft.property.pincode, draft.property.district);
    if (pin.status === "empty") missing.push("PIN code");
    else if (pin.status !== "ok") missing.push(`PIN code — ${pin.message}`);
  }

  return (
    <>
      <StepIntro
        title="Read it, then send it to us"
        body="This is the exact document that will be stamped and signed. Nothing is charged here — we read it, ring you to confirm, take payment on that call, and then stamp and deliver."
      />

      {missing.length ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-[14px] font-bold text-amber-900">
                {missing.length} thing{missing.length === 1 ? "" : "s"} still to fill in
              </h3>
              <p className="mt-1 text-[13px] text-amber-800">
                The gaps show as shaded blanks in the document below. You can send it as it
                stands and fill these in on the call, but the agreement is not valid until they
                are filled.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {missing.map((m) => (
                  <li
                    key={m}
                    className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[12px] font-medium text-amber-900"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <FileCheck2 className="size-5 shrink-0 text-emerald-600" />
          <p className="text-[14px] font-medium text-emerald-900">
            Everything essential is filled in. Your agreement is ready to be stamped.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 rounded-t-2xl border border-b-0 border-line bg-navy-50 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Badge tone="neutral">{draft.id}</Badge>
          <span className="hidden text-[12.5px] text-navy-500 sm:inline">
            Updated {formatDate(draft.updatedAt)}
          </span>
        </div>
      </div>

      <div className="scroll-slim max-h-[70vh] overflow-y-auto rounded-b-2xl border border-line bg-white p-6 shadow-soft sm:p-10">
        <AgreementDocument draft={draft} animate={false} />
      </div>

      <SendBlock
        onSent={onSent}
        sending={sending}
        setSending={setSending}
        failed={failed}
        setFailed={setFailed}
        notes={notes}
        setNotes={setNotes}
      />
    </>
  );
}

function SendBlock({
  onSent,
  sending,
  setSending,
  failed,
  setFailed,
  notes,
  setNotes,
}: {
  onSent: () => void;
  sending: boolean;
  setSending: (v: boolean) => void;
  failed: string;
  setFailed: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  const { draft, setPlan, update } = useAgreement();

  // The paper is a combination of sheets now — one, several, or none (e-Stamp).
  // stampPaperValue is kept in step as the first sheet so older readers work.
  const sheets = draft.options.stampPaperSheets;
  const isEStamp = sheets.length === 0;
  const [addValue, setAddValue] = useState<number>(500);
  const setSheets = (next: number[]) =>
    update({ options: { stampPaperSheets: next, stampPaperValue: next[0] ?? 0 } });

  const notaryRequired = isNotaryMandatory(draft.templateId);
  // Most deeds have already given their date; only the rest are asked again.
  const spec = TEMPLATE_SPECS[draft.templateId];
  const dateAlreadyAsked = spec ? collectsExecutionDate(spec) : true;
  const stampDate = stampPaperDateOf(draft);
  const tpl = TEMPLATES.find((t) => t.id === draft.templateId);

  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
    notaryRequired,
    stampPaperDate: stampPaperDateOf(draft),
    templateId: draft.templateId,
    stampPaperValue: draft.options.stampPaperValue,
    stampPaperSheets: draft.options.stampPaperSheets,
    documentPages: draft.options.documentPages,
    extraPrintedCopies: draft.options.extraPrintedCopies,
    softCopy: draft.options.softCopy,
  });
  const split = splitGovernmentAndService(breakdown);

  const contact = draft.landlord.phone ? draft.landlord : draft.tenant;
  const canSend = contact.phone.replace(/\D/g, "").length >= 10;

  const send = async () => {
    setSending(true);
    setFailed("");
    try {
      await submitOrder(agreementRow(draft, notes), draft);
      onSent();
    } catch {
      // Never claim it landed. An order that quietly failed to reach the office
      // is an order nobody will ever call about.
      setFailed(
        "We could not send that just now. Please call or WhatsApp us and we will take it down — your draft is safe on this device.",
      );
      setSending(false);
    }
  };

  return (
    <div className="mt-8 space-y-6 border-t border-line pt-8">
        {/* Plan */}
        <div>
          <h3 className="mb-3 text-[14px] font-bold text-navy-950">Your plan</h3>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {PLANS.map((plan) => {
              const active = draft.plan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlan(plan.id as PlanId)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all duration-200",
                    active
                      ? "border-brand-600 bg-brand-50/60 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                      : "border-line bg-white hover:border-navy-300",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[14px] font-bold",
                        active ? "text-brand-800" : "text-navy-900",
                      )}
                    >
                      {plan.name}
                    </span>
                    {plan.recommended ? <Badge tone="brand">Popular</Badge> : null}
                  </div>
                  <p className="tnum mt-1.5 text-[19px] font-bold text-navy-950">
                    {inr(
                      (tpl ? templatePrice(tpl.id) : 0) +
                        planExtra(plan.id as PlanId, draft.options.documentPages),
                    )}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-navy-500">{plan.delivery}</p>
                </button>
              );
            })}
          </div>

          {notaryRequired ? (
            /*
              An affidavit is not an affidavit until it is sworn, so there is
              nothing here to decide. It is stated, priced and locked rather
              than offered as a checkbox someone can untick and then be told
              about on the phone.
            */
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
              <Scale className="mt-0.5 size-4 shrink-0 text-brand-700" />
              <div className="flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-brand-900">
                  Notary attestation included
                  <Badge tone="brand">Required</Badge>
                </p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-600">
                  {NOTARY_MANDATORY_REASON}
                </p>
                <p className="mt-1.5 text-[12.5px] text-navy-500">
                  {`Charged at ${inr(notaryFeeForPages(draft.options.documentPages))}${draft.plan === "premium" ? " as part of Premium" : ""}, shown in the quote below.`}
                </p>
              </div>
            </div>
          ) : draft.plan !== "premium" ? (
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-4">
              <input
                type="checkbox"
                checked={draft.options.lawyerReview}
                onChange={(e) => update({ options: { lawyerReview: e.target.checked } })}
                className="mt-0.5 size-4 shrink-0 accent-[#2563eb]"
              />
              <span className="flex-1">
                <span className="text-[14px] font-semibold text-navy-900">
                  Add notary attestation
                </span>
                <span className="mt-0.5 block text-[12.5px] text-navy-500">
                  A notary public attests the signatures on your agreement once both
                  parties have signed. Optional on this document — it is valid without it.
                </span>
              </span>
            </label>
          ) : null}
        </div>

        {/*
          The paper the deed is executed on.

          Chosen as a combination rather than a single value: the duty may be met
          by two ₹100 sheets or a ₹500 and a ₹100 together, so sheets are added
          and removed one at a time and the charge sums across them. The e-Stamp
          is the empty combination — one certificate for the exact duty, emailed.
        */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-[14px] font-bold text-navy-950">Non-judicial stamp paper</h3>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-500">
            The sheet your deed is printed on, at the shelf price. Add more than one to make up a
            value — two ₹100 sheets, or a ₹500 and a ₹100 together.
          </p>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                if (isEStamp) setSheets([100]);
              }}
              className={cn(
                "rounded-xl border p-4 text-left transition-all duration-200",
                !isEStamp
                  ? "border-brand-600 bg-brand-50/60 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                  : "border-line bg-white hover:border-navy-300",
              )}
            >
              <span className={cn("text-[14px] font-bold", !isEStamp ? "text-brand-800" : "text-navy-900")}>
                Physical non-judicial stamp paper
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">
                Delivered to your door. ₹100, ₹500, ₹1,000, ₹5,000 — combine as needed.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSheets([])}
              className={cn(
                "rounded-xl border p-4 text-left transition-all duration-200",
                isEStamp
                  ? "border-brand-600 bg-brand-50/60 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                  : "border-line bg-white hover:border-navy-300",
              )}
            >
              <span className={cn("text-[14px] font-bold", isEStamp ? "text-brand-800" : "text-navy-900")}>
                e-Stamp — any value
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">
                Emailed as a certificate for the exact duty. Nothing to deliver.
              </span>
            </button>
          </div>

          {isEStamp ? (
            <p className="mt-4 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-brand-800">
              An e-Stamp is issued for the exact duty payable and emailed to you — there is no sheet
              to buy or deliver, and its cost is the duty itself.
            </p>
          ) : (
            <div className="mt-4 space-y-2.5">
              {sheets.map((v, i) => {
                const label = DENOMINATIONS.find((d) => d.value === v)?.label ?? `₹${v}`;
                return (
                  <div
                    key={`${v}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3"
                  >
                    <span className="text-[13.5px] font-semibold text-navy-900">
                      {label} non-judicial stamp paper
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="tnum text-[13.5px] font-semibold text-navy-950">
                        {inr(stampPaperPrice(v)?.price ?? 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSheets(sheets.filter((_, n) => n !== i))}
                        disabled={sheets.length <= 1}
                        aria-label={`Remove one ${label} sheet`}
                        className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-white text-navy-400 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <X className="size-4" />
                      </button>
                    </span>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Select
                  aria-label="Denomination to add"
                  value={String(addValue)}
                  onChange={(e) => setAddValue(Number(e.target.value))}
                  className="w-auto min-w-[9.5rem]"
                >
                  {PRICED_DENOMINATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label} — {inr(d.price)}
                    </option>
                  ))}
                </Select>
                <Button variant="secondary" size="sm" onClick={() => setSheets([...sheets, addValue])}>
                  <Plus className="size-4" />
                  Add a sheet
                </Button>
                <span className="ml-auto text-[13px] text-navy-500">
                  Paper total{" "}
                  <span className="tnum font-semibold text-navy-950">{inr(sheetsPrice(sheets))}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* How many sheets the finished deed runs to — drives the printing
            surcharge past the first, and the notary's per-sheet charge. */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <Field
            label="Sheets the deed runs to"
            help={
              draft.plan === "premium" || breakdown.lawyerFee > 0
                ? `The first sheet's printing is included; each sheet after is ₹50. The notary also signs every sheet — the first ${NOTARY_SHEETS_INCLUDED} are in the fee, each one after ${inr(NOTARY_EXTRA_SHEET_FEE)}.`
                : "The first sheet's printing is included; each sheet the deed runs onto after that is ₹50."
            }
          >
            {(id) => (
              <Input
                id={id}
                type="number"
                min={1}
                max={50}
                value={draft.options.documentPages}
                onChange={(e) =>
                  update({ options: { documentPages: Math.max(1, Number(e.target.value) || 1) } })
                }
              />
            )}
          </Field>
        </div>

        {/* Where the physical paper is delivered. An e-Stamp is emailed, so this
            only appears when there is a sheet to send. */}
        {!isEStamp ? (
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[14px] font-bold text-navy-950">
                <MapPin className="size-4 text-navy-500" />
                Where should we deliver the non-judicial stamp paper?
              </h3>
              {propertyAddress(draft) &&
              draft.options.shippingAddress.trim() !== propertyAddress(draft) ? (
                <button
                  type="button"
                  onClick={() => update({ options: { shippingAddress: propertyAddress(draft) } })}
                  className="text-[12.5px] font-semibold text-brand-700 underline underline-offset-4"
                >
                  Same as property address
                </button>
              ) : null}
            </div>
            <div className="mt-3">
              <Textarea
                rows={2}
                value={draft.options.shippingAddress}
                onChange={(e) => update({ options: { shippingAddress: e.target.value } })}
                placeholder="Door no, street, locality, city, PIN — where the rider should deliver"
              />
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-navy-400">
              Delivery is quoted on the confirming call — same day in Chennai by Porter, ₹100–₹200
              elsewhere in Tamil Nadu.
            </p>
          </div>
        ) : null}

        {/*
          Extra copies.

          Everyone asks — the landlord keeps one, the tenant keeps one, the bank
          wants one. It used to be quoted on the phone, after the customer had
          already agreed to an estimate that did not include it, which is the
          worst moment to introduce a number.
        */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3">
            <Copy className="size-4 text-navy-500" />
            <h3 className="text-[13px] font-bold text-navy-950">
              Do you need extra copies?
            </h3>
          </div>

          <div className="divide-y divide-line">
            {/* Printed */}
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-[15rem] flex-1">
                <p className="text-[14px] font-semibold text-navy-900">
                  Printed &amp; stamped copies
                </p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-500">
                  Each one is executed again on its own non-judicial stamp paper, so each carries the
                  sheet a second time plus {inr(COPY_PAGE_FEE)} a page for printing.
                  {!isEStamp ? (
                    <>
                      {" "}
                      On {inr(sheetsPrice(sheets))} of paper over{" "}
                      {draft.options.documentPages} page
                      {draft.options.documentPages === 1 ? "" : "s"}, that is{" "}
                      <span className="font-semibold text-navy-800">
                        {inr(printedCopyUnitPrice(draft.options.documentPages, sheets))} a copy
                      </span>
                      .
                    </>
                  ) : (
                    <>
                      {" "}
                      You have chosen an e-Stamp, which has no sheet to buy again, so a
                      printed copy is the {inr(COPY_PAGE_FEE)} a page alone —{" "}
                      <span className="font-semibold text-navy-800">
                        {inr(printedCopyUnitPrice(draft.options.documentPages, sheets))} a copy
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
              <Stepper
                value={draft.options.extraPrintedCopies}
                onChange={(n) => update({ options: { extraPrintedCopies: n } })}
                min={0}
                max={20}
                label="Extra printed copies"
                suffix={draft.options.extraPrintedCopies === 1 ? "copy" : "copies"}
                className="w-[10.5rem] shrink-0"
              />
            </div>

            {/* Soft */}
            <label className="flex cursor-pointer flex-wrap items-start justify-between gap-4 px-5 py-4">
              <span className="flex min-w-[15rem] flex-1 items-start gap-3">
                <input
                  type="checkbox"
                  checked={draft.options.softCopy}
                  onChange={(e) => update({ options: { softCopy: e.target.checked } })}
                  className="mt-0.5 size-4 shrink-0 accent-[#2563eb]"
                />
                <span>
                  <span className="text-[14px] font-semibold text-navy-900">
                    Scanned soft copy
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-relaxed text-navy-500">
                    A PDF of the executed deed, emailed to you. {inr(COPY_PAGE_FEE)} a page,
                    charged once however many people you forward it to.
                  </span>
                </span>
              </span>
              <span className="tnum shrink-0 text-[14px] font-semibold text-navy-950">
                {inr(COPY_PAGE_FEE * draft.options.documentPages)}
              </span>
            </label>
          </div>

          <p className="border-t border-line bg-canvas px-5 py-3 text-[12px] leading-relaxed text-navy-500">
            The copy you are drafting is already included — this is for anyone else who needs
            one. Both are counted by the {draft.options.documentPages} sheet
            {draft.options.documentPages === 1 ? "" : "s"} set above.
          </p>
        </div>

        {/*
          The date on the paper.

          Asked here only when it has not been asked already. Every letting and
          most verbatim deeds give their date up front, and the sheet takes that
          one — the date on the paper and the date in the deed have to match, so
          there is no second field for them to disagree in.

          It also stays off the marketing pages entirely, because the office's
          position is that offering older-dated paper publicly is not lawful.
        */}
        {dateAlreadyAsked ? (
          stampDate ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4">
              <p className="text-[13.5px] text-navy-600">
                The paper will be dated{" "}
                <span className="font-semibold text-navy-950">{formatDate(stampDate)}</span>, the
                date of the agreement you entered.{" "}
                <span className="text-navy-400">Change it on the Terms step.</span>
              </p>
              {breakdown.backdatingMonths > 0 ? (
                <Badge tone="amber">
                  {backdateLabel(breakdown.backdatingMonths)} · {inr(breakdown.backdatingFee)}
                </Badge>
              ) : (
                <Badge tone="emerald">No date charge</Badge>
              )}
            </div>
          ) : null
        ) : (
          <div className="rounded-2xl border border-line bg-white p-5">
            <Field
              label="Date to be printed on the non-judicial stamp paper"
              hint="Optional"
              help={
                breakdown.backdatingMonths > 0
                  ? `Sourced from older stock — ${backdateLabel(breakdown.backdatingMonths)}, at ${inr(BACKDATE_FEE_PER_MONTH)} a month. We confirm the date is actually available on the call before anything is charged.`
                  : draft.options.stampPaperDate
                    ? "Inside this month, so nothing is added — the fee is the usual one."
                    : `Leave blank and the paper carries the day it is issued. Any date this month is charged as usual; each month further back adds ${inr(BACKDATE_FEE_PER_MONTH)}.`
              }
            >
              {(id) => (
                <Input
                  id={id}
                  type="date"
                  value={draft.options.stampPaperDate}
                  onChange={(e) => update({ options: { stampPaperDate: e.target.value } })}
                />
              )}
            </Field>
          </div>
        )}

        {/* Quote */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3">
            <Receipt className="size-4 text-navy-500" />
            <h3 className="text-[13px] font-bold text-navy-950">
              What it will come to
            </h3>
          </div>
          <dl className="divide-y divide-line">
            {[
              {
                label: "Drafting this document",
                value: breakdown.documentFee,
                hint: tpl?.name ?? "Document fee",
              },
              breakdown.stampPaperFee > 0
                ? {
                    label: sheets.length > 1 ? `Non-judicial stamp paper · ${sheets.length} sheets` : "Non-judicial stamp paper",
                    value: breakdown.stampPaperFee,
                    hint: `${sheets.map((v) => DENOMINATIONS.find((d) => d.value === v)?.label ?? `₹${v}`).join(" + ")} · face value plus our charge`,
                  }
                : null,
              breakdown.extraPageFee > 0
                ? {
                    label: "Extra-page printing",
                    value: breakdown.extraPageFee,
                    hint: `${draft.options.documentPages} sheets · ₹50 each past the first`,
                  }
                : null,
              { label: "Stamp duty", value: breakdown.stampDuty, hint: "1% · Govt of TN" },
              breakdown.registrationRequired
                ? { label: "Registration fee", value: breakdown.registrationFee, hint: "1% · Govt of TN" }
                : null,
              breakdown.lawyerFee > 0
                ? {
                    label: "Notary attestation",
                    value: breakdown.lawyerFee,
                    hint: `${draft.options.documentPages} sheet${draft.options.documentPages === 1 ? "" : "s"}${notaryRequired ? " · required" : ""}`,
                  }
                : null,
              breakdown.printedCopiesFee > 0
                ? {
                    label: `Extra printed cop${draft.options.extraPrintedCopies === 1 ? "y" : "ies"}`,
                    value: breakdown.printedCopiesFee,
                    hint: `${draft.options.extraPrintedCopies} × ${inr(printedCopyUnitPrice(draft.options.documentPages, sheets))} · sheet plus printing`,
                  }
                : null,
              breakdown.softCopyFee > 0
                ? {
                    label: "Scanned soft copy",
                    value: breakdown.softCopyFee,
                    hint: `${draft.options.documentPages} page${draft.options.documentPages === 1 ? "" : "s"} · ${inr(COPY_PAGE_FEE)} a page`,
                  }
                : null,
              breakdown.backdatingFee > 0
                ? {
                    label: "Older-dated paper",
                    value: breakdown.backdatingFee,
                    hint: `${backdateLabel(breakdown.backdatingMonths)} · ${inr(BACKDATE_FEE_PER_MONTH)} a month`,
                  }
                : null,
              { label: "GST", value: breakdown.gst, hint: "18% on our fee" },
            ]
              .filter(Boolean)
              .map((row) => {
                const r = row as { label: string; value: number; hint: string };
                return (
                  <div key={r.label} className="flex items-start justify-between px-5 py-3">
                    <dt className="text-[13.5px] text-navy-600">
                      {r.label}
                      <span className="block text-[11.5px] text-navy-400">{r.hint}</span>
                    </dt>
                    <dd className="tnum text-[14px] font-semibold text-navy-950">{inr(r.value)}</dd>
                  </div>
                );
              })}
            <div className="flex items-center justify-between bg-navy-950 px-5 py-4">
              <dt className="text-[13.5px] font-semibold text-white/70">Estimate</dt>
              <dd className="tnum font-display text-[21px] font-bold text-white">
                {inr(breakdown.total)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="text-[12.5px] leading-relaxed text-navy-400">
          Of this, {inr(split.government)} goes to the Government of Tamil Nadu and{" "}
          {inr(split.service)} to us. We will confirm the final figure on the call before you
          pay anything.
        </p>

        {/* Who we call */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-navy-950">
            <Phone className="size-4 text-navy-500" />
            We will call this number
          </h3>
          {canSend ? (
            <p className="mt-2 text-[13.5px] text-navy-600">
              <span className="font-semibold text-navy-950">
                {contact.fullName || "Your contact"}
              </span>{" "}
              on <span className="tnum font-semibold text-navy-950">{contact.phone}</span> — from
              the {contact === draft.landlord ? "landlord" : "tenant"} details you entered. Go
              back a step to change it.
            </p>
          ) : (
            <p className="mt-2 flex items-start gap-2 text-[13.5px] text-amber-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              Add a ten-digit mobile number for the landlord or the tenant before sending — it is
              how we reach you to confirm.
            </p>
          )}
        </div>

        <Field label="Anything we should know?" hint="Optional">
          {(id) => (
            <Textarea
              id={id}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. tenant moves in on the 1st, please call after 6pm"
            />
          )}
        </Field>

        {failed ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
            <div className="min-w-0">
              <p className="text-[13px] leading-relaxed text-rose-800">{failed}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href={`tel:${SITE.phone.replace(/\s/g, "")}`} variant="secondary" size="sm">
                  Call {SITE.phone}
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  variant="secondary"
                  size="sm"
                >
                  WhatsApp us
                </ButtonLink>
              </div>
            </div>
          </div>
        ) : null}

        <Button size="xl" fullWidth onClick={send} disabled={sending || !canSend}>
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              Send my agreement
              <ArrowRight className="size-[18px]" />
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-[12.5px] text-navy-400">
          <Lock className="size-3.5 shrink-0" />
          No payment is taken on this site. We call to confirm before anything is charged.
        </p>
    </div>
  );
}
