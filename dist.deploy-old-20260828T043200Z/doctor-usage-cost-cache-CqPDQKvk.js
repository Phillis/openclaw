import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./openclaw-agent-db-CM8nAOgX.js";
import { F as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { t as note } from "./note-YH_0kY-3.js";
import { n as deleteSessionCostUsageRollupsExcept } from "./session-cost-usage-cache.sqlite-Qv0qs7Ju.js";
import { i as maybeScrubConfigAuditLog } from "./doctor-config-audit-scrub-C5wAuZnf.js";
import { t as runDoctorAgentDatabaseOperation } from "./doctor-agent-database-operation-Bx7ZEBay.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-usage-cost-cache.ts
/** Doctor cleanup for rebuildable legacy usage-cost cache sidecars. */
const LEGACY_USAGE_COST_TEMP_GRACE_MS = 1e4;
async function readFilesystemEntryOrMissing(filePath, read) {
	try {
		return await read();
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw new Error(`${shortenHomePath(filePath)}: ${formatErrorMessage(error)}`, { cause: error });
	}
}
function isLegacyUsageCostCacheTempName(name) {
	return /^\.usage-cost-cache\.\d+\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u.test(name) || /^\.usage-cost-cache(?:\.json)?\.\d+\.tmp$/u.test(name) || /^\.usage-cost-cache\.json\.lock\.\d+(?:\.\d+)?\.tmp$/u.test(name);
}
async function detectLegacyUsageCostCacheFiles(params) {
	const stateDir = resolveStateDir(params?.env ?? process.env, params?.homedir ?? os.homedir);
	const sessionDirs = [path.join(stateDir, "sessions")];
	const agentsDir = path.join(stateDir, "agents");
	const agentEntries = await readFilesystemEntryOrMissing(agentsDir, () => fs.readdir(agentsDir, { withFileTypes: true })) ?? [];
	for (const entry of agentEntries) if (entry.isDirectory()) sessionDirs.push(path.join(agentsDir, entry.name, "sessions"));
	const files = [];
	for (const sessionDir of sessionDirs) {
		const entries = await readFilesystemEntryOrMissing(sessionDir, () => fs.readdir(sessionDir, { withFileTypes: true })) ?? [];
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			const filePath = path.join(sessionDir, entry.name);
			if (entry.name === ".usage-cost-cache.json" || entry.name === ".usage-cost-cache.json.lock") {
				files.push(filePath);
				continue;
			}
			if (isLegacyUsageCostCacheTempName(entry.name)) {
				const stats = await readFilesystemEntryOrMissing(filePath, () => fs.stat(filePath));
				if (stats && Date.now() - stats.mtimeMs >= LEGACY_USAGE_COST_TEMP_GRACE_MS) files.push(filePath);
			}
		}
	}
	return files.toSorted();
}
async function maybeRemoveLegacyUsageCostCacheFiles(params) {
	const files = await detectLegacyUsageCostCacheFiles(params).catch((error) => {
		const command = params.shouldRepair ? "openclaw doctor --fix" : "openclaw doctor";
		note([
			`Legacy usage-cost cache ${params.shouldRepair ? "scan and cleanup" : "scan"} could not be completed; ${params.shouldRepair ? "no sidecar files were removed" : "cache state may remain uninspected"}.`,
			`- ${formatErrorMessage(error)}`,
			`Resolve the filesystem error and rerun \`${command}\`.`
		].join("\n"), "Usage cost cache");
		return null;
	});
	if (!files) return;
	if (files.length === 0) return;
	if (!params.shouldRepair) {
		note(`${files.length} rebuildable usage-cost cache ${files.length === 1 ? "file remains" : "files remain"}. Run \`openclaw doctor --fix\` to remove ${files.length === 1 ? "it" : "them"}.`, "Usage cost cache");
		return;
	}
	const failures = [];
	for (const filePath of files) await fs.rm(filePath, { force: true }).catch((error) => {
		failures.push(`${filePath}: ${String(error)}`);
	});
	if (failures.length > 0) {
		note(`Failed removing legacy usage-cost cache files:\n${failures.join("\n")}`, "Usage cost cache");
		return;
	}
	note(`Removed ${files.length} rebuildable legacy usage-cost cache ${files.length === 1 ? "file" : "files"}; SQLite rebuilds the cache on demand.`, "Usage cost cache");
}
async function maybeRemoveLegacySkillUploadTree(params) {
	const stateDir = resolveStateDir(params.env ?? process.env, params.homedir ?? os.homedir);
	const uploadRoot = path.join(stateDir, "tmp", "skill-uploads");
	const stats = await fs.lstat(uploadRoot).catch(() => null);
	if (!stats) return;
	if (!params.shouldRepair) {
		note("Legacy skill-upload staging remains. Run `openclaw doctor --fix` to discard it; active uploads now live in SQLite and must be retried.", "Skill uploads");
		return;
	}
	try {
		if (stats.isSymbolicLink()) await fs.unlink(uploadRoot);
		else await fs.rm(uploadRoot, {
			recursive: true,
			force: true
		});
	} catch (error) {
		note(`Failed removing legacy skill-upload staging: ${String(error)}`, "Skill uploads");
		return;
	}
	note("Removed legacy skill-upload staging; unfinished transient uploads must be retried.", "Skill uploads");
}
async function maybeRepairLegacyRuntimeFiles(shouldRepair, env) {
	await maybeScrubConfigAuditLog({
		shouldRepair,
		env
	});
	await maybeRemoveLegacyUsageCostCacheFiles({
		shouldRepair,
		env
	});
	if (shouldRepair) {
		for (const entry of listOpenClawRegisteredAgentDatabases({ env })) if ((await fs.stat(entry.path).catch(() => null))?.isFile()) runDoctorAgentDatabaseOperation({
			agentId: entry.agentId,
			path: entry.path,
			run: () => deleteSessionCostUsageRollupsExcept({
				agentId: entry.agentId,
				databasePath: entry.path,
				liveKeys: /* @__PURE__ */ new Set(),
				rows: []
			})
		});
	}
	await maybeRemoveLegacySkillUploadTree({
		shouldRepair,
		env
	});
}
//#endregion
export { maybeRepairLegacyRuntimeFiles };
