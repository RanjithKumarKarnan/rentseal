import { SERVICES, getService } from "@/lib/services";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// Drawn once at build time; a static site has no server to draw it on request.
export const dynamic = "force-static";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return ogImage({ eyebrow: "Tamil Nadu", title: "Agreements", facts: [] });

  return ogImage({
    eyebrow: "Drafted for Tamil Nadu",
    title: service.name,
    facts: [`${service.clauses.length} clauses`, "e-Stamped · Aadhaar e-signed", "Notarised"],
  });
}
