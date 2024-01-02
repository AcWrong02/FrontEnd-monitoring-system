import { replaceOld } from "packages/utils/src/helpter";

function xhrReplace(): void {
    if (!('XMLHttpRequest' in _global)) {
      return;
    }
    const originalXhrProto = XMLHttpRequest.prototype;
    replaceOld(originalXhrProto, 'open', (originalOpen: voidFun): voidFun => {
      return function (this: MonitorXMLHttpRequest, ...args: any[]): void {
        this.monitor_xhr = {
          method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
          url: args[1],
          sTime: getTimestamp(),
          type: HttpTypes.XHR,
        };
        // this.ontimeout = function () {
        //   console.log('超时', this)
        // }
        // this.timeout = 10000
        // on(this, EventTypes.ERROR, function (this: MonitorXMLHttpRequest) {
        //   if (this.monitor_xhr.isSdkUrl) return
        //   this.monitor_xhr.isError = true
        //   const eTime = getTimestamp()
        //   this.monitor_xhr.time = eTime
        //   this.monitor_xhr.status = this.status
        //   this.monitor_xhr.elapsedTime = eTime - this.monitor_xhr.sTime
        //   triggerHandlers(EventTypes.XHR, this.monitor_xhr)
        //   logger.error(`接口错误,接口信息:${JSON.stringify(this.monitor_xhr)}`)
        // })
        originalOpen.apply(this, args);
      };
    });
    replaceOld(originalXhrProto, 'send', (originalSend: voidFun): voidFun => {
      return function (this: MonitorXMLHttpRequest, ...args: any[]): void {
        const { method, url } = this.monitor_xhr;
        setTraceId(url, (headerFieldName: string, traceId: string) => {
          this.monitor_xhr.traceId = traceId;
          this.setRequestHeader(headerFieldName, traceId);
        });
        options.beforeAppAjaxSend && options.beforeAppAjaxSend({ method, url }, this);
        on(this, 'loadend', function (this: MonitorXMLHttpRequest) {
          if (
            (method === EMethods.Post && transportData.isSdkTransportUrl(url)) ||
            isFilterHttpUrl(url)
          )
            return;
          const { responseType, response, status } = this;
          this.monitor_xhr.reqData = args[0];
          const eTime = getTimestamp();
          this.monitor_xhr.time = this.monitor_xhr.sTime;
          this.monitor_xhr.status = status;
          if (['', 'json', 'text'].indexOf(responseType) !== -1) {
            this.monitor_xhr.responseText =
              typeof response === 'object' ? JSON.stringify(response) : response;
          }
          this.monitor_xhr.elapsedTime = eTime - this.monitor_xhr.sTime;
          triggerHandlers(EventTypes.XHR, this.monitor_xhr);
        });
        originalSend.apply(this, args);
      };
    });
  }