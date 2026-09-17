import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Bucket, getS3Client, isS3Configured } from "@/lib/s3";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "ico",
  "pdf", "doc", "docx", "txt", "csv", "xls", "xlsx", "ppt", "pptx", "zip",
]);

const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/bmp": "bmp",
  "image/x-icon": "ico",
  "image/heic": "heic",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/zip": "zip",
};

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 10 MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime = file.type || "";
  const knownExt = ALLOWED.has(ext);
  const knownMime = Boolean(mime && MIME_EXT[mime]);
  if (!knownExt && !knownMime) {
    return NextResponse.json(
      { error: "File type not allowed (images, PDF, documents, spreadsheets, ZIP)" },
      { status: 400 }
    );
  }

  const safeExt = knownExt ? ext : MIME_EXT[mime] ?? "bin";
  if (safeExt.length > 5 || !/^[a-z0-9]+$/.test(safeExt)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const now = new Date();
  const folder = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const name = `${randomBytes(12).toString("hex")}.${safeExt}`;
  const key = `${folder}/${name}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  if (Buffer.byteLength(bytes) > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 10 MB)" }, { status: 400 });
  }

  // Upload to AletCloud S3.
  if (isS3Configured()) {
    try {
      await getS3Client().send(
        new PutObjectCommand({
          Bucket: getS3Bucket(),
          Key: key,
          Body: bytes,
          ContentType: mime,
        })
      );
    } catch {
      return NextResponse.json({ error: "Upload failed — please try again" }, { status: 500 });
    }
    const url = `/api/files?key=${encodeURIComponent(key)}&name=${encodeURIComponent(file.name)}`;
    return NextResponse.json(
      { url, key, name: file.name, size: file.size, mime },
      { status: 201 }
    );
  }

  // Fallback: store locally under public/uploads.
  try {
    const dir = `public/${folder}`;
    await mkdir(path.join(process.cwd(), dir), { recursive: true });
    await writeFile(path.join(process.cwd(), dir, name), bytes);
  } catch {
    return NextResponse.json({ error: "Upload failed — please try again" }, { status: 500 });
  }

  const url = `/${folder}/${name}`;
  return NextResponse.json(
    { url, key: "", name: file.name, size: file.size, mime },
    { status: 201 }
  );
}