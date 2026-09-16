import type { AgreementType, FurnishingLevel, PropertyKind } from "./types";
import { TAMIL_TEMPLATES, TAMIL_TEMPLATE_IDS, type TamilTemplateId } from "./tamil-templates";
import { SERVICE_PROVIDER_BODY } from "./service-provider-template";
import { DEED_TEMPLATES, DEED_TEMPLATE_IDS, type DeedTemplateId } from "./deed-templates";
import {
  AFFIDAVIT_TEMPLATES,
  AFFIDAVIT_TEMPLATE_IDS,
  type AffidavitTemplateId,
} from "./affidavit-templates";
import {
  CONTRACT_TEMPLATES,
  CONTRACT_TEMPLATE_IDS,
  type ContractTemplateId,
} from "./contract-templates";

/**
 * The drafting spec behind every template LP Stamp Paper offers.
 *
 * The office signed off twenty-four Word templates; this file is those
 * templates, in code. Clauses 1 to 16 are shared and are generated in
 * `clauses.ts` from the builder's answers, so they say "three months' notice"
 * only because somebody chose three. What lives here is the rest: the deed's
 * own title, what the two sides are called, the term the office uses for that
 * instrument, and the specialist clauses that belong to this template and no
 * other — the signboard clause for a shop, the bed-and-room clause for a PG,
 * the standing-crop clause for agricultural land.
 *
 * The clause text is transcribed from the signed-off documents verbatim.
 * Blanks left as ____ are the ones the office fills in by hand at the counter;
 * every one can also be filled in from the builder, because a customer can
 * edit any clause before the deed is sent.
 */

/** The templates drafted in English, from the office's Word originals. */
export type EnglishTemplateId =
  | "service-provider"
  | "two-wheeler-sale"
  | "residential-11-month"
  | "atm-space-rental"
  | "agricultural-land-lease"
  | "clinic-rental"
  | "coliving-serviced"
  | "commercial-lease-deed"
  | "flat-rental"
  | "furnished-house-rental"
  | "independent-house-rental"
  | "industrial-shed-rental"
  | "kiosk-rental"
  | "land-lease"
  | "leave-licence-11-month"
  | "long-term-lease"
  | "office-rental"
  | "pg-hostel-stay"
  | "parking-space-licence"
  | "rental-renewal"
  | "restaurant-rental"
  | "shop-rental"
  | "showroom-rental"
  | "single-room-rental"
  | "villa-rental"
  | "warehouse-rental"
  ;

/** Every template the builder can draw, in either language. */
export type TemplateId =
  | EnglishTemplateId
  | TamilTemplateId
  | DeedTemplateId
  | AffidavitTemplateId
  | ContractTemplateId;

export interface TemplateSpec {
  id: TemplateId;
  /** Which instrument this is drafted under. */
  baseType: AgreementType;
  /**
   * Lettings share sixteen generated clauses; a sale shares none of them, so
   * its `clauses` are the whole deed rather than an addition to a core.
   */
  /**
   * "verbatim" means the document is kept paragraph for paragraph as the office
   * wrote it, rather than assembled from the shared clause set — true of every
   * Tamil deed and of the service provider agreement.
   */
  family?: "letting" | "sale" | "verbatim";
  /** Tamil deeds are drafted and printed in Tamil; everything else in English. */
  language?: "en" | "ta";
  /** The whole document, for the verbatim templates. */
  body?: Array<{ text: string; heading?: boolean }>;
  /** The heading the deed carries, e.g. "SHOP RENTAL AGREEMENT". */
  deedTitle: string;
  /** What the two sides are called throughout — LANDLORD/TENANT, LESSOR/LESSEE, LICENSOR/LICENSEE. */
  roleA: string;
  roleB: string;
  /** "rent" or "licence fee" — a licence does not charge rent. */
  moneyWord: string;
  /** Named in the WHEREAS recital and in the change-of-use clause. */
  purpose: string;
  scheduleHeading: string;
  /** Applied to the draft when the template is picked. */
  defaults: {
    durationMonths: number;
    propertyKind: PropertyKind;
    furnishing?: FurnishingLevel;
    commercialUse: boolean;
    registrationRequired: boolean;
  };
  /** Shown in the builder before drafting starts. */
  notes: string[];
  /** Clauses belonging to this template alone, appended after the shared set. */
  clauses: string[];
}

