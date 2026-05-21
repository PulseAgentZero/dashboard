"use client";

import { useAuth } from "@/providers/auth-provider";

/** True when the user is authenticated and /auth/me has finished loading. */
export function useAuthEnabled() {
  const { isAuthenticated, isLoading } = useAuth();
  return isAuthenticated && !isLoading;
}
