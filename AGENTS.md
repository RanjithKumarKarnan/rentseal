# Stack

Vite + React 19 + React Router 7 (data router), TypeScript, Tailwind v4. The
site used to be Next.js; none of it is left, so Next.js conventions (App Router,
`next/*` imports, `metadata` exports, server components) do not apply here.

- **Every page is pre-rendered.** `npm run build` runs `vite build` (the browser
  bundle plus `dist/index.html`, the template), `vite build --ssr` (a Node build
  of the same app), then `scripts/prerender.mjs`, which renders every URL in
  `src/seo/paths.ts` to `dist/<path>.html` and writes the sitemap, robots,
  manifest and social cards. The browser then hydrates the page.
- **Routes** are in `src/routes.tsx`. **Pages** are in `src/pages/`: a default
  component plus a `meta` export — an object, or a function of the route params —
  which `src/seo/meta.ts` turns into `<head>` tags.
- **Render the same thing on the server and on the first render in the
  browser.** Read the query string, `localStorage`, the date and the like only
  after `useHydrated()` (`src/lib/use-hydrated.ts`) or inside an effect.
- **Orders** go to `public/api/orders.php`, which runs as PHP on Hostinger.
  `public/.htaccess` handles clean URLs, redirects and security headers.
