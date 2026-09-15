import { SuccessFromUrl } from "@/components/success/success-from-url";
import type { PageMeta } from "@/seo/meta";

export const meta: PageMeta = {
  title: "Agreement Received",
  description: "Your draft is with our team. We will call to confirm the details and take payment.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessFromUrl />;
}