const ENGLISH_SPECS: Record<EnglishTemplateId, TemplateSpec> = {
  "service-provider": {
    id: "service-provider",
    baseType: "deed",
    family: "verbatim",
    language: "en",
    deedTitle: "SERVICE PROVIDER AGREEMENT",
    roleA: "COMPANY",
    roleB: "SERVICE PROVIDER",
    moneyWord: "franchise fee",
    purpose: "MARKETING, SOURCING AND ALLIED ACTIVITIES",
    scheduleHeading: "ANNEXURES",
    defaults: {
      durationMonths: 0,
      propertyKind: "office",
      commercialUse: true,
      registrationRequired: false,
    },
    notes: [
      "A business-to-business contract: both sides are companies, so fill in the registered name, the registered address and the CIN, not a personal address.",
      "The three annexures carry the substance — the services, the territory and the fee. An agreement signed with them blank is an agreement about nothing.",
      "Stamp duty on an agreement of this kind is nominal in Tamil Nadu, but it must still be stamped before signature.",
      "Both sides sign, and the person signing for a company must be authorised to.",
      "This is a drafting aid, not legal advice. Have it checked if the arrangement is unusual.",
    ],
    clauses: [],
    body: SERVICE_PROVIDER_BODY,
  },
  "two-wheeler-sale": {
    id: "two-wheeler-sale",
    baseType: "sale",
    family: "sale",
    deedTitle: "TWO-WHEELER SALE AGREEMENT",
    roleA: "SELLER",
    roleB: "BUYER",
    moneyWord: "sale consideration",
    purpose: "SALE",
    scheduleHeading: "VEHICLE DETAILS",
    defaults: {
      durationMonths: 0,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Fill in the registration, engine and chassis numbers exactly as they appear on the RC. A wrong digit is what stops the transfer at the RTO.",
      "The buyer must apply for transfer of ownership in Form 29/30 within the period agreed here. Until that is done the vehicle stays in the seller's name.",
      "Until transfer, challans and liabilities follow the registered owner on paper. This agreement fixes the handover date and time so responsibility can be shown to have passed.",
      "Both parties sign, and two witnesses sign with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The vehicle has been handed over to the BUYER on {{handover}} along with the available vehicle documents and keys.",
      "The BUYER agrees to transfer the ownership of the vehicle into the BUYER's name within {{transferDays}} of this agreement.",
      "From the date and time of handover, the BUYER shall be responsible for the vehicle and for any challans, fines, accidents, damages or other liabilities arising from the use of the vehicle.",
      "Both parties have agreed to the above terms and have signed this agreement voluntarily.",
    ],
  },
  "residential-11-month": {
    id: "residential-11-month",
    baseType: "residential",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises are let for RESIDENTIAL PURPOSE only and shall be occupied by the TENANT and the TENANT's immediate family alone.",
      "The TENANT shall keep the premises in good and tenantable condition and shall carry out minor repairs to taps, switches, fuses and sanitary fittings at the TENANT's own cost.",
      "The LANDLORD shall attend to major and structural repairs, including to the roof, external walls and main plumbing and electrical lines, within a reasonable time of being notified.",
    ],
  },
  "atm-space-rental": {
    id: "atm-space-rental",
    baseType: "commercial",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 60,
      propertyKind: "shop",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises admeasuring approximately ____ square feet are let for the installation and operation of an Automated Teller Machine of the TENANT bank and for no other purpose.",
      "The TENANT and its customers, staff, cash-replenishment agents and service engineers shall have access to the premises twenty-four hours a day on all days of the year, including holidays.",
      "The LANDLORD shall provide an uninterrupted power supply point of ____ KVA and shall permit the TENANT to install, at the TENANT's cost, a power backup unit, air-conditioning, lighting, signage, CCTV and the necessary data cabling.",
      "The ATM, the cash contained in it, the cabling and all equipment installed shall remain the exclusive property of the TENANT and shall be removed by the TENANT on vacating. The LANDLORD shall have no claim or lien over any of it.",
      "The LANDLORD shall not permit any other bank to install an ATM within the same premises during the currency of this agreement.",
      "The TENANT shall be responsible for the security of the ATM and its cash. The LANDLORD shall extend reasonable cooperation in the event of any incident.",
    ],
  },
  "agricultural-land-lease": {
    id: "agricultural-land-lease",
    baseType: "lease",
    deedTitle: "LEASE DEED",
    roleA: "LESSOR",
    roleB: "LESSEE",
    moneyWord: "rent",
    purpose: "AGRICULTURAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE LAND",
    defaults: {
      durationMonths: 36,
      propertyKind: "land",
      commercialUse: false,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LESSOR demises unto the LESSEE the agricultural land described in the Schedule, admeasuring ____ acres, in Survey No.____ of ____________ Village, for a term of ____ years commencing from ____________.",
      "The LESSEE shall cultivate the land personally or through hired labour, shall raise only the crops of ____________________, and shall not put the land to any non-agricultural use.",
      "The LESSEE shall be entitled to draw water from the well, borewell and channel serving the land for the purposes of cultivation, and shall maintain the pump set and the field channels in working order.",
      "The LESSEE shall cultivate the land in a husbandlike manner, shall not exhaust the soil, and shall not remove topsoil, sand or earth from the land.",
      "The standing crop at the expiry of the term shall belong to the LESSEE, who shall be permitted to harvest it within ____ days of the expiry, after which the land shall be delivered up vacant.",
      "The land revenue and the kist payable to the Government shall be borne by the LESSOR. The cost of seed, fertiliser, labour and electricity for the pump set shall be borne by the LESSEE.",
    ],
  },
  "clinic-rental": {
    id: "clinic-rental",
    baseType: "commercial",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "office",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises shall be used as a clinic or diagnostic centre for the practice of ____________________ and for no other purpose.",
      "The TENANT shall obtain and maintain registration under the Tamil Nadu Clinical Establishments (Regulation) Act and every other approval required for the practice, and shall display the registration at the premises as required by law.",
      "The TENANT shall handle, segregate and dispose of biomedical waste strictly in accordance with the Bio-Medical Waste Management Rules, 2016, through an authorised common treatment facility, and shall retain the disposal records.",
      "Where any radiological or imaging equipment is installed, the TENANT shall obtain the approval of the Atomic Energy Regulatory Board and shall carry out the shielding of the room at the TENANT's own cost and to the standard prescribed.",
      "The TENANT shall carry professional indemnity insurance in respect of the practice. The LANDLORD shall bear no responsibility whatsoever for the clinical services rendered at the premises.",
      "The TENANT shall install the equipment in a manner that does not damage the structure, and shall make good the flooring, walls and shielding on vacating.",
    ],
  },
  "coliving-serviced": {
    id: "coliving-serviced",
    baseType: "leave-license",
    deedTitle: "LEAVE AND LICENCE AGREEMENT",
    roleA: "LICENSOR",
    roleB: "LICENSEE",
    moneyWord: "licence fee",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      furnishing: "fully-furnished",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total licence fee over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LICENSOR permits the LICENSEE to occupy unit No.____ in the co-living premises described in the Schedule, on the terms recorded in this agreement.",
      "The monthly charge of Rs.____/- includes housekeeping ____ times a week, linen change, Wi-Fi, electricity up to ____ units, water, common-area maintenance and the use of the community spaces.",
      "Consumption of electricity in excess of the included units, laundry beyond the included service, and any additional housekeeping shall be charged separately and shall be payable with the next month's charge.",
      "The LICENSOR may relocate the LICENSEE to another unit of comparable specification within the same premises on ____ days' written notice, without any change in the monthly charge.",
      "The LICENSEE shall observe the community guidelines, including those relating to noise, guests, the use of common kitchens and the community calendar.",
      "This agreement creates a licence only and no tenancy or interest in the premises. It may be terminated by either party by ____ days' written notice.",
    ],
  },
  "commercial-lease-deed": {
    id: "commercial-lease-deed",
    baseType: "lease",
    deedTitle: "LEASE DEED",
    roleA: "LESSOR",
    roleB: "LESSEE",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 60,
      propertyKind: "office",
      commercialUse: false,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LESSOR demises unto the LESSEE the commercial premises described in the Schedule for a term of ____ years commencing from ____________, for the purpose of ____________________.",
      "This deed shall be registered before the jurisdictional Sub-Registrar within the time prescribed, and the stamp duty and registration charges shall be borne by the LESSEE.",
      "The rent shall stand enhanced by ____% at the end of every ____ months. The security deposit shall be enhanced proportionately at each such revision.",
      "The LESSEE may assign or sub-lease the demised premises to a holding, subsidiary or group company of the LESSEE with the prior written intimation of the LESSOR, and to no other person without the LESSOR's written consent.",
      "The LESSEE shall be entitled to a rent-free fit-out period of ____ days from the date of handing over, during which no rent shall be payable but the maintenance and utility charges shall be borne by the LESSEE.",
      "All statutory outgoings on the ownership of the premises, including property tax, shall be borne by the LESSOR. All outgoings on the use and occupation shall be borne by the LESSEE.",
    ],
  },
  "flat-rental": {
    id: "flat-rental",
    baseType: "residential",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The TENANT shall pay monthly maintenance charges of Rs.____/- to the Apartment Owners' Association, in addition to the rent, and shall produce the receipts on demand.",
      "The TENANT shall abide by the bye-laws, rules and resolutions of the Apartment Owners' Association, including those relating to the use of the lift, common areas, terrace and generator.",
      "One covered car parking slot bearing No.____ is allotted for the exclusive use of the TENANT. The TENANT shall park only in the allotted slot and shall not obstruct common passages.",
      "The TENANT shall not carry out any work that disturbs the other occupants outside the hours permitted by the Association, and shall not alter the external appearance of the flat, including grills, balconies and window fittings.",
    ],
  },
  "furnished-house-rental": {
    id: "furnished-house-rental",
    baseType: "residential",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "independent-house",
      furnishing: "fully-furnished",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises are let on a fully furnished basis. The articles handed over are listed in SCHEDULE B to this agreement, with the condition of each recorded on the date of possession, and both parties have signed that schedule.",
      "The TENANT shall return each article listed in Schedule B in the same condition, normal wear and tear excepted. The cost of repairing or replacing any article damaged or lost during the term shall be borne by the TENANT and may be deducted from the security deposit.",
      "The TENANT shall not remove any article from the premises, nor substitute any article with another, without the written consent of the LANDLORD.",
      "The LANDLORD shall service the air-conditioning units and major appliances once during the term. Any repair arising from the TENANT's misuse shall be at the TENANT's cost.",
    ],
  },
  "independent-house-rental": {
    id: "independent-house-rental",
    baseType: "residential",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "independent-house",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The letting includes the whole compound, the gate, the open yard, the terrace and the overhead tank, all of which the TENANT shall keep clean and in good order.",
      "The TENANT shall maintain the garden and open areas and shall not fell, cut or damage any tree standing on the property.",
      "The TENANT shall operate the borewell and the water motor with due care and shall report any failure to the LANDLORD promptly. The cost of repairing the motor shall be borne by the LANDLORD unless the failure is caused by the TENANT's misuse.",
      "The TENANT shall be responsible for the security of the premises and shall keep the gate locked. The LANDLORD shall not be liable for any loss of the TENANT's belongings.",
    ],
  },
  "industrial-shed-rental": {
    id: "industrial-shed-rental",
    baseType: "commercial",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 60,
      propertyKind: "warehouse",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises shall be used for the manufacture, assembly or processing of ____________________ and for no other purpose.",
      "The sanctioned power load for the premises is ____ HP. The TENANT shall not exceed it, and shall bear the cost and obtain the approvals for any enhancement required for the TENANT's operations.",
      "The TENANT shall obtain and maintain the consent to establish and the consent to operate from the Tamil Nadu Pollution Control Board, the factory licence where applicable, and every other statutory approval, and shall keep the LANDLORD indemnified against any default.",
      "The TENANT may install machinery on the premises with the prior written intimation of the LANDLORD. Such machinery shall remain the property of the TENANT and shall be removed on vacating, with the flooring and foundations made good at the TENANT's cost.",
      "The TENANT shall comply with the Factories Act, 1948 and all labour and safety legislation in respect of the persons employed at the premises. The LANDLORD shall have no liability in that regard.",
      "The TENANT shall not discharge any effluent, chemical or industrial waste into the common drainage or onto the surrounding land.",
    ],
  },
  "kiosk-rental": {
    id: "kiosk-rental",
    // A mall kiosk is licensed, not let: its own clauses say "this licence
    // creates no tenancy". The signed-off document still called the parties
    // LANDLORD and TENANT, contradicting its own drafting, so the roles follow
    // the clauses rather than the other way round.
    baseType: "leave-license",
    deedTitle: "LICENCE AGREEMENT",
    roleA: "LICENSOR",
    roleB: "LICENSEE",
    moneyWord: "licence fee",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 12,
      propertyKind: "shop",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LICENSOR grants to the LICENSEE the right to occupy the kiosk bearing No.____ admeasuring approximately ____ square feet situated at ____________________, for the sale of ____________________.",
      "The LICENSEE shall trade only during the operating hours of the host premises, being ____ to ____ on all days, and shall keep the kiosk open throughout those hours unless prevented by a cause beyond the LICENSEE's control.",
      "The LICENSEE shall not extend the kiosk beyond its allotted footprint, shall not place stock, boards or stands in the common passage, and shall keep the surrounding area clean.",
      "The LICENSEE shall not assign, share or part with the kiosk, and this licence creates no tenancy, lease or interest in the premises in favour of the LICENSEE.",
      "The LICENSOR may revoke this licence by ____ days' written notice, whereupon the LICENSEE shall remove the kiosk fittings and hand over the space in its original condition.",
    ],
  },
  "land-lease": {
    id: "land-lease",
    baseType: "lease",
    deedTitle: "LEASE DEED",
    roleA: "LESSOR",
    roleB: "LESSEE",
    moneyWord: "rent",
    purpose: "THE PURPOSE RECORDED BELOW",
    scheduleHeading: "SCHEDULE OF THE LAND",
    defaults: {
      durationMonths: 60,
      propertyKind: "land",
      commercialUse: false,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LESSOR demises unto the LESSEE the vacant land described in the Schedule, admeasuring ____ square feet, for a term of ____ years commencing from ____________.",
      "The LESSEE shall use the land for ____________________ and shall not put it to any other use without the written consent of the LESSOR.",
      "The LESSEE may erect a temporary structure on the land with the prior written consent of the LESSOR. Any structure so erected shall be removed by the LESSEE at the LESSEE's cost on the expiry of the term, and the land restored to its original condition, unless the LESSOR elects in writing to retain it.",
      "The LESSEE shall fence the land, keep it free of encroachment, and shall promptly inform the LESSOR of any adverse claim, trespass or encroachment.",
      "The land revenue, quit rent and property tax payable on the land shall be borne by the LESSOR. All charges arising from the LESSEE's use, including electricity and water, shall be borne by the LESSEE.",
      "The LESSEE shall not dig, quarry, remove earth, sand or minerals from the land, nor fell any tree standing on it, without the written consent of the LESSOR.",
    ],
  },
  "leave-licence-11-month": {
    id: "leave-licence-11-month",
    baseType: "leave-license",
    deedTitle: "LEAVE AND LICENCE AGREEMENT",
    roleA: "LICENSOR",
    roleB: "LICENSEE",
    moneyWord: "licence fee",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total licence fee over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LICENSOR grants to the LICENSEE the bare permission to occupy and use the premises described in the Schedule for a period of ____ months commencing from ____________.",
      "This agreement creates a licence only. It does not create any tenancy, lease, sub-lease or any interest in the premises in favour of the LICENSEE, and the juridical possession of the premises shall at all times remain with the LICENSOR.",
      "The LICENSEE shall pay a licence fee of Rs.____/- per month, on or before the ____ of every month, and shall not be entitled to claim any right of tenancy by reason of such payment.",
      "The LICENSOR shall be entitled to enter the premises at any reasonable time, and the LICENSEE shall not obstruct such entry.",
      "This licence may be revoked by the LICENSOR by ____ days' written notice, whereupon the LICENSEE shall vacate the premises without demur and without claiming any right to remain in occupation.",
      "The LICENSEE shall not make any alteration to the premises, shall not part with the possession or use of the premises to any person, and shall not carry on any business from the premises.",
    ],
  },
  "long-term-lease": {
    id: "long-term-lease",
    baseType: "lease",
    deedTitle: "LEASE DEED",
    roleA: "LESSOR",
    roleB: "LESSEE",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LESSOR hereby demises unto the LESSEE the premises described in the Schedule for a term of ____ years commencing from ____________, on the rent and terms recorded in this deed.",
      "This deed shall be registered before the jurisdictional Sub-Registrar. The stamp duty and registration charges shall be borne by the LESSEE unless otherwise agreed in writing.",
      "The rent shall stand enhanced by ____% at the end of every ____ months of the term, and the enhanced rent shall be payable without further demand.",
      "The LESSEE shall have the option to renew this lease for a further term of ____ years on the same terms save as to rent, by giving the LESSOR written notice not less than three months before the expiry of the term.",
      "Neither party shall terminate this lease during the first ____ months of the term. If the LESSEE vacates within that period, the rent for the unexpired part of the lock-in shall become immediately payable.",
      "The LESSEE shall be entitled to peaceful and uninterrupted possession of the demised premises throughout the term, so long as the LESSEE observes the covenants of this deed.",
    ],
  },
  "office-rental": {
    id: "office-rental",
    baseType: "commercial",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "office",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises shall be used as a business office for the purpose of ____________________ and for no other purpose.",
      "The TENANT may carry out interior fit-out work, including partitions, cabling, networking and false ceiling, with the prior written consent of the LANDLORD, and shall restore the premises on vacating unless the LANDLORD elects in writing to retain the work.",
      "The LANDLORD shall provide access to the lift, the common air-conditioning, the power backup and the building security during the working hours notified. Charges for these common services shall be borne by the TENANT as billed.",
      "The rent stated above is exclusive of Goods and Services Tax. Where GST is payable on the letting, it shall be borne by the TENANT and paid against a valid tax invoice.",
      "____ car parking slots and ____ two-wheeler slots are allotted for the use of the TENANT and its staff.",
    ],
  },
  "pg-hostel-stay": {
    id: "pg-hostel-stay",
    baseType: "leave-license",
    deedTitle: "PAYING GUEST AGREEMENT",
    roleA: "LICENSOR",
    roleB: "LICENSEE",
    moneyWord: "licence fee",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total licence fee over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LICENSOR permits the LICENSEE to occupy bed No.____ in room No.____ of the premises on a paying-guest basis, together with the use of the common bathroom, dining hall and washing area.",
      "The monthly charge of Rs.____/- is payable in advance on or before the ____ of each month and is inclusive of ____________________ (meals, electricity, water, housekeeping and internet as applicable).",
      "The LICENSEE shall observe the house rules, including the entry timing of ____ p.m., shall inform the LICENSOR before staying away overnight, and shall not permit any outside person to stay in the room.",
      "Cooking in the room, smoking, consumption of liquor and the keeping of pets are not permitted anywhere on the premises.",
      "This arrangement is a licence to use a bed and creates no tenancy or interest in the premises. The LICENSOR may terminate it by ____ days' notice, and the LICENSEE may leave on giving the same notice.",
      "The LICENSEE shall be responsible for the LICENSEE's own belongings. The LICENSOR shall not be liable for any loss or theft of personal property.",
    ],
  },
  "parking-space-licence": {
    id: "parking-space-licence",
    baseType: "leave-license",
    deedTitle: "LICENCE AGREEMENT",
    roleA: "LICENSOR",
    roleB: "LICENSEE",
    moneyWord: "licence fee",
    purpose: "PARKING PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PARKING SLOT",
    defaults: {
      durationMonths: 12,
      propertyKind: "land",
      commercialUse: false,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total licence fee over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The LICENSOR grants to the LICENSEE the right to park one ____________ (two-wheeler / four-wheeler) bearing registration No.____________ in the parking slot bearing No.____ at the premises described in the Schedule.",
      "The licence fee is Rs.____/- per month, payable on or before the ____ of every month.",
      "The slot shall be used for parking the said vehicle only. The LICENSEE shall not store any goods, fuel or material in the slot, shall not carry out any repair, servicing or washing of the vehicle there, and shall not sub-let or share the slot.",
      "The LICENSEE shall park within the marked bay, shall not obstruct the adjoining slots or the access driveway, and shall observe the parking rules of the premises.",
      "The LICENSOR shall not be liable for any theft of or damage to the vehicle or its contents. The LICENSEE shall insure the vehicle at the LICENSEE's own cost.",
      "This licence creates no tenancy or interest in the premises and may be revoked by either party by ____ days' written notice.",
    ],
  },
  "rental-renewal": {
    id: "rental-renewal",
    baseType: "residential",
    deedTitle: "RENTAL RENEWAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "This agreement is a renewal of the Rental Agreement dated ____________ executed between the same parties in respect of the same premises, the terms of which are confirmed except as varied below.",
      "The monthly rent stands revised from Rs.____/- to Rs.____/- with effect from ____________, being an increase of ____%.",
      "The security deposit already held by the LANDLORD shall continue to be held on the same terms, and shall be topped up by a further sum of Rs.____/- payable on the date of this renewal.",
      "The possession of the TENANT is continuous and uninterrupted since the commencement of the original tenancy. Nothing in this renewal shall be construed as the creation of a fresh tenancy.",
    ],
  },
  "restaurant-rental": {
    id: "restaurant-rental",
    baseType: "commercial",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "shop",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises shall be used for the business of a restaurant, café or eating house and for no other purpose.",
      "The TENANT shall obtain and maintain at the TENANT's own cost the licence under the Food Safety and Standards Act, 2006, the trade licence of the local body, the fire safety clearance and the consent of the Tamil Nadu Pollution Control Board where applicable, and shall produce them to the LANDLORD on demand.",
      "The TENANT shall install and maintain a kitchen exhaust system with adequate filtration, a grease trap on the kitchen outlet, and shall ensure that cooking odours and smoke do not cause nuisance to the neighbouring occupants or the upper floors.",
      "The TENANT shall arrange for the daily removal of wet and dry waste through the local body or a licensed contractor, and shall not accumulate waste on or around the premises.",
      "The TENANT shall bear the cost of any additional water and drainage connection required for the business, and shall not discharge grease, oil or solid waste into the common drainage.",
      "The TENANT shall keep the fire extinguishers charged and the fire exits clear at all times, and shall permit inspection by the LANDLORD and the authorities.",
    ],
  },
  "shop-rental": {
    id: "shop-rental",
    baseType: "commercial",
    deedTitle: "SHOP RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "shop",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises shall be used solely for the business of ____________________ and for no other purpose without the written consent of the LANDLORD.",
      "The TENANT shall obtain and maintain at the TENANT's own cost every licence and registration required for the said business, including registration under the Tamil Nadu Shops and Establishments Act, 1947, the trade licence of the local body, and registration under the Goods and Services Tax law.",
      "The TENANT may display a signboard of the business on the frontage of the shop, at the TENANT's cost and subject to the rules of the local body, and shall remove it and make good the frontage on vacating.",
      "The TENANT shall not store any inflammable, hazardous or prohibited goods on the premises, and shall not do anything that would void the insurance on the building.",
      "The TENANT shall reinstate the premises to their original condition on vacating, removing all fixtures, racks, shelving and fit-out work erected during the term.",
    ],
  },
  "showroom-rental": {
    id: "showroom-rental",
    baseType: "commercial",
    deedTitle: "SHOWROOM RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "shop",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The letting includes the street frontage of ____ feet and the right to display goods in the glass elevation of the premises.",
      "The TENANT may erect a hoarding or illuminated signboard on the elevation, subject to the approval of the local body, and shall bear the licence fee, the electricity for the signage and the cost of removal on vacating.",
      "The TENANT shall keep the frontage, the glass elevation and the pavement immediately in front of the premises clean, and shall not encroach upon or obstruct the pavement with goods or displays.",
      "The TENANT shall bear the cost of replacing any glass panel of the elevation broken during the term, whatever the cause, save where the breakage arises from a structural defect of the building.",
      "The TENANT shall maintain adequate insurance in respect of the stock kept on the premises. The LANDLORD shall not be liable for any loss or damage to the stock.",
    ],
  },
  "single-room-rental": {
    id: "single-room-rental",
    baseType: "residential",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "apartment",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The letting is of one room bearing No.____ situated on the ____ floor of the premises, together with the right to use the common bathroom, wash area and staircase in common with the other occupants.",
      "The TENANT shall use the shared facilities considerately, shall keep them clean after use, and shall not obstruct the common passage with belongings, footwear or cycles.",
      "The TENANT shall not permit any person to stay overnight in the room without the prior intimation of the LANDLORD, and the room shall be occupied by not more than ____ person(s).",
      "The TENANT shall not cook in the room unless a separate kitchen or cooking area has been provided, and shall not use any high-wattage appliance without the LANDLORD's consent.",
    ],
  },
  "villa-rental": {
    id: "villa-rental",
    baseType: "residential",
    deedTitle: "RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "RESIDENTIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 11,
      propertyKind: "villa",
      commercialUse: false,
      registrationRequired: false,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The TENANT shall be entitled to use the clubhouse, gymnasium, swimming pool and other common facilities of the community, subject to the rules of the management and on payment of any usage charges levied.",
      "Landscaping and upkeep of the common areas shall be carried out by the community management. The TENANT shall maintain the private garden and portico of the villa.",
      "The TENANT shall register all vehicles, domestic help and regular visitors with the community security office and shall comply with the entry procedures in force.",
      "The TENANT shall not install any external fixture, air-conditioning unit, dish antenna or signage on the elevation of the villa without the written consent of the LANDLORD and the community management.",
    ],
  },
  "warehouse-rental": {
    id: "warehouse-rental",
    baseType: "commercial",
    deedTitle: "GODOWN RENTAL AGREEMENT",
    roleA: "LANDLORD",
    roleB: "TENANT",
    moneyWord: "rent",
    purpose: "COMMERCIAL PURPOSE",
    scheduleHeading: "SCHEDULE OF THE PREMISES",
    defaults: {
      durationMonths: 36,
      propertyKind: "warehouse",
      commercialUse: true,
      registrationRequired: true,
    },
    notes: [
      "Replace every ____ blank. Anything left blank is a gap in the agreement, not a formality.",
      "Stamp duty in Tamil Nadu is 1% of the total rent over the whole term plus any deposit. Buy the non-judicial stamp paper for at least that value before printing.",
      "A term of twelve months or more must be registered before the Sub-Registrar. Eleven months need not be.",
      "Both parties sign every page. Two witnesses sign at the end, with their names and addresses.",
      "This is a drafting aid, not legal advice. Have it checked if the transaction is unusual.",
    ],
    clauses: [
      "The premises shall be used for the storage of ____________________ and for no other purpose. No manufacturing, processing or retail activity shall be carried on at the premises.",
      "The TENANT shall not load the floor beyond ____ kilograms per square foot, and shall not stack goods in a manner that endangers the structure, blocks the fire exits or obstructs the sprinkler system.",
      "The TENANT shall not store any inflammable, explosive, corrosive, hazardous or statutorily prohibited goods on the premises, and shall hold the LANDLORD harmless against any claim arising from a breach of this clause.",
      "The TENANT shall insure the goods stored at the TENANT's own cost. The LANDLORD shall not be liable for any loss, theft, fire, flood or deterioration of the goods.",
      "The TENANT shall be responsible for the loading and unloading of goods, shall use only the designated bay, and shall not obstruct the access road or the neighbouring units.",
    ],
  },
};

