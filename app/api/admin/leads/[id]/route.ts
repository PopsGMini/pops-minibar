import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { deleteLead, updateLead } from "@/lib/database";
import { CONTACT_STATUSES, LEAD_STATUSES, type ContactStatus, type LeadStatus } from "@/lib/leads";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: unknown; contactStatus?: unknown } | null;
  if (!body || !LEAD_STATUSES.includes(body.status as LeadStatus) || !CONTACT_STATUSES.includes(body.contactStatus as ContactStatus)) {
    return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 422 });
  }
  return NextResponse.json({ ok: updateLead(id, body.status as LeadStatus, body.contactStatus as ContactStatus) });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  return NextResponse.json({ ok: deleteLead(id) });
}
