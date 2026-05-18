import { api } from "./client";

export type UsageSlot = {
  used: number;
  limit: number | null; // null = unlimited
};

export type PlanUsage = {
  plan: string;
  limits: {
    api_keys: UsageSlot;
    webhook_channels: UsageSlot;
    users: UsageSlot;
    pipeline_runs_this_month: UsageSlot;
    agent_queries_this_month: UsageSlot;
    studio_dashboards?: UsageSlot;
    studio_executions_today?: UsageSlot;
  };
};

export const usageApi = {
  get: () => api.get<PlanUsage>("/organization/usage"),
};
