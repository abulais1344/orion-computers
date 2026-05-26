"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AdminImage = {
  fileName: string;
  src: string;
};

type ImageItem = {
  src: string;
  alt: string;
};

type NoticeKind = "info" | "success" | "error";

type Notice = {
  kind: NoticeKind;
  text: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<AdminImage[]>([]);
  const [heroImages, setHeroImages] = useState<ImageItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<ImageItem[]>([]);
  const [baselineLayout, setBaselineLayout] = useState<{ heroImages: ImageItem[]; galleryImages: ImageItem[] }>({
    heroImages: [],
    galleryImages: [],
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const imageOptions = useMemo(() => images.map((img) => img.src), [images]);
  const filledHeroCount = useMemo(() => heroImages.filter((item) => item.src).length, [heroImages]);
  const filledGalleryCount = useMemo(() => galleryImages.filter((item) => item.src).length, [galleryImages]);
  const isLayoutDirty = useMemo(() => {
    return JSON.stringify({ heroImages, galleryImages }) !== JSON.stringify(baselineLayout);
  }, [heroImages, galleryImages, baselineLayout]);

  function showNotice(kind: NoticeKind, text: string) {
    setNotice({ kind, text });
  }

  function redirectToLogin() {
    router.push("/admin/login");
    router.refresh();
  }

  async function loadImages() {
    const res = await fetch("/api/admin/images", { cache: "no-store" });

    if (res.status === 401) {
      showNotice("error", "Session expired. Please login again.");
      redirectToLogin();
      return;
    }

    const data = (await res.json()) as { images: AdminImage[] };
    setImages(data.images || []);
  }

  async function loadSlots() {
    const res = await fetch("/api/admin/content-images", { cache: "no-store" });

    if (res.status === 401) {
      showNotice("error", "Session expired. Please login again.");
      redirectToLogin();
      return;
    }

    const data = (await res.json()) as {
      heroImages: ImageItem[];
      galleryImages: ImageItem[];
    };

    const hero = (data.heroImages || []).slice(0, 2);
    while (hero.length < 2) hero.push({ src: "", alt: `Hero image ${hero.length + 1}` });

    const gallery = (data.galleryImages || []).slice(0, 30);
    if (gallery.length === 0) {
      gallery.push({ src: "", alt: "Gallery image 1" });
    }

    setHeroImages(hero);
    setGalleryImages(gallery);
    setBaselineLayout({ heroImages: hero, galleryImages: gallery });
  }

  useEffect(() => {
    Promise.all([loadImages(), loadSlots()]).catch(() => {
      showNotice("error", "Failed to load admin data.");
    });
  }, []);

  useEffect(() => {
    if (!selectedPreviewUrl) return;

    return () => {
      URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  useEffect(() => {
    if (!notice || notice.kind === "error") return;

    const timeout = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      showNotice("error", "Please choose an image first.");
      fileInputRef.current?.click();
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsBusy(true);
    showNotice("info", "Uploading image...");

    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

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

      form.reset();
      setSelectedFileName("");
      setSelectedPreviewUrl("");
      await loadImages();
      showNotice("success", "Image uploaded.");
    } catch {
      showNotice("error", "Upload failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDelete(fileName: string) {
    if (!window.confirm(`Remove ${fileName}?`)) return;

    setIsBusy(true);
    showNotice("info", "Removing image...");

    try {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });

      if (res.status === 401) {
        showNotice("error", "Session expired. Please login again.");
        redirectToLogin();
        return;
      }

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        showNotice("error", data.error || "Remove failed.");
        return;
      }

      await loadImages();
      showNotice("success", "Image removed.");
    } catch {
      showNotice("error", "Remove failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onSaveLayout() {
    if (!isLayoutDirty) {
      showNotice("info", "No layout changes to save.");
      return;
    }

    setIsBusy(true);
    showNotice("info", "Saving homepage image layout...");

    try {
      const res = await fetch("/api/admin/content-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImages, galleryImages }),
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

      setBaselineLayout({ heroImages, galleryImages });
      showNotice("success", "Homepage image layout saved.");
    } catch {
      showNotice("error", "Save failed.");
    } finally {
      setIsBusy(false);
    }
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

  function updateHero(index: number, src: string) {
    setHeroImages((prev) => prev.map((item, i) => (i === index ? { ...item, src } : item)));
  }

  function updateGallery(index: number, src: string) {
    setGalleryImages((prev) => prev.map((item, i) => (i === index ? { ...item, src } : item)));
  }

  function addGallerySlot() {
    setGalleryImages((prev) => {
      if (prev.length >= 30) return prev;
      return [...prev, { src: "", alt: `Gallery image ${prev.length + 1}` }];
    });
  }

  function removeGallerySlot(index: number) {
    setGalleryImages((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  function onSelectDeviceImage() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileName("");
      setSelectedPreviewUrl("");
      return;
    }

    setSelectedFileName(file.name);
    setSelectedPreviewUrl(URL.createObjectURL(file));
    showNotice("info", "Image selected. Click Upload Selected Image to add it.");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-8">
      <section className="page-shell space-y-6">
        <header className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin - Orion Computers</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Upload/remove images and choose which ones appear on the homepage.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/" className="inline-flex text-sm font-semibold text-[var(--primary-dark)] underline">Back to website</a>
            <button type="button" onClick={onLogout} className="text-sm font-semibold text-[#a33a3a] underline" disabled={isBusy}>
              Logout
            </button>
          </div>
        </header>

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

        <section className="grid gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 text-sm text-[var(--muted)] sm:grid-cols-3">
          <p><span className="font-semibold text-[var(--foreground)]">Step 1:</span> Upload images from your device.</p>
          <p><span className="font-semibold text-[var(--foreground)]">Step 2:</span> Assign images to hero and gallery slots.</p>
          <p><span className="font-semibold text-[var(--foreground)]">Step 3:</span> Save layout to publish homepage changes.</p>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Step 1: Upload Image</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">Step 1: select image from your device. Step 2: upload it.</p>
          <form onSubmit={onUpload} className="mt-3 flex flex-col gap-3">
            <input
              ref={fileInputRef}
              name="file"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isBusy}
              onChange={onFileChange}
            />

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onSelectDeviceImage}
                className="button-secondary inline-flex justify-center"
                disabled={isBusy}
              >
                Select From Device
              </button>
              <button type="submit" className="button-primary inline-flex justify-center" disabled={isBusy}>
                Upload Selected Image
              </button>
            </div>

            {selectedPreviewUrl ? (
              <div className="max-w-[220px] rounded-xl border border-[var(--line)] p-2">
                <img src={selectedPreviewUrl} alt="Selected preview" className="h-24 w-full rounded-lg object-cover" />
              </div>
            ) : null}
          </form>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {selectedFileName ? `Selected: ${selectedFileName}` : "No file selected yet."}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Step 2: Homepage Image Slots</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isLayoutDirty ? "bg-[#fff4de] text-[#8a5a16]" : "bg-[#ecf8ef] text-[#1f5a38]"
              }`}
            >
              {isLayoutDirty ? "Unsaved changes" : "All changes saved"}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Hero selected: {filledHeroCount}/2. Gallery selected: {filledGalleryCount}/{galleryImages.length}.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {heroImages.map((item, index) => (
              <label key={`hero-${index}`} className="block">
                <span className="mb-1 block text-sm font-medium text-[var(--foreground)]">Hero image {index + 1}</span>
                <select
                  value={item.src}
                  onChange={(e) => updateHero(index, e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] bg-white p-2 text-sm"
                  disabled={isBusy}
                >
                  <option value="">Select image</option>
                  {imageOptions.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {galleryImages.map((item, index) => (
              <div key={`gallery-${index}`} className="rounded-lg border border-[var(--line)] p-2.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="block text-sm font-medium text-[var(--foreground)]">Gallery image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGallerySlot(index)}
                    className="text-xs font-semibold text-[#a33a3a] underline"
                    disabled={isBusy || galleryImages.length <= 1}
                  >
                    Remove slot
                  </button>
                </div>
                <select
                  value={item.src}
                  onChange={(e) => updateGallery(index, e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] bg-white p-2 text-sm"
                  disabled={isBusy}
                >
                  <option value="">Select image</option>
                  {imageOptions.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addGallerySlot}
            className="button-secondary mt-3 inline-flex"
            disabled={isBusy || galleryImages.length >= 30}
          >
            Add Another Gallery Image Slot
          </button>

          <button onClick={onSaveLayout} className="button-primary mt-4 inline-flex" disabled={isBusy}>Step 3: Save Image Layout</button>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Uploaded Images</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">Total uploaded: {images.length}</p>
          {images.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
              No uploaded images yet. Use Step 1 above to add your first image.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <article key={img.fileName} className="rounded-xl border border-[var(--line)] p-2">
                  <img src={img.src} alt={img.fileName} className="h-28 w-full rounded-lg object-cover" />
                  <p className="mt-2 truncate text-xs text-[var(--muted)]">{img.fileName}</p>
                  <button
                    type="button"
                    onClick={() => onDelete(img.fileName)}
                    className="mt-2 w-full rounded-lg border border-[#e5c1c1] px-3 py-1.5 text-xs font-semibold text-[#a33a3a]"
                    disabled={isBusy}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
