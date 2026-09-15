"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, OptionCards, Select, Textarea } from "@/components/ui/field";
import { enquiryRow } from "@/lib/orders";
import { CITIES } from "@/lib/site";
import { submitOrder } from "@/lib/submit-order";

type Topic = "new" | "existing" | "bulk" | "other";

/** How the topic reads in the order mail, so the office knows what it is answering. */
const TOPIC_LABEL: Record<Topic, string> = {
  new: "question about a new agreement",
  existing: "an agreement already made",
  bulk: "bulk or broker pricing",
  other: "something else",
};

export function ContactForm() {
  const [topic, setTopic] = useState<Topic>("new");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    // The field shows a +91 prefix, so a number typed with one is still ten digits.
    const phone = value("phone").replace(/\D/g, "").slice(-10);
    if (phone.length !== 10) {
      setError("Please enter a 10-digit mobile number so we can call you back.");
      return;
    }
    setError("");
    setSending(true);

    const agreementId = value("agreementId");
    try {
      // Same order desk as every other form on the site — email and Telegram —
      // as an enquiry the office answers by phone or WhatsApp.
      await submitOrder(
        enquiryRow({
          need: `Contact form: ${TOPIC_LABEL[topic]}`,
          name: value("name"),
          phone,
          email: value("email"),
          city: value("city"),
          message: agreementId ? `Agreement ${agreementId}. ${value("message")}` : value("message"),
        }),
      );
      setSending(false);
      setSent(true);
    } catch {
      // Saying "got it" for a message that never reached the office would leave
      // someone waiting for a reply that is never going to come.
      setSending(false);
      setError(
        "We could not send that just now. Please call or WhatsApp us on the numbers beside this form.",
      );
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-500">
          <CheckCircle2 className="size-7 text-white" />
        </span>
        <h2 className="mt-5 font-display text-[20px] font-bold text-navy-950">
          Got it — we&apos;ll come back to you today
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-navy-600">
          Someone from the team will reply on WhatsApp and email, usually within a couple of
          hours during working hours. If it is urgent, call us — the number is on the right.
        </p>
        <Button variant="secondary" size="md" className="mt-6" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8" onSubmit={submit}>
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-[13.5px] font-semibold text-navy-800">
            What is this about?
          </p>
          <OptionCards
            name="Topic"
            value={topic}
            onChange={setTopic}
            options={[
              { value: "new" as const, label: "A new agreement", desc: "Question before I start" },
              { value: "existing" as const, label: "An agreement I made", desc: "Change, refund or reissue" },
              { value: "bulk" as const, label: "Bulk or broker pricing", desc: "25+ agreements a month" },
              { value: "other" as const, label: "Something else", desc: "Partnership, press, careers" },
            ]}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" required>
            {(id) => <Input id={id} name="name" required placeholder="Lakshmi Narayanan" />}
          </Field>
          <Field label="Mobile number" required error={error}>
            {(id) => (
              <Input id={id} name="phone" required inputMode="tel" prefix="+91" placeholder="98400 00000" />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email address" required>
            {(id) => <Input id={id} name="email" type="email" required placeholder="name@example.com" />}
          </Field>
          <Field label="City">
            {(id) => (
              <Select id={id} name="city" defaultValue="Chennai">
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="other">Somewhere else in Tamil Nadu</option>
              </Select>
            )}
          </Field>
        </div>

        {topic === "existing" ? (
          <Field label="Agreement number" help="Starts with RS — it's on your invoice and in your dashboard.">
            {(id) => <Input id={id} name="agreementId" placeholder="LP-2026-448120" />}
          </Field>
        ) : null}

        <Field label="How can we help?" required>
          {(id) => (
            <Textarea
              id={id}
              name="message"
              required
              rows={5}
              placeholder="Tell us what you're trying to do. The more specific you are, the more useful our answer will be."
            />
          )}
        </Field>

        <Button type="submit" size="lg" fullWidth disabled={sending}>
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-[18px]" />
              Send message
            </>
          )}
        </Button>

        <p className="text-center text-[12.5px] leading-relaxed text-navy-400">
          We reply to everything, usually within two hours during working hours. Your details are
          used only to answer you — never added to a marketing list.
        </p>
      </div>
    </form>
  );
}
