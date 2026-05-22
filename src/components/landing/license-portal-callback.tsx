"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useExchangePortalToken } from "@/hooks/billing/use-billing";
import { ApiError } from "@/lib/api/client";

export function LicensePortalCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const { mutate: exchange } = useExchangePortalToken();
  // Guard against React 18 StrictMode double-invocation in dev — the magic
  // link is single-use, so we MUST only fire the exchange once.
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
      <div className="min-h-screen bg-black text-white antialiased">
        <main className="grid min-h-screen place-items-center px-4">
          <div className="max-w-md text-center">
            <ShieldAlert
              size={36}
              strokeWidth={1.5}
              className="mx-auto text-red-400"
            />
            <h1 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight">
              Couldn&apos;t sign you in
            </h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Missing sign-in token. Open the link from your email.
            </p>
            <Link
              href="/pricing/self-hosted/portal"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-500 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (exchangeError) {
    return (
      <div className="min-h-screen bg-black text-white antialiased">
        <main className="grid min-h-screen place-items-center px-4">
          <div className="max-w-md text-center">
            <ShieldAlert
              size={36}
              strokeWidth={1.5}
              className="mx-auto text-red-400"
            />
            <h1 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight">
              Couldn&apos;t sign you in
            </h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{exchangeError}</p>
            <Link
              href="/pricing/self-hosted/portal"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-300 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <main className="grid min-h-screen place-items-center px-4">
        <div className="max-w-md text-center">
          <Loader2
            size={28}
            className="mx-auto animate-spin text-orange-500"
          />
          <h1 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight">
            Signing you in…
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            One moment while we verify your sign-in link.
          </p>
        </div>
      </main>
    </div>
  );
}
