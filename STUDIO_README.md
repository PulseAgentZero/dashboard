# Pulse Studio — Developer Reference

Pulse Studio is the SQL analytics layer of Pulse. It lets users write SQL queries against their connected client databases, build visualizations, and assemble custom dashboards — similar to Dune Analytics but for private business databases.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Concepts](#key-concepts)
- [All Backend Endpoints](#all-backend-endpoints)
  - [Schema Browser](#schema-browser)
  - [Ad-hoc Execution](#ad-hoc-execution)
  - [Saved Queries](#saved-queries)
  - [Async Query Runs](#async-query-runs)
  - [Visualizations](#visualizations)
  - [Dashboards](#dashboards)
  - [Public & Embed Endpoints](#public--embed-endpoints)
- [Plan Limits](#plan-limits)
- [Frontend Pages to Build](#frontend-pages-to-build)
- [Frontend Components to Build](#frontend-components-to-build)
- [Data Flow Diagrams](#data-flow-diagrams)

---

## Architecture Overview

```
User Browser
    │
    ├── api service (FastAPI, port 8000)
    │     └── /api/v1/studio/*  ← all authenticated Studio endpoints
    │
    ├── worker service (background, no port)
    │     └── Picks up studio_query jobs from Redis queue
    │     └── Executes SQL against client DB, stores result in Redis
    │
    ├── scheduler service (background, no port)
    │     └── Runs auto-refresh cron jobs (studio_refresh_scheduler)
    │
    └── /api/public/v1/studio/*  ← unauthenticated public endpoints
          ├── GET /dashboards/{slug}   public dashboard by slug
          └── GET /embed/{token}       private dashboard via embed token
```

All studio data is stored in the Pulse Postgres database (never in the client database).
All SQL execution runs against the client's own database (read-only, with 30s timeout).

---

## Key Concepts

### Parameterized Queries
SQL can contain `{{param_name}}` placeholders:
```sql
SELECT * FROM orders
WHERE created_at >= {{start_date}}
  AND region = {{region}}
```
When saving a query, declare each param with type and default:
```json
"params": [
  { "name": "start_date", "type": "date", "default_value": "2025-01-01", "label": "Start Date" },
  { "name": "region",     "type": "text", "default_value": "US",         "label": "Region" }
]
```
At run time, pass `param_values: {"start_date": "2025-01-01", "region": "EU"}`.
Types: `text`, `number`, `date`, `datetime`.

### Dashboard Filters
Dashboards have `dashboard_params` — a list of filter definitions that apply across all charts.
When the user changes a filter (e.g., date range), call `POST /dashboards/{id}/execute` with the new values.
The backend runs all charts with those values and returns results per visualization.

### Async Query Execution
Saved query runs are async:
1. `POST /queries/{id}/run` → returns `{id, status: "pending"}` immediately
2. Worker picks up the job, executes, stores result in Redis (1 hour TTL)
3. Frontend polls `GET /runs/{run_id}` until `status === "completed"` or `"failed"`
4. When completed, `result` is included inline in the response

Ad-hoc execution (`POST /studio/query/execute`) is synchronous — meant for the interactive editor.

### Auto-Refresh Schedule
Queries can have a `refresh_cron` (standard 5-field cron expression).
When `refresh_enabled: true`, the scheduler service re-runs the query on schedule and warms the Redis cache.
Dashboards that load these queries will see fresh cached data without hitting the client DB.

### Text Panels
Dashboard items can be visualization panels (`panel_type: "visualization"`) or text/markdown panels (`panel_type: "text"`).
Text panels display rich text between charts — useful for section headers and annotations.

### Stars / Favorites
Users can star queries and dashboards. Starred items appear first when filtering with `?starred=true`.

---

## All Backend Endpoints

Base URL: `https://your-api.com/api/v1/studio`
Auth: `Authorization: Bearer <jwt_token>` on all internal endpoints.

---

### Schema Browser

#### `GET /studio/schema`
Returns all tables and columns from the org's connected database. Powers SQL editor autocomplete.

**Query params:**
- `connection_id` (optional UUID) — specific connection; defaults to primary active connection.

**Response:**
```json
{
  "tables": [
    {
      "name": "orders",
      "columns": [
        { "name": "id",         "data_type": "uuid",      "nullable": false },
        { "name": "amount",     "data_type": "numeric",   "nullable": true  },
        { "name": "created_at", "data_type": "timestamp", "nullable": false }
      ]
    }
  ]
}
```

**Caching:** Redis 30 min → `schema_mappings.raw_schema` → live query.

---

#### `POST /studio/schema/refresh`
Clears the schema cache and fetches a fresh schema from the client DB.
Call this when the user adds new tables or columns and needs the editor to see them.

**Auth:** analyst+
**Response:** Same shape as `GET /studio/schema`.

---

### Ad-hoc Execution

#### `POST /studio/query/execute`
Execute a one-off SQL query. Synchronous — response includes results immediately.
Used by the interactive SQL editor.

**Request body:**
```json
{
  "sql_text":    "SELECT * FROM orders WHERE region = {{region}} LIMIT 100",
  "connection_id": null,
  "param_values": { "region": "EU" },
  "page":        1,
  "page_size":   100
}
```

**Response:**
```json
{
  "rows":      [{ "id": "...", "amount": 99.99 }],
  "columns":   ["id", "amount"],
  "total":     1500,
  "page":      1,
  "page_size": 100,
  "cached":    false
}
```

**Errors:** `400 INVALID_SQL`, `400 CLIENT_DB_ERROR`, `400 PARAM_MISSING`, `429 RATE_LIMITED`.

---

### Saved Queries

#### `GET /studio/queries`
List saved queries with optional search, tag filter, and star filter.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default 1) |
| `limit` | int | Page size (default 50, max 200) |
| `q` | string | Search name and description |
| `tags` | string | Comma-separated tags, e.g. `finance,revenue` |
| `starred` | bool | Only return starred queries |

**Response:** `{ queries: [...], total, page }`

---

#### `POST /studio/queries/generate`
**AI** — Generate SQL from a natural language goal. Does NOT save anything.

**Request body:**
```json
{
  "goal": "top 10 customers by total revenue in the last 30 days",
  "connection_id": null
}
```

**Response:**
```json
{
  "sql":         "SELECT customer_id, SUM(amount) AS revenue FROM orders WHERE ...",
  "explanation": "Finds the top 10 customers ranked by total revenue in the past 30 days.",
  "params":      [{ "name": "days", "type": "number", "default_value": "30", "label": "Days" }]
}
```

Show this to the user for review before saving. They can edit the SQL and then call `POST /studio/queries`.

---

#### `POST /studio/queries`
Save a query. Requires analyst+ role.

**Request body:**
```json
{
  "name":            "Top customers by revenue",
  "description":     "Ranks customers by total order value",
  "sql_text":        "SELECT customer_id, SUM(amount) FROM orders WHERE ...",
  "connection_id":   null,
  "params":          [{ "name": "start_date", "type": "date", "default_value": "2025-01-01", "label": "Start" }],
  "tags":            ["finance", "customers"],
  "refresh_cron":    "0 6 * * *",
  "refresh_enabled": true
}
```

**Response:** `StudioQueryResponse` (201 Created)

---

#### `GET /studio/queries/{query_id}`
Get a single saved query.

**Response fields:** `id`, `name`, `description`, `sql_text`, `params`, `tags`, `refresh_cron`, `refresh_enabled`, `last_run_at`, `last_run_row_count`, `starred`.

---

#### `PATCH /studio/queries/{query_id}`
Update a saved query. All fields optional.
Analysts can only edit their own queries. Managers and admins can edit any.

---

#### `DELETE /studio/queries/{query_id}`
Delete a query permanently. Requires manager/admin.
Cascades: all linked visualizations are also deleted.

---

#### `GET /studio/queries/{query_id}/explain`
**AI** — Returns a 2–4 sentence plain-English explanation of what the SQL does.

**Response:** `{ "explanation": "This query finds the top 10 customers by total spend in the last 30 days..." }`

---

#### `POST /studio/queries/{query_id}/recommend-viz`
**AI** — Analyzes the query's result columns and recommends a chart type + config.

**Response:**
```json
{
  "chart_type": "bar",
  "config":     { "x_axis": "customer_id", "y_axis": "revenue", "title": "Top Customers" },
  "reasoning":  "One numeric column and one categorical column — bar chart is ideal."
}
```

Use this to pre-fill the visualization creation form.

---

#### `POST /studio/queries/{query_id}/star` / `DELETE /studio/queries/{query_id}/star`
Star or unstar a query. Both return 204. Idempotent.

---

### Async Query Runs

#### `POST /studio/queries/{query_id}/run`
Enqueue a saved query for async execution. Returns **202 Accepted** immediately.

**Request body (optional):**
```json
{
  "param_values": { "start_date": "2025-01-01", "region": "US" },
  "page":         1,
  "page_size":    100
}
```

**Response:**
```json
{
  "id":          "uuid",
  "status":      "pending",
  "param_values": { "start_date": "2025-01-01" },
  "row_count":   null,
  "error":       null,
  "result":      null
}
```

**When Redis is unavailable:** executes synchronously, returns `status: "completed"` with `result` inline.

---

#### `GET /studio/runs/{run_id}`
Poll for run status and results.

**Response status values:**
- `pending` — queued, not started
- `running` — worker is executing
- `completed` — results available in `result` field (expires after 1 hour)
- `failed` — see `error` field

**When completed:**
```json
{
  "id":        "uuid",
  "status":    "completed",
  "row_count": 1500,
  "result": {
    "rows":      [...],
    "columns":   ["customer_id", "revenue"],
    "total":     1500,
    "page":      1,
    "page_size": 100,
    "cached":    false
  }
}
```

**Suggested polling interval:** 1 second for the first 10 seconds, then 3 seconds.

---

#### `GET /studio/runs/{run_id}/download?format=csv`
Download query results as a file. Only available when `status === "completed"`.

**Query params:**
- `format` — `csv` (default) or `json` (newline-delimited JSON)

Returns a streaming file download.

---

#### `GET /studio/queries/{query_id}/runs`
List execution history for a query (most recent first).

**Query params:** `limit` (default 20, max 100)

**Response:** `{ runs: [...] }` — useful for a "Run History" panel showing past executions, their status, row counts, and timestamps.

---

### Visualizations

#### `GET /studio/queries/{query_id}/visualizations`
List all visualizations for a query.

**Response:** `{ visualizations: [...] }`

---

#### `POST /studio/queries/{query_id}/visualizations`
Create a chart for a query. Requires analyst+.

**Request body:**
```json
{
  "name":       "Revenue by Month",
  "chart_type": "line",
  "config": {
    "x_axis": "month",
    "y_axis": "revenue",
    "title":  "Monthly Revenue",
    "color":  "#4f46e5"
  },
  "column_formats": {
    "revenue": { "type": "currency", "symbol": "$", "decimals": 0 },
    "growth":  { "type": "percent", "decimals": 1 }
  }
}
```

**Supported chart types:**
`bar`, `line`, `area`, `pie`, `scatter`, `table`, `number`, `funnel`, `heatmap`, `gauge`, `waterfall`, `trend`

**Column format types:** `currency`, `percent`, `date`, `badge`, `number`
For `badge`: provide `colors: { "active": "#22c55e", "inactive": "#ef4444" }`

---

#### `PATCH /studio/queries/{query_id}/visualizations/{viz_id}`
Update chart type, config, or column formats. All fields optional.

---

#### `DELETE /studio/queries/{query_id}/visualizations/{viz_id}`
Delete a visualization. Requires manager/admin.

---

### Dashboards

#### `GET /studio/dashboards`
List dashboards with search, tag, and star filtering.

**Query params:** same as queries (`page`, `limit`, `q`, `tags`, `starred`).

---

#### `POST /studio/dashboards`
Create a dashboard. Requires analyst+.

**Request body:**
```json
{
  "name":        "Revenue Overview",
  "description": "Monthly revenue and top customer breakdown",
  "is_public":   false,
  "layout":      [],
  "dashboard_params": [
    { "name": "start_date", "type": "date",   "default_value": "2025-01-01", "label": "From" },
    { "name": "region",     "type": "text",   "default_value": "US",         "label": "Region" }
  ],
  "tags": ["finance", "revenue"]
}
```

**Plan limit:** Free plan allows 5 dashboards. Pro and self-hosted are unlimited.

---

#### `GET /studio/dashboards/{dashboard_id}`
Get a full dashboard with all its items.

**Response includes:**
- `items` — array of `StudioDashboardItem` (all panels)
- `dashboard_params` — filter definitions
- `layout` — grid positions: `[{ item_id, x, y, w, h }]`
- `slug` — set when `is_public: true`
- `starred` — whether the current user has starred it

---

#### `POST /studio/dashboards/{dashboard_id}/execute`
**This is the dashboard filters endpoint.** Run all charts with filter values.

**Request body:**
```json
{
  "param_values": {
    "start_date": "2025-01-01",
    "region":     "EU"
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "visualization_id": "uuid",
      "result": { "rows": [...], "columns": [...], "total": 150, ... },
      "error": null
    },
    {
      "visualization_id": "uuid2",
      "result": null,
      "error": "Column 'region' not found in table"
    }
  ]
}
```

Individual chart failures don't fail the whole response — always check `error` per item.

---

#### `PATCH /studio/dashboards/{dashboard_id}`
Update dashboard name, description, layout, filters, tags, or visibility. Requires manager/admin.

Setting `is_public: true` auto-generates a shareable slug.
Setting `dashboard_params` defines the filter inputs shown above the dashboard.

---

#### `DELETE /studio/dashboards/{dashboard_id}`
Delete a dashboard and all its items. Requires manager/admin.
Does NOT delete the underlying queries or visualizations.

---

#### `POST /studio/dashboards/{dashboard_id}/fork`
Create a copy of a dashboard. Always creates as private. Requires analyst+.

**Request body:**
```json
{ "name": "My Copy" }
```

**Response:** New `StudioDashboardResponse` (201 Created)

---

#### `POST /studio/dashboards/{dashboard_id}/star` / `DELETE /studio/dashboards/{dashboard_id}/star`
Star or unstar a dashboard. 204. Idempotent.

---

#### `POST /studio/dashboards/{dashboard_id}/embed-token`
Generate a time-limited token for iframe embedding. Requires manager/admin.
**Requires Redis** to be configured.

**Request body:**
```json
{ "expires_in_hours": 48 }
```

**Response:**
```json
{
  "token":      "abc123...",
  "embed_url":  "/api/public/v1/studio/embed/abc123...",
  "expires_at": "2025-01-03T12:00:00Z"
}
```

Use the `embed_url` as the `src` of an `<iframe>`.

---

#### `POST /studio/dashboards/{dashboard_id}/items`
Add a visualization panel or text/markdown panel to a dashboard.

**Visualization panel:**
```json
{
  "panel_type":       "visualization",
  "visualization_id": "uuid",
  "position":         0
}
```

**Text/markdown panel:**
```json
{
  "panel_type": "text",
  "content":    "## Q1 Revenue Summary\nThis section shows revenue KPIs for Q1 2025.",
  "position":   0
}
```

**Limit:** Max 20 items per dashboard.

---

#### `DELETE /studio/dashboards/{dashboard_id}/items/{item_id}`
Remove a panel from a dashboard. Does not delete the visualization.

---

### Public & Embed Endpoints

Base URL: `/api/public/v1/studio`
No authentication required.

#### `GET /api/public/v1/studio/dashboards/{slug}`
View a public dashboard (must have `is_public: true`).

**Dashboard filters via query params:**
```
GET /api/public/v1/studio/dashboards/revenue-overview-a1b2?start_date=2025-01-01&region=EU
```
Any query parameter is forwarded as a filter value to all charts.

**Rate limit:** 60 req/min per IP.

---

#### `GET /api/public/v1/studio/embed/{token}`
View a private dashboard using an embed token. Intended for `<iframe>` use.

Same filter query param support as the slug endpoint.

---

## Plan Limits

| Feature | Free Plan (Cloud) | Pro Plan / Self-Hosted |
|---------|------------------|----------------------|
| Studio dashboards | **5** | Unlimited |
| Query executions per day | **200** | Unlimited |
| Ad-hoc execution | ✓ | ✓ |
| Saved queries | ✓ | ✓ |
| Auto-refresh schedules | ✓ | ✓ |
| Public dashboards | ✓ | ✓ |
| Embed tokens | ✓ | ✓ |
| AI features (NL→SQL, explain, recommend) | ✓ | ✓ |

Current usage is visible at `GET /api/v1/organization/usage`.

---

## Frontend Pages to Build

### 1. Studio Home — `/studio`
The entry point for Studio. Shows saved queries and dashboards in one place.

**UI elements:**
- Tabs or split view: "Queries" | "Dashboards"
- Search bar → calls `GET /studio/queries?q=...` and `GET /studio/dashboards?q=...`
- Tag filter pills → `?tags=finance,revenue`
- "Starred only" toggle → `?starred=true`
- "New Query" button → navigates to editor
- "New Dashboard" button → opens create dashboard modal
- Query cards: name, description, last run time, tags, star toggle, run button
- Dashboard cards: name, description, updated time, tags, star toggle, public badge

---

### 2. SQL Editor — `/studio/queries/new` and `/studio/queries/{id}`
The core query writing experience.

**Layout:** Two-panel — left sidebar (schema browser) + right main area (editor + results).

**Left sidebar — Schema Browser:**
- On mount: `GET /studio/schema` → display table tree (collapsible)
- Each table shows column names and data types
- Click table/column → inserts name into editor at cursor
- "Refresh Schema" button → `POST /studio/schema/refresh`

**Main area — Editor:**
- Monaco Editor or CodeMirror with SQL syntax highlighting
- Autocomplete: tables and columns from schema (loaded once on mount)
- Param inputs: detect `{{param_name}}` in SQL in real time → render input fields above/below editor for each param
- "Run" button → `POST /studio/query/execute` (synchronous, inline result)
- "Save" button → opens save dialog → `POST /studio/queries`
- If editing existing query (`/studio/queries/{id}`): loads `GET /studio/queries/{id}` on mount

**Results panel (below editor):**
- Table view of results
- Row count + pagination
- "Download CSV" button → `GET /studio/runs/{run_id}/download?format=csv` (available after a saved run)
- "Create Visualization" button → opens viz config panel
- AI buttons: "Explain Query" → `GET /queries/{id}/explain`, "Recommend Chart" → `POST /queries/{id}/recommend-viz`

**Save Query Modal:**
- Name, description, tags
- Param definitions table (name, type, default value, label) — auto-populated from detected `{{placeholders}}`
- Refresh schedule: cron expression input + enable toggle
- Cron helper: buttons for "Every hour", "Every day at 9am", "Every Sunday" etc.

**Execution history sidebar/panel:**
- List of past runs from `GET /queries/{id}/runs`
- Status badge, timestamp, row count, error message

---

### 3. Visualization Editor — accessible from the SQL Editor results panel

Opens as a slide-over or modal.

**Fields:**
- Chart name
- Chart type selector (visual icons for each type): `bar`, `line`, `area`, `pie`, `scatter`, `table`, `number`, `funnel`, `heatmap`, `gauge`, `waterfall`, `trend`
- Axis config based on type:
  - bar/line/area: x_axis (categorical), y_axis (numeric)
  - pie: label_column, value_column
  - number/gauge: value_column
  - scatter: x_axis (numeric), y_axis (numeric)
- Color picker
- Title input
- Column formats table: per-column rules (currency, percent, date, badge, number)
- "Use AI Recommendation" button → pre-fills from `POST /queries/{id}/recommend-viz`

On save: `POST /studio/queries/{id}/visualizations`

---

### 4. Dashboard Builder — `/studio/dashboards/{id}/edit`
Drag-and-drop interface for arranging visualizations.

**Recommended library:** `react-grid-layout` for the drag/resize grid.

**Left panel — Item picker:**
- Search/browse existing visualizations (from the org's saved queries)
- Drag viz cards onto the grid

**Main area — Grid canvas:**
- 12-column grid, draggable + resizable items
- Each item shows the chart (static preview using last cached data)
- Click item → opens item config side panel
- "Add Text Panel" button → opens text/markdown editor

**Text panel editor:**
- Markdown textarea with preview
- Creates `POST /dashboards/{id}/items` with `panel_type: "text"`

**Top bar:**
- Dashboard name (editable inline)
- Tags editor
- "Save Layout" → `PATCH /dashboards/{id}` with updated `layout` array
- "Dashboard Settings" button → opens settings panel

**Dashboard Settings Panel:**
- Name, description
- Tags
- `is_public` toggle → shows slug URL when public
- Dashboard Filters section:
  - Add filter button → define name, type, label, default
  - Each filter becomes a `QueryParamDefinition` in `dashboard_params`
- "Generate Embed Code" → `POST /dashboards/{id}/embed-token` → shows `<iframe>` snippet

**On grid reorder/resize:**
Update local state only. On "Save Layout", send `PATCH /dashboards/{id}` with the full `layout` array:
```json
[
  { "item_id": "uuid1", "x": 0, "y": 0, "w": 6, "h": 4 },
  { "item_id": "uuid2", "x": 6, "y": 0, "w": 6, "h": 4 }
]
```

---

### 5. Dashboard View — `/studio/dashboards/{id}`
Read-only view of a dashboard with live filters.

**Top bar:**
- Dashboard name + description
- Tags (display only)
- "Edit" button → navigates to builder
- "Fork" button → `POST /dashboards/{id}/fork` → modal to name the fork
- Star button → `POST/DELETE /dashboards/{id}/star`
- Share button (if public): copy slug URL
- "Download" dropdown: not applicable at dashboard level (per-chart download)

**Filter bar (if `dashboard_params` is non-empty):**
- One input per `dashboard_params` item
- Input type based on `type`: `date` → date picker, `number` → number input, `text` → text input
- Default values pre-filled from each param's `default_value`
- "Apply Filters" button → `POST /dashboards/{id}/execute` with current filter values
- On mount: auto-execute with default values

**Grid:**
- Render items in grid positions from `layout`
- Text panels: render markdown
- Visualization panels: render the chart using result data from the execute call
- Per-chart loading/error states (individual charts can fail independently)
- Per-chart "Download" button → triggers `POST /queries/{id}/run` then `GET /runs/{id}/download`

**How to load the dashboard:**
1. `GET /studio/dashboards/{id}` → get items list + dashboard_params + layout
2. For each visualization item, load the viz details (already in items via the API)
3. `POST /studio/dashboards/{id}/execute` with default param values → get all chart data
4. Render grid

---

### 6. Public Dashboard — `/p/{slug}` (or `/dashboard/{slug}`)
Unauthenticated view of a public dashboard.

**API call:** `GET /api/public/v1/studio/dashboards/{slug}?{filter_params}`

Same layout as Dashboard View but:
- No edit/fork/star controls
- No auth header
- Filter bar works by appending query params to the URL and re-fetching: `GET /api/public/v1/studio/dashboards/{slug}?start_date=2025-01-01`
- Pulse branding footer ("Powered by Pulse")

---

### 7. Embed View — `/embed/studio/{token}`
For `<iframe>` embedding. Minimal chrome — just the grid + optional filter bar.

**API call:** `GET /api/public/v1/studio/embed/{token}?{filter_params}`

- No navigation, no header
- Filter bar visible if `dashboard_params` is non-empty
- Error states: "This dashboard is no longer available" if token expired

---

## Frontend Components to Build

### Core Data Components
| Component | Used In | Notes |
|-----------|---------|-------|
| `SQLEditor` | Query editor | Monaco/CodeMirror, SQL highlighting, autocomplete |
| `SchemaBrowser` | Query editor sidebar | Tree view of tables + columns |
| `ParamInputs` | Query editor, dashboard filter bar | Dynamic inputs based on param type |
| `ResultsTable` | Query editor, run polling | Sortable, paginated, column format aware |
| `RunStatusPoller` | Query editor, dashboard | Polls `GET /runs/{id}` with backoff |

### Chart Components
All charts receive `rows: object[]` + `columns: string[]` + `config: object` + `column_formats: object`.

| Chart Type | Library Suggestion |
|------------|-------------------|
| `bar` | Recharts `BarChart` |
| `line` | Recharts `LineChart` |
| `area` | Recharts `AreaChart` |
| `pie` | Recharts `PieChart` |
| `scatter` | Recharts `ScatterChart` |
| `table` | Custom table (use `column_formats` for rendering) |
| `number` | Custom large-number card |
| `funnel` | Recharts `FunnelChart` |
| `heatmap` | `react-heatmap-grid` or custom |
| `gauge` | `react-gauge-component` or custom SVG |
| `waterfall` | Recharts `ComposedChart` with custom bars |
| `trend` | Recharts `LineChart` with a sparkline variant |

### Dashboard Components
| Component | Notes |
|-----------|-------|
| `DashboardGrid` | `react-grid-layout` wrapper; passes layout → parent on change |
| `DashboardFilterBar` | Renders `dashboard_params` as inputs; "Apply" triggers execute |
| `DashboardItem` | Renders either a chart or a markdown text panel |
| `MarkdownPanel` | Renders `content` as markdown (`react-markdown`) |
| `VisualizationCard` | Chart wrapper with loading/error state + download button |
| `EmbedCodeModal` | Calls embed-token API, shows `<iframe>` snippet |

### UI Utility Components
| Component | Notes |
|-----------|-------|
| `TagEditor` | Multi-value input for tags |
| `CronBuilder` | Cron expression input with preset buttons |
| `ColumnFormatEditor` | Table for configuring per-column display rules |
| `ChartTypePicker` | Visual icon grid for selecting chart type |
| `StarButton` | Toggle with optimistic UI update |
| `PublicBadge` | Shows slug URL and copy button when `is_public: true` |

---

## Data Flow Diagrams

### Creating and running a query
```
User writes SQL in editor
        │
        ▼
POST /studio/query/execute  ─── synchronous ──→  results shown in table
        │
"Save" clicked
        │
        ▼
POST /studio/queries  ──→  query saved with params/tags/schedule
        │
"Run" clicked on saved query
        │
        ▼
POST /studio/queries/{id}/run  ──→  { run_id, status: "pending" }
        │
        ▼
Poll GET /studio/runs/{run_id}  ──→  status: "running"
        │
        ▼
Poll GET /studio/runs/{run_id}  ──→  status: "completed", result: { rows, columns }
        │
        ▼
Render results table + "Download" button available
```

### Building and viewing a dashboard
```
User creates dashboard
        │
POST /studio/dashboards  ──→  { id, dashboard_params: [] }
        │
Add visualizations as items
        │
POST /studio/dashboards/{id}/items  (×N)
        │
Arrange in grid builder  →  PATCH /studio/dashboards/{id} with layout
        │
        ▼
Dashboard View page loads
        │
GET /studio/dashboards/{id}  ──→  items + layout + dashboard_params
        │
User sets filter values  →  POST /studio/dashboards/{id}/execute
        │
        ▼
{ results: [{ visualization_id, result }] }  ──→  render each chart
```

### Public dashboard flow
```
Manager clicks "Make Public"
        │
PATCH /studio/dashboards/{id}  { is_public: true }  ──→  { slug: "revenue-q1-a1b2" }
        │
Share URL: /p/revenue-q1-a1b2
        │
Visitor opens URL (no login)
        │
GET /api/public/v1/studio/dashboards/revenue-q1-a1b2?start_date=2025-01-01
        │
Backend runs all chart queries with param_values  ──→  returns PublicDashboardResponse
        │
Render read-only dashboard with filter bar
```

---

## Notes for the Frontend Developer

1. **All timestamps** are returned as ISO 8601 strings. Parse with `new Date(str)`.

2. **UUID fields** are returned as strings. Send them as strings in requests.

3. **Polling backoff** for run status: poll every 1s for first 10s, then every 3s. Stop after `status === "completed"` or `"failed"`. Max poll time: 5 minutes.

4. **Optimistic UI** for star/unstar — update the UI immediately, revert if the API call fails.

5. **Column formats** — the backend stores them but rendering is entirely frontend's responsibility. Use `column_formats[colName].type` to decide how to format cells in tables and chart tooltips.

6. **Layout array** — when saving a dashboard layout, send the full layout array in every `PATCH`. The grid positions use a 12-column coordinate system (w: 1–12, x: 0–11, y: 0–∞, h: any integer ≥ 1).

7. **Error envelope** — all errors follow the shape `{ "error": { "code": "...", "message": "..." } }`. The `code` field is machine-readable for conditional UI logic.

8. **Plan limit errors** return HTTP 402 with code `PLAN_LIMIT_REACHED` or `FEATURE_LOCKED`. Show an upgrade prompt.

9. **Text panels** — `content` is raw markdown. Render with `react-markdown` or similar. Support headers, bold, italic, lists, and code blocks.

10. **Dashboard execute vs. individual run** — use `POST /dashboards/{id}/execute` for the dashboard filter bar (all charts together). Use `POST /queries/{id}/run` for running a single query from the editor.
