import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminEditor } from "@/components/site/admin-editor";
import { getAdminCookieName, isValidSessionToken } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;

  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-6">
      <div className="section-shell">
        <div className="mb-6 rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#f3faf4_100%)] p-6 shadow-[var(--shadow-soft)]">
          <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--primary-dark)]">Orion Computers</div>
          <h1 className="section-title mt-3">Website Admin</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Manage products, reviews, offers, contact details, and banners from a single JSON content source.
          </p>
        </div>
        <AdminEditor initialContent={content} />
      </div>
    </main>
  );
}