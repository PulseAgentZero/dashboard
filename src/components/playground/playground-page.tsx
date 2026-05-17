"use client";

import { useState } from "react";
import { ChevronRight, Loader2, Play, Terminal } from "lucide-react";
import { useApiKeys } from "@/hooks/apikeys/use-apikeys";

const BASE_URL =
  (typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000";

type Param = { key: string; placeholder?: string; required?: boolean };

type Endpoint = {
  id: string;
  label: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  pathParams?: Param[];
  queryParams?: Param[];
  body?: Record<string, string>;
  scope: "read" | "write";
};

type Group = { group: string; endpoints: Endpoint[] };

const CATALOG: Group[] = [
  {
    group: "Entities",
    endpoints: [
      {
        id: "list-entities",
        label: "List entities",
        method: "GET",
        path: "/entities",
        description: "Returns all profiled entities with current risk scores.",
        queryParams: [
          { key: "risk_tier", placeholder: "High | Medium | Low | Healthy" },
          { key: "segment", placeholder: "segment name" },
          { key: "search", placeholder: "search term" },
          { key: "page", placeholder: "1" },
          { key: "limit", placeholder: "50" },
        ],
        scope: "read",
      },
      {
        id: "get-entity",
        label: "Get entity",
        method: "GET",
        path: "/entities/{entity_id}",
        description: "Full profile, risk score, and open recommendations for one entity.",
        pathParams: [{ key: "entity_id", placeholder: "entity-id", required: true }],
        scope: "read",
      },
      {
        id: "entity-risk-history",
        label: "Entity risk history",
        method: "GET",
        path: "/entities/{entity_id}/risk-history",
        description: "Time-series risk scores for an entity.",
        pathParams: [{ key: "entity_id", placeholder: "entity-id", required: true }],
        queryParams: [{ key: "period", placeholder: "7d | 30d | 90d | 180d" }],
        scope: "read",
      },
    ],
  },
  {
    group: "Recommendations",
    endpoints: [
      {
        id: "list-recs",
        label: "List recommendations",
        method: "GET",
        path: "/recommendations",
        description: "Returns open recommendations. Filter by status or urgency.",
        queryParams: [
          { key: "status", placeholder: "open | actioned | dismissed" },
          { key: "urgency", placeholder: "critical | high | medium | low" },
          { key: "page", placeholder: "1" },
          { key: "limit", placeholder: "50" },
        ],
        scope: "read",
      },
      {
        id: "get-rec",
        label: "Get recommendation",
        method: "GET",
        path: "/recommendations/{recommendation_id}",
        description: "Full details for a single recommendation.",
        pathParams: [{ key: "recommendation_id", placeholder: "uuid", required: true }],
        scope: "read",
      },
    ],
  },
  {
    group: "Analytics",
    endpoints: [
      {
        id: "analytics-overview",
        label: "Analytics overview",
        method: "GET",
        path: "/analytics/overview",
        description: "Aggregate risk and performance stats for the requested period.",
        queryParams: [{ key: "period", placeholder: "7d | 30d | 90d" }],
        scope: "read",
      },
    ],
  },
  {
    group: "Pipeline",
    endpoints: [
      {
        id: "list-runs",
        label: "List pipeline runs",
        method: "GET",
        path: "/pipeline/runs",
        description: "Recent pipeline runs for your org.",
        queryParams: [{ key: "limit", placeholder: "25" }],
        scope: "read",
      },
      {
        id: "trigger-pipeline",
        label: "Trigger pipeline run",
        method: "POST",
        path: "/pipeline/trigger",
        description: "Queue a new pipeline run. Requires a write-scoped key.",
        scope: "write",
      },
    ],
  },
];

function buildUrl(endpoint: Endpoint, pathValues: Record<string, string>, queryValues: Record<string, string>) {
  let path = endpoint.path;
  for (const [k, v] of Object.entries(pathValues)) {
    if (v) path = path.replace(`{${k}}`, encodeURIComponent(v));
  }
  const qs = Object.entries(queryValues)
    .filter(([, v]) => v.trim() !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return `${BASE_URL}/api/public/v1${path}${qs ? `?${qs}` : ""}`;
}

export function PlaygroundPage() {
  const { data: keysRaw } = useApiKeys();
  const allKeys: { id: string; name: string; key_prefix: string; scope: string }[] =
    (keysRaw as { api_keys?: typeof allKeys })?.api_keys ??
    (Array.isArray(keysRaw) ? keysRaw : []);

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(CATALOG[0].endpoints[0]);
  const [selectedKeyPrefix, setSelectedKeyPrefix] = useState<string>("");
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<{ status: number; body: string; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawKey, setRawKey] = useState("");

  // The actual key value must be entered manually since we only store hashes.
  // We show a raw key input alongside the key selector.

  async function run() {
    const key = rawKey.trim();
    if (!key) {
      alert("Enter your API key value below the selector.");
      return;
    }
    const url = buildUrl(selectedEndpoint, pathValues, queryValues);
    setLoading(true);
    setResponse(null);
    const t0 = Date.now();
    try {
      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers: {
          "X-API-Key": key,
          "Content-Type": "application/json",
        },
        body: selectedEndpoint.method === "POST" ? JSON.stringify({}) : undefined,
      });
      const ms = Date.now() - t0;
      let body = "";
      try {
        const json = await res.json();
        body = JSON.stringify(json, null, 2);
      } catch {
        body = await res.text();
      }
      setResponse({ status: res.status, body, ms });
    } catch (err) {
      setResponse({ status: 0, body: String(err), ms: Date.now() - t0 });
    } finally {
      setLoading(false);
    }
  }

  function selectEndpoint(ep: Endpoint) {
    setSelectedEndpoint(ep);
    setPathValues({});
    setQueryValues({});
    setResponse(null);
  }

  const url = buildUrl(selectedEndpoint, pathValues, queryValues);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ── Left: endpoint catalog ─────────────────────────────────── */}
      <aside className="w-56 shrink-0 overflow-y-auto border-r border-slate-200 bg-white py-4">
        {CATALOG.map((g) => (
          <div key={g.group} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {g.group}
            </p>
            {g.endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => selectEndpoint(ep)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors ${
                  selectedEndpoint.id === ep.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase ${
                    ep.method === "POST"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="truncate font-medium">{ep.label}</span>
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* ── Center: request builder ────────────────────────────────── */}
      <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Endpoint badge */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${
                  selectedEndpoint.method === "POST"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {selectedEndpoint.method}
              </span>
              <code className="text-xs text-slate-600">{selectedEndpoint.path}</code>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{selectedEndpoint.description}</p>
          </div>

          {/* API key */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold text-slate-600">API Key</label>
            {allKeys.length > 0 ? (
              <select
                value={selectedKeyPrefix}
                onChange={(e) => setSelectedKeyPrefix(e.target.value)}
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select a key…</option>
                {allKeys.map((k) => (
                  <option key={k.id} value={k.key_prefix}>
                    {k.name} ({k.scope}) — {k.key_prefix}…
                  </option>
                ))}
              </select>
            ) : (
              <p className="mb-2 text-xs text-slate-400">
                No API keys found.{" "}
                <a href="/dashboard/api-keys" className="text-blue-600 hover:underline">
                  Create one
                </a>
              </p>
            )}
            <input
              value={rawKey}
              onChange={(e) => setRawKey(e.target.value)}
              placeholder="Paste your full API key value here"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Keys are hashed — paste the full value from when you created it.
            </p>
          </div>

          {/* Path params */}
          {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Path Parameters
              </label>
              <div className="space-y-2">
                {selectedEndpoint.pathParams.map((p) => (
                  <div key={p.key}>
                    <label className="mb-0.5 block text-[11px] text-slate-500">
                      {p.key}{p.required && <span className="text-rose-500"> *</span>}
                    </label>
                    <input
                      value={pathValues[p.key] ?? ""}
                      onChange={(e) => setPathValues((prev) => ({ ...prev, [p.key]: e.target.value }))}
                      placeholder={p.placeholder}
                      className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query params */}
          {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Query Parameters
              </label>
              <div className="space-y-2">
                {selectedEndpoint.queryParams.map((p) => (
                  <div key={p.key}>
                    <label className="mb-0.5 block text-[11px] text-slate-500">{p.key}</label>
                    <input
                      value={queryValues[p.key] ?? ""}
                      onChange={(e) => setQueryValues((prev) => ({ ...prev, [p.key]: e.target.value }))}
                      placeholder={p.placeholder}
                      className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* URL preview */}
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Request URL
            </p>
            <code className="break-all text-[11px] text-slate-600">{url}</code>
          </div>
        </div>

        {/* Send button */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={run}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            {loading ? "Sending…" : "Send Request"}
          </button>
        </div>
      </div>

      {/* ── Right: response viewer ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
        {response ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-2.5">
              <span
                className={`rounded px-2 py-0.5 text-xs font-bold ${
                  response.status >= 200 && response.status < 300
                    ? "bg-emerald-900/60 text-emerald-400"
                    : "bg-rose-900/60 text-rose-400"
                }`}
              >
                {response.status || "Error"}
              </span>
              <span className="text-xs text-slate-400">{response.ms}ms</span>
            </div>
            <pre className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
              {response.body}
            </pre>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-600">
            <Terminal size={32} className="text-slate-700" />
            <p className="text-sm">Configure your request and hit Send</p>
            <div className="flex items-center gap-1 text-xs text-slate-700">
              <ChevronRight size={12} />
              <span>Select an endpoint from the left</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
