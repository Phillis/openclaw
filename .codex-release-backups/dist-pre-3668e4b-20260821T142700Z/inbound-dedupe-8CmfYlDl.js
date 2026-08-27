import { s as resolvePersistentDedupePluginStateNamespace, t as createChannelReplayGuard } from "./persistent-dedupe-DHEVh0HN.js";
import { n as LogService } from "./logger-Dn0f-vbT.js";
//#region extensions/matrix/src/matrix/monitor/inbound-dedupe.ts
const MATRIX_INBOUND_DEDUPE_PLUGIN_ID = "matrix";
const MATRIX_INBOUND_DEDUPE_NAMESPACE_PREFIX = "matrix.inbound-dedupe";
const MATRIX_INBOUND_DEDUPE_NAMESPACE = "global";
const MATRIX_INBOUND_DEDUPE_TTL_MS = 720 * 60 * 60 * 1e3;
const MATRIX_INBOUND_DEDUPE_MEMORY_MAX = 5e3;
const MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES = 2e4;
function resolveMatrixInboundDedupeAccountId(accountId) {
	return accountId.trim() || "default";
}
function buildMatrixInboundDedupeEventKey(params) {
	const roomId = params.roomId.trim();
	const eventId = params.eventId.trim();
	if (!roomId || !eventId) return null;
	return `${resolveMatrixInboundDedupeAccountId(params.accountId)}\0${roomId}\0${eventId}`;
}
/** Persisted plugin-state namespace holding the inbound dedupe rows. */
function resolveMatrixInboundDedupeStateNamespace() {
	return resolvePersistentDedupePluginStateNamespace({
		namespace: MATRIX_INBOUND_DEDUPE_NAMESPACE,
		namespacePrefix: MATRIX_INBOUND_DEDUPE_NAMESPACE_PREFIX
	});
}
function createMatrixInboundEventDeduper(params) {
	const accountId = params.auth.accountId;
	return createChannelReplayGuard({
		dedupe: {
			pluginId: MATRIX_INBOUND_DEDUPE_PLUGIN_ID,
			namespacePrefix: MATRIX_INBOUND_DEDUPE_NAMESPACE_PREFIX,
			ttlMs: MATRIX_INBOUND_DEDUPE_TTL_MS,
			memoryMaxSize: MATRIX_INBOUND_DEDUPE_MEMORY_MAX,
			stateMaxEntries: MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES,
			...params.env ? { env: params.env } : {},
			onDiskError: (err) => {
				LogService.warn("MatrixInboundDedupe", "Matrix inbound dedupe persistence failed:", err);
			}
		},
		buildReplayKey: (event) => buildMatrixInboundDedupeEventKey({
			accountId,
			...event
		}),
		namespace: () => MATRIX_INBOUND_DEDUPE_NAMESPACE
	});
}
//#endregion
export { resolveMatrixInboundDedupeStateNamespace as a, createMatrixInboundEventDeduper as i, MATRIX_INBOUND_DEDUPE_TTL_MS as n, buildMatrixInboundDedupeEventKey as r, MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES as t };
