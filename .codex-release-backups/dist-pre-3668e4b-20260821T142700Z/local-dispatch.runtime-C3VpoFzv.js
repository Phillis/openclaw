import { t as createBrowserControlContext } from "./browser-control-state-DKfVSiow.js";
import { t as createBrowserRouteDispatcher } from "./dispatcher-Bcbf2iio.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-DPrZxK9c.js";
//#region extensions/browser/src/browser/local-dispatch.runtime.ts
/**
* Local browser control dispatch bridge.
*
* Starts the browser control service when needed and dispatches requests
* through the in-process route dispatcher for local Browser tool calls.
*/
/** Dispatch one browser-control request through the local in-process router. */
async function dispatchBrowserControlRequest(req) {
	if (!await startBrowserControlServiceFromConfig()) throw new Error("browser control disabled");
	return await createBrowserRouteDispatcher(createBrowserControlContext()).dispatch(req);
}
//#endregion
export { dispatchBrowserControlRequest };
