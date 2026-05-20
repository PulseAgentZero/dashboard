"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { History, Loader2, Pencil, Trash2 } from "lucide-react";
import { AddToDashboardModal } from "@/components/studio/modals/add-to-dashboard-modal";
import { ParamInputs } from "@/components/studio/core/param-inputs";
import { ResultsTable } from "@/components/studio/core/results-table";
import { RunStatusPoller } from "@/components/studio/core/run-status-poller";
import { SchemaBrowser } from "@/components/studio/core/schema-browser";
import { SQLEditor } from "@/components/studio/core/sql-editor";
import { SaveQueryModal } from "@/components/studio/modals/save-query-modal";
import { StudioEditorActions } from "@/components/studio/ui/studio-editor-actions";
import {
  pickDefaultStudioConnectionId,
  StudioConnectionPicker,
} from "@/components/studio/ui/studio-connection-picker";
import { useConnections } from "@/hooks/connections/use-connections";
import { VizEditorPanel } from "@/components/studio/modals/viz-editor-panel";
import {
  useCreateQuery,
  useExecuteQuery,
  useExplainQuery,
  useGenerateSQL,
  useQueryRuns,
  useRecommendViz,
  useStudioQuery,
  useUpdateQuery,
} from "@/hooks/studio/use-studio-queries";
import { useRunPoller } from "@/hooks/studio/use-studio-runs";
import { useRefreshStudioSchema, useStudioSchema } from "@/hooks/studio/use-studio-schema";
import { useAddDashboardItem } from "@/hooks/studio/use-studio-dashboards";
import {
  useCreateVisualization,
  useDeleteVisualization,
  useUpdateVisualization,
  useVisualizations,
} from "@/hooks/studio/use-studio-visualizations";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { studioApi } from "@/lib/api/studio-api";
import { tokens } from "@/lib/auth-tokens";
import { downloadQueryResultAsCsv } from "@/lib/studio/export-result-csv";
import { sqlParamsToDefinitions } from "@/lib/studio/parse-sql-params";
import { getQueryTemplate } from "@/lib/studio/query-templates";
import { canCreateStudioContent, canEditQuery, canRefreshSchema } from "@/lib/studio/roles";
import { useAuth } from "@/providers/auth-provider";
import type { QueryResult, StudioVisualization } from "@/types/studio";

const DEFAULT_SQL = "SELECT 1 AS example\n";

type Props = {
  queryId?: string;
};

