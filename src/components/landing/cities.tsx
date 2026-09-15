import Link from "@/components/ui/link";
import { ArrowUpRight, Clock3, MapPin, PackageCheck, Truck } from "lucide-react";
import { NOTABLE_TOWNS } from "@/lib/districts";
import { FEATURED_DISTRICTS, LEAD_ANCHOR } from "@/lib/site";
import { DELIVERY_RULES, DELIVERY_ZONES } from "@/lib/stamp-paper";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { inr } from "@/lib/utils";

export function Cities() {
  return (
    <section id="delivery" className="section scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Delivery coverage"
          icon={Truck}
          title="We deliver to all 38 districts of Tamil Nadu"
          body="Stamp paper reaches you wherever you are in the state. These are the honest timelines — not a marketing promise we quietly miss."
        />

        {/* Zones */}
        <Stagger className="mt-11 grid gap-4 lg:grid-cols-3" amount={0.1}>
          {DELIVERY_ZONES.map((zone) => (
            <StaggerItem key={zone.id}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas/60 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[17px] font-bold text-navy-950">
                    {zone.name}
                  </h3>
                  <span className="tnum shrink-0 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-bold text-navy-600">
                    {inr(zone.charge)}
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[15px] font-bold text-emerald-600">
                  <Clock3 className="size-4" />
                  {zone.eta}
                </p>
                {zone.cutOff ? (
                  <p className="mt-1 text-[12.5px] text-navy-400">{zone.cutOff}</p>
                ) : null}

                {/* items-start/content-start stops single-row pills stretching to card height */}
                <ul className="mt-5 flex flex-1 flex-wrap items-start content-start gap-1.5 border-t border-line pt-5">
                  {zone.districts.map((district) => (
                    <li
                      key={district}
                      className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-navy-600"
                    >
                      {district}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <PackageCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-[14.5px] font-bold text-emerald-900">
                  Delivery is free above {inr(DELIVERY_RULES.freeAbovePaperValue)} of physical
                  paper, and on {DELIVERY_RULES.bulkFreeFrom} sheets or more
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-emerald-800">
                  e-Stamp certificates are emailed within minutes — there is nothing to deliver
                  and no charge at all.
                </p>
              </div>
            </div>
            <ButtonLink href={LEAD_ANCHOR} variant="emerald" size="lg" className="shrink-0">
              Check delivery to my district
            </ButtonLink>
          </div>
        </Reveal>

        {/* City pages */}
        <div className="mt-11">
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <MapPin className="size-5 text-brand-600" />
              <h3 className="font-display text-[19px] font-bold text-navy-950">
                Where our orders come from
              </h3>
            </div>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" amount={0.05}>
            {FEATURED_DISTRICTS.map((city) => (
              <StaggerItem key={city.slug}>
                <Link
                  href={`/rental-agreement/${city.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-canvas/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-white hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-[16px] font-bold text-navy-950">
                      {city.name}
                    </h4>
                    <ArrowUpRight className="size-4 shrink-0 text-navy-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </div>
                  <p className="mt-1 text-[12.5px] text-navy-400">HQ {city.hq}</p>
                  <p className="mt-4 text-[13px] font-semibold text-brand-700">
                    {city.sroTowns.length}
                    <span className="ml-1 font-normal text-navy-400">SRO jurisdictions</span>
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-8 rounded-2xl border border-line bg-canvas p-6 sm:p-7">
              <p className="text-[13px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                Also delivering to
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
                {NOTABLE_TOWNS.map((town) => (
                  <Link
                    key={town.town}
                    href={`/stamp-paper/${town.slug}`}
                    className="text-[13.5px] text-navy-500 transition-colors hover:text-brand-700"
                  >
                    {town.town}
                  </Link>
                ))}
                <span className="text-[13.5px] font-semibold text-navy-800">
                  and every other taluk in the state.
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5">
                <Link
                  href="/stamp-paper"
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                >
                  Stamp paper in all 38 districts
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  href="/rental-agreement"
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                >
                  Rental agreements in all 38 districts
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
