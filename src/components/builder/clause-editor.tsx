import { useState } from "react";
import { Pencil, RotateCcw, Trash2, Undo2, X } from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { generateClauses } from "@/lib/clauses";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/card";

/**
 * Editing the drafted clauses before the deed is sent.
 *
 * Every letting has something the standard wording does not reach — a rent-free
 * fit-out month, which parking bay, whose name the electricity card is in — and
 * the specialist clauses carry blanks the office would otherwise fill in by
 * hand at the counter. Rather than send those as a note somebody has to retype,
 * the customer rewrites the clause here and the change travels with the draft
 * into the PDF.
 *
 * Core clauses can be reworded but not struck out: an agreement with no rent
 * clause is not a shorter agreement, it is a broken one.
 */
export function ClauseEditor() {
  const { draft, editClause, resetClause, removeClause, restoreClause } = useAgreement();
  const clauses = generateClauses(draft);
  const removed = draft.options.removedClauseIds;
  const edits = draft.options.clauseEdits;
  const [editing, setEditing] = useState<string | null>(null);
  const [text, setText] = useState("");

  // Struck-out clauses are filtered out of `generateClauses`, so rebuild the
  // full set to offer them back.
  const struck = generateClauses({
    ...draft,
    options: { ...draft.options, removedClauseIds: [] },
  }).filter((c) => removed.includes(c.id));

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="text-[14px] font-bold text-navy-950">The clauses we have drafted</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-navy-500">
        {clauses.length} clauses, numbered as they will appear. Reword any of them, or strike out
        the ones you do not want. Blanks shown as ____ are filled in by hand at the counter unless
        you fill them in here.
      </p>

      <ol className="mt-4 space-y-2">
        {clauses.map((clause, i) => {
          const isEditing = editing === clause.id;
          const isEdited = Boolean(edits[clause.id]);
          return (
            <li key={clause.id} className="rounded-xl border border-line bg-canvas p-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-navy-950 text-[10px] font-bold text-white">
                  {i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-navy-900">{clause.title}</span>
                    {isEdited ? <Badge tone="brand">Edited</Badge> : null}
                    {clause.core ? null : <Badge>Optional</Badge>}
                  </div>

                  {isEditing ? (
                    <div className="mt-2.5">
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[104px] w-full"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          onClick={() => {
                            if (text.trim()) editClause(clause.id, text);
                            setEditing(null);
                          }}
                        >
                          Save clause
                        </Button>
                        <Button variant="secondary" onClick={() => setEditing(null)}>
                          <X className="size-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-[13px] leading-relaxed text-navy-700">{clause.body}</p>
                  )}
                </div>

                {isEditing ? null : (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(clause.id);
                        setText(clause.body);
                      }}
                      aria-label={`Reword clause ${i + 1}`}
                      className="rounded-lg p-1.5 text-navy-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    {isEdited ? (
                      <button
                        type="button"
                        onClick={() => resetClause(clause.id)}
                        aria-label={`Restore the original wording of clause ${i + 1}`}
                        className="rounded-lg p-1.5 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-700"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                    ) : null}
                    {clause.core ? null : (
                      <button
                        type="button"
                        onClick={() => removeClause(clause.id)}
                        aria-label={`Strike out clause ${i + 1}`}
                        className="rounded-lg p-1.5 text-navy-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {struck.length ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[11px] font-bold tracking-[0.12em] text-navy-400 uppercase">
            Struck out — {struck.length}
          </p>
          <ul className="mt-2.5 space-y-2">
            {struck.map((clause) => (
              <li
                key={clause.id}
                className="flex items-start gap-3 rounded-xl border border-dashed border-line bg-canvas/60 p-3"
              >
                <p className="flex-1 text-[12.5px] leading-relaxed text-navy-400 line-through">
                  {clause.body}
                </p>
                <button
                  type="button"
                  onClick={() => restoreClause(clause.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  <Undo2 className="size-3.5" />
                  Put back
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
