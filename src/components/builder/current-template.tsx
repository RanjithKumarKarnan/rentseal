import Link from "@/components/ui/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { specFor } from "@/lib/clauses";
import { TEMPLATES } from "@/lib/templates";

/**
 * What is being drafted, and the way back to pick something else.
 *
 * The whole catalogue used to be reprinted here, open by default: a customer
 * who had just chosen a warehouse deed from a grid of fifty-five cards arrived
 * at step one and was shown the same fifty-five cards again, above the first
 * question. Choosing twice is not a confirmation, it is a doubt — and it pushed
 * the form itself below the fold.
 *
 * The choice is already made by the time anyone is here, so this states it and
 * offers the catalogue as a link rather than as a list. Going back keeps the
 * draft: the answers are saved against the draft, not against the template, so
 * picking a different document returns to the same parties and address.
 */
export function CurrentTemplate() {
  const { draft } = useAgreement();
  const spec = specFor(draft);
  const listed = TEMPLATES.find((t) => t.id === draft.templateId);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-line bg-white p-5">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
          <FileText className="size-3.5 text-brand-700" />
          Drafting
        </p>
        <h3 className="mt-1.5 font-display text-[16px] leading-snug font-bold text-navy-950">
          {listed?.name ?? spec.deedTitle}
        </h3>
        <p className="mt-1 text-[13px] text-navy-500">
          Drawn as {spec.deedTitle.toLowerCase()}
          {spec.defaults.durationMonths > 0 ? ` · ${spec.defaults.durationMonths} months` : ""}
          {spec.roleB ? ` · ${spec.roleA.toLowerCase()} and ${spec.roleB.toLowerCase()}` : ""}
        </p>
      </div>

      <Link
        href="/templates"
        className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[13.5px] font-semibold text-navy-700 transition-colors hover:border-brand-300 hover:text-brand-700"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Choose a different agreement
      </Link>
    </div>
  );
}
