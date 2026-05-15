"use client";

import Link from "next/link";
import { Mails } from "lucide-react";
import AuthLayout from "@/components/auth/auth-layout";
import FormField from "@/components/ui/form-field";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    mutate(email);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to choose a new password"
    >
      {isSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-[13px] text-emerald-800">
          If that email exists in our system, a reset link has been sent. Check
          your inbox.
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormField
            id="email"
            name="email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            icon={Mails}
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-center text-[13px] text-slate-600">
        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
