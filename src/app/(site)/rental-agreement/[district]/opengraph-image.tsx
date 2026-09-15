import { DISTRICTS, getDistrict } from "@/lib/districts";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// Drawn once at build time; a static site has no server to draw it on request.
export const dynamic = "force-static";

export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ district: d.slug }));
}

export default async function Image({ params }: { params: Promise<{ district: string }> }) {
  const { district: slug } = await params;
  const district = getDistrict(slug);
  if (!district) return ogImage({ eyebrow: "Tamil Nadu", title: "Rental agreements", facts: [] });

  return ogImage({
    eyebrow: `${district.name} district`,
    title: `Rental agreement in ${district.name}`,
    facts: [
      "e-Stamped · Aadhaar e-signed",
      `${district.sroTowns.length} SROs covered`,
      `${district.region}`,
    ],
  });
}
