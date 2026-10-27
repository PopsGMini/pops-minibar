import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Budget, ContactStatus, LeadRecord, LeadStatus, NormalizedLead, PropertyCount, Setup } from "@/lib/leads";

const databasePath = process.env.DATABASE_PATH || path.join(process.cwd(), ".data", "pops-minibar.sqlite");

type DbLead = {
  id: string; created_at: string; updated_at: string; full_name: string; email: string;
  property_location: string; property_count: PropertyCount; preferred_setup: Setup;
  monthly_budget: Budget; contact_consent: number; newsletter_consent: number;
  status: LeadStatus; contact_status: ContactStatus; duplicate_of: string; fingerprint: string;
  utm_source: string; utm_medium: string; utm_campaign: string; utm_term: string; utm_content: string;
  gclid: string; gbraid: string; wbraid: string; landing_path: string;
};

export type LeadFilters = {
  q?: string;
  status?: LeadStatus | "";
  contactStatus?: ContactStatus | "";
  setup?: Setup | "";
  propertyCount?: PropertyCount | "";
};

let instance: Database.Database | undefined;

export function getDatabase() {
  if (instance) return instance;
  mkdirSync(path.dirname(databasePath), { recursive: true });
  instance = new Database(databasePath);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  instance.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      property_location TEXT NOT NULL,
      property_count TEXT NOT NULL,
      preferred_setup TEXT NOT NULL,
      monthly_budget TEXT NOT NULL,
      contact_consent INTEGER NOT NULL DEFAULT 1,
      newsletter_consent INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new',
      contact_status TEXT NOT NULL DEFAULT 'not-contacted',
      duplicate_of TEXT NOT NULL DEFAULT '',
      fingerprint TEXT NOT NULL,
      utm_source TEXT NOT NULL DEFAULT '',
      utm_medium TEXT NOT NULL DEFAULT '',
      utm_campaign TEXT NOT NULL DEFAULT '',
      utm_term TEXT NOT NULL DEFAULT '',
      utm_content TEXT NOT NULL DEFAULT '',
      gclid TEXT NOT NULL DEFAULT '',
      gbraid TEXT NOT NULL DEFAULT '',
      wbraid TEXT NOT NULL DEFAULT '',
      landing_path TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_fingerprint ON leads(fingerprint, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status, contact_status);
    CREATE TABLE IF NOT EXISTS submission_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_submission_events_ip ON submission_events(ip_hash, created_at);
  `);
  return instance;
}

function mapLead(row: DbLead): LeadRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    fullName: row.full_name,
    email: row.email,
    propertyLocation: row.property_location,
    propertyCount: row.property_count,
    preferredSetup: row.preferred_setup,
    monthlyBudget: row.monthly_budget,
    contactConsent: Boolean(row.contact_consent),
    newsletterConsent: Boolean(row.newsletter_consent),
    website: "",
    formStartedAt: 0,
    status: row.status,
    contactStatus: row.contact_status,
    duplicateOf: row.duplicate_of,
    fingerprint: row.fingerprint,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmTerm: row.utm_term,
    utmContent: row.utm_content,
    gclid: row.gclid,
    gbraid: row.gbraid,
    wbraid: row.wbraid,
    landingPath: row.landing_path,
  };
}

export function findRecentDuplicate(fingerprint: string, sinceIso: string) {
  const row = getDatabase().prepare(
    "SELECT * FROM leads WHERE fingerprint = ? AND created_at >= ? ORDER BY created_at DESC LIMIT 1",
  ).get(fingerprint, sinceIso) as DbLead | undefined;
  return row ? mapLead(row) : null;
}

export function insertLead(record: LeadRecord) {
  getDatabase().prepare(`
    INSERT INTO leads (
      id, created_at, updated_at, full_name, email, property_location, property_count,
      preferred_setup, monthly_budget, contact_consent, newsletter_consent, status,
      contact_status, duplicate_of, fingerprint, utm_source, utm_medium, utm_campaign,
      utm_term, utm_content, gclid, gbraid, wbraid, landing_path
    ) VALUES (
      @id, @createdAt, @updatedAt, @fullName, @email, @propertyLocation, @propertyCount,
      @preferredSetup, @monthlyBudget, @contactConsent, @newsletterConsent, @status,
      @contactStatus, @duplicateOf, @fingerprint, @utmSource, @utmMedium, @utmCampaign,
      @utmTerm, @utmContent, @gclid, @gbraid, @wbraid, @landingPath
    )
  `).run({ ...record, contactConsent: Number(record.contactConsent), newsletterConsent: Number(record.newsletterConsent) });
  return record;
}

export function listLeads(filters: LeadFilters = {}) {
  const clauses: string[] = [];
  const values: string[] = [];
  if (filters.q) {
    clauses.push("(full_name LIKE ? OR email LIKE ? OR property_location LIKE ?)");
    const query = `%${filters.q.replaceAll("%", "").replaceAll("_", "")}%`;
    values.push(query, query, query);
  }
  for (const [column, value] of [
    ["status", filters.status], ["contact_status", filters.contactStatus],
    ["preferred_setup", filters.setup], ["property_count", filters.propertyCount],
  ] as const) {
    if (value) { clauses.push(`${column} = ?`); values.push(value); }
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = getDatabase().prepare(`SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT 1000`).all(...values) as DbLead[];
  return rows.map(mapLead);
}

export function getLead(id: string) {
  const row = getDatabase().prepare("SELECT * FROM leads WHERE id = ?").get(id) as DbLead | undefined;
  return row ? mapLead(row) : null;
}

export function updateLead(id: string, status: LeadStatus, contactStatus: ContactStatus) {
  const result = getDatabase().prepare(
    "UPDATE leads SET status = ?, contact_status = ?, updated_at = ? WHERE id = ?",
  ).run(status, contactStatus, new Date().toISOString(), id);
  return result.changes === 1;
}

export function deleteLead(id: string) {
  return getDatabase().prepare("DELETE FROM leads WHERE id = ?").run(id).changes === 1;
}

export function isRateLimited(ipHash: string, now = Date.now(), limit = 8) {
  const db = getDatabase();
  const windowStart = now - 60 * 60 * 1000;
  db.prepare("DELETE FROM submission_events WHERE created_at < ?").run(now - 24 * 60 * 60 * 1000);
  const row = db.prepare("SELECT COUNT(*) AS count FROM submission_events WHERE ip_hash = ? AND created_at >= ?")
    .get(ipHash, windowStart) as { count: number };
  return row.count >= limit;
}

export function recordSubmissionAttempt(ipHash: string, now = Date.now()) {
  getDatabase().prepare("INSERT INTO submission_events (ip_hash, created_at) VALUES (?, ?)").run(ipHash, now);
}

export function resetDatabaseForTests() {
  if (process.env.NODE_ENV !== "test") throw new Error("Test-only database reset blocked.");
  const db = getDatabase();
  db.exec("DELETE FROM leads; DELETE FROM submission_events;");
}

export function buildLeadRecord(data: NormalizedLead, duplicateOf = ""): LeadRecord {
  const now = new Date().toISOString();
  return {
    ...data,
    propertyCount: data.propertyCount as PropertyCount,
    preferredSetup: data.preferredSetup as Setup,
    monthlyBudget: data.monthlyBudget as Budget,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: duplicateOf ? "duplicate" : "new",
    contactStatus: "not-contacted",
    duplicateOf,
    fingerprint: "",
  };
}
