"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { tokens } from "@/lib/auth-tokens";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isError } = useAuth();

  const hasToken = typeof window !== "undefined" && !!tokens.getAccess();

  // console.log("[AuthGuard] render — hasToken:", hasToken, "isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "isError:", isError);

  useEffect(() => {
    //console.log("[AuthGuard] effect — hasToken:", hasToken, "isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "isError:", isError);
    if (!hasToken) {
      //console.log("[AuthGuard] no token → redirect login");
      router.replace("/auth/login");
      return;
    }
    if (isError && !isLoading) {
      router.replace("/auth/login");
      return;
    }
    if (!isLoading && !isAuthenticated) {
      //console.log("[AuthGuard] not loading & not authenticated → redirect login");
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

  if (isLoading || (!isAuthenticated && !isError)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
