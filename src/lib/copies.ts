import { sheetsPrice } from "./stamp-paper";

/**
 * Extra copies of the finished deed.
 *
 * People ask for these constantly — the landlord wants one, the tenant wants
 * one, the bank wants one, and a college or a consulate wants one it can keep.
 * Until now the office quoted them on the phone, so the figure never appeared
 * in the estimate the customer had already agreed to.
 *
 * Two kinds, priced differently because they cost the office differently:
 *
 *   - A printed copy is a second execution. It goes on its own sheet of stamp
 *     paper, so it carries the stamp charge again, plus ₹10 for every page
 *     printed. Ask for three and you pay for three sheets.
 *   - A soft copy is a scan. There is no sheet, so there is no stamp charge —
 *     only the ₹10 a page for producing it. It is charged once however many
 *     people it is sent to, because a file is not a thing you make twice.
 */

/** Rupees per page, for a printed copy or a soft one. */
export const COPY_PAGE_FEE = 10;

/**
 * What one printed copy comes to, on the given paper.
 *
 * A copy is a second execution, so it re-buys the whole combination of sheets
 * the original runs on — two ₹100 sheets cost two ₹100 sheets again — plus the
 * per-page printing.
 */
export function printedCopyUnitPrice(pages: number, sheets: number[]): number {
  const printed = Math.max(1, Math.floor(Number(pages) || 1));
  return sheetsPrice(sheets) + printed * COPY_PAGE_FEE;
}

/** Printed copies, at the whole stamped sheet set plus per-page printing apiece. */
export function printedCopiesFee(
  copies: number,
  pages: number,
  sheets: number[],
): number {
  const n = Math.max(0, Math.floor(Number(copies) || 0));
  return n * printedCopyUnitPrice(pages, sheets);
}

/** A soft copy, charged once by the page. */
export function softCopyFee(wanted: boolean, pages: number): number {
  if (!wanted) return 0;
  return Math.max(1, Math.floor(Number(pages) || 1)) * COPY_PAGE_FEE;
}
