import type { TemplateId } from "./agreement-templates";
import { AFFIDAVIT_TEMPLATE_IDS } from "./affidavit-templates";

/**
 * When notary attestation is compulsory, and when it is a choice.
 *
 * An affidavit is a sworn statement. It is not a contract between two people
 * who can agree what it means — it is a deponent swearing something is true to
 * an officer empowered to administer the oath. Unsworn, it is a signed piece of
 * paper and nothing more: no court, registrar, passport office, bank or college
 * will look at it. So the attestation is not an upsell on an affidavit, it is
 * the thing that makes it an affidavit, and the builder does not offer to leave
 * it out.
 *
 * Everything else — a letting, a lease, a sale, a licence, an indemnity — is
 * valid on execution and, once stamped, stands as evidence without a notary.
 * Attestation there buys extra proof of who signed, which is worth having and
 * is worth being asked about rather than charged for silently. Those stay a
 * checkbox.
 */

/**
 * The notary's fee, in rupees.
 *
 * ₹350 buys the signature on the first page together with three green sheets —
 * four sheets in all, which covers most deeds. A document running longer is
 * ₹75 for every sheet past those four, because the notary signs each one.
 *
 * Attestation on plain paper is ₹100 at the counter, but a deed drafted here is
 * executed on stamp paper, so ₹350 is the rate that applies.
 */
export const NOTARY_FEE = 350;

/** Sheets the base fee covers: the stamp paper plus three green sheets. */
export const NOTARY_SHEETS_INCLUDED = 4;

/** Every sheet past the included four. */
export const NOTARY_EXTRA_SHEET_FEE = 75;

/** What attestation comes to for a document of a given length. */
export function notaryFeeForPages(pages: number): number {
  const sheets = Math.max(1, Math.floor(Number(pages) || NOTARY_SHEETS_INCLUDED));
  const extra = Math.max(0, sheets - NOTARY_SHEETS_INCLUDED);
  return NOTARY_FEE + extra * NOTARY_EXTRA_SHEET_FEE;
}

/**
 * The deeds that cannot be delivered unsworn.
 *
 * The nine affidavits from the affidavit set, the death-proof affidavit filed
 * under the standalone deeds, and the Tamil உறுதிமொழிப் பத்திரம். Whatever list
 * a template happens to be declared in, an affidavit is an affidavit.
 */
export const NOTARY_MANDATORY_TEMPLATE_IDS: readonly TemplateId[] = [
  ...AFFIDAVIT_TEMPLATE_IDS,
  "death-proof-affidavit",
  "ta-affidavit",
] as const;

const MANDATORY = new Set<string>(NOTARY_MANDATORY_TEMPLATE_IDS);

/** True where the template is an affidavit and must be sworn before a notary. */
export function isNotaryMandatory(templateId: TemplateId | undefined): boolean {
  return templateId ? MANDATORY.has(templateId) : false;
}

/**
 * Why it is compulsory, in the words shown to the customer.
 *
 * One sentence, no jargon, and it says what happens if it is skipped — that is
 * the part that stops the question being asked again on the phone.
 */
export const NOTARY_MANDATORY_REASON =
  "An affidavit has to be sworn before a notary public. Without that attestation it is an unsworn statement, and the office asking for it will not accept it — so it is included in every affidavit rather than offered as an extra.";
