"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

type Props = {
  content: string;
};

export function LegalMarkdown({ content }: Props) {
  return (
    <div className="legal-prose max-w-none min-w-0 break-words [overflow-wrap:anywhere]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:mb-6 sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2
              id={id}
              className="mb-3 mt-8 scroll-mt-28 text-lg font-semibold text-zinc-100 sm:mb-4 sm:mt-10 sm:text-xl"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3
              id={id}
              className="mb-2 mt-6 scroll-mt-28 text-base font-semibold text-zinc-200 sm:mb-3 sm:mt-8 sm:text-lg"
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-sm leading-7 text-zinc-400 sm:text-[15px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-zinc-400 sm:pl-6 sm:text-[15px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm text-zinc-400 sm:pl-6 sm:text-[15px]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            const className =
              "font-medium text-indigo-400 hover:text-indigo-300 hover:underline";
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {children}
                </a>
              );
            }
            return (
              <Link href={href ?? "#"} className={className}>
                {children}
              </Link>
            );
          },
          code: ({ children }) => (
            <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[13px] text-indigo-300">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="-mx-1 my-6 overflow-x-auto rounded-lg border border-zinc-800 sm:mx-0">
              <table className="w-full min-w-[280px] text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-zinc-800 bg-zinc-900/80">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-zinc-200 sm:px-4 sm:py-2.5">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-zinc-800/80 px-3 py-2 text-zinc-400 sm:px-4 sm:py-2.5">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-indigo-600/60 pl-4 text-zinc-400 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-zinc-800" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-200">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
