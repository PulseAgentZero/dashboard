"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { CronBuilder } from "@/components/studio/ui/cron-builder";
import { TagEditor } from "@/components/studio/ui/tag-editor";
import { StudioConnectionPicker } from "@/components/studio/ui/studio-connection-picker";
import { sqlParamsToDefinitions } from "@/lib/studio/parse-sql-params";
import type { QueryParamDefinition } from "@/types/studio";

type Props = {
  open: boolean;
  sql: string;
  initial?: {
    name?: string;
    description?: string | null;
    connection_id?: string | null;
    tags?: string[];
    params?: QueryParamDefinition[];
    refresh_cron?: string | null;
    refresh_enabled?: boolean;
  };
  connectionId: string | null;
  onConnectionChange: (id: string) => void;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    description: string | null;
    sql_text: string;
    connection_id: string | null;
    params: QueryParamDefinition[];
    tags: string[];
    refresh_cron: string | null;
    refresh_enabled: boolean;
  }) => Promise<void>;
};

export function SaveQueryModal({
  open,
  sql,
  initial,
  connectionId,
  onConnectionChange,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [params, setParams] = useState<QueryParamDefinition[]>([]);
  const [cron, setCron] = useState("0 9 * * *");
  const [cronEnabled, setCronEnabled] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setTags(initial?.tags ?? []);
    setParams(sqlParamsToDefinitions(sql, initial?.params ?? []));
    setCron(initial?.refresh_cron ?? "0 9 * * *");
    setCronEnabled(initial?.refresh_enabled ?? false);
  }, [open, sql, initial]);

  useEffect(() => {
    setParams(sqlParamsToDefinitions(sql, params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sql]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
        sql_text: sql,
        connection_id: connectionId,
        params,
        tags,
        refresh_cron: cronEnabled ? cron : null,
        refresh_enabled: cronEnabled,
      });
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Save query</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <StudioConnectionPicker
            value={connectionId}
            onChange={onConnectionChange}
            disabled={pending}
          />
          <label className="block text-sm">
            <span className="font-medium">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <div>
            <span className="text-sm font-medium">Tags</span>
            <TagEditor tags={tags} onChange={setTags} />
          </div>
          {params.length > 0 && (
            <div>
              <span className="text-sm font-medium">Parameters</span>
              <div className="mt-2 space-y-2">
                {params.map((p, i) => (
                  <div key={p.name} className="grid grid-cols-3 gap-2 text-xs">
                    <input
                      value={p.name}
                      readOnly
                      className="rounded border bg-slate-50 px-2 py-1 font-mono"
                    />
                    <select
                      value={p.type}
                      onChange={(e) => {
                        const next = [...params];
                        next[i] = { ...p, type: e.target.value as QueryParamDefinition["type"] };
                        setParams(next);
                      }}
                      className="rounded border px-2 py-1"
                    >
                      <option value="text">text</option>
                      <option value="number">number</option>
                      <option value="date">date</option>
                      <option value="datetime">datetime</option>
                    </select>
                    <input
                      value={p.default_value ?? ""}
                      placeholder="default"
                      onChange={(e) => {
                        const next = [...params];
                        next[i] = { ...p, default_value: e.target.value };
                        setParams(next);
                      }}
                      className="rounded border px-2 py-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <CronBuilder
            value={cron}
            enabled={cronEnabled}
            onChange={setCron}
            onEnabledChange={setCronEnabled}
          />
          <p className="text-xs text-slate-500">
            Background cache refresh on the server (cron). For live viewing, set refresh on the
            Studio dashboard toolbar.
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
