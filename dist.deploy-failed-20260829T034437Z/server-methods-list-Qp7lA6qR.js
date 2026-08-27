import { i as listLoadedChannelPlugins } from "./registry-loaded-Dbglb2uR.js";
import { o as listCoreAdvertisedGatewayMethodNames } from "./core-descriptors-By5XY4Wa.js";
import { n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, r as GATEWAY_EVENT_UPDATE_AVAILABLE, t as GATEWAY_EVENT_DEVICE_PAIR_CHANGED } from "./events-CcYyn8LU.js";
//#region src/gateway/server-aux-methods.ts
/** Gateway method ids handled by auxiliary approval/secret surfaces. */
const GATEWAY_AUX_METHODS = [
	"exec.approval.get",
	"exec.approval.list",
	"exec.approval.request",
	"exec.approval.waitDecision",
	"exec.approval.resolve",
	"plugin.approval.list",
	"plugin.approval.request",
	"plugin.approval.waitDecision",
	"plugin.approval.resolve",
	"approval.get",
	"approval.history",
	"approval.resolve",
	"question.request",
	"question.waitAnswer",
	"question.resolve",
	"question.get",
	"question.list",
	"secrets.reload",
	"secrets.resolve",
	"secrets.store.list",
	"secrets.store.set",
	"secrets.store.delete"
];
//#endregion
//#region src/gateway/server-methods-list.ts
/** Lists core methods intentionally advertised to gateway clients. */
function listCoreGatewayMethods() {
	return listCoreAdvertisedGatewayMethodNames();
}
function listChannelGatewayMethods() {
	const methods = [];
	for (const plugin of listLoadedChannelPlugins()) {
		methods.push(...plugin.gatewayMethods ?? []);
		for (const descriptor of plugin.gatewayMethodDescriptors ?? []) methods.push(descriptor.name);
	}
	return methods;
}
/** Returns the de-duplicated gateway method catalog advertised through method-list APIs. */
function listGatewayMethods() {
	return Array.from(/* @__PURE__ */ new Set([
		...listCoreGatewayMethods(),
		...GATEWAY_AUX_METHODS,
		...listChannelGatewayMethods()
	]));
}
/** Gateway event names that clients can subscribe to or receive over the wire. */
const GATEWAY_EVENTS = [
	"connect.challenge",
	"agent",
	"chat",
	"ui.command",
	"session.approval",
	"session.message",
	"session.observer",
	"session.operation",
	"session.sharing",
	"session.sharing.evidence",
	"session.suggestion",
	"session.typing",
	"session.tool",
	"sessions.changed",
	"controlUi.sessionPullRequests.changed",
	"presence",
	"tick",
	"talk.mode",
	"talk.event",
	"shutdown",
	"health",
	"heartbeat",
	"cron",
	"task",
	"task.suggestion",
	"node.pair.requested",
	"node.pair.resolved",
	"node.presence",
	GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED,
	"node.invoke.cancel",
	"node.invoke.input",
	"node.invoke.request",
	GATEWAY_EVENT_DEVICE_PAIR_CHANGED,
	"device.pair.requested",
	"device.pair.resolved",
	"device.pair.setup.completed",
	"device.pair.setup.deliveryUncertain",
	"users.prefs.changed",
	"skills.changed",
	"voicewake.changed",
	"voicewake.routing.changed",
	"exec.approval.requested",
	"exec.approval.resolved",
	"question.requested",
	"question.resolved",
	"plugin.approval.requested",
	"plugin.approval.resolved",
	"openclaw.approval.requested",
	"openclaw.approval.resolved",
	"terminal.data",
	"terminal.exit",
	GATEWAY_EVENT_UPDATE_AVAILABLE,
	"portal.changed",
	"progressCard.changed"
];
//#endregion
export { listGatewayMethods as n, GATEWAY_EVENTS as t };
