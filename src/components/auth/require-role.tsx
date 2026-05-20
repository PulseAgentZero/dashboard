"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { hasMinRole, type Role } from "@/lib/permissions";
import { useAuth } from "@/providers/auth-provider";

export function RequireRole({
  minRole,
  children,
}: {
  minRole: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const allowed = hasMinRole(user?.role, minRole);

  useEffect(() => {
    if (isLoading) return;
    if (!allowed) {
      toast.error("You don't have access to this page.");
      router.replace("/dashboard");
    }
  }, [isLoading, allowed, router]);

  if (isLoading || !allowed) return null;
  return <>{children}</>;
}
