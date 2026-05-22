import { api } from "./client";

export type LogStreamDestination = "http" | "syslog" | "file";

export type LogStream = {
  id: string;
  name: string;
  destination_type: LogStreamDestination;
  is_active: boolean;
  min_level: string;
  event_categories: string[];
  config: Record<string, unknown>;
  last_success_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type LogStreamBody = {
  name: string;
  destination_type: LogStreamDestination;
  is_active?: boolean;
  min_level?: string;
  event_categories?: string[];
  config: Record<string, unknown>;
};

export const LOG_EVENT_CATEGORIES = [
  "api_request",
  "audit",
  "pipeline",
  "agent",
  "security",
  "system",
] as const;

export const logStreamsApi = {
  list: () => api.get<{ streams: LogStream[] }>("/log-streams"),
  create: (body: LogStreamBody) => api.post<LogStream>("/log-streams", body),
  update: (id: string, body: LogStreamBody) =>
    api.patch<LogStream>(`/log-streams/${id}`, body),
  remove: (id: string) => api.delete<{ message: string }>(`/log-streams/${id}`),
  test: (id: string) =>
    api.post<{ success: boolean; error: string | null }>(`/log-streams/${id}/test`, {}),
  health: (id: string) =>
    api.get<{
      id: string;
      last_success_at: string | null;
      last_error: string | null;
      runtime: { active: boolean; queue_depth: number; dropped: number };
    }>(`/log-streams/${id}/health`),
};
