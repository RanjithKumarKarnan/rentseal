import type { TemplateId } from "./agreement-templates";

/**
 * What each of the sixty-two documents costs to draft, as the office priced
 * them. Their figures, transcribed, in the order their catalogue lists them.
 *
 * Typed as a total Record rather than a partial one on purpose: add a template
 * to the catalogue and forget to price it, and the build fails here rather than
 * the card rendering a blank where the price should be.
 *
 * This is the drafting fee alone. Stamp paper, notary attestation and delivery
 * are quoted on top, each from its own list — see stamp-paper.ts and notary.ts.
 */
export const TEMPLATE_PRICES: Record<TemplateId, number> = {
  /* ── Residential ─────────────────────────────────────────────────────── */
  "residential-11-month": 350,
  "flat-rental": 350,
  "independent-house-rental": 350,
  "villa-rental": 350,
  "single-room-rental": 350,
  "furnished-house-rental": 350,
  "rental-renewal": 350,

  /* ── Commercial ──────────────────────────────────────────────────────── */
  "shop-rental": 350,
  "office-rental": 350,
  "showroom-rental": 350,
  "warehouse-rental": 400,
  "restaurant-rental": 400,
  "clinic-rental": 400,
  "industrial-shed-rental": 400,
  "kiosk-rental": 400,
  "atm-space-rental": 400,

  /* ── Lease deed ──────────────────────────────────────────────────────── */
  "long-term-lease": 400,
  "commercial-lease-deed": 400,
  "land-lease": 400,
  "agricultural-land-lease": 400,

  /* ── Leave & licence ─────────────────────────────────────────────────── */
  "leave-licence-11-month": 400,
  "pg-hostel-stay": 400,
  "coliving-serviced": 400,
  "parking-space-licence": 400,

  /* ── Sale ────────────────────────────────────────────────────────────── */
  "two-wheeler-sale": 500,
  "sale-agreement-land": 600,
  "sale-agreement-flat": 600,
  "sale-agreement-detailed": 800,
  "sale-damaged-vehicle": 600,

  /* ── Business contract ───────────────────────────────────────────────── */
  "service-provider": 700,
  "corporate-guarantee": 800,
  "partnership-deed": 800,

  /* ── Deeds & undertakings ────────────────────────────────────────────── */
  "indemnity-jewel-slip": 400,
  "death-proof-affidavit": 350,
  "eb-temporary-connection": 350,
  "loan-agreement": 400,
  "mod-title-deeds": 600,
  "mod-title-deeds-bank": 500,

  /* ── Affidavits ──────────────────────────────────────────────────────── */
  "affidavit-separate-property": 400,
  "affidavit-no-claim-land": 400,
  "affidavit-no-proceedings": 400,
  "affidavit-gst-records": 400,
  "affidavit-minor-travel-consent": 500,
  "affidavit-lost-land-document": 600,
  "affidavit-sponsorship": 500,
  "affidavit-gas-name-change": 400,
  "affidavit-non-criminal-gap": 500,

  /* ── Tamil — தமிழ் ───────────────────────────────────────────────────── */
  "ta-house-rent": 350,
  "ta-shop-rent": 350,
  "ta-office-rent": 350,
  "ta-house-lease": 350,
  "ta-general-lease": 350,
  "ta-rent-renewal": 350,
  "ta-loan": 300,
  "ta-mortgage-loan": 350,
  "ta-sale-agreement": 700,
  "ta-absolute-sale": 700,
  "ta-vehicle-sale": 350,
  "ta-indemnity": 500,
  "ta-affidavit": 350,
  "ta-noc": 350,
  "ta-construction": 500,
  "ta-business-advance": 500,
};

/** The drafting fee for a template. */
export function templatePrice(id: TemplateId): number {
  return TEMPLATE_PRICES[id];
}

/** Cheapest document on the list, for "from ₹300" copy. */
export const CHEAPEST_TEMPLATE_PRICE = Math.min(...Object.values(TEMPLATE_PRICES));
