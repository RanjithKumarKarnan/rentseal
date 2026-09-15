import type {
  AgreementDraft,
  AgreementType,
  Party,
} from "./types";
import {
  defaultTemplateFor,
  TEMPLATE_SPECS,
  type TemplateId,
} from "./agreement-templates";

/**
 * Building a blank draft, kept out of the store on purpose.
 *
 * It is plain data with no React in it, so anything can build and normalise a
 * draft without pulling in the builder's state; the store re-exports it.
 */

function emptyParty(): Party {
  return {
    fullName: "",
    relation: "son",
    parentName: "",
    partyType: "individual",
    companyName: "",
    designation: "",
    age: "",
    phone: "",
    email: "",
    aadhaar: "",
    pan: "",
    address: "",
    city: "",
    pincode: "",
  };
}

/** Placeholder until the client mints a real one — keeps SSR and hydration identical. */
export const PENDING_ID = "LP-DRAFT";

export function newDraftId() {
  return `LP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Deterministic by design: no Date.now(), no Math.random(). The provider fills
 * in the id, start date and timestamp once, on the client, after mount.
 */
export function createDraft(
  type: AgreementType = "residential",
  templateId: TemplateId = defaultTemplateFor(type),
): AgreementDraft {
  // Every default a template carries — its term, what kind of property it is
  // drawn for, whether it is registrable — comes from the signed-off document,
  // so picking "Warehouse" fills in 36 months and a warehouse without anyone
  // typing it.
  const spec = TEMPLATE_SPECS[templateId] ?? TEMPLATE_SPECS[defaultTemplateFor(type)];
  const dflt = spec.defaults;
  return {
    id: PENDING_ID,
    type: spec.baseType,
    templateId: spec.id,
    plan: "standard",
    landlord: emptyParty(),
    tenant: emptyParty(),
    property: {
      kind: dflt.propertyKind,
      doorNo: "",
      buildingName: "",
      street: "",
      locality: "",
      city: "",
      district: "",
      pincode: "",
      builtUpArea: "",
      bedrooms: "2",
      bathrooms: "2",
      floor: "",
      wholeProperty: true,
      portionDescription: "",
      furnishing: dflt.furnishing ?? "semi-furnished",
      amenities: [],
    },
    sale: {
      kind: "two-wheeler",
      registrationNumber: "",
      makeModel: "",
      manufactureYear: "",
      engineNumber: "",
      chassisNumber: "",
      price: "",
      handoverDate: "",
      handoverTime: "",
      // A month is the usual understanding; the RTO gives fourteen days from
      // the date of sale for the seller's Form 29 intimation.
      transferWithinDays: "30",
      documentsHandedOver: true,
    },
    terms: {
      executionDate: "",
      executionPlace: "",
      startDate: "",
      durationMonths: dflt.durationMonths,
      monthlyRent: "",
      securityDeposit: "",
      rentDueDay: "5th",
      paymentMode: "bank-transfer",
      escalationPercent: "5",
      escalationAfterMonths: "11",
      noticePeriodMonths: "1",
      lockInMonths: "0",
      maintenanceBorneBy: "tenant",
      maintenanceAmount: "",
      electricityBorneBy: "tenant",
      waterBorneBy: "tenant",
      propertyTaxBorneBy: "landlord",
      depositAlreadyPaid: false,
      // The sample allows two months of continuous default before eviction,
      // which is the usual figure in Tamil Nadu agreements.
      defaultMonths: "2",
    },
    options: {
      parkingIncluded: true,
      parkingType: "four-wheeler",
      parkingSlots: "1",
      petsAllowed: false,
      sublettingAllowed: false,
      commercialUseAllowed: dflt.commercialUse,
      businessNature: "",
      alterationsAllowed: false,
      noWallDamage: true,
      noLiquorOrIllegalUse: true,
      registrationRequired: dflt.registrationRequired,
      lawyerReview: false,
      stampPaperDate: "",
      extraPrintedCopies: 0,
      softCopy: false,
      stampPaperValue: 100,
      stampPaperSheets: [100],
      shippingAddress: "",
      documentPages: 4,
      witnessRequired: true,
      customClauses: [],
      clauseEdits: {},
      removedClauseIds: [],
    },
    furniture: [],
    updatedAt: "",
  };
}
