import { R as timestampMsToIsoString } from "./number-coercion-oCkfUEEq.js";
import "./number-runtime-CoAPZzJY.js";
//#region extensions/memory-core/src/time.ts
function resolveMemoryCoreNowMs(nowMs) {
	return timestampMsToIsoString(nowMs) === void 0 ? Date.now() : nowMs;
}
function resolveMemoryCoreTimestamp(nowMs) {
	return timestampMsToIsoString(resolveMemoryCoreNowMs(nowMs)) ?? (/* @__PURE__ */ new Date()).toISOString();
}
//#endregion
export { resolveMemoryCoreTimestamp as n, resolveMemoryCoreNowMs as t };
