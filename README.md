# InvoicePro

An invoice and billing manager for freelancers and small teams, built with Next.js App Router — with AI-powered payment insights that actually analyze real invoice data, not a chatbot bolted onto the side.

**Live app:** https://invoice-manager-two-virid.vercel.app
**Repo:** https://github.com/olamideolanrewaju129-sketch/invoice-manager

---

## What it does

- Track clients and invoices (create, view, delete)
- Dashboard with real computed summaries: Total Revenue, Outstanding, Overdue Count
- **AI Insights** — analyzes your actual invoice/payment data and returns a structured summary: overall payment trends, your slowest-paying client, total overdue amount, and specific recommendations (e.g. "escalate with Client X, their balance is 32 days overdue")
- A health-check page (`/health`) demonstrating live server-side data fetching (exchange rates), separate from the core app, used during earlier development to validate deployment reliability

## Setup & run locally

```
git clone https://github.com/olamideolanrewaju129-sketch/invoice-manager.git
cd invoice-manager
npm install
```

Copy `.env.local.example` to `.env.local` and add your own Gemini API key (free at [aistudio.google.com](https://aistudio.google.com)):

```
GEMINI_API_KEY=your-key-here
```

```
npm run dev
```

Open `http://localhost:3000`. That's it — one command to install, one to run.

To run tests: `npm test`
To build for production: `npm run build && npm run start`

## Architecture

```
src/
├── app/
│   ├── page.tsx              → Dashboard (Server Component, reads computed summary)
│   ├── invoices/              → Invoice list + delete
│   ├── invoices/new/          → Create Invoice form (Client Component)
│   ├── clients/                → Client list + Add Client form
│   ├── insights/               → AI Insights page (Client Component, fetches /api/insights)
│   ├── api/insights/route.ts   → Server-side API route: calls Gemini, returns structured JSON
│   ├── health/                 → Health-check page (live exchange rate fetch)
│   └── settings/
├── lib/
│   ├── storage.ts              → localStorage data layer (CRUD for clients/invoices, summary calc)
│   └── utils.ts
├── components/
│   ├── StatusBadge.tsx         → Color-coded invoice status badge (tested)
│   └── ui/                     → shadcn/ui components (Dialog, Tabs) — see FE-05 for source comparison
```

**Data layer:** all data lives in the browser's localStorage, seeded with sample clients/invoices on first load. There's no real backend — see "Known limitations" below for why, and what a real version would need.

**Server/Client Component split:** pages that only read and display data (Dashboard, Invoices list) are Server Components. Anything using `localStorage`, `useState`, or form handling is explicitly marked `'use client'`, since localStorage only exists in the browser.

## AI integration explained

**How it fits:** The `/insights` page calls `/api/insights`, a Next.js API route running server-side. That route takes the current invoice data (client name, amount, status, due date, days overdue), builds a prompt asking Gemini to analyze payment patterns, and requests structured JSON output using Gemini's `responseSchema` feature — this guarantees the response matches a fixed shape (`summary`, `trends`, `slowestPayingClient`, `totalOverdueAmount`, `recommendations`) rather than parsing free-text and hoping it's valid.

**Why a server-side route, not a direct client call:** the Gemini API key must never be exposed in the browser. Routing the request through `/api/insights` keeps the key server-only (`process.env.GEMINI_API_KEY`), while the browser only ever talks to our own API route.

**What prompt, and why:** the prompt is deliberately narrow — "analyze this specific invoice data for payment trends, identify the slowest payer, and recommend concrete next actions" — not an open-ended chat. This is the difference between a gimmick AI feature and a real one: it performs an actual function (payment pattern analysis) that would otherwise require the user to manually scan every invoice and do the math themselves.

**Provider note:** originally built against the Claude API, but switched to Google's Gemini API (free tier, no card required) partway through development due to Claude API credit constraints. The architecture — secure server-side route, structured JSON output, error handling — is identical regardless of provider; only the SDK call inside the route changed.

## Known limitations & future improvements

- **No real database** — data is stored in localStorage, so it's per-browser and lost if storage is cleared. A real version would use a proper database (Postgres via Supabase or similar) with actual user accounts.
- **No authentication** — anyone with the URL sees the same seeded sample data structure; there's no concept of "your" invoices vs. someone else's.
- **AI Insights depends on a third-party API's uptime** — Gemini's free tier occasionally returns 503 (high demand) errors. Mitigated with automatic server-side retries (3 attempts, increasing delay) and a client-side fallback to the last cached successful result, but a fully offline-first version isn't implemented.
- **Performance score (Lighthouse) sits at 73-78**, not 90+ — largely driven by the AI Insights page's dependency on a live external API call before it can render content. Other pages score higher. A future version could pre-fetch/cache insights server-side on a schedule rather than on-demand per page load.
- **No invoice editing** — invoices can be created and deleted, but not edited after creation. Straightforward to add, deprioritized for time.

## Testing evidence

`npm test` — Vitest + React Testing Library, 2 test files, 5 tests, all passing:
- `StatusBadge.test.tsx` — confirms correct label/color for paid, unpaid, and overdue states
- `storage.test.ts` — confirms dashboard summary math (revenue, outstanding, overdue count) is calculated correctly

Testing caught a real bug during development: a duplicate overdue-counter calculation in `storage.ts`, found and fixed because the test failed against expected output — not found by manual clicking around.

## Accessibility

Built against WCAG 2.1 AA. Verified with axe DevTools across all 6 pages: 0 violations. One real issue was found and fixed during development — a scrollable container missing keyboard focus support (`tabIndex`), flagged as "Serious" severity — see `DEPLOYMENT-CHECKLIST.md` for details.

## Deployment

See `DEPLOYMENT-CHECKLIST.md` for the full checklist, rollback plan, and error-handling documentation.
