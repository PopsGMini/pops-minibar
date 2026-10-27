"use client";

import { FormEvent, useRef, useState } from "react";
import { BUDGETS, PROPERTY_COUNTS, SETUPS, budgetLabels, setupLabels, type Setup } from "@/lib/leads";
import { ATTRIBUTION_KEY } from "@/components/AttributionCapture";
import { usePilotSetup } from "@/components/PilotSetupProvider";

type Status = "idle" | "sending" | "success" | "duplicate" | "error";
const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"] as const;

export default function LeadForm() {
  const { setup, setSetup } = usePilotSetup();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const formStartTracked = useRef(false);

  function trackStart() {
    if (formStartTracked.current) return;
    startedAt.current = Date.now();
    formStartTracked.current = true;
    window.dataLayer?.push({ event: "pilot_form_started" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    setErrors({});
    const form = event.currentTarget;
    const data = new FormData(form);
    let storedAttribution: Record<string, string> = {};
    try { storedAttribution = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || "{}"); } catch { storedAttribution = {}; }
    const attribution = Object.fromEntries(attributionKeys.map((key) => [key, storedAttribution[key] || ""]));
    const payload = {
      fullName: data.get("fullName"),
      email: data.get("email"),
      propertyLocation: data.get("propertyLocation"),
      propertyCount: data.get("propertyCount"),
      preferredSetup: data.get("preferredSetup"),
      monthlyBudget: data.get("monthlyBudget"),
      contactConsent: data.get("contactConsent") === "on",
      newsletterConsent: data.get("newsletterConsent") === "on",
      website: data.get("website"),
      formStartedAt: startedAt.current || Date.now() - 2000,
      utmSource: attribution.utm_source,
      utmMedium: attribution.utm_medium,
      utmCampaign: attribution.utm_campaign,
      utmTerm: attribution.utm_term,
      utmContent: attribution.utm_content,
      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,
      landingPath: window.location.pathname.slice(0, 300),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok: boolean; saved?: boolean; duplicate?: boolean; message?: string; errors?: Record<string, string> };
      if (!response.ok || !result.ok) {
        setErrors(result.errors || {});
        throw new Error(result.message || "Something went wrong.");
      }
      if (result.duplicate || !result.saved) {
        setStatus("duplicate");
        setMessage(result.message || "Your recent enquiry is already recorded.");
        return;
      }
      setStatus("success");
      setMessage("Your enquiry has been saved. We’ll review the property details and contact you about the proposed Dubai pilot.");
      form.reset();
      window.dataLayer?.push({ event: "generate_lead", form_name: "pops_dubai_pilot", lead_type: "saved_pilot_enquiry" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not save your enquiry.");
      window.dataLayer?.push({ event: "pilot_form_error", error_type: "submission" });
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div className="form-success" role="status">
        <span>{status === "success" ? "✓" : "i"}</span>
        <p className="section-tag">{status === "success" ? "ENQUIRY SAVED" : "ALREADY RECEIVED"}</p>
        <h3>{status === "success" ? "Thank you. We have your details." : "Your enquiry is already on file."}</h3>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className="pops-form" onSubmit={submit} onFocus={trackStart} noValidate>
      <div className="form-grid">
        <label><span>Full name</span><input name="fullName" autoComplete="name" placeholder="Your full name" required aria-invalid={Boolean(errors.fullName)} />{errors.fullName ? <small>{errors.fullName}</small> : null}</label>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required aria-invalid={Boolean(errors.email)} />{errors.email ? <small>{errors.email}</small> : null}</label>
        <label><span>Property location</span><select name="propertyLocation" defaultValue="" required aria-invalid={Boolean(errors.propertyLocation)}><option value="" disabled>Select a Dubai area</option><option>Dubai Marina / JBR</option><option>Business Bay</option><option>Downtown Dubai</option><option>Palm Jumeirah</option><option>Jumeirah Village Circle</option><option>Other Dubai area</option></select>{errors.propertyLocation ? <small>{errors.propertyLocation}</small> : null}</label>
        <label><span>Number of properties</span><select name="propertyCount" defaultValue="" required aria-invalid={Boolean(errors.propertyCount)}><option value="" disabled>Select number</option>{PROPERTY_COUNTS.map((value) => <option value={value} key={value}>{value}</option>)}</select>{errors.propertyCount ? <small>{errors.propertyCount}</small> : null}</label>
        <label><span>Preferred setup</span><select name="preferredSetup" value={setup} onChange={(event) => setSetup(event.target.value as Setup)} required>{SETUPS.map((value) => <option value={value} key={value}>{setupLabels[value]}</option>)}</select></label>
        <label><span>Monthly service budget per unit</span><select name="monthlyBudget" defaultValue="" required aria-invalid={Boolean(errors.monthlyBudget)}><option value="" disabled>Select service budget</option>{BUDGETS.map((value) => <option value={value} key={value}>{budgetLabels[value]}</option>)}</select>{errors.monthlyBudget ? <small>{errors.monthlyBudget}</small> : null}</label>
      </div>
      <p className="budget-note">These ranges measure willingness to pay for the monthly service only. Products and hardware are excluded. They are not official POPS prices.</p>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="check-row"><input name="contactConsent" type="checkbox" required /><span>I agree that Dragos Popescu, the project initiator, may use these details to assess my interest and contact me about the Dubai pilot. See the <a href="/privacy">privacy notice</a>.</span></label>
      <label className="check-row optional"><input name="newsletterConsent" type="checkbox" /><span>Separately, I would like occasional POPS Minibar project updates by email. <em>Optional.</em></span></label>
      {errors.contactConsent ? <p className="form-error">{errors.contactConsent}</p> : null}
      <button className="pops-submit" type="submit" disabled={status === "sending"}><span>{status === "sending" ? "Saving your enquiry…" : "Send my enquiry"}</span><b>↗</b></button>
      {message ? <p className="form-error" role="alert">{message}</p> : null}
      <p className="form-note">No payment required. No installation commitment. Pilot terms would be agreed separately.</p>
    </form>
  );
}

declare global { interface Window { dataLayer?: unknown[] } }
