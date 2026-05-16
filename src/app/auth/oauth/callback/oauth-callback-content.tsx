"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";

export default function OAuthCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const access = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (!access || !refresh) {
      toast.error("Google sign-in failed. Please try again.");
      router.replace("/auth/login");
      return;
    }

    tokens.set(access, refresh);

    authApi
      .me()
      .then((me) => {
        qc.setQueryData(["me"], me);
        postAuthRedirect(me.org, router, me.user);
      })
      .catch(() => {
        tokens.clear();
        toast.error("Sign-in failed. Please try again.");
        router.replace("/auth/login");
      });
  }, [params, router, qc]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center space-y-3">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
        <p className="text-[13px] text-slate-600">Signing you in…</p>
      </div>
    </div>
  );
}