/**
 * The Tamil deeds, as drafting specs.
 *
 * Derived from tamil-templates.ts rather than copied, so the sixteen live in
 * one place. They are selectable in the builder exactly like the English
 * templates — a customer picks one, answers the same questions, and the
 * answers land inside the Tamil text.
 */
const TAMIL_SPECS = TAMIL_TEMPLATE_IDS.reduce(
  (acc, id) => {
    const t = TAMIL_TEMPLATES[id];
    acc[id] = {
        id,
        baseType: t.baseType,
        family: "verbatim",
        language: "ta",
        deedTitle: t.nameTa,
        roleA: t.roleA,
        roleB: t.roleB || t.roleA,
        moneyWord: "வாடகை",
        purpose: t.nameTa,
        scheduleHeading: "சொத்து விவரம்",
        defaults: {
          durationMonths: t.baseType === "residential" ? 11 : t.baseType === "lease" ? 36 : 0,
          propertyKind: "apartment" as PropertyKind,
          commercialUse: t.baseType === "commercial",
          registrationRequired: t.baseType === "lease",
        },
        notes: [
          "இந்த ஒப்பந்தம் தமிழில் தயாரிக்கப்படுகிறது.",
          "படிவத்தில் நிரப்பப்படாத இடங்கள் ____ எனக் காட்டப்படும்; அவற்றை அலுவலகத்தில் நிரப்பலாம்.",
          "சரியான மதிப்புள்ள முத்திரைத் தாளில் அச்சிடவும்.",
        ],
      clauses: [],
      body: t.body,
    };
    return acc;
  },
  {} as Record<TamilTemplateId, TemplateSpec>,
);

