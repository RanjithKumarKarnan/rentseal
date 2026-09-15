<?php
/**
 * The order desk, for a site that is only static files.
 *
 * LP Stamp Paper is served from Hostinger as plain HTML, so there is no Next
 * server to post to. This takes the place of the old /api/orders route: every
 * submission on the site lands here and goes to the order desk. Nothing is
 * charged online — an operator reads it, calls to confirm, and takes payment on
 * that call.
 *
 * Two channels carry it, deliberately unalike. Mail is the record: the whole
 * row, the deed as a PDF, something searchable months later. Telegram is the
 * nudge — an operator does not watch an inbox, but a phone buzzes. They fail for
 * different reasons, which is the point: a lead is safe if either caught it, and
 * this answers 502 only when neither did, so the form never thanks someone for
 * an order nothing recorded.
 *
 * The browser sends the row — flat strings, built by agreementRow or enquiryRow
 * in src/lib/orders.ts — and, for a drafted agreement, the deed as a base64 PDF
 * (PHP cannot run @react-pdf, so the browser draws it). The mail and the
 * Telegram message are written here from the row with every value escaped. The
 * browser never supplies markup, so this cannot be used to send the office a
 * convincing email of someone else's making.
 *
 * Credentials are in orders-config.php beside this file, which
 * scripts/write-orders-config.mjs writes from .env when the site is built.
 *
 * Set up: docs/order-email.md and docs/telegram-notifications.md
 */

declare(strict_types=1);

ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kolkata');
set_time_limit(60);
// An order already typed in should still go out if the customer closes the tab
// while it sends.
ignore_user_abort(true);

/** A deed is a few hundred KB of PDF; this is room for it and nothing more. */
const MAX_BODY = 8 * 1024 * 1024;
const MAX_PDF = 5 * 1024 * 1024;
/** Longer than any honest field — a notes box, an address. */
const MAX_FIELD = 5000;
/** Long enough for a PDF upload on a slow line, short enough not to hang. */
const SMTP_TIMEOUT = 20;
const TELEGRAM_TIMEOUT = 20;
/** Telegram rejects a message over 4096 characters outright. */
const TELEGRAM_MAX = 4096;

// The request itself is handled at the foot of this file. PHP defines a const
// only when it reaches it, so the handler has to come after the tables below.


/* ═══════════════════════ Plumbing ═══════════════════════ */

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

/** The credentials: beside this file on Hostinger, or wherever `npm run dev` put them. */
function load_config(): array
{
    // ORDERS_CONFIG is set only by `npm run dev` (vite.config.ts), which keeps
    // the settings out of the source tree. A web request cannot set it.
    $file = getenv('ORDERS_CONFIG') ?: __DIR__ . '/orders-config.php';
    $config = is_file($file) ? require $file : [];
    return is_array($config) ? $config : [];
}

function setting(array $config, string $key): string
{
    return trim((string) ($config[$key] ?? ''));
}

/** Trims to a length in characters, not bytes, so Tamil is not cut mid-letter. */
function cut(string $text, int $max): string
{
    return function_exists('mb_substr') ? mb_substr($text, 0, $max, 'UTF-8') : substr($text, 0, $max);
}

/** One value or several, comma separated. */
function split_list(string $list): array
{
    return array_values(array_filter(array_map('trim', explode(',', $list)), 'strlen'));
}

/**
 * The deed, if what arrived is one. A deed that did not come through must not
 * sink the lead — the office can redraw it from the details in the message.
 */
function usable_pdf($deed): ?array
{
    if (!is_array($deed) || !is_string($deed['data'] ?? null)) {
        return null;
    }
    $bytes = base64_decode($deed['data'], true);
    if ($bytes === false || strlen($bytes) > MAX_PDF || strncmp($bytes, '%PDF-', 5) !== 0) {
        error_log('[orders] the attached deed was not a usable PDF — sending without it');
        return null;
    }
    $name = preg_replace('/[^A-Za-z0-9._-]/', '', is_string($deed['filename'] ?? null) ? $deed['filename'] : '');
    $name = preg_replace('/\.pdf$/i', '', $name) ?: 'agreement';
    return ['filename' => $name . '.pdf', 'content' => $bytes];
}


