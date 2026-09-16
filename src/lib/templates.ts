import type { AgreementType } from "./types";
import type { TemplateId } from "./agreement-templates";
import { TAMIL_TEMPLATES, TAMIL_TEMPLATE_IDS } from "./tamil-templates";
import { DEED_TEMPLATES, DEED_TEMPLATE_IDS } from "./deed-templates";
import { AFFIDAVIT_TEMPLATES, AFFIDAVIT_TEMPLATE_IDS } from "./affidavit-templates";
import {
  CONTRACT_TEMPLATES,
  CONTRACT_TEMPLATE_IDS,
  type ContractTemplateId,
} from "./contract-templates";

export interface AgreementTemplate {
  /**
   * Typed against the drafting specs on purpose: the browsable catalogue and
   * the twenty-four templates the builder can actually draw are the same list,
   * and the compiler now says so if one gains an entry the other lacks.
   */
  id: TemplateId;
  name: string;
  description: string;
  /** Which of the four service pages this template is drafted under. */
  baseType: AgreementType;
  category:
    | "Residential"
    | "Commercial"
    | "Lease deed"
    | "Leave & licence"
    | "Sale"
    | "Business contract"
    | "Deeds & undertakings"
    | "Affidavits"
    | "Tamil — தமிழ்";
  term: string;
  icon: string;
  popular?: boolean;
}

/**
 * The Tamil deeds, listed alongside the English ones.
 *
 * Derived from tamil-templates.ts so the sixteen are described in one place.
 * They are drafted through the same builder — picking one swaps the whole
 * document into Tamil and the form's answers land inside it.
 */
/** The standalone deeds — indemnity, affidavit, undertaking, private loan. */
const DEED_CATALOGUE: AgreementTemplate[] = DEED_TEMPLATE_IDS.map((id) => {
  const t = DEED_TEMPLATES[id];
  return {
    id,
    name: t.name,
    description: t.description,
    baseType: t.baseType,
    category: "Deeds & undertakings" as const,
    term: "One-off",
    icon: "FileSignature",
  };
});

/** The affidavits — sworn declarations, one deponent apiece. */
const AFFIDAVIT_CATALOGUE: AgreementTemplate[] = AFFIDAVIT_TEMPLATE_IDS.map((id) => {
  const t = AFFIDAVIT_TEMPLATES[id];
  return {
    id,
    name: t.name,
    description: t.description,
    baseType: t.baseType,
    category: "Affidavits" as const,
    term: "One-off",
    icon: "Scale",
  };
});

/**
 * The sale agreements, the corporate guarantee, the partnership deed and the
 * two memoranda.
 *
 * These sit under the category their instrument belongs to rather than in a set
 * of their own: an agreement for sale is a sale whatever it is written on, and
 * a memorandum of deposit of title deeds is a deed.
 */

/**
 * The two that are business contracts rather than sales or deeds, with the
 * term each actually runs for. A guarantee is executed once; a partnership is
 * at will and runs until the partners end it.
 */
const BUSINESS_CONTRACTS: Partial<Record<ContractTemplateId, { term: string; icon: string }>> = {
  "corporate-guarantee": { term: "One-off", icon: "Handshake" },
  "partnership-deed": { term: "At will", icon: "Users" },
};

const CONTRACT_CATALOGUE: AgreementTemplate[] = CONTRACT_TEMPLATE_IDS.map((id) => {
  const t = CONTRACT_TEMPLATES[id];
  const sale = t.baseType === "sale";
  const business = BUSINESS_CONTRACTS[id];
  return {
    id,
    name: t.name,
    description: t.description,
    baseType: t.baseType,
    category: (sale ? "Sale" : business ? "Business contract" : "Deeds & undertakings") as AgreementTemplate["category"],
    term: business?.term ?? "One-off",
    icon: sale ? "ShoppingBag" : business?.icon ?? "Landmark",
  };
});

