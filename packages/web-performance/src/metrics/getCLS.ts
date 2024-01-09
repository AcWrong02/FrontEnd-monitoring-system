/**
 * Cumulative Layout Shift
 * Have you ever been reading an article online when something suddenly changes on the page?
 * Without warning, the text moves, and you've lost your place.
 * Or even worse: you're about to tap a link or a button,
 * but in the instant before your finger lands—BOOM—the link moves,
 * and you end up clicking something else!
 * */

import { metricsName } from "../constants";
import calcScore from "../lib/calculateScore";
import observe from "../lib/observe";
import { onHidden } from "../lib/onHidden";
import metricsStore from "../lib/store";
import { IReportHandler, IScoreConfig, LayoutShift,IMetrics } from "../types";
import { roundByFour } from "../utils";
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

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * @param {IScoreConfig} scoreConfig
 * */
export const initCLS = (
  store: metricsStore,
  report: IReportHandler,
  immediately = true,
  scoreConfig: IScoreConfig
): void => {
  const cls = { value: 0 };

  const po = getCLS(cls);

  const stopListening = () => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver/takeRecords
    if (po?.takeRecords) {
      po.takeRecords().map((entry: LayoutShift) => {
        if (!entry.hadRecentInput) {
          cls.value += entry.value;
        }
      });
    }
    po?.disconnect();

    const metrics = {
      name: metricsName.CLS,
      value: roundByFour(cls.value),
      score: calcScore(metricsName.CLS, cls.value, scoreConfig),
    } as IMetrics;

    store.set(metricsName.CLS, metrics);

    if (immediately) {
      report(metrics);
    }
  };

  onHidden(stopListening, true);
};
