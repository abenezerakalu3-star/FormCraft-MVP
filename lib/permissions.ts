export const PERMISSIONS = [
  "users",
  "forms",
  "blog",
  "messages",
  "settings",
  "admins",
  "billing",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  users: "Manage users",
  forms: "Manage forms",
  blog: "Manage blog",
  messages: "Manage messages",
  settings: "Change site settings",
  admins: "Manage admins",
  billing: "Manage billing",
};

export type PermissionJson = unknown;

export function resolvePermissions(raw: PermissionJson | null | undefined): Permission[] {
  if (!Array.isArray(raw) || raw.length === 0) return [...PERMISSIONS];
  if (raw.includes("all")) return [...PERMISSIONS];
  return PERMISSIONS.filter((p) => raw.includes(p));
}

export function hasPermission(
  user: { role: string; permissions: PermissionJson },
  ...perms: Permission[]
) {
  if (user.role !== "admin") return false;
  const owned = resolvePermissions(user.permissions);
  return perms.every((p) => owned.includes(p));
}