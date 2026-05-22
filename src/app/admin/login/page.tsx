"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-white p-8 shadow-[var(--shadow-soft)]">
        <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--primary-dark)]">Orion Admin</div>
        <h1 className="section-title mt-3 text-4xl">Login</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Use the admin password to manage products, offers, reviews, banners, and contact details.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none"
              placeholder="Enter admin password"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login to Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}