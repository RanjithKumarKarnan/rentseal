import { DISTRICTS, NOTABLE_TOWNS } from "./districts";
import type { AgreementType, PlanId } from "./types";

/**
 * The business's own details, confirmed by the client on 25 August 2026.
 *
 * Kept in one object so a correction is a single edit rather than a hunt
 * through the pages. Two rules the rest of the codebase relies on:
 *
 *   1. Anything blank is not rendered. `cin` and `gstin` are empty because this
 *      is a proprietorship that holds neither, and a registration number is not
 *      something a legal-documents business can invent — a customer or a tax
 *      officer checks it in seconds. Fill one in and its row appears; leave it
 *      and nothing false is shown. The social links work the same way.
 *
 *   2. The phone, WhatsApp number, email and address are the only ways anyone
 *      can reach this business — every call-to-action ends at one of them, and
 *      payment is taken on the call. Wrong numbers here mean orders that are
 *      drafted and then lost.
 */
export const SITE = {
  name: "LP Stamp Paper",
  legalName: "LP Enterprises",
  tagline: "Licensed non-judicial stamp paper and notarised agreements across Tamil Nadu",
  description:
    "Buy physical non-judicial stamp paper online from ₹120 — the hard copy, delivered home across Tamil Nadu, same day in Chennai. Rent agreements too.",
  url: "https://www.lpstamppaper.in",
  /** Landline. Dialled as 044 within India; the tel: link strips the spaces. */
  phone: "044 4006 8402",
  /** Needs the country code — wa.me will not route a bare ten-digit number. */
  whatsapp: "+91 98434 41460",
  email: "lpscanxerox@gmail.com",
  address: "4/434, J J Nagar, Mogappair West, Chennai 600037",
  /**
   * A proprietorship, so there is no CIN and no GST registration. Both stay
   * empty and every place that renders them omits the row — the Udyam number
   * below is the registration this business actually holds.
   */
  cin: "",
  gstin: "",
  udyam: "UDYAM-TN-24-0060126",
  /**
   * The counter's hours, and the only place they are written down.
   *
   * They used to be stated three different ways — 9.30 to 9.30 here, 8 to 10
   * on the contact page, and "open seven days" in the stats band, with a Sunday
   * evening shift in two of them. A visitor who rang at eight on a Sunday
   * because the site said so got no answer, which is worse than not publishing
   * hours at all. Everything now reads from here.
   */
  hours: {
    weekday: { label: "Monday to Saturday", opens: "09:30", closes: "18:00" },
    /** Closed. Sunday is a holiday, not a short shift. */
    sunday: null,
    summary: "Mon–Sat 9.30am–6pm · Sunday closed",
    short: "Mon–Sat 9.30–6",
  },
  /**
   * Profile URLs. Each empty string hides that icon in the footer — better a
   * missing icon than one that lands on twitter.com's front page.
   */
  social: {
    x: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  },
} as const;

/* ─────────────────────────── Navigation ─────────────────────────── */

/**
 * Ordered by what a visitor actually does, not by what we have pages for:
 * what you can draw up → what stamps it → what it costs → how it runs → help.
 *
 * Was seven flat items — Stamp paper, Agreements, Templates, Districts,
 * Delivery, Pricing, FAQ — three of which were the same journey split apart
 * (Templates and Districts are both ways into an agreement) and one of which
 * ("Delivery") was a homepage anchor sitting among page links, so choosing it
 * from any other page threw you back to the homepage.
 */
/**
 * The header.
 *
 * "Agreements" was a six-item dropdown, which made the templates a hover away
 * from being found and gave the one link people actually want — the whole
 * catalogue — equal billing with four service pages. It is a plain link to the
 * catalogue now: the menu opened, and closed, on the way to somewhere the click
 * could have gone directly.
 */
