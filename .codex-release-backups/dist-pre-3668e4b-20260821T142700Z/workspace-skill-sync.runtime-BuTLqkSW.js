import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { c as tryReadJson, u as writeJson } from "./json-C_hP6p1e.js";
import "./json-files-cVJKU9JY.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { a as resolveSandboxPath } from "./sandbox-paths-Bgdy3T5g.js";
import { o as canonicalizePath } from "./skill-index-CEvOAhOd.js";
import { r as resolveSkillKey } from "./frontmatter-BE0jYufM.js";
import { n as resolveSkillTelemetrySource } from "./source-BBJAIIqh.js";
import { r as getSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { r as loadWorkspaceSkills } from "./workspace-skill-loader-BuJvE2pz.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/loading/serialize.ts
const skillsSyncQueue = new KeyedAsyncQueue();
/** Serializes async work by key so repeated skill loads do not race on shared files. */
async function serializeByKey(key, task) {
	return await skillsSyncQueue.enqueue(key, task);
}
//#endregion
//#region src/skills/loading/workspace-skill-sync.runtime.ts
const fsp = fs.promises;
const skillsLogger = createSubsystemLogger("skills");
function resolveUniqueSyncedSkillDirName(base, used) {
	if (!used.has(base)) {
		used.add(base);
		return base;
	}
	for (let index = 2;; index += 1) {
		const candidate = `${base}-${index}`;
		if (!used.has(candidate)) {
			used.add(candidate);
			return candidate;
		}
	}
}
const SYNCED_SKILLS_MANIFEST_NAME = ".openclaw-sync.json";
const syncedSkillsUsageCache = /* @__PURE__ */ new Map();
function resolveSyncedSkillIdentity(skillKey, skillName) {
	return JSON.stringify([skillKey, skillName]);
}
function parseSyncedSkillsManifest(value) {
	if (!isRecord(value) || typeof value.skillsVersion !== "number" || !Number.isFinite(value.skillsVersion) || !Array.isArray(value.entryKeys) || !value.entryKeys.every((entry) => typeof entry === "string")) return null;
	return {
		entryKeys: value.entryKeys,
		skillsVersion: value.skillsVersion
	};
}
function resolveSyncedSkillDestinationPath(params) {
	const sourceDirName = (params.entry.syncDirName ?? path.basename(params.entry.skill.baseDir)).trim();
	if (!sourceDirName || sourceDirName === "." || sourceDirName === "..") return null;
	return resolveSandboxPath({
		filePath: resolveUniqueSyncedSkillDirName(sourceDirName, params.usedDirNames),
		cwd: params.targetSkillsDir,
		root: params.targetSkillsDir
	}).resolved;
}
async function ensureSyncedSkillsDirectory(targetSkillsDir) {
	let stats;
	try {
		stats = await fsp.lstat(targetSkillsDir);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		await fsp.mkdir(targetSkillsDir, { recursive: true });
		return;
	}
	if (!stats.isDirectory() || stats.isSymbolicLink()) {
		await fsp.rm(targetSkillsDir, {
			recursive: true,
			force: true
		});
		await fsp.mkdir(targetSkillsDir, { recursive: true });
	}
}
async function syncWorkspaceSkills(params) {
	const sourceDir = resolveUserPath(params.sourceWorkspaceDir);
	const targetDir = resolveUserPath(params.targetWorkspaceDir);
	if (sourceDir === targetDir) return [];
	return await serializeByKey(`syncSkills:${targetDir}`, async () => {
		const targetSkillsDir = path.join(targetDir, "skills");
		const manifestPath = path.join(targetSkillsDir, SYNCED_SKILLS_MANIFEST_NAME);
		const skillsVersion = getSkillsSnapshotVersion(sourceDir);
		const skillsSnapshot = params.skillsSnapshot;
		await ensureSyncedSkillsDirectory(targetSkillsDir);
		const manifest = parseSyncedSkillsManifest(await tryReadJson(manifestPath));
		const expectedManifestKey = skillsSnapshot?.version === skillsVersion ? JSON.stringify([skillsVersion, skillsSnapshot.skills.map((skill) => resolveSyncedSkillIdentity(skill.skillKey ?? skill.name, skill.name)).toSorted()]) : void 0;
		const cachedUsage = syncedSkillsUsageCache.get(targetSkillsDir);
		const manifestKey = manifest ? JSON.stringify([manifest.skillsVersion, manifest.entryKeys]) : void 0;
		if (expectedManifestKey && manifestKey === expectedManifestKey && cachedUsage?.manifestKey === manifestKey) return cachedUsage.skillUsagePaths.map((entry) => ({ ...entry }));
		const entries = loadWorkspaceSkills(sourceDir, {
			config: params.config,
			skillFilter: params.skillFilter,
			agentId: params.agentId,
			eligibility: params.eligibility,
			managedSkillsDir: params.managedSkillsDir,
			bundledSkillsDir: params.bundledSkillsDir,
			pluginSkillsDir: params.pluginSkillsDir
		});
		const usedDirNames = /* @__PURE__ */ new Set();
		const plans = [];
		for (const entry of entries) {
			const identity = resolveSyncedSkillIdentity(resolveSkillKey(entry.skill, entry), entry.skill.name);
			if (entry.skill.filePath.startsWith("node://")) {
				plans.push({
					entry,
					identity
				});
				continue;
			}
			let destinationPath;
			try {
				destinationPath = resolveSyncedSkillDestinationPath({
					targetSkillsDir,
					entry,
					usedDirNames
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : JSON.stringify(error);
				skillsLogger.warn(`Failed to resolve safe destination for ${entry.skill.name}: ${message}`);
				continue;
			}
			if (!destinationPath) {
				skillsLogger.warn(`Failed to resolve safe destination for ${entry.skill.name}: invalid source directory name`);
				continue;
			}
			plans.push({
				destinationPath,
				entry,
				identity
			});
		}
		await fsp.rm(manifestPath, { force: true });
		const previousUsage = manifest?.skillsVersion === skillsVersion && cachedUsage?.manifestKey === manifestKey ? cachedUsage : void 0;
		syncedSkillsUsageCache.delete(targetSkillsDir);
		const preservedDestinations = new Set(plans.flatMap((plan) => {
			const destination = plan.destinationPath ? path.basename(plan.destinationPath) : null;
			return previousUsage?.destinations.get(plan.identity) === destination ? destination ? [destination] : [] : [];
		}));
		for (const child of await fsp.readdir(targetSkillsDir)) if (!preservedDestinations.has(child)) await fsp.rm(path.join(targetSkillsDir, child), {
			recursive: true,
			force: true
		});
		const skillUsagePaths = [];
		let copyFailed = false;
		for (const plan of plans) {
			const { destinationPath, entry } = plan;
			if (!destinationPath) continue;
			if (!preservedDestinations.has(path.basename(destinationPath))) try {
				const syncSourceDir = entry.syncSourceDir ?? entry.skill.baseDir;
				await fsp.cp(syncSourceDir, destinationPath, {
					recursive: true,
					force: true,
					filter: (src) => {
						const name = path.basename(src);
						return !(name === ".git" || name === "node_modules");
					}
				});
			} catch (error) {
				copyFailed = true;
				const message = error instanceof Error ? error.message : JSON.stringify(error);
				skillsLogger.warn(`Failed to copy ${entry.skill.name} to sandbox: ${message}`);
				continue;
			}
			skillUsagePaths.push({
				readPath: path.join(destinationPath, path.relative(entry.skill.baseDir, entry.skill.filePath)),
				skillFile: canonicalizePath(entry.skill.filePath),
				skillName: entry.skill.name,
				skillSource: resolveSkillTelemetrySource(entry.skill)
			});
		}
		if (!copyFailed) {
			const nextManifest = {
				entryKeys: plans.map((plan) => plan.identity).toSorted(),
				skillsVersion
			};
			await writeJson(manifestPath, nextManifest, { trailingNewline: true });
			syncedSkillsUsageCache.set(targetSkillsDir, {
				destinations: new Map(plans.flatMap((plan) => plan.destinationPath ? [[plan.identity, path.basename(plan.destinationPath)]] : [])),
				manifestKey: JSON.stringify([skillsVersion, nextManifest.entryKeys]),
				skillUsagePaths
			});
			pruneMapToMaxSize(syncedSkillsUsageCache, 100);
		}
		return skillUsagePaths;
	});
}
//#endregion
export { syncWorkspaceSkills };
