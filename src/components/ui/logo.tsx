"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Where the supplied artwork lives. Drop the file in and it is picked up. */
const LOGO_SRC = "/logo.png";

/**
 * The client's seal, used as supplied.
 *
 * Falls back to the drawn mark below if the file is missing, so a forgotten
 * upload shows a logo rather than a broken-image icon in the header of every
 * page.
 *
 * The seal carries its own wording — "LEGAL STAMP PAPER", "NOTARY SERVICES" and
 * the row of service icons — none of which survives being shrunk to the 36px
 * the header gives it. That is why the wordmark still sits beside it: at this
 * size the seal reads as a seal, and the name has to come from the text.
 */
export function LogoMark({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // onError alone is not enough: the browser requests the image while parsing
  // the server-rendered HTML, so a 404 fires its error event before React has
  // hydrated and attached the handler — leaving a broken-image icon in the
  // header of every page. Re-check the outcome once mounted.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <FallbackMark className={className} />;

  return (
    // Plain <img>: the artwork is a fixed square the browser can scale on its
    // own, and next/image would want dimensions we do not control.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={img}
      src={LOGO_SRC}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={cn("size-9 shrink-0 rounded-full object-contain", className)}
    />
  );
}

/** Shown only until the artwork is in place. */
function FallbackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("size-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id="lp-mark" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="0.55" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11.5" fill="url(#lp-mark)" />
      {/* seal ring */}
      <circle cx="20" cy="20" r="12.5" stroke="white" strokeOpacity="0.28" strokeWidth="1.2" />
      <circle
        cx="20"
        cy="20"
        r="12.5"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeDasharray="2.2 3.4"
      />
      {/* document with folded corner */}
      <path
        d="M15 13.2h6.4l3.9 3.9v9.7a1.2 1.2 0 0 1-1.2 1.2H15a1.2 1.2 0 0 1-1.2-1.2V14.4A1.2 1.2 0 0 1 15 13.2Z"
        fill="white"
      />
      <path d="M21.4 13.2v3a.9.9 0 0 0 .9.9h3l-3.9-3.9Z" fill="white" fillOpacity="0.55" />
      {/* check */}
      <path
        d="m16.8 21.6 2 2 4-4.3"
        stroke="#2563EB"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      <LogoMark className="size-9 transition-transform duration-500 group-hover:rotate-[-6deg]" />
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
