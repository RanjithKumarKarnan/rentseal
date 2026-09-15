import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A number you nudge rather than type.
 *
 * Used where the answer is nearly always a small number and typing one is more
 * work than pressing a button — how many copies of the deed you want. The
 * value is still a real input, so a keyboard user can tab to it and type 12
 * instead of pressing + twelve times, and a screen reader reads it as the
 * spinbutton it is.
 *
 * The buttons disable at the ends rather than silently refusing, because a
 * button that looks live and does nothing is the thing people click twice.
 */
export function Stepper({
  id,
  value,
  onChange,
  min = 0,
  max = 20,
  suffix,
  label,
  className,
}: {
  id?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Read out beside the number — "copies", "sheets". */
  suffix?: string;
  /**
   * Accessible name for the number itself.
   *
   * The suffix beside it is a truncated visual label, and where the control
   * sits next to a paragraph rather than inside a Field there is nothing else
   * tying a name to the input — a screen reader reached an unnamed spinbutton.
   */
  label?: string;
  className?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.floor(n) || 0));
  const set = (n: number) => onChange(clamp(n));

  return (
    <div
      className={cn(
        "flex h-11 items-center justify-between gap-1 rounded-lg border border-line bg-white px-1.5",
        className,
      )}
    >
      <StepButton
        label="One fewer"
        disabled={value <= min}
        onClick={() => set(value - 1)}
      >
        <Minus className="size-4" />
      </StepButton>

      <span className="flex min-w-0 flex-1 items-baseline justify-center gap-1.5">
        <input
          id={id}
          type="number"
          aria-label={label}
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
          className="tnum w-10 [appearance:textfield] border-0 bg-transparent p-0 text-center text-[15px] font-bold text-navy-950 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix ? (
          <span className="truncate text-[12.5px] text-navy-400">{suffix}</span>
        ) : null}
      </span>

      <StepButton
        label="One more"
        disabled={value >= max}
        onClick={() => set(value + 1)}
      >
        <Plus className="size-4" />
      </StepButton>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md transition-colors",
        disabled
          ? "cursor-not-allowed text-navy-300"
          : "text-navy-600 hover:bg-navy-100 hover:text-navy-950",
      )}
    >
      {children}
    </button>
  );
}
