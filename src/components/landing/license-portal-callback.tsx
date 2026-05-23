"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useExchangePortalToken } from "@/hooks/billing/use-billing";
import { ApiError } from "@/lib/api/client";
import { BladeFan } from "../../../public/icon/bladeFan";

export function LicensePortalCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const { mutate: exchange } = useExchangePortalToken();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!token || firedRef.current) return;
    firedRef.current = true;

    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        "/pricing/self-hosted/portal/callback",
      );
    }

    exchange(token, {
      onSuccess: () => {
        toast.success("Signed in");
        router.replace("/pricing/self-hosted/portal");
      },
      onError: (err) => {
        const msg =
          err instanceof ApiError
            ? err.message
            : "This sign-in link is invalid or has already been used.";
        setExchangeError(msg);
      },
    });
  }, [token, exchange, router]);

  if (!token) {
    return (
      <PortalShell tone="error" icon={<ShieldAlert size={32} strokeWidth={1.5} />}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Couldn&apos;t sign you in
        </h1>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          Missing sign-in token. Open the link from your email.
        </p>
        <Link
          href="/pricing/self-hosted/portal"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
        >
          Request a new link
        </Link>
      </PortalShell>
    );
  }

  if (exchangeError) {
    return (
      <PortalShell tone="error" icon={<ShieldAlert size={32} strokeWidth={1.5} />}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Couldn&apos;t sign you in
        </h1>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">{exchangeError}</p>
        <Link
          href="/pricing/self-hosted/portal"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
        >
          Request a new link
        </Link>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      tone="brand"
      icon={<Loader2 size={24} className="animate-spin" />}
    >
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        Signing you in…
      </h1>
      <p className="mt-3 text-sm text-slate-500">
        One moment while we verify your sign-in link.
      </p>
    </PortalShell>
  );
}

function PortalBrandLockup({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  const color = light ? "#ffffff" : "#0f172a";
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
    >
      <BladeFan strokeWidth={2.5} size={26} color={color} />
      <span
        className={`text-lg font-semibold tracking-tight ${light ? "text-white" : "text-slate-900"}`}
      >
        Entivia
      </span>
    </Link>
  );
}

function PortalShell({
  tone,
  icon,
  children,
}: {
  tone: "brand" | "error";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const iconTone =
    tone === "error"
      ? "bg-rose-50 text-rose-600 ring-rose-100"
      : "bg-orange-50 text-orange-600 ring-orange-100";
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <main className="grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <PortalBrandLockup />
          </div>
          <span
            className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ring-1 ${iconTone}`}
          >
            {icon}
          </span>
          <div className="mt-5">{children}</div>
        </div>
      </main>
    </div>
  );
}
