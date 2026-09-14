import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The LP monogram — a red "L" and a navy "P" locked together.
 *
 * Drawn rather than loaded from a file so it stays crisp at any size and works
 * on either background: the P is `currentColor`, so it is navy on the light
 * header and white on the dark footer (where the Logo passes `text-white`),
 * while the L keeps its red on both. If a raster of the finished artwork is
 * ever preferred, drop it in and swap this <svg> for an <img>.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-9 shrink-0 text-navy-950", className)}
      role="img"
      aria-label="LP Stamp Paper"
      fill="none"
    >
      {/* Red L — a slanted stem and foot */}
      <path d="M31,15 L48,15 L38,63 L76,63 L72,85 L16,85 Z" fill="#e11f2b" />
      {/* Navy P — stem, bowl and counter (currentColor so it inverts) */}
      <path
        d="M52,15 L82,15 C93,16 98,26 98,35 C98,48 87,55 68,55 L61,55 L52,85 L43,85 Z M64,31 L61,45 C71,45 78,43 78,37 C78,33 73,31 66,31 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  inverted,
  showTag,
}: {
  className?: string;
  href?: string;
  inverted?: boolean;
  showTag?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark
        className={cn(
          "size-9 transition-transform duration-500 group-hover:rotate-[-6deg]",
          inverted && "text-white",
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] font-bold tracking-[-0.03em]",
            inverted ? "text-white" : "text-navy-950",
          )}
        >
          LP <span className={inverted ? "text-brand-300" : "text-brand-600"}>Stamp Paper</span>
        </span>
        {showTag ? (
          <span
            className={cn(
              "mt-1 text-[9.5px] font-semibold tracking-[0.16em] uppercase",
              inverted ? "text-white/45" : "text-navy-400",
            )}
          >
            Tamil Nadu
          </span>
        ) : null}
      </span>
    </Link>
  );
}
