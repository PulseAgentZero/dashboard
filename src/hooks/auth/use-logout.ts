"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { tokens } from "@/lib/auth-tokens";

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refresh = tokens.getRefresh();
      if (refresh) {
        try {
          await authApi.logout(refresh);
        } catch {
          // Clear local session even if revoke fails
        }
      }
    },
    onSettled() {
      tokens.clear();
      qc.removeQueries({ queryKey: ["me"] });
      if (typeof window !== "undefined") {
        // Defensive: drop any per-org UI session flags so the next user
        // signing in on this tab starts with a clean slate (setup banner,
        // future per-tab toggles, etc.).
        const ss = window.sessionStorage;
        for (let i = ss.length - 1; i >= 0; i--) {
          const key = ss.key(i);
          if (key && key.startsWith("pulse_setup_banner_dismissed")) {
            ss.removeItem(key);
          }
        }
      }
      router.push("/auth/login");
    },
  });
}
