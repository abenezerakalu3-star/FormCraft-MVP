import { prisma } from "./prisma";
import { intervalFromRecurring, planForProductId } from "./polar";

/** Minimal structural shape of a Polar subscription, avoiding deep SDK imports. */
export interface PolarSubscription {
  id: string;
  status: string;
  recurringInterval: string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  customerId: string;
  productId: string;
  metadata?: Record<string, unknown>;
}

/** Statuses that end the plan immediately. */
const ENDED_STATUSES = new Set(["revoked", "incomplete_expired"]);

export interface SubscriptionUpdate {
  plan: string;
  planStatus: string;
  polarCustomerId: string;
  polarSubscriptionId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  billingInterval: string | null;
}

function asDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function subscriptionFields(
  sub: PolarSubscription
): SubscriptionUpdate | null {
  const status = String(sub.status);
  const common = {
    polarCustomerId: sub.customerId,
    polarSubscriptionId: sub.id,
  };

  if (ENDED_STATUSES.has(status)) {
    return {
      ...common,
      plan: "free",
      planStatus: status,
      currentPeriodEnd: asDate(sub.currentPeriodEnd),
      cancelAtPeriodEnd: false,
      billingInterval: null,
    };
  }

  const mapped = planForProductId(sub.productId);
  if (!mapped) return null;

  return {
    ...common,
    plan: mapped.plan,
    planStatus: status,
    currentPeriodEnd: asDate(sub.currentPeriodEnd),
    cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
    billingInterval: intervalFromRecurring(sub.recurringInterval),
  };
}

/**
 * Applies a Polar subscription state to the matching user. Returns true when a
 * user row was updated.
 */
export async function syncSubscription(sub: PolarSubscription): Promise<boolean> {
  const userId =
    typeof sub.metadata?.userId === "string" ? sub.metadata.userId : undefined;

  let user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  if (!user) {
    user = await prisma.user.findFirst({
      where: { polarCustomerId: sub.customerId },
    });
  }
  if (!user) {
    console.warn(
      `[billing] no user found for subscription ${sub.id} (customer ${sub.customerId})`
    );
    return false;
  }

  const fields = subscriptionFields(sub);
  if (!fields) {
    console.warn(
      `[billing] subscription ${sub.id} references unknown product ${sub.productId}`
    );
    return false;
  }

  await prisma.user.update({ where: { id: user.id }, data: fields });
  return true;
}
