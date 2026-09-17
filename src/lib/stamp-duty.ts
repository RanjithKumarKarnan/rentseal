import type { PlanId, StampDutyBreakdown } from "./types";
import { notaryFeeForPages } from "./notary";
import { BACKDATE_FEE_PER_MONTH as BACKDATE_PER_MONTH, backdateFee, backdateMonths } from "./backdating";
import { templatePrice } from "./template-prices";
import { sheetsPrice, sheetsFaceValue } from "./stamp-paper";
import { COPY_PAGE_FEE, printedCopiesFee, softCopyFee } from "./copies";
import type { TemplateId } from "./agreement-templates";

/**
 * Tamil Nadu stamp duty & registration charges for lease/rental instruments.
 *
 * Basis — Article 35, Indian Stamp Act 1899 as applicable in Tamil Nadu, read with
 * the Registration Act 1908. For a lease of less than 30 years, duty is charged on
 * the aggregate of rent payable over the term plus any advance/deposit paid.
 *
 * Registration is compulsory under s.17(1)(d) of the Registration Act only where the
 * term is 12 months or more; the widely used 11-month agreement is therefore
 * e-stamped and (optionally) notarised, not registered.
 *
 * These are the published slabs. The figure finally debited by the Registration
 * Department at the moment of e-stamping is authoritative — the UI says so.
 */

export const TN_STAMP_RATE_UNDER_30Y = 0.01; // 1% of chargeable value
export const TN_REGISTRATION_RATE = 0.01; // 1% of chargeable value
export const REGISTRATION_MANDATORY_FROM_MONTHS = 12;
export const GST_RATE = 0.18;

/**
 * Printing surcharge for a longer document.
 *
 * The first sheet is included in the drafting fee. A deed that runs onto more
 * paper is more to typeset, print and check, so each sheet past the first adds
 * a flat charge. `EXTRA_PAGE_FREE` is how many are included before it starts —
 * raise it if the base fee should cover more than one page.
 */
export const EXTRA_PAGE_FEE = 50;
export const EXTRA_PAGE_FREE = 1;

/** The printing surcharge for a document of the given length. */
export function extraPageFeeForPages(pages: number): number {
  const sheets = Math.max(1, Math.floor(Number(pages) || 1));
  return Math.max(0, sheets - EXTRA_PAGE_FREE) * EXTRA_PAGE_FEE;
}

/**
 * What each plan adds on top of the document's own price.
 *
 * Every deed is now priced individually — ₹300 for a Tamil loan bond, ₹800 for
 * a detailed sale agreement — so the drafting fee comes from the template and
 * the plan only prices the service wrapped around it. The uplifts are the gaps
 * the three plans already stood at (₹349 / ₹799 / ₹1,499), kept exactly so the
 * ladder between them is unchanged and nothing here is a figure nobody quoted.
 *
 * Basic is the document and nothing else, so it adds nothing.
 *
 * Premium's `lawyer: 0` is the point, not an oversight. Its card lists notary
 * attestation as included and it was also adding the fee to the quote, so the
 * one plan that sold attestation as part of the price was the one charging
 * separately for it. Included means included.
 */
export const PLAN_FEES: Record<PlanId, { platform: number; lawyer: number }> = {
  basic: { platform: 0, lawyer: 0 },
  standard: { platform: 450, lawyer: 0 },
  premium: { platform: 1150, lawyer: 0 },
};

/**
 * The 11-month residential agreement on a plan — the figure a "rent agreement
 * from" line quotes. Worked out rather than typed, so a price change cannot
 * leave the old figure behind in a heading or a schema.
 */
export function rentAgreementPrice(plan: PlanId): number {
  return templatePrice("residential-11-month") + PLAN_FEES[plan].platform;
}

