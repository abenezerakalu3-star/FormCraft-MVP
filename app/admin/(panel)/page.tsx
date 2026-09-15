import Link from "next/link";
import {
  ClipboardList,
  Eye,
  FileText,
  Globe,
  Inbox,
  Newspaper,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminOverviewCharts } from "@/components/admin/admin-overview-charts";

const DAYS = 14;

export default async function AdminHomePage() {
  const admin = await requireAdmin();

  const [users, blockedUsers, forms, liveForms, submissions, views, blogPosts, publishedPosts] =
    await Promise.all([
      prisma.user.count({ where: { role: "user" } }),
      prisma.user.count({ where: { role: "user", blocked: true } }),
      prisma.form.count(),
      prisma.form.count({ where: { published: true } }),
      prisma.submission.count(),
      prisma.formView.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ]);

  /* eslint-disable react-hooks/purity */
  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

  const [recentUsers, recentForms] = await Promise.all([
    prisma.user.findMany({
      where: { role: "user" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { forms: true } } },
    }),
    prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { email: true } },
        _count: { select: { submissions: true, views: true } },
      },
    }),
  ]);
  /* eslint-enable react-hooks/purity */

  const [dailyUsers, dailyForms, dailySubmissions, dailyViews] = await Promise.all([
    prisma.user.findMany({ where: { role: "user", createdAt: { gte: cutoff } }, select: { createdAt: true } }),
    prisma.form.findMany({ where: { createdAt: { gte: cutoff } }, select: { createdAt: true } }),
    prisma.submission.findMany({ where: { createdAt: { gte: cutoff } }, select: { createdAt: true } }),
    prisma.formView.findMany({ where: { createdAt: { gte: cutoff } }, select: { createdAt: true } }),
  ]);

  const series = new Map<string, { users: number; forms: number; submissions: number; views: number }>();
  for (let i = DAYS - 1; i >= 0; i--) {
    const day = new Date(cutoff.getTime() + i * 24 * 60 * 60 * 1000);
    series.set(day.toISOString().slice(0, 10), { users: 0, forms: 0, submissions: 0, views: 0 });
  }
  for (const d of dailyUsers) bump(series, d.createdAt, "users");
  for (const d of dailyForms) bump(series, d.createdAt, "forms");
  for (const d of dailySubmissions) bump(series, d.createdAt, "submissions");
  for (const d of dailyViews) bump(series, d.createdAt, "views");

  const chartSeries = Array.from(series, ([date, counts]) => ({
    date,
    ...counts,
    responses: counts.submissions,
    visitors: counts.views,
  }));

  const stats = [
    { label: "Total users", value: users, icon: Users, tone: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", sub: `${blockedUsers} blocked` },
    { label: "Responses", value: submissions, icon: Inbox, tone: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total visitors", value: views, icon: Eye, tone: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10" },
    { label: "Live forms", value: liveForms, icon: Globe, tone: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Draft forms", value: forms - liveForms, icon: FileText, tone: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { label: "Blog posts", value: blogPosts, icon: Newspaper, tone: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", sub: `${publishedPosts} published` },
  ];

  const quickLinks = [
    { href: "/admin/blog#new", label: "Write a blog post", desc: "Publish content for the website", icon: Newspaper, tone: "bg-violet-500" },
    { href: "/admin/users", label: "Manage users", desc: "Warn or block accounts", icon: UserPlus, tone: "bg-indigo-500" },
    { href: "/admin/forms", label: "Review forms", desc: "All forms across the platform", icon: ClipboardList, tone: "bg-emerald-500" },
    { href: "/admin/settings", label: "Site settings", desc: "Control the website UI", icon: Settings, tone: "bg-amber-500" },
  ];

  const formBreakdown = [
    { name: "Live", value: liveForms },
    { name: "Draft", value: forms - liveForms },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Control center
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Welcome back, {admin.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here is what is happening across Formitect today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2.5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-muted">All systems operational</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group card flex items-center gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/5"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${q.tone} text-white shadow-md`}>
              <q.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {q.label}
              </p>
              <p className="truncate text-xs text-muted">{q.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6 animate-fade-up">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="group card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/5"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} transition-transform duration-300 group-hover:scale-110`}
            >
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </span>
            <p className={`text-2xl font-bold ${s.tone}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted">
              {s.label}
              {s.sub ? <span className="text-gray-400"> · {s.sub}</span> : null}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8 animate-fade-up">
        <AdminOverviewCharts series={chartSeries} formBreakdown={formBreakdown} />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2 animate-fade-up">
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold tracking-tight">Newest users</h2>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted">No users yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {(u.name || u.email || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{u.name || u.email}</p>
                    <p className="truncate text-xs text-muted">{u.email}</p>
                  </div>
                  <span className="text-xs text-muted">
                    {u.createdAt.toLocaleDateString()} · {u._count.forms} form{u._count.forms === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold tracking-tight">Newest forms</h2>
          {recentForms.length === 0 ? (
            <p className="text-sm text-muted">No forms yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentForms.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${f.published ? "bg-emerald-500" : "bg-gray-300"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{f.title}</p>
                    <p className="truncate text-xs text-muted">{f.user.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {f._count.submissions} resp · {f._count.views} views
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function bump(map: Map<string, { users: number; forms: number; submissions: number; views: number }>, date: Date, key: "users" | "forms" | "submissions" | "views") {
  const entry = map.get(date.toISOString().slice(0, 10));
  if (entry) entry[key] += 1;
}