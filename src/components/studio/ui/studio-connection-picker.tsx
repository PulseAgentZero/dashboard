"use client";

import Link from "next/link";
import { ChevronDown, Database, Loader2 } from "lucide-react";
import { useConnections } from "@/hooks/connections/use-connections";
import { ConnectorIcon } from "@/components/connectors/connector-icon";
import {
  isStudioFileConnector,
  isStudioSqlConnector,
  studioConnectionLabel,
} from "@/lib/studio/connections";
import type { ConnectionResponse } from "@/types/connections";

type Props = {
  value: string | null;
  onChange: (connectionId: string) => void;
  disabled?: boolean;
  className?: string;
  /** Compact row for the editor toolbar */
  variant?: "default" | "toolbar";
};

function studioCapable(c: ConnectionResponse): boolean {
  return isStudioSqlConnector(c.connector_type) || isStudioFileConnector(c.connector_type);
}

function statusTone(status: string) {
  const s = status?.toLowerCase();
  if (s === "active" || s === "connected") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (s === "failed") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

export function StudioConnectionPicker({
  value,
  onChange,
  disabled,
  className,
  variant = "default",
}: Props) {
  const { data: connections, isLoading } = useConnections();

  const options = (connections ?? []).filter(studioCapable);
  const selected = options.find((c) => c.id === value);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-slate-500 ${className ?? ""}`}>
        <Loader2 size={14} className="animate-spin" />
        Loading connections…
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div
        className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className ?? ""}`}
      >
        No data sources yet.{" "}
        <Link href="/dashboard/connections" className="font-semibold text-indigo-700 hover:underline">
          Connect a database or file
        </Link>{" "}
        to run Studio queries.
      </div>
    );
  }

  const isToolbar = variant === "toolbar";

  return (
    <div className={className}>
      <label
        className={`flex items-center gap-2 ${isToolbar ? "text-[10px] font-semibold uppercase tracking-wide text-slate-500" : "text-xs font-semibold text-slate-700"}`}
      >
        <Database size={isToolbar ? 12 : 14} className="shrink-0 text-indigo-600" />
        Data source
      </label>

      <div
        className={`relative mt-1.5 ${isToolbar ? "min-w-[min(100%,14rem)] sm:min-w-[16rem]" : "w-full max-w-lg"}`}
      >
        {selected && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
            <ConnectorIcon connectorType={selected.connector_type} size={18} />
          </span>
        )}

        <select
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl border-2 border-slate-300 bg-white py-2.5 pr-10 text-sm font-medium text-slate-900 shadow-sm outline-none transition-colors hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${
            selected ? "pl-10" : "pl-3"
          } ${isToolbar ? "py-2" : ""}`}
        >
          <option value="" disabled>
            Select data source…
          </option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {studioConnectionLabel(c.connector_type)}
              {c.status !== "active" && c.status !== "connected" ? ` (${c.status})` : ""}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>

      {selected && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${statusTone(selected.status)}`}
          >
            {selected.status}
          </span>
          <span className="text-[11px] text-slate-500">
            {studioConnectionLabel(selected.connector_type)}
            {selected.database_name ? ` · ${selected.database_name}` : ""}
            {selected.host ? ` · ${selected.host}` : ""}
          </span>
        </div>
      )}

      {selected && isStudioFileConnector(selected.connector_type) && (
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          File sources use in-memory SQL. Use table names from the schema list (sheet or file name).
        </p>
      )}

      {!selected && value === null && options.length > 0 && (
        <p className="mt-1.5 text-xs text-amber-700">
          Choose which connection this query should run against.
        </p>
      )}
    </div>
  );
}

export function pickDefaultStudioConnectionId(
  connections: ConnectionResponse[] | undefined,
): string | null {
  if (!connections?.length) return null;
  const capable = connections.filter(studioCapable);
  const active = capable.filter((c) => c.status === "active" || c.status === "connected");
  const pool = active.length ? active : capable;
  return pool[0]?.id ?? null;
}
