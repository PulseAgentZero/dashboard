"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Radio, Send, ShieldCheck, Trash2 } from "lucide-react";
import {
  useCreateLogStream,
  useDeleteLogStream,
  useLogStreams,
  useTestLogStream,
} from "@/hooks/log-streams/use-log-streams";
import { useLicense } from "@/hooks/webhooks/use-webhooks";
import { hasLicenseFeature } from "@/lib/feature-access";
import {
  LOG_EVENT_CATEGORIES,
  type LogStreamBody,
  type LogStreamDestination,
  type LogStream,
} from "@/lib/api/log-streams-api";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 transition-all";

const labelCls = "block text-xs font-semibold text-slate-600";

const DESTINATION_OPTIONS: { value: LogStreamDestination; label: string; hint: string }[] = [
  { value: "http", label: "HTTP webhook", hint: "POST batches as JSON to your endpoint" },
  { value: "syslog", label: "Syslog", hint: "Stream to a Syslog collector (UDP / TCP / TLS)" },
  { value: "file", label: "File", hint: "Write to /var/log/pulse/streams in the container" },
];

function LockedState() {
  return (
    <div className="flex flex-col items-center py-12 text-center bg-transparent sm:bg-white sm:border sm:border-dashed sm:border-amber-200 sm:rounded-xl sm:shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 mb-3">
        <ShieldCheck size={20} className="text-amber-600" />
      </div>
      <p className="text-sm font-semibold text-slate-700">Log streaming requires a license</p>
      <p className="mt-0.5 max-w-xs text-xs text-slate-400 px-4 leading-normal">
        Activate your self-hosted license with the{" "}
        <code className="font-mono text-[10px] bg-slate-100 px-1 rounded">log_streaming</code> feature to send logs to HTTP, Syslog, or file destinations.
      </p>
      <Link
        href="/dashboard/settings?tab=license"
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm hover:bg-orange-50 transition-colors"
      >
        Go to License tab
      </Link>
    </div>
  );
}

function StreamForm({ onClose }: { onClose: () => void }) {
  const { mutate: create, isPending } = useCreateLogStream();
  const [name, setName] = useState("");
  const [dest, setDest] = useState<LogStreamDestination>("http");
  const [url, setUrl] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("514");
  const [protocol, setProtocol] = useState<"udp" | "tcp" | "tls">("udp");
  const [path, setPath] = useState("/var/log/pulse/streams/pulse.log");
  const [minLevel, setMinLevel] = useState("INFO");

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const config: Record<string, unknown> =
      dest === "http"
        ? { url: url.trim(), method: "POST" }
        : dest === "syslog"
          ? { host: host.trim(), port: Number(port) || 514, protocol }
          : { path: path.trim(), max_bytes: 10_485_760, backup_count: 3 };
    const body: LogStreamBody = {
      name: name.trim(),
      destination_type: dest,
      min_level: minLevel,
      event_categories: [...LOG_EVENT_CATEGORIES],
      config,
    };
    create(body, { onSuccess: onClose });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">New log stream</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelCls}>Name</label>
          <input
            className={inputCls}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Datadog ingest"
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Minimum level</label>
          <select
            className={inputCls}
            value={minLevel}
            onChange={(e) => setMinLevel(e.target.value)}
          >
            <option value="DEBUG">Debug</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Destination</p>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {DESTINATION_OPTIONS.map((opt) => {
            const active = dest === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-3.5 py-3 transition-all ${
                  active
                    ? "border-orange-500 ring-2 ring-orange-100 bg-white"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="destination_type"
                    className="h-3.5 w-3.5 border-slate-300 text-orange-600 focus:ring-orange-500"
                    checked={active}
                    onChange={() => setDest(opt.value)}
                  />
                  <span className="text-sm font-semibold text-slate-800">{opt.label}</span>
                </span>
                <span className="block text-[11px] leading-normal text-slate-500 pl-5">{opt.hint}</span>
              </label>
            );
          })}
        </div>
      </div>

      {dest === "http" && (
        <div className="space-y-1.5">
          <label className={labelCls}>Endpoint URL</label>
          <input
            className={inputCls}
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://logs.example.com/ingest"
          />
        </div>
      )}

      {dest === "syslog" && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-1">
            <label className={labelCls}>Host</label>
            <input
              className={inputCls}
              required
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="syslog.internal"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Port</label>
            <input
              className={inputCls}
              inputMode="numeric"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Protocol</label>
            <select
              className={inputCls}
              value={protocol}
              onChange={(e) => setProtocol(e.target.value as typeof protocol)}
            >
              <option value="udp">UDP</option>
              <option value="tcp">TCP</option>
              <option value="tls">TLS</option>
            </select>
          </div>
        </div>
      )}

      {dest === "file" && (
        <div className="space-y-1.5">
          <label className={labelCls}>File path</label>
          <input
            className={inputCls}
            required
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/var/log/pulse/streams/pulse.log"
          />
          <p className="text-[11px] text-slate-400">
            Must be writable inside the container — mount a volume at this path for persistence.
          </p>
        </div>
      )}

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm w-full sm:w-auto"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Creating…" : "Create stream"}
        </button>
      </div>
    </form>
  );
}

