import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as resolveSharedAuthStorePath, o as resolveSharedMainAuthAgentDir } from "./path-resolve-CCojuy8M.js";
import { a as inspectPersistedAuthProfileStoreRaw, m as resolveAuthProfileDatabasePath, w as listLegacyAuthProfileSources } from "./sqlite-fgcxOC8G.js";
//#region src/agents/auth-profiles/legacy-source-diagnostic.ts
const AUTH_PROFILE_MIGRATION_REQUIRED_CODE = "AUTH_PROFILE_MIGRATION_REQUIRED";
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
const log = createSubsystemLogger("auth-profiles/persistence");
function isCredentialSource(source) {
	return source.kind !== "auth-state";
}
function resolveAuthProfileOwnerPath(agentDir, env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
function hasLegacyAuthProfileCredentialSource(agentDir) {
	return listLegacyAuthProfileSources({ agentDir }).some(isCredentialSource);
}
/**
* True when the canonical SQLite store already holds credentials for this owner.
* A retired JSON file sitting next to a populated store is leftover bytes Doctor
* has not archived yet, not unmigrated credentials: failing runtime closed there
* would strand a working store over a file nothing reads.
*/
function hasMigratedAuthProfileCredentials(agentDir) {
	let inspection;
	try {
		inspection = inspectPersistedAuthProfileStoreRaw(agentDir);
	} catch {
		return false;
	}
	if (inspection.status !== "readable") return false;
	const profiles = isRecord(inspection.raw) ? inspection.raw.profiles : void 0;
	return isRecord(profiles) && Object.keys(profiles).length > 0;
}
function listStartupLegacyAuthProfileSources(params) {
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	return [.../* @__PURE__ */ new Set([...params.agentDirs, sharedMainDir])].map((agentDir) => {
		const sources = listLegacyAuthProfileSources({
			agentDir,
			env: params.env
		});
		const credentialSources = sources.filter(isCredentialSource);
		return {
			agentDir,
			sources,
			unmigratedCredentialSources: credentialSources.length > 0 && hasMigratedAuthProfileCredentials(agentDir) ? [] : credentialSources
		};
	});
}
function hasLegacyAuthProfileSourcesForStartup(params) {
	let detected = false;
	for (const { agentDir, sources, unmigratedCredentialSources } of listStartupLegacyAuthProfileSources(params)) {
		detected ||= sources.length > 0;
		if (unmigratedCredentialSources.length > 0) markAuthProfileMigrationRequired(agentDir, new AuthProfileMigrationRequiredError({
			agentDir,
			sources: unmigratedCredentialSources
		}));
	}
	return detected;
}
var AuthProfileMigrationRequiredError = class extends Error {
	constructor(params) {
		const ownerId = shortenHomePath(resolveAuthProfileOwnerPath(params.agentDir));
		const sourceKinds = [...new Set(params.sources.map((source) => source.kind))].toSorted();
		super(`Auth profile store ${ownerId} requires legacy credential migration; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.code = AUTH_PROFILE_MIGRATION_REQUIRED_CODE;
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileMigrationRequiredError";
		this.ownerId = ownerId;
		this.sourceKinds = sourceKinds;
	}
};
var AuthProfileStoreUnreadableError = class extends Error {
	constructor(agentDir, env) {
		super(`Auth profile store ${shortenHomePath(resolveAuthProfileOwnerPath(agentDir, env))} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.code = "AUTH_PROFILE_STORE_UNREADABLE";
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileStoreUnreadableError";
	}
};
const migrationRequiredByDatabase = /* @__PURE__ */ new Map();
const warnedLegacySourceDatabases = /* @__PURE__ */ new Set();
function warnLegacyAuthProfileSourcesIgnored(params) {
	if (params.sources.length === 0) return;
	const databasePath = resolveAuthProfileOwnerPath(params.agentDir);
	if (warnedLegacySourceDatabases.has(databasePath)) return;
	warnedLegacySourceDatabases.add(databasePath);
	log.warn("retired auth profile files are ignored by runtime; run Doctor to archive them", {
		code: AUTH_PROFILE_MIGRATION_REQUIRED_CODE,
		ownerId: shortenHomePath(databasePath),
		sourceKinds: [...new Set(params.sources.map((source) => source.kind))].toSorted(),
		action: AUTH_PROFILE_MIGRATION_COMMAND
	});
}
function markAuthProfileMigrationRequired(agentDir, error) {
	const databasePath = resolveAuthProfileOwnerPath(agentDir);
	migrationRequiredByDatabase.set(databasePath, error);
}
function clearAuthProfileMigrationRequired(agentDir) {
	const databasePath = resolveAuthProfileOwnerPath(agentDir);
	migrationRequiredByDatabase.delete(databasePath);
}
function assertAuthProfileMigrationReady(agentDir) {
	const databasePath = resolveAuthProfileOwnerPath(agentDir);
	const error = migrationRequiredByDatabase.get(databasePath);
	if (error) throw error;
	const sources = listLegacyAuthProfileSources({ agentDir }).filter(isCredentialSource);
	if (sources.length === 0) return;
	if (hasMigratedAuthProfileCredentials(agentDir)) {
		warnLegacyAuthProfileSourcesIgnored({
			agentDir,
			sources
		});
		return;
	}
	const migrationError = new AuthProfileMigrationRequiredError({
		agentDir,
		sources
	});
	markAuthProfileMigrationRequired(agentDir, migrationError);
	throw migrationError;
}
function clearAuthProfileMigrationDiagnostics() {
	migrationRequiredByDatabase.clear();
	warnedLegacySourceDatabases.clear();
}
//#endregion
export { clearAuthProfileMigrationRequired as a, markAuthProfileMigrationRequired as c, clearAuthProfileMigrationDiagnostics as i, warnLegacyAuthProfileSourcesIgnored as l, AuthProfileStoreUnreadableError as n, hasLegacyAuthProfileCredentialSource as o, assertAuthProfileMigrationReady as r, hasLegacyAuthProfileSourcesForStartup as s, AuthProfileMigrationRequiredError as t };
