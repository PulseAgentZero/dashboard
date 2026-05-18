"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  History,
  Loader2,
  Play,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";
import { ParamInputs } from "@/components/studio/core/param-inputs";
import { ResultsTable } from "@/components/studio/core/results-table";
import { RunStatusPoller } from "@/components/studio/core/run-status-poller";
import { SchemaBrowser } from "@/components/studio/core/schema-browser";
import { SQLEditor } from "@/components/studio/core/sql-editor";
import { SaveQueryModal } from "@/components/studio/modals/save-query-modal";
import { VizEditorPanel } from "@/components/studio/modals/viz-editor-panel";
import {
  useCreateQuery,
  useExecuteQuery,
  useExplainQuery,
  useGenerateSQL,
  useQueryRuns,
  useRecommendViz,
  useRunQuery,
  useStudioQuery,
  useUpdateQuery,
} from "@/hooks/studio/use-studio-queries";
import { useRunPoller } from "@/hooks/studio/use-studio-runs";
import { useRefreshStudioSchema, useStudioSchema } from "@/hooks/studio/use-studio-schema";
import {
  useCreateVisualization,
  useVisualizations,
} from "@/hooks/studio/use-studio-visualizations";
import { studioApi } from "@/lib/api/studio-api";
import { tokens } from "@/lib/auth-tokens";
import { sqlParamsToDefinitions } from "@/lib/studio/parse-sql-params";
import { canCreateStudioContent, canEditQuery, canRefreshSchema } from "@/lib/studio/roles";
import { useAuth } from "@/providers/auth-provider";
import type { QueryResult, StudioVisualization } from "@/types/studio";

const DEFAULT_SQL = "SELECT 1 AS example\n";

type Props = {
  queryId?: string;
};

