import { api } from "./client";

export type PipelineRun = {
  id: string;
  status: "pending" | "running" | "success" | "failed";
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
  entities_processed: number | null;
  error_message: string | null;
  triggered_by: string | null;
  created_at: string;
};

export type PipelineSchedule = {
  enabled: boolean;
  cron: string | null;
  interval_hours: number | null;
  next_run_at: string | null;
};

export const pipelineApi = {
  listRuns: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return api.get<PipelineRun[]>(`/pipeline/runs${q ? `?${q}` : ""}`);
  },

  trigger: () => api.post<PipelineRun>("/pipeline/trigger", {}),

  getSchedule: () => api.get<PipelineSchedule>("/pipeline/schedule"),

  updateSchedule: (body: { enabled: boolean; cron?: string | null; interval_hours?: number | null }) =>
    api.put<PipelineSchedule>("/pipeline/schedule", body),
};
