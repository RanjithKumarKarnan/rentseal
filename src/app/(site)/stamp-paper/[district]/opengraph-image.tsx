import { DISTRICTS, ZONE_META, getDistrict } from "@/lib/districts";
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
  if (!district) return ogImage({ eyebrow: "Tamil Nadu", title: "Stamp paper", facts: [] });

  const zone = ZONE_META[district.zone];
  return ogImage({
    eyebrow: `${district.name} district`,
    title: `Stamp paper in ${district.name}`,
    facts: [zone.eta, "₹100 paper for ₹120", `₹100 – ₹5,000 + e-Stamp`],
  });
}
