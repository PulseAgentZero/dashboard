"use client";

import { useEffect, useState } from "react";

export function EntityCounter({
  start = 12419,
  stepMs = 600,
}: {
  start?: number;
  stepMs?: number;
}) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, stepMs);
    return () => clearInterval(id);
  }, [stepMs]);

  return (
    <span className="font-mono tabular-nums text-[var(--mk-accent)]">
      {count.toLocaleString()}
    </span>
  );
}
