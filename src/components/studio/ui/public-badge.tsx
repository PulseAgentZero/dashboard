"use client";

import { Copy, Globe } from "lucide-react";
import { toast } from "sonner";

type Props = {
  slug: string | null;
  isPublic: boolean;
};

export function PublicBadge({ slug, isPublic }: Props) {
  if (!isPublic || !slug) return null;

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${slug}`
      : `/p/${slug}`;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
      <Globe size={14} className="text-emerald-600" />
      <span className="font-medium text-emerald-800">Public</span>
      <code className="flex-1 truncate text-xs text-emerald-700">{url}</code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          toast.success("Link copied");
        }}
        className="rounded p-1 hover:bg-emerald-100"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}
