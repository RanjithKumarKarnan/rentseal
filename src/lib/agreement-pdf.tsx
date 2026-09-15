import {
  Document,
  Font,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import {
  agreementTitle,
  generateClauses,
  propertyAddress,
  scheduleDescription,
  scheduleHeading,
  specFor,
  witnessethLine,
} from "./clauses";
import { formatDate, inr, rupeesInWords } from "./utils";
import { SITE } from "./site";
import type { AgreementDraft, Relation } from "./types";

/**
 * The agreement as a PDF, for the office rather than the customer.
 *
 * Built from the same `generateClauses` the on-screen document uses, so the two
 * cannot drift apart — the operator prints this onto stamp paper and couriers
 * it, and it has to be word for word what the customer approved.
 *
 * Rendered with @react-pdf/renderer rather than a headless browser on purpose:
 * Puppeteer needs a Chromium binary, which does not survive a serverless
 * deployment without a good deal of arranging.
 */

const RELATION: Record<Relation, string> = {
  son: "S/o",
  daughter: "D/o",
  wife: "W/o",
  husband: "H/o",
};

function pronoun(relation: Relation) {
  const female = relation === "daughter" || relation === "wife";
  return female ? { self: "herself", poss: "her" } : { self: "himself", poss: "his" };
}

/**
 * The PDF standard fonts have no rupee sign, so a ₹ renders as a broken glyph.
 * "Rs." is what an executed Tamil Nadu deed uses anyway — the sample reads
 * "Rs.12,000/-" — so this is closer to the template, not a compromise.
 */
const rupees = (text: string) => text.replace(/₹\s?/g, "Rs.");

/** Printed in full — the deed exists to identify the parties. */
function aadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim() : "";
}

/**
 * The office prints these onto non-judicial stamp paper, whose top third is
 * taken up by the pre-printed Government header. Nothing may be printed into
 * it, so the first page starts 4.5 inches down and every later page starts at
 * the normal margin. 72pt to the inch.
 */
/**
 * Tamil needs a shaping engine — the vowel signs are written before the
 * consonant they belong to and have to be reordered, and conjuncts have to be
 * formed. @react-pdf does this through fontkit, but the standard PDF fonts
 * carry no Tamil at all, so a face has to be embedded. Noto Sans Tamil is used
 * because the SIL Open Font License lets it ship with the app; the licence
 * travels with it in public/fonts/, which is where the browser fetches the
 * faces from when it draws the deed.
 */
Font.register({
  family: "NotoSansTamil",
  fonts: [
    { src: "/fonts/NotoSansTamil-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/NotoSansTamil-Bold.ttf", fontWeight: "bold" },
  ],
});
// Tamil has no hyphenation worth applying, and the default English hyphenator
// breaks the words mid-syllable.
Font.registerHyphenationCallback((word) => [word]);

const A4_HEIGHT = 841.89;
const FIRST_PAGE_TOP_IN = 4.5;
const PAGE_PADDING_TOP = 48;
const FIRST_PAGE_GAP = FIRST_PAGE_TOP_IN * 72 - PAGE_PADDING_TOP;

