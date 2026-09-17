import Link from "next/link";
import { DollarSign, Users, Activity, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBillingPage() {
  await requireAdmin();

  const [users, payments] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { plan: { not: "free" } },
          { polarSubscriptionId: { not: null } }
        ]
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    }),
  ]);

  const activeSubscriptions = users.filter((u) => u.planStatus === "active");
  const proSubscribers = users.filter((u) => u.plan === "pro");
  const teamSubscribers = users.filter((u) => u.plan === "team");
  const monthlySubscribers = users.filter((u) => u.billingInterval === "month");
  const annualSubscribers = users.filter((u) => u.billingInterval === "year");
  const canceled = users.filter((u) => u.cancelAtPeriodEnd);
  const pastDue = users.filter((u) => u.planStatus === "past_due");
  const revoked = users.filter((u) => u.planStatus === "revoked");

  const totalRevenue = payments
    .filter((p) => p.status === "succeeded")
    .reduce((acc, p) => acc + p.amount, 0) / 100;

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Active Subscriptions", value: activeSubscriptions.length, icon: Activity, tone: "text-indigo-600 dark:text-indigo-400" },
    { label: "Pro Subscribers", value: proSubscribers.length, icon: Users, tone: "text-blue-600 dark:text-blue-400" },
    { label: "Team Subscribers", value: teamSubscribers.length, icon: Users, tone: "text-purple-600 dark:text-purple-400" },
    { label: "Canceled", value: canceled.length, icon: XCircle, tone: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/admin" className="hover:text-foreground">Home</Link> / Billing
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of subscriptions and revenue synced from Polar.
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 animate-fade-up">
        {stats.map((s) => (
          <div key={s.label} className="card flex flex-col justify-center p-5">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-opacity-10 ${s.tone} bg-current`}>
                <s.icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-muted">{s.label}</p>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold">Billing Intervals</h2>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold">{monthlySubscribers.length}</p>
              <p className="text-sm text-muted">Monthly</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{annualSubscribers.length}</p>
              <p className="text-sm text-muted">Annual</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold">Status Overview</h2>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-red-500">{pastDue.length}</p>
              <p className="text-sm text-muted">Past Due</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-500">{revoked.length}</p>
              <p className="text-sm text-muted">Revoked</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
        
        <div className="card overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-base font-bold">Payments / Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface/50 text-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Polar ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted">No payments found.</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{p.user?.name || "Unknown"}</div>
                        <div className="text-xs text-muted">{p.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {p.plan ? (
                          <span className="capitalize">{p.plan} {p.billingInterval}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {(p.amount / 100).toFixed(2)} {p.currency?.toUpperCase() || "USD"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.status === "succeeded" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-surface text-muted"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {p.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-muted">
                        {p.polarId.slice(0, 8)}...
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-base font-bold">Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface/50 text-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Period</th>
                  <th className="px-6 py-3 font-medium">Polar Sub ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted">No subscriptions found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{u.name || "Unknown"}</div>
                        <div className="text-xs text-muted">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize">{u.plan}</span>
                        {u.billingInterval && <span className="text-muted ml-1 capitalize">({u.billingInterval})</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                            u.planStatus === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            u.planStatus === "past_due" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                            "bg-surface text-muted"
                          }`}>
                            {u.planStatus || "Unknown"}
                          </span>
                          {u.cancelAtPeriodEnd && (
                            <span className="text-xs text-amber-500">Cancels at period end</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {u.currentPeriodStart ? u.currentPeriodStart.toLocaleDateString() : "-"}
                        <br />
                        to {u.currentPeriodEnd ? u.currentPeriodEnd.toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-muted">
                        {u.polarSubscriptionId ? u.polarSubscriptionId.slice(0, 8) + "..." : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
