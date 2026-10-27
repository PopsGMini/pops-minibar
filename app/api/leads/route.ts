import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import {
  buildLeadRecord,
  findRecentDuplicate,
  insertLead,
  isRateLimited,
  recordSubmissionAttempt,
} from "@/lib/database";
import { createLeadFingerprint, validateLead, type LeadInput } from "@/lib/leads";

export const runtime = "nodejs";

function clientHash(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const source = forwarded || request.headers.get("x-real-ip") || "local";
  const secret = process.env.RATE_LIMIT_SECRET || process.env.ADMIN_SESSION_SECRET || "pops-development-only";
  return createHmac("sha256", secret).update(source).digest("hex");
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false, message: "Invalid request format." }, { status: 415 });
  }

  const ipHash = clientHash(request);
  if (isRateLimited(ipHash)) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Please try again later." }, { status: 429 });
  }
  recordSubmissionAttempt(ipHash);

  let input: LeadInput;
  try {
    input = (await request.json()) as LeadInput;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const validation = validateLead(input);
  if (!validation.ok) {
    if (validation.bot) return NextResponse.json({ ok: true, saved: false });
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: validation.errors },
      { status: 422 },
    );
  }

  const fingerprint = createLeadFingerprint(validation.data.email, validation.data.propertyLocation);
  const duplicateSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const duplicate = findRecentDuplicate(fingerprint, duplicateSince);
  if (duplicate) {
    return NextResponse.json({
      ok: true,
      saved: false,
      duplicate: true,
      message: "We already have a recent enquiry for this email and property location.",
    });
  }

  const record = buildLeadRecord(validation.data);
  record.fingerprint = fingerprint;

  try {
    insertLead(record);
  } catch (error) {
    console.error("Lead persistence failed", error);
    return NextResponse.json(
      { ok: false, message: "We could not save your enquiry. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, saved: true, leadId: record.id });
}
