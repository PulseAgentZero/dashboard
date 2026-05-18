"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studioApi } from "@/lib/api/studio-api";
import type { StudioQueryRun } from "@/types/studio";

const TERMINAL = new Set(["completed", "failed", "cancelled"]);
const MAX_POLL_MS = 5 * 60_000;

function pollInterval(elapsedMs: number): number {
  return elapsedMs < 10_000 ? 1000 : 3000;
}

export function useStudioRun(runId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["studio", "run", runId],
    queryFn: () => studioApi.getRun(runId!),
    enabled: !!runId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || TERMINAL.has(status)) return false;
      return 2000;
    },
  });
}

export function useRunPoller(runId: string | null) {
  const [run, setRun] = useState<StudioQueryRun | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!runId) {
      setRun(null);
      setIsPolling(false);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    startRef.current = Date.now();
    setIsPolling(true);

    async function poll() {
      if (cancelled) return;
      const elapsed = Date.now() - startRef.current;
      if (elapsed > MAX_POLL_MS) {
        setIsPolling(false);
        return;
      }
      try {
        const data = await studioApi.getRun(runId!);
        if (cancelled) return;
        setRun(data);
        if (TERMINAL.has(data.status)) {
          setIsPolling(false);
          return;
        }
        timeoutId = setTimeout(poll, pollInterval(elapsed));
      } catch {
        if (!cancelled) setIsPolling(false);
      }
    }

    void poll();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [runId]);

  return { run, isPolling };
}
