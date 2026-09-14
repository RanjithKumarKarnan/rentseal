/**
 * Stamp paper catalogue, counter services and delivery model.
 *
 * Tamil Nadu supplies non-judicial stamp paper through licensed vendors and
 * e-Stamp certificates through the authorised channel. We procure both and
 * charge for the errand — the denominations below are the ones ordinary
 * transactions actually call for.
 *
 * Two conventions, both borrowed from certificates.ts and both there for the
 * same reason:
 *
 *   - Physical paper is stocked in ₹100, ₹500, ₹1,000 and ₹5,000 and nothing
 *     else. Listing ₹20, ₹50 or ₹200 as "price on request" was still an offer
 *     to supply them, and the office cannot, so they are gone rather than
 *     unpriced. Duty below ₹100 goes on a ₹100 sheet; anything needing an
 *     exact figure goes on an e-Stamp.
 *   - `price: null` survives for the e-Stamp alone, whose value is whatever
 *     the instrument attracts. It renders "Price on request" rather than a
 *     guess — a made-up figure on a price list is one someone is held to.
 *   - Every price here is the amount payable for the sheet, blank and
 *     unprinted, before delivery. Face value and price are separate fields on
 *     purpose: the difference between them is our procurement charge, and the
 *     UI shows both rather than implying the state charges ₹120 for a ₹100
 *     sheet.
 */

export interface Denomination {
  /** Face value printed on the sheet. 0 for a variable-value e-Stamp. */
  value: number;
  label: string;
  /**
   * Rupees payable for one blank sheet, delivery excluded. Null where the
   * office has not quoted a rate for that denomination.
   */
  price: number | null;
  popular?: boolean;
  uses: string[];
  note?: string;
}

export const DENOMINATIONS: Denomination[] = [
  {
    value: 100,
    label: "₹100",
    price: 120,
    popular: true,
    uses: [
      "Rental agreements",
      "Affidavits and declarations",
      "Indemnity bonds",
      "Power of attorney",
      "No-objection certificates",
    ],
    note: "The denomination most 11-month rental agreements in Tamil Nadu are executed on, and the smallest sheet we stock — affidavits and bonds that used to go on ₹20 or ₹50 paper are executed on this.",
  },
  {
    value: 500,
    label: "₹500",
    price: 550,
    uses: ["Commercial agreements", "Partnership deeds", "Sale agreements", "Settlement deeds"],
  },
  {
    value: 1000,
    label: "₹1,000",
    price: 1100,
    uses: ["Lease deeds", "Development agreements", "Higher-value settlements", "Corporate guarantees"],
  },
  {
    value: 5000,
    label: "₹5,000",
    price: 5500,
    uses: ["Property instruments", "Mortgage deeds", "Large commercial leases", "High-value bonds"],
  },
  {
    value: 0,
    label: "Any value",
    price: null,
    uses: ["Lease deeds", "Sale deeds", "Mortgage deeds", "Development agreements"],
    note: "Issued as an e-Stamp certificate for any amount from ₹1 upward, against the exact duty payable. You pay the duty itself plus our charge, confirmed before you order.",
  },
];

/** The quoted denominations, in the order they are sold. */
export const PRICED_DENOMINATIONS = DENOMINATIONS.filter(
  (d): d is Denomination & { price: number } => d.price !== null,
);

/** What one blank sheet costs, and what of that is the state's. */
export function stampPaperPrice(value: number) {
  const d = DENOMINATIONS.find((x) => x.value === value);
  if (!d || d.price === null) return null;
  return { faceValue: d.value, price: d.price, ourCharge: d.price - d.value };
}

/* ══════════════ Combinations of sheets ══════════════
 *
 * A deed is not always executed on one sheet. The duty may be met by two ₹100
 * sheets, or a ₹500 and a ₹100 together — so the paper is chosen as a list, and
 * the price, the face value and the label all sum across it. An e-Stamp is the
 * empty list: a single certificate for the exact duty, with no sheet to buy.
 */

/** What every sheet in the combination costs to procure, added up. */
export function sheetsPrice(sheets: number[]): number {
  return sheets.reduce((sum, v) => sum + (stampPaperPrice(v)?.price ?? 0), 0);
}

