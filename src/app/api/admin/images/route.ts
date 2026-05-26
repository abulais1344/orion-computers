import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdminClient, IMAGES_BUCKET } from "@/lib/supabase-admin";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isAllowedExtension(fileName: string) {
  return ALLOWED_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.storage.from(IMAGES_BUCKET).list("", {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.error("Supabase list error:", error);
      return NextResponse.json({ error: "Failed to fetch images." }, { status: 500 });
    }

    const images = (data || [])
      .filter((file) => isAllowedExtension(file.name))
      .map((file) => ({
        fileName: file.name,
        src: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}/${file.name}`,
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("GET error:", error);
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

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName).toLowerCase() || ".png";

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: "Unsupported file extension." }, { status: 400 });
    }

    const base = sanitizeBaseName(path.basename(originalName, ext)) || "image";
    const stampedName = `${Date.now()}-${randomUUID()}-${base}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(stampedName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }

    const src = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}/${stampedName}`;

    return NextResponse.json({
      ok: true,
      image: {
        fileName: stampedName,
        src,
      },
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();

    const body = (await request.json()) as { fileName?: string; deleteAll?: boolean };

    if (body.deleteAll) {
      const { data, error: listError } = await supabase.storage.from(IMAGES_BUCKET).list("", {
        limit: 1000,
        sortBy: { column: "name", order: "asc" },
      });

      if (listError) {
        console.error("Supabase list error:", listError);
        return NextResponse.json({ error: "Failed to load images for deletion." }, { status: 500 });
      }

      const fileNames = (data || []).map((file) => file.name).filter(Boolean);

      if (fileNames.length === 0) {
        return NextResponse.json({ ok: true, deletedCount: 0 });
      }

      const { error: deleteError } = await supabase.storage.from(IMAGES_BUCKET).remove(fileNames);

      if (deleteError) {
        console.error("Supabase bulk delete error:", deleteError);
        return NextResponse.json({ error: "Failed to delete uploaded images." }, { status: 500 });
      }

      return NextResponse.json({ ok: true, deletedCount: fileNames.length });
    }

    const fileName = body.fileName?.trim();

    if (!fileName) {
      return NextResponse.json({ error: "fileName is required." }, { status: 400 });
    }

    const safeName = path.basename(fileName);

    if (safeName !== fileName || !isAllowedExtension(safeName)) {
      return NextResponse.json({ error: "Invalid fileName." }, { status: 400 });
    }

    const { error: deleteError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .remove([safeName]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
