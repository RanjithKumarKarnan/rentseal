/**
 * Social cards: the image a link shows when it is shared on WhatsApp, Facebook
 * or X. The build draws them (src/seo/og-cards.ts); this is only where each one
 * lives, so a page can point at it without pulling in the drawing code.
 */
export interface OgImage {
  /** Where the build writes it, from the site root. */
  path: string;
  /** Read out by screen readers. The district and service cards have none. */
  alt?: string;
}

export const OG_SIZE = { width: 1200, height: 630 };

/** Every page that has no card of its own. */
export const OG_DEFAULT: OgImage = {
  path: "/og/default.png",
  alt: "LP Stamp Paper — stamp paper and rental agreements across Tamil Nadu",
};

export const OG_RENTAL: OgImage = {
  path: "/og/rental-agreement.png",
  alt: "Rental agreements in all 38 districts of Tamil Nadu",
};

export const OG_STAMP: OgImage = {
  path: "/og/stamp-paper.png",
  alt: "Stamp paper delivered to all 38 districts of Tamil Nadu",
};

export const ogRentalDistrict = (slug: string): OgImage => ({ path: `/og/rental-agreement/${slug}.png` });
export const ogStampDistrict = (slug: string): OgImage => ({ path: `/og/stamp-paper/${slug}.png` });
export const ogService = (slug: string): OgImage => ({ path: `/og/services/${slug}.png` });
