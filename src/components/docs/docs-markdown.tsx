"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { CodeBlock } from "./code-block";
import { MermaidDiagram } from "./mermaid-diagram";

type Props = {
  content: string;
};

export function DocsMarkdown({ content }: Props) {
  return (
    <div className="docs-prose max-w-none min-w-0 break-words [overflow-wrap:anywhere]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 sm:mb-6 sm:text-3xl dark:text-zinc-50">
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2
              id={id}
              className="mb-3 mt-8 scroll-mt-24 text-lg font-semibold text-zinc-900 sm:mb-4 sm:mt-10 sm:text-xl dark:text-zinc-50"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3
              id={id}
              className="mb-2 mt-6 scroll-mt-24 text-base font-semibold text-zinc-900 sm:mb-3 sm:mt-8 sm:text-lg dark:text-zinc-100"
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-sm leading-7 text-zinc-600 sm:text-[15px] dark:text-zinc-400">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-zinc-600 sm:pl-6 sm:text-[15px] dark:text-zinc-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm text-zinc-600 sm:pl-6 sm:text-[15px] dark:text-zinc-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            const className =
              "font-medium text-orange-600 hover:underline dark:text-orange-400";
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
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className ?? "");
            const text = String(children).replace(/\n$/, "");
            if (match?.[1] === "mermaid") {
              return <MermaidDiagram chart={text} />;
            }
            const inline = !match && !text.includes("\n");
            if (inline) {
              return (
                <code
                  className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-orange-700 dark:bg-zinc-800 dark:text-orange-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match?.[1]}>{text}</CodeBlock>;
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="-mx-1 my-6 overflow-x-auto rounded-lg border border-zinc-200 sm:mx-0 dark:border-zinc-700">
              <table className="w-full min-w-[280px] text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-zinc-700 sm:px-4 sm:py-2.5 dark:text-zinc-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-zinc-100 px-3 py-2 text-zinc-600 sm:px-4 sm:py-2.5 dark:border-zinc-800 dark:text-zinc-400">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-orange-300 pl-4 text-zinc-600 italic dark:border-orange-600 dark:text-zinc-400">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-zinc-200 dark:border-zinc-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
