import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "bmp", "ico",
  "pdf", "doc", "docx", "txt", "csv", "xls", "xlsx", "ppt", "pptx", "zip",
]);

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
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { error: "File type not allowed (images, PDF, documents, spreadsheets, ZIP)" },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9]{0,5}$/.test(ext) || ext.length === 0) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const now = new Date();
  const dir = `public/uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  const fullUrl = `${dir.replace(/^public/, "")}/${name}`;

  try {
    await mkdir(path.join(process.cwd(), dir), { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    if (Buffer.byteLength(bytes) > MAX_SIZE) {
      return NextResponse.json({ error: "File is too large (max 10 MB)" }, { status: 400 });
    }
    await writeFile(path.join(process.cwd(), dir, name), bytes);
  } catch {
    return NextResponse.json({ error: "Upload failed — please try again" }, { status: 500 });
  }

  return NextResponse.json(
    { url: fullUrl, name: file.name, size: file.size, mime: file.type || "application/octet-stream" },
    { status: 201 }
  );
}