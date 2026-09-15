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

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-5 text-[14.5px] gap-2 rounded-xl",
  lg: "h-[52px] px-7 text-[15.5px] gap-2.5 rounded-xl",
  xl: "h-[60px] px-9 text-base gap-3 rounded-2xl",
};

const BASE =
  "inline-flex items-center justify-center font-semibold whitespace-nowrap select-none " +
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
