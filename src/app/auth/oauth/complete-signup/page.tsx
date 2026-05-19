"use client";

import { Suspense } from "react";
import CompleteSignupContent from "./complete-signup-content";

export default function CompleteSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[13px] text-slate-500">Loading…</p>
        </div>
      }
    >
      <CompleteSignupContent />
    </Suspense>
  );
}
