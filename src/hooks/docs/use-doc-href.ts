"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getDocHref, isDocPathActive } from "@/lib/docs/navigation";
import { isDocsHostname } from "@/lib/site-urls";

export function useOnDocsHost(): boolean {
  const [onDocsHost, setOnDocsHost] = useState(false);

  useEffect(() => {
    setOnDocsHost(isDocsHostname(window.location.hostname));
  }, []);

  return onDocsHost;
}

export function useDocHref(slug: string): string {
  const onDocsHost = useOnDocsHost();
  return getDocHref(slug, { stripDocsPrefix: onDocsHost });
}

export function useIsDocActive(slug: string): boolean {
  const pathname = usePathname();
  const onDocsHost = useOnDocsHost();
  return isDocPathActive(slug, pathname, onDocsHost);
}
