"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { PLANS, type BillingInterval, type PlanDefinition } from "@/lib/plans";

function SubscribeButton({
  tier,
  interval,
  isAuthenticated,
}: {
  tier: PlanDefinition;
  interval: BillingInterval;
  isAuthenticated: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const className = `mt-6 w-full justify-center ${tier.highlight ? "btn-primary" : "btn-secondary"}`;

  if (tier.key === "free" || !isAuthenticated) {
    const href =
      tier.key === "free"
        ? isAuthenticated
          ? "/dashboard"
          : "/register"
        : `/register?plan=${tier.key}&interval=${interval}`;
    return (
      <Link href={href} className={className}>
        {tier.cta}
      </Link>
    );
  }

  async function subscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier.key, interval }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 401) {
        router.push(`/register?plan=${tier.key}&interval=${interval}`);
        return;
      }
      if (!res.ok || !data?.url) {
        alert(data?.error || "Could not start checkout. Please try again.");
        return;
      }
      window.location.assign(data.url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={subscribe} disabled={loading} className={`${className} disabled:opacity-60`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {tier.cta}
    </button>
  );
}

export default function PricingTiers({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [annual, setAnnual] = useState(true);
  const interval: BillingInterval = annual ? "year" : "month";

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-sm">
          {([
            ["monthly", "Monthly"],
            ["annual", "Annual"],
          ] as const).map(([key, label]) => {
            const active = (key === "annual") === annual;
            return (
              <button
                key={key}
                onClick={() => setAnnual(key === "annual")}
                aria-pressed={active}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-foreground text-surface dark:text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Save 20% with annual billing
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3">
        {PLANS.map((tier) => {
          const price = annual ? tier.annual : tier.monthly;
          const yearly = tier.annual * 12;
          return (
            <div
              key={tier.key}
              className={`card relative flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tier.highlight ? "border-indigo-500/60 shadow-lg shadow-indigo-900/5 lg:-mt-3" : ""
              }`}
            >
              {tier.highlight && (
                <span className="chip absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}

              <h2 className="text-lg font-bold tracking-tight">{tier.name}</h2>
              <p className="mt-1.5 min-h-[2.5rem] text-sm leading-relaxed text-muted">{tier.tagline}</p>

              <div className="mt-5 flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-tight">${price}</span>
                <span className="pb-1 text-sm text-muted">/ month</span>
              </div>
              <p className="mt-1 h-4 text-xs text-muted">
                {tier.monthly > 0 && annual ? `Billed $${yearly} yearly` : "\u00A0"}
              </p>

              <SubscribeButton tier={tier} interval={interval} isAuthenticated={isAuthenticated} />

              <ul className="mt-7 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
