"use client";

import { Suspense } from "react";
import SsoCallbackContent from "./sso-callback-content";

export default function SsoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[13px] text-slate-500">Loading…</p>
        </div>
      }
    >
      <SsoCallbackContent />
    </Suspense>
  );
}
