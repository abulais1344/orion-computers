"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type HeroImage = {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

type NoticeKind = "info" | "success" | "error";
type Notice = { kind: NoticeKind; text: string };

export default function HeroImagesDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadOrder, setUploadOrder] = useState("0");
  const [isDragging, setIsDragging] = useState(false);

  // Per-image pending edits: { [id]: { caption, display_order } }
  const [edits, setEdits] = useState<Record<string, { caption: string; display_order: string }>>({});

  function showNotice(kind: NoticeKind, text: string) {
    setNotice({ kind, text });
  }

  function redirectToLogin() {
    router.push("/admin/login");
    router.refresh();
  }

  async function loadImages() {
    try {
      const res = await fetch("/api/admin/hero-images", { cache: "no-store" });
      if (res.status === 401) {
        showNotice("error", "Session expired. Please login again.");
        redirectToLogin();
        return;
      }
      const data = (await res.json()) as { images?: HeroImage[]; error?: string };
      if (!res.ok) {
        showNotice("error", data.error || "Failed to load images.");
        return;
      }
      const imgs = data.images ?? [];
      setImages(imgs);
      const initialEdits: Record<string, { caption: string; display_order: string }> = {};
      imgs.forEach((img) => {
        initialEdits[img.id] = {
          caption: img.caption ?? "",
          display_order: String(img.display_order),
        };
      });
      setEdits(initialEdits);
    } catch {
      showNotice("error", "Failed to load images.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!previewUrl) return;
    return () => { URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  useEffect(() => {
    if (!notice || notice.kind === "error") return;
    const t = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(t);
  }, [notice]);

  function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      showNotice("error", "Only image files are supported.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    showNotice("info", "Image selected. Fill in details and click Upload.");
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  async function onUpload() {
    if (!selectedFile) {
      showNotice("error", "Please select an image first.");
      fileInputRef.current?.click();
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", uploadCaption.trim());
    formData.append("display_order", uploadOrder || "0");

    setIsBusy(true);
    showNotice("info", "Uploading image...");

    try {
      const res = await fetch("/api/admin/hero-images", { method: "POST", body: formData });

      if (res.status === 401) {
        showNotice("error", "Session expired. Please login again.");
        redirectToLogin();
        return;
      }

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        showNotice("error", data.error || "Upload failed.");
        return;
      }

      setSelectedFile(null);
      setPreviewUrl("");
      setUploadCaption("");
      setUploadOrder("0");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadImages();
      showNotice("success", "Image uploaded successfully.");
    } catch {
      showNotice("error", "Upload failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onSaveEdit(id: string) {
    const edit = edits[id];
    if (!edit) return;

    setIsBusy(true);
    try {
      const res = await fetch("/api/admin/hero-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          caption: edit.caption.trim() || null,
          display_order: parseInt(edit.display_order, 10) || 0,
        }),
      });

      if (res.status === 401) {
        showNotice("error", "Session expired. Please login again.");
        redirectToLogin();
        return;
      }

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        showNotice("error", data.error || "Save failed.");
        return;
      }

      await loadImages();
      showNotice("success", "Image updated.");
    } catch {
      showNotice("error", "Save failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onToggleActive(id: string, current: boolean) {
    setIsBusy(true);
    try {
      const res = await fetch("/api/admin/hero-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !current }),
      });

      if (res.status === 401) {
        showNotice("error", "Session expired. Please login again.");
        redirectToLogin();
        return;
      }

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        showNotice("error", data.error || "Toggle failed.");
        return;
      }

      await loadImages();
      showNotice("success", `Image ${!current ? "activated" : "deactivated"}.`);
    } catch {
      showNotice("error", "Toggle failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDelete(id: string, imageUrl: string) {
    if (!window.confirm(`Delete this image? This cannot be undone.`)) return;

    setIsBusy(true);
    showNotice("info", "Deleting image...");

    try {
      const res = await fetch("/api/admin/hero-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        showNotice("error", "Session expired. Please login again.");
        redirectToLogin();
        return;
      }

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        showNotice("error", data.error || "Delete failed.");
        return;
      }

      await loadImages();
      showNotice("success", "Image deleted.");
    } catch {
      showNotice("error", "Delete failed.");
    } finally {
      setIsBusy(false);
    }

    void imageUrl;
  }

  async function onLogout() {
    setIsBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsBusy(false);
    }
  }

  const activeCount = images.filter((i) => i.is_active).length;

  return (
    <main className="min-h-screen bg-[var(--background)] py-8">
      <section className="page-shell space-y-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Hero Images — Orion Computers</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Upload and manage the images shown in the homepage hero slider.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="/" className="inline-flex text-sm font-semibold text-[var(--primary-dark)] underline">
              Back to website
            </a>
            <a href="/admin" className="inline-flex text-sm font-semibold text-[var(--primary-dark)] underline">
              Image Library
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="text-sm font-semibold text-[#a33a3a] underline"
              disabled={isBusy}
            >
              Logout
            </button>
          </div>
        </header>

        {/* ── Notice ── */}
        {notice ? (
          <section
            className={`sticky top-3 z-20 rounded-xl border px-4 py-3 text-sm shadow-sm ${
              notice.kind === "success"
                ? "border-[#b9e0c4] bg-[#ecf8ef] text-[#1f5a38]"
                : notice.kind === "error"
                  ? "border-[#efc6c6] bg-[#fff3f3] text-[#8d2f2f]"
                  : "border-[var(--line)] bg-white text-[var(--foreground)]"
            }`}
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3">
              <p>{notice.text}</p>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="text-xs font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          </section>
        ) : null}

        {/* ── Upload section ── */}
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Upload New Hero Image</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Drag & drop an image or click to select. Then add a caption and display order before uploading.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition ${
              isDragging
                ? "border-[var(--primary)] bg-[var(--surface-soft)]"
                : "border-[var(--line)] hover:border-[var(--primary)] hover:bg-[var(--surface-soft)]"
            }`}
          >
            <svg
              className="h-10 w-10 text-[var(--muted)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {selectedFile ? selectedFile.name : "Drop image here or click to browse"}
            </p>
            <p className="text-xs text-[var(--muted)]">PNG, JPG, WEBP, GIF supported</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
            disabled={isBusy}
          />

          {/* Preview */}
          {previewUrl ? (
            <div className="mt-3 max-w-[200px] rounded-xl border border-[var(--line)] p-2">
              <img src={previewUrl} alt="Preview" className="h-24 w-full rounded-lg object-cover" />
            </div>
          ) : null}

          {/* Caption + order */}
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[var(--foreground)]">Caption (optional)</span>
              <input
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="e.g. Store front"
                className="w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm"
                disabled={isBusy}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[var(--foreground)]">Display order</span>
              <input
                type="number"
                min="0"
                value={uploadOrder}
                onChange={(e) => setUploadOrder(e.target.value)}
                className="w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm"
                disabled={isBusy}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onUpload}
            className="button-primary mt-4 inline-flex justify-center"
            disabled={isBusy || !selectedFile}
          >
            {isBusy ? "Uploading…" : "Upload Image"}
          </button>
        </section>

        {/* ── Images grid ── */}
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Hero Images</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Total: {images.length} &nbsp;·&nbsp; Active: {activeCount}
                {activeCount > 8 ? (
                  <span className="ml-2 font-semibold text-[#8a5a16]">⚠ More than 8 active images — consider deactivating some.</span>
                ) : null}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-[var(--line)] p-2">
                  <div className="h-28 w-full rounded-lg bg-[var(--surface-soft)]" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-[var(--surface-soft)]" />
                  <div className="mt-1 h-3 w-1/2 rounded bg-[var(--surface-soft)]" />
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
              No hero images yet. Upload your first image above.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => {
                const edit = edits[img.id] ?? { caption: img.caption ?? "", display_order: String(img.display_order) };
                return (
                  <article
                    key={img.id}
                    className={`rounded-xl border p-2 transition ${
                      img.is_active ? "border-[var(--line)]" : "border-dashed border-[var(--line)] opacity-60"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={img.image_url}
                        alt={img.caption ?? "Hero image"}
                        className="h-28 w-full rounded-lg object-cover"
                      />
                      {/* Active badge */}
                      <span
                        className={`absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          img.is_active ? "bg-[#ecf8ef] text-[#1f5a38]" : "bg-[#f5f5f5] text-[#666]"
                        }`}
                      >
                        {img.is_active ? "Active" : "Off"}
                      </span>
                    </div>

                    {/* Caption input */}
                    <input
                      type="text"
                      value={edit.caption}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [img.id]: { ...edit, caption: e.target.value } }))
                      }
                      placeholder="Caption…"
                      className="mt-2 w-full rounded-md border border-[var(--line)] bg-white px-2 py-1 text-xs"
                      disabled={isBusy}
                    />

                    {/* Order input */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] text-[var(--muted)]">Order:</span>
                      <input
                        type="number"
                        min="0"
                        value={edit.display_order}
                        onChange={(e) =>
                          setEdits((prev) => ({ ...prev, [img.id]: { ...edit, display_order: e.target.value } }))
                        }
                        className="w-14 rounded-md border border-[var(--line)] bg-white px-2 py-1 text-xs"
                        disabled={isBusy}
                      />
                    </div>

                    {/* Action buttons */}
                    <button
                      type="button"
                      onClick={() => onSaveEdit(img.id)}
                      className="button-primary mt-2 w-full justify-center py-1.5 text-xs"
                      disabled={isBusy}
                    >
                      Save
                    </button>

                    <div className="mt-1.5 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleActive(img.id, img.is_active)}
                        className="button-secondary flex-1 justify-center py-1 text-xs"
                        disabled={isBusy}
                      >
                        {img.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(img.id, img.image_url)}
                        className="flex-1 rounded-lg border border-[#e5c1c1] py-1 text-xs font-semibold text-[#a33a3a]"
                        disabled={isBusy}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </section>
    </main>
  );
}
