import { createHash } from "node:crypto";

export const PROPERTY_COUNTS = ["1", "2-5", "6-20", "21+"] as const;
export const SETUPS = ["qr-checkout", "guest-allowance", "connected-minibar"] as const;
export const BUDGETS = ["under-50", "50-100", "101-200", "over-200", "proposal-first"] as const;
export const LEAD_STATUSES = ["new", "relevant", "irrelevant", "duplicate"] as const;
export const CONTACT_STATUSES = ["not-contacted", "contacted", "follow-up", "closed"] as const;

export type PropertyCount = (typeof PROPERTY_COUNTS)[number];
export type Setup = (typeof SETUPS)[number];
export type Budget = (typeof BUDGETS)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export type LeadInput = {
  fullName?: unknown;
  email?: unknown;
  propertyLocation?: unknown;
  propertyCount?: unknown;
  preferredSetup?: unknown;
  monthlyBudget?: unknown;
  contactConsent?: unknown;
  newsletterConsent?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmTerm?: unknown;
  utmContent?: unknown;
  gclid?: unknown;
  gbraid?: unknown;
  wbraid?: unknown;
  landingPath?: unknown;
};

export type NormalizedLead = {
  fullName: string;
  email: string;
  propertyLocation: string;
  propertyCount: PropertyCount | "";
  preferredSetup: Setup | "";
  monthlyBudget: Budget | "";
  contactConsent: boolean;
  newsletterConsent: boolean;
  website: string;
  formStartedAt: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  landingPath: string;
};

export type LeadRecord = Omit<NormalizedLead, "propertyCount" | "preferredSetup" | "monthlyBudget"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
  propertyCount: PropertyCount;
  preferredSetup: Setup;
  monthlyBudget: Budget;
  status: LeadStatus;
  contactStatus: ContactStatus;
  duplicateOf: string;
  fingerprint: string;
};

type ValidationResult =
  | { ok: true; data: NormalizedLead }
  | { ok: false; errors: Record<string, string>; bot?: boolean };

const text = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

const oneOf = <T extends readonly string[]>(value: unknown, values: T): T[number] | "" => {
  const normalized = text(value, 50);
  return values.includes(normalized as T[number]) ? (normalized as T[number]) : "";
};

export function normalizeLead(input: LeadInput): NormalizedLead {
  const startedAt = typeof input.formStartedAt === "number" ? input.formStartedAt : Number(input.formStartedAt);
  return {
    fullName: text(input.fullName, 100),
    email: text(input.email, 200).toLowerCase(),
    propertyLocation: text(input.propertyLocation, 120),
    propertyCount: oneOf(input.propertyCount, PROPERTY_COUNTS),
    preferredSetup: oneOf(input.preferredSetup, SETUPS),
    monthlyBudget: oneOf(input.monthlyBudget, BUDGETS),
    contactConsent: input.contactConsent === true,
    newsletterConsent: input.newsletterConsent === true,
    website: text(input.website, 200),
    formStartedAt: Number.isFinite(startedAt) ? startedAt : 0,
    utmSource: text(input.utmSource, 100),
    utmMedium: text(input.utmMedium, 100),
    utmCampaign: text(input.utmCampaign, 150),
    utmTerm: text(input.utmTerm, 150),
    utmContent: text(input.utmContent, 150),
    gclid: text(input.gclid, 250),
    gbraid: text(input.gbraid, 250),
    wbraid: text(input.wbraid, 250),
    landingPath: text(input.landingPath, 300),
  };
}

export function validateLead(input: LeadInput, now = Date.now()): ValidationResult {
  const data = normalizeLead(input);
  if (data.website) return { ok: false, bot: true, errors: {} };
  if (data.formStartedAt && now - data.formStartedAt < 1800) return { ok: false, bot: true, errors: {} };

  const errors: Record<string, string> = {};
  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.propertyLocation.length < 2) errors.propertyLocation = "Please select or enter a property location.";
  if (!data.propertyCount) errors.propertyCount = "Please select the number of properties.";
  if (!data.preferredSetup) errors.preferredSetup = "Please select a preferred setup.";
  if (!data.monthlyBudget) errors.monthlyBudget = "Please select a service budget.";
  if (!data.contactConsent) errors.contactConsent = "Contact consent is required.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function createLeadFingerprint(email: string, propertyLocation: string) {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}|${propertyLocation.trim().toLowerCase()}`)
    .digest("hex");
}

export function isQualifiedLead(lead: Pick<NormalizedLead, "propertyLocation" | "propertyCount" | "contactConsent">) {
  const dubaiLocation = /dubai|marina|jbr|business bay|downtown|palm|jvc|jumeirah/i.test(lead.propertyLocation);
  return dubaiLocation && Boolean(lead.propertyCount) && lead.contactConsent;
}

export const setupLabels: Record<Setup, string> = {
  "qr-checkout": "QR Checkout",
  "guest-allowance": "Guest Allowance",
  "connected-minibar": "Connected Minibar",
};

export const budgetLabels: Record<Budget, string> = {
  "under-50": "Under AED 50",
  "50-100": "AED 50–100",
  "101-200": "AED 101–200",
  "over-200": "Over AED 200",
  "proposal-first": "I’d like a proposal first",
};
