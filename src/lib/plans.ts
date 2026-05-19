/**
 * Marketing plan catalog — keep in sync with api/app/api/dependencies/plan_gate.py PLAN_LIMITS.
 */

export type PlanLimitRow = {
  label: string;
  free: string;
  pro: string;
};

export const PRO_PRICE_DISPLAY =
  process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY ?? "₦40,000/month";

export const PLAN_COMPARISON: PlanLimitRow[] = [
  { label: "Data connections", free: "3", pro: "Unlimited" },
  { label: "API keys", free: "1", pro: "Unlimited" },
  { label: "Webhook channels", free: "1", pro: "Unlimited" },
  { label: "Team members", free: "3", pro: "Unlimited" },
  { label: "Pipeline runs / month", free: "20", pro: "Unlimited" },
  { label: "Agent queries / month", free: "100", pro: "Unlimited" },
  { label: "Studio dashboards", free: "5", pro: "Unlimited" },
  { label: "Studio query runs / day", free: "600", pro: "Unlimited" },
];

export const FREE_PLAN_FEATURES = [
  "Up to 3 data connections",
  "Entity profiling & risk scoring",
  "Recommendations & analytics",
  "Pulse Studio (within limits)",
  "Public API (1 key)",
];

export const PRO_PLAN_FEATURES = [
  "Everything in Free",
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
  "Bring your own LLM keys",
  "One-time license — no recurring cloud fee",
];
