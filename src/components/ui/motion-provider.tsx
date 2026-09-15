import { useEffect } from "react";
import { MotionConfig, MotionGlobalConfig } from "framer-motion";

/**
 * Motion settings for the whole site.
 *
 * Two things are handled here.
 *
 * Reduced motion
 *   The `prefers-reduced-motion` block in globals.css only neutralises CSS
 *   animations and transitions. Framer animates by writing inline styles from
 *   JavaScript, so the reveals, staggers and count-ups ran at full strength for
 *   users who had explicitly asked them not to. `reducedMotion="user"` makes
 *   Framer skip transform and opacity animations for those users and jump
 *   straight to the final state — the content still arrives, it just does not
 *   move.
 *
 * A page loaded out of sight
 *   Every entrance on this site starts from `opacity: 0` and is carried to 1 by
 *   Framer's frame loop. A browser does not run that loop in a tab that is not
 *   being looked at, so a page loaded while hidden — opened in a background
 *   tab, restored with a session, or sitting in a preview pane — paints the
 *   hero, the sections and the whole home page at zero opacity and leaves them
 *   there. The markup is all present; nothing ever brings it into view.
 *
 *   So when the document is hidden, animations are skipped rather than played:
 *   Framer jumps each one to its final state the moment it starts, and the page
 *   is readable whether or not a frame has ever been drawn. Once the tab is
 *   actually being looked at, animation is turned back on and everything from
 *   that point down the page reveals on scroll as before.
 */

/**
 * Set before anything renders, and again on every render of the provider.
 *
 * It cannot wait for an effect: React runs a child's effects before its
 * parent's, so by the time this component's effect fired the hero had already
 * started animating and was already stuck. The provider renders before any of
 * them, so that is where the flag has to be read.
 */
function sync() {
  if (typeof document === "undefined") return;
  MotionGlobalConfig.skipAnimations = document.visibilityState === "hidden";
}

sync();

export function MotionProvider({ children }: { children: React.ReactNode }) {
  sync();

  useEffect(() => {
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      MotionGlobalConfig.skipAnimations = false;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
