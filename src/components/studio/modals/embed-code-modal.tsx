"use client";

import { Copy, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  embedUrl: string;
  token: string;
  expiresAt: string;
  onClose: () => void;
};

export function EmbedCodeModal({ open, embedUrl, token, expiresAt, onClose }: Props) {
  if (!open) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const iframeSrc = `${origin}/embed/studio/${token}`;
  const snippet = `<iframe src="${iframeSrc}" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Embed code</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="mb-2 text-xs text-slate-500">Expires {new Date(expiresAt).toLocaleString()}</p>
        <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">{snippet}</pre>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(snippet);
            toast.success("Copied to clipboard");
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <Copy size={14} />
          Copy iframe code
        </button>
        <p className="mt-3 text-xs text-slate-400 break-all">API: {embedUrl}</p>
      </div>
    </div>
  );
}
