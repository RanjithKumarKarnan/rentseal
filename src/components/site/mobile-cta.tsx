import { useEffect, useState } from "react";
import Link from "@/components/ui/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

/**
 * Bottom bar on small screens. Appears once the hero is out of the way and
 * hides itself while the lead form is actually on screen.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("get-started");

    const onScroll = () => {
      const pastHero = window.scrollY > 560;
      const formOnScreen = form
        ? (() => {
            const r = form.getBoundingClientRect();
            return r.top < window.innerHeight * 0.9 && r.bottom > 0;
          })()
        : false;
      setVisible(pastHero && !formOnScreen);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-white text-navy-700 transition-colors active:bg-navy-100"
              aria-label={`Call ${SITE.phone}`}
            >
              <Phone className="size-5" />
            </a>
            <Link
              href={LEAD_ANCHOR}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-[15px] font-semibold text-white shadow-[0_6px_20px_-6px_rgb(37_99_235/0.6)] active:bg-brand-700"
            >
              Start my order
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
