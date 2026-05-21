"use client";

import { useEffect, useRef, useState } from "react";

export function useContainerWidth(defaultWidth = 1200) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(w);
    });
    ro.observe(el);
    setWidth(el.offsetWidth || defaultWidth);
    return () => ro.disconnect();
  }, [defaultWidth]);

  return { ref, width };
}
