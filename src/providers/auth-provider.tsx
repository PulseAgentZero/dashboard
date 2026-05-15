"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  const { data, isLoading, isFetching, isError, refetch } = useMe();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!tokens.getAccess());
  }, [data]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data?.user,
      org: data?.org,
      isLoading: hasToken && (isLoading || isFetching),
      isAuthenticated: !!data?.user && hasToken,
      isError,
      refetch: () => {
        void refetch();
      },
    }),
    [data, hasToken, isLoading, isFetching, isError, refetch],
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
