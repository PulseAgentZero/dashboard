import { Suspense } from "react";
import { PlanPage } from "@/components/plan/plan-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl animate-pulse space-y-6 p-8">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-100" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-56 rounded-2xl bg-slate-100" />
            <div className="h-56 rounded-2xl bg-slate-100" />
          </div>
        </div>
      }
    >
      <PlanPage />
    </Suspense>
  );
}
