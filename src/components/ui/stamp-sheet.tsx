
import { cn } from "@/lib/utils";

/**
 * A picture of what actually arrives: the physical sheet a rider carries to
 * your door. The four sheets are the office's own photographs.
 */

/** The office's photographs, by face value. */
const SHEETS: Record<number, string> = {
  100: "/stamp-paper/rs-100.jpg",
  500: "/stamp-paper/rs-500.jpg",
  1000: "/stamp-paper/rs-1000.jpg",
  5000: "/stamp-paper/rs-5000.jpg",
};

/**
 * The photographs are scans at four different aspect ratios, so they sit inside
 * a fixed box and are contained rather than cropped — a crop tuned to the ₹100
 * sheet takes the denomination clean off the ₹1,000 one.
 */
export function StampSheet({
  value,
  label,
  className,
}: {
  /** Face value — one of the four denominations in SHEETS. */
  value: number;
  label: string;
  className?: string;
}) {
  const src = SHEETS[value];
  if (!src) return null;

  return (
    <span
      className={cn(
        "relative block aspect-[132/84] overflow-hidden bg-white",
        className,
      )}
    >
      <img
        src={src}
        alt={`${label} non-judicial stamp paper`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}
