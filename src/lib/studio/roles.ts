const ROLE_RANK: Record<string, number> = {
  viewer: 0,
  analyst: 1,
  manager: 2,
  admin: 3,
};

function rank(role: string | undefined): number {
  return ROLE_RANK[role?.toLowerCase() ?? "viewer"] ?? 0;
}

export function hasMinRole(role: string | undefined, min: string): boolean {
  return rank(role) >= rank(min);
}

export function canCreateStudioContent(role: string | undefined): boolean {
  return hasMinRole(role, "analyst");
}

export function canRefreshSchema(role: string | undefined): boolean {
  return hasMinRole(role, "analyst");
}

export function canManageEmbed(role: string | undefined): boolean {
  return hasMinRole(role, "manager");
}

export function canDeleteDashboard(role: string | undefined): boolean {
  return hasMinRole(role, "manager");
}

export function canEditQuery(
  role: string | undefined,
  createdBy: string | null | undefined,
  userId: string | undefined,
): boolean {
  if (!hasMinRole(role, "analyst")) return false;
  if (hasMinRole(role, "manager")) return true;
  return createdBy != null && userId != null && createdBy === userId;
}
