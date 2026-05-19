import type { ReactNode } from "react";

type Width = "content" | "wide" | "full";

const WIDTH_CLASS: Record<Width, string> = {
  content: "max-w-[1400px]",
  wide: "max-w-[1600px]",
  full: "max-w-none",
};

type Props = {
  children: ReactNode;
  className?: string;
  /** content = 1400px (default app pages), wide = 1600px, full = use all main area */
  width?: Width;
};

/** Consistent horizontal bounds for dashboard routes — prefer this over ad-hoc max-w-3xl. */
export function DashboardPageShell({
  children,
  className = "",
  width = "content",
}: Props) {
  return (
    <div className={`mx-auto w-full ${WIDTH_CLASS[width]} ${className}`.trim()}>
      {children}
    </div>
  );
}
