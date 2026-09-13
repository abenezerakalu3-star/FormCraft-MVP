import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { getBaseUrl, getGoogleAuthUrl, GOOGLE_STATE_COOKIE, isGoogleConfigured } from "@/lib/google-oauth";

export async function GET(req: Request) {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", getBaseUrl(req))
    );
  }

  const state = randomBytes(32).toString("hex");
  const store = await cookies();
  store.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
  return NextResponse.redirect(getGoogleAuthUrl(state, redirectUri));
}