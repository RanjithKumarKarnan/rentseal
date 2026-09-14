"use client";

import { createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  agreementTitle,
  generateClauses,
  propertyAddress,
  scheduleDescription,
  scheduleHeading,
  specFor,
  witnessethLine,
} from "@/lib/clauses";
import type { AgreementDraft } from "@/lib/types";
import { cn, formatDate, inr, rupeesInWords } from "@/lib/utils";
import type { Relation } from "@/lib/types";

/**
 * Printed in full, the way an executed agreement carries it.
 *
 * The instrument has to identify the parties completely — a masked number in
 * the deed that gets stamped and signed is not the identification the document
 * exists to record. Grouped in fours because that is how it is written.
 */
function formatAadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** The deed refers back to the party, and the relationship fixes the gender. */
function pronoun(relation: Relation) {
  const female = relation === "daughter" || relation === "wife";
  return female
    ? { self: "herself", possessive: "her" }
    : { self: "himself", possessive: "his" };
}

/**
 * Whether the filled-in values are obscured.
 *
 * The clause wording stays readable — a customer has to be able to check what
 * they are agreeing to. What is hidden is everything a screenshot would be
 * worth taking for: the names, the Aadhaar numbers, the addresses and the
 * money. Off for the copy the office prints.
 */
const Protect = createContext(false);

/** Values are blurred rather than removed, so the sentence still reads. */
function Secret({ children }: { children: React.ReactNode }) {
  const protect = useContext(Protect);
  if (!protect) return <>{children}</>;
  return (
    <span className="select-none blur-[4.5px]" aria-hidden="true">
      {children}
    </span>
  );
}

function Blank({ children, w = "auto" }: { children?: React.ReactNode; w?: string }) {
  if (children) {
    return (
      <span className="font-semibold text-navy-950">
        <Secret>{children}</Secret>
      </span>
    );
  }
  return (
    <span
      className="inline-block translate-y-0.5 rounded border-b border-dashed border-navy-300 bg-amber-50/70 align-baseline"
      style={{ width: w, height: "1em" }}
      aria-label="not filled in yet"
    />
  );
}

/**
 * Splits a clause body so the sensitive parts can be blurred in place.
 *
 * The amounts live inside the prose — "a monthly rent of Rs.12,000 (Rupees
 * Twelve Thousand Only)" — so hiding only the fill-in-the-blank spans would
 * leave the money legible in a screenshot.
 */
function redact(text: string, secrets: string[]) {
  if (!secrets.length) return [{ text, secret: false }];
  const escaped = secrets
    .map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");
  const parts: Array<{ text: string; secret: boolean }> = [];
  const re = new RegExp(`(${escaped})`, "g");
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) parts.push({ text: text.slice(last, m.index), secret: false });
    parts.push({ text: m[0], secret: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), secret: false });
  return parts;
}

/**
 * Diagonal watermark, tiled across the whole document.
 *
 * The point of a watermark, unlike anything that tries to *prevent* a capture,
 * is that it survives one. A photograph of the monitor carries it as surely as
 * a Cmd+Shift+4 does, and no page can stop either of those. It carries the
 * document number, so a leaked screenshot points at the order it came from.
 *
 * Drawn as a tiled SVG rather than repeated DOM nodes: it stays crisp at any
 * zoom, costs one background-image, and cannot be deleted element by element
 * from the inspector the way a stack of divs can.
 */