/** Face value of every sheet in the combination — the state's part. */
export function sheetsFaceValue(sheets: number[]): number {
  return sheets.reduce((sum, v) => sum + (stampPaperPrice(v)?.faceValue ?? 0), 0);
}

/**
 * The combination written out for a person: "₹100 + ₹100", "₹500 + ₹100".
 * Empty means an e-Stamp.
 */
export function describeSheets(sheets: number[]): string {
  if (!sheets.length) return "e-Stamp — duty only";
  return sheets
    .map((v) => DENOMINATIONS.find((d) => d.value === v)?.label ?? `₹${v}`)
    .join(" + ");
}

/* ══════════════════ Sheets, stamps and labels sold alongside ══════════════ */

export interface StampAddOn {
  id: string;
  name: string;
  /** Rupees for one, delivery excluded. */
  price: number;
  /** What it is for, in one line. */
  blurb: string;
  /** Face value where the item carries one — the court fee labels do. */
  faceValue?: number;
}

/**
 * The counter items that go with a deed rather than instead of one.
 *
 * Green sheets are the continuation paper a deed runs onto once the stamp paper
 * is full; the revenue stamp is the one-rupee-class stamp a receipt is signed
 * across; court fee labels are what a petition carries. All sold singly.
 */
export const STAMP_ADD_ONS: StampAddOn[] = [
  {
    id: "green-sheet-a4",
    name: "Green sheet — A4",
    price: 3,
    blurb: "Continuation paper for a deed that runs past the stamp paper. Priced per sheet.",
  },
  {
    id: "green-sheet-legal",
    name: "Green sheet — legal size",
    price: 4,
    blurb: "The longer sheet, for deeds typed to legal width. Priced per sheet.",
  },
  {
    id: "revenue-stamp",
    name: "Revenue stamp",
    price: 2,
    blurb: "Affixed to receipts and acknowledgements, signed across. Priced per stamp.",
  },
  {
    id: "court-fee-10",
    name: "Court fee label — ₹10",
    price: 15,
    faceValue: 10,
    blurb: "For petitions, vakalats and applications that carry a ₹10 court fee.",
  },
  {
    id: "court-fee-20",
    name: "Court fee label — ₹20",
    price: 25,
    faceValue: 20,
    blurb: "For filings where the prescribed court fee is ₹20.",
  },
];

/* ═════════════════════ What the counter does with the paper ═══════════════ */

/**
 * What the counter does with the paper once it has it.
 *
 * Nothing here advertises the issue date of a sheet. Paper carrying an earlier
 * date is a question the office answers on the confirming call, against what
 * the vendor is actually holding — a public page offering it is an
 * advertisement to antedate an instrument, which is not the same thing at all.
 */
export interface CounterService {
  id: string;
  name: string;
  /** Rupees. Null where it is quoted on the job. */
  price: number | null;
  blurb: string;
}

export const COUNTER_SERVICES: CounterService[] = [
  {
    id: "print-on-stamp-paper",
    name: "Printing on the stamp paper",
    price: null,
    blurb:
      "Upload your own draft and we print it onto the stamp paper before it is delivered. Send it as a PDF or a Word file — the layout is set to leave the margins the sub-registrar expects.",
  },
  {
    id: "print-xerox",
    name: "Printouts and photocopies",
    price: null,
    blurb: "Black-and-white and colour printing, and photocopying, at the counter. Charged by the page.",
  },
  {
    id: "notary-on-stamp-paper",
    name: "Notary signature on stamp paper",
    price: 350,
    blurb:
      "A notary public attests the document, and two green sheets are included. This is the attestation charge only — the stamp paper itself is priced above.",
  },
  {
    id: "notary-white-sheet",
    name: "Notary signature on white paper",
    price: 100,
    blurb: "Attestation of a document typed on plain paper rather than stamp paper.",
  },
];

/* ═══════════════════════════════ Delivery ═════════════════════════════════ */

/**
 * Shipping, as the office quotes it.
 *
 * Two speeds within Chennai and two across the rest of Tamil Nadu. Same-day
 * inside the city goes by Porter and is billed at whatever Porter charges for
 * that run — we do not add to it, and we do not pretend to know it in advance.
 */
