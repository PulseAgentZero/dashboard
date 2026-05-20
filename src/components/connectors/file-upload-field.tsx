"use client";

import { useRef } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_ACCEPT = [".csv", ".tsv", ".xlsx", ".xls"];
const DEFAULT_MAX_MB = 500;
const DEFAULT_MAX_FILES = 20;

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

type Props = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  accept?: string[];
  maxMb?: number;
  maxFiles?: number;
  multiple?: boolean;
};

export function FileUploadField({
  files,
  onFilesChange,
  disabled,
  accept = DEFAULT_ACCEPT,
  maxMb = DEFAULT_MAX_MB,
  maxFiles = DEFAULT_MAX_FILES,
  multiple = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acceptSet = new Set(accept.map((e) => e.toLowerCase()));
  const acceptAttr = accept.join(",");

  function validateAndAdd(incoming: File[]): File[] {
    const next = [...files];
    for (const selected of incoming) {
      if (next.length >= maxFiles) {
        toast.error(`You can upload at most ${maxFiles} files at once`);
        break;
      }
      const ext = extensionOf(selected.name);
      if (!acceptSet.has(ext)) {
        toast.error(`${selected.name}: allowed types are ${accept.join(", ")}`);
        continue;
      }
      if (selected.size > maxMb * 1024 * 1024) {
        toast.error(`${selected.name} must be ${maxMb} MB or smaller`);
        continue;
      }
      if (next.some((f) => f.name === selected.name && f.size === selected.size)) {
        continue;
      }
      next.push(selected);
    }
    return next;
  }

  function handlePickList(incoming: FileList | null) {
    if (!incoming?.length) return;
    const added = validateAndAdd(Array.from(incoming));
    if (added.length !== files.length) onFilesChange(added);
  }

  function removeAt(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">
        Data file{multiple ? "s" : ""}
        <span className="ml-0.5 text-rose-500">*</span>
      </label>
      <p className="mb-2 text-xs text-slate-500">
        CSV, TSV, or Excel (.xlsx / .xls) with a header row. Each file becomes its own
        connection and is queryable in Studio. Excel workbooks import each sheet as a
        table. Up to {maxMb} MB per file
        {multiple ? `, ${maxFiles} files per upload` : ""}.
      </p>

      {files.length > 0 && (
        <ul className="mb-3 space-y-2">
          {files.map((file, index) => {
            const isExcel = /\.(xlsx|xls)$/i.test(file.name);
            return (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <FileSpreadsheet size={20} className="shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(file.size)}
                    {isExcel ? " · sheets become tables" : ""}
                  </p>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {(files.length === 0 || multiple) && (
        <button
          type="button"
          disabled={disabled || (multiple && files.length >= maxFiles)}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40 disabled:opacity-50"
        >
          <Upload size={22} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            {files.length === 0
              ? "Click to upload"
              : multiple
                ? "Add more files"
                : "Replace file"}
          </span>
          <span className="text-xs text-slate-500">
            {accept.join(", ")} — up to {maxMb} MB each
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handlePickList(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
