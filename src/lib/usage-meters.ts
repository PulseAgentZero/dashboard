import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Cable,
  Cpu,
  KeyRound,
  Users,
  Webhook,
  LayoutDashboard,
} from "lucide-react";
import type { PlanUsage, UsageSlot } from "@/lib/api/usage-api";

export type MeterKey = keyof PlanUsage["limits"];

export type MeterDef = {
  key: MeterKey;
  label: string;
  shortLabel: string;
  period: "monthly" | "daily" | "always";
  group: "access" | "automation" | "studio";
  icon: LucideIcon;
  color: string;
  barColor: string;
};

export const USAGE_METERS: MeterDef[] = [
  {
    key: "connections",
    label: "Data connections",
    shortLabel: "Connections",
    period: "always",
    group: "access",
    icon: Cable,
    color: "text-teal-600",
    barColor: "#0d9488",
  },
  {
    key: "api_keys",
    label: "API keys",
    shortLabel: "API keys",
    period: "always",
    group: "access",
    icon: KeyRound,
    color: "text-violet-600",
    barColor: "#7c3aed",
  },
  {
    key: "webhook_channels",
    label: "Webhook channels",
    shortLabel: "Webhooks",
    period: "always",
    group: "access",
    icon: Webhook,
    color: "text-sky-600",
    barColor: "#0284c7",
  },
  {
    key: "users",
    label: "Team members",
    shortLabel: "Team",
    period: "always",
    group: "access",
    icon: Users,
    color: "text-blue-600",
    barColor: "#2563eb",
  },
  {
    key: "pipeline_runs_this_month",
    label: "Pipeline runs",
    shortLabel: "Pipeline",
    period: "monthly",
    group: "automation",
    icon: Cpu,
    color: "text-emerald-600",
    barColor: "#059669",
  },
  {
    key: "agent_queries_this_month",
    label: "Agent queries",
    shortLabel: "Agent",
    period: "monthly",
    group: "automation",
    icon: Bot,
    color: "text-amber-600",
    barColor: "#d97706",
  },
  {
    key: "studio_dashboards",
    label: "Studio dashboards",
    shortLabel: "Dashboards",
    period: "always",
    group: "studio",
    icon: LayoutDashboard,
    color: "text-indigo-600",
    barColor: "#4f46e5",
  },
  {
    key: "studio_executions_today",
    label: "Studio query runs",
    shortLabel: "Queries",
    period: "daily",
    group: "studio",
    icon: BarChart3,
    color: "text-rose-600",
    barColor: "#e11d48",
  },
];

export const METER_GROUPS = [
  {
    id: "access" as const,
    title: "Access & integrations",
    description: "Data connections, keys, webhooks, and seats",
  },
  { id: "automation" as const, title: "Automation", description: "Resets on the 1st of each month" },
  { id: "studio" as const, title: "Entivia Studio", description: "Dashboards and query executions" },
];

export type MeterStatus = "unlimited" | "healthy" | "warning" | "critical";

export function getMeterStatus(slot: UsageSlot | undefined): MeterStatus {
  if (!slot) return "healthy";
  if (slot.limit === null) return "unlimited";
  if (slot.limit === 0) return "critical";
  const pct = slot.used / slot.limit;
  if (pct >= 1) return "critical";
  if (pct >= 0.85) return "warning";
  return "healthy";
}

export function getMeterPercent(slot: UsageSlot | undefined): number {
  if (!slot || slot.limit === null) return 0;
  if (slot.limit === 0) return 100;
  return Math.min(Math.round((slot.used / slot.limit) * 100), 100);
}

export function computeHealthScore(limits: PlanUsage["limits"]): number {
  const limited = USAGE_METERS.map((m) => limits[m.key]).filter(
    (s): s is UsageSlot => !!s && s.limit !== null && s.limit > 0,
  );
  if (limited.length === 0) return 100;
  const avg =
    limited.reduce((sum, s) => sum + Math.min(s.used / s.limit!, 1), 0) /
    limited.length;
  return Math.round((1 - avg) * 100);
}

export type ChartRow = {
  name: string;
  used: number;
  limit: number;
  remaining: number;
  pct: number;
  fill: string;
};

export function summarizeMeterStatuses(limits: PlanUsage["limits"]) {
  const counts = { unlimited: 0, healthy: 0, warning: 0, critical: 0 };
  for (const m of USAGE_METERS) {
    counts[getMeterStatus(limits[m.key])] += 1;
  }
  return counts;
}

const STATUS_SORT_ORDER: Record<MeterStatus, number> = {
  critical: 0,
  warning: 1,
  healthy: 2,
  unlimited: 3,
};

export function sortMetersBySeverity(
  meters: MeterDef[],
  limits: PlanUsage["limits"],
): MeterDef[] {
  return [...meters].sort(
    (a, b) =>
      STATUS_SORT_ORDER[getMeterStatus(limits[a.key])] -
      STATUS_SORT_ORDER[getMeterStatus(limits[b.key])],
  );
}

export function buildChartData(limits: PlanUsage["limits"]): ChartRow[] {
  return USAGE_METERS.map((m) => {
    const slot = limits[m.key];
    if (!slot || slot.limit === null) {
      return {
        name: m.shortLabel,
        used: slot?.used ?? 0,
        limit: 0,
        remaining: 0,
        pct: 0,
        fill: "#94a3b8",
      };
    }
    const pct = getMeterPercent(slot);
    const fill =
      pct >= 100 ? "#f43f5e" : pct >= 85 ? "#f59e0b" : m.barColor;
    return {
      name: m.shortLabel,
      used: slot.used,
      limit: slot.limit,
      remaining: Math.max(slot.limit - slot.used, 0),
      pct,
      fill,
    };
  }).filter((r) => r.limit > 0);
}