export function QueryEditorPage({ queryId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isNew = !queryId;
  const templateAppliedRef = useRef(false);

  const [sql, setSql] = useState(DEFAULT_SQL);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QueryResult | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [vizOpen, setVizOpen] = useState(false);
  const [editViz, setEditViz] = useState<StudioVisualization | null>(null);
  const [openVizAfterSave, setOpenVizAfterSave] = useState(false);
  const [addToDashboardOpen, setAddToDashboardOpen] = useState(false);
  const [lastSavedViz, setLastSavedViz] = useState<StudioVisualization | null>(null);
  const [aiGoal, setAiGoal] = useState("");
  const [showAi, setShowAi] = useState(false);
  const [explainText, setExplainText] = useState<string | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const editorInsertRef = useRef<((text: string) => void) | null>(null);

  const handleSchemaInsert = useCallback((text: string) => {
    if (editorInsertRef.current) {
      editorInsertRef.current(text);
      return;
    }
    setSql((s) => {
      if (!s.trim()) return text;
      const needsSpace = s.length > 0 && !/\s$/.test(s);
      return s + (needsSpace ? " " : "") + text;
    });
  }, []);

  const handleInsertReady = useCallback((insert: (text: string) => void) => {
    editorInsertRef.current = insert;
  }, []);

  const { data: connections } = useConnections();
  const { data: query, isLoading: queryLoading } = useStudioQuery(queryId);
  const effectiveConnectionId = query?.connection_id ?? connectionId;
  const { data: schema, isLoading: schemaLoading } = useStudioSchema(effectiveConnectionId ?? undefined);
  const refreshSchema = useRefreshStudioSchema();
  const executeQuery = useExecuteQuery();
  const createQuery = useCreateQuery();
  const updateQuery = useUpdateQuery();
  const generateSQL = useGenerateSQL();
  const explainQuery = useExplainQuery();
  const recommendViz = useRecommendViz();
  const { data: runsData } = useQueryRuns(queryId);
  const { data: vizData } = useVisualizations(queryId);
  const createViz = useCreateVisualization();
  const updateViz = useUpdateVisualization();
  const deleteViz = useDeleteVisualization();
  const addDashboardItem = useAddDashboardItem();
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();
  const { run: polledRun, isPolling } = useRunPoller(activeRunId);

  const canSave = isNew
    ? canCreateStudioContent(user?.role)
    : canEditQuery(user?.role, query?.created_by, user?.id);

  useEffect(() => {
    if (query) {
      setSql(query.sql_text);
      if (query.connection_id) setConnectionId(query.connection_id);
      const pv: Record<string, string> = {};
      query.params?.forEach((p) => {
        pv[p.name] = paramValues[p.name] ?? p.default_value ?? "";
      });
      setParamValues(pv);
    }
  }, [query]);

  useEffect(() => {
    if (queryId || connectionId || !connections?.length) return;
    const defaultId = pickDefaultStudioConnectionId(connections);
    if (defaultId) setConnectionId(defaultId);
  }, [connections, queryId, connectionId]);

  useEffect(() => {
    if (!isNew || templateAppliedRef.current) return;
    const templateId = searchParams.get("template");
    if (!templateId) return;
    const template = getQueryTemplate(templateId);
    if (!template) return;
    templateAppliedRef.current = true;
    setSql(template.sql);
  }, [isNew, searchParams]);

  useEffect(() => {
    if (polledRun?.status === "completed" && polledRun.result) {
      setResult(polledRun.result);
    }
  }, [polledRun]);

  const params = query?.params?.length ? query.params : sqlParamsToDefinitions(sql, query?.params);
  const sqlDirty = Boolean(queryId && query && sql.trim() !== query.sql_text.trim());

  /** Always run the SQL currently in the editor (saved queries must not require Save first). */
  const handleRun = useCallback(async () => {
    if (!effectiveConnectionId) return;
    setActiveRunId(null);
    const res = await executeQuery.mutateAsync({
      sql_text: sql,
      connection_id: effectiveConnectionId,
      param_values: paramValues,
    });
    setResult(res);
  }, [sql, paramValues, executeQuery, effectiveConnectionId]);

  async function handleConnectionChange(id: string) {
    setConnectionId(id);
    setResult(null);
    if (queryId) {
      await updateQuery.mutateAsync({ id: queryId, body: { connection_id: id } });
    }
  }

  async function handleSave(payload: Parameters<typeof createQuery.mutateAsync>[0]) {
    if (isNew) {
      const created = await createQuery.mutateAsync(payload);
      if (openVizAfterSave) {
        router.replace(`/dashboard/studio/queries/${created.id}?chart=1`);
      } else {
        router.replace(`/dashboard/studio/queries/${created.id}`);
      }
    } else if (queryId) {
      await updateQuery.mutateAsync({ id: queryId, body: payload });
      if (openVizAfterSave) {
        setOpenVizAfterSave(false);
        setEditViz(null);
        setVizOpen(true);
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("chart") === "1" && queryId && result?.rows?.length) {
      setEditViz(null);
      setVizOpen(true);
      router.replace(`/dashboard/studio/queries/${queryId}`, { scroll: false });
    }
  }, [queryId, result?.rows?.length, router]);

  async function handleGenerate() {
    if (!aiGoal.trim() || !effectiveConnectionId) return;
    const res = await generateSQL.mutateAsync({
      goal: aiGoal,
      connection_id: effectiveConnectionId,
    });
    setSql(res.sql);
    setShowAi(false);
  }

  async function handleExplain() {
    if (!queryId) return;
    const res = await explainQuery.mutateAsync(queryId);
    setExplainText(res.explanation);
  }

  function downloadCsv() {
    if (result?.rows?.length) {
      downloadQueryResultAsCsv(result, query?.name ? `${query.name}.csv` : "results.csv");
      return;
    }
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

  const saveBlockedReason = !canSave
    ? "Saving requires Analyst role or higher."
    : !effectiveConnectionId
      ? "Select a data source before saving."
      : undefined;

  const isViewerEditor = isNew && !canCreateStudioContent(user?.role);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col gap-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href="/dashboard/studio" className="text-sm text-slate-500 hover:text-indigo-600">
              ← Studio
            </Link>
            <h1 className="text-lg font-semibold text-slate-900">
              {isNew ? "New query" : query?.name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {isNew
                ? "Pick a data source, write SQL, then Run or Save to keep this query."
                : "Edit SQL and Run to preview — Save when you want dashboards and schedules to use the new SQL."}
            </p>
            {sqlDirty && (
              <p className="mt-1 text-xs font-medium text-amber-700">
                Unsaved SQL changes — Run uses your editor text; Save to persist.
              </p>
            )}
            {isViewerEditor && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                View-only access — you can run ad-hoc queries against the data source, but
                saving requires an Analyst role.
              </p>
            )}
          </div>
          <StudioEditorActions
            onRun={() => void handleRun()}
            runDisabled={!effectiveConnectionId}
            runPending={executeQuery.isPending}
            onSave={() => setSaveOpen(true)}
            saveDisabled={!canSave || !effectiveConnectionId}
            saveTitle={saveBlockedReason}
            onAiSql={() => setShowAi(!showAi)}
            aiSqlActive={showAi}
            showExplain={Boolean(queryId)}
            onExplain={() => void handleExplain()}
            explainPending={explainQuery.isPending}
            showDownload={Boolean(result?.rows?.length)}
            onDownloadCsv={downloadCsv}
            showChart={Boolean(result)}
            onChart={() => {
              if (queryId) {
                setEditViz(null);
                setVizOpen(true);
              } else {
                setOpenVizAfterSave(true);
                setSaveOpen(true);
              }
            }}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <StudioConnectionPicker
            variant="toolbar"
            value={effectiveConnectionId}
            onChange={(id) => void handleConnectionChange(id)}
          />
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
            onRefresh={() => refreshSchema.mutate(effectiveConnectionId ?? undefined)}
            canRefresh={canRefreshSchema(user?.role)}
            onInsert={handleSchemaInsert}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <ParamInputs
            params={params.length ? params : []}
            values={paramValues}
            onChange={setParamValues}
          />
          <SQLEditor
            value={sql}
            onChange={setSql}
            onRun={() => void handleRun()}
            onInsertReady={handleInsertReady}
            tables={schema?.tables}
          />
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
                  <div
                    key={v.id}
                    className="group mb-1 flex items-center justify-between gap-1 rounded px-1 py-0.5 hover:bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditViz(v);
                        setVizOpen(true);
                      }}
                      className="min-w-0 flex-1 truncate text-left text-xs text-slate-600 hover:text-indigo-700"
                    >
                      {v.name} ({v.chart_type})
                    </button>
                    <div className="flex shrink-0 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditViz(v);
                          setVizOpen(true);
                        }}
                        className="rounded p-0.5 text-slate-400 hover:text-indigo-600"
                        aria-label="Edit chart"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          requestDeleteConfirm({
                            title: "Delete chart",
                            description: `Delete "${v.name}"? Dashboard panels using it will appear empty.`,
                            confirmLabel: "Delete",
                            onConfirm: () => deleteViz.mutateAsync({ queryId: queryId!, vizId: v.id }),
                          })
                        }
                        className="rounded p-0.5 text-slate-400 hover:text-rose-600"
                        aria-label="Delete chart"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
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
        connectionId={effectiveConnectionId}
        onConnectionChange={(id) => void handleConnectionChange(id)}
        onClose={() => {
          setSaveOpen(false);
          setOpenVizAfterSave(false);
        }}
        onSave={handleSave}
      />

      {queryId && (
        <VizEditorPanel
          open={vizOpen}
          queryId={queryId}
          result={result}
          columns={result?.columns ?? []}
          existing={editViz}
          onClose={() => {
            setVizOpen(false);
            setEditViz(null);
          }}
          onSave={async (body) => {
            if (editViz) {
              await updateViz.mutateAsync({ queryId, vizId: editViz.id, body });
            } else {
              const created = await createViz.mutateAsync({ queryId, body });
              setLastSavedViz(created);
              setAddToDashboardOpen(true);
            }
          }}
          onRecommend={() => recommendViz.mutateAsync(queryId)}
        />
      )}

      <AddToDashboardModal
        open={addToDashboardOpen}
        vizName={lastSavedViz?.name ?? "Chart"}
        onClose={() => setAddToDashboardOpen(false)}
        onPick={async (dashboardId) => {
          if (!lastSavedViz) return;
          await addDashboardItem.mutateAsync({
            dashboardId,
            body: {
              panel_type: "visualization",
              visualization_id: lastSavedViz.id,
            },
          });
        }}
      />

      {deleteConfirmModal}
    </div>
  );
}
