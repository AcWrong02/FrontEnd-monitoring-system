/**
 * Cumulative Layout Shift
 * Have you ever been reading an article online when something suddenly changes on the page?
 * Without warning, the text moves, and you've lost your place.
 * Or even worse: you're about to tap a link or a button,
 * but in the instant before your finger lands—BOOM—the link moves,
 * and you end up clicking something else!
 * */

import observe from "../lib/observe";
import { LayoutShift } from "../types";
import { isPerformanceObserverSupported } from "../utils/isSupported";

const getCLS = (cls): PerformanceObserver | undefined => {
  //如果不支持PerformanceObserver，直接返回
  if (!isPerformanceObserverSupported()) {
    console.warn("browser do not support performanceObserver");
    return;
  }

  const entryHandler = (entry: LayoutShift) => {
    if (!entry.hadRecentInput) {
      cls.value += entry.value;
    }
  };

  return observe("layout-shift", entryHandler);
};