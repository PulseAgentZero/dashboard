export function PageHero({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {description}
          </p>
        </div>
        {action ? (
          <button className="h-11 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            {action}
          </button>
        ) : null}
      </div>
    </section>
  );
}
