import { NextRequest } from "next/server";

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export const DEFAULT_RULES: Record<string, RateLimitRule> = {
  auth: { limit: 10, windowMs: 60_000 },
  submissions: { limit: 30, windowMs: 60_000 },
  contact: { limit: 5, windowMs: 60_000 },
  upload: { limit: 20, windowMs: 60_000 },
  passwordReset: { limit: 5, windowMs: 60_000 },
  verifyEmail: { limit: 5, windowMs: 60_000 },
};

export async function getClientIp(req: NextRequest): Promise<string> {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export class MemoryRateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  check(key: string, rule: RateLimitRule): { allowed: boolean; retryAfterSec: number } {
    const now = Date.now();
    let entry = this.store.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + rule.windowMs };
      this.store.set(key, entry);
    }
    entry.count += 1;
    const allowed = entry.count <= rule.limit;
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed, retryAfterSec };
  }

  // Cleanup old entries to prevent unbounded memory growth.
  prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (entry.resetAt <= now) this.store.delete(key);
    }
  }
}

export const rateLimiter = new MemoryRateLimiter();

export function resolveRule(group: string): RateLimitRule | null {
  const limitStr = getEnv(`RATE_LIMIT_${group.toUpperCase()}_LIMIT`);
  const windowStr = getEnv(`RATE_LIMIT_${group.toUpperCase()}_WINDOW_MS`);
  const base = DEFAULT_RULES[group];
  if (!base) return null;
  return {
    limit: limitStr ? Number.parseInt(limitStr, 10) || base.limit : base.limit,
    windowMs: windowStr ? Number.parseInt(windowStr, 10) || base.windowMs : base.windowMs,
  };
}

function getEnv(name: string): string | undefined {
  const all = process.env as Record<string, string | undefined>;
  return all[name];
}

export function routeGroup(pathname: string): string | null {
  if (pathname === "/api/auth/login" || pathname === "/api/auth/register") return "auth";
  if (pathname === "/api/submissions") return "submissions";
  if (pathname === "/api/contact") return "contact";
  if (pathname === "/api/upload") return "upload";
  if (pathname.startsWith("/api/auth/reset-password")) return "passwordReset";
  if (pathname === "/api/auth/forgot-password") return "passwordReset";
  if (pathname.startsWith("/api/auth/verify-email")) return "verifyEmail";
  if (pathname === "/api/auth/resend-verification") return "verifyEmail";
  return null;
}

/** Run rate limiting for middleware; returns a 429 response if blocked. */
export async function applyRateLimit(
  req: NextRequest
): Promise<{ blocked: boolean; retryAfterSec?: number }> {
  const group = routeGroup(req.nextUrl.pathname);
  if (!group) return { blocked: false };

  const rule = resolveRule(group);
  if (!rule) return { blocked: false };

  const ip = await getClientIp(req);
  const key = `rl:${group}:${req.nextUrl.pathname}:${ip}`;
  const { allowed, retryAfterSec } = rateLimiter.check(key, rule);
  if (!allowed) return { blocked: true, retryAfterSec };
  return { blocked: false };
}