export function QueryEditorPage({ queryId }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const isNew = !queryId;

  const [sql, setSql] = useState(DEFAULT_SQL);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QueryResult | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [vizOpen, setVizOpen] = useState(false);
  const [editViz, setEditViz] = useState<StudioVisualization | null>(null);
  const [aiGoal, setAiGoal] = useState("");
  const [showAi, setShowAi] = useState(false);
  const [explainText, setExplainText] = useState<string | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const editorInsertRef = useRef<((text: string) => void) | null>(null);

  const { data: query, isLoading: queryLoading } = useStudioQuery(queryId);
  const { data: schema, isLoading: schemaLoading } = useStudioSchema(query?.connection_id ?? undefined);
  const refreshSchema = useRefreshStudioSchema();
  const executeQuery = useExecuteQuery();
  const createQuery = useCreateQuery();
  const updateQuery = useUpdateQuery();
  const runQuery = useRunQuery();
  const generateSQL = useGenerateSQL();
  const explainQuery = useExplainQuery();
  const recommendViz = useRecommendViz();
  const { data: runsData } = useQueryRuns(queryId);
  const { data: vizData } = useVisualizations(queryId);
  const createViz = useCreateVisualization();
  const { run: polledRun, isPolling } = useRunPoller(activeRunId);

  const canSave = isNew
    ? canCreateStudioContent(user?.role)
    : canEditQuery(user?.role, query?.created_by, user?.id);

  useEffect(() => {
    if (query) {
      setSql(query.sql_text);
      const pv: Record<string, string> = {};
      query.params?.forEach((p) => {
        pv[p.name] = paramValues[p.name] ?? p.default_value ?? "";
      });
      setParamValues(pv);
    }
  }, [query]);

  useEffect(() => {
    if (polledRun?.status === "completed" && polledRun.result) {
      setResult(polledRun.result);
    }
  }, [polledRun]);

  const params = query?.params?.length ? query.params : sqlParamsToDefinitions(sql, query?.params);

  const handleRun = useCallback(async () => {
    if (queryId) {
      const run = await runQuery.mutateAsync({
        id: queryId,
        body: { param_values: paramValues },
      });
      setActiveRunId(run.id);
    } else {
      const res = await executeQuery.mutateAsync({
        sql_text: sql,
        param_values: paramValues,
      });
      setResult(res);
    }
  }, [queryId, sql, paramValues, runQuery, executeQuery]);

  async function handleSave(payload: Parameters<typeof createQuery.mutateAsync>[0]) {
    if (isNew) {
      const created = await createQuery.mutateAsync(payload);
      router.replace(`/dashboard/studio/queries/${created.id}`);
    } else if (queryId) {
      await updateQuery.mutateAsync({ id: queryId, body: payload });
    }
  }

  async function handleGenerate() {
    if (!aiGoal.trim()) return;
    const res = await generateSQL.mutateAsync({ goal: aiGoal });
    setSql(res.sql);
    setShowAi(false);
  }

  async function handleExplain() {
    if (!queryId) return;
    const res = await explainQuery.mutateAsync(queryId);
    setExplainText(res.explanation);
  }

  function downloadCsv() {
    const runId = polledRun?.id ?? runsData?.runs?.[0]?.id;
    if (!runId) return;
    const url = studioApi.downloadRunUrl(runId, "csv");
    const token = tokens.getAccess();
    fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "results.csv";
        a.click();
      });
  }

  if (queryId && queryLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Link href="/dashboard/studio" className="text-sm text-slate-500 hover:text-indigo-600">
            ← Studio
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">
            {isNew ? "New query" : query?.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAi(!showAi)}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
          >
            <Sparkles size={14} />
            AI SQL
          </button>
          {queryId && (
            <button
              type="button"
              onClick={() => void handleExplain()}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
            >
              <Wand2 size={14} />
              Explain
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleRun()}
            disabled={executeQuery.isPending || runQuery.isPending}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white"
          >
            {(executeQuery.isPending || runQuery.isPending) ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run
          </button>
          {canSave && (
            <button
              type="button"
              onClick={() => setSaveOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold"
            >
              <Save size={14} />
              Save
            </button>
          )}
          {result && queryId && (
            <button
              type="button"
              onClick={downloadCsv}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
            >
              <Download size={14} />
              CSV
            </button>
          )}
          {result && queryId && (
            <button
              type="button"
              onClick={() => {
                setEditViz(null);
                setVizOpen(true);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
            >
              Chart
            </button>
          )}
        </div>
      </div>

      {showAi && (
        <div className="flex gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
          <input
            value={aiGoal}
            onChange={(e) => setAiGoal(e.target.value)}
            placeholder="Describe what you want to query…"
            className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={generateSQL.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Generate
          </button>
        </div>
      )}

      {explainText && (
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
          {explainText}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="w-56 shrink-0">
          <SchemaBrowser
            tables={schema?.tables ?? []}
            isLoading={schemaLoading || refreshSchema.isPending}
            onRefresh={() => refreshSchema.mutate(query?.connection_id ?? undefined)}
            canRefresh={canRefreshSchema(user?.role)}
            onInsert={(text) => setSql((s) => s + text)}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <ParamInputs
            params={params.length ? params : []}
            values={paramValues}
            onChange={setParamValues}
          />
          <SQLEditor value={sql} onChange={setSql} onRun={() => void handleRun()} tables={schema?.tables} />
          <RunStatusPoller run={polledRun} isPolling={isPolling} />
          <ResultsTable result={result} />
        </div>
        {queryId && (
          <div className="w-48 shrink-0 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase text-slate-500">
              <History size={12} />
              Runs
            </p>
            {runsData?.runs.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRunId(r.id)}
                className="mb-1 w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-50"
              >
                <span className="capitalize">{r.status}</span>
                <br />
                <span className="text-slate-400">{new Date(r.created_at).toLocaleString()}</span>
              </button>
            ))}
            {vizData?.visualizations && vizData.visualizations.length > 0 && (
              <>
                <p className="mb-2 mt-4 text-xs font-semibold uppercase text-slate-500">Charts</p>
                {vizData.visualizations.map((v) => (
                  <div key={v.id} className="mb-1 text-xs text-slate-600">
                    {v.name} ({v.chart_type})
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <SaveQueryModal
        open={saveOpen}
        sql={sql}
        initial={query ?? undefined}
        onClose={() => setSaveOpen(false)}
        onSave={handleSave}
      />

      {queryId && (
        <VizEditorPanel
          open={vizOpen}
          queryId={queryId}
          result={result}
          columns={result?.columns ?? []}
          existing={editViz}
          onClose={() => setVizOpen(false)}
          onSave={async (body) => {
            await createViz.mutateAsync({ queryId, body });
          }}
          onRecommend={() => recommendViz.mutateAsync(queryId)}
        />
      )}
    </div>
  );
}