/* ═══════════════════════ The order, written out ═══════════════════════ */

/*
 * The row, written out for a person to read. The mail is the whole record, so
 * everything the row carries has to be in it or it is lost: who the parties
 * are, what the property is, every fee that makes up the quote, which sheet to
 * buy and what date to put on it.
 *
 * Empty fields are dropped rather than printed blank. An operator scanning for
 * the deposit should not have to read past eleven "—" lines to find it.
 */
const LABELS = [
    'contactName' => 'Name',
    'contactPhone' => 'Phone',
    'contactEmail' => 'Email',
    'city' => 'City',
    'need' => 'Wants',
    'denomination' => 'Denomination',
    'notary' => 'Notary',
    'stampDate' => 'Date wanted',
    'agreementType' => 'Document',
    'template' => 'Template',
    'plan' => 'Plan',
    'clausesChanged' => 'Clauses',
    'monthlyRent' => 'Monthly rent',
    'securityDeposit' => 'Deposit',
    'depositAlreadyPaid' => 'Deposit already paid',
    'durationMonths' => 'Term (months)',
    'startDate' => 'Starts',
    'executionDate' => 'Signed on',
    'executionPlace' => 'Signed at',
    'propertyKind' => 'Property type',
    'propertyAddress' => 'Address',
    'portion' => 'Portion let',
    'pincode' => 'PIN',
    'district' => 'District',
    'landlordName' => 'Landlord',
    'landlordPhone' => 'Landlord phone',
    'landlordEmail' => 'Landlord email',
    'tenantName' => 'Tenant',
    'tenantPhone' => 'Tenant phone',
    'tenantEmail' => 'Tenant email',
    'stampPaperValue' => 'Stamp paper (face value)',
    'stampPaperCombo' => 'Stamp paper',
    'shippingAddress' => 'Delivery address',
    'stampPaperFee' => 'Stamp paper charge',
    'extraPageFee' => 'Extra-page printing',
    'stampPaperDate' => 'Date on the paper',
    'backdatingMonths' => 'Back-dated (months)',
    'backdatingFee' => 'Back-dating charge',
    'documentPages' => 'Sheets',
    'extraPrintedCopies' => 'Extra printed copies',
    'printedCopiesFee' => 'Printed copies charge',
    'softCopy' => 'Soft copy',
    'softCopyFee' => 'Soft copy charge',
    'documentFee' => 'Drafting fee',
    'planFee' => 'Plan service fee',
    'stampDuty' => 'Stamp duty',
    'registrationFee' => 'Registration fee',
    'registrationRequired' => 'Registration required',
    'notaryFee' => 'Notary fee',
    'lawyerReview' => 'Notary attestation',
    'gst' => 'GST',
    'estimate' => 'ESTIMATE',
];

const GROUPS = [
    ['title' => 'Who to call', 'keys' => ['contactName', 'contactPhone', 'contactEmail', 'city']],
    ['title' => 'What they want', 'keys' => ['need', 'denomination', 'notary', 'stampDate', 'agreementType', 'template', 'plan', 'clausesChanged']],
    ['title' => 'Terms', 'keys' => ['monthlyRent', 'securityDeposit', 'depositAlreadyPaid', 'durationMonths', 'startDate', 'executionDate', 'executionPlace']],
    ['title' => 'Property', 'keys' => ['propertyKind', 'propertyAddress', 'portion', 'pincode', 'district']],
    ['title' => 'Parties', 'keys' => ['landlordName', 'landlordPhone', 'landlordEmail', 'tenantName', 'tenantPhone', 'tenantEmail']],
    // Facts here, money below. A section headed "the quote" whose lines do not
    // add up to the estimate printed under them is a section an operator has to
    // check with a calculator, so every rupee lives in one list and that list
    // sums to the total.
    ['title' => 'Paper and copies', 'keys' => ['stampPaperCombo', 'shippingAddress', 'stampPaperDate', 'backdatingMonths', 'documentPages', 'extraPrintedCopies', 'softCopy', 'registrationRequired', 'lawyerReview']],
    ['title' => 'The quote', 'keys' => ['documentFee', 'planFee', 'stampPaperFee', 'extraPageFee', 'stampDuty', 'registrationFee', 'notaryFee', 'backdatingFee', 'printedCopiesFee', 'softCopyFee', 'gst', 'estimate']],
];

