import { NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { prisma } from "@/lib/prisma";
import { planForProductId } from "@/lib/polar";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("webhook-signature");
    const webhookId = req.headers.get("webhook-id");
    const webhookTimestamp = req.headers.get("webhook-timestamp");

    if (!signature || !webhookId || !webhookTimestamp) {
      return NextResponse.json({ error: "Missing required headers" }, { status: 400 });
    }

    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
    }

    const headers = {
      "webhook-id": webhookId,
      "webhook-timestamp": webhookTimestamp,
      "webhook-signature": signature,
    };

    let event;
    try {
      event = validateEvent(body, headers, secret);
    } catch (err) {
      console.error("[webhooks:polar] Verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Idempotency Check using WebhookEvent model
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { polarId: webhookId },
    });

    if (existingEvent?.processed) {
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    if (!existingEvent) {
      await prisma.webhookEvent.create({
        data: {
          polarId: webhookId,
          type: event.type,
          processed: false,
        },
      });
    }

    await processWebhookEvent(event);

    await prisma.webhookEvent.update({
      where: { polarId: webhookId },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("[webhooks:polar] Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processWebhookEvent(event: any) {
  const { type, data } = event;

  if (type.startsWith("subscription.")) {
    const subscription = data;
    const userId = subscription.metadata?.userId || subscription.customer?.metadata?.userId;
    
    if (!userId) {
      console.warn(`[webhooks:polar] No userId in metadata for subscription ${subscription.id}`);
      return;
    }

    const productId = subscription.product_id;
    const planInfo = planForProductId(productId);
    const plan = planInfo?.plan || "free";
    const interval = planInfo?.interval || subscription.recurring_interval;

    await prisma.user.update({
      where: { id: userId },
      data: {
        polarSubscriptionId: subscription.id,
        polarCustomerId: subscription.customer_id,
        polarProductId: productId,
        plan,
        billingInterval: interval,
        planStatus: subscription.status,
        currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start) : null,
        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      },
    });
  }

  if (type === "order.created") {
    const order = data;
    const userId = order.metadata?.userId || order.customer?.metadata?.userId;

    if (!userId) {
      console.warn(`[webhooks:polar] No userId in metadata for order ${order.id}`);
      return;
    }

    const productId = order.product_id;
    const planInfo = planForProductId(productId);

    await prisma.payment.upsert({
      where: { polarId: order.id },
      create: {
        polarId: order.id,
        userId: userId,
        polarCustomerId: order.customer_id,
        polarSubscriptionId: order.subscription_id,
        polarProductId: productId,
        amount: order.amount,
        currency: order.currency,
        status: "succeeded",
        plan: planInfo?.plan,
        billingInterval: planInfo?.interval,
      },
      update: {
        status: "succeeded",
        amount: order.amount,
        currency: order.currency,
      },
    });
  }
}
