"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import StepContext from "./_steps/step-context";
import StepConnection from "./_steps/step-connection";
import StepLaunch from "./_steps/step-launch";

const STEPS = [
  { id: 1, label: "Business", description: "Tell us about your business" },
  { id: 2, label: "Connect", description: "Connect your data source" },
  { id: 3, label: "Launch", description: "Review and go live" },
];

export default function DashboardOnboardingPage() {
  const [step, setStep] = useState(1);

  function next() { setStep((s) => Math.min(s + 1, 3)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }
  function skipConnection() { setStep(3); }

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Setup wizard</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Configure Pulse in a few steps before going live.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                  step > s.id
                    ? "bg-blue-600 text-white"
                    : step === s.id
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s.id ? <Check size={13} /> : s.id}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                  step >= s.id ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 mb-5 transition-all ${
                  step > s.id ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-[13px] text-slate-500 mb-5">{STEPS[step - 1].description}</p>

      {step === 1 && <StepContext onNext={next} />}
      {step === 2 && <StepConnection onNext={next} onBack={back} onSkip={skipConnection} />}
      {step === 3 && <StepLaunch onBack={back} />}
    </div>
  );
}
