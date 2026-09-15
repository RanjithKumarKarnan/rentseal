import { useEffect } from "react";
import { useLocation } from "react-router";

/** Close enough to count as landed — smooth scrolls stop a pixel or two short. */
const TOLERANCE = 240;

/**
 * Owns fragment navigation.
 *
 * The browser's own scroll-to-fragment and the router's scroll restoration
 * both fire around hydration, and on a long page the second one wins: a cold
 * load of /#get-started, or "Start my order" clicked from any other route,
 * would start scrolling toward the lead form and get cancelled ~50px in,
 * leaving the visitor at the top of the homepage. Nearer anchors happened to
 * survive it, which is what made it look intermittent.
 *
 * Re-asserting the scroll once the target is actually in the DOM makes every
 * anchor land in the same place, and the retry covers the case where hydration
 * cancels our first attempt too.
 */
export function HashScroll() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let waited = 0;
    let attempts = 0;
    let cancelled = false;

    const settled = (el: HTMLElement) =>
      Math.abs(el.getBoundingClientRect().top) < TOLERANCE;

    const run = () => {
      if (cancelled) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) {
        // The section may still be mounting — give it a second's worth of frames.
        if (waited++ < 60) frame = requestAnimationFrame(run);
        return;
      }
      if (settled(target)) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

      // Check back after the scroll should have finished; if something cut it
      // short, go again.
      if (attempts++ < 3) timer = setTimeout(run, 500);
    };

    frame = requestAnimationFrame(run);

    // Same-route hash changes (nav links to /#delivery and friends).
    const onHashChange = () => {
      waited = 0;
      attempts = 0;
      run();
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname, hash, key]);

  return null;
}
