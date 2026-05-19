"use client";

import Link from "next/link";
import { FileCode2 } from "lucide-react";
import { QUERY_TEMPLATES } from "@/lib/studio/query-templates";

type Props = {
  show: boolean;
};

export function StudioQueryTemplates({ show }: Props) {
  if (!show) return null;

  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
      <h2 className="text-sm font-semibold text-slate-900">Getting started</h2>
      <p className="mt-0.5 text-xs text-slate-600">
        Start from a template — replace table and column names with your schema.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUERY_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={`/dashboard/studio/queries/new?template=${template.id}`}
            className="group flex flex-col rounded-xl border border-white bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileCode2 size={15} />
              </div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                {template.name}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{template.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
