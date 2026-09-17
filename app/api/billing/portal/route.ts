import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPolar, isBillingConfigured } from "@/lib/polar";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to manage billing." }, { status: 401 });
  }

  if (!isBillingConfigured) {
    return NextResponse.json(
      { error: "Billing is not configured yet." },
      { status: 503 }
    );
  }

  if (!user.polarCustomerId) {
    return NextResponse.json(
      { error: "No billing account found." },
      { status: 400 }
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
    const session = await polar.customerSessions.create({
      customerId: user.polarCustomerId,
    });
    return NextResponse.json({ url: session.customerPortalUrl });
  } catch (err) {
    console.error("[billing] customer portal session failed", err);
    return NextResponse.json(
      { error: "Could not open the billing portal. Please try again." },
      { status: 502 }
    );
  }
}
