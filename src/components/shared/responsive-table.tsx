import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** min-width class for inner scroll area, e.g. min-w-[720px] */
  minWidth?: string;
};

export function ResponsiveTable({
  children,
  className = "",
  minWidth = "min-w-full",
}: Props) {
  return (
    <div
      className={`-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0 ${className}`.trim()}
    >
      <div className={minWidth}>{children}</div>
    </div>
  );
}