const s = StyleSheet.create({
  page: {
    paddingTop: PAGE_PADDING_TOP,
    // Room for the signature strip and page number that repeat on every page.
    paddingBottom: 104,
    paddingHorizontal: 56,
    fontSize: 10.5,
    lineHeight: 1.6,
    fontFamily: "Times-Roman",
    color: "#111111",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 1.2,
    marginBottom: 18,
  },
  para: { marginBottom: 10, textAlign: "justify" },
  centreLabel: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 6,
    marginTop: 4,
  },
  witnesseth: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    marginTop: 8,
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  clauseRow: { flexDirection: "row", marginBottom: 9 },
  clauseNum: { width: 22, fontFamily: "Times-Bold" },
  clauseBody: { flex: 1, textAlign: "justify" },
  bold: { fontFamily: "Times-Bold" },
  scheduleHead: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 46 },
  signBlock: { width: "42%" },
  signRule: { borderTopWidth: 0.8, borderTopColor: "#333333", paddingTop: 4 },
  signLabel: { fontFamily: "Times-Bold", fontSize: 9.5, letterSpacing: 0.6 },
  signName: { fontSize: 9.5, color: "#444444" },
  witnessHead: { fontFamily: "Times-Bold", fontSize: 10, marginTop: 34, letterSpacing: 1 },
  witnessRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 26 },
  witnessNum: { fontFamily: "Times-Bold", fontSize: 10, marginBottom: 26 },
  hint: { fontSize: 8, color: "#888888" },

  /* Tamil deeds: the office's own document, set in Tamil throughout. */
  ta: { fontFamily: "NotoSansTamil", fontSize: 10.5, lineHeight: 1.75 },
  taHeading: {
    fontFamily: "NotoSansTamil",
    fontWeight: "bold",
    fontSize: 12.5,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  taPara: { fontFamily: "NotoSansTamil", marginBottom: 8, textAlign: "justify" },
  taFootSig: { fontFamily: "NotoSansTamil", fontWeight: "bold", fontSize: 8 },
  taFootMeta: { fontFamily: "NotoSansTamil" },
  verbatimHeading: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  /* Sale deeds: the vehicle is identified by a labelled block, not a schedule. */
  detailRow: { flexDirection: "row", marginBottom: 5 },
  detailLabel: { width: 118, fontFamily: "Times-Bold" },
  detailValue: { flex: 1 },
  saleSignRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  saleSignCell: { width: "44%" },
  saleSignHead: { fontFamily: "Times-Bold", fontSize: 10.5, letterSpacing: 1, marginBottom: 14 },
  saleSignField: { marginBottom: 16 },

  /* The strip that repeats at the foot of every page.
   *
   * Two @react-pdf quirks are baked into these three styles, both verified
   * against the rendered PDF rather than assumed:
   *
   *   - Only an absolutely positioned `Text` survives `fixed`. Wrapping the
   *     strip in a `fixed` View puts it at y=398691 on an 842pt page.
   *   - A `fixed` Text using `render` must be anchored with `top`, not
   *     `bottom`. With `bottom` the dynamic text lands further off the page on
   *     every sheet — 7106, 398691, 22425312 — because the offset resolves
   *     against the flowed document height. Anchoring from the top is exact,
   *     and A4 is a known height. */
  footSigLeft: {
    position: "absolute",
    top: A4_HEIGHT - 78,
    left: 56,
    width: "40%",
    borderTopWidth: 0.6,
    borderTopColor: "#666666",
    paddingTop: 3,
    fontFamily: "Times-Bold",
    fontSize: 7.5,
    letterSpacing: 0.5,
  },
  footSigRight: {
    position: "absolute",
    top: A4_HEIGHT - 78,
    right: 56,
    width: "40%",
    borderTopWidth: 0.6,
    borderTopColor: "#666666",
    paddingTop: 3,
    textAlign: "right",
    fontFamily: "Times-Bold",
    fontSize: 7.5,
    letterSpacing: 0.5,
  },
  footMeta: {
    position: "absolute",
    top: A4_HEIGHT - 42,
    left: 56,
    right: 56,
    fontSize: 7.5,
    color: "#888888",
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#DDDDDD",
    paddingTop: 5,
  },
});

/** Blanks print as a rule of underscores, the way a typed deed leaves them. */
const fill = (value: string | undefined, width = 22) =>
  value && value.trim() ? value.trim() : "_".repeat(width);

function Party({
  party,
  role,
  part,
}: {
  party: AgreementDraft["landlord"];
  role: string;
  part: string;
}) {
  const p = pronoun(party.relation);
  const id = aadhaar(party.aadhaar);
  return (
    <Text style={s.para}>
      {fill(party.fullName, 26)}
      {id ? ` (Aadhaar No: ${id})` : ""}
      {party.parentName ? `, ${RELATION[party.relation]}: ${party.parentName}` : ""}
      {party.age ? `, aged about ${party.age} years` : ""}, residing at{" "}
      {fill(party.address, 40)}, hereinafter called as the <Text style={s.bold}>“{role}”</Text>{" "}
      (which expression shall unless repugnant to the meaning or context thereof include{" "}
      {p.self}, {p.poss} heirs, successors, executors, administrators and assigns) of the{" "}
      {part}.
    </Text>
  );
}


/** A labelled line in the vehicle block: "Engine No.  G3N4E0490089". */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{fill(value, 30)}</Text>
    </View>
  );
}

