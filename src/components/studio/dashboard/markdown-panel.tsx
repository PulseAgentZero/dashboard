"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

export function MarkdownPanel({ content, className = "" }: Props) {
  return (
    <div className={`prose prose-sm max-w-none p-4 ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
