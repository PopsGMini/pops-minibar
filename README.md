# POPS Minibar — Dubai market-test site

A production-oriented market-validation site for a proposed minibar system for Dubai holiday homes. The product is explicitly presented as pilot-stage; the site does not claim that final hardware, payments, notifications or sensors are commercially available.

## Local development

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Required local/private values:

```env
DATABASE_PATH=.data/pops-minibar.sqlite
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=at-least-32-random-characters
RATE_LIMIT_SECRET=another-random-secret
```

Open:

- Public site: `http://localhost:3000`
- Private enquiries: `http://localhost:3000/admin/login`

## Persistence

Enquiries are stored in SQLite at `DATABASE_PATH`. The database uses WAL mode and persists across application restarts on a normal Node host with a persistent filesystem.

**Deployment constraint:** ephemeral/serverless filesystems are not acceptable for production lead storage. For Vercel or another serverless host, move the repository layer in `lib/database.ts` to managed PostgreSQL/Turso/Supabase/Neon before paid traffic. Do not launch advertising against non-persistent storage.

The previous `.data/leads.jsonl` file is intentionally left untouched for recovery. A pre-rebuild source archive is also stored under `archive/`.

## Private administration

The private dashboard supports:

- server-side, signed HttpOnly session cookies;
- search and filters;
- relevance and contact-stage updates;
- CSV export with spreadsheet-formula escaping;
- permanent deletion for data requests.

Production fails closed when `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing. Never commit `.env.local`.

## Lead integrity

The submission endpoint provides:

- server-side allowlist validation;
- honeypot and minimum-completion-time checks;
- hashed-IP rate limiting;
- 30-day duplicate prevention for the same email and property location;
- success confirmation only after a committed database write;
- consent-gated attribution capture for allowlisted UTM parameters, `gclid`, `gbraid` and `wbraid`.

The primary `generate_lead` event fires only for a newly saved enquiry. Duplicate or failed submissions do not fire it.

## Measurement configuration

Optional variables:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
# Or, when GTM is not used:
NEXT_PUBLIC_GOOGLE_TAG_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://example.com
```

The launch configuration uses basic consent mode: Google measurement tags remain blocked until a visitor chooses. The preference control supports rejection, analytics-only consent, or analytics plus advertising measurement; advertising personalization remains denied. Standard analytics events contain no submitted name, email or location details. Visitors can reopen the settings from the footer.

Recommended events:

- Primary: `generate_lead` after successful database save.
- Secondary: `pilot_cta_click`, `setup_selected`, `pilot_form_started`, `pilot_form_error`.

Google Ads activation, enhanced conversions and qualified-lead uploads require separate account access, consent/legal configuration and explicit approval.

## Verification

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

Playwright uses a separate E2E database and test-only admin credentials.

## Launch documents

- Implementation plan: `.hermes/plans/2026-10-26_221957-pops-minibar-market-test.md`
- Google Ads strategy and ad package: `docs/google-ads-launch-plan.md`
- Launch checklist: `docs/launch-checklist.md`
