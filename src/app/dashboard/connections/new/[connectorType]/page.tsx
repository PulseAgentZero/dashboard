"use client";

import { RequireRole } from "@/components/auth/require-role";
import { use } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useConnectionCatalog } from "@/hooks/connections/use-connections";
import { NewConnectionSetup } from "@/components/connectors/new-connection-setup";

type PageProps = {
  params: Promise<{ connectorType: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <RequireRole minRole="manager">
      <NewConnectionTypePage params={params} />
    </RequireRole>
  );
}

function NewConnectionTypePage({ params }: PageProps) {
  const { connectorType } = use(params);
  const { data: catalog, isLoading } = useConnectionCatalog();

  const catalogItem = catalog?.find((c) => c.connector_type === connectorType);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading connector…</span>
      </div>
    );
  }

  if (!catalogItem) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-8xl">
      <NewConnectionSetup catalogItem={catalogItem} />
    </div>
  );
}
