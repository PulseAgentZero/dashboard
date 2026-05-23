export type ApiParam = {
  key: string;
  placeholder?: string;
  required?: boolean;
};

export type PublicApiEndpoint = {
  id: string;
  label: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  pathParams?: ApiParam[];
  queryParams?: ApiParam[];
  body?: Record<string, string>;
  /** Pretty-printed JSON pre-filled into the Playground body editor for POST endpoints. */
  sampleBody?: string;
  scope: "read" | "write";
};

export type PublicApiGroup = {
  group: string;
  slug: string;
  endpoints: PublicApiEndpoint[];
};

export const PUBLIC_API_CATALOG: PublicApiGroup[] = [
  {
    group: "Entities",
    slug: "entities",
    endpoints: [
      {
        id: "list-entities",
        label: "List entities",
        method: "GET",
        path: "/entities",
        description: "Returns all profiled entities with current risk scores.",
        queryParams: [
          { key: "risk_tier", placeholder: "High | Medium | Low | Healthy" },
          { key: "segment", placeholder: "segment name" },
          { key: "search", placeholder: "search term" },
          { key: "page", placeholder: "1" },
          { key: "limit", placeholder: "50" },
        ],
        scope: "read",
      },
      {
        id: "get-entity",
        label: "Get entity",
        method: "GET",
        path: "/entities/{entity_id}",
        description:
          "Full profile, risk score, and open recommendations for one entity.",
        pathParams: [
          { key: "entity_id", placeholder: "entity-id", required: true },
        ],
        scope: "read",
      },
      {
        id: "entity-risk-history",
        label: "Entity risk history",
        method: "GET",
        path: "/entities/{entity_id}/risk-history",
        description: "Time-series risk scores for an entity.",
        pathParams: [
          { key: "entity_id", placeholder: "entity-id", required: true },
        ],
        queryParams: [{ key: "period", placeholder: "7d | 30d | 90d | 180d" }],
        scope: "read",
      },
    ],
  },
  {
    group: "Recommendations",
    slug: "recommendations",
    endpoints: [
      {
        id: "list-recs",
        label: "List recommendations",
        method: "GET",
        path: "/recommendations",
        description:
          "Returns open recommendations. Filter by status or urgency.",
        queryParams: [
          { key: "status", placeholder: "open | actioned | dismissed" },
          { key: "urgency", placeholder: "critical | high | medium | low" },
          { key: "page", placeholder: "1" },
          { key: "limit", placeholder: "50" },
        ],
        scope: "read",
      },
      {
        id: "get-rec",
        label: "Get recommendation",
        method: "GET",
        path: "/recommendations/{recommendation_id}",
        description: "Full details for a single recommendation.",
        pathParams: [
          { key: "recommendation_id", placeholder: "uuid", required: true },
        ],
        scope: "read",
      },
      {
        id: "action-rec",
        label: "Action recommendation",
        method: "POST",
        path: "/recommendations/{recommendation_id}/action",
        description: "Mark a recommendation as actioned. Requires write scope.",
        pathParams: [
          { key: "recommendation_id", placeholder: "uuid", required: true },
        ],
        scope: "write",
      },
      {
        id: "dismiss-rec",
        label: "Dismiss recommendation",
        method: "POST",
        path: "/recommendations/{recommendation_id}/dismiss",
        description: "Dismiss a recommendation. Requires write scope.",
        pathParams: [
          { key: "recommendation_id", placeholder: "uuid", required: true },
        ],
        scope: "write",
      },
    ],
  },
  {
    group: "Analytics",
    slug: "analytics",
    endpoints: [
      {
        id: "analytics-overview",
        label: "Analytics overview",
        method: "GET",
        path: "/analytics/overview",
        description:
          "Aggregate risk and performance stats for the requested period.",
        queryParams: [{ key: "period", placeholder: "7d | 30d | 90d" }],
        scope: "read",
      },
    ],
  },
  {
    group: "Pipeline",
    slug: "pipeline",
    endpoints: [
      {
        id: "list-runs",
        label: "List pipeline runs",
        method: "GET",
        path: "/pipeline/runs",
        description: "Recent pipeline runs for your org.",
        queryParams: [{ key: "limit", placeholder: "25" }],
        scope: "read",
      },
      {
        id: "trigger-pipeline",
        label: "Trigger pipeline run",
        method: "POST",
        path: "/pipeline/trigger",
        description: "Queue a new pipeline run. Requires a write-scoped key.",
        scope: "write",
      },
    ],
  },
  {
    group: "Simulation",
    slug: "simulation",
    endpoints: [
      {
        id: "simulate-review",
        label: "Simulate a review",
        method: "POST",
        path: "/simulation/review",
        description:
          "Predict an authentic star rating and 2-5 sentence review for a persona × product. Powered by the same agent that runs the hackathon task-a-api.",
        scope: "read",
        sampleBody: JSON.stringify(
          {
            persona: {
              description:
                "Generous reviewer who loves spicy Nigerian food and casual dining. Usually rates 4-5 stars.",
              avg_stars: 4.2,
              top_categories: ["Nigerian", "Restaurants", "Bars"],
              sample_reviews: [
                "The jollof was fire — portions generous and service quick.",
              ],
            },
            product: {
              name: "Tam Tam African Restaurant",
              categories: "African, Restaurants",
              city: "Philadelphia",
              stars: 3.5,
            },
            voice: "default",
          },
          null,
          2,
        ),
      },
      {
        id: "recommend-cold-start",
        label: "Persona-driven recommendations",
        method: "POST",
        path: "/simulation/recommend",
        description:
          "Cold-start recommendations from a free-text persona. Supports multi-turn refinement and cross-domain (yelp | goodreads). Powered by the hackathon task-b-api agent.",
        scope: "read",
        sampleBody: JSON.stringify(
          {
            persona:
              "loves spicy Nigerian jollof, suya, and late-night food spots",
            k: 5,
            dataset: "yelp",
          },
          null,
          2,
        ),
      },
    ],
  },
];