export interface StampDutyInput {
  monthlyRent: number;
  securityDeposit: number;
  durationMonths: number;
  plan?: PlanId;
  /** Force registration even for an 11-month term. */
  registerAnyway?: boolean;
  /** Premium includes notary attestation; other plans can add it on. */
  lawyerReview?: boolean;
  /**
   * The instrument cannot be delivered unsworn — an affidavit. The fee is
   * charged whatever the plan and whatever the checkbox says, because there is
   * no version of the document that does without it.
   */
  notaryRequired?: boolean;
  /** Which of the sixty-two is being drawn. Sets the drafting fee. */
  templateId?: TemplateId;
  /** Face value of the physical sheet chosen. 0 for an e-Stamp. */
  stampPaperValue?: number;
  /**
   * The physical sheets the deed is executed on, e.g. [100, 100] for two ₹100
   * sheets. Preferred over `stampPaperValue`; when omitted it falls back to a
   * single sheet of `stampPaperValue` (empty for an e-Stamp), so older callers
   * keep working.
   */
  stampPaperSheets?: number[];
  /** Sheets the deed runs to, for the notary's per-sheet charge. */
  documentPages?: number;
  /** Extra printed copies wanted, each on its own stamp paper. */
  extraPrintedCopies?: number;
  /** A scanned copy of the executed deed. */
  softCopy?: boolean;
  /**
   * The date wanted on the paper, yyyy-mm-dd. A past date is sourced from older
   * stock and charged by the month. Quoted in the builder only.
   */
  stampPaperDate?: string;
}

