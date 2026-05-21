"use client";

import { Suspense } from "react";
import VerifyEmailContent from "./verify-email-content";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
