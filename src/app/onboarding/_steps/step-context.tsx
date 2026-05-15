"use client";

import { useSaveContext } from "@/hooks/onboarding/use-save-context";

const INDUSTRIES = [
  "Telecom", "E-commerce", "Fintech", "SaaS", "Healthcare",
  "Retail", "Logistics", "EdTech", "Real Estate", "Other",
];

interface Props {
  onNext: () => void;
}

export default function StepContext({ onNext }: Props) {
  const { mutate, isPending } = useSaveContext();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    mutate(
      {
        industry: d.get("industry") as string || undefined,
        business_context: d.get("business_context") as string,
        entity_label: d.get("entity_label") as string,
        goal_label: d.get("goal_label") as string,
      },
      { onSuccess: onNext },
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-slate-900">Tell us about your business</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          This helps Pulse understand how to analyze and label your data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-700">Industry</label>
          <select
            name="industry"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          >
            <option value="">Select your industry (optional)</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-700">
            Business context <span className="text-red-500">*</span>
          </label>
          <textarea
            name="business_context"
            required
            rows={3}
            placeholder="e.g. We are a telecom company tracking customer churn across 1M subscribers. We want to identify at-risk customers before they cancel."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-700">
              Entity label <span className="text-red-500">*</span>
            </label>
            <input
              name="entity_label"
              required
              type="text"
              placeholder="e.g. customers"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400">What you call the things you track</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-700">
              Goal label <span className="text-red-500">*</span>
            </label>
            <input
              name="goal_label"
              required
              type="text"
              placeholder="e.g. reduce churn"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400">Your primary business objective</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Continue →"}
          </button>
        </div>
      </form>
    </div>
  );
}
