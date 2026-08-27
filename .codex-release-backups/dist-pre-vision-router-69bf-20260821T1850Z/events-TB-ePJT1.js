import { a as READ_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
//#region src/gateway/events.ts
/** Event name emitted when a node's private runner declaration changes. */
const GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED = "node.runnerInventory.changed";
/** Event name emitted when a newer OpenClaw version is available. */
const GATEWAY_EVENT_UPDATE_AVAILABLE = "update.available";
/** Returns whether this authenticated client may receive detailed update metadata. */
function canReadDetailedUpdateMetadata(role, scopes) {
	return roleScopesAllow({
		role,
		requestedScopes: [READ_SCOPE],
		allowedScopes: scopes
	});
}
/** Projects update availability to the pre-detail wire shape for clients without read access. */
function projectUpdateAvailable(updateAvailable, includeDetails) {
	if (!updateAvailable || includeDetails) return updateAvailable;
	return {
		currentVersion: updateAvailable.currentVersion,
		latestVersion: updateAvailable.latestVersion,
		channel: updateAvailable.channel
	};
}
//#endregion
export { projectUpdateAvailable as i, GATEWAY_EVENT_UPDATE_AVAILABLE as n, canReadDetailedUpdateMetadata as r, GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED as t };
