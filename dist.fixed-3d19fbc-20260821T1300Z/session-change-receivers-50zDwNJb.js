import { t as hasPluginSessionsChangedSubscribers } from "./gateway-events-D-98OSCb.js";
//#region src/gateway/session-change-receivers.ts
/** Native plugin listeners remain session-change receivers without a websocket client. */
function hasSessionChangeReceivers(connIds) {
	return connIds.size > 0 || hasPluginSessionsChangedSubscribers();
}
//#endregion
export { hasSessionChangeReceivers as t };
