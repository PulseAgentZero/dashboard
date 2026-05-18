const PARAM_RE = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

export function parseSqlParamNames(sql: string): string[] {
  const names = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(PARAM_RE.source, "g");
  while ((m = re.exec(sql)) !== null) {
    names.add(m[1]);
  }
  return [...names];
}

export function sqlParamsToDefinitions(
  sql: string,
  existing: { name: string; type?: string; default_value?: string | null; label?: string | null }[] = [],
): import("@/types/studio").QueryParamDefinition[] {
  const names = parseSqlParamNames(sql);
  const byName = new Map(existing.map((p) => [p.name, p]));
  return names.map((name) => {
    const prev = byName.get(name);
    return {
      name,
      type: (prev?.type as import("@/types/studio").ParamType) ?? "text",
      default_value: prev?.default_value ?? null,
      label: prev?.label ?? name.replace(/_/g, " "),
    };
  });
}
