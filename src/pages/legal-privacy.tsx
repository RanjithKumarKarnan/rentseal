import type { PageMeta } from "@/seo/meta";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "Privacy Policy",
  description:
    "What personal data LP Stamp Paper collects, why, how long we keep it, and how Aadhaar and PAN details are protected. Written in plain English.",
  alternates: { canonical: "/legal/privacy" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "summary",
    heading: "The short version",
    paragraphs: [
      "We collect what we need to draft, stamp, sign and deliver your agreement — and nothing else. We do not sell your data. We do not add you to a marketing list without your consent. Your Aadhaar number is encrypted, masked in the interface, and only its last four digits ever reach the document.",
      "This policy explains the detail. It applies to everything at " + SITE.url + ".",
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    paragraphs: ["Depending on how far you go through the flow, we may collect:"],
    list: [
      "Identity details of the landlord and tenant — name, parent's name, age, address, and where you provide them, Aadhaar and PAN",
      "Contact details — mobile number and email address, used for delivery and for the signing link",
      "Property details — address, area, configuration, furnishing and amenities",
      "Commercial terms — rent, deposit, duration, escalation and the allocation of charges",
      "Payment records — the amount agreed and how it was settled. No payment is taken on this website, so we never handle or store card details at all",
      "Technical data — IP address, browser and device type, and pages visited, used for security and to fix problems",
    ],
  },
  {
    id: "aadhaar",
    heading: "How we treat Aadhaar and PAN specifically",
    paragraphs: [
      "Aadhaar and PAN receive stricter handling than any other field on the platform.",
    ],
    list: [
      "Encrypted at rest, with keys held in a managed key service separate from the database",
      "Masked everywhere in the interface — you and our staff see only the last four digits",
      "Never written to an application log, an error report or an analytics event",
      "Only the last four digits are printed on the generated agreement",
      "Never shared with any third party except the licensed e-Sign provider, and only at the moment of authentication",
      "Aadhaar authentication data returned by the OTP flow is not retained by us at all",
    ],
  },
  {
    id: "why",
    heading: "Why we process it, and on what basis",
    paragraphs: [
      "We process your data to perform the contract you entered into with us — drafting the document, procuring the e-stamp, arranging signature, and delivering the result.",
      "We process a limited set of data to comply with legal obligations, including tax and accounting records, which we are required to retain.",
      "We process technical data on the basis of our legitimate interest in keeping the platform secure and working. You can object to this at any time.",
      "We send marketing communications only where you have opted in, and every one carries a working unsubscribe link.",
    ],
  },
  {
    id: "sharing",
    heading: "Who else sees your data",
    paragraphs: [
      "We share the minimum necessary with a small number of processors, each under a written agreement that restricts what they may do with it:",
    ],
    list: [
      "The licensed e-Sign Application Service Provider, to obtain signatures",
      "The authorised e-stamping channel, to procure and affix the stamp certificate",
      "Email, SMS and WhatsApp providers, to deliver your document and notifications",
      "Cloud hosting in the ap-south-1 (Mumbai) region, where the platform runs",
      "The notary public attesting the signatures — who sees the document, as they must, in order to attest it",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    paragraphs: [
      "Completed agreements are retained for as long as you keep your account, because being able to produce the document years later is the point of the dashboard. You can delete an individual agreement at any time.",
      "Unpaid drafts are stored on your own device and never reach our servers unless you sign in and save them. Server-side drafts that go untouched for 180 days are deleted automatically.",
      "Financial records are retained for eight years, as required under Indian tax law. Technical logs are retained for 90 days.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your rights",
    paragraphs: [
      "You can ask us to do any of the following, and we will respond within 30 days:",
    ],
    list: [
      "Give you a copy of the personal data we hold about you",
      "Correct anything that is inaccurate",
      "Delete your account and the data associated with it, subject to records we must keep by law",
      "Stop sending you marketing communications",
      "Export your agreements in a portable format",
    ],
  },
  {
    id: "security",
    heading: "How we protect it",
    paragraphs: [
      "Encrypted in transit and at rest. Role-based access control, with staff access to customer documents logged and reviewed. Multi-factor authentication on every internal account. No payment is collected through the website, so no card details ever reach it.",
      "No system is perfect. If a breach affects your data, we will tell you and the relevant authority without undue delay, and we will tell you what we are doing about it.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies",
    paragraphs: [
      "We use strictly necessary cookies to keep you signed in and to protect against cross-site request forgery. These cannot be turned off without breaking the service.",
      "We use a small number of analytics cookies to understand which parts of the flow people abandon. These are set only with your consent and you can withdraw it at any time.",
      "We do not use advertising or cross-site tracking cookies.",
    ],
  },
  {
    id: "contact",
    heading: "Contacting us about privacy",
    paragraphs: [
      `Write to our Grievance Officer at ${SITE.email} with "Privacy" in the subject line, or by post to ${SITE.legalName}, ${SITE.address}. We acknowledge within 48 hours and resolve within 30 days.`,
      "If you are not satisfied with our response, you may escalate to the relevant data protection authority.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="You are handing us your Aadhaar number and your address. This page explains exactly what happens to them, without the usual hedging."
      updated="14 July 2026"
      sections={SECTIONS}
      crumbLabel="Privacy Policy"
    />
  );
}
