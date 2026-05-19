import { BookOpen, Shield } from "lucide-react";
import { DashboardDocsLink } from "@/components/dashboard/docs-link";
import { ConnectorIcon } from "./connector-icon";
import type { ConnectorCatalogItem } from "@/types/connections";
import { getConnectorMeta } from "@/lib/connectors/registry";

type Props = {
  catalogItem: ConnectorCatalogItem;
};

export function ConnectorSetupGuide({ catalogItem }: Props) {
  const guide = getConnectorMeta(catalogItem.connector_type);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ConnectorIcon connectorType={catalogItem.connector_type} size={32} />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {catalogItem.display_name}
          </h2>
          {catalogItem.description && (
            <p className="mt-0.5 text-sm text-slate-500">{catalogItem.description}</p>
          )}
        </div>
      </div>

      {guide?.docHref && (
        <DashboardDocsLink
          href={guide.docHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <BookOpen size={14} />
          View documentation
        </DashboardDocsLink>
      )}

      {guide && guide.prerequisites.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Prerequisites
          </h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            {guide.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {guide && guide.steps.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Setup guide
          </h3>
          <ol className="space-y-4">
            {guide.steps.map((step, i) => (
              <li key={step.title} className="text-sm">
                <p className="font-medium text-slate-800">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-1 text-slate-600">{step.body}</p>
                {step.code && (
                  <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-3 text-xs text-slate-100">
                    <code>{step.code}</code>
                  </pre>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {!guide && catalogItem.description && (
        <p className="text-sm text-slate-600">{catalogItem.description}</p>
      )}

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Shield size={14} />
          Security tips
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          {(guide?.securityTips ?? [
            "Use read-only credentials where possible.",
            "Restrict network access to Pulse only.",
          ]).map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <DashboardDocsLink
          href="/docs/data-sources#security-recommendations"
          className="mt-3 inline-block text-xs font-medium text-blue-600 hover:underline"
        >
          Full security recommendations →
        </DashboardDocsLink>
      </section>
    </div>
  );
}
