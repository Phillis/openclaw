import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, x as tryResolveSoleAgentId } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BEJbbAaL.js";
import { v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-C8vnaZ56.js";
import { C as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DX1p0rnU.js";
import { N as writeSessionEntry, a as resolveAllAgentSessionStoreCandidateTargetsSync, g as deleteLegacySessionEntryRows, i as resolveAgentSessionStoreTargetsSync, x as readExactSessionEntryRow } from "./targets-CdQ3kEkv.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BhHIMU5g.js";
import { i as getSessionKysely } from "./session-accessor.sqlite-scope-kLvPv-zX.js";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BFaW8ajj.js";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-BLguUqtM.js";
import { t as importSqliteSessionRows } from "./session-accessor.sqlite-import-BferXwM5.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/legacy-main-session-migration-operations.ts
function projectEntryIdentity(entry) {
	const projected = structuredClone(entry);
	delete projected.sessionFile;
	delete projected.transcriptPath;
	return projected;
}
function digestTranscriptRows(rows) {
	let rollingHash = "";
	for (const row of rows) rollingHash = createHash("sha256").update(rollingHash).update("\0").update(row.eventJson).digest("hex");
	return {
		eventCount: rows.length,
		rollingHash
	};
}
function claimsMatch(left, right) {
	return isDeepStrictEqual(projectEntryIdentity(left.entry), projectEntryIdentity(right.entry)) && left.digest.eventCount === right.digest.eventCount && left.digest.rollingHash === right.digest.rollingHash;
}
function readClaim(database, store, key, canonicalKey) {
	const row = readExactSessionEntryRowForCanonicalRepair(database, key);
	if (!row) return;
	const transcriptRows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(["created_at", "event_json"]).where("session_id", "=", row.entry.sessionId).orderBy("seq", "asc")).rows.map((event) => ({
		createdAt: event.created_at,
		eventJson: event.event_json
	}));
	return {
		canonicalKey,
		digest: digestTranscriptRows(transcriptRows),
		entry: row.entry,
		eventRows: transcriptRows,
		key,
		store
	};
}
function samePhysicalStore(left, right) {
	return isSameOpenClawAgentDatabasePath(left.path, right.path);
}
function freshestClaim(claims) {
	return [...claims].toSorted((left, right) => {
		return (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0) || left.key.localeCompare(right.key) || left.store.path.localeCompare(right.store.path);
	})[0];
}
function warningForDivergence(kind, canonicalKey, claims) {
	return `session: ${kind} for ${canonicalKey}; preserved claims ${claims.map((claim) => `${claim.store.path}#${claim.key}`).join(", ")}. Run openclaw doctor --fix to quarantine the losing claims.`;
}
function migrateClaimsInPlace(params) {
	let committed = false;
	runOpenClawAgentWriteTransaction((database) => {
		const currentAliases = params.aliases.map((claim) => readClaim(database, params.store, claim.key, params.canonicalKey));
		const currentCanonical = params.canonical ? readClaim(database, params.store, params.canonicalKey, params.canonicalKey) : void 0;
		if (currentAliases.some((claim, index) => !claim || !claimsMatch(claim, params.aliases[index])) || params.canonical && (!currentCanonical || !claimsMatch(currentCanonical, params.canonical))) return;
		if (!currentCanonical) writeSessionEntry(database, params.canonicalKey, params.winner.entry, {
			allowStoredAliases: true,
			previousEntry: null
		});
		deleteLegacySessionEntryRows(database, params.aliases.map((claim) => claim.key), params.canonicalKey, { rehomeMembers: true });
		committed = true;
	}, {
		agentId: params.store.databaseAgentId,
		env: params.env,
		path: params.store.path
	}, { operationLabel: "session-migration.legacy-main-in-place" });
	return committed;
}
async function copyClaimCrossStore(params) {
	await importSqliteSessionRows({
		agentId: params.destination.databaseAgentId,
		env: params.env,
		storePath: params.destination.path,
		sessionKey: params.canonicalKey,
		entry: params.source.entry,
		skipIfExists: true,
		readExactTranscriptRows: (append) => {
			for (const row of params.source.eventRows) append(row);
		}
	});
	const destination = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, params.destination, params.canonicalKey, params.canonicalKey), {
		agentId: params.destination.databaseAgentId,
		env: params.env,
		path: params.destination.path
	});
	return destination.found ? destination.value : void 0;
}
async function deleteExpectedClaim(claim) {
	return (await deleteSessionEntryLifecycle({
		agentId: parseAgentSessionKey(claim.key)?.agentId,
		archiveTranscript: false,
		deleteTranscriptWithoutArchive: true,
		expectedEntry: claim.entry,
		expectedTranscript: {
			sessionId: claim.entry.sessionId,
			eventJson: claim.eventRows.map((row) => row.eventJson)
		},
		requireWriteSuccess: true,
		storePath: claim.store.path,
		target: {
			canonicalKey: claim.key,
			storeKeys: [claim.key]
		}
	})).deleted;
}
function quarantineClaim(params) {
	let quarantineKey;
	runOpenClawAgentWriteTransaction((database) => {
		const fresh = readClaim(database, params.claim.store, params.claim.key, params.claim.canonicalKey);
		if (!fresh || !claimsMatch(fresh, params.claim)) return;
		for (let index = 1;; index += 1) {
			const candidate = `agent:${params.ownerAgentId}:legacy-main-conflict-${index}`;
			if (!readExactSessionEntryRow(database, candidate)) {
				quarantineKey = candidate;
				break;
			}
		}
		writeSessionEntry(database, quarantineKey, params.claim.entry, {
			allowStoredAliases: true,
			previousEntry: null
		});
		deleteLegacySessionEntryRows(database, [params.claim.key], quarantineKey, { rehomeMembers: true });
	}, {
		agentId: params.claim.store.databaseAgentId,
		env: params.env,
		path: params.claim.store.path
	}, { operationLabel: "session-migration.legacy-main-quarantine" });
	return quarantineKey;
}
async function processIdenticalClaims(params) {
	const winner = params.canonical ?? freshestClaim(params.aliases);
	const crossStore = params.aliases.some((claim) => !samePhysicalStore(claim.store, params.destination));
	if (params.mode === "detect") return {
		kind: params.canonical ? "canonical-exists-identical" : crossStore ? "migrated-cross-store" : "migrated-in-place",
		canonicalKey: params.canonicalKey,
		paths: [...new Set(params.aliases.map((claim) => claim.store.path))],
		sourceKeys: params.aliases.map((claim) => claim.key)
	};
	let canonical = params.canonical;
	const destinationAliases = params.aliases.filter((claim) => samePhysicalStore(claim.store, params.destination));
	if (!canonical && destinationAliases.length > 0) {
		const inPlaceWinner = freshestClaim(destinationAliases);
		if (!migrateClaimsInPlace({
			aliases: destinationAliases,
			canonicalKey: params.canonicalKey,
			env: params.env,
			store: params.destination,
			winner: inPlaceWinner
		})) return {
			kind: "divergent-aliases",
			canonicalKey: params.canonicalKey,
			detail: "source aliases changed during the in-place transaction"
		};
		const result = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, params.destination, params.canonicalKey, params.canonicalKey), {
			agentId: params.destination.databaseAgentId,
			env: params.env,
			path: params.destination.path
		});
		canonical = result.found ? result.value : void 0;
	}
	if (!canonical) {
		const sourceBefore = winner;
		const copied = await copyClaimCrossStore({
			canonicalKey: params.canonicalKey,
			destination: params.destination,
			env: params.env,
			source: sourceBefore
		});
		const sourceAfter = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, sourceBefore.store, sourceBefore.key, params.canonicalKey), {
			agentId: sourceBefore.store.databaseAgentId,
			env: params.env,
			path: sourceBefore.store.path
		});
		if (!copied || !claimsMatch(copied, sourceBefore) || !sourceAfter.found || !sourceAfter.value || !claimsMatch(sourceAfter.value, sourceBefore)) return {
			kind: "divergent-canonical",
			canonicalKey: params.canonicalKey,
			detail: "source or imported canonical changed during cross-store copy verification"
		};
		canonical = copied;
	}
	if (!claimsMatch(canonical, winner)) return {
		kind: "divergent-canonical",
		canonicalKey: params.canonicalKey,
		detail: "canonical content differs from the legacy claim"
	};
	for (const claim of params.aliases) {
		if (samePhysicalStore(claim.store, params.destination)) continue;
		if (!await deleteExpectedClaim(claim)) return {
			kind: "divergent-canonical",
			canonicalKey: params.canonicalKey,
			detail: `source changed before expected-entry cleanup: ${claim.store.path}#${claim.key}`
		};
	}
	if (params.canonical && destinationAliases.length > 0) {
		if (!migrateClaimsInPlace({
			aliases: destinationAliases,
			canonical: params.canonical,
			canonicalKey: params.canonicalKey,
			env: params.env,
			store: params.destination,
			winner: params.canonical
		})) return {
			kind: "divergent-canonical",
			canonicalKey: params.canonicalKey,
			detail: "canonical or aliases changed during in-place cleanup"
		};
	}
	return {
		kind: params.canonical ? "canonical-exists-identical" : crossStore ? "migrated-cross-store" : "migrated-in-place",
		canonicalKey: params.canonicalKey,
		paths: [...new Set(params.aliases.map((claim) => claim.store.path))],
		sourceKeys: params.aliases.map((claim) => claim.key)
	};
}
async function repairDivergentClaims(params) {
	const winner = params.destinationCanonical ?? freshestClaim(params.claims);
	if (!params.destinationCanonical) {
		const migrated = await processIdenticalClaims({
			aliases: [winner],
			canonicalKey: params.canonicalKey,
			destination: params.destination,
			env: params.env,
			mode: "automatic"
		});
		if (migrated.kind === "divergent-aliases" || migrated.kind === "divergent-canonical") return {
			quarantinedKeys: [],
			resolved: false
		};
	}
	const canonicalResult = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, params.destination, params.canonicalKey, params.canonicalKey), {
		agentId: params.destination.databaseAgentId,
		env: params.env,
		path: params.destination.path
	});
	const canonical = canonicalResult.found ? canonicalResult.value : void 0;
	if (!canonical || !claimsMatch(canonical, winner)) return {
		quarantinedKeys: [],
		resolved: false
	};
	const quarantinedKeys = [];
	for (const claim of params.claims) {
		if (claim === winner || claim === params.destinationCanonical) continue;
		if (claimsMatch(claim, canonical)) {
			if (!(samePhysicalStore(claim.store, params.destination) ? migrateClaimsInPlace({
				aliases: [claim],
				canonical,
				canonicalKey: params.canonicalKey,
				env: params.env,
				store: params.destination,
				winner: canonical
			}) : await deleteExpectedClaim(claim))) return {
				quarantinedKeys,
				resolved: false
			};
			continue;
		}
		const quarantineKey = quarantineClaim({
			claim,
			env: params.env,
			ownerAgentId: params.ownerAgentId
		});
		if (!quarantineKey) return {
			quarantinedKeys,
			resolved: false
		};
		quarantinedKeys.push(quarantineKey);
	}
	return {
		quarantinedKeys,
		resolved: true
	};
}
//#endregion
//#region src/config/sessions/legacy-main-session-migration.ts
const SOURCE_KEY = "legacy-main-session-keys";
const MIGRATION_KIND = "legacy-main-session-keys-v1";
const REPORT_VERSION = 1;
function resolveArmingDecision(cfg, legacyAgentId) {
	const roster = new Set(listAgentIds(cfg).map(normalizeAgentId));
	if (roster.has(legacyAgentId)) return {
		armed: false,
		reason: "legacy-agent-present"
	};
	const sole = tryResolveSoleAgentId(cfg);
	if (sole && roster.has(normalizeAgentId(sole))) return {
		armed: true,
		ownerAgentId: normalizeAgentId(sole)
	};
	const sessionStoreOwner = cfg.agents?.defaults?.sessionStore?.agentId?.trim();
	if (sessionStoreOwner) {
		const normalized = normalizeAgentId(sessionStoreOwner);
		if (roster.has(normalized)) return {
			armed: true,
			ownerAgentId: normalized
		};
	}
	return {
		armed: false,
		reason: "owner-unresolved"
	};
}
function canonicalKeyFor(key, legacyAgentId, ownerAgentId) {
	const parsed = parseAgentSessionKey(key);
	if (!parsed || normalizeAgentId(parsed.agentId) !== legacyAgentId) return null;
	const prefix = `agent:${parsed.agentId}:`;
	return key.startsWith(prefix) ? `agent:${ownerAgentId}:${key.slice(prefix.length)}` : null;
}
function addPhysicalStore(stores, candidate) {
	if (!stores.some((store) => samePhysicalStore(store, candidate))) stores.push(candidate);
}
function inspectPath(pathname) {
	let entry;
	try {
		entry = fs.lstatSync(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return "missing";
		throw error;
	}
	if (!(entry.isSymbolicLink() ? fs.statSync(pathname) : entry).isFile()) throw new Error(`session store is not a regular file: ${pathname}`);
	return "present";
}
function resolveMissingPhysicalPath(pathname) {
	let current = path.resolve(pathname);
	const suffix = [];
	while (true) try {
		return path.join(fs.realpathSync.native(current), ...suffix);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		const parent = path.dirname(current);
		if (parent === current) return path.resolve(current, ...suffix);
		suffix.unshift(path.basename(current));
		current = parent;
	}
}
function resolvePhysicalPathIdentity(pathname) {
	try {
		const stat = fs.statSync(pathname, { bigint: true });
		if (!stat.isFile()) throw new Error(`session store is not a regular file: ${pathname}`);
		return `file:${stat.dev}:${stat.ino}`;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		return `missing:${resolveMissingPhysicalPath(pathname)}`;
	}
}
function resolvePhysicalStores(params) {
	const logicalTargets = [
		...resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env }),
		...resolveAgentSessionStoreTargetsSync(params.cfg, params.legacyAgentId, { env: params.env }),
		{
			agentId: params.legacyAgentId,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
				agentId: params.legacyAgentId,
				env: params.env
			})
		},
		{
			agentId: params.ownerAgentId,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
				agentId: params.ownerAgentId,
				env: params.env
			})
		}
	];
	const stores = [];
	const jsonPaths = /* @__PURE__ */ new Set();
	const unreadable = [];
	for (const target of logicalTargets) try {
		if (!target.storePath.endsWith(".sqlite") && inspectPath(target.storePath) === "present") jsonPaths.add(path.resolve(target.storePath));
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId: params.ownerAgentId,
			env: params.env
		});
		const physical = {
			databaseAgentId: normalizeAgentId(resolved.agentId ?? target.agentId),
			path: resolved.path
		};
		resolvePhysicalPathIdentity(physical.path);
		addPhysicalStore(stores, physical);
	} catch (error) {
		if (params.mode === "doctor-fix") throw new Error(`cannot inspect legacy session store ${target.storePath}: ${String(error)}`, { cause: error });
		unreadable.push({
			kind: "store-unreadable",
			detail: String(error),
			paths: [target.storePath]
		});
	}
	return {
		jsonPaths: [...jsonPaths],
		stores,
		unreadable
	};
}
function resolveSourceLayout(resolved) {
	return [.../* @__PURE__ */ new Set([...resolved.stores.map((store) => `sqlite:${store.databaseAgentId}:${resolvePhysicalPathIdentity(store.path)}`), ...resolved.jsonPaths.map((pathname) => `json:${resolvePhysicalPathIdentity(pathname)}`)])].toSorted();
}
function readClaimsFromStore(params) {
	if (inspectPath(params.store.path) === "missing") return {
		canonical: [],
		legacy: []
	};
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const keys = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key")).rows.map((row) => row.session_key);
		const legacy = [];
		const canonical = [];
		for (const key of keys) {
			const canonicalKey = canonicalKeyFor(key, params.legacyAgentId, params.ownerAgentId);
			if (canonicalKey) {
				const claim = readClaim(database, params.store, key, canonicalKey);
				if (claim) legacy.push(claim);
				continue;
			}
			const parsed = parseAgentSessionKey(key);
			if (parsed && normalizeAgentId(parsed.agentId) === params.ownerAgentId) {
				const claim = readClaim(database, params.store, key, key);
				if (claim) canonical.push(claim);
			}
		}
		return {
			canonical,
			legacy
		};
	}, {
		agentId: params.store.databaseAgentId,
		env: params.env,
		path: params.store.path
	});
	return result.found ? result.value : {
		canonical: [],
		legacy: []
	};
}
function readLedger(env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select(["report_json", "status"]).where("source_key", "=", SOURCE_KEY));
		if (!row) return;
		try {
			const parsed = JSON.parse(row.report_json);
			if (!isRecord(parsed) || parsed.version !== REPORT_VERSION || typeof parsed.legacyAgentId !== "string" || typeof parsed.mainKey !== "string" || typeof parsed.ownerAgentId !== "string" || !Array.isArray(parsed.outcomes) || !Array.isArray(parsed.sourceLayout) || parsed.sourceLayout.some((entry) => typeof entry !== "string") || parsed.status !== "complete") return;
			return {
				report: parsed,
				status: row.status
			};
		} catch {
			return;
		}
	}, { env }) ?? void 0;
}
function ledgerMatches(ledger, identity) {
	return ledger?.status === "completed" && ledger.report.version === REPORT_VERSION && ledger.report.status === "complete" && ledger.report.legacyAgentId === identity.legacyAgentId && ledger.report.ownerAgentId === identity.ownerAgentId && ledger.report.mainKey === identity.mainKey && ledger.report.sourceLayout.length === identity.sourceLayout.length && ledger.report.sourceLayout.every((entry, index) => entry === identity.sourceLayout[index]);
}
function writeLedger(params) {
	const report = {
		version: REPORT_VERSION,
		...params.identity,
		outcomes: params.outcomes,
		status: "complete"
	};
	const reportJson = JSON.stringify(report);
	const identityHash = createHash("sha256").update(JSON.stringify(params.identity)).digest("hex");
	const runId = `${SOURCE_KEY}:${identityHash.slice(0, 24)}`;
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.insertInto("migration_runs").values({
			id: runId,
			started_at: params.now,
			finished_at: params.now,
			status: "completed",
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("id").doUpdateSet({
			finished_at: params.now,
			status: "completed",
			report_json: reportJson
		})));
		executeSqliteQuerySync(db, kysely.insertInto("migration_sources").values({
			source_key: SOURCE_KEY,
			migration_kind: MIGRATION_KIND,
			source_path: params.stateDir,
			target_table: "session_nodes",
			source_sha256: identityHash,
			source_size_bytes: null,
			source_record_count: params.outcomes.length,
			last_run_id: runId,
			status: "completed",
			imported_at: params.now,
			removed_source: 1,
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("source_key").doUpdateSet({
			source_path: params.stateDir,
			source_sha256: identityHash,
			source_record_count: params.outcomes.length,
			last_run_id: runId,
			status: "completed",
			imported_at: params.now,
			removed_source: 1,
			report_json: reportJson
		})));
	}, { env: params.env }, { operationLabel: "session-migration.legacy-main-ledger" });
}
/** Migrates retired agent-owned session keys without adding runtime read aliases. */
async function migrateLegacyMainSessionKeysInternal(params) {
	const env = params.env ?? process.env;
	const legacyAgentId = normalizeAgentId(params.legacyAgentId ?? "main");
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const arming = resolveArmingDecision(params.cfg, legacyAgentId);
	const base = {
		changes: [],
		legacyAgentId,
		mainKey,
		warnings: []
	};
	if (!arming.armed) {
		const unresolved = arming.reason === "owner-unresolved";
		return {
			...base,
			armed: false,
			complete: false,
			ledgerComplete: false,
			outcomes: [{
				kind: "not-armed",
				detail: arming.reason
			}],
			warnings: unresolved ? [`session: legacy ${legacyAgentId} rows have no unambiguous configured owner; preserve them and run openclaw doctor after assigning agents.defaults.sessionStore.agentId`] : []
		};
	}
	const ownerAgentId = arming.ownerAgentId;
	const resolved = resolvePhysicalStores({
		cfg: params.cfg,
		env,
		legacyAgentId,
		mode: params.mode,
		ownerAgentId
	});
	const outcomes = [...resolved.jsonPaths.map((pathname) => ({
		kind: "legacy-json-store",
		paths: [pathname],
		detail: "Doctor must migrate JSON sessions to SQLite before legacy-main key migration"
	})), ...resolved.unreadable];
	const warnings = [...base.warnings];
	for (const unreadable of resolved.unreadable) warnings.push(`session: could not inspect ${unreadable.paths?.[0] ?? "session store"}: ${unreadable.detail ?? "unknown error"}`);
	for (const pathname of resolved.jsonPaths) warnings.push(`session: deferred legacy-main session migration for JSON store ${pathname}; run openclaw doctor --fix`);
	const identityBase = {
		legacyAgentId,
		mainKey,
		ownerAgentId
	};
	const identity = {
		...identityBase,
		sourceLayout: resolveSourceLayout(resolved)
	};
	let matchingCompletedLedger = false;
	if (params.mode !== "doctor-fix" && outcomes.length === 0) try {
		if (ledgerMatches(readLedger(env), identity)) {
			matchingCompletedLedger = true;
			if (!params.forceScan) return {
				...base,
				armed: true,
				complete: true,
				ledgerComplete: true,
				ownerAgentId,
				outcomes: [{
					kind: "no-legacy-rows",
					detail: "matching completed ledger"
				}]
			};
		}
	} catch (error) {
		return {
			...base,
			armed: true,
			complete: false,
			ledgerComplete: false,
			ownerAgentId,
			outcomes: [{
				kind: "store-unreadable",
				detail: String(error)
			}],
			warnings: [`session: could not read the legacy-main migration ledger: ${String(error)}`]
		};
	}
	const allLegacy = [];
	const allCanonical = [];
	for (const store of resolved.stores) try {
		const claims = readClaimsFromStore({
			env,
			legacyAgentId,
			ownerAgentId,
			store
		});
		allLegacy.push(...claims.legacy);
		allCanonical.push(...claims.canonical);
	} catch (error) {
		if (params.mode === "doctor-fix") throw new Error(`cannot read legacy session store ${store.path}: ${String(error)}`, { cause: error });
		outcomes.push({
			kind: "store-unreadable",
			detail: String(error),
			paths: [store.path]
		});
		warnings.push(`session: could not inspect ${store.path}: ${String(error)}`);
	}
	const inspectionBlocked = outcomes.some((outcome) => outcome.kind === "legacy-json-store" || outcome.kind === "store-unreadable");
	const operationMode = params.mode === "automatic" && inspectionBlocked ? "detect" : params.mode;
	const destinationResolved = resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathCore(params.cfg.session?.store, {
		agentId: ownerAgentId,
		env
	}), {
		agentId: ownerAgentId,
		defaultAgentId: ownerAgentId,
		env
	});
	const destination = resolved.stores.find((store) => isSameOpenClawAgentDatabasePath(store.path, destinationResolved.path)) ?? {
		databaseAgentId: normalizeAgentId(destinationResolved.agentId ?? ownerAgentId),
		path: destinationResolved.path
	};
	const byCanonical = /* @__PURE__ */ new Map();
	for (const claim of allLegacy) {
		const claims = byCanonical.get(claim.canonicalKey) ?? [];
		claims.push(claim);
		byCanonical.set(claim.canonicalKey, claims);
	}
	for (const [canonicalKey, aliases] of byCanonical) {
		const canonicalClaims = allCanonical.filter((claim) => claim.key === canonicalKey);
		const destinationCanonical = canonicalClaims.find((claim) => samePhysicalStore(claim.store, destination));
		const foreignCanonical = canonicalClaims.filter((claim) => !samePhysicalStore(claim.store, destination));
		const aliasesIdentical = aliases.every((claim) => claimsMatch(claim, aliases[0]));
		const canonicalMatches = destinationCanonical ? aliases.every((claim) => claimsMatch(claim, destinationCanonical)) : false;
		if (foreignCanonical.length > 0 || destinationCanonical && !canonicalMatches) {
			const divergentClaims = [...canonicalClaims, ...aliases];
			const outcome = {
				kind: "divergent-canonical",
				canonicalKey,
				paths: [...new Set(divergentClaims.map((claim) => claim.store.path))],
				sourceKeys: divergentClaims.map((claim) => claim.key)
			};
			if (params.mode === "doctor-fix") {
				const repaired = await repairDivergentClaims({
					canonicalKey,
					claims: divergentClaims,
					destination,
					...destinationCanonical ? { destinationCanonical } : {},
					env,
					ownerAgentId
				});
				outcome.quarantinedKeys = repaired.quarantinedKeys;
				if (repaired.resolved) outcome.resolved = true;
				else warnings.push(warningForDivergence("divergent-canonical", canonicalKey, divergentClaims));
			} else warnings.push(warningForDivergence("divergent-canonical", canonicalKey, divergentClaims));
			outcomes.push(outcome);
			continue;
		}
		if (!aliasesIdentical) {
			const outcome = {
				kind: "divergent-aliases",
				canonicalKey,
				paths: [...new Set(aliases.map((claim) => claim.store.path))],
				sourceKeys: aliases.map((claim) => claim.key)
			};
			if (params.mode === "doctor-fix") {
				const repaired = await repairDivergentClaims({
					canonicalKey,
					claims: aliases,
					destination,
					env,
					ownerAgentId
				});
				outcome.quarantinedKeys = repaired.quarantinedKeys;
				if (repaired.resolved) outcome.resolved = true;
				else warnings.push(warningForDivergence("divergent-aliases", canonicalKey, aliases));
			} else warnings.push(warningForDivergence("divergent-aliases", canonicalKey, aliases));
			outcomes.push(outcome);
			continue;
		}
		const outcome = await processIdenticalClaims({
			aliases,
			...destinationCanonical ? { canonical: destinationCanonical } : {},
			canonicalKey,
			destination,
			env,
			mode: operationMode
		});
		outcomes.push(outcome);
		if (outcome.kind === "divergent-aliases" || outcome.kind === "divergent-canonical") warnings.push(warningForDivergence(outcome.kind, canonicalKey, aliases));
	}
	if (allLegacy.length === 0 && outcomes.length === 0) outcomes.push({ kind: "no-legacy-rows" });
	const complete = !outcomes.some((outcome) => outcome.kind === "legacy-json-store" || outcome.kind === "store-unreadable" || (outcome.kind === "divergent-aliases" || outcome.kind === "divergent-canonical") && outcome.resolved !== true);
	const changes = operationMode === "detect" ? [] : outcomes.flatMap((outcome) => outcome.kind === "migrated-in-place" || outcome.kind === "migrated-cross-store" || outcome.kind === "canonical-exists-identical" ? [`Migrated legacy ${legacyAgentId} session claim ${outcome.canonicalKey}.`] : outcome.quarantinedKeys?.length ? [`Quarantined ${outcome.quarantinedKeys.length} legacy ${legacyAgentId} session conflict(s).`] : []);
	if (complete && params.mode !== "detect") writeLedger({
		env,
		identity: {
			...identityBase,
			sourceLayout: resolveSourceLayout(resolved)
		},
		now: params.now?.() ?? Date.now(),
		outcomes,
		stateDir: resolveStateDir(env)
	});
	return {
		armed: true,
		changes,
		complete,
		ledgerComplete: complete && (params.mode !== "detect" || matchingCompletedLedger && allLegacy.length === 0),
		legacyAgentId,
		mainKey,
		outcomes,
		ownerAgentId,
		warnings
	};
}
async function migrateLegacyMainSessionKeys(params) {
	try {
		return await migrateLegacyMainSessionKeysInternal(params);
	} catch (error) {
		if (params.mode === "doctor-fix") throw error;
		const legacyAgentId = normalizeAgentId(params.legacyAgentId ?? "main");
		const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
		const arming = resolveArmingDecision(params.cfg, legacyAgentId);
		return {
			armed: arming.armed,
			changes: [],
			complete: false,
			ledgerComplete: false,
			legacyAgentId,
			mainKey,
			outcomes: [{
				kind: "store-unreadable",
				detail: String(error)
			}],
			...arming.armed ? { ownerAgentId: arming.ownerAgentId } : {},
			warnings: [`session: legacy-main session migration deferred: ${String(error)}`]
		};
	}
}
//#endregion
export { migrateLegacyMainSessionKeys as t };
