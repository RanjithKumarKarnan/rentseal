import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, MessageSquare, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export function LoginForm() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendOtp = () => {
    if (phone.length !== 10) {
      setError("Enter the 10-digit mobile number you signed up with.");
      return;
    }
    setError("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStage("otp");
      setCountdown(RESEND_SECONDS);
      boxes.current[0]?.focus();
    }, 700);
  };

  const verify = (code: string) => {
    setBusy(true);
    setTimeout(() => navigate("/dashboard"), 900);
    void code;
  };

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) boxes.current[index + 1]?.focus();
    if (next.every((d) => d)) verify(next.join(""));
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      boxes.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) boxes.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) boxes.current[index + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    boxes.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    if (pasted.length === OTP_LENGTH) verify(pasted);
  };

  return (
    <AnimatePresence mode="wait">
      {stage === "phone" ? (
        <motion.div
          key="phone"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <Field label="Mobile number" required error={error}>
            {(id) => (
              <Input
                id={id}
                inputMode="tel"
                autoFocus
                prefix="+91"
                placeholder="98400 00000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            )}
          </Field>

          <Button size="lg" fullWidth onClick={sendOtp} disabled={busy} className="group">
            {busy ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending code…
              </>
            ) : (
              <>
                Send one-time code
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[12px] font-medium text-navy-400">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <Button variant="secondary" size="lg">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                />
              </svg>
              Google
            </Button>
            <Button variant="secondary" size="lg">
              <Mail className="size-4 text-navy-400" />
              Email link
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
            <MessageSquare className="mt-0.5 size-4 shrink-0 text-brand-600" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] text-navy-600">
                Code sent to{" "}
                <span className="font-semibold text-navy-950">
                  +91 {phone.slice(0, 5)} {phone.slice(5)}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStage("phone");
                  setOtp(Array(OTP_LENGTH).fill(""));
                }}
                className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 hover:underline"
              >
                <Pencil className="size-3" />
                Change number
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-[13.5px] font-semibold text-navy-800">
              Enter the 6-digit code
            </p>
            <div className="flex gap-2" onPaste={onPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  value={digit}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  className={cn(
                    "tnum h-14 w-full rounded-xl border bg-white text-center text-[20px] font-bold text-navy-950",
                    "transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12 focus:outline-none",
                    digit ? "border-brand-400" : "border-line",
                  )}
                />
              ))}
            </div>
          </div>

          <Button size="lg" fullWidth disabled={busy || otp.some((d) => !d)} onClick={() => verify(otp.join(""))}>
            {busy ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying…
              </>
            ) : (
              "Verify and sign in"
            )}
          </Button>

          <p className="text-center text-[13px] text-navy-500">
            {countdown > 0 ? (
              <>
                Resend code in <span className="tnum font-semibold text-navy-800">{countdown}s</span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(RESEND_SECONDS)}
                className="font-semibold text-brand-700 hover:underline"
              >
                Resend the code
              </button>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
