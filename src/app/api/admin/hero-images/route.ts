import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdminClient, HERO_IMAGES_BUCKET } from "@/lib/supabase-admin";

type HeroImageRow = {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function fileNameFromUrl(url: string): string {
  const marker = `/object/public/${HERO_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : "";
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (supabase as any)
      .from("hero_images")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }) as { data: HeroImageRow[] | null; error: { message: string } | null };

    if (result.error) {
      console.error("hero_images GET error:", result.error);
      return NextResponse.json({ error: "Failed to fetch images." }, { status: 500 });
    }

    return NextResponse.json({ images: result.data ?? [] });
  } catch (err) {
    console.error("hero_images GET exception:", err);
    return NextResponse.json({ error: "Failed to fetch images." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const formData = await request.formData();
    const file = formData.get("file");
    const caption = (formData.get("caption") as string | null)?.trim() || null;
    const displayOrder = parseInt((formData.get("display_order") as string | null) ?? "0", 10);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    const originalName = file.name || "upload.jpg";
    const ext = path.extname(originalName).toLowerCase() || ".jpg";

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    const base = sanitizeBaseName(path.basename(originalName, ext)) || "image";
    const fileName = `${Date.now()}-${randomUUID()}-${base}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(HERO_IMAGES_BUCKET)
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("hero-images storage upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${HERO_IMAGES_BUCKET}/${fileName}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertResult = await (supabase as any)
      .from("hero_images")
      .insert({ image_url: imageUrl, caption, display_order: isNaN(displayOrder) ? 0 : displayOrder })
      .select()
      .single() as { data: HeroImageRow | null; error: { message: string } | null };

    if (insertResult.error) {
      console.error("hero_images insert error:", insertResult.error);
      await supabase.storage.from(HERO_IMAGES_BUCKET).remove([fileName]);
      return NextResponse.json({ error: "Failed to save image record." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, image: insertResult.data });
  } catch (err) {
    console.error("hero_images POST exception:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const body = (await request.json()) as {
      id: string;
      caption?: string | null;
      display_order?: number;
      is_active?: boolean;
    };

    if (!body.id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if ("caption" in body) updates.caption = body.caption ?? null;
    if ("display_order" in body) updates.display_order = body.display_order;
    if ("is_active" in body) updates.is_active = body.is_active;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putResult = await (supabase as any)
      .from("hero_images")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single() as { data: HeroImageRow | null; error: { message: string } | null };

    if (putResult.error) {
      console.error("hero_images PUT error:", putResult.error);
      return NextResponse.json({ error: "Update failed." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, image: putResult.data });
  } catch (err) {
    console.error("hero_images PUT exception:", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const body = (await request.json()) as { id: string };

    if (!body.id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchResult = await (supabase as any)
      .from("hero_images")
      .select("image_url")
      .eq("id", body.id)
      .single() as { data: { image_url: string } | null; error: unknown };

    if (fetchResult.error || !fetchResult.data) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    const record = fetchResult.data;

    const { error: deleteError } = await supabase
      .from("hero_images")
      .delete()
      .eq("id", body.id);

    if (deleteError) {
      console.error("hero_images delete error:", deleteError);
      return NextResponse.json({ error: "Delete failed." }, { status: 500 });
    }

    const fileName = fileNameFromUrl(record.image_url);
    if (fileName) {
      await supabase.storage.from(HERO_IMAGES_BUCKET).remove([fileName]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("hero_images DELETE exception:", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
