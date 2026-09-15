import type { PageMeta } from "@/seo/meta";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "Refund Policy",
  description:
    "Full refund before the e-stamp is procured, no questions asked. What happens after stamping, and how to raise a refund request.",
  alternates: { canonical: "/legal/refund" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "principle",
    heading: "The principle",
    paragraphs: [
      "Before we spend your money with the government, it is your money and you can have it back. After we have spent it with the government, we cannot get it back either — so that portion becomes non-refundable while our own fee stays refundable if the fault is ours.",
      "That is the whole policy. The rest of this page is the detail.",
    ],
  },
  {
    id: "before-stamping",
    heading: "Before the e-stamp is procured — full refund",
    paragraphs: [
      "Cancel at any point before we procure the e-stamp certificate and you receive 100% of what you paid, including our fee and the notary fee if you added one.",
      "No form, no reason required, no retention call. Message us on WhatsApp or email and it is done.",
      "Refunds are initiated within one working day and reach your original payment method in five to seven working days, depending on your bank.",
    ],
  },
  {
    id: "after-stamping",
    heading: "After the e-stamp is procured",
    paragraphs: [
      "Once the stamp certificate is procured, the duty has been remitted to the Government of Tamil Nadu. That money is no longer with us and the state does not refund it, so the stamp duty and any registration fee become non-refundable.",
      "Our own fee remains refundable in full where the fault lies with us — a drafting error we introduced, a delivery failure, a duplicate charge, or attestation we promised and did not deliver on time.",
      "Where you simply changed your mind after stamping, we refund 50% of the platform fee as a goodwill measure. The government portion cannot be returned.",
    ],
  },
  {
    id: "our-mistakes",
    heading: "If we get it wrong",
    paragraphs: [
      "Tell us within 48 hours of delivery and we will re-issue the corrected agreement at our own cost, including a fresh e-stamp where one is needed. You pay nothing further.",
      "If you would rather have your money than a corrected document, we refund our entire fee and the notary fee. The stamp duty already remitted is refunded only to the extent the Registration Department permits, and we will pursue that on your behalf.",
    ],
  },
  {
    id: "overcollection",
    heading: "If we collected more duty than was due",
    paragraphs: [
      "The difference comes back to you automatically. You do not have to notice it, ask for it, or fill in anything. We reconcile every e-stamp against what we collected, and any surplus is refunded to the original payment method within seven working days.",
      "We never keep a surplus on a government charge. Not as a fee, not as a credit, not as a rounding.",
    ],
  },
  {
    id: "not-refundable",
    heading: "What is not refundable",
    paragraphs: ["To be straightforward about the exceptions:"],
    list: [
      "Stamp duty and registration fees already remitted to the Government of Tamil Nadu",
      "Sub-Registrar appointment slots missed by you without 24 hours' notice",
      "Courier charges for a physical copy already dispatched",
      "Agreements cancelled because the information you supplied was untrue",
      "Requests raised more than 30 days after delivery, unless the fault is ours",
    ],
  },
  {
    id: "how-to-ask",
    heading: "How to raise a refund",
    paragraphs: [
      `Message ${SITE.whatsapp} on WhatsApp, or write to ${SITE.email} with your agreement number — it starts with RS and appears on your invoice and in your dashboard. Tell us what went wrong in a sentence.`,
      "We acknowledge within 4 working hours, decide within 2 working days, and initiate the refund the same day we decide. You will get a written reason either way.",
      "If you disagree with our decision, ask for it to be escalated. A second person who was not involved the first time will look at it.",
    ],
  },
  {
    id: "chargebacks",
    heading: "Chargebacks",
    paragraphs: [
      "Please talk to us before raising a chargeback with your bank. A chargeback takes 60 to 90 days and freezes the agreement in the meantime; we can usually resolve the same issue within two days.",
      "If you have already raised one, tell us the reference and we will co-operate with your bank rather than contest it, unless the claim is plainly inconsistent with our records.",
    ],
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Full refund until the moment your money leaves us for the government. After that, our fee is still refundable when the fault is ours."
      updated="14 July 2026"
      sections={SECTIONS}
      crumbLabel="Refund Policy"
    />
  );
}
