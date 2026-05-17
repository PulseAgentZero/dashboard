"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Plus, Send, MessageSquare } from "lucide-react";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useChat,
} from "@/hooks/agent/use-agent";
import type { AgentMessage, ConversationListItem } from "@/lib/api/agent-api";

function MessageBubble({ msg }: { msg: AgentMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mr-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600">
          <Bot size={13} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-slate-900 text-white"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  creating,
}: {
  conversations: ConversationListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  creating: boolean;
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-100 bg-slate-50">
      <div className="border-b border-slate-100 p-3">
        <button
          onClick={onCreate}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          New conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 && (
          <p className="px-3 py-4 text-center text-[11px] text-slate-400">No conversations yet</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs transition-colors ${
              activeId === c.id
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-white/60"
            }`}
          >
            <MessageSquare size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">
              {new Date(c.created_at).toLocaleDateString()} · {c.message_count} msg
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ChatPanel({ conversationId }: { conversationId: string }) {
  const { data: conv, isLoading } = useConversation(conversationId);
  const { mutate: sendMsg, isPending: sending } = useChat(conversationId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages: AgentMessage[] = (() => {
    if (!conv?.messages) return [];
    return conv.messages.map((m) => {
      const raw = m as Record<string, unknown>;
      return {
        role: (raw.role as "user" | "assistant") ?? "assistant",
        content: String(raw.content ?? raw.text ?? ""),
        created_at: raw.created_at as string | undefined,
      };
    });
  })();

  const [optimistic, setOptimistic] = useState<AgentMessage[]>([]);
  const [baseline, setBaseline] = useState(0);

  // Once the server has grown past the count we had when we sent, use server data only
  const allMessages =
    messages.length > baseline ? messages : [...messages, ...optimistic];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  function handleSend() {
    const content = input.trim();
    if (!content || sending) return;
    // Both updates batch in React 18 — baseline and optimistic apply in the same render
    setBaseline(messages.length);
    setInput("");
    setOptimistic([{ role: "user", content }]);
    sendMsg(content, {
      onSuccess: (data) => {
        setOptimistic([
          { role: "user", content },
          { role: "assistant", content: data.reply },
        ]);
      },
    });
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-slate-300" />
          </div>
        )}
        {!isLoading && allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50">
              <Bot size={22} className="text-blue-600" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">Ask about your data</p>
            <p className="mt-1 text-xs text-slate-400">
              Query risk scores, entities, recommendations, or trends in plain English.
            </p>
          </div>
        )}
        {allMessages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="mr-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600">
              <Bot size={13} className="text-white" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <textarea
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Ask about risk, entities, trends, or actions… (Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Send size={13} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-slate-400">
          Answers are grounded in your connected data via tool calls.
        </p>
      </div>
    </div>
  );
}

export function AgentPage() {
  const { data: conversations, isLoading: loadingConvs } = useConversations();
  const { mutate: createConv, isPending: creating } = useCreateConversation();
  const [activeId, setActiveId] = useState<string | null>(null);

  const convList = Array.isArray(conversations) ? conversations : [];

  function handleCreate() {
    createConv(undefined, {
      onSuccess: (conv) => setActiveId(conv.id),
    });
  }

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-slate-900">Agent</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Ask operational questions in plain English — answers are grounded in your live data.
        </p>
      </div>

      <div className="flex h-[calc(100vh-13rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loadingConvs ? (
          <div className="flex w-full items-center justify-center">
            <Loader2 size={24} className="animate-spin text-slate-300" />
          </div>
        ) : (
          <>
            <ConversationSidebar
              conversations={convList}
              activeId={activeId}
              onSelect={setActiveId}
              onCreate={handleCreate}
              creating={creating}
            />

            {activeId ? (
              <ChatPanel conversationId={activeId} />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50">
                  <Bot size={26} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {convList.length === 0 ? "Start your first conversation" : "Select a conversation"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {convList.length === 0
                      ? "Click \"New conversation\" to begin."
                      : "Choose from the left or start a new one."}
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  New conversation
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
