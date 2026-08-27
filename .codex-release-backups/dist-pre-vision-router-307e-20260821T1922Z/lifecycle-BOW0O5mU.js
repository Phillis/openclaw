import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-er-Gn_t_.js";
import "./session-accessor-Bi6bzKQE.js";
import { S as loadTranscriptHeaderSync, k as readTranscriptStatsSync } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { f as isTerminalSessionStatus } from "./restart-recovery-state-BoowPFT5.js";
//#region src/config/sessions/lifecycle.ts
/** Stable Gateway error detail for stale session lifecycle requests. */
const SESSION_LIFECYCLE_CHANGED_ERROR_REASON = "session-changed";
const SESSION_WORK_START_INVALIDATED_ERROR_CODE = "SESSION_WORK_START_INVALIDATED";
var SessionWorkStartInvalidatedError = class extends Error {
	constructor(message) {
		super(message);
		this.code = SESSION_WORK_START_INVALIDATED_ERROR_CODE;
		this.name = "SessionWorkStartInvalidatedError";
	}
};
function isSessionWorkStartInvalidatedError(error) {
	return error instanceof SessionWorkStartInvalidatedError || typeof error === "object" && error !== null && "code" in error && error.code === SESSION_WORK_START_INVALIDATED_ERROR_CODE;
}
/** Lifecycle-owned initializing and archived sessions reject new work. */
function resolveSessionWorkStartError(sessionKey, entry, options) {
	if (options?.expectedSessionId && !entry) return `Session "${sessionKey}" was deleted while starting work. Retry.`;
	if (options?.expectedSessionId && entry?.sessionId !== options.expectedSessionId) return `Session "${sessionKey}" changed while starting work. Retry.`;
	if (entry?.initializationPending === true) return `Session "${sessionKey}" is still initializing. Retry after initialization completes.`;
	if (entry?.agentHarnessMigration) return `Session "${sessionKey}" is changing agent harness lanes. Retry after the migration completes.`;
	return entry?.archivedAt === void 0 ? void 0 : `Session "${sessionKey}" is archived. Restore it before starting new work.`;
}
function resolveTimestamp(value) {
	const timestampMs = asDateTimestampMs(value);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : void 0;
}
function resolvePositiveTimestamp(value) {
	const timestampMs = resolveTimestamp(value);
	return timestampMs !== void 0 && timestampMs > 0 ? timestampMs : void 0;
}
function parseTimestampMs(value) {
	if (typeof value === "number") return resolveTimestamp(value);
	if (typeof value !== "string" || !value.trim()) return;
	return resolveTimestamp(Date.parse(value));
}
function readSessionHeaderStartedAtMs(params) {
	const sessionId = params.entry.sessionId?.trim();
	const sessionKey = params.sessionKey?.trim();
	const agentId = params.agentId ?? (sessionKey ? resolveAgentIdFromSessionKey(sessionKey) : void 0);
	if (!sessionId || !agentId) return;
	try {
		const header = loadTranscriptHeaderSync({
			agentId,
			sessionId,
			...params.storePath ? { storePath: params.storePath } : {},
			...sessionKey ? { sessionKey } : {}
		});
		if (header?.type !== "session" || typeof header.id === "string" && header.id.trim() && header.id !== sessionId) return;
		return parseTimestampMs(header.timestamp);
	} catch {
		return;
	}
}
function resolveSessionLifecycleTimestamps(params) {
	const entry = params.entry;
	if (!entry) return {};
	return {
		sessionStartedAt: resolveTimestamp(entry.sessionStartedAt) ?? readSessionHeaderStartedAtMs({
			...params,
			entry
		}),
		lastInteractionAt: resolveTimestamp(entry.lastInteractionAt)
	};
}
function resolveTerminalMainSessionTranscriptRegistryCheck(params) {
	if (!params.entry || !params.sessionKey) return;
	const configuredMainSessionKey = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.mainKey ?? "main"
	});
	if (canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) !== configuredMainSessionKey) return;
	if (!(isTerminalSessionStatus(params.entry.status) || resolvePositiveTimestamp(params.entry.endedAt) !== void 0)) return;
	if (params.entry.status === "done") return;
	if (params.entry.status === "failed") return;
	const registryTimestampMs = resolvePositiveTimestamp(params.entry.updatedAt);
	if (registryTimestampMs === void 0) return;
	const sessionId = typeof params.entry.sessionId === "string" ? params.entry.sessionId.trim() : "";
	if (!sessionId) return;
	return {
		sessionId,
		registryTimestampMs
	};
}
function isTranscriptMutationNewerThanRegistry(params) {
	const transcriptMutationAtMs = Math.floor(params.transcriptMutationAtMs);
	const registryTimestampMs = Math.floor(params.registryTimestampMs);
	return Number.isFinite(transcriptMutationAtMs) && transcriptMutationAtMs > registryTimestampMs;
}
function hasTerminalMainSessionTranscriptNewerThanRegistrySync(params) {
	const check = resolveTerminalMainSessionTranscriptRegistryCheck(params);
	if (!check) return false;
	try {
		const stats = readTranscriptStatsSync({
			agentId: params.agentId,
			sessionId: check.sessionId,
			storePath: params.storePath
		});
		if (stats.lastMutationAtMs === void 0) return false;
		return isTranscriptMutationNewerThanRegistry({
			transcriptMutationAtMs: stats.lastMutationAtMs,
			registryTimestampMs: stats.lastObservedMutationAtMs ?? check.registryTimestampMs
		});
	} catch {
		return false;
	}
}
async function hasTerminalMainSessionTranscriptNewerThanRegistry(params) {
	return hasTerminalMainSessionTranscriptNewerThanRegistrySync(params);
}
//#endregion
export { isSessionWorkStartInvalidatedError as a, resolveTerminalMainSessionTranscriptRegistryCheck as c, hasTerminalMainSessionTranscriptNewerThanRegistrySync as i, SessionWorkStartInvalidatedError as n, resolveSessionLifecycleTimestamps as o, hasTerminalMainSessionTranscriptNewerThanRegistry as r, resolveSessionWorkStartError as s, SESSION_LIFECYCLE_CHANGED_ERROR_REASON as t };
