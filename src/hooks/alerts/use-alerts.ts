import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { alertsApi } from "@/lib/api/alerts-api";
import { toastPlanError } from "@/lib/plan-errors";
import type { AlertRule, AlertChannel } from "@/lib/api/alerts-api";

export function useAlertRules() {
  return useQuery({
    queryKey: ["alerts", "rules"],
    queryFn: alertsApi.listRules,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateAlertRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<AlertRule, "id" | "is_active" | "created_at">) =>
      alertsApi.createRule(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["alerts", "rules"] });
      toast.success("Alert rule created");
    },
    onError: () => toast.error("Failed to create rule"),
  });
}

export function useDeleteAlertRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.deleteRule(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["alerts", "rules"] });
      toast.success("Rule deleted");
    },
    onError: () => toast.error("Failed to delete rule"),
  });
}

export function useAlertChannels() {
  return useQuery({
    queryKey: ["alerts", "channels"],
    queryFn: alertsApi.listChannels,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateAlertChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; type: string; config?: Record<string, unknown> }) =>
      alertsApi.createChannel(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["alerts", "channels"] });
      void qc.invalidateQueries({ queryKey: ["usage"] });
      toast.success("Channel created");
    },
    onError: (e) => toastPlanError(e, "Failed to create channel", { upgradePath: "/dashboard/plan" }),
  });
}

export function useDeleteAlertChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.deleteChannel(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["alerts", "channels"] });
      void qc.invalidateQueries({ queryKey: ["usage"] });
      toast.success("Channel removed");
    },
    onError: () => toast.error("Failed to remove channel"),
  });
}

export function useTestAlertChannel() {
  return useMutation({
    mutationFn: (id: string) => alertsApi.testChannel(id),
    onSuccess: (data) => toast.success(data.message || "Test sent"),
    onError: () => toast.error("Channel test failed"),
  });
}

export function useAlertEvents(
  ruleId?: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["alerts", "events", ruleId, params],
    queryFn: () =>
      alertsApi.listEvents({
        rule_id: ruleId,
        page: params?.page,
        limit: params?.limit,
      }),
    staleTime: 30_000,
    retry: 1,
  });
}
