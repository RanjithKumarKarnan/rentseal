import Link from "@/components/ui/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <Logo className="mb-12" />

      <div className="max-w-lg text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-line bg-white shadow-card">
          <FileQuestion className="size-7 text-brand-600" />
        </span>

        <p className="mt-8 font-display text-[13px] font-bold tracking-[0.16em] text-navy-400 uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-[clamp(1.9rem,5vw,2.7rem)] leading-[1.1] font-bold tracking-[-0.03em] text-navy-950">
          This page isn&apos;t here
        </h1>
        <p className="mt-4 text-[16px] leading-[1.7] text-navy-600">
          The link may be out of date, or we may have moved the page. Nothing you have created
          is affected.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            <ArrowLeft className="size-[18px]" />
            Back to the homepage
          </ButtonLink>
          <ButtonLink href={LEAD_ANCHOR} variant="secondary" size="lg">
            Start my order
          </ButtonLink>
        </div>

        <p className="mt-10 text-[13.5px] text-navy-400">
          Looking for something specific?{" "}
          <Link href="/contact" className="font-semibold text-brand-700 underline underline-offset-4">
            Ask us
          </Link>{" "}
          or call {SITE.phone}.
        </p>
      </div>
    </main>
  );
}
