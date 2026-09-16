import Link from "@/components/ui/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "emerald" | "dark";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_1px_2px_rgb(15_23_42/0.12),0_8px_24px_-8px_rgb(37_99_235/0.6)] hover:bg-brand-700 hover:shadow-[0_2px_4px_rgb(15_23_42/0.14),0_14px_32px_-10px_rgb(37_99_235/0.7)] active:bg-brand-800",
  secondary:
    "bg-white text-navy-950 border border-line shadow-soft hover:border-navy-300 hover:bg-navy-50 active:bg-navy-100",
  outline:
    "bg-transparent text-navy-900 border border-navy-300 hover:border-navy-950 hover:bg-navy-950 hover:text-white",
  ghost: "bg-transparent text-navy-700 hover:bg-navy-100 hover:text-navy-950",
  emerald:
    "bg-emerald-500 text-white shadow-[0_1px_2px_rgb(15_23_42/0.12),0_8px_24px_-8px_rgb(16_185_129/0.6)] hover:bg-emerald-600 active:bg-emerald-700",
  dark: "bg-navy-950 text-white shadow-lift hover:bg-navy-900 active:bg-navy-800",
};

/**
 * Heights are minimums, not fixed, so a label that has to wrap on a phone makes
 * the button taller instead of spilling out of it. The two large sizes also
 * take less padding and a point less type below `sm`: "Order non-judicial
 * stamp paper" then still sits on one line on a 360px screen.
 */
const SIZES: Record<Size, string> = {
  sm: "min-h-9 py-1.5 px-3.5 text-[13px] gap-1.5 rounded-lg",
  md: "min-h-11 py-2 px-5 text-[14.5px] gap-2 rounded-xl",
  lg: "min-h-[52px] py-2.5 px-5 text-[15px] gap-2 rounded-xl sm:px-7 sm:text-[15.5px] sm:gap-2.5",
  xl: "min-h-[60px] py-3 px-6 text-[15px] gap-2.5 rounded-2xl sm:px-9 sm:text-base sm:gap-3",
};

/**
 * Labels may wrap below `sm`. A button that refuses to wrap is as wide as its
 * label, and one label wider than the phone — "Order ₹1,000 non-judicial stamp
 * paper" was — makes the whole page wider than the screen, so the browser zooms
 * out and every section looks cut off on the right. From `sm` up a label stays
 * on one line, as it always has.
 */
const BASE =
  "inline-flex max-w-full items-center justify-center text-center font-semibold whitespace-normal sm:whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
      {...props}
    />
  );
}
