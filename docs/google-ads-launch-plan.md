# POPS Minibar — Google Ads Dubai pilot package

**Prepared:** 26 October 2026  
**Status:** strategy and assets prepared locally; no campaign created, activated or funded  
**Market:** Dubai B2B holiday-home owners, hosts, operators and property managers  
**Primary objective:** saved, qualified pilot enquiries—not traffic or button clicks

> All budgets below are proposed test controls, not forecasts. No CPC, lead-volume, conversion-rate or revenue assumptions are invented. Activation requires Dragos’s explicit approval after the public site, consent, persistence and conversion tracking are verified.

## 1. Recommended test design

### Campaigns

| Campaign | Purpose | Initial state | Proposed daily cap |
|---|---|---:|---:|
| `POPS | Search | Brand | Dubai` | Isolate searches for POPS/POPS Minibar | Enabled only if search volume exists | AED 20 |
| `POPS | Search | High Intent | Dubai` | Capture concrete B2B minibar/holiday-home intent | Main pilot | AED 130 |

**Proposed total:** AED 150/day for up to 14 days; hard media cap AED 2,100. This is a controlled downside limit, not a forecast. Do not include agency, creative, tax or payment-processing costs in the media cap.

### Network and geography

- Search Network only for the first test.
- Search Partners off initially and tested separately later.
- Location: Dubai, or the exact serviceable UAE geography.
- Advanced location option: **Presence—people in or regularly in the targeted location**.
- Language: English initially because the landing page and ads are in English.
- Do not treat Google location inference as exact geofencing.
- If POPS later wants absentee overseas owners, test them in a separate campaign so the Dubai-local result remains interpretable.

### Bidding sequence

1. During conversion QA: Maximize Clicks with a conservative bid limit and strict total cap.
2. After the saved-lead action is proven reliable: Maximize Conversions.
3. Add offline `Qualified Lead` and `Pilot Agreed` stages as Secondary while validating uploads.
4. Consider optimizing to the deeper stage only after attribution and lead-stage imports are reliable.
5. Do not start broad match without conversion-focused Smart Bidding and reliable conversion data.

## 2. Ad groups and keywords

Use phrase and exact match at launch. Keyword Planner and the live account should be used before activation to assess actual eligibility and estimates.

### Ad group A — Minibar service

**Exact**

- `[minibar service dubai]`
- `[managed minibar dubai]`
- `[minibar supplier dubai]`
- `[minibar system dubai]`
- `[hotel minibar service dubai]` — retain only if search terms show relevant holiday-home operators

**Phrase**

- `"minibar service dubai"`
- `"managed minibar service"`
- `"minibar system for apartments"`
- `"minibar for property managers"`

### Ad group B — Holiday-home minibar

**Exact**

- `[holiday home minibar]`
- `[holiday rental minibar]`
- `[airbnb minibar dubai]`
- `[minibar for holiday home]`

**Phrase**

- `"minibar for holiday homes"`
- `"minibar for airbnb hosts"`
- `"holiday rental minibar"`
- `"guest minibar for apartment"`

“Airbnb” can be tested as a keyword, but it should be omitted from conservative launch ad copy. POPS must not imply partnership or endorsement.

### Ad group C — Guest refreshments and amenities

Use only if the search-term report demonstrates owner/operator purchasing intent.

**Exact**

- `[guest refreshment service dubai]`
- `[holiday home guest amenities]`
- `[vacation rental guest supplies]`

**Phrase**

- `"guest refreshments for holiday homes"`
- `"guest amenities for property managers"`
- `"holiday home welcome supplies"`

Pause this group if it attracts general hospitality supplies, hotel guests or consumer shopping rather than pilot buyers.

## 3. Negative keyword starter list

Apply an initial account/campaign list, then expand it from real search terms. Review carefully before using broad negatives.

### Jobs and education

`jobs`, `job`, `career`, `salary`, `vacancy`, `internship`, `training`, `course`

### Guest accommodation and travel

`hotel booking`, `apartment booking`, `holiday rental booking`, `cheap hotel`, `room rate`, `stay`, `tourism`, `flight`

### Consumer/home appliance intent

`for bedroom`, `for home`, `personal`, `portable fridge`, `mini fridge`, `refrigerator`, `used`, `second hand`, `repair`, `spare parts`, `manual`, `dimensions`, `amazon`, `noon`, `carrefour`

