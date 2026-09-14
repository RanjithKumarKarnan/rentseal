/**
 * Telegram notifications for the order desk.
 *
 * Mail is the record; this is the nudge. An operator does not sit watching an
 * inbox, but a phone buzzes, and a lead that is answered in ten minutes is
 * worth more than the same lead answered tomorrow.
 *
 * It is also a second copy. When the Google Sheet was removed, mail became the
 * only place a lead landed, which meant SMTP going down took the whole order
 * form with it. A bot that receives the same lead puts that redundancy back,
 * and the two fail for entirely different reasons.
 *
 * Set up: docs/telegram-notifications.md
 */

/**
 * One bot, or several separated by commas. Two independent bots are a second
 * copy of the copy: they authenticate on different tokens and fail for
 * different reasons, so a lead survives one of them being revoked or rate
 * limited. Each bot sends to every chat it is a member of; a chat a bot has not
 * been added to simply rejects that one pair, and the others still deliver.
 */
const TOKENS = (process.env.TELEGRAM_BOT_TOKEN || "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);
/** One chat, or several separated by commas — a person and a group, say. */
const CHATS = (process.env.TELEGRAM_CHAT_ID || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const telegramConfigured = Boolean(TOKENS.length && CHATS.length);

/** Telegram rejects a message over 4096 characters outright. */
const MAX_TEXT = 4096;

const api = (token: string, method: string) => `https://api.telegram.org/bot${token}/${method}`;

/** Long enough for a PDF upload on a slow line, short enough not to hang. */
const TIMEOUT_MS = 20_000;

export interface TelegramNotice {
  text: string;
  /**
   * "HTML" to render Telegram's tag subset. Omitted, the text is sent literally.
   * Telegram rejects the whole message on a malformed entity, so anything
   * passed here must already be escaped — see orderTelegramHtml.
   */
  parseMode?: "HTML";
  document?: { filename: string; content: Buffer };
}

/**
 * Returns true if at least one chat received it.
 *
 * Never throws. The caller decides what a failure means, and on the orders
 * route it means "the other channel had better have worked", not a 500.
 */
export async function sendTelegramNotice(notice: TelegramNotice): Promise<boolean> {
  if (!telegramConfigured) {
    console.error(
      "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set — no notification sent. See docs/telegram-notifications.md",
    );
    return false;
  }

  // Sent whole rather than split across messages: half an order arriving is
  // worse than a trimmed one, and the full record is in the email regardless.
  // Trimming HTML mid-message could sever a tag and Telegram would reject the
  // lot, so an over-long message drops to plain text rather than risking that.
  const overLong = notice.text.length > MAX_TEXT;
  const text = overLong
    ? `${notice.text.replace(/<[^>]+>/g, "").slice(0, MAX_TEXT - 48)}\n\n… trimmed — full details in the email.`
    : notice.text;

  // Every bot to every chat. A bot that is not in a given chat fails only that
  // one pair; the rest still deliver, and the whole notice is "sent" if any did.
  const pairs = TOKENS.flatMap((token) => CHATS.map((chat) => ({ token, chat })));

  const results = await Promise.all(
    pairs.map(async ({ token, chat }) => {
      try {
        // HTML rather than MarkdownV2. Telegram needs only & < > escaped for
        // HTML, where MarkdownV2 also demands . - ( ) ! _ — and every rupee
        // amount, reference and address in an order is full of those.
        const sent = await post(api(token, "sendMessage"), {
          chat_id: chat,
          text,
          parse_mode: overLong ? undefined : notice.parseMode,
          disable_web_page_preview: true,
        });
        if (!sent) return false;

        if (notice.document) {
          const form = new FormData();
          form.append("chat_id", chat);
          form.append(
            "document",
            new Blob([new Uint8Array(notice.document.content)], { type: "application/pdf" }),
            notice.document.filename,
          );
          // A failed attachment does not undo a delivered message — the
          // operator still knows a lead came in, and the PDF is in the email.
          await postForm(api(token, "sendDocument"), form);
        }
        return true;
      } catch (error) {
        console.error("[telegram] could not notify", chat, error);
        return false;
      }
    }),
  );

  return results.some(Boolean);
}

async function post(url: string, body: Record<string, unknown>): Promise<boolean> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error("[telegram] rejected", response.status, await response.text());
    return false;
  }
  return true;
}

async function postForm(url: string, form: FormData): Promise<boolean> {
  const response = await fetch(url, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error("[telegram] document rejected", response.status, await response.text());
    return false;
  }
  return true;
}
