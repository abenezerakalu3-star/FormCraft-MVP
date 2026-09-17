export type PlanKey = "free" | "pro" | "team";
export type BillingInterval = "month" | "year";

export const UNLIMITED = -1;

export interface PlanLimits {
  /** Maximum number of forms. `UNLIMITED` (-1) means no limit. */
  forms: number;
  /** Responses allowed per calendar month, across all of the owner's forms. */
  responsesPerMonth: number;
  /** Can export responses to CSV/Excel/PDF. */
  exports: boolean;
  /** Access to the advanced analytics overview. */
  advancedAnalytics: boolean;
  /** Formitect branding can be removed from public forms. */
  removeBranding: boolean;
  /** Team members, shared workspaces and roles. */
  team: boolean;
}

export interface PlanDefinition {
  key: PlanKey;
  name: string;
  tagline: string;
  /** Price in USD per month when billed monthly. */
  monthly: number;
  /** Price in USD per month when billed annually (billed as `annual * 12`). */
  annual: number;
  cta: string;
  highlight?: boolean;
  features: string[];
  limits: PlanLimits;
}

export const PLANS: PlanDefinition[] = [
  {
    key: "free",
    name: "Free",
    tagline: "For getting your first form out the door.",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    features: [
      "Up to 3 forms",
      "100 responses / month",
      "All core field types",
      "Basic analytics",
      "Email notifications",
      "Formitect branding",
    ],
    limits: {
      forms: 3,
      responsesPerMonth: 100,
      exports: false,
      advancedAnalytics: false,
      removeBranding: false,
      team: false,
    },
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "For creators and small teams collecting at scale.",
    monthly: 19,
    annual: 15,
    cta: "Get Pro",
    highlight: true,
    features: [
      "Unlimited forms",
      "10,000 responses / month",
      "File uploads & exports (CSV, Excel, PDF)",
      "Advanced analytics",
      "Remove Formitect branding",
      "Priority email support",
    ],
    limits: {
      forms: UNLIMITED,
      responsesPerMonth: 10000,
      exports: true,
      advancedAnalytics: true,
      removeBranding: true,
      team: false,
    },
  },
  {
    key: "team",
    name: "Team",
    tagline: "For organizations that need collaboration and control.",
    monthly: 49,
    annual: 39,
    cta: "Get Team",
    features: [
      "Everything in Pro",
      "Unlimited responses",
      "Team members & shared workspace",
      "Roles & permissions",
      "Audit log",
      "Dedicated support",
    ],
    limits: {
      forms: UNLIMITED,
      responsesPerMonth: UNLIMITED,
      exports: true,
      advancedAnalytics: true,
      removeBranding: true,
      team: true,
    },
  },
];

export const PLAN_MAP: Record<PlanKey, PlanDefinition> = PLANS.reduce(
  (acc, plan) => ({ ...acc, [plan.key]: plan }),
  {} as Record<PlanKey, PlanDefinition>
);

export function isPlanKey(value: unknown): value is PlanKey {
  return value === "free" || value === "pro" || value === "team";
}

export function limitsFor(plan: PlanKey | string | null | undefined): PlanLimits {
  return (isPlanKey(plan) ? PLAN_MAP[plan] : PLAN_MAP.free).limits;
}

export function planName(plan: PlanKey | string | null | undefined): string {
  return (isPlanKey(plan) ? PLAN_MAP[plan] : PLAN_MAP.free).name;
}
