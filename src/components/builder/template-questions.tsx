import { useAgreement } from "@/lib/agreement-store";
import { specFor } from "@/lib/clauses";
import { fieldsForTemplate, type TemplateField } from "@/lib/template-fields";
import { Field, Input, Select } from "@/components/ui/field";
import { TamilInput, TamilTextarea } from "@/components/ui/tamil-input";
import { CITIES, EXTRA_DISTRICTS } from "@/lib/site";
import { districtFromPincode } from "@/lib/pincode";
import { inr } from "@/lib/utils";
import { StepIntro } from "./steps";
import { CurrentTemplate } from "./current-template";

/**
 * The questions this particular deed needs, and no others.
 *
 * A loan deed asks for two names, two Aadhaar numbers and a date. A house rent
 * asks for those plus the property, the rent, the advance and the term. The
 * difference comes from the document itself — see template-fields.ts — so a
 * customer drafting a no-objection certificate is never asked what the monthly
 * rent is.
 */

const ALL_LOCATIONS = [...CITIES.map((c) => c.name), ...EXTRA_DISTRICTS].sort();

function value(draft: Record<string, unknown>, path: string): string {
  return path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], draft) as string;
}

/** Turns "landlord.fullName" into the nested patch the store expects. */
function patch(path: string, next: string) {
  const parts = path.split(".");
  return parts.reduceRight<unknown>((acc, key, i) => (i === parts.length - 1 ? { [key]: next } : { [key]: acc }), {});
}

