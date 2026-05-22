import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, isValidSessionToken } from "@/lib/auth";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/content";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(getAdminCookieName())?.value;

  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nextContent = (await request.json()) as SiteContent;
  await saveSiteContent(nextContent);

  return NextResponse.json({ ok: true });
}