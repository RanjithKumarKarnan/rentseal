import { useSyncExternalStore } from "react";
import Link from "@/components/ui/link";
import {
  BedDouble,
  Bike,
  Briefcase,
  Building,
  Building2,
  CircleParking,
  DoorOpen,
  Factory,
  FileSignature,
  Handshake,
  Home,
  House,
  KeyRound,
  Landmark,
  Languages,

  Map,
  PanelsTopLeft,
  RefreshCw,
  Scale,
  ShoppingBag,
  Sofa,
  Sprout,
  Stethoscope,
  Store,
  TreePalm,
  Users,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { getTemplatesByCategory, TEMPLATES } from "@/lib/templates";
import { isNotaryMandatory } from "@/lib/notary";
import { templatePrice } from "@/lib/template-prices";
import { inr } from "@/lib/utils";
import type { AgreementTemplate } from "@/lib/templates";
import { Badge } from "@/components/ui/card";
import { TemplateThumb } from "./template-thumb";
import { SITE } from "@/lib/site";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building,
  House,
  TreePalm,
  DoorOpen,
  Sofa,
  RefreshCw,
  Store,
  Briefcase,
  PanelsTopLeft,
  Warehouse,
  UtensilsCrossed,
  Stethoscope,
  Factory,
  ShoppingBag,
  Landmark,
  FileSignature,
  Building2,
  Map,
  Sprout,
  KeyRound,
  BedDouble,
  Bike,
  Users,
  CircleParking,
  Languages,
  Handshake,
  Scale,
};

const CATEGORY_TONE: Record<
  AgreementTemplate["category"],
  "brand" | "emerald" | "violet" | "amber" | "dark"
> = {
  Residential: "brand",
  Commercial: "emerald",
  "Lease deed": "violet",
  "Leave & licence": "amber",
  Sale: "dark",
  "Business contract": "emerald",
  "Deeds & undertakings": "violet",
  Affidavits: "amber",
  "Tamil — தமிழ்": "violet",
};

function TemplateCard({ template }: { template: AgreementTemplate }) {
  const Icon = ICONS[template.icon] ?? Home;
  return (
    <Link
      href={`/create/${template.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
    >
      <div className="relative border-b border-line">
        <TemplateThumb template={template} className="block h-auto w-full" />
        <span className="absolute top-3 left-3 grid size-8 place-items-center rounded-lg bg-navy-950/85 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-brand-600">
          <Icon className="size-4" />
        </span>
        {template.popular ? (
          <span className="absolute top-3 right-3">
            <Badge tone="dark">Popular</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[15.5px] leading-snug font-bold text-navy-950">
          {template.name}
        </h3>
        <p className="mt-1.5 flex-1 text-[13px] leading-[1.65] text-navy-500">
          {template.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-navy-600">
              {template.term}
            </span>
            {/*
              Said on the card rather than at checkout. An affidavit carries a
              notary fee whatever the plan, and finding that out on the last
              screen is the kind of surprise that loses the order.
            */}
            {isNotaryMandatory(template.id) ? (
              <span
                title="An affidavit has to be sworn before a notary, so attestation is included."
                className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11.5px] font-semibold text-brand-700"
              >
                Notary included
              </span>
            ) : null}
          </span>
          <span className="tnum shrink-0 text-right">
            <span className="block font-display text-[16px] font-bold text-navy-950">
              {inr(templatePrice(template.id))}
            </span>
            <span className="block text-[10.5px] leading-tight text-navy-400">to draft</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Moved off the homepage, where it was the single largest section — 25 cards
 * and roughly 3,700px of scroll leading to only four unique destinations.
 * `heading={false}` hides the section heading when the page already has one.
 */
/**
 * Whether an entrance animation should play at all.
 *
 * The cards fade up from nothing, and a browser does not advance an animation
 * — CSS or otherwise — in a tab nobody is looking at. Applied unconditionally
 * that leaves sixty-two cards stranded at zero opacity on any page loaded out
 * of sight, which is the same way the whole site once went blank in a
 * background tab.
 *
 * So the markup is visible by default and the animation is added afterwards,
 * only when there is someone there to see it. Rendering it off on the server
 * also keeps the first paint identical to the HTML.
 */
function useEntrance() {
  return useSyncExternalStore(
    (notify) => {
      document.addEventListener("visibilitychange", notify);
      return () => document.removeEventListener("visibilitychange", notify);
    },
    () => document.visibilityState === "visible",
    () => false,
  );
}

export function TemplateLibrary({
  templates,
  query,
  onClear,
}: {
  /** A filtered subset. Omitted, the whole catalogue is shown. */
  templates?: AgreementTemplate[];
  /** What was searched for, so the empty state can name it. */
  query?: string;
  onClear?: () => void;
} = {}) {
  const groups = getTemplatesByCategory(templates).filter((g) => g.templates.length > 0);
  const entrance = useEntrance();

  return (
    <section id="templates" className="section">
      <div className="container-page">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
            <p className="font-display text-[18px] font-bold text-navy-950">
              Nothing here matches {query ? `“${query}”` : "that"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-navy-500">
              Try the plain word for the document — rent, lease, shop, godown, loan, affidavit — or
              ring the office on {SITE.phone}. If we draft it and it is not on this list, we will
              add it.
            </p>
            {onClear ? (
              <button
                type="button"
                onClick={onClear}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-navy-900"
              >
                Show all {TEMPLATES.length} documents
              </button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map(({ category, templates: group }) => (
              <div key={category}>
                {/* A real heading per family. The cards are h3, so without an
                    h2 here the outline stepped from the page h1 to h3 — and
                    "Affidavits", "Lease deed" and the rest are the words people
                    search for. */}
                <h2 className="flex items-center gap-3 text-[13px] font-medium text-navy-500">
                  <Badge tone={CATEGORY_TONE[category]}>{category}</Badge>
                  <span>
                    {group.length} template{group.length === 1 ? "" : "s"}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                </h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.map((template, i) => (
                    <div
                      key={template.id}
                      // Sixty-two cards were sixty-two Framer components, each
                      // with its own observer and its own frame subscription,
                      // on the heaviest page of the site. The entrance is the
                      // same; it is four lines of CSS and no JavaScript now.
                      className={entrance ? "card-rise h-full" : "h-full"}
                      style={entrance ? { animationDelay: `${Math.min(i, 7) * 55}ms` } : undefined}
                    >
                      <TemplateCard template={template} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
