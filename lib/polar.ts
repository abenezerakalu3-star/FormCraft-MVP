import { Polar } from "@polar-sh/sdk";
import type { BillingInterval, PlanKey } from "./plans";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const server = process.env.POLAR_SERVER === "production" ? "production" : "sandbox";

export const isBillingConfigured = Boolean(accessToken);

let client: Polar | null = null;

export function getPolar(): Polar | null {
  if (!accessToken) return null;
  if (!client) client = new Polar({ accessToken, server });
  return client;
}

const PRODUCT_ENV: Record<
  Exclude<PlanKey, "free">,
  Record<BillingInterval, string | undefined>
> = {
  pro: {
    month: process.env.POLAR_PRODUCT_PRO_MONTHLY,
    year: process.env.POLAR_PRODUCT_PRO_ANNUAL,
  },
  team: {
    month: process.env.POLAR_PRODUCT_TEAM_MONTHLY,
    year: process.env.POLAR_PRODUCT_TEAM_ANNUAL,
  },
};

export function productIdFor(
  plan: PlanKey,
  interval: BillingInterval
): string | undefined {
  if (plan === "free") return undefined;
  return PRODUCT_ENV[plan]?.[interval];
}

export function planForProductId(
  productId: string | null | undefined
): { plan: PlanKey; interval: BillingInterval } | null {
  if (!productId) return null;
  for (const plan of ["pro", "team"] as const) {
    for (const interval of ["month", "year"] as const) {
      if (PRODUCT_ENV[plan][interval] === productId) return { plan, interval };
    }
  }
  return null;
}

export function intervalFromRecurring(
  recurring: string | null | undefined
): BillingInterval {
  return recurring === "year" ? "year" : "month";
}

export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
).replace(/\/$/, "");
