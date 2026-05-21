"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  children: string;
  language?: string;
};

export function CodeBlock({ children, language }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative my-4 max-w-full min-w-0">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-zinc-200 bg-zinc-100 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {language ?? "bash"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-b-lg border border-zinc-200 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-100 sm:p-4 sm:text-[13px] dark:border-zinc-700">
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}
