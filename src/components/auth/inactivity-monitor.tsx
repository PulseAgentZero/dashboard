"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLogout } from "@/hooks/auth/use-logout";

const IDLE_TIMEOUT_MS = 20 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 1000;

/**
 * Signs the user out after 20 minutes without pointer, keyboard, scroll, or touch activity.
 */
export function InactivityMonitor() {
  const { mutate: logout } = useLogout();
  const deadlineRef = useRef<number>(Date.now() + IDLE_TIMEOUT_MS);
  const lastActivityRef = useRef<number>(Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    const resetDeadline = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < ACTIVITY_THROTTLE_MS) return;
      lastActivityRef.current = now;
      deadlineRef.current = now + IDLE_TIMEOUT_MS;
    };

    const events: (keyof WindowEventMap)[] = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];
    for (const ev of events) {
      window.addEventListener(ev, resetDeadline, { passive: true });
    }

    const interval = window.setInterval(() => {
      if (firedRef.current) return;
      if (Date.now() >= deadlineRef.current) {
        firedRef.current = true;
        toast.info("Signed out due to inactivity");
        logout();
      }
    }, 10_000);

    return () => {
      for (const ev of events) {
        window.removeEventListener(ev, resetDeadline);
      }
      window.clearInterval(interval);
    };
  }, [logout]);

  return null;
}
