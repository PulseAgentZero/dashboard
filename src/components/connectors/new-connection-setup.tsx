"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ConnectorCatalogItem } from "@/types/connections";
import { isSqlEntityMappingConnector } from "@/lib/connectors/pipeline-supported";
import { ConnectorSetupGuide } from "./connector-setup-guide";
import { ConnectionForm } from "./connection-form";

type Props = {
  catalogItem: ConnectorCatalogItem;
};

export function NewConnectionSetup({ catalogItem }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/connections/new"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} />
        All connectors
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <ConnectorSetupGuide catalogItem={catalogItem} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Configuration</h2>
          <ConnectionForm
            catalogItem={catalogItem}
            onSuccess={(connection) => {
              if (!connection) {
                router.push("/dashboard/connections");
                return;
              }
              // SQL DBs need the user to pick an entity table; redirect to the
              // wizard. File sources (CSV, Google Sheets, S3) auto-map in the
              // worker and are editable from the data-mapping page afterwards —
              // redirecting here would race the background mapping job.
              if (isSqlEntityMappingConnector(catalogItem.connector_type)) {
                router.push(`/dashboard/connections/${connection.id}/map`);
              } else {
                router.push("/dashboard/connections");
              }
            }}
            onCancel={() => router.push("/dashboard/connections/new")}
          />
        </div>
      </div>
    </div>
  );
}