/** The four standalone deeds, on the same verbatim footing as the Tamil set. */
const DEED_SPECS = DEED_TEMPLATE_IDS.reduce(
  (acc, id) => {
    const t = DEED_TEMPLATES[id];
    acc[id] = {
      id,
      baseType: t.baseType,
      family: "verbatim",
      language: "en",
      deedTitle: t.deedTitle,
      roleA: t.roleA,
      roleB: t.roleB || t.roleA,
      moneyWord: "amount",
      purpose: t.name,
      scheduleHeading: "SCHEDULE",
      defaults: {
        durationMonths: 0,
        propertyKind: "apartment",
        commercialUse: false,
        registrationRequired: false,
      },
      notes: [
        "Fill every blank. Anything left blank is a gap in the document, not a formality.",
        "Print on non-judicial stamp paper of the right value, and have it attested where the document calls for it.",
        "This is a drafting aid, not legal advice. Have it checked if the matter is unusual.",
      ],
      clauses: [],
      body: t.body,
    };
    return acc;
  },
  {} as Record<DeedTemplateId, TemplateSpec>,
);

/** The affidavits, on the same verbatim footing as the deeds. */
const AFFIDAVIT_SPECS = AFFIDAVIT_TEMPLATE_IDS.reduce(
  (acc, id) => {
    const t = AFFIDAVIT_TEMPLATES[id];
    acc[id] = {
      id,
      baseType: "deed",
      family: "verbatim",
      language: "en",
      deedTitle: t.deedTitle,
      roleA: t.roleA,
      roleB: t.roleB || t.roleA,
      moneyWord: "amount",
      purpose: t.name,
      scheduleHeading: "SCHEDULE",
      defaults: {
        durationMonths: 0,
        propertyKind: "apartment",
        commercialUse: false,
        registrationRequired: false,
      },
      notes: [
        "Fill every blank. Anything left blank is a gap in the affidavit, not a formality.",
        "An affidavit has to be sworn before the right officer — a notary, or the authority that asked for it.",
        "Print on non-judicial stamp paper of the value that authority requires.",
        "This is a drafting aid, not legal advice. Have it checked if the matter is unusual.",
      ],
      clauses: [],
      body: t.body,
    };
    return acc;
  },
  {} as Record<AffidavitTemplateId, TemplateSpec>,
);

