import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { createSession } from "@/lib/auth";
import { exchangeGoogleCode, fetchGoogleUser, getBaseUrl, GOOGLE_STATE_COOKIE, isGoogleConfigured } from "@/lib/google-oauth";

function safeStateEquals(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = (path: string) => NextResponse.redirect(new URL(path, getBaseUrl(req)));

  if (url.searchParams.get("error")) {
    return target("/login?error=oauth_denied");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const store = await cookies();
  const storedState = store.get(GOOGLE_STATE_COOKIE)?.value;
  store.delete(GOOGLE_STATE_COOKIE);

  if (!code || !state || !storedState || !safeStateEquals(state, storedState)) {
    return target("/login?error=oauth_invalid_state");
  }

  if (!isGoogleConfigured()) {
    return target("/login?error=google_not_configured");
  }

  let userInfo;
  try {
    const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
    const tokens = await exchangeGoogleCode(code, redirectUri);
    userInfo = await fetchGoogleUser(tokens.access_token);
  } catch {
    return target("/login?error=oauth_failed");
  }

  if (!userInfo.email || userInfo.email_verified !== true) {
    return target("/login?error=oauth_email_unverified");
  }

  let user = await prisma.user.findUnique({ where: { email: userInfo.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name || userInfo.email.split("@")[0],
        password: await hashPassword(randomBytes(32).toString("hex")),
      },
    });
  }

  if (user.blocked) {
    return target("/login?error=oauth_blocked");
  }

  await createSession(user.id);
  return target(user.role === "admin" ? "/admin" : "/dashboard");
}