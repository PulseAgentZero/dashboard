"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { tokens } from "@/lib/auth-tokens";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    enabled:
      typeof window !== "undefined" && !!tokens.getAccess(),
    staleTime: 5 * 60 * 1000,
  });
}
