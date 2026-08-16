# Deployment Checklist — InvoicePro

**Deployed:** ✅ https://invoice-manager-two-virid.vercel.app
**Repo:** https://github.com/olamideolanrewaju129-sketch/invoice-manager
**Deployment platform:** Vercel (connected to GitHub `main` branch, auto-deploys on push)

## Pre-deployment checks

- [x] Production build passes locally (`npm run build`) with no errors
- [x] TypeScript compiles clean, no `any` escapes in component props
- [x] All tests pass (`npm test` — 5/5 passing)
- [x] No secrets committed to the repo (`.env.local` correctly gitignored; verified via `git status` before every push)
- [x] Environment variables set in Vercel dashboard (`GEMINI_API_KEY`, marked Sensitive, set for Production + Preview)
- [x] Lighthouse audit run against production build (not dev mode): Accessibility 100, Best Practices 96-100, SEO 100, Performance 73-78
- [x] axe DevTools scan run on all 6 pages: 0 violations (1 real issue found and fixed — see below)

## How it fails safely

- **AI Insights API failure:** if the Gemini API call fails (rate limit, 503, network issue), the server-side route automatically retries up to 3 times with increasing delays (1s/2s/4s) before giving up. If all retries fail, the client falls back to the last successful cached result (stored in localStorage with a timestamp) and shows a clear message: "Showing insights from [time] — refresh failed, tap Retry to try again." The page never shows a blank screen or crashes.
- **Missing/invalid data:** form validation on Create Invoice and Add Client uses `aria-live` + `aria-describedby` to announce errors immediately, both visually and to screen readers, before submission is allowed.
- **No real backend/database:** data is stored in localStorage. If a user clears their browser storage, their data is lost — this is a known, documented limitation (see README), not a silent failure.

## Rollback plan

Deployment history is preserved automatically by Vercel — every push to `main` creates a new deployment, and prior deployments remain accessible. If a bad deploy ships:
1. Go to Vercel → Deployments tab
2. Find the last known-good deployment
3. Click "..." → "Promote to Production" (instantly reverts the live URL to that build, no rebuild needed)

Alternatively, `git revert` the problematic commit and push — this triggers a fresh, correct deployment through the normal pipeline.

## Monitoring

No dedicated monitoring service set up (out of scope for this project's size). Vercel's built-in deployment dashboard provides:
- Build/deploy success or failure notifications
- Runtime logs for the `/api/insights` serverless function (visible under the "Logs" tab), useful for diagnosing API failures after the fact

**Known gap:** no alerting if the app goes down or errors spike — for a real production app, the next step would be adding Vercel Analytics or a third-party uptime monitor (e.g. UptimeRobot).

## Real issue found and fixed during deployment prep

axe DevTools flagged a "Serious" severity issue — "Scrollable region must have keyboard access" — on the AI Insights page. A scrollable container was missing `tabIndex={0}`, meaning keyboard-only users couldn't focus it to scroll. Fixed by adding the missing `tabIndex`; re-scan confirmed 0 violations afterward.