export type Role = "viewer" | "analyst" | "manager" | "admin";

const ROLE_RANK: Record<string, number> = {
  viewer: 0,
  analyst: 1,
  manager: 2,
  admin: 3,
};

export function hasMinRole(role: string | undefined, min: Role): boolean {
  const userRank = ROLE_RANK[role?.toLowerCase() ?? "viewer"] ?? 0;
  const minRank = ROLE_RANK[min] ?? 0;
  return userRank >= minRank;
}

/** Minimum role to read a dashboard page (matches backend GET guards). */
export const PAGE_MIN_ROLE: Record<string, Role> = {
  "/dashboard/alerts": "manager",
  "/dashboard/team": "manager",
  "/dashboard/audit-logs": "admin",
  "/dashboard/webhooks": "admin",
  "/dashboard/plan": "manager",
  "/dashboard/connections": "manager",
  "/dashboard/schema-mappings": "manager",
  "/dashboard/playground": "manager",
  "/dashboard/api-keys": "manager",
};

export function canAccessPage(role: string | undefined, href: string): boolean {
  const min = PAGE_MIN_ROLE[href];
  if (!min) return true;
  return hasMinRole(role, min);
}
