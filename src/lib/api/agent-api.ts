import { api } from "./client";

// ---------------------------------------------------------------------------
// Artifact payloads returned by the dashboard-builder tools. The agent emits
// these alongside the natural-language reply so the UI can render structured
// cards (intake questions, plan preview, change diff) instead of dumping
// raw JSON into the chat bubble.
// ---------------------------------------------------------------------------

export type IntakeQuestionOption = { value: string; label?: string };

export type IntakeQuestion = {
  id: string;
  prompt: string;
  type: "radio" | "text" | "long_text" | "select" | "multiselect" | string;
  required?: boolean;
  options?: IntakeQuestionOption[];
  placeholder?: string;
};

export type IntakeConnection = {
  id: string;
  name?: string | null;
  connector_type?: string | null;
  description?: string | null;
};

export type IntakeSchemaPreviewTable = {
  table_name?: string;
  schema_name?: string | null;
  row_count?: number | null;
  columns?: { name: string; type?: string }[];
};

export type StartIntakeArtifact = {
  questions: IntakeQuestion[];
  connections?: IntakeConnection[];
  schema_preview?: IntakeSchemaPreviewTable[];
  message?: string;
};

export type PlanChartSpec = {
  id?: string;
  name?: string;
  description?: string;
  chart_type?: string;
  sql?: string;
  connection_id?: string;
  visualization?: Record<string, unknown>;
};

export type PlanParameterSpec = {
  name: string;
  type?: string;
  default?: unknown;
  description?: string;
  options?: { value: string; label?: string }[];
};

export type DraftPlanArtifact = {
  plan: {
    name?: string;
    description?: string;
    connection_id?: string;
    connection_name?: string;
    time_range?: Record<string, unknown> | null;
    dashboard_params?: PlanParameterSpec[];
    charts?: PlanChartSpec[];
    notes?: string;
  };
  message?: string;
};

export type BuildDashboardArtifact = {
  dashboard?: {
    id: string;
    name?: string;
    url?: string;
    chart_count?: number;
  };
  message?: string;
};

export type DashboardChange =
  | {
      action: "rename";
      old_name?: string;
      new_name: string;
    }
  | {
      action: "set_description";
      old_description?: string;
      new_description: string;
    }
  | {
      action: "set_public";
      is_public: boolean;
    }
  | {
      action: "remove_chart";
      item_id: string;
      chart_name?: string;
    }
  | {
      action: "add_chart";
      spec: PlanChartSpec;
    }
  | {
      action: "replace_chart";
      item_id: string;
      old_chart_name?: string;
      spec: PlanChartSpec;
    }
  | {
      action: "set_dashboard_params";
      params: PlanParameterSpec[];
    }
  | {
      action: "set_time_range";
      time_range: Record<string, unknown>;
    }
  | {
      // Fallback for forward-compat unknown actions.
      action: string;
      [k: string]: unknown;
    };

export type ProposeChangesArtifact = {
  dashboard_id: string;
  dashboard_name?: string;
  changes: DashboardChange[];
  rejected?: { change: unknown; reason: string }[];
  message?: string;
};

export type ApplyChangesArtifact = {
  dashboard_id: string;
  dashboard_name?: string;
  applied?: DashboardChange[];
  skipped?: { change: unknown; reason: string }[];
  message?: string;
};

// Single artifact bag keyed by tool name. Each turn carries at most one of
// the tool-specific payloads; the agent calls one tool per intake step.
export type ChatArtifacts = Partial<{
  start_dashboard_intake: StartIntakeArtifact;
  draft_dashboard_plan: DraftPlanArtifact;
  build_dashboard_from_plan: BuildDashboardArtifact;
  propose_dashboard_changes: ProposeChangesArtifact;
  apply_dashboard_changes: ApplyChangesArtifact;
}>;

export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  tools_called?: string[];
  artifacts?: ChatArtifacts | null;
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

export type ChatReply = {
  reply: string;
  conversation_id: string;
  tools_called?: string[] | null;
  artifacts?: ChatArtifacts | null;
};

export const agentApi = {
  listConversations: () =>
    api.get<ConversationListItem[]>("/agent/conversations"),
  createConversation: () =>
    api.post<Conversation>("/agent/conversations", {}),
  getConversation: (id: string) =>
    api.get<Conversation>(`/agent/conversations/${id}`),
  chat: (conversationId: string, content: string) =>
    api.post<ChatReply>(
      `/agent/conversations/${conversationId}/chat`,
      { content, stream: false },
    ),
};
