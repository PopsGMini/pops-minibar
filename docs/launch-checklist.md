# POPS Minibar launch checklist

## Already prepared

- [x] Premium English landing page for Dubai B2B holiday-home operators
- [x] Real, commercially usable reference photography with visible attribution
- [x] Three interactive pilot configurations with honest limitations
- [x] Persistent server-side enquiry storage
- [x] Duplicate prevention, spam controls and attribution capture
- [x] Private enquiry dashboard, filters, status workflow, CSV export and deletion
- [x] Primary/secondary analytics event separation
- [x] Consent defaults and preference control
- [x] Privacy/contact page naming the real project initiator

## Required before public deployment

- [ ] Choose a host with persistent storage or provision managed SQL
- [ ] Create strong production admin/session/rate-limit secrets
- [ ] Set the final domain in `NEXT_PUBLIC_SITE_URL`
- [ ] Confirm the contact email and complete legal review of the privacy notice
- [ ] Confirm image licence/attribution placement remains visible
- [ ] Connect GTM/GA4 and validate consent signals in Tag Assistant
- [ ] Configure Google Ads conversion only on saved `generate_lead`
- [ ] Test a production enquiry and verify it in the private dashboard
- [ ] Verify CSV export and deletion in production
- [ ] Add uptime/error monitoring and a database backup policy

## Required before Google Ads activation

- [ ] Confirm the exact Google Ads account and billing profile
- [ ] Check for existing suitable campaigns to avoid duplication
- [ ] Confirm campaign, ad groups, keywords, negatives and final URLs
- [ ] Confirm Dubai location setting and English language
- [ ] Decide separately whether to test owners physically outside Dubai
- [ ] Confirm daily budget, total cap and evaluation period
- [ ] Verify policy/trademark review and ad approval status
- [ ] Obtain Dragos’s explicit written approval for spend and activation

## Launch state vocabulary

- **Prepared:** site/assets/configuration exist locally.
- **Configured:** settings exist in the authorized account but are paused.
- **Under review:** Google is reviewing campaign or ads.
- **Approved:** assets are eligible but may still be paused.
- **Serving:** impressions are actually being delivered.

Never describe the campaign as launched until the authorized account shows active serving and spend remains within the approved cap.
