"use client";

import { useCallback, useEffect, useRef } from "react";
import "driver.js/dist/driver.css";
import { TOUR_START_EVENT, runProductTour } from "@/lib/tour/run-product-tour";
import { useCompleteTourGuide, useTourGuideState } from "@/hooks/tour/use-tour-guide";

export function ProductTour() {
  const { isLoading, completed } = useTourGuideState();
  const { mutate: completeTour } = useCompleteTourGuide();
  const autoStarted = useRef(false);

  const markComplete = useCallback(() => completeTour({}), [completeTour]);

  useEffect(() => {
    function handleManualStart() {
      runProductTour(markComplete);
    }
    window.addEventListener(TOUR_START_EVENT, handleManualStart);
    return () => window.removeEventListener(TOUR_START_EVENT, handleManualStart);
  }, [markComplete]);

  useEffect(() => {
    if (isLoading || completed || autoStarted.current) return;

    const timer = window.setTimeout(() => {
      if (autoStarted.current) return;
      autoStarted.current = true;
      runProductTour(markComplete);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [isLoading, completed, markComplete]);

  return null;
}
