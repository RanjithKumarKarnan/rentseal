import Link from "@/components/ui/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { DISTRICTS } from "@/lib/districts";
import { FOOTER_LINKS, LEAD_ANCHOR, SITE, TRUST_SIGNALS } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

function SocialLink({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-white/12 bg-white/5 text-white/60 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      {/* soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-brand-600/12 blur-[120px]"
      />

      <div className="relative">
        {/* CTA band */}
        <div className="container-page border-b border-white/10 py-14">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-[clamp(1.6rem,3.2vw,2.15rem)] leading-[1.15] font-bold text-white">
                Your agreement is ten minutes away.
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/60">
                Start drafting for free. You only pay when you are happy with every clause —
                and you can see the whole document before you do.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href={LEAD_ANCHOR} size="lg">
                Start my order
              </ButtonLink>
              <ButtonLink
                href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                size="lg"
                className="border border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
                variant="ghost"
              >
                Message us on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="container-page grid grid-cols-2 gap-x-8 gap-y-12 pt-16 pb-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo inverted showTag />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/55">
              {SITE.legalName} builds legal documents that ordinary people can read.
              Registered in Chennai, serving every district in Tamil Nadu.
            </p>

            <div className="mt-6 space-y-2.5 text-[13.5px] text-white/60">
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Phone className="size-4 shrink-0 text-brand-400" />
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Mail className="size-4 shrink-0 text-brand-400" />
                {SITE.email}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <MessageCircle className="size-4 shrink-0 text-emerald-400" />
                WhatsApp support
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <span className="leading-relaxed">{SITE.address}</span>
              </p>
            </div>

            <div className="mt-7 flex gap-2">
              {SITE.social.x ? (
                <SocialLink
                  href={SITE.social.x}
                  label={`${SITE.name} on X`}
                  path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                />
              ) : null}
              {SITE.social.linkedin ? (
                <SocialLink
                  href={SITE.social.linkedin}
                  label={`${SITE.name} on LinkedIn`}
                  path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"
                />
              ) : null}
              {SITE.social.instagram ? (
                <SocialLink
                  href={SITE.social.instagram}
                  label={`${SITE.name} on Instagram`}
                  path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"
                />
              ) : null}
              {SITE.social.youtube ? (
                <SocialLink
                  href={SITE.social.youtube}
                  label={`${SITE.name} on YouTube`}
                  path="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"
                />
              ) : null}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[12px] font-bold tracking-[0.14em] text-white/40 uppercase">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[13.5px] leading-snug text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* District links — the full location matrix, kept as strips so the
            columns above still divide evenly */}
        <div className="container-page border-t border-white/10 py-8">
          <h3 className="text-[12px] font-bold tracking-[0.14em] text-white/40 uppercase">
            Rental agreements by district
          </h3>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
            {DISTRICTS.map((district) => (
              <Link
                key={district.slug}
                href={`/rental-agreement/${district.slug}`}
                className="text-[13.5px] text-white/55 transition-colors hover:text-white"
              >
                {district.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="container-page border-t border-white/10 py-8">
          <h3 className="text-[12px] font-bold tracking-[0.14em] text-white/40 uppercase">
            Stamp paper by district
          </h3>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
            {DISTRICTS.map((district) => (
              <Link
                key={district.slug}
                href={`/stamp-paper/${district.slug}`}
                className="text-[13.5px] text-white/55 transition-colors hover:text-white"
              >
                {district.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="container-page border-t border-white/10 py-7">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {TRUST_SIGNALS.map((signal) => (
              <span key={signal} className="flex items-center gap-1.5 text-[12.5px] text-white/45">
                <ShieldCheck className="size-3.5 text-emerald-400/80" />
                {signal}
              </span>
            ))}
          </div>
        </div>

        {/* Legal bottom */}
        <div className="container-page border-t border-white/10 py-7">
          <div className="flex flex-col gap-4 text-[12.5px] text-white/40 lg:flex-row lg:items-center lg:justify-between">
            <p>
              © {year} {SITE.legalName}
              {SITE.cin ? ` · CIN ${SITE.cin}` : ""}
              {SITE.gstin ? ` · GSTIN ${SITE.gstin}` : ""}
              {SITE.udyam ? ` · Udyam ${SITE.udyam}` : ""}
            </p>
            <p className="max-w-3xl leading-relaxed">
              LP Stamp Paper is a technology platform, not a law firm, and does not provide legal
              representation. Notary attestation is performed by an independent notary
              public appointed under the Notaries Act, 1952.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
