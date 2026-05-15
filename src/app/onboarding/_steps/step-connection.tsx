"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSaveConnection } from "@/hooks/onboarding/use-save-connection";
import { useConnectionPrefill } from "@/hooks/onboarding/use-connection-prefill";

interface Props {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function StepConnection({ onNext, onBack, onSkip }: Props) {
  const { data: prefill, isLoading } = useConnectionPrefill();
  const [dbType, setDbType] = useState<"postgresql" | "mysql">("postgresql");

  const meta = prefill?.connection_meta;

  useEffect(() => {
    if (meta?.db_type === "mysql") setDbType("mysql");
    else if (meta?.db_type === "postgresql") setDbType("postgresql");
  }, [meta?.db_type]);
  const { mutate, isPending } = useSaveConnection();

  const defaultPort = dbType === "postgresql" ? 5432 : 3306;

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    mutate(
      {
        db_type: dbType,
        name: d.get("name") as string || undefined,
        host: d.get("host") as string,
        port: Number(d.get("port")),
        database_name: d.get("database_name") as string,
        username: d.get("username") as string,
        password: d.get("password") as string,
        sslmode: d.get("sslmode") as string,
      },
      { onSuccess: onNext },
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center justify-center gap-3 min-h-[300px]">
        <Loader2 size={18} className="animate-spin text-blue-600" />
        <span className="text-[13px] text-slate-600">Loading…</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-slate-900">Connect your data source</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Pulse will connect to your database to read and analyze your data.
        </p>
      </div>

      {/* DB type toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg w-fit">
        {(["postgresql", "mysql"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setDbType(type)}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition ${
              dbType === type
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {type === "postgresql" ? "PostgreSQL" : "MySQL"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field name="name" label="Connection name" placeholder="Production DB" hint="Optional label for this connection" defaultValue={prefill?.name ?? ""} />

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Field name="host" label="Host" placeholder="db.example.com" required defaultValue={String(meta?.host ?? "")} />
          </div>
          <div>
            <Field name="port" label="Port" type="number" placeholder={String(defaultPort)} required defaultValue={String(meta?.port ?? defaultPort)} />
          </div>
        </div>

        <Field name="database_name" label="Database name" placeholder="mydb" required defaultValue={String(meta?.database_name ?? "")} />

        <div className="grid grid-cols-2 gap-4">
          <Field name="username" label="Username" placeholder="readonly_user" required defaultValue={String(meta?.username ?? "")} />
          <Field name="password" label="Password" type="password" placeholder="••••••••" required />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-700">SSL mode</label>
          <select
            name="sslmode"
            defaultValue={String(meta?.sslmode ?? "prefer")}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          >
            <option value="prefer">Prefer (recommended)</option>
            <option value="require">Require</option>
            <option value="allow">Allow</option>
            <option value="disable">Disable</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-500 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
          <CheckCircle size={14} className="text-green-500 shrink-0" />
          We recommend a read-only database user. Pulse only reads your data.
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-[13px] text-slate-500 hover:text-slate-700 transition">
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSkip}
              className="text-[13px] text-slate-400 hover:text-slate-600 transition"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Testing connection…" : "Test & Connect →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  name, label, placeholder, type = "text", required, hint, defaultValue,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none transition-colors"
      />
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
