import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";
import { isProPlan, normalizePlan } from "@/lib/plan-utils";
import type { LicenseInfo } from "@/lib/api/webhooks-api";

/** Matches api/app/api/dependencies/plan_gate.py `_CLOUD_FEATURE_PLAN`. */
export const AUDIT_LOG_FEATURE = "audit_log";

export { isProPlan, isPaidPlan, isUnlimitedPlan, normalizePlan, planDisplayName, resolveEffectivePlan } from "@/lib/plan-utils";

/** Cloud: Pro plan required to read audit logs. */
export function canAccessAuditLogsCloud(plan: string | null | undefined): boolean {
  return isProPlan(plan);
}

/**
 * Self-hosted: valid license with Pro-equivalent plan or explicit audit_log feature.
 * Aligns with `require_feature(..., "audit_log")` on the API.
 */
export function canAccessAuditLogsSelfHosted(
  license: LicenseInfo | null | undefined,
): boolean {
  if (!license?.is_valid || license.locked) return false;
  const plan = normalizePlan(license.effective_plan ?? license.plan);
  if (isProPlan(plan)) return true;
  const features = (license.effective_features ?? license.features ?? []).map((f) =>
    f.toLowerCase(),
  );
  return features.includes(AUDIT_LOG_FEATURE);
}

export function canAccessAuditLogs(
  plan: string | null | undefined,
  license: LicenseInfo | null | undefined,
): boolean {
  if (isSelfHostedDeployment()) {
    return canAccessAuditLogsSelfHosted(license);
  }
  if (isCloudDeployment()) {
    return canAccessAuditLogsCloud(plan);
  }
  return canAccessAuditLogsCloud(plan);
}

export function getAuditLogUpgradeHref(): string {
  if (isSelfHostedDeployment()) {
    return "/dashboard/settings";
  }
  return "/dashboard/plan";
}

export function getAuditLogUpgradeLabel(): string {
  return isSelfHostedDeployment() ? "Activate license" : "Upgrade to Pro";
}
