import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CLtsGq3M.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import "./config-CfeGo4K4.js";
import { It as patchSessionEntryWithKey, Jt as listSessionEntryKeysReadOnly, Zt as loadExactSessionEntryReadOnly } from "./session-accessor-CIiPoGwM.js";
import { p as mergeSessionEntry } from "./restart-recovery-state-YPGO30LK.js";
//#region src/acp/runtime/session-meta-keys.ts
function getAcpSessionKysely(db) {
	return getNodeSqliteKysely(db);
}
function selectAcpSessionRow(db, sessionKey) {
	return executeSqliteQueryTakeFirstSync(db, getAcpSessionKysely(db).selectFrom("acp_sessions").selectAll().where("session_key", "=", sessionKey));
}
const ACP_DATABASE_KEY_PREFIX = "@acp:v1:";
const ACP_LEGACY_AGENT_SCOPED_DB_KEY_PREFIX = "@agent:";
function buildAcpDatabaseSessionKey(storeSessionKey, agentId) {
	const normalizedKey = storeSessionKey.trim();
	const identity = [agentId ? normalizeAgentId(agentId) : null, normalizedKey];
	return `${ACP_DATABASE_KEY_PREFIX}${Buffer.from(JSON.stringify(identity), "utf8").toString("base64url")}`;
}
function parseAcpDatabaseSessionKey(sessionKey) {
	if (sessionKey.startsWith(ACP_DATABASE_KEY_PREFIX)) {
		try {
			const decoded = JSON.parse(Buffer.from(sessionKey.slice(8), "base64url").toString("utf8"));
			if (Array.isArray(decoded) && decoded.length === 2 && (decoded[0] === null || typeof decoded[0] === "string") && typeof decoded[1] === "string") return {
				...decoded[0] ? { agentId: normalizeAgentId(decoded[0]) } : {},
				storeSessionKey: decoded[1]
			};
		} catch {}
		return { storeSessionKey: sessionKey };
	}
	if (!sessionKey.startsWith(ACP_LEGACY_AGENT_SCOPED_DB_KEY_PREFIX)) return { storeSessionKey: sessionKey };
	const remainder = sessionKey.slice(7);
	const separator = remainder.indexOf(":");
	return separator > 0 ? {
		agentId: normalizeAgentId(remainder.slice(0, separator)),
		storeSessionKey: remainder.slice(separator + 1)
	} : { storeSessionKey: sessionKey };
}
function parseAcpDatabaseSessionKeyCandidates(sessionKey) {
	const parsed = parseAcpDatabaseSessionKey(sessionKey);
	if (parsed.storeSessionKey === sessionKey && parsed.agentId === void 0) return [parsed];
	return [parsed, { storeSessionKey: sessionKey }];
}
function resolveAcpLegacyUnscopedOwner(cfg, storeSessionKey) {
	if (!cfg) return;
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, storeSessionKey);
	return persistedOwner.kind === "configured" ? persistedOwner.agentId : persistedOwner.kind === "none" ? tryResolveLegacyCompatibilityAgentId(cfg) : void 0;
}
function legacyAcpDatabaseSessionKeys(storeSessionKey, agentId, cfg) {
	const normalizedKey = storeSessionKey.trim();
	const keys = [];
	if (agentId && !parseAgentSessionKey(normalizedKey)) keys.push(`${ACP_LEGACY_AGENT_SCOPED_DB_KEY_PREFIX}${normalizeAgentId(agentId)}:${normalizedKey}`);
	const compatibilityOwner = resolveAcpLegacyUnscopedOwner(cfg, normalizedKey);
	if (parseAgentSessionKey(normalizedKey) || !agentId || compatibilityOwner === normalizeAgentId(agentId)) keys.push(normalizedKey);
	return [...new Set(keys)];
}
function acpSessionRowMatchesEntry(row, entry) {
	return row.session_id == null || row.session_id === entry?.lifecycleRevision || row.session_id === entry?.sessionId && (entry?.sessionStartedAt === void 0 || row.updated_at >= entry.sessionStartedAt);
}
function selectAcpSessionRowForStoreEntry(db, storeSessionKey, agentId, cfg, entry) {
	const databaseKey = buildAcpDatabaseSessionKey(storeSessionKey, agentId);
	for (const key of [databaseKey, ...legacyAcpDatabaseSessionKeys(storeSessionKey, agentId, cfg)]) {
		const row = selectAcpSessionRow(db, key);
		if (row && (!entry || acpSessionRowMatchesEntry(row, entry))) return row;
	}
}
function resolveReadableAcpSessionRow(params) {
	const { row, entry } = params;
	if (!row || !acpSessionRowMatchesEntry(row, entry)) return;
	const legacySessionId = entry?.sessionId;
	const lifecycleRevision = entry?.lifecycleRevision;
	if (!legacySessionId || !lifecycleRevision || row.session_id !== legacySessionId || row.session_id === lifecycleRevision) return row;
	return runOpenClawStateWriteTransaction((database) => {
		const current = selectAcpSessionRow(database.db, row.session_key);
		if (!current || current.session_id === lifecycleRevision || current.session_id == null) return current;
		if (current.session_id !== legacySessionId) return;
		executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).updateTable("acp_sessions").set({ session_id: lifecycleRevision }).where("session_key", "=", row.session_key).where("session_id", "=", legacySessionId));
		return {
			...current,
			session_id: lifecycleRevision
		};
	}, {
		env: params.env,
		path: params.databasePath
	});
}
//#endregion
//#region src/acp/runtime/session-meta-legacy-cleanup.ts
async function clearLegacyEmbeddedAcpMetadata(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => sessionKey?.trim()).filter((sessionKey) => Boolean(sessionKey)));
	for (const sessionKey of sessionKeys) await patchSessionEntryWithKey({
		storePath: params.storePath,
		sessionKey
	}, (entry) => {
		if (!entry.acp) return null;
		const next = { ...entry };
		delete next.acp;
		return next;
	}, {
		replaceEntry: true,
		skipMaintenance: true
	});
}
//#endregion
//#region src/acp/runtime/session-meta-store.ts
/** Store binding for ACP session metadata: resolves which session-store row owns a key. */
/**
* Resolve one session's store key and entry with targeted single-row probes.
* Gateway sessions.list calls this per row; listing the whole store here made
* that path O(rows²) in JSON parsing (12.7s of a 78.5s production profile).
* The full scan survives only as the fallback for legacy case-variant keys
* that neither the exact nor the lowercased probe can hit.
*/
function resolveStoreEntryForSessionKey(params) {
	const scope = {
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath,
		...params.clone === false ? { clone: false } : {}
	};
	const normalized = params.sessionKey.trim();
	if (!normalized) return { storeSessionKey: "" };
	const exact = loadExactSessionEntryReadOnly({
		...scope,
		sessionKey: normalized
	});
	if (exact) return {
		storeSessionKey: normalized,
		entry: exact.entry
	};
	const lower = normalizeLowercaseStringOrEmpty(normalized);
	if (lower !== normalized) {
		const lowered = loadExactSessionEntryReadOnly({
			...scope,
			sessionKey: lower
		});
		if (lowered) return {
			storeSessionKey: lower,
			entry: lowered.entry
		};
	}
	const variant = listSessionEntryKeysReadOnly(scope).find((candidate) => normalizeLowercaseStringOrEmpty(candidate) === lower);
	if (variant === void 0) return { storeSessionKey: lower };
	return {
		storeSessionKey: variant,
		entry: loadExactSessionEntryReadOnly({
			...scope,
			sessionKey: variant
		})?.entry
	};
}
/** Resolves the session store path that owns an ACP session key. */
function resolveSessionStorePathForAcp(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const parsed = parseAgentSessionKey(params.sessionKey);
	const requestedAgentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const parsedAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : void 0;
	if (requestedAgentId && parsedAgentId && requestedAgentId !== parsedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `Agent "${requestedAgentId}" does not own agent-scoped session key "${params.sessionKey}".`
	});
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, params.sessionKey);
	const agentId = requestedAgentId ?? parsedAgentId;
	if (requestedAgentId && persistedStoreOwner.kind === "configured" && requestedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `The shared fixed-store row belongs to agent "${persistedStoreOwner.agentId}", not agent "${requestedAgentId}".`
	});
	if (persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	const resolvedAgentId = agentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg);
	if (!resolvedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: "Pass an explicit agent owner for this ACP session."
	});
	return {
		cfg,
		agentId: resolvedAgentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, {
			agentId: resolvedAgentId,
			env: params.env
		})
	};
}
/** Reads one session's store binding, falling back to a lowercased key on store errors. */
function readSessionEntryFromStore(params) {
	const { cfg, agentId, storePath } = resolveSessionStorePathForAcp({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env
	});
	if (!storePath) return {
		cfg,
		agentId,
		storeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey)
	};
	try {
		const { storeSessionKey, entry } = resolveStoreEntryForSessionKey({
			...agentId ? { agentId } : {},
			storePath,
			sessionKey: params.sessionKey,
			...params.clone === false ? { clone: false } : {}
		});
		return {
			cfg,
			agentId,
			storePath,
			storeSessionKey,
			entry
		};
	} catch {
		return {
			cfg,
			agentId,
			storePath,
			storeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey),
			storeReadFailed: true
		};
	}
}
//#endregion
//#region src/acp/runtime/session-meta.ts
function rowToAcpSessionMeta(row) {
	const identity = safeParseJsonRecord(row.identity_json ?? "");
	const runtimeOptions = safeParseJsonRecord(row.runtime_options_json ?? "");
	return {
		backend: row.backend,
		agent: row.agent,
		runtimeSessionName: row.runtime_session_name,
		...identity ? { identity } : {},
		mode: row.mode === "oneshot" ? "oneshot" : "persistent",
		...runtimeOptions ? { runtimeOptions } : {},
		...row.cwd != null ? { cwd: row.cwd } : {},
		state: row.state === "running" || row.state === "error" ? row.state : "idle",
		lastActivityAt: row.last_activity_at,
		...row.last_error != null ? { lastError: row.last_error } : {}
	};
}
function bindAcpSessionMeta(params) {
	return {
		session_key: params.sessionKey,
		session_id: params.lifecycleRevision ?? params.sessionId ?? null,
		backend: params.meta.backend,
		agent: params.meta.agent,
		runtime_session_name: params.meta.runtimeSessionName,
		identity_json: params.meta.identity ? JSON.stringify(params.meta.identity) : null,
		mode: params.meta.mode,
		runtime_options_json: params.meta.runtimeOptions ? JSON.stringify(params.meta.runtimeOptions) : null,
		cwd: params.meta.cwd ?? null,
		state: params.meta.state,
		last_activity_at: params.meta.lastActivityAt,
		last_error: params.meta.lastError ?? null,
		updated_at: params.updatedAt
	};
}
function readAcpSessionMeta(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const storeEntry = readSessionEntryFromStore({
		sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env,
		clone: false
	});
	if (!storeEntry.storePath) return;
	const row = resolveReadableAcpSessionRow({
		row: selectAcpSessionRowForStoreEntry(openOpenClawStateDatabase({
			env: params.env,
			path: params.databasePath
		}).db, storeEntry.storeSessionKey, storeEntry.agentId, storeEntry.cfg, storeEntry.entry),
		entry: storeEntry.entry,
		env: params.env,
		databasePath: params.databasePath
	});
	if (!row) return;
	return rowToAcpSessionMeta(row);
}
function readAcpSessionMetaForEntry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = resolveReadableAcpSessionRow({
		row: selectAcpSessionRowForStoreEntry(openOpenClawStateDatabase({
			env: params.env,
			path: params.databasePath
		}).db, sessionKey, params.agentId, params.cfg, params.entry),
		entry: params.entry,
		env: params.env,
		databasePath: params.databasePath
	});
	if (!row) return;
	return rowToAcpSessionMeta(row);
}
function readAcpSessionMetaBatch(params) {
	const result = /* @__PURE__ */ new Map();
	const entriesByKey = /* @__PURE__ */ new Map();
	for (const item of params.entries) {
		const rawSessionKey = item.sessionKey.trim();
		const sessionKey = buildAcpDatabaseSessionKey(rawSessionKey, item.agentId);
		if (!sessionKey) continue;
		if (item.entry?.acp) {
			result.set(item.entry, item.entry.acp);
			continue;
		}
		const legacyKeys = legacyAcpDatabaseSessionKeys(rawSessionKey, item.agentId, params.cfg);
		const entries = entriesByKey.get(sessionKey) ?? [];
		entries.push({
			entry: item.entry,
			rawSessionKey,
			legacyKeys
		});
		entriesByKey.set(sessionKey, entries);
	}
	if (entriesByKey.size === 0) return result;
	const database = openOpenClawStateDatabase({
		env: params.env,
		path: params.databasePath
	});
	const db = getAcpSessionKysely(database.db);
	const requestedKeySet = /* @__PURE__ */ new Set();
	for (const [sessionKey, entries] of entriesByKey) {
		requestedKeySet.add(sessionKey);
		for (const item of entries) for (const legacyKey of item.legacyKeys) requestedKeySet.add(legacyKey);
	}
	const requestedKeys = [...requestedKeySet];
	const keyChunks = [];
	for (let index = 0; index < requestedKeys.length; index += 500) keyChunks.push(requestedKeys.slice(index, index + 500));
	const rows = keyChunks.flatMap((chunk) => executeSqliteQuerySync(database.db, db.selectFrom("acp_sessions").selectAll().where("session_key", "in", chunk)).rows);
	const rowsByKey = new Map(rows.map((row) => [row.session_key, row]));
	const legacyRowsToRekey = [];
	for (const [sessionKey, entries] of entriesByKey) for (const item of entries) {
		const row = [sessionKey, ...item.legacyKeys].map((key) => rowsByKey.get(key)).map((candidateRow) => resolveReadableAcpSessionRow({
			row: candidateRow,
			entry: item.entry,
			env: params.env,
			databasePath: params.databasePath
		})).find((candidateRow) => candidateRow !== void 0);
		result.set(item.entry, row ? rowToAcpSessionMeta(row) : void 0);
		if (row && row.session_key !== sessionKey) legacyRowsToRekey.push({
			row,
			sessionKey
		});
	}
	if (legacyRowsToRekey.length > 0) runOpenClawStateWriteTransaction((transactionDatabase) => {
		for (const { row, sessionKey } of legacyRowsToRekey) {
			upsertAcpSessionMetaRow(transactionDatabase.db, {
				...row,
				session_key: sessionKey
			});
			executeSqliteQuerySync(transactionDatabase.db, getAcpSessionKysely(transactionDatabase.db).deleteFrom("acp_sessions").where("session_key", "=", row.session_key));
		}
	}, {
		env: params.env,
		path: params.databasePath
	});
	return result;
}
function selectAcpSessionRows(options = {}) {
	const database = openOpenClawStateDatabase(options);
	return executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).selectFrom("acp_sessions").selectAll().orderBy("last_activity_at", "desc").orderBy("session_key", "asc")).rows;
}
function writeAcpSessionMetaForMigration(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = bindAcpSessionMeta({
		sessionKey,
		sessionId: params.sessionId,
		lifecycleRevision: params.lifecycleRevision,
		meta: params.meta,
		updatedAt: params.now?.() ?? Date.now()
	});
	runOpenClawStateWriteTransaction((database) => {
		upsertAcpSessionMetaRow(database.db, row);
	}, {
		env: params.env,
		path: params.databasePath
	});
}
function repairAcpSessionMetaKeyForMigration(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return false;
	let repaired = false;
	runOpenClawStateWriteTransaction((database) => {
		const currentRow = selectAcpSessionRow(database.db, sessionKey);
		if (currentRow && acpSessionRowMatchesEntry(currentRow, params.entry)) return;
		const normalizedSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
		const candidateKeys = /* @__PURE__ */ new Set();
		candidateKeys.add(normalizedSessionKey);
		for (const candidate of params.candidateSessionKeys ?? []) {
			const trimmed = typeof candidate === "string" ? candidate.trim() : "";
			if (trimmed && trimmed !== sessionKey && normalizeLowercaseStringOrEmpty(trimmed) === normalizedSessionKey) candidateKeys.add(trimmed);
		}
		let row;
		for (const candidateKey of candidateKeys) {
			const candidateRow = selectAcpSessionRow(database.db, candidateKey);
			if (candidateRow && acpSessionRowMatchesEntry(candidateRow, params.entry)) {
				row = candidateRow;
				break;
			}
		}
		row ??= executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).selectFrom("acp_sessions").selectAll().where((eb) => eb.fn("lower", ["session_key"]), "=", normalizedSessionKey).orderBy("last_activity_at", "desc").orderBy("session_key", "asc")).rows.find((candidate) => candidate.session_key !== sessionKey && acpSessionRowMatchesEntry(candidate, params.entry));
		if (!row) return;
		upsertAcpSessionMetaRow(database.db, {
			...row,
			session_key: sessionKey,
			updated_at: params.now?.() ?? Date.now()
		});
		executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", row.session_key));
		repaired = true;
	}, {
		env: params.env,
		path: params.databasePath
	});
	return repaired;
}
function upsertAcpSessionMetaRow(db, row) {
	executeSqliteQuerySync(db, getAcpSessionKysely(db).insertInto("acp_sessions").values(row).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		session_id: (eb) => eb.ref("excluded.session_id"),
		backend: (eb) => eb.ref("excluded.backend"),
		agent: (eb) => eb.ref("excluded.agent"),
		runtime_session_name: (eb) => eb.ref("excluded.runtime_session_name"),
		identity_json: (eb) => eb.ref("excluded.identity_json"),
		mode: (eb) => eb.ref("excluded.mode"),
		runtime_options_json: (eb) => eb.ref("excluded.runtime_options_json"),
		cwd: (eb) => eb.ref("excluded.cwd"),
		state: (eb) => eb.ref("excluded.state"),
		last_activity_at: (eb) => eb.ref("excluded.last_activity_at"),
		last_error: (eb) => eb.ref("excluded.last_error"),
		updated_at: (eb) => eb.ref("excluded.updated_at")
	})));
}
function readAcpSessionEntry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore(params);
	if (!storeEntry.storePath) return null;
	const row = resolveReadableAcpSessionRow({
		row: selectAcpSessionRowForStoreEntry(openOpenClawStateDatabase({
			env: params.env,
			path: params.databasePath
		}).db, storeEntry.storeSessionKey, storeEntry.agentId, storeEntry.cfg, storeEntry.entry),
		entry: storeEntry.entry,
		env: params.env,
		databasePath: params.databasePath
	});
	const acp = row ? rowToAcpSessionMeta(row) : void 0;
	return {
		cfg: storeEntry.cfg,
		agentId: storeEntry.agentId,
		storePath: storeEntry.storePath,
		sessionKey,
		storeSessionKey: storeEntry.storeSessionKey,
		entry: storeEntry.entry,
		acp,
		storeReadFailed: storeEntry.storeReadFailed
	};
}
async function listAcpSessionEntries(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const rows = selectAcpSessionRows({
		env: params.env,
		path: params.databasePath
	});
	const entries = [];
	for (const row of rows) for (const databaseIdentity of parseAcpDatabaseSessionKeyCandidates(row.session_key)) {
		const sessionKey = databaseIdentity.storeSessionKey;
		const { agentId, storePath } = resolveSessionStorePathForAcp({
			sessionKey,
			agentId: databaseIdentity.agentId,
			cfg,
			env: params.env
		});
		if (!storePath) continue;
		let storeSessionKey;
		let entry;
		try {
			({storeSessionKey, entry} = resolveStoreEntryForSessionKey({
				...agentId ? { agentId } : {},
				storePath,
				sessionKey,
				...params.clone === false ? { clone: false } : {}
			}));
		} catch {
			continue;
		}
		const readableRow = resolveReadableAcpSessionRow({
			row,
			entry,
			env: params.env,
			databasePath: params.databasePath
		});
		if (!entry || !readableRow) continue;
		entries.push({
			cfg,
			agentId,
			storePath,
			sessionKey,
			storeSessionKey,
			entry,
			acp: rowToAcpSessionMeta(readableRow)
		});
		break;
	}
	return entries;
}
function mergeAcpForReturn(entry, acp) {
	return mergeSessionEntry(entry, { acp });
}
function sessionStoreUpdateOptions(params) {
	return {
		activeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey),
		...params.skipMaintenance === true ? { skipMaintenance: true } : {},
		...params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}
	};
}
async function upsertAcpSessionMeta(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore({
		sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env,
		clone: false
	});
	if (!storeEntry.storePath) return null;
	const { entry } = storeEntry;
	const storageSessionKey = storeEntry.storeSessionKey;
	const databaseSessionKey = buildAcpDatabaseSessionKey(storageSessionKey, storeEntry.agentId);
	let current;
	let currentRowKey;
	let nextMeta;
	let preparedEntry;
	const updatedAt = params.now?.() ?? Date.now();
	runOpenClawStateWriteTransaction((database) => {
		const currentRow = selectAcpSessionRowForStoreEntry(database.db, storageSessionKey, storeEntry.agentId, storeEntry.cfg, entry);
		currentRowKey = currentRow?.session_key;
		current = currentRow ? rowToAcpSessionMeta(currentRow) : void 0;
		preparedEntry = mergeSessionEntry(entry, { updatedAt });
		nextMeta = params.mutate(current, current ? mergeAcpForReturn(preparedEntry, current) : entry);
	}, {
		env: params.env,
		path: params.databasePath
	});
	const metaToPersist = nextMeta;
	if (metaToPersist === void 0) return current ? mergeAcpForReturn(entry, current) : entry ?? null;
	if (metaToPersist === null) {
		const patched = entry ? await patchSessionEntryWithKey({
			...storeEntry.agentId ? { agentId: storeEntry.agentId } : {},
			storePath: storeEntry.storePath,
			sessionKey: storageSessionKey
		}, (currentEntry) => {
			const next = { ...currentEntry };
			delete next.acp;
			return next;
		}, {
			...sessionStoreUpdateOptions({
				...params,
				sessionKey: storageSessionKey
			}),
			replaceEntry: true
		}) : null;
		runOpenClawStateWriteTransaction((database) => {
			const sessionKeysToDelete = /* @__PURE__ */ new Set([databaseSessionKey]);
			if (currentRowKey) sessionKeysToDelete.add(currentRowKey);
			if (patched?.sessionKey) sessionKeysToDelete.add(buildAcpDatabaseSessionKey(patched.sessionKey, storeEntry.agentId));
			for (const key of sessionKeysToDelete) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", key));
		}, {
			env: params.env,
			path: params.databasePath
		});
		await clearLegacyEmbeddedAcpMetadata({
			storePath: storeEntry.storePath,
			sessionKeys: [storageSessionKey, patched?.sessionKey]
		});
		return patched?.entry ?? null;
	}
	const persisted = await patchSessionEntryWithKey({
		...storeEntry.agentId ? { agentId: storeEntry.agentId } : {},
		storePath: storeEntry.storePath,
		sessionKey: storageSessionKey
	}, (currentEntry) => {
		const next = mergeSessionEntry(currentEntry, { updatedAt });
		delete next.acp;
		return next;
	}, {
		...sessionStoreUpdateOptions({
			...params,
			sessionKey: storageSessionKey
		}),
		fallbackEntry: preparedEntry,
		replaceEntry: true
	});
	if (!persisted) return null;
	await clearLegacyEmbeddedAcpMetadata({
		storePath: storeEntry.storePath,
		sessionKeys: [storageSessionKey, persisted.sessionKey]
	});
	runOpenClawStateWriteTransaction((database) => {
		const persistedDatabaseSessionKey = buildAcpDatabaseSessionKey(persisted.sessionKey, storeEntry.agentId);
		upsertAcpSessionMetaRow(database.db, bindAcpSessionMeta({
			sessionKey: persistedDatabaseSessionKey,
			sessionId: persisted.entry.sessionId,
			lifecycleRevision: persisted.entry.lifecycleRevision,
			meta: metaToPersist,
			updatedAt
		}));
		if (persistedDatabaseSessionKey !== databaseSessionKey) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", databaseSessionKey));
		if (currentRowKey && currentRowKey !== persistedDatabaseSessionKey) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", currentRowKey));
		if (persistedDatabaseSessionKey !== persisted.sessionKey) {
			const legacyRow = selectAcpSessionRow(database.db, persisted.sessionKey);
			if (legacyRow && acpSessionRowMatchesEntry(legacyRow, persisted.entry)) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", persisted.sessionKey));
		}
	}, {
		env: params.env,
		path: params.databasePath
	});
	return mergeAcpForReturn(persisted.entry, metaToPersist);
}
//#endregion
export { readAcpSessionMetaForEntry as a, writeAcpSessionMetaForMigration as c, readAcpSessionMetaBatch as i, resolveSessionStorePathForAcp as l, readAcpSessionEntry as n, repairAcpSessionMetaKeyForMigration as o, readAcpSessionMeta as r, upsertAcpSessionMeta as s, listAcpSessionEntries as t };
