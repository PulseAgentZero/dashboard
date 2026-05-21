"use client";

import { useState } from "react";
import { Copy, Key, Plus, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "@/hooks/apikeys/use-apikeys";
import { useUsage } from "@/hooks/usage/use-usage";

import { UsageBar } from "@/components/shared/usage-bar";


function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (key: string) => void }) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState("read");
  const { mutateAsync, isPending } = useCreateApiKey();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await mutateAsync({ name: name.trim(), scope });
      onCreated((res as { key: string }).key);
    } catch {
      // error handled by hook
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Create API Key</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production Read Key"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="read">Read — GET endpoints only</option>
              <option value="write">Write — GET + POST/PATCH</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Creating…" : "Create Key"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewKeyModal({ rawKey, onClose }: { rawKey: string; onClose: () => void }) {
  function copy() {
    void navigator.clipboard.writeText(rawKey);
    toast.success("Key copied to clipboard");
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-amber-600">
          <TriangleAlert size={16} />
          <h2 className="text-sm font-semibold">Copy your key now</h2>
        </div>
        <p className="mb-4 text-xs text-slate-500">
          This key will not be shown again. Store it somewhere safe.
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
          <code className="flex-1 break-all text-xs text-slate-800">{rawKey}</code>
          <button onClick={copy} className="shrink-0 text-slate-400 hover:text-slate-700">
            <Copy size={14} />
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          I've copied it, close
        </button>
      </div>
    </div>
  );
}

export function ApiKeysPage() {
  const { data: keysData, isLoading } = useApiKeys();
  const { data: usage } = useUsage();
  const { mutate: revoke, isPending: isRevoking } = useRevokeApiKey();
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const keys = keysData ?? [];

  const slot = usage?.limits?.api_keys;
  const atLimit = slot ? (slot.limit !== null && slot.used >= slot.limit) : false;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">API Keys</h1>
          <p className="mt-1 text-sm text-slate-500">
            Authenticate requests to the Entivia public API using these keys.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          disabled={atLimit}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          New key
        </button>
      </div>

      {slot && (
        <UsageBar used={slot.used} limit={slot.limit} label="API keys used" />
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
          <Key size={24} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm text-slate-500">No API keys yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Create a key to start using the Entivia public API.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {keys.map((k) => (
            <div key={k.id} className="flex flex-col gap-3 px-4 py-3.5 md:flex-row md:items-center md:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Key size={14} className="text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{k.name}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <code className="text-xs text-slate-400">{k.key_prefix}…</code>
                  <span
                    className={`rounded px-1.5 py-px text-[10px] font-medium uppercase tracking-wide ${
                      k.scope === "write"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {k.scope}
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-xs text-slate-400 md:shrink-0 md:text-right">
                <p>
                  {k.last_used_at
                    ? `Last used ${new Date(k.last_used_at).toLocaleDateString()}`
                    : "Never used"}
                </p>
                {k.expires_at && (
                  <p>Expires {new Date(k.expires_at).toLocaleDateString()}</p>
                )}
              </div>
              <button
                onClick={() => revoke(k.id)}
                disabled={isRevoking}
                className="shrink-0 rounded p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                title="Revoke key"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700">Using your API key</p>
        <p className="mt-1">Pass the key in the <code className="rounded bg-slate-200 px-1">X-API-Key</code> header:</p>
        <pre className="mt-2 overflow-x-auto rounded bg-slate-100 p-2">
          <code className="block whitespace-pre text-[11px] text-slate-600">{`curl https://api.yourpulse.io/api/public/v1/entities \\
  -H "X-API-Key: pk_read_…"`}</code>
        </pre>
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={(key) => {
            setShowCreate(false);
            setNewKey(key);
          }}
        />
      )}
      {newKey && <NewKeyModal rawKey={newKey} onClose={() => setNewKey(null)} />}
    </div>
  );
}
