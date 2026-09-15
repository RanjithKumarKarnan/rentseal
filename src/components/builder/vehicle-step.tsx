import { Bike } from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { Field, Input, Toggle } from "@/components/ui/field";
import { CurrentTemplate } from "./current-template";
import { inr, rupeesInWords } from "@/lib/utils";

/**
 * What is being sold, in place of the premises step.
 *
 * A sale has nothing a letting's property step asks for — no address, no
 * floor, no furnishing — and everything it does need identifies the vehicle
 * rather than a place. The registration, engine and chassis numbers are the
 * fields that matter: a wrong digit in any of them is what stops the transfer
 * at the RTO counter, long after both parties have signed.
 */
export function VehicleStep() {
  const { draft, update } = useAgreement();
  const v = draft.sale;
  const price = Number(v.price.replace(/[^\d.]/g, "")) || 0;

  const set = (patch: Partial<typeof v>) => update({ sale: patch });

  return (
    <>
      <CurrentTemplate />

      <div className="mt-8">
        <h2 className="font-display text-[22px] font-bold tracking-tight text-navy-950">
          Which vehicle is being sold?
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-navy-500">
          Copy these straight off the registration certificate. They are what the RTO checks when
          the buyer applies to transfer ownership.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Registration number" required hint="As printed on the RC">
            {(id) => (
              <Input
                id={id}
                value={v.registrationNumber}
                onChange={(e) => set({ registrationNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. TN02BZ4375"
                autoCapitalize="characters"
              />
            )}
          </Field>

          <Field label="Make and model" required>
            {(id) => (
              <Input
                id={id}
                value={v.makeModel}
                onChange={(e) => set({ makeModel: e.target.value })}
                placeholder="e.g. Yamaha R15 V3S"
              />
            )}
          </Field>

          <Field label="Year of manufacture">
            {(id) => (
              <Input
                id={id}
                value={v.manufactureYear}
                onChange={(e) => set({ manufactureYear: e.target.value.replace(/\D/g, "") })}
                placeholder="e.g. 2023"
                inputMode="numeric"
                maxLength={4}
              />
            )}
          </Field>

          <Field label="Engine number" required>
            {(id) => (
              <Input
                id={id}
                value={v.engineNumber}
                onChange={(e) => set({ engineNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. G3N4E0490089"
                autoCapitalize="characters"
              />
            )}
          </Field>

          <Field
            label="Chassis number"
            required
            className="sm:col-span-2"
            hint="Seventeen characters, stamped on the frame"
          >
            {(id) => (
              <Input
                id={id}
                value={v.chassisNumber}
                onChange={(e) => set({ chassisNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. ME1RG67F5P0006283"
                autoCapitalize="characters"
              />
            )}
          </Field>
        </div>

        <div className="border-t border-line pt-6">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-navy-950">
            <Bike className="size-4 text-brand-700" />
            The sale itself
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Sale price"
              required
              help={price > 0 ? `${inr(price)} — ${rupeesInWords(price)}` : undefined}
            >
              {(id) => (
                <Input
                  id={id}
                  value={v.price}
                  onChange={(e) => set({ price: e.target.value.replace(/[^\d]/g, "") })}
                  placeholder="e.g. 84000"
                  inputMode="numeric"
                />
              )}
            </Field>

            <Field
              label="Transfer of ownership within"
              hint="Days the buyer has to apply at the RTO"
            >
              {(id) => (
                <Input
                  id={id}
                  value={v.transferWithinDays}
                  onChange={(e) => set({ transferWithinDays: e.target.value.replace(/\D/g, "") })}
                  placeholder="30"
                  inputMode="numeric"
                  maxLength={3}
                />
              )}
            </Field>

            <Field label="Handover date" required>
              {(id) => (
                <Input
                  id={id}
                  type="date"
                  value={v.handoverDate}
                  onChange={(e) => set({ handoverDate: e.target.value })}
                />
              )}
            </Field>

            <Field
              label="Handover time"
              hint="Responsibility passes from this moment"
            >
              {(id) => (
                <Input
                  id={id}
                  value={v.handoverTime}
                  onChange={(e) => set({ handoverTime: e.target.value })}
                  placeholder="e.g. 7.30 PM"
                />
              )}
            </Field>
          </div>

          <div className="mt-4">
            <Toggle
              label="Documents and keys handed over"
              desc="RC, insurance and the keys that came with the vehicle."
              checked={v.documentsHandedOver}
              onChange={(documentsHandedOver) => set({ documentsHandedOver })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
