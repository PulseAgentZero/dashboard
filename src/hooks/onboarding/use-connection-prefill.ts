"use client";

import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/api/onboarding";

export function useConnectionPrefill() {
  return useQuery({
    queryKey: ["onboarding-connection-prefill"],
    queryFn: async () => {
      const list = await onboardingApi.getConnection();
      return list[0] ?? null;
    },
    staleTime: 0,
  });
}
