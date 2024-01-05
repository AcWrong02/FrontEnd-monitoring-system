import { IAnyObject } from "packages/types/src/common";

// 用到所有事件名称
type TotalEventName =
  | keyof GlobalEventHandlersEventMap
  | keyof XMLHttpRequestEventTargetEventMap
  | keyof WindowEventMap;

/**
 * 添加事件监听器
 *
 * ../export
 * ../param {{ addEventListener: Function }} target
 * ../param {keyof TotalEventName} eventName
 * ../param {Function} handler
 * ../param {(boolean | Object)} opitons
 * ../returns
 */
export function on(
  target: { addEventListener: Function },
  eventName: TotalEventName,
  handler: Function,
  opitons: boolean | unknown = false,
): void {
  target.addEventListener(eventName, handler, opitons);
}

/**
 *
 * 重写对象上面的某个属性(一般是方法)
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export function replaceOld(
    source: IAnyObject,
    name: string,
    replacement: (...args: any[]) => any,
    isForced = false,
  ): void {
    if (source === undefined) return;
    if (name in source || isForced) {
      const original = source[name];
      const wrapped = replacement(original);
      if (typeof wrapped === 'function') {
        source[name] = wrapped;
      }
    }
  }