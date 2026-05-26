import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const IMAGE_DIR = path.join(process.cwd(), "public", "orion-images");
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

  await mkdir(IMAGE_DIR, { recursive: true });

  const files = await readdir(IMAGE_DIR);
  const images = files
    .filter((file) => isAllowedExtension(file))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => ({
      fileName,
      src: `/orion-images/${fileName}`,
    }));

  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await mkdir(IMAGE_DIR, { recursive: true });

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
  const stampedName = `${Date.now()}-${base}${ext}`;
  const outputPath = path.join(IMAGE_DIR, stampedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(outputPath, buffer);

  return NextResponse.json({
    ok: true,
    image: {
      fileName: stampedName,
      src: `/orion-images/${stampedName}`,
    },
  });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { fileName?: string };
  const fileName = body.fileName?.trim();

  if (!fileName) {
    return NextResponse.json({ error: "fileName is required." }, { status: 400 });
  }

  const safeName = path.basename(fileName);

  if (safeName !== fileName || !isAllowedExtension(safeName)) {
    return NextResponse.json({ error: "Invalid fileName." }, { status: 400 });
  }

  const targetPath = path.join(IMAGE_DIR, safeName);

  try {
    await unlink(targetPath);
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
