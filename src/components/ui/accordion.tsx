import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  q: string;
  a: string;
  category?: string;
}

export function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: readonly AccordionItem[];
  className?: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const baseId = useId();

  return (
    <div
      className={cn(
        "divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div key={item.q} className={cn("transition-colors", isOpen && "bg-navy-50/40")}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-start gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span className="flex-1 text-[15.5px] leading-snug font-semibold text-navy-950">
                  {item.q}
                </span>
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-45 border-brand-600 bg-brand-600 text-white"
                      : "border-line bg-white text-navy-500",
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.5} />
                </span>
              </button>
            </h3>

            {/*
              The answer stays mounted whether or not the panel is open, and is
              collapsed with height rather than unmounted.

              This is load-bearing for SEO. Every page that renders an Accordion
              also emits FAQPage structured data, and Google requires the marked-up
              answer to be present in the page HTML. Unmounting collapsed panels
              left only the one open answer in the DOM, so the schema described
              content that was not there — and on the district pages it threw away
              five sixths of the copy that makes each page distinct.
            */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={false}
              animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 pr-14 text-[14.5px] leading-[1.75] text-navy-600 sm:px-6 sm:pr-16">
                {item.a}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
