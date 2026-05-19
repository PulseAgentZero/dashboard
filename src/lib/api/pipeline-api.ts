import { api } from "./client";

export type PipelineRunStatus = "pending" | "running" | "success" | "failed";

export type PipelineRun = {
  id: string;
  status: PipelineRunStatus;
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
  entities_processed: number | null;
  error_message: string | null;
  trigger_source: string | null;
  current_step: string | null;
  triggered_by: string | null;
  created_at: string;
};

export type PipelineSchedule = {
  enabled: boolean;
  cron: string | null;
  timezone: string;
  next_run_at: string | null;
  last_run_at: string | null;
};

type ApiPipelineRun = {
  id: string;
  status: string;
  trigger_source?: string | null;
  triggered_by?: string | null;
  current_step?: string | null;
  error?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  duration_ms?: number | null;
  entities_scored?: number | null;
  created_at: string;
};

type ApiPipelineSchedule = {
  id: string;
  cron_expression: string;
  timezone: string;
  is_active: boolean;
  next_run_at: string | null;
  last_run_at: string | null;
  mapping_id: string | null;
};

const STATUS_MAP: Record<string, PipelineRunStatus> = {
  succeeded: "success",
  success: "success",
  failed: "failed",
  running: "running",
  queued: "pending",
  pending: "pending",
  cancelled: "failed",
};

export function normalizePipelineRun(raw: ApiPipelineRun): PipelineRun {
  let duration_seconds: number | null = null;
  if (raw.duration_ms != null) {
    duration_seconds = Math.round(raw.duration_ms / 1000);
  } else if (raw.started_at && raw.completed_at) {
    const ms =
      new Date(raw.completed_at).getTime() - new Date(raw.started_at).getTime();
    if (ms >= 0) duration_seconds = Math.round(ms / 1000);
  }

  return {
    id: raw.id,
    status: STATUS_MAP[raw.status] ?? "pending",
    started_at: raw.started_at ?? null,
    completed_at: raw.completed_at ?? null,
    duration_seconds,
    entities_processed: raw.entities_scored ?? null,
    error_message: raw.error ?? null,
    trigger_source: raw.trigger_source ?? null,
    current_step: raw.current_step ?? null,
    triggered_by: raw.triggered_by ?? null,
    created_at: raw.created_at,
  };
}

function normalizeSchedule(raw: ApiPipelineSchedule | null): PipelineSchedule | null {
  if (!raw) return null;
  return {
    enabled: raw.is_active,
    cron: raw.cron_expression,
    timezone: raw.timezone,
    next_run_at: raw.next_run_at,
    last_run_at: raw.last_run_at,
  };
}

function extractRuns(payload: unknown): ApiPipelineRun[] {
  if (Array.isArray(payload)) return payload as ApiPipelineRun[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["runs", "data", "items"]) {
      const v = obj[key];
      if (Array.isArray(v)) return v as ApiPipelineRun[];
    }
  }
  return [];
}

export const pipelineApi = {
  listRuns: async (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    const raw = await api.get<unknown>(`/pipeline/runs${q ? `?${q}` : ""}`);
    return extractRuns(raw).map(normalizePipelineRun);
  },

  trigger: async () => {
    const raw = await api.post<{ run_id: string; status?: string }>(
      "/pipeline/trigger",
      {},
    );
    return normalizePipelineRun({
      id: raw.run_id,
      status: raw.status ?? "queued",
      created_at: new Date().toISOString(),
    });
  },

  getSchedule: async () => {
    const raw = await api.get<ApiPipelineSchedule | null>("/pipeline/schedule");
    return normalizeSchedule(raw);
  },

  updateSchedule: async (body: {
    enabled: boolean;
    cron?: string | null;
    timezone?: string;
  }) => {
    const raw = await api.put<ApiPipelineSchedule>("/pipeline/schedule", {
      cron_expression: body.cron ?? "0 */6 * * *",
      is_active: body.enabled,
      timezone: body.timezone ?? "UTC",
    });
    return normalizeSchedule(raw)!;
  },
};
