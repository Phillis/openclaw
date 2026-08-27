import "./sqlite-strict-BaSF4bDz.js";
import "./sqlite-wal-B0_s-lfW.js";
//#region src/plugin-sdk/plugin-state-runtime.ts
function createPluginStateErrorReporter(getRuntime, plugin, feature, message, formatError = (error) => ({ error: String(error) })) {
	return (error) => {
		try {
			getRuntime()?.logging.getChildLogger({
				plugin,
				feature
			}).warn(message, formatError(error));
		} catch {}
	};
}
//#endregion
export { createPluginStateErrorReporter as t };