/** Values that mean "nothing to say" rather than a fact worth printing. */
const EMPTY_VALUES = ['', '0', 'no', 'none'];

/**
 * Money keys render with a rupee sign rather than as bare text. The last three
 * are not fees but amounts all the same: "150000" is a number to decode;
 * "₹1,50,000" is a figure, and the lakh grouping is what an Indian reader scans
 * for.
 */
const MONEY = [
    'documentFee', 'planFee', 'stampPaperFee', 'extraPageFee', 'stampDuty', 'registrationFee',
    'notaryFee', 'backdatingFee', 'printedCopiesFee', 'softCopyFee', 'gst', 'estimate',
    'monthlyRent', 'securityDeposit', 'stampPaperValue',
];

/** The keys in a group worth printing, in order, with their values. */
function rows_for(array $group, array $row): array
{
    $rows = [];
    foreach ($group['keys'] as $key) {
        $value = trim($row[$key] ?? '');
        // The estimate is worth printing even at zero; a zero deposit is not.
        if ($value === '' || (in_array(strtolower($value), EMPTY_VALUES, true) && $key !== 'estimate')) {
            continue;
        }
        $rows[] = ['key' => $key, 'label' => LABELS[$key], 'value' => $row[$key]];
    }
    return $rows;
}

/** ₹ with Indian grouping — ₹1,50,000 — the way the site prints amounts. */
function rupees(string $value): string
{
    $amount = (float) $value;
    [$whole, $fraction] = explode('.', number_format(abs($amount), 3, '.', ''));
    $fraction = rtrim($fraction, '0');
    if (strlen($whole) > 3) {
        $whole = preg_replace('/\B(?=(\d{2})+$)/', ',', substr($whole, 0, -3)) . ',' . substr($whole, -3);
    }
    return ($amount < 0 ? '-' : '') . '₹' . $whole . ($fraction !== '' ? '.' . $fraction : '');
}

