"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export function useAuthInstance() {
  return useQuery({
    queryKey: ["auth", "instance"],
    queryFn: () => authApi.instance(),
    staleTime: 60_000,
  });
}
