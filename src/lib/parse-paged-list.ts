/** Extract items + total from API list responses (array or paginated object). */
export function parsePagedList<T>(
  raw: unknown,
  itemsKey: string,
): { items: T[]; total: number } {
  if (Array.isArray(raw)) {
    return { items: raw as T[], total: raw.length };
  }
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r[itemsKey]) && typeof r.total === "number") {
      return { items: r[itemsKey] as T[], total: r.total };
    }
    for (const k of [itemsKey, "data", "items"]) {
      if (Array.isArray(r[k])) {
        const items = r[k] as T[];
        return { items, total: items.length };
      }
    }
  }
  return { items: [], total: 0 };
}
