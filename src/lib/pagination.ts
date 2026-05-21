/** Default page sizes used across list views. */
export const DEFAULT_PAGE_SIZE = 20;
export const NOTIFICATIONS_PAGE_SIZE = 25;
export const STUDIO_LIST_PAGE_SIZE = 20;
export const WEBHOOK_DELIVERIES_PAGE_SIZE = 25;
export const ALERT_EVENTS_PAGE_SIZE = 25;
export const AUDIT_LOGS_PAGE_SIZE = 25;

export function getTotalPages(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}
