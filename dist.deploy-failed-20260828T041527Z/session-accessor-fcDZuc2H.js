import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { I as resolveTimestampMsToIsoString } from "./number-coercion-CLj0HTDM.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { C as hasSessionActiveAutoModelFallback, O as resolveSessionAuthProfileOverrideSource, S as resolvePersistedSessionStoreOwnerForTarget } from "./agent-scope-DigoIwHb.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, a as listAgentIds, t as AgentSelectionRequiredError } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { c as classifySessionKeyShape, f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Pn as iterateSqliteQuerySync, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { a as resolveStoredSessionOwnerAgentId, n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { c as deferOpenClawAgentPostCommitPublication, g as openOpenClawAgentDatabase, y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-BEQsKM0c.js";
import { B as resolveOpenClawAgentSqlitePath, _ as confirmSessionParticipantsSchemaEnsured, v as ensureSessionParticipantsSchema, w as parseSqliteSessionEntryRecord, z as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C-yaBHT4.js";
import { A as isInternalSessionEffectsKey, D as applySessionEntryMaintenance, O as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort, T as preserveSqliteSameKeySessionRolloverLineage, b as resolveSessionEntry, c as listSessionEntryRows, d as loadExactSessionEntryReadOnly, f as loadSessionEntry, k as finalizeSessionEntryMaintenancePlansBestEffort, m as patchSessionEntryCore, o as listSessionEntriesReadOnly, p as loadSessionEntryReadOnly, u as loadExactSessionEntry, v as replaceSessionEntry, w as resolveSessionStorePathForScope, x as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { c as normalizeSessionDeliveryState, d as sessionDeliveryOrigin, n as deliveryContextFromSession, u as sessionDeliveryChannel } from "./delivery-context.shared-azPdmUls.js";
import { $ as publishSessionEntryCacheInvalidation, E as readTranscriptGenerationInTransaction, L as coerceSqliteNumber, M as canonicalSessionKeyMigrationRequiredError, P as scanCanonicalSqliteSessionEntries, Q as sqliteSessionEntriesEqual, X as assertSessionEntrySelectionUnchanged, _ as readSessionIdentitySnapshot, a as deleteSessionEntryRows, b as writeSessionEntry, c as readExactSessionEntryJson, ct as mergeSessionParticipantSource, dt as projectSqliteSessionOwner, f as readSessionEntryCount, ft as runPreparedSqliteSessionWrite, g as readSessionEntryStore, h as readSessionEntrySelectionSnapshot, j as assertCanonicalSqliteSessionKeysCurrent, l as readExactSessionEntryRow, m as readSessionEntryRow, mt as withSqliteSessionDeletions, nt as parseSessionEntryJson, o as normalizeLifecycleTarget, pt as runSqliteSessionDeletionTransaction, r as deleteLegacySessionEntryRows, rt as readSessionEntriesByStatus, s as parseReadableSqliteSessionEntryRow, st as buildSessionCreationStamp, tt as trackSessionEntryCacheWrite, u as readExactSessionEntryRowValidated, v as rehomeSessionWindows, w as ensureTranscriptSessionRoot, y as resolveLifecyclePrimaryEntry } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { a as normalizeStoreSessionKey, g as stripRuntimeOnlySessionSkillsFields, h as projectCanonicalSessionEntryShape, s as resolveSessionStoreEntryCore, t as collectSessionEntryLookupKeys } from "./store-entry-BN3xGmHe.js";
import { a as normalizeSqliteSessionKey, c as resolveSqliteScope, d as resolveSqliteTranscriptReadScope, f as resolveSqliteTranscriptScope, i as getSessionKysely, l as resolveSqliteStoreScope, m as toDatabaseOptions, n as formatLegacySqliteSessionMarkerForScope, o as readSqliteTranscriptStoreBatches, p as runExclusiveSqliteSessionWrite, r as formatSqliteSessionReferenceForScope, s as resolveSqliteReadScope, t as cloneSessionEntry, u as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-C7NrJaPh.js";
import { a as emitCommittedLifecycleIdentityMutations, o as emitCommittedSessionEntryRemovals, s as emitCommittedSessionIdentityDiff } from "./session-history-eviction-DX5U9ZnW.js";
import { i as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-Be3BKsyF.js";
import { n as emitSessionTranscriptUpdate, o as resolveTerminalAssistantTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-Ce7n2r8A.js";
import { c as projectSessionEntryLifecycleMutation, f as shouldRemoveSessionEntry, h as emitArchivedTranscriptUpdates, i as deletePlannedLifecycleArtifactEntries, m as publishSessionStateArchives, n as collectProjectedReferencedSessionIds, o as planSessionStateAfterEntryRemoval, p as prunePublishedSessionArchivesByRetention, r as deleteMaterializedSessionStatePlans, t as assertPlannedLifecycleArtifactEntriesUnchanged } from "./session-accessor.sqlite-lifecycle-state-BDm5Kty_.js";
import { C as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, O as selectSessionTranscriptTreePathNodes, T as scanSessionTranscriptTree, b as isSessionTranscriptLeafControl, c as reconcileSessionTranscriptIndexInTransaction, s as markSessionTranscriptIndexDirtyInTransaction } from "./session-transcript-index-_z9fjL8c.js";
import { o as resolveFreshSessionTotalTokens, r as mergeSessionEntry } from "./types-gVK8DqPC.js";
import { s as resolveMaintenanceConfig } from "./disk-budget-NzkPcdhZ.js";
import { i as runWithOwnedSessionTranscriptWrite, o as withOwnedSessionTranscriptWriterFence, r as getOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-LK0MNWC3.js";
import { l as sameRestartRecoveryTerminalRunIds, o as mergeRestartRecoveryTerminalRunIds, u as normalizeSessionEntrySlotKey } from "./restart-recovery-state-6FYlAu33.js";
import { o as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-owner-C4EZWikF.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CSCF74bk.js";
import { f as resolveAgentHarnessSessionStoreError, p as resolveAgentHarnessSessionStoreTransitionError } from "./agent-harness-session-key-D9_Ct3Lx.js";
import { t as extractAssistantPhaseText } from "./chat-message-content-BibNiFIq.js";
import { A as readTranscriptStatsSync, D as readTranscriptEventMessage, M as SessionTranscriptReadFenceError, N as resolveSqliteSessionTranscriptReadFence, O as readTranscriptEventRows, a as readMessageIdempotencyKey, c as readTranscriptMessageByScopedIdempotencyKey, d as rewriteSqliteTranscriptEventRowsInTransaction, i as readActiveTranscriptAppendParentId, k as readTranscriptSnapshot, l as redactTranscriptMessageForStorage, n as appendTranscriptEventsInTransaction, o as readTranscriptIdentityByEventId, p as createSessionTranscriptHeader, r as ensureTranscriptHeader, s as readTranscriptMessageByEventId, t as appendTranscriptEventInTransaction, u as replaceSqliteTranscriptEventsInTransaction, x as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DU65_Jao.js";
import { o as buildSessionResetBoundaryEvent } from "./session-accessor.sqlite-lifecycle-wZ-pJlbP.js";
import { n as derivePromptTokens, o as normalizeUsage } from "./usage-DNKCVmJi.js";
import { t as chunkItems } from "./chunk-items-2QWieLm-.js";
import { c as selectResetKeptEntries } from "./tool-result-pairing-DSVQvW_0.js";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { sql } from "kysely";
import { Buffer as Buffer$1 } from "node:buffer";
//#region src/config/sessions/plugin-host-cleanup.ts
/** Shared predicates and mutations for plugin host-owned session-state cleanup. */
function collectStoredSessionEntrySlotKeys(entry, pluginId) {
	const slotKeys = /* @__PURE__ */ new Set();
	const storedSlotKeys = entry.pluginExtensionSlotKeys;
	if (!storedSlotKeys) return slotKeys;
	const records = pluginId === void 0 ? Object.values(storedSlotKeys) : storedSlotKeys[pluginId] ? [storedSlotKeys[pluginId]] : [];
	for (const record of records) for (const slotKey of Object.values(record)) {
		const normalized = normalizeSessionEntrySlotKey(slotKey);
		if (normalized.ok) slotKeys.add(normalized.key);
	}
	return slotKeys;
}
function collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectStoredSessionEntrySlotKeys(entry, pluginId);
	for (const slotKey of sessionEntrySlotKeys ?? []) slotKeys.add(slotKey);
	return slotKeys;
}
function clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys, options = {}) {
	const slotKeys = options.includeStoredSlotKeys === false && sessionEntrySlotKeys ? new Set(sessionEntrySlotKeys) : collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	for (const slotKey of slotKeys) Reflect.deleteProperty(entry, slotKey);
	if (!options.pruneSlotOwnership || !entry.pluginExtensionSlotKeys) return;
	const pruneRecord = (record) => {
		for (const [namespace, slotKey] of Object.entries(record)) {
			const normalized = normalizeSessionEntrySlotKey(slotKey);
			if (normalized.ok && slotKeys.has(normalized.key)) delete record[namespace];
		}
	};
	if (pluginId) {
		const record = entry.pluginExtensionSlotKeys[pluginId];
		if (record) {
			pruneRecord(record);
			if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[pluginId];
		}
	} else {
		for (const record of Object.values(entry.pluginExtensionSlotKeys)) pruneRecord(record);
		for (const [ownerPluginId, record] of Object.entries(entry.pluginExtensionSlotKeys)) if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[ownerPluginId];
	}
	if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
}
/** Clears plugin-owned extension state from one session entry. */
function clearPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys);
	if (!pluginId) {
		delete entry.pluginExtensions;
		delete entry.pluginExtensionSlotKeys;
		delete entry.pluginNextTurnInjections;
		return;
	}
	if (entry.pluginExtensions) {
		delete entry.pluginExtensions[pluginId];
		if (Object.keys(entry.pluginExtensions).length === 0) delete entry.pluginExtensions;
	}
	if (entry.pluginExtensionSlotKeys) {
		delete entry.pluginExtensionSlotKeys[pluginId];
		if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
	}
	if (entry.pluginNextTurnInjections) {
		delete entry.pluginNextTurnInjections[pluginId];
		if (Object.keys(entry.pluginNextTurnInjections).length === 0) delete entry.pluginNextTurnInjections;
	}
}
function hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	if (slotKeys.size === 0) return false;
	for (const slotKey of slotKeys) if (Object.hasOwn(entry, slotKey)) return true;
	return false;
}
function hasPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	if (hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys)) return true;
	if (!pluginId) return Boolean(entry.pluginExtensions || entry.pluginExtensionSlotKeys || entry.pluginNextTurnInjections);
	return Boolean(entry.pluginExtensions?.[pluginId] || entry.pluginExtensionSlotKeys?.[pluginId] || entry.pluginNextTurnInjections?.[pluginId]);
}
function matchesPluginHostCleanupSession(entryKey, entry, sessionKey) {
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
	if (!normalizedSessionKey) return true;
	return normalizeLowercaseStringOrEmpty(entryKey) === normalizedSessionKey || normalizeLowercaseStringOrEmpty(entry.sessionId) === normalizedSessionKey;
}
function shouldSkipPluginHostCleanupStore(params) {
	if (!params.pluginId && !params.sessionKey) return true;
	return params.mode === "promoted-slots" && (params.sessionEntrySlotKeys?.size ?? 0) === 0;
}
function hasPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") return hasPromotedSessionEntrySlot(entry, params.pluginId, params.sessionEntrySlotKeys);
	return hasPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
function isLockedHarnessSessionOwnedByPlugin(entry, preserveLockedHarnessIds) {
	if (entry.modelSelectionLocked !== true || !preserveLockedHarnessIds?.size) return false;
	const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
	return harnessId !== void 0 && preserveLockedHarnessIds.has(harnessId);
}
function clearPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") {
		clearPromotedSessionEntrySlots(entry, params.pluginId, params.sessionEntrySlotKeys, {
			includeStoredSlotKeys: false,
			pruneSlotOwnership: true
		});
		return;
	}
	clearPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
//#endregion
//#region src/config/sessions/session-accessor.entry.ts
/** Resolves a session directly through canonical SQLite row and alias ownership. */
function resolveSessionEntrySelection(scope, options = {}) {
	return resolveSessionEntry(scope, options);
}
function resolveAccessStorePath(scope) {
	return resolveSessionStorePathForScope(scope);
}
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function resolveLogicalSessionStoreCandidates(params) {
	const storeConfig = params.cfg.session?.store;
	const defaultTarget = {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId: params.agentId,
			env: params.env
		})
	};
	if (!isStorePathTemplate(storeConfig)) return [defaultTarget];
	const targets = /* @__PURE__ */ new Map();
	targets.set(defaultTarget.storePath, defaultTarget);
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })) if (target.agentId === params.agentId) targets.set(target.storePath, target);
	return [...targets.values()];
}
function buildLogicalSessionEntryCandidateKeys(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.requestedKey && params.requestedKey !== params.canonicalKey) targets.add(params.requestedKey);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
function findCanonicalSessionEntryMatch(scope, canonicalKey, candidateKeys, options = {}) {
	let selected;
	for (const candidate of candidateKeys) {
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		const match = (options.readOnly === false ? loadExactSessionEntry : loadExactSessionEntryReadOnly)({
			...scope,
			sessionKey: trimmed
		});
		if (!match) continue;
		if (selected) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match.sessionKey !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
		selected = match;
	}
	return selected;
}
/** Resolves one canonical row across the prepared configured and discovered store targets. */
function resolveSessionEntryAccessTarget(scope) {
	const target = resolveSessionEntryStoreTarget(scope);
	return {
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		entry: target.entry,
		requestedKey: target.requestedKey,
		storeKey: target.storeKey
	};
}
/** Resolves ordered candidate keys inside one agent-owned session store. */
function resolveSessionEntryCandidateTarget(scope) {
	const candidateKeys = uniqueStrings(scope.candidateKeys.map((key) => key.trim()));
	const incognitoKey = candidateKeys.find(isIncognitoSessionKey);
	const incognitoAgentId = incognitoKey ? resolveAgentIdFromSessionKey(incognitoKey) : void 0;
	const storePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : resolveSessionStorePathCore(scope.cfg.session?.store, {
		agentId: scope.agentId,
		env: scope.env
	});
	const resolvedAgentId = incognitoAgentId ?? scope.agentId;
	for (const candidateKey of candidateKeys) {
		if (!candidateKey) continue;
		const resolved = resolveSessionEntrySelection({
			agentId: resolvedAgentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey: candidateKey,
			storePath
		}, { readOnly: !incognitoAgentId });
		if (!resolved.existing) continue;
		return {
			agentId: resolvedAgentId,
			candidateKey,
			entry: structuredClone(resolved.existing),
			persisted: true,
			sessionKey: resolved.normalizedKey
		};
	}
	const fallbackKey = scope.fallback?.sessionKey.trim();
	if (!fallbackKey || !scope.fallback) return null;
	return {
		agentId: resolvedAgentId,
		candidateKey: fallbackKey,
		entry: structuredClone(scope.fallback.entry),
		persisted: false,
		sessionKey: fallbackKey
	};
}
function resolveSessionEntryStoreTarget(scope) {
	const requestedKey = scope.sessionKey.trim();
	const canonicalKey = resolveSessionStoreKey({
		cfg: scope.cfg,
		sessionKey: requestedKey
	});
	const agentId = resolveSessionStoreAgentId(scope.cfg, canonicalKey);
	const scanTargets = buildLogicalSessionEntryCandidateKeys({
		agentId,
		canonicalKey,
		cfg: scope.cfg,
		requestedKey
	});
	if (isIncognitoSessionKey(canonicalKey)) {
		const incognitoAgentId = resolveAgentIdFromSessionKey(canonicalKey);
		const storePath = resolveIncognitoOpenClawAgentSqlitePath({
			agentId: incognitoAgentId,
			env: scope.env
		});
		const selectedMatch = findCanonicalSessionEntryMatch({
			agentId: incognitoAgentId,
			...scope.env ? { env: scope.env } : {},
			storePath
		}, canonicalKey, scanTargets, { readOnly: false });
		return {
			agentId: incognitoAgentId,
			canonicalKey,
			entry: selectedMatch?.entry,
			requestedKey,
			storeKey: selectedMatch?.sessionKey ?? canonicalKey,
			storePath
		};
	}
	const candidates = resolveLogicalSessionStoreCandidates({
		agentId,
		cfg: scope.cfg,
		env: scope.env
	});
	const fallback = candidates[0] ?? {
		agentId,
		storePath: resolveSessionStorePathCore(scope.cfg.session?.store, {
			agentId,
			env: scope.env
		})
	};
	let selectedStorePath = fallback.storePath;
	let selectedMatch = findCanonicalSessionEntryMatch({
		agentId,
		...scope.env ? { env: scope.env } : {},
		storePath: fallback.storePath
	}, canonicalKey, scanTargets);
	for (let index = 1; index < candidates.length; index += 1) {
		const candidate = candidates[index];
		if (!candidate) continue;
		const match = findCanonicalSessionEntryMatch({
			agentId,
			...scope.env ? { env: scope.env } : {},
			storePath: candidate.storePath
		}, canonicalKey, scanTargets);
		if (match && selectedMatch) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match) {
			selectedStorePath = candidate.storePath;
			selectedMatch = match;
		}
	}
	return {
		agentId,
		canonicalKey,
		entry: selectedMatch?.entry,
		requestedKey,
		storeKey: selectedMatch?.sessionKey ?? canonicalKey,
		storePath: selectedStorePath
	};
}
/**
* Mutates the canonical logical session entry without exposing the
* backing store map to callers.
*/
async function updateResolvedSessionEntry(scope, update) {
	const target = resolveSessionEntryStoreTarget(scope);
	if (!target.entry) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	let updateResult;
	const updated = await patchSessionEntryCore({
		sessionKey: target.storeKey,
		storePath: target.storePath
	}, async (entry) => {
		updateResult = await update(entry, {
			agentId: target.agentId,
			canonicalKey: target.canonicalKey,
			entry,
			requestedKey: target.requestedKey,
			storeKey: target.storeKey
		});
		return entry;
	}, {
		replaceEntry: true,
		skipMaintenance: true
	});
	if (!updated) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	return {
		canonicalKey: target.canonicalKey,
		entry: structuredClone(updated),
		found: true,
		result: updateResult,
		storeKey: target.storeKey
	};
}
/** Lists entries from the resolved store, preserving the persisted key for each row. */
function listSessionEntriesCore(scope = {}) {
	if (scope.clone === false) return openSessionEntryReadView(scope).entries();
	return listSessionEntryRows(scope);
}
/**
* Borrowed keyed view over one resolved store for synchronous read-only hot paths.
* Unlike loadSessionEntry, `get` is a raw exact persisted-key probe with no alias
* or canonical-key resolution. The first probe materializes one validated store
* snapshot; later probes and `entries` reuse its parsed rows. Rows are borrowed,
* not cloned: callers must not mutate them and must drop the view before any await.
*/
function openSessionEntryReadView(scope = {}) {
	return {
		get: (sessionKey) => (isIncognitoSessionKey(sessionKey) ? loadExactSessionEntry : loadExactSessionEntryReadOnly)({
			...scope,
			clone: false,
			sessionKey
		})?.entry,
		entries: () => listSessionEntriesReadOnly({
			...scope,
			clone: false
		})
	};
}
/**
* Applies an atomic patch and returns the persisted key selected by the backing
* store. Use when a caller must keep sidecar state keyed to the final row.
*/
async function patchSessionEntryWithKey(scope, update, options = {}) {
	const entry = await patchSessionEntryCore(scope, update, options);
	return entry ? {
		sessionKey: normalizeStoreSessionKey(scope.sessionKey),
		entry
	} : null;
}
/**
* Copies one parent transcript into a new child transcript target.
* This is for guarded callers that already own the eventual entry commit.
*/
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-availability.ts
/** Exact persisted-key probe that preserves database and row availability. */
function loadExactSessionEntryReadOnlyResult(scope) {
	const sessionKey = scope.sessionKey.trim();
	if (!sessionKey) return {
		found: true,
		value: void 0
	};
	const resolved = resolveSqliteScope(scope);
	let result;
	try {
		result = withOpenClawAgentDatabaseReadOnly((database) => {
			const entry = readExactSessionEntryRowValidated(database, sessionKey)?.entry;
			return {
				entry,
				rowExists: entry ? true : Boolean(executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("session_key", "=", sessionKey)))
			};
		}, toDatabaseOptions(resolved));
	} catch (error) {
		if (error instanceof Error && error.code === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") return {
			found: false,
			reason: "row-invalid"
		};
		throw error;
	}
	if (!result.found) return result;
	if (!result.value.entry) return result.value.rowExists ? {
		found: false,
		reason: "row-invalid"
	} : {
		found: true,
		value: void 0
	};
	return {
		found: true,
		value: {
			sessionKey,
			entry: scope.clone === false ? result.value.entry : cloneSessionEntry(result.value.entry)
		}
	};
}
const SESSION_IDENTITY_EVIDENCE_QUERY_CHUNK_SIZE = 400;
function readSessionIdentityEvidenceRows(database, items) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const db = getSessionKysely(database.db);
	const rowsByKey = /* @__PURE__ */ new Map();
	const readChunks = (values, column) => {
		for (let offset = 0; offset < values.length; offset += SESSION_IDENTITY_EVIDENCE_QUERY_CHUNK_SIZE) {
			const chunk = values.slice(offset, offset + SESSION_IDENTITY_EVIDENCE_QUERY_CHUNK_SIZE);
			const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
				"current_session_id",
				"entry_json",
				"entry_valid",
				"session_key",
				"updated_at"
			]).where(column, "in", chunk)).rows;
			for (const row of rows) rowsByKey.set(row.session_key, row);
		}
	};
	readChunks([...new Set(items.flatMap((item) => item.sessionKey ? [item.sessionKey] : []))], "session_key");
	readChunks([...new Set(items.map((item) => item.sessionId))], "current_session_id");
	const rowsBySessionId = /* @__PURE__ */ new Map();
	const readableKeys = /* @__PURE__ */ new Set();
	for (const row of rowsByKey.values()) {
		const rows = rowsBySessionId.get(row.current_session_id) ?? [];
		rows.push(row);
		rowsBySessionId.set(row.current_session_id, rows);
		if (row.entry_valid === 1) try {
			if (parseReadableSqliteSessionEntryRow(database, row)) readableKeys.add(row.session_key);
		} catch {}
	}
	return items.map((item) => {
		const exactRow = item.sessionKey ? rowsByKey.get(item.sessionKey) : void 0;
		if (exactRow && exactRow.entry_valid !== -1 && !readableKeys.has(exactRow.session_key)) return {
			status: "unknown",
			reason: "row-invalid"
		};
		if (exactRow && readableKeys.has(exactRow.session_key) && exactRow.current_session_id === item.sessionId) return {
			status: "current",
			sessionKey: exactRow.session_key
		};
		const fallbackRows = rowsBySessionId.get(item.sessionId) ?? [];
		if (fallbackRows.length !== 1) return fallbackRows.length === 0 ? { status: "absent" } : {
			status: "unknown",
			reason: "ambiguous"
		};
		const fallbackRow = fallbackRows[0];
		if (fallbackRow?.entry_valid === 1 && readableKeys.has(fallbackRow.session_key)) return {
			status: "current",
			sessionKey: fallbackRow.session_key
		};
		return fallbackRow?.entry_valid === -1 ? { status: "absent" } : {
			status: "unknown",
			reason: "row-invalid"
		};
	});
}
/** Reads indexed identity evidence once per physical store and in SQLite-sized chunks. */
function readSessionIdentityEvidenceBatch(probes) {
	const results = probes.map(() => ({
		status: "unknown",
		reason: "read-failed"
	}));
	const groups = /* @__PURE__ */ new Map();
	const targetCache = /* @__PURE__ */ new Map();
	for (const [index, probe] of probes.entries()) try {
		const resolved = resolveSqliteReadScope(probe, targetCache);
		const options = toDatabaseOptions(resolved);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		const group = groups.get(databasePath) ?? {
			items: [],
			options
		};
		group.items.push({
			index,
			sessionId: probe.sessionId,
			sessionKey: resolved.sessionKey
		});
		groups.set(databasePath, group);
	} catch {}
	for (const group of groups.values()) {
		let read;
		try {
			read = withOpenClawAgentDatabaseReadOnly((database) => readSessionIdentityEvidenceRows(database, group.items), group.options);
		} catch {
			continue;
		}
		if (read.found) {
			for (const [itemIndex, item] of group.items.entries()) results[item.index] = read.value[itemIndex] ?? {
				status: "unknown",
				reason: "read-failed"
			};
			continue;
		}
		const unavailable = read.reason === "database-missing" ? { status: "absent" } : {
			status: "unknown",
			reason: read.reason
		};
		for (const item of group.items) results[item.index] = unavailable;
	}
	return results;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-projection.ts
async function applySqliteSessionEntryReplacementProjection(params, normalize) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? params.sessionKeys?.[0] ?? "",
		storePath: params.storePath
	});
	const committed = await runPreparedSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
		const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
		const selected = selectedStatuses ? readSessionEntriesByStatus(database, [...selectedStatuses], params.sessionKeys) : selectedKeys ? [...selectedKeys].map((sessionKey) => ({ sessionKey })) : Object.keys(readSessionEntryStore(database)).map((sessionKey) => ({ sessionKey }));
		const expectedRows = /* @__PURE__ */ new Map();
		const entries = selected.flatMap(({ sessionKey }) => {
			const row = readExactSessionEntryRow(database, sessionKey);
			if (!row) {
				if (!selectedKeys || selectedStatuses) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
				return [];
			}
			if (selectedStatuses && (!row.entry.status || !selectedStatuses.has(row.entry.status))) return [];
			expectedRows.set(sessionKey, row);
			return [{
				entry: cloneSessionEntry(row.entry),
				sessionKey
			}];
		});
		const replacementAuthorityKeys = selectedStatuses ? new Set(entries.map(({ sessionKey }) => sessionKey)) : selectedKeys;
		const operation = await params.update(entries);
		const replacements = normalize(operation.replacements);
		const claimedCanonicalKeys = /* @__PURE__ */ new Set();
		for (const replacement of replacements) {
			const previousSessionKeys = replacement.previousSessionKeys;
			const canonical = previousSessionKeys !== void 0;
			if (canonical && !replacement.sessionKey) throw new Error("Session entry replacement requires a key");
			if (canonical && [replacement.sessionKey, ...previousSessionKeys ?? []].some(isInternalSessionEffectsKey)) throw new Error("Session entry canonical replacement cannot target internal effects rows");
			for (const sessionKey of [replacement.sessionKey, ...previousSessionKeys ?? []]) {
				if (replacementAuthorityKeys && !replacementAuthorityKeys.has(sessionKey)) throw new Error(`Session entry replacement is outside the selected ${selectedStatuses ? "row" : "key"} set: ${sessionKey}`);
				if (canonical) {
					if (claimedCanonicalKeys.has(sessionKey)) throw new Error(`Session entry replacements overlap at ${sessionKey}`);
					claimedCanonicalKeys.add(sessionKey);
				}
			}
			if (canonical) {
				for (const previousSessionKey of previousSessionKeys) if (!expectedRows.has(previousSessionKey)) throw new Error(`Session entry canonical projection cannot replace missing alias ${previousSessionKey}`);
			}
		}
		const applicable = replacements.filter((replacement) => replacement.previousSessionKeys || expectedRows.has(replacement.sessionKey));
		if (params.requireWriteSuccess && replacements.length > 0 && applicable.length === 0) throw new Error("session entry replacements did not persist any rows");
		if (applicable.length === 0) return {
			deletedEntries: [],
			commit: () => ({
				maintenancePlans: [],
				result: operation.result
			})
		};
		const validationKeys = new Set(applicable.flatMap((replacement) => [replacement.sessionKey, ...replacement.previousSessionKeys ?? []]));
		const maintenancePlans = [];
		const previous = /* @__PURE__ */ new Map();
		const current = /* @__PURE__ */ new Map();
		return {
			deletedEntries: [...validationKeys].flatMap((sessionKey) => {
				const entry = expectedRows.get(sessionKey)?.entry;
				return entry && !applicable.some((replacement) => replacement.sessionKey === sessionKey) ? [{
					entry,
					sessionKey
				}] : [];
			}),
			commit: () => {
				runSqliteSessionDeletionTransaction((transactionDb) => {
					const transactionEntries = /* @__PURE__ */ new Map();
					for (const sessionKey of validationKeys) {
						const transactionRow = readExactSessionEntryRow(transactionDb, sessionKey);
						const expectedRow = expectedRows.get(sessionKey);
						if (transactionRow?.row.entry_json !== expectedRow?.row.entry_json || !sqliteSessionEntriesEqual(transactionRow?.entry, expectedRow?.entry)) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
						if (transactionRow) transactionEntries.set(sessionKey, transactionRow.entry);
					}
					for (const replacement of applicable) {
						const sourceEntries = [replacement.sessionKey, ...replacement.previousSessionKeys ?? []].flatMap((sessionKey) => {
							const entry = transactionEntries.get(sessionKey);
							return entry ? [{
								entry,
								sessionKey
							}] : [];
						});
						const selectedBefore = sourceEntries.toSorted((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0))[0]?.entry;
						for (const { entry, sessionKey } of sourceEntries) previous.set(sessionKey, entry);
						writeSessionEntry(transactionDb, replacement.sessionKey, cloneSessionEntry(replacement.entry), { previousEntry: selectedBefore ?? null });
						deleteLegacySessionEntryRows(transactionDb, [...replacement.previousSessionKeys ?? []], replacement.sessionKey, { rehomeMembers: selectedBefore?.sessionId === replacement.entry.sessionId });
						current.set(replacement.sessionKey, replacement.entry);
					}
					maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
						activeSessionKey: params.activeSessionKey ?? "",
						archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
						skipMaintenance: params.skipMaintenance ?? true,
						storePath: params.storePath
					}));
				}, toDatabaseOptions(resolved), { operationLabel: "session.entry-replacements" });
				emitCommittedSessionIdentityDiff(previous, current);
				return {
					maintenancePlans,
					result: operation.result
				};
			}
		};
	});
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	return committed.result;
}
async function applySessionEntryExactReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection(params, (replacements) => [...replacements ?? []].map(({ entry, sessionKey }) => ({
		entry,
		sessionKey
	})));
}
/** Internal alias-aware owner; public SDK replacements remain exact-key only. */
async function applySessionEntryCanonicalReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection({
		...params,
		...params.sessionKeys ? { sessionKeys: uniqueStrings(params.sessionKeys.map((key) => key.trim()).filter(Boolean)) } : {}
	}, (replacements) => [...replacements ?? []].map((replacement) => ({
		entry: replacement.entry,
		previousSessionKeys: uniqueStrings(replacement.previousSessionKeys.map((key) => key.trim()).filter(Boolean)),
		sessionKey: replacement.sessionKey.trim()
	})));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-batch-projection.ts
