import { useQuery } from "@tanstack/react-query";
import { usageApi } from "@/lib/api/usage-api";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useUsage() {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["usage"],
    queryFn: usageApi.get,
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}
