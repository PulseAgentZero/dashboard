"use client";

import Link from "next/link";
import { ArrowUpRight, BarChart3, CheckCircle2 } from "lucide-react";
import type {
  ApplyChangesArtifact,
  BuildDashboardArtifact,
} from "@/lib/api/agent-api";

export function DashboardBuiltCard({
  artifact,
  variant = "build",
}: {
  artifact: BuildDashboardArtifact | ApplyChangesArtifact;
  variant?: "build" | "apply";
}) {
  const dashboard =
    variant === "build"
      ? (artifact as BuildDashboardArtifact).dashboard
      : {
          id: (artifact as ApplyChangesArtifact).dashboard_id,
          name: (artifact as ApplyChangesArtifact).dashboard_name,
        };

  if (!dashboard?.id) return null;

  const href = `/dashboard/studio/dashboards/${dashboard.id}`;
  const applied =
    variant === "apply" ? (artifact as ApplyChangesArtifact).applied : null;

  return (
    <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 shadow-xs">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white">
        <CheckCircle2 size={13} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-emerald-900">
          {variant === "build"
            ? "Dashboard created"
            : `${applied?.length ?? 0} change${(applied?.length ?? 0) === 1 ? "" : "s"} applied`}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-emerald-800/80">
          {dashboard.name || "Open it to start exploring"}
          {variant === "build" &&
            (artifact as BuildDashboardArtifact).dashboard?.chart_count != null &&
            ` · ${(artifact as BuildDashboardArtifact).dashboard?.chart_count} chart${
              (artifact as BuildDashboardArtifact).dashboard?.chart_count === 1
                ? ""
                : "s"
            }`}
        </p>
      </div>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:bg-emerald-700"
      >
        <BarChart3 size={11} />
        Open
        <ArrowUpRight size={11} />
      </Link>
    </div>
  );
}
