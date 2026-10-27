"use client";

import { CONSENT_EVENT, CONSENT_KEY } from "@/components/ConsentBanner";

export default function PrivacySettingsButton() {
  function reopen() {
    window.localStorage.removeItem(CONSENT_KEY);
    window.sessionStorage.removeItem("pops_campaign_attribution");
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return <button className="privacy-settings" type="button" onClick={reopen}>Privacy settings</button>;
}
