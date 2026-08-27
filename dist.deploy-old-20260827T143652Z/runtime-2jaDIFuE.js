import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/reef/src/runtime.ts
const { setRuntime: setReefRuntime, tryGetRuntime: getOptionalReefRuntime, getRuntime: getReefRuntime } = createPluginRuntimeStore({
	pluginId: "reef",
	errorMessage: "Reef runtime unavailable"
});
const activeReefStore = createPluginRuntimeStore({
	key: "plugin-runtime:reef:active",
	errorMessage: "Reef channel is not running"
});
function setActiveReef(value) {
	if (value) activeReefStore.setRuntime(value);
	else activeReefStore.clearRuntime();
}
const getActiveReef = activeReefStore.getRuntime;
//#endregion
export { setReefRuntime as a, setActiveReef as i, getOptionalReefRuntime as n, getReefRuntime as r, getActiveReef as t };
