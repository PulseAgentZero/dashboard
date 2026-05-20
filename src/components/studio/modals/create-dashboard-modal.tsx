"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => Promise<void>;
};

export function CreateDashboardModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setPending(true);
    try {
      await onCreate(name.trim(), description.trim());
      setName("");
      setDescription("");
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    /* Backing screen filter with backdrop blur to lock focus cleanly on mobile devices */
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-xs sm:items-center">
      <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">New dashboard</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Executive Q2 Overview"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 transition-all"
              required
              disabled={pending}
            />
          </label>
          
          <label className="block text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional summary of this dashboard's core insights..."
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 transition-all resize-none"
              disabled={pending}
            />
          </label>
          
          {/* Action Footer Buttons: Stacked layout for effortless mobile thumb reach */}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-2 sm:pt-0">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={pending}
              className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || !name.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 shadow-xs transition-colors"
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}