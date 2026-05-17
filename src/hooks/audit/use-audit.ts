import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/lib/api/audit-api";

export function useAuditLogs(params?: { page?: number; limit?: number; action?: string }) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditApi.list({ limit: 50, ...params }),
    staleTime: 30_000,
    retry: 1,
  });
}
