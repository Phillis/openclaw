import "./redact-CWP17HFN.js";
import { o as isPathInsideWithRealpath } from "./path-D138yf8v.js";
import { s as walkDirectorySync } from "./fs-safe-CmrQUApq.js";
import { t as CONFIG_DIR } from "./utils-Bw16L5tB.js";
import { r as isMissingPathError } from "./errno-CkbDOfLk.js";
import "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { r as hasKind } from "./slots-CQdAEuat.js";
import { d as resolveMemorySlotDecision } from "./config-state-Bgpvw0Q6.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-jAYIsS4O.js";
import { i as resolvePolicyPluginActivationState, r as normalizePluginsConfigWithResolver } from "./manifest-registry-DqYRJvWI.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DYnHXuqN.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/loading/plugin-skills.ts
const log = createSubsystemLogger("skills");
let pluginSkillRootsMemo = null;
registerPluginMetadataProcessMemoLifecycleClear(() => {
	pluginSkillRootsMemo = null;
});
function resolvePluginSkillRoots(params) {
	const workspaceDir = (params.workspaceDir ?? "").trim();
	if (!workspaceDir) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const metadataSnapshot = resolvePluginMetadataSnapshot({
		workspaceDir,
		config: params.config,
		env: process.env
	});
	return resolvePluginSkillRootsFromMetadata({
		...params,
		metadataSnapshot
	});
}
function resolvePluginSkillRootsFromMetadata(params) {
	const workspaceDir = (params.workspaceDir ?? "").trim();
	if (!workspaceDir) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const config = params.config ?? {};
	const metadataSnapshot = params.metadataSnapshot;
	const registry = metadataSnapshot.manifestRegistry;
	if (registry.plugins.length === 0) {
		publishPluginSkills([], { pluginSkillsDir: params.pluginSkillsDir });
		return [];
	}
	const acpRuntimeAvailable = isAcpRuntimeSpawnAvailable({ config });
	const canMemoize = params.pluginSkillsDir === void 0;
	if (canMemoize && pluginSkillRootsMemo && pluginSkillRootsMemo.workspaceDir === workspaceDir && pluginSkillRootsMemo.config === params.config && pluginSkillRootsMemo.snapshot === metadataSnapshot && pluginSkillRootsMemo.acpRuntimeAvailable === acpRuntimeAvailable) return pluginSkillRootsMemo.roots;
	const normalizedPlugins = normalizePluginsConfigWithResolver(config.plugins, metadataSnapshot.normalizePluginId);
	const memorySlot = normalizedPlugins.slots.memory;
	let selectedMemoryPluginId = null;
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const record of registry.plugins) {
		if (!record.skills || record.skills.length === 0) continue;
		if (!resolvePolicyPluginActivationState({
			id: record.id,
			origin: record.origin,
			config: normalizedPlugins,
			rootConfig: config,
			enabledByDefault: record.enabledByDefault
		}).activated) continue;
		if (!acpRuntimeAvailable && record.id === "acpx") continue;
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: selectedMemoryPluginId
		});
		if (!memoryDecision.enabled) continue;
		if (memoryDecision.selected && hasKind(record.kind, "memory")) selectedMemoryPluginId = record.id;
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: record.rootDir
		});
		for (const raw of record.skills) {
			const trimmed = raw.trim();
			if (!trimmed) continue;
			const candidate = path.resolve(record.rootDir, trimmed);
			if (!fs.existsSync(candidate)) {
				log.warn(`plugin skill path not found (${record.id}): ${candidate}`);
				continue;
			}
			if (!isPathInsideWithRealpath(record.rootDir, candidate, { requireRealpath: true })) {
				log.warn(`plugin skill path escapes plugin root (${record.id}): ${candidate}`);
				continue;
			}
			const candidates = record.bundleFormat === "agent" ? collectAgentSkillTargets(candidate) : [candidate];
			for (const resolvedCandidate of candidates) {
				if (seen.has(resolvedCandidate)) continue;
				seen.add(resolvedCandidate);
				resolved.push({
					dir: resolvedCandidate,
					rejectHardlinks
				});
			}
		}
	}
	publishPluginSkills(resolved.map((root) => root.dir), { pluginSkillsDir: params.pluginSkillsDir });
	if (canMemoize) pluginSkillRootsMemo = {
		workspaceDir,
		config: params.config,
		snapshot: metadataSnapshot,
		acpRuntimeAvailable,
		roots: resolved
	};
	return resolved;
}
function collectAgentSkillTargets(skillsRoot) {
	const targets = [];
	const entries = walkDirectorySync(skillsRoot, {
		maxDepth: 1,
		symlinks: "skip",
		include: (entry) => entry.kind === "directory"
	}).entries;
	for (const entry of entries) {
		if (hasPublishableSkillFile({
			skillDir: entry.path,
			rootDir: skillsRoot
		})) {
			targets.push(entry.path);
			continue;
		}
		log.warn(`agent plugin skill skipped because SKILL.md is missing or invalid: ${entry.path}`);
	}
	return targets;
}
function resolveDefaultPluginSkillsDir() {
	return path.join(CONFIG_DIR, "plugin-skills");
}
function resolvePluginSkillLinkType(platform = process.platform) {
	return platform === "win32" ? "junction" : "dir";
}
/**
* Collect skill dir targets from a resolved directory.
* If the directory contains a direct SKILL.md it is published as-is.
* Otherwise child subdirectories that contain SKILL.md are expanded.
*/
function collectSkillTargets(dir, targets) {
	if (hasPublishableSkillFile({
		skillDir: dir,
		rootDir: dir
	})) {
		const basename = path.basename(dir);
		const existing = targets.get(basename);
		if (existing) {
			log.warn(`plugin skill name collision: "${basename}" resolves to both ${existing} and ${dir}; only the first will be published`);
			return;
		}
		targets.set(basename, dir);
		return;
	}
	const entries = walkDirectorySync(dir, {
		maxDepth: 1,
		symlinks: "skip",
		include: (entry) => entry.kind === "directory"
	}).entries;
	for (const entry of entries) {
		const childPath = entry.path;
		if (!hasPublishableSkillFile({
			skillDir: childPath,
			rootDir: dir
		})) continue;
		const basename = entry.name;
		const existing = targets.get(basename);
		if (existing) {
			log.warn(`plugin skill name collision: "${basename}" resolves to both ${existing} and ${childPath}; only the first will be published`);
			continue;
		}
		targets.set(basename, childPath);
	}
}
function hasPublishableSkillFile(params) {
	const skillMd = path.join(params.skillDir, "SKILL.md");
	let skillMdStat;
	try {
		skillMdStat = fs.lstatSync(skillMd);
	} catch {
		return false;
	}
	if (!skillMdStat.isFile() || skillMdStat.isSymbolicLink()) {
		log.warn(`plugin skill SKILL.md is not a regular file: ${skillMd}`);
		return false;
	}
	if (!isPathInsideWithRealpath(params.rootDir, skillMd, { requireRealpath: true })) {
		log.warn(`plugin skill SKILL.md escapes declared skill root: ${skillMd}`);
		return false;
	}
	return true;
}
/**
* Creates symlinks from each resolved plugin skill directory into the
* plugin skills directory (~/.openclaw/plugin-skills/) so the agent SDK can
* discover them at the conventional file-system path.
*
* The plugin-skills directory is fully owned by OpenClaw — every entry is
* a generated symlink. Cleanup of stale links is therefore safe.
*/
function publishPluginSkills(skillDirs, opts) {
	const pluginSkillsDir = opts?.pluginSkillsDir ?? resolveDefaultPluginSkillsDir();
	const managedTargets = /* @__PURE__ */ new Map();
	for (const dir of skillDirs) collectSkillTargets(dir, managedTargets);
	for (const [name, target] of managedTargets) {
		const linkPath = path.join(pluginSkillsDir, name);
		try {
			fs.mkdirSync(pluginSkillsDir, { recursive: true });
		} catch {}
		try {
			const existingEntry = fs.lstatSync(linkPath);
			if (existingEntry.isSymbolicLink()) {
				if (fs.readlinkSync(linkPath) === target) continue;
				removeGeneratedPluginSkillEntry(linkPath);
			} else if (isGeneratedPluginSkillEntry(existingEntry)) removeGeneratedPluginSkillEntry(linkPath);
			else {
				log.warn(`plugin skill entry is not a generated symlink: ${linkPath}`);
				continue;
			}
		} catch (err) {
			if (!isMissingPathError(err)) {
				log.warn(`failed to inspect plugin skill symlink "${linkPath}": ${String(err)}`);
				continue;
			}
		}
		try {
			fs.symlinkSync(target, linkPath, resolvePluginSkillLinkType());
		} catch (err) {
			log.warn(`failed to create plugin skill symlink "${linkPath}" → "${target}": ${String(err)}`);
		}
	}
	let existingEntries;
	try {
		existingEntries = fs.readdirSync(pluginSkillsDir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of existingEntries) {
		if (!isGeneratedPluginSkillEntry(entry)) continue;
		if (managedTargets.has(entry.name)) continue;
		removeGeneratedPluginSkillEntry(path.join(pluginSkillsDir, entry.name));
	}
}
function isGeneratedPluginSkillEntry(entry) {
	return entry.isSymbolicLink() || process.platform === "win32" && entry.isDirectory();
}
function removeGeneratedPluginSkillEntry(linkPath) {
	try {
		if (fs.lstatSync(linkPath).isSymbolicLink()) {
			fs.unlinkSync(linkPath);
			return;
		}
	} catch (err) {
		if (isMissingPathError(err)) return;
	}
	try {
		fs.rmSync(linkPath, {
			recursive: true,
			force: true
		});
	} catch {}
}
//#endregion
export { resolvePluginSkillRootsFromMetadata as n, resolvePluginSkillRoots as t };
