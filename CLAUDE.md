# CLAUDE.md - RoboTUM Website

Marketing + content site for the RoboTUM student robotics club (TUM). Public pages are content-driven from Supabase; a protected `/admin` area does CRUD.

## Tech stack
- **React 19** + **Vite 5** (`npm run dev | build | preview`)
- **Tailwind CSS v4** (config-light; design tokens live in `src/styles/globals.css` `@theme`)
- **React Router 7** (`react-router-dom`)
- **Supabase** (Postgres + Auth + Storage) via `@supabase/supabase-js`
- **EmailJS** (contact/partner form), **Heroicons**, **clsx**
- Hosting: **Vercel** (`vercel.json`); DNS in Wix; prod = `robotum.info`
- Tooling: **ESLint** (`npm run lint`, `lint:fix`), Prettier, Playwright + Vitest installed (no specs yet)

## Commands
```bash
npm run dev      # local dev server
npm run build    # production build - primary safety net (fails on bad @theme/@apply/imports)
npm run lint     # eslint . (no-unused-vars = warn; unused-imports = error)
```
Always run `build` + `lint` after changes. Verify mobile + desktop; verify behavior on prod (CDN caching differs from local).

## Environment
Env vars are `VITE_*` (see `.env.example`). `.env.local` is gitignored - never commit it, never hardcode keys/URLs. Supabase client: `src/lib/supabaseClient.js`.

## Directory map
```
src/
  main.jsx              # boots; Hash vs Browser router by env (subpath deploys)
  App.jsx               # all routes (lazy) + admin guard + Suspense
  styles/globals.css    # @theme tokens, surfaces, buttons, utilities, animations - design SoT
  lib/supabaseClient.js # the ONLY place Supabase is constructed
  data/                 # API layer: *Api.js + index.js barrel (import from "@data")
  hooks/                # useAsyncData (shared fetch state)
  utils/                # formatCategory, logger, date-range, scrollToSection
  components/
    ui/                 # Button, ImageFrame, ProjectCard, PartnerLogo, ScrollToHashElement
    admin/              # AdminLayout, AdminRoute, AdminListHeader, AdminPagination, AdminErrorBanner, AdminSideCard
    sections/
      common-sections/  # Navbar, FooterSection, PageLoader, SectionLoader, NewsTicker
      <page>-sections/  # homepage-, about-us-, events-, join-us-, partners-, faqs- sections
  pages/                # one file per route (+ pages/admin/*)
```
Path aliases (`vite.config.js` + `jsconfig.json`): `@ @assets @components @pages @styles @utils @data @lib @hooks @config`. Use `@components/...` (not `@/components/...`).

**Fundraising number** (Home "Support our mission" section): hardcoded in `src/config/fundraising.js`. To update the amount raised, edit `raisedAmount` and redeploy - not stored in Supabase.

## Data & API rules (IMPORTANT)
- **All** data access goes through `src/data/*Api.js`. **UI never calls Supabase directly** - including auth (`src/data/authApi.js` wraps `supabase.auth.*` + `profiles`).
- Normalize/shape data inside the API layer; select only needed fields (e.g. `FAQ_SELECT`), not `*`.
- Always handle `null`/`undefined`/empty defensively (`data ?? []`). Never blank UI on error.
- Use the `useAsyncData(asyncFn, deps, { errorMessage })` hook for fetch+loading+error in components.
- Supabase Storage is CDN-cached: upload via `storageApi.js` (unique filenames), never overwrite same URL.
- Before debugging "missing data", check the query shape **and** RLS policies (public read must be explicitly allowed).

## Routing constraints (don't break)
- Projects use query params: `/projects?type=technical|operations|innovation-and-entrepreneurship` (+ `?q=`, `?tag=`). The Navbar projects dropdown depends on this - preserve it.
- `/robocast` is a **separate page**, NOT a projects tab.
- All routes must work on direct nav AND reload (deep links: `/events/:slug`, `/projects/:slug`).
- Use `<Link>` for internal nav, not `<a>`.
- `vercel.json` has an external redirect for the humanoid 3D viewer - keep it.

## Design language - "refined futuristic" (dark + deliberate light accents)
Tokens + reusable classes live in `src/styles/globals.css`. **Use them; don't hardcode.**
- **Color tokens** (`@theme`): `primary secondary accent light surface-light` + elevated surfaces `base elevated-1 elevated-2 inset elevated-border`. Use `bg-elevated-1/80` etc. - do NOT paste raw navy hexes (`#0B1530`, `#0F1C3A`, …).
- **Type scale**: `--text-hero/h1/h2/text1/text2`; headings use `.heading .heading-h1/-h2`. Text color levels: heading `text-white`, body `text-white/70`, muted `text-white/50`.
- **Section surfaces**: `.section-dark-primary`, `.section-dark-secondary`, `.section-light`; wrap content in `.section-container`; heroes use `.hero-offset` / `.hero-orbit-bg`.
- **Cards**: `.card-surface` (+ `.card-surface-hover`), `.card-inset`; inputs `.field-input`; labels `.chip`; deliberate bright section `.feature-panel`. Standard card padding `p-6 sm:p-8`.
- **Buttons**: only via `Button.jsx` (variants `primary | primary-light | secondary | secondaryStatic`, sizes `sm | md | lg`) + the `.btn-*` classes. Don't invent button styles.
- **Gradients**: `.text-gradient*` for accent words/headings + `.btn-primary`. Keep brand blue→purple→cyan; use sparingly.
- **Motion**: tasteful; hero orbs + marquee + ticker kept. All animation respects the global `prefers-reduced-motion` block - don't add motion that ignores it.
- **a11y**: every interactive element needs hover + `focus-visible` (cards use `focus-within`). Mobile-first; test 320 / 768 / 1280.

## Conventions
- Reuse existing components/utilities before adding new ones; don't introduce new UI patterns without clear justification.
- Keep components small/focused; extract shared logic to `utils/` or `hooks/`.
- Log via `utils/logger.js` (silent in prod), not raw `console.*`.
- For multi-file/architectural features: plan first, implement in small verifiable steps.

## Watch-outs
- `.surface-1/.surface-2/.surface-light` are hand-written gradient classes - don't create `@theme` colors with those names (collision).
- Admin auth bugs lock people out: after touching `authApi.js` / `AdminRoute` / `AdminLogin` / `AdminLayout`, manually verify login (admin in, non-admin bounced+signed-out, authed reload, logout).
