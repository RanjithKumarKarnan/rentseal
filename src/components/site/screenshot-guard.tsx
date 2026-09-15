import { useEffect, useState } from "react";
import { EyeOff } from "lucide-react";

/**
 * A deterrent, not a lock — and worth being honest about which.
 *
 * No web page can refuse a screenshot. Cmd+Shift+4 on macOS, PrtScn and
 * Win+Shift+S on Windows, and the hardware buttons on a phone are all handled
 * by the operating system, which never tells the page it happened and would not
 * take no for an answer if it did. Only a native app can block capture
 * (Android's FLAG_SECURE); the web has no equivalent and never has.
 *
 * What *is* reachable from here is the set of capture routes that pass through
 * the page on their way out:
 *
 *   - focus loss  — Win+Shift+S, the Snipping Tool, screen-share pickers and
 *                   most desktop capture utilities take focus or hide the tab
 *                   before they shoot. We blank the page while that is true.
 *                   macOS Cmd+Shift+4 does NOT, so it still gets a clean shot.
 *   - context menu — right-click, "Save image as", "Copy image".
 *   - copy / cut / drag — lifting the text or an image straight out.
 *   - PrintScreen  — the one capture key the page can actually see (Windows,
 *                   focused tab). We cannot stop the grab, only empty the
 *                   clipboard afterwards.
 *   - print        — Cmd+P → "Save as PDF" is a full-fidelity capture, and the
 *                   easiest one to actually close.
 *
 * Form fields keep normal selection and copy so the guard does not stop someone
 * copying their own phone number back out of the lead form.
 */
export function ScreenshotGuard({
  /** Blank the page whenever it loses focus or the tab is hidden. */
  obscureOnBlur = true,
  /** Suppress the right-click menu. */
  blockContextMenu = true,
  /** Suppress copy, cut and drag-out outside form fields. */
  blockCopy = true,
  /** Replace the printed page with a notice instead of the content. */
  blockPrint = true,
}: {
  obscureOnBlur?: boolean;
  blockContextMenu?: boolean;
  blockCopy?: boolean;
  blockPrint?: boolean;
} = {}) {
  const [obscured, setObscured] = useState(false);

  // Body classes drive the parts that have to be CSS: selection, the callout
  // menu on iOS, and the print stylesheet.
  useEffect(() => {
    const body = document.body;
    if (blockCopy) body.classList.add("guard-no-select");
    if (blockPrint) body.classList.add("guard-no-print");
    return () => {
      body.classList.remove("guard-no-select", "guard-no-print");
    };
  }, [blockCopy, blockPrint]);

  useEffect(() => {
    if (!obscureOnBlur) return;

    // Only start guarding once the page has actually been looked at. A tab
    // opened in the background with Cmd+click, a link preview, and a crawler
    // are all unfocused from the first frame — blanking those would hide the
    // page from people who never tried to capture anything.
    let armed = document.hasFocus();

    const hide = () => {
      if (armed) setObscured(true);
    };
    const show = () => {
      armed = true;
      setObscured(false);
    };
    const onVisibility = () =>
      document.visibilityState === "hidden" ? hide() : show();

    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [obscureOnBlur]);

  useEffect(() => {
    if (!blockContextMenu) return;
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, [blockContextMenu]);

  useEffect(() => {
    if (!blockCopy) return;
    // Typing into a field is not exfiltration — leave those alone.
    const inField = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

    const onCopy = (e: Event) => {
      if (!inField(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => e.preventDefault();

    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, [blockCopy]);

  useEffect(() => {
    // Windows only, and only while the tab has focus. The shot is already taken
    // by the time this fires — all we can do is not let it stay on the
    // clipboard, and say so.
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "PrintScreen") return;
      navigator.clipboard?.writeText("").catch(() => {});
      setObscured(true);
      window.setTimeout(() => setObscured(false), 1200);
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  return (
    <>
      {obscured ? (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-canvas/95 backdrop-blur-2xl">
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-line bg-white text-navy-500">
              <EyeOff className="size-5" />
            </span>
            <p className="text-[15px] font-bold text-navy-950">
              This page is hidden while it is not in front
            </p>
            <p className="max-w-xs text-[13px] leading-relaxed text-navy-500">
              Come back to the tab to carry on. Copies of your documents are sent
              to you by email and stay in your dashboard.
            </p>
          </div>
        </div>
      ) : null}

      {/* Swapped in for the whole page by the print stylesheet. */}
      <div className="guard-print-notice hidden">
        <p>
          This page cannot be printed. Once we have confirmed your order on the
          phone and taken payment, the stamped agreement is emailed to you as a
          PDF — print it from there.
        </p>
      </div>
    </>
  );
}
