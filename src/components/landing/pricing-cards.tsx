import Link from "@/components/ui/link";
import { ArrowRight, Check, Info, Minus, Sparkles, Tag } from "lucide-react";
import { LEAD_ANCHOR, PLANS } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn, inr } from "@/lib/utils";

/**
 * `compact` shows only what each plan includes. The full list, with the
 * excluded rows greyed out, belongs on /pricing where someone is comparing —
 * on the homepage those rows were roughly a third of the section's height and
 * spent it telling people what they do not get.
 */
export function PricingCards({
  withHeading = true,
  compact = false,
}: {
  withHeading?: boolean;
  compact?: boolean;
}) {
  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-60" />

      <div className="container-page">
        {withHeading ? (
          <SectionHeading
            eyebrow="Pricing"
            icon={Tag}
            title="One transparent fee. Government charges at cost."
            body="You see the platform fee and the stamp duty as separate lines before you pay. We never mark up a government charge — you can verify every rupee against the Registration Department's own rate."
          />
        ) : (
          // The plan names are h3. Without the section heading above them the
          // outline jumped from the page h1 straight to h3.
          <h2 className="sr-only">Plans and pricing</h2>
        )}

        <div className="mt-11 grid items-start gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const featured = plan.recommended;
            return (
              <Reveal key={plan.id} delay={i * 0.1}>
                <div
                  className={cn(
                    "relative h-full rounded-3xl transition-all duration-300",
                    featured
                      ? "bg-navy-950 text-white shadow-lift lg:-mt-4 lg:mb-4"
                      : "border border-line bg-white shadow-soft hover:-translate-y-1 hover:shadow-card",
                  )}
                >
                  {featured ? (
                    <>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
                      >
                        <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[80px]" />
                      </div>
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-1.5 text-[11.5px] font-bold tracking-wide text-white uppercase shadow-glow">
                          <Sparkles className="size-3.5" />
                          Most chosen
                        </span>
                      </div>
                    </>
                  ) : null}

                  <div className="relative p-7 sm:p-8">
                    <h3
                      className={cn(
                        "font-display text-[20px] font-bold",
                        featured ? "text-white" : "text-navy-950",
                      )}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 min-h-[42px] text-[13.5px] leading-relaxed",
                        featured ? "text-white/60" : "text-navy-500",
                      )}
                    >
                      {plan.tagline}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      {plan.from ? (
                        <span
                          className={cn(
                            "text-[14px] font-semibold",
                            featured ? "text-white/45" : "text-navy-400",
                          )}
                        >
                          from
                        </span>
                      ) : null}
                      <span
                        className={cn(
                          "tnum font-display text-[42px] leading-none font-bold tracking-tight",
                          featured ? "text-white" : "text-navy-950",
                        )}
                      >
                        {inr(plan.price)}
                      </span>
                      <span className={cn("text-[14px]", featured ? "text-white/45" : "text-navy-400")}>
                        + GST
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-2 flex items-center gap-1.5 text-[12.5px]",
                        featured ? "text-white/50" : "text-navy-400",
                      )}
                    >
                      <Info className="size-3.5" />
                      Stamp duty billed separately at government rate
                    </p>

                    <div
                      className={cn(
                        "mt-5 rounded-xl px-4 py-3",
                        featured ? "bg-white/[0.07]" : "bg-navy-50",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[11px] font-bold tracking-[0.12em] uppercase",
                          featured ? "text-white/40" : "text-navy-400",
                        )}
                      >
                        Delivery
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[14px] font-semibold",
                          featured ? "text-white" : "text-navy-900",
                        )}
                      >
                        {plan.delivery}
                      </p>
                    </div>

                    <ButtonLink
                      href={LEAD_ANCHOR}
                      size="lg"
                      fullWidth
                      variant={featured ? "primary" : "secondary"}
                      className="mt-6 group"
                    >
                      {plan.cta}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </ButtonLink>

                    <ul className="mt-7 space-y-3">
                      {(compact ? plan.features.filter((f) => f.included) : plan.features).map((feature) => (
                        <li key={feature.label} className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full",
                              feature.included
                                ? featured
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-emerald-50 text-emerald-600"
                                : featured
                                  ? "bg-white/[0.07] text-white/25"
                                  : "bg-navy-100 text-navy-300",
                            )}
                          >
                            {feature.included ? (
                              <Check className="size-3" strokeWidth={3.5} />
                            ) : (
                              <Minus className="size-3" strokeWidth={3} />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "block text-[13.5px] leading-snug",
                                feature.included
                                  ? featured
                                    ? "font-medium text-white/90"
                                    : "font-medium text-navy-800"
                                  : featured
                                    ? "text-white/30"
                                    : "text-navy-400",
                              )}
                            >
                              {feature.label}
                            </span>
                            {feature.hint ? (
                              <span
                                className={cn(
                                  "mt-0.5 block text-[11.5px] leading-snug",
                                  featured ? "text-white/35" : "text-navy-400",
                                )}
                              >
                                {feature.hint}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-10 rounded-2xl border border-line bg-white p-6 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-[16.5px] font-bold text-navy-950">
                  Not sure what your stamp duty will be?
                </h3>
                <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-navy-500">
                  Tell us the rent, deposit and term when we call. You will get the exact
                  arithmetic — the same figure that appears on the invoice, itemised.
                </p>
              </div>
              <ButtonLink href={LEAD_ANCHOR} variant="secondary" size="lg" className="shrink-0">
                Get a firm quote
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-8 text-center text-[13.5px] text-navy-400">
            {compact ? (
              <>
                <Link
                  href="/pricing"
                  className="font-semibold text-brand-700 underline underline-offset-4"
                >
                  See what each plan leaves out
                </Link>{" "}
                ·{" "}
              </>
            ) : null}
            Registering a bulk portfolio?{" "}
            <Link href="/contact" className="font-semibold text-brand-700 underline underline-offset-4">
              Talk to us about volume pricing
            </Link>{" "}
            — from 25 agreements a month.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
