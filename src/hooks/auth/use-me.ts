"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { tokens } from "@/lib/auth-tokens";

export function useMe() {
  const pathname = usePathname();
  // Never fetch the current user on auth/marketing pages. A stale access token
  // in localStorage there would trigger a 401 → refresh → fallback to a hard
  // reload to /auth/login, which cancels the in-flight POST /auth/login the
  // user just submitted and traps them on the form.
  const onPublicPage =
    !!pathname &&
    (pathname.startsWith("/auth") || pathname === "/" || pathname.startsWith("/p/"));

  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    enabled:
      typeof window !== "undefined" &&
      !onPublicPage &&
      !!tokens.getAccess(),
    staleTime: 5 * 60 * 1000,
  });
}
