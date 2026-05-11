import { Bot, Braces, Database, MessageSquareText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { SummaryCard } from "@/components/shared/summary-card";
import { agentMessages } from "@/lib/demo-data";

const agentSummary = [
  { label: "Queries this month", value: "4,182", detail: "Across operations, analytics, and profiles" },
  { label: "Tool calls", value: "9,740", detail: "Every data answer is grounded" },
  { label: "Avg confidence", value: "94%", detail: "Based on schema-valid responses" },
  { label: "Latency", value: "2.8s", detail: "Streaming target for demo" },
];

const tools = [
  "get_entity_list",
  "get_entity_profile",
  "get_risk_summary",
  "get_recommendations",
  "run_custom_query",
  "get_trend_data",
  "generate_action_draft",
  "get_aggregate_summary",
];

export function AgentPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHero
        eyebrow="Conversational agent"
        title="Ask operational questions in plain English, backed by live tool calls."
        description="The agent should never answer data-dependent questions from general knowledge. It calls validated tools that generate safe SQL from the organization&apos;s schema mapping."
        action="Start new thread"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {agentSummary.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="flex min-h-[720px] flex-col rounded-2xl border border-slate-900 bg-slate-950 text-white shadow-sm">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Live workspace agent</p>
                <h2 className="mt-1 text-xl font-semibold">Nova Africa Operations</h2>
              </div>
              <span className="rounded-lg bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950">Tool calling on</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 p-5">
            {agentMessages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`rounded-2xl p-4 text-sm leading-6 ${message.from === "user" ? "ml-16 bg-white text-slate-950" : "mr-16 bg-white/10 text-slate-100"}`}>
                {message.text}
              </div>
            ))}
            <div className="mr-16 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-100">
              I can also draft the intervention message and show the SQL-backed signals that caused the recommendation.
            </div>
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="flex items-center gap-2 rounded-xl bg-white p-2">
              <input className="min-w-0 flex-1 border-0 px-2 py-3 text-sm text-slate-950 outline-none" placeholder="Ask about risk, entities, trends, or recommended actions" />
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white">
                <MessageSquareText size={16} />
                Send
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Tool registry" title="Agent tools from the PRD" />
            <div className="grid gap-2">
              {tools.map((tool) => (
                <div key={tool} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                  <Braces size={15} className="text-blue-600" />
                  <code className="text-sm font-semibold text-slate-800">{tool}</code>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Grounding" title="How answers are composed" />
            <div className="space-y-4">
              {[
                { label: "Read schema metadata", icon: Database },
                { label: "Validate selected columns", icon: ShieldCheck },
                { label: "Call safe query tool", icon: Bot },
                { label: "Explain result in plain English", icon: MessageSquareText },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={16} /></div>
                  {label}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
