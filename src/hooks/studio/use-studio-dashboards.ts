import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { toastPlanError } from "@/lib/plan-errors";
import { studioApi, type ListDashboardsParams } from "@/lib/api/studio-api";
import type { DashboardLayoutItem, QueryParamDefinition } from "@/types/studio";

export function useStudioDashboards(params: ListDashboardsParams = {}) {
  return useQuery({
    queryKey: ["studio", "dashboards", params],
    queryFn: () => studioApi.listDashboards(params),
    staleTime: 30_000,
  });
}

export function useStudioDashboard(id: string | undefined) {
  return useQuery({
    queryKey: ["studio", "dashboard", id],
    queryFn: () => studioApi.getDashboard(id!),
    enabled: !!id,
  });
}

export function useCreateDashboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studioApi.createDashboard,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboards"] });
    },
    onError: (e) => toastPlanError(e, "Failed to create dashboard"),
  });
}

export function useUpdateDashboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof studioApi.updateDashboard>[1] }) =>
      studioApi.updateDashboard(id, body),
    onSuccess: (_d, { id }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboards"] });
      void qc.invalidateQueries({ queryKey: ["studio", "dashboard", id] });
    },
    onError: () => toast.error("Failed to update dashboard"),
  });
}

export function useDeleteDashboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studioApi.deleteDashboard,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboards"] });
      toast.success("Dashboard deleted");
    },
    onError: () => toast.error("Failed to delete dashboard"),
  });
}

export function useExecuteDashboard() {
  return useMutation({
    mutationFn: ({ id, param_values }: { id: string; param_values?: Record<string, unknown> }) =>
      studioApi.executeDashboard(id, param_values ?? {}),
    onError: (e: Error) => {
      if (e instanceof ApiError && e.code === "RATE_LIMITED") {
        toast.error("Daily execution limit reached.");
      } else if (e instanceof ApiError) {
        toast.error(e.message);
      }
    },
  });
}

export function useForkDashboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) => studioApi.forkDashboard(id, name),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboards"] });
      toast.success("Dashboard forked");
    },
    onError: () => toast.error("Failed to fork dashboard"),
  });
}

export function useStarDashboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, starred }: { id: string; starred: boolean }) =>
      starred ? studioApi.unstarDashboard(id) : studioApi.starDashboard(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboards"] });
    },
  });
}

export function useCreateEmbedToken() {
  return useMutation({
    mutationFn: ({ id, hours }: { id: string; hours?: number }) =>
      studioApi.createEmbedToken(id, hours),
    onError: () => toast.error("Failed to create embed token"),
  });
}

export function useAddDashboardItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      dashboardId,
      body,
    }: {
      dashboardId: string;
      body: Parameters<typeof studioApi.addDashboardItem>[1];
    }) => studioApi.addDashboardItem(dashboardId, body),
    onSuccess: (_d, { dashboardId }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboard", dashboardId] });
      toast.success("Panel added");
    },
    onError: () => toast.error("Failed to add panel"),
  });
}

export function useDeleteDashboardItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dashboardId, itemId }: { dashboardId: string; itemId: string }) =>
      studioApi.deleteDashboardItem(dashboardId, itemId),
    onSuccess: (_d, { dashboardId }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "dashboard", dashboardId] });
      toast.success("Panel removed");
    },
    onError: () => toast.error("Failed to remove panel"),
  });
}

export type UpdateDashboardPayload = {
  name?: string;
  description?: string | null;
  is_public?: boolean;
  layout?: DashboardLayoutItem[];
  dashboard_params?: QueryParamDefinition[];
  tags?: string[];
};
