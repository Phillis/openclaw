import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { c as isSessionStoreTempArtifactName, t as SESSION_STORE_TEMP_STALE_MS } from "./artifacts-FzMa6c2e.js";
import { An as executeSqliteQuerySync } from "./openclaw-state-db-CeAO_dqo.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import { g as openOpenClawAgentDatabase, i as closeOpenClawAgentDatabaseByPath, p as isOpenClawAgentDatabaseOpen } from "./openclaw-agent-db-CM8nAOgX.js";
import { F as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-CRlF3oxo.js";
import { m as patchSessionEntryCore } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { F as setCanonicalSqliteSessionMainKey, N as isCanonicalSqliteSessionMainKeyCurrent, s as parseReadableSqliteSessionEntryRow } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CVc2mOCy.js";
import { c as resolveSqliteScope, i as getSessionKysely, m as toDatabaseOptions } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import "./session-accessor-B-FKZX9M.js";
import { o as resolveAllAgentSessionStoreTargetsSync, u as resolveAgentSessionDirs } from "./targets-Bo3OPXck.js";
import { x as listRegistryWorktreesForMigration } from "./registry-C-YbfNzS.js";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-CmZe-tU0.js";
import { l as resolveProjectRegistry } from "./project-registry-CPtTZbcF.js";
import { u as migrateOrphanedSessionKeys } from "./state-migrations.session-store-D_QdBMGg.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { sql } from "kysely";
//#region src/config/sessions/store-temp-cleanup.ts
const DELETE_CONCURRENCY = 16;
async function hasValidPrimaryStore(storePath) {
	try {
		return isRecord(JSON.parse(await fs$1.readFile(storePath, "utf8")));
	} catch {
		return false;
	}
}
/** Removes stale atomic-write temps only when the primary store is recoverable. */
async function sweepOrphanSessionStoreTemps(params) {
	const storeDir = path.dirname(params.storePath);
	const storeBasename = path.basename(params.storePath);
	const cutoffMs = (params.nowMs ?? Date.now()) - SESSION_STORE_TEMP_STALE_MS;
	const entries = await fs$1.readdir(storeDir, { withFileTypes: true }).catch(() => []);
	const { results: staleCandidates } = await runTasksWithConcurrency({
		limit: DELETE_CONCURRENCY,
		tasks: entries.filter((entry) => entry.isFile() && isSessionStoreTempArtifactName(entry.name, storeBasename)).map((entry) => async () => {
			const candidatePath = path.join(storeDir, entry.name);
			const stat = await fs$1.stat(candidatePath).catch(() => null);
			if (!stat?.isFile() || stat.mtimeMs > cutoffMs) return null;
			return candidatePath;
		})
	});
	const stalePaths = staleCandidates.filter((candidatePath) => typeof candidatePath === "string");
	if (stalePaths.length === 0 || !await hasValidPrimaryStore(params.storePath)) return 0;
	const { results } = await runTasksWithConcurrency({
		limit: DELETE_CONCURRENCY,
		tasks: stalePaths.map((candidatePath) => async () => {
			try {
				await fs$1.unlink(candidatePath);
				return 1;
			} catch {
				return 0;
			}
		})
	});
	let removedCount = 0;
	for (const removed of results) removedCount += removed;
	return removedCount;
}
//#endregion
//#region src/config/sessions/worktree-workspace-migration.ts
function isInside(root, target) {
	const relative = path.relative(root, target);
	return relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative);
}
function resolveLegacyCanonicalWorkspace(params) {
	const worktree = params.entry.worktree;
	if (!worktree || worktree.canonicalWorkspaceDir) return;
	const recordedRepoRoot = path.resolve(worktree.repoRoot);
	if (params.entry.projectId) {
		const project = resolveProjectRegistry(params.cfg, params.entry.projectId, { env: params.env });
		const projectRoot = project ? path.resolve(project.repoRoot) : void 0;
		return projectRoot && isInside(recordedRepoRoot, projectRoot) ? projectRoot : void 0;
	}
	const record = params.worktrees.find((candidate) => candidate.id === worktree.id);
	const spawnedCwd = params.entry.spawnedCwd;
	if (record?.ownerKind === "session" && record.ownerId === params.sessionKey && spawnedCwd && path.resolve(record.repoRoot) === path.resolve(worktree.repoRoot)) {
		const relative = path.relative(path.resolve(record.path), path.resolve(spawnedCwd));
		if (relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative)) return path.resolve(recordedRepoRoot, relative);
	}
	const agentWorkspace = path.resolve(resolveAgentWorkspaceDir(params.cfg, params.agentId, params.env));
	return agentWorkspace && agentWorkspace === recordedRepoRoot ? agentWorkspace : void 0;
}
function listLegacyWorktreeSessionEntries(params) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where(sql`session_nodes.entry_valid != 1 OR (
            json_valid(session_nodes.entry_json)
            AND json_type(session_nodes.entry_json, '$.worktree') = 'object'
            AND (
              json_type(session_nodes.entry_json, '$.worktree.canonicalWorkspaceDir') IS NULL
              OR json_extract(session_nodes.entry_json, '$.worktree.canonicalWorkspaceDir') = ''
            )
          )`).orderBy("session_key", "asc")).rows.flatMap((row) => {
			const entry = parseReadableSqliteSessionEntryRow(database, row);
			return entry ? [{
				entry,
				sessionKey: row.session_key
			}] : [];
		});
	}, toDatabaseOptions(resolveSqliteScope({
		...params,
		sessionKey: ""
	})));
	return result.found ? result.value : [];
}
async function migrateManagedWorktreeCanonicalWorkspaces(params) {
	const env = params.env ?? process.env;
	const worktrees = listRegistryWorktreesForMigration(env);
	let migrated = 0;
	for (const { entry, sessionKey } of listLegacyWorktreeSessionEntries({
		agentId: params.agentId,
		env,
		storePath: params.storePath
	})) {
		const canonicalWorkspaceDir = resolveLegacyCanonicalWorkspace({
			agentId: params.agentId,
			cfg: params.cfg,
			entry,
			env,
			sessionKey,
			worktrees
		});
		if (!canonicalWorkspaceDir) continue;
		if ((await patchSessionEntryCore({
			agentId: params.agentId,
			env,
			sessionKey,
			storePath: params.storePath
		}, (current) => {
			if (!current.worktree || current.worktree.id !== entry.worktree?.id || current.worktree.canonicalWorkspaceDir) return null;
			return { worktree: {
				...current.worktree,
				canonicalWorkspaceDir
			} };
		}, {
			preserveActivity: true,
			skipMaintenance: true
		}))?.worktree?.canonicalWorkspaceDir === canonicalWorkspaceDir) migrated += 1;
	}
	return migrated;
}
//#endregion
//#region src/config/sessions/startup-migration.ts
/** Runs best-effort session migration and orphan-temp cleanup before runtime reads. */
async function runSessionStartupMigration(params) {
	const env = params.env ?? process.env;
	const migrate = params.deps?.migrateOrphanedSessionKeys ?? migrateOrphanedSessionKeys;
	const resolveTargets = params.deps?.resolveAllAgentSessionStoreTargetsSync ?? resolveAllAgentSessionStoreTargetsSync;
	let targets;
	let hasLegacySessionDirectories = true;
	try {
		if (!params.cfg.session?.store && (await resolveAgentSessionDirs(resolveStateDir(env))).length === 0) hasLegacySessionDirectories = false;
		else targets = resolveTargets(params.cfg, { env });
	} catch (err) {
		params.log.warn(`session: stale session store temp cleanup failed during startup; continuing: ${String(err)}`);
	}
	if (hasLegacySessionDirectories) try {
		const prepareSurfaces = params.deps?.prepareLegacySessionSurfaces ?? (await import("./legacy-session-surfaces-6eDuZmqQ.js")).prepareLegacySessionSurfaces;
		const result = await migrate({
			cfg: params.cfg,
			env,
			legacySessionSurfaces: () => prepareSurfaces({
				config: params.cfg,
				env
			})
		});
		if (result.changes.length > 0) params.log.info(`session: canonicalized orphaned session keys:\n${result.changes.map((c) => `- ${c}`).join("\n")}`);
		if (result.warnings.length > 0) params.log.warn(`session: session key migration warnings:\n${result.warnings.map((w) => `- ${w}`).join("\n")}`);
	} catch (err) {
		params.log.warn(`session: orphaned session key migration failed during startup; continuing: ${String(err)}`);
	}
	try {
		const result = await (params.deps?.migrateLegacyMainSessionKeys ?? migrateLegacyMainSessionKeys)({
			cfg: params.cfg,
			env,
			mode: "automatic"
		});
		if (result.changes.length > 0) params.log.info(`session: migrated retired main-agent session keys:\n${result.changes.map((change) => `- ${change}`).join("\n")}`);
		if (result.warnings.length > 0) params.log.warn(`session: retired main-agent session migration warnings:\n${result.warnings.map((warning) => `- ${warning}`).join("\n")}`);
	} catch (err) {
		params.log.warn(`session: retired main-agent session migration failed during startup; continuing: ${String(err)}`);
	}
	if (!hasLegacySessionDirectories) return false;
	if (!targets) return true;
	const sweepTemps = params.deps?.sweepOrphanSessionStoreTemps ?? sweepOrphanSessionStoreTemps;
	const databaseExists = params.deps?.sessionSqliteDatabaseExists ?? ((input) => input.path !== void 0 && fs.existsSync(input.path));
	try {
		let removedFiles = 0;
		let migratedWorktreeSessions = 0;
		const registeredDatabases = new Set(listOpenClawRegisteredAgentDatabases({ env }).map((entry) => `${entry.agentId}\0${entry.path}`));
		for (const target of targets) {
			const path = resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				env: params.env
			}).path;
			if (!databaseExists({
				agentId: target.agentId,
				...params.env ? { env: params.env } : {},
				path
			})) {
				removedFiles += await sweepTemps({ storePath: target.storePath });
				continue;
			}
			const alreadyOpen = isOpenClawAgentDatabaseOpen(path);
			if (!registeredDatabases.has(`${target.agentId}\0${path}`) || !isCanonicalSqliteSessionMainKeyCurrent({
				agentId: target.agentId,
				env,
				path
			}, params.cfg.session?.mainKey)) setCanonicalSqliteSessionMainKey(openOpenClawAgentDatabase({
				agentId: target.agentId,
				env,
				path
			}), params.cfg.session?.mainKey);
			const migrateWorktreeSessions = params.deps?.migrateManagedWorktreeCanonicalWorkspaces ?? migrateManagedWorktreeCanonicalWorkspaces;
			try {
				migratedWorktreeSessions += await migrateWorktreeSessions({
					agentId: target.agentId,
					cfg: params.cfg,
					env,
					storePath: target.storePath
				});
			} catch (error) {
				params.log.warn(`session: managed-worktree workspace migration failed for ${target.agentId}; continuing: ${String(error)}`);
			}
			if (!alreadyOpen && isOpenClawAgentDatabaseOpen(path)) closeOpenClawAgentDatabaseByPath(path);
			removedFiles += await sweepTemps({ storePath: target.storePath });
		}
		if (removedFiles > 0) params.log.info(`session: removed ${removedFiles} stale session store temp file(s)`);
		if (migratedWorktreeSessions > 0) params.log.info(`session: recorded canonical workspaces for ${migratedWorktreeSessions} managed-worktree session(s)`);
	} catch (err) {
		params.log.warn(`session: stale session store temp cleanup failed during startup; continuing: ${String(err)}`);
	}
	return true;
}
//#endregion
export { runSessionStartupMigration as t };
