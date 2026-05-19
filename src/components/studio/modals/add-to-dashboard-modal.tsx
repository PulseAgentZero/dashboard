"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useStudioDashboards } from "@/hooks/studio/use-studio-dashboards";

type Props = {
  open: boolean;
  vizName: string;
  onClose: () => void;
  onPick: (dashboardId: string) => Promise<void>;
};

export function AddToDashboardModal({ open, vizName, onClose, onPick }: Props) {
  const { data, isLoading } = useStudioDashboards({ limit: 50 });
  const [pending, setPending] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <ModalHeader onClose={onClose} />
        <p className="px-4 pt-3 text-sm text-slate-500">
          Add &quot;{vizName}&quot; to a dashboard:
        </p>
        <div className="max-h-64 overflow-y-auto p-4">
          {isLoading && <Loader2 className="mx-auto animate-spin text-indigo-500" size={24} />}
          {!isLoading &&
            data?.dashboards.map((d) => (
              <button
                key={d.id}
                type="button"
                disabled={!!pending}
                onClick={() => {
                  setPending(d.id);
                  void onPick(d.id).finally(() => {
                    setPending(null);
                    onClose();
                  });
                }}
                className="mb-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:border-indigo-300 hover:bg-indigo-50"
              >
                {d.name}
                {pending === d.id && <Loader2 size={14} className="animate-spin" />}
              </button>
            ))}
          {!isLoading && !data?.dashboards.length && (
            <p className="text-sm text-slate-400">No dashboards yet. Create one from Studio home.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <h2 className="font-semibold">Add to dashboard</h2>
      <button type="button" onClick={onClose} aria-label="Close">
        <X size={20} />
      </button>
    </div>
  );
}
