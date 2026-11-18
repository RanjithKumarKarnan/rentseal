/**
 * Real Google reviews of the counter — L P Enterprises Stamp Paper Xerox
 * Typing, Mogappair West — copied from its Google Maps listing on
 * 18 November 2026.
 *
 * Every quote here was written by the named customer and can be found on that
 * listing. Trims are marked with "…"; nothing is reworded. This site once
 * carried invented testimonials (see components/landing/commitments.tsx), so
 * the rule is: if it is not on Google, it does not go here. Names are shortened
 * to a first name and initial, as the reviewers may not want their full name
 * on another site.
 *
 * The rating and count drift as new reviews arrive. Update `GOOGLE_RATING`
 * from the listing when adding reviews — a stale "54 reviews" is harmless, a
 * rating higher than Google shows is not.
 */
export const GOOGLE_RATING = {
  rating: 4.8,
  count: 54,
  asOf: "2026-11-18",
  /** The listing itself, by its Maps CID, so "Read all reviews" lands on it. */
  url: "https://maps.google.com/?cid=1949283509766650189",
} as const;

export type GoogleReview = {
  name: string;
  when: string;
  text: string;
  /** What the customer came in for, shown as a small tag. */
  topic: string;
};

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: "Manojkumar S.",
    when: "Nov 2026",
    topic: "Stamp paper delivery",
    text: "Found them on Google Maps and have purchased stamp paper from them before too. This time requested delivery through Porter, and they sent it safely and on time. Good service and quick response!",
  },
  {
    name: "Beaulin T.",
    when: "Nov 2026",
    topic: "Rental agreement",
    text: "Quick and good. I went for preparing rental agreement. The lady was fast and the job was completed in 15 minutes",
  },
  {
    name: "Siva Rama Krishna V.",
    when: "Nov 2026",
    topic: "On-time delivery",
    text: "Thank you for the prompt services. Commitment to deliver on time, willingness to extend support is highly appreciated. Great work",
  },
  {
    name: "Jatwin",
    when: "Oct 2026",
    topic: "Rental agreement",
    text: "The rental agreement is cheap and superb. … does the work very fast. If he is not able to do it, he informs it beforehand instead of making us wait. Good job!!!",
  },
  {
    name: "Dinesh K.",
    when: "Nov 2026",
    topic: "Bulk order",
    text: "I Was got helped with a short time with huge orders … i really appreciate the mam and the sir who helped with the less time, great shop and much friendly.",
  },
  {
    name: "Karthik R.",
    when: "Nov 2026",
    topic: "Pricing",
    text: "Good service with reasonable prices",
  },
  {
    name: "Aravindan S.",
    when: "Oct 2026",
    topic: "Documents",
    text: "Had a good service from them, all documents facilities is available",
  },
  {
    name: "Selva",
    when: "Nov 2026",
    topic: "Xerox",
    text: "Finest xerox shop in mogappair by a mile.",
  },
];
