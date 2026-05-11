export function SummaryCard({
  item,
}: {
  item: { label: string; value: string; detail: string };
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{item.label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {item.value}
      </p>
      <p className="mt-4 text-sm leading-6 text-slate-500">{item.detail}</p>
    </section>
  );
}
