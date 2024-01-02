
// Monitor的全局变量
export interface MonitorSupport {
    logger: Logger;
    breadcrumb: Breadcrumb;
    transportData: TransportData;
    replaceFlag: { [key in EventTypes]?: boolean };
    record?: any[];
    deviceInfo?: DeviceInfo;
    options?: Options;
    track?: any;
  }

interface MonitorGlobal {
    console?: Console;
    __Monitor__?: MonitorSupport;
}
  

export const isNodeEnv = variableTypeDetection.isProcess(
    typeof process !== 'undefined' ? process : 0,
);
  
export const isWxMiniEnv =
    variableTypeDetection.isObject(typeof wx !== 'undefined' ? wx : 0) &&
    variableTypeDetection.isFunction(typeof App !== 'undefined' ? App : 0);

export const isBrowserEnv = variableTypeDetection.isWindow(
    typeof window !== 'undefined' ? window : 0,
);

/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal<T>() {
    if (isBrowserEnv) return window as unknown as MonitorGlobal & T;
    if (isWxMiniEnv) return wx as unknown as MonitorGlobal & T;
    if (isNodeEnv) return process as unknown as MonitorGlobal & T;
  }
  
const _global = getGlobal<Window>();