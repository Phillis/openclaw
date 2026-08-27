import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { i as resolveSessionFilePathCore, o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { n as replaceFileAtomicSync } from "./replace-file-BafkybJJ.js";
import "./replace-file-sXUFaaUi.js";
import "./delivery-context.shared-D-qPZITK.js";
import "./main-session-er-Gn_t_.js";
import { $t as loadSessionEntryReadOnly, K as updateSessionEntry, Pt as listSessionEntriesCore, en as patchSessionEntryCore, kt as applySessionStoreProjection, nn as readSessionUpdatedAtCore, qt as listSessionEntriesReadOnly, sn as resolveSessionKeyBySessionId } from "./session-accessor-Bi6bzKQE.js";
import "./store-entry-shape-BgAn-BWO.js";
import { s as resolveSessionStoreEntryCore } from "./store-entry-iif-1PcC.js";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DH7-Rfwr.js";
import { n as deleteSessionEntryLifecycle, t as cleanupSessionLifecycleArtifactsCore } from "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { k as readTranscriptStatsSync$1, x as loadTranscriptEventsSync$1 } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { w as normalizeResolvedMaintenanceConfigInput } from "./agent-harness-session-key-BMj1lPtX.js";
import "./reset-CXwXEKFS.js";
import "./session-key-DTH_WL7C.js";
import "./transcript-DcKMk0pM.js";
import { t as MAIN_SESSION_RECOVERY_CLEAR_PATCH } from "./main-session-recovery-clear-H7IP1700.js";
import "./send-policy-fb8W-yqC.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/ambient-transcript-watermark.ts
function resolveAmbientTranscriptWatermarkKey(scope) {
	return JSON.stringify([
		scope.channel,
		scope.accountId ?? "",
		scope.conversationId,
		scope.threadId === void 0 ? "" : String(scope.threadId)
	]);
}
function numericMessageId(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isAmbientTranscriptWatermarkAfter(next, current) {
	if (!current) return true;
	if (next.timestampMs !== void 0 && current.timestampMs !== void 0) {
		if (next.timestampMs !== current.timestampMs) return next.timestampMs > current.timestampMs;
		const nextMessageId = numericMessageId(next.messageId);
		const currentMessageId = numericMessageId(current.messageId);
		return nextMessageId !== void 0 && currentMessageId !== void 0 && nextMessageId > currentMessageId;
	}
	const nextMessageId = numericMessageId(next.messageId);
	const currentMessageId = numericMessageId(current.messageId);
	if (nextMessageId !== void 0 && currentMessageId !== void 0) return nextMessageId > currentMessageId;
	return next.messageId !== current.messageId;
}
function readAmbientTranscriptWatermarkFromEntry(entry, key) {
	const watermark = entry?.ambientTranscriptWatermarks?.[key];
	return watermark?.sessionId === entry?.sessionId ? watermark : void 0;
}
async function updateAmbientTranscriptWatermark(params) {
	return await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (entry) => {
		if (!entry.sessionId) return null;
		if (params.expectedSessionId !== void 0 && entry.sessionId !== params.expectedSessionId) return null;
		const current = readAmbientTranscriptWatermarkFromEntry(entry, params.key);
		if (!isAmbientTranscriptWatermarkAfter({
			messageId: params.messageId,
			timestampMs: params.timestampMs
		}, current)) return null;
		return { ambientTranscriptWatermarks: {
			...entry.ambientTranscriptWatermarks,
			[params.key]: {
				sessionId: entry.sessionId,
				messageId: params.messageId,
				...params.timestampMs !== void 0 ? { timestampMs: params.timestampMs } : {},
				updatedAt: Date.now()
			}
		} };
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
//#endregion
//#region src/plugin-sdk/session-store-runtime-internal.ts
function toSessionAccessScope(params) {
	return {
		sessionKey: params.sessionKey,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.readConsistency !== void 0 ? { readConsistency: params.readConsistency } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	};
}
function projectPluginSessionEntry(entry) {
	const { activeWriterRunId: _activeWriterRunId, mainRestartRecovery: _mainRestartRecovery, ...publicEntry } = entry;
	return {
		...publicEntry,
		...entry.restartRecoveryRuns ? { restartRecoveryRuns: entry.restartRecoveryRuns.map((run) => ({ ...run })) } : {}
	};
}
function projectPluginSessionEntryPatch(patch) {
	const { activeWriterRunId: _activeWriterRunId, mainRestartRecovery: _mainRestartRecovery, ...publicPatch } = patch;
	return publicPatch;
}
function projectPluginSessionStore(store) {
	return Object.fromEntries(Object.entries(store).map(([sessionKey, entry]) => [sessionKey, projectPluginSessionEntry(entry)]));
}
function activeRecoveryFieldsForSameSession(existingEntry, nextSessionId) {
	if (!existingEntry || existingEntry.sessionId !== nextSessionId || existingEntry.mainRestartRecovery === void 0) return;
	return {
		activeWriterRunId: existingEntry.activeWriterRunId,
		abortedLastRun: existingEntry.abortedLastRun,
		restartRecoveryRuns: existingEntry.restartRecoveryRuns,
		mainRestartRecovery: existingEntry.mainRestartRecovery
	};
}
function clearRecoveryStateForRotatedSessionPatch(existingEntry, publicPatch) {
	return Object.hasOwn(publicPatch, "sessionId") && publicPatch.sessionId !== existingEntry.sessionId ? {
		...publicPatch,
		...MAIN_SESSION_RECOVERY_CLEAR_PATCH
	} : publicPatch;
}
function reconcilePluginSessionStore(params) {
	for (const sessionKey of Object.keys(params.internalStore)) if (!Object.hasOwn(params.publicStore, sessionKey)) delete params.internalStore[sessionKey];
	for (const [sessionKey, publicEntry] of Object.entries(params.publicStore)) {
		const projectedEntry = projectPluginSessionEntry(publicEntry);
		const existingRecovery = activeRecoveryFieldsForSameSession(params.internalStore[sessionKey], projectedEntry.sessionId);
		const existingEntry = params.internalStore[sessionKey];
		params.internalStore[sessionKey] = existingEntry && existingEntry.sessionId !== projectedEntry.sessionId ? {
			...projectedEntry,
			...MAIN_SESSION_RECOVERY_CLEAR_PATCH
		} : existingRecovery ? {
			...projectedEntry,
			...existingRecovery
		} : projectedEntry;
	}
}
//#endregion
//#region src/plugin-sdk/session-store-runtime.ts
const SQLITE_SESSION_STORE_BACKUP_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const LEGACY_TRANSCRIPT_INSPECTION_MAX_BYTES = 16 * 1024 * 1024;
const legacyStoreAgentIds = /* @__PURE__ */ new Map();
function preserveCoreRecoveryState(persistedEntry, publicPatch) {
	const recoveryState = activeRecoveryFieldsForSameSession(persistedEntry, Object.hasOwn(publicPatch, "sessionId") ? publicPatch.sessionId : persistedEntry.sessionId);
	return recoveryState ? {
		...publicPatch,
		...recoveryState
	} : clearRecoveryStateForRotatedSessionPatch(persistedEntry, publicPatch);
}
function resolveLegacySessionStoreTarget(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const selectedAgentId = legacyStoreAgentIds.get(resolvedStorePath);
	const target = resolveSqliteTargetFromSessionStorePath(resolvedStorePath, { agentId: selectedAgentId });
	const agentId = target.agentId ?? selectedAgentId;
	return {
		...agentId ? { agentId } : {},
		storePath: target.path ?? resolvedStorePath
	};
}
function materializeLegacyTranscriptFile(sessionFile, options) {
	const marker = parseSqliteSessionFileMarker(sessionFile);
	if (!marker) return sessionFile;
	const transcriptScope = {
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		storePath: marker.storePath
	};
	const transcriptPath = resolveSessionFilePathCore(marker.sessionId, void 0, {
		agentId: marker.agentId,
		...options?.sessionsDir ? { sessionsDir: options.sessionsDir } : {}
	});
	const stats = readTranscriptStatsSync$1(transcriptScope);
	const isOversized = stats.sizeBytes + (stats.eventCount > 0 ? 1 : 0) > LEGACY_TRANSCRIPT_INSPECTION_MAX_BYTES;
	replaceFileAtomicSync({
		filePath: transcriptPath,
		content: isOversized ? "" : (() => {
			const events = loadTranscriptEventsSync$1(transcriptScope);
			return events.length > 0 ? `${events.map((event) => JSON.stringify(event)).join("\n")}\n` : "";
		})(),
		dirMode: 448,
		mode: 384,
		tempPrefix: `${path.basename(transcriptPath)}.sqlite-compat`,
		copyFallbackOnPermissionError: true,
		syncParentDir: true,
		syncTempFile: true,
		...isOversized ? { beforeRename: ({ tempPath }) => {
			fs.truncateSync(tempPath, 16777217);
			const fd = fs.openSync(tempPath, "r+");
			try {
				fs.fsyncSync(fd);
			} finally {
				fs.closeSync(fd);
			}
		} } : {}
	});
	return transcriptPath;
}
/**
* @deprecated Use getSessionEntry or listSessionEntries.
*
* Official plugins released with v2026.7.1-beta.5 import this symbol. Keep the
* compatibility projection through 2026-10-12, then remove it only after the
* minimum supported plugin version excludes that release.
*/
function loadSessionStore(storePath, options = {}) {
	options.skipCache;
	const target = resolveLegacySessionStoreTarget(storePath);
	return Object.fromEntries(listSessionEntriesCore({
		...target,
		clone: true,
		hydrateSkillPromptRefs: options.hydrateSkillPromptRefs
	}).map(({ sessionKey, entry }) => {
		const sessionId = entry.sessionId?.trim();
		const projectedEntry = projectPluginSessionEntry(entry);
		if (!sessionId) return [sessionKey, projectedEntry];
		return [sessionKey, {
			...projectedEntry,
			sessionFile: formatSqliteSessionFileMarker({
				agentId: target.agentId ?? resolveAgentIdFromSessionKey(sessionKey),
				sessionId,
				storePath: target.storePath
			})
		}];
	}));
}
/**
* @deprecated Use patchSessionEntry, upsertSessionEntry, or deleteSessionEntry.
*
* Official plugins released with v2026.7.1-beta.5 import this symbol. Keep the
* compatibility bridge through 2026-10-12. The callback mutates a detached
* projection; the resulting row diff commits through the SQLite accessor.
* Beta.5 memory-core already uses cleanupSessionLifecycleArtifacts; this
* whole-store callback remains only for Feishu doctor's explicit repair flow.
*/
async function updateSessionStore(storePath, mutator, options = {}) {
	const target = resolveLegacySessionStoreTarget(storePath);
	return await applySessionStoreProjection({
		activeSessionKey: options.activeSessionKey,
		...target.agentId ? { agentId: target.agentId } : {},
		storePath: target.storePath,
		skipMaintenance: options.skipMaintenance,
		update: async (store) => {
			const internalStore = store;
			const publicStore = projectPluginSessionStore(internalStore);
			const result = await mutator(publicStore);
			const persist = !options.skipSaveWhenResult?.(result);
			if (persist) reconcilePluginSessionStore({
				internalStore,
				publicStore
			});
			return {
				persist,
				result
			};
		}
	});
}
/**
* @deprecated Resolve transcript identities with loadTranscriptEventsSync.
*
* Beta.5 Feishu doctor still inspects JSONL paths synchronously. SQLite
* markers therefore materialize a bounded export at the canonical legacy path
* rather than making the old doctor classify every healthy transcript as
* missing. These files are durable because beta.5 renames repaired transcripts
* to recovery archives; remove this bridge only after beta.5 is unsupported.
*/
function resolveSessionFilePath(sessionId, entry, options) {
	return materializeLegacyTranscriptFile(resolveSessionFilePathCore(sessionId, entry, options), options);
}
/**
* Resolves the configured session store path.
*
* Beta.5 resolves a configured path with an agent id, then passes only the
* path to loadSessionStore/updateSessionStore. Its shipped callers either
* consume the selection synchronously or dedupe by path, so retaining the
* latest selection preserves that bounded compatibility contract.
*/
function resolveStorePath(store, options) {
	const storePath = resolveSessionStorePathCore(store, options);
	if (options?.agentId) legacyStoreAgentIds.set(path.resolve(storePath), options.agentId);
	return storePath;
}
/**
* @deprecated Use getSessionEntry with a storage-neutral session identity.
*
* Official plugins released with v2026.7.1-beta.5 import this whole-store
* lookup helper. Keep it through 2026-10-12 with the other beta.5 bridge.
*/
function resolveSessionStoreEntry(params) {
	return resolveSessionStoreEntryCore(params);
}
/** Loads one session entry by agent/session identity. */
function getSessionEntry(params) {
	const entry = loadSessionEntryReadOnly(toSessionAccessScope(params));
	return entry ? projectPluginSessionEntry(entry) : void 0;
}
/**
* Lists session entries for one agent. `readOnly` reads without joining the
* agent database writable lifecycle (no create/register/migrate) — required
* for detection/introspection paths that may run across the whole fleet.
* One flagged entry instead of a second export keeps the SDK surface budget flat.
*/
function listSessionEntries(params = {}) {
	return (params.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	}).map(({ sessionKey, entry }) => ({
		sessionKey,
		entry: projectPluginSessionEntry(entry)
	}));
}
/** Reads transcript events for a live SQLite-backed session identity. */
function loadTranscriptEventsSync(params) {
	return loadTranscriptEventsSync$1(params);
}
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsSync(params) {
	return readTranscriptStatsSync$1(params);
}
/** Resolves the persisted session key for one SQLite transcript identity. */
function resolveTranscriptSessionKeyBySessionId(params) {
	return resolveSessionKeyBySessionId(params);
}
/** Patches one session entry by agent/session identity. */
async function patchSessionEntry(params) {
	const entry = await patchSessionEntryCore(toSessionAccessScope(params), async (internalEntry, context) => {
		const persistedEntry = internalEntry;
		const patch = await params.update(projectPluginSessionEntry(internalEntry), { existingEntry: context.existingEntry ? projectPluginSessionEntry(context.existingEntry) : void 0 });
		if (!patch) return null;
		return preserveCoreRecoveryState(persistedEntry, projectPluginSessionEntryPatch(patch));
	}, {
		fallbackEntry: params.fallbackEntry ? projectPluginSessionEntry(params.fallbackEntry) : void 0,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		requireWriteSuccess: params.requireWriteSuccess,
		replaceEntry: params.replaceEntry,
		skipMaintenance: params.skipMaintenance
	});
	return entry ? projectPluginSessionEntry(entry) : null;
}
/** Reads the last activity timestamp for one session entry. */
function readSessionUpdatedAt(params) {
	return readSessionUpdatedAtCore(toSessionAccessScope(params));
}
function readAmbientTranscriptWatermark(params) {
	return readAmbientTranscriptWatermarkFromEntry(getSessionEntry(params), params.key);
}
/** Updates an existing session entry by store path and session key. */
async function updateSessionStoreEntry(params) {
	const entry = await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, async (internalEntry) => {
		const patch = await params.update(projectPluginSessionEntry(internalEntry));
		if (!patch) return null;
		return preserveCoreRecoveryState(internalEntry, projectPluginSessionEntryPatch(patch));
	}, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
	return entry ? projectPluginSessionEntry(entry) : null;
}
/** Replaces or creates one session entry by agent/session identity. */
async function upsertSessionEntry(params) {
	const publicEntry = projectPluginSessionEntry(params.entry);
	await patchSessionEntryCore(toSessionAccessScope(params), (internalEntry) => {
		return preserveCoreRecoveryState(internalEntry, publicEntry);
	}, {
		fallbackEntry: publicEntry,
		replaceEntry: true
	});
}
/** Deletes one session entry by agent/session identity. */
async function deleteSessionEntry(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = params.storePath ?? resolveSessionStorePathCore(void 0, {
		agentId,
		env: params.env
	});
	return (await deleteSessionEntryLifecycle({
		...agentId !== void 0 ? { agentId } : {},
		archiveTranscript: params.archiveTranscript ?? false,
		...params.expectedSessionId !== void 0 ? { expectedSessionId: params.expectedSessionId } : {},
		...params.expectedUpdatedAt !== void 0 ? { expectedUpdatedAt: params.expectedUpdatedAt } : {},
		storePath,
		target: {
			canonicalKey: params.sessionKey,
			storeKeys: [params.sessionKey]
		}
	})).deleted;
}
/** Resolves the file artifacts that should be backed up before mutating a session store. */
function resolveSessionStoreBackupPaths(params) {
	const backupPaths = /* @__PURE__ */ new Set();
	backupPaths.add(path.resolve(params.storePath));
	const sqlitePath = resolveSqliteTargetFromSessionStorePath(params.storePath, { agentId: params.agentId }).path;
	if (sqlitePath) for (const suffix of SQLITE_SESSION_STORE_BACKUP_SUFFIXES) backupPaths.add(`${sqlitePath}${suffix}`);
	return [...backupPaths];
}
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
async function cleanupSessionLifecycleArtifacts(params) {
	return await cleanupSessionLifecycleArtifactsCore({
		storePath: params.storePath ?? resolveSessionStorePathCore(params.sessionStore, {
			agentId: params.agentId,
			env: params.env
		}),
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
		...params.pluginOwnerId !== void 0 ? { pluginOwnerId: params.pluginOwnerId } : {},
		sessionKeySegmentPrefix: params.sessionKeySegmentPrefix,
		transcriptContentMarker: params.transcriptContentMarker,
		orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
		nowMs: params.nowMs
	});
}
//#endregion
export { updateSessionStoreEntry as _, loadSessionStore as a, updateAmbientTranscriptWatermark as b, readAmbientTranscriptWatermark as c, resolveSessionFilePath as d, resolveSessionStoreBackupPaths as f, updateSessionStore as g, resolveTranscriptSessionKeyBySessionId as h, listSessionEntries as i, readSessionUpdatedAt as l, resolveStorePath as m, deleteSessionEntry as n, loadTranscriptEventsSync as o, resolveSessionStoreEntry as p, getSessionEntry as r, patchSessionEntry as s, cleanupSessionLifecycleArtifacts as t, readTranscriptStatsSync as u, upsertSessionEntry as v, resolveAmbientTranscriptWatermarkKey as y };
