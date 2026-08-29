# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A paywalled, PWA-installable 30-day "AI Mastery" course by Pro Sphinx. A single Express server serves a
static-feeling frontend, gates the lesson content behind auth + payment, and stores users/progress in Supabase.
There is no build step and no bundler — everything is hand-written vanilla JS/CSS/HTML served directly.

## Commands

```bash
npm install       # install deps (no node_modules committed)
npm start          # node server.js — production start
npm run dev         # nodemon server.js — auto-restart on change (nodemon is NOT in package.json deps; install it globally or use `npx nodemon server.js`)
```

There is no lint, test, or build script defined in `package.json`. There is no test suite in this repo — verify
changes manually (start the server and hit it with curl/browser, see "Manual verification" below).

Server listens on `process.env.PORT` (default 5000), bound to `0.0.0.0`.

### Required environment variables

Set these before starting the server (see `render.yaml` for the production deploy config):

- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — Supabase project + service-role key
- `JWT_SECRET` — signs the `aim_token` auth cookie. **Set once and never rotate via `generateValue`** — rotating it logs everyone out (see comment in `render.yaml`)
- `STRIPE_SECRET_KEY`, `STRIPE_PAYMENT_LINK` — Stripe checkout
- `STRIPE_WEBHOOK_SECRET` — verifies `/webhook` signatures (optional in dev — falls back to unverified `JSON.parse` if unset)

`server.js` logs a warning at startup listing any of `REQUIRED` (server.js:13) that are missing, but still boots.

> Note: `env.example` in the repo root is **not actually a text file** — despite the name it's a PNG image
> (confirmed via `file`). Don't try to read it for the env var list; use the list above and `render.yaml` instead.

### Manual verification

Since there's no test suite, sanity-check changes by running the server and exercising it directly:

```bash
npm start
curl http://localhost:5000/ping                     # health check
curl -i http://localhost:5000/app.js                 # should return the unauth stub (see below) without a session cookie
```

For frontend/lesson-content changes, open the app in a browser, register a test account, and click through the
dashboard/lesson/quiz flow — the paywall means most of the app is inaccessible without either a DB row with
`has_access = true` or a completed Stripe checkout.

## Architecture

### One Express process, four moving parts

`server.js` is a single file doing routing, auth, and payments. Key things that aren't obvious from skimming
individual routes:

1. **`index.html` is not actually served as a static file.** `server.js` embeds a full copy of the page markup
   as a template literal (`INDEX_HTML`, server.js:30-837) and serves *that* for `/` and the catch-all `app.get('*')`
   route (server.js:1160-1169), specifically to avoid "static file truncation issues". `express.static` is also
   mounted (server.js:1165), so other static assets (CSS, images, icons) are served normally — **but the on-disk
   `index.html` itself is effectively dead weight**; if you edit page markup, you must edit the `INDEX_HTML`
   string in `server.js`, not (only) `index.html`, or your changes won't show up. Keep both in sync if you touch
   markup, or grep for `INDEX_HTML` to confirm which copy is live.

2. **`/app.js` is a paywall gate, not a static file route** (server.js:1055-1064). It's declared *before* the
   `express.static` mount, so it intercepts requests for `app.js`. If the requester isn't authenticated or their
   `profiles.has_access` is false, it serves `serveStub()` (server.js:1066-1083) — a tiny inline script with
   no-op stand-ins for `renderDashboard`/`generateCert`/`updateStats` and a `showView()` that redirects any
   non-free view to the paywall modal. Free views are hardcoded as `['hero', 'intro']`. The real course logic
   (lesson data, quiz engine, dashboard rendering) only reaches the browser once `has_access` is true — so the
   full 30-day curriculum in `app.js` is technically visible to anyone who is logged in without paying (the gate
   is server-side delivery of the script, not per-lesson authorization).

3. **The Stripe webhook must stay ahead of the JSON body parser.** `app.post('/webhook', express.raw(...))`
   (server.js:846) is registered before `app.use(express.json())` (server.js:889) because Stripe's signature
   verification needs the raw body. Do not reorder these, and do not add a global JSON body parser before the
   webhook route.

