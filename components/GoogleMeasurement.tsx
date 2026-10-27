"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, CONSENT_KEY, parseConsentChoice } from "@/components/ConsentBanner";

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

export default function GoogleMeasurement({ googleTagId, gtmId }: { googleTagId?: string; gtmId?: string }) {
  const stored = useSyncExternalStore(subscribe, snapshot, () => "unknown");
  const choice = stored === "unknown" ? null : parseConsentChoice(stored);
  if (!choice || (!choice.analytics && !choice.ads) || (!googleTagId && !gtmId)) return null;

  const analyticsStorage = choice.analytics ? "granted" : "denied";
  const adStorage = choice.ads ? "granted" : "denied";

  return (
    <>
      <Script id="google-consent-choice" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          analytics_storage: '${analyticsStorage}',
          ad_storage: '${adStorage}',
          ad_user_data: '${adStorage}',
          ad_personalization: 'denied'
        });
      `}</Script>
      {gtmId ? <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}</Script> : null}
      {!gtmId && googleTagId ? <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="afterInteractive" />
        <Script id="google-tag" strategy="afterInteractive">{`
          window.gtag('js', new Date());
          window.gtag('config', '${googleTagId}', { anonymize_ip: true, allow_google_signals: ${choice.ads}, send_page_view: true });
        `}</Script>
      </> : null}
    </>
  );
}
