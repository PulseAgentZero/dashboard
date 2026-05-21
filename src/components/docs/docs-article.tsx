"use client";

import { DocsMarkdown } from "./docs-markdown";
import { DocsToc } from "./docs-toc";
import { PrevNext } from "./prev-next";
import { EnvVarTable } from "./env-var-table";
import { ApiEndpoint } from "./api-endpoint";
import { DataSourcesConnectorTables } from "./data-sources-connector-tables";
import { splitDataSourcesMarkdown } from "@/lib/connectors/docs-catalog";
import { ENV_VAR_GROUPS } from "@/lib/docs/env-variables";
import {
  getCatalogGroupBySlug,
  STUDIO_PUBLIC_ENDPOINTS,
} from "@/lib/docs/public-api-catalog";

type Props = { slug: string; content: string };

const API_SLUG_TO_GROUP: Record<string, string> = {
  "api/entities": "entities",
  "api/recommendations": "recommendations",
  "api/analytics": "analytics",
  "api/pipeline": "pipeline",
};

export function DocsArticle({ slug, content }: Props) {
  const apiGroupKey = API_SLUG_TO_GROUP[slug];
  const apiGroup = apiGroupKey ? getCatalogGroupBySlug(apiGroupKey) : null;
  const showEnvTables = slug === "configuration/environment-variables";
  const isDataSources = slug === "data-sources";
  const dataSourcesParts = isDataSources ? splitDataSourcesMarkdown(content) : null;

  return (
    <div className="flex">
      {/* Article — centered in flex-1 */}
      <article
        id="docs-article"
        className="mx-auto min-w-0 flex-1 max-w-3xl px-4 py-8 sm:px-8 lg:px-12"
      >
        {/* Mobile TOC */}
        <div className="mb-6 xl:hidden">
          <DocsToc containerId="docs-article" variant="mobile" />
        </div>

        {isDataSources && dataSourcesParts ? (
          <>
            <DocsMarkdown content={dataSourcesParts.intro} />
            <DataSourcesConnectorTables />
            <DocsMarkdown content={dataSourcesParts.tail} />
          </>
        ) : (
          <DocsMarkdown content={content} />
        )}

        {showEnvTables && (
          <div className="mt-8">
            <EnvVarTable groups={ENV_VAR_GROUPS} />
          </div>
        )}

        {apiGroup && (
          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800">
            {apiGroup.endpoints.map((ep) => (
              <ApiEndpoint key={ep.id} endpoint={ep} />
            ))}
          </div>
        )}

        {slug === "api/studio" && (
          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800">
            {STUDIO_PUBLIC_ENDPOINTS.map((ep) => (
              <ApiEndpoint key={ep.id} endpoint={ep} showPlaygroundLink={false} />
            ))}
          </div>
        )}

        <PrevNext slug={slug} />
      </article>

      {/* Right TOC — sticks to top of main's scroll container */}
      <aside className="hidden w-56 shrink-0 self-start sticky top-0 max-h-screen overflow-y-auto px-5 py-8 pr-10 xl:block 2xl:w-64">
        <DocsToc containerId="docs-article" variant="sidebar" />
      </aside>
    </div>
  );
}
