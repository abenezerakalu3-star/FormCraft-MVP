"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

interface Tier {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  cta: string;
  href: string;
  highlight?: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Free",
    tagline: "For getting your first form out the door.",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    href: "/register",
    features: [
      "Up to 3 forms",
      "100 responses / month",
      "All core field types",
      "Basic analytics",
      "Email notifications",
      "Formitect branding",
    ],
  },
  {
    name: "Pro",
    tagline: "For creators and small teams collecting at scale.",
    monthly: 19,
    annual: 15,
    cta: "Get Pro",
    href: "/register",
    highlight: true,
    features: [
      "Unlimited forms",
      "10,000 responses / month",
      "File uploads & exports (CSV, Excel, PDF)",
      "Advanced analytics",
      "Remove Formitect branding",
      "Priority email support",
    ],
  },
  {
    name: "Team",
    tagline: "For organizations that need collaboration and control.",
    monthly: 49,
    annual: 39,
    cta: "Contact us",
    href: "/contact",
    features: [
      "Everything in Pro",
      "Unlimited responses",
      "Team members & shared workspace",
      "Roles & permissions",
      "Audit log",
      "Dedicated support",
    ],
  },
];

export default function PricingTiers() {
  const [annual, setAnnual] = useState(true);

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
        {TIERS.map((tier) => {
          const price = annual ? tier.annual : tier.monthly;
          const yearly = tier.annual * 12;
          return (
            <div
              key={tier.name}
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

              <Link
                href={tier.href}
                className={`mt-6 w-full justify-center ${tier.highlight ? "btn-primary" : "btn-secondary"}`}
              >
                {tier.cta}
              </Link>

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
