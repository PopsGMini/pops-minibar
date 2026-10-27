"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CONSENT_EVENT, CONSENT_KEY, parseConsentChoice } from "@/components/ConsentBanner";

export const ATTRIBUTION_KEY = "pops_campaign_attribution";
const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"] as const;

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

export default function AttributionCapture() {
  const stored = useSyncExternalStore(subscribe, snapshot, () => "unknown");
  const choice = stored === "unknown" ? null : parseConsentChoice(stored);

  useEffect(() => {
    if (!choice) return;
    const url = new URL(window.location.href);
    if (choice.ads) {
      const attribution = Object.fromEntries(keys.map((key) => [key, (url.searchParams.get(key) || "").slice(0, 250)]));
      if (Object.values(attribution).some(Boolean)) window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    } else {
      window.sessionStorage.removeItem(ATTRIBUTION_KEY);
    }
    for (const key of keys) url.searchParams.delete(key);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [choice]);

  return null;
}
