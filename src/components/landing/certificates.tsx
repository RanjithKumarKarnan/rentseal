import Link from "@/components/ui/link";
import { ArrowRight, BadgeCheck, FileCheck2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { CERTIFICATE_SERVICES } from "@/lib/certificates";
import { inr } from "@/lib/utils";

/**
 * The third line of business, on the homepage.
 *
 * Stamp paper and agreements each had a section; certificates had none, so a
 * visitor who came for a ration card or a PAN saw nothing to tell them they
 * were in the right place. Six of the fourteen are shown — the ones marked
 * popular, plus the two passport services people search for by name — and the
 * rest sit one click away.
 */
const FEATURED = ["pan-card", "new-ration-card", "community-certificate", "msme", "new-voter-id", "new-passport"];

export function Certificates() {
  const shown = FEATURED.map((id) => CERTIFICATE_SERVICES.find((s) => s.id === id)!).filter(Boolean);
  const priced = CERTIFICATE_SERVICES.filter((s) => s.price !== null).map((s) => s.price as number);

  return (
    <section id="certificates" className="section scroll-mt-20 border-y border-line bg-white">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Certificates & registrations"
            icon={FileCheck2}
            title="Not just agreements — the certificates too"
            body={`Ration card, PAN, voter ID, passport, community, income and nativity certificates, and MSME registration. ${CERTIFICATE_SERVICES.length} applications in all, from ${inr(Math.min(...priced))}.`}
          />
          <ButtonLink href="/certificates" variant="secondary" size="lg" className="shrink-0">
            See all {CERTIFICATE_SERVICES.length}
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((service) => (
            <StaggerItem key={service.id}>
              <Link
                href="/certificates"
                className="group flex h-full flex-col rounded-2xl border border-line bg-canvas p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-white hover:shadow-lift"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[15.5px] leading-snug font-bold text-navy-950">
                    {service.name}
                  </h3>
                  <span className="tnum shrink-0 font-display text-[17px] font-bold text-brand-700">
                    {service.price === null ? "—" : inr(service.price)}
                  </span>
                </div>

                {/* The document list is the reason to read this at all. */}
                <ul className="mt-3.5 flex-1 space-y-1.5">
                  {service.documents.slice(0, 4).map((doc) => (
                    <li key={doc} className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      <span className="text-[12.5px] leading-snug text-navy-600">{doc}</span>
                    </li>
                  ))}
                  {service.documents.length > 4 ? (
                    <li className="pl-5.5 text-[12px] text-navy-400">
                      + {service.documents.length - 4} more
                    </li>
                  ) : null}
                </ul>

                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-700">
                  What to bring
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[13.5px] text-navy-500">
            Every one lists the exact documents to bring, so it is done in one visit.{" "}
            <Link
              href="/certificates"
              className="font-semibold text-brand-700 underline underline-offset-4"
            >
              See the full list and fees
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
