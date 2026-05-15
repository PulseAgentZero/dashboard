"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/auth-guard";
import { useAuth } from "@/providers/auth-provider";

function VerificationGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !user.is_verified) {
      router.replace("/auth/verify-email?notice=1");
    }
  }, [isLoading, user, router]);

  if (!isLoading && user && !user.is_verified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Please verify your email to continue…</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <VerificationGate>
        {children}
      </VerificationGate>
    </AuthGuard>
  );
}
