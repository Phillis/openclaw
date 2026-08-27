import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { S as resolvePersistedSessionStoreOwnerForTarget, h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { b as toAgentStoreSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { x as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { It as listSessionEntriesCore, w as resolveSessionTranscriptRuntimeTarget } from "./session-accessor-B-FKZX9M.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-Di-LWuJc.js";
import { o as resolveStoredSessionKeyForSessionId, r as resolveExistingSessionKeyForRequest } from "./session-_LoaZdn1.js";
import path from "node:path";
//#region src/agents/run-session-target.ts
var AgentRunSessionTargetResolutionError = class extends Error {
	constructor(sessionId) {
		super(`Cannot resolve a session key for existing session: ${sessionId}`);
		this.code = "session-key-missing";
		this.name = "AgentRunSessionTargetResolutionError";
	}
};
/** Resolves the active runtime target used by current run/session internals. */
async function resolveAgentRunSessionTarget(params) {
	const config = params.config ?? getRuntimeConfig();
	const sessionTarget = params.sessionTarget;
	const targetAgentId = normalizeOptionalString(sessionTarget?.agentId);
	const targetSessionId = normalizeOptionalString(sessionTarget?.sessionId);
	const targetSessionKey = normalizeOptionalString(sessionTarget?.sessionKey);
	const targetStorePath = normalizeOptionalString(sessionTarget?.storePath);
	const hasCompleteTypedTarget = Boolean(targetAgentId && targetSessionId && targetSessionKey && targetStorePath);
	const legacySessionFile = normalizeOptionalString(params.sessionFile);
	const suppliedSessionKey = normalizeOptionalString(params.sessionKey);
	const legacyMarker = parseSqliteSessionFileMarker(legacySessionFile);
	const recognizedCompatibilityKey = Boolean(legacySessionFile?.startsWith("agent:") || legacySessionFile?.startsWith("in-memory:"));
	const fileBackedCompatibilityValue = Boolean(legacySessionFile && !recognizedCompatibilityKey && (path.isAbsolute(legacySessionFile) || legacySessionFile.includes("/") || legacySessionFile.includes("\\") || legacySessionFile.endsWith(".jsonl")));
	const plainCompatibilitySessionKey = !fileBackedCompatibilityValue && legacySessionFile === (targetSessionId ?? params.sessionId) ? legacySessionFile : void 0;
	if (!hasCompleteTypedTarget && legacySessionFile && !legacyMarker && (fileBackedCompatibilityValue || !plainCompatibilitySessionKey && !recognizedCompatibilityKey && legacySessionFile !== suppliedSessionKey && legacySessionFile !== targetSessionKey)) throw new Error("File-backed transcript targets are unsupported; migrate the session to SQLite first");
	const agentId = targetAgentId ?? legacyMarker?.agentId ?? params.agentId;
	const sessionId = targetSessionId ?? legacyMarker?.sessionId ?? params.sessionId;
	const compatibilitySessionKey = (recognizedCompatibilityKey ? legacySessionFile : void 0) ?? (params.missingSessionKey === "create" ? plainCompatibilitySessionKey : void 0);
	const markerEntries = legacyMarker && !hasCompleteTypedTarget ? listSessionEntriesCore({
		agentId: legacyMarker.agentId,
		storePath: legacyMarker.storePath
	}) : [];
	const markerMatches = legacyMarker ? markerEntries.filter(({ entry }) => entry.sessionId === legacyMarker.sessionId) : [];
	const markerSessionKey = legacyMarker && !hasCompleteTypedTarget ? resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), legacyMarker.sessionId) : void 0;
	if (legacyMarker && !hasCompleteTypedTarget && !targetSessionKey && !suppliedSessionKey && markerMatches.length > 0 && !markerSessionKey) throw new Error("Legacy SQLite transcript marker session key is ambiguous");
	const preliminarySessionKey = targetSessionKey ?? suppliedSessionKey ?? compatibilitySessionKey ?? markerSessionKey;
	const preliminaryCompatibilityKeyAgentId = parseAgentSessionKey(compatibilitySessionKey)?.agentId;
	if (!targetSessionKey && !suppliedSessionKey && preliminarySessionKey === compatibilitySessionKey && preliminaryCompatibilityKeyAgentId && agentId && preliminaryCompatibilityKeyAgentId !== agentId) throw new Error("Compatibility session key conflicts with the supplied agent identity");
	const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
		config,
		sessionKey: preliminarySessionKey,
		storePath: targetStorePath
	});
	const trustExplicitAlternateStoreAgent = Boolean(targetAgentId && targetStorePath && !parseAgentSessionKey(preliminarySessionKey)?.agentId && targetStoreOwner.kind === "none");
	const shouldResolveConfiguredStoreRow = params.missingSessionKey === "resolve-existing" && !preliminarySessionKey && !targetStorePath && !legacyMarker;
	const configuredStoreResolution = shouldResolveConfiguredStoreRow ? agentId ? resolveStoredSessionKeyForSessionId({
		cfg: config,
		sessionId,
		agentId
	}) : resolveExistingSessionKeyForRequest({
		cfg: config,
		sessionId,
		clone: false
	}) : void 0;
	const lookupAgentId = (hasCompleteTypedTarget || trustExplicitAlternateStoreAgent ? targetAgentId : void 0) ?? legacyMarker?.agentId ?? configuredStoreResolution?.agentId ?? resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config,
		sessionKey: preliminarySessionKey ?? (params.missingSessionKey === "create" ? sessionId : void 0)
	});
	const lookupStorePath = targetStorePath ?? legacyMarker?.storePath ?? configuredStoreResolution?.storePath ?? resolveSessionStorePathCore(config.session?.store, { agentId: lookupAgentId });
	const storedSessionKey = configuredStoreResolution?.sessionKey ?? (params.missingSessionKey === "resolve-existing" && !preliminarySessionKey && !shouldResolveConfiguredStoreRow ? resolveSessionKeyBySessionId({
		agentId: lookupAgentId,
		sessionId,
		storePath: lookupStorePath
	}) : void 0);
	const createdSessionKey = params.missingSessionKey === "create" ? toAgentStoreSessionKey({
		agentId: lookupAgentId,
		requestKey: sessionId
	}) : void 0;
	const sessionKey = targetSessionKey ?? suppliedSessionKey ?? compatibilitySessionKey ?? markerSessionKey ?? storedSessionKey ?? createdSessionKey;
	const compatibilitySessionKeySelected = !targetSessionKey && !suppliedSessionKey && sessionKey === compatibilitySessionKey;
	const suppliedKeyAgentId = parseAgentSessionKey(suppliedSessionKey)?.agentId;
	const targetKeyAgentId = parseAgentSessionKey(targetSessionKey)?.agentId;
	const compatibilityKeyAgentId = parseAgentSessionKey(compatibilitySessionKey)?.agentId;
	const candidateMarkerKey = targetSessionKey ?? suppliedSessionKey;
	const candidateMarkerEntry = candidateMarkerKey ? markerEntries.find(({ sessionKey: candidateKey }) => candidateKey === candidateMarkerKey)?.entry : void 0;
	if (legacyMarker && !hasCompleteTypedTarget && (targetAgentId && targetAgentId !== legacyMarker.agentId || targetSessionId && targetSessionId !== legacyMarker.sessionId || params.agentId && params.agentId !== legacyMarker.agentId || targetKeyAgentId && targetKeyAgentId !== legacyMarker.agentId || suppliedKeyAgentId && suppliedKeyAgentId !== legacyMarker.agentId || targetStorePath && path.resolve(targetStorePath) !== path.resolve(legacyMarker.storePath))) throw new Error("Legacy SQLite transcript marker conflicts with the supplied session identity");
	if (legacyMarker && !hasCompleteTypedTarget && candidateMarkerKey && candidateMarkerEntry && candidateMarkerEntry.sessionId !== legacyMarker.sessionId) throw new Error("Legacy SQLite transcript marker conflicts with the supplied session key");
	if (compatibilitySessionKeySelected && compatibilityKeyAgentId && agentId && compatibilityKeyAgentId !== agentId) throw new Error("Compatibility session key conflicts with the supplied agent identity");
	if (!sessionKey) throw new AgentRunSessionTargetResolutionError(sessionId);
	const effectiveAgentId = (hasCompleteTypedTarget || trustExplicitAlternateStoreAgent ? targetAgentId : void 0) ?? legacyMarker?.agentId ?? configuredStoreResolution?.agentId ?? resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config,
		fallbackAgentId: lookupAgentId,
		sessionKey
	});
	if (sessionTarget && sessionKey) {
		const storePath = targetStorePath ?? legacyMarker?.storePath ?? resolveSessionStorePathCore(config.session?.store, { agentId: effectiveAgentId });
		return await resolveSessionTranscriptRuntimeTarget({
			...effectiveAgentId ? { agentId: effectiveAgentId } : {},
			sessionId,
			sessionKey,
			storePath,
			...sessionTarget.threadId !== void 0 ? { threadId: sessionTarget.threadId } : {}
		});
	}
	if (legacyMarker && sessionKey) return await resolveSessionTranscriptRuntimeTarget({
		agentId: legacyMarker.agentId,
		sessionId,
		sessionKey,
		storePath: legacyMarker.storePath
	});
	const storePath = resolveSessionStorePathCore(config.session?.store, { agentId: effectiveAgentId });
	return await resolveSessionTranscriptRuntimeTarget({
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		sessionId,
		sessionKey,
		storePath
	});
}
/** Applies identity fields from the explicit target before legacy backfills run. */
function applyAgentRunSessionTargetIdentity(params) {
	const target = params.sessionTarget;
	if (!target) return params;
	return {
		...params,
		agentId: normalizeOptionalString(target.agentId) ?? params.agentId,
		sessionId: normalizeOptionalString(target.sessionId) ?? params.sessionId,
		sessionKey: normalizeOptionalString(target.sessionKey) ?? params.sessionKey
	};
}
//#endregion
export { resolveAgentRunSessionTarget as n, applyAgentRunSessionTargetIdentity as t };
