import Link from "@/components/ui/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHero({
  eyebrow,
  title,
  body,
  crumbs,
  children,
  icon,
  align = "left",
  compact,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  align?: "left" | "center";
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className={cn("container-page", compact ? "py-12 md:py-16" : "py-14 md:py-20")}>
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className={cn("mb-7", align === "center" && "flex justify-center")}>
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-navy-400">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 ? <ChevronRight className="size-3.5" /> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-navy-700">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-navy-700">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          {eyebrow ? (
            <Reveal>
              <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
            </Reveal>
          ) : null}
          <Reveal delay={0.05}>
            <h1
              className={cn(
                "text-[clamp(2rem,5vw,3.15rem)] leading-[1.08] font-bold tracking-[-0.032em] text-navy-950",
                eyebrow && "mt-5",
              )}
            >
              {title}
            </h1>
          </Reveal>
          {body ? (
            <Reveal delay={0.1}>
              <p className="mt-5 text-[17px] leading-[1.7] text-navy-600">{body}</p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal delay={0.16}>
              <div className="mt-8">{children}</div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** BreadcrumbList structured data to match the visible trail. */
export function BreadcrumbSchema({ crumbs, baseUrl }: { crumbs: Crumb[]; baseUrl: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
