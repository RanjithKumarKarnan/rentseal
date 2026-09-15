import { useEffect } from "react";
import { useMatches } from "react-router";
import { applyHead, tagsForMatches } from "./meta";

/**
 * Keeps <head> in step with the page as the visitor moves around the site.
 *
 * The pre-rendered HTML already has the right tags for the page it was loaded
 * on; this carries them over to every page opened after it, and gives
 * `npm run dev` — which does not pre-render — its titles too.
 */
export function HeadManager() {
  const matches = useMatches();

  useEffect(() => {
    applyHead(tagsForMatches(matches));
  }, [matches]);

  return null;
}
