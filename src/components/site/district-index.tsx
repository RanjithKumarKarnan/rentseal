import Link from "@/components/ui/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { DISTRICTS, NOTABLE_TOWNS, ZONE_META, districtsByRegion } from "@/lib/districts";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * The all-38-districts grid, shared by /rental-agreement and /stamp-paper.
 * `base` is the route segment each card links into.
 */
export function DistrictIndex({
  base,
  noun,
}: {
  base: "rental-agreement" | "stamp-paper";
  noun: string;
}) {
  const groups = districtsByRegion();

  return (
    <>
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="All 38 districts"
            icon={MapPin}
            title={`${noun} in every district of Tamil Nadu`}
            body="Grouped by region, with the delivery promise that applies to each. Pick your district for local Sub-Registrar Offices, towns we cover and what the paperwork usually looks like there."
          />

          <div className="mt-11 space-y-14">
            {groups.map((group) => (
              <div key={group.region}>
                <Reveal>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                    <h2 className="font-display text-[19px] font-bold text-navy-950">
                      {group.region}
                    </h2>
                    <span className="tnum shrink-0 text-[13px] font-semibold text-navy-400">
                      {group.districts.length} districts
                    </span>
                  </div>
                </Reveal>

                <Stagger className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
                  {group.districts.map((district) => {
                    const zone = ZONE_META[district.zone];
                    return (
                      <StaggerItem key={district.slug}>
                        <Link
                          href={`/${base}/${district.slug}`}
                          className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-[16px] font-bold text-navy-950">
                              {district.name}
                            </h3>
                            <ArrowUpRight className="size-4 shrink-0 text-navy-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                          </div>
                          <p className="mt-1 text-[12.5px] text-navy-400">
                            HQ {district.hq} · {district.sroTowns.length} SROs
                          </p>
                          <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                            <span className="text-[12.5px] font-semibold text-emerald-600">
                              {zone.eta}
                            </span>
                            <span className="text-[12.5px] text-navy-400">
                              {district.towns.length} main towns
                            </span>
                          </div>
                        </Link>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Towns that aren't districts */}
      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading
            title="Looking for a town rather than a district?"
            body="These are the towns people search for most. Each one is covered by its parent district page."
            align="left"
          />
          <div className="mt-8 flex flex-wrap gap-2.5">
            {NOTABLE_TOWNS.map((town) => (
              <Link
                key={town.town}
                href={`/${base}/${town.slug}`}
                className="rounded-full border border-line bg-canvas px-4 py-2.5 text-[14px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:bg-white hover:text-brand-700"
              >
                {town.town}
                <span className="ml-1.5 text-[12.5px] text-navy-400">{town.district}</span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-[13.5px] text-navy-400">
            {DISTRICTS.length} districts · every taluk in Tamil Nadu covered.
          </p>
        </div>
      </section>
    </>
  );
}
