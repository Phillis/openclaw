import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { C as resolveOAuthDir } from "./paths-CqeDjSA4.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { c as resolveSharedMainAuthAgentDir, s as resolveSharedAuthStorePath } from "./path-resolve-CttHagpC.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-CtUje688.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/legacy-source-diagnostic.ts
const AUTH_PROFILE_MIGRATION_REQUIRED_CODE = "AUTH_PROFILE_MIGRATION_REQUIRED";
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
const log = createSubsystemLogger("auth-profiles/persistence");
function isCredentialSource(source) {
	return source.kind !== "auth-state";
}
function resolveLegacyOAuthPath(env = process.env) {
	return path.join(resolveOAuthDir(env), "oauth.json");
}
function resolveAuthProfileOwnerPath(agentDir) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
}
function resolveLegacySourceAgentDir(agentDir, env = process.env) {
	return agentDir ? path.dirname(resolveAuthProfileOwnerPath(agentDir)) : resolveSharedMainAuthAgentDir(env);
}
/** Detects retired auth files by name only; runtime code must never read their contents. */
function listLegacyAuthProfileSources(params) {
	const agentDir = resolveLegacySourceAgentDir(params.agentDir, params.env);
	const candidates = [
		{
			kind: "auth-profiles",
			path: path.join(agentDir, "auth-profiles.json")
		},
		{
			kind: "auth-state",
			path: path.join(agentDir, "auth-state.json")
		},
		{
			kind: "legacy-auth",
			path: path.join(agentDir, "auth.json")
		}
	];
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	if (path.resolve(agentDir) === path.resolve(sharedMainDir)) candidates.push({
		kind: "legacy-oauth",
		path: resolveLegacyOAuthPath(params.env)
	});
	return candidates.filter((candidate) => fs.existsSync(candidate.path));
}
function listLegacyAuthProfileArchives(params) {
	const candidates = /* @__PURE__ */ new Map();
	for (const agentDir of params.agentDirs) {
		candidates.set(path.join(agentDir, "auth-profiles.json"), "auth-profiles");
		candidates.set(path.join(agentDir, "auth-state.json"), "auth-state");
		candidates.set(path.join(agentDir, "auth.json"), "legacy-auth");
	}
	candidates.set(resolveLegacyOAuthPath(params.env), "legacy-oauth");
	const archives = [];
	for (const [sourcePath, kind] of candidates) {
		const directory = path.dirname(sourcePath);
		const baseName = path.basename(sourcePath);
		const migratedPrefix = `${baseName}.migrated-`;
		const priorImportPrefix = `${baseName}.sqlite-import.`;
		let entries;
		try {
			entries = fs.readdirSync(directory);
		} catch {
			continue;
		}
		for (const entry of entries) if (entry.startsWith(migratedPrefix) || entry.startsWith(priorImportPrefix) && entry.endsWith(".bak")) archives.push({
			kind,
			path: path.join(directory, entry)
		});
	}
	return archives;
}
function hasLegacyAuthProfileCredentialSource(agentDir) {
	return listLegacyAuthProfileSources({ agentDir }).some(isCredentialSource);
}
function listStartupLegacyAuthProfileSources(params) {
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	return [.../* @__PURE__ */ new Set([...params.agentDirs, sharedMainDir])].map((agentDir) => {
		const sources = listLegacyAuthProfileSources({
			agentDir,
			env: params.env
		});
		return {
			agentDir,
			sources,
			credentialSources: sources.filter(isCredentialSource)
		};
	});
}
function hasLegacyAuthProfileSourcesForStartup(params) {
	let detected = false;
	for (const { agentDir, sources, credentialSources } of listStartupLegacyAuthProfileSources(params)) {
		detected ||= sources.length > 0;
		if (credentialSources.length > 0) markAuthProfileMigrationRequired(agentDir, new AuthProfileMigrationRequiredError({
			agentDir,
			sources: credentialSources
		}));
	}
	return detected;
}
/** Agent auth stores whose retired credential files make gateway startup fail until Doctor migrates them. */
function listAuthProfileStoresRequiringMigration(params) {
	const owners = listStartupLegacyAuthProfileSources(params).filter(({ credentialSources }) => credentialSources.length > 0).map(({ agentDir }) => shortenHomePath(resolveAuthProfileDatabasePath(agentDir)));
	return [...new Set(owners)].toSorted();
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
	constructor(agentDir) {
		super(`Auth profile store ${shortenHomePath(resolveAuthProfileOwnerPath(agentDir))} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
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
	if (sources.length > 0) {
		const migrationError = new AuthProfileMigrationRequiredError({
			agentDir,
			sources
		});
		markAuthProfileMigrationRequired(agentDir, migrationError);
		throw migrationError;
	}
}
function clearAuthProfileMigrationDiagnostics() {
	migrationRequiredByDatabase.clear();
	warnedLegacySourceDatabases.clear();
}
//#endregion
export { clearAuthProfileMigrationDiagnostics as a, hasLegacyAuthProfileSourcesForStartup as c, listLegacyAuthProfileSources as d, markAuthProfileMigrationRequired as f, assertAuthProfileMigrationReady as i, listAuthProfileStoresRequiringMigration as l, warnLegacyAuthProfileSourcesIgnored as m, AuthProfileMigrationRequiredError as n, clearAuthProfileMigrationRequired as o, resolveLegacyOAuthPath as p, AuthProfileStoreUnreadableError as r, hasLegacyAuthProfileCredentialSource as s, AUTH_PROFILE_MIGRATION_COMMAND as t, listLegacyAuthProfileArchives as u };
