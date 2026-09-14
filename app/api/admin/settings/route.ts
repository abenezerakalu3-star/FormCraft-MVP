import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { SETTING_KEYS } from "@/lib/settings";

export async function PUT(req: Request) {
  await requirePermission("settings");
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let changed = 0;
  for (const key of SETTING_KEYS) {
    const raw = body[key];
    if (raw === undefined || raw === null) continue;
    const value = String(raw).slice(0, 2000);
    if (value.trim() === "") {
      await prisma.setting.deleteMany({ where: { key } });
    } else {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    changed += 1;
  }

  return NextResponse.json({ ok: true, changed });
}