type Props = {
  used: number;
  limit: number | null;
  label: string;
};

export function UsageBar({ used, limit, label }: Props) {
  if (limit === null) return null;
  const pct = Math.min((used / limit) * 100, 100);
  const atLimit = used >= limit;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span
          className={`text-sm font-semibold ${atLimit ? "text-rose-600" : "text-slate-600"}`}
        >
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className={`h-1.5 rounded-full transition-all ${atLimit ? "bg-rose-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {atLimit && (
        <p className="mt-2 text-xs text-rose-600">
          Limit reached — revoke an existing item or upgrade to Pro.
        </p>
      )}
    </div>
  );
}
