import { Delete, X } from "lucide-react";

/**
 * An on-screen Tamil keyboard.
 *
 * Phonetic typing only helps somebody who already knows that "veedu" gives
 * வீடு. This is for everyone else, and for the letters nobody remembers the
 * spelling of — ழ against ள against ல.
 *
 * Tamil is written as a consonant followed by a vowel sign, so the keys are
 * laid out the way the script is built rather than as 216 composite letters:
 * pick க, then pick ா, and கா is what you get. The signs are shown attached to
 * a dotted circle, which is how they appear in a chart and how they are taught.
 */

const VOWELS = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ", "ஃ"];

/** Combining signs. The label shows the sign on a dotted circle; the value is the sign alone. */
const SIGNS: Array<[string, string]> = [
  ["ா", "ா"], ["ி", "ி"], ["ீ", "ீ"], ["ு", "ு"], ["ூ", "ூ"], ["ெ", "ெ"],
  ["ே", "ே"], ["ை", "ை"], ["ொ", "ொ"], ["ோ", "ோ"], ["ௌ", "ௌ"], ["்", "்"],
];

const CONSONANTS = [
  "க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந", "ப", "ம",
  "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன",
];

/** Grantha letters, for the sounds Tamil borrows. */
const GRANTHA = ["ஜ", "ஷ", "ஸ", "ஹ", "க்ஷ", "ஶ்ரீ"];

function Key({
  label,
  onPress,
  wide = false,
}: {
  label: React.ReactNode;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      // The field must keep focus, or the caret position is lost the moment a
      // key is pressed and every letter lands at the end.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPress}
      className={`grid ${wide ? "px-3" : "w-9"} h-9 shrink-0 place-items-center rounded-lg border border-line bg-white text-[15px] text-navy-900 transition-colors hover:border-brand-400 hover:bg-brand-50 active:bg-brand-100`}
    >
      {label}
    </button>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10.5px] font-bold tracking-[0.1em] text-navy-400 uppercase">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function TamilKeyboard({
  onInsert,
  onBackspace,
  onClose,
}: {
  onInsert: (text: string) => void;
  onBackspace: () => void;
  onClose: () => void;
}) {
  return (
    <div className="mt-2 rounded-xl border border-line bg-canvas p-3.5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-semibold text-navy-600">
          தமிழ் விசைப்பலகை — pick a letter, then its vowel sign
        </p>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          aria-label="Close the Tamil keyboard"
          className="rounded-lg p-1 text-navy-400 transition-colors hover:bg-white hover:text-navy-700"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Row title="மெய் — consonants">
          {CONSONANTS.map((c) => (
            <Key key={c} label={c} onPress={() => onInsert(c)} />
          ))}
        </Row>

        <Row title="உயிர் — vowels">
          {VOWELS.map((v) => (
            <Key key={v} label={v} onPress={() => onInsert(v)} />
          ))}
        </Row>

        <Row title="குறியீடு — vowel signs">
          {SIGNS.map(([label, value]) => (
            <Key key={value} label={<span>&#x25CC;{label}</span>} onPress={() => onInsert(value)} />
          ))}
        </Row>

        <Row title="கிரந்தம் — grantha">
          {GRANTHA.map((g) => (
            <Key key={g} label={g} onPress={() => onInsert(g)} />
          ))}
          <Key label="space" wide onPress={() => onInsert(" ")} />
          <Key label={<Delete className="size-4" />} wide onPress={onBackspace} />
        </Row>
      </div>
    </div>
  );
}
