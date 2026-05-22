"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { FIRST_RUN_PENDING_KEY } from "@/lib/tour/first-run";
import { requestProductTour } from "@/lib/tour/run-product-tour";
import { useMarkSetupShown } from "@/hooks/tour/use-tour-guide";
import { BladeFan } from "../../../public/icon/bladeFan";

const DURATION = 5000;

export function FirstRunOverlay() {
  const pathname = usePathname();
  const { user, org, isLoading } = useAuth();
  const { mutate: markSetupShown } = useMarkSetupShown();

  const [active, setActive] = useState(false);
  const [fill, setFill] = useState(false);
  const [dots, setDots] = useState("");
  const [startTour, setStartTour] = useState(false);

  const initialized = useRef(false);
  const dotTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (initialized.current || isLoading || !org?.id || org.onboarding_done || pathname !== "/dashboard") {
      return;
    }

    // Already shown on any device — backend is the source of truth.
    if (org.tour_guide?.setup_shown) return;

    // Trigger when the user is the org owner (covers OAuth signup) or we have
    // an explicit FIRST_RUN_PENDING_KEY signal set by login / email verification.
    const isOrgOwner = Boolean(user?.is_org_owner);
    const explicitlyPending = sessionStorage.getItem(FIRST_RUN_PENDING_KEY) === "1";
    if (!isOrgOwner && !explicitlyPending) return;

    initialized.current = true;
    sessionStorage.removeItem(FIRST_RUN_PENDING_KEY);

    // Async RAF callbacks satisfy "no sync setState in effect" rule
    requestAnimationFrame(() => {
      setActive(true);
      requestAnimationFrame(() => setFill(true));
    });

    dotTimerRef.current = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 420);

    // No cleanup returned — timers live in refs and survive dep re-runs.
    // Unmount cleanup below handles teardown.
  }, [isLoading, org?.id, org?.onboarding_done, org?.tour_guide?.setup_shown, user?.is_org_owner, pathname]);

  useEffect(() => {
    if (!active || pathname !== "/dashboard") return;

    finishTimerRef.current = setTimeout(() => {
      markSetupShown();
      setActive(false);
      setStartTour(true);
      clearInterval(dotTimerRef.current);
    }, DURATION);

    return () => {
      clearTimeout(finishTimerRef.current);
    };
  }, [active, org?.id, pathname, markSetupShown]);

  useEffect(() => {
    if (!startTour || active || pathname !== "/dashboard") return;

    requestAnimationFrame(() => {
      requestProductTour();
      setStartTour(false);
    });
  }, [active, pathname, startTour]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      clearInterval(dotTimerRef.current);
      clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!active || pathname !== "/dashboard") return null;

  return (
    <>
      <style>{`
        .fro-bg {
          background: linear-gradient(-45deg, #e8390e, #f7620a, #ffcd43, #ff3366, #c9260c, #ff8c00);
          background-size: 400% 400%;
          animation: froShift 14s ease infinite;
        }
        @keyframes froShift {
          0%   { background-position: 0% 50%; }
          25%  { background-position: 50% 0%; }
          50%  { background-position: 100% 50%; }
          75%  { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes froSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fro-fan { animation: froSpin 5s linear infinite; }
      `}</style>

      <div className="fro-bg fixed inset-0 z-9999 flex flex-col items-center justify-center select-none">
        <div className="flex flex-col items-center gap-5 text-center px-6">
          <div className="fro-fan opacity-80">
            <BladeFan color="white" size={42} strokeWidth={8} />
          </div>

          <p className="text-white/90 text-[30px] font-medium tracking-tight">
            Setting up your dashboard
            <span className="inline-block w-5 text-left">{dots}</span>
          </p>

          <div className="w-32 h-px bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full"
              style={{
                width: fill ? "100%" : "0%",
                transition: `width ${DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
