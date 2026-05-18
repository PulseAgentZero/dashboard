import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useDashboardOverview() {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardApi.overview,
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}
