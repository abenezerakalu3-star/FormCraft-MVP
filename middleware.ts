import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

export async function middleware(req: NextRequest) {
  const { blocked, retryAfterSec } = await applyRateLimit(req);
  if (blocked) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "warn",
        msg: "security.rate_limited",
        path: req.nextUrl.pathname,
        ip,
      })
    );
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec ?? 60),
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/login",
    "/api/auth/register",
    "/api/submissions",
    "/api/contact",
    "/api/upload",
    "/api/auth/forgot-password",
    "/api/auth/reset-password/:path*",
    "/api/auth/verify-email/:path*",
    "/api/auth/resend-verification",
  ],
};