import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdminClient, IMAGES_BUCKET } from "@/lib/supabase-admin";

type ImageItem = {
  src: string;
  alt: string;
};

const LAYOUT_FILE = "_layout.json";

function getAllowedImageSourcePrefixes() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");

  return [
    "/orion-images/",
    supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/orion-images/` : null,
  ].filter((prefix): prefix is string => Boolean(prefix));
}

function normalizeImages(input: unknown, fallbackAltPrefix: string) {
  if (!Array.isArray(input)) return [] as ImageItem[];

  const allowedPrefixes = getAllowedImageSourcePrefixes();

  return input
    .filter((item): item is Partial<ImageItem> => typeof item === "object" && item !== null)
    .map((item, index) => ({
      src: typeof item.src === "string" ? item.src.trim() : "",
      alt:
        typeof item.alt === "string" && item.alt.trim().length > 0
          ? item.alt.trim()
          : `${fallbackAltPrefix} ${index + 1}`,
    }))
    .filter((item) => allowedPrefixes.some((prefix) => item.src.startsWith(prefix)));
}

async function fetchLayout(): Promise<{ heroImages: ImageItem[]; galleryImages: ImageItem[] }> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(IMAGES_BUCKET).download(LAYOUT_FILE);

  if (error || !data) {
    return { heroImages: [], galleryImages: [] };
  }

  try {
    const layout = JSON.parse(await data.text()) as {
      heroImages?: ImageItem[];
      galleryImages?: ImageItem[];
    };
    return {
      heroImages: Array.isArray(layout.heroImages) ? layout.heroImages : [],
      galleryImages: Array.isArray(layout.galleryImages) ? layout.galleryImages : [],
    };
  } catch {
    return { heroImages: [], galleryImages: [] };
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const layout = await fetchLayout();
  return NextResponse.json(layout);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json()) as {
    heroImages?: unknown;
    galleryImages?: unknown;
  };

  const heroImages = normalizeImages(payload.heroImages, "Hero image").slice(0, 2);
  const galleryImages = normalizeImages(payload.galleryImages, "Gallery image").slice(0, 30);

  const layout = { heroImages, galleryImages };
  const blob = new Blob([JSON.stringify(layout)], { type: "application/json" });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(LAYOUT_FILE, blob, { contentType: "application/json", upsert: true });

  if (error) {
    console.error("Supabase layout save error:", error);
    return NextResponse.json({ error: "Failed to save layout." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, heroImages, galleryImages });
}
