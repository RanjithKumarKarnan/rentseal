import { DISTRICTS, ZONE_META } from "@/lib/districts";
import { ogImage } from "@/lib/og";
import { SERVICES } from "@/lib/services";
import { OG_DEFAULT, OG_RENTAL, OG_STAMP, ogRentalDistrict, ogService, ogStampDistrict } from "./og";

/**
 * Every social card the build draws, and where it goes.
 *
 * Build-time only: this pulls in the image renderer, which the browser never
 * needs. One layout for all of them (src/lib/og.tsx); each page passes its own
 * eyebrow, title and facts.
 */
export function ogCards(): Array<{ path: string; image: () => Response }> {
  return [
    {
      path: OG_DEFAULT.path,
      image: () =>
        ogImage({
          eyebrow: "All 38 districts of Tamil Nadu",
          title: "Non-judicial stamp paper and agreements, delivered",
          facts: ["e-Stamped at government rate", "Aadhaar e-Sign", "Same day in Chennai"],
        }),
    },
    {
      path: OG_RENTAL.path,
      image: () =>
        ogImage({
          eyebrow: "District-wise coverage",
          title: "Rental agreements across Tamil Nadu",
          facts: [`All ${DISTRICTS.length} districts`, "e-Stamped · Aadhaar e-signed", "From ₹349"],
        }),
    },
    {
      path: OG_STAMP.path,
      image: () =>
        ogImage({
          eyebrow: "District-wise delivery",
          title: "Non-judicial stamp paper across Tamil Nadu",
          facts: [`All ${DISTRICTS.length} districts`, "₹100 – ₹5,000 + e-Stamp", "₹100 paper for ₹120"],
        }),
    },
    ...DISTRICTS.map((district) => ({
      path: ogRentalDistrict(district.slug).path,
      image: () =>
        ogImage({
          eyebrow: `${district.name} district`,
          title: `Rental agreement in ${district.name}`,
          facts: [
            "e-Stamped · Aadhaar e-signed",
            `${district.sroTowns.length} SROs covered`,
            `${district.region}`,
          ],
        }),
    })),
    ...DISTRICTS.map((district) => ({
      path: ogStampDistrict(district.slug).path,
      image: () =>
        ogImage({
          eyebrow: `${district.name} district`,
          title: `Non-judicial stamp paper in ${district.name}`,
          facts: [ZONE_META[district.zone].eta, "₹100 paper for ₹120", `₹100 – ₹5,000 + e-Stamp`],
        }),
    })),
    ...SERVICES.map((service) => ({
      path: ogService(service.slug).path,
      image: () =>
        ogImage({
          eyebrow: "Drafted for Tamil Nadu",
          title: service.name,
          facts: [`${service.clauses.length} clauses`, "e-Stamped · Aadhaar e-signed", "Notarised"],
        }),
    })),
  ];
}
