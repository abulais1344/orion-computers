import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type ImageItem = {
  src: string;
  alt: string;
};

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

function normalizeImages(input: unknown, fallbackAltPrefix: string) {
  if (!Array.isArray(input)) return [] as ImageItem[];

  return input
    .filter((item): item is Partial<ImageItem> => typeof item === "object" && item !== null)
    .map((item, index) => ({
      src: typeof item.src === "string" ? item.src.trim() : "",
      alt:
        typeof item.alt === "string" && item.alt.trim().length > 0
          ? item.alt.trim()
          : `${fallbackAltPrefix} ${index + 1}`,
    }))
    .filter((item) => item.src.startsWith("/orion-images/"));
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const raw = await readFile(CONTENT_PATH, "utf8");
  const content = JSON.parse(raw) as {
    heroImages?: ImageItem[];
    galleryImages?: ImageItem[];
  };

  return NextResponse.json({
    heroImages: Array.isArray(content.heroImages) ? content.heroImages : [],
    galleryImages: Array.isArray(content.galleryImages) ? content.galleryImages : [],
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json()) as {
    heroImages?: unknown;
    galleryImages?: unknown;
  };

  const raw = await readFile(CONTENT_PATH, "utf8");
  const content = JSON.parse(raw) as Record<string, unknown>;

  const heroImages = normalizeImages(payload.heroImages, "Hero image").slice(0, 2);
  const galleryImages = normalizeImages(payload.galleryImages, "Gallery image").slice(0, 30);

  content.heroImages = heroImages;
  content.galleryImages = galleryImages;

  await writeFile(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return NextResponse.json({ ok: true, heroImages, galleryImages });
}
