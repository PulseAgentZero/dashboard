import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { isCloudDeployment } from "@/lib/deployment";

const PLAN_ERROR_CODES = new Set(["PLAN_LIMIT_REACHED", "FEATURE_LOCKED"]);

export function isPlanError(error: unknown): error is ApiError {
  return error instanceof ApiError && PLAN_ERROR_CODES.has(error.code);
}

export function getPlanErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof ApiError && PLAN_ERROR_CODES.has(error.code)) {
    return error.message;
  }
  if (error instanceof ApiError && error.message) {
    return error.message;
  }
  return fallback;
}

export function getUpgradePath(): string {
  return isCloudDeployment() ? "/pricing" : "/pricing/self-hosted";
}

export function toastPlanError(
  error: unknown,
  fallback: string,
  options?: { actionLabel?: string; upgradePath?: string },
): void {
  const message = getPlanErrorMessage(error, fallback);
  const isPlan = isPlanError(error);

  if (isPlan) {
    const path = options?.upgradePath ?? getUpgradePath();
    const label = options?.actionLabel ?? (isCloudDeployment() ? "View plans" : "Get license");
    toast.error(message, {
      action: {
        label,
        onClick: () => {
          window.location.href = path;
        },
      },
    });
    return;
  }

  if (error instanceof ApiError && error.message) {
    toast.error(error.message);
    return;
  }

  toast.error(fallback);
}
