"use client";

import { useEffect, useRef } from "react";

type Options = {
  intervalSeconds: number | null;
  onRefresh: () => void | Promise<void>;
  enabled?: boolean;
};

/**
 * Grafana-style periodic refresh while the dashboard tab is visible.
 */
export function useDashboardAutoRefresh({
  intervalSeconds,
  onRefresh,
  enabled = true,
}: Options) {
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    if (!enabled || !intervalSeconds || intervalSeconds < 1) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      void onRefreshRef.current();
    };

    const start = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(tick, intervalSeconds * 1000);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, intervalSeconds]);
}
