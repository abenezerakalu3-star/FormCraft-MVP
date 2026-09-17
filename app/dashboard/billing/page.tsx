import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { effectivePlan, planLimitsFor } from "@/lib/entitlements";
import { isBillingConfigured } from "@/lib/polar";
import { PLAN_MAP, UNLIMITED, isPlanKey, type BillingInterval } from "@/lib/plans";
import BillingActions from "@/components/billing-actions";

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const unlimited = limit === UNLIMITED;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted">
          {used.toLocaleString()} / {unlimited ? "Unlimited" : limit.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-100/10">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-indigo-500"
          }`}
          style={{ width: unlimited ? "100%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; plan?: string; interval?: string }>;
}) {
  const user = await requireUser();
  const { checkout, plan: planParam, interval: intervalParam } = await searchParams;

  const intentPlan = isPlanKey(planParam) ? planParam : undefined;
  const intentInterval: BillingInterval =
    intervalParam === "year" ? "year" : "month";

  const plan = effectivePlan(user);
  const limits = planLimitsFor(user);
  const planDef = PLAN_MAP[plan];

  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    select: { id: true },
  });
  const formIds = forms.map((f) => f.id);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const responsesThisMonth = await prisma.submission.count({
    where: { formId: { in: formIds }, createdAt: { gte: monthStart } },
  });

  const renewal = user.currentPeriodEnd
    ? new Date(user.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-up">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your plan and track your usage.
        </p>
      </div>

      {checkout === "success" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Payment received. Your plan will update as soon as the subscription is
          confirmed.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 animate-fade-up">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Current plan
              </p>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-bold">
                {planDef.name}
                {plan !== "free" && (
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                )}
              </h2>
            </div>
            <span
              className={`chip ${
                plan === "free"
                  ? "bg-gray-500/10 text-muted"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {user.planStatus || "active"}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted">{planDef.tagline}</p>

          {plan !== "free" && renewal && (
            <p className="mt-3 text-sm text-muted">
              {user.cancelAtPeriodEnd ? "Ends" : "Renews"} on {renewal}
            </p>
          )}

          <div className="mt-6 space-y-5">
            <UsageBar label="Forms" used={forms.length} limit={limits.forms} />
            <UsageBar
              label="Responses this month"
              used={responsesThisMonth}
              limit={limits.responsesPerMonth}
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-bold tracking-tight">
            {effectivePlan(user) === "free" ? "Upgrade your plan" : "Manage subscription"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {effectivePlan(user) === "free"
              ? "Unlock unlimited forms, more responses and exports."
              : "Change your plan, update payment details or cancel anytime."}
          </p>
          <div className="mt-5">
            <BillingActions
              currentPlan={plan}
              hasCustomer={Boolean(user.polarCustomerId)}
              configured={isBillingConfigured}
              intentPlan={intentPlan}
              intentInterval={intentInterval}
            />
          </div>
          <p className="mt-4 text-xs text-muted">
            Need something custom?{" "}
            <Link href="/contact" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
