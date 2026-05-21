import { api } from "./client";

export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export type Conversation = {
  id: string;
  message_count: number;
  messages: AgentMessage[];
  created_at: string;
  updated_at: string;
};

export type ConversationListItem = {
  id: string;
  message_count: number;
  created_at: string;
  updated_at: string;
};

export const agentApi = {
  listConversations: () =>
    api.get<ConversationListItem[]>("/agent/conversations"),
  createConversation: () =>
    api.post<Conversation>("/agent/conversations", {}),
  getConversation: (id: string) =>
    api.get<Conversation>(`/agent/conversations/${id}`),
  chat: (conversationId: string, content: string) =>
    api.post<{ reply: string; conversation_id: string }>(
      `/agent/conversations/${conversationId}/chat`,
      { content, stream: false },
    ),
};
