import Link from "@/components/ui/link";
import { ArrowRight, Briefcase, Building2, FileStack, Home, KeyRound } from "lucide-react";
import { AGREEMENT_TYPES } from "@/lib/site";
import { Badge } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { AgreementType } from "@/lib/types";

/**
 * Partial on purpose: this section lists the instruments that have a service
 * page behind them. A sale is drafted straight from /create and has none, so
 * requiring an entry for it here would be requiring a link that 404s.
 */
const ICONS: Partial<Record<AgreementType, React.ComponentType<{ className?: string }>>> = {
  residential: Home,
  commercial: Building2,
  lease: Briefcase,
  "leave-license": KeyRound,
};

export function AgreementTypes() {
  return (
    <section id="agreement-types" className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow="Choose your instrument"
          icon={FileStack}
          title="Four agreements, each drafted for a different situation"
          body="Picking the wrong instrument is the most expensive mistake in a rental. Here is what each one is for, in plain English."
        />

        <Stagger className="mt-11 grid gap-5 md:grid-cols-2" amount={0.1}>
          {AGREEMENT_TYPES.map((type) => {
            const Icon = ICONS[type.id] ?? FileStack;
            return (
              <StaggerItem key={type.id}>
                <Link
                  href={`/services/${type.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-brand-500/[0.07] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-navy-950 text-white transition-colors duration-300 group-hover:bg-brand-600">
                      <Icon className="size-5.5" />
                    </span>
                    {type.popular ? <Badge tone="brand">Most popular</Badge> : null}
                  </div>

                  <h3 className="relative mt-6 font-display text-[19px] font-bold text-navy-950">
                    {type.name}
                  </h3>
                  <p className="relative mt-2.5 flex-1 text-[14.5px] leading-[1.7] text-navy-500">
                    {type.description}
                  </p>

                  <ul className="relative mt-5 flex flex-wrap gap-2">
                    {type.bestFor.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[12px] font-medium text-navy-600"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className="relative mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700">
                    Read what it covers
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
