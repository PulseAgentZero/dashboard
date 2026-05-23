"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPrevNext } from "@/lib/docs/navigation";
import { useDocHref } from "@/hooks/docs/use-doc-href";

type Props = {
  slug: string;
};

function PrevNextLink({
  slug,
  title,
  direction,
  className,
}: {
  slug: string;
  title: string;
  direction: "prev" | "next";
  className?: string;
}) {
  const href = useDocHref(slug);
  const cardClass =
    "group flex flex-col rounded-lg border border-zinc-200 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50 dark:border-zinc-700 dark:hover:border-orange-800 dark:hover:bg-orange-950/30";

  if (direction === "prev") {
    return (
      <Link href={href} className={`${cardClass}${className ?? ""}`}>
        <span className="mb-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <ChevronLeft size={14} /> Previous
        </span>
        <span className="font-medium text-zinc-900 group-hover:text-orange-700 dark:text-zinc-100 dark:group-hover:text-orange-300">
          {title}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${cardClass}${className ?? ""} items-end text-right`}
    >
      <span className="mb-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        Next <ChevronRight size={14} />
      </span>
      <span className="font-medium text-zinc-900 group-hover:text-orange-700 dark:text-zinc-100 dark:group-hover:text-orange-300">
        {title}
      </span>
    </Link>
  );
}

export function PrevNext({ slug }: Props) {
  const { prev, next } = getPrevNext(slug);

  if (!prev && !next) return null;

  return (
    <div className="mt-10 grid grid-cols-1 gap-3 border-t border-zinc-200 pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-4 sm:pt-8 dark:border-zinc-800">
      {prev ? (
        <PrevNextLink slug={prev.slug} title={prev.title} direction="prev" />
      ) : null}
      {next ? (
        <PrevNextLink
          slug={next.slug}
          title={next.title}
          direction="next"
          className={prev ? " sm:col-start-2" : undefined}
        />
      ) : null}
    </div>
  );
}
