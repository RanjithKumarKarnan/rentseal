import type { PageMeta } from "@/seo/meta";
import { Clock3, Mail, MapPin, MessageCircle, Phone, Scale } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/ui/motion";
import { SITE } from "@/lib/site";

export const meta: PageMeta = {
  title: "Contact Us — Talk to Us in Tamil or English",
  description:
    `Call, WhatsApp, email or use the form, in Tamil or English, for non-judicial stamp paper and agreements. ${SITE.hours.summary.replace(" · ", ", ")}.`,
  alternates: { canonical: "/contact" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Contact" }];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        icon={MessageCircle}
        crumbs={CRUMBS}
        title="Ask us before you pay, not after"
        body="We would rather spend ten minutes talking you out of something you don't need than process a refund next week. Tamil and English, Monday to Saturday."
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-4">
                <div className="rounded-2xl border border-line bg-navy-950 p-6 text-white">
                  <h2 className="font-display text-[17px] font-bold">Faster than the form</h2>
                  <div className="mt-5 space-y-2.5">
                    <a
                      href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.07] px-4 py-3.5 transition-colors hover:bg-white/[0.12]"
                    >
                      <MessageCircle className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <span>
                        <span className="block text-[14px] font-semibold">
                          WhatsApp {SITE.whatsapp}
                        </span>
                        <span className="block text-[12px] text-white/45">
                          Median reply time: 4 minutes
                        </span>
                      </span>
                    </a>
                    <a
                      href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.07] px-4 py-3.5 transition-colors hover:bg-white/[0.12]"
                    >
                      <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" />
                      <span>
                        <span className="block text-[14px] font-semibold">{SITE.phone}</span>
                        <span className="block text-[12px] text-white/45">
                          Tamil and English, {SITE.hours.short}
                        </span>
                      </span>
                    </a>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.07] px-4 py-3.5 transition-colors hover:bg-white/[0.12]"
                    >
                      <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" />
                      <span>
                        <span className="block text-[14px] font-semibold">{SITE.email}</span>
                        <span className="block text-[12px] text-white/45">
                          Replies same working day
                        </span>
                      </span>
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-white p-6">
                  <h2 className="flex items-center gap-2 font-display text-[15.5px] font-bold text-navy-950">
                    <Clock3 className="size-4 text-brand-600" />
                    When we&apos;re available
                  </h2>
                  <dl className="mt-4 space-y-2.5 text-[13.5px]">
                    {[
                      ["Monday – Saturday", "9:30 am – 5:00 pm"],
                      ["Sunday", "Closed"],
                    ].map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between">
                        <dt className="text-navy-500">{day}</dt>
                        <dd className="font-semibold text-navy-900">{hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-2xl border border-line bg-white p-6">
                  <h2 className="flex items-center gap-2 font-display text-[15.5px] font-bold text-navy-950">
                    <MapPin className="size-4 text-brand-600" />
                    Registered office
                  </h2>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-navy-600">
                    {SITE.legalName}
                    <br />
                    {SITE.address}
                  </p>
                  <p className="mt-3 text-[12.5px] text-navy-400">
                    Visits by appointment only — almost everything is faster on WhatsApp.
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6">
                  <h2 className="flex items-center gap-2 font-display text-[15.5px] font-bold text-brand-900">
                    <Scale className="size-4" />
                    Premium customers
                  </h2>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-800">
                    Your agreement has been notarised. The notary’s details are on the
                    dashboard under the agreement — call them, not us.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
