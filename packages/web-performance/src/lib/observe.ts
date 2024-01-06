import { PerformanceEntryHandler } from '../types';

const observe = (
    type: string,
    callback: PerformanceEntryHandler,
  ): PerformanceObserver | undefined => {
    try {
        //判断是否PerformanceObserver支持的条目类型
        //Please see：https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry/entryType
      if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
        const po: PerformanceObserver = new PerformanceObserver((l) => l.getEntries().map(callback));
  
        po.observe({ type, buffered: true });
        return po;
      }
    } catch (e) {
      throw e;
    }
  };
  
  export default observe;