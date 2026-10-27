"use client";

import { createContext, useContext, useState } from "react";
import type { Setup } from "@/lib/leads";

type PilotSetupContextValue = { setup: Setup; setSetup: (setup: Setup) => void };
const PilotSetupContext = createContext<PilotSetupContextValue | null>(null);

export function PilotSetupProvider({ children }: { children: React.ReactNode }) {
  const [setup, setSetup] = useState<Setup>("qr-checkout");
  return <PilotSetupContext.Provider value={{ setup, setSetup }}>{children}</PilotSetupContext.Provider>;
}

export function usePilotSetup() {
  const context = useContext(PilotSetupContext);
  if (!context) throw new Error("usePilotSetup must be used within PilotSetupProvider");
  return context;
}
