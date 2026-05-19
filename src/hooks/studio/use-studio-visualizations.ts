import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studioApi } from "@/lib/api/studio-api";
import type { ChartType, VisualizationConfig } from "@/types/studio";

export function useVisualizations(queryId: string | undefined) {
  return useQuery({
    queryKey: ["studio", "visualizations", queryId],
    queryFn: () => studioApi.listVisualizations(queryId!),
    enabled: !!queryId,
  });
}

export function useCreateVisualization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      queryId,
      body,
    }: {
      queryId: string;
      body: {
        name: string;
        chart_type: ChartType;
        config?: VisualizationConfig;
        column_formats?: Record<string, unknown>;
      };
    }) => studioApi.createVisualization(queryId, body),
    onSuccess: (_d, { queryId }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", queryId] });
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", "org"] });
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", "by-ids"] });
      toast.success("Visualization created");
    },
    onError: () => toast.error("Failed to create visualization"),
  });
}

export function useUpdateVisualization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      queryId,
      vizId,
      body,
    }: {
      queryId: string;
      vizId: string;
      body: Parameters<typeof studioApi.updateVisualization>[2];
    }) => studioApi.updateVisualization(queryId, vizId, body),
    onSuccess: (_d, { queryId }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", queryId] });
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", "org"] });
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", "by-ids"] });
      toast.success("Visualization updated");
    },
    onError: () => toast.error("Failed to update visualization"),
  });
}

export function useDeleteVisualization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ queryId, vizId }: { queryId: string; vizId: string }) =>
      studioApi.deleteVisualization(queryId, vizId),
    onSuccess: (_d, { queryId }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", queryId] });
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", "org"] });
      void qc.invalidateQueries({ queryKey: ["studio", "visualizations", "by-ids"] });
      toast.success("Visualization deleted");
    },
    onError: () => toast.error("Failed to delete visualization"),
  });
}
