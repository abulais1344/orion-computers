"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/content";

type Props = {
  initialContent: SiteContent;
};

export function AdminEditor({ initialContent }: Props) {
  const router = useRouter();
  const [rawContent, setRawContent] = useState(JSON.stringify(initialContent, null, 2));
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSave() {
    setMessage("");

    let parsed: SiteContent;

    try {
      parsed = JSON.parse(rawContent) as SiteContent;
    } catch {
      setMessage("JSON format is invalid. Fix it before saving.");
      return;
    }

    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) {
      setMessage("Save failed. Please log in again.");
      return;
    }

    setMessage("Changes saved successfully.");
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
      <aside className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--primary-dark)]">Admin Panel</div>
        <h2 className="section-title mt-3 text-3xl">Content Manager</h2>
        <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
          <p>Update hero banners, featured products, reviews, offers, and contact details in one place.</p>
          <p>For production, move the password to environment variables and replace JSON storage with a database or CMS if needed.</p>
          <p>Default admin password: <strong>orion123</strong></p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" className="button-primary" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="button-secondary" onClick={handleLogout}>
            Logout
          </button>
          {message ? <p className="text-sm text-slate-700">{message}</p> : null}
        </div>
      </aside>

      <section className="rounded-[1.75rem] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-card)]">
        <textarea
          value={rawContent}
          onChange={(event) => setRawContent(event.target.value)}
          className="hide-scrollbar min-h-[70vh] w-full rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4 font-mono text-sm leading-7 text-slate-800 outline-none"
          spellCheck={false}
        />
      </section>
    </div>
  );
}