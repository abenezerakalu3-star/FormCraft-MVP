import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPolar, isBillingConfigured, productIdFor, APP_URL } from "@/lib/polar";
import { isPlanKey, type BillingInterval } from "@/lib/plans";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to subscribe." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const plan = body?.plan;
  const interval: BillingInterval = body?.interval === "year" ? "year" : "month";

  if (!isPlanKey(plan) || plan === "free") {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  if (!isBillingConfigured) {
    return NextResponse.json(
      { error: "Billing is not configured yet." },
      { status: 503 }
    );
  }

  const productId = productIdFor(plan, interval);
  if (!productId) {
    return NextResponse.json(
      { error: "This plan is not available yet." },
      { status: 503 }
    );
  }

  const polar = getPolar();
  if (!polar) {
    return NextResponse.json(
      { error: "Billing is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${APP_URL}/dashboard/billing?checkout=success`,
      returnUrl: `${APP_URL}/pricing`,
      customerEmail: user.email,
      customerName: user.name ?? undefined,
      externalCustomerId: user.id,
      metadata: { userId: user.id, plan, interval },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("[billing] checkout creation failed", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 }
    );
  }
}
