import "./net-BRYQcUG8.js";
import "./auth-BjIfKFX2.js";
import "./client-3jXHeoWL.js";
import "./node-command-policy-CcECn3d6.js";
import "./operator-approvals-client-CaocLWHg.js";
import "./gateway-rpc-BH7rMTL3.js";
import "./hosted-plugin-surface-url-D1_hpwo8.js";
import "./plugin-node-capability-SDRFZFm7.js";
import "./nodes.helpers-C2lNZvIh.js";
import "./startup-auth-D7m_4qUl.js";
//#region src/gateway/channel-status-patches.ts
/** Creates a connected-channel status patch with matching connection/event timestamps. */
function createConnectedChannelStatusPatch(at = Date.now()) {
	return {
		connected: true,
		lastConnectedAt: at,
		lastEventAt: at
	};
}
/** Creates a transport-activity patch for health/activity monitors. */
function createTransportActivityStatusPatch(at = Date.now()) {
	return { lastTransportActivityAt: at };
}
function channelReadyPatch(extras = {}) {
	return Object.assign({
		running: true,
		connected: true,
		lifecycle: "ready",
		lastConnectedAt: Date.now(),
		lastError: null,
		terminalDisconnect: void 0
	}, extras);
}
function channelBlockedPatch(lastError, extras = {}) {
	return Object.assign({
		lifecycle: "blocked",
		terminalDisconnect: true,
		lastError
	}, extras);
}
function channelStoppedPatch(extras = {}) {
	return Object.assign({
		running: false,
		connected: false,
		lifecycle: "stopped"
	}, extras);
}
//#endregion
//#region src/plugin-sdk/gateway-runtime.ts
async function resolveAdvertisedLanHost() {
	return await (await import("./advertised-lan-host-C2vQIO_V.js")).resolveAdvertisedLanHostCore();
}
//#endregion
export { createConnectedChannelStatusPatch as a, channelStoppedPatch as i, channelBlockedPatch as n, createTransportActivityStatusPatch as o, channelReadyPatch as r, resolveAdvertisedLanHost as t };
