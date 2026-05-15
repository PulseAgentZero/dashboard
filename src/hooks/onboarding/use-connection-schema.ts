"use client";

import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/api/onboarding";

export function useConnectionSchema(enabled: boolean) {
  return useQuery({
    queryKey: ["onboarding-schema"],
    queryFn: onboardingApi.getSchema,
    enabled,
  });
}
