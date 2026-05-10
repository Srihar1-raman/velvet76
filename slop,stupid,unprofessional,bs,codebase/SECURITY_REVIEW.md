# Security + Code Quality Review

## Status legend
- `[x]` — fixed in this branch (see referenced files / commits)
- `[~]` — partially mitigated; follow-up tracked below
- `[ ]` — not started

## Findings (from original review)

- `[~]` **High** — route state writes into `localStorage` and is trusted by booking screens. _Now validated by a Zod schema in `src/lib/store.ts` (`sanitizeBookingState`). Tampered values fall back to safe defaults; angle-bracket payloads in address fields are rejected. Booking-screen consumers will see scrubbed input even if `localStorage` is hand-edited._
- `[~]` **Medium** — legacy-style booking logic in `BookClient` uses large HTML string rendering with dynamic values. _All user-controlled interpolations (pickup / drop / phone / OTP digits / autocomplete suggestions, including the Places API `query` reflected via `highlight()`) now go through `escapeHtml` / `escapeAttr` (`src/lib/escapeHtml.ts`). Same hardening applied to `CheckoutClient` and `ProfileClient`. Full JSX migration of `BookClient` remains a follow-up._
- `[x]` **Medium** — Google Maps key restrictions. _The leaked key in `.env.example` was scrubbed. The example file now documents the required GCP referrer + API restrictions. The key shape is also covered by the new gitleaks rule._
- `[ ]` **Low** — DOM listener teardown. _Tracked in the follow-ups section below; centralising on `AbortController` is a refactor, not a security fix._

## New findings (deeper analysis)

