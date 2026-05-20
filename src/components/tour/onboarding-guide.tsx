"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronUp, Circle, X, Zap } from "lucide-react";
import { useCompleteTourGuide, useTourGuideState } from "@/hooks/tour/use-tour-guide";
import { useConnections } from "@/hooks/connections/use-connections";
import { useAuth } from "@/providers/auth-provider";

type StepId = "connect" | "schema" | "pipeline" | "entities" | "alert";

const STEPS: {
  id: StepId;
  title: string;
  desc: string;
  href: string;
}[] = [
  {
    id: "connect",
    title: "Connect a data source",
    desc: "Link a database, warehouse, or file",
    href: "/dashboard/connections/new",
  },
  {
    id: "schema",
    title: "Map your schema",
    desc: "Tell Entivia which fields matter",
    href: "/dashboard/schema-mappings",
  },
  {
    id: "pipeline",
    title: "Run your first pipeline",
    desc: "Score and profile your entities",
    href: "/dashboard/pipeline",
  },
  {
    id: "entities",
    title: "Explore your entities",
    desc: "Browse risk scores and segments",
    href: "/dashboard/entities",
  },
  {
    id: "alert",
    title: "Set up an alert",
    desc: "Get notified when risk changes",
    href: "/dashboard/alerts",
  },
];

export function OnboardingGuide() {
  const { isLoading, completed } = useTourGuideState();
  const { mutate: completeTour } = useCompleteTourGuide();
  const { org } = useAuth();
  const { data: connections } = useConnections();

  const storageKey = `entivia_onboarding_${org?.id ?? "default"}`;

  const [collapsed, setCollapsed] = useState(false);
  const [manualDone, setManualDone] = useState<Set<StepId>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setManualDone(new Set(JSON.parse(saved) as StepId[]));
    } catch {}
  }, [storageKey]);

  function markDone(id: StepId) {
    setManualDone((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  function isStepDone(id: StepId): boolean {
    if (id === "connect") {
      return (
        connections?.some(
          (c) => c.status === "active" || c.status === "connected",
        ) ?? false
      );
    }
    return manualDone.has(id);
  }

  const doneCount = STEPS.filter((s) => isStepDone(s.id)).length;
  const allDone = doneCount === STEPS.length;

  useEffect(() => {
    if (!allDone || isLoading || completed) return;
    const t = window.setTimeout(() => completeTour({}), 1400);
    return () => window.clearTimeout(t);
  }, [allDone, isLoading, completed, completeTour]);

  if (!mounted || isLoading || completed) return null;

  const progressPct = Math.round((doneCount / STEPS.length) * 100);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-76">
      <div
        className="rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/30 overflow-hidden"
        style={{ boxShadow: "0 8px 40px -8px rgba(15,23,42,0.14), 0 2px 8px -2px rgba(15,23,42,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-br from-orange-500 to-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white leading-tight">
                Get started with Entivia
              </p>
              <p className="text-[10px] text-white/70 leading-tight mt-0.5">
                {doneCount} of {STEPS.length} steps complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand" : "Collapse"}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
            >
              {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              type="button"
              onClick={() => completeTour({})}
              aria-label="Dismiss"
              className="flex h-6 w-6 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            {/* Progress bar */}
            <div className="px-4 pt-3.5 pb-0.5">
              <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Steps list */}
            <ul className="px-3 py-2 space-y-0.5">
              {STEPS.map((step) => {
                const done = isStepDone(step.id);
                return (
                  <li key={step.id} className="group flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-slate-50 transition-colors cursor-default">
                    {/* Check toggle */}
                    <button
                      type="button"
                      onClick={() => !done && markDone(step.id)}
                      className="shrink-0 outline-none"
                      aria-label={done ? "Completed" : "Mark done"}
                    >
                      {done ? (
                        <CheckCircle2 size={17} className="text-orange-500" />
                      ) : (
                        <Circle size={17} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                      )}
                    </button>

                    {/* Text */}
                    <Link href={step.href} className={`min-w-0 flex-1 ${done ? "pointer-events-none" : ""}`}>
                      <p
                        className={`text-[12.5px] font-medium leading-tight transition-colors ${
                          done ? "line-through text-slate-400" : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {step.title}
                      </p>
                      {!done && (
                        <p className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                          {step.desc}
                        </p>
                      )}
                    </Link>

                    {/* Arrow */}
                    {!done && (
                      <Link
                        href={step.href}
                        className="shrink-0 text-[11px] font-semibold text-orange-500 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity pr-0.5"
                      >
                        →
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="px-5 pb-3 pt-1">
              <button
                type="button"
                onClick={() => completeTour({})}
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip setup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
