import { useLayoutEffect, useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import { Input, Textarea } from "./field";
import { TamilKeyboard } from "./tamil-keyboard";
import { transliterate } from "@/lib/tamil-input";

/**
 * Typing Tamil into an English form.
 *
 * A Tamil deed with an English-only form asks the customer to produce Tamil
 * from somewhere else — their phone's keyboard, or a copy and paste. So when a
 * Tamil template is being drafted these fields offer two ways in:
 *
 *   அ  romanised typing, converted as it goes: "chennai" becomes சென்னை.
 *   ⌨  an on-screen Tamil keyboard, for anyone who does not know the
 *      romanised conventions or cannot remember ழ from ள.
 *
 * The romanised text is kept alongside the Tamil, because the conversion is not
 * reversible — "த" could have come from "tha" or "dha", and re-deriving it on
 * every keystroke would fight the user. Pasting Tamil straight in still works:
 * an edit that is not a simple append or backspace drops the buffer and takes
 * the text as given.
 */
function useTamilTyping(value: string, onChange: (next: string) => void, enabled: boolean) {
  const [roman, setRoman] = useState("");

  const handle = (next: string) => {
    if (!enabled) return onChange(next);

    if (next.length > value.length && next.startsWith(value)) {
      const buffer = roman + next.slice(value.length);
      setRoman(buffer);
      return onChange(transliterate(buffer));
    }

    // A single backspace at the end. Anything larger — select-all and delete,
    // or a cut — is not one keystroke, and dropping one romanised character for
    // it left the buffer stale: clearing the field and retyping rebuilt the old
    // text on top of the new ("ச்ரீ நிலய" + "ஸ்ரீ நிலயம்").
    if (next.length === value.length - 1 && value.startsWith(next)) {
      if (!roman) return onChange(next);
      const buffer = roman.slice(0, -1);
      setRoman(buffer);
      return onChange(transliterate(buffer));
    }

    setRoman("");
    return onChange(next);
  };

  // Anything the on-screen keyboard puts in is already Tamil, so the romanised
  // buffer no longer describes the field and has to be dropped.
  return { handle, clearBuffer: () => setRoman("") };
}

/**
 * Inserting at the caret rather than at the end, so the keyboard can be used to
 * correct a letter in the middle of a name.
 */
function useCaretInsert(
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  value: string,
  onChange: (next: string) => void,
  afterChange: () => void,
) {
  // Where the caret should sit once React has re-rendered with the new value.
  // Setting it straight after onChange does not survive: the re-render puts the
  // caret at the end, which sends the next letter to the end of the field.
  const pending = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pending.current === null || !ref.current) return;
    const caret = Math.min(pending.current, value.length);
    ref.current.focus();
    ref.current.setSelectionRange(caret, caret);
    pending.current = null;
  }, [value, ref]);

  const insert = (text: string) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    pending.current = start + text.length;
    onChange(value.slice(0, start) + text + value.slice(end));
    afterChange();
  };

  const backspace = () => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    if (start === 0 && start === end) return;
    const from = start === end ? start - 1 : start;
    pending.current = from;
    onChange(value.slice(0, from) + value.slice(end));
    afterChange();
  };

  return { insert, backspace };
}

function Switches({
  phonetic,
  onPhonetic,
  keyboard,
  onKeyboard,
  top,
}: {
  phonetic: boolean;
  onPhonetic: () => void;
  keyboard: boolean;
  onKeyboard: () => void;
  top?: boolean;
}) {
  const base = top
    ? "absolute top-2 right-2 flex gap-1"
    : "absolute top-1/2 right-2 flex -translate-y-1/2 gap-1";
  const style = (on: boolean) =>
    on
      ? "grid h-7 place-items-center rounded-lg bg-brand-600 px-2 text-[11px] font-bold text-white"
      : "grid h-7 place-items-center rounded-lg border border-line px-2 text-[11px] font-bold text-navy-400 transition-colors hover:text-navy-700";
  return (
    <div className={base}>
      <button
        type="button"
        onClick={onPhonetic}
        aria-pressed={phonetic}
        title={phonetic ? "Tamil typing is on — type as it sounds" : "Type in Tamil as it sounds"}
        className={style(phonetic)}
      >
        அ
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onKeyboard}
        aria-pressed={keyboard}
        title="Tamil keyboard"
        className={style(keyboard)}
      >
        <Keyboard className="size-3.5" />
      </button>
    </div>
  );
}

interface Props {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  /** Whether this deed is in Tamil at all. Off, these behave as plain fields. */
  tamil?: boolean;
  className?: string;
}

export function TamilInput({ id, value, onChange, placeholder, tamil = false, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [phonetic, setPhonetic] = useState(tamil);
  const [board, setBoard] = useState(false);
  const { handle, clearBuffer } = useTamilTyping(value, onChange, tamil && phonetic);
  const { insert, backspace } = useCaretInsert(ref, value, onChange, clearBuffer);

  if (!tamil) {
    return (
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => handle(e.target.value)}
          placeholder={phonetic ? "type as it sounds — chennai" : placeholder}
          className={`pr-[76px] ${className ?? ""}`}
        />
        <Switches
          phonetic={phonetic}
          onPhonetic={() => setPhonetic((v) => !v)}
          keyboard={board}
          onKeyboard={() => setBoard((v) => !v)}
        />
      </div>
      {board ? (
        <TamilKeyboard onInsert={insert} onBackspace={backspace} onClose={() => setBoard(false)} />
      ) : null}
    </div>
  );
}

export function TamilTextarea({ id, value, onChange, placeholder, tamil = false, className }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [phonetic, setPhonetic] = useState(tamil);
  const [board, setBoard] = useState(false);
  const { handle, clearBuffer } = useTamilTyping(value, onChange, tamil && phonetic);
  const { insert, backspace } = useCaretInsert(ref, value, onChange, clearBuffer);

  if (!tamil) {
    return (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <div>
      <div className="relative">
        <Textarea
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => handle(e.target.value)}
          placeholder={phonetic ? "type as it sounds — chennai" : placeholder}
          className={`pr-[76px] ${className ?? ""}`}
        />
        <Switches
          phonetic={phonetic}
          onPhonetic={() => setPhonetic((v) => !v)}
          keyboard={board}
          onKeyboard={() => setBoard((v) => !v)}
          top
        />
      </div>
      {board ? (
        <TamilKeyboard onInsert={insert} onBackspace={backspace} onClose={() => setBoard(false)} />
      ) : null}
    </div>
  );
}
