import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "@/components/ui/link";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { BUILDER_START, LEAD_ANCHOR, NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SearchDialog } from "@/components/site/search-dialog";

/** Scroll position is external state, so subscribe to it rather than mirroring it. */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function Header() {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  // Navigating away closes any open menu. Adjusting during render is the
  // documented way to reset state on a prop change — no extra pass needed.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
    setSearchOpen(false);
  }

  // Lock the page behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const isTyping = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        el.isContentEditable);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenMenu(null);
      }
      // ⌘K / Ctrl+K anywhere, or "/" when the user is not already in a field.
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setMobileOpen(false);
        setSearchOpen(true);
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !isTyping(e.target)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Announcement strip */}
      <div className="relative z-50 hidden bg-navy-950 text-white lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[12.5px]">
          <p className="flex items-center gap-2 text-white/75">
            <span className="relative inline-flex size-1.5 text-emerald-400">
              <span className="pulse-ring" />
              <span className="size-1.5 rounded-full bg-emerald-400" />
            </span>
            Serving all 38 districts of Tamil Nadu — non-judicial stamp paper delivered, same day in Chennai.
          </p>
          <div className="flex items-center gap-5 text-white/60">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="size-3.5" />
              {SITE.phone}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
              className="transition-colors hover:text-white"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-line/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_20px_-8px_rgb(15_23_42/0.18)]"
            : "border-b border-transparent bg-white/0",
        )}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <nav className="container-page flex h-[68px] items-center justify-between gap-6" aria-label="Main">
          <Logo className="shrink-0" />

          {/* The full row needs the 1200px an xl screen gives it — six links, the
              search field and the call to action. From 1024 to 1279 it ran
              past the edge and the page scrolled sideways, so those widths get
              the menu button the phone gets. */}
          <ul className="hidden shrink-0 items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((link) => {
              if (!("items" in link)) {
                const active = pathname === link.href;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-[14.5px] font-medium whitespace-nowrap transition-colors",
                        active ? "text-brand-700" : "text-navy-600 hover:bg-navy-100/70 hover:text-navy-950",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = openMenu === link.label;
              return (
                <li key={link.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onMouseEnter={() => setOpenMenu(link.label)}
                    onClick={() => setOpenMenu(isOpen ? null : link.label)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-3 py-2 text-[14.5px] font-medium whitespace-nowrap transition-colors",
                      isOpen ? "bg-navy-100/70 text-navy-950" : "text-navy-600 hover:bg-navy-100/70 hover:text-navy-950",
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn("size-3.5 transition-transform duration-300", isOpen && "rotate-180")}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 w-[440px] -translate-x-1/2 pt-3"
                      >
                        <div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift">
                          {link.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-navy-50"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-navy-950">
                                  {item.title}
                                  <ArrowRight className="size-3.5 -translate-x-1 text-brand-600 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                                </span>
                                <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">
                                  {item.desc}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2.5">
            {/*
              The icon at every width. A 170px "Search… ⌘K" field sat here on
              desktop, but the header's content box is 1200px at any screen
              size, and with the nav naming "Non-judicial stamp paper" in full
              the row came to 1269px — the call to action ran off the grid.
              ⌘K and / still open search from anywhere; the tooltip says so.
            */}
            <Button
              variant="secondary"
              size="sm"
              className="!px-2.5"
              aria-label="Search the site"
              title="Search (⌘K)"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-[18px]" />
            </Button>
            <ButtonLink href={BUILDER_START} size="sm" className="hidden sm:inline-flex">
              Create agreement
              <ArrowRight className="size-4" />
            </ButtonLink>
            <Button
              variant="secondary"
              size="sm"
              className="!px-2.5 xl:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </nav>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-navy-950/45 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 right-0 flex w-[min(400px,88vw)] flex-col bg-white shadow-lift"
            >
              <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-5">
                <Logo />
                <Button
                  variant="ghost"
                  size="sm"
                  className="!px-2.5"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="scroll-slim flex-1 overflow-y-auto px-5 py-6">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="mb-2 flex w-full items-center gap-2.5 rounded-xl border border-line bg-canvas px-4 py-3 text-[15px] font-medium text-navy-500"
                >
                  <Search className="size-[18px]" />
                  Search non-judicial stamp paper, agreements…
                </button>
                {NAV_LINKS.map((link) => (
                  <div key={link.label} className="mb-7">
                    {"items" in link ? (
                      <>
                        <p className="mb-2.5 text-[11px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                          {link.label}
                        </p>
                        <div className="space-y-0.5">
                          {link.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-navy-50"
                            >
                              <span className="block text-[15px] font-semibold text-navy-950">
                                {item.title}
                              </span>
                              <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className="block rounded-xl px-3 py-2.5 text-[16px] font-semibold text-navy-950 transition-colors hover:bg-navy-50"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="shrink-0 space-y-2.5 border-t border-line bg-navy-50/60 p-5">
                <ButtonLink href={BUILDER_START} size="lg" fullWidth>
                  Create agreement
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href={LEAD_ANCHOR} variant="secondary" size="lg" fullWidth>
                  Order non-judicial stamp paper
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  variant="ghost"
                  size="lg"
                  fullWidth
                >
                  Get a quote on WhatsApp
                </ButtonLink>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 pt-1 text-[13.5px] font-medium text-navy-500"
                >
                  <Phone className="size-4" />
                  {SITE.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