/** &, < and > only — the set both HTML mail and Telegram's parser require. */
function esc(string $value): string
{
    return htmlspecialchars($value, ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function closing_line(bool $isAgreement): string
{
    return $isAgreement
        ? 'The drafted agreement is attached. Print it on stamp paper of the value above, get it signed, and courier it.'
        : 'This is an enquiry, not a drafted agreement. Call to find out what they need.';
}

/** The plain-text part. Text-only clients and most spam filters read this. */
function order_email_text(array $row): string
{
    $isAgreement = $row['kind'] === 'agreement';
    $out = [];

    $out[] = ($row['summary'] ?? '') !== '' ? $row['summary'] : ($isAgreement ? 'Drafted agreement' : 'Enquiry');
    if (($row['reference'] ?? '') !== '') {
        $out[] = 'Reference ' . $row['reference'];
    }
    $out[] = '';

    foreach (GROUPS as $group) {
        $lines = [];
        foreach (rows_for($group, $row) as $line) {
            $lines[] = '  ' . str_pad($line['label'], 24) . ' ' . $line['value'];
        }
        if (!$lines) {
            continue;
        }
        array_push($out, strtoupper($group['title']), ...$lines);
        $out[] = '';
    }

    if (($row['notes'] ?? '') !== '') {
        array_push($out, 'NOTES', '  ' . $row['notes'], '');
    }

    array_push($out, closing_line($isAgreement), '', 'Submitted ' . date('j/n/Y, g:i:s a') . '.');
    return implode("\n", $out);
}

/**
 * The same row laid out to be read on a phone — the part a person sees.
 *
 * Written as tables with inline styles because that is what mail clients
 * support — Outlook has no flexbox and Gmail strips <style> blocks. It is the
 * only thing that renders the same in Gmail, Apple Mail and Outlook.
 *
 * The number is a tel: link at the top, big enough to hit. An operator reading
 * this on a phone wants to call back, and making them select and copy a number
 * is the difference between ringing now and ringing later.
 */
function order_email_html(array $row): string
{
    $isAgreement = $row['kind'] === 'agreement';
    $who = esc(($row['contactName'] ?? '') !== '' ? $row['contactName'] : 'Someone');
    $phoneShown = esc($row['contactPhone'] ?? '');
    $phone = preg_replace('/\D/', '', $row['contactPhone'] ?? '');
    $summary = esc($row['summary'] ?? '');
    $heading = $isAgreement ? 'New agreement' : 'New enquiry';

    $groups = '';
    foreach (GROUPS as $group) {
        $rows = rows_for($group, $row);
        if (!$rows) {
            continue;
        }
        $cells = '';
        foreach ($rows as $line) {
            $total = $line['key'] === 'estimate';
            $money = in_array($line['key'], MONEY, true);
            $labelStyle = 'padding:7px 0;border-bottom:1px solid #eef0f4;color:' . ($total ? '#0b1220' : '#5b6577')
                . ';font-size:' . ($total ? '15px' : '13.5px') . ';font-weight:' . ($total ? '700' : '400');
            $valueStyle = 'padding:7px 0;border-bottom:1px solid #eef0f4;color:#0b1220;font-size:' . ($total ? '17px' : '13.5px')
                . ';font-weight:' . ($total || $money ? '700' : '500') . ';white-space:nowrap';
            $shown = $money ? rupees($line['value']) : esc($line['value']);
            $cells .= "<tr>\n<td style=\"$labelStyle\">" . esc($line['label']) . "</td>\n"
                . "<td align=\"right\" style=\"$valueStyle\">$shown</td>\n</tr>";
        }
        $groups .= "<tr><td style=\"padding:22px 24px 0\">\n"
            . '<p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#98a2b3">' . esc($group['title']) . "</p>\n"
            . "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">$cells</table>\n</td></tr>";
    }

    $notes = ($row['notes'] ?? '') !== ''
        ? "<tr><td style=\"padding:22px 24px 0\">\n"
            . '<p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#98a2b3">Notes</p>' . "\n"
            . '<p style="margin:0;padding:12px 14px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:6px;font-size:13.5px;line-height:1.6;color:#4a3a12">' . esc($row['notes']) . "</p>\n</td></tr>"
        : '';
    $reference = ($row['reference'] ?? '') !== ''
        ? '<p style="margin:12px 0 0;font-size:12.5px;color:#98a2b3">Reference <b style="color:#0b1220">' . esc($row['reference']) . '</b></p>'
        : '';
    $closing = closing_line($isAgreement);
    $closingBg = $isAgreement ? '#eef4ff' : '#f4f6f9';

    return <<<HTML
<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f6f9">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">{$who} — {$phoneShown} — {$summary}</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f6f9;padding:20px 12px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">

  <tr><td style="background:#0b1220;padding:20px 24px">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8b95a8">LP Stamp Paper · order desk</p>
    <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff">{$heading}</p>
  </td></tr>

  <tr><td style="padding:22px 24px 0">
    <p style="margin:0;font-size:19px;font-weight:700;color:#0b1220">{$who}</p>
    <p style="margin:8px 0 0">
      <a href="tel:+91{$phone}" style="display:inline-block;padding:11px 18px;background:#2563eb;border-radius:9px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none">Call {$phoneShown}</a>
      <a href="https://wa.me/91{$phone}" style="display:inline-block;margin-left:8px;padding:11px 18px;background:#25D366;border-radius:9px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none">WhatsApp</a>
    </p>
    {$reference}
  </td></tr>

  {$groups}
  {$notes}

  <tr><td style="padding:22px 24px 24px">
    <p style="margin:0;padding:14px 16px;background:{$closingBg};border-radius:9px;font-size:13px;line-height:1.65;color:#3d4757">
      {$closing}
    </p>
    <p style="margin:14px 0 0;font-size:11.5px;color:#98a2b3">Nothing has been charged. Payment is taken on the confirming call.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>
HTML;
}

/**
 * The same row again, in the small HTML subset Telegram accepts: <b> <i> <code>
 * and friends, with only & < > escaped. The phone goes in <code> so a tap
 * copies it. Kept shorter than the email — this is the buzz that says a lead
 * came in and who to ring; the full record is in the inbox.
 */
function order_telegram_html(array $row): string
{
    $isAgreement = $row['kind'] === 'agreement';
    $out = [];

    $out[] = '<b>' . ($isAgreement ? '🧾 NEW AGREEMENT' : '💬 NEW ENQUIRY') . '</b>';
    $out[] = '';
    $out[] = '<b>' . esc(($row['contactName'] ?? '') !== '' ? $row['contactName'] : 'Someone') . '</b>';
    $out[] = '📞 <code>' . esc($row['contactPhone'] ?? '') . '</code>';
    if (($row['city'] ?? '') !== '') {
        $out[] = '📍 ' . esc($row['city']);
    }
    if (($row['reference'] ?? '') !== '') {
        $out[] = '🔖 <code>' . esc($row['reference']) . '</code>';
    }

    foreach (GROUPS as $group) {
        // Who to call is already the header above; printing it again is noise.
        if ($group['title'] === 'Who to call') {
            continue;
        }
        $rows = rows_for($group, $row);
        if (!$rows) {
            continue;
        }
        $out[] = '';
        $out[] = '<b>' . esc(strtoupper($group['title'])) . '</b>';
        foreach ($rows as $line) {
            $shown = in_array($line['key'], MONEY, true) ? rupees($line['value']) : $line['value'];
            $out[] = $line['key'] === 'estimate'
                ? '<b>' . esc($line['label'] . ': ' . $shown) . '</b>'
                : esc($line['label']) . ': <b>' . esc($shown) . '</b>';
        }
    }

    if (($row['notes'] ?? '') !== '') {
        array_push($out, '', '<b>NOTES</b>', '<i>' . esc($row['notes']) . '</i>');
    }

    $out[] = '';
    $out[] = $isAgreement
        ? '📎 Deed attached. Print on stamp paper of the value above, get it signed, courier it.'
        : 'Call to find out what they need — nothing is drafted yet.';

    return implode("\n", $out);
}


/* ═══════════════════════ Mail ═══════════════════════ */

/**
 * Emails the order, with the drafted agreement attached when there is one.
 * Returns false rather than throwing: the caller decides what a failure means.
 */
function send_mail(array $config, string $subject, string $text, string $html, ?array $pdf): bool
{
    $host = setting($config, 'smtp_host');
    $port = (int) setting($config, 'smtp_port') ?: 465;
    $user = setting($config, 'smtp_user');
    $pass = (string) ($config['smtp_pass'] ?? '');
    // One address or several, comma separated. Falls back to the sending
    // account, so a half-configured mailer still lands somewhere a human reads.
    $to = [];
    foreach (split_list(setting($config, 'order_email') ?: $user) as $address) {
        if (filter_var($address, FILTER_VALIDATE_EMAIL)) {
            $to[] = $address;
        }
    }

    if ($host === '' || $user === '' || $pass === '' || !$to) {
        error_log('[mail] SMTP is not configured — no order email sent. See docs/order-email.md');
        return false;
    }
    try {
        smtp_send($host, $port, $user, $pass, $to, mime_message($user, $to, $subject, $text, $html, $pdf));
        return true;
    } catch (Throwable $error) {
        error_log('[mail] could not send the order email: ' . $error->getMessage());
        return false;
    }
}

/** A multipart message: text and HTML as alternatives, the deed as an attachment. */
function mime_message(string $from, array $to, string $subject, string $text, string $html, ?array $pdf): string
{
    $eol = "\r\n";
    $alt = 'alt-' . bin2hex(random_bytes(12));
    $domain = substr(strrchr($from, '@') ?: '@localhost', 1);
    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: "Orders" <' . $from . '>',
        'To: ' . implode(', ', $to),
        'Reply-To: ' . $from,
        'Subject: ' . encode_header($subject),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $domain . '>',
        'MIME-Version: 1.0',
    ];
    $alternative = implode($eol, [
        '--' . $alt,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        rtrim(chunk_split(base64_encode($text))),
        '--' . $alt,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        rtrim(chunk_split(base64_encode($html))),
        '--' . $alt . '--',
    ]);

    if (!$pdf) {
        $headers[] = 'Content-Type: multipart/alternative; boundary="' . $alt . '"';
        return implode($eol, $headers) . $eol . $eol . $alternative;
    }

    $mixed = 'mixed-' . bin2hex(random_bytes(12));
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $mixed . '"';
    return implode($eol, $headers) . $eol . $eol . implode($eol, [
        '--' . $mixed,
        'Content-Type: multipart/alternative; boundary="' . $alt . '"',
        '',
        $alternative,
        '--' . $mixed,
        'Content-Type: application/pdf; name="' . $pdf['filename'] . '"',
        'Content-Disposition: attachment; filename="' . $pdf['filename'] . '"',
        'Content-Transfer-Encoding: base64',
        '',
        rtrim(chunk_split(base64_encode($pdf['content']))),
        '--' . $mixed . '--',
    ]);
}

/** A header value on one line, UTF-8 encoded when it is more than ASCII. */
function encode_header(string $value): string
{
    // A line break in a header is how headers get injected.
    $value = str_replace(["\r", "\n"], ' ', $value);
    if (!preg_match('/[^\x20-\x7E]/', $value)) {
        return $value;
    }
    return function_exists('mb_encode_mimeheader')
        ? mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n")
        : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/**
 * Speaks SMTP to the mail server — Gmail, as set up in docs/order-email.md.
 *
 * Written out rather than pulled in as a library so the whole order desk is
 * one file that can be dropped into public_html. Port 465 is implicit TLS; any
 * other port upgrades with STARTTLS, and the password is never sent to a server
 * that will not encrypt, except one on this same machine.
 */
function smtp_send(string $host, int $port, string $user, string $pass, array $to, string $message): void
{
    $local = in_array(strtolower($host), ['localhost', '127.0.0.1', '::1'], true);
    $implicitTls = $port === 465;
    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
    $socket = @stream_socket_client(
        ($implicitTls ? 'ssl://' : 'tcp://') . $host . ':' . $port,
        $errno,
        $error,
        SMTP_TIMEOUT,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) {
        throw new RuntimeException("cannot reach $host:$port — $error ($errno)");
    }
    stream_set_timeout($socket, SMTP_TIMEOUT);

    try {
        smtp_expect($socket, [220]);
        $hello = 'EHLO ' . (preg_replace('/[^A-Za-z0-9.-]/', '', $_SERVER['SERVER_NAME'] ?? '') ?: 'localhost');
        $features = smtp_command($socket, $hello, [250]);

        if (!$implicitTls) {
            if (preg_match('/^250[ -]STARTTLS/mi', $features)) {
                smtp_command($socket, 'STARTTLS', [220]);
                if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                    throw new RuntimeException('STARTTLS handshake failed');
                }
                $features = smtp_command($socket, $hello, [250]);
            } elseif (!$local) {
                throw new RuntimeException("$host offers no TLS; not sending the password in the clear");
            }
        }

        if (preg_match('/^250[ -]AUTH\b/mi', $features)) {
            smtp_command($socket, 'AUTH LOGIN', [334]);
            smtp_command($socket, base64_encode($user), [334]);
            smtp_command($socket, base64_encode($pass), [235]);
        } elseif (!$local) {
            throw new RuntimeException("$host does not offer AUTH");
        }

        smtp_command($socket, "MAIL FROM:<$user>", [250]);
        foreach ($to as $address) {
            smtp_command($socket, "RCPT TO:<$address>", [250, 251]);
        }
        smtp_command($socket, 'DATA', [354]);
        // A line that starts with a dot would end the message early; SMTP doubles it.
        smtp_command($socket, preg_replace('/^\./m', '..', $message) . "\r\n.", [250]);
        @fwrite($socket, "QUIT\r\n");
    } finally {
        fclose($socket);
    }
}

/** @param resource $socket */
function smtp_command($socket, string $line, array $expect): string
{
    $data = $line . "\r\n";
    // A socket can take a large message in pieces; keep writing until it is all out.
    while ($data !== '') {
        $written = fwrite($socket, $data);
        if ($written === false || $written === 0) {
            throw new RuntimeException('the mail server dropped the connection');
        }
        $data = substr($data, $written);
    }
    return smtp_expect($socket, $expect);
}

/**
 * Reads one reply — which may run over several "250-" lines — and checks its code.
 *
 * @param resource $socket
 */
function smtp_expect($socket, array $expect): string
{
    $reply = '';
    while (($line = fgets($socket, 2048)) !== false) {
        $reply .= $line;
        if (!isset($line[3]) || $line[3] !== '-') {
            break;
        }
    }
    if (!in_array((int) substr($reply, 0, 3), $expect, true)) {
        throw new RuntimeException('the mail server said: ' . (trim($reply) ?: 'nothing (timed out)'));
    }
    return $reply;
}


/* ═══════════════════════ Telegram ═══════════════════════ */

/**
 * Buzzes the order desk. Returns true if at least one chat received it.
 *
 * One bot or several, one chat or several, all comma separated. Every bot sends
 * to every chat; a bot that is not in a given chat fails only that pair, and
 * the notice is "sent" if any pair delivered.
 */
function send_telegram(array $config, string $html, ?array $pdf): bool
{
    $tokens = split_list(setting($config, 'telegram_bot_token'));
    $chats = split_list(setting($config, 'telegram_chat_id'));
    if (!$tokens || !$chats) {
        error_log('[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set — no notification sent. See docs/telegram-notifications.md');
        return false;
    }
    if (!function_exists('curl_init')) {
        error_log('[telegram] PHP has no curl extension — no notification sent');
        return false;
    }
    // Only ever changed to point a test at a local stand-in for Telegram.
    $api = rtrim(setting($config, 'telegram_api') ?: 'https://api.telegram.org', '/');

    // Sent whole rather than split: half an order arriving is worse than a
    // trimmed one. Trimming HTML mid-message could sever a tag and Telegram
    // would reject the lot, so an over-long message drops to plain text.
    $length = function_exists('mb_strlen') ? mb_strlen($html, 'UTF-8') : strlen($html);
    $overLong = $length > TELEGRAM_MAX;
    $text = $overLong
        ? cut(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'), TELEGRAM_MAX - 48) . "\n\n… trimmed — full details in the email."
        : $html;

    $delivered = false;
    foreach ($tokens as $token) {
        foreach ($chats as $chat) {
            $message = ['chat_id' => $chat, 'text' => $text, 'disable_web_page_preview' => true];
            if (!$overLong) {
                $message['parse_mode'] = 'HTML';
            }
            if (!telegram_post("$api/bot$token/sendMessage", json_encode($message), true)) {
                continue;
            }
            $delivered = true;
            if ($pdf) {
                // A failed attachment does not undo a delivered message — the
                // operator still knows a lead came in, and the PDF is in the email.
                telegram_post("$api/bot$token/sendDocument", ['chat_id' => $chat, 'document' => upload($pdf)], false);
            }
        }
    }
    return $delivered;
}

/** @param string|array $body JSON text, or form fields for a multipart upload. */
function telegram_post(string $url, $body, bool $json): bool
{
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => $json ? ['Content-Type: application/json'] : [],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => TELEGRAM_TIMEOUT,
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    if ($response === false || $status < 200 || $status >= 300) {
        // The token is part of the URL, so only what Telegram said is logged.
        error_log('[telegram] rejected ' . ($status ?: curl_error($curl)) . ' ' . cut((string) $response, 300));
        return false;
    }
    return true;
}

/** The deed as a file part for curl, from memory where PHP allows it. */
function upload(array $pdf)
{
    if (class_exists('CURLStringFile')) {
        return new CURLStringFile($pdf['content'], $pdf['filename'], 'application/pdf');
    }
    $path = tempnam(sys_get_temp_dir(), 'deed');
    file_put_contents($path, $pdf['content']);
    register_shutdown_function(static function () use ($path): void {
        @unlink($path);
    });
    return new CURLFile($path, 'application/pdf', $pdf['filename']);
}


/* ═══════════════════════ The request ═══════════════════════ */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'POST only.']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
if ($raw === false || strlen($raw) > MAX_BODY) {
    respond(413, ['ok' => false, 'error' => 'Too large.']);
}
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    respond(400, ['ok' => false, 'error' => 'Malformed request.']);
}