/** Compatibility adapter for the shipped detached-store projection. */
async function applySessionEntryBatchProjection(params) {
	return await applySessionEntryCanonicalReplacements({
		...params,
		update: async (entries) => {
			const store = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
			const operation = await params.update(store);
			return {
				result: operation.result,
				replacements: [...operation.mutations ?? []].map((mutation) => ({
					entry: mutation.entry,
					previousSessionKeys: mutation.previousSessionKeys ?? [],
					sessionKey: mutation.sessionKey
				}))
			};
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle-types.ts
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection.ts
let sessionArchiveRuntimePromise;
function loadSessionArchiveRuntime$1() {
	sessionArchiveRuntimePromise ??= import("./session-archive.runtime.js");
	return sessionArchiveRuntimePromise;
}
async function applySessionEntryReplacements(params) {
	return await applySessionEntryExactReplacements(params);
}
/**
* Applies a detached whole-store projection under the SQLite writer lane.
* This exists only for bounded compatibility adapters that must preserve a
* legacy serialized callback without exposing mutable storage internals.
*/
async function applySessionStoreProjection(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? "",
		storePath: params.storePath
	});
	const committed = await runPreparedSqliteSessionWrite(resolved, async () => {
		const before = readSessionEntryStore(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
		const projected = structuredClone(before);
		const operation = await params.update(projected);
		if (!operation.persist) return {
			deletedEntries: [],
			commit: () => ({
				maintenancePlans: [],
				result: operation.result
			})
		};
		const transitionError = resolveAgentHarnessSessionStoreTransitionError({
			before: new Map(Object.entries(before).filter(([, entry]) => entry.modelSelectionLocked === true)),
			store: projected
		});
		const storeError = resolveAgentHarnessSessionStoreError(projected);
		if (transitionError || storeError) throw new Error(transitionError ?? storeError);
		const changedKeys = uniqueStrings([...Object.keys(before), ...Object.keys(projected)]).filter((sessionKey) => !sqliteSessionEntriesEqual(before[sessionKey], projected[sessionKey]));
		if (changedKeys.length === 0) return {
			deletedEntries: [],
			commit: () => ({
				maintenancePlans: [],
				result: operation.result
			})
		};
		const maintenancePlans = [];
		return {
			deletedEntries: changedKeys.flatMap((sessionKey) => {
				const entry = before[sessionKey];
				return entry && !projected[sessionKey] ? [{
					entry,
					sessionKey
				}] : [];
			}),
			commit: () => {
				runSqliteSessionDeletionTransaction((transactionDb) => {
					for (const sessionKey of changedKeys) {
						const current = readExactSessionEntryRow(transactionDb, sessionKey)?.entry;
						if (!sqliteSessionEntriesEqual(current, before[sessionKey])) throw new Error(`SQLite session entry changed before store projection for ${sessionKey}`);
					}
					for (const sessionKey of changedKeys) {
						const entry = projected[sessionKey];
						if (entry) writeSessionEntry(transactionDb, sessionKey, cloneSessionEntry(entry), { previousEntry: before[sessionKey] ?? null });
						else deleteSessionEntryRows(transactionDb, sessionKey);
					}
					maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
						activeSessionKey: params.activeSessionKey ?? "",
						archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
						skipMaintenance: params.skipMaintenance,
						storePath: params.storePath
					}));
				}, toDatabaseOptions(resolved), { operationLabel: "session.store-projection" });
				return {
					maintenancePlans,
					result: operation.result
				};
			}
		};
	});
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	return committed.result;
}
function readProjectedRemovalEntry(database, projected, allowCanonicalRepair = false) {
	const expectedRawEntryJson = projected.removal.expectedRawEntryJson;
	if (expectedRawEntryJson === void 0) return (allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, projected.sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, projected.sessionKey))?.entry;
	if (readExactSessionEntryJson(database, projected.sessionKey) !== expectedRawEntryJson) throw new Error(`SQLite session entry changed before raw lifecycle removal for ${projected.sessionKey}`);
	return projected.expectedEntry;
}
/** Applies exact lifecycle removals/upserts using SQLite session rows. */
async function applySessionEntryLifecycleMutation(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: "",
		storePath: params.storePath
	});
	const removals = [...params.removals ?? []];
	const upserts = [...params.upserts ?? []];
	let artifactCleanupError;
	const captureArtifactCleanupError = (error) => {
		if (params.captureArtifactCleanupError === true) {
			artifactCleanupError ??= error;
			return;
		}
		throw error;
	};
	let projected;
	let materializedRemovalPlans = [];
	let removalArchiveMaterializationFailed = false;
	const committed = await runPreparedSqliteSessionWrite(resolved, async () => {
		projected = await projectSessionEntryLifecycleMutation(toDatabaseOptions(resolved), {
			...params.allowCanonicalRepair ? { allowCanonicalRepair: true } : {},
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
			removals,
			upserts
		});
		return {
			deletedEntries: projected.removals.flatMap(({ sessionKey, expectedEntry: entry }) => {
				return entry && !projected.upsertedEntries.some((upsert) => upsert.sessionKey === sessionKey) ? [{
					entry,
					sessionKey
				}] : [];
			}),
			...projected.deletePlans.length > 0 ? { beforeCommit: async () => {
				try {
					materializedRemovalPlans = await materializeSessionStateDeletePlans(projected.deletePlans);
				} catch (error) {
					removalArchiveMaterializationFailed = true;
					captureArtifactCleanupError(error);
				}
			} } : {},
			commit: () => commitProjectedLifecycleMutation(materializedRemovalPlans, removalArchiveMaterializationFailed)
		};
	});
	function commitProjectedLifecycleMutation(removalPlans, materializationFailed) {
		let beforeCount = 0;
		const removedSessionKeys = [];
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runSqliteSessionDeletionTransaction((transactionDb) => {
			params.beforeCommitInTransaction?.();
			beforeCount = readSessionEntryCount(transactionDb);
			const validatedRemovals = projected.removals.filter((removal) => {
				if (materializationFailed && removal.removal.archiveRemovedTranscript === true) return false;
				const entry = readProjectedRemovalEntry(transactionDb, removal, params.allowCanonicalRepair);
				if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) {
					const replacedInSameMutation = projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey);
					throw new Error(replacedInSameMutation ? `SQLite session entry has stale lifecycle state for ${removal.sessionKey}` : `SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
				}
				const shouldRemove = shouldRemoveSessionEntry(entry, removal.removal);
				if (!shouldRemove && projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey)) throw new Error(`SQLite session entry has stale lifecycle state for ${removal.sessionKey}`);
				return shouldRemove;
			});
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, removalPlans, void 0, new Set(validatedRemovals.map((removal) => removal.sessionKey)));
			const legacyReplacementTargets = /* @__PURE__ */ new Map();
			for (const { sessionKey, entry, expectedEntry, routeContext, resetBoundary } of projected.upsertedEntries) {
				const sameKeyRemoval = validatedRemovals.find((removal) => removal.sessionKey === sessionKey);
				const currentEntry = sameKeyRemoval ? readProjectedRemovalEntry(transactionDb, sameKeyRemoval, params.allowCanonicalRepair) : (params.allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(transactionDb, sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(transactionDb, sessionKey))?.entry;
				const expectedCurrentEntry = expectedEntry ?? sameKeyRemoval?.expectedEntry;
				if (!sqliteSessionEntriesEqual(currentEntry, expectedCurrentEntry)) {
					if (sameKeyRemoval) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
					throw new SessionEntryLifecycleUpsertConflictError(sessionKey);
				}
				if (sameKeyRemoval && !shouldRemoveSessionEntry(currentEntry, sameKeyRemoval.removal)) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
				if (resetBoundary && expectedEntry?.sessionId) {
					const event = buildSessionResetBoundaryEvent({
						events: loadTranscriptEventsFromDatabase(transactionDb, expectedEntry.sessionId),
						...resetBoundary
					});
					if (appendTranscriptEventsInTransaction(transactionDb, {
						...resolved,
						sessionId: expectedEntry.sessionId,
						sessionKey
					}, [event]) !== 1) throw new Error(`Failed to append reset boundary for ${sessionKey}`);
				}
				writeSessionEntry(transactionDb, sessionKey, entry, {
					allowStoredAliases: params.allowCanonicalRepair === true,
					preserveNodeSuggestions: params.allowCanonicalRepair === true,
					previousEntry: expectedCurrentEntry ?? null,
					...routeContext !== void 0 ? { routeContext } : {}
				});
				const relatedRemovalKeys = validatedRemovals.flatMap((removal) => {
					const removedSessionId = removal.expectedEntry.sessionId;
					return removal.sessionKey !== sessionKey && (removedSessionId === entry.sessionId || removedSessionId === entry.previousSessionId) ? [removal.sessionKey] : [];
				});
				rehomeSessionWindows(transactionDb, sessionKey, relatedRemovalKeys);
				for (const legacyKey of relatedRemovalKeys) {
					const removedEntry = validatedRemovals.find((removal) => removal.sessionKey === legacyKey)?.expectedEntry;
					legacyReplacementTargets.set(legacyKey, {
						canonicalKey: sessionKey,
						rehomeMembers: removedEntry?.sessionId === entry.sessionId
					});
				}
			}
			params.afterUpsertsInTransaction?.(transactionDb);
			const upsertedKeys = new Set(projected.upsertedEntries.map((upsert) => upsert.sessionKey));
			for (const removal of validatedRemovals) {
				if (upsertedKeys.has(removal.sessionKey)) continue;
				const entry = readProjectedRemovalEntry(transactionDb, removal, params.allowCanonicalRepair);
				if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) throw new Error(`SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
				if (!shouldRemoveSessionEntry(entry, removal.removal)) continue;
				const replacement = legacyReplacementTargets.get(removal.sessionKey);
				if (replacement) deleteLegacySessionEntryRows(transactionDb, [removal.sessionKey], replacement.canonicalKey, {
					rehomeMembers: replacement.rehomeMembers,
					validatedEntries: /* @__PURE__ */ new Map([[removal.sessionKey, entry]])
				});
				else deleteSessionEntryRows(transactionDb, removal.sessionKey, {
					deleteOwnedWindows: removal.removal.deleteOwnedWindows === true,
					deliveryCleanupKeys: removal.removal.deliveryCleanupKeys,
					validatedEntry: entry
				});
				removedSessionKeys.push(removal.sessionKey);
			}
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: params.activeSessionKey ?? "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				forceMaintenance: params.maintenanceOverride !== void 0,
				maintenanceConfig: params.maintenanceOverride ? {
					...resolveMaintenanceConfig(),
					...params.maintenanceOverride
				} : void 0,
				skipMaintenance: params.skipMaintenance,
				storePath: params.storePath
			}));
		}, toDatabaseOptions(resolved));
		emitCommittedLifecycleIdentityMutations({
			projected,
			removedSessionKeys
		});
		return {
			archivedTranscripts,
			beforeCount,
			maintenancePlans,
			removedSessionKeys
		};
	}
	const { archivedTranscripts: maintenanceArchivedTranscripts, ...maintenance } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	let publishedRemovalTranscripts = [];
	try {
		publishedRemovalTranscripts = await publishSessionStateArchives(resolved, committed.archivedTranscripts);
	} catch (error) {
		captureArtifactCleanupError(error);
	}
	const archivedTranscripts = [...publishedRemovalTranscripts, ...maintenanceArchivedTranscripts];
	const afterCount = readSessionEntryCount(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
	emitArchivedTranscriptUpdates(archivedTranscripts);
	const archivedTranscriptDirectories = uniqueStrings(archivedTranscripts.map((transcript) => path.dirname(transcript.archivedPath))).toSorted();
	if (archivedTranscriptDirectories.length > 0 && params.cleanupArchivedTranscripts) try {
		const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime$1();
		await cleanupArchivedSessionTranscripts({
			directories: archivedTranscriptDirectories,
			rules: params.cleanupArchivedTranscripts.rules,
			nowMs: params.cleanupArchivedTranscripts.nowMs
		});
		await prunePublishedSessionArchivesByRetention({
			scope: resolved,
			rules: params.cleanupArchivedTranscripts.rules,
			nowMs: params.cleanupArchivedTranscripts.nowMs
		});
	} catch (error) {
		captureArtifactCleanupError(error);
	}
	return {
		beforeCount: committed.beforeCount,
		removedEntries: committed.removedSessionKeys.length,
		removedSessionKeys: committed.removedSessionKeys,
		...maintenance,
		archivedTranscriptDirectories,
		afterCount,
		artifactCleanupError
	};
}
/** Purges entries owned by a deleted agent from SQLite session rows. */
async function purgeDeletedAgentSessionEntries(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.storeAgentId });
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const store = readSessionEntryStore(database);
		const remainingStore = { ...store };
		const entryRemovals = [];
		const removedEntriesToArchive = [];
		for (const sessionKey of Object.keys(store)) {
			if (resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) !== params.agentId) continue;
			const entry = store[sessionKey];
			if (!entry) continue;
			entryRemovals.push({
				expectedEntry: cloneSessionEntry(entry),
				sessionKey
			});
			removedEntriesToArchive.push(entry);
			delete remainingStore[sessionKey];
		}
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: entryRemovals.map((removal) => removal.sessionKey),
			projectedStore: remainingStore
		});
		return {
			deletePlans: removedEntriesToArchive.flatMap((entry) => planSessionStateAfterEntryRemoval({
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				database,
				entry,
				reason: "deleted",
				referencedSessionIds
			})),
			entryRemovals
		};
	});
	const materializedPlans = await materializeSessionStateDeletePlans(prepared.deletePlans);
	const committed = await withSqliteSessionDeletions(resolved, prepared.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
		entry,
		sessionKey
	}] : []), async () => await runExclusiveSqliteSessionWrite(resolved, async () => {
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runSqliteSessionDeletionTransaction((transactionDb) => {
			const currentOwnedSessionKeys = Object.keys(readSessionEntryStore(transactionDb)).filter((sessionKey) => resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) === params.agentId).toSorted();
			const plannedSessionKeys = prepared.entryRemovals.map((removal) => removal.sessionKey).toSorted();
			if (JSON.stringify(currentOwnedSessionKeys) !== JSON.stringify(plannedSessionKeys)) throw new Error("SQLite deleted-agent session entries changed before purge");
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, prepared.entryRemovals);
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedPlans, void 0, new Set(prepared.entryRemovals.map((removal) => removal.sessionKey)));
			deletePlannedLifecycleArtifactEntries(transactionDb, prepared.entryRemovals);
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				storePath: params.storePath
			}));
		}, toDatabaseOptions(resolved));
		emitCommittedSessionEntryRemovals(prepared.entryRemovals);
		return {
			archivedTranscripts,
			maintenancePlans
		};
	}));
	const { archivedTranscripts: maintenanceArchivedTranscripts } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	emitArchivedTranscriptUpdates([...await publishSessionStateArchives(resolved, committed.archivedTranscripts), ...maintenanceArchivedTranscripts]);
}
/** Fully replaces rows for one transcript in the additive SQLite transcript store. */
//#endregion
//#region src/config/sessions/session-entry-selection.ts
var SessionLabelOwnerIndex = class {
	#owners = /* @__PURE__ */ new Map();
	constructor(store) {
		this.store = store;
		for (const [sessionKey, entry] of Object.entries(this.store)) this.#update(sessionKey, entry.label, true);
	}
	isLabelInUse(label, excludedKeys) {
		for (const sessionKey of this.#owners.get(label) ?? []) if (!excludedKeys.includes(sessionKey)) return true;
		return false;
	}
	replaceEntry(candidateKeys, primaryKey, entry) {
		for (const sessionKey of /* @__PURE__ */ new Set([...candidateKeys, primaryKey])) {
			this.#update(sessionKey, this.store[sessionKey]?.label, false);
			delete this.store[sessionKey];
		}
		const cloned = structuredClone(entry);
		this.store[primaryKey] = cloned;
		this.#update(primaryKey, cloned.label, true);
		return cloned;
	}
	#update(sessionKey, label, add) {
		if (label === void 0) return;
		const owners = this.#owners.get(label) ?? /* @__PURE__ */ new Set();
		if (add) {
			owners.add(sessionKey);
			this.#owners.set(label, owners);
			return;
		}
		owners.delete(sessionKey);
	}
};
/** Carries only user/runtime selection into a new dashboard fork. */
function inheritSessionSelection(parentEntry) {
	if (!parentEntry) return {};
	const authProfileOverrideSource = resolveSessionAuthProfileOverrideSource(parentEntry);
	const inheritModelSelection = !hasSessionActiveAutoModelFallback(parentEntry);
	const inheritAuthProfile = inheritModelSelection || authProfileOverrideSource === "user";
	return {
		...inheritModelSelection && parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...inheritModelSelection && parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...inheritModelSelection && parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...inheritModelSelection && parentEntry.modelOverrideRouteResolution ? { modelOverrideRouteResolution: parentEntry.modelOverrideRouteResolution } : {},
		...inheritModelSelection && parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.contextWindow ? { contextWindow: parentEntry.contextWindow } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.toolOverrides ? { toolOverrides: parentEntry.toolOverrides } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...inheritAuthProfile && authProfileOverrideSource && parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...inheritAuthProfile && authProfileOverrideSource ? { authProfileOverrideSource } : {}
	};
}
function cloneOptionalSessionEntry(entry) {
	return entry ? structuredClone(entry) : void 0;
}
function resolveProjectionExistingEntry(snapshot, target) {
	const candidateKeys = target.candidateKeys ?? [target.primaryKey];
	let freshest;
	for (const candidateKey of candidateKeys) {
		const entry = snapshot.store[candidateKey];
		if (entry && (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0))) freshest = entry;
	}
	return cloneOptionalSessionEntry(freshest);
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle.ts
function findSessionCompactionCheckpoint(params) {
	const checkpointId = params.checkpointId.trim();
	if (!checkpointId || !Array.isArray(params.entry.compactionCheckpoints)) return;
	let newest;
	for (const checkpoint of params.entry.compactionCheckpoints) {
		if (checkpoint.checkpointId !== checkpointId) continue;
		if (!newest || checkpoint.createdAt > newest.createdAt) newest = checkpoint;
	}
	return newest;
}
async function applySessionCompactionCheckpointMutation(params) {
	const currentEntry = loadSessionEntry({
		sessionKey: params.readKey,
		storePath: params.storePath
	});
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (currentEntry.modelSelectionLocked === true) return { status: "model-selection-locked" };
	const checkpoint = findSessionCompactionCheckpoint({
		entry: currentEntry,
		checkpointId: params.checkpointId
	});
	if (!checkpoint) return { status: "missing-checkpoint" };
	const forkedSession = await params.forkTranscriptFromCheckpoint(checkpoint);
	if (forkedSession.status !== "created") return forkedSession;
	const nextEntry = await params.buildEntry({
		checkpoint,
		currentEntry,
		forkedTranscript: forkedSession.transcript
	});
	await replaceSessionEntry({
		sessionKey: params.writeKey,
		storePath: params.storePath
	}, nextEntry);
	return {
		status: "created",
		key: params.writeKey,
		checkpoint,
		entry: nextEntry
	};
}
/**
* Forks checkpoint transcript content and persists a new branch entry in one
* storage-sized mutation. SQLite adapters implement the transcript row copy
* and `session_nodes.entry_json` insert inside the same write transaction.
*/
async function branchSessionFromCompactionCheckpoint(params) {
	return await applySessionCompactionCheckpointMutation({
		buildEntry: params.buildEntry,
		checkpointId: params.checkpointId,
		forkTranscriptFromCheckpoint: params.forkTranscriptFromCheckpoint,
		readKey: params.sourceStoreKey ?? params.sourceKey,
		storePath: params.storePath,
		writeKey: params.nextKey
	});
}
/**
* Forks checkpoint transcript content and replaces the current entry in one
* storage-sized mutation. SQLite adapters implement the transcript row copy
* and `session_nodes.entry_json` update inside the same write transaction.
*/
async function restoreSessionFromCompactionCheckpoint(params) {
	return await applySessionCompactionCheckpointMutation({
		buildEntry: params.buildEntry,
		checkpointId: params.checkpointId,
		forkTranscriptFromCheckpoint: params.forkTranscriptFromCheckpoint,
		readKey: params.sessionStoreKey ?? params.sessionKey,
		storePath: params.storePath,
		writeKey: params.sessionKey
	});
}
/** Projects ordered session patches against one store snapshot and commits once. */
async function applySessionPatchProjections(params) {
	return await applySessionEntryBatchProjection({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		skipMaintenance: true,
		update: async (workingStore) => {
			const snapshot = { store: workingStore };
			const labelOwners = new SessionLabelOwnerIndex(workingStore);
			const mutations = [];
			const results = [];
			for (const operation of params.operations) try {
				const target = operation.resolveTarget(snapshot);
				const existingEntry = resolveProjectionExistingEntry(snapshot, target);
				const candidateKeys = uniqueStrings((target.candidateKeys ?? [target.primaryKey]).map((key) => key.trim()).filter(Boolean));
				const projected = await operation.project({
					...target,
					...snapshot,
					...existingEntry ? { existingEntry } : {},
					isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys)
				});
				if (!projected.ok) {
					results.push(projected);
					continue;
				}
				const authorizationFailure = operation.authorize?.();
				if (authorizationFailure) {
					results.push(authorizationFailure);
					continue;
				}
				const previousSessionKeys = candidateKeys.filter((sessionKey) => sessionKey !== target.primaryKey && workingStore[sessionKey]);
				mutations.push({
					entry: projected.entry,
					...previousSessionKeys.length > 0 ? { previousSessionKeys } : {},
					sessionKey: target.primaryKey
				});
				const cloned = labelOwners.replaceEntry(candidateKeys, target.primaryKey, projected.entry);
				results.push({
					ok: true,
					entry: structuredClone(cloned)
				});
			} catch (error) {
				if (!operation.onError) throw error;
				results.push(operation.onError(error));
			}
			return {
				mutations,
				result: results
			};
		}
	});
}
/** Applies one patch through the canonical ordered batch projection owner. */
async function applySessionPatchProjection(params) {
	const [result] = await applySessionPatchProjections({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		operations: [{
			resolveTarget: params.resolveTarget,
			project: params.project,
			...params.assertCurrent ? { authorize: () => {
				params.assertCurrent?.();
			} } : {}
		}]
	});
	if (!result) throw new Error("Session patch projection produced no result");
	return result;
}
/**
* Runs an operation while preserving one temporary session mapping.
* The storage backend snapshots exactly the named key before the operation and
* restores that entry, or deletes it when it did not previously exist, after
* the operation finishes. SQLite backends can implement the same named
* preservation lifecycle without exposing mutable store access to callers.
*/
async function preserveTemporarySessionMapping(scope, operation) {
	const snapshot = snapshotTemporarySessionMapping(scope);
	let operationResult;
	try {
		operationResult = {
			ok: true,
			result: await operation()
		};
	} catch (err) {
		operationResult = {
			error: err,
			ok: false
		};
	}
	const restoreFailure = await restoreTemporarySessionMapping(snapshot);
	if (!operationResult.ok) throw operationResult.error;
	return {
		result: operationResult.result,
		...snapshot.canRestore ? {} : { snapshotFailure: snapshot.snapshotFailure },
		...restoreFailure ? { restoreFailure } : {}
	};
}
/**
* Clears plugin host-owned state inside one resolved session store.
* This is an internal transaction-sized boundary for the storage backend, not
* a Plugin SDK API.
*/
async function cleanupPluginHostSessionStore(params) {
	if (shouldSkipPluginHostCleanupStore(params) || params.shouldCleanup && !params.shouldCleanup()) return 0;
	const now = Date.now();
	let cleared = 0;
	for (const { entry, sessionKey } of listSessionEntriesCore({
		agentId: params.agentId,
		storePath: params.storePath
	})) {
		if (isLockedHarnessSessionOwnedByPlugin(entry, params.preserveLockedHarnessIds)) continue;
		if (!matchesPluginHostCleanupSession(sessionKey, entry, params.sessionKey) || !hasPluginHostCleanupTarget(entry, params)) continue;
		if (await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey,
			storePath: params.storePath
		}, (currentEntry) => {
			if (isLockedHarnessSessionOwnedByPlugin(currentEntry, params.preserveLockedHarnessIds)) return null;
			if (!hasPluginHostCleanupTarget(currentEntry, params)) return null;
			clearPluginHostCleanupTarget(currentEntry, params);
			currentEntry.updatedAt = now;
			return currentEntry;
		}, {
			replaceEntry: true,
			skipMaintenance: true
		})) cleared += 1;
	}
	return cleared;
}
function snapshotTemporarySessionMapping(scope) {
	const storePath = resolveAccessStorePath(scope);
	try {
		const exact = loadExactSessionEntry({
			...scope,
			storePath
		});
		return {
			canRestore: true,
			...exact ? {
				entry: structuredClone(exact.entry),
				hadEntry: true
			} : { hadEntry: false },
			sessionKey: scope.sessionKey,
			storePath
		};
	} catch (err) {
		return {
			canRestore: false,
			sessionKey: scope.sessionKey,
			snapshotFailure: formatErrorMessage(err),
			storePath
		};
	}
}
async function restoreTemporarySessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		if (snapshot.hadEntry) await replaceSessionEntry({
			sessionKey: snapshot.sessionKey,
			storePath: snapshot.storePath
		}, structuredClone(snapshot.entry));
		else await applySessionEntryLifecycleMutation({
			storePath: snapshot.storePath,
			removals: [{ sessionKey: snapshot.sessionKey }],
			activeSessionKey: snapshot.sessionKey,
			skipMaintenance: true
		});
		return;
	} catch (err) {
		return formatErrorMessage(err);
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-fork.ts
const DEFAULT_PARENT_FORK_MAX_TOKENS = 1e5;
function formatParentForkTooLargeMessage(params) {
	return `Parent context is too large to fork (${params.parentTokens}/${params.maxTokens} tokens); starting with isolated context instead.`;
}
function planParentForkDecision(parentEntry, transcriptEstimate, options = {}) {
	const maxTokens = DEFAULT_PARENT_FORK_MAX_TOKENS;
	const parentTokens = options.preferTranscriptEstimate ? transcriptEstimate?.tokens : resolveFreshSessionTotalTokens(parentEntry) ?? transcriptEstimate?.tokens;
	if (typeof parentTokens === "number" && parentTokens > maxTokens) return {
		status: "skip",
		reason: "parent-too-large",
		maxTokens,
		parentTokens,
		message: formatParentForkTooLargeMessage({
			parentTokens,
			maxTokens
		})
	};
	return {
		status: "fork",
		maxTokens,
		...typeof parentTokens === "number" ? { parentTokens } : {}
	};
}
function estimateTranscriptPromptTokens(events) {
	let byteEstimate = 0;
	let latestUsageEstimate;
	let latestUsageEstimateIsExactContext = false;
	let trailingBytes = 0;
	for (const event of selectParentForkTokenEstimateEvents(events)) {
		const serializedBytes = Buffer.byteLength(JSON.stringify(event)) + 1;
		byteEstimate += serializedBytes;
		if (!isRecord(event)) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const message = isRecord(event.message) ? event.message : void 0;
		const usageRaw = isRecord(message?.usage) ? message.usage : isRecord(event.usage) ? event.usage : void 0;
		if (!usageRaw) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const contextUsage = readTranscriptContextUsage(usageRaw);
		if (message?.api === "cli" && contextUsage === void 0) {
			latestUsageEstimate = void 0;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "unavailable") {
			latestUsageEstimate = void 0;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "available") {
			latestUsageEstimate = normalizePositiveTokenCount(contextUsage.totalTokens);
			latestUsageEstimateIsExactContext = true;
			trailingBytes = 0;
			continue;
		}
		const usage = normalizeUsage(usageRaw);
		const promptTokens = normalizePositiveTokenCount(derivePromptTokens({
			input: usage?.input,
			cacheRead: usage?.cacheRead,
			cacheWrite: usage?.cacheWrite
		}));
		const outputTokens = normalizePositiveTokenCount(usage?.output) ?? 0;
		const totalTokens = promptTokens === void 0 ? void 0 : normalizePositiveTokenCount(promptTokens + outputTokens);
		if (typeof totalTokens === "number") {
			latestUsageEstimate = totalTokens;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
		}
	}
	if (latestUsageEstimate !== void 0) {
		const tokens = normalizePositiveTokenCount(latestUsageEstimate + Math.ceil(trailingBytes / 4));
		return tokens === void 0 ? void 0 : {
			kind: latestUsageEstimateIsExactContext ? "exact-context" : "legacy-or-bytes",
			tokens
		};
	}
	const tokens = normalizePositiveTokenCount(Math.ceil(byteEstimate / 4));
	return tokens === void 0 ? void 0 : {
		kind: "legacy-or-bytes",
		tokens
	};
}
function selectParentForkTokenEstimateEvents(events) {
	const tree = scanSessionTranscriptTree(events.filter((entry) => !(isRecord(entry) && entry.type === "session")));
	return mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath: selectSessionTranscriptTreePathNodes(tree, tree.leafId),
		appendPath: selectSessionTranscriptTreePathNodes(tree, tree.appendParentId),
		appendParentId: tree.appendParentId
	}).nodes.flatMap((node) => node.entry);
}
function normalizePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readTranscriptContextUsage(usageRaw) {
	const contextUsage = usageRaw.contextUsage;
	if (!isRecord(contextUsage)) return;
	if (contextUsage.state === "unavailable") return { state: "unavailable" };
	if (contextUsage.state !== "available") return;
	const totalTokens = normalizePositiveTokenCount(contextUsage.totalTokens);
	return totalTokens === void 0 ? void 0 : {
		state: "available",
		totalTokens
	};
}
function resolveParentForkSourceTranscript(fileEntries, forkFrom) {
	if (fileEntries.length === 0) return null;
	const header = fileEntries.find((entry) => isRecord(entry) && entry.type === "session");
	const entries = fileEntries.filter((entry) => !(isRecord(entry) && entry.type === "session"));
	const tree = scanSessionTranscriptTree(entries);
	const mergedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath: selectSessionTranscriptTreePathNodes(tree, tree.leafId),
		appendPath: selectSessionTranscriptTreePathNodes(tree, tree.appendParentId),
		appendParentId: tree.appendParentId
	});
	const visibleBranchEntries = mergedPath.nodes.flatMap((node) => {
		if (!isRecord(node.entry)) return [];
		const parentId = node.selectedParentId;
		return [node.entry.parentId === parentId ? node.entry : {
			...node.entry,
			parentId
		}];
	});
	const branchEntries = forkFrom === "last-completed" ? visibleBranchEntries.slice(0, findLastCompletedAssistantIndex(visibleBranchEntries) + 1) : visibleBranchEntries;
	const pathEntryIds = new Set(branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastLeafUpdateNode = tree.nodes.findLast((node) => node.leafId !== void 0);
	const lastBranchEntry = branchEntries.at(-1);
	const lastBranchEntryId = isRecord(lastBranchEntry) && typeof lastBranchEntry.id === "string" ? lastBranchEntry.id : null;
	return {
		appendParentId: forkFrom === "last-completed" ? lastBranchEntryId : mergedPath.appendParentId,
		...forkFrom !== "last-completed" && lastLeafUpdateNode?.appendMode ? { appendMode: lastLeafUpdateNode.appendMode } : {},
		branchEntries,
		cwd: typeof header?.cwd === "string" ? header.cwd : void 0,
		labelsToWrite: collectBranchLabels({
			allEntries: entries,
			pathEntryIds
		}),
		leafId: forkFrom === "last-completed" ? lastBranchEntryId : tree.leafId,
		preserveLeafControl: forkFrom !== "last-completed" && isSessionTranscriptLeafControl(lastLeafUpdateNode?.entry)
	};
}
function findLastCompletedAssistantIndex(entries) {
	return entries.findLastIndex((entry) => {
		const message = isRecord(entry) && isRecord(entry.message) ? entry.message : void 0;
		return message?.role === "assistant" && message.stopReason !== "toolUse";
	});
}
function collectBranchLabels(params) {
	return params.allEntries.flatMap((entry) => isRecord(entry) && entry.type === "label" && typeof entry.label === "string" && typeof entry.targetId === "string" && typeof entry.id === "string" && !params.pathEntryIds.has(entry.id) && params.pathEntryIds.has(entry.targetId) && typeof entry.timestamp === "string" ? [{
		targetId: entry.targetId,
		label: entry.label,
		timestamp: entry.timestamp
	}] : []);
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = randomUUID();
	existingIds.add(id);
	return id;
}
function buildLabelEntries(params) {
	let parentId = params.lastEntryId;
	return params.labelsToWrite.map(({ targetId, label, timestamp }) => {
		const entry = {
			type: "label",
			id: generateEntryId(params.pathEntryIds),
			parentId,
			timestamp,
			targetId,
			label
		};
		parentId = entry.id;
		return entry;
	});
}
function hasAssistantEntry(entries) {
	return entries.some((entry) => isRecord(entry) && entry.type === "message" && isRecord(entry.message) && entry.message.role === "assistant");
}
function buildForkedChildTranscriptEvents(params) {
	const header = {
		...createSessionTranscriptHeader({
			cwd: params.source.cwd,
			sessionId: params.targetSessionId
		}),
		parentSession: params.parentSessionFile
	};
	if (!params.source.preserveLeafControl && !hasAssistantEntry(params.source.branchEntries)) return [header];
	const pathEntryIds = new Set(params.source.branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = params.source.branchEntries.at(-1);
	const lastPathEntryId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	const labelEntries = buildLabelEntries({
		labelsToWrite: params.source.labelsToWrite,
		pathEntryIds,
		lastEntryId: lastPathEntryId
	});
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId: labelEntries.at(-1)?.id ?? lastPathEntryId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	return [
		header,
		...params.source.branchEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-session.ts
async function forkSessionTranscriptFromParent(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const target = params.targetStorePath ? resolveSqliteScope({
		sessionKey: params.sessionKey,
		storePath: params.targetStorePath
	}) : resolved;
	if (!(target.agentId !== resolved.agentId || (target.path ?? "") !== (resolved.path ?? ""))) return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = { status: "failed" };
		runSqliteSessionDeletionTransaction((database) => {
			params.commitGuard?.();
			result = forkSqliteParentTranscriptInTransaction(database, resolved, {
				enforceTokenLimit: params.enforceTokenLimit,
				parentEntry: params.parentEntry,
				parentSessionKey: params.parentSessionKey,
				forkFrom: params.forkFrom,
				targetSessionId: params.targetSessionId,
				targetSessionKey: params.sessionKey
			});
		}, toDatabaseOptions(resolved));
		return result;
	});
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), params.parentEntry.sessionId), params.forkFrom);
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeSqliteSessionKey(params.parentSessionKey)
	});
	return await runExclusiveSqliteSessionWrite(target, async () => {
		const sessionId = params.targetSessionId ?? randomUUID();
		const targetScope = {
			...target,
			sessionId,
			sessionKey: normalizeSqliteSessionKey(params.sessionKey)
		};
		const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
		runSqliteSessionDeletionTransaction((database) => {
			params.commitGuard?.();
			writeSqliteForkedChildTranscriptInTransaction(database, targetScope, {
				parentSessionFile,
				source
			});
		}, toDatabaseOptions(target));
		return {
			status: "created",
			transcript: {
				sessionFile,
				sessionId
			}
		};
	});
}
/** Forks parent context into a child session entry using SQLite rows only. */
async function forkSessionEntryFromParentTarget(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	return await runPreparedSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const parent = resolveLifecyclePrimaryEntry(database, parentTarget);
		if (!parent?.entry.sessionId) return {
			deletedEntries: [],
			commit: () => ({ status: "missing-parent" })
		};
		const base = resolveLifecyclePrimaryEntry(database, sessionTarget)?.entry ?? params.fallbackEntry;
		if (!base) return {
			deletedEntries: [],
			commit: () => ({ status: "missing-entry" })
		};
		const deletedEntries = [...readSessionIdentitySnapshot(database, sessionTarget.storeKeys)].flatMap(([sessionKey, entry]) => sessionKey !== sessionTarget.canonicalKey ? [{
			sessionKey,
			entry
		}] : []);
		if (params.skipForkWhen?.(cloneSessionEntry(base))) return {
			deletedEntries,
			commit: async () => {
				const sessionEntry = await persistSqliteParentForkSkipPatch({
					entry: base,
					params,
					sessionTarget,
					patch: params.skipPatch?.(cloneSessionEntry(base)),
					resolved
				});
				return {
					status: "skipped",
					reason: "existing-entry",
					parentEntry: cloneSessionEntry(parent.entry),
					sessionEntry
				};
			}
		};
		const transcriptParentTokens = typeof resolveFreshSessionTotalTokens(parent.entry) !== "number" && typeof parent.entry.sessionId === "string" && parent.entry.sessionId.length > 0 ? estimateTranscriptPromptTokens(loadTranscriptEventsFromDatabase(database, parent.entry.sessionId)) : void 0;
		const decision = planParentForkDecision(parent.entry, transcriptParentTokens);
		if (decision.status === "skip") return {
			deletedEntries,
			commit: async () => {
				const patch = params.decisionSkipPatch?.({
					decision,
					entry: cloneSessionEntry(base),
					parentEntry: cloneSessionEntry(parent.entry)
				});
				const sessionEntry = await persistSqliteParentForkSkipPatch({
					entry: base,
					params,
					sessionTarget,
					patch,
					resolved
				});
				return {
					status: "skipped",
					reason: "decision-skip",
					parentEntry: cloneSessionEntry(parent.entry),
					sessionEntry,
					decision
				};
			}
		};
		let result = { status: "failed" };
		const maintenancePlans = [];
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		return {
			deletedEntries,
			commit: async () => {
				runSqliteSessionDeletionTransaction((writeDatabase) => {
					const freshParent = resolveLifecyclePrimaryEntry(writeDatabase, parentTarget)?.entry;
					if (!freshParent?.sessionId) {
						result = { status: "missing-parent" };
						return;
					}
					const freshBase = resolveLifecyclePrimaryEntry(writeDatabase, sessionTarget)?.entry ?? params.fallbackEntry;
					if (!freshBase) {
						result = { status: "missing-entry" };
						return;
					}
					const fork = forkSqliteParentTranscriptInTransaction(writeDatabase, resolved, {
						parentEntry: freshParent,
						parentSessionKey: parentTarget.canonicalKey,
						targetSessionKey: sessionTarget.canonicalKey
					});
					if (fork.status !== "created") {
						result = fork.status === "missing-parent" ? { status: "missing-parent" } : { status: "failed" };
						return;
					}
					const next = mergeSessionEntry(freshBase, {
						...params.patch?.({
							decision,
							entry: cloneSessionEntry(freshBase),
							fork: fork.transcript,
							parentEntry: cloneSessionEntry(freshParent)
						}),
						forkSource: {
							sessionKey: parentTarget.canonicalKey,
							sessionId: freshParent.sessionId
						},
						forkedFromParent: true,
						lifecycleRunId: void 0,
						lastRunId: void 0,
						sessionId: fork.transcript.sessionId,
						totalTokens: void 0,
						totalTokensFresh: false,
						totalTokensVersion: void 0
					});
					previousIdentity = readSessionIdentitySnapshot(writeDatabase, sessionTarget.storeKeys);
					writeSessionEntry(writeDatabase, sessionTarget.canonicalKey, next, { previousEntry: freshBase });
					rehomeSessionWindows(writeDatabase, sessionTarget.canonicalKey, sessionTarget.storeKeys);
					deleteLegacySessionEntryRows(writeDatabase, sessionTarget.storeKeys, sessionTarget.canonicalKey, { rehomeMembers: freshBase.sessionId === next.sessionId });
					maintenancePlans.push(applySessionEntryMaintenance(writeDatabase, {
						activeSessionKey: sessionTarget.canonicalKey,
						archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
						skipMaintenance: true,
						storePath: params.storePath
					}));
					currentIdentity = readSessionIdentitySnapshot(writeDatabase, sessionTarget.storeKeys);
					result = {
						status: "forked",
						decision,
						fork: fork.transcript,
						parentEntry: cloneSessionEntry(freshParent),
						sessionEntry: cloneSessionEntry(next)
					};
				}, toDatabaseOptions(resolved));
				emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
				await finalizeSessionEntryMaintenancePlansBestEffort(resolved, maintenancePlans);
				return result;
			}
		};
	});
}
async function persistSqliteParentForkSkipPatch(params) {
	if (!params.patch) return cloneSessionEntry(params.entry);
	const next = preserveSqliteSameKeySessionRolloverLineage({
		next: mergeSessionEntry(params.entry, params.patch),
		previous: params.entry,
		sessionKey: params.sessionTarget.canonicalKey
	});
	const maintenancePlans = [];
	let previousIdentity = /* @__PURE__ */ new Map();
	let currentIdentity = /* @__PURE__ */ new Map();
	runSqliteSessionDeletionTransaction((database) => {
		previousIdentity = readSessionIdentitySnapshot(database, params.sessionTarget.storeKeys);
		writeSessionEntry(database, params.sessionTarget.canonicalKey, next, { previousEntry: params.entry });
		rehomeSessionWindows(database, params.sessionTarget.canonicalKey, params.sessionTarget.storeKeys);
		deleteLegacySessionEntryRows(database, params.sessionTarget.storeKeys, params.sessionTarget.canonicalKey, { rehomeMembers: params.entry.sessionId === next.sessionId });
		maintenancePlans.push(applySessionEntryMaintenance(database, {
			activeSessionKey: params.sessionTarget.canonicalKey,
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(params.resolved),
			skipMaintenance: true,
			storePath: params.params.storePath
		}));
		currentIdentity = readSessionIdentitySnapshot(database, params.sessionTarget.storeKeys);
	}, toDatabaseOptions(params.resolved));
	emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
	await finalizeSessionEntryMaintenancePlansBestEffort(params.resolved, maintenancePlans);
	return cloneSessionEntry(next);
}
/** Cleans scoped session lifecycle rows and associated SQLite transcript state. */
async function resolveSessionParentForkDecision(params) {
	const parentSessionId = typeof params.parentEntry.sessionId === "string" ? params.parentEntry.sessionId : "";
	if (!(typeof resolveFreshSessionTotalTokens(params.parentEntry) !== "number" && parentSessionId.length > 0)) return planParentForkDecision(params.parentEntry);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteStoreScope(params.storePath)));
	return planParentForkDecision(params.parentEntry, estimateTranscriptPromptTokens(loadTranscriptEventsFromDatabase(database, parentSessionId)));
}
function forkSqliteParentTranscriptInTransaction(database, resolved, params) {
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, params.parentEntry.sessionId), params.forkFrom);
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const sessionId = params.targetSessionId ?? randomUUID();
	const targetScope = {
		...resolved,
		sessionId,
		sessionKey: normalizeSqliteSessionKey(params.targetSessionKey)
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeSqliteSessionKey(params.parentSessionKey)
	});
	const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
	writeSqliteForkedChildTranscriptInTransaction(database, targetScope, {
		parentSessionFile,
		source
	});
	return {
		status: "created",
		transcript: {
			sessionFile,
			sessionId
		}
	};
}
function resolveParentForkLimitDecision(params, source) {
	if (!params.enforceTokenLimit) return;
	const decision = planParentForkDecision(params.parentEntry, estimateTranscriptPromptTokens(source.branchEntries), { preferTranscriptEstimate: params.forkFrom === "last-completed" });
	return decision.status === "skip" ? decision : void 0;
}
function writeSqliteForkedChildTranscriptInTransaction(database, targetScope, params) {
	appendTranscriptEventsInTransaction(database, targetScope, buildForkedChildTranscriptEvents({
		parentSessionFile: params.parentSessionFile,
		source: params.source,
		targetSessionId: targetScope.sessionId
	}));
}
//#endregion
//#region src/config/sessions/cli-session-binding.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
function normalizeCliSessionReseedReceipt(value) {
	const promptHash = normalizeOptionalString(value?.promptHash);
	const localSessionId = normalizeOptionalString(value?.localSessionId);
	const userTurnDisposition = value?.userTurnDisposition;
	if (value?.version !== 1 || !promptHash || !SHA256_HEX_PATTERN.test(promptHash) || !localSessionId || userTurnDisposition !== "persisted" && userTurnDisposition !== "omitted") return;
	return {
		version: 1,
		promptHash,
		localSessionId,
		userTurnDisposition
	};
}
/**
* Re-own omitted reseed receipts when a reset intentionally preserves the
* native CLI conversation. Persisted turns keep their old owner and fail open
* because their canonical user row belongs to the archived local transcript.
*/
function rebindCliSessionReseedReceiptsForReset(bindings, localSessionId) {
	const normalizedLocalSessionId = normalizeOptionalString(localSessionId);
	if (!bindings || !normalizedLocalSessionId) return bindings;
	let rebound;
	for (const [provider, binding] of Object.entries(bindings)) {
		const receipt = normalizeCliSessionReseedReceipt(binding.reseedReceipt);
		if (!receipt || receipt.userTurnDisposition !== "omitted") continue;
		rebound ??= { ...bindings };
		rebound[provider] = {
			...binding,
			reseedReceipt: {
				...receipt,
				localSessionId: normalizedLocalSessionId
			}
		};
	}
	return rebound ?? bindings;
}
/** Read the stored CLI session binding for a provider, including legacy Claude state. */
function getCliSessionBinding(entry, provider) {
	if (!entry) return;
	const normalized = normalizeProviderId(provider);
	const fromBindings = entry.cliSessionBindings?.[normalized];
	const bindingSessionId = normalizeOptionalString(fromBindings?.sessionId);
	if (bindingSessionId) return {
		sessionId: bindingSessionId,
		resumeCheckpointId: normalizeOptionalString(fromBindings?.resumeCheckpointId),
		...fromBindings?.forceReuse === true ? { forceReuse: true } : {},
		...fromBindings?.forkNextResume === true ? { forkNextResume: true } : {},
		authProfileId: normalizeOptionalString(fromBindings?.authProfileId),
		authEpoch: normalizeOptionalString(fromBindings?.authEpoch),
		authEpochVersion: fromBindings?.authEpochVersion,
		extraSystemPromptHash: normalizeOptionalString(fromBindings?.extraSystemPromptHash),
		messageToolPolicyHash: normalizeOptionalString(fromBindings?.messageToolPolicyHash),
		promptToolNamesHash: normalizeOptionalString(fromBindings?.promptToolNamesHash),
		cwdHash: normalizeOptionalString(fromBindings?.cwdHash),
		mcpConfigHash: normalizeOptionalString(fromBindings?.mcpConfigHash),
		mcpResumeHash: normalizeOptionalString(fromBindings?.mcpResumeHash),
		reseedReceipt: normalizeCliSessionReseedReceipt(fromBindings?.reseedReceipt)
	};
	const fromMap = entry.cliSessionIds?.[normalized];
	const normalizedFromMap = normalizeOptionalString(fromMap);
	if (normalizedFromMap) return { sessionId: normalizedFromMap };
	if (normalized === CLAUDE_CLI_BACKEND_ID) {
		const legacy = normalizeOptionalString(entry.claudeCliSessionId);
		if (legacy) return { sessionId: legacy };
	}
}
/** Read just the reusable CLI session ID for a provider. */
function getCliSessionId(entry, provider) {
	return getCliSessionBinding(entry, provider)?.sessionId;
}
function clearAllCliSessions(entry) {
	entry.cliSessionBindings = void 0;
	entry.cliSessionIds = void 0;
	entry.claudeCliSessionId = void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-anchor.ts
/** Reads one active message identity from the caller's current SQLite transaction. */
function readActiveTranscriptEntryAnchorInTransaction(params) {
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.seq",
		"identity.parent_id",
		"identity.message_idempotency_key",
		"active.message_position",
		"rewrite.generation"
	]).where("identity.session_id", "=", params.resolved.sessionId).where("identity.event_id", "=", params.entryId).limit(1));
	if (row?.message_position === null || row?.message_position === void 0) return;
	const idempotencyKey = row.message_idempotency_key ?? readMessageIdempotencyKey(params.message);
	return Object.freeze({
		agentId: params.resolved.agentId,
		sessionId: params.resolved.sessionId,
		sessionKey: params.resolved.sessionKey,
		storePath: params.database.path,
		generation: row.generation,
		entryId: params.entryId,
		rawSeq: row.seq,
		effectiveParentId: row.parent_id,
		activeMessagePosition: row.message_position,
		...idempotencyKey ? { idempotencyKey } : {}
	});
}
/** Reads one active message identity from the authoritative SQLite projection. */
function readActiveTranscriptEntryAnchor(params) {
	const resolved = resolveSqliteTranscriptScope(params);
	return readActiveTranscriptEntryAnchorInTransaction({
		database: openOpenClawAgentDatabase(toDatabaseOptions(resolved)),
		resolved,
		entryId: params.entryId
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-parent.ts
/** Resolves the effective parent for a transcript message append inside the write transaction. */
function resolveTranscriptMessageAppendParent(database, sessionId, options) {
	const tailId = readActiveTranscriptAppendParentId(database, sessionId);
	if (options.parentId === void 0) return tailId;
	if (options.appendIntent !== "active-branch" || tailId === options.parentId) return options.parentId;
	const db = getSessionKysely(database.db);
	const countRow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select((expression) => expression.fn.countAll().as("count")).where("session_id", "=", sessionId));
	const maxAncestors = Number(countRow?.count ?? 0);
	let ancestorId = tailId;
	for (let depth = 0; depth <= maxAncestors; depth += 1) {
		if (ancestorId === options.parentId) return tailId;
		if (ancestorId === null) break;
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("parent_id").where("session_id", "=", sessionId).where("event_id", "=", ancestorId));
		if (!row) break;
		ancestorId = row.parent_id;
	}
	return options.parentId;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-append.ts
var TranscriptTurnAdmissionConflictError = class extends Error {
	constructor(idempotencyKey) {
		super(`Transcript idempotency key "${idempotencyKey}" conflicts with the admitted message.`);
		this.name = "TranscriptTurnAdmissionConflictError";
	}
};
function messagesMatchForIdempotentReplay(stored, candidate) {
	const serializedShape = (message) => {
		if (!isRecord(message)) return message;
		const { timestamp: _timestamp, ...stable } = message;
		const serialized = JSON.stringify(stable);
		return serialized === void 0 ? void 0 : JSON.parse(serialized);
	};
	return isDeepStrictEqual(serializedShape(stored), serializedShape(candidate));
}
function appendTranscriptMessageInTransaction(database, resolved, options) {
	const serializeForStorage = (message) => options.messageAlreadyRedacted ? message : redactTranscriptMessageForStorage(message, options);
	const readAnchor = (params) => readActiveTranscriptEntryAnchorInTransaction({
		database,
		resolved,
		entryId: params.messageId,
		message: params.message
	});
	const existingAppendResult = (found) => {
		const anchor = readAnchor(found);
		return {
			appended: false,
			...anchor ? { anchor } : {},
			effectiveParentId: readTranscriptIdentityByEventId(database, resolved.sessionId, found.messageId)?.parentId ?? null,
			message: found.message,
			messageId: found.messageId
		};
	};
	const idempotencyKey = readMessageIdempotencyKey(options.message);
	if (idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, serializeForStorage(options.message))) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	const prepared = options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(options.message) : options.message;
	if (prepared === void 0) return;
	const messageId = options.eventId ?? randomUUID();
	const now = options.now ?? Date.now();
	const finalMessage = serializeForStorage(prepared);
	ensureTranscriptHeader(database, resolved, options.cwd);
	const parentId = resolveTranscriptMessageAppendParent(database, resolved.sessionId, options);
	const appended = appendTranscriptEventInTransaction(database, resolved, {
		type: "message",
		id: messageId,
		parentId: parentId ?? null,
		timestamp: resolveTimestampMsToIsoString(now),
		message: finalMessage
	}, { dedupeByMessageIdempotency: options.idempotencyLookup !== "caller-checked" && options.idempotencyLookup !== "scan-assistant" });
	if (!appended && idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	if (!appended) {
		const existing = readTranscriptMessageByEventId(database, resolved, messageId);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey ?? `event:${messageId}`);
			return existingAppendResult(existing);
		}
	}
	if (!appended) throw new Error(`SQLite transcript append did not insert message ${messageId}.`);
	const anchor = readAnchor({
		message: finalMessage,
		messageId
	});
	return {
		appended: true,
		...anchor ? { anchor } : {},
		effectiveParentId: parentId ?? null,
		message: finalMessage,
		messageId
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-mirror.ts
const TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE = 900;
/** Returns raw events only when the transcript identity projection is not current. */
function loadTranscriptEventsForMirrorFallback(database, sessionId) {
	const db = getSessionKysely(database.db);
	const latest = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	if (!latest) return [];
	const state = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", sessionId));
	if (state && state.needs_rebuild === 0 && state.indexed_seq === latest.seq) return;
	return loadTranscriptEventsFromDatabase(database, sessionId);
}
/** Reads the bounded identity facts needed by transcript mirrors. */
function readTranscriptMirrorFacts(database, resolved, params) {
	return runSqliteDeferredTransactionSync(database.db, () => readTranscriptMirrorFactsInSnapshot(database, resolved, params), {
		databaseLabel: database.path,
		operationLabel: "session.transcript.mirror-facts"
	});
}
/** Reads mirror facts after the caller has established one SQLite snapshot. */
function readTranscriptMirrorFactsInSnapshot(database, resolved, params) {
	const idempotencyKeys = [...new Set(params.idempotencyKeys)];
	const fallbackEvents = loadTranscriptEventsForMirrorFallback(database, resolved.sessionId);
	if (fallbackEvents !== void 0) return readMirrorFactsFromEvents(fallbackEvents, new Set(idempotencyKeys));
	const db = getSessionKysely(database.db);
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	for (let offset = 0; offset < idempotencyKeys.length; offset += TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE) {
		const batch = idempotencyKeys.slice(offset, offset + TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.event_id",
			"identity.message_idempotency_key",
			"event.event_json"
		]).where("identity.session_id", "=", resolved.sessionId).where("identity.message_idempotency_key", "in", batch).orderBy("identity.seq", "asc")).rows;
		for (const row of rows) {
			const idempotencyKey = row.message_idempotency_key;
			if (!idempotencyKey) continue;
			facts.existingIdempotencyKeys.add(idempotencyKey);
			const anchor = readActiveTranscriptEntryAnchorInTransaction({
				database,
				resolved,
				entryId: row.event_id
			});
			if (anchor) facts.anchorsByIdempotencyKey.set(idempotencyKey, anchor);
			const message = readTranscriptEventMessage(JSON.parse(row.event_json));
			if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
		}
	}
	return facts;
}
/** Extracts supplied mirror identities from authoritative transcript events. */
function readMirrorFactsFromEvents(events, candidateKeys) {
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	for (const event of events) {
		const message = readTranscriptEventMessage(event);
		const idempotencyKey = readMessageIdempotencyKey(message);
		if (!idempotencyKey || !candidateKeys.has(idempotencyKey)) continue;
		facts.existingIdempotencyKeys.add(idempotencyKey);
		if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
	}
	return facts;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-sequences.ts
const committedTranscriptMessageSequences = /* @__PURE__ */ new WeakMap();
/** Reads the visible-message sequence captured from the final active branch. */
function readCommittedTranscriptMessageSequence(message) {
	return committedTranscriptMessageSequences.get(message);
}
/** Captures atomic turn cursors from the final projection before SQLite commits. */
function rememberCommittedTranscriptMessageSequencesInTransaction(database, sessionId, messages) {
	const appendedMessages = messages.filter((message) => message.appended);
	for (const message of appendedMessages) committedTranscriptMessageSequences.delete(message);
	if (appendedMessages.length === 0) return;
	const db = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select("needs_rebuild").where("session_id", "=", sessionId))?.needs_rebuild !== 0) return;
	for (const message of appendedMessages) {
		const identity = readTranscriptIdentityByEventId(database, sessionId, message.messageId);
		if (!identity) continue;
		const active = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", sessionId).where("event_seq", "=", identity.seq));
		if (active?.message_position !== null && active?.message_position !== void 0) committedTranscriptMessageSequences.set(message, active.message_position + 1);
	}
}
/** Resolves final cursors while an ordinary turn still owns its writer transaction. */
function rememberCommittedTranscriptMessageSequences(scope, messages) {
	if (messages.length === 0 || !scope.agentId || !scope.sessionId || !scope.sessionKey) return;
	const resolved = resolveSqliteTranscriptScope({
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		...scope.storePath ? { storePath: scope.storePath } : {}
	});
	rememberCommittedTranscriptMessageSequencesInTransaction(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId, messages);
}
//#endregion
//#region src/config/sessions/session-transcript-turn-state.ts
function sessionMatchesExpectedTranscriptTurn(selected, expected) {
	const expectedState = expected.expectedSessionState;
	return Boolean(selected && selected.entry.sessionId === expected.expectedSessionId && (expected.expectedLifecycleRevision === void 0 || selected.entry.lifecycleRevision === expected.expectedLifecycleRevision) && (expected.expectedWriterRunId === void 0 || selected.entry.activeWriterRunId === expected.expectedWriterRunId) && (expectedState === void 0 || selected.entry.abortedLastRun === expectedState.abortedLastRun && selected.entry.mainRestartRecovery?.cycleId === expectedState.mainRestartRecoveryCycleId && selected.entry.mainRestartRecovery?.revision === expectedState.mainRestartRecoveryRevision && selected.entry.restartRecoveryBeforeAgentReplyState === expectedState.restartRecoveryBeforeAgentReplyState && selected.entry.restartRecoveryDeliveryReceiptState === expectedState.restartRecoveryDeliveryReceiptState && selected.entry.restartRecoveryDeliveryToolCallId === expectedState.restartRecoveryDeliveryToolCallId && selected.entry.restartRecoveryDeliveryRequestFingerprint === expectedState.restartRecoveryDeliveryRequestFingerprint && selected.entry.restartRecoveryDeliveryRunId === expectedState.restartRecoveryDeliveryRunId && selected.entry.restartRecoveryDeliverySourceRunId === expectedState.restartRecoveryDeliverySourceRunId && selected.entry.restartRecoveryRequesterAccountId === expectedState.restartRecoveryRequesterAccountId && selected.entry.restartRecoveryRequesterSenderId === expectedState.restartRecoveryRequesterSenderId && selected.entry.restartRecoverySameChannelThreadRequired === expectedState.restartRecoverySameChannelThreadRequired && selected.entry.restartRecoverySourceIngress === expectedState.restartRecoverySourceIngress && selected.entry.restartRecoverySourceReplyDeliveryMode === expectedState.restartRecoverySourceReplyDeliveryMode && sameRestartRecoveryTerminalRunIds(selected.entry.restartRecoveryTerminalRunIds, expectedState.restartRecoveryTerminalRunIds) && selected.entry.status === expectedState.status));
}
function buildExpectedTranscriptTurnSessionPatch(params) {
	const appendedCount = params.appendedMessages.filter((message) => message.appended).length;
	const acceptedMessage = appendedCount > 0 || params.expectedSessionState !== void 0 && params.appendedMessages.some((message) => !message.appended);
	const touchUpdatedAt = params.touchSessionEntry === true && appendedCount > 0 ? Date.now() : 0;
	const restartRecoveryTerminalRunIds = params.sessionLifecyclePatch?.restartRecoveryTerminalRunIds ? mergeRestartRecoveryTerminalRunIds(params.currentEntry.restartRecoveryTerminalRunIds, params.sessionLifecyclePatch.restartRecoveryTerminalRunIds) : void 0;
	return {
		...acceptedMessage ? params.sessionLifecyclePatch : void 0,
		...acceptedMessage && restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds } : {},
		...touchUpdatedAt > 0 ? { updatedAt: Math.max(params.currentEntry.updatedAt ?? 0, params.sessionLifecyclePatch?.updatedAt ?? 0, touchUpdatedAt) } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-write.ts
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
async function replaceTranscriptEvents(scope, events) {
	const resolved = resolveSqliteTranscriptScope(scope);
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runSqliteSessionDeletionTransaction((database) => {
			replaceSqliteTranscriptEventsInTransaction(database, resolved, events);
		}, toDatabaseOptions(resolved));
	});
}
/** Rewrites exact transcript rows after atomically validating their generation and bytes. */
async function rewriteTranscriptEventRowsExact(scope, params) {
	if (params.rows.length === 0) return null;
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = null;
		runSqliteSessionDeletionTransaction((database) => {
			const currentGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId) ?? null;
			const initialGenerationMaterialized = params.allowInitialGenerationMaterialization === true && params.expectedGeneration === null;
			if (currentGeneration !== params.expectedGeneration && !initialGenerationMaterialized) return;
			rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, params.rows);
			const generation = readTranscriptGenerationInTransaction(database, resolved.sessionId);
			if (generation) result = { generation };
		}, toDatabaseOptions(resolved));
		return result;
	});
}
/** Fully replaces rows for one transcript synchronously for sync session runtimes. */
function replaceTranscriptEventsSync(scope, events) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let replaced = false;
	runSqliteSessionDeletionTransaction((database) => {
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!fresh || fresh.entry.sessionId !== resolved.sessionId || fencedScope.expectedLifecycleRevision !== void 0 && fresh.entry.lifecycleRevision !== fencedScope.expectedLifecycleRevision || fencedScope.expectedWriterRunId !== void 0 && fresh.entry.activeWriterRunId !== fencedScope.expectedWriterRunId) return;
		replaceSqliteTranscriptEventsInTransaction(database, resolved, events);
		replaced = true;
	}, toDatabaseOptions(resolved));
	if (fencedScope.expectedWriterRunId !== void 0 && !replaced) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return replaced;
}
async function trimTranscriptForManualCompact(scope, selectRetainedLines, options = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const snapshotRows = readTranscriptEventRows(database, resolved.sessionId);
		const sessionSnapshot = readSessionEntrySelectionSnapshot(database, resolved.sessionKey, true);
		const retainedLines = selectRetainedLines(snapshotRows.map((row) => row.eventJson));
		if (!retainedLines) return { trimmed: false };
		if (sessionSnapshot.selected?.entry.sessionId !== resolved.sessionId) throw new Error(`Cannot compact SQLite transcript ${resolved.sessionId} without its current session entry`);
		const retainedEvents = retainedLines.map((line) => JSON.parse(line));
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		runSqliteSessionDeletionTransaction((writeDatabase) => {
			assertSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotRows);
			const freshSessionSnapshot = readSessionEntrySelectionSnapshot(writeDatabase, resolved.sessionKey, true);
			assertSessionEntrySelectionUnchanged(sessionSnapshot, freshSessionSnapshot, "session.transcript.manual-compact");
			const freshEntry = freshSessionSnapshot.selected?.entry;
			if (!freshEntry || freshEntry.sessionId !== resolved.sessionId) throw new Error(`SQLite session changed before compacting ${resolved.sessionId}`);
			const identityKeys = collectSessionEntryLookupKeys(writeDatabase, resolved.sessionKey);
			previousIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
			replaceSqliteTranscriptEventsInTransaction(writeDatabase, resolved, retainedEvents);
			const nextEntry = cloneSessionEntry(freshEntry);
			delete nextEntry.contextBudgetStatus;
			delete nextEntry.inputTokens;
			delete nextEntry.outputTokens;
			delete nextEntry.totalTokens;
			delete nextEntry.totalTokensFresh;
			delete nextEntry.totalTokensVersion;
			clearAllCliSessions(nextEntry);
			nextEntry.updatedAt = options.nowMs ?? Date.now();
			writeSessionEntry(writeDatabase, resolved.sessionKey, nextEntry, { previousEntry: freshEntry });
			currentIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return {
			kept: retainedLines.length,
			trimmed: true
		};
	});
}
/** Appends one raw transcript event to the additive SQLite transcript store. */
async function appendTranscriptEvent(scope, event, options = {}) {
	assertNonMessageTranscriptEvent(event);
	const resolved = resolveSqliteTranscriptScope(scope);
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runSqliteSessionDeletionTransaction((database) => {
			options.beforeCommitInTransaction?.();
			appendTranscriptEventInTransaction(database, resolved, resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options));
		}, toDatabaseOptions(resolved));
	});
}
/** Appends one raw non-message transcript event synchronously for sync session runtimes. */
function appendTranscriptEventSync(scope, event, options = {}) {
	assertNonMessageTranscriptEvent(event);
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let result = ok(false);
	runSqliteSessionDeletionTransaction((database) => {
		options.beforeCommitInTransaction?.();
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!fresh) {
			result = err({
				code: "session-entry-missing",
				expectedSessionId: resolved.sessionId,
				sessionKey: resolved.sessionKey
			});
			return;
		}
		if (fresh.entry.sessionId !== resolved.sessionId) {
			result = err({
				actualSessionId: fresh.entry.sessionId,
				code: "session-rebound",
				expectedSessionId: resolved.sessionId,
				sessionKey: resolved.sessionKey
			});
			return;
		}
		if (fencedScope.expectedLifecycleRevision !== void 0 && fresh.entry.lifecycleRevision !== fencedScope.expectedLifecycleRevision || fencedScope.expectedWriterRunId !== void 0 && fresh.entry.activeWriterRunId !== fencedScope.expectedWriterRunId) {
			result = err({
				actualSessionId: fresh.entry.sessionId,
				code: "session-rebound",
				expectedSessionId: resolved.sessionId,
				sessionKey: resolved.sessionKey
			});
			return;
		}
		result = ok(appendTranscriptEventInTransaction(database, resolved, resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options)));
	}, toDatabaseOptions(resolved));
	if (fencedScope.expectedWriterRunId !== void 0 && !result.ok) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return result;
}
function resolveTranscriptEventAppendParent(database, sessionId, event, options) {
	if (options.appendIntent !== "active-branch" || !event || typeof event !== "object" || Array.isArray(event) || !("parentId" in event)) return event;
	const parentId = event.parentId;
	if (parentId !== null && typeof parentId !== "string") return event;
	const effectiveParentId = resolveTranscriptMessageAppendParent(database, sessionId, {
		appendIntent: "active-branch",
		parentId
	});
	return effectiveParentId === parentId ? event : {
		...event,
		parentId: effectiveParentId
	};
}
/** Appends a guarded transcript turn and touches its session row in one queued write. */
async function appendExpectedSessionTranscriptTurn(scope, options) {
	const resolved = resolveSqliteTranscriptScope({
		...scope,
		sessionId: options.expectedSessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const preparedEntry = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionKey);
		if (!sessionMatchesExpectedTranscriptTurn(preparedEntry, options)) return sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		const messages = await selectAppendableSqliteTranscriptTurnMessages({
			agentId: resolved.agentId,
			sessionId: options.expectedSessionId,
			sessionKey: resolved.sessionKey,
			...scope.storePath ? { storePath: scope.storePath } : {}
		}, options.messages);
		let result = sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		runSqliteSessionDeletionTransaction((transactionDb) => {
			const fresh = readSessionEntryRow(transactionDb, resolved.sessionKey);
			if (!sessionMatchesExpectedTranscriptTurn(fresh, options)) {
				result = sqliteSessionTranscriptTurnRebound(fresh, options.sessionFile);
				return;
			}
			const appendedMessages = [];
			for (const append of messages) {
				const { shouldAppend: _shouldAppend, ...appendOptions } = append;
				const appended = appendTranscriptMessageInTransaction(transactionDb, resolved, {
					...appendOptions,
					messageAlreadyRedacted: options.atomicGroup === true,
					...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
					...append.config ?? options.config ? { config: append.config ?? options.config } : {}
				});
				if (appended) appendedMessages.push(appended);
			}
			if (options.atomicGroup && (appendedMessages.length !== messages.length || appendedMessages.some((message) => message.appended) !== appendedMessages.every((message) => message.appended))) throw new Error("SQLite transcript batch was not wholly inserted or replayed");
			rememberCommittedTranscriptMessageSequencesInTransaction(transactionDb, resolved.sessionId, appendedMessages);
			const sessionPatch = buildExpectedTranscriptTurnSessionPatch({
				appendedMessages,
				currentEntry: fresh.entry,
				expectedSessionState: options.expectedSessionState,
				sessionFile: options.sessionFile,
				sessionLifecyclePatch: options.sessionLifecyclePatch,
				touchSessionEntry: options.touchSessionEntry
			});
			const next = Object.keys(sessionPatch).length > 0 ? mergeSessionEntry(fresh.entry, sessionPatch) : fresh.entry;
			if (next !== fresh.entry) {
				const identityKeys = collectSessionEntryLookupKeys(transactionDb, resolved.sessionKey);
				previousIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys);
				writeSessionEntry(transactionDb, resolved.sessionKey, next);
				currentIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys);
			}
			result = {
				appendedMessages,
				sessionEntry: cloneSessionEntry(next),
				sessionFile: options.sessionFile
			};
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return result;
	});
}
function sqliteSessionTranscriptTurnRebound(selected, sessionFile) {
	return {
		appendedMessages: [],
		rejectedReason: "session-rebound",
		sessionEntry: selected?.entry,
		sessionFile
	};
}
async function selectAppendableSqliteTranscriptTurnMessages(context, messages) {
	const selected = [];
	for (const append of messages) if (append.shouldAppend ? await append.shouldAppend(context) : true) selected.push(append);
	return selected;
}
async function appendTranscriptMessage(scope, options) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result;
		runSqliteSessionDeletionTransaction((database) => {
			result = appendTranscriptMessageInTransaction(database, resolved, options);
		}, toDatabaseOptions(resolved));
		return result;
	});
}
/** Appends one transcript message synchronously for sync session runtimes. */
function appendTranscriptMessageSync(scope, options) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let result;
	runSqliteSessionDeletionTransaction((database) => {
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!fresh || fresh.entry.sessionId !== resolved.sessionId || fencedScope.expectedLifecycleRevision !== void 0 && fresh.entry.lifecycleRevision !== fencedScope.expectedLifecycleRevision || fencedScope.expectedWriterRunId !== void 0 && fresh.entry.activeWriterRunId !== fencedScope.expectedWriterRunId) return;
		result = appendTranscriptMessageInTransaction(database, resolved, options);
	}, toDatabaseOptions(resolved));
	if (fencedScope.expectedWriterRunId !== void 0 && result === void 0) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return result;
}
/** Runs read/append transcript work under one SQLite writer-queue critical section. */
async function withTranscriptWriteLock(scope, run) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let transcriptSnapshot;
		return await run({
			readEvents: async () => {
				const snapshot = readTranscriptSnapshot(openOpenClawAgentDatabase(databaseOptions), resolved.sessionId);
				transcriptSnapshot = {
					kind: "current",
					rows: snapshot.rows
				};
				return snapshot.events;
			},
			readMessageFacts: async (params) => readTranscriptMirrorFacts(openOpenClawAgentDatabase(databaseOptions), resolved, params),
			replaceEvents: async (events) => {
				if (transcriptSnapshot?.kind === "stale") throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
				const expectedSnapshot = transcriptSnapshot?.rows;
				transcriptSnapshot = {
					kind: "current",
					rows: runSqliteSessionDeletionTransaction((writeDatabase) => {
						if (expectedSnapshot !== void 0) assertSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, expectedSnapshot);
						replaceSqliteTranscriptEventsInTransaction(writeDatabase, resolved, events);
						return readTranscriptEventRows(writeDatabase, resolved.sessionId);
					}, databaseOptions)
				};
			},
			appendMessage: async (options) => {
				let result;
				const snapshotState = transcriptSnapshot;
				let nextSnapshotState = snapshotState;
				runSqliteSessionDeletionTransaction((writeDatabase) => {
					const snapshotStillCurrent = snapshotState?.kind === "current" ? isSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotState.rows) : false;
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					if (snapshotState?.kind === "current") nextSnapshotState = snapshotStillCurrent ? {
						kind: "current",
						rows: readTranscriptEventRows(writeDatabase, resolved.sessionId)
					} : { kind: "stale" };
				}, databaseOptions);
				transcriptSnapshot = nextSnapshotState;
				return result;
			},
			appendMessageWithMessageSequence: async (options) => {
				let result;
				let messageSeq;
				runSqliteSessionDeletionTransaction((writeDatabase) => {
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					if (result) {
						rememberCommittedTranscriptMessageSequencesInTransaction(writeDatabase, resolved.sessionId, [result]);
						messageSeq = readCommittedTranscriptMessageSequence(result);
					}
				}, databaseOptions);
				return {
					...messageSeq !== void 0 ? { messageSeq } : {},
					result
				};
			}
		});
	});
}
/** Runs synchronous transcript work under one writer queue and SQLite transaction. */
async function withTranscriptWriteTransaction(scope, run) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => runSqliteSessionDeletionTransaction(() => run({
		agentId: resolved.agentId,
		sessionId: resolved.sessionId,
		sessionKey: resolved.sessionKey,
		storePath: resolved.path ?? scope.storePath ?? resolveOpenClawAgentSqlitePath({
			agentId: resolved.agentId,
			env: resolved.env
		})
	}), toDatabaseOptions(resolved), { operationLabel: "session.transcript.batch" }));
}
function isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	const current = readTranscriptEventRows(database, sessionId);
	return current.length === expected.length && current.every((row, index) => row.seq === expected[index]?.seq && row.eventJson === expected[index]?.eventJson);
}
function assertSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	if (!isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected)) throw new SqliteTranscriptMutationConflictError(sessionId);
}
function assertNonMessageTranscriptEvent(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	if (event.type === "message") throw new Error("appendTranscriptEvent cannot write message transcript records; use appendTranscriptMessage instead.");
}
//#endregion
//#region src/config/sessions/session-accessor.entry-mutation.ts
async function forkSessionFromParentTranscript(params) {
	return await forkSessionTranscriptFromParent(params);
}
/**
* Creates or updates one session entry and initializes its transcript header as
* one SQLite-backed lifecycle operation. Callers do not compose row creation,
* transcript initialization, rollback, and normalized session identity.
*/
async function createSessionEntryWithTranscript(scope, createEntry, options = {}) {
	const storePath = resolveAccessStorePath(scope);
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	const store = Object.fromEntries(listSessionEntriesCore({
		agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: scope.sessionKey
	});
	const created = await createEntry({
		existingEntry: resolved.existing ? { ...resolved.existing } : void 0,
		sessionEntries: cloneSessionEntries(store)
	});
	if (!created.ok) return {
		ok: false,
		error: created.error,
		phase: "entry"
	};
	try {
		await appendTranscriptEvent({
			agentId,
			sessionId: created.entry.sessionId,
			sessionKey: resolved.normalizedKey,
			storePath
		}, createSessionTranscriptHeader({
			cwd: options.cwd,
			sessionId: created.entry.sessionId
		}), options.commitGuard ? { beforeCommitInTransaction: options.commitGuard } : void 0);
	} catch (err) {
		options.commitGuard?.();
		return {
			ok: false,
			error: formatErrorMessage(err),
			phase: "transcript"
		};
	}
	const entry = created.entry;
	await applySessionEntryLifecycleMutation({
		agentId,
		storePath,
		removals: resolved.legacyKeys.map((sessionKey) => ({ sessionKey })),
		upserts: [{
			sessionKey: resolved.normalizedKey,
			entry
		}],
		skipMaintenance: true,
		...options.commitGuard ? { beforeCommitInTransaction: options.commitGuard } : {}
	});
	return {
		ok: true,
		entry,
		sessionFile: resolved.normalizedKey
	};
}
function cloneSessionEntries(store) {
	return Object.fromEntries(Object.entries(store).map(([sessionKey, entry]) => [sessionKey, { ...entry }]));
}
function collectSessionEntryKeys(...entries) {
	const keys = /* @__PURE__ */ new Set();
	for (const entry of entries) for (const key of Object.keys(entry)) keys.add(key);
	return [...keys];
}
function sessionEntryFieldEqual(left, right) {
	return Object.is(left, right) || isDeepStrictEqual(left, right);
}
function sessionEntryFieldUnset(hasValue, value) {
	return !hasValue || value === void 0;
}
function sessionEntryFieldUnchanged(params) {
	const { leftHasValue, leftValue, rightHasValue, rightValue } = params;
	if (sessionEntryFieldUnset(leftHasValue, leftValue) && sessionEntryFieldUnset(rightHasValue, rightValue)) return true;
	return leftHasValue === rightHasValue && sessionEntryFieldEqual(leftValue, rightValue);
}
function mergeConcurrentReplySessionMetadata(params) {
	const { currentEntry, preparedEntry, snapshotEntry } = params;
	if (!snapshotEntry || preparedEntry.sessionId !== snapshotEntry.sessionId) return preparedEntry;
	const merged = { ...preparedEntry };
	const mergedFields = merged;
	for (const key of collectSessionEntryKeys(currentEntry, preparedEntry, snapshotEntry)) {
		const currentHasValue = Object.hasOwn(currentEntry, key);
		const snapshotHasValue = Object.hasOwn(snapshotEntry, key);
		const preparedHasValue = Object.hasOwn(preparedEntry, key);
		const currentValue = currentEntry[key];
		const snapshotValue = snapshotEntry[key];
		const preparedValue = preparedEntry[key];
		const currentChanged = !sessionEntryFieldUnchanged({
			leftHasValue: currentHasValue,
			leftValue: currentValue,
			rightHasValue: snapshotHasValue,
			rightValue: snapshotValue
		});
		const preparedKeptSnapshot = sessionEntryFieldUnchanged({
			leftHasValue: preparedHasValue,
			leftValue: preparedValue,
			rightHasValue: snapshotHasValue,
			rightValue: snapshotValue
		});
		if (currentChanged && preparedKeptSnapshot) if (currentHasValue) mergedFields[key] = currentValue;
		else delete mergedFields[key];
	}
	return merged;
}
function createReplySessionInitializationRevision(params) {
	const { entry } = params;
	if (!entry) return JSON.stringify(null);
	return JSON.stringify({ sessionId: entry.sessionId });
}
function resolveInitializedReplySessionEntry(params) {
	return params.sessionEntry;
}
/** Updates an existing entry only; returns null when the session is absent. */
async function updateSessionEntry(scope, update, options = {}) {
	return await patchSessionEntryCore(scope, update, options);
}
/** Resolves one abort target identity without exposing the mutable store. */
function resolveSessionAbortTarget(scope) {
	const entry = loadSessionEntry(scope);
	if (!entry) return null;
	return {
		entry: { ...entry },
		sessionId: entry.sessionId,
		sessionKey: normalizeStoreSessionKey(scope.sessionKey)
	};
}
/**
* Resolves, marks, touches, and canonicalizes one abort target entry as a
* storage-sized operation. Runtime abort side effects remain with callers.
*/
async function markSessionAbortTarget(params) {
	const resolution = { target: null };
	try {
		const sessionKey = normalizeStoreSessionKey(params.scope.sessionKey);
		const updated = await patchSessionEntryCore(params.scope, (currentEntry) => {
			resolution.target = {
				entry: { ...currentEntry },
				persisted: false,
				sessionId: currentEntry.sessionId,
				sessionKey
			};
			const entry = {
				...currentEntry,
				abortedLastRun: true,
				updatedAt: params.now?.() ?? Date.now()
			};
			applySessionAbortCutoff(entry, params.resolveAbortCutoff?.({
				entry: { ...currentEntry },
				sessionKey
			}));
			return entry;
		}, {
			replaceEntry: true,
			skipMaintenance: true
		});
		return updated ? {
			entry: { ...updated },
			persisted: true,
			sessionId: updated.sessionId,
			sessionKey
		} : null;
	} catch (error) {
		const fallbackTarget = resolution.target;
		if (fallbackTarget) return {
			entry: fallbackTarget.entry,
			persisted: fallbackTarget.persisted,
			sessionId: fallbackTarget.sessionId,
			sessionKey: fallbackTarget.sessionKey,
			persistenceError: formatErrorMessage(error)
		};
		throw error;
	}
}
function applySessionAbortCutoff(entry, cutoff) {
	entry.abortCutoffMessageSid = cutoff?.messageSid;
	entry.abortCutoffTimestamp = cutoff?.timestamp;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-recovery.ts
/**
* Atomically clones a tombstoned transcript, creates its successor, and records
* the revisioned source archive/link transition in the same agent database.
*/
async function recoverSessionEntryFromRestartTombstone(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const sourceTarget = normalizeLifecycleTarget({
		...params.sourceTarget,
		storeKeys: [...params.sourceTarget.storeKeys]
	});
	const successorTarget = normalizeLifecycleTarget({
		...params.successorTarget,
		storeKeys: [...params.successorTarget.storeKeys]
	});
	const maintenancePlans = [];
	let previousIdentity = /* @__PURE__ */ new Map();
	let currentIdentity = /* @__PURE__ */ new Map();
	let result = {
		status: "conflict",
		reason: "source-changed"
	};
	const aliasKeys = [...sourceTarget.storeKeys.filter((key) => key !== sourceTarget.canonicalKey), ...successorTarget.storeKeys.filter((key) => key !== successorTarget.canonicalKey)];
	await withSqliteSessionDeletions(resolved, [...readSessionIdentitySnapshot(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), aliasKeys)].map(([sessionKey, entry]) => ({
		sessionKey,
		entry
	})), async () => await runExclusiveSqliteSessionWrite(resolved, async () => {
		runSqliteSessionDeletionTransaction((database) => {
			const source = resolveLifecyclePrimaryEntry(database, sourceTarget)?.entry;
			const recovery = source?.mainRestartRecovery;
			const tombstone = recovery?.tombstone;
			if (!source?.sessionId || !recovery || !tombstone) {
				result = {
					status: "conflict",
					reason: "not-tombstoned"
				};
				return;
			}
			const recoveredSessionKey = tombstone.recoveredSessionKey;
			const recoveredSessionId = tombstone.recoveredSessionId;
			if (recoveredSessionKey || recoveredSessionId) {
				if (!recoveredSessionKey || !recoveredSessionId) {
					result = {
						status: "conflict",
						reason: "successor-missing"
					};
					return;
				}
				const linked = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget({
					canonicalKey: recoveredSessionKey,
					storeKeys: [recoveredSessionKey]
				}))?.entry;
				if (!linked || linked.sessionId !== recoveredSessionId) {
					result = {
						status: "conflict",
						reason: "successor-missing"
					};
					return;
				}
				result = {
					status: "existing",
					sourceEntry: cloneSessionEntry(source),
					successorEntry: cloneSessionEntry(linked),
					successorKey: recoveredSessionKey
				};
				return;
			}
			if (source.sessionId !== params.expected.sessionId || source.lifecycleRevision !== params.expected.lifecycleRevision || recovery.cycleId !== params.expected.cycleId || recovery.revision !== params.expected.revision || source.pluginOwnerId !== params.expected.pluginOwnerId) {
				result = {
					status: "conflict",
					reason: "source-changed"
				};
				return;
			}
			if (resolveLifecyclePrimaryEntry(database, successorTarget)?.entry) {
				result = {
					status: "conflict",
					reason: "target-exists"
				};
				return;
			}
			const sourceEvents = loadTranscriptEventsFromDatabase(database, source.sessionId);
			const header = sourceEvents.find((event) => isRecord(event) && event.type === "session");
			if (!header) {
				result = {
					status: "conflict",
					reason: "transcript-missing"
				};
				return;
			}
			const successorSessionId = params.successorEntry.sessionId;
			const parentSession = formatLegacySqliteSessionMarkerForScope({
				...resolved,
				sessionId: source.sessionId,
				sessionKey: normalizeSqliteSessionKey(sourceTarget.canonicalKey)
			});
			appendTranscriptEventsInTransaction(database, {
				...resolved,
				sessionId: successorSessionId,
				sessionKey: normalizeSqliteSessionKey(successorTarget.canonicalKey)
			}, [{
				...createSessionTranscriptHeader({
					cwd: typeof header.cwd === "string" ? header.cwd : void 0,
					sessionId: successorSessionId
				}),
				parentSession
			}, ...sourceEvents.filter((event) => !(isRecord(event) && event.type === "session"))]);
			const now = Date.now();
			const nextSource = {
				...source,
				mainRestartRecovery: {
					...recovery,
					revision: recovery.revision + 1,
					tombstone: {
						...tombstone,
						recoveredSessionId: successorSessionId,
						recoveredSessionKey: successorTarget.canonicalKey
					}
				},
				archivedAt: source.archivedAt ?? now,
				...source.archivedBy === void 0 && params.archivedBy ? { archivedBy: params.archivedBy } : {},
				updatedAt: Math.max(now, (source.updatedAt ?? 0) + 1)
			};
			delete nextSource.pinnedAt;
			params.commitGuard?.();
			const identityKeys = [
				...sourceTarget.storeKeys,
				...successorTarget.storeKeys,
				sourceTarget.canonicalKey,
				successorTarget.canonicalKey
			];
			previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			writeSessionEntry(database, successorTarget.canonicalKey, params.successorEntry);
			writeSessionEntry(database, sourceTarget.canonicalKey, nextSource, { previousEntry: source });
			rehomeSessionWindows(database, sourceTarget.canonicalKey, sourceTarget.storeKeys);
			rehomeSessionWindows(database, successorTarget.canonicalKey, successorTarget.storeKeys);
			deleteLegacySessionEntryRows(database, sourceTarget.storeKeys, sourceTarget.canonicalKey, { rehomeMembers: true });
			deleteLegacySessionEntryRows(database, successorTarget.storeKeys, successorTarget.canonicalKey, { rehomeMembers: false });
			maintenancePlans.push(applySessionEntryMaintenance(database, {
				activeSessionKey: successorTarget.canonicalKey,
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				skipMaintenance: true,
				storePath: params.storePath
			}));
			currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			result = {
				status: "created",
				sourceEntry: cloneSessionEntry(nextSource),
				successorEntry: cloneSessionEntry(params.successorEntry),
				successorKey: successorTarget.canonicalKey
			};
		}, toDatabaseOptions(resolved));
	}));
	emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
	await finalizeSessionEntryMaintenancePlansBestEffort(resolved, maintenancePlans);
	return result;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participants.ts
function recordSessionParticipant(scope, params) {
	const actorId = params.actor.id.trim();
	if (params.actor.type !== "agent" && params.actor.type !== "human" || !actorId || params.actor.type === "agent" && actorId === params.sessionAgentId) return null;
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const promptedAt = params.promptedAt ?? Date.now();
	return runOpenClawAgentWriteTransaction((database) => {
		if (ensureSessionParticipantsSchema(database.db)) deferOpenClawAgentPostCommitPublication(database, () => confirmSessionParticipantsSchemaEnsured(database.db));
		const kysely = getSessionKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("session_participants").select([
			"actor_id",
			"actor_source",
			"contribution_count",
			"first_prompted_at",
			"last_prompted_at"
		]).where("session_key", "=", resolved.sessionKey).where("actor_type", "=", params.actor.type).where("actor_id", "=", actorId));
		if (!existing) {
			if ((executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("session_participants").select((builder) => builder.fn.countAll().as("count")).where("session_key", "=", resolved.sessionKey))?.count ?? 0) >= 32) return "capped";
		}
		const profileContribution = params.actor.type === "human" && params.source === "profile";
		const existingProfile = existing?.actor_source === "profile";
		executeSqliteQuerySync(database.db, kysely.insertInto("session_participants").values({
			session_key: resolved.sessionKey,
			actor_type: params.actor.type,
			actor_id: actorId,
			actor_source: params.source,
			contribution_count: profileContribution ? 1 : null,
			first_prompted_at: promptedAt,
			last_prompted_at: promptedAt
		}).onConflict((conflict) => conflict.columns([
			"session_key",
			"actor_type",
			"actor_id"
		]).doUpdateSet({
			actor_source: mergeSessionParticipantSource(existing?.actor_source, params.source),
			contribution_count: profileContribution ? existingProfile ? (existing.contribution_count ?? 1) + 1 : 1 : existing?.contribution_count ?? null,
			first_prompted_at: profileContribution && !existingProfile ? promptedAt : existingProfile && !profileContribution ? existing.first_prompted_at : Math.min(existing?.first_prompted_at ?? promptedAt, promptedAt),
			last_prompted_at: Math.max(existing?.last_prompted_at ?? promptedAt, promptedAt)
		})));
		publishSessionEntryCacheInvalidation(database);
		return existing ? "updated" : "inserted";
	}, options, { operationLabel: "sessions.record-participant" });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-canonical-inventory.ts
