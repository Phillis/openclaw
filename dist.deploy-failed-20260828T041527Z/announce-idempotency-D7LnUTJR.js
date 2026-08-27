//#region src/agents/announce-idempotency.ts
const ANNOUNCE_IDEMPOTENCY_KEY_PREFIX = "announce:";
/** Build the persisted announce id for a child session/run pair. */
function buildAnnounceIdFromChildRun(params) {
	return `v1:${params.childSessionKey}:${params.childRunId}`;
}
/** Build the idempotency key used by announce delivery storage. */
function buildAnnounceIdempotencyKey(announceId) {
	return `${ANNOUNCE_IDEMPOTENCY_KEY_PREFIX}${announceId}`;
}
/** True when a gateway run id belongs to an announce delivery turn. */
function isAnnounceRunId(runId) {
	return typeof runId === "string" && runId.startsWith(ANNOUNCE_IDEMPOTENCY_KEY_PREFIX);
}
//#endregion
export { buildAnnounceIdempotencyKey as n, isAnnounceRunId as r, buildAnnounceIdFromChildRun as t };