/**
 * A sale deed, which is a different document from a letting rather than a
 * variation on one. It states the parties, the consideration and the thing
 * sold, and then passes responsibility across at a stated moment — there is no
 * term to run and nothing to give back.
 */
function SaleBody({ draft, clauses }: { draft: AgreementDraft; clauses: ReturnType<typeof generateClauses> }) {
  const spec = specFor(draft);
  const sale = draft.sale;
  const price = Number(sale.price.replace(/[^\d.]/g, "")) || 0;
  const seller = draft.landlord;
  const buyer = draft.tenant;
  const id = (p: typeof seller) => {
    const digits = p.aadhaar.replace(/\D/g, "");
    return digits ? ` (Aadhaar No: ${digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()})` : "";
  };
  const executed = draft.terms.executionDate ? new Date(draft.terms.executionDate) : new Date();

  return (
    <>
      <Text style={s.title}>{spec.deedTitle}</Text>

      <Text style={s.para}>
        <Text style={s.bold}>Date: </Text>
        {formatDate(executed)}
      </Text>

      <Text style={s.para}>
        I, {fill(seller.fullName, 26)}
        {id(seller)}, hereby confirm that I have sold my {sale.kind} to{" "}
        {fill(buyer.fullName, 26)}
        {id(buyer)} for a total amount of {rupees(inr(price))}/- (
        {rupeesInWords(price)}).
      </Text>

      <Text style={s.scheduleHead}>{spec.scheduleHeading}</Text>
      <Detail label="Vehicle No." value={sale.registrationNumber} />
      <Detail label="Make & Model" value={[sale.makeModel, sale.manufactureYear].filter(Boolean).join(" · ")} />
      <Detail label="Engine No." value={sale.engineNumber} />
      <Detail label="Chassis No." value={sale.chassisNumber} />

      <View style={{ marginTop: 12 }} />
      {clauses.map((clause, i) => (
        <View key={clause.id} style={s.clauseRow} wrap={false}>
          <Text style={s.clauseNum}>{i + 1}.</Text>
          <Text style={s.clauseBody}>{rupees(clause.body)}</Text>
        </View>
      ))}

      <View style={s.saleSignRow} wrap={false}>
        {[
          [spec.roleA, seller.fullName],
          [spec.roleB, buyer.fullName],
        ].map(([role, name]) => (
          <View key={role} style={s.saleSignCell}>
            <Text style={s.saleSignHead}>{role}</Text>
            <Text style={s.saleSignField}>Name: {fill(name, 22)}</Text>
            <Text style={s.saleSignField}>Signature:</Text>
          </View>
        ))}
      </View>

      {draft.options.witnessRequired ? (
        <View wrap={false}>
          <Text style={s.witnessHead}>WITNESSES:</Text>
          <View style={s.witnessRow}>
            {["1.", "2."].map((num) => (
              <View key={num} style={s.signBlock}>
                <Text style={s.witnessNum}>{num}</Text>
                <View style={s.signRule}>
                  <Text style={s.hint}>Name, address and signature</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}

export function AgreementPdf({ draft }: { draft: AgreementDraft }) {
  const clauses = generateClauses(draft);
  const t = draft.terms;
  const title = agreementTitle(draft).toUpperCase();
  const executed = t.executionDate ? new Date(t.executionDate) : new Date();
  const at = t.executionPlace.trim() || draft.property.city;
  const spec = specFor(draft);
  const A = spec.roleA;
  const B = spec.roleB;
  const purpose = spec.purpose;
  const isSale = spec.family === "sale";
  // Two different questions: whether the document is kept verbatim, and
  // whether it is set in Tamil. The service provider agreement is the first
  // without being the second.
  const isVerbatim = spec.family === "verbatim";
  const isTamil = spec.language === "ta";

  return (
    <Document
      title={`${title} — ${draft.id}`}
      author={SITE.legalName}
      subject={`${title} prepared for stamping`}
    >
      <Page size="A4" style={s.page}>
        {/* Both sides initial every page, so no page can be swapped after signing. */}
        <Text style={isTamil ? [s.footSigLeft, s.taFootSig] : s.footSigLeft} fixed>
          {A} {isTamil ? "— கையொப்பம்" : "— signature"}
        </Text>
        <Text style={isTamil ? [s.footSigRight, s.taFootSig] : s.footSigRight} fixed>
          {B} {isTamil ? "— கையொப்பம்" : "— signature"}
        </Text>
        <Text
          // Times-Roman has no Tamil glyphs, so the Tamil footer needs the
          // embedded face too — "பக்கம்" rendered as broken boxes without it.
          style={isTamil ? [s.footMeta, s.taFootMeta] : s.footMeta}
          render={({ pageNumber, totalPages }) =>
            isTamil
              ? `பக்கம் ${pageNumber} / ${totalPages}`
              : `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
        {/* Clears the stamp paper's pre-printed header. First page only. */}
        <View style={{ height: FIRST_PAGE_GAP }} />

        {isVerbatim ? (
          clauses.map((clause) => (
            <Text
              key={clause.id}
              style={
                isTamil
                  ? clause.heading
                    ? s.taHeading
                    : s.taPara
                  : clause.heading
                    ? s.verbatimHeading
                    : s.para
              }
            >
              {clause.body}
            </Text>
          ))
        ) : isSale ? (
          <SaleBody draft={draft} clauses={clauses} />
        ) : (
          <>
        <Text style={s.title}>{title}</Text>

        <Text style={s.para}>
          This {title} is made and executed at {fill(at, 18)} on this {formatDate(executed)}.
        </Text>

        <Text style={s.centreLabel}>BETWEEN</Text>
        <Party party={draft.landlord} role={A} part="ONE PART" />

        <Text style={s.centreLabel}>AND</Text>
        <Party party={draft.tenant} role={B} part="OTHER PART" />

        <Text style={s.para}>
          WHEREAS the {A} is the absolute owner of the premises {fill(propertyAddress(draft), 40)},
          AND WHEREAS the {B} has requested the {A} to rent-out{" "}
          {draft.property.wholeProperty
            ? "the said premises"
            : `${fill(draft.property.portionDescription, 30)} of the above said premises`}{" "}
          more fully described in the schedule hereunder for <Text style={s.bold}>{purpose}</Text>{" "}
          and the {A} has agreed to the same on the following terms and conditions.
        </Text>

        <Text style={s.witnesseth}>{witnessethLine(draft)}</Text>

        {clauses.map((clause, i) => (
          <View key={clause.id} style={s.clauseRow} wrap={false}>
            <Text style={s.clauseNum}>{i + 1}.</Text>
            <Text style={s.clauseBody}>{rupees(clause.body)}</Text>
          </View>
        ))}

        <Text style={s.scheduleHead}>
          {draft.property.wholeProperty ? scheduleHeading(draft) : "SCHEDULE OF THE PORTION"}
        </Text>
        <Text style={s.para}>
          All that piece and parcel of {fill(scheduleDescription(draft), 40)}
          {draft.property.builtUpArea
            ? `, admeasuring approximately ${draft.property.builtUpArea} square feet`
            : ""}
          .
        </Text>

        <Text style={s.para}>
          In witness whereof the {A.toLowerCase()} and the {B.toLowerCase()} have signed this deed
          on the day, month and year above written in the presence of witnesses.
        </Text>

        <View style={s.signRow} wrap={false}>
          {[
            [A, draft.landlord.fullName],
            [B, draft.tenant.fullName],
          ].map(([role, name]) => (
            <View key={role} style={s.signBlock}>
              <View style={s.signRule}>
                <Text style={s.signLabel}>{role}</Text>
                <Text style={s.signName}>{name || " "}</Text>
              </View>
            </View>
          ))}
        </View>

        {draft.options.witnessRequired ? (
          <View wrap={false}>
            <Text style={s.witnessHead}>WITNESSES:</Text>
            <View style={s.witnessRow}>
              {["1.", "2."].map((n) => (
                <View key={n} style={s.signBlock}>
                  <Text style={s.witnessNum}>{n}</Text>
                  <View style={s.signRule}>
                    <Text style={s.hint}>Name, address and signature</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
          </>
        )}
      </Page>
    </Document>
  );
}

/** The deed as a PDF file, drawn in the browser and uploaded with the order. */
export async function renderAgreementPdf(draft: AgreementDraft): Promise<Blob> {
  return pdf(<AgreementPdf draft={draft} />).toBlob();
}
