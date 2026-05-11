export function RiskPill({ risk }: { risk: string }) {
  const styles =
    risk === "Critical" || risk === "High"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : risk === "Medium"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold ring-1 ${styles}`}
    >
      {risk}
    </span>
  );
}