/** Doctor inventory hydrates rejected legacy blobs from promoted node/window columns. */
function hydrateCanonicalRepairEntry(row) {
	let record = {};
	try {
		const parsed = JSON.parse(row.entry_json);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) record = parsed;
	} catch {}
	const createdActor = row.created_actor_type ? {
		type: row.created_actor_type,
		...row.created_actor_id ? { id: row.created_actor_id } : {}
	} : void 0;
	const forkSource = row.fork_source_session_key && row.fork_source_session_id ? {
		sessionKey: row.fork_source_session_key,
		sessionId: row.fork_source_session_id,
		...row.fork_source_entry_id ? { entryId: row.fork_source_entry_id } : {}
	} : void 0;
	const delivery = row.delivery_channel && row.delivery_target ? normalizeSessionDeliveryState({ context: {
		channel: row.delivery_channel,
		to: row.delivery_target,
		...row.delivery_account_id ? { accountId: row.delivery_account_id } : {},
		...row.delivery_thread_id ? { threadId: row.delivery_thread_id } : {}
	} }) : void 0;
	return projectSqliteSessionOwner(projectCanonicalSessionEntryShape({
		...record,
		...row.status ? { status: row.status } : {},
		...row.current_started_at !== null ? { startedAt: row.current_started_at } : {},
		...row.current_ended_at !== null ? { endedAt: row.current_ended_at } : {},
		...row.current_chat_type ? { chatType: row.current_chat_type } : {},
		...row.current_model_provider ? { modelProvider: row.current_model_provider } : {},
		...row.current_model ? { model: row.current_model } : {},
		...row.current_previous_session_id ? { previousSessionId: row.current_previous_session_id } : {},
		...row.current_agent_harness_id ? { agentHarnessId: row.current_agent_harness_id } : {},
		...delivery ? { delivery } : {},
		...row.created_at !== null ? { createdAt: row.created_at } : {},
		...row.created_via ? { createdVia: row.created_via } : {},
		...createdActor ? { createdActor } : {},
		...row.spawned_by ? { spawnedBy: row.spawned_by } : {},
		...row.parent_session_key && row.parent_session_key !== row.spawned_by ? { parentSessionKey: row.parent_session_key } : {},
		...forkSource ? { forkSource } : {},
		...row.label ? { label: row.label } : {},
		...row.display_name ? { displayName: row.display_name } : {},
		...row.category ? { category: row.category } : {},
		...row.icon ? { icon: row.icon } : {},
		...row.pinned_at !== null ? { pinnedAt: row.pinned_at } : {},
		...row.archived_at !== null ? { archivedAt: row.archived_at } : {},
		...row.last_read_at !== null ? { lastReadAt: row.last_read_at } : {},
		...row.last_interaction_at !== null ? { lastInteractionAt: row.last_interaction_at } : {},
		...row.last_activity_at !== null ? { lastActivityAt: row.last_activity_at } : {},
		sessionId: row.current_session_id,
		updatedAt: row.updated_at
	}), row);
}
function canonicalRepairQuery(database) {
	return getSessionKysely(database.db).selectFrom("session_nodes").leftJoin("session_windows as current_window", (join) => join.onRef("current_window.session_id", "=", "session_nodes.current_session_id").onRef("current_window.session_key", "=", "session_nodes.session_key")).leftJoin("session_windows as current_window_owner", "current_window_owner.session_id", "session_nodes.current_session_id").leftJoin("conversations as current_conversation", "current_conversation.conversation_id", "current_window.primary_conversation_id").selectAll("session_nodes").select([
		"current_window_owner.session_key as current_window_owner_session_key",
		"current_window.started_at as current_started_at",
		"current_window.ended_at as current_ended_at",
		"current_window.chat_type as current_chat_type",
		"current_window.model_provider as current_model_provider",
		"current_window.model as current_model",
		"current_window.previous_session_id as current_previous_session_id",
		"current_window.agent_harness_id as current_agent_harness_id",
		"current_conversation.channel as delivery_channel",
		"current_conversation.account_id as delivery_account_id",
		"current_conversation.delivery_target",
		"current_conversation.thread_id as delivery_thread_id"
	]).orderBy("session_nodes.session_key");
}
function scanCanonicalSessionFactsFromDatabase(database, selectedKeys) {
	const scanned = [];
	const loaded = /* @__PURE__ */ new Map();
	const validSessionKeysById = /* @__PURE__ */ new Map();
	const inventoriedSessionKeys = /* @__PURE__ */ new Set();
	for (const row of iterateSqliteQuerySync(database.db, canonicalRepairQuery(database))) {
		inventoriedSessionKeys.add(row.session_key);
		const persistedEntry = parseSessionEntryJson(row);
		if (row.entry_valid === 1 && persistedEntry) {
			const keys = validSessionKeysById.get(row.current_session_id) ?? [];
			keys.push(row.session_key);
			validSessionKeysById.set(row.current_session_id, keys);
		}
		const entry = persistedEntry ?? hydrateCanonicalRepairEntry(row);
		if (selectedKeys?.has(row.session_key)) loaded.set(row.session_key, {
			entry,
			rawEntryJson: row.entry_json
		});
		const lineageProjectionMismatch = Boolean(persistedEntry && ((row.parent_session_key ?? void 0) !== (persistedEntry.parentSessionKey ?? persistedEntry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (persistedEntry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (persistedEntry.forkSource?.sessionKey ?? void 0)));
		const decision = {
			delivery: entry.delivery,
			forkSourceSessionKey: entry.forkSource?.sessionKey,
			groupId: entry.groupId,
			parentSessionKey: entry.parentSessionKey,
			rawCompareRequired: row.entry_valid !== 1 || !persistedEntry || lineageProjectionMismatch,
			sessionKey: row.session_key,
			spawnedBy: entry.spawnedBy
		};
		const context = deliveryContextFromSession(decision);
		const origin = sessionDeliveryOrigin(decision);
		scanned.push({
			currentSessionId: row.current_session_id,
			currentWindowOwnerSessionKey: row.current_window_owner_session_key,
			decision,
			entryJsonIsEmpty: row.entry_json === "{}",
			rowToken: JSON.stringify([
				row.session_key,
				row.current_session_id,
				row.entry_valid,
				persistedEntry !== null,
				row.entry_json === "{}",
				row.current_window_owner_session_key,
				context?.channel ?? null,
				context?.to ?? null,
				context?.threadId == null ? null : String(context.threadId),
				origin?.nativeChannelId ?? null,
				origin?.to ?? null,
				decision.groupId ?? null,
				decision.parentSessionKey ?? null,
				decision.spawnedBy ?? null,
				decision.forkSourceSessionKey ?? null,
				row.parent_session_key,
				row.spawned_by,
				row.fork_source_session_key,
				decision.rawCompareRequired
			])
		});
	}
	const inventoryHash = createHash("sha256");
	const facts = [];
	for (const fact of scanned) {
		const isEmptyWindowOwner = fact.entryJsonIsEmpty && fact.currentWindowOwnerSessionKey === fact.decision.sessionKey;
		const competingValidKeys = (validSessionKeysById.get(fact.currentSessionId) ?? []).filter((sessionKey) => sessionKey !== fact.decision.sessionKey).toSorted();
		const canonicalOwnerSessionKey = isEmptyWindowOwner ? competingValidKeys.length === 1 ? competingValidKeys[0] : void 0 : fact.entryJsonIsEmpty && fact.currentWindowOwnerSessionKey && inventoriedSessionKeys.has(fact.currentWindowOwnerSessionKey) ? fact.currentWindowOwnerSessionKey : void 0;
		const decisionToken = JSON.stringify([fact.rowToken, canonicalOwnerSessionKey ?? null]);
		inventoryHash.update(decisionToken).update("\0");
		if (!isEmptyWindowOwner || canonicalOwnerSessionKey) facts.push({
			...fact.decision,
			...canonicalOwnerSessionKey ? { canonicalOwnerSessionKey } : {},
			decisionToken
		});
	}
	const inventoryToken = inventoryHash.digest("base64url");
	return {
		facts: facts.map((fact) => Object.assign(fact, { inventoryToken })),
		inventoryToken,
		loaded
	};
}
function loadCanonicalRepairEntriesFromDatabase(database, facts) {
	const current = scanCanonicalSessionFactsFromDatabase(database, new Set(facts.map((fact) => fact.sessionKey)));
	const currentByKey = new Map(current.facts.map((fact) => [fact.sessionKey, fact]));
	const expectedInventoryTokens = new Set(facts.map((fact) => fact.inventoryToken));
	if (expectedInventoryTokens.size !== 1 || !expectedInventoryTokens.has(current.inventoryToken)) throw new Error("Canonical session repair inputs changed during scan; retry Doctor");
	return facts.map((fact) => {
		if (currentByKey.get(fact.sessionKey)?.decisionToken !== fact.decisionToken) throw new Error(`Canonical session repair inputs changed during scan for ${fact.sessionKey}; retry Doctor`);
		const loaded = current.loaded.get(fact.sessionKey);
		if (!loaded) throw new Error(`Canonical session repair row disappeared during scan: ${fact.sessionKey}`);
		return {
			entry: loaded.entry,
			sessionKey: fact.sessionKey,
			...fact.rawCompareRequired ? { rawEntryJson: loaded.rawEntryJson } : {}
		};
	});
}
function listCanonicalSessionRepairFacts(scope) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => scanCanonicalSessionFactsFromDatabase(database).facts, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	return result.found ? result.value : [];
}
function loadCanonicalSessionRepairEntries(scope, facts) {
	if (facts.length === 0) return [];
	const result = withOpenClawAgentDatabaseReadOnly((database) => loadCanonicalRepairEntriesFromDatabase(database, facts), toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	if (!result.found) throw new Error("Canonical session repair database disappeared during scan; retry Doctor");
	return result.value;
}
/** Strict Doctor scan of canonical rows, ordered by durable session key. */
function scanDoctorSessionEntriesStrict(scope, visit) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		let count = 0;
		scanCanonicalSqliteSessionEntries(database, ({ entry, sessionKey }) => {
			if (isInternalSessionEffectsKey(sessionKey)) return;
			visit({
				entry,
				recoveredFromProjections: false,
				sessionKey
			});
			count += 1;
		});
		return count;
	}, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	return result.found ? result.value : 0;
}
/** Tolerant Doctor preview scan with canonical-repair tombstone eligibility. */
function scanDoctorSessionEntriesTolerant(scope, visit) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const eligible = new Set(scanCanonicalSessionFactsFromDatabase(database).facts.map((fact) => fact.sessionKey));
		let count = 0;
		for (const row of iterateSqliteQuerySync(database.db, canonicalRepairQuery(database))) {
			if (!eligible.has(row.session_key) || isInternalSessionEffectsKey(row.session_key)) continue;
			const entry = parseSessionEntryJson(row);
			visit({
				entry: entry ?? hydrateCanonicalRepairEntry(row),
				recoveredFromProjections: entry === null,
				sessionKey: row.session_key
			});
			count += 1;
		}
		return count;
	}, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	return result.found ? result.value : 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-doctor-rewrite.ts
