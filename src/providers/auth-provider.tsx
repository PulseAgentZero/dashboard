"use client";

import { createContext, useContext, useMemo } from "react";
import { useMe } from "@/hooks/auth/use-me";
import { tokens } from "@/lib/auth-tokens";
import type { MeResponse } from "@/types/auth";

type AuthContextValue = {
  user: MeResponse["user"] | undefined;
  org: MeResponse["org"] | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, isError, refetch } = useMe();
  const hasToken = typeof window !== "undefined" && !!tokens.getAccess();

  console.log("[AuthProvider] render — hasToken:", hasToken, "isPending:", isPending, "isError:", isError, "data:", !!data);

  // When the user just logged in, `enabled` flips from false to true and React
  // Query schedules the fetch in a useEffect. During that first render
  // `isLoading` is still false but `data` is undefined — using `isPending`
  // covers both the "not yet started" and "currently fetching" states.
  const value = useMemo<AuthContextValue>(
    () => ({
      user: data?.user,
      org: data?.org,
      isLoading: hasToken && isPending && !isError,
      isAuthenticated: !!data?.user && hasToken,
      isError,
      refetch: () => {
        void refetch();
      },
    }),
    [data, hasToken, isPending, isError, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
