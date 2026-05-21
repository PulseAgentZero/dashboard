import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/lib/api/audit-api";

export function useAuditLogs(
  params?: { page?: number; limit?: number; action?: string },
  enabled = true,
) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditApi.list(params),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}
