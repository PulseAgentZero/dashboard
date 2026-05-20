import Link from "next/link";
import type { Metadata } from "next";
import { Compass, Home } from "lucide-react";
import {
  ErrorSplitShell,
  errorPrimaryButtonClass,
  errorSecondaryButtonClass,
} from "@/components/errors/error-split-shell";
import { appHref, marketingHref } from "@/lib/site-urls";

export const metadata: Metadata = {
  title: "Page not found · Entivia",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <ErrorSplitShell
      variant="404"
      headline="You took a wrong turn."
      description="The page may have moved, or the link you followed is out of date. Pick a shortcut below to get back on track."
    >
      <Link href={marketingHref("/")} className={errorPrimaryButtonClass("404")}>
        <Home size={15} />
        Back to home
      </Link>
      <Link href={appHref("/dashboard")} className={errorSecondaryButtonClass()}>
        <Compass size={15} />
        Open dashboard
      </Link>
    </ErrorSplitShell>
  );
}
