"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDocsTheme } from "./docs-theme-provider";

type Props = {
  chart: string;
};

export function MermaidDiagram({ chart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const { theme } = useDocsTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    async function render() {
      setError(null);
      el!.innerHTML = "";

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "neutral",
          securityLevel: "strict",
          fontFamily: "inherit",
        });

        const { svg } = await mermaid.render(
          `mermaid-${reactId}-${Date.now()}`,
          chart.trim(),
        );

        if (!cancelled) {
          el!.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, theme, reactId]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
        <p className="mb-2 text-sm font-medium text-rose-800 dark:text-rose-300">
          Could not render diagram
        </p>
        <pre className="overflow-x-auto text-xs text-rose-700 dark:text-rose-400">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="docs-mermaid -mx-1 my-6 max-w-[100vw] overflow-x-auto rounded-lg border border-zinc-200 bg-white p-3 sm:mx-0 sm:max-w-none sm:p-6 dark:border-zinc-700 dark:bg-zinc-900 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      aria-label="Diagram"
    />
  );
}
