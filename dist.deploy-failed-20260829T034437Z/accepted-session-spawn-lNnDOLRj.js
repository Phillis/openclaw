import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
//#region src/agents/accepted-session-spawn.ts
/** Normalizes accepted child-session spawn results from loose tool payloads. */
/** Normalize a tool result that accepted a child session spawn. */
function normalizeAcceptedSessionSpawnResult(result) {
	const details = asOptionalRecord(asOptionalRecord(result)?.details);
	if (!details || details.status !== "accepted") return null;
	const runId = normalizeOptionalString(details.runId);
	const childSessionKey = normalizeOptionalString(details.childSessionKey);
	if (!runId || !childSessionKey) return null;
	return {
		runId,
		childSessionKey
	};
}
/** Return true when a collection contains at least one accepted child spawn. */
function hasAcceptedSessionSpawn(acceptedSessionSpawns) {
	return Boolean(acceptedSessionSpawns?.length);
}
//#endregion
export { normalizeAcceptedSessionSpawnResult as n, hasAcceptedSessionSpawn as t };