### Free/DIY/information-only

`free`, `template`, `download`, `pdf`, `how to build`, `diy`, `make your own`, `definition`, `meaning`, `images`, `wallpaper`

### Irrelevant hospitality and regulated-product intent

`bartender`, `cocktail bar`, `nightclub`, `bar menu`, `alcohol delivery`, `liquor`, `wholesale alcohol`

Do not exclude useful terms solely because they are broad; make decisions from the actual query and buyer intent.

## 4. Responsive Search Ad package

The current Google limits are 3–15 headlines, 2–4 descriptions, 30 characters per headline, 90 per description and 15 per path field. Assets can appear in arbitrary combinations, so every line must work independently.

### RSA — high-intent minibar system

**Headlines**

1. Dubai Minibar Pilot
2. Minibar Systems for Hosts
3. Built for Holiday Homes
4. Explore POPS Minibar
5. Compare 3 Pilot Setups
6. For Dubai Property Managers
7. QR Checkout Option
8. Guest Allowance Option
9. Connected Minibar Concept
10. Plan Guest Refreshments
11. Register Pilot Interest
12. Discuss Your Properties
13. Practical Restock Records
14. Clear Product Pricing
15. Physical Minibar First

**Descriptions**

1. Explore a proposed minibar system for Dubai holiday homes. Register pilot interest.
2. Compare QR Checkout, Guest Allowance and Connected Minibar concepts for your portfolio.
3. Tell us your property count, preferred setup and service budget. No payment required.
4. Built for hosts and operators. Final hardware, terms and availability are not confirmed.

**Path fields:** `dubai` / `minibar-pilot`

### RSA — holiday-home operators

**Headlines**

1. Minibars for Holiday Homes
2. Dubai Host Minibar Pilot
3. A Better Guest Amenity
4. POPS Minibar Systems
5. For Hosts and Operators
6. Explore the Dubai Pilot
7. Compare Minibar Setups
8. QR Guest Checkout
9. Controlled Guest Allowance
10. Connected Minibar Concept
11. Clear Pilot Enquiry
12. Plan Stock and Restocking
13. Register Property Interest
14. For Growing Portfolios
15. No Installation Commitment

**Descriptions**

1. Explore a proposed physical minibar system designed around Dubai holiday homes.
2. Compare three pilot setups and tell us which approach fits your properties.
3. Register concrete interest with your area, portfolio size and proposed service budget.
4. No payment or installation commitment. Final pilot terms would be agreed separately.

**Path fields:** `holiday-homes` / `pilot`

### Assets

**Sitelinks**

- Compare setups → `/#setups`
- How it works → `/#how-it-works`
- Dubai pilot enquiry → `/#enquiry`
- Privacy details → `/privacy`

**Callouts**

- Proposed Dubai pilot
- Physical minibar first
- Three setup concepts
- No payment required
- Built for property operators
- Clear limitations disclosed

**Structured snippet — Types**

- QR Checkout
- Guest Allowance
- Connected Minibar

Do not add phone, WhatsApp, price, promotion, review, image or lead-form assets until each destination/data flow is staffed, accurate and verified.

## 5. Conversion architecture

### Primary action at launch

`Lead submitted`

- Trigger only after the API confirms a newly persisted enquiry.
- Count one conversion per saved lead.
- Do not trigger for clicks, validation failures, spam, duplicate submissions, reloads or back navigation.
- The site event is `generate_lead` and contains no name, email or property-location PII.

### Secondary diagnostics

- `pilot_cta_click`
- `setup_selected`
- `pilot_form_started`
- `pilot_form_error`

These are behavioural diagnostics, not business conversions and should not drive bidding.

### Offline stages

1. `Qualified Lead`: verified Dubai holiday-home owner/operator with genuine operational fit and reachable contact.
2. `Pilot Agreed`: commercial pilot terms accepted or a paid pilot/order confirmed.

Use the current supported Data Manager/import flow. Google states ordinary offline imports have a 90-day post-click limit and enhanced-conversions-for-leads events a 63-day limit. Upload frequently and preserve available GCLIDs only when disclosure, consent and policy requirements are satisfied.

Enhanced conversions for leads should initially remain Secondary for Google’s recommended 2–3-week validation period. Hashing identifiers does not make them anonymous or remove legal/policy obligations.

## 6. Consent and attribution launch configuration

POPS uses a conservative **basic Consent Mode v2** implementation:

