import "./gateway-rpc-DJvB3IVo.js";
import "./net-DeK7gO-9.js";
import "./auth-CqG8D1lM.js";
import "./call-BFtOrd_w.js";
import "./client-X46urv_Y.js";
import "./node-resolve-Cxs-SER3.js";
import "./node-command-policy-XnskQsTT.js";
import "./operator-approvals-client-CsdH7zm9.js";
import "./hosted-plugin-surface-url-BQ7dBm7a.js";
import "./plugin-node-capability-DAm53jGl.js";
import "./nodes.helpers-C2d4BQ6I.js";
import "./startup-auth-BbAYnqAD.js";
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
	return await (await import("./advertised-lan-host-BfX5cBPj.js")).resolveAdvertisedLanHostCore();
}
//#endregion
export { createConnectedChannelStatusPatch as a, channelStoppedPatch as i, channelBlockedPatch as n, createTransportActivityStatusPatch as o, channelReadyPatch as r, resolveAdvertisedLanHost as t };
