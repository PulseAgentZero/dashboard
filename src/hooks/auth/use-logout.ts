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
      router.push("/auth/login");
    },
  });
}
