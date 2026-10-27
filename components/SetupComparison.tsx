"use client";

import { setupLabels, type Setup } from "@/lib/leads";
import { usePilotSetup } from "@/components/PilotSetupProvider";

const setups: Record<Setup, {
  descriptor: string; headline: string; description: string; equipment: string;
  tracking: string; payment: string; limits: string; steps: string[];
}> = {
  "qr-checkout": {
    descriptor: "A practical first step",
    headline: "A clear menu. A declared purchase.",
    description: "Guests scan a code, review products and prices, select what they want and complete payment before consumption. The host checks physical stock between stays.",
    equipment: "Minibar, product labels and printed QR display",
    tracking: "Products declared by the guest during checkout",
    payment: "Proposed online payment before consumption",
    limits: "A QR code alone cannot detect a removed item or an undeclared purchase.",
    steps: ["Scan the minibar code", "Select products in AED", "Complete checkout", "Host checks stock"],
  },
  "guest-allowance": {
    descriptor: "A controlled stay budget",
    headline: "One authorized allowance for the stay.",
    description: "The guest would authorize an agreed card amount. Recorded consumption would be compared with that budget, with proposed notices before the limit is reached.",
    equipment: "Minibar, digital menu and supported payment authorization flow",
    tracking: "Depends on the consumption-recording method selected for the pilot",
    payment: "Proposed card authorization with later settlement",
    limits: "Authorization, notices, settlement timing and consumption records require provider and pilot validation.",
    steps: ["Review the allowance", "Authorize the card", "Record consumption", "Reconcile at checkout"],
  },
  "connected-minibar": {
    descriptor: "A proposed connected setup",
    headline: "Inventory signals. Human confirmation.",
    description: "Calibrated weight trays would signal stock changes. Confirmed events would then appear in the owner record and inform the next replenishment visit.",
    equipment: "Compatible minibar, weight trays, door state and connectivity",
    tracking: "Proposed sensor events reviewed before becoming a purchase record",
    payment: "To be paired with a validated checkout or authorization flow",
    limits: "Moved, returned and similarly weighted products can create ambiguous events and must be tested.",
    steps: ["Guest gains access", "Weight change is signalled", "Event is reviewed", "Stock plan updates"],
  },
};

declare global { interface Window { dataLayer?: unknown[] } }

export default function SetupComparison() {
  const { setup, setSetup } = usePilotSetup();
  const selected = setups[setup];

  function choose(value: Setup) {
    setSetup(value);
    window.dataLayer?.push({ event: "setup_selected", setup: value });
  }

  return (
    <div className="setup-comparison">
      <div className="setup-tabs" role="tablist" aria-label="Proposed minibar setups">
        {(Object.keys(setups) as Setup[]).map((value, index) => (
          <button key={value} type="button" role="tab" aria-selected={setup === value} aria-controls="setup-panel" onClick={() => choose(value)}>
            <span>0{index + 1}</span><strong>{setupLabels[value]}</strong><small>{setups[value].descriptor}</small><i>{setup === value ? "−" : "+"}</i>
          </button>
        ))}
      </div>
      <div className="setup-panel" id="setup-panel" role="tabpanel">
        <div className="setup-story">
          <span className="pilot-chip">PROPOSED PILOT CONFIGURATION</span>
          <h3>{selected.headline}</h3>
          <p>{selected.description}</p>
          <a href="#enquiry">Discuss this setup <span>↗</span></a>
        </div>
        <div className="setup-specs">
          <dl>
            <div><dt>Equipment required</dt><dd>{selected.equipment}</dd></div>
            <div><dt>Consumption tracking</dt><dd>{selected.tracking}</dd></div>
            <div><dt>Payment approach</dt><dd>{selected.payment}</dd></div>
          </dl>
          <div className="setup-steps">{selected.steps.map((step, index) => <div key={step}><span>0{index + 1}</span><p>{step}</p></div>)}</div>
          <p className="setup-limit"><strong>Relevant limitation</strong>{selected.limits}</p>
        </div>
      </div>
      <p className="setup-disclosure">All three setups are proposed pilot configurations. Final hardware, payments, sensor behaviour, availability and commercial terms are not yet confirmed.</p>
    </div>
  );
}
