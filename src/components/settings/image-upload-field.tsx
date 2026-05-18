"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_MB = 5;

type Props = {
  label: string;
  hint?: string;
  imageUrl: string | null | undefined;
  fallbackLabel: string;
  shape?: "circle" | "square";
  disabled?: boolean;
  uploading?: boolean;
  onUpload: (file: File) => void;
  onRemove?: () => void;
};

export function ImageUploadField({
  label,
  hint,
  imageUrl,
  fallbackLabel,
  shape = "circle",
  disabled = false,
  uploading = false,
  onUpload,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const displayUrl = preview ?? imageUrl ?? null;
  const initials = fallbackLabel
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleFile(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be ${MAX_MB} MB or smaller`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onUpload(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview(null);
    onRemove?.();
  }

  const frameCls =
    shape === "circle"
      ? "h-20 w-20 rounded-full"
      : "h-20 w-20 rounded-xl";

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-700">{label}</p>
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div
            className={`${frameCls} flex items-center justify-center overflow-hidden border border-slate-200 bg-slate-100`}
          >
            {displayUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-slate-400">{initials}</span>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 size={22} className="animate-spin text-blue-600" />
              </div>
            )}
          </div>
          {!disabled && !uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
              aria-label={`Upload ${label.toLowerCase()}`}
            >
              <Camera size={13} />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {displayUrl ? "Replace image" : "Upload image"}
            </button>
            {displayUrl && onRemove && !disabled && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                <X size={12} />
                Remove
              </button>
            )}
          </div>
          {hint && <p className="mt-2 text-[11px] text-slate-400">{hint}</p>}
          <p className="mt-1 text-[11px] text-slate-400">
            JPEG, PNG, WebP or GIF · max {MAX_MB} MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleChange}
      />
    </div>
  );
}
