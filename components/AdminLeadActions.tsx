"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_STATUSES, LEAD_STATUSES, type ContactStatus, type LeadStatus } from "@/lib/leads";

export default function AdminLeadActions({ id, initialStatus, initialContactStatus }: {
  id: string;
  initialStatus: LeadStatus;
  initialContactStatus: ContactStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [contactStatus, setContactStatus] = useState(initialContactStatus);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function save(nextStatus = status, nextContactStatus = contactStatus) {
    setBusy(true);
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: nextStatus, contactStatus: nextContactStatus }),
    });
    setBusy(false);
    if (response.ok) router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this enquiry permanently? This cannot be undone.")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    setBusy(false);
    if (response.ok) router.refresh();
  }

  return (
    <div className="admin-actions">
      <label><span>Relevance</span><select value={status} disabled={busy} onChange={(event) => { const value = event.target.value as LeadStatus; setStatus(value); void save(value, contactStatus); }}>{LEAD_STATUSES.map((value) => <option key={value} value={value}>{value.replace("-", " ")}</option>)}</select></label>
      <label><span>Contact</span><select value={contactStatus} disabled={busy} onChange={(event) => { const value = event.target.value as ContactStatus; setContactStatus(value); void save(status, value); }}>{CONTACT_STATUSES.map((value) => <option key={value} value={value}>{value.replace("-", " ")}</option>)}</select></label>
      <button type="button" onClick={remove} disabled={busy}>Delete</button>
    </div>
  );
}
