# RentSeal

Landing site for a Tamil Nadu stamp paper supply and delivery business, which
also drafts rental agreements. Vite · React 19 · React Router 7 · TypeScript ·
Tailwind v4 · Framer Motion. Every page is pre-rendered to HTML at build time.

```bash
npm run dev     # http://localhost:3011
npm run build   # static site → dist/, ready for Hostinger (see Deploying)
npm run lint    # eslint
npm run typecheck # tsc
```

---

## What the business sells

1. **Stamp paper** — licensed non-judicial paper in ₹20 / ₹50 / ₹100 / ₹200 /
   ₹500, plus e-Stamp certificates for any value. Sold at face value with a flat
   delivery charge.
2. **Delivery across all 38 districts** — same day in the Chennai metro (order
   before 2pm), next working day in the major cities, 2–3 days elsewhere. Free
   above ₹2,000 of stamp value or on 10+ sheets.
3. **Rental agreements** — drafted, stamped and e-signed, as a second line.

Catalogue, delivery zones, charges and use-cases all live in
`src/lib/stamp-paper.ts` — edit that one file to change denominations, ETAs or
delivery pricing anywhere on the site.

## Current scope: landing page + lead capture

The site runs as a **marketing landing site**. Every call to action funnels to
the lead form at `/#get-started`, which asks what the customer needs (stamp
paper / agreement / both) and swaps its fields accordingly — denomination and
delivery city for stamp paper, agreement type and property city otherwise.

