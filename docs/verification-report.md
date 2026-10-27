# POPS Minibar — verification and launch-state report

**Verified:** 27 October 2026  
**Public preview:** https://shoot-extra-happen-males.trycloudflare.com  
**Private dashboard:** https://shoot-extra-happen-males.trycloudflare.com/admin/login

The public preview is a temporary encrypted tunnel to the local production build. It is suitable for review, not for paid-traffic launch; it remains available only while the local server and tunnel processes are running.

## Implemented and verified

- Premium English POPS Minibar landing page for Dubai holiday-home operators.
- Physical minibar is the primary hero subject; final hardware is explicitly unselected and the photographed unit is reference equipment.
- Interactive QR Checkout, Guest Allowance and Connected Minibar comparison.
- Selected setup transfers into the enquiry form.
- Server-side validation, spam controls, hashed-IP rate limiting and 30-day duplicate prevention.
- SQLite persistence on a persistent local filesystem; previous JSONL data left untouched.
- Private, server-protected dashboard with filters, relevance/contact stages, CSV export and deletion.
- Signed HttpOnly admin cookie; unauthenticated `/admin` verified to redirect to `/admin/login`.
- Primary `generate_lead` event only after a newly persisted enquiry.
- Duplicate submissions do not fire another primary conversion.
- UTM/click-ID attribution is allowlisted, consent-gated and removed from the visible URL after capture.
- Basic consent mode: Google tags do not load before optional consent; separate rejection, analytics-only and analytics-plus-ads choices; settings can be reopened.
- Privacy notice names Dragos Popescu as project initiator and does not invent a registered business, address, licence or Airbnb affiliation.

## Automated verification

| Check | Result |
|---|---|
| Unit tests | 7/7 passed |
| TypeScript | Passed |
| ESLint | Passed |
| Production build | Passed |
| Playwright desktop | 4/4 passed |
| Playwright mobile | 4/4 passed |
| Full E2E total | 8/8 passed |

E2E exercises configuration selection, form persistence, conversion firing, duplicate suppression, privacy identity, admin authentication, filtering, status updates, CSV export and deletion.

## Visual verification

Real full-page captures were generated and inspected at:

- `artifacts/pops-desktop-final.png` — 1440 px desktop
- `artifacts/pops-mobile-final.png` — true 390 px mobile; document width confirmed at 390 px

No material clipping, horizontal overflow, broken image crop, illegible control or form-layout defect was found. The black circular `N` visible in a development capture is the Next.js development indicator and is absent from the production build.

## Photography and licences

- `public/images/built-in-minibar.jpg`: “Hotel room minibar” by Mcrociani, CC BY-SA 3.0, Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Hotel_room_minibar.jpg
- `public/images/luxury-kitchen.jpg`: tommerton2010, CC BY 2.0, sourced through Flickr/Openverse during asset acquisition.

Attribution is displayed in the footer. The imagery is presented as environmental/reference photography, not as a POPS installation, manufacturer or supplier partnership. Before external ad creative reuses either image outside the site, archive the original source record and licence evidence with the campaign assets.

## Google Ads package

`docs/google-ads-launch-plan.md` contains:

- campaign and ad-group structure;
- exact/phrase keyword set;
- negative keyword list;
- Dubai Presence targeting and overseas-owner separation;
- two complete RSA packages;
- sitelinks, callouts and structured snippets;
- policy and trademark guardrails;
- conversion and offline-qualified-lead design;
- operating cadence and stop rules;
- source links to current official Google documentation.

All 30 headlines are at or under 30 characters. All eight descriptions are at or under 90 characters. No Keyword Planner account data was available, so no search volume, CPC, CPL or conversion-rate estimate is claimed.

## Proposed paid-test controls — not approved or activated

- Search Network only.
- Dubai Presence targeting.
- English.
- Brand: AED 20/day.
- High intent: AED 130/day.
- Total proposed daily cap: AED 150.
- Proposed duration: up to 14 days.
- Proposed hard media cap: AED 2,100.
- Primary conversion: newly saved valid enquiry.
- Offline stages: Qualified Lead and Pilot Agreed, initially Secondary while validated.

## Actual launch state

- Site: implemented and locally production-built.
- Temporary preview: active and externally verified with HTTP 200.
- Production hosting/domain: not configured; credentials were not available.
- Persistent production database: not configured; local SQLite must not be moved to ephemeral serverless storage.
- GTM/GA4/Google Ads IDs: hooks prepared, IDs not supplied.
- Google Ads account: no authorized account access supplied; existing campaigns could not be inspected.
- Campaigns in Google Ads: not created.
- Ads review state: not submitted.
- Spend: AED 0.
- Billing: unchanged.

## Remaining gates before paid traffic

1. Choose production hosting with persistent SQL storage or provision managed SQL.
2. Connect the final domain and production secrets.
3. Confirm controller/legal details and obtain UAE/privacy review.
4. Archive complete licence evidence for final campaign imagery.
5. Supply authorized GTM/GA4/Google Ads access and IDs.
6. Verify consent and network behavior in production with Tag Assistant.
7. Test the live saved-lead conversion and offline qualified-lead import.
8. Inspect the account for existing suitable campaigns to avoid duplication.
9. Present the exact account/campaign configuration.
10. Obtain Dragos’s explicit approval for the daily budget, AED 2,100 cap and activation.

No advertising may be activated before these gates and explicit budget approval.