const DOCTOR_SESSION_REWRITE_BATCH_SIZE = 64;
function iterateDoctorSessionKeyBatches(sessionKeys) {
	return chunkItems(uniqueStrings(sessionKeys).toSorted(), DOCTOR_SESSION_REWRITE_BATCH_SIZE);
}
/** Rewrites bounded entry batches after rereading each authoritative row inside its commit. */
function rewriteDoctorSessionEntries(params) {
	const resolved = resolveSqliteScope({
		...params.scope,
		sessionKey: ""
	});
	let rewritten = 0;
	for (const batch of iterateDoctorSessionKeyBatches(params.sessionKeys)) rewritten += runOpenClawAgentWriteTransaction((database) => {
		const db = getSessionKysely(database.db);
		let batchRewritten = 0;
		for (const sessionKey of batch) {
			const row = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
				"session_key",
				"current_session_id",
				"entry_json",
				"updated_at"
			]).where("session_key", "=", sessionKey)).rows[0];
			if (!row) continue;
			const entry = parseSqliteSessionEntryRecord(row);
			if (!entry) continue;
			const transformedEntry = params.transform(entry, sessionKey);
			const transformedJson = JSON.stringify(transformedEntry);
			if (transformedJson === row.entry_json) continue;
			const nextEntry = stripRuntimeOnlySessionSkillsFields(transformedEntry);
			const entryJson = nextEntry === transformedEntry ? transformedJson : JSON.stringify(nextEntry);
			if (!parseSqliteSessionEntryRecord({
				...row,
				entry_json: entryJson
			})) continue;
			const writeGeneration = trackSessionEntryCacheWrite(database, () => {
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_json: entryJson }).where("session_key", "=", sessionKey));
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", sessionKey));
				if (params.updateDeliveryProjection) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({
					account_id: deliveryContextFromSession(nextEntry)?.accountId ?? null,
					channel: sessionDeliveryChannel(nextEntry) ?? null
				}).where("session_id", "=", row.current_session_id));
			});
			publishSessionEntryCacheInvalidation(database, {
				...row,
				entry_json: entryJson
			}, writeGeneration);
			batchRewritten += 1;
		}
		return batchRewritten;
	}, toDatabaseOptions(resolved), { operationLabel: "doctor.rewrite-session-entries" });
	return rewritten;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-message-cut.ts
