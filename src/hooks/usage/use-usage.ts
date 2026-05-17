import { useQuery } from "@tanstack/react-query";
import { usageApi } from "@/lib/api/usage-api";

export function useUsage() {
  return useQuery({
    queryKey: ["usage"],
    queryFn: usageApi.get,
    staleTime: 60_000,
    retry: 1,
  });
}
