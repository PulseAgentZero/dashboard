import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className = "" }: Props) {
  return (
    <div
      className={`flex flex-col gap-3 md:flex-row md:items-start md:justify-between ${className}`.trim()}
    >
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
