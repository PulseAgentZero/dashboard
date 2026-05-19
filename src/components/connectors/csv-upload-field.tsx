"use client";

import { useRef } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { toast } from "sonner";

const ACCEPT = ".csv,text/csv,application/vnd.ms-excel";
const MAX_MB = 50;

type Props = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
};

export function CsvUploadField({ file, onFileChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePick(selected: File) {
    const name = selected.name.toLowerCase();
    if (!name.endsWith(".csv")) {
      toast.error("Please choose a .csv file");
      return;
    }
    if (selected.size > MAX_MB * 1024 * 1024) {
      toast.error(`CSV must be ${MAX_MB} MB or smaller`);
      return;
    }
    onFileChange(selected);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (picked) handlePick(picked);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">
        CSV file
        <span className="ml-0.5 text-rose-500">*</span>
      </label>
      <p className="mb-2 text-xs text-slate-500">
        UTF-8 with a header row. Maximum {MAX_MB} MB.
      </p>

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <FileSpreadsheet size={20} className="shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40 disabled:opacity-50"
        >
          <Upload size={22} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            Click to upload CSV
          </span>
          <span className="text-xs text-slate-500">.csv only, up to {MAX_MB} MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={handleChange}
      />

      {file && !disabled && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Replace file
        </button>
      )}
    </div>
  );
}
