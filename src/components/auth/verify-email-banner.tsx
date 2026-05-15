"use client";

import { Mail } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";

export default function VerifyEmailBanner() {
  const { user } = useAuth();
  const { mutate: resend, isPending } = useResendVerification();

  if (!user || user.is_verified) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
      <div className="flex items-center gap-2">
        <Mail size={16} className="shrink-0" />
        <span>
          Please verify your email address. Check your inbox for a confirmation
          link.
        </span>
      </div>
      <button
        type="button"
        onClick={() => resend()}
        disabled={isPending}
        className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[12px] font-medium text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Resend email"}
      </button>
    </div>
  );
}