function StreamRow({
  stream,
  onTest,
  onDelete,
  testing,
}: {
  stream: LogStream;
  onTest: () => void;
  onDelete: () => void;
  testing: boolean;
}) {
  const target =
    (stream.config?.url as string | undefined) ||
    (stream.config?.host as string | undefined) ||
    (stream.config?.path as string | undefined) ||
    "—";

  return (
    <div className="flex flex-col gap-4 py-4 sm:px-4 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 border border-orange-100">
          <Radio size={16} className="text-orange-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{stream.name}</p>
          <p className="truncate font-mono text-[11px] text-slate-500 mt-0.5">{target}</p>
          <p className="mt-1 text-[11px] text-slate-400 leading-normal capitalize">
            {stream.destination_type} · {stream.min_level}
            {stream.last_success_at && (
              <>
                {" · last delivery "}
                <span className="text-slate-500">
                  {new Date(stream.last_success_at).toLocaleString()}
                </span>
              </>
            )}
          </p>
          {stream.last_error && (
            <p className="mt-1 text-[11px] font-medium text-rose-600 break-all">
              {stream.last_error}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 sm:ml-auto justify-end sm:justify-start">
        <button
          type="button"
          disabled={testing}
          onClick={onTest}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-colors"
        >
          {testing ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="text-slate-400" />}
          Test
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 shadow-sm transition-colors"
        >
          <Trash2 size={12} />
          Remove
        </button>
      </div>
    </div>
  );
}

export function LogStreamsSettingsTab() {
  const { data: license } = useLicense();
  const { data: streams, isLoading } = useLogStreams();
  const { mutate: test, isPending: testing, variables: testingId } = useTestLogStream();
  const { mutate: remove } = useDeleteLogStream();
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();
  const [showForm, setShowForm] = useState(false);

  if (!hasLicenseFeature(license, "log_streaming")) {
    return <LockedState />;
  }

  const list = streams ?? [];

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Log streams
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Forward structured JSON logs to your SIEM, Syslog collector, or a container volume.
          </p>
        </div>

        {showForm && <StreamForm onClose={() => setShowForm(false)} />}

        <div className="divide-y divide-slate-100 sm:divide-y-0 sm:space-y-3">
          {isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100 my-2" />
            ))}

          {!isLoading && list.length === 0 && !showForm && (
            <div className="flex flex-col items-center py-12 text-center bg-transparent sm:bg-white sm:border sm:border-dashed sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3">
                <Radio size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No log streams configured</p>
              <p className="mt-0.5 max-w-xs text-xs text-slate-400 px-4 leading-normal">
                Send Pulse logs to your observability stack so you can audit, alert, and retain them off-host.
              </p>
            </div>
          )}

          {list.map((s) => (
            <StreamRow
              key={s.id}
              stream={s}
              testing={testing && testingId === s.id}
              onTest={() => test(s.id)}
              onDelete={() =>
                requestDeleteConfirm({
                  title: "Delete log stream",
                  description: `Delete "${s.name}"? Pulse will stop sending logs to this destination.`,
                  confirmLabel: "Delete",
                  onConfirm: () => remove(s.id),
                })
              }
            />
          ))}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            <Plus size={16} className="text-slate-400" /> Add log stream
          </button>
        )}
      </section>

      {deleteConfirmModal}
    </div>
  );
}
