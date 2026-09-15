import { DISTRICTS } from "@/lib/districts";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Rental agreements in all 38 districts of Tamil Nadu";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// Drawn once at build time; a static site has no server to draw it on request.
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    eyebrow: "District-wise coverage",
    title: "Rental agreements across Tamil Nadu",
    facts: [`All ${DISTRICTS.length} districts`, "e-Stamped · Aadhaar e-signed", "From ₹349"],
  });
}
