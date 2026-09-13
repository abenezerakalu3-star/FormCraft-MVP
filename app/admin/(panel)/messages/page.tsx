import Link from "next/link";
import { Inbox, Mail, MessagesSquare } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminMessagesList, { ContactMessageItem } from "@/components/admin/admin-messages-list";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireAdmin();

  const [total, withSubject, messages] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { subject: { not: "" } } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  const serialized: ContactMessageItem[] = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  }));

  const stats = [
    { label: "Total messages", value: total, icon: MessagesSquare, tone: "text-indigo-600 dark:text-indigo-400" },
    { label: "With subject", value: withSubject, icon: Mail, tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Inbox", value: messages.length, icon: Inbox, tone: "text-sky-600 dark:text-sky-400" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/admin" className="hover:text-foreground">Home</Link> / Messages
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-muted">
            Contact form submissions from the website, newest first.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3 animate-fade-up">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <AdminMessagesList messages={serialized} />

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
        <Inbox className="h-4 w-4 shrink-0" />
        Messages are stored in the database. Reply is handled from your own inbox via the listed email.
      </div>
    </div>
  );
}