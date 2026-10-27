import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { adminIsConfigured, isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminRequest()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <Link className="pops-logo dark" href="/"><strong>POPS</strong><span>MINIBAR SYSTEMS</span></Link>
      <section>
        <p className="section-tag">PRIVATE OPERATIONS</p>
        <h1>Pilot enquiries.</h1>
        <p>Authorized access only. Enquiry details are never exposed on the public website.</p>
        {adminIsConfigured() ? <AdminLoginForm /> : <div className="admin-warning">Admin access is disabled. Configure <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> on the server.</div>}
      </section>
    </main>
  );
}
