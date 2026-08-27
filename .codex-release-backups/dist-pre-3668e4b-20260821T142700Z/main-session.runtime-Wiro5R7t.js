import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { s as resolveSystemMainSessionKey } from "./main-session-Dth0X5B9.js";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
