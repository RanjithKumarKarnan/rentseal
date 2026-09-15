import { useSearchParams } from "react-router";
import { useHydrated } from "@/lib/use-hydrated";
import { SuccessView } from "./success-view";

/**
 * The reference arrives as ?id=. The build writes this page without one, so it
 * stays blank until the browser has taken the HTML over, then shows the
 * reference that was just sent.
 */
export function SuccessFromUrl() {
  const [params] = useSearchParams();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return <SuccessView agreementId={params.get("id") ?? "LP-2026-000000"} />;
}
