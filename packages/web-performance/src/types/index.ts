export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void;
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
