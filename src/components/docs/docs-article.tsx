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

type Props = {
  slug: string;
  content: string;
};

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
  const dataSourcesParts = isDataSources
    ? splitDataSourcesMarkdown(content)
    : null;

  return (
    <div className="flex w-full min-w-0 flex-col xl:flex-row">
      <article
        id="docs-article"
        className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:max-w-3xl"
      >
        <div className="mb-6">
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

      <aside className="hidden w-52 shrink-0 px-4 py-10 xl:block 2xl:w-56">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain">
          <DocsToc containerId="docs-article" variant="sidebar" />
        </div>
      </aside>
    </div>
  );
}
