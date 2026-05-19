import { SendHorizonal } from "lucide-react";
import { agentMessages } from "@/lib/demo-data";

export function AgentPanel() {
  return (
    <aside className="flex min-h-[520px] flex-col rounded-2xl border border-slate-900 bg-slate-950 text-white shadow-sm">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Entivia agent
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              Ask live operations
            </h2>
          </div>
          <span className="rounded-lg bg-emerald-400 px-2.5 py-1 text-xs font-semibold text-slate-950">
            Tool-ready
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 p-5">
        {agentMessages.map((message, index) => (
          <div
            key={`${message.from}-${index}`}
            className={`rounded-xl p-3 text-sm leading-6 ${
              message.from === "user"
                ? "ml-8 bg-white text-slate-950"
                : "mr-8 bg-white/10 text-slate-100"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-5">
        <div className="flex items-center gap-2 rounded-xl bg-white p-2">
          <input
            className="min-w-0 flex-1 border-0 px-2 py-2 text-sm text-slate-950 outline-none"
            placeholder="Ask a data question"
          />
          <button
            className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white"
            aria-label="Send message"
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
