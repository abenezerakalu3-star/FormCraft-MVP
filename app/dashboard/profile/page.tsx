import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();
  const warnings = (user.warnings as unknown as unknown[] | null) || [];
  const display = user.name || user.email;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-up">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted">Your account details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr] animate-fade-up">
        <div className="card p-6 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/15 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {display.slice(0, 1).toUpperCase()}
          </span>
          <h2 className="mt-4 text-lg font-bold">{user.name || "Unnamed user"}</h2>
          <p className="truncate text-sm text-muted">{user.email}</p>
          <span
            className={`chip mt-3 ${
              user.role === "admin"
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            <ShieldCheck className="h-3 w-3" /> {user.role === "admin" ? "Super admin" : "Member"}
          </span>
          {warnings.length > 0 && (
            <span className="chip mt-2 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-3 w-3" /> {warnings.length} active warning
              {warnings.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <h2 className="font-bold tracking-tight">Account info</h2>
          </div>
          <dl className="divide-y divide-line text-sm">
            <div className="flex items-start gap-3.5 px-6 py-4">
              <UserRound className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Name</dt>
                <dd className="mt-0.5 font-medium">{user.name || "—"}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3.5 px-6 py-4">
              <Mail className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Email</dt>
                <dd className="mt-0.5 font-medium">{user.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3.5 px-6 py-4">
              <CalendarDays className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Member since
                </dt>
                <dd className="mt-0.5 font-medium">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}