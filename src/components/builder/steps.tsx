import { useState } from "react";
import {
  AlertCircle,
  Building,
  Building2,
  Check,
  Home,
  Landmark,
  Lock,
  Plus,
  Store,
  Trash2,
  TreePine,
  Warehouse,
  X,
} from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { CurrentTemplate } from "./current-template";
import { TamilInput, TamilTextarea } from "@/components/ui/tamil-input";
import { specFor } from "@/lib/clauses";
import { ClauseEditor } from "./clause-editor";
import { CITIES, EXTRA_DISTRICTS } from "@/lib/site";
import { checkPincode, districtFromPincode } from "@/lib/pincode";
import { Button } from "@/components/ui/button";
import {
  ChipGroup,
  Field,
  Input,
  Label,
  OptionCards,
  Select,
  Textarea,
  Toggle,
} from "@/components/ui/field";
import type { FurnishingLevel, PropertyKind, Relation } from "@/lib/types";
import { inr } from "@/lib/utils";

const ALL_LOCATIONS = [...CITIES.map((c) => c.name), ...EXTRA_DISTRICTS].sort();

const AMENITIES = [
  "Lift",
  "Power backup",
  "24×7 water supply",
  "Security / CCTV",
  "Borewell",
  "Solar water heater",
  "Modular kitchen",
  "Wardrobes",
  "Air conditioning",
  "Piped gas",
  "Gym",
  "Swimming pool",
  "Children's play area",
  "Clubhouse",
];

export function StepIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-7">
      <h2 className="font-display text-[22px] font-bold tracking-tight text-navy-950">
        {title}
      </h2>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-navy-500">{body}</p>
    </div>
  );
}

/* ══════════════════════════ 1. Property ══════════════════════════ */

