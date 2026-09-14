import { NextRequest, NextResponse } from "next/server";
import { isS3Configured, presignedObjectUrl } from "@/lib/s3";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (!key) {
    return NextResponse.json({ error: "Missing file key" }, { status: 400 });
  }

  // Legacy locally-stored files (pre-S3 uploads).
  if (key.startsWith("/uploads/")) {
    return NextResponse.redirect(new URL(key, req.nextUrl.origin), 307);
  }

  if (!isS3Configured()) {
    return NextResponse.json({ error: "Storage is not configured" }, { status: 500 });
  }

  const download = req.nextUrl.searchParams.get("download") === "1";
  const name = req.nextUrl.searchParams.get("name") ?? undefined;

  try {
    const signed = await presignedObjectUrl(key, { download, name });
    return NextResponse.redirect(signed, 307);
  } catch {
    return NextResponse.json({ error: "Could not open file" }, { status: 500 });
  }
}