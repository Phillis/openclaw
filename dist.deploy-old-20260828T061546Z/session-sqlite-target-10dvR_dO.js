import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import "./session-key-Dbce_H9p.js";
import { d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-BEQsKM0c.js";
import { F as listOpenClawRegisteredAgentDatabases, R as isIncognitoOpenClawAgentSqlitePath, j as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { lstatSync, readdirSync } from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-sqlite-target.ts
function resolveRegisteredOwners(pathname, registeredDatabases, isSameDatabasePath) {
	return [...new Set(registeredDatabases.filter((entry) => isSameDatabasePath(entry.path, pathname)).map((entry) => normalizeAgentId(entry.agentId)))];
}
function resolveDatabaseOwner(pathname) {
	if (!hasFilesystemEntry(pathname)) return;
	const owner = inspectOpenClawAgentDatabaseOwner(pathname);
	return owner.status === "owned" ? normalizeAgentId(owner.agentId) : void 0;
}
function hasFilesystemEntry(pathname) {
	try {
		lstatSync(pathname);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function resolveCustomStoreSqlitePath(params) {
	const unsuffixedPath = path.resolve(params.unsuffixedPath);
	const sqliteBaseName = path.basename(unsuffixedPath, ".sqlite");
	const sessionsDir = path.dirname(unsuffixedPath);
	const defaultAgentId = normalizeAgentId(params.options.defaultAgentId ?? "main");
	const agentId = normalizeAgentId(params.options.agentId ?? defaultAgentId);
	const registeredDatabases = params.options.registeredDatabases ?? listOpenClawRegisteredAgentDatabases(params.options.env ? { env: params.options.env } : {});
	const isSameDatabasePath = params.options.isSameDatabasePath ?? isSameOpenClawAgentDatabasePath;
	const resolvePersistedOwner = (candidatePath) => {
		const registeredOwners = resolveRegisteredOwners(candidatePath, registeredDatabases, isSameDatabasePath);
		const databaseOwner = resolveDatabaseOwner(candidatePath);
		return {
			effectiveOwner: registeredOwners.length === 1 ? registeredOwners[0] : registeredOwners.length === 0 ? databaseOwner : void 0,
			registeredOwners
		};
	};
	const registeredUnsuffixedOwners = resolveRegisteredOwners(unsuffixedPath, registeredDatabases, isSameDatabasePath);
	const durableUnsuffixedOwner = resolveDatabaseOwner(unsuffixedPath);
	const persistedUnsuffixedOwner = registeredUnsuffixedOwners.length === 1 ? registeredUnsuffixedOwners[0] : registeredUnsuffixedOwners.length === 0 ? durableUnsuffixedOwner : void 0;
	const suffixedPathFor = (ownerAgentId) => path.join(sessionsDir, `${sqliteBaseName}.${ownerAgentId}.sqlite`);
	const resolveSuffixedTarget = (ownerAgentId) => {
		const prefix = `${sqliteBaseName}.${ownerAgentId}`;
		const parseIndex = (fileName) => {
			if (fileName === `${prefix}.sqlite`) return 1;
			if (!fileName.startsWith(`${prefix}.`) || !fileName.endsWith(".sqlite")) return;
			const rawValue = fileName.slice(prefix.length + 1, -7);
			if (!/^[1-9]\d*$/.test(rawValue)) return;
			const value = Number(rawValue);
			return Number.isSafeInteger(value) && value >= 2 && String(value) === rawValue ? value : void 0;
		};
		const occupiedIndexes = /* @__PURE__ */ new Set();
		for (const registered of registeredDatabases) {
			if (!isSameDatabasePath(path.dirname(registered.path), sessionsDir)) continue;
			const index = parseIndex(path.basename(registered.path));
			if (index !== void 0) occupiedIndexes.add(index);
		}
		try {
			for (const fileName of readdirSync(sessionsDir)) {
				const index = parseIndex(fileName);
				if (index !== void 0) occupiedIndexes.add(index);
			}
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
		const candidatePathAt = (index) => index === 1 ? suffixedPathFor(ownerAgentId) : path.join(sessionsDir, `${prefix}.${index}.sqlite`);
		const sortedOccupiedIndexes = [...occupiedIndexes].toSorted((left, right) => left - right);
		for (const index of sortedOccupiedIndexes) {
			const candidatePath = candidatePathAt(index);
			if (resolvePersistedOwner(candidatePath).effectiveOwner === ownerAgentId) return {
				owned: true,
				path: candidatePath
			};
		}
		let firstMissingIndex = 1;
		for (const index of sortedOccupiedIndexes) if (index === firstMissingIndex) firstMissingIndex += 1;
		else if (index > firstMissingIndex) break;
		for (let index = firstMissingIndex;; index += 1) {
			const candidatePath = candidatePathAt(index);
			const candidateOwner = resolvePersistedOwner(candidatePath);
			if (candidateOwner.effectiveOwner === ownerAgentId) return {
				owned: true,
				path: candidatePath
			};
			if (candidateOwner.registeredOwners.length === 0 && !hasFilesystemEntry(candidatePath)) return {
				owned: false,
				path: candidatePath
			};
		}
	};
	const defaultSuffixedTarget = resolveSuffixedTarget(defaultAgentId);
	const agentSuffixedTarget = agentId === defaultAgentId ? defaultSuffixedTarget : resolveSuffixedTarget(agentId);
	const defaultOwnsSuffixedPath = defaultSuffixedTarget.owned;
	const agentOwnsSuffixedPath = agentSuffixedTarget.owned;
	const unsuffixedAvailable = registeredUnsuffixedOwners.length === 0 && !hasFilesystemEntry(unsuffixedPath);
	const fallbackUnsuffixedOwner = persistedUnsuffixedOwner || defaultOwnsSuffixedPath || !unsuffixedAvailable ? void 0 : defaultAgentId;
	const unsuffixedOwnerAgentId = persistedUnsuffixedOwner ?? fallbackUnsuffixedOwner;
	const useUnsuffixedPath = agentId === persistedUnsuffixedOwner || !agentOwnsSuffixedPath && agentId === fallbackUnsuffixedOwner;
	const ownerSource = persistedUnsuffixedOwner ? registeredUnsuffixedOwners.length === 1 ? "database-registry" : "database-path" : defaultOwnsSuffixedPath ? "registered-suffixed" : registeredUnsuffixedOwners.length > 1 ? "ambiguous-registry" : !unsuffixedAvailable ? "occupied-unsuffixed" : "configured-default";
	return {
		agentId,
		path: useUnsuffixedPath ? unsuffixedPath : agentSuffixedTarget.path,
		ownerSource,
		...unsuffixedOwnerAgentId ? { unsuffixedOwnerAgentId } : {}
	};
}
/** Resolves only the legacy unsuffixed target, without reading ownership state. */
function resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath) {
	const resolved = path.resolve(storePath);
	if (path.basename(resolved) === "openclaw-agent.sqlite" || resolved.endsWith(".sqlite")) {
		const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
		return {
			path: resolved,
			...agentId ? { agentId } : {}
		};
	}
	const sessionsDir = path.dirname(resolved);
	if (path.basename(resolved) !== "sessions.json") {
		const sqliteBaseName = path.basename(resolved, path.extname(resolved)) || "openclaw-agent";
		return { path: path.join(sessionsDir, `${sqliteBaseName}.sqlite`) };
	}
	if (path.basename(sessionsDir) !== "sessions") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	const agentDir = path.dirname(sessionsDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	return {
		agentId: normalizeAgentId(path.basename(agentDir)),
		path: path.join(agentDir, "agent", "openclaw-agent.sqlite")
	};
}
/** Resolves the SQLite database target that owns a legacy session store path. */
function resolveSqliteTargetFromSessionStorePath(storePath, options = {}) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const requestedAgentId = options.agentId ? normalizeAgentId(options.agentId) : void 0;
	if (requestedAgentId && isIncognitoOpenClawAgentSqlitePath(unsuffixedTarget.path, {
		agentId: requestedAgentId,
		env: options.env
	})) return {
		agentId: requestedAgentId,
		path: unsuffixedTarget.path
	};
	if (unsuffixedTarget.agentId) return unsuffixedTarget;
	if (path.resolve(storePath).endsWith(".sqlite")) {
		const registeredDatabases = options.registeredDatabases ?? listOpenClawRegisteredAgentDatabases(options.env ? { env: options.env } : {});
		const registeredOwners = resolveRegisteredOwners(unsuffixedTarget.path, registeredDatabases, options.isSameDatabasePath ?? isSameOpenClawAgentDatabasePath);
		const databaseOwner = resolveDatabaseOwner(unsuffixedTarget.path);
		const configuredDefaultAgentId = normalizeAgentId(options.defaultAgentId ?? "main");
		const ownerAgentId = (registeredOwners.length === 1 ? registeredOwners[0] : void 0) ?? databaseOwner ?? configuredDefaultAgentId;
		return {
			...ownerAgentId ? { agentId: ownerAgentId } : {},
			path: unsuffixedTarget.path,
			shared: true,
			...registeredOwners.length === 1 ? { ownerSource: "database-registry" } : databaseOwner ? { ownerSource: "database-path" } : registeredOwners.length > 1 ? { ownerSource: "ambiguous-registry" } : { ownerSource: "configured-default" }
		};
	}
	return resolveCustomStoreSqlitePath({
		unsuffixedPath: unsuffixedTarget.path,
		options
	});
}
/** Lists durable owners recorded in the fixed store's bounded SQLite sibling family. */
function listDurableSqliteTargetOwnersForSessionStorePath(storePath) {
	const owners = /* @__PURE__ */ new Set();
	for (const candidatePath of listSqliteTargetCandidatePathsForSessionStorePath(storePath)) {
		const owner = resolveDatabaseOwner(candidatePath);
		if (owner) owners.add(owner);
	}
	return [...owners];
}
function listSqliteTargetCandidatePathsForSessionStorePath(storePath) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixedTarget.agentId || path.resolve(storePath).endsWith(".sqlite")) return [unsuffixedTarget.path];
	const directory = path.dirname(unsuffixedTarget.path);
	const baseName = path.basename(unsuffixedTarget.path, ".sqlite");
	const candidateNames = /* @__PURE__ */ new Set([path.basename(unsuffixedTarget.path)]);
	try {
		for (const fileName of readdirSync(directory)) if (fileName.startsWith(`${baseName}.`) && fileName.endsWith(".sqlite")) candidateNames.add(fileName);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	return [...candidateNames].map((fileName) => path.join(directory, fileName));
}
/** Lists the logical store's unsuffixed target plus durable owned partitions. */
function listDurableSqliteTargetPathsForSessionStorePath(storePath) {
	return listSqliteTargetCandidatePathsForSessionStorePath(storePath).filter((candidatePath, index) => index === 0 || resolveDatabaseOwner(candidatePath) !== void 0);
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
	if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
	const agentDbDir = path.dirname(databasePath);
	if (path.basename(agentDbDir) !== "agent") return;
	const agentDir = path.dirname(agentDbDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return;
	return normalizeAgentId(path.basename(agentDir));
}
//#endregion
export { resolveUnsuffixedSqliteTargetFromSessionStorePath as i, listDurableSqliteTargetPathsForSessionStorePath as n, resolveSqliteTargetFromSessionStorePath as r, listDurableSqliteTargetOwnersForSessionStorePath as t };