export const STUDIO_PUBLIC_ENDPOINTS: PublicApiEndpoint[] = [
  {
    id: "studio-public-dashboard",
    label: "Public dashboard by slug",
    method: "GET",
    path: "/studio/dashboards/{slug}",
    description:
      "Returns a public Studio dashboard and executes all chart queries. Only dashboards with is_public=true.",
    pathParams: [{ key: "slug", placeholder: "my-dashboard", required: true }],
    queryParams: [
      {
        key: "filter_name",
        placeholder: "Any dashboard filter param as query string",
      },
    ],
    scope: "read",
  },
  {
    id: "studio-embed",
    label: "Embed dashboard by token",
    method: "GET",
    path: "/studio/embed/{token}",
    description:
      "Returns a dashboard via a short-lived embed token. Requires Redis on the API. No authentication.",
    pathParams: [{ key: "token", placeholder: "embed-token", required: true }],
    scope: "read",
  },
];

export function getCatalogGroupBySlug(
  slug: string,
): PublicApiGroup | undefined {
  return PUBLIC_API_CATALOG.find((g) => g.slug === slug);
}

export function buildPublicApiUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const base = (url !== undefined ? url : "http://localhost:8000").replace(/\/$/, "");
  return `${base}/api/public/v1${path}`;
}

export function buildExampleCurl(endpoint: PublicApiEndpoint): string {
  let path = endpoint.path;
  for (const p of endpoint.pathParams ?? []) {
    path = path.replace(`{${p.key}}`, p.placeholder ?? "value");
  }
  const url = buildPublicApiUrl(path);
  const isStudioPublic = path.startsWith("/studio/");
  const lines = [`curl -X ${endpoint.method} '${url}'`];
  if (!isStudioPublic) {
    lines[0] += " \\";
    lines.push(`  -H 'X-API-Key: YOUR_API_KEY'`);
  }
  if (endpoint.method === "POST") {
    if (!isStudioPublic) lines[lines.length - 1] += " \\";
    else lines[0] += " \\";
    lines.push(`  -H 'Content-Type: application/json' \\`);
    const body = endpoint.sampleBody ?? "{}";
    lines.push(`  -d '${body.replace(/'/g, "'\\''")}'`);
  }
  return lines.join("\n");
}
