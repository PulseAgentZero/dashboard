import type { CatalogField, ConnectorCatalogItem } from "@/types/connections";

/** Ensure catalog fields exist even if the API is on an older build. */
const FIELD_PATCHES: Record<string, CatalogField[]> = {
  bigquery: [
    {
      key: "connection_url",
      label: "Connection URL",
      type: "string",
      required: true,
      placeholder: "bigquery://my-project/my_dataset",
      help: "Format: bigquery://project_id/dataset_id",
    },
    {
      key: "bigquery_service_account_json",
      label: "Service Account JSON",
      type: "textarea",
      required: false,
      placeholder: '{"type": "service_account", "project_id": "...", ...}',
      help: "Paste the full JSON key from GCP. Required unless ADC is configured on the Entivia host.",
    },
  ],
  google_sheets: [
    {
      key: "google_auth_method",
      label: "Authentication",
      type: "select",
      required: true,
      default: "api_key",
      options: ["api_key", "service_account"],
    },
    {
      key: "google_spreadsheet_id",
      label: "Spreadsheet ID",
      type: "string",
      required: true,
      placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
      help: "From the sheet URL: docs.google.com/spreadsheets/d/{id}/edit",
    },
    {
      key: "google_sheets_api_key",
      label: "Google API Key",
      type: "password",
      required: true,
      when: { google_auth_method: "api_key" },
      help: "GCP → APIs & Services → Credentials → API key (Sheets API enabled)",
    },
    {
      key: "google_service_account_json",
      label: "Service Account JSON",
      type: "textarea",
      required: true,
      when: { google_auth_method: "service_account" },
      placeholder: '{"type": "service_account", "client_email": "...", ...}',
      help: "Share the spreadsheet with the service account email.",
    },
  ],
  gcs: [
    {
      key: "gcs_bucket",
      label: "Bucket Name",
      type: "string",
      required: true,
      placeholder: "my-data-bucket",
    },
    {
      key: "gcs_service_account_json",
      label: "Service Account JSON",
      type: "textarea",
      required: true,
      placeholder: '{"type": "service_account", "project_id": "...", ...}',
      help: "GCP → IAM → Service Accounts → Keys → JSON. Grant Storage Object Viewer on the bucket.",
    },
  ],
};

function mergeFields(existing: CatalogField[], patch: CatalogField[]): CatalogField[] {
  const byKey = new Map(existing.map((f) => [f.key, f]));
  for (const field of patch) {
    if (!byKey.has(field.key)) {
      byKey.set(field.key, field);
    } else {
      const cur = byKey.get(field.key)!;
      byKey.set(field.key, { ...field, ...cur, when: cur.when ?? field.when, help: cur.help ?? field.help });
    }
  }
  const order = patch.map((f) => f.key);
  const merged = [...byKey.values()];
  merged.sort((a, b) => {
    const ia = order.indexOf(a.key);
    const ib = order.indexOf(b.key);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return merged.length > 0 ? merged : existing;
}

export function enrichConnectorCatalogItem(item: ConnectorCatalogItem): ConnectorCatalogItem {
  const patch = FIELD_PATCHES[item.connector_type];
  if (!patch) return item;
  return {
    ...item,
    fields: mergeFields(item.fields, patch),
  };
}

export function enrichConnectorCatalog(items: ConnectorCatalogItem[]): ConnectorCatalogItem[] {
  return items.map(enrichConnectorCatalogItem);
}
