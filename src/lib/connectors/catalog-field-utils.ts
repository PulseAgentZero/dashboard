import type { CatalogField } from "@/types/connections";

/** Fields shown for the current form values (supports API `when` maps). */
export function visibleCatalogFields(
  fields: CatalogField[],
  values: Record<string, string>,
): CatalogField[] {
  return fields.filter((field) => {
    if (!field.when) return true;
    return Object.entries(field.when).every(([key, expected]) => values[key] === expected);
  });
}

export function catalogFieldDefaults(fields: CatalogField[]): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const f of fields) {
    if (f.default !== undefined) defaults[f.key] = String(f.default);
  }
  return defaults;
}
