"use client";

import { Suspense } from "react";
import OAuthCallbackContent from "./oauth-callback-content";

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[13px] text-slate-500">Loading…</p>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