export interface ShippingOption {
  id: string;
  from: string;
  to: string;
  eta: string;
  /** Rupees. Null where the charge is passed through at cost. */
  charge: number | null;
  note?: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "chennai-porter",
    from: "Chennai",
    to: "Chennai",
    eta: "Same day",
    charge: null,
    note: "Sent by Porter and charged at Porter's own fare for the run, passed on at cost.",
  },
  {
    id: "chennai-next-day",
    from: "Chennai",
    to: "Chennai",
    eta: "Next day",
    charge: 100,
  },
  {
    id: "tn-express",
    from: "Chennai",
    to: "Anywhere in Tamil Nadu",
    eta: "Express",
    charge: 200,
  },
  {
    id: "tn-standard",
    from: "Chennai",
    to: "Anywhere in Tamil Nadu",
    eta: "2 – 3 days",
    charge: 100,
  },
];

export interface DeliveryZone {
  id: string;
  name: string;
  districts: string[];
  eta: string;
  charge: number;
  cutOff?: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "metro",
    name: "Chennai metro",
    districts: ["Chennai", "Chengalpattu", "Kancheepuram", "Tiruvallur"],
    eta: "Next day",
    charge: 100,
    cutOff: "Same day by Porter, charged at cost",
  },
  {
    id: "tier-2",
    name: "Major cities",
    districts: [
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
      "Tiruppur",
      "Erode",
      "Vellore",
      "Hosur",
      "Tirunelveli",
      "Thoothukudi",
    ],
    eta: "Express",
    charge: 200,
  },
  {
    id: "state",
    name: "Every other district",
    districts: ["All remaining districts of Tamil Nadu"],
    eta: "2 – 3 working days",
    charge: 100,
  },
];

export const DELIVERY_RULES = {
  /**
   * Rupees of PHYSICAL paper face value above which delivery is waived.
   *
   * e-Stamp value is excluded, and the name says so because the mistake is easy
   * and expensive: an e-Stamp is emailed, so there is no delivery to waive, and
   * an e-Stamp for the duty on a property deed runs to tens of thousands. Let
   * that count and a single certificate silently ships every sheet in the order
   * for nothing.
   */
  freeAbovePaperValue: 2000,
  bulkFreeFrom: 10,
  digitalInstant: true,
} as const;

export interface StampUseCase {
  title: string;
  denomination: string;
  body: string;
}

export const STAMP_USE_CASES: StampUseCase[] = [
  {
    title: "Rental & lease agreements",
    denomination: "₹100 or exact duty",
    body: "For an 11-month let, most people use ₹100 paper. Where the agreement runs 12 months or longer, duty is charged at 1% of the total rent plus deposit and we issue an e-Stamp for that exact figure.",
  },
  {
    title: "Affidavits & declarations",
    denomination: "₹100",
    body: "Name change, date of birth correction, address proof, single-status affidavits and the sworn statements colleges and passport offices ask for. All of them have to be sworn before a notary to count.",
  },
  {
    title: "Indemnity & surety bonds",
    denomination: "₹100",
    body: "Employment bonds, gap certificates, loss-of-document indemnities, and the guarantee letters banks and employers commonly require.",
  },
  {
    title: "Business & partnership deeds",
    denomination: "₹500",
    body: "Partnership deeds, LLP agreements, vendor contracts, franchise agreements and commercial leases where a higher denomination is prescribed.",
  },
  {
    title: "Property instruments",
    denomination: "₹1,000 – ₹5,000, or exact duty",
    body: "Sale agreements, mortgage deeds, gift and settlement deeds, development agreements — where duty runs into thousands and often only an e-Stamp certificate will do.",
  },
  {
    title: "Power of attorney",
    denomination: "₹100",
    body: "General and special powers of attorney, authorisation letters and the consent instruments registrars ask to see.",
  },
];

/**
 * Delivery charge for a zone, given the physical paper in the order.
 *
 * `paperValue` is the face value of the sheets being delivered and nothing
 * else. Do not pass the value of an e-Stamp: it is emailed, it is not part of
 * what the rider carries, and it does not buy free delivery for whatever else
 * is in the order.
 */
export function deliveryCharge(zoneId: string, paperValue: number, sheets = 1) {
  if (paperValue >= DELIVERY_RULES.freeAbovePaperValue) return 0;
  if (sheets >= DELIVERY_RULES.bulkFreeFrom) return 0;
  return DELIVERY_ZONES.find((z) => z.id === zoneId)?.charge ?? 100;
}
