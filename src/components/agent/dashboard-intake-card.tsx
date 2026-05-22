"use client";

import { useMemo, useState } from "react";
import { Database, Loader2, Send, Sparkles } from "lucide-react";
import type {
  IntakeQuestion,
  StartIntakeArtifact,
} from "@/lib/api/agent-api";

type AnswersState = Record<string, string>;

function questionDefault(q: IntakeQuestion): string {
  if (q.type === "radio" || q.type === "select") {
    return q.options?.[0]?.value ?? "";
  }
  return "";
}

function formatAnswersAsMessage(
  questions: IntakeQuestion[],
  answers: AnswersState,
  artifact: StartIntakeArtifact,
): string {
  const lines: string[] = ["Here are my answers — please draft the plan."];
  for (const q of questions) {
    const value = (answers[q.id] ?? "").trim();
    if (!value) continue;

    let pretty = value;
    if ((q.type === "radio" || q.type === "select") && q.options) {
      const match = q.options.find((o) => o.value === value);
      if (match?.label) pretty = match.label;
    }
    if (q.id === "connection_id" && artifact.connections) {
      const conn = artifact.connections.find((c) => c.id === value);
      if (conn?.name) pretty = `${conn.name} (${value})`;
    }
    lines.push(`- ${q.prompt} → ${pretty}`);
  }
  return lines.join("\n");
}

function QuestionField({
  q,
  value,
  onChange,
  artifact,
}: {
  q: IntakeQuestion;
  value: string;
  onChange: (v: string) => void;
  artifact: StartIntakeArtifact;
}) {
  if (q.id === "connection_id" && artifact.connections?.length) {
    return (
      <div className="space-y-1.5">
        {artifact.connections.map((c) => {
          const selected = value === c.id;
          return (
            <label
              key={c.id}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                selected
                  ? "border-orange-300 bg-orange-50/60"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-orange-600 bg-orange-600"
                    : "border-slate-300 bg-white"
                }`}
                aria-hidden
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <input
                type="radio"
                className="sr-only"
                name={q.id}
                value={c.id}
                checked={selected}
                onChange={() => onChange(c.id)}
              />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900">
                  {c.name || c.id}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  <Database size={10} className="mr-1 inline-block align-[-1px]" />
                  {c.connector_type || "connection"}
                  {c.description ? ` · ${c.description}` : ""}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  if (q.type === "radio" || q.type === "select") {
    return (
      <div className="space-y-1.5">
        {(q.options ?? []).map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                selected
                  ? "border-orange-300 bg-orange-50/60"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                  selected
                    ? "border-orange-600 bg-orange-600"
                    : "border-slate-300 bg-white"
                }`}
                aria-hidden
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <input
                type="radio"
                className="sr-only"
                name={q.id}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
              />
              <span className="text-slate-800">{opt.label || opt.value}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (q.type === "long_text") {
    return (
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder || "Describe..."}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={q.placeholder || "Type your answer"}
      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
    />
  );
}

export function DashboardIntakeCard({
  artifact,
  onSubmit,
  disabled = false,
}: {
  artifact: StartIntakeArtifact;
  onSubmit: (message: string) => void;
  disabled?: boolean;
}) {
  const questions = useMemo(
    () => artifact.questions ?? [],
    [artifact.questions],
  );

  const initial = useMemo<AnswersState>(() => {
    const next: AnswersState = {};
    for (const q of questions) next[q.id] = questionDefault(q);
    return next;
  }, [questions]);

  const [answers, setAnswers] = useState<AnswersState>(initial);
  const [submitted, setSubmitted] = useState(false);

  const missingRequired = questions.some(
    (q) => q.required !== false && !(answers[q.id] ?? "").trim(),
  );

  function handleSubmit() {
    if (disabled || submitted || missingRequired) return;
    const msg = formatAnswersAsMessage(questions, answers, artifact);
    setSubmitted(true);
    onSubmit(msg);
  }

  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 shadow-xs">
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles size={13} className="text-orange-600" />
        <p className="text-xs font-semibold text-slate-800">
          A few questions before I build this
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id}>
            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
              {q.prompt}
              {q.required === false && (
                <span className="ml-1 font-normal text-slate-400">(optional)</span>
              )}
            </label>
            <QuestionField
              q={q}
              value={answers[q.id] ?? ""}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
              artifact={artifact}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          {submitted
            ? "Answers sent — drafting your plan…"
            : "These shape the SQL and the dashboard layout."}
        </p>
        <button
          type="button"
          disabled={disabled || submitted || missingRequired}
          onClick={handleSubmit}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitted ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Send size={12} />
          )}
          {submitted ? "Sent" : "Send answers"}
        </button>
      </div>
    </div>
  );
}
