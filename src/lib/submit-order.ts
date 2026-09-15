import type { AgreementDraft } from "./types";
import type { OrderRow } from "./orders";

/**
 * Sends a submission to the order desk.
 *
 * The site is static files on Hostinger, so there is no Next server to post to.
 * public/api/orders.php takes its place: it emails the row and pushes it to
 * Telegram, as the old /api/orders route did, and answers 502 when neither
 * channel took it. The mail and the Telegram message are written there, from
 * the row — the browser sends data, never the markup.
 *
 * The one thing that moved to the browser is the deed. PHP cannot run
 * @react-pdf, so the PDF is drawn here and uploaded with the row.
 *
 * Throws when the order did not land, so the form can say so rather than thank
 * someone for an order nothing recorded.
 */
export async function submitOrder(row: OrderRow, draft?: AgreementDraft): Promise<void> {
  const pdf = row.kind === "agreement" && draft?.id ? await deedPdf(row, draft) : undefined;
  const response = await fetch("/api/orders.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...row, pdf }),
  });
  // Only orders.php's own answer counts. A server that cannot run PHP — the
  // Vite dev server, or a host with PHP switched off — hands the file back as
  // text with a 200, and taking that for success would thank someone for an
  // order that was never sent.
  const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!response.ok || result?.ok !== true) throw new Error(`orders ${response.status}`);
}

/**
 * The deed as base64, or nothing. A deed that will not render must not sink the
 * lead — the office can redraw it from the details in the message.
 */
async function deedPdf(row: OrderRow, draft: AgreementDraft) {
  try {
    // Loaded on demand: @react-pdf and the Tamil faces are heavy, and only the
    // last step of the drafter ever needs them.
    const { renderAgreementPdf } = await import("./agreement-pdf");
    const blob = await renderAgreementPdf(draft);
    return { filename: `${row.reference || draft.id}.pdf`, data: await base64(blob) };
  } catch (error) {
    console.error("[orders] could not render the agreement PDF", error);
    return undefined;
  }
}

function base64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // A data URL is "data:application/pdf;base64,<payload>"; keep the payload.
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
