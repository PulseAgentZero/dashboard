"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  defaultName: string;
  onClose: () => void;
  onFork: (name: string) => Promise<void>;
};

export function ForkDashboardModal({ open, defaultName, onClose, onFork }: Props) {
  const [name, setName] = useState(defaultName);
  const [pending, setPending] = useState(false);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await onFork(name.trim() || defaultName);
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fork dashboard</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              Fork
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
