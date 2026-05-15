"use client";

import { Zap, Database, Map, Cpu } from "lucide-react";
import { useCompleteOnboarding } from "@/hooks/onboarding/use-complete-onboarding";

interface Props {
  onBack: () => void;
}

const WHAT_HAPPENS = [
  { icon: Database, label: "First pipeline run triggered", desc: "Pulse reads your data and builds entity profiles" },
  { icon: Cpu, label: "AI analysis starts", desc: "Recommendations generated based on your data" },
  { icon: Map, label: "Dashboard populated", desc: "Entities, risks, and insights ready to explore" },
];

export default function StepLaunch({ onBack }: Props) {
  const { mutate, isPending } = useCompleteOnboarding();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="mb-7 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
          <Zap size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">You&apos;re ready to launch</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Your setup is complete. Here&apos;s what happens when you launch Pulse.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {WHAT_HAPPENS.map(({ icon: Icon, label, desc }, i) => (
          <div key={label} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={15} className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Step {i + 1}</span>
                <span className="text-[13px] font-semibold text-slate-800">{label}</span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-800 mb-6">
        The first pipeline run may take a few minutes depending on your data size. You can monitor progress from the dashboard.
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-[13px] text-slate-500 hover:text-slate-700 transition">
          ← Back
        </button>
        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Zap size={14} />
          {isPending ? "Launching…" : "Launch Pulse"}
        </button>
      </div>
    </div>
  );
}
