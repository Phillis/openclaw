import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.js";
//#region src/infra/heartbeat-events.ts
const TARGET_NONE_MESSAGE = "Heartbeat delivery is disabled by configuration (target: none).";
const NO_ROUTE_MESSAGE = "Heartbeat has no delivery route yet. Message your bot once, or set agents.defaults.heartbeat.target.";
function resolveIndicatorType(status) {
	switch (status) {
		case "ok-empty":
		case "ok-token": return "ok";
		case "sent": return "alert";
		case "failed": return "error";
		case "skipped": return;
	}
	throw new Error("Unsupported heartbeat status");
}
const state = resolveGlobalSingleton(Symbol.for("openclaw.heartbeatEvents.state"), () => ({
	lastHeartbeat: null,
	listeners: /* @__PURE__ */ new Set()
}));
function emitHeartbeatEvent(evt) {
	const enriched = {
		ts: Date.now(),
		...evt,
		...evt.message === void 0 && evt.reason === "target-none" ? { message: TARGET_NONE_MESSAGE } : evt.message === void 0 && evt.reason === "no-route" ? { message: NO_ROUTE_MESSAGE } : {}
	};
	state.lastHeartbeat = enriched;
	notifyListeners(state.listeners, enriched);
}
function onHeartbeatEvent(listener) {
	return registerListener(state.listeners, listener);
}
function getLastHeartbeatEvent() {
	return state.lastHeartbeat;
}
function resetHeartbeatEventsForTest() {
	state.lastHeartbeat = null;
	state.listeners.clear();
}
//#endregion
export { resolveIndicatorType as a, resetHeartbeatEventsForTest as i, getLastHeartbeatEvent as n, onHeartbeatEvent as r, emitHeartbeatEvent as t };
