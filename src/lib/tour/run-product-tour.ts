import { driver, type Driver } from "driver.js";
import { getTourSteps } from "@/lib/tour/steps";

export const TOUR_START_EVENT = "pulse:start-product-tour";

let activeDriver: Driver | null = null;

export function requestProductTour() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOUR_START_EVENT));
}

export function runProductTour(onDestroyed?: () => void): Driver {
  activeDriver?.destroy();

  const driverObj = driver({
    showProgress: true,
    allowClose: true,
    animate: true,
    overlayColor: "rgba(15, 23, 42, 0.65)",
    stagePadding: 6,
    stageRadius: 8,
    steps: getTourSteps(),
    onDestroyed: () => {
      activeDriver = null;
      onDestroyed?.();
    },
  });

  activeDriver = driverObj;
  driverObj.drive();
  return driverObj;
}
