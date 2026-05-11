export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-base font-semibold text-slate-950">
          {title}
        </h2>
      </div>
      {action ? (
        <button className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          {action}
        </button>
      ) : null}
    </div>
  );
}
