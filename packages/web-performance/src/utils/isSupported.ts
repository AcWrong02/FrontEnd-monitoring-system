export const isPerformanceSupported = ():boolean =>{
    return !!window.Performance && !!window.performance.getEntriesByType && !!window.performance.mark;
}

export const isPerformanceObserverSupported = ():boolean =>{
    return !!window.PerformanceObserver;
}