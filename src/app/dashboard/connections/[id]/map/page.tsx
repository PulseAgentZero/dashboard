"use client";

import { RequireRole } from "@/components/auth/require-role";
import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";
import { DashboardPageShell } from "@/components/layout/dashboard-page-shell";
import { SchemaMappingWizard } from "@/components/schema-mapping/schema-mapping-wizard";
import { useConnections } from "@/hooks/connections/use-connections";
import { useSchemaMappings } from "@/hooks/schema-mappings/use-schema-mappings";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <ConnectionMapPage />
    </RequireRole>
  );
}

function ConnectionMapPage() {
  const params = useParams();
  const router = useRouter();
  const connectionId = params.id as string;

  const { data: connections, isLoading: loadingConn } = useConnections();
  const { data: mappings, isLoading: loadingMap } = useSchemaMappings();

  const connection = useMemo(
    () => connections?.find((c) => c.id === connectionId),
    [connections, connectionId],
  );

  const existingMapping = useMemo(
    () => mappings?.find((m) => m.connection_id === connectionId),
    [mappings, connectionId],
  );

  if (loadingConn || loadingMap) {
    return (
      <DashboardPageShell width="wide" className="space-y-6 py-2">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100" />
      </DashboardPageShell>
    );
  }

  if (!connection) {
    return (
      <DashboardPageShell width="content" className="py-12 text-center">
        <p className="text-sm text-slate-600">Connection not found.</p>
        <Link href="/dashboard/connections" className="mt-2 text-sm font-semibold text-indigo-600">
          Back to connections
        </Link>
      </DashboardPageShell>
    );
  }

  if (!supportsEntityMapping(connection.connector_type)) {
    return (
      <DashboardPageShell width="content" className="space-y-6 py-2">
        <Breadcrumb connectionName={connection.name} />
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <p className="text-base font-semibold text-amber-900">Mapping not available</p>
          <p className="mt-2 max-w-2xl text-sm text-amber-800/90">
            This connector type doesn&apos;t expose a tabular schema, so it can&apos;t be mapped.
            Use a SQL database, a CSV upload, Google Sheets, or S3 if you need pipeline mapping.
          </p>
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="wide" className="space-y-6 py-2">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Breadcrumb connectionName={connection.name} />
          <div className="mt-3 flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {existingMapping ? "Edit data mapping" : "Set up data mapping"}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Configure how Entivia reads entities from this connection
              </p>
            </div>
          </div>
        </div>
        {existingMapping && (
          <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Mapping saved — editing will update the pipeline
          </span>
        )}
      </header>

      <SchemaMappingWizard
        connectionId={connection.id}
        connectionName={connection.name}
        connectorType={connection.connector_type}
        existingMapping={existingMapping}
        onComplete={(result) => {
          if (result?.pipeline_triggered) {
            router.push("/dashboard/pipeline");
          } else {
            router.push("/dashboard/connections");
          }
        }}
        onBack={() => router.push("/dashboard/connections")}
      />
    </DashboardPageShell>
  );
}

function Breadcrumb({ connectionName }: { connectionName?: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
      <Link href="/dashboard/connections" className="inline-flex items-center gap-1 hover:text-indigo-600">
        <ArrowLeft size={14} />
        Connections
      </Link>
      {connectionName && (
        <>
          <span className="text-slate-300">/</span>
          <span className="min-w-0 truncate font-medium text-slate-700">{connectionName}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Map</span>
        </>
      )}
    </nav>
  );
}
