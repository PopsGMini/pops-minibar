import { NextResponse } from "next/server";
import { adminCookie, adminIsConfigured, createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!adminIsConfigured()) {
    return NextResponse.json({ ok: false, message: "Admin access is not configured." }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!verifyAdminPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({ ok: false, message: "Invalid password." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie(createAdminSession()));
  return response;
}
