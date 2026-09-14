import Link from "next/link";
import { ClipboardList, Eye, FileStack, Rocket, Send } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import DashboardForms from "@/components/dashboard-forms";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    include: { _count: { select: { submissions: true, fields: true, views: true } } },
    orderBy: { createdAt: "desc" },
  });

  const submissions = forms.reduce((n, f) => n + f._count.submissions, 0);
  const views = forms.reduce((n, f) => n + f._count.views, 0);
  const live = forms.filter((f) => f.published).length;
  const drafts = forms.length - live;

  const stats = [
    { label: "Total forms", value: forms.length, icon: FileStack, tone: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Responses", value: submissions, icon: Send, tone: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total views", value: views, icon: Eye, tone: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10" },
    { label: "Live forms", value: live, icon: Rocket, tone: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 animate-fade-up">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/5 dark:bg-indigo-400/10" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-emerald-500/5 dark:bg-emerald-400/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {greeting()}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Hi, {user.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted">
              {forms.length === 0
                ? "Let's create your first form — it takes less than a minute."
                : submissions === 0
                  ? "Your forms are live and ready. Share a link to start collecting responses."
                  : `You've collected ${submissions} response${submissions === 1 ? "" : "s"} across ${live} live form${live === 1 ? "" : "s"}. Keep it up!`}
            </p>
          </div>
          <Link href="/dashboard/forms/new" className="btn-primary">
            <span className="text-base leading-none">＋</span> New form
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="group card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{s.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} transition-transform duration-300 group-hover:scale-110`}>
                <s.icon className={`h-4 w-4 ${s.tone}`} />
              </span>
            </div>
            <p className={`mt-2 text-3xl font-bold ${s.tone}`}>{s.value}</p>
            {s.label === "Responses" && views > 0 && (
              <p className="mt-1 text-xs text-muted">
                {Math.round((submissions / views) * 100)}% of viewers respond
              </p>
            )}
            {s.label === "Live forms" && drafts > 0 && (
              <p className="mt-1 text-xs text-muted">{drafts} draft{drafts === 1 ? "" : "s"} waiting</p>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-lg font-bold tracking-tight">Your forms</h2>
        {forms.length > 0 && (
          <Link
            href="/dashboard/forms/new"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            <span className="inline-flex items-center gap-1">
              <ClipboardList className="h-4 w-4" /> Create another
            </span>
          </Link>
        )}
      </div>

      <DashboardForms
        forms={JSON.parse(
          JSON.stringify(
            forms.map((f) => ({
              id: f.id,
              title: f.title,
              slug: f.slug,
              published: f.published,
              createdAt: f.createdAt,
              _count: f._count,
            }))
          )
        )}
      />
    </div>
  );
}