"use client";

import { useAuth } from "@/providers/auth-provider";
import { useUsage } from "@/hooks/usage/use-usage";
import { useLicense } from "@/hooks/webhooks/use-webhooks";
import {
  canAccessAuditLogs,
  getAuditLogUpgradeHref,
  getAuditLogUpgradeLabel,
} from "@/lib/feature-access";
import { isSelfHostedDeployment } from "@/lib/deployment";

export function useAuditLogAccess() {
  const { org } = useAuth();
  const { data: usage, isLoading: usageLoading } = useUsage();
  const selfHosted = isSelfHostedDeployment();
  const { data: license, isLoading: licenseLoading } = useLicense();

  const plan = usage?.plan ?? org?.plan ?? "free"; // usage.plan is effective_plan from API
  const loading = selfHosted ? licenseLoading : usageLoading;
  const hasAccess = canAccessAuditLogs(plan, license);

  return {
    hasAccess,
    loading,
    plan,
    selfHosted,
    upgradeHref: getAuditLogUpgradeHref(),
    upgradeLabel: getAuditLogUpgradeLabel(),
  };
}
