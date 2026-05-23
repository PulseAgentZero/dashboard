"use client";

import { useState } from "react";
import { ChevronRight, Loader2, Play, Terminal } from "lucide-react";
import { toast } from "sonner";
import { useApiKeys } from "@/hooks/apikeys/use-apikeys";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  PUBLIC_API_CATALOG,
  type PublicApiEndpoint,
} from "@/lib/docs/public-api-catalog";

const _apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = (_apiUrl !== undefined ? _apiUrl : "http://localhost:8000").replace(
  /\/$/,
  "",
);

function buildUrl(
  endpoint: PublicApiEndpoint,
  pathValues: Record<string, string>,
  queryValues: Record<string, string>,
) {
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

type Tab = "endpoints" | "request" | "response";

export function PlaygroundPage() {
  const { data: keysRaw } = useApiKeys();
  const allKeys: { id: string; name: string; key_prefix: string; scope: string }[] =
    (keysRaw as { api_keys?: typeof allKeys })?.api_keys ??
    (Array.isArray(keysRaw) ? keysRaw : []);

  const [selectedEndpoint, setSelectedEndpoint] = useState<PublicApiEndpoint>(
    PUBLIC_API_CATALOG[0]!.endpoints[0]!,
  );
  const [selectedKeyPrefix, setSelectedKeyPrefix] = useState<string>("");
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState<string>(
    PUBLIC_API_CATALOG[0]!.endpoints[0]!.sampleBody ?? "",
  );
  const [response, setResponse] = useState<{ status: number; body: string; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawKey, setRawKey] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("endpoints");
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  async function run() {
    const key = rawKey.trim();
    if (!key) {
      toast.error("Enter your full API key in the field below the selector.");
      return;
    }

    const missingPath = selectedEndpoint.pathParams?.find(
      (p) => p.required && !(pathValues[p.key] ?? "").trim(),
    );
    if (missingPath) {
      toast.error(`Missing required path parameter: ${missingPath.key}`);
      return;
    }

    const url = buildUrl(selectedEndpoint, pathValues, queryValues);
    setLoading(true);
    setResponse(null);
    const t0 = Date.now();
    try {
      const headers: Record<string, string> = { "X-API-Key": key };
      let requestBody: string | undefined;
      if (selectedEndpoint.method === "POST") {
        headers["Content-Type"] = "application/json";
        const raw = bodyValue.trim() || "{}";
        try {
          JSON.parse(raw);
        } catch {
          toast.error("Request body is not valid JSON.");
          setLoading(false);
          return;
        }
        requestBody = raw;
      }

      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
        body: requestBody,
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
      setActiveTab("response");
      if (res.status >= 400) {
        toast.error(`Request failed (${res.status})`);
      }
    } catch (err) {
      setResponse({ status: 0, body: String(err), ms: Date.now() - t0 });
      setActiveTab("response");
      toast.error("Request could not be sent. Check the API URL and network.");
    } finally {
      setLoading(false);
    }
  }

  function selectEndpoint(ep: PublicApiEndpoint) {
    setSelectedEndpoint(ep);
    setPathValues({});
    setQueryValues({});
    setBodyValue(ep.sampleBody ?? "");
    setResponse(null);
    setActiveTab("request");
  }

  const url = buildUrl(selectedEndpoint, pathValues, queryValues);

  const tabs: { id: Tab; label: string }[] = [
    { id: "endpoints", label: "Endpoints" },
    { id: "request", label: "Request" },
    { id: "response", label: "Response" },
  ];

  /* ── Shared panel content ───────────────────────────────────────── */

  const endpointPanel = (
    <div className="overflow-y-auto py-4 h-full">
      {PUBLIC_API_CATALOG.map((g) => (
        <div key={g.group} className="mb-4">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {g.group}
          </p>
          {g.endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => selectEndpoint(ep)}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] transition-colors ${
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
    </div>
  );

  const requestPanel = (
    <div className="flex flex-col h-full">
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
            <code className="text-xs text-slate-600 break-all">{selectedEndpoint.path}</code>
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
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-blue-500 sm:text-sm"
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            Keys are hashed — paste the full value from when you created it.
          </p>
        </div>

        {/* Path params */}
        {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">Path Parameters</label>
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
                    className="w-full rounded border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-500 sm:px-2.5 sm:py-1.5 sm:text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query params */}
        {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">Query Parameters</label>
            <div className="space-y-2">
              {selectedEndpoint.queryParams.map((p) => (
                <div key={p.key}>
                  <label className="mb-0.5 block text-[11px] text-slate-500">{p.key}</label>
                  <input
                    value={queryValues[p.key] ?? ""}
                    onChange={(e) => setQueryValues((prev) => ({ ...prev, [p.key]: e.target.value }))}
                    placeholder={p.placeholder}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-500 sm:px-2.5 sm:py-1.5 sm:text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON body (POST only) */}
        {selectedEndpoint.method === "POST" && (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Request Body{" "}
              <span className="font-normal text-slate-400">(JSON)</span>
            </label>
            <textarea
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
              rows={10}
              spellCheck={false}
              placeholder='{ }'
              className="w-full rounded border border-slate-200 px-3 py-2 font-mono text-[12px] leading-relaxed outline-none focus:border-blue-500"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Sent as the request body. Pre-filled from the endpoint example;
              edit before sending.
            </p>
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
      <div className="border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={run}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {loading ? "Sending…" : "Send Request"}
        </button>
      </div>
    </div>
  );

  const responsePanel = (
    <div className="flex flex-col h-full bg-slate-950">
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
          <pre className="flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-slate-300 xl:whitespace-pre">
            {response.body}
          </pre>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-600">
          <Terminal size={32} className="text-slate-700" />
          <p className="text-sm">Configure your request and hit Send</p>
          <div className="flex items-center gap-1 text-xs text-slate-700">
            <ChevronRight size={12} />
            <span>Select an endpoint to begin</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex h-full min-h-[480px] overflow-hidden ${isDesktop ? "flex-row" : "flex-col"}`}
    >
      {isDesktop ? (
        <>
          <aside className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
            {endpointPanel}
          </aside>
          <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
            {requestPanel}
          </div>
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{responsePanel}</div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 border-b border-slate-200 bg-white">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                  activeTab === t.id
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
                {t.id === "response" && response && (
                  <span
                    className={`ml-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                      response.status >= 200 && response.status < 300
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {activeTab === "endpoints" && (
              <div className="h-full bg-white">{endpointPanel}</div>
            )}
            {activeTab === "request" && (
              <div className="h-full bg-white">{requestPanel}</div>
            )}
            {activeTab === "response" && <div className="h-full">{responsePanel}</div>}
          </div>
        </>
      )}
    </div>
  );
}