/** The four sale agreements, the corporate guarantee and the two memoranda. */
const CONTRACT_SPECS = CONTRACT_TEMPLATE_IDS.reduce(
  (acc, id) => {
    const t = CONTRACT_TEMPLATES[id];
    acc[id] = {
      id,
      baseType: t.baseType,
      family: "verbatim",
      language: "en",
      deedTitle: t.deedTitle,
      roleA: t.roleA,
      roleB: t.roleB || t.roleA,
      moneyWord: "amount",
      purpose: t.name,
      scheduleHeading: "SCHEDULE",
      defaults: {
        durationMonths: 0,
        propertyKind: "apartment",
        commercialUse: false,
        registrationRequired: false,
      },
      notes: [
        "Fill every blank. A rule left empty is a gap in the document, not a formality.",
        "The figures are left blank on purpose where the document names more than one — a price, an advance and a balance are three different sums.",
        "Print on non-judicial stamp paper of the value this instrument attracts, and register it where registration is compulsory.",
        "This is a drafting aid, not legal advice. Have it checked if the matter is unusual.",
      ],
      clauses: [],
      body: t.body,
    };
    return acc;
  },
  {} as Record<ContractTemplateId, TemplateSpec>,
);

export const TEMPLATE_SPECS: Record<TemplateId, TemplateSpec> = {
  ...ENGLISH_SPECS,
  ...TAMIL_SPECS,
  ...DEED_SPECS,
  ...AFFIDAVIT_SPECS,
  ...CONTRACT_SPECS,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATE_SPECS) as TemplateId[];

export function isTemplateId(value: string): value is TemplateId {
  return value in TEMPLATE_SPECS;
}

/**
 * The template a bare instrument route opens when none was picked.
 *
 * Partial on purpose: the "deed" instrument — loans, mortgages, affidavits,
 * no-objection certificates — exists only in the Tamil set, so there is no
 * English template to default it to and no /create/deed route to need one.
 */
export const DEFAULT_TEMPLATE_BY_TYPE: Partial<Record<AgreementType, TemplateId>> = {
  residential: "residential-11-month",
  commercial: "shop-rental",
  lease: "long-term-lease",
  "leave-license": "leave-licence-11-month",
  sale: "two-wheeler-sale",
};

/** Used wherever an instrument has to resolve to something drawable. */
export const FALLBACK_TEMPLATE: TemplateId = "residential-11-month";

export function defaultTemplateFor(type: AgreementType): TemplateId {
  return DEFAULT_TEMPLATE_BY_TYPE[type] ?? FALLBACK_TEMPLATE;
}

export function templateSpec(id: TemplateId): TemplateSpec {
  return TEMPLATE_SPECS[id];
}
