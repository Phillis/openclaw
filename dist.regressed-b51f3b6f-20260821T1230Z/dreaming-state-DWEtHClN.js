import { createHash } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { scheduler } from "node:timers/promises";
//#region extensions/memory-core/src/dreaming-state.ts
const MEMORY_CORE_PLUGIN_ID = "memory-core";
const DREAMING_DAILY_INGESTION_NAMESPACE = "dreaming-daily-ingestion";
const DREAMING_DAILY_PROVENANCE_NAMESPACE = "dreaming-daily-provenance";
const DREAMING_SESSION_INGESTION_FILES_NAMESPACE = "dreaming-session-ingestion-files";
const DREAMING_SESSION_INGESTION_SEEN_NAMESPACE = "dreaming-session-ingestion-seen";
const SESSION_BACKFILL_REWIND_NAMESPACE = "session-backfill-rewind";
const DREAMING_MEMORY_BACKUP_NAMESPACE = "dreaming-memory-backups";
const SHORT_TERM_RECALL_NAMESPACE = "short-term-recall";
const SHORT_TERM_PHASE_SIGNAL_NAMESPACE = "short-term-phase-signals";
const SHORT_TERM_META_NAMESPACE = "short-term-meta";
const SHORT_TERM_LOCK_NAMESPACE = "short-term-locks";
const DREAMING_WORKSPACE_STATE_MAX_ENTRIES = 5e4;
const SHORT_TERM_LOCK_MAX_ENTRIES = 4096;
let configuredOpenKeyedStore;
function configureMemoryCoreDreamingState(openKeyedStore) {
	configuredOpenKeyedStore = openKeyedStore;
}
function openMemoryCoreStateStore(options) {
	if (!configuredOpenKeyedStore) throw new Error("memory-core dreaming SQLite state store is not configured");
	return configuredOpenKeyedStore(options);
}
function normalizeMemoryCoreWorkspaceKey(workspaceDir) {
	const resolved = path.resolve(workspaceDir).replace(/\\/g, "/");
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function memoryCoreWorkspaceStateKey(workspaceDir) {
	return createHash("sha256").update(normalizeMemoryCoreWorkspaceKey(workspaceDir)).digest("hex");
}
function memoryCoreWorkspaceEntryKey(workspaceDir, logicalKey) {
	return `${memoryCoreWorkspaceStateKey(workspaceDir)}:${createHash("sha256").update(logicalKey).digest("hex")}`;
}
function memoryCoreStateReference(namespace, workspaceDir) {
	return `plugin-state:${MEMORY_CORE_PLUGIN_ID}/${namespace}/${memoryCoreWorkspaceStateKey(workspaceDir)}`;
}
function resolveWorkspaceKeyRange(workspaceDir) {
	const workspaceKey = memoryCoreWorkspaceStateKey(workspaceDir);
	return {
		keyStartInclusive: `${workspaceKey}:`,
		keyEndExclusive: `${workspaceKey};`
	};
}
async function readWorkspaceEntriesInRange(store, workspaceDir) {
	const { keyStartInclusive, keyEndExclusive } = resolveWorkspaceKeyRange(workspaceDir);
	if (store.entriesInKeyRange) return store.entriesInKeyRange({
		keyStartInclusive,
		keyEndExclusive,
		limit: DREAMING_WORKSPACE_STATE_MAX_ENTRIES
	});
	return (await store.entries()).filter((entry) => entry.key >= keyStartInclusive && entry.key < keyEndExclusive);
}
async function deleteWorkspaceEntries(store, stateKeys) {
	let deleted = 0;
	for (const stateKey of stateKeys) {
		await store.delete(stateKey);
		deleted += 1;
		if (deleted % 256 === 0) await scheduler.yield();
	}
}
function openWorkspaceStore(namespace) {
	return openMemoryCoreStateStore({
		namespace,
		maxEntries: DREAMING_WORKSPACE_STATE_MAX_ENTRIES
	});
}
async function readMemoryCoreWorkspaceEntries(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	return (await readWorkspaceEntriesInRange(openWorkspaceStore(params.namespace), params.workspaceDir)).filter((entry) => entry.value.workspaceKey === workspaceKey).map((entry) => ({
		key: entry.value.key,
		value: entry.value.value
	}));
}
async function readMemoryCoreWorkspaceEntry(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	const entry = await openWorkspaceStore(params.namespace).lookup(memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key));
	return entry?.workspaceKey === workspaceKey ? entry.value : void 0;
}
async function writeMemoryCoreWorkspaceEntries(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	const workspaceDir = path.resolve(params.workspaceDir);
	const desiredByStateKey = /* @__PURE__ */ new Map();
	for (const entry of params.entries) {
		const stateKey = memoryCoreWorkspaceEntryKey(params.workspaceDir, entry.key);
		desiredByStateKey.set(stateKey, {
			version: 1,
			workspaceKey,
			workspaceDir,
			key: entry.key,
			value: entry.value
		});
	}
	if (desiredByStateKey.size > 5e4) throw new RangeError(`memory-core workspace entries: ${desiredByStateKey.size} unique rows exceeds namespace capacity ${DREAMING_WORKSPACE_STATE_MAX_ENTRIES}; reduce workspace state cardinality`);
	const store = openWorkspaceStore(params.namespace);
	const existingByKey = new Map((await readWorkspaceEntriesInRange(store, params.workspaceDir)).map((entry) => [entry.key, entry.value]));
	let wrote = false;
	for (const [stateKey, nextValue] of desiredByStateKey) {
		const current = existingByKey.get(stateKey);
		if (current !== void 0 && isDeepStrictEqual(current, nextValue)) continue;
		await store.register(stateKey, nextValue);
		wrote = true;
	}
	await deleteWorkspaceEntries(store, Array.from(existingByKey.keys()).filter((stateKey) => !desiredByStateKey.has(stateKey)));
	if (wrote) await reconcileDesiredWorkspaceEntries({
		store,
		workspaceDir: params.workspaceDir,
		desiredByStateKey
	});
}
async function reconcileDesiredWorkspaceEntries(params) {
	const desiredSize = params.desiredByStateKey.size;
	if (desiredSize === 0) return;
	const maxRounds = desiredSize;
	for (let round = 0; round < maxRounds; round += 1) {
		const liveByKey = new Map((await readWorkspaceEntriesInRange(params.store, params.workspaceDir)).map((entry) => [entry.key, entry.value]));
		let missingCount = 0;
		for (const [stateKey, nextValue] of params.desiredByStateKey) {
			const current = liveByKey.get(stateKey);
			if (current !== void 0 && isDeepStrictEqual(current, nextValue)) continue;
			await params.store.register(stateKey, nextValue);
			missingCount += 1;
		}
		if (missingCount === 0) return;
	}
	const finalLiveByKey = new Map((await readWorkspaceEntriesInRange(params.store, params.workspaceDir)).map((entry) => [entry.key, entry.value]));
	const stillMissing = [];
	for (const [stateKey, nextValue] of params.desiredByStateKey) {
		const current = finalLiveByKey.get(stateKey);
		if (current === void 0 || !isDeepStrictEqual(current, nextValue)) stillMissing.push(stateKey);
	}
	if (stillMissing.length === 0) return;
	throw new Error(`memory-core workspace reconcile failed to converge after ${maxRounds} rounds; ${stillMissing.length} of ${desiredSize} desired rows still missing (namespace capacity may be exceeded by desired set)`);
}
async function writeMemoryCoreWorkspaceEntry(params) {
	const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
	await openWorkspaceStore(params.namespace).register(memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key), {
		version: 1,
		workspaceKey,
		workspaceDir: path.resolve(params.workspaceDir),
		key: params.key,
		value: params.value
	});
}
async function clearMemoryCoreWorkspaceNamespace(params) {
	const store = openWorkspaceStore(params.namespace);
	await deleteWorkspaceEntries(store, (await readWorkspaceEntriesInRange(store, params.workspaceDir)).map((entry) => entry.key));
}
async function deleteMemoryCoreWorkspaceEntry(params) {
	await openWorkspaceStore(params.namespace).delete(memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key));
}
//#endregion
export { writeMemoryCoreWorkspaceEntry as S, normalizeMemoryCoreWorkspaceKey as _, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE as a, readMemoryCoreWorkspaceEntry as b, SHORT_TERM_LOCK_NAMESPACE as c, SHORT_TERM_RECALL_NAMESPACE as d, clearMemoryCoreWorkspaceNamespace as f, memoryCoreWorkspaceStateKey as g, memoryCoreStateReference as h, DREAMING_SESSION_INGESTION_FILES_NAMESPACE as i, SHORT_TERM_META_NAMESPACE as l, deleteMemoryCoreWorkspaceEntry as m, DREAMING_DAILY_PROVENANCE_NAMESPACE as n, SESSION_BACKFILL_REWIND_NAMESPACE as o, configureMemoryCoreDreamingState as p, DREAMING_MEMORY_BACKUP_NAMESPACE as r, SHORT_TERM_LOCK_MAX_ENTRIES as s, DREAMING_DAILY_INGESTION_NAMESPACE as t, SHORT_TERM_PHASE_SIGNAL_NAMESPACE as u, openMemoryCoreStateStore as v, writeMemoryCoreWorkspaceEntries as x, readMemoryCoreWorkspaceEntries as y };
