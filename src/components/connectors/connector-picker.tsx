"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { useConnectionCatalog } from "@/hooks/connections/use-connections";
import type { ConnectorCatalogItem } from "@/types/connections";
import { ConnectorIcon } from "./connector-icon";

const GROUP_ORDER = [
  { label: "SQL databases", match: (c: ConnectorCatalogItem) =>
    ["postgresql", "mysql", "mssql", "sqlite", "csv"].includes(c.connector_type) },
  { label: "Cloud warehouses", match: (c: ConnectorCatalogItem) =>
    ["snowflake", "bigquery", "databricks", "redshift", "clickhouse"].includes(c.connector_type) },
  { label: "Other sources", match: () => true },
];

function ConnectorCard({ item }: { item: ConnectorCatalogItem }) {
  return (
    <Link
      href={`/dashboard/connections/new/${item.connector_type}`}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
    >
      <ConnectorIcon connectorType={item.connector_type} size={28} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{item.display_name}</p>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
            {item.description}
          </p>
        )}
      </div>
      <ChevronRight
        size={16}
        className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
      />
    </Link>
  );
}

export function ConnectorPicker() {
  const { data: catalog, isLoading } = useConnectionCatalog();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (c) =>
        c.display_name.toLowerCase().includes(q) ||
        c.connector_type.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q),
    );
  }, [catalog, query]);

  const groups = useMemo(() => {
    const assigned = new Set<string>();
    const result: { label: string; items: ConnectorCatalogItem[] }[] = [];

    for (const g of GROUP_ORDER) {
      const items = filtered.filter((c) => {
        if (assigned.has(c.connector_type)) return false;
        if (g.label === "Other sources") {
          return !GROUP_ORDER.slice(0, 2).some((og) => og.match(c));
        }
        return g.match(c);
      });
      items.forEach((c) => assigned.add(c.connector_type));
      if (items.length > 0) result.push({ label: g.label, items });
    }

    const rest = filtered.filter((c) => !assigned.has(c.connector_type));
    if (rest.length > 0) {
      result.push({ label: "More connectors", items: rest });
    }

    return result;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          placeholder="Search connectors…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <p className="text-sm font-medium text-slate-600">No connectors match your search</p>
          <p className="mt-1 text-xs text-slate-400">Try a different name or clear the search.</p>
        </div>
      )}

      {!isLoading &&
        groups.map(({ label, items }) => (
          <section key={label}>
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ConnectorCard key={item.connector_type} item={item} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
