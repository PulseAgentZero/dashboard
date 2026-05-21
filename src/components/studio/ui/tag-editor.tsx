"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
};

export function TagEditor({ tags, onChange, disabled }: Props) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const t = raw.trim().toLowerCase();
    if (!t || tags.includes(t) || tags.length >= 20) return;
    onChange([...tags, t]);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2">
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
        >
          {t}
          {!disabled && (
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
              <X size={12} />
            </button>
          )}
        </span>
      ))}
      {!disabled && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder="Add tag…"
          className="min-w-[80px] flex-1 border-0 bg-transparent text-sm outline-none"
        />
      )}
    </div>
  );
}
