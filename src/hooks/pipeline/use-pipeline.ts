import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pipelineApi } from "@/lib/api/pipeline-api";

export function usePipelineRuns(limit = 20) {
  return useQuery({
    queryKey: ["pipeline", "runs", limit],
    queryFn: () => pipelineApi.listRuns({ limit }),
    staleTime: 10_000,
    refetchInterval: (query) => {
      const runs = query.state.data;
      const active = runs?.some(
        (r) => r.status === "running" || r.status === "pending",
      );
      return active ? 3_000 : 15_000;
    },
    retry: 1,
  });
}

export function usePipelineSchedule() {
  return useQuery({
    queryKey: ["pipeline", "schedule"],
    queryFn: pipelineApi.getSchedule,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useTriggerPipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: pipelineApi.trigger,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipeline", "runs"] });
      toast.success("Pipeline run triggered");
    },
    onError: () => toast.error("Failed to trigger pipeline"),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: pipelineApi.updateSchedule,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pipeline", "schedule"] });
      toast.success("Schedule updated");
    },
    onError: () => toast.error("Failed to update schedule"),
  });
}
