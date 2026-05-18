"use client";

import { useEffect, useState } from "react";

export type DocHeading = { id: string; text: string; level: number };

export function useDocHeadings(containerId: string) {
  const [headings, setHeadings] = useState<DocHeading[]>([]);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;

    const els = root.querySelectorAll("h2, h3");
    const items: DocHeading[] = [];
    els.forEach((el) => {
      if (!el.id) return;
      items.push({
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setHeadings(items);
  }, [containerId]);

  return headings;
}
