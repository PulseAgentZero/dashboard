# Pipeline API

Inspect recent pipeline runs and trigger new runs programmatically.

**Base path:** `/api/public/v1/pipeline`

**Authentication:** `X-API-Key` — read for listing runs, **write** for `POST /pipeline/trigger`.

## Concurrent runs

The API returns `400` with `PIPELINE_ALREADY_RUNNING` if a run is already in progress for your org.

## Endpoints

See the reference below.
