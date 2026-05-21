"use client";

import { useCallback, useEffect } from "react";
import "driver.js/dist/driver.css";
import { TOUR_START_EVENT, runProductTour } from "@/lib/tour/run-product-tour";
import { useCompleteTourGuide } from "@/hooks/tour/use-tour-guide";

export function ProductTour() {
  const { mutate: completeTour } = useCompleteTourGuide();
  const markComplete = useCallback(() => completeTour({}), [completeTour]);

  useEffect(() => {
    function handleManualStart() {
      runProductTour(markComplete);
    }
    window.addEventListener(TOUR_START_EVENT, handleManualStart);
    return () => window.removeEventListener(TOUR_START_EVENT, handleManualStart);
  }, [markComplete]);

  return null;
}
