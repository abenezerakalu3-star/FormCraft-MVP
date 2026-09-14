"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

type Billing = "monthly" | "annual";

interface Price {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const PLANS: Price[] = [
  {
    name: "Starter",
    price: 0,
    tagline: "For trying it out and small projects",
    features: ["Unlimited forms", "1,000 responses / month", "All 9 field types", "CSV export"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: 12,
    tagline: "For creators and small teams",
    features: [
      "Everything in Starter",
      "Unlimited responses",
      "Custom subdomain",
      "Team members",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
];

const DISCOUNT = 0.1;

function priceFor(price: number, billing: Billing) {
  if (price === 0) return "$0";
  if (billing === "monthly") return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
  const annual = price * (1 - DISCOUNT);
  return annual % 1 === 0 ? `$${annual}` : `$${annual.toFixed(2)}`;
}

function annualTotal(price: number) {
  const annual = price * 12 * (1 - DISCOUNT);
  return `$${annual % 1 === 0 ? annual : annual.toFixed(2)}`;
}

export default function PricingSection({ homeHref }: { homeHref: string }) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="pricing" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Simple, honest pricing</h2>
          <p className="mt-3 text-muted">Start free, upgrade when you grow.</p>

          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-line bg-canvas p-1">
            {(["monthly", "annual"] as Billing[]).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  billing === b
                    ? "bg-foreground text-surface shadow-sm dark:bg-foreground dark:text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      billing === "annual"
                        ? "bg-indigo-500 text-white"
                        : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    -10%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {PLANS.map((p, idx) => (
            <div
              key={p.name}
              className={`h-full animate-fade-up rounded-2xl border p-8 transition-all duration-200 ${
                p.highlight
                  ? "border-indigo-600 bg-foreground text-white shadow-2xl shadow-indigo-900/20 dark:bg-surface dark:text-foreground dark:border-indigo-500"
                  : "border-line bg-canvas"
              }`}
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <div className="text-right">
                  <p
                    key={`${p.name}-${billing}`}
                    className={`animate-scale-in text-3xl font-bold ${
                      p.highlight ? "dark:text-foreground" : ""
                    }`}
                  >
                    {priceFor(p.price, billing)}
                    <span
                      className={`ml-1 text-sm font-medium ${
                        p.highlight ? "text-gray-400 dark:text-muted" : "text-muted"
                      }`}
                    >
                      /mo
                    </span>
                  </p>
                  {billing === "annual" && p.price > 0 && (
                    <p
                      className={`animate-fade-in mt-0.5 text-xs font-semibold ${
                        p.highlight ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      Save 10% · {annualTotal(p.price)}/yr
                    </p>
                  )}
                  {p.price === 0 && (
                    <p
                      className={`mt-0.5 text-xs ${
                        p.highlight ? "text-gray-400 dark:text-muted" : "text-muted"
                      }`}
                    >
                      Free forever
                    </p>
                  )}
                </div>
              </div>
              <p
                className={`mt-1 text-sm ${
                  p.highlight ? "text-gray-400 dark:text-muted" : "text-muted"
                }`}
              >
                {p.tagline}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                        p.highlight ? "bg-indigo-500" : "bg-emerald-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span className={p.highlight ? "text-gray-200 dark:text-muted" : "text-foreground"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={homeHref}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                  p.highlight
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "border border-line bg-surface text-foreground hover:bg-gray-50 dark:hover:bg-gray-100/10"
                }`}
              >
                {billing === "annual" && p.price > 0 ? (
                  <>
                    <Sparkles className="h-4 w-4" /> {p.cta}
                  </>
                ) : (
                  p.cta
                )}{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}