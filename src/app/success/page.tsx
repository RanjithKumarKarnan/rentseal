import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessFromUrl } from "@/components/success/success-from-url";

export const metadata: Metadata = {
  title: "Agreement Received",
  description: "Your draft is with our team. We will call to confirm the details and take payment.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessFromUrl />
    </Suspense>
  );
}
