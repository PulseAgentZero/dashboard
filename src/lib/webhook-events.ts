/** Outbound webhook event types (see API SCHEMA.md). */
export const WEBHOOK_EVENT_TYPES = [
  {
    id: "alert.triggered",
    label: "Alert triggered",
    description: "When an alert rule threshold is crossed",
    available: true,
  },
  {
    id: "pipeline.completed",
    label: "Pipeline completed",
    description: "When a pipeline run finishes successfully",
    available: false,
  },
  {
    id: "entity.risk_changed",
    label: "Entity risk changed",
    description: "When an entity risk score changes materially",
    available: false,
  },
  {
    id: "recommendation.created",
    label: "Recommendation created",
    description: "When a new recommendation is generated",
    available: false,
  },
] as const;

export type WebhookEventId = (typeof WEBHOOK_EVENT_TYPES)[number]["id"];

export const DEFAULT_WEBHOOK_EVENTS: WebhookEventId[] = ["alert.triggered"];

export function formatWebhookEvents(events: string[] | undefined): string {
  if (!events?.length) return "All events";
  return events
    .map((id) => WEBHOOK_EVENT_TYPES.find((e) => e.id === id)?.label ?? id)
    .join(", ");
}
