"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Plus, Send, MessageSquare, Menu, ChevronLeft } from "lucide-react";
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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
      {!isUser && (
        <div className="mr-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-600 shadow-xs">
          <Bot size={13} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-slate-900 text-white rounded-br-xs"
            : "border border-slate-200 bg-white text-slate-800 rounded-bl-xs"
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
  className = "",
}: {
  conversations: ConversationListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  creating: boolean;
  className?: string;
}) {
  return (
    <aside className={`flex flex-col border-r border-slate-100 bg-slate-50 ${className}`}>
      <div className="border-b border-slate-100 p-3">
        <button
          onClick={onCreate}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 transition-colors shadow-xs"
        >
          {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          New conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1.5">
        {conversations.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-slate-400">No conversations yet</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs transition-colors ${
              activeId === c.id
                ? "bg-white font-semibold text-slate-900 shadow-xs border-y border-slate-100 first:border-t-0"
                : "text-slate-600 hover:bg-white/60"
            }`}
          >
            <MessageSquare size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">
              {new Date(c.created_at).toLocaleDateString()} · {c.message_count} msg
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ChatPanel({ 
  conversationId, 
  onBackToSidebar 
}: { 
  conversationId: string; 
  onBackToSidebar: () => void;
}) {
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

  const allMessages =
    messages.length > baseline ? messages : [...messages, ...optimistic];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  function handleSend() {
    const content = input.trim();
    if (!content || sending) return;
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
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Mobile Top Header Action Strip */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-3 py-2 md:hidden">
        <button
          type="button"
          onClick={onBackToSidebar}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white pl-1.5 pr-2.5 text-xs font-semibold text-slate-600 active:bg-slate-50"
        >
          <ChevronLeft size={14} />
          Chats
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-xs font-medium text-slate-500 truncate">Active Session</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-slate-300" />
          </div>
        )}
        {!isLoading && allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50">
              <Bot size={22} className="text-orange-600" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">Ask about your data</p>
            <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">
              Query risk scores, entities, recommendations, or trends in plain English.
            </p>
          </div>
        )}
        {allMessages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="mr-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-600 shadow-xs">
              <Bot size={13} className="text-white" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 rounded-bl-xs">
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

      {/* Input Action Panel */}
      <div className="border-t border-slate-100 p-3 sm:p-4 bg-white">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/30 transition-all">
          <textarea
            rows={1}
            className="flex-1 min-h-[24px] max-h-[120px] resize-none bg-transparent py-1 px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Ask about risks, metrics, actions... (Enter)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send size={13} />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400 hidden sm:block">
          Answers are grounded in your connected data via live tool execution.
        </p>
      </div>
    </div>
  );
}

export function AgentPage() {
  const { data: conversations, isLoading: loadingConvs } = useConversations();
  const { mutate: createConv, isPending: creating } = useCreateConversation();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Mobile navigation utility state toggling viewport visibility layouts
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);

  const convList = Array.isArray(conversations) ? conversations : [];

  function handleCreate() {
    createConv(undefined, {
      onSuccess: (conv) => {
        setActiveId(conv.id);
        setMobileShowSidebar(false);
      },
    });
  }

  function handleSelectConversation(id: string) {
    setActiveId(id);
    setMobileShowSidebar(false);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Agent</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Ask operational questions in plain English — answers are grounded in your live data.
          </p>
        </div>
        {!mobileShowSidebar && (
          <button
            type="button"
            onClick={() => setMobileShowSidebar(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 md:hidden active:bg-slate-50"
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      <div className="flex h-[calc(100vh-12rem)] min-h-[450px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {loadingConvs ? (
          <div className="flex w-full items-center justify-center">
            <Loader2 size={24} className="animate-spin text-slate-300" />
          </div>
        ) : (
          <>
            {/* Conversations Sidebar List Column */}
            <ConversationSidebar
              conversations={convList}
              activeId={activeId}
              onSelect={handleSelectConversation}
              onCreate={handleCreate}
              creating={creating}
              className={`w-full md:w-60 shrink-0 ${mobileShowSidebar ? "flex" : "hidden md:flex"}`}
            />

            {/* Chat Content Panel Base Column */}
            <div className={`flex-1 flex flex-col min-w-0 ${!mobileShowSidebar ? "flex" : "hidden md:flex"}`}>
              {activeId ? (
                <ChatPanel 
                  conversationId={activeId} 
                  onBackToSidebar={() => setMobileShowSidebar(true)} 
                />
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center bg-slate-50/30">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 ring-1 ring-orange-100/60">
                    <Bot size={26} className="text-orange-600" />
                  </div>
                  <div className="max-w-xs">
                    <p className="text-sm font-semibold text-slate-700">
                      {convList.length === 0 ? "Start your first conversation" : "Select a conversation"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {convList.length === 0
                        ? "Click \"New conversation\" to begin testing prompts."
                        : "Choose a history log from the sidebar or build a new session thread."}
                    </p>
                  </div>
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    New conversation
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}