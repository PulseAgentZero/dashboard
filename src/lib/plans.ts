/**
 * Marketing plan catalog — keep in sync with api/app/api/dependencies/plan_gate.py PLAN_LIMITS.
 */

import type { PlanTier } from "@/lib/plan-utils";

export type PlanLimitRow = {
  label: string;
  free: string;
  growth: string;
  pro: string;
};

export const PRO_PRICE_DISPLAY =
  process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY ?? "₦40,000/month";

export const GROWTH_PRICE_DISPLAY =
  process.env.NEXT_PUBLIC_GROWTH_PRICE_DISPLAY ?? "₦15,000/month";

export const PLAN_COMPARISON: PlanLimitRow[] = [
  { label: "Data connections", free: "5", growth: "15", pro: "Unlimited" },
  { label: "API keys", free: "1", growth: "5", pro: "Unlimited" },
  { label: "Webhook channels", free: "1", growth: "3", pro: "Unlimited" },
  { label: "Team members", free: "3", growth: "10", pro: "Unlimited" },
  { label: "Pipeline runs / month", free: "20", growth: "100", pro: "Unlimited" },
  { label: "Agent queries / month", free: "100", growth: "500", pro: "Unlimited" },
  { label: "Studio dashboards", free: "5", growth: "20", pro: "Unlimited" },
  { label: "Studio query runs / day", free: "600", growth: "2,000", pro: "Unlimited" },
  { label: "Audit logs", free: "—", growth: "—", pro: "Included" },
];

export const FREE_PLAN_FEATURES = [
  "Up to 5 data connections",
  "Entity profiling & risk scoring",
  "Recommendations & analytics",
  "Entivia Studio (within limits)",
  "Public API (1 key)",
];

export const GROWTH_PLAN_FEATURES = [
  "Everything in Free",
  "15 data connections",
  "Up to 10 team members",
  "Higher pipeline & agent quotas",
  "More Studio dashboards & daily queries",
  "5 API keys & 3 webhook channels",
];

export const PRO_PLAN_FEATURES = [
  "Everything in Growth",
  "Audit logs — full workspace activity history",
  "Unlimited data connections",
  "Unlimited API keys & webhooks",
  "Unlimited team members",
  "Unlimited pipeline & agent usage",
  "Unlimited Studio dashboards & queries",
  "Priority support",
];

export const SELF_HOSTED_LICENSE_FEATURES = [
  "Deploy on your own infrastructure",
  "Pro-equivalent limits (unlimited quotas)",
  "Audit logs with a valid license",
  "Stream logs to HTTP, Syslog, or local files",
  "SSO with OIDC and SAML",
  "LDAP / Active Directory user sync",
  "Run multiple pipelines in parallel",
  "Bring your own LLM keys",
  "One-time license — no recurring cloud fee",
];

export const CLOUD_PLAN_ORDER: PlanTier[] = ["free", "growth", "pro"];
