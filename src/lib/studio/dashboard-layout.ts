import type { DashboardLayoutItem, StudioDashboardItem } from "@/types/studio";

function slotBottom(slot: DashboardLayoutItem): number {
  return slot.y + slot.h;
}

/** Place a new panel beside the last slot when there is room on the same row. */
export function nextDefaultSlotPosition(
  existing: DashboardLayoutItem[],
  panelType: StudioDashboardItem["panel_type"],
): Pick<DashboardLayoutItem, "x" | "y" | "w" | "h"> {
  const w = panelType === "text" ? 12 : 6;
  const h = panelType === "text" ? 3 : 4;
  let x = 0;
  let y = 0;
  if (existing.length > 0) {
    const last = existing[existing.length - 1]!;
    y = Math.max(...existing.map(slotBottom), 0);
    if (panelType !== "text") {
      const room = last.x + last.w + w <= 12;
      if (last.w < 12 && room) {
        x = last.x + last.w;
        y = last.y;
      } else {
        y = slotBottom(last);
        x = 0;
      }
    } else {
      y = slotBottom(last);
    }
  }
  return { x, y, w, h };
}

/** Default grid slot for a dashboard item missing from persisted layout. */
export function defaultLayoutSlot(
  item: StudioDashboardItem,
  existing: DashboardLayoutItem[],
): DashboardLayoutItem {
  const pos = nextDefaultSlotPosition(existing, item.panel_type);
  return {
    item_id: item.id,
    ...pos,
  };
}

/**
 * Every dashboard item must have a layout entry for react-grid-layout.
 * Older panels may exist in `items` without a saved layout slot.
 */
export function resolveDashboardLayout(
  items: StudioDashboardItem[],
  layout: DashboardLayoutItem[] | null | undefined,
): DashboardLayoutItem[] {
  const saved = layout ?? [];
  const slotByItemId = new Map(saved.map((slot) => [String(slot.item_id), slot]));
  const ordered = [...items].sort((a, b) => a.position - b.position);
  const resolved: DashboardLayoutItem[] = [];

  for (const item of ordered) {
    const id = String(item.id);
    const existing = slotByItemId.get(id);
    if (existing) {
      resolved.push(existing);
    } else {
      resolved.push(defaultLayoutSlot(item, resolved));
    }
  }

  return resolved;
}

/** Keep local drag positions when merging a server refresh. */
export function mergeDashboardLayout(
  serverItems: StudioDashboardItem[],
  serverLayout: DashboardLayoutItem[] | null | undefined,
  localLayout: DashboardLayoutItem[],
): DashboardLayoutItem[] {
  const resolved = resolveDashboardLayout(serverItems, serverLayout);
  if (localLayout.length === 0) return resolved;

  const localById = new Map(localLayout.map((slot) => [String(slot.item_id), slot]));
  return resolved.map((slot) => localById.get(String(slot.item_id)) ?? slot);
}

/** Merge dashboard execute results by visualization id (preserve existing panels). */
export function mergeExecuteResults<T extends { visualization_id: string }>(
  prev: T[],
  next: T[],
): T[] {
  const map = new Map(prev.map((r) => [r.visualization_id, r]));
  for (const r of next) {
    map.set(r.visualization_id, r);
  }
  return [...map.values()];
}
