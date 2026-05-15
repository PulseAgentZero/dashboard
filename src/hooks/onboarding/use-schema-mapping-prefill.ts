"use client";

import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/api/onboarding";

export function useSchemaMappingPrefill() {
  return useQuery({
    queryKey: ["onboarding-schema-mapping-prefill"],
    queryFn: async () => {
      const list = await onboardingApi.getSchemaMapping();
      return list[0] ?? null;
    },
    staleTime: 0,
  });
}
