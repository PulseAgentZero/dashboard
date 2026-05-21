import Link from "next/link";
import {
  buildExampleCurl,
  type PublicApiEndpoint,
} from "@/lib/docs/public-api-catalog";
import { appHref } from "@/lib/site-urls";
import { CodeBlock } from "./code-block";

type Props = {
  endpoint: PublicApiEndpoint;
  showPlaygroundLink?: boolean;
};

export function ApiEndpoint({ endpoint, showPlaygroundLink = true }: Props) {
  const methodColors =
    endpoint.method === "POST"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300";

  return (
    <article
      id={endpoint.id}
      className="scroll-mt-24 border-b border-zinc-200 py-8 last:border-b-0 dark:border-zinc-800"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 min-w-0">
        <span
          className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${methodColors}`}
        >
          {endpoint.method}
        </span>
        <code className="min-w-0 break-all text-xs font-medium text-zinc-800 sm:text-sm dark:text-zinc-200">
          /api/public/v1{endpoint.path}
        </code>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {endpoint.scope}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {endpoint.label}
      </h3>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {endpoint.description}
      </p>

      {(endpoint.pathParams?.length ?? 0) > 0 && (
        <ParamSection title="Path parameters" params={endpoint.pathParams!} />
      )}
      {(endpoint.queryParams?.length ?? 0) > 0 && (
        <ParamSection title="Query parameters" params={endpoint.queryParams!} />
      )}

      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
        Example
      </h4>
      <CodeBlock language="bash">{buildExampleCurl(endpoint)}</CodeBlock>

      {showPlaygroundLink && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Try this in the{" "}
          <Link
            href={appHref("/dashboard/playground")}
            className="font-medium text-orange-600 hover:underline dark:text-orange-400"
          >
            API Playground
          </Link>{" "}
          (requires sign-in).
        </p>
      )}
    </article>
  );
}

function ParamSection({
  title,
  params,
}: {
  title: string;
  params: { key: string; placeholder?: string; required?: boolean }[];
}) {
  return (
    <div className="mb-4">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
        {title}
      </h4>
      <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        {params.map((p) => (
          <li key={p.key}>
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs text-orange-700 dark:bg-zinc-800 dark:text-orange-300">
              {p.key}
            </code>
            {p.required && (
              <span className="ml-1 text-rose-600 dark:text-rose-400">
                required
              </span>
            )}
            {p.placeholder && (
              <span className="ml-2 text-zinc-400 dark:text-zinc-500">
                — {p.placeholder}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
