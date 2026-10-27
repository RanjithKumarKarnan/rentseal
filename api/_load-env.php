<?php
/**
 * The project's .env files, for the order desk on Vercel.
 *
 * The Vercel project has no SMTP_* or TELEGRAM_* environment variables, so the
 * function started with empty settings and answered every order with a 502.
 * This reads the same files the build reads for Hostinger — .env.production.local,
 * .env.local, .env.production and .env, the first to set a name winning, as
 * Vite does — into the environment orders.php reads. A variable set on the
 * Vercel project still wins over all of them.
 *
 * The leading underscore keeps Vercel from making this a function of its own.
 */

declare(strict_types=1);

foreach (['.env.production.local', '.env.local', '.env.production', '.env'] as $name) {
    $file = __DIR__ . '/../' . $name;
    if (!is_file($file)) {
        continue;
    }
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (!preg_match('/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/', $line, $m)) {
            continue;
        }
        $value = trim($m[2]);
        if (preg_match('/^(["\'])(.*)\1$/', $value, $quoted)) {
            $value = $quoted[2];
        }
        $current = getenv($m[1]);
        if ($current === false || trim($current) === '') {
            putenv("{$m[1]}={$value}");
        }
    }
}
