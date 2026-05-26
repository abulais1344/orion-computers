"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-10">
      <section className="page-shell">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Login</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Enter admin password to access Orion dashboard.</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[var(--foreground)]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm"
                placeholder="Enter password"
                required
              />
            </label>

            <button type="submit" className="button-primary w-full justify-center" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {error ? <p className="mt-3 text-sm font-medium text-[#a33a3a]">{error}</p> : null}
          <a href="/" className="mt-4 inline-flex text-sm font-semibold text-[var(--primary-dark)] underline">Back to website</a>
        </div>
      </section>
    </main>
  );
}
