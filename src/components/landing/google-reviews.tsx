import { useState } from "react";
import { ArrowUpRight, Pause, Play, Star } from "lucide-react";
import { GOOGLE_RATING, GOOGLE_REVIEWS, type GoogleReview } from "@/lib/google-reviews";

function Stars({ className = "size-3.5" }: { className?: string }) {
  return (
    <span className="flex text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} fill-current`} />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_-16px_rgb(15_23_42/0.25)] sm:w-[340px]">
      <div className="flex items-center justify-between gap-3">
        <Stars />
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-brand-700">
          {review.topic}
        </span>
      </div>
      <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-navy-700">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5 text-[13px]">
        <span className="grid size-8 place-items-center rounded-full bg-navy-100 font-bold text-navy-600">
          {review.name.charAt(0)}
        </span>
        <span>
          <span className="block font-semibold text-navy-800">{review.name}</span>
          <span className="block text-navy-400">Google review · {review.when}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Customer reviews from the shop's Google listing, as a slow running banner.
 *
 * The trust bar's old marquee was removed for running forever with no way to
 * stop it (WCAG 2.2.2). This one keeps the banner the owner asked for but
 * answers that: it pauses while hovered or focused, has a visible pause
 * button, and for anyone with reduced motion turned on it is a plain row they
 * scroll themselves. The second copy of the cards exists only to hide the
 * loop's seam, so it is hidden from screen readers.
 */
export function GoogleReviews() {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-labelledby="google-reviews-heading" className="overflow-hidden border-b border-line bg-canvas py-12 md:py-16">
      <div className="container-page flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[12px] font-bold tracking-[0.16em] text-brand-600 uppercase">
            What customers say on Google
          </p>
          <h2 id="google-reviews-heading" className="mt-2 text-[clamp(1.5rem,3vw,2rem)] leading-tight font-bold text-navy-900">
            Rated {GOOGLE_RATING.rating} by {GOOGLE_RATING.count} customers
          </h2>
          <div className="mt-2 flex items-center gap-2 text-[14px] text-navy-500">
            <Stars className="size-4" />
            <span>
              {GOOGLE_RATING.rating} out of 5 on Google Maps · our Mogappair West counter
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="reviews-toggle inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[13px] font-semibold text-navy-600 transition-colors hover:border-navy-300"
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            {paused ? "Play" : "Pause"}
          </button>
          <a
            href={GOOGLE_RATING.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-brand-700 ring-1 ring-line transition-colors hover:ring-brand-300"
          >
            Read all reviews on Google
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="reviews-marquee mt-8" data-paused={paused || undefined}>
        {/* Two identical groups, each padded by one gap on its right, so
            sliding the track by exactly half its width lands on the seam. */}
        <div className="reviews-track flex w-max">
          <div className="flex gap-4 pr-4">
            {GOOGLE_REVIEWS.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>
          <div className="reviews-clone flex gap-4 pr-4" aria-hidden="true">
            {GOOGLE_REVIEWS.map((review) => (
              <ReviewCard key={`${review.name}-clone`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
