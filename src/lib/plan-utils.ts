/**
 * Plan tier helpers — keep in sync with api/app/api/dependencies/plan_gate.py
 */

export type PlanTier = "free" | "growth" | "pro" | "enterprise";

export function normalizePlan(plan?: string | null): PlanTier {
  const p = (plan ?? "free").toLowerCase();
  if (p === "growth" || p === "pro" || p === "enterprise") return p;
  return "free";
}

/** Paid cloud tiers (growth or pro). */
export function isPaidPlan(plan?: string | null): boolean {
  const p = normalizePlan(plan);
  return p === "growth" || p === "pro" || p === "enterprise";
}

/** Pro or enterprise — unlimited quotas and audit log on cloud. */
export function isProPlan(plan?: string | null): boolean {
  const p = normalizePlan(plan);
  return p === "pro" || p === "enterprise";
}

/** Unlimited usage quotas (pro+ on cloud; self-hosted license). */
export function isUnlimitedPlan(plan?: string | null): boolean {
  return isProPlan(plan);
}

export function planDisplayName(plan?: string | null): string {
  const p = normalizePlan(plan);
  if (p === "enterprise") return "Enterprise";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

/** Prefer API effective_plan when subscription is in grace / downgrade state. */
export function resolveEffectivePlan(
  usagePlan?: string | null,
  orgPlan?: string | null,
  subscription?: { effective_plan?: string; plan?: string } | null,
): PlanTier {
  return normalizePlan(
    subscription?.effective_plan ??
      usagePlan ??
      subscription?.plan ??
      orgPlan ??
      "free",
  );
}
