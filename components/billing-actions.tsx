"use client";

import { useState } from "react";
import { CreditCard, Loader2, Sparkles } from "lucide-react";
import { PLAN_MAP, isPlanKey, type PlanKey, type BillingInterval } from "@/lib/plans";

export default function BillingActions({
  currentPlan,
  hasCustomer,
  configured,
  intentPlan,
  intentInterval = "month",
}: {
  currentPlan: PlanKey;
  hasCustomer: boolean;
  configured: boolean;
  intentPlan?: PlanKey;
  intentInterval?: BillingInterval;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const intent = isPlanKey(intentPlan) && intentPlan !== "free" ? intentPlan : null;

  async function request(key: string, endpoint: string, body?: unknown) {
    setError("");
    setLoading(key);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  function upgradeButton(plan: Exclude<PlanKey, "free">, variant: "primary" | "secondary") {
    const busy = loading === plan;
    return (
      <button
        key={plan}
        onClick={() =>
          request(plan, "/api/billing/checkout", {
            plan,
            interval: intent === plan ? intentInterval : "month",
          })
        }
        disabled={loading !== null}
        className={`${
          variant === "primary" ? "btn-primary" : "btn-secondary"
        } w-full justify-center disabled:opacity-60`}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {intent === plan
          ? `Subscribe to ${PLAN_MAP[plan].name}`
          : currentPlan === plan
            ? `Switch to ${PLAN_MAP[plan].name}`
            : currentPlan === "free"
              ? `Upgrade to ${PLAN_MAP[plan].name}`
              : `Switch to ${PLAN_MAP[plan].name}`}
      </button>
    );
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        Billing is not configured yet. Add your Polar credentials to enable
        subscriptions.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {intent && !hasCustomer && (
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-4">
          <p className="text-sm font-semibold">
            Finish your {PLAN_MAP[intent].name} subscription
          </p>
          <p className="mt-0.5 text-xs text-muted">
            ${intentInterval === "year" ? PLAN_MAP[intent].annual * 12 : PLAN_MAP[intent].monthly}{" "}
            billed {intentInterval === "year" ? "yearly" : "monthly"}. Cancel anytime.
          </p>
          <div className="mt-3">{upgradeButton(intent, "primary")}</div>
        </div>
      )}

      {hasCustomer && (
        <button
          onClick={() => request("portal", "/api/billing/portal")}
          disabled={loading !== null}
          className="btn-secondary w-full justify-center disabled:opacity-60"
        >
          {loading === "portal" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          Manage billing
        </button>
      )}

      {!hasCustomer && (
        <div className="space-y-3">
          {(["pro", "team"] as const)
            .filter((plan) => plan !== intent)
            .map((plan) =>
              upgradeButton(plan, plan === "pro" && !intent ? "primary" : "secondary")
            )}
        </div>
      )}
    </div>
  );
}
