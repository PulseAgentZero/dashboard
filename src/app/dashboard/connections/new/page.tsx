import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { ConnectorPicker } from "@/components/connectors/connector-picker";

export default function NewConnectionPage() {
  return (
    <RequireRole minRole="manager">
      <div className="mx-auto max-w-8xl space-y-6">
        <div>
          <Link
            href="/dashboard/connections"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={14} />
            Back to connections
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Add a connection</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Choose a data source. You will see a setup guide and configuration form for each
            connector.
          </p>
        </div>

        <ConnectorPicker />
      </div>
    </RequireRole>
  );
}
