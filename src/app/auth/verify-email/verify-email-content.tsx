"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import AuthLayout from "@/components/auth/auth-layout";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { FIRST_RUN_PENDING_KEY } from "@/lib/tour/first-run";

type VerifyState = "idle" | "loading" | "success" | "error";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refetch } = useAuth();
  const token = searchParams.get("token");
  const notice = searchParams.get("notice");

  const [state, setState] = useState<VerifyState>(token ? "loading" : "idle");
  const [message, setMessage] = useState("");
  const called = useRef(false);
  const { mutate: resend, isPending: resending } = useResendVerification();

  useEffect(() => {
    if (!token || called.current) return;
    called.current = true;

    (async () => {
      try {
        const res = await authApi.verifyEmail(token);
        setState("success");
        setMessage(res.message);
        refetch();
      } catch (err) {
        setState("error");
        setMessage(
          err instanceof ApiError ? err.message : "Verification failed",
        );
      }
    })();
  }, [token, refetch]);

  function handleContinue() {
    sessionStorage.setItem(FIRST_RUN_PENDING_KEY, "1");
    router.push("/dashboard");
  }

  if (token) {
    return (
      <AuthLayout
        title="Email verification"
        subtitle="Confirming your email address"
      >
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center">
          {state === "loading" && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange-500" />
              <p className="mt-4 text-[13px] text-slate-500">Verifying…</p>
            </>
          )}
          {state === "success" && (
            <>
              <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-4 text-[13px] font-medium text-slate-800">
                {message}
              </p>
              <button
                type="button"
                onClick={handleContinue}
                className="mt-6 w-full flex justify-center rounded-xl bg-orange-600 py-3 text-[13px] font-semibold text-white hover:bg-orange-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-orange-500 transition duration-150"
              >
                Continue
              </button>
            </>
          )}
          {state === "error" && (
            <>
              <XCircle className="mx-auto h-10 w-10 text-red-500" />
              <p className="mt-4 text-[13px] text-slate-700">{message}</p>
              <Link
                href="/auth/login"
                className="mt-6 inline-block text-[13px] font-medium text-orange-600 hover:text-orange-500"
              >
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle="We sent you a verification link"
    >
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
          <Mail className="h-6 w-6 text-orange-500" />
        </div>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {notice
            ? "Your account was created. Open the link in your email to verify your address before continuing."
            : "Open the verification link from your email to activate your account."}
        </p>
        <p className="mt-5 text-[12px] text-slate-400">Didn&apos;t get the email?</p>
        <button
          type="button"
          onClick={() => resend()}
          disabled={resending}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resending ? "Sending…" : "Resend verification email"}
        </button>
        <p className="mt-4 text-[12px] text-slate-500">
          Already verified?{" "}
          <Link href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
