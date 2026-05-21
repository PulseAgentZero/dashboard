import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Horizontal scroll for chip/filter strips on narrow screens */
  mobileScroll?: boolean;
};

export function Toolbar({ children, className = "", mobileScroll = false }: Props) {
  return (
    <div
      className={
        mobileScroll
          ? `flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:flex-wrap md:overflow-visible md:pb-0 ${className}`.trim()
          : `flex flex-wrap items-center gap-2 md:gap-3 ${className}`.trim()
      }
    >
      {children}
    </div>
  );
}
