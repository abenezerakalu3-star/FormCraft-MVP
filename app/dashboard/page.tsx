import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import DashboardForms from "@/components/dashboard-forms";

export default async function DashboardPage() {
  const user = await requireUser();
  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    include: { _count: { select: { submissions: true, fields: true, views: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hi, {user.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here’s what’s happening with your forms.
          </p>
        </div>
        <Link href="/dashboard/forms/new" className="btn-primary">
          <span className="text-base leading-none">＋</span> New form
        </Link>
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