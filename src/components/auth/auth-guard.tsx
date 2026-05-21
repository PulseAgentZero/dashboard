"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { tokens } from "@/lib/auth-tokens";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isError } = useAuth();

  const hasToken = typeof window !== "undefined" && !!tokens.getAccess();

  useEffect(() => {
    if (!hasToken || isError || (!isLoading && !isAuthenticated)) {
      router.replace("/auth/login");
    }
  }, [router, isError, hasToken, isLoading, isAuthenticated]);

  if (!hasToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Redirecting to sign in…</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
