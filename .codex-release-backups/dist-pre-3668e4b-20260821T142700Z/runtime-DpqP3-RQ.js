import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/zalouser/src/runtime.ts
const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } = createPluginRuntimeStore({
	pluginId: "zalouser",
	errorMessage: "Zalouser runtime not initialized"
});
//#endregion
export { setZalouserRuntime as n, getZalouserRuntime as t };
