<?php
/**
 * The order desk on Vercel.
 *
 * Vercel serves dist/ as plain files and runs no PHP there, so a form post to
 * the copy of orders.php in dist/ gets a 405 and the lead is lost. This file is
 * a Vercel function instead (vercel.json gives it the vercel-php runtime), and
 * it answers the same /api/orders.php the forms already post to by running the
 * one order desk, public/api/orders.php — the file Hostinger runs directly.
 *
 * Its settings are SMTP_*, ORDER_EMAIL and TELEGRAM_*: the Vercel project's
 * environment variables where set, otherwise the project's .env files
 * (_load-env.php).
 */

declare(strict_types=1);

require __DIR__ . '/_load-env.php';
require __DIR__ . '/../public/api/orders.php';
