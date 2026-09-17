import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calculator,
  FileCheck2,
  Home,
  Info,
  Landmark,
  Percent,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { calculateStampDuty, splitGovernmentAndService } from "@/lib/stamp-duty";
import { CITIES } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Field, Input, Label, OptionCards, Select, Toggle } from "@/components/ui/field";
import { cn, inr } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

export function StampDutyCalculator() {
  const [rent, setRent] = useState("25000");
  const [deposit, setDeposit] = useState("125000");
  const [months, setMonths] = useState(11);
  const [plan, setPlan] = useState<PlanId>("standard");
  const [registerAnyway, setRegisterAnyway] = useState(false);
  const [lawyerReview, setLawyerReview] = useState(false);
  const [city, setCity] = useState("Chennai");
  const [kind, setKind] = useState<"residential" | "commercial">("residential");

  const b = useMemo(
    () =>
      calculateStampDuty({
        monthlyRent: parseFloat(rent || "0"),
        securityDeposit: parseFloat(deposit || "0"),
        durationMonths: months,
        plan,
        registerAnyway,
        lawyerReview,
      }),
    [rent, deposit, months, plan, registerAnyway, lawyerReview],
  );
  const split = splitGovernmentAndService(b);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {/* ── Inputs ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-[18px] font-bold text-navy-950">
          <Calculator className="size-5 text-brand-600" />
          Your agreement
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <Label>Type of property</Label>
            <OptionCards
              name="Property type"
              value={kind}
              onChange={setKind}
              options={[
                { value: "residential" as const, label: "Residential", desc: "Flat, house, villa", icon: Home },
                { value: "commercial" as const, label: "Commercial", desc: "Office, shop, godown", icon: Building2 },
              ]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Monthly rent" required>
              {(id) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  value={rent}
                  onChange={(e) => setRent(e.target.value.replace(/\D/g, ""))}
                  prefix="₹"
                  placeholder="25000"
                />
              )}
            </Field>
            <Field label="Security deposit / advance" required>
              {(id) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value.replace(/\D/g, ""))}
                  prefix="₹"
                  placeholder="125000"
                />
              )}
            </Field>
          </div>

          <div>
            <Label hint="Registration becomes compulsory at 12">Duration of the agreement</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[6, 11, 12, 24, 36, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={cn(
                    "tnum rounded-lg border px-2 py-2.5 text-[13px] font-semibold transition-all",
                    months === m
                      ? "border-brand-600 bg-brand-600 text-white shadow-[0_4px_12px_-4px_rgb(37_99_235/0.5)]"
                      : "border-line bg-white text-navy-600 hover:border-navy-300",
                  )}
                >
                  {m} mo
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-navy-500">
              {months >= 12
                ? "12 months or more — registration at the Sub-Registrar Office is compulsory under Section 17 of the Registration Act, 1908."
                : "Under 12 months — stamp paper only, no registration needed. This is why the 11-month agreement is standard in Tamil Nadu."}
            </p>
          </div>

          <Field label="District" help="Rates are uniform across Tamil Nadu; this sets your Sub-Registrar Office.">
            {(id) => (
              <Select id={id} value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <div>
            <Label>Plan</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["basic", "standard", "premium"] as PlanId[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-[13px] font-semibold capitalize transition-all",
                    plan === p
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line bg-white text-navy-600 hover:border-navy-300",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {months < 12 ? (
              <Toggle
                label="Register it anyway"
                desc="Not required for 11 months, but registration gives the strongest evidentiary position in a dispute."
                checked={registerAnyway}
                onChange={setRegisterAnyway}
              />
            ) : null}
            {plan !== "premium" ? (
              <Toggle
                label="Add notary attestation — ₹350"
                desc="A notary public attests the signatures on the agreement."
                checked={lawyerReview}
                onChange={setLawyerReview}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Result ─────────────────────────────────────────── */}
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="border-b border-line bg-navy-50 px-6 py-4">
            <h2 className="flex items-center gap-2.5 font-display text-[16px] font-bold text-navy-950">
              <Receipt className="size-4.5 text-navy-500" />
              How the duty is calculated
            </h2>
          </div>

          {/* Working */}
          <div className="border-b border-line bg-brand-50/40 px-6 py-5">
            <dl className="space-y-2 text-[13.5px]">
              <div className="flex items-center justify-between">
                <dt className="text-navy-600">
                  Rent over the term
                  <span className="ml-1.5 text-[12px] text-navy-400">
                    {inr(parseFloat(rent || "0"))} × {months}
                  </span>
                </dt>
                <dd className="tnum font-semibold text-navy-900">{inr(b.totalRentOverTerm)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-navy-600">Add: refundable deposit</dt>
                <dd className="tnum font-semibold text-navy-900">+ {inr(b.refundableDeposit)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-brand-200 pt-2">
                <dt className="font-semibold text-navy-800">Chargeable value</dt>
                <dd className="tnum font-bold text-brand-800">{inr(b.chargeableValue)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-navy-600">
                  <Percent className="size-3.5" />
                  Duty at 1% of that
                </dt>
                <motion.dd
                  key={b.stampDuty}
                  initial={{ opacity: 0.4, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="tnum text-[16px] font-bold text-brand-700"
                >
                  {inr(b.stampDuty)}
                </motion.dd>
              </div>
            </dl>
          </div>

          {/* Line items */}
          <dl className="divide-y divide-line">
            <div className="px-6 py-4">
              <p className="mb-3 flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                <Landmark className="size-3.5" />
                Payable to the Government of Tamil Nadu
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[14px]">
                  <dt className="text-navy-600">Stamp duty</dt>
                  <dd className="tnum font-semibold text-navy-950">{inr(b.stampDuty)}</dd>
                </div>
                {b.registrationRequired ? (
                  <div className="flex items-center justify-between text-[14px]">
                    <dt className="text-navy-600">Registration fee (1%)</dt>
                    <dd className="tnum font-semibold text-navy-950">{inr(b.registrationFee)}</dd>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[14px]">
                    <dt className="text-navy-400">Registration fee</dt>
                    <dd className="text-[13px] font-medium text-emerald-600">Not applicable</dd>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4">
              <p className="mb-3 text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                Payable to LP Stamp Paper
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[14px]">
                  <dt className="text-navy-600 capitalize">{plan} plan</dt>
                  <dd className="tnum font-semibold text-navy-950">{inr(b.platformFee)}</dd>
                </div>
                {b.lawyerFee > 0 ? (
                  <div className="flex items-center justify-between text-[14px]">
                    <dt className="text-navy-600">Notary attestation</dt>
                    <dd className="tnum font-semibold text-navy-950">{inr(b.lawyerFee)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-[14px]">
                  <dt className="text-navy-600">GST at 18% on our fee</dt>
                  <dd className="tnum font-semibold text-navy-950">{inr(b.gst)}</dd>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-navy-950 px-6 py-5">
              <div>
                <dt className="text-[13.5px] font-semibold text-white/70">Total you pay</dt>
                <p className="mt-0.5 text-[11.5px] text-white/40">
                  {inr(split.government)} government · {inr(split.service)} us
                </p>
              </div>
              <motion.dd
                key={b.total}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="tnum font-display text-[30px] leading-none font-bold text-white"
              >
                {inr(b.total)}
              </motion.dd>
            </div>
          </dl>

          <div className="px-6 py-5">
            <ButtonLink href={`/create?plan=${plan}`} size="lg" fullWidth className="group">
              Create this agreement
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-navy-950">
            <Info className="size-4 text-brand-600" />
            What these numbers mean
          </h3>
          <ul className="mt-3 space-y-2.5">
            {b.notes.map((note) => (
              <li key={note} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy-600">
                <FileCheck2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {note}
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy-600">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              Your Sub-Registrar Office would be in{" "}
              <span className="font-semibold text-navy-900">{city}</span>
              {CITIES.find((c) => c.name === city)?.sro
                ? ` — ${CITIES.find((c) => c.name === city)?.sro}.`
                : "."}
            </li>
          </ul>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Badge tone="amber" className="mt-0.5 shrink-0">
              Note
            </Badge>
            <p className="text-[12.5px] leading-relaxed text-amber-900">
              These are the published Tamil Nadu rates for a lease of under 30 years. The figure
              finally debited by the Registration Department at the moment of stamping is the
              authoritative one. If it differs by even a rupee, we refund the difference — we
              never keep a surplus on a government charge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
