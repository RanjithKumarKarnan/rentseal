import { SITE } from "@/lib/site";

/**
 * The WhatsApp button, bottom right.
 *
 * Most people who want stamp paper would rather send a message than fill in a
 * form, and they will look in this corner for it because every other Indian
 * service site puts one there. It opens a chat with the counter's number and
 * carries an opening line, so the first thing the office sees is what the
 * person wants rather than "hi".
 *
 * Two bits of positioning worth keeping:
 *
 *   - On small screens it lifts clear of the sticky "Start my order" bar, which
 *     is fixed to the bottom edge below `lg`. Sitting on top of that bar would
 *     cover the primary call to action to offer a secondary one.
 *   - It sits below the header's z-40 and well below the search dialog, so an
 *     open dialog or menu is never competing with a floating green circle.
 */
export function WhatsAppFab() {
  const number = SITE.whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hi, I need non-judicial stamp paper / an agreement. Could you tell me the price and how soon I can get it?",
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at ${SITE.whatsapp}`}
      className="group fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pr-5 pl-3.5 text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.65)] transition-transform duration-300 hover:scale-[1.03] active:scale-100 sm:right-6 lg:bottom-6"
    >
      {/* The glyph, drawn rather than pulled from an icon set — lucide has no
          WhatsApp mark, and the brand is recognised by its own shape. */}
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 shrink-0 fill-current">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.15-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.29-.02-.45.13-.6.13-.13.3-.35.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.69 8.24-8.24 8.24z" />
      </svg>
      <span className="text-[14.5px] font-semibold whitespace-nowrap max-sm:sr-only">
        Chat on WhatsApp
      </span>
    </a>
  );
}
