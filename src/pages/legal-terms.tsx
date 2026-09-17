import type { PageMeta } from "@/seo/meta";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "Terms of Service",
  description:
    "The terms on which LP Stamp Paper provides document drafting, non-judicial stamp paper, e-signing and delivery services in Tamil Nadu.",
  alternates: { canonical: "/legal/terms" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are and what this covers",
    paragraphs: [
      `These terms govern your use of ${SITE.url} and every service offered on it. The service is operated by ${SITE.legalName}${SITE.cin ? `, a company incorporated in India with CIN ${SITE.cin},` : SITE.udyam ? `, registered under Udyam as ${SITE.udyam},` : ","} having its place of business at ${SITE.address}.`,
      "By creating an agreement, making a payment, or otherwise using the platform, you accept these terms. If you do not accept them, do not use the service.",
    ],
  },
  {
    id: "disclaimer",
    heading: "We are not a law firm",
    paragraphs: [
      "LP Stamp Paper is a technology platform that automates the preparation of legal documents. We are not a law firm, we do not practise law, and nothing on this platform constitutes legal advice or creates an advocate-client relationship between you and us.",
      "Where attestation is included or added, the signatures on your agreement are attested by an independent notary public appointed under the Notaries Act, 1952. The notary is solely responsible for that act. Attestation confirms who signed; it is not a legal opinion on the contents.",
      "If your situation involves a dispute, a claim, or anything beyond the preparation of a standard document, you should engage an advocate directly. We will tell you when we think that is the case.",
    ],
  },
  {
    id: "your-responsibilities",
    heading: "What you are responsible for",
    paragraphs: [
      "The document we generate is only as accurate as the information you provide. You are responsible for the truth and completeness of everything you enter.",
    ],
    list: [
      "Ensuring you have the legal right to let the property, or to take it on rent",
      "The accuracy of all names, identity numbers, addresses, amounts and dates",
      "Reading the generated agreement in full before you pay and before you sign",
      "Ensuring the other party has read and understood it before signing",
      "Attending the Sub-Registrar Office in person where registration is required",
      "Keeping your account credentials confidential",
    ],
  },
  {
    id: "fees",
    heading: "Fees, government charges and taxes",
    paragraphs: [
      "Our fee is the platform fee shown against the plan you select, plus any optional add-on you choose. Goods and Services Tax at the prevailing rate applies to that fee.",
      "Stamp duty and, where applicable, registration fees are statutory charges payable to the Government of Tamil Nadu. We collect them from you and remit them in full. We do not mark them up, and GST is not charged on them.",
      "If the Registration Department ultimately debits a lower amount than we collected, we refund the difference to your original payment method without you having to ask. If it debits a higher amount, we will contact you before proceeding.",
    ],
  },
  {
    id: "stamp-paper-e-sign",
    heading: "Stamp paper and electronic signatures",
    paragraphs: [
      "Non-judicial stamp paper is procured through licensed stamp vendors. Once a document is printed on the stamp paper, it is fixed and cannot be edited — this is a legal constraint, not a limitation of our software.",
      "Electronic signatures are applied using Aadhaar e-Sign through a licensed Application Service Provider. An electronic signature so affixed has the same legal effect as a handwritten signature under Section 3A of the Information Technology Act, 2000, read with the Second Schedule to that Act.",
      "We do not store your Aadhaar authentication data. The OTP verification takes place between you and the authentication infrastructure.",
    ],
  },
  {
    id: "registration",
    heading: "Registration where the term is 12 months or more",
    paragraphs: [
      "Under Section 17(1)(d) of the Registration Act, 1908, a lease of immovable property for a term exceeding one year, or from year to year, must be registered. Where you choose such a term, we will prepare the deed, compute the registration fee, and assist with booking an appointment.",
      "Both parties must appear in person before the Sub-Registrar with photo identification and two witnesses. This is a statutory requirement that no online service can perform on your behalf, and our fee does not include representation before the Sub-Registrar.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    paragraphs: ["You must not use the platform to:"],
    list: [
      "Create a document you know to be false, or which misrepresents any party or property",
      "Impersonate another person or use identity details that are not yours or your principal's",
      "Circumvent, probe or test the security of the platform",
      "Scrape, resell or redistribute our templates or clause library",
      "Do anything unlawful, or anything that would cause us to breach a law or regulation",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    paragraphs: [
      "The platform, its clause library, templates, design and code are owned by us and protected by copyright. On payment, you receive a licence to use the generated document for your own transaction. You do not acquire any right in the underlying templates or clause logic, and you may not resell or redistribute them.",
      "The content you enter remains yours. You grant us only the licence necessary to generate, stamp, transmit and store your document.",
    ],
  },
  {
    id: "liability",
    heading: "Limits on our liability",
    paragraphs: [
      "We provide the platform with reasonable skill and care, but we do not warrant that a generated document will produce any particular outcome in a dispute, or that it will be accepted by every authority in every circumstance.",
      "To the extent permitted by law, our total liability arising out of or in connection with the service is limited to the fees you paid us for the agreement in question, excluding the government charges we remitted on your behalf.",
      "We are not liable for indirect or consequential loss, including loss of a deposit, loss of rent, loss of profit, or loss arising from an inaccuracy in information you supplied.",
      "Nothing in these terms excludes liability for fraud, or any liability that cannot lawfully be excluded.",
    ],
  },
  {
    id: "termination",
    heading: "Suspension and termination",
    paragraphs: [
      "You may stop using the platform at any time. We may suspend or terminate access where we reasonably believe these terms have been breached, or where required by law.",
      "Termination does not affect any agreement already generated and delivered to you, which remains yours, nor does it affect accrued rights of either party.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    paragraphs: [
      "These terms are governed by the laws of India. The courts at Chennai, Tamil Nadu have exclusive jurisdiction over any dispute arising out of them.",
      "Before commencing proceedings, please contact us — the overwhelming majority of complaints are resolved the same day by someone on the support team.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. Where a change is material, we will notify registered users by email at least seven days before it takes effect. The version in force at the time you create an agreement governs that agreement.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Written to be read. If anything here is unclear, ask us and we will explain it — and if the explanation is better than the clause, we will rewrite the clause."
      updated="14 July 2026"
      sections={SECTIONS}
      crumbLabel="Terms of Service"
    />
  );
}