// The deed rides along for the attachment but is not part of the row itself.
$deed = $payload['pdf'] ?? null;
unset($payload['pdf']);

// The body is whatever the browser posted, so it is checked here and then
// treated as the flat row it claims to be: plain keys, scalar values, nothing
// nested. The renderers above read it key by key and skip anything absent.
$row = [];
foreach ($payload as $key => $value) {
    if (is_string($key) && preg_match('/^[A-Za-z][A-Za-z0-9]{0,40}$/', $key) && is_scalar($value)) {
        $row[$key] = cut(trim((string) $value), MAX_FIELD);
    }
}
$row['kind'] = ($row['kind'] ?? '') === 'agreement' ? 'agreement' : 'enquiry';

$phone = preg_replace('/\D/', '', $row['contactPhone'] ?? '');
if (strlen($phone) < 10) {
    respond(422, ['ok' => false, 'error' => 'A ten-digit mobile number is needed so we can call you back.']);
}
$row['contactPhone'] = $phone;

$pdf = $row['kind'] === 'agreement' ? usable_pdf($deed) : null;
$config = load_config();

$who = ($row['contactName'] ?? '') !== '' ? $row['contactName'] : 'Someone';
$subject = $row['kind'] === 'agreement'
    ? 'Agreement ' . ($row['reference'] ?? '') . " — $who, $phone"
    : "Enquiry — $who, $phone";

$emailed = send_mail($config, $subject, order_email_text($row), order_email_html($row), $pdf);
$notified = send_telegram($config, order_telegram_html($row), $pdf);

if (!$emailed && !$notified) {
    // Telling someone their order is in when nothing recorded it is how a lead
    // disappears silently.
    respond(502, ['ok' => false, 'error' => 'unreachable']);
}
if (!$emailed) {
    error_log('[orders] notified on Telegram but NOT emailed — no durable record');
}
if (!$notified) {
    error_log('[orders] emailed but Telegram notification failed');
}
respond(200, ['ok' => true, 'emailed' => $emailed, 'notified' => $notified]);
