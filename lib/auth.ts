import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect, forbidden } from "next/navigation";
import { prisma } from "./prisma";
import { hasPermission, Permission, PermissionJson } from "./permissions";

export {
  PERMISSIONS,
  PERMISSION_LABELS,
  resolvePermissions,
  hasPermission,
} from "./permissions";
export type { Permission, PermissionJson };

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET;
  if (raw) return new TextEncoder().encode(raw);
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET environment variable is required in production. " +
      "Set a strong random string (at least 32 characters)."
    );
  }
  console.warn(
    "[Formitect] Using development-only SESSION_SECRET fallback. " +
    "Set SESSION_SECRET for production deployments."
  );
  return new TextEncoder().encode("dev-only-fallback-do-not-use-in-production");
}
const secret = getSecret;

export async function createSession(userId: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.blocked) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") forbidden();
  return user;
}

export async function requirePermission(...perms: Permission[]) {
  const user = await requireAdmin();
  if (!hasPermission(user, ...perms)) forbidden();
  return user;
}