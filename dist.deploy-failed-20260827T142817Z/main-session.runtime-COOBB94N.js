import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { s as resolveSystemMainSessionKey } from "./main-session-er-Gn_t_.js";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
