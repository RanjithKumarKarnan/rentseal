import type { AgreementType } from "./types";

export interface ServiceContent {
  id: AgreementType;
  slug: string;
  name: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  whoFor: string[];
  included: Array<{ title: string; body: string }>;
  clauses: string[];
  watchOut: Array<{ title: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
}

export const SERVICES: ServiceContent[] = [
  {
    id: "residential",
    slug: "residential-rental-agreement",
    name: "Residential Rental Agreement",
    h1: "Residential rental agreement, drafted for Tamil Nadu",
    intro:
      "The 11-month agreement that covers most lettings in the state — flats, independent houses and villas. E-stamped, signed with Aadhaar OTP, and in your inbox the same day.",
    metaTitle: "Residential Rental Agreement — Tamil Nadu",
    metaDescription:
      "Create an 11-month residential rental agreement for Tamil Nadu online — printed on non-judicial stamp paper, notarised and delivered to your door.",
    whoFor: [
      "Owners letting a flat or house to a family",
      "Tenants who want the terms in writing before paying a deposit",
      "Brokers closing a residential deal the same day",
      "Anyone renewing an agreement that is about to expire",
    ],
    included: [
      {
        title: "The 11-month structure",
        body: "Set at 11 months by default, which keeps you outside compulsory registration under Section 17 of the Registration Act, 1908 while remaining fully valid in evidence once stamped.",
      },
      {
        title: "A deposit clause that actually protects both sides",
        body: "Refund within 15 days of handover, deductions limited to unpaid rent, unpaid utilities and damage beyond fair wear and tear, and an itemised written statement required for every deduction.",
      },
      {
        title: "Schedule A and, if furnished, Schedule B",
        body: "A precise description of the premises, and where the property is furnished, a signed inventory of every article — the single most useful document in a deposit dispute.",
      },
      {
        title: "Who pays what, in writing",
        body: "Maintenance, electricity, water and property tax each assigned to a named party. This is the most common cause of rental disputes in Tamil Nadu and it takes one screen to settle.",
      },
    ],
    clauses: [
      "Grant of tenancy and term",
      "Rent, due date and mode of payment",
      "Interest-free refundable security deposit",
      "Escalation on renewal",
      "Termination and notice period",
      "Lock-in period, reciprocal",
      "Maintenance and association charges",
      "Utilities and statutory dues",
      "Use of the premises — residential only",
      "Fixtures, fittings and inventory",
      "Parking allotment",
      "Pets",
      "Subletting and assignment",
      "Alterations and structural changes",
      "Repairs — major with the landlord, minor with the tenant",
      "Right of inspection on 24 hours' notice",
      "Handing over vacant possession",
      "Governing law and jurisdiction",
    ],
    watchOut: [
      {
        title: "A lock-in that binds only the tenant",
        body: "Plenty of downloaded templates lock the tenant in but let the landlord terminate freely. Ours makes it reciprocal — if the landlord requires you to leave during the lock-in, they pay the equivalent sum.",
      },
      {
        title: "Deposit refund with no deadline",
        body: "An agreement that says the deposit will be refunded 'on vacating' gives you nothing to enforce. Ours fixes 15 days and requires an itemised statement for each deduction.",
      },
      {
        title: "Stamping treated as optional",
        body: "An unstamped agreement can be refused in evidence under Section 35 of the Indian Stamp Act. Skipping the duty to save a few thousand rupees is the false economy that costs people their deposits.",
      },
    ],
    faqs: [
      {
        q: "Why 11 months and not 12?",
        a: "Because Section 17(1)(d) of the Registration Act, 1908 makes registration compulsory for a lease of a year or more. An 11-month term stays outside that requirement, which saves both the registration fee and a joint visit to the Sub-Registrar. It renews as often as you like.",
      },
      {
        q: "Can I let just one room or a portion of my house?",
        a: "Yes. Describe the portion precisely in the property step — floor, direction, and which facilities are shared. The Schedule A description is what makes a partial letting enforceable.",
      },
      {
        q: "The property is jointly owned. Whose name goes in?",
        a: "Enter the first owner as the landlord and add the co-owners as a special condition in the Clauses step. Every owner should sign. Ask us on the confirming call if you are unsure how to structure it.",
      },
    ],
  },
  {
    id: "commercial",
    slug: "commercial-rental-agreement",
    name: "Commercial Rental Agreement",
    h1: "Commercial rental agreement for offices, shops and warehouses",
    intro:
      "Built for business premises, with the trade licence, GST, fit-out and business-use obligations that a residential template simply doesn't carry.",
    metaTitle: "Commercial Rental Agreement — Tamil Nadu",
    metaDescription:
      "A commercial rental agreement for an office, shop, showroom or warehouse in Tamil Nadu, with trade licence, GST and fit-out clauses included.",
    whoFor: [
      "Owners letting office space, a shop or a godown",
      "Businesses taking premises and needing a clean paper trail for GST",
      "Coworking and managed-office operators",
      "Retail chains standardising terms across branches",
    ],
    included: [
      {
        title: "Permitted-use clause tied to your actual business",
        body: "The premises can be used for the business you name and nothing else, which protects the owner from a change of trade and gives the tenant certainty that the use is authorised.",
      },
      {
        title: "Regulatory obligations, allocated",
        body: "Shops and Establishments registration, trade licence, fire clearance and GST registration all placed with the tenant, with the landlord expressly not answerable for the tenant's regulatory defaults.",
      },
      {
        title: "Fit-out and reinstatement",
        body: "Non-structural fit-out permitted with written consent, with a duty to restore the premises at the end of the term. Prevents the most expensive argument in commercial letting.",
      },
      {
        title: "Longer terms with escalation built in",
        body: "Defaults to 36 months with a periodic escalation clause, and flags the compulsory registration that follows any term of 12 months or more.",
      },
    ],
    clauses: [
      "Grant and term, typically 36 months",
      "Rent, due date and mode of payment",
      "Security deposit — customarily 6 to 10 months",
      "Periodic escalation",
      "Permitted commercial use, business named",
      "Trade licence, GST and statutory approvals",
      "Fit-out, signage and reinstatement",
      "Lock-in period, reciprocal",
      "Maintenance and common-area charges",
      "Utilities, including separate meters",
      "Insurance and hazardous activity",
      "Parking and loading access",
      "Subletting and assignment to group companies",
      "Repairs and structural responsibility",
      "Right of inspection",
      "Registration at the Sub-Registrar Office",
      "Termination and notice",
      "Governing law and jurisdiction",
    ],
    watchOut: [
      {
        title: "Using a residential template for a shop",
        body: "It will lack the permitted-use, trade-licence and reinstatement clauses. When the tenant changes trade or leaves behind a stripped interior, there is nothing to point at.",
      },
      {
        title: "Forgetting that 12 months means registration",
        body: "Most commercial terms run three years, which makes registration compulsory. An unregistered long lease is inadmissible to prove the term. We compute the fee and flag it before you pay.",
      },
      {
        title: "Silence on signage and fit-out",
        body: "Without an express clause, disputes over hoardings, glass fronts and stripped-out interiors have no answer in the document.",
      },
    ],
    faqs: [
      {
        q: "Is GST payable on commercial rent?",
        a: "Where the landlord is registered and the annual rent crosses the threshold, GST at 18% applies to commercial letting. Residential letting to an individual for residence is exempt. Our agreement records who bears it; your accountant should confirm your registration position.",
      },
      {
        q: "Can I claim input credit on your fee?",
        a: "Yes. Tick the GST invoice box at payment and enter your GSTIN, and we will issue a tax invoice in your business name.",
      },
      {
        q: "What deposit is normal for commercial premises in Tamil Nadu?",
        a: "Six to ten months' rent is customary, higher than residential. In prime retail locations it can be more. The builder suggests six months and you can change it.",
      },
    ],
  },
  {
    id: "lease",
    slug: "lease-agreement",
    name: "Lease Deed",
    h1: "Lease deed for terms of a year and above",
    intro:
      "When the term runs 12 months or longer, registration stops being optional. A lease deed gives you the strongest evidentiary position available — and we handle the registration mechanics.",
    metaTitle: "Lease Deed Registration in Tamil Nadu",
    metaDescription:
      "Draft and register a lease deed in Tamil Nadu for 12 months or more. Stamp duty and registration fee worked out, Sub-Registrar visit arranged.",
    whoFor: [
      "Anyone letting for a year or longer",
      "Corporate leases where the tenant's legal team requires registration",
      "Long leases of land, industrial plots or standalone buildings",
      "Owners who want the strongest possible record of title arrangements",
    ],
    included: [
      {
        title: "Registration handled end to end",
        body: "We compute the registration fee alongside the stamp duty, prepare the deed in the form the Sub-Registrar expects, and book your appointment. Both parties still appear in person — that is statutory and no online service can remove it.",
      },
      {
        title: "Duty calculated on the full term",
        body: "For a lease of under 30 years, duty is 1% of the aggregate rent across the whole term plus the deposit. On a three-year lease this is a meaningful number, and we show the arithmetic before you commit.",
      },
      {
        title: "Escalation across the term",
        body: "Multi-year leases need a defined escalation, not a renegotiation every year. The clause fixes the percentage and the interval so nobody argues later.",
      },
      {
        title: "Proper schedules",
        body: "Schedule A describing the property with boundaries, Schedule B for any inventory — laid out the way the registering officer expects to see them.",
      },
    ],
    clauses: [
      "Demise and term",
      "Rent and revision schedule",
      "Security deposit and its treatment on assignment",
      "Escalation at fixed intervals",
      "Lock-in and early determination",
      "Registration and apportionment of duty",
      "Maintenance and common areas",
      "Utilities, meters and deposits with utilities",
      "Permitted use",
      "Assignment and sub-lease",
      "Repairs and structural liability",
      "Insurance",
      "Force majeure",
      "Right of inspection",
      "Surrender and handover",
      "Dispute resolution and jurisdiction",
    ],
    watchOut: [
      {
        title: "Treating an unregistered long lease as enforceable",
        body: "Under Section 49 of the Registration Act, an unregistered instrument that requires registration cannot be received as evidence of the transaction. A three-year lease that was never registered may be read down to a month-to-month tenancy.",
      },
      {
        title: "Underestimating the duty on a long term",
        body: "Duty is charged on the rent for the whole term, not one year. On ₹50,000 a month over three years plus a ₹3,00,000 deposit, the chargeable value is ₹21,00,000 and the duty is ₹21,000. Budget for it.",
      },
      {
        title: "No escalation clause",
        body: "A five-year lease at a flat rent is a slow loss for the owner and an argument waiting to happen. Fix the percentage and the interval up front.",
      },
    ],
    faqs: [
      {
        q: "Do both parties really have to visit the Sub-Registrar?",
        a: "Yes. For a registered instrument, both parties must appear before the Sub-Registrar with photo ID and two witnesses. We prepare everything and book the slot, but presence is statutory.",
      },
      {
        q: "Who pays the registration fee?",
        a: "By custom the tenant does, and that is our default clause. Many corporate leases split it equally. You can change it in the builder and the clause rewrites itself.",
      },
      {
        q: "How long does registration take?",
        a: "The appointment itself is usually under an hour. The registered copy is typically available within seven to ten working days, and we collect and deliver it to you.",
      },
    ],
  },
  {
    id: "leave-license",
    slug: "leave-and-license",
    name: "Leave & Licence Agreement",
    h1: "Leave and licence agreement, drafted so it stays a licence",
    intro:
      "A licence grants permission to occupy without creating an interest in the property. Get the drafting wrong and a court will read it as a tenancy — which is exactly what the owner was trying to avoid.",
    metaTitle: "Leave and Licence Agreement — Tamil Nadu",
    metaDescription:
      "A leave and licence agreement for Tamil Nadu that grants occupation without a tenancy, printed on non-judicial stamp paper and delivered.",
    whoFor: [
      "Owners who want a cleaner route to possession at the end of the term",
      "Serviced apartments and managed-stay operators",
      "Companies taking premises for short corporate stays",
      "Co-living brands onboarding residents at volume",
    ],
    included: [
      {
        title: "Language that preserves the licence",
        body: "Licensor and licensee throughout, licence fee rather than rent, permission to use rather than a right to occupy, and no exclusive possession granted. These distinctions are what a court looks at.",
      },
      {
        title: "Control retained by the licensor",
        body: "The licensor keeps overall control and access rights on notice — the single most important factual element in showing that no tenancy was created.",
      },
      {
        title: "A defined revocation route",
        body: "Clear termination and revocation on notice, without the statutory protections that attach once a tenancy exists.",
      },
      {
        title: "Same digital pipeline",
        body: "E-stamped, Aadhaar e-signed, delivered on email and WhatsApp, stored in your dashboard. Nothing about the licence structure slows any of it down.",
      },
    ],
    clauses: [
      "Grant of licence and period",
      "Licence fee and due date",
      "Interest-free refundable deposit",
      "No tenancy or interest created",
      "Licensor retains control and access",
      "Permitted use of the premises",
      "Revocation and notice",
      "Lock-in, where agreed",
      "Utilities and maintenance",
      "Inventory of furnishings",
      "Parking",
      "No transfer or assignment of the licence",
      "Handing over on revocation",
      "Governing law and jurisdiction",
    ],
    watchOut: [
      {
        title: "A licence that grants exclusive possession",
        body: "The label on the document does not decide the question — substance does. If the occupant gets exclusive possession and the owner surrenders control, a court is likely to hold it a tenancy whatever the heading says.",
      },
      {
        title: "Using the word 'rent' throughout",
        body: "Sloppy drafting that switches between rent and licence fee undermines the whole structure. Ours is consistent from the first line to the last.",
      },
      {
        title: "Assuming a licence avoids stamp duty",
        body: "It does not. A leave and licence instrument attracts duty in the same way. The advantage is in possession and control, not in cost.",
      },
    ],
    faqs: [
      {
        q: "Is a leave and licence really safer for the owner?",
        a: "It can be, because a licensee does not acquire the statutory protections of a tenant and possession is easier to recover. But the protection comes from how the arrangement actually operates, not just the wording — if you hand over exclusive possession and never exercise control, the document alone will not save you.",
      },
      {
        q: "Does it need to be registered?",
        a: "The same rule applies as for a lease — registration turns on the term. Under 12 months, e-stamping alone. Twelve months or more and registration becomes compulsory.",
      },
      {
        q: "Can I use this for a normal family letting?",
        a: "You can, but for most straightforward residential lettings a standard 11-month rental agreement is the better fit and is what the vast majority of Tamil Nadu landlords use. Leave and licence earns its keep in serviced, managed and co-living arrangements.",
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
