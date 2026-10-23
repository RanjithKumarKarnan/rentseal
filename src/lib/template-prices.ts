import type { TemplateId } from "./agreement-templates";

/**
 * What a document costs to draft: one price, every document.
 *
 * The office's instruction of 23 October 2026. Until then each of the
 * sixty-two was priced off its own rate card — ₹350 for a house rent, ₹800 for
 * a partnership deed — and a visitor comparing two documents was comparing two
 * numbers before they had decided what they needed. One figure is easier to
 * quote on the phone, easier to put on a card, and the same whichever deed the
 * builder ends up drawing.
 *
 * It is also the whole of what we charge. Stamp paper, government duty, notary
 * attestation and delivery are sourced by the office and settled on the
 * confirming call — see quotedTotal() in stamp-duty.ts, which is what every
 * quote on the site shows.
 */
export const FLAT_DOCUMENT_PRICE = 350;

/** The least any document costs to draft. Flat pricing, so also the most. */
export const MINIMUM_DRAFT_PRICE = FLAT_DOCUMENT_PRICE;

/** The drafting fee for a template. The same for all sixty-two. */
export function templatePrice(id?: TemplateId): number {
  void id;
  return FLAT_DOCUMENT_PRICE;
}

/** Cheapest document on the list, for "from ₹350" copy. */
export const CHEAPEST_TEMPLATE_PRICE = FLAT_DOCUMENT_PRICE;
