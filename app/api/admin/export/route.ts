import { isAdminRequest } from "@/lib/admin-auth";
import { listLeads, type LeadFilters } from "@/lib/database";
import type { ContactStatus, LeadStatus, PropertyCount, Setup } from "@/lib/leads";

export const runtime = "nodejs";

function safeCell(value: string | boolean) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return new Response("Unauthorized", { status: 401 });
  const url = new URL(request.url);
  const filters: LeadFilters = {
    q: url.searchParams.get("q") || "",
    status: (url.searchParams.get("status") || "") as LeadStatus | "",
    contactStatus: (url.searchParams.get("contactStatus") || "") as ContactStatus | "",
    setup: (url.searchParams.get("setup") || "") as Setup | "",
    propertyCount: (url.searchParams.get("propertyCount") || "") as PropertyCount | "",
  };
  const headers = [
    "Created", "Full name", "Email", "Property location", "Properties", "Preferred setup",
    "Monthly service budget", "Lead status", "Contact status", "Newsletter consent",
    "UTM source", "UTM medium", "UTM campaign", "UTM term", "UTM content", "GCLID", "GBRAID", "WBRAID",
  ];
  const rows = listLeads(filters).map((lead) => [
    lead.createdAt, lead.fullName, lead.email, lead.propertyLocation, lead.propertyCount,
    lead.preferredSetup, lead.monthlyBudget, lead.status, lead.contactStatus,
    lead.newsletterConsent, lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmTerm,
    lead.utmContent, lead.gclid, lead.gbraid, lead.wbraid,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(safeCell).join(",")).join("\r\n");
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="pops-minibar-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
