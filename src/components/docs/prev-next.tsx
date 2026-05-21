import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDocHref, getPrevNext } from "@/lib/docs/navigation";

type Props = {
  slug: string;
};

export function PrevNext({ slug }: Props) {
  const { prev, next } = getPrevNext(slug);

  if (!prev && !next) return null;

  const cardClass =
    "group flex flex-col rounded-lg border border-zinc-200 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50 dark:border-zinc-700 dark:hover:border-orange-800 dark:hover:bg-orange-950/30";

  return (
    <div className="mt-10 grid grid-cols-1 gap-3 border-t border-zinc-200 pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-4 sm:pt-8 dark:border-zinc-800">
      {prev ? (
        <Link href={getDocHref(prev.slug)} className={cardClass}>
          <span className="mb-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <ChevronLeft size={14} /> Previous
          </span>
          <span className="font-medium text-zinc-900 group-hover:text-orange-700 dark:text-zinc-100 dark:group-hover:text-orange-300">
            {prev.title}
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={getDocHref(next.slug)}
          className={`${cardClass}${prev ? " sm:col-start-2" : ""} items-end text-right`}
        >
          <span className="mb-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            Next <ChevronRight size={14} />
          </span>
          <span className="font-medium text-zinc-900 group-hover:text-orange-700 dark:text-zinc-100 dark:group-hover:text-orange-300">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  );
}
