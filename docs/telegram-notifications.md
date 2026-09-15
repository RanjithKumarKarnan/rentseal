# Telegram order notifications

Every lead is pushed to a Telegram bot as well as emailed — enquiries and
drafted agreements alike, with the deed sent as a PDF where there is one.

Mail is the record: the whole row, searchable months later. Telegram is the
nudge, because nobody sits watching an inbox but a phone buzzes. They are also
a second copy of each other, on a different network with a different
credential, so **a lead is safe if either one caught it**. The order form only
fails when neither did.

## Setup

### 1. Make the bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather).
2. Send `/newbot`, give it a name and a username ending in `bot`.
3. He replies with a token like `8123456789:AAH...`. That is
   `TELEGRAM_BOT_TOKEN`.

Put it in `.env.local`:

```
TELEGRAM_BOT_TOKEN=8123456789:AAH...
```

### 2. Find the chat ID

Telegram will not tell you a chat ID until somebody has messaged the bot, so:

1. Open your bot's link (`https://t.me/<username>`) and send it anything —
   `hello` will do.
2. Run:

   ```
   npm run telegram:chat-id
   ```

It prints the IDs it can see. Put the one you want in `.env.local`:

```
TELEGRAM_CHAT_ID=123456789
```

Several people or a group as well? Separate them with commas.

### 3. Rebuild

The build copies both values into `dist/api/orders-config.php`, which
`public/api/orders.php` reads on Hostinger. Run `npm run build` again and
upload `dist/`.

## Sending to a group

Add the bot to the group, send one message there, then run
`npm run telegram:chat-id` again — a group ID is negative, like `-1001234567890`.

**Group IDs stay hidden unless Privacy Mode is off.** In @BotFather, send
`/setprivacy`, pick the bot, choose **Disable**. Otherwise the bot cannot see
group messages and the helper will keep reporting nothing.

## If it fails

Nothing is lost as long as the email went — the request still succeeds and
Hostinger's PHP error log carries a `[telegram]` line saying why. Watch for:

- `TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set` — not configured; mail is
  carrying the load alone.
- `rejected 401` — the token is wrong or the bot was deleted.
- `rejected 400 ... chat not found` — wrong chat ID, or nobody has ever messaged
  the bot from that chat.
- `rejected 403 ... bot was blocked by the user` — someone blocked it.

The message is sent as plain text on purpose. The order carries rupee amounts,
underscores and dots that Telegram's MarkdownV2 rejects as unescaped entities,
and a notification that fails to send over punctuation is a bad trade for bold
headings.

Long orders are trimmed to Telegram's 4096-character limit with a line saying
so; the untrimmed version is in the email.
