import { useId } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-navy-950 " +
  "placeholder:text-navy-400 shadow-[inset_0_1px_2px_rgb(15_23_42/0.03)] " +
  "transition-[border-color,box-shadow,background-color] duration-200 " +
  "hover:border-navy-300 " +
  "focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12 " +
  "disabled:cursor-not-allowed disabled:bg-navy-50 disabled:text-navy-400";

export function Label({
  children,
  hint,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[13.5px] font-semibold text-navy-800">
        {children}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </label>
      {hint ? <span className="text-[12px] font-medium text-navy-400">{hint}</span> : null}
    </div>
  );
}

export function Help({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-navy-500">
      <Info className="mt-px size-3.5 shrink-0 text-navy-400" />
      <span>{children}</span>
    </p>
  );
}

interface FieldShellProps {
  label?: string;
  hint?: string;
  help?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}

export function Field({ label, hint, help, required, error, className, children }: FieldShellProps) {
  const id = useId();
  return (
    <div className={className}>
      {label ? (
        <Label htmlFor={id} hint={hint} required={required}>
          {label}
        </Label>
      ) : null}
      {children(id)}
      {error ? (
        <p className="mt-1.5 text-[12.5px] font-medium text-rose-600">{error}</p>
      ) : help ? (
        <Help>{help}</Help>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  prefix,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  prefix?: string;
  suffix?: string;
  /** React 19 passes ref as an ordinary prop; the Tamil keyboard needs one to
   *  put a letter at the caret rather than at the end. */
  ref?: React.Ref<HTMLInputElement>;
}) {
  if (prefix || suffix) {
    return (
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute left-3.5 text-[15px] font-medium text-navy-400">
            {prefix}
          </span>
        ) : null}
        <input
          className={cn(CONTROL, "h-11", prefix && "pl-11", suffix && "pr-14", className)}
          {...props}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3.5 text-[13px] font-medium text-navy-400">
            {suffix}
          </span>
        ) : null}
      </div>
    );
  }
  return <input className={cn(CONTROL, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: React.Ref<HTMLTextAreaElement>;
}) {
  return <textarea className={cn(CONTROL, "min-h-[104px] resize-y py-3 leading-relaxed", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(CONTROL, "h-11 cursor-pointer appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-navy-400" />
    </div>
  );
}

/** Card-style radio group — used everywhere a choice deserves visual weight. */
export function OptionCards<T extends string>({
  value,
  onChange,
  options,
  columns = 2,
  name,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{
    value: T;
    label: string;
    desc?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  columns?: 2 | 3 | 4;
  name: string;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div role="radiogroup" aria-label={name} className={cn("grid grid-cols-1 gap-2.5", cols)}>
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
              active
                ? "border-brand-600 bg-brand-50/60 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                : "border-line bg-white hover:border-navy-300 hover:bg-navy-50/50",
            )}
          >
            {Icon ? (
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                  active ? "bg-brand-600 text-white" : "bg-navy-100 text-navy-600 group-hover:bg-navy-200",
                )}
              >
                <Icon className="size-4.5" />
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block text-[14px] font-semibold",
                  active ? "text-brand-800" : "text-navy-900",
                )}
              >
                {opt.label}
              </span>
              {opt.desc ? (
                <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">{opt.desc}</span>
              ) : null}
            </span>
            <span
              className={cn(
                "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border-2 transition-all",
                active ? "border-brand-600 bg-brand-600" : "border-navy-300 bg-white",
              )}
            >
              {active ? <Check className="size-3 text-white" strokeWidth={3.5} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Accessible switch with a label and explanatory copy. */
export function Toggle({
  checked,
  onChange,
  label,
  desc,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  desc?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-all duration-200",
        checked ? "border-brand-300 bg-brand-50/50" : "border-line bg-white hover:border-navy-300",
        disabled && "cursor-not-allowed opacity-55",
      )}
    >
      <span
        className={cn(
          "relative mt-0.5 inline-flex h-[24px] w-[42px] shrink-0 rounded-full p-0.5 transition-colors duration-300",
          checked ? "bg-brand-600" : "bg-navy-300",
        )}
      >
        <span
          className={cn(
            "size-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            checked ? "translate-x-[18px]" : "translate-x-0",
          )}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-navy-900">{label}</span>
        {desc ? <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">{desc}</span> : null}
      </span>
    </button>
  );
}

/** Multi-select chips, e.g. amenities. */
export function ChipGroup({
  values,
  onChange,
  options,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() =>
              onChange(active ? values.filter((v) => v !== opt) : [...values, opt])
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
              active
                ? "border-brand-600 bg-brand-600 text-white shadow-[0_4px_12px_-4px_rgb(37_99_235/0.5)]"
                : "border-line bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50",
            )}
          >
            {active ? <Check className="size-3.5" strokeWidth={3} /> : null}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