function One({ field, tamil }: { field: TemplateField; tamil: boolean }) {
  const { draft, update } = useAgreement();
  const current = value(draft as unknown as Record<string, unknown>, field.path) ?? "";
  const set = (next: string) => update(patch(field.path, next) as never);

  if (field.kind === "propertyAddress") return <PropertyAddress />;

  return (
    <Field
      label={field.label}
      hint={field.hint}
      help={field.kind === "money" && Number(current) > 0 ? inr(Number(current)) : undefined}
      required
    >
      {(id) => {
        switch (field.kind) {
          case "tamilArea":
            return (
              <TamilTextarea id={id} value={current} onChange={set} tamil={tamil} placeholder="Door no, street, locality, town, PIN" />
            );
          case "tamilText":
            return <TamilInput id={id} value={current} onChange={set} tamil={tamil} />;
          case "aadhaar":
            return (
              <Input
                id={id}
                value={current}
                onChange={(e) => set(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="12 digits"
                inputMode="numeric"
              />
            );
          case "date":
            return <Input id={id} type="date" value={current} onChange={(e) => set(e.target.value)} />;
          case "money":
            return (
              <Input
                id={id}
                prefix="₹"
                value={current}
                onChange={(e) => set(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
              />
            );
          case "number":
            return (
              <Input
                id={id}
                value={current}
                onChange={(e) => set(e.target.value.replace(/[^\d]/g, "").slice(0, 3))}
                inputMode="numeric"
              />
            );
          default:
            return <Input id={id} value={current} onChange={(e) => set(e.target.value)} />;
        }
      }}
    </Field>
  );
}

/** The property, asked for in parts because the deed prints it in parts. */
function PropertyAddress() {
  const { draft, update } = useAgreement();
  const p = draft.property;
  const tamil = specFor(draft).language === "ta";
  const set = (patchIn: Partial<typeof p>) => update({ property: patchIn });

  return (
    <div className="rounded-2xl border border-line bg-canvas p-5">
      <h3 className="text-[14px] font-bold text-navy-950">The property</h3>
      <p className="mt-1 text-[13px] text-navy-500">
        As it should read in the deed — this is what goes into the schedule.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Door / flat number" required>
          {(id) => (
            <Input id={id} value={p.doorNo} onChange={(e) => set({ doorNo: e.target.value })} placeholder="e.g. 1/33" />
          )}
        </Field>
        <Field label="Building name">
          {(id) => (
            <TamilInput id={id} value={p.buildingName} onChange={(buildingName) => set({ buildingName })} tamil={tamil} />
          )}
        </Field>
        <Field label="Street" required>
          {(id) => <TamilInput id={id} value={p.street} onChange={(street) => set({ street })} tamil={tamil} />}
        </Field>
        <Field label="Locality / area" required>
          {(id) => <TamilInput id={id} value={p.locality} onChange={(locality) => set({ locality })} tamil={tamil} />}
        </Field>
        <Field label="Town / district" required>
          {(id) => (
            <Select
              id={id}
              value={p.city}
              onChange={(e) => set({ city: e.target.value, district: e.target.value })}
            >
              <option value="">Select</option>
              {ALL_LOCATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="PIN code" required>
          {(id) => (
            <Input
              id={id}
              value={p.pincode}
              inputMode="numeric"
              onChange={(e) => {
                const pincode = e.target.value.replace(/\D/g, "").slice(0, 6);
                const guessed = pincode.length === 6 ? districtFromPincode(pincode) : null;
                set(guessed && !p.city ? { pincode, city: guessed, district: guessed } : { pincode });
              }}
              placeholder="600037"
            />
          )}
        </Field>
      </div>
    </div>
  );
}

export function TemplateQuestionsStep({ which }: { which: "parties" | "details" }) {
  const { draft } = useAgreement();
  const spec = specFor(draft);
  const tamil = spec.language === "ta";
  const fields = fieldsForTemplate(spec);

  if (which === "parties") {
    const a = fields.filter((f) => f.party === "A");
    const b = fields.filter((f) => f.party === "B");
    return (
      <>
        <CurrentTemplate />
        <div className="mt-8">
          <StepIntro
            title="Who is signing?"
            body={`This deed names ${b.length ? "two sides" : "one person"}. Only what ${
              spec.deedTitle
            } actually prints is asked for here.`}
          />
        </div>

        <Party title={spec.roleA} fields={a} tamil={tamil} />
        {b.length ? <Party title={spec.roleB} fields={b} tamil={tamil} /> : null}

        <Contact />
      </>
    );
  }

  const rest = fields.filter((f) => !f.party);
  return (
    <>
      <StepIntro
        title="The particulars"
        body={
          rest.length
            ? "The figures and dates this deed prints. Anything it does not ask about is filled in at the counter."
            : "This deed needs nothing beyond the parties and the date."
        }
      />
      <div className="space-y-5">
        {rest.map((f) =>
          f.kind === "propertyAddress" ? (
            <One key={f.token} field={f} tamil={tamil} />
          ) : null,
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {rest
            .filter((f) => f.kind !== "propertyAddress")
            .map((f) => (
              <One key={f.token} field={f} tamil={tamil} />
            ))}
        </div>
      </div>
    </>
  );
}

function Party({ title, fields, tamil }: { title: string; fields: TemplateField[]; tamil: boolean }) {
  if (!fields.length) return null;
  return (
    <div className="mt-6 rounded-2xl border border-line bg-white p-5">
      <h3 className="text-[11px] font-bold tracking-[0.12em] text-navy-400 uppercase">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.token} className={f.kind === "tamilArea" ? "sm:col-span-2" : undefined}>
            <One field={f} tamil={tamil} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Always asked, whatever the deed says: nothing is charged online, so the
 * office has to be able to ring back and confirm the order.
 */
function Contact() {
  const { draft, setParty } = useAgreement();
  return (
    <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
      <h3 className="text-[14px] font-bold text-navy-950">Where we call you</h3>
      <p className="mt-1 text-[13px] text-navy-600">
        Nothing is charged here. We read the deed, ring you to confirm, and take payment on that
        call.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Mobile number" required>
          {(id) => (
            <Input
              id={id}
              value={draft.landlord.phone}
              inputMode="tel"
              onChange={(e) => setParty("landlord", { phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="98400 00000"
            />
          )}
        </Field>
        <Field label="Email address">
          {(id) => (
            <Input
              id={id}
              type="email"
              value={draft.landlord.email}
              onChange={(e) => setParty("landlord", { email: e.target.value })}
              placeholder="name@example.com"
            />
          )}
        </Field>
      </div>
    </div>
  );
}
