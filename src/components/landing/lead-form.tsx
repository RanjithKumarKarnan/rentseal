import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileText,
  Lock,
  MessageCircle,
  PackageCheck,
  Phone,
  Scale,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { AGREEMENT_TYPES, CITIES, SITE } from "@/lib/site";
import { enquiryRow } from "@/lib/orders";
import { submitOrder } from "@/lib/submit-order";
import { AgreementProvider } from "@/lib/agreement-store";
import { BuilderShell } from "@/components/builder/builder-shell";
import type { AgreementType } from "@/lib/types";
import { DENOMINATIONS } from "@/lib/stamp-paper";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const ASSURANCES = [
  { icon: Clock3, text: "We call back within 30 minutes during working hours" },
  { icon: PackageCheck, text: "Same-day delivery in Chennai, ₹200 express across Tamil Nadu" },
  { icon: BadgeCheck, text: "A real person, in Tamil or English — never a bot" },
  { icon: ShieldCheck, text: "Face value and our charge shown separately, both before you pay" },
  { icon: Lock, text: "Your number is used to help you, never sold or spammed" },
];

type Need = "stamp-paper" | "agreement" | "affidavit" | "both";

/** What the counter needs to know about attestation before it quotes. */
type NotaryChoice = "none" | "stamp-paper" | "white-sheet" | "advise";

const NOTARY_CHOICES: Array<{ value: NotaryChoice; label: string; hint: string }> = [
  { value: "none", label: "Not needed", hint: "Just the paper" },
  { value: "stamp-paper", label: "On the non-judicial stamp paper", hint: "₹350, two green sheets included" },
  { value: "white-sheet", label: "On plain paper", hint: "₹100" },
  { value: "advise", label: "Not sure", hint: "Advise me on the call" },
];

// Labels stay short — four across inside a ~520px card leaves no room for prose.
// Affidavit is its own choice rather than a kind of agreement: it is sworn, not
// negotiated, it always carries the notary fee, and the counter quotes it
// differently. Burying it under "Agreement" was sending sworn work down a path
// that never mentions attestation.
const NEEDS: Array<{ value: Need; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: "stamp-paper", label: "Non-judicial stamp paper", icon: Stamp },
  { value: "agreement", label: "Agreement", icon: FileText },
  { value: "affidavit", label: "Affidavit", icon: Scale },
  { value: "both", label: "Both", icon: PackageCheck },
];

