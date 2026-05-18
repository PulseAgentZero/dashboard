import { AlertTriangle, Info, Lightbulb } from "lucide-react";

type Variant = "note" | "warning" | "tip";

const styles: Record<
  Variant,
  { border: string; bg: string; icon: React.ReactNode; label: string }
> = {
  note: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    icon: <Info size={16} className="text-blue-600" />,
    label: "Note",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    icon: <AlertTriangle size={16} className="text-amber-600" />,
    label: "Warning",
  },
  tip: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    icon: <Lightbulb size={16} className="text-emerald-600" />,
    label: "Tip",
  },
};

type Props = {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
};

export function Callout({ variant = "note", title, children }: Props) {
  const s = styles[variant];
  return (
    <div className={`my-6 flex gap-3 rounded-lg border p-4 ${s.border} ${s.bg}`}>
      <div className="mt-0.5 shrink-0">{s.icon}</div>
      <div className="min-w-0 text-sm text-zinc-700">
        <p className="mb-1 font-semibold text-zinc-900">{title ?? s.label}</p>
        <div className="[&>p]:mb-2 [&>p:last-child]:mb-0">{children}</div>
      </div>
    </div>
  );
}