const TAMIL_CATALOGUE: AgreementTemplate[] = TAMIL_TEMPLATE_IDS.map((id) => {
  const t = TAMIL_TEMPLATES[id];
  return {
    id,
    name: t.nameTa,
    description: `${t.nameEn}. Drafted in Tamil — ${t.roleB ? `${t.roleA} and ${t.roleB}` : t.roleA}.`,
    baseType: t.baseType,
    category: "Tamil — தமிழ்" as const,
    term: t.baseType === "residential" ? "11 months" : t.baseType === "lease" ? "36 months" : "One-off",
    icon: "Languages",
  };
});

const ENGLISH_TEMPLATES: AgreementTemplate[] = [
  /* ───────────── Residential ───────────── */
  {
    id: "residential-11-month",
    name: "11-Month Residential Rental Agreement",
    description: "The standard Tamil Nadu letting — stays outside compulsory registration and renews as often as you like.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "Home",
    popular: true,
  },
  {
    id: "flat-rental",
    name: "Flat / Apartment Rental Agreement",
    description: "For apartments in societies — carries association charges, common-area maintenance and parking allotment.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "Building",
  },
  {
    id: "independent-house-rental",
    name: "Independent House Rental Agreement",
    description: "For standalone houses where the tenant takes the whole premises, compound and utilities.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "House",
  },
  {
    id: "villa-rental",
    name: "Villa Rental Agreement",
    description: "Gated-community villas with clubhouse access, landscaping upkeep and community rules annexed.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "TreePalm",
  },
  {
    id: "single-room-rental",
    name: "Single Room Rental Agreement",
    description: "Lets one room or a portion of a house, with shared facilities described precisely in Schedule A.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "DoorOpen",
  },
  {
    id: "furnished-house-rental",
    name: "Furnished House Rental Agreement",
    description: "Adds a signed Schedule B inventory of every article — the document that settles deposit disputes.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "Sofa",
  },
  {
    id: "rental-renewal",
    name: "Rental Renewal Agreement",
    description: "Renews an expiring agreement with the revised rent and escalation, carrying forward the original terms.",
    baseType: "residential",
    category: "Residential",
    term: "11 months",
    icon: "RefreshCw",
  },
  /* ───────────── Commercial ───────────── */
  {
    id: "shop-rental",
    name: "Shop Rental Agreement",
    description: "Retail premises with permitted trade named, signage rights and reinstatement on exit.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "Store",
    popular: true,
  },
  {
    id: "office-rental",
    name: "Office Space Rental Agreement",
    description: "Offices and coworking floors — GST, Shops & Establishments registration and fit-out clauses included.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "Briefcase",
  },
  {
    id: "showroom-rental",
    name: "Showroom Rental Agreement",
    description: "High-street display premises with glass-front alterations, branding and hoarding rights spelt out.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "PanelsTopLeft",
  },
  {
    id: "warehouse-rental",
    name: "Warehouse / Godown Rental Agreement",
    description: "Storage and logistics use with loading access, weighbridge, insurance and hazardous-goods limits.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "Warehouse",
  },
  {
    id: "restaurant-rental",
    name: "Restaurant & Café Premises Agreement",
    description: "Food-service premises with FSSAI licensing, kitchen fit-out, exhaust and fire-clearance obligations.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "UtensilsCrossed",
  },
  {
    id: "clinic-rental",
    name: "Clinic / Diagnostic Centre Agreement",
    description: "Healthcare premises with clinical-establishment registration and biomedical waste responsibilities.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "Stethoscope",
  },
  {
    id: "industrial-shed-rental",
    name: "Industrial Shed Rental Agreement",
    description: "Factory sheds and SIPCOT units — power load, pollution-control consent and machinery installation terms.",
    baseType: "commercial",
    category: "Commercial",
    term: "36 months",
    icon: "Factory",
  },
  {
    id: "kiosk-rental",
    name: "Kiosk / Stall Rental Agreement",
    description: "Small-format retail inside malls, complexes or premises frontage, with defined operating hours.",
    baseType: "commercial",
    category: "Commercial",
    term: "12 months",
    icon: "ShoppingBag",
  },
  {
    id: "atm-space-rental",
    name: "ATM Space Rental Agreement",
    description: "Bank ATM installations with 24×7 access, power backup and security obligations allocated.",
    baseType: "commercial",
    category: "Commercial",
    term: "60 months",
    icon: "Landmark",
  },
  /* ───────────── Lease deed ───────────── */
  {
    id: "long-term-lease",
    name: "Long-Term Lease Deed",
    description: "For any term of 12 months or more, where registration at the Sub-Registrar Office is compulsory.",
    baseType: "lease",
    category: "Lease deed",
    term: "12 months +",
    icon: "FileSignature",
  },
  {
    id: "commercial-lease-deed",
    name: "Commercial Lease Deed",
    description: "Registered three-to-nine-year business leases with escalation fixed across the whole term.",
    baseType: "lease",
    category: "Lease deed",
    term: "36–108 months",
    icon: "Building2",
  },
  {
    id: "land-lease",
    name: "Land Lease Agreement",
    description: "Vacant plots leased for parking yards, storage or development, with boundaries fixed in Schedule A.",
    baseType: "lease",
    category: "Lease deed",
    term: "12 months +",
    icon: "Map",
  },
  {
    id: "agricultural-land-lease",
    name: "Agricultural Land Lease",
    description: "Farmland let for cultivation with crop pattern, water rights and produce-sharing terms recorded.",
    baseType: "lease",
    category: "Lease deed",
    term: "12 months +",
    icon: "Sprout",
  },
  /* ───────────── Leave & licence ───────────── */
  {
    id: "leave-licence-11-month",
    name: "Leave & Licence Agreement",
    description: "Permission to occupy without creating a tenancy — the cleaner route back to possession for owners.",
    baseType: "leave-license",
    category: "Leave & licence",
    term: "11 months",
    icon: "KeyRound",
  },
  {
    id: "pg-hostel-stay",
    name: "PG / Hostel Stay Agreement",
    description: "Paying-guest and hostel residents onboarded on licence terms, with house rules annexed.",
    baseType: "leave-license",
    category: "Leave & licence",
    term: "11 months",
    icon: "BedDouble",
  },
  {
    id: "coliving-serviced",
    name: "Co-living / Serviced Apartment Agreement",
    description: "Managed-stay operators at volume — drafted so the licence stays a licence, not an accidental tenancy.",
    baseType: "leave-license",
    category: "Leave & licence",
    term: "3–11 months",
    icon: "Users",
  },
  /* ───────────── Business contract ───────────── */
  {
    id: "service-provider",
    name: "Service Provider Agreement",
    description:
      "A company engages a provider to market and source within a territory, against a franchise fee. Thirteen clauses and three annexures.",
    baseType: "deed",
    category: "Business contract",
    term: "As agreed",
    icon: "Handshake",
  },

  /* ───────────── Sale ───────────── */
  {
    id: "two-wheeler-sale",
    name: "Two-Wheeler Sale Agreement",
    description:
      "Records the sale of a bike or scooter — price, vehicle numbers, the moment of handover, and who carries the challans from then on.",
    baseType: "sale",
    category: "Sale",
    term: "One-off",
    icon: "Bike",
  },
  {
    id: "parking-space-licence",
    name: "Parking Space Licence Agreement",
    description: "Car parks, two-wheeler bays and EV-charging slots licensed without granting exclusive possession.",
    baseType: "leave-license",
    category: "Leave & licence",
    term: "11 months",
    icon: "CircleParking",
  },
];

export const TEMPLATES: AgreementTemplate[] = [
  ...ENGLISH_TEMPLATES,
  ...DEED_CATALOGUE,
  ...AFFIDAVIT_CATALOGUE,
  ...CONTRACT_CATALOGUE,
  ...TAMIL_CATALOGUE,
];

/** Groups the catalogue, or any subset of it, in reading order. */
export function getTemplatesByCategory(list: AgreementTemplate[] = TEMPLATES) {
  const order: AgreementTemplate["category"][] = [
    "Residential",
    "Commercial",
    "Lease deed",
    "Leave & licence",
    "Sale",
    "Business contract",
    "Deeds & undertakings",
    "Affidavits",
    "Tamil — தமிழ்",
  ];
  return order.map((category) => ({
    category,
    templates: list.filter((t) => t.category === category),
  }));
}