The full self-serve product (agreement builder, stamp duty calculator, accounts)
is **built but switched off** — see [Re-enabling the product](#re-enabling-the-product).

### Live routes

| Route | What it is |
| --- | --- |
| `/` | Landing page — hero, stats, **stamp paper catalogue** (`#stamp-paper`), **delivery coverage** (`#delivery`), **lead form** (`#get-started`), agreement types, how it works, features, comparison, pricing, testimonials, FAQ |
| `/how-it-works` | Long-form process explanation + `HowTo` schema |
| `/pricing` | Three plans, old-way comparison, full FAQ |
| `/faq` | 14 questions grouped by category + `FAQPage` schema |
| `/about` | Story, values, timeline, company facts |
| `/contact` | Contact form, phone/WhatsApp/email, hours |
| `/services/[slug]` | 4 SEO pages — residential, commercial, lease deed, leave & licence |
| `/rental-agreement` | District index — all 38, grouped by region, `ItemList` schema |
| `/rental-agreement/[district]` | **38** district pages with `LocalBusiness` schema |
| `/stamp-paper` | District index — all 38, grouped by region, `ItemList` schema |
| `/stamp-paper/[district]` | **38** district pages with `LocalBusiness` schema |
| `/templates` | The 24-template library, moved off the homepage |
| `/search` | Site search — server-rendered results, works without JavaScript |
| `/legal/{terms,privacy,refund}` | Policy pages with a sticky table of contents |
| `/sitemap.xml`, `/robots.txt` | Generated from `src/lib/site.ts` and `src/lib/services.ts` |

---

## Homepage length, and why sections were cut

The homepage ran to **26,115px — about 26 screens**. Most of that length was
repetition rather than content: four consecutive sections all arguing the same
"no markup, no office visit" case.

It is now **16,787px at the same width, a 36% cut**, and 13 sections down to 10.
Measured on the current build:

| Viewport | Height | Screens |
| --- | --- | --- |
| 1440 × 900 | 11,584px | 12.9 |
| 825 × 998 | 16,787px | 16.8 |
| 375 × 812 | 23,057px | 28.4 |

Mobile is still the tallest because everything stacks to one column — that is
the number to watch if more is added.

### What moved or went

| Section | Was | Now |
| --- | --- | --- |
| Template library | 25 cards, ~3,700px, the single largest section, leading to only 4 unique destinations | Its own page at `/templates`, linked from nav and footer |
| Comparison table | On the homepage *and* `/pricing` | `/pricing` only |
| Features | 13 cards | Off the homepage; all 13 remain on `/how-it-works` |
| Stamp paper use-cases | 6 cards, ~1,700px on mobile | One line linking to `/stamp-paper`, where the same cards already appear on all 38 district pages |
| Pricing | 10 rows per plan, a third of them greyed-out exclusions | `compact` shows only what each plan includes, with a link to the full comparison |
| Featured districts | 10 cards | 6 — the rest continue on `/rental-agreement` and in the footer |
| Homepage FAQ | 10 visible, 8 in schema | 5, and the schema matches |

Section padding also came down from `4.5/6.5rem` to `3.25/4.75rem`.

## Typography and why the design changed

The site was set in **Inter + Plus Jakarta Sans**, extrabold, with a tinted pill
above every section heading and everything centred. That is the default output
of a generated landing page, and it read like one — which is a problem for a
business whose product is the credibility of a document.

**Headings are now Source Serif 4**; body and UI stay on Inter. A serif is the
right register here: it is what the instruments themselves are set in, it reads
as institutional rather than startup, and at 38 / 1% / 11 months in the stats
row the numerals carry far more authority than a geometric sans did. It also
ships a native ₹ glyph, which matters on a site full of rupee figures — verified
rather than assumed.

### What else was changed, and why

| Tell | Was | Now |
| --- | --- | --- |
| Display face | Plus Jakarta Sans, `font-extrabold` | Source Serif 4, `font-bold` (40 occurrences) |
| Section eyebrows | Tinted, bordered, `rounded-full` pill with an icon chip, above all 36 headings | Ruled uppercase label — marks the section without decorating it |
| Heading alignment | Centred by default, ten times down the page | Left by default; centre is now a deliberate choice |
| Hero emphasis | Gradient-filled word with an animated hand-drawn underline swash | The serif italic |
| Corner radius | Everything `rounded-2xl` (16px) / `rounded-3xl` (24px) | Scale pulled in — 2xl is 10px. Pills keep `rounded-full`, which is correct for pills |
| Hero backdrop | Two 600px blurred colour blobs | One much fainter wash |
| Heading tracking | `-0.022em`, tuned for a geometric sans | `-0.011em` — the tighter value closes up serifs |

Radii are set as theme tokens in `globals.css`, so `rounded-2xl` changes
everywhere at once rather than needing 68 edits.

## Accessibility

- **Reduced motion actually works now.** The `prefers-reduced-motion` block in
  `globals.css` only neutralises CSS animations. Framer Motion animates by
  writing inline styles from JavaScript, so every reveal, stagger and count-up
  ran at full strength for users who had asked for less. `MotionProvider`
  (`components/ui/motion-provider.tsx`) wraps the app in
  `MotionConfig reducedMotion="user"`, and `Counter` renders its final value
  directly instead of ticking up.
- **The looping marquee is gone.** The trust bar scrolled its eight audience
  segments forever, with no way to pause — WCAG 2.2.2 asks for a pause
  mechanism on any motion that starts automatically and runs past five seconds.
  It is a static wrapped row now, which also halves that part of the DOM: the
  marquee duplicated all eight pills to sixteen to hide the seam.
- Focus rings (`:focus-visible`), landmarks, heading order and accessible names
  were already in good shape and were left alone.

---

## Claims policy, and what you must supply before launch

The site previously published a number of things that were invented. For a
business selling legal documents that is a liability rather than a shortcut —
a customer, a competitor or a tax officer can check most of them in seconds.
Everything below has been removed and replaced with statements that are true
from the first order.

### Removed

| Was | Why it went | Replaced with |
| --- | --- | --- |
| `CIN U74999TN2021PTC145678`, `GSTIN 33AABCR1234M1ZX` | Invented. `AABCR1234M` is the textbook example PAN | `SITE.cin` / `SITE.gstin` are empty strings; the footer and About table omit the row entirely while blank |
| "ISO 27001 certified infrastructure", "PCI-DSS compliant payments" | Certifications not held. Claiming one is a misrepresentation | Statements about how the service actually handles data and cards |
| "Annual third-party penetration testing" | Not performed | Removed from the privacy page |
| "4.9 from 6,400 landlords and tenants", `42k+` avatar stack | Invented rating and customer count | A hero panel inviting the reader to verify the e-Stamp certificate number themselves |
| "57,000+ orders delivered" stat | Invented | `38 districts` / `1% duty` / `11 months` / `7 days support` — all structurally true |
| Per-district order counts (`orders: "18,400+"`) | Invented, on 76 pages | Sub-Registrar Office and taluk counts, which are real and already in the data |
| Six named testimonials with cities and job titles | Invented people | `components/landing/commitments.tsx` — six service guarantees we control |
| Five-entry founding timeline, two founders, a ₹2,00,000 anecdote | Invented company history | Five operating principles on the About page: how the money, the law and the signing actually work |
| "brokers keep standing orders with us", "a good share of our volume" | Implies a customer base that does not exist yet | Capability statements — what bulk ordering supports, not who already uses it |

### Still to supply

These are placeholders and are marked as such at the top of `src/lib/site.ts`:

- [ ] `SITE.phone` — currently `+91 44 4000 1200`
- [ ] `SITE.whatsapp` — currently `+91 90000 12000`
- [ ] `SITE.email` — currently `hello@rentseal.in`
- [ ] `SITE.address` — currently a Chennai landmark address
- [ ] `SITE.cin` — empty; fill in and the footer and About row appear automatically
- [ ] `SITE.gstin` — empty; same
- [ ] `SITE.legalName` — confirm the registered entity name is exact

### The rule going forward

Before adding a number or a credential to this site, ask whether a stranger
could check it today. If they could and it would fail, it does not go on the
page. Capability statements ("ten sheets or more ships free") are always
available; volume and reputation claims have to be earned first.

---

## The location matrix

Every location page on the site is one of the **38 official districts of Tamil
Nadu**, and they all come out of `src/lib/districts.ts` — the single source of
truth. Two page families are generated from that one list:

```
/rental-agreement/[district]   38 pages   agreement drafting, stamping, e-signing
/stamp-paper/[district]        38 pages   paper and e-Stamp supply + delivery
```

Plus an index for each (`/rental-agreement`, `/stamp-paper`) that groups all 38
by region, so no district page is more than two clicks from the homepage and
none of them is orphaned.

### Adding or changing a district

Edit the one entry in `src/lib/districts.ts`. Both page families, both indexes,
the footer strips, the sitemap and the lead-form dropdown pick it up
automatically — there is no second list to keep in sync.

Each district carries the fields that keep its two pages from reading like every
other district's:

| Field | Used for |
| --- | --- |
| `hq`, `region` | Eyebrow, grouping on the index pages |
| `zone` | Delivery ETA and charge — ties to `DELIVERY_ZONES` in `stamp-paper.ts` |
| `sroTowns` | The Sub-Registrar Office chips, one per taluk headquarters |
| `towns` | "Where our orders come from", and long-tail keywords |
| `orders` | Stat card, and sitemap priority (1,000+ orders ⇒ 0.8, else 0.6) |
| `economy`, `demand` | Two paragraphs of prose unique to that district |

`economy` and `demand` are the important ones. Without them 76 pages would be
the same template with a name swapped in, which is exactly the thin-content
pattern Google demotes. Write them for any district you add.

### Why each district page has its own FAQs

`rentalFaqs(district)` and `stampPaperFaqs(district)` in `districts.ts` generate
six questions per page from that district's own data — its SRO towns, delivery
zone, headquarters and the towns we serve.

They exist because the shared `FaqSection` was rendering the same eight answers
on all 76 location pages. Each page now also emits its own `FAQPage` schema.
Measured on the current build: ~1,760 words per rental page and ~1,410 per stamp
paper page, of which roughly a third of the sentences appear on that page and
nowhere else on the site.

> **Accordion constraint:** `components/ui/accordion.tsx` must keep collapsed
> answers **mounted** (height-collapsed, not unmounted). Every page that renders
> an Accordion also emits `FAQPage` structured data, and Google requires the
> marked-up answer to exist in the page HTML. If you ever refactor it back to
> conditional mounting, the schema will describe content that is not there.

### Social cards

`src/lib/og.tsx` holds one card layout, and `src/seo/og-cards.ts` lists every
card the build draws with it into `dist/og/` — one per district page per track,
one per service, one per index, and a site-wide default. Which card a route
shares is set in `src/routes.tsx`; a route not given one uses the default
(`src/seo/og.ts`).

Note that a page which sets its own `openGraph` **and** has no card of its own
shares no image at all: its `openGraph` replaces the site's, card included. That
is why the index and service routes each have their own card. `/templates` is
the one page in that position today.

### Search

There is no search backend. `src/lib/search.ts` assembles an index at module
load from the same data the pages render — `DISTRICTS`, `SERVICES`,
`DENOMINATIONS` and `FAQS` — so it cannot drift from what is published. Add a
district and it is searchable in the same commit.

Two entry points share that index:

- **`components/site/search-dialog.tsx`** — ⌘K / Ctrl+K anywhere, `/` when not
  already typing, or the header button. Runs in the browser, no request per
  keystroke.
- **`/search?q=`** — results grouped by kind. It is a plain GET form, so it can
  be linked to directly. The build writes the page with no query; the browser
  fills in the results.

Districts carry their towns, taluk headquarters and alias names as keywords, so
searching a town finds its parent district — Hosur returns Krishnagiri, Ooty
returns Nilgiris, Trichy returns Tiruchirappalli.

**Ranking.** Scoring is IDF-weighted, and this is not optional polish. Every one
of the 38 stamp paper pages carries the keyword "stamp paper", so an unweighted
scorer answered "₹100 stamp paper" and "stamp duty" with a wall of districts and
buried the denomination and the duty answer. Terms common across the corpus now
count for almost nothing and rare ones decide the ranking. Two further guards:
a relevance floor drops anything scoring below 22% of the best hit, and query
stopwords ("how much does it cost") are dropped unless the query is nothing but
stopwords.

If you add documents whose keywords repeat across many entries, re-check the
queries in the table below — that is where ranking regressions show up first.

| Query | Expected first result |
| --- | --- |
| `hosur` | Stamp paper / Rental agreement in Krishnagiri |
| `lease deed` | Lease Deed |
| `100 stamp paper` | ₹100 stamp paper |
| `stamp duty` | How is stamp duty calculated in Tamil Nadu? |
| `how much does it cost` | Pricing |
| `refund` | Refund policy |

`/search` is `noindex, follow` and absent from the sitemap — internal search
results are low value to index and can open an unbounded crawl space — but it is
deliberately left crawlable so the `SearchAction` target stays fetchable.

### Routes deliberately kept out of the index

`/create`, `/create/[type]` and `/success` render but carry
`robots: { index: false }`. The self-serve product is switched off, so these are
unlinked from the live site and absent from the sitemap — without the noindex
they would be orphaned, crawlable pages.

### Slug stability

Slugs are the official district names. Two of the original city slugs were towns
rather than districts (`trichy`, `hosur`), so `public/.htaccess` holds permanent
redirects mapping them — and six other common town spellings — onto their parent
district. **Never rename a slug without adding a redirect there.**

---

## Where things live

```
src/
  main.tsx           browser entry — takes over the pre-rendered page
  entry-server.tsx   Node entry — the build renders every page with it
  routes.tsx         every route, its layout and its social card
  layouts/           root (JSON-LD, scroll), site (header, footer), builder
  pages/             one file per page: the component and its `meta`
  seo/               <head> tags, social cards, sitemap/robots/manifest, page list
  styles/globals.css design tokens and base styles
  components/
    landing/         hero, lead-form, features, pricing, testimonials, faq…
    site/            header, footer, page-hero, mobile-cta, contact-form, legal-page
    builder/         multi-step agreement builder
    tools/           stamp duty calculator          (not routed)
    ui/              button, card, field, accordion, motion, logo, link
  lib/
    site.ts          nav, footer, plans, cities, FAQs, testimonials, LEAD_ANCHOR
    services.ts      long-form content for the 4 service pages
    clauses.ts       dynamic clause generator (20 rules, 8 conditional)
    stamp-duty.ts    Tamil Nadu duty + registration fee engine
    agreement-store.tsx  builder state with debounced autosave
    submit-order.ts  sends every form to public/api/orders.php
scripts/
  prerender.mjs      writes dist/<page>.html, sitemap, robots, manifest, cards
  write-orders-config.mjs  the order desk's settings for orders.php
public/
  .htaccess          clean URLs, redirects, headers, 404 (Hostinger)
  api/orders.php     emails and Telegrams every order
```

### Design tokens

All in `src/styles/globals.css` under `@theme`. Navy `#0F172A`, royal blue
`#2563EB`, emerald `#10B981`, canvas `#F8FAFC`, borders `#E2E8F0`. Headings are
Source Serif 4, body is Inter, both self-hosted through `@fontsource` (imported
in `src/main.tsx`). Reduced-motion and print styles are handled globally at the
bottom of that file.

### Editing content

Most copy is data, not JSX:

- **Denominations, delivery zones, charges** → `src/lib/stamp-paper.ts`
- **Agreement plans and prices** → `PLANS` in `src/lib/site.ts`
- **Cities** → `CITIES` and `EXTRA_DISTRICTS` in `src/lib/site.ts`
- **FAQs** → `FAQS` in `src/lib/site.ts` (the `category` field drives grouping on `/faq`)
- **Testimonials, stats, features** → same file
- **Service pages** → `SERVICES` in `src/lib/services.ts`
- **Phone, WhatsApp, address, GSTIN** → `SITE` in `src/lib/site.ts`

---

## The forms

The lead form, the contact form and the agreement builder all send through
`submitOrder()` in `src/lib/submit-order.ts`, which posts the order to
`public/api/orders.php` (see Deploying). The order is a flat row built by
`enquiryRow` or `agreementRow` in `src/lib/orders.ts`; `orders.php` writes the
email and the Telegram message from it. A drafted agreement also carries its
deed, drawn as a PDF in the browser.

---

## Deploying

The site is static files, built for Hostinger's `public_html`. `npm run build`
writes all of it to `dist/`, `index.html` included, and nothing runs on a Node
server. Every page is still rendered to HTML at build time, so search engines
get full pages and the browser takes over from there. The two pages that read
the URL (`/search?q=` and `/success?id=`) do that part in the browser.

The build is four steps: `vite build` (the browser bundle and the page
template), `vite build --ssr` (a Node build of the same app),
`scripts/prerender.mjs` (every page in `src/seo/paths.ts` rendered into
`dist/`, plus the sitemap, robots.txt, manifest and social cards) and
`scripts/write-orders-config.mjs`.

1. Put the order desk's settings in `.env.local` or `.env`: `SMTP_*`,
   `ORDER_EMAIL` and `TELEGRAM_*` (see `docs/order-email.md` and
   `docs/telegram-notifications.md`), plus `NEXT_PUBLIC_GA_ID`.
2. Run `npm run build`. Its last line says whether email and Telegram are on.
3. Upload the **contents** of `dist/` into `public_html`, replacing what is
   there. Include the hidden `.htaccess`.

Hostinger's PHP (8.1 or newer, with curl — the default) and its `.htaccess`
support do the jobs a server would:

| Job | Done by |
| --- | --- |
| Emailing and Telegramming every order | `public/api/orders.php` |
| The deed PDF | drawn in the browser by `src/lib/agreement-pdf.tsx`, uploaded with the order |
| Clean URLs (`/about` serves `about.html`) | `public/.htaccess` |
| Old district URLs (`/rental-agreement/trichy` …) | `public/.htaccess`, as 301s |
| Security headers and the 404 page | `public/.htaccess` |

`orders.php` reads its settings from `dist/api/orders-config.php`, which
`scripts/write-orders-config.mjs` writes from `.env` at the end of every build.
It is never committed (`dist/` is ignored) and `.htaccess` refuses to serve it.
Change a setting, rebuild, upload again.

`orders.php` logs to Hostinger's PHP error log, in lines starting `[mail]`,
`[telegram]` and `[orders]`. `npm run dev` has no PHP, so there the forms show
their "call or WhatsApp us" error; orders only go out from the built site.

---

## Built but not switched on

The stamp duty calculator (`src/components/tools/stamp-duty-calculator.tsx`)
and OTP sign-in (`src/components/auth/login-form.tsx`) are complete but have no
page. To turn one on, add a page in `src/pages/`, a route in `src/routes.tsx`
and its URL in `src/seo/paths.ts` so the build writes it — plus
`src/seo/site-files.ts` if it belongs in the sitemap. Every conversion link uses
the `LEAD_ANCHOR` constant in `src/lib/site.ts`, so changing that one value
redirects the whole site. Sign-in sends people to `/dashboard`, which has not
been built yet.

### What the builder does

- 7 steps — property, landlord, tenant, terms, clauses, review, payment
- Debounced autosave to `localStorage`, restored on return
- **Dynamic clause generator** — 20 clauses, 8 conditional on your answers
  (furnished → inventory clause + Schedule B, pets, parking, lock-in, commercial
  use, maintenance split, registration once the term reaches 12 months)
- Live document preview beside the form, updating as you type, with unfilled
  fields shown as shaded blanks
- Running cost panel: stamp duty at 1% of (rent × term + deposit), registration
  fee where applicable, platform fee, and GST on our fee only
- Print stylesheet renders the agreement as A4 with proper page breaks
