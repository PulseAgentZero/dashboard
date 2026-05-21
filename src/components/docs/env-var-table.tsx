import type { EnvVarGroup } from "@/lib/docs/env-variables";

type Props = {
  groups: EnvVarGroup[];
};

export function EnvVarTable({ groups }: Props) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.id} id={group.id}>
          <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {group.title}
          </h2>
          {group.description && (
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {group.description}
            </p>
          )}
          <div className="-mx-1 overflow-x-auto rounded-lg border border-zinc-200 sm:mx-0 dark:border-zinc-700">
            <table className="w-full min-w-[520px] text-left text-sm sm:min-w-[640px]">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
                <tr>
                  <th className="px-4 py-2.5 font-semibold text-zinc-700 dark:text-zinc-200">
                    Variable
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-zinc-700 dark:text-zinc-200">
                    Required
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-zinc-700 dark:text-zinc-200">
                    Default
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-zinc-700 dark:text-zinc-200">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {group.vars.map((v) => (
                  <tr
                    key={v.name}
                    className="bg-white dark:bg-zinc-900/50"
                  >
                    <td className="px-3 py-2 font-mono text-[11px] break-all text-orange-700 sm:px-4 sm:py-2.5 sm:text-xs dark:text-orange-300">
                      {v.name}
                      {v.selfHostedOnly && (
                        <span className="ml-1.5 rounded bg-amber-100 px-1 py-0.5 text-[9px] font-semibold uppercase text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                          self-hosted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                      {v.required ? (
                        <span className="font-medium text-rose-600 dark:text-rose-400">
                          Yes
                        </span>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-500 dark:text-zinc-500">
                      {v.default ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                      {v.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
