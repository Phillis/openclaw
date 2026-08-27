import "./openclaw-agent-db-BEQsKM0c.js";
import { R as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { C as upsertSessionEntryCore, j as resolveInternalSessionEffectsIdentity, u as loadExactSessionEntry } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { st as buildSessionCreationStamp } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { $ as forkSessionFromParentTranscript, kt as applySessionEntryLifecycleMutation, st as replaceTranscriptEvents } from "./session-accessor-fcDZuc2H.js";
import { p as createSessionTranscriptHeader } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
//#region src/agents/internal-session-effects.ts
/** Manages hidden SQLite sessions used for suppressed agent side effects. */
/** Resolves the deterministic SQLite target owned by one internal-effects run. */
function resolveInternalSessionEffectsTarget(params) {
	const incognito = isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId });
	return {
		agentId: params.agentId,
		storePath: params.storePath,
		...resolveInternalSessionEffectsIdentity({
			agentId: params.agentId,
			runId: params.runId,
			...incognito ? { incognito: true } : {}
		})
	};
}
function toInternalSessionEffectsTarget(params) {
	return {
		agentId: params.agentId,
		sessionId: params.entry.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		sessionEntry: params.entry,
		sessionFile: params.sessionKey
	};
}
/** Creates or reopens the hidden SQLite session owned by one internal-effects run. */
async function prepareInternalSessionEffectsSession(params) {
	const scope = resolveInternalSessionEffectsTarget(params);
	const existing = loadExactSessionEntry(scope)?.entry;
	if (existing?.sessionId === scope.sessionId) return toInternalSessionEffectsTarget({
		agentId: params.agentId,
		entry: existing,
		sessionKey: scope.sessionKey,
		storePath: params.storePath
	});
	if ((params.source ? await forkSessionFromParentTranscript({
		agentId: params.source.agentId,
		parentEntry: {
			sessionId: params.source.sessionId,
			updatedAt: Date.now()
		},
		parentSessionKey: params.source.sessionKey,
		sessionKey: scope.sessionKey,
		storePath: params.source.storePath,
		targetSessionId: scope.sessionId,
		targetStorePath: params.storePath
	}) : void 0)?.status !== "created") await replaceTranscriptEvents(scope, [createSessionTranscriptHeader({
		cwd: params.cwd,
		sessionId: scope.sessionId
	})]);
	const now = Date.now();
	const entry = await upsertSessionEntryCore(scope, {
		...buildSessionCreationStamp({
			via: "internal",
			actor: { type: "system" }
		}),
		delivery: { kind: "internal" },
		sessionId: scope.sessionId,
		...isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId }) ? { incognito: true } : {},
		sessionStartedAt: now,
		updatedAt: now
	});
	if (!entry) throw new Error(`Failed to create internal SQLite session for run ${params.runId}`);
	return toInternalSessionEffectsTarget({
		agentId: params.agentId,
		entry,
		sessionKey: scope.sessionKey,
		storePath: params.storePath
	});
}
/** Hard-deletes a run-owned hidden session and its SQLite transcript rows. */
async function removeInternalSessionEffectsSession(target) {
	if (!target?.sessionKey || !target.storePath) return;
	await applySessionEntryLifecycleMutation({
		...target.agentId ? { agentId: target.agentId } : {},
		storePath: target.storePath,
		removals: [{
			sessionKey: target.sessionKey,
			...target.sessionId ? { expectedSessionId: target.sessionId } : {},
			archiveRemovedTranscript: false
		}],
		skipMaintenance: true
	});
}
//#endregion
export { removeInternalSessionEffectsSession as n, resolveInternalSessionEffectsTarget as r, prepareInternalSessionEffectsSession as t };
