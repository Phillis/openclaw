import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { s as resolveSystemMainSessionKey } from "./main-session-CPkeRwvL.js";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
