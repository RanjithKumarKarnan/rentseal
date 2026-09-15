import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False while React is taking over the pre-rendered HTML, true from then on.
 *
 * A page the build wrote without a query string (/search, /success) has to
 * render exactly that on its first pass in the browser, or the HTML and React
 * disagree. Anything read from the URL waits for this. On a page reached by a
 * click rather than loaded cold, it is already true on the first render.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
