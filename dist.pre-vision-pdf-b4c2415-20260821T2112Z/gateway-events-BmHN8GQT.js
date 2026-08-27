import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
//#region src/plugins/gateway-events.ts
const log = createSubsystemLogger("plugins");
const sessionsChangedHandlers = resolveGlobalSet(Symbol.for("openclaw.pluginSessionsChangedHandlers"), "plugin-registry");
function subscribePluginSessionsChanged(handler) {
	const subscription = (event) => handler(event);
	sessionsChangedHandlers.add(subscription);
	return () => {
		sessionsChangedHandlers.delete(subscription);
	};
}
function hasPluginSessionsChangedSubscribers() {
	return sessionsChangedHandlers.size > 0;
}
function queuePluginSessionsChanged(payload) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return;
	const source = payload;
	if (typeof source.sessionKey !== "string" || source.sessionKey.length === 0) return;
	if (sessionsChangedHandlers.size === 0) return;
	const subscriptions = [...sessionsChangedHandlers];
	const event = {
		sessionKey: source.sessionKey,
		...typeof source.agentId === "string" ? { agentId: source.agentId } : {},
		...typeof source.label === "string" ? { label: source.label } : {},
		...typeof source.displayName === "string" ? { displayName: source.displayName } : {},
		...typeof source.reason === "string" ? { reason: source.reason } : {},
		...typeof source.phase === "string" ? { phase: source.phase } : {}
	};
	queueMicrotask(() => {
		for (const handler of subscriptions) {
			if (!sessionsChangedHandlers.has(handler)) continue;
			try {
				const result = handler(event);
				Promise.resolve(result).catch((error) => {
					log.warn(`plugin sessions.changed handler failed: ${String(error)}`);
				});
			} catch (error) {
				log.warn(`plugin sessions.changed handler failed: ${String(error)}`);
			}
		}
	});
}
//#endregion
export { queuePluginSessionsChanged as n, subscribePluginSessionsChanged as r, hasPluginSessionsChangedSubscribers as t };