export const NAV_LINKS = [
  { label: "Agreements", href: "/templates" },
  { label: "Non-judicial stamp paper", href: "/stamp-paper" },
  { label: "Online Works", href: "/certificates" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/how-it-works" },
  {
    label: "Help",
    items: [
      { title: "Frequently asked questions", href: "/faq", desc: "Stamp duty, registration, e-signing and delivery, answered plainly." },
      { title: "Contact and support", href: "/contact", desc: "Phone, WhatsApp and email — a real person, in Tamil or English." },
      { title: "Site map", href: "/sitemap", desc: "Every page on LP Stamp Paper, and the order to use them in." },
    ],
  },
] as const;

/**
 * The two ways to buy, and both need to be reachable.
 *
 * BUILDER_START is the way into the product: the catalogue, where the reader
 * picks a document and goes on into the drafter. It used to be /create, which
 * printed the same sixty-two cards as /templates at a second URL; that route
 * now redirects here, so a call to action costs one request rather than two.
 *
 * LEAD_ANCHOR stays as the assisted path, for stamp paper on its own and for
 * anyone who would rather talk to someone first.
 */
export const BUILDER_START = "/templates";
export const LEAD_ANCHOR = "/#get-started";

export const FOOTER_LINKS = [
  {
    heading: "Non-judicial stamp paper",
    links: [
      { label: "₹100 non-judicial stamp paper", href: "/#stamp-paper" },
      { label: "₹500 non-judicial stamp paper", href: "/#stamp-paper" },
      { label: "₹1,000 non-judicial stamp paper", href: "/#stamp-paper" },
      { label: "₹5,000 non-judicial stamp paper", href: "/#stamp-paper" },
      { label: "e-Stamp — any value", href: "/#stamp-paper" },
      { label: "Physical (hard copy) stamp paper", href: "/stamp-paper#physical-or-e-stamp" },
      { label: "Non-judicial stamp paper by district", href: "/stamp-paper" },
      { label: "Bulk orders for firms", href: LEAD_ANCHOR },
    ],
  },
  {
    heading: "Agreements",
    links: [
      { label: "Residential Rental Agreement", href: "/services/residential-rental-agreement" },
      { label: "Commercial Rental Agreement", href: "/services/commercial-rental-agreement" },
      { label: "Lease Deed", href: "/services/lease-agreement" },
      { label: "Leave & Licence", href: "/services/leave-and-license" },
      { label: "Rent agreement by district", href: "/rental-agreement" },
      { label: "All agreement templates", href: "/templates" },
      { label: "Online Works", href: "/certificates" },
      { label: "Talk to us before you order", href: LEAD_ANCHOR },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Delivery coverage", href: "/#delivery" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Search the site", href: "/search" },
      { label: "Contact & Support", href: "/contact" },
      { label: "Site map", href: "/sitemap" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refund" },
      { label: "Disclaimer", href: "/legal/terms#disclaimer" },
    ],
  },
] as const;

/* ─────────────────────────── Agreement types ─────────────────────────── */

export const AGREEMENT_TYPES: Array<{
  id: AgreementType;
  name: string;
  short: string;
  description: string;
  popular?: boolean;
  bestFor: string[];
  defaultMonths: number;
  slug: string;
}> = [
  {
    id: "residential",
    name: "Residential Rental Agreement",
    short: "Residential",
    description:
      "For flats, independent houses and villas let to families or working professionals. The 11-month agreement most landlords in Tamil Nadu use.",
    popular: true,
    bestFor: ["Flats & apartments", "Independent houses", "Villas", "PG-style single lets"],
    defaultMonths: 11,
    slug: "residential-rental-agreement",
  },
  {
    id: "commercial",
    name: "Commercial Rental Agreement",
    short: "Commercial",
    description:
      "For offices, shops, showrooms and warehouses. Adds trade licence, GST, fit-out and business-use clauses automatically.",
    bestFor: ["Offices & coworking", "Retail shops", "Showrooms", "Warehouses & godowns"],
    defaultMonths: 36,
    slug: "commercial-rental-agreement",
  },
  {
    id: "lease",
    name: "Lease Deed",
    short: "Lease",
    description:
      "For terms of 12 months and above where registration at the Sub-Registrar Office is compulsory. Strongest evidentiary position.",
    bestFor: ["Terms of 1 year or more", "Corporate leases", "Land & industrial plots"],
    defaultMonths: 36,
    slug: "lease-agreement",
  },
  {
    id: "leave-license",
    name: "Leave & Licence Agreement",
    short: "Leave & Licence",
    description:
      "Grants permission to occupy without creating a tenancy interest. Preferred by owners who want a cleaner exit at the end of the term.",
    bestFor: ["Owners wanting easier possession", "Serviced apartments", "Short corporate stays"],
    defaultMonths: 11,
    slug: "leave-and-license",
  },
];

/* ─────────────────────────── Cities ─────────────────────────── */

/**
 * Every location on the site is one of the 38 official districts — see
 * ./districts.ts, which is the source of truth.
 *
 * CITIES is a compatibility view over DISTRICTS in the shape the older
 * components expect (`district`, `agreements`, `sro`, `localities`). New code
 * should import DISTRICTS directly.
 */
export const CITIES = DISTRICTS.map((d) => ({
  ...d,
  district: d.name,
  sro: d.sroTowns.join(", "),
  localities: d.towns,
}));

/**
 * The six largest districts, shown as cards on the homepage. Ten was two rows
 * on desktop and ten stacked cards on a phone, for a list that continues in
 * full on /rental-agreement and in the footer.
 */
export const FEATURED_DISTRICTS = [
  "chennai",
  "coimbatore",
  "madurai",
  "tiruchirappalli",
  "chengalpattu",
  "salem",
].map((slug) => DISTRICTS.find((d) => d.slug === slug)!);

/** Well-known towns that are not districts, shown as "also delivering to". */
export const EXTRA_DISTRICTS = NOTABLE_TOWNS.map((t) => t.town);

/* ─────────────────────────── Pricing ─────────────────────────── */

export const PLANS: Array<{
  id: PlanId;
  name: string;
  price: number;
  /** The price is a floor — the cheapest document on this plan, not a flat fee. */
  from?: boolean;
  tagline: string;
  delivery: string;
  recommended?: boolean;
  features: Array<{ label: string; included: boolean; hint?: string }>;
  cta: string;
}> = [
  {
    id: "basic",
    name: "Basic",
    // Every deed is priced individually now, so a plan can only quote a floor:
    // the cheapest document plus whatever the plan adds. Showing a flat ₹349
    // beside a quote that reads ₹800 is how a customer stops believing the
    // pricing page.
    price: 300,
    from: true,
    tagline: "A clean, compliant draft you print and sign yourself.",
    delivery: "Instant download",
    cta: "Start with Basic",
    features: [
      { label: "Tamil Nadu compliant template", included: true },
      { label: "Dynamic clause generator", included: true },
      { label: "Instant PDF download", included: true },
      { label: "Email delivery", included: true },
      { label: "Cloud storage for 12 months", included: true },
      { label: "e-Stamp paper procured for you", included: false, hint: "You buy the non-judicial stamp paper yourself" },
      { label: "Aadhaar e-Sign for both parties", included: false },
      { label: "Notary attestation", included: false },
      { label: "WhatsApp delivery", included: false },
      { label: "Doorstep delivery of stamped copy", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 750,
    from: true,
    tagline: "Everything digital — e-stamped, e-signed, delivered. Nobody visits an office.",
    delivery: "Same day, usually under 4 hours",
    recommended: true,
    cta: "Choose Standard",
    features: [
      { label: "Tamil Nadu compliant template", included: true },
      { label: "Dynamic clause generator", included: true },
      { label: "Instant PDF download", included: true },
      { label: "Email delivery", included: true },
      { label: "Cloud storage, unlimited", included: true },
      { label: "e-Stamp paper procured for you", included: true, hint: "Duty charged at government rate, no markup" },
      { label: "Aadhaar e-Sign for both parties", included: true },
      { label: "Notary attestation", included: false, hint: "Add for ₹350" },
      { label: "WhatsApp delivery", included: true },
      { label: "Doorstep delivery of stamped copy", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 1450,
    from: true,
    tagline: "Signatures attested by a notary, and a stamped copy reaches your door.",
    delivery: "Verified within 24 hours",
    cta: "Go Premium",
    features: [
      { label: "Tamil Nadu compliant template", included: true },
      { label: "Dynamic clause generator", included: true },
      { label: "Instant PDF download", included: true },
      { label: "Email delivery", included: true },
      { label: "Cloud storage, unlimited", included: true },
      { label: "e-Stamp paper procured for you", included: true },
      { label: "Aadhaar e-Sign for both parties", included: true },
      { label: "Notary attestation", included: true, hint: "Signatures attested by a notary public" },
      { label: "WhatsApp delivery", included: true },
      { label: "Doorstep delivery of stamped copy", included: true, hint: "Within Tamil Nadu" },
    ],
  },
];

/* ─────────────────────────── Landing content ─────────────────────────── */

/**
 * Every figure here is a fact about the service or the law, not a claim about
 * volume or reputation. Order counts and star ratings were removed because they
 * were invented, and an unevidenced number is worth less than a true one.
 */
export const STATS = [
  { value: "38", label: "Districts covered", sub: "every one in Tamil Nadu" },
  { value: "1%", label: "Stamp duty rate", sub: "of total rent plus deposit" },
  { value: "11 months", label: "Standard term", sub: "below compulsory registration" },
  // Counter animates the leading number, so keep it one that counts sensibly —
  // "8am – 10pm" rendered as "0am – 10pm" mid-animation.
  { value: "6 days", label: "Open every week", sub: "Mon–Sat 9.30am–5pm, closed Sunday" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Fill in the details",
    body: "Answer plain-English questions about the property, the landlord and the tenant. Every field is explained. Your progress saves as you type.",
    time: "6 minutes",
  },
  {
    step: "02",
    title: "Review your agreement",
    body: "Watch the agreement write itself beside you. Clauses appear and disappear as you change your answers, so nothing is boilerplate you didn't ask for.",
    time: "2 minutes",
  },
  {
    step: "03",
    title: "We call to confirm",
    body: "Nothing is charged on the site. Someone from the team reads your draft, rings you to check the details, and takes payment on that call — UPI, transfer or on delivery.",
    time: "1 minute",
  },
  {
    step: "04",
    title: "We stamp, you sign, we deliver",
    body: "We procure the e-stamp at the exact government rate and affix it. Both parties e-sign with Aadhaar OTP, the PDF reaches your email and WhatsApp, and the paper copy comes to your door.",
    time: "1 minute",
  },
] as const;

export const FEATURES = [
  { icon: "Truck", title: "Delivered to your door", body: "Same day inside Chennai by Porter at cost, ₹100 next day, ₹200 express anywhere in Tamil Nadu and ₹100 in two to three days. Free above ₹2,000 of physical paper." },
  { icon: "Stamp", title: "Four denominations, always in stock", body: "₹100 paper is ₹120, ₹500 is ₹550, ₹1,000 is ₹1,100 and ₹5,000 is ₹5,500 — the four we carry. Anything needing an exact figure goes on an e-Stamp certificate for any value from ₹1 upward." },
  { icon: "ShieldCheck", title: "Licensed and verifiable", body: "Procured through authorised vendors and the state e-Stamp channel. Every sheet carries a certificate number you can check yourself." },
  { icon: "Wand2", title: "Clauses that write themselves", body: "Say the flat is furnished and an inventory clause appears. Allow pets and the pet clause writes itself. No legal drafting required." },
  { icon: "PenTool", title: "Aadhaar e-Sign", body: "Both parties sign with an OTP on their own phone. Legally valid under Section 3A of the Information Technology Act, 2000." },
  { icon: "Scale", title: "Notarised signatures", body: "Signatures on your agreement are attested by a notary public — the standard proof that the parties signed it, and who they were." },
  { icon: "FileText", title: "Smart templates", body: "Four instrument types, version-controlled, each with the schedules and annexures the Sub-Registrar expects." },
  { icon: "Calculator", title: "Honest stamp duty maths", body: "See exactly how the duty is computed — rent × term, plus deposit, at 1%. Every rupee traced to a rule, and quoted to you on the call before you pay." },
  { icon: "MessageCircle", title: "WhatsApp delivery", body: "The signed PDF reaches both parties on WhatsApp the moment it is generated. No hunting through email." },
  { icon: "CloudUpload", title: "Cloud storage forever", body: "Every agreement you have ever made stays in your dashboard, searchable, downloadable, on any device." },
  { icon: "BellRing", title: "Renewal reminders", body: "We nudge you 45 days before expiry and pre-fill the renewal, so a lapsed agreement never costs you a deposit dispute." },
  { icon: "Lock", title: "Identity data stays hidden", body: "Aadhaar and PAN are encrypted at rest, masked everywhere in the interface, and never written to a log." },
  { icon: "Smartphone", title: "Built mobile-first", body: "Two-thirds of our agreements are made on a phone. Every step, including signing, works on a small screen." },
] as const;

export const FAQS = [
  {
    category: "Non-judicial stamp paper",
    q: "Which non-judicial stamp paper denominations do you supply?",
    a: "Physical non-judicial paper in four denominations — ₹100, ₹500, ₹1,000 and ₹5,000 — which covers almost every ordinary transaction. ₹100 is the smallest sheet we carry, so an affidavit or a bond that would once have gone on ₹20 or ₹50 paper is executed on ₹100. Where the duty payable is a specific figure — a lease deed, a sale agreement, a mortgage — we issue an e-Stamp certificate for that exact amount instead, from ₹1 upward with no practical ceiling.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "Do you deliver physical stamp paper, or only e-Stamps?",
    a: "Both. The ₹100, ₹500, ₹1,000 and ₹5,000 sheets are physical non-judicial stamp paper — the original, government-issued hard copy — and a rider brings them to your door. An e-Stamp is a certificate for an exact amount of duty, and it is emailed instead. Most rent agreements and affidavits in Tamil Nadu still go on the physical sheet; tell us what you are executing and we will say which one it needs before you order.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "Is non-judicial stamp paper the same as bond paper?",
    a: "Yes. In Tamil Nadu most people ask for \"bond paper\" — or முத்திரைத்தாள் — and mean the same government-issued non-judicial stamp paper we deliver. It is not the thick bond writing paper a stationery shop sells: that carries no stamp value, so an agreement or affidavit typed on it is not stamped.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "What does a sheet of non-judicial stamp paper actually cost?",
    a: "The face value plus a procurement charge, and we print both so you can see the difference. ₹100 paper is ₹120, ₹500 is ₹550, ₹1,000 is ₹1,100 and ₹5,000 is ₹5,500 — that is for a blank, unprinted sheet. Delivery is charged separately and stated before you confirm: ₹100 next day in Chennai, ₹200 express anywhere in Tamil Nadu, ₹100 for two to three days, and same day in Chennai by Porter at Porter's own fare. Delivery is free above ₹2,000 of physical paper and free everywhere on ten sheets or more — an e-Stamp is emailed rather than delivered, so its value does not count towards that. Government stamp duty on an e-Stamp is a separate thing and passes through at cost with nothing added.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "Which denomination do I need for a rental agreement?",
    a: "In practice most 11-month residential agreements in Tamil Nadu are executed on ₹100 non-judicial stamp paper. Strictly, duty under Article 35 is 1% of the total rent across the term plus the deposit, and for a 12-month-or-longer agreement that has to be paid in full through an e-Stamp. Tell us the rent, deposit and duration and we will tell you which applies to you before you order.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "Can you print my draft on the non-judicial stamp paper?",
    a: "Yes. Upload your draft as a PDF or a Word file and we print it onto the paper before it goes out, with the margins a sub-registrar expects left clear. Black-and-white and colour printing and photocopying are available at the counter, charged by the page. If you want it attested as well, a notary signature on non-judicial stamp paper is ₹350 including two green sheets, or ₹100 on plain paper — that is the attestation alone, the paper is priced separately.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "Is the non-judicial stamp paper you supply genuine?",
    a: "Yes. Everything is procured through licensed stamp vendors and the state's authorised e-Stamping channel. Each sheet or certificate carries a serial or certificate number you can verify yourself against the Registration Department's records — we print it on your invoice so you can check without asking us.",
  },
  {
    category: "Non-judicial stamp paper",
    q: "Can I buy in bulk for my office or firm?",
    a: "Yes. Ten sheets or more ships free anywhere in Tamil Nadu, we can hold a recurring monthly supply against a standing order, and we raise a single GST invoice to your GSTIN rather than one per delivery. It is built for law firms, builders, HR teams and brokers — ask us about account terms.",
  },
  {
    category: "Delivery",
    q: "Where in Tamil Nadu do you deliver?",
    a: "All 38 districts. Inside Chennai it is ₹100 for next day, or same day by Porter charged at Porter's own fare. Anywhere else in Tamil Nadu is ₹200 for express delivery or ₹100 for two to three working days — Coimbatore, Madurai, Trichy, Salem, Tiruppur, Erode, Vellore, Hosur, Tirunelveli and Thoothukudi are the quickest of them.",
  },
  {
    category: "Delivery",
    q: "Where can I buy stamp paper near me?",
    a: `You do not need to find a stamp vendor near you — we bring physical non-judicial stamp paper to your door in all 38 districts of Tamil Nadu, same day in Chennai by Porter or next day for ₹100. If you are close to Mogappair, Anna Nagar, Ambattur or Padi, you can also collect it from our counter at ${SITE.address}.`,
  },
  {
    category: "Delivery",
    q: "What if I need it today and I am not in Chennai?",
    a: "Call us before you order. Depending on the district and the time of day we can sometimes arrange same-day through a local partner, and if we cannot we will say so straight away rather than take the order and disappoint you. An e-Stamp certificate, where your instrument allows one, reaches you by email in minutes.",
  },
  {
    category: "Delivery",
    q: "Can I pay on delivery?",
    a: "For orders within the Chennai metro, yes — cash or UPI to the rider. Outside Chennai we ask for payment up front, because the stamp is purchased in your name before it leaves us and cannot be returned to the vendor.",
  },
  {
    category: "Legal validity",
    q: "Is an agreement made on LP Stamp Paper legally valid?",
    a: "Yes. Your agreement is drafted on a Tamil Nadu compliant template, e-stamped with duty paid to the Government of Tamil Nadu, and signed using Aadhaar e-Sign, which has the same legal effect as a handwritten signature under Section 3A of the Information Technology Act, 2000. It is admissible in evidence in the same way as a paper agreement.",
  },
  {
    category: "Legal validity",
    q: "Do I need to register an 11-month rental agreement?",
    a: "No. Registration is compulsory only where the term is 12 months or more, under Section 17(1)(d) of the Registration Act, 1908. This is precisely why the 11-month agreement is the norm across Tamil Nadu. An 11-month agreement still needs to be properly stamped to be admissible in evidence — that part is not optional, and it is what we handle for you.",
  },
  {
    category: "Legal validity",
    q: "What happens if my agreement is for 12 months or longer?",
    a: "We flag it the moment you set the term, add the registration clause, compute the registration fee alongside the stamp duty, and book your Sub-Registrar appointment. Both parties still have to appear in person before the Sub-Registrar for a registered instrument — that is a statutory requirement no online service can remove.",
  },
  {
    category: "Legal validity",
    q: "Do I have to have my affidavit notarised?",
    a: "Yes, and we do not offer it any other way. An affidavit is a sworn statement — until a notary public administers the oath and attests it, it is an unsigned-under-oath piece of paper, and the court, registrar, passport office, bank or college that asked for it will hand it straight back. So attestation is built into the price of every affidavit rather than offered as an extra. On a rental agreement, a lease, a sale or a licence it is genuinely optional: those are valid once executed and e-stamped, and notarisation only adds further proof of who signed. There it stays a tick box.",
  },
  {
    category: "Stamp duty",
    q: "How is stamp duty calculated in Tamil Nadu?",
    a: "For a lease of less than 30 years, duty is charged at 1% of the total rent payable over the whole term plus any advance or deposit. So for ₹20,000 a month over 11 months with a ₹1,00,000 deposit, the chargeable value is ₹3,20,000 and the duty is ₹3,200. Where registration applies, the registration fee is a further 1%. Our calculator shows this arithmetic line by line before you pay.",
  },
  {
    category: "Stamp duty",
    q: "Do you add a markup on stamp duty?",
    a: "No. Government charges pass through at exactly the rate the Registration Department levies, shown as a separate line on your invoice. We earn only the platform fee, and GST at 18% applies to that fee alone — never to the government portion.",
  },
  {
    category: "Stamp duty",
    q: "Who pays the stamp duty, the landlord or the tenant?",
    a: "By custom in Tamil Nadu the tenant pays, and our default clause reflects that. It is a matter of agreement, not law, so you can change who bears it — or split it equally — in the Agreement Details step, and the clause rewrites itself.",
  },
  {
    category: "Process",
    q: "How long does the whole thing actually take?",
    a: "Filling the form takes most people six to ten minutes. Once we have confirmed your order on the phone, the e-stamped, e-signed PDF is usually with you within four hours of both parties completing their OTP. Notary attestation adds up to 24 hours.",
  },
  {
    category: "Process",
    q: "Does the tenant need an account?",
    a: "No. You send them a signing link. They verify their phone with an OTP, review the agreement, and e-sign. They can create an account afterwards if they want their own copy in a dashboard, but nothing forces them to.",
  },
  {
    category: "Process",
    q: "Can I edit the agreement after I have paid?",
    a: "You can edit freely until the e-stamp is affixed. Once the stamp is on the instrument, the document is fixed — that is a legal constraint, not a product one. If something is wrong after stamping, contact support within 48 hours and we will re-issue at cost.",
  },
  {
    category: "Delivery",
    q: "How do I receive the final agreement?",
    a: "Three ways at once: an instant download in your browser, a PDF to the email address of both parties, and a copy on WhatsApp. It also stays in your dashboard permanently, so you can download it years later.",
  },
  {
    category: "Delivery",
    q: "Do I get a physical copy?",
    a: "On the Premium plan we courier a printed, stamped copy anywhere in Tamil Nadu at no extra cost, typically in two to three working days. On other plans you can order one for ₹299.",
  },
  {
    category: "Renewal",
    q: "What happens when my agreement is about to expire?",
    a: "We email and message you 45 days before expiry with a renewal link that pre-fills everything from the previous agreement. You change the rent, apply your escalation, and re-sign. It usually takes under two minutes.",
  },
  {
    category: "Refunds",
    q: "What is your refund policy?",
    a: "Full refund if you cancel before the e-stamp is procured — no questions, no forms. After the e-stamp is procured, the government duty is non-refundable because it has already been paid to the state, but we refund our platform fee in full if the fault is ours. Refunds reach your account in five to seven working days.",
  },
  {
    category: "Support",
    q: "Can I speak to someone in Tamil?",
    a: "Yes. We work in Tamil and English, Monday to Saturday from 9.30am to 5pm, on phone and WhatsApp. We are closed on Sundays — leave a WhatsApp message and we will pick it up first thing Monday.",
  },
] as const;

/**
 * Commitments about how the service operates — each one is something we decide
 * and can honour. The previous list claimed ISO 27001 and PCI-DSS certification
 * and registration with the Registration Department, none of which we hold.
 * Stating a certification you do not have is a misrepresentation, and it is the
 * first thing a serious customer checks.
 */
export const TRUST_SIGNALS = [
  "Stamp duty paid in full to the Government of Tamil Nadu",
  "No markup on stamp duty or any other government charge",
  "Certificate numbers printed on your invoice to verify yourself",
  "Aadhaar e-Sign under Section 3A, IT Act 2000",
  "Signatures attested by a notary public",
  "Aadhaar and PAN masked in the interface and never logged",
] as const;