function watermarkStyle(id: string): React.CSSProperties {
  const tile = 620;
  const h = tile * 0.66;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${h}">
      <g transform="rotate(-30 ${tile / 2} ${h / 2})"
         font-family="Helvetica, Arial, sans-serif" text-anchor="middle"
         fill="#0F172A" fill-opacity="0.17">
        <text x="${tile / 2}" y="${h / 2 - 12}"
              font-size="66" font-weight="700" letter-spacing="3">DRAFT COPY</text>
        <text x="${tile / 2}" y="${h / 2 + 30}"
              font-size="23" font-weight="700" letter-spacing="3">${id} · NOT VALID UNTIL STAMPED</text>
      </g>
    </svg>`.trim();
  return {
    backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
  };
}

/**
 * The instrument itself. Rendered live in the builder and in Review — one
 * source of truth, so what is on screen is what the office prints.
 *
 * @param watermark  off for the copy that gets printed on stamp paper
 */
export function AgreementDocument({
  draft,
  animate = true,
  watermark = true,
  protect = true,
  className,
}: {
  draft: AgreementDraft;
  animate?: boolean;
  watermark?: boolean;
  /** Blur the names, ID numbers, addresses and amounts. */
  protect?: boolean;
  className?: string;
}) {
  const clauses = generateClauses(draft);
  // Short strings are left alone — blurring "2" or "11" would speckle the whole
  // deed and hide nothing worth hiding.
  const secrets = protect
    ? [
        draft.landlord.fullName,
        draft.tenant.fullName,
        draft.landlord.parentName,
        draft.tenant.parentName,
        draft.landlord.address,
        draft.tenant.address,
        draft.landlord.aadhaar,
        draft.tenant.aadhaar,
        propertyAddress(draft),
        scheduleDescription(draft),
        draft.terms.monthlyRent && inr(parseFloat(draft.terms.monthlyRent)),
        draft.terms.securityDeposit && inr(parseFloat(draft.terms.securityDeposit)),
        draft.terms.monthlyRent && rupeesInWords(parseFloat(draft.terms.monthlyRent)),
        draft.terms.securityDeposit && rupeesInWords(parseFloat(draft.terms.securityDeposit)),
        // A sale is identified by the vehicle rather than an address, so these
        // are the lines worth blurring in a preview.
        draft.sale.registrationNumber,
        draft.sale.engineNumber,
        draft.sale.chassisNumber,
        draft.sale.price && inr(parseFloat(draft.sale.price)),
        draft.sale.price && rupeesInWords(parseFloat(draft.sale.price)),
      ].filter((v): v is string => Boolean(v) && String(v).trim().length > 3)
    : [];
  const t = draft.terms;
  const spec = specFor(draft);
  const isSale = spec.family === "sale";
  const isVerbatim = spec.family === "verbatim";
  const isTamil = spec.language === "ta";
  const start = t.startDate ? new Date(t.startDate) : new Date();
  // The deed is dated when it is signed, not when the tenancy begins.
  const executed = t.executionDate ? new Date(t.executionDate) : start;
  const executedAt = t.executionPlace.trim() || draft.property.city;
  const RELATION: Record<string, string> = {
    son: "S/o",
    daughter: "D/o",
    wife: "W/o",
    husband: "H/o",
  };
  // Rent, deposit and the end date are stated inside the clauses now, exactly
  // as the sample states them, rather than in a summary table above them.
  // From the template, not from the instrument: a lease deed has a lessor and
  // a lessee and a sale has a seller and a buyer. The PDF has always taken the
  // roles from the spec, so hardcoding them here made the preview disagree
  // with the document that actually gets sent.
  const partyA = spec.roleA;
  const partyB = spec.roleB;

  const Wrapper = animate ? motion.div : "div";

  return (
    <Protect.Provider value={protect}>
    <article
      className={cn(
        "print-sheet relative bg-white font-sans text-[13px] leading-[1.85] text-navy-800",
        className,
      )}
    >
      {watermark ? (
        <div
          aria-hidden="true"
          className="no-print pointer-events-none absolute -inset-6 z-10 select-none"
          style={watermarkStyle(draft.id)}
        />
      ) : null}
      {isVerbatim ? (
        <>
          {clauses.map((clause) => (
            <p
              key={clause.id}
              data-doc={clause.heading ? "title" : "clauses"}
              className={
                clause.heading
                  ? "avoid-break mt-4 mb-3 text-center font-display text-[15px] font-bold text-navy-950"
                  : "mb-2.5 text-justify"
              }
            >
              {clause.body}
            </p>
          ))}

          <section className="avoid-break mt-10">
            <div className="flex items-end justify-between">
              {[partyA, partyB].filter(Boolean).map((role) => (
                <div key={role} className="w-[42%]">
                  <div className="border-t border-navy-400 pt-1.5">
                    <p className="text-[10.5px] font-bold tracking-wide text-navy-700">
                      {role}{isTamil ? " — கையொப்பம்" : " — signature"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {draft.options.witnessRequired ? (
              <div className="mt-9">
                <p className="text-[11px] font-bold tracking-[0.12em] text-navy-700">
                  {isTamil ? "சாட்சிகள்:" : "WITNESSES:"}
                </p>
                <div className="mt-5 flex items-end justify-between">
                  {["1.", "2."].map((label) => (
                    <div key={label} className="w-[42%]">
                      <p className="mb-7 text-[11px] font-semibold text-navy-700">{label}</p>
                      <div className="border-t border-navy-300 pt-1.5">
                        <p className="text-[9.5px] text-navy-400">
                          {isTamil ? "பெயர், முகவரி, கையொப்பம்" : "Name, address and signature"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : (
        <>
      {/* Title. An h2, not an h1: the page's own heading names the document
          being drafted, and this is the title printed inside the preview of
          it — two h1s on the page, one of them a rendering of a deed. */}
      <header data-doc="title" className="avoid-break mb-7 text-center">
        <h2 className="font-display text-[17px] font-bold tracking-[0.08em] text-navy-950 uppercase">
          {agreementTitle(draft)}
        </h2>
        {isSale ? (
          <p className="mt-4 text-left">
            <span className="font-semibold">Date: </span>
            <Blank w="120px">{t.executionDate ? formatDate(executed) : undefined}</Blank>
          </p>
        ) : (
        <p className="mt-4 text-left">
          This {agreementTitle(draft).toUpperCase()} is made and executed at{" "}
          <Blank w="90px">{executedAt || undefined}</Blank> on this{" "}
          <Blank w="120px">{t.executionDate ? formatDate(executed) : undefined}</Blank>.
        </p>
        )}
      </header>

      {isSale ? (
        <section data-doc="property" className="avoid-break mb-6">
          <p className="mb-5 text-justify">
            I, <Blank w="150px">{draft.landlord.fullName || undefined}</Blank>
            {draft.landlord.aadhaar ? (
              <> (Aadhaar No: <Blank>{formatAadhaar(draft.landlord.aadhaar)}</Blank>)</>
            ) : null}
            , hereby confirm that I have sold my {draft.sale.kind} to{" "}
            <Blank w="150px">{draft.tenant.fullName || undefined}</Blank>
            {draft.tenant.aadhaar ? (
              <> (Aadhaar No: <Blank>{formatAadhaar(draft.tenant.aadhaar)}</Blank>)</>
            ) : null}{" "}
            for a total amount of{" "}
            <Blank w="90px">
              {draft.sale.price ? `${inr(parseFloat(draft.sale.price))}/-` : undefined}
            </Blank>{" "}
            (
            <Blank w="170px">
              {draft.sale.price ? rupeesInWords(parseFloat(draft.sale.price)) : undefined}
            </Blank>
            ).
          </p>

          <p className="mb-3 text-center text-[11px] font-bold tracking-[0.14em] text-navy-700">
            VEHICLE DETAILS
          </p>
          <dl className="space-y-1.5">
            {[
              ["Vehicle No.", draft.sale.registrationNumber],
              [
                "Make & Model",
                [draft.sale.makeModel, draft.sale.manufactureYear].filter(Boolean).join(" · "),
              ],
              ["Engine No.", draft.sale.engineNumber],
              ["Chassis No.", draft.sale.chassisNumber],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="w-32 shrink-0 font-semibold">{label}</dt>
                <dd className="flex-1">
                  <Blank w="150px">{value || undefined}</Blank>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : (
        <>
      {/* Parties */}
      <section data-doc="landlord" className="avoid-break mb-6">
        <p className="mb-2 text-center text-[11px] font-bold tracking-[0.14em] text-navy-700">
          BETWEEN
        </p>
        <p className="mb-4 text-justify">
          <Blank w="150px">{draft.landlord.fullName || undefined}</Blank>
          {draft.landlord.aadhaar ? (
            <> (Aadhaar No: <Blank>{formatAadhaar(draft.landlord.aadhaar)}</Blank>)</>
          ) : null}
          {draft.landlord.parentName ? (
            <>
              , {RELATION[draft.landlord.relation] ?? "S/o"}:{" "}
              <Blank>{draft.landlord.parentName}</Blank>
            </>
          ) : null}
          , residing at <Blank w="220px">{draft.landlord.address || undefined}</Blank>, hereinafter
          called as the{" "}
          <strong className="font-bold text-navy-950">&ldquo;{partyA}&rdquo;</strong> (which
          expression shall unless repugnant to the meaning or context thereof include{" "}
          {pronoun(draft.landlord.relation).self}, {pronoun(draft.landlord.relation).possessive}{" "}
          heirs, successors, executors, administrators and assigns) of the ONE PART.
        </p>

        <p className="mb-2 text-center text-[11px] font-bold tracking-[0.14em] text-navy-700">
          AND
        </p>
        <p className="text-justify">
          <Blank w="150px">{draft.tenant.fullName || undefined}</Blank>
          {draft.tenant.aadhaar ? (
            <> (Aadhaar No: <Blank>{formatAadhaar(draft.tenant.aadhaar)}</Blank>)</>
          ) : null}
          {draft.tenant.parentName ? (
            <>
              , {RELATION[draft.tenant.relation] ?? "S/o"}:{" "}
              <Blank>{draft.tenant.parentName}</Blank>
            </>
          ) : null}
          , residing at <Blank w="220px">{draft.tenant.address || undefined}</Blank>, hereinafter
          called as the{" "}
          <strong className="font-bold text-navy-950">&ldquo;{partyB}&rdquo;</strong> (which
          expression shall unless repugnant to the meaning or context thereof include{" "}
          {pronoun(draft.tenant.relation).self}, {pronoun(draft.tenant.relation).possessive} heirs,
          successors, executors, administrators and assigns) of the OTHER PART.
        </p>
      </section>

      {/* Recital */}
      <section data-doc="property" className="avoid-break mb-6">
        <p className="text-justify">
          WHEREAS the {partyA} is the absolute owner of the premises{" "}
          <Blank w="200px">{propertyAddress(draft) || undefined}</Blank>, AND WHEREAS the {partyB}{" "}
          has requested the {partyA} to rent-out{" "}
          {draft.property.wholeProperty ? (
            "the said premises"
          ) : (
            <Blank w="180px">{draft.property.portionDescription || undefined}</Blank>
          )}{" "}
          {draft.property.wholeProperty ? "" : "of the above said premises "}more fully described
          in the schedule hereunder for{" "}
          <strong className="font-bold text-navy-950">
            {draft.type === "commercial" ? "COMMERCIAL PURPOSE" : "RESIDENTIAL PURPOSE"}
          </strong>{" "}
          and the {partyA} has agreed to the same on the following terms and conditions.
        </p>
      </section>

        </>
      )}

      {/* Operative clauses */}
      <section data-doc="terms" className="mb-7">
        {isSale ? null : (
          <p className="mb-4 text-[11px] font-bold tracking-[0.1em] text-navy-700">
            {witnessethLine(draft)}
          </p>
        )}

        <ol data-doc="clauses" className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {clauses.map((clause, i) => (
              <Wrapper
                key={clause.id}
                {...(animate
                  ? {
                      layout: true,
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    }
                  : {})}
                className="overflow-hidden"
              >
                <li className="avoid-break flex list-none gap-2.5">
                  <span className="tnum shrink-0 font-semibold text-navy-950">{i + 1}.</span>
                  <span className="min-w-0 text-justify">
                    {redact(clause.body, secrets).map((part, n) =>
                      part.secret ? (
                        <span key={n} className="select-none blur-[4.5px]" aria-hidden="true">
                          {part.text}
                        </span>
                      ) : (
                        <span key={n}>{part.text}</span>
                      ),
                    )}
                    {clause.trigger ? (
                      <span className="no-print ml-2 rounded-full bg-brand-100 px-2 py-0.5 align-middle text-[8.5px] font-bold tracking-wide text-brand-700 uppercase">
                        {clause.trigger}
                      </span>
                    ) : null}
                  </span>
                </li>
              </Wrapper>
            ))}
          </AnimatePresence>
        </ol>
      </section>

      {/* Schedule — a letting only; a sale identifies the vehicle above. */}
      {isSale ? null : 
      <section className="avoid-break mb-7">
        <h2 className="mb-2 text-center font-display text-[13px] font-bold tracking-wide text-navy-950 uppercase">
          {draft.property.wholeProperty
            ? // Title-cased for the screen; the PDF prints it in capitals.
              scheduleHeading(draft).replace(/\b(\w)(\w*)/g, (_, a, b) => a + b.toLowerCase())
            : "Schedule of the Portion"}
        </h2>
        <p className="text-justify">
          All that piece and parcel of{" "}
          <Blank w="220px">{scheduleDescription(draft) || undefined}</Blank>
          {draft.property.builtUpArea ? (
            <>
              , admeasuring approximately <Blank>{draft.property.builtUpArea}</Blank> square feet
            </>
          ) : null}
          .
        </p>
      </section>
      }

      {/* Execution */}
      <section className="avoid-break">
        {isSale ? null : (
          <p className="text-justify">
            In witness whereof the {partyA.toLowerCase()} and the {partyB.toLowerCase()} have
            signed this deed on the day, month and year above written in the presence of
            witnesses.
          </p>
        )}

        <div className="mt-10 flex items-end justify-between">
          {[partyA, partyB].map((role) => (
            <div key={role} className="w-[42%]">
              <div className="border-t border-navy-400 pt-1.5">
                <p className="text-[10.5px] font-bold tracking-wide text-navy-700">{role}</p>
                <p className="text-[10.5px] text-navy-500">
                  {role === partyA ? draft.landlord.fullName : draft.tenant.fullName}
                </p>
              </div>
            </div>
          ))}
        </div>

        {draft.options.witnessRequired ? (
          <div className="mt-9">
            <p className="text-[11px] font-bold tracking-[0.12em] text-navy-700">WITNESSES:</p>
            <div className="mt-5 flex items-end justify-between">
              {["1.", "2."].map((label) => (
                <div key={label} className="w-[42%]">
                  <p className="mb-7 text-[11px] font-semibold text-navy-700">{label}</p>
                  <div className="border-t border-navy-300 pt-1.5">
                    <p className="text-[9.5px] text-navy-400">Name, address and signature</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
        </>
      )}
    </article>
    </Protect.Provider>
  );
}
