import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { i as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DqCM942-.js";
import { t as acquireFileLockSyncWithRetry } from "./file-lock-sync-D8NfUppY.js";
import { c as resolveSharedMainAuthAgentDir, o as resolveSharedAuthStoreOwnership, s as resolveSharedAuthStorePath } from "./path-resolve-DH_naXF5.js";
import { a as inspectPersistedAuthProfileStoreRaw, c as readPersistedAuthProfileStateRaw, h as runAuthProfileWriteTransaction, i as inspectPersistedAuthProfileStateRaw, m as resolveAuthProfileDatabasePath, o as inspectPersistedSharedAuthProfileStateRaw, s as inspectPersistedSharedAuthProfileStoreRaw, u as readPersistedSharedAuthProfileStateRaw } from "./sqlite-R6lp3fio.js";
import { a as clearAuthProfileMigrationDiagnostics, p as resolveLegacyOAuthPath, u as listLegacyAuthProfileArchives } from "./legacy-source-diagnostic-oIpndhGF.js";
import { _ as areOAuthCredentialsEquivalent, a as loadPersistedAuthProfileStore, c as parseLegacyCredentialEntry, i as coercePersistedAuthProfileStore, o as loadPersistedSharedAuthProfileStore, r as coerceLegacyAuthStore, t as applyLegacyAuthStore, u as coerceAuthProfileState, v as hasMatchingOAuthIdentity } from "./persisted-BaBq9UBI.js";
import { n as clearRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-0_SaNWbX.js";
import { t as loadJsonFileThroughSymlink } from "./json-file-C59d_t6b.js";
import { C as isInheritedMainOAuthCredentialFromStores, v as saveAuthProfileStore } from "./store-DOJuehrg.js";
import { t as note } from "./note-D7f3pYFE.js";
import { i as resolveLegacyFlatAuthPath, n as resolveLegacyAuthProfilesPath, r as resolveLegacyAuthStatePath, t as listAuthProfileRepairCandidates } from "./doctor-auth-legacy-paths-X-cjKZhe.js";
import { a as recordLegacyMigrationRun, n as readLegacyMigrationReceipt, o as recordLegacyMigrationSource } from "./state-migrations.receipts-BeM1W-qr.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor-auth-migration-receipts.ts
const MIGRATION_KIND = "auth-profile-json-to-sqlite-v2";
function digestBytes(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}
function createAuthProfileMigrationSourceReceipt(params) {
	const sourcePath = path.resolve(params.sourcePath);
	const sourceSha256 = digestBytes(params.sourceBytes);
	const sourceKey = `auth-profile-v2:${digestBytes(Buffer.from(`${sourcePath}\0${sourceSha256}`))}`;
	const stamp = (params.now ?? /* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-");
	return {
		sourceKey,
		runId: `${sourceKey}:${randomUUID()}`,
		sourcePath,
		sourceSha256,
		sourceSizeBytes: params.sourceBytes.byteLength,
		sourceRecordCount: params.sourceRecordCount,
		sourceBytes: Buffer.from(params.sourceBytes),
		targetDatabasePath: path.resolve(params.targetDatabasePath),
		targetTable: params.targetTable,
		...params.targetStoreKey ? { targetStoreKey: params.targetStoreKey } : {},
		archivePath: `${sourcePath}.migrated-${stamp}-${randomUUID()}`,
		...params.env ? { env: params.env } : {}
	};
}
function reportJson(receipt) {
	return JSON.stringify({
		format: MIGRATION_KIND,
		archivePath: receipt.archivePath,
		targetDatabasePath: receipt.targetDatabasePath,
		targetTable: receipt.targetTable,
		targetStoreKey: receipt.targetStoreKey ?? "primary",
		expectedProfileSha256: receipt.expectedProfileSha256,
		expectedStateSha256: receipt.expectedStateSha256,
		completionStatus: receipt.completionStatus ?? "completed"
	});
}
function digestAuthProfileMigrationValue(value) {
	return digestBytes(Buffer.from(JSON.stringify(value) ?? "<undefined>"));
}
function recordAuthProfileMigrationImported(receipt, now = Date.now()) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const existing = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select(["last_run_id", "status"]).where("source_key", "=", receipt.sourceKey));
		if (existing && existing.last_run_id !== receipt.runId && existing.status !== "retryable" && existing.status !== "superseded") throw new Error(`auth profile migration source already owned by ${existing.status} receipt`);
		const report = reportJson(receipt);
		recordLegacyMigrationRun(db, {
			runId: receipt.runId,
			startedAt: now,
			finishedAt: null,
			status: "imported",
			reportJson: report,
			upsert: true
		});
		recordLegacyMigrationSource(db, {
			sourceKey: receipt.sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: receipt.sourcePath,
			targetTable: receipt.targetTable,
			sourceSha256: receipt.sourceSha256,
			sourceSizeBytes: receipt.sourceSizeBytes,
			sourceRecordCount: receipt.sourceRecordCount,
			runId: receipt.runId,
			status: "imported",
			importedAt: now,
			reportJson: report,
			upsert: true
		});
	}, { env: receipt.env });
}
function retirePendingAuthProfileMigrationReceipt(receipt, status, now = Date.now()) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("migration_runs").set({
			status,
			finished_at: now
		}).where("id", "=", receipt.runId).where("status", "=", "imported"));
		executeSqliteQuerySync(db, kysely.updateTable("migration_sources").set({ status }).where("source_key", "=", receipt.sourceKey).where("last_run_id", "=", receipt.runId).where("status", "=", "imported"));
	}, { env: receipt.env });
}
function restoreAuthProfileMigrationArchiveNoClobber(receipt) {
	try {
		fs.linkSync(receipt.archivePath, receipt.sourcePath);
	} catch (error) {
		if (error.code === "EEXIST") return "source-exists";
		throw error;
	}
	fs.unlinkSync(receipt.archivePath);
	return "restored";
}
function recordAuthProfileMigrationCompleted(receipt, now = Date.now(), status = "completed") {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("migration_runs").set({
			status,
			finished_at: now
		}).where("id", "=", receipt.runId));
		executeSqliteQuerySync(db, kysely.updateTable("migration_sources").set({
			status,
			removed_source: 1
		}).where("source_key", "=", receipt.sourceKey).where("last_run_id", "=", receipt.runId));
	}, { env: receipt.env });
}
function archiveAuthProfileMigrationSource(receipt) {
	if (fs.existsSync(receipt.sourcePath)) {
		if (digestBytes(fs.readFileSync(receipt.sourcePath)) !== receipt.sourceSha256) throw new Error("legacy auth source changed after verification");
		fs.renameSync(receipt.sourcePath, receipt.archivePath);
	}
	if (digestBytes(fs.readFileSync(receipt.archivePath)) !== receipt.sourceSha256) throw new Error("legacy auth archive verification failed");
}
function acquireAuthProfileMigrationSourceLocks(sourcePaths) {
	const releases = [];
	try {
		for (const sourcePath of [...new Set(sourcePaths.map((entry) => path.resolve(entry)))].toSorted()) releases.push(acquireFileLockSyncWithRetry(sourcePath));
	} catch (error) {
		for (const release of releases.toReversed()) release();
		throw error;
	}
	return () => {
		for (const release of releases.toReversed()) release();
	};
}
function verifyAuthProfileMigrationTarget(receipt) {
	const hasExpectedProfiles = Object.keys(receipt.expectedProfileSha256 ?? {}).length > 0;
	if (!hasExpectedProfiles && !receipt.expectedStateSha256) return;
	const db = openNodeSqliteDatabase(receipt.targetDatabasePath, { readOnly: true });
	try {
		const targetStoreKey = receipt.targetStoreKey ?? "primary";
		if (hasExpectedProfiles && receipt.expectedProfileSha256) {
			const row = targetStoreKey === "shared" ? executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("auth_profile_stores").select("store_json").where("store_key", "=", "shared")) : executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", "primary"));
			const store = typeof row?.store_json === "string" ? JSON.parse(row.store_json) : null;
			for (const [profileId, expectedSha256] of Object.entries(receipt.expectedProfileSha256)) if (digestAuthProfileMigrationValue(store?.profiles?.[profileId]) !== expectedSha256) throw new Error("auth profile migration target verification failed");
		}
		if (receipt.expectedStateSha256) {
			const row = targetStoreKey === "shared" ? executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("auth_profile_state").select("state_json").where("store_key", "=", "shared")) : executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", "primary"));
			if (digestAuthProfileMigrationValue(typeof row?.state_json === "string" ? JSON.parse(row.state_json) : null) !== receipt.expectedStateSha256) throw new Error("auth profile migration target verification failed");
		}
	} finally {
		db.close();
	}
}
function finalizeAuthProfileMigrationSource(receipt, status = "completed", options = {}) {
	receipt.completionStatus = status;
	const release = options.sourceLocked ? void 0 : acquireFileLockSyncWithRetry(receipt.sourcePath);
	try {
		recordAuthProfileMigrationImported(receipt);
		verifyAuthProfileMigrationTarget(receipt);
		archiveAuthProfileMigrationSource(receipt);
		recordAuthProfileMigrationCompleted(receipt, Date.now(), status);
	} finally {
		release?.();
	}
}
function resumePendingAuthProfileMigrationArchives(env) {
	const changes = [];
	const database = openOpenClawStateDatabase({ env });
	const kysely = getNodeSqliteKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources as source").innerJoin("migration_runs as run", "run.id", "source.last_run_id").select([
		"source.source_key",
		"source.source_path",
		"source.source_sha256",
		"source.source_size_bytes",
		"source.source_record_count",
		"source.target_table",
		"source.last_run_id",
		"source.report_json"
	]).where("source.migration_kind", "=", MIGRATION_KIND).where("source.status", "=", "imported").where("source.removed_source", "=", 0)).rows;
	for (const row of rows) {
		const report = JSON.parse(row.report_json);
		if (typeof row.source_sha256 !== "string" || typeof row.source_size_bytes !== "number" || typeof row.source_record_count !== "number" || typeof report.archivePath !== "string" || typeof report.targetDatabasePath !== "string" || row.target_table !== "auth_profile_store" && row.target_table !== "auth_profile_stores" && row.target_table !== "auth_profile_state") throw new Error("invalid pending auth profile migration receipt");
		const receipt = {
			sourceKey: row.source_key,
			runId: row.last_run_id,
			sourcePath: row.source_path,
			sourceSha256: row.source_sha256,
			sourceSizeBytes: row.source_size_bytes,
			sourceRecordCount: row.source_record_count,
			targetDatabasePath: report.targetDatabasePath,
			targetTable: row.target_table,
			targetStoreKey: report.targetStoreKey === "shared" ? "shared" : "primary",
			archivePath: report.archivePath,
			...isStringRecord(report.expectedProfileSha256) ? { expectedProfileSha256: report.expectedProfileSha256 } : {},
			...typeof report.expectedStateSha256 === "string" ? { expectedStateSha256: report.expectedStateSha256 } : {},
			completionStatus: report.completionStatus === "archived-unparsed" ? "archived-unparsed" : "completed",
			...env ? { env } : {}
		};
		if (!fs.existsSync(receipt.sourcePath) && !fs.existsSync(receipt.archivePath)) throw new Error("pending auth profile migration has neither source nor archive");
		const release = acquireFileLockSyncWithRetry(fs.existsSync(receipt.sourcePath) ? receipt.sourcePath : receipt.archivePath);
		try {
			const sourceExists = fs.existsSync(receipt.sourcePath);
			if (sourceExists) {
				if (digestBytes(fs.readFileSync(receipt.sourcePath)) !== receipt.sourceSha256) {
					retirePendingAuthProfileMigrationReceipt(receipt, "superseded");
					changes.push("Retired an interrupted auth migration receipt for a changed source.");
					continue;
				}
			} else if (digestBytes(fs.readFileSync(receipt.archivePath)) !== receipt.sourceSha256) throw new Error("legacy auth archive verification failed");
			try {
				verifyAuthProfileMigrationTarget(receipt);
			} catch {
				if (!sourceExists) {
					if (restoreAuthProfileMigrationArchiveNoClobber(receipt) === "source-exists") {
						const status = digestBytes(fs.readFileSync(receipt.sourcePath)) === receipt.sourceSha256 ? "retryable" : "superseded";
						retirePendingAuthProfileMigrationReceipt(receipt, status);
						changes.push(status === "retryable" ? "Reset an interrupted auth migration receipt for retry." : "Retired an interrupted auth migration receipt for a changed source.");
						continue;
					}
				}
				retirePendingAuthProfileMigrationReceipt(receipt, "retryable");
				changes.push("Reset an interrupted auth migration receipt for retry.");
				continue;
			}
			archiveAuthProfileMigrationSource(receipt);
			recordAuthProfileMigrationCompleted(receipt, Date.now(), receipt.completionStatus ?? "completed");
		} finally {
			release();
		}
		changes.push(`Finalized interrupted auth profile archive -> ${receipt.archivePath}`);
	}
	return changes;
}
function hasTerminalAuthProfileMigrationReceipt(sourceKey, env) {
	const database = openOpenClawStateDatabase({ env });
	const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("migration_sources").select("status").where("source_key", "=", sourceKey));
	return row?.status === "completed" || row?.status === "archived-unparsed";
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.authProfileMigrationReceiptsTestApi")] = {
	recordAuthProfileMigrationImported,
	recordAuthProfileMigrationCompleted,
	restoreAuthProfileMigrationArchiveNoClobber
};
//#endregion
//#region src/commands/doctor-auth-flat-profiles.ts
/** Doctor repairs for legacy auth profile JSON stores and OpenAI provider-id migrations. */
function resolveMigrationTargetDatabasePath(agentDir, env = process.env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
var AuthProfileMigrationVerificationError = class extends Error {
	constructor(detail) {
		super("auth profile SQLite verification failed");
		this.detail = detail;
		this.name = "AuthProfileMigrationVerificationError";
	}
};
const UNSAFE_LEGACY_AUTH_PROFILE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isSafeLegacyProviderKey(key) {
	return key.trim().length > 0 && !UNSAFE_LEGACY_AUTH_PROFILE_KEYS.has(key);
}
function extractProviderFromProfileId(profileId) {
	const colon = profileId.indexOf(":");
	if (colon <= 0) return;
	return readNonBlankString(profileId.slice(0, colon));
}
function extractProviderFromModelRef(modelRef) {
	const { model } = splitTrailingAuthProfile(modelRef);
	const slash = model.indexOf("/");
	if (slash <= 0) return;
	return readNonBlankString(model.slice(0, slash));
}
function collectLegacyConfigAuthProfileProviderHints(cfg) {
	const hints = /* @__PURE__ */ new Map();
	const conflicted = /* @__PURE__ */ new Set();
	const addHint = (profileId, provider) => {
		const existing = hints.get(profileId);
		if (existing && existing !== provider) {
			hints.delete(profileId);
			conflicted.add(profileId);
			return;
		}
		if (!conflicted.has(profileId)) hints.set(profileId, provider);
	};
	const addModelHints = (models) => {
		if (!isRecord(models)) return;
		for (const [modelRef, rawModel] of Object.entries(models)) {
			const provider = extractProviderFromModelRef(modelRef);
			if (!provider || !isSafeLegacyProviderKey(provider) || !isRecord(rawModel)) continue;
			const agentRuntime = isRecord(rawModel.agentRuntime) ? rawModel.agentRuntime : null;
			const authProfileId = agentRuntime ? readNonBlankString(agentRuntime.authProfileId) : void 0;
			if (authProfileId) addHint(authProfileId, provider);
		}
	};
	for (const { value } of collectConfiguredModelRefs(cfg)) {
		const { profile } = splitTrailingAuthProfile(value);
		const provider = extractProviderFromModelRef(value);
		if (profile && provider && isSafeLegacyProviderKey(provider)) addHint(profile, provider);
	}
	const root = cfg;
	const auth = isRecord(root.auth) ? root.auth : null;
	const order = auth && isRecord(auth.order) ? auth.order : null;
	if (order) for (const [provider, profileIds] of Object.entries(order)) {
		if (!isSafeLegacyProviderKey(provider) || !Array.isArray(profileIds)) continue;
		for (const profileId of profileIds) {
			const normalizedProfileId = readNonBlankString(profileId);
			if (normalizedProfileId) addHint(normalizedProfileId, provider);
		}
	}
	const agents = isRecord(root.agents) ? root.agents : null;
	addModelHints((agents && isRecord(agents.defaults) ? agents.defaults : null)?.models);
	const agentList = agents && Array.isArray(agents.list) ? agents.list : [];
	for (const agent of agentList) if (isRecord(agent)) addModelHints(agent.models);
	return hints;
}
function inferLegacyCredentialType(record) {
	const explicit = readNonBlankString(record.type) ?? readNonBlankString(record.mode);
	if (explicit === "api_key" || explicit === "token" || explicit === "oauth") return explicit;
	if (readNonBlankString(record.key) ?? readNonBlankString(record.apiKey)) return "api_key";
	if (coerceSecretRef(record.keyRef)) return "api_key";
	if (readNonBlankString(record.token)) return "token";
	if (coerceSecretRef(record.tokenRef)) return "token";
	if (readNonBlankString(record.access) && readNonBlankString(record.refresh) && typeof record.expires === "number") return "oauth";
}
function coerceLegacyFlatCredential(providerId, raw) {
	if (!isRecord(raw)) return null;
	const type = inferLegacyCredentialType(raw);
	if (!type) return null;
	const provider = readNonBlankString(raw.provider) ?? providerId;
	const credential = parseLegacyCredentialEntry({
		...raw,
		type,
		provider
	}, providerId);
	if (!credential || !hasUsableAuthProfileCredential(credential)) return null;
	return credential;
}
function coerceLegacyFlatAuthProfileStore(raw) {
	if (!isRecord(raw) || "profiles" in raw) return null;
	const store = {
		version: 1,
		profiles: {}
	};
	for (const [key, value] of Object.entries(raw)) {
		const providerId = key.trim();
		if (!isSafeLegacyProviderKey(providerId)) continue;
		const credential = coerceLegacyFlatCredential(providerId, value);
		if (!credential) continue;
		store.profiles[`${providerId}:default`] = credential;
	}
	return Object.keys(store.profiles).length > 0 ? store : null;
}
function listAuthProfileSqliteMigrationCandidates(cfg, env) {
	return listAuthProfileRepairCandidates(cfg, env).map((candidate) => ({
		agentDir: candidate.agentDir,
		authPath: candidate.authPath,
		statePath: resolveLegacyAuthStatePath(candidate.agentDir),
		legacyPath: resolveLegacyFlatAuthPath(candidate.agentDir)
	}));
}
function hasAuthProfileState(state) {
	return Boolean(state.order || state.lastGood || state.usageStats);
}
function normalizeLegacyApiKeyAliasesForImport(raw) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) return;
	for (const profile of Object.values(raw.profiles)) {
		if (!isRecord(profile)) continue;
		if ((readNonBlankString(profile.type) ?? readNonBlankString(profile.mode)) !== "api_key") continue;
		if (readNonBlankString(profile.key) !== void 0 || coerceSecretRef(profile.key) !== null || coerceSecretRef(profile.keyRef) !== null || profile["api_key"] === void 0) continue;
		profile.key = profile["api_key"];
	}
}
function collectAuthProfileStateProfileIds(state) {
	return [.../* @__PURE__ */ new Set([
		...Object.values(state.order ?? {}).flat(),
		...Object.values(state.lastGood ?? {}),
		...Object.keys(state.usageStats ?? {})
	])];
}
function inferLegacyConfigAuthProfileMode(raw) {
	const explicit = readNonBlankString(raw.mode) ?? readNonBlankString(raw.type);
	if (explicit === "api_key" || explicit === "token" || explicit === "oauth") return explicit;
	if (readNonBlankString(raw.key) || readNonBlankString(raw.apiKey) || readNonBlankString(raw["api_key"]) || coerceSecretRef(raw.keyRef) || coerceSecretRef(raw.key) || coerceSecretRef(raw.apiKey) || coerceSecretRef(raw["api_key"])) return "api_key";
	if (readNonBlankString(raw.token) || coerceSecretRef(raw.tokenRef) || coerceSecretRef(raw.token)) return "token";
	if (readNonBlankString(raw.access) && readNonBlankString(raw.refresh) && typeof raw.expires === "number") return "oauth";
}
function coerceLegacyConfigAuthProfileStore(cfg) {
	const cfgRecord = cfg;
	const auth = isRecord(cfgRecord.auth) ? cfgRecord.auth : null;
	const profiles = auth && isRecord(auth.profiles) ? auth.profiles : null;
	if (!profiles) return null;
	const providerHints = collectLegacyConfigAuthProfileProviderHints(cfg);
	const store = {
		version: 1,
		profiles: {}
	};
	for (const [profileId, raw] of Object.entries(profiles)) {
		if (!isRecord(raw)) continue;
		const mode = inferLegacyConfigAuthProfileMode(raw);
		if (mode !== "api_key" && mode !== "token" && mode !== "oauth") continue;
		const provider = readNonBlankString(raw.provider) ?? extractProviderFromProfileId(profileId) ?? providerHints.get(profileId);
		if (!provider || !isSafeLegacyProviderKey(provider)) continue;
		const next = {
			...raw,
			provider,
			mode
		};
		if (mode === "api_key") {
			const keyRef = coerceSecretRef(raw.keyRef) ?? coerceSecretRef(raw.key) ?? coerceSecretRef(raw.apiKey) ?? coerceSecretRef(raw["api_key"]);
			const key = readNonBlankString(raw.key) ?? readNonBlankString(raw.apiKey) ?? readNonBlankString(raw["api_key"]);
			if (keyRef) {
				next.keyRef = keyRef;
				delete next.key;
				delete next.apiKey;
				delete next["api_key"];
			} else if (key) {
				next.key = key;
				delete next.keyRef;
			} else continue;
		} else if (mode === "token") {
			const tokenRef = coerceSecretRef(raw.tokenRef) ?? coerceSecretRef(raw.token);
			const token = readNonBlankString(raw.token);
			if (tokenRef) {
				next.tokenRef = tokenRef;
				delete next.token;
			} else if (token) {
				next.token = token;
				delete next.tokenRef;
			} else continue;
		} else if (!readNonBlankString(raw.access) || !readNonBlankString(raw.refresh) || typeof raw.expires !== "number") continue;
		store.profiles[profileId] = next;
	}
	const canonicalStore = coercePersistedAuthProfileStore(store);
	return canonicalStore && Object.keys(canonicalStore.profiles).length > 0 ? canonicalStore : null;
}
function isDefaultAgentCandidate(candidate, cfg, env) {
	return candidate.agentDir === void 0 || path.resolve(candidate.agentDir) === path.resolve(resolveLegacyInheritedAuthDir(cfg, env));
}
function stripImportedConfigAuthProfileCredentials(cfg, store) {
	const profiles = ensureConfigAuthProfiles(cfg);
	let changed = false;
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		const current = profiles[profileId];
		if (!current) continue;
		profiles[profileId] = {
			provider: current.provider || credential.provider,
			mode: credential.type,
			...current.email ? { email: current.email } : {},
			...current.displayName ? { displayName: current.displayName } : {}
		};
		changed = true;
	}
	return changed;
}
function hasUsableAuthProfileCredential(credential) {
	if (credential.type === "api_key") return Boolean(readNonBlankString(credential.key) || credential.keyRef);
	if (credential.type === "token") return Boolean(readNonBlankString(credential.token) || credential.tokenRef);
	return Boolean(readNonBlankString(credential.access)) && Boolean(readNonBlankString(credential.refresh)) && typeof credential.expires === "number";
}
function mergeImportedAuthProfiles(params) {
	const profiles = { ...params.store.profiles };
	for (const [profileId, credential] of Object.entries(params.profiles)) {
		if (!params.existingProfileIds.has(profileId)) {
			profiles[profileId] = credential;
			continue;
		}
		const existing = profiles[profileId];
		if (params.replaceExistingWithoutCredential && existing && !hasUsableAuthProfileCredential(existing) && hasUsableAuthProfileCredential(credential)) profiles[profileId] = credential;
	}
	return {
		...params.store,
		profiles
	};
}
function mergeImportedAuthProfileState(params) {
	const next = { ...params.store };
	for (const field of [
		"order",
		"lastGood",
		"usageStats"
	]) {
		const incoming = params.state[field];
		if (!incoming) continue;
		const existing = params.existingState[field] ?? {};
		Object.assign(next, { [field]: {
			...params.store[field],
			...Object.fromEntries(Object.entries(incoming).filter(([key]) => !Object.hasOwn(existing, key)))
		} });
	}
	return next;
}
function formatMissingAuthProfileSqliteVerification(params) {
	const missingProfileIds = [...params.importedProfileIds].filter((profileId) => !params.loaded?.profiles[profileId]);
	const missingStateFields = [];
	for (const [provider, profileIds] of Object.entries(params.expected.order ?? {})) {
		const loadedProfileIds = params.loaded?.order?.[provider];
		if (!loadedProfileIds || loadedProfileIds.length !== profileIds.length || loadedProfileIds.some((profileId, index) => profileId !== profileIds[index])) missingStateFields.push(`order.${provider}`);
	}
	for (const [provider, profileId] of Object.entries(params.expected.lastGood ?? {})) if (params.loaded?.lastGood?.[provider] !== profileId) missingStateFields.push(`lastGood.${provider}`);
	for (const profileId of Object.keys(params.expected.usageStats ?? {})) if (!params.loaded?.usageStats?.[profileId]) missingStateFields.push(`usageStats.${profileId}`);
	const parts = [];
	if (missingProfileIds.length > 0) parts.push(`imported profile(s): ${missingProfileIds.toSorted().join(", ")}`);
	if (missingStateFields.length > 0) parts.push(`auth state field(s): ${missingStateFields.toSorted().join(", ")}`);
	return parts.length > 0 ? parts.join("; ") : null;
}
function collectUnresolvedLegacyOAuthSidecarProfileIds(raw) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) return [];
	const profileIds = [];
	for (const [profileId, profile] of Object.entries(raw.profiles)) {
		if (!isRecord(profile) || profile.type !== "oauth" || !isRecord(profile.oauthRef)) continue;
		if (readNonBlankString(profile.oauthRef.id) && readNonBlankString(profile.oauthRef.provider) && (!readNonBlankString(profile.access) || !readNonBlankString(profile.refresh))) profileIds.push(profileId);
	}
	return profileIds;
}
function hasImportableAuthProfileStore(store) {
	return Boolean(store && (Object.keys(store.profiles).length > 0 || hasAuthProfileState(store)));
}
function hasLegacyAuthProfileSource(candidate) {
	return fs.existsSync(candidate.authPath) || fs.existsSync(candidate.statePath) || fs.existsSync(candidate.legacyPath);
}
function prepareAuthProfileSourceReceipt(params) {
	const sourceBytes = fs.readFileSync(params.pathname);
	let sourceRecordCount = 0;
	try {
		const parsed = JSON.parse(sourceBytes.toString("utf8"));
		sourceRecordCount = isRecord(parsed) ? Object.keys(parsed).length : 0;
	} catch {}
	return createAuthProfileMigrationSourceReceipt({
		sourcePath: params.pathname,
		sourceBytes,
		sourceRecordCount,
		targetDatabasePath: params.targetDatabasePath,
		targetTable: params.targetTable,
		...params.targetStoreKey ? { targetStoreKey: params.targetStoreKey } : {},
		now: new Date(params.now()),
		...params.env ? { env: params.env } : {}
	});
}
function archiveVerifiedAuthProfileSource(receipt, sourceLocked = false) {
	finalizeAuthProfileMigrationSource(receipt, "completed", { sourceLocked });
	return receipt.archivePath;
}
function assertAuthProfileMigrationSourcesUnchanged(candidate, receipts) {
	const receiptByPath = new Map(receipts.map((receipt) => [receipt.sourcePath, receipt]));
	for (const pathname of [
		candidate.authPath,
		candidate.statePath,
		candidate.legacyPath
	]) {
		const receipt = receiptByPath.get(path.resolve(pathname));
		if (fs.existsSync(pathname) !== Boolean(receipt)) throw new Error("legacy auth source set changed during migration; retry Doctor");
		if (!receipt) continue;
		if (createHash("sha256").update(fs.readFileSync(pathname)).digest("hex") !== receipt.sourceSha256) throw new Error("legacy auth source changed during migration; retry Doctor");
	}
}
function parseAuthProfileMigrationSource(receipt) {
	if (!receipt?.sourceBytes) return null;
	try {
		return JSON.parse(receipt.sourceBytes.toString("utf8"));
	} catch {
		return null;
	}
}
function archivePreviouslyMigratedAuthProfileSource(receipt, result) {
	if (!hasTerminalAuthProfileMigrationReceipt(receipt.sourceKey, receipt.env)) return false;
	archiveAuthProfileMigrationSource(receipt);
	result.changes.push(`Archived a previously migrated legacy auth source without replaying credentials (${shortenHomePath(receipt.archivePath)}).`);
	return true;
}
function coerceLegacyOAuthFile(raw) {
	if (!isRecord(raw)) return {
		store: null,
		rejectedEntries: 1
	};
	const profiles = {};
	let rejectedEntries = 0;
	for (const [provider, value] of Object.entries(raw)) {
		if (!isRecord(value)) {
			rejectedEntries += 1;
			continue;
		}
		const credential = parseLegacyCredentialEntry({
			...value,
			type: "oauth",
			provider
		}, provider);
		if (credential?.type === "oauth") profiles[`${provider}:default`] = credential;
		else rejectedEntries += 1;
	}
	return {
		store: Object.keys(profiles).length > 0 ? {
			version: 1,
			profiles
		} : null,
		rejectedEntries
	};
}
function loadAuthProfileMigrationTargetStore(agentDir, loadStore = loadPersistedAuthProfileStore, database, env = process.env) {
	const explicitSharedRead = agentDir === void 0 && database === void 0;
	const inspection = explicitSharedRead ? inspectPersistedSharedAuthProfileStoreRaw(env) : inspectPersistedAuthProfileStoreRaw(agentDir, database);
	const store = explicitSharedRead && loadStore === loadPersistedAuthProfileStore ? loadPersistedSharedAuthProfileStore(env) : loadStore(agentDir, database ? { database } : void 0);
	if (store) return store;
	if (inspection.status !== "missing") throw new Error("canonical auth profile store is unreadable; legacy source left in place");
	if ((explicitSharedRead ? inspectPersistedSharedAuthProfileStateRaw(env) : inspectPersistedAuthProfileStateRaw(agentDir, database)).status === "unreadable") throw new Error("canonical auth profile state is unreadable; legacy source left in place");
	return {
		version: 1,
		profiles: {},
		...coerceAuthProfileState(explicitSharedRead ? readPersistedSharedAuthProfileStateRaw(env) : readPersistedAuthProfileStateRaw(agentDir, database))
	};
}
function migrateLegacyOAuthFile(params) {
	if (!fs.existsSync(params.oauthPath)) return;
	const releaseSource = acquireAuthProfileMigrationSourceLocks([params.oauthPath]);
	try {
		migrateLockedLegacyOAuthFile(params);
	} finally {
		releaseSource();
	}
}
function migrateLockedLegacyOAuthFile(params) {
	const targetDatabasePath = resolveSharedAuthStorePath(params.env);
	const sharedStateTarget = resolveSharedAuthStoreOwnership(params.env).location === "state-db";
	const receipt = prepareAuthProfileSourceReceipt({
		pathname: params.oauthPath,
		targetDatabasePath,
		targetTable: sharedStateTarget ? "auth_profile_stores" : "auth_profile_store",
		targetStoreKey: sharedStateTarget ? "shared" : "primary",
		now: params.now,
		env: params.env
	});
	if (archivePreviouslyMigratedAuthProfileSource(receipt, params.result)) return;
	const parsed = coerceLegacyOAuthFile(loadJsonFileThroughSymlink(params.oauthPath));
	const imported = parsed.store;
	if (!imported) {
		finalizeAuthProfileMigrationSource(receipt, "archived-unparsed", { sourceLocked: true });
		params.result.warnings.push(`Archived an unreadable legacy OAuth source without import; re-authenticate or recover it from ${shortenHomePath(receipt.archivePath)}.`);
		return;
	}
	const existing = loadAuthProfileMigrationTargetStore(void 0, loadPersistedAuthProfileStore, void 0, params.env);
	const importedProfileIds = new Set(Object.keys(imported.profiles));
	const next = mergeImportedAuthProfiles({
		store: existing,
		profiles: imported.profiles,
		existingProfileIds: new Set(Object.keys(existing.profiles))
	});
	const loaded = runAuthProfileWriteTransaction(void 0, (database) => {
		if (!isDeepStrictEqual(loadAuthProfileMigrationTargetStore(void 0, loadPersistedAuthProfileStore, database), existing)) throw new Error("canonical auth profile store changed during legacy OAuth migration");
		saveAuthProfileStore(next, void 0, {
			filterExternalAuthProfiles: false,
			preserveStateProfileIds: collectAuthProfileStateProfileIds(coerceAuthProfileState(existing)),
			syncExternalCli: false
		}, database);
		const verified = loadPersistedAuthProfileStore(void 0, { database });
		const verificationFailure = formatMissingAuthProfileSqliteVerification({
			expected: next,
			importedProfileIds,
			loaded: verified
		});
		const mismatched = [...importedProfileIds].filter((profileId) => {
			if (existing.profiles[profileId]) return false;
			return !isDeepStrictEqual(verified?.profiles[profileId], imported.profiles[profileId]);
		});
		if (verificationFailure || mismatched.length > 0 || !verified) throw new Error("legacy OAuth import verification failed");
		return verified;
	}, { env: params.env });
	receipt.expectedProfileSha256 = Object.fromEntries([...importedProfileIds].map((profileId) => [profileId, digestAuthProfileMigrationValue(loaded.profiles[profileId])]));
	finalizeAuthProfileMigrationSource(receipt, parsed.rejectedEntries > 0 ? "archived-unparsed" : "completed", { sourceLocked: true });
	if (parsed.rejectedEntries > 0) params.result.warnings.push(`Imported valid shared OAuth entries and archived ${parsed.rejectedEntries} rejected entr${parsed.rejectedEntries === 1 ? "y" : "ies"} for manual recovery.`);
	params.result.changes.push(`Migrated shared legacy OAuth credentials into the shared-main SQLite owner (archive: ${shortenHomePath(receipt.archivePath)}).`);
}
/**
* Imports legacy auth profile JSON and state files into the per-agent SQLite store.
*
* JSON files are verified and atomically renamed to timestamped archives only after import.
* OAuth profiles that still depend on missing sidecar secrets migrate as unavailable ref-only rows.
*/
async function maybeMigrateAuthProfileJsonStoresToSqlite(params) {
	const now = params.now ?? Date.now;
	const env = params.env ?? process.env;
	const loadMigratedStore = params.deps?.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore;
	let resumedChanges = [];
	let resumeWarning;
	try {
		resumedChanges = resumePendingAuthProfileMigrationArchives(env);
	} catch {
		resumeWarning = "Could not finalize an interrupted auth profile archive; legacy sources were left for recovery.";
	}
	const candidates = listAuthProfileSqliteMigrationCandidates(params.cfg, env);
	const configStore = coerceLegacyConfigAuthProfileStore(params.cfg);
	const oauthPath = resolveLegacyOAuthPath(env);
	const hasLegacyOAuth = fs.existsSync(oauthPath);
	const detected = candidates.filter((candidate) => hasLegacyAuthProfileSource(candidate) || configStore && isDefaultAgentCandidate(candidate, params.cfg, env));
	const result = {
		detected: [...detected.flatMap((candidate) => [
			candidate.authPath,
			candidate.statePath,
			candidate.legacyPath,
			...configStore && isDefaultAgentCandidate(candidate, params.cfg, env) ? [candidate.authPath] : []
		].filter((pathname, index, entries) => entries.indexOf(pathname) === index).filter((pathname) => fs.existsSync(pathname) || configStore && isDefaultAgentCandidate(candidate, params.cfg, env) && pathname === candidate.authPath)), ...hasLegacyOAuth ? [oauthPath] : []],
		changes: resumedChanges,
		warnings: resumeWarning ? [resumeWarning] : []
	};
	if (resumeWarning) return result;
	if (detected.length === 0 && !hasLegacyOAuth) return result;
	note([
		...detected.map((candidate) => `- ${shortenHomePath(candidate.authPath)} / ${shortenHomePath(candidate.statePath)}`),
		...hasLegacyOAuth ? [`- ${shortenHomePath(oauthPath)} (shared-main owner)`] : [],
		`- ${formatCliCommand("openclaw doctor --fix")} imports legacy auth profile JSON into SQLite, verifies it, records a receipt, and archives the original bytes.`
	].join("\n"), "Auth profile SQLite migration");
	if (!await params.prompter.confirmAutoFix({
		message: "Migrate auth profile JSON files into SQLite now?",
		initialValue: true
	})) return result;
	const openAIProfileIdMap = params.openAICodexAuthProfileIdMap ?? collectOpenAICodexAuthProfileStoreIdMap({
		cfg: params.cfg,
		env
	});
	for (const candidate of detected) {
		let releaseSources;
		try {
			const candidateSourcePaths = [
				candidate.authPath,
				candidate.statePath,
				candidate.legacyPath
			];
			for (const pathname of candidateSourcePaths) fs.mkdirSync(path.dirname(pathname), { recursive: true });
			releaseSources = acquireAuthProfileMigrationSourceLocks(candidateSourcePaths);
			const targetDatabasePath = resolveMigrationTargetDatabasePath(candidate.agentDir, env);
			const sharedStateTarget = candidate.agentDir === void 0 && resolveSharedAuthStoreOwnership(env).location === "state-db";
			let sourceReceipts = candidateSourcePaths.filter(fs.existsSync).map((pathname) => prepareAuthProfileSourceReceipt({
				pathname,
				targetDatabasePath,
				targetTable: pathname === candidate.statePath ? "auth_profile_state" : sharedStateTarget ? "auth_profile_stores" : "auth_profile_store",
				targetStoreKey: sharedStateTarget ? "shared" : "primary",
				now,
				env
			}));
			sourceReceipts = sourceReceipts.filter((receipt) => !archivePreviouslyMigratedAuthProfileSource(receipt, result));
			assertAuthProfileMigrationSourcesUnchanged(candidate, sourceReceipts);
			if (sourceReceipts.length === 0 && !configStore) continue;
			const receiptByPath = new Map(sourceReceipts.map((receipt) => [receipt.sourcePath, receipt]));
			const rawStore = parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.authPath)));
			const openAIProviderRepair = canonicalizeLegacyOpenAIAuthStore(rawStore, openAIProfileIdMap);
			const unresolvedSidecarProfileIds = new Set(collectUnresolvedLegacyOAuthSidecarProfileIds(rawStore));
			const unresolvedSidecarWarning = unresolvedSidecarProfileIds.size > 0 ? `Migrated ${unresolvedSidecarProfileIds.size} legacy OAuth sidecar profile${unresolvedSidecarProfileIds.size === 1 ? "" : "s"} from ${shortenHomePath(candidate.authPath)} into SQLite as configured-unavailable without credentials; re-authenticate ${unresolvedSidecarProfileIds.size === 1 ? "this profile" : "these profiles"} to restore access.` : void 0;
			const awsSdkMarkerStore = isRecord(rawStore) && isRecord(rawStore.profiles) ? resolveAwsSdkAuthProfileMarkerStore(candidate) : null;
			if (awsSdkMarkerStore && isRecord(rawStore)) {
				const configProfiles = ensureConfigAuthProfiles(params.cfg);
				for (const marker of awsSdkMarkerStore.profiles) configProfiles[marker.profileId] = {
					provider: marker.provider,
					mode: "aws-sdk",
					...marker.email ? { email: marker.email } : {},
					...marker.displayName ? { displayName: marker.displayName } : {}
				};
				removeAwsSdkProfileMarkers(rawStore, awsSdkMarkerStore.profiles.map((profile) => profile.profileId));
				result.configChanged = true;
			}
			normalizeLegacyApiKeyAliasesForImport(rawStore);
			const maybeCanonicalStore = coercePersistedAuthProfileStore(rawStore) ?? coerceLegacyFlatAuthProfileStore(rawStore) ?? null;
			const canonicalStore = hasImportableAuthProfileStore(maybeCanonicalStore) ? maybeCanonicalStore : null;
			const configCanonicalStore = configStore && isDefaultAgentCandidate(candidate, params.cfg, env) ? configStore : null;
			const legacyStore = coerceLegacyAuthStore(parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.legacyPath))));
			const state = coerceAuthProfileState(parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.statePath))));
			if (!canonicalStore && !configCanonicalStore && !legacyStore && !hasAuthProfileState(state) && !awsSdkMarkerStore) {
				if (sourceReceipts.length > 0) {
					const archived = sourceReceipts.map((receipt) => {
						finalizeAuthProfileMigrationSource(receipt, "archived-unparsed", { sourceLocked: true });
						return receipt.archivePath;
					});
					result.warnings.push(unresolvedSidecarWarning ?? `Archived unparseable auth profile input without import for ${shortenHomePath(candidate.authPath)} (${archived.map(shortenHomePath).join(", ")}).`);
					continue;
				}
				result.warnings.push(`Left auth profile JSON in place for ${shortenHomePath(candidate.authPath)} because no importable auth profiles or state were found.`);
				continue;
			}
			const existing = loadAuthProfileMigrationTargetStore(candidate.agentDir, loadMigratedStore, void 0, env);
			const existingProfileIds = new Set(Object.keys(existing.profiles));
			const existingState = coerceAuthProfileState(existing);
			let next = { ...existing };
			let verifiedStore = existing;
			const importedProfileIds = /* @__PURE__ */ new Set();
			if (legacyStore) {
				const legacyAsStore = {
					version: 1,
					profiles: {}
				};
				applyLegacyAuthStore(legacyAsStore, legacyStore);
				for (const profileId of Object.keys(legacyAsStore.profiles)) importedProfileIds.add(profileId);
				next = mergeImportedAuthProfiles({
					store: next,
					profiles: legacyAsStore.profiles,
					existingProfileIds
				});
			}
			if (canonicalStore) {
				for (const profileId of Object.keys(canonicalStore.profiles)) importedProfileIds.add(profileId);
				next = {
					...next,
					version: Math.max(next.version, canonicalStore.version)
				};
				next = mergeImportedAuthProfiles({
					store: next,
					profiles: canonicalStore.profiles,
					existingProfileIds
				});
				next = mergeImportedAuthProfileState({
					store: next,
					state: coerceAuthProfileState(canonicalStore),
					existingState
				});
			}
			if (configCanonicalStore) {
				for (const profileId of Object.keys(configCanonicalStore.profiles)) importedProfileIds.add(profileId);
				next = mergeImportedAuthProfiles({
					store: next,
					profiles: configCanonicalStore.profiles,
					existingProfileIds: new Set(Object.keys(next.profiles)),
					replaceExistingWithoutCredential: true
				});
			}
			if (hasAuthProfileState(state)) next = mergeImportedAuthProfileState({
				store: next,
				state,
				existingState
			});
			if (canonicalStore || configCanonicalStore || legacyStore || hasAuthProfileState(state)) {
				const stateProfileIds = [
					...collectAuthProfileStateProfileIds(state),
					...canonicalStore ? collectAuthProfileStateProfileIds(coerceAuthProfileState(canonicalStore)) : [],
					...configCanonicalStore ? collectAuthProfileStateProfileIds(coerceAuthProfileState(configCanonicalStore)) : []
				];
				try {
					assertAuthProfileMigrationSourcesUnchanged(candidate, sourceReceipts);
					verifiedStore = runAuthProfileWriteTransaction(candidate.agentDir, (database) => {
						if (!isDeepStrictEqual(loadAuthProfileMigrationTargetStore(candidate.agentDir, loadMigratedStore, database), existing)) throw new Error("canonical auth profile store changed during legacy migration");
						saveAuthProfileStore(next, candidate.agentDir, {
							filterExternalAuthProfiles: false,
							preserveStateProfileIds: stateProfileIds,
							syncExternalCli: false
						}, database);
						const loaded = loadMigratedStore(candidate.agentDir, { database });
						const persistedStores = {
							isMainStore: resolveMigrationTargetDatabasePath(candidate.agentDir, env) === resolveSharedAuthStorePath(env),
							localStore: loaded,
							mainStore: resolveMigrationTargetDatabasePath(candidate.agentDir, env) === resolveSharedAuthStorePath(env) ? loaded : loadPersistedSharedAuthProfileStore(env)
						};
						const dedupedToMainProfileIds = new Set([...importedProfileIds].filter((profileId) => {
							const credential = next.profiles[profileId];
							return credential !== void 0 && !loaded?.profiles[profileId] && isInheritedMainOAuthCredentialFromStores({
								profileId,
								credential,
								persistedStores
							});
						}));
						const verifiableProfileIds = new Set([...importedProfileIds].filter((profileId) => !dedupedToMainProfileIds.has(profileId)));
						const verificationFailure = formatMissingAuthProfileSqliteVerification({
							expected: next,
							importedProfileIds: verifiableProfileIds,
							loaded
						});
						const mismatchedCredential = [...verifiableProfileIds].some((profileId) => {
							if (existingProfileIds.has(profileId)) return false;
							return !isDeepStrictEqual(loaded?.profiles[profileId], next.profiles[profileId]);
						});
						if (verificationFailure || mismatchedCredential || !loaded) throw new AuthProfileMigrationVerificationError(verificationFailure);
						return loaded;
					}, { env });
				} catch (error) {
					if (!(error instanceof AuthProfileMigrationVerificationError)) throw error;
					result.warnings.push(`Left auth profile JSON in place for ${shortenHomePath(candidate.authPath)} because SQLite verification failed${error.detail ? ` (${error.detail})` : ""}.`);
					continue;
				}
				if (configCanonicalStore && stripImportedConfigAuthProfileCredentials(params.cfg, configCanonicalStore)) result.configChanged = true;
			}
			const expectedProfileSha256 = Object.fromEntries([...importedProfileIds].flatMap((profileId) => {
				const profileValue = verifiedStore.profiles[profileId];
				return profileValue ? [[profileId, digestAuthProfileMigrationValue(profileValue)]] : [];
			}));
			const expectedStateSha256 = digestAuthProfileMigrationValue(readPersistedAuthProfileStateRaw(candidate.agentDir));
			const canonicalSourceCarriesState = canonicalStore ? hasAuthProfileState(coerceAuthProfileState(canonicalStore)) : false;
			for (const receipt of sourceReceipts) {
				if (receipt.targetTable === "auth_profile_store") receipt.expectedProfileSha256 = expectedProfileSha256;
				if (receipt.targetTable === "auth_profile_state" || receipt.sourcePath === candidate.authPath && canonicalSourceCarriesState) receipt.expectedStateSha256 = expectedStateSha256;
			}
			assertAuthProfileMigrationSourcesUnchanged(candidate, sourceReceipts);
			const archives = sourceReceipts.map((receipt) => archiveVerifiedAuthProfileSource(receipt, true));
			const archiveText = archives.length > 0 ? `archive${archives.length === 1 ? "" : "s"}: ${archives.map(shortenHomePath).join(", ")}` : "no legacy JSON backup needed";
			result.changes.push(`Migrated auth profile JSON for ${shortenHomePath(candidate.authPath)} into SQLite (${archiveText}).`);
			if (unresolvedSidecarWarning) result.warnings.push(unresolvedSidecarWarning);
			if (openAIProviderRepair !== null) result.changes.push(`Migrated ${openAIProviderRepair} OpenAI Codex auth profile(s) in ${shortenHomePath(candidate.authPath)} to provider "openai".`);
			if (awsSdkMarkerStore) result.changes.push(`Moved aws-sdk profile metadata from ${shortenHomePath(candidate.authPath)} to auth.profiles before removing the legacy auth profile JSON.`);
		} catch (err) {
			result.warnings.push(`Failed to migrate auth profile JSON for ${shortenHomePath(candidate.authPath)}: ${String(err)}`);
		} finally {
			releaseSources?.();
		}
	}
	const sharedMainAgentDir = resolveSharedMainAuthAgentDir(env);
	const sharedMainCredentialSourceRemains = [resolveLegacyAuthProfilesPath(sharedMainAgentDir), resolveLegacyFlatAuthPath(sharedMainAgentDir)].some((pathname) => fs.existsSync(pathname));
	if (hasLegacyOAuth && sharedMainCredentialSourceRemains) result.warnings.push(`Deferred shared legacy OAuth migration until higher-priority shared-main credential sources are resolved by ${formatCliCommand("openclaw doctor --fix")}.`);
	else if (hasLegacyOAuth) try {
		migrateLegacyOAuthFile({
			oauthPath,
			env,
			now,
			result
		});
	} catch (err) {
		result.warnings.push(`Failed to migrate shared legacy OAuth credentials; the source was left in place: ${String(err)}`);
	}
	clearRuntimeAuthProfileStoreSnapshots();
	clearAuthProfileMigrationDiagnostics();
	if (result.changes.length > 0) note(result.changes.map((change) => `- ${change}`).join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
	return result;
}
function resolveAwsSdkAuthProfileMarkerStore(candidate) {
	if (!fs.existsSync(candidate.authPath)) return null;
	const raw = loadJsonFileThroughSymlink(candidate.authPath);
	if (!isRecord(raw) || !isRecord(raw.profiles)) return null;
	const markers = [];
	for (const [profileId, value] of Object.entries(raw.profiles)) {
		if (!isRecord(value)) continue;
		if ((readNonBlankString(value.type) ?? readNonBlankString(value.mode)) !== "aws-sdk") continue;
		const provider = readNonBlankString(value.provider) ?? extractProviderFromProfileId(profileId);
		if (!provider || !isSafeLegacyProviderKey(provider)) continue;
		markers.push({
			profileId,
			provider,
			...readNonBlankString(value.email) ? { email: readNonBlankString(value.email) } : {},
			...readNonBlankString(value.displayName) ? { displayName: readNonBlankString(value.displayName) } : {}
		});
	}
	return markers.length > 0 ? {
		...candidate,
		raw,
		profiles: markers
	} : null;
}
function ensureConfigAuthProfiles(config) {
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : {};
	if (root.auth !== auth) root.auth = auth;
	if (!isRecord(auth.profiles)) auth.profiles = {};
	return auth.profiles;
}
function removeAwsSdkProfileMarkers(raw, profileIds) {
	if (!isRecord(raw.profiles)) return;
	for (const profileId of profileIds) delete raw.profiles[profileId];
}
const LEGACY_OPENAI_CODEX_PROVIDER_ID = "openai-codex";
const OPENAI_PROVIDER_ID = "openai";
function isLegacyOpenAICodexProvider(value) {
	return typeof value === "string" && value.trim().toLowerCase() === LEGACY_OPENAI_CODEX_PROVIDER_ID;
}
function isLegacyOpenAICodexProfileId(profileId) {
	return profileId.trim().toLowerCase().startsWith(`${LEGACY_OPENAI_CODEX_PROVIDER_ID}:`);
}
function canonicalOpenAIProfileSuffix(profileId) {
	return profileId.slice(profileId.indexOf(":") + 1).trim() || "default";
}
function allocateOpenAIProfileId(legacyProfileId, occupied) {
	const suffix = canonicalOpenAIProfileSuffix(legacyProfileId);
	const direct = `${OPENAI_PROVIDER_ID}:${suffix}`;
	if (!occupied.has(direct)) {
		occupied.add(direct);
		return direct;
	}
	const chatgpt = `${OPENAI_PROVIDER_ID}:chatgpt-${suffix}`;
	if (!occupied.has(chatgpt)) {
		occupied.add(chatgpt);
		return chatgpt;
	}
	for (let index = 2;; index += 1) {
		const candidate = `${chatgpt}-${index}`;
		if (!occupied.has(candidate)) {
			occupied.add(candidate);
			return candidate;
		}
	}
}
function canonicalizeOpenAIProfileEntries(profiles, options) {
	const occupied = new Set(Object.keys(profiles).filter((id) => !isLegacyOpenAICodexProfileId(id)));
	const reservedMappedIds = new Set(options?.profileIdMap?.values() ?? []);
	const profileIdMap = /* @__PURE__ */ new Map();
	let changed = false;
	for (const [profileId, rawProfile] of Object.entries({ ...profiles })) {
		if (!isRecord(rawProfile)) continue;
		const legacyId = isLegacyOpenAICodexProfileId(profileId);
		const legacyProvider = isLegacyOpenAICodexProvider(rawProfile.provider);
		if (!legacyId && !legacyProvider) continue;
		const mappedProfileId = legacyId ? options?.profileIdMap?.get(profileId) : void 0;
		const nextProfileId = mappedProfileId && !occupied.has(mappedProfileId) ? mappedProfileId : legacyId ? allocateOpenAIProfileId(profileId, /* @__PURE__ */ new Set([...occupied, ...reservedMappedIds])) : profileId;
		occupied.add(nextProfileId);
		const nextProfile = {
			...rawProfile,
			provider: OPENAI_PROVIDER_ID
		};
		if (nextProfileId !== profileId) {
			delete profiles[profileId];
			profileIdMap.set(profileId, nextProfileId);
		}
		profiles[nextProfileId] = nextProfile;
		changed = true;
	}
	return {
		profileIdMap,
		changed
	};
}
function replaceMappedProfileId(value, profileIdMap) {
	if (typeof value === "string") return profileIdMap.get(value) ?? value;
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((entry) => {
			const replaced = replaceMappedProfileId(entry, profileIdMap);
			changed ||= replaced !== entry;
			return replaced;
		});
		return changed ? next : value;
	}
	if (!isRecord(value)) return value;
	let changed = false;
	for (const [key, entry] of Object.entries(value)) {
		const replaced = replaceMappedProfileId(entry, profileIdMap);
		if (replaced !== entry) {
			value[key] = replaced;
			changed = true;
		}
	}
	return changed ? value : value;
}
const AUTH_PROFILE_REF_KEYS = /* @__PURE__ */ new Set(["authProfileId"]);
function rewriteMappedAuthProfileRefs(value, profileIdMap) {
	if (Array.isArray(value)) return value.reduce((changed, entry) => rewriteMappedAuthProfileRefs(entry, profileIdMap) || changed, false);
	if (!isRecord(value)) return false;
	let changed = false;
	for (const [key, entry] of Object.entries(value)) {
		if (AUTH_PROFILE_REF_KEYS.has(key) && typeof entry === "string") {
			const replaced = profileIdMap.get(entry);
			if (replaced && replaced !== entry) {
				value[key] = replaced;
				changed = true;
			}
			continue;
		}
		changed = rewriteMappedAuthProfileRefs(entry, profileIdMap) || changed;
	}
	return changed;
}
function canonicalizeOpenAIAuthOrder(auth, profileIdMap) {
	if (!isRecord(auth.order)) return false;
	const order = auth.order;
	let changed = false;
	const existingCanonicalOrder = Array.isArray(order[OPENAI_PROVIDER_ID]) ? [...order[OPENAI_PROVIDER_ID]] : [];
	const legacyOrder = Array.isArray(order[LEGACY_OPENAI_CODEX_PROVIDER_ID]) ? order[LEGACY_OPENAI_CODEX_PROVIDER_ID] : [];
	const canonicalOrder = [...legacyOrder, ...existingCanonicalOrder];
	const occupiedProfileIds = new Set(canonicalOrder.filter((entry) => typeof entry === "string" && !isLegacyOpenAICodexProfileId(entry)));
	for (const profileId of profileIdMap.values()) occupiedProfileIds.add(profileId);
	if (legacyOrder.length > 0) {
		delete order[LEGACY_OPENAI_CODEX_PROVIDER_ID];
		changed = true;
	}
	const rewritten = canonicalOrder.map((entry) => {
		if (typeof entry !== "string") return entry;
		const mapped = profileIdMap.get(entry);
		if (mapped) return mapped;
		if (!isLegacyOpenAICodexProfileId(entry)) return entry;
		const canonicalProfileId = allocateOpenAIProfileId(entry, occupiedProfileIds);
		profileIdMap.set(entry, canonicalProfileId);
		return canonicalProfileId;
	}).filter((entry, index, entries) => typeof entry !== "string" || entries.indexOf(entry) === index);
	if (rewritten.length > 0) order[OPENAI_PROVIDER_ID] = rewritten;
	else if (OPENAI_PROVIDER_ID in order) delete order[OPENAI_PROVIDER_ID];
	return changed || rewritten.some((entry, index) => entry !== canonicalOrder[index]);
}
function renameMappedProfileIdKeys(record, profileIdMap) {
	let changed = false;
	for (const [key, value] of Object.entries({ ...record })) {
		const nextKey = profileIdMap.get(key);
		if (!nextKey || nextKey === key) continue;
		delete record[key];
		record[nextKey] = value;
		changed = true;
	}
	return changed;
}
function canonicalizeOpenAILastGood(record, profileIdMap) {
	let changed = false;
	const legacyValue = record[LEGACY_OPENAI_CODEX_PROVIDER_ID];
	const canonicalValue = record[OPENAI_PROVIDER_ID];
	if (legacyValue !== void 0) {
		delete record[LEGACY_OPENAI_CODEX_PROVIDER_ID];
		changed = true;
		if (canonicalValue === void 0 && typeof legacyValue === "string") record[OPENAI_PROVIDER_ID] = profileIdMap.get(legacyValue) ?? legacyValue;
	}
	if (typeof record[OPENAI_PROVIDER_ID] === "string") {
		const mapped = profileIdMap.get(record[OPENAI_PROVIDER_ID]);
		if (mapped) {
			record[OPENAI_PROVIDER_ID] = mapped;
			changed = true;
		}
	}
	return changed;
}
/**
* Canonicalizes config references from the legacy OpenAI Codex provider id to OpenAI.
*
* The optional map lets config and store repairs share deterministic profile ids when both surfaces
* contain the same legacy profile.
*/
function maybeRepairOpenAICodexAuthConfig(cfg, options) {
	const config = structuredClone(cfg);
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : void 0;
	const profileIdMap = new Map(options?.profileIdMap);
	let changed = false;
	if (isRecord(auth?.profiles)) {
		const rewrite = canonicalizeOpenAIProfileEntries(auth.profiles, { profileIdMap });
		for (const [from, to] of rewrite.profileIdMap) profileIdMap.set(from, to);
		changed ||= rewrite.changed;
	}
	if (auth) {
		const orderChanged = canonicalizeOpenAIAuthOrder(auth, profileIdMap);
		changed ||= orderChanged;
	}
	if (profileIdMap.size > 0 && rewriteMappedAuthProfileRefs(config, profileIdMap)) changed = true;
	if (!changed) return {
		config,
		changes: [],
		warnings: []
	};
	return {
		config,
		changes: ["Migrated legacy OpenAI Codex auth profile config to the canonical OpenAI provider."],
		warnings: []
	};
}
function canonicalizeLegacyOpenAIAuthStore(raw, profileIdMap) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) return null;
	const rewrite = canonicalizeOpenAIProfileEntries(raw.profiles, { profileIdMap });
	const orderChanged = canonicalizeOpenAIAuthOrder(raw, rewrite.profileIdMap);
	const usageChanged = isRecord(raw.usageStats) ? renameMappedProfileIdKeys(raw.usageStats, rewrite.profileIdMap) : false;
	const lastGoodChanged = isRecord(raw.lastGood) ? canonicalizeOpenAILastGood(raw.lastGood, rewrite.profileIdMap) : false;
	if (rewrite.profileIdMap.size > 0) replaceMappedProfileId(raw, rewrite.profileIdMap);
	return rewrite.changed || orderChanged || usageChanged || lastGoodChanged ? rewrite.profileIdMap.size : null;
}
function recoverArchivedOpenAICodexAuthProfileIdMap(params) {
	const recovered = /* @__PURE__ */ new Map();
	const ambiguous = /* @__PURE__ */ new Set();
	const archives = listLegacyAuthProfileArchives({
		agentDirs: [resolveSharedMainAuthAgentDir(params.env), ...params.candidates.flatMap((candidate) => candidate.agentDir ? [candidate.agentDir] : [])],
		env: params.env
	}).filter((archive) => archive.kind === "auth-profiles");
	for (const candidate of params.candidates) {
		const canonicalProfiles = (candidate.agentDir ? loadPersistedAuthProfileStore(candidate.agentDir) : loadPersistedSharedAuthProfileStore(params.env))?.profiles;
		if (!canonicalProfiles) continue;
		for (const archive of archives.filter((entry) => entry.path.startsWith(`${candidate.authPath}.migrated-`))) try {
			const sourceBytes = fs.readFileSync(archive.path);
			const sourceSha256 = createHash("sha256").update(sourceBytes).digest("hex");
			const receipt = readLegacyMigrationReceipt(`auth-profile-v2:${createHash("sha256").update(`${path.resolve(candidate.authPath)}\0${sourceSha256}`).digest("hex")}`, params.env);
			if (!receipt?.removedSource || receipt.sourceSha256 !== sourceSha256) continue;
			const report = JSON.parse(receipt.reportJson);
			const sharedStateTarget = candidate.agentDir === void 0 && resolveSharedAuthStoreOwnership(params.env).location === "state-db";
			if (!isRecord(report) || report.format !== "auth-profile-json-to-sqlite-v2" || report.completionStatus !== "completed" || report.targetTable !== (sharedStateTarget ? "auth_profile_stores" : "auth_profile_store") || typeof report.archivePath !== "string" || path.resolve(report.archivePath) !== path.resolve(archive.path) || typeof report.targetDatabasePath !== "string" || path.resolve(report.targetDatabasePath) !== path.resolve(resolveMigrationTargetDatabasePath(candidate.agentDir, params.env)) || !isRecord(report.expectedProfileSha256)) continue;
			const archivedStore = JSON.parse(sourceBytes.toString("utf8"));
			if (!isRecord(archivedStore) || !isRecord(archivedStore.profiles)) continue;
			for (const [legacyProfileId, rawCredential] of Object.entries(archivedStore.profiles)) {
				if (!isLegacyOpenAICodexProfileId(legacyProfileId) || !isRecord(rawCredential)) continue;
				const archivedCredential = parseLegacyCredentialEntry({
					...rawCredential,
					provider: "openai"
				}, "openai");
				if (archivedCredential?.type !== "oauth") continue;
				const matches = Object.entries(report.expectedProfileSha256).flatMap(([canonicalProfileId, expectedSha256]) => {
					const credential = canonicalProfiles[canonicalProfileId];
					return typeof expectedSha256 === "string" && credential?.type === "oauth" && credential.provider === "openai" && (hasMatchingOAuthIdentity(archivedCredential, credential) || areOAuthCredentialsEquivalent(archivedCredential, credential)) ? [canonicalProfileId] : [];
				});
				if (matches.length !== 1) continue;
				const canonicalProfileId = matches[0];
				const previous = recovered.get(legacyProfileId);
				if (previous && previous !== canonicalProfileId) {
					recovered.delete(legacyProfileId);
					ambiguous.add(legacyProfileId);
				} else if (!ambiguous.has(legacyProfileId)) recovered.set(legacyProfileId, canonicalProfileId);
			}
		} catch {}
	}
	return recovered;
}
/** Collects collision-safe OpenAI profile ids across config, SQLite, and legacy agent stores. */
function collectOpenAICodexAuthProfileStoreIdMap(params) {
	const env = params.env ?? process.env;
	const occupiedProfileIds = /* @__PURE__ */ new Set();
	const legacyProfileIds = /* @__PURE__ */ new Set();
	const profileIdMap = /* @__PURE__ */ new Map();
	const candidates = listAuthProfileRepairCandidates(params.cfg, env);
	const addProfileIds = (profileIds) => {
		for (const profileId of profileIds) if (isLegacyOpenAICodexProfileId(profileId)) legacyProfileIds.add(profileId);
		else occupiedProfileIds.add(profileId);
	};
	addProfileIds(Object.keys(params.cfg.auth?.profiles ?? {}));
	for (const candidate of candidates) {
		const persistedStore = candidate.agentDir ? loadPersistedAuthProfileStore(candidate.agentDir) : loadPersistedSharedAuthProfileStore(env);
		addProfileIds(Object.keys(persistedStore?.profiles ?? {}));
		if (!fs.existsSync(candidate.authPath)) continue;
		const raw = loadJsonFileThroughSymlink(candidate.authPath);
		if (!isRecord(raw) || !isRecord(raw.profiles)) continue;
		addProfileIds(Object.keys(raw.profiles));
	}
	for (const profileId of [...legacyProfileIds].toSorted((a, b) => a.localeCompare(b))) profileIdMap.set(profileId, allocateOpenAIProfileId(profileId, occupiedProfileIds));
	for (const [legacyProfileId, canonicalProfileId] of recoverArchivedOpenAICodexAuthProfileIdMap({
		candidates,
		env
	})) if (!profileIdMap.has(legacyProfileId)) profileIdMap.set(legacyProfileId, canonicalProfileId);
	return profileIdMap;
}
//#endregion
export { maybeMigrateAuthProfileJsonStoresToSqlite as n, maybeRepairOpenAICodexAuthConfig as r, collectOpenAICodexAuthProfileStoreIdMap as t };