export function calculateStampDuty({
  monthlyRent,
  securityDeposit,
  durationMonths,
  plan = "standard",
  registerAnyway = false,
  lawyerReview = false,
  notaryRequired = false,
  stampPaperDate = "",
  templateId,
  stampPaperValue = 0,
  stampPaperSheets,
  // One sheet unless a caller says otherwise, so a duty estimate that omits the
  // page count carries no printing surcharge. The builder always passes the
  // real figure. notaryFeeForPages treats 1 and 4 alike (both inside the base).
  documentPages = 1,
  extraPrintedCopies = 0,
  softCopy = false,
}: StampDutyInput): StampDutyBreakdown {
  // The sheets to price. A caller that gives the list wins; otherwise a single
  // sheet of the legacy value, and nothing at all for an e-Stamp (value 0).
  const sheets =
    stampPaperSheets && stampPaperSheets.length
      ? stampPaperSheets
      : stampPaperValue
        ? [stampPaperValue]
        : [];
  const rent = Math.max(0, Number(monthlyRent) || 0);
  const deposit = Math.max(0, Number(securityDeposit) || 0);
  const months = Math.max(1, Number(durationMonths) || 11);

  const totalRentOverTerm = rent * months;
  const chargeableValue = totalRentOverTerm + deposit;

  const registrationRequired =
    months >= REGISTRATION_MANDATORY_FROM_MONTHS || registerAnyway;

  const stampDuty = Math.round(chargeableValue * TN_STAMP_RATE_UNDER_30Y);
  const registrationFee = registrationRequired
    ? Math.round(chargeableValue * TN_REGISTRATION_RATE)
    : 0;

  const fees = PLAN_FEES[plan];
  // The document's own price, plus whatever the plan wraps around it.
  const documentFee = templateId ? templatePrice(templateId) : 0;
  const platformFee = documentFee + fees.platform;

  // The sheets the deed is executed on, at the shelf price, summed across the
  // combination. An e-Stamp (no sheets) has no shelf price — its cost is the
  // duty, already counted above.
  const stampPaperFee = sheetsPrice(sheets);

  // Each sheet past the first is a flat printing surcharge.
  const extraPageFee = extraPageFeeForPages(documentPages);

  // Premium bundles notary attestation; other plans pay for it if they opt in,
  // or if the instrument is one that is void without it. The fee covers the
  // first four sheets and charges for every one after them.
  const lawyerFee =
    plan === "premium"
      ? fees.lawyer
      : lawyerReview || notaryRequired
        ? notaryFeeForPages(documentPages)
        : 0;

  // Extra copies. A printed one is a second execution and carries the whole
  // sheet set again; a soft one is a scan, charged once however many people get
  // it.
  const copiesFee = printedCopiesFee(extraPrintedCopies, documentPages, sheets);
  const scanFee = softCopyFee(softCopy, documentPages);

  const backdatingMonths = backdateMonths(stampPaperDate);
  const backdatingFee = backdateFee(stampPaperDate);

  /*
    GST applies to our service fees only, never to a government levy — which is
    what the site tells the customer, so it has to be what the arithmetic does.

    Two things used to break that, in opposite directions. The sheet was left
    out of the base entirely, so our margin on it — ₹20 of a ₹120 sheet — went
    untaxed. Meanwhile an extra printed copy carries a whole sheet inside its
    fee, and that fee was taxed in full, so the face value of a copy's paper was
    taxed while the face value of the original's was not. The same rupee of
    stamp paper, taxed or not depending on which line it sat in.

    The rule now is the one we print: everything we charge for is in the base,
    and every rupee that belongs to the state — duty, registration fee, and the
    face value of every sheet, the original and each copy — is out of it.
  */
  const paperFaceValue =
    sheetsFaceValue(sheets) * (1 + Math.max(0, Math.floor(Number(extraPrintedCopies) || 0)));

  const ourCharges =
    platformFee + stampPaperFee + extraPageFee + lawyerFee + backdatingFee + copiesFee + scanFee;
  const gst = Math.round(Math.max(0, ourCharges - paperFaceValue) * GST_RATE);

  const total =
    stampDuty +
    registrationFee +
    platformFee +
    stampPaperFee +
    extraPageFee +
    lawyerFee +
    backdatingFee +
    copiesFee +
    scanFee +
    gst;

  const notes: string[] = [];
  notes.push(
    `Stamp duty is charged at 1% of ₹${chargeableValue.toLocaleString("en-IN")} — the total rent for ${months} month${months === 1 ? "" : "s"} plus the refundable deposit.`,
  );
  if (registrationRequired) {
    notes.push(
      months >= REGISTRATION_MANDATORY_FROM_MONTHS
        ? "Your term is 12 months or longer, so registration at the Sub-Registrar Office is compulsory under Section 17 of the Registration Act, 1908."
        : "You chose to register even though an 11-month agreement does not require it. Registration adds evidentiary weight.",
    );
  } else {
    notes.push(
      "An 11-month term does not require registration. Your agreement is e-stamped and legally valid as evidence.",
    );
  }
  if (notaryRequired) {
    notes.push(
      "Notary attestation is included because an affidavit has to be sworn — it is not an optional extra on this document.",
    );
  }
  if (backdatingMonths > 0) {
    notes.push(
      `The paper is dated ${backdatingMonths} calendar month${backdatingMonths === 1 ? "" : "s"} back, sourced from older stock at ₹${BACKDATE_PER_MONTH} a month. A date inside the current month carries no such charge. We confirm on the call that the date you asked for is actually available before anything is charged.`,
    );
  }
  if (extraPrintedCopies > 0) {
    notes.push(
      `${extraPrintedCopies} extra printed cop${extraPrintedCopies === 1 ? "y" : "ies"} — each is executed on its own non-judicial stamp paper, so each carries the sheet again plus ₹${COPY_PAGE_FEE} a page for printing.`,
    );
  }
  if (softCopy) {
    notes.push(
      `A scanned copy is ₹${COPY_PAGE_FEE} a page, charged once however many people you forward it to.`,
    );
  }
  if (extraPageFee > 0) {
    const extraSheets = Math.max(0, Math.max(1, Math.floor(documentPages)) - EXTRA_PAGE_FREE);
    notes.push(
      `The deed runs to ${documentPages} sheets. The first is included; the ${extraSheets} beyond it are ₹${EXTRA_PAGE_FEE} a sheet to print, so ₹${extraPageFee} in all.`,
    );
  }
  notes.push(
    "GST at 18% applies to our service fee only. Stamp duty, the registration fee and the face value printed on every sheet are the state's and carry no GST.",
  );

  return {
    totalRentOverTerm,
    refundableDeposit: deposit,
    chargeableValue,
    stampDuty,
    registrationFee,
    registrationRequired,
    platformFee,
    stampPaperFee,
    extraPageFee,
    documentFee,
    lawyerFee,
    paperFaceValue,
    printedCopiesFee: copiesFee,
    softCopyFee: scanFee,
    backdatingFee,
    backdatingMonths,
    gst,
    total,
    notes,
  };
}

/** Government portion vs our portion — used to prove we don't mark up state fees. */
export function splitGovernmentAndService(b: StampDutyBreakdown) {
  /*
    The sheet is both. ₹120 buys ₹100 of stamp paper and ₹20 of us fetching it,
    and every extra printed copy buys another sheet at the same split. Counting
    the whole ₹120 as ours overstates what we take; counting it as the state's
    understates it.

    Deriving the service half from the total rather than adding the fees up also
    keeps the two halves summing to the figure printed directly above them — the
    old sum quietly dropped the copies and the scan.
  */
  const government = b.stampDuty + b.registrationFee + b.paperFaceValue;
  return { government, service: b.total - government, total: b.total };
}
