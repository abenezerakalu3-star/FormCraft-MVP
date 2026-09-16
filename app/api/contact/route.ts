import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validate";
import { resolvePermissions, PermissionJson } from "@/lib/permissions";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;

  // Basic spam guard: block obviously empty bodies quickly.
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: { name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim() },
  });

  // Fire-and-forget admin notification.
  (async () => {
    try {
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
        select: { email: true, permissions: true },
      });
      const recipients = admins
        .filter((a) => resolvePermissions(a.permissions as PermissionJson).includes("messages"))
        .map((a) => a.email);
      if (recipients.length > 0) {
        await sendContactNotification(recipients, name.trim(), email.trim(), subject.trim(), message.trim());
      }
    } catch (err) {
      console.error("[contact] Admin notification failed:", err);
    }
  })();

  return NextResponse.json({ ok: true }, { status: 201 });
}