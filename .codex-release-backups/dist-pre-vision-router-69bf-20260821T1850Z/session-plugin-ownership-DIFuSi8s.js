import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
//#region src/gateway/session-plugin-ownership.ts
/** Plugin callers may access an existing session only when they own its exact row. */
function resolvePluginSessionOwnershipError(params) {
	const pluginOwnerId = normalizeOptionalString(params.pluginOwnerId);
	if (!pluginOwnerId || !params.entry || normalizeOptionalString(params.entry.pluginOwnerId) === pluginOwnerId) return;
	return errorShape(ErrorCodes.INVALID_REQUEST, `Plugin "${pluginOwnerId}" cannot ${params.action} session "${params.key}" because it did not create it.`);
}
//#endregion
export { resolvePluginSessionOwnershipError as t };
