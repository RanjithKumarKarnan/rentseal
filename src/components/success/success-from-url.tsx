"use client";

import { useSearchParams } from "next/navigation";
import { SuccessView } from "./success-view";

/** The reference arrives as ?id=, which a static page can only read in the browser. */
export function SuccessFromUrl() {
  const id = useSearchParams().get("id");
  return <SuccessView agreementId={id ?? "LP-2026-000000"} />;
}
