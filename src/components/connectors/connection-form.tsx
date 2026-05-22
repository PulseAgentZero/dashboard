"use client";

import { useMemo, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type {
  CatalogField,
  ConnectionResponse,
  ConnectorCatalogItem,
} from "@/types/connections";
import {
  useCreateConnection,
  useUploadConnection,
  useUploadConnectionsBatch,
} from "@/hooks/connections/use-connections";
import {
  catalogFieldDefaults,
  visibleCatalogFields,
} from "@/lib/connectors/catalog-field-utils";
import { enrichConnectorCatalogItem } from "@/lib/connectors/catalog-enrich";
import { FileUploadField } from "./file-upload-field";

const SELECT_LABELS: Record<string, string> = {
  api_key: "API key",
  service_account: "Service account (JSON key)",
};

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CatalogField;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = field.type === "password";
  const isTextarea = field.type === "textarea";
  const isSelect = field.type === "select";
  const isFile = field.type === "file";
  const isCredentialJson =
    isTextarea &&
    (field.key.includes("service_account") || field.key.includes("_json"));

  // Refined input style: solid transition paths, smooth gray default borders, focused into subtle orange accenting
  const base =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-150 ease-in-out focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400";

  if (isSelect && field.options) {
    return (
      <select className={base} value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {SELECT_LABELS[o] ?? o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    );
  }

  if (isFile) {
    return (
      <input
        type="file"
        className={`${base} file:mr-3 file:rounded-md file:border-0 file:bg-orange-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-orange-700 file:transition file:hover:bg-orange-100`}
        accept=".csv,text/csv"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f.name);
        }}
      />
    );
  }

  if (isTextarea) {
    return (
      <textarea
        className={`${base} resize-y font-mono text-xs leading-relaxed ${
          isCredentialJson ? "min-h-[140px]" : "min-h-20"
        }`}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    );
  }

  return (
    <div className="relative">
      <input
        type={isPassword && !show ? "password" : "text"}
        className={`${base} ${isPassword ? "pr-9" : ""}`}
        placeholder={field.placeholder || String(field.default ?? "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}

type Props = {
  catalogItem: ConnectorCatalogItem;
  onSuccess?: (connection: ConnectionResponse) => void;
  onCancel?: () => void;
};

export function ConnectionForm({ catalogItem: rawCatalogItem, onSuccess, onCancel }: Props) {
  const catalogItem = useMemo(
    () => enrichConnectorCatalogItem(rawCatalogItem),
    [rawCatalogItem],
  );

  const { mutate: create, isPending: creating } = useCreateConnection();
  const { mutate: upload, isPending: uploadingOne } = useUploadConnection();
  const { mutate: uploadBatch, isPending: uploadingBatch } = useUploadConnectionsBatch();
  const isPending = creating || uploadingOne || uploadingBatch;
  const usesUpload = Boolean(catalogItem.upload_endpoint);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [fields, setFields] = useState<Record<string, string>>(() => ({
    ...catalogFieldDefaults(catalogItem.fields),
  }));

  const visibleFields = useMemo(
    () => visibleCatalogFields(catalogItem.fields, fields),
    [catalogItem.fields, fields],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = fields.name?.trim() || catalogItem.display_name;

    for (const field of visibleFields) {
      if (field.required && !(fields[field.key] ?? "").trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    if (usesUpload) {
      if (uploadFiles.length === 0) {
        toast.error("Select a file to upload");
        return;
      }
      if (!catalogItem.upload_endpoint) {
        toast.error("Upload is not configured for this connector");
        return;
      }

      if (uploadFiles.length === 1) {
        const file = uploadFiles[0]!;
        upload(
          {
            file,
            name: name || file.name,
            connectorType: catalogItem.connector_type,
            uploadEndpoint: catalogItem.upload_endpoint,
          },
          { onSuccess: (connection) => onSuccess?.(connection) },
        );
        return;
      }

      uploadBatch(
        {
          files: uploadFiles,
          uploadEndpoint: catalogItem.upload_endpoint,
        },
        {
          onSuccess: (result) => {
            const first = result.connections[0];
            onSuccess?.(first);
          },
        },
      );
      return;
    }

    const body: Record<string, unknown> = {
      connector_type: catalogItem.connector_type,
      name,
    };
    const visibleKeys = new Set(visibleFields.map((f) => f.key));
    for (const field of catalogItem.fields) {
      if (!visibleKeys.has(field.key)) continue;
      const v = fields[field.key];
      if (v !== undefined && v !== "") {
        body[field.key] = field.type === "integer" ? Number(v) : v;
      }
    }
    create(body, {
      onSuccess: (connection) => onSuccess?.(connection),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {usesUpload && uploadFiles.length > 1 ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Each file becomes its own connection (named after the file). All are queryable
          in Studio once active.
        </p>
      ) : (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Connection name
          </label>
          <FieldInput
            field={{
              key: "name",
              label: "Connection name",
              type: "string",
              required: false,
              placeholder: catalogItem.display_name,
            }}
            value={fields.name ?? ""}
            onChange={(v) => setFields((f) => ({ ...f, name: v }))}
          />
        </div>
      )}

      {usesUpload && (
        <FileUploadField
          files={uploadFiles}
          onFilesChange={setUploadFiles}
          disabled={isPending}
          accept={catalogItem.upload_accept}
          multiple
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleFields.map((field) => (
          <div
            key={field.key}
            className={field.type === "textarea" ? "sm:col-span-2" : ""}
          >
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              {field.label}
              {field.required && <span className="ml-0.5 text-rose-500">*</span>}
            </label>
            <FieldInput
              field={field}
              value={fields[field.key] ?? ""}
              onChange={(v) => setFields((f) => ({ ...f, [field.key]: v }))}
            />
            {field.help && (
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{field.help}</p>
            )}
          </div>
        ))}
      </div>

      {catalogItem.notes && (
        <p className="rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-xs text-amber-800">
          {catalogItem.notes}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending
            ? usesUpload
              ? "Uploading…"
              : "Testing & saving…"
            : usesUpload
              ? uploadFiles.length > 1
                ? `Upload ${uploadFiles.length} files`
                : "Upload & save connection"
              : "Test & save connection"}
        </button>
      </div>
    </form>
  );
}