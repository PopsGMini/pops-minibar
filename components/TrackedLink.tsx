"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

export default function TrackedLink({ eventName, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { eventName: string; children: ReactNode }) {
  return <a {...props} onClick={() => window.dataLayer?.push({ event: eventName })}>{children}</a>;
}

declare global { interface Window { dataLayer?: unknown[] } }
