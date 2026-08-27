import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { c as isSessionStoreTempArtifactName, t as SESSION_STORE_TEMP_STALE_MS } from "./artifacts-Cg2BoGvO.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { g as openOpenClawAgentDatabase, i as closeOpenClawAgentDatabaseByPath, p as isOpenClawAgentDatabaseOpen } from "./openclaw-agent-db-lxLIE6rA.js";
import { K as setCanonicalSqliteSessionMainKey, o as resolveAllAgentSessionStoreTargetsSync, u as resolveAgentSessionDirs } from "./targets-DxP0vsft.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DH7-Rfwr.js";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-Dz7RFSUD.js";
import { u as migrateOrphanedSessionKeys } from "./state-migrations.session-store-DcjWHSEP.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/config/sessions/store-temp-cleanup.ts
const DELETE_CONCURRENCY = 16;
async function hasValidPrimaryStore(storePath) {
	try {
		return isRecord(JSON.parse(await fs.readFile(storePath, "utf8")));
	} catch {
		return false;
	}
}
/** Removes stale atomic-write temps only when the primary store is recoverable. */
async function sweepOrphanSessionStoreTemps(params) {
	const storeDir = path.dirname(params.storePath);
	const storeBasename = path.basename(params.storePath);
	const cutoffMs = (params.nowMs ?? Date.now()) - SESSION_STORE_TEMP_STALE_MS;
	const entries = await fs.readdir(storeDir, { withFileTypes: true }).catch(() => []);
	const { results: staleCandidates } = await runTasksWithConcurrency({
		limit: DELETE_CONCURRENCY,
		tasks: entries.filter((entry) => entry.isFile() && isSessionStoreTempArtifactName(entry.name, storeBasename)).map((entry) => async () => {
			const candidatePath = path.join(storeDir, entry.name);
			const stat = await fs.stat(candidatePath).catch(() => null);
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
				await fs.unlink(candidatePath);
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
		const prepareSurfaces = params.deps?.prepareLegacySessionSurfaces ?? (await import("./legacy-session-surfaces-DW7EJQe-.js")).prepareLegacySessionSurfaces;
		const result = await migrate({
			cfg: params.cfg,
			env,
			legacySessionSurfaces: prepareSurfaces({
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
	try {
		let removedFiles = 0;
		for (const target of targets) {
			const path = resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				env: params.env
			}).path;
			const alreadyOpen = isOpenClawAgentDatabaseOpen(path);
			setCanonicalSqliteSessionMainKey(openOpenClawAgentDatabase({
				agentId: target.agentId,
				path
			}), params.cfg.session?.mainKey);
			if (!alreadyOpen) closeOpenClawAgentDatabaseByPath(path);
			removedFiles += await sweepTemps({ storePath: target.storePath });
		}
		if (removedFiles > 0) params.log.info(`session: removed ${removedFiles} stale session store temp file(s)`);
	} catch (err) {
		params.log.warn(`session: stale session store temp cleanup failed during startup; continuing: ${String(err)}`);
	}
	return true;
}
//#endregion
export { runSessionStartupMigration as t };