const BRANCH_HEADLINE_MAX_CHARS = 120;
const SESSION_BRANCH_CACHE_MAX_ENTRIES = 32;
const sessionBranchCache = /* @__PURE__ */ new Map();
function sessionBranchCacheKey(databasePath, sessionId) {
	return `${databasePath}\0${sessionId}`;
}
function cloneSessionBranchSummaries(branches) {
	return branches.map((branch) => ({ ...branch }));
}
function readSessionBranchWatermark(database, sessionId) {
	const db = getSessionKysely(database.db);
	const maxSeq = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId))?.max_seq;
	return {
		generation: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId))?.generation ?? null,
		maxSeq: maxSeq ?? null
	};
}
function loadSessionBranchSummaries(database, sessionId) {
	const cacheKey = sessionBranchCacheKey(database.path, sessionId);
	const watermark = readSessionBranchWatermark(database, sessionId);
	const cached = sessionBranchCache.get(cacheKey);
	if (cached?.generation === watermark.generation && cached.maxSeq === watermark.maxSeq) {
		sessionBranchCache.delete(cacheKey);
		sessionBranchCache.set(cacheKey, cached);
		return cloneSessionBranchSummaries(cached.branches);
	}
	const branches = summarizeSessionBranches(loadTranscriptEventsFromDatabase(database, sessionId));
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, {
		...watermark,
		branches
	});
	pruneMapToMaxSize(sessionBranchCache, SESSION_BRANCH_CACHE_MAX_ENTRIES);
	return cloneSessionBranchSummaries(branches);
}
function invalidateSessionBranchCache(databasePath, sessionIds) {
	for (const sessionId of uniqueStrings(sessionIds)) sessionBranchCache.delete(sessionBranchCacheKey(databasePath, sessionId));
}
async function listSessionBranches(params) {
	const sourceKey = normalizeSqliteSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	try {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const currentEntry = readSessionEntryRow(database, sourceKey)?.entry;
		if (!currentEntry?.sessionId) return { status: "missing-session" };
		return {
			status: "ok",
			branches: loadSessionBranchSummaries(database, currentEntry.sessionId)
		};
	} catch {
		return { status: "failed" };
	}
}
/** Resolves the active branch leaf from the same transcript tree used by branch listing. */
function resolveSessionTranscriptActiveLeafEntryId(events) {
	return scanSessionTranscriptTree(events).leafId ?? void 0;
}
async function rewindSessionToMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "rewind", expectedState);
}
async function forkSessionAtMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "fork", expectedState);
}
async function switchSessionBranch(params, expectedState) {
	return await mutateSqliteSessionAtMessage({
		...params,
		entryId: params.leafEntryId
	}, "switch", expectedState);
}
async function mutateSqliteSessionAtMessage(params, mode, expectedState) {
	const canonicalSourceKey = normalizeSqliteSessionKey(params.sessionKey);
	const sourceKey = normalizeSqliteSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const targetKey = mode === "fork" ? normalizeSqliteSessionKey(params.targetKey ?? params.sessionKey) : sourceKey;
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	const preparedEntry = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), sourceKey)?.entry;
	const preparedExpectedState = expectedState ?? (preparedEntry?.sessionId ? {
		sessionId: preparedEntry.sessionId,
		lifecycleRevision: preparedEntry.lifecycleRevision
	} : void 0);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		let databasePath;
		const result = runOpenClawAgentWriteTransaction((database) => {
			databasePath = database.path;
			const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(database, sourceKey), ...collectSessionEntryLookupKeys(database, targetKey)]);
			previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			const mutationResult = mutateSqliteSessionAtMessageInTransaction(database, resolved, {
				entryId: params.entryId,
				canonicalSourceKey,
				creation: params.creation,
				mode,
				expectedState: preparedExpectedState,
				sourceKey,
				targetKey
			});
			currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			return mutationResult;
		}, toDatabaseOptions(resolved));
		if (result.status === "created" && databasePath) invalidateSessionBranchCache(databasePath, [...[...previousIdentity.values()].flatMap((entry) => entry.sessionId ? [entry.sessionId] : []), ...result.entry.sessionId ? [result.entry.sessionId] : []]);
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return result;
	});
}
function mutateSqliteSessionAtMessageInTransaction(database, resolved, params) {
	const currentEntry = readSessionEntryRow(database, params.sourceKey)?.entry;
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (!params.expectedState || currentEntry.sessionId !== params.expectedState.sessionId || currentEntry.lifecycleRevision !== params.expectedState.lifecycleRevision) return { status: "conflict" };
	const events = loadTranscriptEventsFromDatabase(database, currentEntry.sessionId);
	const cut = params.mode === "switch" ? void 0 : resolveMessageCut(events, params.entryId);
	if (cut && cut.status !== "cut") return cut;
	if (params.mode === "switch") {
		const tipStatus = validateBranchTip(events, params.entryId);
		if (tipStatus) return { status: tipStatus };
	}
	const nextSessionId = randomUUID();
	const targetScope = {
		...resolved,
		sessionId: nextSessionId,
		sessionKey: params.targetKey
	};
	const header = createSessionTranscriptHeader({
		cwd: readTranscriptHeaderCwd(events),
		sessionId: nextSessionId
	});
	const nextEvents = params.mode === "fork" && cut?.status === "cut" ? [header, ...cut.prefix] : [
		header,
		...events.filter((event) => !isSessionHeader(event)),
		{
			type: "leaf",
			id: uniqueEntryId(events),
			parentId: readLastEventId(events),
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: params.mode === "switch" ? params.entryId : cut?.parentId ?? null
		}
	];
	let copiedBytes = 0;
	const rebuildSynchronously = params.mode !== "fork" && nextEvents.length <= 4e3 && nextEvents.every((event) => {
		copiedBytes += JSON.stringify(event).length;
		return copiedBytes <= 4194304;
	});
	if (params.mode !== "fork" && !rebuildSynchronously) {
		ensureTranscriptSessionRoot(database, targetScope, Date.parse(header.timestamp));
		markSessionTranscriptIndexDirtyInTransaction(database.db, nextSessionId);
	}
	appendTranscriptEventsInTransaction(database, targetScope, nextEvents);
	if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, nextSessionId);
	const nextEntry = {
		...cloneMessageCutSessionEntry({
			currentEntry,
			forked: params.mode === "fork",
			forkSource: params.mode === "fork" ? {
				sessionKey: params.canonicalSourceKey,
				sessionId: currentEntry.sessionId,
				entryId: params.entryId
			} : void 0,
			nextSessionId
		}),
		...params.mode === "fork" && params.creation ? buildSessionCreationStamp(params.creation) : {}
	};
	writeSessionEntry(database, params.targetKey, nextEntry);
	return {
		status: "created",
		key: params.targetKey,
		entry: nextEntry,
		...cut?.status === "cut" && cut.editorText ? { editorText: cut.editorText } : {},
		...cut?.status === "cut" && cut.editorAttachments ? { editorAttachments: cut.editorAttachments } : {},
		...cut?.status === "cut" && cut.editorMediaRefs ? { editorMediaRefs: cut.editorMediaRefs } : {}
	};
}
function validateBranchTip(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	const target = tree.byId.get(entryId);
	if (!target) return "missing-entry";
	if (isSessionTranscriptLeafControl(target.entry)) return "not-branch-tip";
	if (!sessionBranchTipNodes(tree).some((node) => node.id === entryId)) return "not-branch-tip";
	return tree.leafId === entryId ? "already-active" : void 0;
}
function summarizeSessionBranches(events) {
	const tree = scanSessionTranscriptTree(events);
	return sessionBranchTipNodes(tree).toSorted((left, right) => Number(right.id === tree.leafId) - Number(left.id === tree.leafId) || right.index - left.index).map((node) => summarizeSessionBranch(tree, node.id));
}
function sessionBranchTipNodes(tree) {
	const referencedParents = new Set(tree.nodes.flatMap((node) => isSessionTranscriptLeafControl(node.entry) || node.parentId === null ? [] : [node.parentId]));
	return tree.nodes.filter((node) => !isSessionTranscriptLeafControl(node.entry) && (node.id === tree.leafId || !referencedParents.has(node.id)));
}
function summarizeSessionBranch(tree, leafEntryId) {
	const messages = selectSessionTranscriptTreePathNodes(tree, leafEntryId).flatMap((node) => {
		const record = asOptionalRecord(node.entry);
		return record?.type === "message" ? [record] : [];
	});
	const headline = messages.toReversed().map((record) => extractHeadlineText(record.message)).find((value) => value !== void 0);
	const timestamp = asOptionalRecord(tree.byId.get(leafEntryId)?.entry)?.timestamp;
	return {
		leafEntryId,
		headline: truncateBranchHeadline(headline ?? ""),
		messageCount: messages.length,
		...typeof timestamp === "string" && timestamp.trim() ? { updatedAt: timestamp } : {},
		active: tree.leafId === leafEntryId
	};
}
function extractHeadlineText(messageValue) {
	const message = asOptionalRecord(messageValue);
	if (message?.role !== "user" && message?.role !== "assistant") return;
	return (message.role === "assistant" ? extractAssistantPhaseText(message) : extractEditorText(message.content ?? message.text))?.replace(/\s+/g, " ").trim() || void 0;
}
function truncateBranchHeadline(value) {
	const characters = Array.from(value);
	return characters.length <= BRANCH_HEADLINE_MAX_CHARS ? value : `${characters.slice(0, BRANCH_HEADLINE_MAX_CHARS - 1).join("")}…`;
}
function resolveMessageCut(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	const target = tree.byId.get(entryId);
	if (!target) return { status: "missing-entry" };
	const record = asOptionalRecord(target.entry);
	const message = asOptionalRecord(record?.message);
	if (record?.type !== "message" || message?.role !== "user") return { status: "not-user-message" };
	const activePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const targetIndex = activePath.findIndex((node) => node.id === entryId);
	if (targetIndex < 0) return { status: "off-active-path" };
	const prefix = [];
	for (const node of activePath.slice(0, targetIndex)) {
		const entry = asOptionalRecord(node.entry);
		prefix.push(entry && entry.parentId !== node.parentId ? {
			...entry,
			parentId: node.parentId
		} : node.entry);
	}
	const editorAttachments = extractEditorAttachments(message.content);
	const editorMediaRefs = extractEditorMediaRefs(message);
	return {
		status: "cut",
		editorText: extractEditorText(message.content),
		...editorAttachments ? { editorAttachments } : {},
		...editorMediaRefs ? { editorMediaRefs } : {},
		parentId: target.parentId,
		prefix
	};
}
function cloneMessageCutSessionEntry(params) {
	return {
		...params.forked ? inheritSessionSelection(params.currentEntry) : params.currentEntry,
		sessionId: params.nextSessionId,
		lifecycleRevision: params.forked ? randomUUID() : params.currentEntry.lifecycleRevision,
		updatedAt: Date.now(),
		systemSent: false,
		abortedLastRun: false,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		status: void 0,
		inputTokens: void 0,
		outputTokens: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		estimatedCostUsd: void 0,
		totalTokens: void 0,
		totalTokensFresh: void 0,
		totalTokensVersion: void 0,
		contextTokens: void 0,
		contextTokensSource: void 0,
		contextBudgetStatus: void 0,
		compactionCount: void 0,
		compactionCheckpoints: void 0,
		memoryFlush: void 0,
		cliSessionBindings: void 0,
		cliSessionIds: void 0,
		claudeCliSessionId: void 0,
		agentHarnessId: void 0,
		modelSelectionLocked: void 0,
		skillsSnapshot: void 0,
		systemPromptReport: void 0,
		restartRecoveryRuns: void 0,
		restartRecoveryForceSafeTools: void 0,
		abortCutoffMessageSid: void 0,
		abortCutoffTimestamp: void 0,
		usageFamilyKey: params.forked ? void 0 : params.currentEntry.usageFamilyKey,
		usageFamilySessionIds: params.forked ? void 0 : params.currentEntry.usageFamilySessionIds,
		previousSessionId: params.forked ? void 0 : params.currentEntry.sessionId,
		...params.forkSource ? {
			forkSource: params.forkSource,
			parentSessionKey: params.forkSource.sessionKey
		} : {}
	};
}
function extractEditorText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" ? [record.text] : [];
	}).join("") || void 0;
}
const EDITOR_ATTACHMENT_LIMIT = 10;
const EDITOR_ATTACHMENT_MAX_BASE64_CHARS = Math.ceil(5 * 1024 * 1024 / 3) * 4;
function extractEditorAttachments(content) {
	if (!Array.isArray(content)) return;
	const attachments = content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "image" && typeof record.data === "string" && record.data.trim() && record.data.length <= EDITOR_ATTACHMENT_MAX_BASE64_CHARS && typeof record.mimeType === "string" && record.mimeType.startsWith("image/") ? [{
			mimeType: record.mimeType,
			data: record.data
		}] : [];
	});
	return attachments.length > 0 ? attachments.slice(0, EDITOR_ATTACHMENT_LIMIT) : void 0;
}
function extractEditorMediaRefs(message) {
	const media = asOptionalRecord(message["__openclaw"])?.media;
	if (!Array.isArray(media)) return;
	const refs = media.flatMap((entry) => {
		const record = asOptionalRecord(entry);
		const mediaPath = typeof record?.path === "string" ? record.path.trim() : "";
		const contentType = record?.contentType;
		return mediaPath && typeof contentType === "string" && contentType.startsWith("image/") ? [{
			path: mediaPath,
			contentType
		}] : [];
	});
	return refs.length > 0 ? refs : void 0;
}
function isSessionHeader(event) {
	return asOptionalRecord(event)?.type === "session";
}
function readTranscriptHeaderCwd(events) {
	const cwd = asOptionalRecord(events.find(isSessionHeader))?.cwd;
	return typeof cwd === "string" && cwd.trim() ? cwd : void 0;
}
function readLastEventId(events) {
	const id = asOptionalRecord(events.findLast((event) => !isSessionHeader(event)))?.id;
	return typeof id === "string" && id.trim() ? id : null;
}
function uniqueEntryId(events) {
	const ids = new Set(events.flatMap((event) => {
		const id = asOptionalRecord(event)?.id;
		return typeof id === "string" ? [id] : [];
	}));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.reset.ts
var SessionInitializationAgentScopeMismatchError = class extends Error {
	constructor(agentId, sessionKeyAgentId) {
		super(`Session initialization agent scope mismatch: explicit agent "${agentId}" does not match session key agent "${sessionKeyAgentId}".`);
		this.agentId = agentId;
		this.sessionKeyAgentId = sessionKeyAgentId;
		this.code = "SESSION_INITIALIZATION_AGENT_SCOPE_MISMATCH";
		this.name = "SessionInitializationAgentScopeMismatchError";
	}
};
function assertSessionInitializationAgentScope(agentId, sessionKey) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (sessionKeyAgentId && normalizeAgentId(sessionKeyAgentId) !== normalizedAgentId) throw new SessionInitializationAgentScopeMismatchError(normalizedAgentId, sessionKeyAgentId);
}
const loadSessionArchiveRuntime = createLazyRuntimeModule(() => import("./session-archive.runtime.js"));
/**
* Persists runner reset metadata after the caller appends the in-log boundary.
*/
async function persistSessionResetLifecycle(params) {
	await applySessionEntryLifecycleMutation({
		agentId: params.agentId,
		activeSessionKey: params.sessionKey,
		storePath: params.storePath,
		upserts: [{
			sessionKey: params.sessionKey,
			entry: params.nextEntry,
			resetBoundary: {
				context: "preserve-tail",
				reason: "reset"
			}
		}],
		skipMaintenance: true
	});
	return { replayedMessages: 0 };
}
/** Loads the reply-session initialization rows without exposing a mutable store. */
function loadReplySessionInitializationSnapshot(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope(params);
	const store = Object.fromEntries(listSessionEntriesReadOnly({
		agentId: params.agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	const entries = cloneSessionEntries(store);
	return {
		...currentEntry ? { currentEntry } : {},
		readEntry: (sessionKey) => {
			const entry = resolveSessionStoreEntryCore({
				store: entries,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		},
		revision: createReplySessionInitializationRevision({
			entry: currentEntry,
			storePath
		})
	};
}
function createStaleReplySessionInitializationResult(currentEntry, storePath) {
	return {
		ok: false,
		...currentEntry ? { currentEntry } : {},
		reason: "stale-snapshot",
		revision: createReplySessionInitializationRevision({
			entry: currentEntry,
			storePath
		})
	};
}
/**
* Persists one reply-session initialization result and archives the previous
* transcript after metadata commits. SQLite adapters map the guarded write to a
* transaction and keep archive failure warning-only, matching file storage.
*/
async function commitReplySessionInitialization(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const store = Object.fromEntries(listSessionEntriesCore({
		agentId: params.agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	if (createReplySessionInitializationRevision({
		entry: currentEntry,
		storePath
	}) !== params.expectedRevision) return createStaleReplySessionInitializationResult(currentEntry, storePath);
	const readEntry = (sessionKey) => {
		const entry = resolveSessionStoreEntryCore({
			store,
			sessionKey
		}).existing;
		return entry ? { ...entry } : void 0;
	};
	const preparedSessionEntry = params.prepareSessionEntry ? await params.prepareSessionEntry({
		...currentEntry ? { currentEntry } : {},
		readEntry,
		sessionEntry: params.sessionEntry
	}) : params.sessionEntry;
	const sessionEntry = resolveInitializedReplySessionEntry({
		agentId: params.agentId,
		...currentEntry ? { currentEntry } : {},
		sessionEntry: preparedSessionEntry,
		storePath
	});
	let staleCommit;
	let committedSessionEntry = sessionEntry;
	let beforeEntryMutationDone = false;
	const upserts = [{
		sessionKey: resolved.normalizedKey,
		...params.routeContext !== void 0 ? { routeContext: params.routeContext } : {},
		...params.resetBoundary ? { resetBoundary: params.resetBoundary } : {},
		buildEntry: async ({ store: currentStore }) => {
			const commitEntry = resolveSessionStoreEntryCore({
				store: currentStore,
				sessionKey: params.sessionKey
			}).existing;
			if (createReplySessionInitializationRevision({
				entry: commitEntry,
				storePath
			}) !== params.expectedRevision) {
				staleCommit = commitEntry ? { ...commitEntry } : null;
				return null;
			}
			committedSessionEntry = commitEntry ? mergeConcurrentReplySessionMetadata({
				currentEntry: commitEntry,
				preparedEntry: sessionEntry,
				snapshotEntry: params.snapshotEntry ?? params.previousEntry
			}) : sessionEntry;
			if (!beforeEntryMutationDone) {
				await params.beforeEntryMutation?.({
					...commitEntry ? { currentEntry: { ...commitEntry } } : {},
					sessionEntry: committedSessionEntry
				});
				beforeEntryMutationDone = true;
			}
			return committedSessionEntry;
		}
	}];
	if (params.retiredEntry) {
		const retiredEntry = params.retiredEntry;
		upserts.push({
			sessionKey: retiredEntry.key,
			buildEntry: () => staleCommit === void 0 ? retiredEntry.entry : null
		});
	}
	try {
		await applySessionEntryLifecycleMutation({
			activeSessionKey: params.activeSessionKey,
			agentId: params.agentId,
			maintenanceOverride: params.maintenanceConfig,
			storePath,
			upserts
		});
	} catch (error) {
		if (!(error instanceof SessionEntryLifecycleUpsertConflictError) || error.sessionKey !== resolved.normalizedKey) throw error;
		return createStaleReplySessionInitializationResult(loadSessionEntry({
			agentId: params.agentId,
			readConsistency: "latest",
			sessionKey: error.sessionKey,
			storePath
		}), storePath);
	}
	if (staleCommit !== void 0) return createStaleReplySessionInitializationResult(staleCommit ?? void 0, storePath);
	store[resolved.normalizedKey] = committedSessionEntry;
	if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
	const committed = {
		ok: true,
		previousSessionTranscript: {},
		sessionEntry: { ...committedSessionEntry },
		sessionStoreView: cloneSessionEntries(store)
	};
	const previousSessionTranscript = isIncognitoSessionKey(params.sessionKey) || params.previousEntry?.incognito === true ? {} : params.archivePreviousTranscript === false ? {} : await archivePreviousSessionTranscript({
		agentId: params.agentId,
		onArchiveError: params.onArchiveError,
		previousEntry: params.previousEntry,
		storePath: params.storePath
	});
	return {
		...committed,
		previousSessionTranscript
	};
}
async function archivePreviousSessionTranscript(params) {
	if (!params.previousEntry?.sessionId) return {};
	const { archiveSessionTranscriptsDetailed, resolveStableSessionEndTranscript } = await loadSessionArchiveRuntime();
	const archivedTranscripts = archiveSessionTranscriptsDetailed({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		reason: "reset",
		onArchiveError: params.onArchiveError
	});
	return resolveStableSessionEndTranscript({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		archivedTranscripts
	});
}
//#endregion
//#region src/config/sessions/session-transcript-projection-error.ts
var SessionTranscriptProjectionUnavailableError = class extends Error {
	constructor(sessionId) {
		super(`Session transcript projection is rebuilding: ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SessionTranscriptProjectionUnavailableError";
	}
};
function isSessionTranscriptProjectionUnavailableError(error) {
	return error instanceof SessionTranscriptProjectionUnavailableError;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-active-projection.ts
const EMPTY_PROJECTION_STATE = {
	activeEventCount: 0,
	activeMessageCount: 0,
	indexedSeq: -1,
	leafEventId: null,
	needsRebuild: false
};
function getActiveTranscriptKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function readProjectionSnapshot(database, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getActiveTranscriptKysely(database).selectFrom("transcript_events as latest").leftJoin("session_transcript_index_state as state", "state.session_id", "latest.session_id").select([
		"latest.seq as latest_seq",
		"state.active_event_count",
		"state.active_message_count",
		"state.indexed_seq",
		"state.leaf_event_id",
		"state.needs_rebuild"
	]).where("latest.session_id", "=", sessionId).orderBy("latest.seq", "desc").limit(1));
	if (!row) return;
	return {
		latestSeq: row.latest_seq,
		...typeof row.indexed_seq === "number" ? { state: {
			activeEventCount: row.active_event_count ?? 0,
			activeMessageCount: row.active_message_count ?? 0,
			indexedSeq: row.indexed_seq,
			leafEventId: row.leaf_event_id,
			needsRebuild: row.needs_rebuild !== 0
		} } : {}
	};
}
function withCurrentProjectionSnapshot(scope, read) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const database = openOpenClawAgentDatabase(databaseOptions);
	const result = runSqliteDeferredTransactionSync(database.db, () => {
		const snapshot = readProjectionSnapshot(database, resolved.sessionId);
		if (!snapshot) return {
			kind: "value",
			value: read({
				database,
				resolved,
				state: EMPTY_PROJECTION_STATE
			})
		};
		if (snapshot.state && !snapshot.state.needsRebuild && snapshot.state.indexedSeq === snapshot.latestSeq) return {
			kind: "value",
			value: read({
				database,
				resolved,
				state: snapshot.state
			})
		};
		return { kind: "unavailable" };
	}, {
		databaseLabel: database.path,
		operationLabel: "sessions.history.read"
	});
	if (result.kind === "value") return result.value;
	startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: resolved.sessionId
	});
	throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-delta.ts
const RAW_TRANSCRIPT_CURSOR_VERSION = 1;
const DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS = 1e3;
const DEFAULT_RAW_TRANSCRIPT_MAX_BYTES = 1e6;
const MAX_RAW_TRANSCRIPT_EVENTS = 1e4;
const MAX_RAW_TRANSCRIPT_BYTES = 64 * 1024 * 1024;
function normalizeRawDeltaLimit(value, fallback, maximum, name) {
	const resolved = value ?? fallback;
	if (!Number.isInteger(resolved) || resolved < 1 || resolved > maximum) throw new RangeError(`${name} must be an integer between 1 and ${String(maximum)}`);
	return resolved;
}
function encodeRawTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
/** Mint the raw-delta cursor for a generation-consistent transcript snapshot. */
function createTranscriptRawDeltaCursor(params) {
	return encodeRawTranscriptCursor({
		...params,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	});
}
function parseRawTranscriptCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== RAW_TRANSCRIPT_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastSeq) || (parsed.lastSeq ?? -2) < -1) return;
		return parsed;
	} catch {
		return;
	}
}
function bootstrapCursor(scope, generation) {
	return {
		agentId: scope.agentId,
		generation,
		lastSeq: -1,
		sessionId: scope.sessionId,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	};
}
/** Read one generation-consistent raw transcript page without parsing excluded payload rows. */
function readTranscriptRawDelta(scope, limits = {}) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const maxEvents = normalizeRawDeltaLimit(limits.maxEvents, DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS, MAX_RAW_TRANSCRIPT_EVENTS, "maxEvents");
	const maxBytes = normalizeRawDeltaLimit(limits.maxBytes, DEFAULT_RAW_TRANSCRIPT_MAX_BYTES, MAX_RAW_TRANSCRIPT_BYTES, "maxBytes");
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})?.beforeRawSeq;
		return readRawDeltaInTransaction(database.db, resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq, false);
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript raw delta"
	});
}
/** Read raw cursor progress with the active message ordinals used by session.message. */
function readTranscriptDisplayDelta(scope, limits = {}) {
	const maxEvents = normalizeRawDeltaLimit(limits.maxEvents, DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS, MAX_RAW_TRANSCRIPT_EVENTS, "maxEvents");
	const maxBytes = normalizeRawDeltaLimit(limits.maxBytes, DEFAULT_RAW_TRANSCRIPT_MAX_BYTES, MAX_RAW_TRANSCRIPT_BYTES, "maxBytes");
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		})?.beforeRawSeq;
		return readRawDeltaInTransaction(projection.database.db, projection.resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq, true);
	});
}
function readRawDeltaInTransaction(database, scope, encodedCursor, maxEvents, maxBytes, beforeEventSeq, includeMessageSequences) {
	const db = getSessionKysely(database);
	const state = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", scope.sessionId));
	if (!state) return { kind: "missing" };
	const initialCursor = bootstrapCursor(scope, state.generation);
	const reset = (reason) => ({
		kind: "reset",
		cursor: encodeRawTranscriptCursor(initialCursor),
		reason
	});
	const cursor = encodedCursor !== void 0 ? parseRawTranscriptCursor(encodedCursor) : initialCursor;
	if (!cursor) return reset("invalid_cursor");
	if (cursor.agentId !== scope.agentId || cursor.sessionId !== scope.sessionId) return reset("scope_mismatch");
	if (cursor.generation !== state.generation) return reset("generation_mismatch");
	const frontier = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_events").select("seq").where("session_id", "=", scope.sessionId).orderBy("seq", "desc").limit(1));
	const maxSeq = Math.min(frontier ? coerceSqliteNumber(frontier.seq) : -1, beforeEventSeq === void 0 ? Number.POSITIVE_INFINITY : beforeEventSeq - 1);
	if (cursor.lastSeq > maxSeq) {
		if (beforeEventSeq !== void 0) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		return reset("invalid_cursor");
	}
	const metadata = executeSqliteQuerySync(database, db.selectFrom("transcript_events").select(["seq", sql`LENGTH(CAST(event_json AS BLOB)) + 1`.as("serialized_bytes")]).where("session_id", "=", scope.sessionId).where("seq", ">", cursor.lastSeq).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).orderBy("seq", "asc").limit(maxEvents + 1)).rows.map((row) => ({
		seq: coerceSqliteNumber(row.seq),
		serializedBytes: coerceSqliteNumber(row.serialized_bytes)
	}));
	let serializedBytes = 0;
	let selectedCount = 0;
	for (const row of metadata) {
		if (selectedCount >= maxEvents || serializedBytes + row.serializedBytes > maxBytes) break;
		serializedBytes += row.serializedBytes;
		selectedCount += 1;
	}
	const lastSeq = metadata.slice(0, selectedCount).at(-1)?.seq ?? cursor.lastSeq;
	const rows = selectedCount === 0 ? [] : includeMessageSequences ? executeSqliteQuerySync(database, db.selectFrom("transcript_events as event").leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "event.session_id").onRef("active.event_seq", "=", "event.seq")).select([
		"event.event_json",
		"event.seq",
		"active.message_position"
	]).where("event.session_id", "=", scope.sessionId).where("event.seq", ">", cursor.lastSeq).where("event.seq", "<=", lastSeq).orderBy("event.seq", "asc")).rows.map((row) => {
		const eventRow = {
			event: JSON.parse(row.event_json),
			seq: coerceSqliteNumber(row.seq)
		};
		if (row.message_position !== null) eventRow.messageSeq = coerceSqliteNumber(row.message_position) + 1;
		return eventRow;
	}) : executeSqliteQuerySync(database, db.selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", scope.sessionId).where("seq", ">", cursor.lastSeq).where("seq", "<=", lastSeq).orderBy("seq", "asc")).rows.map((row) => ({
		event: JSON.parse(row.event_json),
		seq: coerceSqliteNumber(row.seq)
	}));
	const nextCursor = encodeRawTranscriptCursor({
		...cursor,
		lastSeq
	});
	const requiredBytes = selectedCount === 0 && metadata[0] ? metadata[0].serializedBytes : void 0;
	const activeLeafEntryId = includeMessageSequences ? executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_transcript_index_state").select("leaf_event_id").where("session_id", "=", scope.sessionId))?.leaf_event_id ?? null : null;
	const page = {
		kind: "page",
		cursor: nextCursor,
		events: rows,
		hasMore: selectedCount < metadata.length,
		...requiredBytes !== void 0 ? { requiredBytes } : {},
		serializedBytes
	};
	return includeMessageSequences ? {
		...page,
		activeLeafEntryId
	} : page;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-rewrite.ts
/** Rewrites one exact anchored message without rejecting unrelated later appends. */
async function rewriteTranscriptMessageAtAnchor(anchor, rewriteMessage) {
	const resolved = resolveSqliteTranscriptScope(anchor);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = null;
		runOpenClawAgentWriteTransaction((database) => {
			const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select("event_json").where("session_id", "=", resolved.sessionId).where("seq", "=", anchor.rawSeq));
			if (!row) return;
			const event = JSON.parse(row.event_json);
			if (!isRecord(event) || event.type !== "message" || event.id !== anchor.entryId) return;
			const message = rewriteMessage(event.message);
			if (message === void 0) return;
			rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, [{
				event: {
					...event,
					message
				},
				expectedEventJson: row.event_json,
				seq: anchor.rawSeq
			}]);
			const generation = readTranscriptGenerationInTransaction(database, resolved.sessionId);
			if (generation) result = {
				generation,
				message
			};
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.message-rewrite" });
		return result;
	});
}
//#endregion
//#region src/config/sessions/session-accessor.transcript.ts
/**
* Trims a transcript for manual sessions.compact and clears stale token metadata.
* This is one storage-sized mutation: future stores can trim transcript rows and
* update entry metadata inside the same backend transaction.
*/
async function preflightSessionTranscriptForManualCompact(scope, params) {
	const eventCount = readTranscriptStatsSync(scope).eventCount;
	if (eventCount === 0) return {
		compacted: false,
		reason: "no transcript"
	};
	return eventCount > Math.max(1, Math.floor(params.maxLines)) ? { compacted: true } : {
		compacted: false,
		kept: eventCount
	};
}
async function trimSessionTranscriptForManualCompact(scope, params) {
	const maxLines = Math.max(1, Math.floor(params.maxLines));
	const maxTailLines = Math.max(0, maxLines - 1);
	let declined = {
		compacted: false,
		reason: "no transcript"
	};
	const trimmed = await trimTranscriptForManualCompact(scope, (lines) => {
		if (lines.length === 0) {
			declined = {
				compacted: false,
				reason: "no transcript"
			};
			return null;
		}
		if (lines.length <= maxLines) {
			declined = {
				compacted: false,
				kept: lines.length
			};
			return null;
		}
		const tailLines = lines.slice(1);
		const retainedLines = normalizeManualCompactTranscriptLines(lines[0], maxTailLines > 0 ? tailLines.slice(-maxTailLines) : []);
		if (!retainedLines) {
			declined = {
				compacted: false,
				kept: 0
			};
			return null;
		}
		return retainedLines;
	}, params.nowMs === void 0 ? {} : { nowMs: params.nowMs });
	if (!trimmed.trimmed) return declined;
	return {
		compacted: true,
		kept: trimmed.kept
	};
}
function parseManualCompactTranscriptRecord(line) {
	return safeParseJsonRecord(line) ?? null;
}
function normalizeManualCompactTranscriptLines(headerLine, tailLines) {
	if (!headerLine) return null;
	const header = parseManualCompactTranscriptRecord(headerLine);
	if (header?.type !== "session" || typeof header.id !== "string") return null;
	const records = tailLines.map(parseManualCompactTranscriptRecord).filter((record) => record !== null);
	const retainedIds = /* @__PURE__ */ new Set();
	const transparentParents = /* @__PURE__ */ new Map();
	const normalizedRecords = [];
	for (const record of records) {
		let parentId = record.parentId;
		const seenTransparentParents = /* @__PURE__ */ new Set();
		while (typeof parentId === "string" && transparentParents.has(parentId) && !seenTransparentParents.has(parentId)) {
			seenTransparentParents.add(parentId);
			parentId = transparentParents.get(parentId) ?? null;
		}
		let next = typeof parentId === "string" && !retainedIds.has(parentId) ? {
			...record,
			parentId: null
		} : parentId !== record.parentId ? {
			...record,
			parentId
		} : record;
		if (next.type === "leaf") {
			const targetId = next.targetId;
			const validTargetId = targetId === null || typeof targetId === "string" && targetId.trim().length > 0;
			if (!validTargetId && typeof next.id === "string") transparentParents.set(next.id, next.parentId === null || typeof next.parentId === "string" ? next.parentId : null);
			if (typeof targetId === "string" && targetId.trim() && !retainedIds.has(targetId)) next = {
				...next,
				targetId: null,
				appendParentId: null
			};
			else if (validTargetId && typeof next.appendParentId === "string" && !retainedIds.has(next.appendParentId)) next = {
				...next,
				appendParentId: targetId
			};
		}
		if ((next.type === "compaction" || next.type === "reset") && typeof next.id === "string") {
			const firstKeptEntryId = next.firstKeptEntryId;
			if (typeof firstKeptEntryId === "string" && firstKeptEntryId !== next.id) {
				const branchPath = selectSessionTranscriptTreePathNodes(scanSessionTranscriptTree([...normalizedRecords, next]), next.id);
				if (!branchPath.some((node) => node.id === firstKeptEntryId)) next = {
					...next,
					firstKeptEntryId: branchPath[0]?.id ?? next.id
				};
			}
		}
		normalizedRecords.push(next);
		if (typeof next.id === "string" && next.id.trim()) retainedIds.add(next.id);
	}
	return [JSON.stringify(header), ...normalizedRecords.map((record) => JSON.stringify(record))];
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-target.ts
function resolveRuntimeContext(scope) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const configuredStorePath = resolveConcreteSessionStorePath(scope.storePath) ?? resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: scope.env
	});
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env: scope.env,
		sessionKey: scope.sessionKey,
		storePath: configuredStorePath
	});
	return {
		agentId,
		sessionKey: resolveSessionKeyBySessionId({
			agentId,
			...scope.env ? { env: scope.env } : {},
			sessionId: scope.sessionId,
			storePath
		}) ?? resolveSessionEntrySelection({
			agentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey: scope.sessionKey,
			storePath
		}, { readOnly: true })?.normalizedKey ?? scope.sessionKey,
		storePath
	};
}
/** Resolves the canonical SQLite identity for runtime transcript access. */
async function resolveSessionTranscriptRuntimeTarget(scope) {
	return {
		...resolveRuntimeContext(scope),
		sessionId: scope.sessionId
	};
}
/** Resolves the physical agent database that owns one runtime transcript. */
function resolveSessionTranscriptDatabasePath(target) {
	return resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteTranscriptScope(target)));
}
function resolveSessionTranscriptReadTarget(scope) {
	const sessionKey = scope.sessionKey?.trim();
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${sessionKey}`);
	const configuredStorePath = resolveConcreteSessionStorePath(scope.storePath) ?? resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: scope.env
	});
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env: scope.env,
		sessionKey,
		storePath: configuredStorePath
	});
	const hasMatchingSessionEntry = scope.sessionEntry?.sessionId === scope.sessionId;
	const resolved = sessionKey && !hasMatchingSessionEntry ? resolveSessionEntrySelection({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey,
		storePath
	}, { readOnly: true }) : void 0;
	const resolvedSessionKey = hasMatchingSessionEntry ? sessionKey : resolved?.normalizedKey;
	return {
		agentId,
		sessionId: scope.sessionId,
		storePath,
		...resolvedSessionKey ? { sessionKey: resolvedSessionKey } : {}
	};
}
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-turn.ts
function resolveTranscriptTurnAgentId(params) {
	if (classifySessionKeyShape(params.sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing transcript turn persistence.");
	const scopedAgentId = params.scopeAgentId?.trim() ? normalizeAgentId(params.scopeAgentId.trim()) : void 0;
	const parsedAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
	const keyAgentId = parsedAgentId ? normalizeAgentId(parsedAgentId) : void 0;
	if (scopedAgentId && keyAgentId && scopedAgentId !== keyAgentId) throw new Error(`Session key owner "${keyAgentId}" does not match requested agent "${scopedAgentId}".`);
	const persistedStoreOwner = params.sessionStore && !params.storePath ? { kind: "none" } : resolvePersistedSessionStoreOwnerForTarget({
		config: params.config,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		env: params.env
	});
	if (scopedAgentId && persistedStoreOwner.kind === "configured" && scopedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: `The shared fixed-store row belongs to agent "${persistedStoreOwner.agentId}", not agent "${scopedAgentId}".`
	});
	if (persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	const agentId = keyAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? scopedAgentId ?? tryResolveLegacyCompatibilityAgentId(params.config);
	if (agentId) return normalizeAgentId(agentId);
	throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: "Pass an agentId or use an agent-qualified session key."
	});
}
/** Appends one prepared ordered group in the existing transcript turn transaction. */
async function appendTranscriptMessages(scope, options) {
	if (options.messages.length === 0) return [];
	const expectedSessionId = scope.sessionId?.trim();
	if (!expectedSessionId) throw new Error("Cannot append a transcript batch without an exact session id");
	const turn = await persistExpectedSessionTranscriptTurn(scope, {
		atomicGroup: true,
		config: options.config,
		cwd: options.cwd,
		expectedSessionId,
		messages: options.messages.map((append) => ({
			...append,
			eventId: append.eventId ?? randomUUID(),
			message: redactTranscriptMessageForStorage(append.message, options),
			now: append.now ?? Date.now()
		})),
		updateMode: "none"
	});
	if (turn.rejectedReason) throw new Error("Transcript session changed before batch append");
	return turn.messages;
}
/**
* Persists one logical transcript turn through the SQLite-backed session target.
* Transcript row append(s) and the requested
* updatedAt touch happen before transcript update delivery is published.
*/
async function persistSessionTranscriptTurn(scope, options) {
	const expectedSessionId = options.expectedSessionId;
	if (expectedSessionId) return await persistExpectedSessionTranscriptTurn(scope, {
		...options,
		expectedSessionId
	});
	if (options.sessionLifecyclePatch) throw new Error("Cannot patch session lifecycle without an expected session id");
	const target = await resolveTranscriptTurnTarget(scope, options.config);
	if (target.entryFromPersistedStore && target.storePath && target.sessionKey && target.sessionEntry && target.sessionId) return await persistExpectedSessionTranscriptTurn({
		...scope,
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	}, {
		...options,
		expectedSessionId: target.sessionId
	});
	const appendedMessages = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendTranscriptTurnMessages(target, options));
	const appendedCount = countAppendedTranscriptMessages(appendedMessages);
	const sessionEntry = await touchTranscriptTurnSessionEntry({
		scope,
		target,
		shouldTouch: options.touchSessionEntry === true && appendedCount > 0
	});
	await publishTranscriptTurnUpdate({
		target,
		sessionEntry,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages,
		runId: options.runId
	});
	return {
		appendedCount,
		messages: appendedMessages,
		sessionEntry
	};
}
async function appendTranscriptTurnMessages(target, options) {
	const selectedMessages = await selectAppendableTranscriptTurnMessages(target, options);
	const appendedMessages = [];
	for (const append of selectedMessages) {
		const { shouldAppend: _shouldAppend, ...appendOptions } = append;
		const result = await appendTranscriptMessage({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}, {
			...appendOptions,
			message: attachSessionTranscriptRunId(appendOptions.message, options.runId),
			...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
			...append.config ?? options.config ? { config: append.config ?? options.config } : {}
		});
		if (result) appendedMessages.push(result);
	}
	rememberCommittedTranscriptMessageSequences(target, appendedMessages);
	return appendedMessages;
}
async function selectAppendableTranscriptTurnMessages(target, options) {
	const selectedMessages = [];
	for (const append of options.messages) {
		if (!(append.shouldAppend ? await append.shouldAppend({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}) : true)) continue;
		selectedMessages.push(append);
	}
	return selectedMessages;
}
function countAppendedTranscriptMessages(messages) {
	return messages.filter((message) => message.appended).length;
}
async function persistExpectedSessionTranscriptTurn(scope, options) {
	const requestedSessionKey = scope.sessionKey?.trim();
	if (!scope.storePath || !requestedSessionKey) throw new Error("Cannot guard a transcript turn without a session store and key");
	const storePath = scope.storePath;
	const expectedSessionId = options.expectedSessionId;
	const agentId = resolveTranscriptTurnAgentId({
		config: options.config ?? getRuntimeConfig(),
		scopeAgentId: scope.agentId,
		sessionKey: requestedSessionKey,
		storePath,
		sessionStore: scope.sessionStore,
		env: scope.env
	});
	const sessionKey = (await resolveSessionTranscriptRuntimeTarget({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: expectedSessionId,
		sessionKey: requestedSessionKey,
		storePath
	})).sessionKey;
	const resolved = scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey
	}) : resolveSessionEntrySelection({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey,
		storePath
	});
	const target = {
		agentId,
		sessionId: expectedSessionId,
		sessionKey: resolved.normalizedKey,
		storePath
	};
	const inheritedWriterFence = getOwnedSessionTranscriptWriterFence({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	});
	const turn = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendExpectedSessionTranscriptTurn({
		agentId,
		sessionKey: resolved.normalizedKey,
		sessionId: expectedSessionId,
		storePath
	}, {
		config: options.config,
		cwd: options.cwd,
		expectedLifecycleRevision: options.expectedLifecycleRevision ?? inheritedWriterFence?.expectedLifecycleRevision,
		expectedWriterRunId: options.expectedWriterRunId ?? inheritedWriterFence?.expectedWriterRunId,
		expectedSessionState: options.expectedSessionState,
		expectedSessionId,
		atomicGroup: options.atomicGroup,
		messages: options.messages.map((append) => ({
			...append,
			message: attachSessionTranscriptRunId(append.message, options.runId)
		})),
		sessionLifecyclePatch: options.sessionLifecyclePatch,
		sessionFile: target.sessionKey,
		touchSessionEntry: options.touchSessionEntry
	}));
	if (turn.rejectedReason === "session-rebound") return {
		appendedCount: 0,
		messages: [],
		rejectedReason: "session-rebound",
		sessionEntry: turn.sessionEntry
	};
	await publishTranscriptTurnUpdate({
		target: requestedSessionKey === target.sessionKey ? target : {
			...target,
			sessionKey: requestedSessionKey
		},
		sessionEntry: turn.sessionEntry,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages: turn.appendedMessages,
		runId: options.runId
	});
	if (turn.sessionEntry && scope.sessionStore) scope.sessionStore[resolved.normalizedKey] = turn.sessionEntry;
	return {
		appendedCount: countAppendedTranscriptMessages(turn.appendedMessages),
		messages: turn.appendedMessages,
		sessionEntry: turn.sessionEntry ?? scope.sessionEntry
	};
}
async function resolveTranscriptTurnTarget(scope, config) {
	const sessionKey = scope.sessionKey?.trim();
	if (!sessionKey || !scope.sessionId) throw new Error("Cannot persist a transcript turn without a session key and session id");
	const effectiveConfig = config ?? getRuntimeConfig();
	const agentId = resolveTranscriptTurnAgentId({
		config: effectiveConfig,
		scopeAgentId: scope.agentId,
		sessionKey,
		storePath: scope.storePath,
		sessionStore: scope.sessionStore,
		env: scope.env
	});
	const storePath = scope.storePath ?? resolveSessionStorePathCore(effectiveConfig.session?.store, {
		agentId,
		env: scope.env
	});
	const runtimeTarget = await resolveSessionTranscriptRuntimeTarget({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		sessionKey,
		storePath
	});
	const resolvedSessionKey = runtimeTarget.sessionKey;
	const resolved = scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey: resolvedSessionKey
	}) : void 0;
	const persistedEntry = loadSessionEntryReadOnly({
		...scope,
		agentId,
		sessionKey: resolvedSessionKey,
		storePath
	});
	const sessionEntry = persistedEntry ?? resolved?.existing ?? scope.sessionEntry;
	return {
		agentId,
		sessionId: scope.sessionId,
		sessionKey: runtimeTarget.sessionKey,
		storePath,
		sessionEntry,
		entryFromPersistedStore: persistedEntry != null
	};
}
async function touchTranscriptTurnSessionEntry(params) {
	if (!params.shouldTouch || !params.target.storePath || !params.target.sessionKey || !params.target.sessionId) return params.target.sessionEntry;
	const updatedAt = Date.now();
	const updated = await updateSessionEntry({
		sessionKey: params.target.sessionKey,
		storePath: params.target.storePath,
		...params.target.agentId ? { agentId: params.target.agentId } : {}
	}, (current) => current.sessionId === params.target.sessionId ? { updatedAt: Math.max(current.updatedAt ?? 0, updatedAt) } : null, { skipMaintenance: true });
	if (updated && params.scope.sessionStore) params.scope.sessionStore[params.target.sessionKey] = updated;
	return updated ?? params.target.sessionEntry;
}
async function publishTranscriptTurnUpdate(params) {
	if (params.updateMode === "none") return;
	const appendedMessages = params.appendedMessages.filter((message) => message.appended);
	if (params.publishWhen === "when-appended" && appendedMessages.length === 0) return;
	const target = params.target.agentId && params.target.sessionId && params.target.sessionKey ? {
		agentId: params.target.agentId,
		sessionId: params.target.sessionId,
		sessionKey: params.target.sessionKey,
		...params.target.storePath ? { storePath: params.target.storePath } : {}
	} : void 0;
	const update = {
		...params.target.sessionKey ? { sessionKey: params.target.sessionKey } : {},
		...params.target.agentId ? { agentId: params.target.agentId } : {},
		...target ? { target } : {},
		...params.sessionEntry?.lifecycleRevision ? { lifecycleRevision: params.sessionEntry.lifecycleRevision } : {}
	};
	if (params.updateMode !== "inline" || appendedMessages.length === 0) {
		emitSessionTranscriptUpdate(update);
		return;
	}
	const sequencedMessages = appendedMessages.map((message) => ({
		message,
		messageSeq: readCommittedTranscriptMessageSequence(message)
	}));
	if (sequencedMessages.length > 1 && sequencedMessages.some(({ messageSeq }) => messageSeq === void 0)) {
		emitSessionTranscriptUpdate(update);
		return;
	}
	for (const { message, messageSeq } of sequencedMessages) {
		const runId = resolveTerminalAssistantTranscriptRunId(message.message, params.runId);
		emitSessionTranscriptUpdate({
			...update,
			message: message.message,
			messageId: message.messageId,
			...messageSeq !== void 0 ? { messageSeq } : {},
			...runId ? { runId } : {}
		});
	}
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-range.ts
function anchorsShareTarget(boundary) {
	const { admission, terminal } = boundary;
	return admission.agentId === terminal.agentId && admission.sessionId === terminal.sessionId && admission.sessionKey === terminal.sessionKey && admission.storePath === terminal.storePath && admission.generation === terminal.generation;
}
function validateAnchorRow(anchor, row) {
	return Boolean(row && row.generation === anchor.generation && row.seq === anchor.rawSeq && row.parent_id === anchor.effectiveParentId && row.message_position === anchor.activeMessagePosition);
}
function validateTerminalAncestry(params) {
	if (params.terminalEntryId === params.admissionEntryId) return "descendant";
	const db = getSessionKysely(params.database);
	const seen = /* @__PURE__ */ new Set([params.terminalEntryId]);
	let parentId = params.terminalParentId;
	for (let depth = 0; depth < params.maxDepth; depth += 1) {
		if (parentId === params.admissionEntryId) return "descendant";
		if (parentId === null || seen.has(parentId)) return "non-descendant";
		seen.add(parentId);
		const row = executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("transcript_event_identities").select("parent_id").where("session_id", "=", params.sessionId).where("event_id", "=", parentId).limit(1));
		if (!row) return "non-descendant";
		parentId = row.parent_id;
	}
	return "too-large";
}
/** Reads one bounded accepted transcript range from a single SQLite snapshot. */
function readClosedTranscriptTurn(params) {
	if (!anchorsShareTarget(params.boundary)) return { kind: "session-rebound" };
	const target = params.boundary.admission;
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptScope({
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	})));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id"]).where("session_id", "=", target.sessionId).where("session_key", "=", target.sessionKey).limit(1))) return { kind: "session-rebound" };
		const frontier = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", target.sessionId).orderBy("seq", "desc").limit(1))?.seq;
		const projection = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", target.sessionId));
		if (frontier === void 0 || !projection || projection.needs_rebuild !== 0 || projection.indexed_seq !== frontier) return { kind: "projection-unavailable" };
		const readAnchor = (anchor) => executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.seq",
			"identity.parent_id",
			"active.message_position",
			"rewrite.generation",
			"event.event_json"
		]).where("identity.session_id", "=", target.sessionId).where("identity.event_id", "=", anchor.entryId).limit(1));
		const admissionRow = readAnchor(params.boundary.admission);
		const terminalRow = readAnchor(params.boundary.terminal);
		if (!validateAnchorRow(params.boundary.admission, admissionRow) || !validateAnchorRow(params.boundary.terminal, terminalRow)) return { kind: "stale" };
		const admissionEvent = JSON.parse(admissionRow.event_json);
		if (admissionEvent.type !== "message" || admissionEvent.message?.role !== "user") return { kind: "stale" };
		const ancestry = validateTerminalAncestry({
			database: database.db,
			sessionId: target.sessionId,
			admissionEntryId: params.boundary.admission.entryId,
			terminalEntryId: params.boundary.terminal.entryId,
			terminalParentId: terminalRow.parent_id,
			maxDepth: params.maxEvents
		});
		if (ancestry !== "descendant") return { kind: ancestry };
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select("event.event_json").where("active.session_id", "=", target.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", params.boundary.admission.activeMessagePosition).where("active.message_position", "<=", params.boundary.terminal.activeMessagePosition).orderBy("active.message_position", "asc").limit(params.maxEvents + 1)).rows;
		if (rows.length > params.maxEvents || rows.reduce((total, row) => total + Buffer$1.byteLength(row.event_json, "utf8"), 0) > params.maxBytes) return { kind: "too-large" };
		return {
			kind: "ok",
			messages: rows.flatMap((row) => {
				const event = JSON.parse(row.event_json);
				return event.type === "message" && event.message ? [event.message] : [];
			})
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript accepted turn read"
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reset-window.ts
function isWindowBoundary(eventType, scope) {
	return eventType === "reset" || scope === "context" && eventType === "compaction";
}
const resetMessageWindowCache = /* @__PURE__ */ new Map();
const MAX_RESET_MESSAGE_WINDOW_CACHE = 64;
function getResetWindowKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function parseMessageEventRow$1(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(row.event_json),
		seq: row.message_position + 1
	};
}
function readMessageRange(projection, start, endExclusive) {
	if (endExclusive <= start) return [];
	const db = getResetWindowKysely(projection.database);
	return executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", start).where("active.message_position", "<", endExclusive).orderBy("active.message_position", "asc")).rows.map(parseMessageEventRow$1);
}
function resetMessageWindowCacheKey(projection) {
	return `${projection.database.path}\0${projection.resolved.sessionId}`;
}
function readTranscriptProjectionGeneration(projection) {
	return executeSqliteQueryTakeFirstSync(projection.database.db, getResetWindowKysely(projection.database).selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", projection.resolved.sessionId))?.generation;
}
function cacheResetMessageWindow(key, entry) {
	resetMessageWindowCache.delete(key);
	resetMessageWindowCache.set(key, entry);
	pruneMapToMaxSize(resetMessageWindowCache, MAX_RESET_MESSAGE_WINDOW_CACHE);
}
function readLatestActiveBoundaryMetadataByType(projection, eventType) {
	const db = getResetWindowKysely(projection.database);
	return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select([
		"active.active_position",
		"identity.event_type",
		"identity.seq"
	]).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "=", eventType).orderBy("identity.seq", "desc").limit(1));
}
function readLatestActiveBoundaryMetadata(projection) {
	const reset = readLatestActiveBoundaryMetadataByType(projection, "reset");
	const compaction = readLatestActiveBoundaryMetadataByType(projection, "compaction");
	if (!reset) return compaction;
	if (!compaction) return reset;
	return reset.seq > compaction.seq ? reset : compaction;
}
function readBoundaryPayload(projection, seq, scope) {
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, getResetWindowKysely(projection.database).selectFrom("transcript_events").select("event_json").where("session_id", "=", projection.resolved.sessionId).where("seq", "=", seq).limit(1));
	if (!row) throw new Error("Active transcript boundary is missing");
	const parsed = JSON.parse(row.event_json);
	if (!isWindowBoundary(parsed.type, scope)) throw new Error("Active transcript boundary has invalid payload");
	return {
		event: parsed,
		sizeBytes: Buffer.byteLength(row.event_json, "utf8") + 1
	};
}
function findLatestResetMessageWindow(projection, generation, scope) {
	const db = getResetWindowKysely(projection.database);
	const latestBoundary = readLatestActiveBoundaryMetadata(projection);
	if (!latestBoundary || !isWindowBoundary(latestBoundary.event_type, scope)) return null;
	const boundaryPayload = readBoundaryPayload(projection, latestBoundary.seq, scope);
	const boundary = boundaryPayload.event;
	const postBoundaryMessagePosition = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("active_position", ">", latestBoundary.active_position).where("message_position", "is not", null).orderBy("active_position", "asc").limit(1))?.message_position ?? projection.state.activeMessageCount;
	let keptMessagePositions = [];
	const includesBoundary = latestBoundary.event_type === "compaction";
	let contextPrefixEventCount = includesBoundary ? 1 : 0;
	let contextPrefixSizeBytes = includesBoundary ? boundaryPayload.sizeBytes : 0;
	if (typeof boundary.firstKeptEntryId === "string") {
		const firstKept = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.active_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", boundary.firstKeptEntryId));
		if (firstKept && firstKept.active_position < latestBoundary.active_position) {
			const candidates = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", ">=", firstKept.active_position).where("active.active_position", "<", latestBoundary.active_position).where("active.message_position", "is not", null).orderBy("active.active_position", "asc")).rows.flatMap((row) => {
				try {
					return [{
						...row,
						event: JSON.parse(row.event_json)
					}];
				} catch {
					return [];
				}
			});
			const candidateEntries = candidates.map((row) => row.event);
			const keptEntries = new Set(latestBoundary.event_type === "reset" ? selectResetKeptEntries(candidateEntries) : candidateEntries);
			const keptRows = candidates.filter((row) => keptEntries.has(row.event));
			contextPrefixEventCount += keptRows.length;
			contextPrefixSizeBytes += keptRows.reduce((total, row) => total + Buffer.byteLength(row.event_json, "utf8") + 1, 0);
			keptMessagePositions = keptRows.flatMap((row) => {
				if (row.message_position === null || row.event.type !== "message") return [];
				const role = row.event.message.role;
				return role === "user" || role === "assistant" ? [row.message_position] : [];
			});
		}
	}
	return {
		boundarySeq: latestBoundary.seq,
		generation,
		indexedSeq: projection.state.indexedSeq,
		contextPrefixEventCount,
		keptMessagePositions,
		contextPrefixSizeBytes,
		postBoundaryMessagePosition,
		boundaryActivePosition: latestBoundary.active_position
	};
}
function resolveResetMessageWindow(projection, scope = "history") {
	const key = `${resetMessageWindowCacheKey(projection)}\0${scope}`;
	const cached = resetMessageWindowCache.get(key);
	const generation = readTranscriptProjectionGeneration(projection);
	if (cached) {
		if (cached.generation === generation && cached.indexedSeq === projection.state.indexedSeq) return cached.window;
		if (cached.generation === generation && cached.window) {
			const latestBoundary = readLatestActiveBoundaryMetadata(projection);
			if (latestBoundary && isWindowBoundary(latestBoundary.event_type, scope) && latestBoundary.seq === cached.window.boundarySeq) {
				const window = {
					...cached.window,
					indexedSeq: projection.state.indexedSeq
				};
				cacheResetMessageWindow(key, {
					generation,
					indexedSeq: window.indexedSeq,
					window
				});
				return window;
			}
		}
	}
	const window = findLatestResetMessageWindow(projection, generation, scope);
	cacheResetMessageWindow(key, {
		generation,
		indexedSeq: projection.state.indexedSeq,
		window
	});
	return window;
}
function resolveVisibleMessagePositions(projection) {
	const window = resolveResetMessageWindow(projection);
	if (!window) return {
		kept: [],
		postStart: 0,
		total: projection.state.activeMessageCount
	};
	return {
		kept: window.keptMessagePositions,
		postStart: window.postBoundaryMessagePosition,
		total: window.keptMessagePositions.length + Math.max(0, projection.state.activeMessageCount - window.postBoundaryMessagePosition)
	};
}
function readVisibleMessageRange(projection, start, endExclusive) {
	if (endExclusive <= start) return [];
	const visible = resolveVisibleMessagePositions(projection);
	const boundedStart = Math.min(Math.max(0, start), visible.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), visible.total);
	if (boundedEnd <= boundedStart) return [];
	const keptEnd = Math.min(boundedEnd, visible.kept.length);
	const keptEvents = visible.kept.slice(boundedStart, keptEnd).flatMap((position) => readMessageRange(projection, position, position + 1));
	const postVisibleStart = Math.max(boundedStart, visible.kept.length);
	const postVisibleEnd = Math.max(postVisibleStart, boundedEnd);
	const postEvents = readMessageRange(projection, visible.postStart + postVisibleStart - visible.kept.length, visible.postStart + postVisibleEnd - visible.kept.length);
	return [...keptEvents, ...postEvents];
}
/** Maps a logical visible-message range to its materialized message positions. */
function resolveVisibleMessagePositionRange(projection, start, endExclusive) {
	if (endExclusive <= start) return [];
	const visible = resolveVisibleMessagePositions(projection);
	const boundedStart = Math.min(Math.max(0, start), visible.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), visible.total);
	const keptEnd = Math.min(boundedEnd, visible.kept.length);
	const positions = visible.kept.slice(boundedStart, keptEnd);
	const postVisibleStart = Math.max(boundedStart, visible.kept.length);
	const postVisibleEnd = Math.max(postVisibleStart, boundedEnd);
	for (let logical = postVisibleStart; logical < postVisibleEnd; logical += 1) positions.push(visible.postStart + logical - visible.kept.length);
	return positions;
}
/** Reads logical transcript bytes, reusing cached retained-tail facts after resets. */
function readVisibleTranscriptStats(projection) {
	const window = resolveResetMessageWindow(projection, "context");
	const base = getResetWindowKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select((eb) => [eb.fn.count("active.event_seq").as("event_count"), sql`COALESCE(SUM(LENGTH(CAST(event.event_json AS BLOB))), 0)
        + COUNT(*)`.as("size_bytes")]).where("active.session_id", "=", projection.resolved.sessionId);
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, window ? base.where("active.active_position", ">", window.boundaryActivePosition) : base);
	return {
		eventCount: (row?.event_count ?? 0) + (window?.contextPrefixEventCount ?? 0),
		sizeBytes: (row?.size_bytes ?? 0) + (window?.contextPrefixSizeBytes ?? 0)
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-visible-cursor.ts
const VISIBLE_MESSAGE_CURSOR_VERSION = 1;
const DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES = 1e3;
const DEFAULT_VISIBLE_MESSAGE_MAX_BYTES = 1e6;
const MAX_VISIBLE_MESSAGE_MAX_MESSAGES = 1e4;
const MAX_VISIBLE_MESSAGE_MAX_BYTES = 64 * 1024 * 1024;
function normalizeVisibleMessageLimit(value, fallback, maximum, name) {
	const resolved = value ?? fallback;
	if (!Number.isInteger(resolved) || resolved < 1 || resolved > maximum) throw new RangeError(`${name} must be an integer between 1 and ${String(maximum)}`);
	return resolved;
}
function encodeVisibleMessageCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function createVisibleMessageCursor(params) {
	return {
		...params,
		lastEventSeq: -1,
		lastMessagePosition: -1,
		version: VISIBLE_MESSAGE_CURSOR_VERSION
	};
}
function parseVisibleMessageCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== VISIBLE_MESSAGE_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastEventSeq) || (parsed.lastEventSeq ?? -2) < -1 || !Number.isSafeInteger(parsed.lastMessagePosition) || (parsed.lastMessagePosition ?? -2) < -1 || parsed.lastEventSeq === -1 !== (parsed.lastMessagePosition === -1)) return;
		return parsed;
	} catch {
		return;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-active-events.ts
function parseMessageEventRow(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(row.event_json),
		seq: row.message_position + 1
	};
}
/** Reads every message event on the active path. Full callers remain intentionally O(output). */
function readSessionTranscriptMessageEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		return readVisibleMessageRange(projection, 0, resolveVisibleMessagePositions(projection).total);
	});
}
/** Classifies one entry against the authoritative active path and leaf. */
function readSessionTranscriptActivePathEntryRelation(scope, entryId) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		if (projection.state.leafEventId === entryId || entryId === null) return projection.state.leafEventId === entryId ? "exact" : "off-path";
		const db = getActiveTranscriptKysely(projection.database);
		return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("identity.seq").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", entryId).limit(1)) ? "ancestor" : "off-path";
	});
}
/** Reads a bounded tail from the materialized active path, including control events. */
function readRecentSessionTranscriptActiveEvents(scope, maxEvents) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const limit = Math.max(0, Math.floor(Number.isFinite(maxEvents) ? maxEvents : 0));
		if (limit === 0) return [];
		const db = getActiveTranscriptKysely(projection.database);
		return executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select("event.event_json").where("active.session_id", "=", projection.resolved.sessionId).orderBy("active.active_position", "desc").limit(limit)).rows.toReversed().map((row) => JSON.parse(row.event_json));
	});
}
/** Reads one byte-bounded active branch without materializing abandoned transcript history. */
function readSessionTranscriptBoundedActiveContextCore(scope, options) {
	const maxBytes = normalizeVisibleMessageLimit(options.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	const maxEvents = normalizeVisibleMessageLimit(options.maxEvents, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxEvents");
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const header = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_events").select("event_json").where("session_id", "=", projection.resolved.sessionId).where(sql`json_extract(event_json, '$.type')`, "=", "session").orderBy("seq", "asc").limit(1));
		const headerBytes = header ? Buffer.byteLength(header.event_json, "utf8") + 1 : 0;
		if (headerBytes > maxBytes) throw new RangeError("Session transcript header exceeds the active-context byte limit");
		const metadata = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
			"active.active_position",
			"active.event_seq",
			sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")
		]).where("active.session_id", "=", projection.resolved.sessionId).$if(fence !== void 0, (query) => query.where("active.event_seq", "<", fence.beforeRawSeq)).orderBy("active.active_position", "desc").limit(maxEvents + 1)).rows;
		const selectedSequences = [];
		let serializedBytes = headerBytes;
		for (const row of metadata) {
			if (selectedSequences.length >= maxEvents || serializedBytes + row.serialized_bytes > maxBytes) break;
			selectedSequences.push(row.event_seq);
			serializedBytes += row.serialized_bytes;
		}
		const selectedRows = selectedSequences.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", projection.resolved.sessionId).where("seq", "in", selectedSequences).orderBy("seq", "asc")).rows;
		const boundary = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select(["event.event_json", "identity.seq"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "in", ["compaction", "reset"]).$if(fence !== void 0, (query) => query.where("identity.seq", "<", fence.beforeRawSeq)).orderBy("active.active_position", "desc").limit(1));
		const boundaryCount = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select((eb) => eb.fn.count("identity.seq").as("boundary_count")).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "in", ["compaction", "reset"]).$if(fence !== void 0, (query) => query.where("identity.seq", "<", fence.beforeRawSeq)))?.boundary_count;
		const events = header ? [JSON.parse(header.event_json)] : [];
		let injectedBoundary;
		let boundaryOmitted = false;
		if (boundary && !selectedSequences.includes(boundary.seq)) {
			const boundaryBytes = Buffer.byteLength(boundary.event_json, "utf8") + 1;
			if (serializedBytes + boundaryBytes <= maxBytes) {
				const event = JSON.parse(boundary.event_json);
				events.push(event);
				if (event !== null && typeof event === "object" && "id" in event) injectedBoundary = event;
				serializedBytes += boundaryBytes;
			} else boundaryOmitted = true;
		}
		for (const [index, row] of selectedRows.entries()) {
			const event = JSON.parse(row.event_json);
			if (index === 0 && typeof injectedBoundary?.id === "string" && event !== null && typeof event === "object" && "parentId" in event && event.parentId !== injectedBoundary.id) Object.assign(event, { parentId: injectedBoundary.id });
			events.push(event);
		}
		return {
			activeLeafEntryId: projection.state.leafEventId,
			boundaryCount: boundaryCount ?? 0,
			events,
			serializedBytes,
			totalEvents: projection.state.activeEventCount,
			truncated: boundaryOmitted || metadata.length > selectedSequences.length
		};
	});
}
/** Reads logical transcript event count and JSONL byte size. */
function readSessionTranscriptActiveStats(scope) {
	return withCurrentProjectionSnapshot(scope, readVisibleTranscriptStats);
}
/** Reads one append-stable forward page from the materialized active-message projection. */
function readSessionTranscriptVisibleMessageDeltaCore(scope, limits = {}) {
	const maxMessages = normalizeVisibleMessageLimit(limits.maxMessages, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxMessages");
	const maxBytes = normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const transcriptFence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const generation = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", projection.resolved.sessionId))?.generation;
		if (!generation) return { kind: "missing" };
		const initialCursor = createVisibleMessageCursor({
			agentId: projection.resolved.agentId,
			generation,
			sessionId: projection.resolved.sessionId
		});
		const reset = (reason) => ({
			kind: "reset",
			cursor: encodeVisibleMessageCursor(initialCursor),
			reason
		});
		const cursor = limits.cursor !== void 0 ? parseVisibleMessageCursor(limits.cursor) : initialCursor;
		if (!cursor) return reset("invalid_cursor");
		if (cursor.agentId !== projection.resolved.agentId || cursor.sessionId !== projection.resolved.sessionId) return reset("scope_mismatch");
		if (cursor.generation !== generation) return reset("generation_mismatch");
		if (transcriptFence !== void 0 && cursor.lastMessagePosition >= transcriptFence.beforeActiveMessagePosition) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		let startPosition = 0;
		if (cursor.lastEventSeq >= 0) {
			const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("event_seq", "=", cursor.lastEventSeq).where("message_position", "is not", null));
			if (anchor?.message_position === null || anchor?.message_position === void 0) return reset("anchor_missing");
			if (anchor.message_position !== cursor.lastMessagePosition) return reset("anchor_moved");
			startPosition = anchor.message_position + 1;
		}
		const metadata = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
			"active.event_seq",
			"active.message_position",
			sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")
		]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", startPosition).$if(transcriptFence !== void 0, (query) => query.where("active.message_position", "<", transcriptFence.beforeActiveMessagePosition)).orderBy("active.message_position", "asc").limit(maxMessages + 1)).rows;
		let serializedBytes = 0;
		let selectedCount = 0;
		for (const row of metadata) {
			if (selectedCount >= maxMessages || serializedBytes + row.serialized_bytes > maxBytes) break;
			serializedBytes += row.serialized_bytes;
			selectedCount += 1;
		}
		const selected = metadata.slice(0, selectedCount);
		const lastEventSeq = selected.at(-1)?.event_seq ?? cursor.lastEventSeq;
		const lastMessagePosition = selected.at(-1)?.message_position ?? cursor.lastMessagePosition;
		const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).leftJoin("session_transcript_active_events as parent_active", (join) => join.onRef("parent_active.session_id", "=", "active.session_id").on((eb) => eb("parent_active.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_event_identities as parent_identity", (join) => join.onRef("parent_identity.session_id", "=", "parent_active.session_id").onRef("parent_identity.seq", "=", "parent_active.event_seq")).select([
			"active.event_seq",
			"active.message_position",
			"event.event_json",
			"parent_identity.event_id as parent_id"
		]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", ">=", startPosition).where("active.message_position", "<=", lastMessagePosition).orderBy("active.message_position", "asc")).rows.map((row) => {
			if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
			return {
				event: JSON.parse(row.event_json),
				eventSeq: row.event_seq,
				parentId: row.parent_id,
				seq: row.message_position + 1
			};
		});
		const requiredBytes = selectedCount === 0 && metadata[0] ? metadata[0].serialized_bytes : void 0;
		return {
			kind: "page",
			cursor: encodeVisibleMessageCursor({
				...cursor,
				lastEventSeq,
				lastMessagePosition
			}),
			events: rows,
			hasMore: selectedCount < metadata.length,
			...requiredBytes !== void 0 ? { requiredBytes } : {},
			serializedBytes
		};
	});
}
/** Reads a bounded active-path tail while preserving transcript line and byte caps. */
function readRecentSessionTranscriptMessageEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxLines = Math.max(0, Math.floor(Number.isFinite(options.maxLines) ? options.maxLines : 0));
		if (maxMessages === 0 || maxLines === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			totalMessages: visible.total
		};
		const maxBytes = Math.max(1024, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 8 * 1024 * 1024));
		const candidates = readVisibleMessageRange(projection, Math.max(0, visible.total - maxLines), visible.total);
		const selected = [];
		let bytes = 0;
		for (const event of candidates.toReversed()) {
			const eventBytes = Buffer.byteLength(JSON.stringify(event.event)) + 1;
			if (selected.length >= maxMessages || selected.length > 0 && bytes + eventBytes > maxBytes) break;
			selected.push(event);
			bytes += eventBytes;
		}
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: selected.toReversed(),
			totalMessages: visible.total
		};
	});
}
/** Reads one tail-relative message page with index range predicates, never OFFSET scanning. */
function readSessionTranscriptMessageEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const totalMessages = resolveVisibleMessagePositions(projection).total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0));
		const endExclusive = Math.max(0, totalMessages - offset);
		const start = Math.max(0, endExclusive - maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleMessageRange(projection, start, endExclusive),
			totalMessages
		};
	});
}
/** Reads a tail page whose materialized event payloads fit a hard byte budget. */
function readSessionTranscriptBoundedMessageTailPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const snapshot = {
			generation: readTranscriptProjectionGeneration(projection),
			indexedSeq: projection.state.indexedSeq
		};
		const totalMessages = visible.total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxBytes = Math.max(0, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 0));
		const endExclusive = Math.max(0, totalMessages - offset);
		const positions = resolveVisibleMessagePositionRange(projection, Math.max(0, endExclusive - maxMessages), endExclusive);
		if (positions.length === 0 || maxBytes === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			scannedMessages: positions.length,
			serializedBytes: 0,
			snapshot,
			totalMessages
		};
		const db = getActiveTranscriptKysely(projection.database);
		const metadata = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "in", positions).orderBy("active.message_position", "desc")).rows;
		const selectedPositions = [];
		let serializedBytes = 0;
		for (const row of metadata) {
			if (row.message_position === null || serializedBytes + row.serialized_bytes > maxBytes) continue;
			selectedPositions.push(row.message_position);
			serializedBytes += row.serialized_bytes;
		}
		const events = selectedPositions.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "in", selectedPositions).orderBy("active.message_position", "asc")).rows.map(parseMessageEventRow);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events,
			scannedMessages: positions.length,
			serializedBytes,
			snapshot,
			totalMessages
		};
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-title-probes.ts
const SESSION_TITLE_PROBE_MESSAGES = 20;
function getTitleProbeKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function parseEventType(eventJson) {
	if (!eventJson) return;
	try {
		const event = JSON.parse(eventJson);
		return typeof event.type === "string" ? event.type : void 0;
	} catch {
		return;
	}
}
function sqliteTranscriptBoundaryEventType() {
	return sql`json_extract(boundary_event.event_json, '$.type')`;
}
function readTitleProbeChunk(database, sessionIds) {
	const db = getTitleProbeKysely(database);
	const rows = runSqliteDeferredTransactionSync(database.db, () => executeSqliteQuerySync(database.db, db.selectFrom("session_windows as window").leftJoin("session_transcript_index_state as state", "state.session_id", "window.session_id").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "window.session_id").leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "window.session_id").on("active.message_position", "is not", null).on((eb) => eb.or([eb("active.message_position", "<", SESSION_TITLE_PROBE_MESSAGES), eb("active.message_position", ">=", eb("state.active_message_count", "-", SESSION_TITLE_PROBE_MESSAGES))]))).leftJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select((eb) => [
		"window.session_id",
		"state.active_message_count",
		"state.indexed_seq",
		"state.needs_rebuild",
		"rewrite.generation",
		"active.message_position",
		"event.event_json",
		eb.selectFrom("transcript_events as latest").select("latest.seq").whereRef("latest.session_id", "=", "window.session_id").orderBy("latest.seq", "desc").limit(1).as("latest_seq"),
		eb.selectFrom("session_transcript_active_events as boundary").innerJoin("transcript_events as boundary_event", (join) => join.onRef("boundary_event.session_id", "=", "boundary.session_id").onRef("boundary_event.seq", "=", "boundary.event_seq")).select("boundary_event.event_json").whereRef("boundary.session_id", "=", "window.session_id").where("boundary.message_position", "is", null).where(sqliteTranscriptBoundaryEventType(), "in", ["reset", "compaction"]).orderBy("boundary.active_position", "desc").limit(1).as("latest_boundary_json")
	]).where("window.session_id", "in", sessionIds).orderBy("window.session_id", "asc").orderBy("active.message_position", "asc")).rows, {
		databaseLabel: database.path,
		operationLabel: "sessions.list.title-probes"
	});
	const probes = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const emptyTranscript = row.latest_seq === null;
		const projectionCurrent = row.needs_rebuild === 0 && row.indexed_seq === row.latest_seq;
		if (!emptyTranscript && !projectionCurrent || parseEventType(row.latest_boundary_json) === "reset") continue;
		const totalMessages = row.active_message_count ?? 0;
		const probe = probes.get(row.session_id) ?? {
			generation: row.generation ?? null,
			head: [],
			maxSeq: row.latest_seq ?? null,
			tail: [],
			totalMessages
		};
		if (row.event_json !== null && row.message_position !== null) {
			const event = {
				event: JSON.parse(row.event_json),
				seq: row.message_position + 1
			};
			if (row.message_position < SESSION_TITLE_PROBE_MESSAGES) probe.head.push(event);
			if (row.message_position >= totalMessages - SESSION_TITLE_PROBE_MESSAGES) probe.tail.push(event);
		}
		probes.set(row.session_id, probe);
	}
	return probes;
}
/** Reads bounded title probes in one statement per opened store (chunked for SQLite limits). */
function readSessionTranscriptTitleProbeBatch(scopes) {
	return readSqliteTranscriptStoreBatches(scopes, readTitleProbeChunk);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark.ts
/** Reads the append and rewrite tokens that validate transcript-derived caches. */
function readSessionTranscriptWatermark(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getNodeSqliteKysely(database.db);
		const maxSeq = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", resolved.sessionId))?.max_seq;
		return {
			generation: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", resolved.sessionId))?.generation ?? null,
			maxSeq: maxSeq ?? null
		};
	}, toDatabaseOptions(resolved), { throwOnMissingTable: true });
	return result.found ? result.value : {
		generation: null,
		maxSeq: null
	};
}
function readSessionTranscriptWatermarkChunk(database, sessionIds) {
	const db = getNodeSqliteKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows as window").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "window.session_id").select((eb) => [
		"window.session_id",
		"rewrite.generation",
		eb.selectFrom("transcript_events as event").select((inner) => inner.fn.max("event.seq").as("max_seq")).whereRef("event.session_id", "=", "window.session_id").as("max_seq")
	]).where("window.session_id", "in", sessionIds)).rows;
	return new Map(rows.map((row) => [row.session_id, {
		generation: row.generation ?? null,
		maxSeq: row.max_seq ?? null
	}]));
}
/** Reads cache-validation tokens in one statement per opened store and SQLite-sized chunk. */
function readSessionTranscriptWatermarkBatch(scopes) {
	return readSqliteTranscriptStoreBatches(scopes, readSessionTranscriptWatermarkChunk).map((result) => result ?? {
		generation: null,
		maxSeq: null
	});
}
//#endregion
export { forkSessionFromParentTranscript as $, readTranscriptRawDelta as A, applySessionEntryReplacements as At, listSessionBranches as B, resolveSessionEntryCandidateTarget as Bt, resolveSessionTranscriptReadTarget as C, branchSessionFromCompactionCheckpoint as Ct, rewriteTranscriptMessageAtAnchor as D, SessionLabelOwnerIndex as Dt, trimSessionTranscriptForManualCompact as E, restoreSessionFromCompactionCheckpoint as Et, SessionInitializationAgentScopeMismatchError as F, readSessionIdentityEvidenceBatch as Ft, rewriteDoctorSessionEntries as G, rewindSessionToMessage as H, updateResolvedSessionEntry as Ht, commitReplySessionInitialization as I, listSessionEntriesCore as It, scanDoctorSessionEntriesStrict as J, listCanonicalSessionRepairFacts as K, loadReplySessionInitializationSnapshot as L, openSessionEntryReadView as Lt, withCurrentProjectionSnapshot as M, purgeDeletedAgentSessionEntries as Mt, SessionTranscriptProjectionUnavailableError as N, applySessionEntryCanonicalReplacements as Nt, createTranscriptRawDeltaCursor as O, inheritSessionSelection as Ot, isSessionTranscriptProjectionUnavailableError as P, loadExactSessionEntryReadOnlyResult as Pt, createSessionEntryWithTranscript as Q, persistSessionResetLifecycle as R, patchSessionEntryWithKey as Rt, resolveSessionTranscriptDatabasePath as S, applySessionPatchProjections as St, preflightSessionTranscriptForManualCompact as T, preserveTemporarySessionMapping as Tt, switchSessionBranch as U, clearPluginOwnedSessionState as Ut, resolveSessionTranscriptActiveLeafEntryId as V, resolveSessionEntrySelection as Vt, iterateDoctorSessionKeyBatches as W, recordSessionParticipant as X, scanDoctorSessionEntriesTolerant as Y, recoverSessionEntryFromRestartTombstone as Z, resolveVisibleMessagePositions as _, normalizeCliSessionReseedReceipt as _t, readRecentSessionTranscriptMessageEvents as a, appendTranscriptMessage as at, persistSessionTranscriptTurn as b, resolveSessionParentForkDecision as bt, readSessionTranscriptBoundedActiveContextCore as c, replaceTranscriptEventsSync as ct, readSessionTranscriptMessageEvents as d, withTranscriptWriteTransaction as dt, markSessionAbortTarget as et, readSessionTranscriptVisibleMessageDeltaCore as f, sessionMatchesExpectedTranscriptTurn as ft, resolveVisibleMessagePositionRange as g, getCliSessionId as gt, readVisibleMessageRange as h, getCliSessionBinding as ht, readRecentSessionTranscriptActiveEvents as i, appendTranscriptEventSync as it, getActiveTranscriptKysely as j, applySessionStoreProjection as jt, readTranscriptDisplayDelta as k, applySessionEntryLifecycleMutation as kt, readSessionTranscriptBoundedMessageTailPage as l, rewriteTranscriptEventRowsExact as lt, readTranscriptProjectionGeneration as m, clearAllCliSessions as mt, readSessionTranscriptWatermarkBatch as n, updateSessionEntry as nt, readSessionTranscriptActivePathEntryRelation as o, appendTranscriptMessageSync as ot, MAX_VISIBLE_MESSAGE_MAX_MESSAGES as p, readActiveTranscriptEntryAnchor as pt, loadCanonicalSessionRepairEntries as q, readSessionTranscriptTitleProbeBatch as r, appendTranscriptEvent as rt, readSessionTranscriptActiveStats as s, replaceTranscriptEvents as st, readSessionTranscriptWatermark as t, resolveSessionAbortTarget as tt, readSessionTranscriptMessageEventPage as u, withTranscriptWriteLock as ut, readClosedTranscriptTurn as v, rebindCliSessionReseedReceiptsForReset as vt, resolveSessionTranscriptRuntimeTarget as w, cleanupPluginHostSessionStore as wt, resolveConcreteSessionStorePath as x, applySessionPatchProjection as xt, appendTranscriptMessages as y, forkSessionEntryFromParentTarget as yt, forkSessionAtMessage as z, resolveSessionEntryAccessTarget as zt };
