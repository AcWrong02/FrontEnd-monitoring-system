export interface IScoreConfig {
  [prop: string]: { median: number; p10: number };
}

export interface IMetrics {
  name: string;
  value: any;
  score?: number;
}

export interface IReportData {
  sessionId: string;
  appId?: string;
  version?: string;
  data: IMetrics | IMetricsObj;
  timestamp: number;
}

export interface IMetricsObj {
  [prop: string]: IMetrics;
}

export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void;
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface IReportHandler {
  (metrics: IMetrics | IMetricsObj): void;
}

export interface Curve {
  median: number;
  podr?: number;
  p10?: number;
}

export interface OnHiddenCallback {
  (event: Event): void;
}
