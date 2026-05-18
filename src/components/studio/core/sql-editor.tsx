"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { SchemaTable } from "@/types/studio";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Props = {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  tables?: SchemaTable[];
  readOnly?: boolean;
  height?: string;
};

export function SQLEditor({
  value,
  onChange,
  onRun,
  tables = [],
  readOnly,
  height = "280px",
}: Props) {
  const suggestions = useMemo(() => {
    const items: { label: string; kind: number; insertText: string }[] = [];
    for (const t of tables) {
      items.push({ label: t.name, kind: 8, insertText: t.name });
      for (const c of t.columns) {
        items.push({
          label: `${t.name}.${c.name}`,
          kind: 9,
          insertText: c.name,
        });
      }
    }
    return items;
  }, [tables]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <MonacoEditor
        height={height}
        language="sql"
        theme="vs"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
        }}
        onMount={(editor, monaco) => {
          editor.addAction({
            id: "run-query",
            label: "Run Query",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            run: () => onRun?.(),
          });
          if (suggestions.length) {
            monaco.languages.registerCompletionItemProvider("sql", {
              provideCompletionItems: () => ({
                suggestions: suggestions.map((s) => ({
                  label: s.label,
                  kind: s.kind,
                  insertText: s.insertText,
                })),
              }),
            });
          }
        }}
      />
    </div>
  );
}
