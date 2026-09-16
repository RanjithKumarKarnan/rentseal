import {
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Printer,
  Scale,
  Stamp,
  Truck,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { StampSheet } from "@/components/ui/stamp-sheet";
import {
  COUNTER_SERVICES,
  DELIVERY_RULES,
  DENOMINATIONS,
  SHIPPING_OPTIONS,
  STAMP_ADD_ONS,
} from "@/lib/stamp-paper";
import { LEAD_ANCHOR } from "@/lib/site";
import { inr } from "@/lib/utils";

/**
 * The counter's own rate card.
 *
 * Every figure here is the office's, transcribed. Two things it deliberately
 * does rather than the tidier alternative:
 *
 *   - It prints the face value beside the price. ₹100 paper costs ₹120, and a
 *     price list that showed only the ₹120 would leave the customer working out
 *     at the counter what the extra ₹20 was for. Showing both says it plainly:
 *     the sheet is worth ₹100 to the government and ₹20 of the price is ours.
 *   - Where no rate has been quoted it says "on request" rather than guessing.
 *     A denomination we have not priced is not a denomination we can be held to
 *     a number on.
 */

export function StampPaperRates() {
  return (
    <section id="rates" className="section scroll-mt-20 border-t border-line bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Rate card"
          icon={IndianRupee}
          title="What a sheet costs, before anything is printed on it"
          body="These are the prices for blank, unprinted non-judicial stamp paper — the sheet most people in Tamil Nadu call bond paper — in the four denominations we carry. The face value is what the government charges for the sheet; the difference is what we charge to fetch it and get it to you. An e-Stamp is not a sheet at all — it is a certificate that arrives by email. Delivery is separate and listed further down."
        />

        {/* ── Denominations ── */}
        <Reveal>
          <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3.5">
              <Stamp className="size-4 text-navy-500" />
              <h3 className="text-[13px] font-bold text-navy-950">
                Non-judicial stamp paper — blank, without printing
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line text-[11.5px] font-bold tracking-[0.08em] text-navy-400 uppercase">
                    <th scope="col" className="px-5 py-3">Denomination</th>
                    <th scope="col" className="px-5 py-3">Commonly used for</th>
                    <th scope="col" className="px-5 py-3 text-right">You pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {DENOMINATIONS.map((d) => (
                    <tr key={d.label} className="align-top">
                      <th scope="row" className="px-5 py-3.5 font-normal">
                        <div className="flex items-start gap-3">
                          <StampSheet
                            value={d.value}
                            label={d.label}
                            className="w-16 shrink-0 rounded-[3px] ring-1 ring-navy-950/10"
                          />
                          <div className="min-w-0">
                            <span className="tnum flex flex-wrap items-center gap-2 font-display text-[16px] font-bold text-navy-950">
                              {d.label}
                              {d.popular ? <Badge tone="dark">Most used</Badge> : null}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] text-navy-400">
                              {d.value === 0
                                ? "e-Stamp certificate · emailed"
                                : "Non-judicial paper · delivered"}
                            </span>
                          </div>
                        </div>
                      </th>
                      <td className="px-5 py-3.5 text-[13px] leading-relaxed text-navy-500">
                        {d.uses.slice(0, 3).join(", ")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {d.price === null ? (
                          <span className="text-[13px] font-semibold text-navy-500">
                            On request
                          </span>
                        ) : (
                          <>
                            <span className="tnum block text-[15px] font-bold text-navy-950">
                              {inr(d.price)}
                            </span>
                            <span className="tnum mt-0.5 block text-[11.5px] text-navy-400">
                              {inr(d.value)} face + {inr(d.price - d.value)} ours
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line bg-canvas px-5 py-3.5 text-[12.5px] leading-relaxed text-navy-500">
              Those four are the physical denominations we carry — ₹100 is the smallest
              sheet, so an affidavit or a bond that would once have gone on ₹20 or ₹50 paper is
              executed on ₹100. Anything needing an exact figure goes on an e-Stamp instead,
              where the government duty passes through at cost whatever it comes to.
            </p>
          </div>
        </Reveal>

        {/* ── Sheets, stamps and labels ── */}
        <Reveal>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3.5">
              <Scale className="size-4 text-navy-500" />
              <h3 className="text-[13px] font-bold text-navy-950">
                Sheets, stamps and court fee labels
              </h3>
            </div>
            <ul className="divide-y divide-line">
              {STAMP_ADD_ONS.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-6 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-navy-950">{item.name}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-500">
                      {item.blurb}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="tnum block text-[15px] font-bold text-navy-950">
                      {inr(item.price)}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-navy-400">
                      {item.faceValue ? `${inr(item.faceValue)} face value` : "each"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* ── Printing, notary and the rest of the counter ── */}
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2" amount={0.1}>
          {COUNTER_SERVICES.map((service) => (
            <StaggerItem key={service.id}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-[15.5px] font-bold text-navy-950">
                    {service.name}
                  </h3>
                  <span className="tnum shrink-0 text-[15px] font-bold text-brand-700">
                    {service.price === null ? "On request" : inr(service.price)}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-[1.7] text-navy-500">{service.blurb}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <p className="mt-4 flex items-start gap-2.5 rounded-2xl border border-line bg-white p-5 text-[13px] leading-relaxed text-navy-600">
            <Printer className="mt-0.5 size-4 shrink-0 text-brand-600" />
            <span>
              <span className="font-semibold text-navy-950">Send us the draft and we will print it.</span>{" "}
              Upload a PDF or a Word file with your order and it comes back printed on the
              non-judicial stamp paper, with the margins a sub-registrar expects left clear. If you would
              rather draft it here,{" "}
              <a className="font-semibold text-brand-700 underline underline-offset-4" href="/templates">
                sixty-three deeds and affidavits
              </a>{" "}
              are ready to fill in.
            </span>
          </p>
        </Reveal>

        {/* ── Shipping ── */}
        <Reveal>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-navy-950 text-white">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <Truck className="size-4 text-brand-400" />
              <h3 className="text-[13px] font-bold">Shipping</h3>
            </div>
            <ul className="divide-y divide-white/10">
              {SHIPPING_OPTIONS.map((option) => (
                <li key={option.id} className="flex items-start justify-between gap-6 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-white">
                      {option.from} → {option.to}
                    </p>
                    <p className="mt-0.5 text-[12px] text-white/45">
                      {option.eta}
                      {option.note ? ` · ${option.note}` : ""}
                    </p>
                  </div>
                  <span className="tnum shrink-0 text-[15px] font-bold text-emerald-400">
                    {option.charge === null ? "At cost" : inr(option.charge)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-white/10 bg-white/[0.05] px-5 py-4">
              {[
                `Free above ${inr(DELIVERY_RULES.freeAbovePaperValue)} of physical paper`,
                `Free everywhere on ${DELIVERY_RULES.bulkFreeFrom} sheets or more`,
                "An e-Stamp is emailed, so there is nothing to ship — and its value does not count towards the free-delivery threshold",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-white/70">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
              Order non-judicial stamp paper
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <p className="text-center text-[12.5px] text-navy-400">
              Nothing is charged here. We ring you with the final figure — paper, printing,
              attestation and delivery — and take payment on that call.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
