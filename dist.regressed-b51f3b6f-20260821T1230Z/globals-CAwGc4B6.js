import { t as isVerbose } from "./global-state-BCtvHc7P.js";
import { a as getLogger, s as isFileLogLevelEnabled } from "./logger-BWBYvpHz.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/globals.ts
function shouldLogVerbose() {
	return isVerbose() || isFileLogLevelEnabled("debug");
}
function logVerbose(message) {
	if (!shouldLogVerbose()) return;
	try {
		getLogger().debug({ message }, "verbose");
	} catch {}
	if (!isVerbose()) return;
	console.log(theme.muted(message));
}
const success = theme.success;
const warn = theme.warn;
const info = theme.info;
const danger = theme.error;
//#endregion
export { success as a, shouldLogVerbose as i, info as n, warn as o, logVerbose as r, danger as t };
