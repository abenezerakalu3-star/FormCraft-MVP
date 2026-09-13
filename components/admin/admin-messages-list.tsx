"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Delete, Mail, MessageSquareText } from "lucide-react";

export type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export default function AdminMessagesList({ messages }: { messages: ContactMessageItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/contact/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) router.refresh();
  }

  if (messages.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <MessageSquareText className="h-7 w-7" />
        </span>
        <h3 className="font-semibold">No messages yet</h3>
        <p className="max-w-xs text-sm text-muted">
          Contact form submissions from the website will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {m.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold">{m.subject || "No subject"}</p>
                <p className="text-sm text-muted">
                  {m.name} •{" "}
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <Mail className="h-3.5 w-3.5" /> {m.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">
                {new Date(m.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(m.createdAt).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <button
                onClick={() => remove(m.id)}
                disabled={busyId === m.id}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label="Delete message"
              >
                <Delete className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap rounded-xl bg-canvas px-4 py-3 text-sm leading-relaxed">
            {m.message}
          </p>
        </div>
      ))}
    </div>
  );
}