4. **Auth is a JWT in an httpOnly cookie** (`aim_token`, server.js:911-918), 30-day expiry, `credentials: 'include'`
   used on every frontend fetch. `requireAuth` (server.js:892) checks the cookie or an `Authorization: Bearer`
   header; `getAuthUser` (server.js:903) is the non-throwing variant used by the `/app.js` gate.

### Frontend split: `index.html` inline scripts vs. `app.js`

- **`index.html`**'s own `<script>` block (embedded inside `INDEX_HTML` in server.js) owns auth (`submitAuth`,
  `showAuthModal`/`hideAuthModal`), the paywall modal, Stripe checkout kickoff (`handlePurchase`), theme
  toggle, service worker registration, and post-payment polling of `/api/auth/me` (waits up to 30s for the
  Stripe webhook to flip `has_access`, see `initApp()`).
- **`app.js`** (gated as described above) owns everything past login: the `COURSE` data object (all 30 lessons,
  quizzes, prompts — server.js loads this file wholesale, so it's also where lesson content lives), view
  switching (`showView`), dashboard rendering, the lesson reader, quiz grading, streak/XP calculation, and
  certificate generation.

### Progress persistence

`server.js` exposes `GET/POST /api/progress`, which read/write Supabase's `progress` and `user_stats` tables and
compute streak/XP server-side. The frontend wires into this at two points:

- `completeLesson()` (app.js) calls `saveState(day, lesson.xp, computeQuizScore(day))`, which `POST`s to
  `/api/progress` with the lesson's stated XP reward and the quiz score (% of that lesson's questions answered
  correctly). The server is authoritative for `xp`/`streak` — it upserts `user_stats` and returns the updated row,
  and `saveState()` copies it straight into `state.xp`/`state.streak` rather than recomputing locally (avoids
  client/server drift). If the request fails (e.g. offline), it falls back to a local optimistic bump so the UI
  doesn't stall.
- On page load, `initApp()` (in the `index.html` inline script — **and its duplicate inside `server.js`'s
  `INDEX_HTML` string, see above; both were updated together**) fetches `/api/auth/me` and, if the user has
  access, also fetches `GET /api/progress` and passes both into `hydrateProgress(stats, progress)` (app.js),
  which rebuilds `state.completedLessons`/`xp`/`streak`/`currentWeek` from the DB. This is what makes completed
  lessons, XP, and streak survive a reload/new device instead of resetting every page load.

The `xp` field on `POST /api/progress` is optional — if omitted, the server falls back to its original
`10 + score` formula, so older callers keep working.

### Data model (Supabase / Postgres)

Schema lives in `supabase-setup.sql` (run once, manually, in the Supabase SQL editor — there's no migration
tooling):

- `profiles` — id, email, password_hash (bcrypt, cost 12), `has_access` (flipped by the Stripe webhook or manual
  admin action), `stripe_payment_id`
- `user_stats` — one row per user, xp/streak/last_activity (server-computed in `/api/progress`, see above)
- `progress` — per-user per-lesson-day completion rows, unique on `(user_id, lesson_day)`

### Payment flow

1. Logged-in user hits "Purchase" → `POST /api/checkout` (server.js:1048) returns the Stripe Payment Link with
   `client_reference_id` set to the user's id.
2. Stripe redirects back to `/?payment=success` on completion; the frontend polls `/api/auth/me` for up to 30s
   waiting for `has_access` to flip.
3. Stripe's `checkout.session.completed` webhook (server.js:862-883) is the actual source of truth — it sets
   `profiles.has_access = true`, matched by `client_reference_id` first, falling back to matching by email.

### Static/PWA surface

`manifest.json` + `sw.js` make this an installable PWA. `sw.js` is network-first with a cache fallback for the
app shell, and explicitly skips caching/intercepting any `/api/*` request so auth state always hits the network.
`/.well-known/assetlinks.json` (server.js:1144) exists for Android TWA (Trusted Web Activity) verification —
the SHA-256 fingerprint there is tied to a specific Play Store signing key.

### Deployment

Deploys to Render via `render.yaml` (Node web service, `npm install` / `npm start`). Secrets (`SUPABASE_SERVICE_KEY`,
`JWT_SECRET`, `STRIPE_*`) are `sync: false` and must be set manually in the Render dashboard.
