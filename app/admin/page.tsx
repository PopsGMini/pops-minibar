import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLeadActions from "@/components/AdminLeadActions";
import { isAdminRequest } from "@/lib/admin-auth";
import { listLeads, type LeadFilters } from "@/lib/database";
import { budgetLabels, setupLabels, type Budget, type ContactStatus, type LeadStatus, type PropertyCount, type Setup } from "@/lib/leads";

export const dynamic = "force-dynamic";

type Search = Promise<Record<string, string | string[] | undefined>>;
const value = (input: string | string[] | undefined) => typeof input === "string" ? input : "";

export default async function AdminPage({ searchParams }: { searchParams: Search }) {
  if (!(await isAdminRequest())) redirect("/admin/login");
  const search = await searchParams;
  const filters: LeadFilters = {
    q: value(search.q),
    status: value(search.status) as LeadStatus | "",
    contactStatus: value(search.contactStatus) as ContactStatus | "",
    setup: value(search.setup) as Setup | "",
    propertyCount: value(search.propertyCount) as PropertyCount | "",
  };
  const leads = listLeads(filters);
  const exportQuery = new URLSearchParams(Object.entries(filters).filter(([, entry]) => entry).map(([key, entry]) => [key, entry as string])).toString();

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><Link className="pops-logo dark" href="/"><strong>POPS</strong><span>MINIBAR SYSTEMS</span></Link><p>Private pilot operations</p></div>
        <div className="admin-header-actions"><a href={`/api/admin/export${exportQuery ? `?${exportQuery}` : ""}`}>Export CSV</a><form action="/api/admin/logout" method="post"><button type="submit">Sign out</button></form></div>
      </header>

      <section className="admin-summary">
        <div><span>VISIBLE ENQUIRIES</span><strong>{leads.length}</strong></div>
        <div><span>RELEVANT</span><strong>{leads.filter((lead) => lead.status === "relevant").length}</strong></div>
        <div><span>PROPERTIES REPRESENTED</span><strong>{leads.reduce((sum, lead) => sum + ({ "1": 1, "2-5": 2, "6-20": 6, "21+": 21 }[lead.propertyCount] || 0), 0)}+</strong></div>
      </section>

      <form className="admin-filters" method="get">
        <input name="q" defaultValue={filters.q} placeholder="Search name, email, location" />
        <select name="status" defaultValue={filters.status}><option value="">All relevance</option><option value="new">New</option><option value="relevant">Relevant</option><option value="irrelevant">Irrelevant</option><option value="duplicate">Duplicate</option></select>
        <select name="contactStatus" defaultValue={filters.contactStatus}><option value="">All contact stages</option><option value="not-contacted">Not contacted</option><option value="contacted">Contacted</option><option value="follow-up">Follow-up</option><option value="closed">Closed</option></select>
        <select name="setup" defaultValue={filters.setup}><option value="">All setups</option>{Object.entries(setupLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
        <select name="propertyCount" defaultValue={filters.propertyCount}><option value="">All portfolio sizes</option>{["1", "2-5", "6-20", "21+"].map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <button type="submit">Apply filters</button><Link href="/admin">Reset</Link>
      </form>

      <section className="admin-list" aria-label="Pilot enquiries">
        {leads.length ? leads.map((lead) => (
          <article className="admin-lead" key={lead.id}>
            <div className="admin-lead-main">
              <div className="admin-lead-title"><span>{new Date(lead.createdAt).toLocaleDateString("en-AE", { dateStyle: "medium" })}</span><h2>{lead.fullName}</h2><a href={`mailto:${lead.email}`}>{lead.email}</a></div>
              <dl>
                <div><dt>Property</dt><dd>{lead.propertyLocation}</dd></div>
                <div><dt>Portfolio</dt><dd>{lead.propertyCount}</dd></div>
                <div><dt>Setup</dt><dd>{setupLabels[lead.preferredSetup]}</dd></div>
                <div><dt>Service budget</dt><dd>{budgetLabels[lead.monthlyBudget as Budget]}</dd></div>
                <div><dt>Campaign</dt><dd>{lead.utmCampaign || "Direct / unknown"}</dd></div>
                <div><dt>Click ID</dt><dd>{lead.gclid || lead.gbraid || lead.wbraid ? "Captured" : "None"}</dd></div>
              </dl>
            </div>
            <AdminLeadActions id={lead.id} initialStatus={lead.status} initialContactStatus={lead.contactStatus} />
          </article>
        )) : <div className="admin-empty">No enquiries match these filters.</div>}
      </section>
    </main>
  );
}
