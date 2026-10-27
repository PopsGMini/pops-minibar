"use client";

import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "pops_measurement_consent_v2";
export const CONSENT_EVENT = "pops-consent-change";
export type ConsentChoice = { analytics: boolean; ads: boolean };

export function parseConsentChoice(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentChoice>;
    return typeof value.analytics === "boolean" && typeof value.ads === "boolean"
      ? { analytics: value.analytics, ads: value.ads }
      : null;
  } catch {
    return null;
  }
}

export function readConsentChoice() {
  return parseConsentChoice(window.localStorage.getItem(CONSENT_KEY));
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function snapshot() {
  return window.localStorage.getItem(CONSENT_KEY) || "unknown";
}

export default function ConsentBanner() {
  const stored = useSyncExternalStore(subscribe, snapshot, () => "unknown");
  const choice = stored === "unknown" ? null : parseConsentChoice(stored);

  function choose(nextChoice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(nextChoice));
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (choice) return null;
  return (
    <aside className="consent-banner" aria-label="Measurement preferences">
      <div>
        <strong>Measurement preferences</strong>
        <p>Optional analytics helps us understand site use. Advertising measurement additionally preserves campaign identifiers and may load Google Ads tags. Enquiry details are never sent in ordinary analytics events.</p>
        <a href="/privacy">Privacy details</a>
      </div>
      <div className="consent-actions">
        <button type="button" onClick={() => choose({ analytics: false, ads: false })}>Reject optional</button>
        <button type="button" onClick={() => choose({ analytics: true, ads: false })}>Analytics only</button>
        <button type="button" onClick={() => choose({ analytics: true, ads: true })}>Allow both</button>
      </div>
    </aside>
  );
}
