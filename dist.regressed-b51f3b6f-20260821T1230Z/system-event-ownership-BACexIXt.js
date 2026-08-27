import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
//#region src/infra/system-event-ownership.ts
const { eventOwners, optionOwners } = resolveGlobalSingleton(Symbol.for("openclaw.systemEvents.ownership"), () => ({
	eventOwners: /* @__PURE__ */ new WeakMap(),
	optionOwners: /* @__PURE__ */ new WeakMap()
}));
function normalizeOwnerAgentId(agentId) {
	return normalizeOptionalString(agentId) ? normalizeAgentId(agentId) : null;
}
function withSystemEventOwner(options, agentId) {
	optionOwners.set(options, normalizeAgentId(agentId));
	return options;
}
function resolveSystemEventOptionsOwnerAgentId(options) {
	return optionOwners.get(options) ?? null;
}
function recordSystemEventOwner(event, agentId) {
	const normalized = normalizeOwnerAgentId(agentId);
	if (normalized) eventOwners.set(event, normalized);
}
function cloneSystemEventOwner(source, clone) {
	const ownerAgentId = eventOwners.get(source);
	if (ownerAgentId) eventOwners.set(clone, ownerAgentId);
}
function resolveSystemEventOwnerAgentId(event) {
	return eventOwners.get(event) ?? null;
}
function selectAgentSystemEvents(events, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	return events.filter((event) => {
		const ownerAgentId = resolveSystemEventOwnerAgentId(event);
		return ownerAgentId === null || ownerAgentId === normalizedAgentId;
	});
}
//#endregion
export { selectAgentSystemEvents as a, resolveSystemEventOwnerAgentId as i, recordSystemEventOwner as n, withSystemEventOwner as o, resolveSystemEventOptionsOwnerAgentId as r, cloneSystemEventOwner as t };
