import "./sqlite-strict-EqLr_Ju4.js";
import "./sqlite-wal-BHpwckP_.js";
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
