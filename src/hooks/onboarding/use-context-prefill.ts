"use client";

import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/api/onboarding";

export function useContextPrefill() {
  return useQuery({
    queryKey: ["onboarding-context-prefill"],
    queryFn: onboardingApi.getContext,
    staleTime: 0,
  });
}
