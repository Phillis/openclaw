import { l as hasConfiguredSecretInput, m as normalizeResolvedSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import "./openclaw-runtime-config-BlJgFJDV.js";
//#region packages/memory-host-sdk/src/host/secret-input.ts
/** Return true when a configured memory secret contains a literal value or reference. */
function hasConfiguredMemorySecretInput(value) {
	return hasConfiguredSecretInput(value);
}
/** Consume a secret value that the gateway runtime snapshot already resolved. */
function resolveMemorySecretInputString(params) {
	return normalizeResolvedSecretInputString(params);
}
//#endregion
export { resolveMemorySecretInputString as n, hasConfiguredMemorySecretInput as t };
