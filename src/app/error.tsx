"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw } from "lucide-react";
import {
  ErrorSplitShell,
  errorPrimaryButtonClass,
  errorSecondaryButtonClass,
} from "@/components/errors/error-split-shell";
import { marketingHref } from "@/lib/site-urls";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalRouteError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[entivia] route error", error);
  }, [error]);

  return (
    <ErrorSplitShell
      variant="500"
      headline="Something gave out."
      description="The page failed to load. Try again — if this keeps happening, reach out and we'll investigate quickly."
      digest={error?.digest}
    >
      <button
        type="button"
        onClick={() => reset()}
        className={errorPrimaryButtonClass("500")}
      >
        <RefreshCcw size={15} />
        Try again
      </button>
      <Link href={marketingHref("/")} className={errorSecondaryButtonClass()}>
        <Home size={15} />
        Back to home
      </Link>
    </ErrorSplitShell>
  );
}
