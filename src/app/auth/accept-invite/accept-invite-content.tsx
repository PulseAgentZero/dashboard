"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { tokens } from "@/lib/auth-tokens";
import { ApiError } from "@/lib/api/client";
import { BladeFan } from "../../../../public/icon/bladeFan";
import { acceptInviteSchema, useFormValidation } from "@/lib/validation";
import { FieldError } from "@/components/ui/field-error";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400";

const inputErrorCls =
  "w-full rounded-xl border border-rose-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-1 focus:ring-rose-400 placeholder:text-slate-400";

export function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();

  const [form, setForm] = useState({ full_name: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const { fieldErrors, clearErrors, validate, applyApiErrors } = useFormValidation();

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-rose-50">
            <AlertTriangle size={22} className="text-rose-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Invalid invite link</h1>
          <p className="mt-2 text-sm text-slate-500">
            This invitation link is missing a token. Please use the link from your invitation email.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    clearErrors();

    const payload = validate(acceptInviteSchema, form);
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await authApi.acceptInvite({
        token,
        full_name: payload.full_name,
        password: payload.password,
      });
      tokens.set(res.access_token, res.refresh_token);
      setDone(true);
      setTimeout(() => router.replace("/dashboard"), 1500);
    } catch (err) {
      if (applyApiErrors(err)) {
        setError(err instanceof ApiError ? err.message : "");
        return;
      }
      if (err instanceof ApiError) {
        const msg = err.message ?? "";
        const isExists =
          err.status === 409 ||
          msg.toLowerCase().includes("already exists") ||
          msg.toLowerCase().includes("already registered") ||
          err.code === "USER_EXISTS";
        if (isExists) {
          setError("__exists__");
        } else {
          setError(msg || "Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50">
            <CheckCircle2 size={22} className="text-emerald-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Welcome to Entivia!</h1>
          <p className="mt-2 text-sm text-slate-500">Account created. Taking you to the dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center">
            <BladeFan />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Accept your invitation</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Set up your account to join your team on Entivia.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full name</label>
              <input
                className={fieldErrors.full_name ? inputErrorCls : inputCls}
                placeholder="Your full name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                required
                autoFocus
                aria-invalid={Boolean(fieldErrors.full_name)}
              />
              <FieldError message={fieldErrors.full_name} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className={`${fieldErrors.password ? inputErrorCls : inputCls} pr-10`}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError message={fieldErrors.password} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Confirm password</label>
              <input
                type="password"
                className={fieldErrors.confirm ? inputErrorCls : inputCls}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                required
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.confirm)}
              />
              <FieldError message={fieldErrors.confirm} />
            </div>

            {error === "__exists__" ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <p className="font-semibold text-amber-800">Account already exists</p>
                <p className="mt-0.5 text-amber-700">
                  This email is already registered. Please{" "}
                  <Link href="/auth/login" className="font-semibold underline">sign in</Link>
                  {" "}and your invitation will be applied automatically.
                </p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle size={15} className="shrink-0" />
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !form.full_name || !form.password || !form.confirm}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isLoading ? "Creating account…" : "Create account & join"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