- `[x]` **High — Missing CSP header.** Strict CSP is now emitted from `next.config.ts` for every route. Inline scripts/styles still require `'unsafe-inline'` because of the imperative `onclick="..."` HTML strings in `BookClient`/`CheckoutClient`/`ProfileClient`; the migration to nonce-based CSP is gated on the JSX migration tracked below.
- `[x]` **High — OTP / dev codes in production build.** All three flows now resolve their OTP via `MOCK_OTP` from `src/lib/devConfig.ts`. The literal `"123456"` is dead-code-eliminated when `NODE_ENV !== 'development'`. Verified by `scripts/check-dev-leaks.mjs` (run via `npm run audit:bundle`).
- `[ ]` **Medium — No rate limiting on booking / OTP endpoints.** Velvet currently has no booking/OTP backend (the flow ends with a WhatsApp deep link). When the real `/api/book` and `/api/otp/{request,verify}` routes land they MUST be wrapped with `express-rate-limit` (or the Vercel/Edge equivalent). See template in the security audit dashboard.
- `[~]` **Medium — Subresource integrity on CDN assets.** Google Fonts CSS is loaded from `fonts.googleapis.com` without `integrity` because Google rotates the CSS payload. Mitigated by the new strict CSP `style-src` allowlist. Maps JS itself does not support SRI; the GCP referrer restriction + `connect-src` allowlist remain the controls.
- `[x]` **Medium — HTTPS / HSTS not enforced at app layer.** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` is now sent from `next.config.ts`. Submit `velvet-nextjs.vercel.app` to https://hstspreload.org once the directive has shipped to production.

## What changed in this branch

| File | Purpose |
|------|---------|
| `next.config.ts` | CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, `poweredByHeader: false`. |
| `src/lib/store.ts` | New `BookingStateSchema` (Zod) + `sanitizeBookingState()`. `loadState` clears `localStorage` and falls back to defaults on parse / validation failure. |
| `src/lib/escapeHtml.ts` | Shared `escapeHtml` / `escapeAttr` / `safeUrl` helpers for the imperative `innerHTML` paths that still exist. |
| `src/lib/devConfig.ts` | Single source of truth for the mock OTP literal. Production builds tree-shake the value out. |
| `src/lib/bookingPolicy.test.ts` | 15-test matrix covering service area, lead time, late-night airport+Gurugram subcase, tampered `localStorage`, and the XSS-in-address scenario. |
| `src/app/book/BookClient.tsx`<br>`src/app/checkout/CheckoutClient.tsx`<br>`src/app/profile/ProfileClient.tsx` | All user-controlled `innerHTML` interpolations escaped; all OTP comparisons routed through `MOCK_OTP`. |
| `eslint.config.mjs` | Adds `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`, plus a `no-restricted-syntax` rule that warns on any new `innerHTML` assignment or string-arg `setTimeout` / `setInterval`. |
| `.gitleaks.toml` | Adds rules for Google Maps API keys (`AIza...`), hardcoded OTP / passcode / PIN literals, and `DEV_OTP` / `MOCK_OTP` / `TEST_OTP` constants. Allowlists `src/lib/devConfig.ts` (centralised by design). |
| `.github/workflows/security.yml` | gitleaks → CodeQL JS/TS → ESLint + booking-policy tests → `npm audit --audit-level=high` → bundle audit (no dev OTP residue). Runs on push + PR + weekly cron. |
| `scripts/check-dev-leaks.mjs` | Walks `.next/` and fails if `'123456'` or any `DEV_OTP`-style constant survived into the production bundle. |
| `.env.example` | Real key removed; documents GCP referrer/API restrictions + the `NEXT_PUBLIC_DEV_MODE` toggle. |
| `package.json` | Adds `npm test`, `npm run test:watch`, `npm run audit:bundle`. New deps: `zod` (runtime), `vitest` (dev). |

## Operational follow-ups (tracked)

### Must do before next release

- `[ ]` **Rotate the Google Maps API key** that was committed to `.env.example` (`AIzaSyD…ZM8`). It must be revoked in GCP Console — replacing it in source is not enough.
- `[ ]` **Set GCP key restrictions** on the replacement: HTTP referrers `velvet-nextjs.vercel.app/*` (and any custom domain), API restrictions to Maps JavaScript API + Places API only.
- `[ ]` Submit production domain to https://hstspreload.org once HSTS is live in prod traffic.

### Short-term hardening (next 2 sprints)

- `[ ]` Migrate `BookClient` / `CheckoutClient` / `ProfileClient` from imperative `innerHTML` strings to JSX components. This unlocks dropping `'unsafe-inline'` from CSP `script-src` (switch to nonces).
- `[ ]` Centralise DOM-listener teardown using `AbortController` in the imperative IIFEs (memory-leak hardening tracked under the original Low finding).
- `[ ]` When the booking / OTP backend lands, add `express-rate-limit` (or edge-runtime equivalent) — 5 req/min per IP for `/api/book`, 3 req/5min for `/api/otp/*`.
- `[ ]` Replace the mock OTP verifier with a server-issued OTP. Once that ships, remove `MOCK_OTP` and `OTP_HINT_TEXT` from `src/lib/devConfig.ts` entirely.

### Ongoing

- `[x]` `npm audit --audit-level=high` blocking PRs (CI workflow `audit` job).
- `[x]` Bundle-residue audit blocking PRs (CI workflow `bundle-audit` job).
- `[x]` CodeQL JS/TS security suite weekly + on PR.
- `[x]` Booking-policy test matrix runs on every PR.

## Booking-policy coverage matrix

The 8 scenarios called out in the original review map to `src/lib/bookingPolicy.test.ts` as follows:

| # | Scenario | Test |
|---|----------|------|
| 1 | Valid service area (Gurugram coords + 4h lead) | `service area allowlist > accepts Gurugram coords` + `lead time policy > accepts +3h lead time` |
| 2 | Outside service area (Chandigarh coords) | `service area allowlist > rejects Chandigarh coords` |
| 3 | Baseline lead time (+3h) accepted | `lead time policy > accepts +3h lead time` |
| 4 | Under baseline (+2h) rejected | `lead time policy > rejects +2h lead time` |
| 5 | Late-night airport+Gurugram, +4h accepted | `lead time policy > late-night airport+Gurugram with +4h lead is accepted` |
| 6 | Late-night airport+Gurugram, +3h rejected | `lead time policy > late-night airport+Gurugram with only +3h lead is rejected` |
| 7 | Tampered `localStorage` cleared | `localStorage state sanitization > rejects tampered service area and clears the value` |
| 8 | XSS in address field escaped | `localStorage state sanitization > strips angle-bracket content from address fields` |

## CodeQL / Static analysis

`.github/workflows/security.yml` ships the recommended pipeline: gitleaks → CodeQL → ESLint → vitest → `npm audit` → bundle audit. Wire `GITHUB_TOKEN` permissions exactly as set in the workflow file (`security-events: write` is required for CodeQL SARIF upload).
