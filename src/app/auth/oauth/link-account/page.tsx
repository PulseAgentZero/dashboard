"use client";

import { Suspense } from "react";
import LinkAccountContent from "./link-account-content";

export default function LinkAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-[13px] text-slate-500">Loading…</p>
        </div>
      }
    >
      <LinkAccountContent />
    </Suspense>
  );
}
