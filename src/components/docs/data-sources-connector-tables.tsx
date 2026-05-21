"use client";

import { ConnectorIcon } from "@/components/connectors/connector-icon";
import { DATA_SOURCE_SECTIONS } from "@/lib/connectors/docs-catalog";

export function DataSourcesConnectorTables() {
  return (
    <div className="my-8 space-y-10">
      {DATA_SOURCE_SECTIONS.map((section) => (
        <section key={section.id} id={section.id}>
          <h2 className="mb-3 scroll-mt-24 text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50">
            {section.title}
          </h2>
          {section.description && (
            <p className="mb-4 text-sm leading-7 text-zinc-600 sm:text-[15px] dark:text-zinc-400">
              {section.description}
            </p>
          )}
          <div className="-mx-1 overflow-x-auto rounded-lg border border-zinc-200 sm:mx-0 dark:border-zinc-700">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
                <tr>
                  <th className="w-12 px-3 py-2 sm:px-4 sm:py-2.5" aria-label="Connector" />
                  <th className="px-3 py-2 font-semibold text-zinc-700 sm:px-4 sm:py-2.5 dark:text-zinc-200">
                    Connector
                  </th>
                  <th className="px-3 py-2 font-semibold text-zinc-700 sm:px-4 sm:py-2.5 dark:text-zinc-200">
                    Type ID
                  </th>
                  <th className="px-3 py-2 font-semibold text-zinc-700 sm:px-4 sm:py-2.5 dark:text-zinc-200">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr
                    key={row.connectorType}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-2.5 sm:px-4">
                      <ConnectorIcon
                        connectorType={row.connectorType}
                        size={22}
                        variant="docs"
                      />
                    </td>
                    <td className="px-3 py-2 font-medium text-zinc-800 sm:px-4 sm:py-2.5 dark:text-zinc-200">
                      {row.name}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-2.5">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-orange-700 dark:bg-zinc-800 dark:text-orange-300">
                        {row.connectorType}
                      </code>
                    </td>
                    <td className="px-3 py-2 text-zinc-600 sm:px-4 sm:py-2.5 dark:text-zinc-400">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {section.id === "sql-databases" && (
            <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-[15px] dark:text-zinc-400">
              These support <strong>read-only</strong> session mode for live queries: Entivia does
              not mutate your source data through the connection.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