- Google Analytics/Ads/GTM tags are blocked until the visitor accepts optional measurement.
- Before acceptance or after rejection, no site-generated Google measurement should fire.
- Campaign/query and Google click identifiers are captured only after measurement consent and removed from the visible URL.
- Lead PII stays in the private database and is never placed in URLs, page titles, data-layer events or ordinary analytics parameters.
- Newsletter consent is separate and optional.

Before launch, verify with DevTools and Tag Assistant that rejection creates no `_ga`/`_gcl_*` storage and no Google measurement request. Visitors in the EEA, UK and Switzerland require Google consent handling based on their location even though the campaign targets Dubai.

## 7. Policy and copy guardrails

Do not use or imply:

- guaranteed revenue, occupancy, ratings, reviews or ROI;
- “official Airbnb partner,” approval or endorsement;
- fabricated clients, installations, testimonials, reviews or awards;
- confirmed sensors, card charging, notifications or automation before they work;
- “free,” “zero risk,” fixed availability, false scarcity or deadlines without full evidence/terms;
- alcohol supply or licensing claims that have not been legally and operationally established.

The landing page must continue to identify the photograph as reference equipment and the three configurations as proposed pilot concepts.

## 8. Operating cadence and decision rules

### Before spend

- Confirm public destination and persistent production database.
- Verify the saved-lead event, consent states and click-ID flow.
- Validate admin access, export, deletion and database backup.
- Confirm the exact account, billing profile, campaign settings and hard account budget control.
- Inspect all final URLs and RSA combinations.
- Obtain Dragos’s explicit approval of AED 150/day and AED 2,100 total—or a revised written limit.

### During the test

- Review spend, search terms, negatives, policy status and tracking every day.
- Review lead relevance manually; do not optimize to form volume alone.
- Stop immediately for broken persistence/tracking, uncontrolled spend, material policy issues, predominantly irrelevant traffic or misleading destination/ad combinations.
- Make query/negative corrections during the test, but avoid redesigning the offer mid-test unless there is a serious error.

### Readout after 14 days or when the approved cap is reached

Report actual:

- spend, impressions, clicks and search impression share where available;
- saved leads and confirmed tracking rate;
- qualified leads and qualification rate by campaign/ad group/search term;
- pilot-agreed leads and sales-cycle lag;
- actual CPL and cost per qualified lead;
- property count, area, preferred setup and stated budget bands;
- waste categories and negatives added;
- policy, consent and tag diagnostics.

**Commercial interpretation proposed for discussion:** three or more distinct qualified operator/owner leads, including at least one concrete pricing/call/pilot discussion, would justify a deeper sales and hardware validation step. One or two is mixed evidence requiring qualitative follow-up. Zero qualified leads is a weak signal only if the campaign received meaningful eligible auction exposure and tracking was proven; otherwise the test is inconclusive. These are POPS decision rules, not Google benchmarks.

## 9. Official source basis

Verified on 25–26 October 2026:

- Responsive Search Ads: https://support.google.com/google-ads/answer/7684791?hl=en
- RSA best practices: https://support.google.com/google-ads/answer/6167122?hl=en
- Broad match: https://support.google.com/google-ads/answer/12159290?hl=en
- Bid strategies: https://support.google.com/google-ads/answer/6167148?hl=en
- Location options: https://support.google.com/google-ads/answer/1722038?hl=en
- Web conversions: https://support.google.com/google-ads/answer/16560108?hl=en
- Enhanced conversions for leads: https://support.google.com/google-ads/answer/15713840?hl=en
- Enhanced-conversion checklist: https://support.google.com/google-ads/answer/16782203?hl=en
- Offline import guidance: https://support.google.com/google-ads/answer/15081888?hl=en
- Trademark policy: https://support.google.com/adspolicy/answer/6118?hl=en
- Misrepresentation: https://support.google.com/adspolicy/answer/6020955?hl=en
- Customer-data policy: https://support.google.com/adspolicy/answer/7475709?hl=en
- EU User Consent Policy: https://www.google.com/about/company/user-consent-policy/
- Consent Mode reference: https://support.google.com/google-ads/answer/13802165?hl=en

The full official-source research remains available at `/Users/macos/pops_google_ads_official_research_2026-10-25.md`; privacy/consent research is at `/Users/macos/pops-minibar-privacy-consent-analytics-research.md`.
