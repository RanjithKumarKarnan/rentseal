
import { cn } from "@/lib/utils";

/**
 * A picture of what actually arrives.
 *
 * People were choosing "Any value — e-Stamp" expecting a sheet of paper in an
 * envelope, because in a list of text options an e-Stamp certificate and a
 * ₹100 non-judicial sheet look like the same kind of thing. They are not: one
 * is physical stock a rider carries to your door, the other is a PDF that
 * arrives by email in minutes. So the two are shown differently, and the
 * difference is the point of showing them.
 *
 * The four sheets are the office's own photographs. The e-Stamp has no
 * photograph because there is nothing to photograph — it is a certificate, not
 * stock — so it is drawn, and drawn to look like a document on a screen rather
 * than a sheet in a drawer.
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
  /** Face value. 0 draws the e-Stamp certificate instead. */
  value: number;
  label: string;
  className?: string;
}) {
  const src = SHEETS[value];
  if (!src) return <EStampCertificate className={className} />;

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

/** The e-Stamp: a certificate, not a sheet, and drawn so it reads that way. */
function EStampCertificate({ className }: { className?: string }) {
  return (
    <span className={cn("relative block aspect-[132/84] overflow-hidden bg-white", className)}>
      <svg
        viewBox="0 0 132 84"
        role="img"
        aria-label="e-Stamp certificate, issued digitally"
        className="absolute inset-0 size-full"
      >
        <rect width="132" height="84" fill="#f0f7ff" />
        <rect x="2.5" y="2.5" width="127" height="79" rx="1.5" fill="none" stroke="#1e5fa8" strokeWidth="1.2" />

        <text x="66" y="15" textAnchor="middle" fill="#1e5fa8" fontSize="6" fontWeight="700" letterSpacing="0.3">
          e-STAMP CERTIFICATE
        </text>
        <line x1="18" y1="18.5" x2="114" y2="18.5" stroke="#1e5fa8" strokeWidth="0.4" opacity="0.6" />

        {/* A QR block — the thing that says "this is verified from a screen". */}
        <g fill="#1e5fa8">
          <rect x="22" y="26" width="24" height="24" rx="1" fill="none" stroke="#1e5fa8" strokeWidth="1" />
          <rect x="25" y="29" width="6" height="6" rx="0.5" />
          <rect x="37" y="29" width="6" height="6" rx="0.5" />
          <rect x="25" y="41" width="6" height="6" rx="0.5" />
          <rect x="34" y="38" width="3" height="3" />
          <rect x="39" y="41" width="3" height="3" />
          <rect x="34" y="45" width="3" height="3" />
          <rect x="42" y="45" width="2.5" height="2.5" />
        </g>

        {[0, 1, 2].map((i) => (
          <rect key={i} x="54" y={28 + i * 6} width={i === 2 ? 32 : 52} height="2.6" rx="1.3" fill="#1e5fa8" opacity="0.3" />
        ))}
        <text x="54" y="50" fill="#1e5fa8" fontSize="5.4" fontWeight="800">
          Any value
        </text>

        <line x1="18" y1="58" x2="114" y2="58" stroke="#1e5fa8" strokeWidth="0.4" opacity="0.6" />
        <text x="66" y="66" textAnchor="middle" fill="#1e5fa8" fontSize="4.6" fontWeight="700" letterSpacing="0.3">
          EMAILED, NOT DELIVERED
        </text>
        <text x="66" y="74" textAnchor="middle" fill="#4a7fc1" fontSize="4" letterSpacing="0.2">
          Issued for the exact duty payable
        </text>
      </svg>
    </span>
  );
}
