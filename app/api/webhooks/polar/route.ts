import { NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { syncSubscription, type PolarSubscription } from "@/lib/billing-sync";

export async function POST(req: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 }
    );
  }

  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event;
  try {
    event = validateEvent(body, headers, secret);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
    }
    console.error("[billing] webhook validation error", err);
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    if (event.type.startsWith("subscription.")) {
      await syncSubscription(event.data as unknown as PolarSubscription);
    }
  } catch (err) {
    console.error("[billing] webhook handler error", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