export function LeadForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState<Need>("stamp-paper");
  const [error, setError] = useState("");
  // Picking "Agreement" offers to draft it here rather than posting an enquiry
  // and waiting for a call — the drafter is the product, so it should be one
  // click from the thing that says "tell us what you need".
  const [drafting, setDrafting] = useState<AgreementType | null>(null);
  const [draftType, setDraftType] = useState<AgreementType>("residential");
  const [wantsCallback, setWantsCallback] = useState(false);
  // Both asked for by the counter. Attestation because half the walk-ins want
  // the notary's signature and were having to say so in the free-text box, and
  // the date because the office needs to know when the paper is wanted for
  // before it promises a delivery slot.
  const [notary, setNotary] = useState<NotaryChoice>("none");
  const [stampDate, setStampDate] = useState("");
  const showDrafter = (need === "agreement" || need === "both") && !wantsCallback;
  /** Stamp paper is being bought, so the paper questions apply. */
  const buyingPaper = need === "stamp-paper" || need === "affidavit" || need === "both";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a 10-digit mobile number so we can call you back.");
      return;
    }
    setError("");
    setSending(true);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const value = (name: string) => String(form.get(name) ?? "");

    try {
      await submitOrder(
        enquiryRow({
          need,
          name: value("name"),
          phone,
          email: value("email"),
          city: value("city"),
          denomination: value("denomination"),
          notary: buyingPaper ? notary : "",
          stampDate: buyingPaper ? stampDate : "",
          agreementType: value("agreementType"),
          message: value("message"),
        }),
      );
      setSending(false);
      setSent(true);
    } catch {
      // Saying "thank you" for an enquiry that never reached the office would
      // leave someone waiting for a call that is never going to come.
      setSending(false);
      setError(
        "We could not send that just now. Please call or WhatsApp us on the numbers beside this form and we will take your details down.",
      );
    }
  };

  if (drafting) {
    return (
      <section
        id="get-started"
        className="section relative scroll-mt-20 overflow-hidden bg-navy-950"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/4 size-[620px] rounded-full bg-brand-600/18 blur-[130px]"
        />
        <div className="relative container-page">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-[26px] font-bold tracking-tight text-white sm:text-[32px]">
                Draw it up right here
              </h2>
              <p className="mt-1.5 text-[14.5px] text-white/55">
                Nothing to pay until the document is finished and you are happy with it.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDrafting(null);
                setWantsCallback(false);
              }}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </div>

          <div className="mt-7 overflow-hidden rounded-3xl border border-line bg-canvas shadow-lift">
            <AgreementProvider initialType={drafting}>
              <BuilderShell type={drafting} embedded />
            </AgreementProvider>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="get-started" className="section relative scroll-mt-20 overflow-hidden bg-navy-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 size-[620px] rounded-full bg-brand-600/18 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-48 size-[520px] rounded-full bg-emerald-500/12 blur-[130px]"
      />

      <div className="relative container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_520px] lg:gap-16">
          {/* ── Pitch ──────────────────────────────────────── */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase backdrop-blur">
                <MessageCircle className="size-3.5 text-emerald-400" />
                Get started
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mt-6 text-[clamp(2rem,4.6vw,3.05rem)] leading-[1.1] font-bold tracking-[-0.03em] text-white">
                Tell us what you need.{" "}
                <br className="hidden sm:block" />
                We&apos;ll bring it to you.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 max-w-lg text-[17px] leading-[1.7] text-white/60">
                Non-judicial stamp paper, an agreement, or both. Leave your number and one of our team will
                call back with a firm quote — the face value, our charge and the delivery all
                stated up front, nothing hidden. Chennai orders placed before 2pm go out the same day.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-9 space-y-3.5">
                {ASSURANCES.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white/[0.08]">
                      <item.icon className="size-3.5 text-brand-400" />
                    </span>
                    <span className="text-[14.5px] leading-relaxed text-white/75">{item.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-3"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-white/[0.08] transition-colors group-hover:bg-white/[0.14]">
                    <Phone className="size-4.5 text-brand-400" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold tracking-wide text-white/40 uppercase">
                      Prefer to call?
                    </span>
                    <span className="block text-[15px] font-bold text-white">{SITE.phone}</span>
                  </span>
                </a>

                <a
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  className="group flex items-center gap-3"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-white/[0.08] transition-colors group-hover:bg-white/[0.14]">
                    <MessageCircle className="size-4.5 text-emerald-400" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold tracking-wide text-white/40 uppercase">
                      On WhatsApp
                    </span>
                    <span className="block text-[15px] font-bold text-white">{SITE.whatsapp}</span>
                  </span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* ── Form ───────────────────────────────────────── */}
          <Reveal delay={0.1}>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl border border-line bg-white p-8 text-center shadow-lift sm:p-10"
              >
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500 shadow-[0_10px_32px_-10px_rgb(16_185_129/0.7)]">
                  <CheckCircle2 className="size-8 text-white" />
                </span>
                <h3 className="mt-6 font-display text-[23px] font-bold tracking-tight text-navy-950">
                  Thank you — we have your details
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-[1.7] text-navy-600">
                  Someone from the team will call{" "}
                  <span className="font-semibold text-navy-950">
                    +91 {phone.slice(0, 5)} {phone.slice(5)}
                  </span>{" "}
                  within 30 minutes during working hours. If you would rather not wait, message us
                  on WhatsApp and we will pick it up straight away.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    size="lg"
                    onClick={() =>
                      window.open(`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`, "_blank")
                    }
                  >
                    <MessageCircle className="size-[18px]" />
                    Message us now
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setSent(false);
                      setPhone("");
                    }}
                  >
                    Send another enquiry
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={submit}
                className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[20px] font-bold tracking-tight text-navy-950">
                      Tell us what you need
                    </h3>
                    <p className="mt-1.5 text-[13.5px] text-navy-500">
                      Takes 20 seconds. No payment, no obligation.
                    </p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11.5px] font-bold text-emerald-700 sm:inline-flex">
                    <span className="relative inline-flex size-1.5 text-emerald-500">
                      <span className="pulse-ring" />
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Team online
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="mb-1.5 text-[13.5px] font-semibold text-navy-800">
                      What do you need?
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="What do you need"
                      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                    >
                      {NEEDS.map((option) => {
                        const isActive = option.value === need;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => {
                              setNeed(option.value);
                              setWantsCallback(false);
                              // An affidavit is sworn by definition, so the
                              // attestation question cannot start at "no".
                              setNotary(option.value === "affidavit" ? "stamp-paper" : "none");
                            }}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 transition-all duration-200",
                              isActive
                                ? "border-brand-600 bg-brand-50/70 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                                : "border-line bg-white hover:border-navy-300 hover:bg-navy-50/60",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-8 place-items-center rounded-lg transition-colors",
                                isActive ? "bg-brand-600 text-white" : "bg-navy-100 text-navy-500",
                              )}
                            >
                              <option.icon className="size-4" />
                            </span>
                            <span
                              className={cn(
                                "text-[12.5px] leading-tight font-semibold",
                                isActive ? "text-brand-800" : "text-navy-700",
                              )}
                            >
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" name="need" value={need} />
                  </div>

                  {!showDrafter ? (
                    <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your name" required>
                      {(id) => (
                        <Input id={id} name="name" required autoComplete="name" placeholder="Lakshmi Narayanan" />
                      )}
                    </Field>
                    <Field label="Mobile number" required error={error}>
                      {(id) => (
                        <Input
                          id={id}
                          name="phone"
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          prefix="+91"
                          placeholder="98400 00000"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                            setError("");
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  <Field label="Email address" hint="Optional">
                    {(id) => (
                      <Input
                        id={id}
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                      />
                    )}
                  </Field>
                    </>
                  ) : null}

                  {showDrafter ? (
                    <>
                      <div>
                        <p className="mb-1.5 text-[13.5px] font-semibold text-navy-800">
                          Which agreement?
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {AGREEMENT_TYPES.map((option) => {
                            const isActive = option.id === draftType;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => setDraftType(option.id as AgreementType)}
                                className={cn(
                                  "rounded-xl border px-3.5 py-3 text-left transition-all duration-200",
                                  isActive
                                    ? "border-brand-600 bg-brand-50/70 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                                    : "border-line bg-white hover:border-navy-300 hover:bg-navy-50/60",
                                )}
                              >
                                <span
                                  className={cn(
                                    "block text-[13.5px] font-bold",
                                    isActive ? "text-brand-800" : "text-navy-950",
                                  )}
                                >
                                  {option.short}
                                </span>
                                <span className="mt-0.5 line-clamp-3 block text-[11.5px] leading-snug text-navy-500">
                                  {option.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="xl"
                        fullWidth
                        className="group"
                        onClick={() => setDrafting(draftType)}
                      >
                        Draft it here, now
                        <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>

                      <div className="flex items-start gap-2 rounded-xl border border-line bg-canvas p-3.5">
                        <Clock3 className="mt-0.5 size-4 shrink-0 text-navy-400" />
                        <p className="text-[12.5px] leading-relaxed text-navy-500">
                          {need === "both"
                            ? "Takes about ten minutes. The non-judicial stamp paper comes with it — we work out the duty from your answers and supply the paper the agreement is printed on. "
                            : "Takes about ten minutes and saves as you go. "}
                          <button
                            type="button"
                            onClick={() => setWantsCallback(true)}
                            className="font-semibold text-brand-700 underline underline-offset-2"
                          >
                            Rather we did it for you?
                          </button>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {buyingPaper ? (
                      <Field
                        label="Denomination needed"
                        required
                        help={
                          need === "affidavit"
                            ? "₹100 is the smallest sheet we carry, and it is what most affidavits are sworn on."
                            : undefined
                        }
                      >
                        {(id) => (
                          <Select
                            id={id}
                            name="denomination"
                            defaultValue="100"
                            required
                          >
                            {DENOMINATIONS.map((d) => (
                              <option key={d.label} value={d.value || "custom"}>
                                {d.value
                                  ? `${d.label} non-judicial stamp paper — delivered`
                                  : "Any value — e-Stamp, emailed"}
                              </option>
                            ))}
                            <option value="not-sure">I&apos;m not sure — advise me</option>
                          </Select>
                        )}
                      </Field>
                    ) : (
                      <Field label="Agreement needed" required>
                        {(id) => (
                          <Select id={id} name="agreementType" defaultValue="residential" required>
                            {AGREEMENT_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.short}
                              </option>
                            ))}
                            <option value="not-sure">I&apos;m not sure — advise me</option>
                          </Select>
                        )}
                      </Field>
                    )}
                    <Field
                      label={need === "agreement" ? "Property is in" : "Deliver to"}
                      required
                    >
                      {(id) => (
                        <Select id={id} name="city" defaultValue="Chennai" required>
                          {CITIES.map((city) => (
                            <option key={city.slug} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                          <option value="other">Elsewhere in Tamil Nadu</option>
                        </Select>
                      )}
                    </Field>
                  </div>

                  {buyingPaper ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Notary signature"
                        required={need === "affidavit"}
                        help={
                          need === "affidavit"
                            ? "An affidavit has to be sworn before a notary to count, so pick where the signature goes."
                            : undefined
                        }
                      >
                        {(id) => (
                          <Select
                            id={id}
                            value={notary}
                            onChange={(e) => setNotary(e.target.value as NotaryChoice)}
                          >
                            {NOTARY_CHOICES.filter(
                              // Nothing to decline on an affidavit — it is sworn or it
                              // is not an affidavit.
                              (c) => !(need === "affidavit" && c.value === "none"),
                            ).map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label} — {c.hint}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>

                      <Field
                        label="Date wanted on the paper"
                        hint="Optional"
                        help="Leave blank and we will use the day it is issued."
                      >
                        {(id) => (
                          <Input
                            id={id}
                            type="date"
                            value={stampDate}
                            onChange={(e) => setStampDate(e.target.value)}
                          />
                        )}
                      </Field>
                    </div>
                  ) : null}

                  <Field label="Anything we should know?" hint="Optional">
                    {(id) => (
                      <Textarea
                        id={id}
                        name="message"
                        rows={3}
                        className="min-h-[88px]"
                        placeholder={
                          need === "stamp-paper"
                            ? "e.g. Two sheets of ₹100, deliver to Anna Nagar by tomorrow evening"
                            : "e.g. 2BHK in Adyar, ₹28,000 rent, tenant moving in next month"
                        }
                      />
                    )}
                  </Field>

                  <Button type="submit" size="xl" fullWidth disabled={sending} className="group">
                    {sending ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send my request
                        <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <p className="flex items-start gap-2 text-[12px] leading-relaxed text-navy-400">
                    <Lock className="mt-0.5 size-3.5 shrink-0" />
                    By submitting you agree that we may contact you about your enquiry. We never
                    sell your details and you can ask us to delete them at any time.
                  </p>
                    </>
                  )}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
