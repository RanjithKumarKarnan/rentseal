import { cn } from "@/lib/utils";

/**
 * The hero's backdrop: the office's own ₹100 non-judicial sheet, tiled.
 *
 * The photograph in public/stamp-paper is 271px wide — the same scan the
 * denomination picker shows. One sheet stretched across a 1440px hero is a
 * smear, and a smear behind an h1 is worse than no texture at all. Tiled near
 * its own size it is never scaled up: the emblem, the rules and INDIA NON
 * JUDICIAL stay as sharp as they are in the picker, and what reads is a run of
 * stamp paper behind the page rather than one blurred sheet.
 *
 * Two things keep it a backdrop rather than wallpaper. It is held down to a
 * watermark and pulled most of the way to grey, so the sheet's magenta does not
 * fight a navy headline. And it is weighted to the top, where a real sheet
 * carries its printing, then thinned through the middle where the headline and
 * the paragraph sit — the copy keeps a quiet ground and the paper is still
 * plainly paper.
 */

/** The sheet at the top, thinning through the copy, gone before the next section. */
const PAPER_FADE =
  "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.62) 26%, rgba(0,0,0,0.34) 52%, rgba(0,0,0,0.22) 78%, transparent 100%)";

/** Fades the whole backdrop out at the foot, where the hero meets the next section. */
const FADE = "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)";

export function StampBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <div
        className="absolute inset-0 bg-[length:172px_auto] opacity-[0.13] [filter:grayscale(0.62)_contrast(0.92)] md:bg-[length:320px_auto] md:opacity-[0.17]"
        style={{
          backgroundImage: "url(/stamp-paper/rs-100.jpg)",
          backgroundRepeat: "repeat",
          maskImage: PAPER_FADE,
          WebkitMaskImage: PAPER_FADE,
        }}
      />

      {/* The ruled border every sheet carries: a heavy line, a hairline, and the
          gap between them. Real borders, so they stay on the section's edges
          whatever its height. Left off the phone, where a frame drawn around a
          section two screens tall reads as a stray box rather than as paper. */}
      <div className="absolute inset-7 hidden border-2 border-navy-950/10 md:block" />
      <div className="absolute inset-10 hidden border border-navy-950/10 md:block" />
      <div className="absolute inset-12 hidden border border-dashed border-navy-950/[0.07] md:block" />
    </div>
  );
}