export function PropertyStep() {
  const { draft, update } = useAgreement();
  // A Tamil deed carries the address in Tamil, so these accept romanised typing.
  const tamil = specFor(draft).language === "ta";
  const p = draft.property;
  const commercial = draft.type === "commercial";

  // Nothing is said while the number is still being typed — only once it is
  // six digits long, or once they have moved on and left it wrong.
  const [pinTouched, setPinTouched] = useState(false);
  const pin = checkPincode(p.pincode, p.district);
  const showPin =
    pin.status !== "empty" && pin.status !== "ok" && (pinTouched || p.pincode.length === 6);

  const kinds: Array<{ value: PropertyKind; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> =
    commercial
      ? [
          { value: "office", label: "Office", desc: "Cabins, floors, coworking", icon: Building2 },
          { value: "shop", label: "Shop or showroom", desc: "Street-facing retail", icon: Store },
          { value: "warehouse", label: "Warehouse", desc: "Godown, storage, industrial", icon: Warehouse },
          { value: "land", label: "Open land", desc: "Yard, plot, parking lot", icon: TreePine },
        ]
      : [
          { value: "apartment", label: "Apartment / flat", desc: "In a gated or standalone block", icon: Building },
          { value: "independent-house", label: "Independent house", desc: "Standalone, own compound", icon: Home },
          { value: "villa", label: "Villa", desc: "Gated community villa", icon: Landmark },
          { value: "office", label: "Something else", desc: "Portion, outhouse, studio", icon: Building2 },
        ];

  return (
    <>
      <CurrentTemplate />

      <StepIntro
        title="Where is the property?"
        body="This tells us which Sub-Registrar has jurisdiction and which local rules to apply. Everything here goes into Schedule A of the agreement."
      />

      <div className="space-y-6">
        <div>
          <Label>Type of property</Label>
          <OptionCards
            name="Property type"
            value={p.kind}
            onChange={(kind) => update({ property: { kind } })}
            options={kinds}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Door / flat number" required>
            {(id) => (
              <Input
                id={id}
                value={p.doorNo}
                onChange={(e) => update({ property: { doorNo: e.target.value } })}
                placeholder="e.g. 3B"
              />
            )}
          </Field>
          <Field label="Building / apartment name">
            {(id) => (
              <TamilInput
                id={id}
                value={p.buildingName}
                onChange={(buildingName) => update({ property: { buildingName } })}
                placeholder="e.g. Sriram Samruddhi"
                tamil={tamil}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Street" required>
            {(id) => (
              <TamilInput
                id={id}
                value={p.street}
                onChange={(street) => update({ property: { street } })}
                placeholder="e.g. 2nd Cross Street"
                tamil={tamil}
              />
            )}
          </Field>
          <Field label="Locality / area" required>
            {(id) => (
              <TamilInput
                id={id}
                value={p.locality}
                onChange={(locality) => update({ property: { locality } })}
                placeholder="e.g. Adyar"
                tamil={tamil}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City / town" required>
            {(id) => (
              <Select
                id={id}
                value={p.city}
                onChange={(e) => {
                  const city = e.target.value;
                  const known = CITIES.find((c) => c.name === city);
                  update({ property: { city, district: known?.district ?? city } });
                }}
              >
                <option value="">Select a city</option>
                {ALL_LOCATIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="District" help="Sets the court of jurisdiction.">
            {(id) => (
              <Input
                id={id}
                value={p.district}
                onChange={(e) => update({ property: { district: e.target.value } })}
                placeholder="e.g. Chennai"
              />
            )}
          </Field>
          <Field
            label="PIN code"
            required
            error={showPin ? pin.message : undefined}
            help={
              !showPin && pin.status === "ok" && pin.districts?.length === 1
                ? `${pin.districts[0]} district.`
                : undefined
            }
          >
            {(id) => (
              <Input
                id={id}
                inputMode="numeric"
                maxLength={6}
                value={p.pincode}
                aria-invalid={showPin || undefined}
                onBlur={() => setPinTouched(true)}
                onChange={(e) => {
                  const pincode = e.target.value.replace(/\D/g, "").slice(0, 6);
                  // Filling the district from the PIN removes the commonest
                  // mismatch instead of only complaining about it afterwards.
                  const derived = districtFromPincode(pincode);
                  update({
                    property: {
                      pincode,
                      ...(derived && !p.district.trim() ? { district: derived } : {}),
                    },
                  });
                  if (pincode.length < 6) setPinTouched(false);
                }}
                placeholder="600020"
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Built-up area" hint="sq ft">
            {(id) => (
              <Input
                id={id}
                inputMode="numeric"
                value={p.builtUpArea}
                onChange={(e) => update({ property: { builtUpArea: e.target.value.replace(/\D/g, "") } })}
                placeholder="1150"
                suffix="sq ft"
              />
            )}
          </Field>
          {!commercial ? (
            <>
              <Field label="Bedrooms">
                {(id) => (
                  <Select
                    id={id}
                    value={p.bedrooms}
                    onChange={(e) => update({ property: { bedrooms: e.target.value } })}
                  >
                    {["1", "2", "3", "4", "5+"].map((n) => (
                      <option key={n} value={n}>
                        {n} BHK
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Bathrooms">
                {(id) => (
                  <Select
                    id={id}
                    value={p.bathrooms}
                    onChange={(e) => update({ property: { bathrooms: e.target.value } })}
                  >
                    {["1", "2", "3", "4+"].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </>
          ) : null}
          <Field label="Floor">
            {(id) => (
              <Input
                id={id}
                value={p.floor}
                onChange={(e) => update({ property: { floor: e.target.value } })}
                placeholder="e.g. 3rd"
              />
            )}
          </Field>
        </div>

        <Toggle
          label="Letting the whole property"
          desc="Turn this off if only a part of the building is being let — a floor, a portion, one room."
          checked={p.wholeProperty}
          onChange={(wholeProperty) => update({ property: { wholeProperty } })}
        />

        {!p.wholeProperty ? (
          <Field
            label="Which portion"
            required
            help="Goes into the Schedule word for word, so describe it as the deed should read."
          >
            {(id) => (
              <Input
                id={id}
                value={p.portionDescription}
                onChange={(e) => update({ property: { portionDescription: e.target.value } })}
                placeholder="e.g. a portion in the First Floor"
              />
            )}
          </Field>
        ) : null}

        <div>
          <Label hint="Changes which clauses appear">Furnishing</Label>
          <OptionCards
            name="Furnishing"
            columns={3}
            value={p.furnishing}
            onChange={(furnishing) => update({ property: { furnishing: furnishing as FurnishingLevel } })}
            options={[
              { value: "unfurnished" as FurnishingLevel, label: "Unfurnished", desc: "Bare shell" },
              { value: "semi-furnished" as FurnishingLevel, label: "Semi furnished", desc: "Fans, lights, wardrobes" },
              { value: "fully-furnished" as FurnishingLevel, label: "Fully furnished", desc: "Beds, sofa, appliances" },
            ]}
          />
          {p.furnishing !== "unfurnished" ? (
            <p className="mt-2.5 rounded-lg border border-brand-200 bg-brand-50/60 px-3.5 py-2.5 text-[12.5px] text-brand-800">
              An inventory clause and Schedule B have been added to your agreement. You will list
              the articles in the Clauses step.
            </p>
          ) : null}
        </div>

        <div>
          <Label hint="Optional">Amenities available to the tenant</Label>
          <ChipGroup
            values={p.amenities}
            onChange={(amenities) => update({ property: { amenities } })}
            options={AMENITIES}
          />
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════ 2 & 3. Parties ══════════════════════════ */

export function PartyStep({ which }: { which: "landlord" | "tenant" }) {
  const { draft, setParty } = useAgreement();
  const party = draft[which];
  const isLandlord = which === "landlord";
  const spec = specFor(draft);
  // A Tamil deed needs Tamil names and addresses, so the free-text fields
  // accept romanised typing and convert it.
  const tamil = spec.language === "ta";
  const label = isLandlord ? spec.roleA.toLowerCase() : spec.roleB.toLowerCase();

  return (
    <>
      <StepIntro
        title={isLandlord ? "Who owns the property?" : "Who is renting it?"}
        body={
          isLandlord
            ? "The person whose name is on the sale deed or patta. If the property is jointly owned, enter the first owner here and add the others as a special condition."
            : "The person who will occupy the property and be responsible for the rent. Their Aadhaar is used for e-signing."
        }
      />

      <div className="space-y-6">
        <div>
          <Label>Signing as</Label>
          <OptionCards
            name="Party type"
            columns={4}
            value={party.partyType}
            onChange={(partyType) => setParty(which, { partyType })}
            options={[
              { value: "individual" as const, label: "Individual" },
              { value: "company" as const, label: "Company / LLP" },
              { value: "huf" as const, label: "HUF" },
              { value: "trust" as const, label: "Trust / Society" },
            ]}
          />
        </div>

        {party.partyType !== "individual" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Registered entity name" required>
              {(id) => (
                <Input
                  id={id}
                  value={party.companyName}
                  onChange={(e) => setParty(which, { companyName: e.target.value })}
                  placeholder="e.g. Sunrise Estates Pvt Ltd"
                />
              )}
            </Field>
            <Field label="Signatory's designation" required>
              {(id) => (
                <Input
                  id={id}
                  value={party.designation}
                  onChange={(e) => setParty(which, { designation: e.target.value })}
                  placeholder="e.g. Managing Director"
                />
              )}
            </Field>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name (as on Aadhaar)" required>
            {(id) => (
              <TamilInput
                id={id}
                value={party.fullName}
                onChange={(fullName) => setParty(which, { fullName })}
                placeholder="e.g. Lakshmi Narayanan"
                tamil={tamil}
              />
            )}
          </Field>
          <Field
            label="Named in the deed as"
            required
            help="Printed as S/o, D/o, W/o or H/o before the name, the way the deed reads."
          >
            {(id) => (
              <div className="flex gap-2">
                <Select
                  aria-label="Relationship"
                  value={party.relation}
                  onChange={(e) => setParty(which, { relation: e.target.value as Relation })}
                  className="w-[104px] shrink-0"
                >
                  <option value="son">S/o</option>
                  <option value="daughter">D/o</option>
                  <option value="wife">W/o</option>
                  <option value="husband">H/o</option>
                </Select>
                <TamilInput
                  id={id}
                  value={party.parentName}
                  onChange={(parentName) => setParty(which, { parentName })}
                  placeholder="e.g. Subramanian"
                  tamil={tamil}
                  className="flex-1"
                />
              </div>
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Age" hint="years">
            {(id) => (
              <Input
                id={id}
                inputMode="numeric"
                maxLength={3}
                value={party.age}
                onChange={(e) => setParty(which, { age: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                placeholder="42"
              />
            )}
          </Field>
          <Field label="Mobile number" required help="The e-Sign OTP goes here.">
            {(id) => (
              <Input
                id={id}
                inputMode="tel"
                value={party.phone}
                onChange={(e) => setParty(which, { phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="98400 00000"
                prefix="+91"
              />
            )}
          </Field>
          <Field label="Email address" required>
            {(id) => (
              <Input
                id={id}
                type="email"
                value={party.email}
                onChange={(e) => setParty(which, { email: e.target.value })}
                placeholder="name@example.com"
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Aadhaar number"
            required
            help="Encrypted at rest. Only the last four digits ever appear on the document."
          >
            {(id) => (
              <Input
                id={id}
                inputMode="numeric"
                value={party.aadhaar}
                onChange={(e) => setParty(which, { aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                placeholder="XXXX XXXX 1234"
              />
            )}
          </Field>
          <Field label="PAN" help="Required where annual rent exceeds ₹2,40,000.">
            {(id) => (
              <Input
                id={id}
                maxLength={10}
                value={party.pan}
                onChange={(e) =>
                  setParty(which, { pan: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) })
                }
                placeholder="ABCDE1234F"
                className="uppercase"
              />
            )}
          </Field>
        </div>

        <Field
          label={`Permanent address of the ${label}`}
          required
          help={
            isLandlord
              ? "Where legal notices to the landlord should be served."
              : "The tenant's address before moving in — used for notices if they vacate."
          }
        >
          {(id) => (
            <TamilTextarea
              id={id}
              value={party.address}
              onChange={(address) => setParty(which, { address })}
              placeholder="Door no, street, locality, city, PIN"
              tamil={tamil}
            />
          )}
        </Field>
      </div>
    </>
  );
}

/* ══════════════════════════ 4. Terms ══════════════════════════ */

export function TermsStep() {
  const { draft, update } = useAgreement();
  const t = draft.terms;
  const rent = parseFloat(t.monthlyRent || "0");
  const suggestedDeposit = rent > 0 ? rent * (draft.type === "commercial" ? 6 : 5) : 0;

  return (
    <>
      <StepIntro
        title="Money and duration"
        body="The commercial heart of the agreement. Everything here also drives your stamp duty, which you can watch update in the panel beside you."
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Signed on"
            required
            help="The date on the deed. Often earlier than the day the tenancy starts."
          >
            {(id) => (
              <Input
                id={id}
                type="date"
                value={t.executionDate}
                onChange={(e) => update({ terms: { executionDate: e.target.value } })}
              />
            )}
          </Field>
          <Field label="Signed at" help="Town where it is executed. Defaults to the property's city.">
            {(id) => (
              <Input
                id={id}
                value={t.executionPlace}
                onChange={(e) => update({ terms: { executionPlace: e.target.value } })}
                placeholder={draft.property.city || "e.g. Chennai"}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tenancy starts on" required>
            {(id) => (
              <Input
                id={id}
                type="date"
                value={t.startDate}
                onChange={(e) => update({ terms: { startDate: e.target.value } })}
              />
            )}
          </Field>
          <Field
            label="Duration"
            required
            help={
              t.durationMonths >= 12
                ? "12 months or more — registration at the Sub-Registrar Office becomes compulsory."
                : "Under 12 months — no registration required, only stamp paper."
            }
          >
            {(id) => (
              <Select
                id={id}
                value={String(t.durationMonths)}
                onChange={(e) => update({ terms: { durationMonths: Number(e.target.value) } })}
              >
                {[6, 11, 12, 24, 36, 60, 120].map((m) => (
                  <option key={m} value={m}>
                    {m} months{m === 11 ? " — most common" : m >= 12 ? " (registration required)" : ""}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Monthly rent" required>
            {(id) => (
              <Input
                id={id}
                inputMode="numeric"
                value={t.monthlyRent}
                onChange={(e) => update({ terms: { monthlyRent: e.target.value.replace(/\D/g, "") } })}
                placeholder="25000"
                prefix="₹"
              />
            )}
          </Field>
          <Field
            label="Security deposit"
            required
            help={
              suggestedDeposit > 0
                ? `Customary in Tamil Nadu is ${draft.type === "commercial" ? "6" : "5"}–10 months' rent — about ${inr(suggestedDeposit)}.`
                : undefined
            }
          >
            {(id) => (
              <div className="space-y-2">
                <Input
                  id={id}
                  inputMode="numeric"
                  value={t.securityDeposit}
                  onChange={(e) => update({ terms: { securityDeposit: e.target.value.replace(/\D/g, "") } })}
                  placeholder="125000"
                  prefix="₹"
                />
                {suggestedDeposit > 0 && t.securityDeposit !== String(suggestedDeposit) ? (
                  <button
                    type="button"
                    onClick={() => update({ terms: { securityDeposit: String(suggestedDeposit) } })}
                    className="text-[12.5px] font-semibold text-brand-700 underline underline-offset-4"
                  >
                    Use {inr(suggestedDeposit)}
                  </button>
                ) : null}
              </div>
            )}
          </Field>
        </div>

        <Toggle
          label="The deposit has already been paid"
          desc="The deed then records it as received rather than payable on signing."
          checked={t.depositAlreadyPaid}
          onChange={(v) => update({ terms: { depositAlreadyPaid: v } })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Rent payable on or before">
            {(id) => (
              <Select
                id={id}
                value={t.rentDueDay}
                onChange={(e) => update({ terms: { rentDueDay: e.target.value } })}
              >
                {["1st", "5th", "7th", "10th", "15th"].map((d) => (
                  <option key={d} value={d}>
                    {d} of every month
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="How rent is paid">
            {(id) => (
              <Select
                id={id}
                value={t.paymentMode}
                onChange={(e) =>
                  update({ terms: { paymentMode: e.target.value as typeof t.paymentMode } })
                }
              >
                <option value="bank-transfer">Bank transfer (NEFT / IMPS)</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
                <option value="cash">Cash</option>
              </Select>
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Rent escalation on renewal" hint="%">
            {(id) => (
              <Input
                id={id}
                inputMode="numeric"
                value={t.escalationPercent}
                onChange={(e) => update({ terms: { escalationPercent: e.target.value.replace(/\D/g, "") } })}
                placeholder="5"
                suffix="%"
              />
            )}
          </Field>
          <Field label="Notice period" hint="months">
            {(id) => (
              <Select
                id={id}
                value={t.noticePeriodMonths}
                onChange={(e) => update({ terms: { noticePeriodMonths: e.target.value } })}
              >
                {["1", "2", "3"].map((m) => (
                  <option key={m} value={m}>
                    {m} month{m === "1" ? "" : "s"}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field
            label="Evict after rent unpaid for"
            hint="months"
            help="Continuous default that lets the landlord end the tenancy."
          >
            {(id) => (
              <Select
                id={id}
                value={t.defaultMonths}
                onChange={(e) => update({ terms: { defaultMonths: e.target.value } })}
              >
                {["1", "2", "3"].map((m) => (
                  <option key={m} value={m}>
                    {m} month{m === "1" ? "" : "s"}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Lock-in period" hint="months" help="0 means either side can leave on notice.">
            {(id) => (
              <Select
                id={id}
                value={t.lockInMonths}
                onChange={(e) => update({ terms: { lockInMonths: e.target.value } })}
              >
                {["0", "3", "6", "11", "12", "24"].map((m) => (
                  <option key={m} value={m}>
                    {m === "0" ? "No lock-in" : `${m} months`}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <div className="rounded-2xl border border-line bg-navy-50/50 p-5">
          <h3 className="text-[14px] font-bold text-navy-950">Who pays what</h3>
          <p className="mt-1 text-[13px] text-navy-500">
            Getting this in writing prevents the most common rental dispute in Tamil Nadu.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <Label>Association / maintenance charges</Label>
              <OptionCards
                name="Maintenance"
                columns={3}
                value={t.maintenanceBorneBy}
                onChange={(maintenanceBorneBy) => update({ terms: { maintenanceBorneBy } })}
                options={[
                  { value: "tenant" as const, label: "Tenant pays", desc: "Extra, over the rent" },
                  { value: "landlord" as const, label: "Landlord pays", desc: "Tenant not liable" },
                  { value: "included" as const, label: "Included in rent", desc: "No separate charge" },
                ]}
              />
              {t.maintenanceBorneBy === "tenant" ? (
                <div className="mt-3 max-w-xs">
                  <Field label="Monthly maintenance amount">
                    {(id) => (
                      <Input
                        id={id}
                        inputMode="numeric"
                        value={t.maintenanceAmount}
                        onChange={(e) =>
                          update({ terms: { maintenanceAmount: e.target.value.replace(/\D/g, "") } })
                        }
                        placeholder="3000"
                        prefix="₹"
                      />
                    )}
                  </Field>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Electricity">
                {(id) => (
                  <Select
                    id={id}
                    value={t.electricityBorneBy}
                    onChange={(e) =>
                      update({ terms: { electricityBorneBy: e.target.value as "tenant" | "landlord" } })
                    }
                  >
                    <option value="tenant">Tenant pays</option>
                    <option value="landlord">Landlord pays</option>
                  </Select>
                )}
              </Field>
              <Field label="Water">
                {(id) => (
                  <Select
                    id={id}
                    value={t.waterBorneBy}
                    onChange={(e) =>
                      update({ terms: { waterBorneBy: e.target.value as "tenant" | "landlord" } })
                    }
                  >
                    <option value="tenant">Tenant pays</option>
                    <option value="landlord">Landlord pays</option>
                  </Select>
                )}
              </Field>
              <Field label="Property tax">
                {(id) => (
                  <Select
                    id={id}
                    value={t.propertyTaxBorneBy}
                    onChange={(e) =>
                      update({ terms: { propertyTaxBorneBy: e.target.value as "tenant" | "landlord" } })
                    }
                  >
                    <option value="landlord">Landlord pays</option>
                    <option value="tenant">Tenant pays</option>
                  </Select>
                )}
              </Field>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════ 5. Clauses ══════════════════════════ */

export function ClausesStep() {
  const {
    draft,
    update,
    addFurniture,
    updateFurniture,
    removeFurniture,
    addCustomClause,
    removeCustomClause,
  } = useAgreement();
  const o = draft.options;
  const [customText, setCustomText] = useState("");

  return (
    <>
      <StepIntro
        title="Rules for living there"
        body="Each switch adds or removes a real clause. Watch the document beside you change as you decide."
      />

      <div className="space-y-6">
        <div className="space-y-2.5">
          <Toggle
            label="Parking slot included"
            desc="Allots a dedicated slot to the tenant at no extra charge."
            checked={o.parkingIncluded}
            onChange={(parkingIncluded) => update({ options: { parkingIncluded } })}
          />
          {o.parkingIncluded ? (
            <div className="ml-4 grid gap-4 border-l-2 border-brand-200 pl-5 sm:grid-cols-2">
              <Field label="Vehicle type">
                {(id) => (
                  <Select
                    id={id}
                    value={o.parkingType}
                    onChange={(e) =>
                      update({ options: { parkingType: e.target.value as typeof o.parkingType } })
                    }
                  >
                    <option value="two-wheeler">Two-wheeler</option>
                    <option value="four-wheeler">Four-wheeler</option>
                    <option value="both">Both</option>
                  </Select>
                )}
              </Field>
              <Field label="Number of slots">
                {(id) => (
                  <Select
                    id={id}
                    value={o.parkingSlots}
                    onChange={(e) => update({ options: { parkingSlots: e.target.value } })}
                  >
                    {["1", "2", "3"].map((n) => (
                      <option key={n} value={n}>
                        {n} slot{n === "1" ? "" : "s"}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
          ) : null}

          <Toggle
            label="Pets allowed"
            desc="Permits domestic pets subject to association bye-laws and municipal rules."
            checked={o.petsAllowed}
            onChange={(petsAllowed) => update({ options: { petsAllowed } })}
          />
          <Toggle
            label="Subletting allowed with consent"
            desc="Off by default — most landlords in Tamil Nadu prohibit it outright."
            checked={o.sublettingAllowed}
            onChange={(sublettingAllowed) => update({ options: { sublettingAllowed } })}
          />
          <Toggle
            label="Interior alterations allowed"
            desc="Lets the tenant do non-structural fit-out work with written consent."
            checked={o.alterationsAllowed}
            onChange={(alterationsAllowed) => update({ options: { alterationsAllowed } })}
          />
          <Toggle
            label="No nails in the walls"
            desc="If nails are driven, the walls are cemented and the premises repainted before handover."
            checked={o.noWallDamage}
            onChange={(noWallDamage) => update({ options: { noWallDamage } })}
          />
          <Toggle
            label="No illegal or anti-social use, and no liquor"
            desc="Standard in Tamil Nadu residential agreements."
            checked={o.noLiquorOrIllegalUse}
            onChange={(noLiquorOrIllegalUse) => update({ options: { noLiquorOrIllegalUse } })}
          />
          <Toggle
            label="Commercial use permitted"
            desc="Adds trade licence, GST and business-use obligations."
            checked={o.commercialUseAllowed}
            onChange={(commercialUseAllowed) => update({ options: { commercialUseAllowed } })}
            disabled={draft.type === "commercial"}
          />
          {o.commercialUseAllowed ? (
            <div className="ml-4 border-l-2 border-brand-200 pl-5">
              <Field label="Nature of business" help="Named in the agreement — the premises can be used for this and nothing else.">
                {(id) => (
                  <Input
                    id={id}
                    value={o.businessNature}
                    onChange={(e) => update({ options: { businessNature: e.target.value } })}
                    placeholder="e.g. a readymade garments retail showroom"
                  />
                )}
              </Field>
            </div>
          ) : null}
          <Toggle
            label="Two witnesses will sign"
            desc="Recommended. Adds a witness block to the execution page."
            checked={o.witnessRequired}
            onChange={(witnessRequired) => update({ options: { witnessRequired } })}
          />
          <Toggle
            label="Register at the Sub-Registrar Office"
            desc={
              draft.terms.durationMonths >= 12
                ? "Compulsory for your 12-month-plus term — this cannot be turned off."
                : "Optional for an 11-month term. Adds a 1% registration fee but gives the strongest evidentiary position."
            }
            checked={o.registrationRequired || draft.terms.durationMonths >= 12}
            onChange={(registrationRequired) => update({ options: { registrationRequired } })}
            disabled={draft.terms.durationMonths >= 12}
          />
        </div>

        {/* Furniture inventory */}
        {draft.property.furnishing !== "unfurnished" ? (
          <div className="rounded-2xl border border-line bg-navy-50/50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[14px] font-bold text-navy-950">
                  Inventory of fixtures and fittings
                </h3>
                <p className="mt-1 text-[13px] text-navy-500">
                  Because the property is {draft.property.furnishing.replace("-", " ")}, this list
                  becomes Schedule B. It is what protects the deposit at handover.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={addFurniture} className="shrink-0">
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            {draft.furniture.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-navy-300 bg-white px-4 py-6 text-center text-[13px] text-navy-400">
                No articles listed yet. Add beds, sofas, ACs, geysers, wardrobes — anything you
                want returned in the same condition.
              </p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {draft.furniture.map((item) => (
                  <div key={item.id} className="flex gap-2.5">
                    <Input
                      value={item.name}
                      onChange={(e) => updateFurniture(item.id, { name: e.target.value })}
                      placeholder="e.g. Split air conditioner, 1.5 ton"
                      className="flex-1"
                    />
                    <Input
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) =>
                        updateFurniture(item.id, { quantity: e.target.value.replace(/\D/g, "") })
                      }
                      className="w-16 text-center"
                    />
                    <Select
                      value={item.condition}
                      onChange={(e) =>
                        updateFurniture(item.id, {
                          condition: e.target.value as "new" | "good" | "fair",
                        })
                      }
                      className="w-28"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </Select>
                    <button
                      type="button"
                      onClick={() => removeFurniture(item.id)}
                      aria-label={`Remove ${item.name || "item"}`}
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white text-navy-400 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <ClauseEditor />

        {/* Custom clauses */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-[14px] font-bold text-navy-950">Your own conditions</h3>
          <p className="mt-1 text-[13px] text-navy-500">
            Anything the switches above don&apos;t cover. Write it in ordinary English — no
            &ldquo;hereinafter&rdquo; required. It becomes a numbered special condition.
          </p>

          {o.customClauses.length ? (
            <ul className="mt-4 space-y-2">
              {o.customClauses.map((clause, i) => (
                <li
                  key={`${clause}-${i}`}
                  className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-3.5"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-[13.5px] leading-relaxed text-navy-700">{clause}</p>
                  <button
                    type="button"
                    onClick={() => removeCustomClause(i)}
                    aria-label="Remove this condition"
                    className="shrink-0 rounded-lg p-1 text-navy-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 flex gap-2.5">
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. The landlord will service the water heater once every six months at his own cost."
              className="min-h-[76px] flex-1"
            />
            <Button
              variant="secondary"
              onClick={() => {
                if (!customText.trim()) return;
                addCustomClause(customText.trim());
                setCustomText("");
              }}
              className="h-[76px] shrink-0"
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
          <Lock className="mt-0.5 size-4 shrink-0 text-brand-700" />
          <p className="text-[13px] leading-relaxed text-brand-900">
            Every clause you see is drafted against the Tamil Nadu Regulation of Rights and
            Responsibilities of Landlords and Tenants Act, 2017. We go through them with you on
            the confirming call.
          </p>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════ helpers ══════════════════════════ */

export function ChecklistRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-[13.5px]">
      <span
        className={
          ok
            ? "grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"
            : "grid size-5 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600"
        }
      >
        {ok ? <Check className="size-3" strokeWidth={3.5} /> : <AlertCircle className="size-3" />}
      </span>
      <span className={ok ? "text-navy-600" : "font-medium text-navy-900"}>{label}</span>
    </li>
  );
}
