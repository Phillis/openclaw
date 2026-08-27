import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { f as normalizeTrimmedStringList, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { s as walkDirectorySync } from "./fs-safe-C9N8pCh1.js";
import { c as resolveUserPath, i as resolveOsHomeDir } from "./home-dir-DcrXWQPU.js";
import "./path-guards-fBZukd5S.js";
import { d as resolveConfigDir, t as CONFIG_DIR } from "./utils-DEqefz4f.js";
import { o as isDefaultStateDir } from "./paths-CqeDjSA4.js";
import { a as normalizeSkillFilter, n as resolveEffectiveAgentSkillFilter, t as isSessionSkillEnabled } from "./agent-filter-DTbxyJ2D.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { o as canonicalizePath } from "./skill-index-CEvOAhOd.js";
import { r as createSyntheticSourceInfo, t as computeSkillPromptVersion } from "./skill-version-BztMvclw.js";
import { i as resolveSkillManifestMetadata, n as resolveSkillInvocationPolicy, r as resolveSkillKey, t as parseSkillFrontmatter } from "./frontmatter-BE0jYufM.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { n as getArchivedSkillFiles } from "./curator-hPwQ_i20.js";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BfHNzP7v.js";
import { n as readSkillFrontmatterSafe, t as loadSkillsFromDirSafe } from "./local-loader-BJ3elWx6.js";
import { l as shouldIncludeSkill, o as resolveBundledAllowlist } from "./config-Dq2GoT57.js";
import { n as resolveNodeIdFromNodeList } from "./node-resolve-D2_WjEZg.js";
import { t as resolvePluginSkillDirs } from "./plugin-skills-C8Iz0wdv.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths, r as tryRealpath, t as findContainingAllowedSkillSymlinkTarget } from "./symlink-targets-Cwce114b.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/skills/runtime/remote-skills.ts
const remoteSkillNodes = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("gateway/skills-remote");
let reconcileRemoteSkillConnections = null;
function remoteConnectionKey(nodeId, connId) {
	return `${nodeId}\0${connId}`;
}
/** Installs the gateway-owned persistent-generation reconciliation boundary. */
function setRemoteSkillConnectionReconciler(reconcile) {
	reconcileRemoteSkillConnections = reconcile;
}
function prepareNodeSkills(nodeId, skills) {
	const prepared = [];
	for (const skill of skills) try {
		const frontmatter = parseSkillFrontmatter(skill.content);
		if (frontmatter.name?.trim() !== skill.name || frontmatter.description?.trim() !== skill.description) {
			log.warn(`dropped node skill with mismatched frontmatter: ${nodeId}/${skill.name}`);
			continue;
		}
		prepared.push({
			...skill,
			frontmatter
		});
	} catch (error) {
		const filePath = `node://${encodeURIComponent(nodeId)}/skills/${skill.name}/SKILL.md`;
		log.warn(`dropped node skill with invalid frontmatter (${filePath}): ${String(error)}`);
	}
	return prepared;
}
function sameSkills(left, right) {
	return left.length === right.length && left.every((skill, index) => skill.name === right[index]?.name && skill.description === right[index]?.description && skill.content === right[index]?.content);
}
function recordRemoteSkillNodeInfo(node) {
	const existing = remoteSkillNodes.get(node.nodeId);
	const connectionChanged = Boolean(node.connId && existing?.connId !== node.connId);
	const displayChanged = existing?.displayName !== node.displayName;
	const canExec = node.commands?.includes("system.run") ?? existing?.canExec ?? false;
	const executionChanged = existing?.canExec !== canExec;
	remoteSkillNodes.set(node.nodeId, {
		nodeId: node.nodeId,
		connId: node.connId ?? existing?.connId,
		displayName: node.displayName,
		connected: true,
		canExec,
		skills: connectionChanged ? [] : existing?.skills ?? []
	});
	if ((connectionChanged || displayChanged || executionChanged) && (existing?.skills.length ?? 0) > 0) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function replaceRemoteNodeSkills(params) {
	const nextSkills = prepareNodeSkills(params.nodeId, params.skills);
	const existing = remoteSkillNodes.get(params.nodeId);
	const changed = !existing?.connected || existing.displayName !== params.displayName || !sameSkills(existing.skills, nextSkills);
	remoteSkillNodes.set(params.nodeId, {
		nodeId: params.nodeId,
		connId: existing?.connId,
		displayName: params.displayName ?? existing?.displayName,
		connected: true,
		canExec: existing?.canExec ?? false,
		skills: nextSkills
	});
	if (changed) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function removeRemoteNodeSkills(nodeId) {
	const existing = remoteSkillNodes.get(nodeId);
	remoteSkillNodes.delete(nodeId);
	if (existing?.skills.length) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function sanitizeSkillNameFragment(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24).replace(/-+$/g, "") || "node";
}
function prefixedSkillName(params) {
	const prefix = `${sanitizeSkillNameFragment(params.nodeId)}-`;
	for (let index = 0; index < 100; index += 1) {
		const suffix = index === 0 ? "" : `-${index + 1}`;
		const availableBaseLength = Math.max(1, 64 - prefix.length - suffix.length);
		const candidate = `${prefix}${params.baseName.slice(0, availableBaseLength).replace(/-+$/g, "") || "skill"}${suffix}`;
		if (!params.usedNames.has(candidate)) return candidate;
	}
	return null;
}
function remoteSkillLocation(nodeId, name) {
	return `node://${encodeURIComponent(nodeId)}/skills/${name}/SKILL.md`;
}
function locatorNote(node, skillName) {
	const label = node.displayName?.trim() || node.nodeId;
	const cwd = remoteSkillLocation(node.nodeId, skillName).slice(0, -9);
	return `Node-hosted on ${label} (${node.nodeId}). Read this SKILL.md with the normal read tool at its exact node:// location; do not use file_fetch, which only accepts approved absolute node paths. If read is unavailable, use exec host=node node=${node.nodeId} with workdir=${cwd} to run cat SKILL.md. Run referenced files and bins with the same exec target and workdir; the node host resolves that locator to the node-local skill directory.`;
}
function mergeRemoteNodeSkillEntries(localEntries, options) {
	if (options?.canExec !== true) return [...localEntries];
	const currentConnections = reconcileRemoteSkillConnections?.();
	const connectedNodes = [...remoteSkillNodes.values()].filter((node) => node.connected && node.canExec && (!currentConnections || node.connId !== void 0 && currentConnections.has(remoteConnectionKey(node.nodeId, node.connId))));
	let boundNodeId;
	if (options.node) try {
		boundNodeId = resolveNodeIdFromNodeList(connectedNodes, options.node);
	} catch {
		return [...localEntries];
	}
	const remote = connectedNodes.filter((node) => !boundNodeId || node.nodeId === boundNodeId).flatMap((node) => node.skills.map((skill) => ({
		node,
		skill
	}))).toSorted((left, right) => left.skill.name.localeCompare(right.skill.name, "en") || left.node.nodeId.localeCompare(right.node.nodeId, "en"));
	if (remote.length === 0) return [...localEntries];
	const remoteNameCounts = /* @__PURE__ */ new Map();
	for (const { skill } of remote) remoteNameCounts.set(skill.name, (remoteNameCounts.get(skill.name) ?? 0) + 1);
	const localNames = new Set(localEntries.map((entry) => entry.skill.name));
	const usedNames = new Set(localNames);
	const remoteEntries = [];
	for (const { node, skill } of remote) {
		const exposedName = usedNames.has(skill.name) || (remoteNameCounts.get(skill.name) ?? 0) > 1 ? prefixedSkillName({
			nodeId: node.nodeId,
			baseName: skill.name,
			usedNames
		}) : skill.name;
		if (!exposedName || usedNames.has(exposedName)) {
			log.warn(`dropped node skill with unresolved name collision: ${node.nodeId}/${skill.name}`);
			continue;
		}
		usedNames.add(exposedName);
		const filePath = remoteSkillLocation(node.nodeId, skill.name);
		const invocation = resolveSkillInvocationPolicy(skill.frontmatter);
		remoteEntries.push({
			skill: {
				name: exposedName,
				description: skill.description,
				locationNote: locatorNote(node, skill.name),
				readContent: skill.content,
				filePath,
				baseDir: filePath.slice(0, -9),
				promptVersion: computeSkillPromptVersion(skill.content),
				source: "openclaw-node",
				sourceInfo: createSyntheticSourceInfo(filePath, {
					source: "openclaw-node",
					scope: "temporary",
					origin: "top-level",
					baseDir: filePath.slice(0, -9)
				}),
				disableModelInvocation: invocation.disableModelInvocation
			},
			frontmatter: skill.frontmatter,
			invocation,
			disableCommandDispatch: true,
			exposure: {
				includeInRuntimeRegistry: true,
				includeInAvailableSkillsPrompt: !invocation.disableModelInvocation,
				userInvocable: invocation.userInvocable
			}
		});
	}
	return [...localEntries, ...remoteEntries].toSorted((left, right) => left.skill.name.localeCompare(right.skill.name, "en"));
}
function resetRemoteNodeSkillsForTests() {
	remoteSkillNodes.clear();
	reconcileRemoteSkillConnections = null;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.remoteNodeSkillsTestApi")] = { resetRemoteNodeSkillsForTests };
//#endregion
//#region src/skills/loading/skill-paths.ts
/** Resolve the effective user home used by skill discovery. */
function resolveSkillsUserHomeDir() {
	return resolveOsHomeDir(process.env, os.homedir);
}
function resolveNativeUserHomeDir() {
	try {
		return path.resolve(os.homedir());
	} catch {
		return;
	}
}
function resolveCompactHomePrefixes() {
	const resolvedHomes = [resolveSkillsUserHomeDir(), resolveNativeUserHomeDir()].filter((home) => Boolean(home)).map((home) => path.resolve(home));
	const realHomes = resolvedHomes.map((home) => tryRealpath(home)).filter((home) => Boolean(home));
	return uniqueStrings([...resolvedHomes, ...realHomes]).toSorted((a, b) => b.length - a.length);
}
/** Compact prompt-facing skill paths while preserving managed paths that `~` cannot reach. */
function compactPromptSkills(skills) {
	const homes = resolveCompactHomePrefixes();
	if (homes.length === 0) return skills;
	const preservedRoots = resolvePreservedPromptSkillPathRoots();
	const tildeRoots = resolvePromptTildeRoots();
	return skills.map((skill) => ({
		...skill,
		filePath: shouldPreservePromptSkillPath(skill.filePath, preservedRoots, tildeRoots) ? skill.filePath : compactHomePath(skill.filePath, homes)
	}));
}
function resolvePreservedPromptSkillPathRoots() {
	const configDir = resolveConfigDir();
	const promptSkillDirs = [path.resolve(configDir, "skills"), path.resolve(configDir, "plugin-skills")];
	const realPromptSkillDirs = promptSkillDirs.map((dir) => tryRealpath(dir)).filter((dir) => Boolean(dir));
	return uniqueStrings([...promptSkillDirs, ...realPromptSkillDirs]);
}
function resolvePromptTildeRoots() {
	const nativeHome = resolveNativeUserHomeDir();
	if (!nativeHome) return [];
	const resolvedNativeHome = path.resolve(nativeHome);
	if (isContainerStateHomeWherePromptTildeEscapes(resolvedNativeHome)) return [];
	const realNativeHome = tryRealpath(resolvedNativeHome);
	return uniqueStrings([resolvedNativeHome, ...realNativeHome ? [realNativeHome] : []]);
}
function isContainerStateHomeWherePromptTildeEscapes(home) {
	const configDir = path.resolve(resolveConfigDir());
	return home === "/data" && (configDir === "/data/.openclaw" || isPathInside("/data/.openclaw", configDir));
}
function shouldPreservePromptSkillPath(filePath, roots, tildeRoots) {
	const resolvedFilePath = path.resolve(filePath);
	if (!roots.some((root) => resolvedFilePath === root || isPathInside(root, resolvedFilePath))) return false;
	return !tildeRoots.some((root) => resolvedFilePath === root || isPathInside(root, resolvedFilePath));
}
function compactHomePath(filePath, homes) {
	for (const home of homes) for (const prefix of compactHomePrefixesForHome(home)) if (filePath.startsWith(prefix)) return "~/" + normalizeCompactedSkillPath(filePath.slice(prefix.length), prefix);
	return filePath;
}
function compactHomePrefixesForHome(home) {
	const prefixes = [home.endsWith(path.sep) ? home : home + path.sep];
	if (home.includes("\\") && !home.endsWith("\\")) prefixes.push(home + "\\");
	return prefixes;
}
function normalizeCompactedSkillPath(filePath, matchedHomePrefix) {
	return matchedHomePrefix.includes("\\") ? filePath.replace(/\\/g, "/") : filePath;
}
/** Compact a skill path for console diagnostics. */
function compactSkillPath(filePath) {
	return compactHomePath(filePath, resolveCompactHomePrefixes());
}
//#endregion
//#region src/skills/loading/skill-root-discovery.ts
const skillsLogger$1 = createSubsystemLogger("skills");
const DEFAULT_MAX_CANDIDATES_PER_ROOT = 300;
const DEFAULT_MAX_SKILLS_LOADED_PER_SOURCE = 200;
const DEFAULT_MAX_SKILL_FILE_BYTES = 256e3;
const DEFAULT_MIN_RAW_ENTRIES_PER_DIRECTORY_SCAN = 1e3;
const DEFAULT_MAX_RAW_ENTRIES_PER_DIRECTORY_SCAN = 1e4;
const MAX_GROUPED_SKILL_SCAN_DEPTH = 6;
const MAX_CONFIGURED_ROOT_GROUPED_SKILL_SCAN_DEPTH = 2;
function resolveSkillDiscoveryLimits(config) {
	const limits = config?.skills?.limits;
	return {
		maxCandidatesPerRoot: limits?.maxCandidatesPerRoot ?? DEFAULT_MAX_CANDIDATES_PER_ROOT,
		maxSkillsLoadedPerSource: limits?.maxSkillsLoadedPerSource ?? DEFAULT_MAX_SKILLS_LOADED_PER_SOURCE,
		maxSkillFileBytes: limits?.maxSkillFileBytes ?? DEFAULT_MAX_SKILL_FILE_BYTES
	};
}
function listChildDirectories(dir, opts) {
	const scan = walkDirectorySync(dir, {
		maxDepth: 1,
		maxEntries: opts?.maxRawEntriesToScan === void 0 ? resolveRawEntryScanLimit(opts?.maxCandidateDirs) : Math.max(0, opts.maxRawEntriesToScan),
		symlinks: opts?.followSymlinks === false ? "skip" : "follow",
		include: (entry) => entry.kind === "directory" && !entry.name.startsWith(".") && entry.name !== "node_modules"
	});
	if (scan.scannedEntryCount === 0 && scan.entries.length === 0) return {
		dirs: [],
		scannedEntryCount: 0,
		truncated: false
	};
	return {
		dirs: scan.entries.map((entry) => entry.name),
		scannedEntryCount: scan.scannedEntryCount,
		truncated: scan.truncated
	};
}
function resolveRawEntryScanLimit(maxCandidateDirs) {
	if (maxCandidateDirs === void 0) return Number.POSITIVE_INFINITY;
	const normalized = Math.max(0, maxCandidateDirs);
	if (normalized === 0) return 0;
	return Math.min(DEFAULT_MAX_RAW_ENTRIES_PER_DIRECTORY_SCAN, Math.max(DEFAULT_MIN_RAW_ENTRIES_PER_DIRECTORY_SCAN, normalized * 10));
}
function createSkillDiscoveryBudget(maxCandidateDirs) {
	const normalized = Math.max(0, maxCandidateDirs);
	return {
		remainingDirectoryScans: normalized * MAX_GROUPED_SKILL_SCAN_DEPTH,
		remainingRawEntries: resolveRawEntryScanLimit(normalized) * (normalized + 1),
		truncated: false
	};
}
function listBudgetedChildDirectories(dir, budget, opts) {
	if (budget.remainingDirectoryScans <= 0 || budget.remainingRawEntries <= 0) {
		budget.truncated = true;
		return {
			dirs: [],
			scannedEntryCount: 0,
			truncated: false
		};
	}
	budget.remainingDirectoryScans -= 1;
	const maxRawEntriesToScan = Math.min(resolveRawEntryScanLimit(opts.maxCandidateDirs), budget.remainingRawEntries);
	const scan = listChildDirectories(dir, {
		followSymlinks: opts.followSymlinks,
		maxCandidateDirs: opts.maxCandidateDirs,
		maxRawEntriesToScan
	});
	budget.remainingRawEntries = Math.max(0, budget.remainingRawEntries - scan.scannedEntryCount);
	budget.truncated ||= scan.truncated;
	return scan;
}
function containsDiscoverableSkill(dir, opts) {
	const discoveryBudget = createSkillDiscoveryBudget(opts.maxCandidateDirs);
	const queue = [{
		dir,
		depth: 0
	}];
	for (const candidate of queue) {
		if (!candidate) continue;
		if (candidate.depth > 0 && fs.existsSync(path.join(candidate.dir, "SKILL.md"))) {
			if (hasLoadableSkillFrontmatter(dir, candidate.dir, opts.maxSkillFileBytes)) return true;
			continue;
		}
		if (candidate.depth >= MAX_GROUPED_SKILL_SCAN_DEPTH) continue;
		if (hasCandidateSymlinkChild(candidate.dir, candidate.depth === 0 ? opts.skipTopLevelDirName : void 0, resolveRawEntryScanLimit(opts.maxCandidateDirs))) return true;
		const childDirs = listBudgetedChildDirectories(candidate.dir, discoveryBudget, {
			followSymlinks: false,
			maxCandidateDirs: opts.maxCandidateDirs
		}).dirs;
		for (const childDir of childDirs.toSorted().slice(0, opts.maxCandidateDirs)) {
			if (candidate.depth === 0 && childDir === opts.skipTopLevelDirName) continue;
			queue.push({
				dir: path.join(candidate.dir, childDir),
				depth: candidate.depth + 1
			});
		}
	}
	return false;
}
function hasCandidateSymlinkChild(dir, skipName, maxEntriesToScan) {
	const maxEntries = Math.max(0, maxEntriesToScan);
	if (maxEntries === 0) return false;
	let handle;
	try {
		handle = fs.opendirSync(dir);
		for (let scanned = 0; scanned < maxEntries; scanned += 1) {
			const entry = handle.readSync();
			if (!entry) break;
			if (entry.name === skipName || entry.name.startsWith(".") || entry.name === "node_modules") continue;
			if (entry.isSymbolicLink()) return true;
		}
	} catch {
		return false;
	} finally {
		handle?.closeSync();
	}
	return false;
}
function hasLoadableSkillFrontmatter(rootDir, skillDir, maxSkillFileBytes) {
	const frontmatter = readSkillFrontmatterSafe({
		rootDir,
		filePath: path.join(skillDir, "SKILL.md"),
		maxBytes: maxSkillFileBytes ?? DEFAULT_MAX_SKILL_FILE_BYTES
	});
	const fallbackName = path.basename(skillDir).trim();
	const name = frontmatter?.name?.trim() || fallbackName;
	return Boolean(name) && Boolean(frontmatter?.description?.trim());
}
function isSymlinkPath(filePath) {
	try {
		return fs.lstatSync(filePath).isSymbolicLink();
	} catch {
		return false;
	}
}
function buildEscapedSkillPathReason(params) {
	const candidateIsSymlink = isSymlinkPath(params.candidatePath);
	if (params.source === "openclaw-bundled" && candidateIsSymlink) return {
		reason: "bundled-symlink-escape",
		consoleHint: "reason=bundled-symlink-escape hint=likely-stray-local-symlink-or-checkout-mutation"
	};
	if (candidateIsSymlink) return {
		reason: "symlink-escape",
		consoleHint: "reason=symlink-escape"
	};
	if (params.source === "openclaw-bundled") return {
		reason: "bundled-root-escape",
		consoleHint: "reason=bundled-root-escape hint=likely-stray-local-symlink-or-checkout-mutation"
	};
	return {
		reason: "path-escape",
		consoleHint: "reason=path-escape"
	};
}
function warnEscapedSkillPath(params) {
	const compactRootDir = compactSkillPath(params.rootDir);
	const compactRootRealPath = compactSkillPath(params.rootRealPath);
	const compactCandidatePath = compactSkillPath(params.candidatePath);
	const compactCandidateRealPath = compactSkillPath(params.candidateRealPath);
	const rootResolved = path.resolve(params.rootDir) === params.rootRealPath ? "" : ` rootResolved=${compactRootRealPath}`;
	const escapeReason = buildEscapedSkillPathReason({
		source: params.source,
		candidatePath: params.candidatePath
	});
	skillsLogger$1.warn("Skipping escaped skill path outside its configured root.", {
		source: params.source,
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		path: params.candidatePath,
		realPath: params.candidateRealPath,
		reason: escapeReason.reason,
		consoleMessage: `Skipping escaped skill path outside its configured root: source=${params.source} root=${compactRootDir}${rootResolved} ${escapeReason.consoleHint} requested=${compactCandidatePath} resolved=${compactCandidateRealPath}`
	});
}
function resolveContainedSkillPath(params) {
	const candidateRealPath = tryRealpath(params.candidatePath);
	if (!candidateRealPath) return null;
	if (isPathInside(params.rootRealPath, candidateRealPath) || findContainingAllowedSkillSymlinkTarget(params.allowedSymlinkTargetRealPaths ?? [], candidateRealPath) !== null) return candidateRealPath;
	warnEscapedSkillPath({
		source: params.source,
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		candidatePath: path.resolve(params.candidatePath),
		candidateRealPath
	});
	return null;
}
function resolveNestedSkillsRoot(dir, opts) {
	if (hasLoadableSkillFrontmatter(dir, dir, opts?.maxSkillFileBytes)) return { baseDir: dir };
	const rootSkillMdExists = fs.existsSync(path.join(dir, "SKILL.md"));
	const nested = path.join(dir, "skills");
	try {
		if (!fs.existsSync(nested) || !fs.statSync(nested).isDirectory()) return { baseDir: dir };
	} catch {
		return { baseDir: dir };
	}
	const scanLimit = Math.max(0, opts?.maxEntriesToScan ?? 100);
	if (!rootSkillMdExists && containsDiscoverableSkill(dir, {
		maxCandidateDirs: scanLimit,
		maxSkillFileBytes: opts?.maxSkillFileBytes,
		skipTopLevelDirName: "skills"
	})) return { baseDir: dir };
	const discoveryBudget = createSkillDiscoveryBudget(scanLimit);
	const queue = [{
		dir: nested,
		depth: 0
	}];
	for (const candidate of queue) {
		if (!candidate) continue;
		if (hasLoadableSkillFrontmatter(nested, candidate.dir, opts?.maxSkillFileBytes)) return {
			baseDir: nested,
			note: `Detected nested skills root at ${nested}`
		};
		if (candidate.depth >= MAX_GROUPED_SKILL_SCAN_DEPTH) continue;
		const childDirs = listBudgetedChildDirectories(candidate.dir, discoveryBudget, {
			followSymlinks: false,
			maxCandidateDirs: scanLimit
		}).dirs;
		for (const childDir of childDirs.toSorted().slice(0, scanLimit)) queue.push({
			dir: path.join(candidate.dir, childDir),
			depth: candidate.depth + 1
		});
	}
	return { baseDir: dir };
}
function shouldEnforceConfiguredSkillRootContainment(source) {
	return source !== "openclaw-managed" && source !== "agents-skills-personal";
}
function shouldUseConfiguredSymlinkTargets(source) {
	return source === "openclaw-workspace" || source === "openclaw-extra" || source === "agents-skills-project";
}
function resolveSkillRootCandidatePath(params) {
	if (!shouldEnforceConfiguredSkillRootContainment(params.source)) return tryRealpath(params.candidatePath);
	return resolveContainedSkillPath({
		source: params.source,
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		candidatePath: params.candidatePath,
		allowedSymlinkTargetRealPaths: shouldUseConfiguredSymlinkTargets(params.source) ? params.allowedSymlinkTargetRealPaths : []
	});
}
function canonicalSkillDirForSource(source, skillDirRealPath) {
	return shouldEnforceConfiguredSkillRootContainment(source) ? void 0 : skillDirRealPath;
}
function resolveSkillFilePath(params) {
	return resolveContainedSkillPath({
		source: params.source,
		rootDir: params.skillDir,
		rootRealPath: params.skillDirRealPath,
		candidatePath: params.candidatePath
	});
}
/** Discover validated skill directory candidates below one configured source root. */
function discoverSkillCandidates(params) {
	const rootDir = path.resolve(params.dir);
	if (!fs.existsSync(rootDir)) return {
		candidates: [],
		rootIsSkill: false
	};
	const rootRealPath = tryRealpath(rootDir) ?? rootDir;
	const baseDir = resolveNestedSkillsRoot(params.dir, {
		maxEntriesToScan: params.limits.maxCandidatesPerRoot,
		maxSkillFileBytes: params.limits.maxSkillFileBytes
	}).baseDir;
	const baseDirRealPath = resolveSkillRootCandidatePath({
		source: params.source,
		rootDir,
		rootRealPath,
		candidatePath: baseDir,
		allowedSymlinkTargetRealPaths: params.allowedSymlinkTargetRealPaths
	});
	if (!baseDirRealPath) return {
		candidates: [],
		rootIsSkill: false
	};
	const rootSkillMd = path.join(baseDir, "SKILL.md");
	if (fs.existsSync(rootSkillMd)) {
		const rootSkillRealPath = resolveSkillFilePath({
			source: params.source,
			skillDir: baseDir,
			skillDirRealPath: baseDirRealPath,
			candidatePath: rootSkillMd
		});
		return {
			candidates: rootSkillRealPath ? [{
				skillDir: baseDir,
				skillDirRealPath: baseDirRealPath,
				name: path.basename(baseDir),
				skillMdRealPath: rootSkillRealPath
			}] : [],
			rootIsSkill: true
		};
	}
	const maxCandidatesPerRoot = Math.max(0, params.limits.maxCandidatesPerRoot);
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	const nestedSkillsRootPath = path.resolve(baseDir, "skills");
	const baseDirIsNestedSkillsRoot = path.resolve(baseDir) === path.resolve(rootDir, "skills");
	const baseDirLooksLikeSkillsRoot = path.basename(baseDir) === "skills";
	const discoveryBudget = createSkillDiscoveryBudget(maxCandidatesPerRoot);
	const childDirScan = listBudgetedChildDirectories(baseDir, discoveryBudget, { maxCandidateDirs: maxCandidatesPerRoot });
	const childDirs = childDirScan.dirs;
	const sortedChildDirs = childDirs.toSorted();
	const limitedChildren = maxSkillsLoadedPerSource === 0 ? [] : sortedChildDirs.slice(0, maxCandidatesPerRoot);
	if (maxSkillsLoadedPerSource > 0 && sortedChildDirs.includes("skills") && !limitedChildren.includes("skills")) limitedChildren.push("skills");
	if (childDirScan.truncated) skillsLogger$1.warn("Skills root looks suspiciously large, truncating discovery.", {
		dir: params.dir,
		baseDir,
		childDirCount: childDirs.length,
		scannedEntryCount: childDirScan.scannedEntryCount,
		maxEntriesToScan: resolveRawEntryScanLimit(maxCandidatesPerRoot),
		maxCandidatesPerRoot: params.limits.maxCandidatesPerRoot,
		maxSkillsLoadedPerSource: params.limits.maxSkillsLoadedPerSource
	});
	else if (childDirs.length > maxCandidatesPerRoot) skillsLogger$1.warn("Skills root has many entries, truncating discovery.", {
		dir: params.dir,
		baseDir,
		childDirCount: childDirs.length,
		maxCandidatesPerRoot: params.limits.maxCandidatesPerRoot,
		maxSkillsLoadedPerSource: params.limits.maxSkillsLoadedPerSource
	});
	const skillCandidates = [];
	const scanQueue = limitedChildren.map((name) => ({
		skillDir: path.join(baseDir, name),
		name,
		depth: name === "skills" && !fs.existsSync(path.join(baseDir, name, "SKILL.md")) ? 0 : 1
	}));
	for (const candidate of scanQueue) {
		if (!candidate) continue;
		const skillDirRealPath = resolveSkillRootCandidatePath({
			source: params.source,
			rootDir,
			rootRealPath: baseDirRealPath,
			candidatePath: candidate.skillDir,
			allowedSymlinkTargetRealPaths: params.allowedSymlinkTargetRealPaths
		});
		if (!skillDirRealPath) continue;
		const skillMd = path.join(candidate.skillDir, "SKILL.md");
		if (fs.existsSync(skillMd)) {
			const skillMdRealPath = resolveSkillFilePath({
				source: params.source,
				skillDir: candidate.skillDir,
				skillDirRealPath,
				candidatePath: skillMd
			});
			if (skillMdRealPath) skillCandidates.push({
				skillDir: candidate.skillDir,
				skillDirRealPath,
				name: candidate.name,
				skillMdRealPath
			});
			continue;
		}
		const candidatePath = path.resolve(candidate.skillDir);
		const maxGroupedDepth = params.source === "openclaw-extra" && !baseDirIsNestedSkillsRoot && !baseDirLooksLikeSkillsRoot && candidatePath !== nestedSkillsRootPath && !isPathInside(nestedSkillsRootPath, candidatePath) ? MAX_CONFIGURED_ROOT_GROUPED_SKILL_SCAN_DEPTH : MAX_GROUPED_SKILL_SCAN_DEPTH;
		if (candidate.depth >= maxGroupedDepth) continue;
		const nestedChildScan = listBudgetedChildDirectories(candidate.skillDir, discoveryBudget, { maxCandidateDirs: maxCandidatesPerRoot });
		const nestedChildren = nestedChildScan.dirs;
		if (nestedChildScan.truncated) skillsLogger$1.warn("Nested skills directory looks suspiciously large, truncating discovery.", {
			dir: params.dir,
			baseDir,
			nestedDir: candidate.skillDir,
			nestedChildDirCount: nestedChildren.length,
			scannedEntryCount: nestedChildScan.scannedEntryCount,
			maxEntriesToScan: resolveRawEntryScanLimit(maxCandidatesPerRoot),
			maxCandidatesPerRoot: params.limits.maxCandidatesPerRoot,
			maxSkillsLoadedPerSource: params.limits.maxSkillsLoadedPerSource,
			maxGroupedSkillScanDepth: MAX_GROUPED_SKILL_SCAN_DEPTH
		});
		else if (nestedChildren.length > maxCandidatesPerRoot) skillsLogger$1.warn("Nested skills directory has many entries, truncating discovery.", {
			dir: params.dir,
			baseDir,
			nestedDir: candidate.skillDir,
			nestedChildDirCount: nestedChildren.length,
			maxCandidatesPerRoot: params.limits.maxCandidatesPerRoot,
			maxSkillsLoadedPerSource: params.limits.maxSkillsLoadedPerSource,
			maxGroupedSkillScanDepth: MAX_GROUPED_SKILL_SCAN_DEPTH
		});
		for (const nestedName of nestedChildren.toSorted().slice(0, maxCandidatesPerRoot)) scanQueue.push({
			skillDir: path.join(candidate.skillDir, nestedName),
			name: `${candidate.name}/${nestedName}`,
			depth: candidate.depth + 1
		});
	}
	if (discoveryBudget.truncated) skillsLogger$1.warn("Skills root hit recursive discovery budget, truncating discovery.", {
		dir: params.dir,
		baseDir,
		maxCandidatesPerRoot: params.limits.maxCandidatesPerRoot,
		maxSkillsLoadedPerSource: params.limits.maxSkillsLoadedPerSource,
		maxGroupedSkillScanDepth: MAX_GROUPED_SKILL_SCAN_DEPTH
	});
	return {
		candidates: skillCandidates.toSorted((a, b) => a.name.localeCompare(b.name)),
		rootIsSkill: false
	};
}
function resolvePluginSkillRootRealPaths(pluginSkillDirs) {
	return uniqueStrings(pluginSkillDirs.map((dir) => tryRealpath(dir)).filter((dir) => Boolean(dir)));
}
/** Discover validated generated plugin-skill symlink candidates. */
function discoverPluginSkills(params) {
	const allowedRootRealPaths = resolvePluginSkillRootRealPaths(params.pluginSkillDirs);
	if (allowedRootRealPaths.length === 0) return [];
	const rootDir = path.resolve(params.pluginSkillsDir);
	if (!fs.existsSync(rootDir)) return [];
	const rootRealPath = tryRealpath(rootDir) ?? rootDir;
	const maxCandidatesPerRoot = Math.max(0, params.limits.maxCandidatesPerRoot);
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	const childDirScan = listChildDirectories(rootDir, { maxCandidateDirs: maxCandidatesPerRoot });
	const childDirs = maxSkillsLoadedPerSource === 0 ? [] : childDirScan.dirs.toSorted().slice(0, maxCandidatesPerRoot);
	const candidates = [];
	for (const name of childDirs) {
		const skillDir = path.join(rootDir, name);
		if (!isSymlinkPath(skillDir)) continue;
		const skillDirRealPath = tryRealpath(skillDir);
		if (!skillDirRealPath || findContainingAllowedSkillSymlinkTarget(allowedRootRealPaths, skillDirRealPath) === null) {
			if (skillDirRealPath) warnEscapedSkillPath({
				source: params.source,
				rootDir,
				rootRealPath,
				candidatePath: path.resolve(skillDir),
				candidateRealPath: skillDirRealPath
			});
			continue;
		}
		const skillMd = path.join(skillDir, "SKILL.md");
		let skillMdStat;
		try {
			skillMdStat = fs.lstatSync(skillMd);
		} catch {
			continue;
		}
		if (!skillMdStat.isFile() || skillMdStat.isSymbolicLink()) continue;
		const skillMdRealPath = tryRealpath(skillMd);
		if (!skillMdRealPath || !isPathInside(skillDirRealPath, skillMdRealPath)) continue;
		candidates.push({
			skillDir,
			skillDirRealPath,
			name,
			skillMdRealPath
		});
	}
	return candidates;
}
//#endregion
//#region src/skills/loading/workspace-skill-loader.ts
const skillsLogger = createSubsystemLogger("skills");
const SKILL_SOURCE_ORIGIN_RELATIVE_PATH = path.join(".openclaw", "source-origin.json");
const MAX_SKILL_SOURCE_ORIGIN_BYTES = 16 * 1024;
function warnInvalidSkillFrontmatter(source, diagnostic) {
	skillsLogger.warn("Skipping skill with invalid frontmatter.", {
		source,
		filePath: diagnostic.path,
		error: diagnostic.message,
		consoleMessage: `Skipping skill with invalid frontmatter: file=${compactSkillPath(diagnostic.path)} error=${diagnostic.message}`
	});
}
function filterSkillEntries(entries, config, skillFilter, skillOverrides, eligibility) {
	const bundledAllowlist = resolveBundledAllowlist(config);
	let filtered = entries.filter((entry) => shouldIncludeSkill({
		entry,
		config,
		bundledAllowlist,
		eligibility
	}));
	if (skillFilter !== void 0 || skillOverrides !== void 0) {
		const normalized = normalizeSkillFilter(skillFilter) ?? [];
		const label = normalized.length > 0 ? normalized.join(", ") : "(none)";
		skillsLogger.debug(`Applying skill filter: ${label}`);
		const resolvedFilter = skillFilter === void 0 ? void 0 : normalized;
		filtered = filtered.filter((entry) => isSessionSkillEnabled(entry.skill.name, resolvedFilter, skillOverrides, resolveSkillKey(entry.skill, entry)));
		skillsLogger.debug(`After skill filter: ${filtered.map((entry) => entry.skill.name).join(", ") || "(none)"}`);
	}
	return filtered;
}
function loadContainedSkillRecords(params) {
	const expectedBaseDir = path.resolve(params.skillDir);
	const loaded = loadSkillsFromDirSafe({
		dir: params.skillDir,
		source: params.source,
		maxBytes: params.maxSkillFileBytes,
		onDiagnostic: (diagnostic) => warnInvalidSkillFrontmatter(params.source, diagnostic)
	});
	const records = loaded.skills.map((skill) => ({
		skill,
		frontmatter: loaded.frontmatterByFilePath.get(skill.filePath)
	})).filter((record) => path.resolve(record.skill.baseDir) === expectedBaseDir);
	const canonicalSkillDir = params.canonicalSkillDir;
	return canonicalSkillDir ? records.map((record) => canonicalizeLoadedSkillRecord(record, canonicalSkillDir)) : records;
}
function readSourceInstallSkillKey(skillDir) {
	try {
		const sourceOriginPath = path.join(skillDir, SKILL_SOURCE_ORIGIN_RELATIVE_PATH);
		const stat = fs.lstatSync(sourceOriginPath);
		if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_SKILL_SOURCE_ORIGIN_BYTES) return;
		const skillDirRealPath = tryRealpath(skillDir);
		const sourceOriginRealPath = tryRealpath(sourceOriginPath);
		if (!skillDirRealPath || !sourceOriginRealPath || !isPathInside(skillDirRealPath, sourceOriginRealPath)) return;
		const raw = fs.readFileSync(sourceOriginPath, "utf8");
		return normalizeOptionalString(JSON.parse(raw).slug);
	} catch {
		return;
	}
}
function resolveSkillEntryMetadata(params) {
	const metadata = resolveSkillManifestMetadata(params.frontmatter);
	if (metadata?.skillKey) return metadata;
	const sourceInstallSkillKey = readSourceInstallSkillKey(params.skillDir);
	if (!sourceInstallSkillKey) return metadata;
	return {
		...metadata,
		skillKey: sourceInstallSkillKey
	};
}
function canonicalizeLoadedSkillRecord(record, canonicalSkillDir) {
	const originalBaseDir = path.resolve(record.skill.baseDir);
	const canonicalBaseDir = path.resolve(canonicalSkillDir);
	if (originalBaseDir === canonicalBaseDir) return record;
	const filePath = path.join(canonicalBaseDir, path.relative(originalBaseDir, record.skill.filePath));
	return {
		...record,
		syncSourceDir: canonicalBaseDir,
		syncDirName: path.basename(originalBaseDir),
		skill: {
			...record.skill,
			filePath,
			baseDir: canonicalBaseDir,
			sourceInfo: record.skill.sourceInfo ? {
				...record.skill.sourceInfo,
				path: filePath,
				baseDir: canonicalBaseDir
			} : record.skill.sourceInfo
		}
	};
}
function setSyncSourceForPluginSkill(record, syncSourceDir) {
	return {
		...record,
		syncSourceDir,
		syncDirName: path.basename(record.skill.baseDir)
	};
}
function isCandidateOversized(candidate, limits, rootIsSkill) {
	try {
		const size = fs.statSync(candidate.skillMdRealPath).size;
		if (size <= limits.maxSkillFileBytes) return false;
		skillsLogger.warn(rootIsSkill ? "Skipping skills root due to oversized SKILL.md." : "Skipping skill due to oversized SKILL.md.", rootIsSkill ? {
			dir: candidate.skillDir,
			filePath: path.join(candidate.skillDir, "SKILL.md"),
			size,
			maxSkillFileBytes: limits.maxSkillFileBytes
		} : {
			skill: candidate.name,
			filePath: path.join(candidate.skillDir, "SKILL.md"),
			size,
			maxSkillFileBytes: limits.maxSkillFileBytes
		});
		return true;
	} catch {
		return true;
	}
}
function loadDiscoveredSkillRecords(params) {
	const discovered = discoverSkillCandidates(params);
	const loadedSkills = [];
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	for (const candidate of discovered.candidates) {
		if (!discovered.rootIsSkill && loadedSkills.length >= maxSkillsLoadedPerSource) break;
		if (isCandidateOversized(candidate, params.limits, discovered.rootIsSkill)) continue;
		loadedSkills.push(...loadContainedSkillRecords({
			skillDir: candidate.skillDir,
			source: params.source,
			maxSkillFileBytes: params.limits.maxSkillFileBytes,
			canonicalSkillDir: canonicalSkillDirForSource(params.source, candidate.skillDirRealPath)
		}));
	}
	if (loadedSkills.length > maxSkillsLoadedPerSource && !discovered.rootIsSkill) return loadedSkills.toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).slice(0, maxSkillsLoadedPerSource);
	return loadedSkills;
}
function loadGeneratedPluginSkillRecords(params) {
	const candidates = discoverPluginSkills(params);
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	const loadedSkills = [];
	for (const candidate of candidates) {
		if (isCandidateOversized(candidate, params.limits, false)) continue;
		const loadedRecords = loadContainedSkillRecords({
			skillDir: candidate.skillDir,
			source: params.source,
			maxSkillFileBytes: params.limits.maxSkillFileBytes
		});
		loadedSkills.push(...loadedRecords.map((record) => setSyncSourceForPluginSkill(record, candidate.skillDirRealPath)));
		if (loadedSkills.length >= maxSkillsLoadedPerSource) break;
	}
	if (loadedSkills.length > maxSkillsLoadedPerSource) return loadedSkills.toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).slice(0, maxSkillsLoadedPerSource);
	return loadedSkills;
}
function loadSkillEntries(workspaceDir, opts) {
	const limits = resolveSkillDiscoveryLimits(opts?.config);
	const allowedSymlinkTargetRealPaths = resolveAllowedSkillSymlinkTargetRealPaths(opts?.config);
	const loadSkills = (params) => loadDiscoveredSkillRecords({
		...params,
		limits,
		allowedSymlinkTargetRealPaths
	});
	const workspaceOnly = opts?.workspaceOnly === true;
	const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
	const workspaceSkillsDir = path.resolve(workspaceDir, "skills");
	const bundledSkillsDir = workspaceOnly ? void 0 : opts?.bundledSkillsDir ?? resolveBundledSkillsDir();
	const pluginSkillsDir = opts?.pluginSkillsDir ?? path.join(CONFIG_DIR, "plugin-skills");
	const extraDirs = normalizeTrimmedStringList(workspaceOnly ? [] : opts?.config?.skills?.load?.extraDirs ?? []);
	const pluginSkillDirs = workspaceOnly ? [] : resolvePluginSkillDirs({
		workspaceDir,
		config: opts?.config,
		pluginSkillsDir
	});
	const mergedExtraDirs = [...extraDirs, ...pluginSkillDirs];
	const bundledSkills = bundledSkillsDir ? loadSkills({
		dir: bundledSkillsDir,
		source: "openclaw-bundled"
	}) : [];
	const extraSkills = [...mergedExtraDirs.flatMap((dir) => loadSkills({
		dir: resolveUserPath(dir),
		source: "openclaw-extra"
	})), ...loadGeneratedPluginSkillRecords({
		pluginSkillsDir,
		pluginSkillDirs,
		source: "openclaw-extra",
		limits
	})];
	const managedSkills = workspaceOnly ? [] : loadSkills({
		dir: managedSkillsDir,
		source: "openclaw-managed"
	});
	const osHomeDir = resolveSkillsUserHomeDir();
	const personalAgentsSkillsDir = osHomeDir ? path.resolve(osHomeDir, ".agents", "skills") : path.resolve(".agents", "skills");
	const personalAgentsSkills = workspaceOnly || !isDefaultStateDir() ? [] : loadSkills({
		dir: personalAgentsSkillsDir,
		source: "agents-skills-personal"
	});
	const projectAgentsSkillsDir = path.resolve(workspaceDir, ".agents", "skills");
	const projectAgentsSkills = workspaceOnly ? [] : loadSkills({
		dir: projectAgentsSkillsDir,
		source: "agents-skills-project"
	});
	const workspaceSkills = loadSkills({
		dir: workspaceSkillsDir,
		source: "openclaw-workspace"
	});
	const merged = /* @__PURE__ */ new Map();
	const archivedSkillFiles = opts?.includeArchived ? null : getArchivedSkillFiles();
	const mergeRecord = (record) => {
		if (archivedSkillFiles?.has(canonicalizePath(record.skill.filePath))) return;
		merged.set(record.skill.name, record);
	};
	for (const record of extraSkills) mergeRecord(record);
	for (const record of bundledSkills) mergeRecord(record);
	for (const record of managedSkills) mergeRecord(record);
	for (const record of personalAgentsSkills) mergeRecord(record);
	for (const record of projectAgentsSkills) mergeRecord(record);
	for (const record of workspaceSkills) mergeRecord(record);
	return Array.from(merged.values()).toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).map((record) => {
		const skill = record.skill;
		const frontmatter = record.frontmatter ?? readSkillFrontmatterSafe({
			rootDir: skill.baseDir,
			filePath: skill.filePath,
			maxBytes: limits.maxSkillFileBytes
		}) ?? {};
		const invocation = resolveSkillInvocationPolicy(frontmatter);
		const entry = {
			skill,
			frontmatter,
			metadata: resolveSkillEntryMetadata({
				frontmatter,
				skillDir: skill.baseDir
			}),
			invocation,
			exposure: {
				includeInRuntimeRegistry: true,
				includeInAvailableSkillsPrompt: !invocation.disableModelInvocation,
				userInvocable: invocation.userInvocable ?? true
			}
		};
		if (record.syncSourceDir !== void 0) entry.syncSourceDir = record.syncSourceDir;
		if (record.syncDirName !== void 0) entry.syncDirName = record.syncDirName;
		return entry;
	});
}
function filterArchivedSkillEntries(entries) {
	const archivedSkillFiles = getArchivedSkillFiles();
	return entries.filter((entry) => !archivedSkillFiles.has(canonicalizePath(entry.skill.filePath)));
}
function resolveEffectiveWorkspaceSkillFilter(opts) {
	if (opts?.skillFilter !== void 0) return normalizeSkillFilter(opts.skillFilter);
	if (!opts?.config || !opts.agentId) return;
	return resolveEffectiveAgentSkillFilter(opts.config, opts.agentId);
}
function resolveWorkspaceSkillPromptEntries(workspaceDir, opts) {
	const skillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return {
		eligible: filterSkillEntries(opts?.entries ? filterArchivedSkillEntries(opts.entries) : mergeRemoteNodeSkillEntries(loadSkillEntries(workspaceDir, opts), {
			canExec: opts?.eligibility?.nodeSkills?.canExec,
			node: opts?.eligibility?.nodeSkills?.node
		}), opts?.config, skillFilter, opts?.skillOverrides, opts?.eligibility),
		skillFilter
	};
}
function loadWorkspaceSkills(workspaceDir, opts) {
	const entries = mergeRemoteNodeSkillEntries(loadSkillEntries(workspaceDir, opts), {
		canExec: opts?.eligibility?.nodeSkills?.canExec,
		node: opts?.eligibility?.nodeSkills?.node
	});
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	if (effectiveSkillFilter === void 0 && opts?.skillOverrides === void 0 && opts?.eligibility === void 0) return entries;
	return filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.skillOverrides, opts?.eligibility);
}
function loadVisibleSkills(workspaceDir, opts) {
	const entries = mergeRemoteNodeSkillEntries(loadSkillEntries(workspaceDir, opts), {
		canExec: opts?.eligibility?.nodeSkills?.canExec,
		node: opts?.eligibility?.nodeSkills?.node
	});
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.skillOverrides, opts?.eligibility);
}
function filterWorkspaceSkills(entries, opts) {
	return filterSkillEntries(entries, opts?.config, opts?.skillFilter, opts?.skillOverrides, opts?.eligibility);
}
//#endregion
export { compactPromptSkills as a, removeRemoteNodeSkills as c, resolveWorkspaceSkillPromptEntries as i, replaceRemoteNodeSkills as l, loadVisibleSkills as n, mergeRemoteNodeSkillEntries as o, loadWorkspaceSkills as r, recordRemoteSkillNodeInfo as s, filterWorkspaceSkills as t, setRemoteSkillConnectionReconciler as u };
