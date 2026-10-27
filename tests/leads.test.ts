import { describe, expect, it } from "vitest";
import { createLeadFingerprint, isQualifiedLead, normalizeLead, validateLead } from "@/lib/leads";

const validLead = {
  fullName: "Maya Host",
  email: "maya@example.com",
  propertyLocation: "Dubai Marina / JBR",
  propertyCount: "6-20",
  preferredSetup: "connected-minibar",
  monthlyBudget: "101-200",
  contactConsent: true,
  newsletterConsent: false,
  website: "",
  formStartedAt: Date.now() - 10_000,
};

describe("validateLead", () => {
  it("accepts a complete Dubai operator enquiry", () => {
    expect(validateLead(validLead).ok).toBe(true);
  });

  it("rejects malformed identity, missing choices and contact consent", () => {
    const result = validateLead({ ...validLead, fullName: "M", email: "bad", propertyCount: "unknown", monthlyBudget: "", contactConsent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.fullName).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.propertyCount).toBeTruthy();
      expect(result.errors.monthlyBudget).toBeTruthy();
      expect(result.errors.contactConsent).toBeTruthy();
    }
  });

  it("silently flags honeypot and implausibly fast submissions", () => {
    const honeypot = validateLead({ ...validLead, website: "spam.example" });
    const tooFast = validateLead({ ...validLead, formStartedAt: Date.now() });
    expect(!honeypot.ok && honeypot.bot).toBe(true);
    expect(!tooFast.ok && tooFast.bot).toBe(true);
  });
});

describe("normalizeLead", () => {
  it("normalizes identity and keeps only allowed commercial choices", () => {
    const lead = normalizeLead({ ...validLead, fullName: "  Maya   Host ", email: " MAYA@EXAMPLE.COM ", utmSource: "google", gclid: "abc123" });
    expect(lead.fullName).toBe("Maya Host");
    expect(lead.email).toBe("maya@example.com");
    expect(lead.preferredSetup).toBe("connected-minibar");
    expect(lead.utmSource).toBe("google");
    expect(lead.gclid).toBe("abc123");
  });

  it("drops invalid enum values", () => {
    const lead = normalizeLead({ ...validLead, preferredSetup: "magic", monthlyBudget: "free" });
    expect(lead.preferredSetup).toBe("");
    expect(lead.monthlyBudget).toBe("");
  });
});

describe("lead qualification and duplicate identity", () => {
  it("recognises a consented Dubai property enquiry as qualified", () => {
    const lead = normalizeLead(validLead);
    expect(isQualifiedLead(lead)).toBe(true);
  });

  it("creates a stable case-insensitive fingerprint", () => {
    expect(createLeadFingerprint("MAYA@example.com", " Dubai Marina ")).toBe(createLeadFingerprint("maya@example.com", "dubai marina"));
  });
});
