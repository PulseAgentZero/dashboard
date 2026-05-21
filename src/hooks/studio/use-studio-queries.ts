import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { toastPlanError } from "@/lib/plan-errors";
import { studioApi, type ListQueriesParams } from "@/lib/api/studio-api";
import type { QueryParamDefinition } from "@/types/studio";

export function useStudioQueries(params: ListQueriesParams = {}) {
  return useQuery({
    queryKey: ["studio", "queries", params],
    queryFn: () => studioApi.listQueries(params),
    staleTime: 30_000,
  });
}

export function useStudioQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["studio", "query", id],
    queryFn: () => studioApi.getQuery(id!),
    enabled: !!id,
  });
}

export function useExecuteQuery() {
  return useMutation({
    mutationFn: studioApi.executeQuery,
    onError: (e) => {
      if (e instanceof ApiError && e.code === "RATE_LIMITED") {
        toastPlanError(e, "Daily query limit reached. Upgrade your plan.");
      } else if (e instanceof ApiError && e.code === "PLAN_LIMIT_REACHED") {
        toastPlanError(e, "Query limit reached. Upgrade your plan.");
      } else if (e instanceof ApiError) {
        toast.error(e.message);
      } else {
        toast.error("Query execution failed");
      }
    },
  });
}

export function useCreateQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studioApi.createQuery,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "queries"] });
      toast.success("Query saved");
    },
    onError: (e: Error) => {
      if (e instanceof ApiError) toast.error(e.message);
      else toast.error("Failed to save query");
    },
  });
}

export function useUpdateQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof studioApi.updateQuery>[1] }) =>
      studioApi.updateQuery(id, body),
    onSuccess: (_d, { id }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "queries"] });
      void qc.invalidateQueries({ queryKey: ["studio", "query", id] });
      toast.success("Query updated");
    },
    onError: () => toast.error("Failed to update query"),
  });
}

export function useDeleteQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studioApi.deleteQuery,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "queries"] });
      toast.success("Query deleted");
    },
    onError: () => toast.error("Failed to delete query"),
  });
}

export function useGenerateSQL() {
  return useMutation({
    mutationFn: studioApi.generateSQL,
    onError: () => toast.error("Failed to generate SQL"),
  });
}

export function useExplainQuery() {
  return useMutation({
    mutationFn: studioApi.explainQuery,
    onError: () => toast.error("Failed to explain query"),
  });
}

export function useRecommendViz() {
  return useMutation({
    mutationFn: studioApi.recommendViz,
    onError: () => toast.error("Failed to recommend visualization"),
  });
}

export function useRunQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body?: { param_values?: Record<string, unknown>; page?: number; page_size?: number };
    }) => studioApi.runQuery(id, body),
    onSuccess: (_d, { id }) => {
      void qc.invalidateQueries({ queryKey: ["studio", "query-runs", id] });
    },
    onError: (e: Error) => {
      if (e instanceof ApiError && e.code === "RATE_LIMITED") {
        toast.error("Daily query limit reached.");
      } else {
        toast.error("Failed to start query run");
      }
    },
  });
}

export function useQueryRuns(queryId: string | undefined) {
  return useQuery({
    queryKey: ["studio", "query-runs", queryId],
    queryFn: () => studioApi.listQueryRuns(queryId!),
    enabled: !!queryId,
    staleTime: 10_000,
  });
}

export function useStarQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, starred }: { id: string; starred: boolean }) =>
      starred ? studioApi.unstarQuery(id) : studioApi.starQuery(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studio", "queries"] });
    },
  });
}

export type SaveQueryPayload = {
  name: string;
  description?: string | null;
  sql_text: string;
  connection_id?: string | null;
  params?: QueryParamDefinition[];
  tags?: string[];
  refresh_cron?: string | null;
  refresh_enabled?: boolean;
};
