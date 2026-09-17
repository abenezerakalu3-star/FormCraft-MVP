import { UNLIMITED, isPlanKey, limitsFor, type PlanKey, type PlanLimits } from "./plans";

export interface SubscriptionFields {
  plan?: string | null;
  planStatus?: string | null;
  currentPeriodEnd?: Date | string | null;
}

/** Subscription statuses that keep the paid plan active (past_due gets a grace period). */
const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);
/** Statuses that end the plan immediately. */
const ENDED_STATUSES = new Set(["revoked", "incomplete_expired"]);

export function effectivePlan(user: SubscriptionFields): PlanKey {
  const plan = isPlanKey(user.plan) ? user.plan : "free";
  if (plan === "free") return "free";

  const status = user.planStatus ?? "";
  if (ENDED_STATUSES.has(status)) return "free";
  if (ACTIVE_STATUSES.has(status)) return plan;

  if (user.currentPeriodEnd) {
    const end = new Date(user.currentPeriodEnd).getTime();
    if (!Number.isNaN(end) && end > Date.now()) return plan;
  }

  return "free";
}

export function planLimitsFor(user: SubscriptionFields): PlanLimits {
  return limitsFor(effectivePlan(user));
}

export function isUnlimited(limit: number): boolean {
  return limit === UNLIMITED;
}

export function hasActiveSubscription(user: SubscriptionFields): boolean {
  return effectivePlan(user) !== "free";
}
