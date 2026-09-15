import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Link from "@/components/ui/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CornerDownLeft, MapPin, Search, X } from "lucide-react";
import { POPULAR_SEARCHES, search, type DocKind } from "@/lib/search";
import { cn } from "@/lib/utils";

const KIND_STYLE: Record<DocKind, string> = {
  District: "bg-brand-50 text-brand-700 border-brand-200/80",
  Agreement: "bg-violet-50 text-violet-700 border-violet-200/80",
  "Stamp paper": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Page: "bg-navy-100 text-navy-600 border-line",
  Question: "bg-amber-50 text-amber-700 border-amber-200/80",
};

/**
 * Site search. The index is static and lives in lib/search.ts, so this runs
 * entirely in the browser with no request per keystroke.
 */
export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => search(query, 8), [query]);

  // Both of these reset state in response to a change, which React does during
  // render rather than in an effect — same pattern the Header uses to close its
  // menus on navigation. Doing it in an effect would cause a cascading render.
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActive(0);
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setActive(0);
  }

  // Focus and scroll-lock are external systems, so they stay in an effect.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = useCallback(
    (href: string) => {
      onClose();
      navigate(href);
    },
    [onClose, navigate],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active].href);
      else if (query.trim().length > 1) go(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current?.querySelectorAll("li")[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-navy-950/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search LP Stamp Paper"
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 top-[10vh] mx-auto max-w-2xl overflow-hidden rounded-2xl border border-line bg-white shadow-lift sm:inset-x-6"
            onKeyDown={onKeyDown}
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
              <Search className="size-[18px] shrink-0 text-navy-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search districts, agreements, stamp paper…"
                aria-label="Search"
                autoComplete="off"
                className="h-14 flex-1 bg-transparent text-[15.5px] text-navy-950 outline-none placeholder:text-navy-400 [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="grid size-7 shrink-0 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[min(62vh,28rem)] overflow-y-auto overscroll-contain">
              {query.trim().length < 2 ? (
                <div className="p-5">
                  <p className="text-[12px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                    Popular searches
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-line bg-canvas px-3.5 py-2 text-[13.5px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:bg-white hover:text-brand-700"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-[15px] font-semibold text-navy-950">
                    Nothing matched “{query.trim()}”
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-navy-500">
                    Try a district, a town, an agreement type or a denomination — for example
                    Madurai, Hosur, lease deed or ₹100.
                  </p>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                  >
                    Ask us instead
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <ul ref={listRef} className="p-2">
                  {results.map((r, i) => (
                    <li key={r.id}>
                      <Link
                        href={r.href}
                        onClick={onClose}
                        onMouseEnter={() => setActive(i)}
                        aria-current={i === active ? "true" : undefined}
                        className={cn(
                          "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                          i === active ? "bg-brand-50/70" : "hover:bg-navy-50",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border",
                            KIND_STYLE[r.kind],
                          )}
                        >
                          {r.kind === "District" ? (
                            <MapPin className="size-4" />
                          ) : (
                            <Search className="size-4" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[14.5px] font-semibold text-navy-950">
                              {r.title}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-bold tracking-wide uppercase",
                                KIND_STYLE[r.kind],
                              )}
                            >
                              {r.kind}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[13px] text-navy-500">
                            {r.description}
                          </span>
                        </span>
                        {i === active ? (
                          <CornerDownLeft className="mt-1 size-3.5 shrink-0 text-navy-300" />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas/70 px-4 py-2.5 sm:px-5">
              <p className="hidden items-center gap-3 text-[12px] text-navy-400 sm:flex">
                <span>
                  <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-sans">↑↓</kbd>{" "}
                  navigate
                </span>
                <span>
                  <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-sans">↵</kbd>{" "}
                  open
                </span>
                <span>
                  <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-sans">esc</kbd>{" "}
                  close
                </span>
              </p>
              {query.trim().length > 1 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700"
                >
                  See all results
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                <span className="ml-auto text-[12px] text-navy-400">
                  Search all 38 districts
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
