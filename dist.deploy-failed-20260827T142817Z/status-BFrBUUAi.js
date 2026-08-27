import { t as CONFIG_DIR } from "./utils-DEqefz4f.js";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-DTbxyJ2D.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { a as normalizeSkillIndexName, t as buildSkillIndexEntries } from "./skill-index-CEvOAhOd.js";
import { t as evaluateEntryRequirementsForCurrentPlatform } from "./entry-status-mho2cSEb.js";
import { a as resolveClawHubSkillStatusLinkSync, p as readClawHubSkillsLockfileStatusSync, s as resolveLocalSkillCardStatusSync } from "./clawhub-BbF6b2MA.js";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BfHNzP7v.js";
import { t as loadSkillsFromDirSafe } from "./local-loader-BJ3elWx6.js";
import { n as hasBinary } from "./config-eval-DKSGptfj.js";
import { c as resolveSkillsInstallPreferences, i as isSkillEnvRequirementSatisfied, n as isBundledSkillAllowed, o as resolveBundledAllowlist, r as isSkillConfigPathTruthy, s as resolveSkillConfig } from "./config-Dq2GoT57.js";
import { o as mergeRemoteNodeSkillEntries, r as loadWorkspaceSkills } from "./workspace-skill-loader-Cv5Ol3Y8.js";
import path from "node:path";
//#region src/skills/loading/bundled-context.ts
const skillsLogger = createSubsystemLogger("skills");
let hasWarnedMissingBundledDir = false;
let cachedBundledContext = null;
function resolveBundledSkillsContext(opts = {}) {
	const dir = resolveBundledSkillsDir(opts);
	const names = /* @__PURE__ */ new Set();
	if (!dir) {
		if (!hasWarnedMissingBundledDir) {
			hasWarnedMissingBundledDir = true;
			skillsLogger.warn("Bundled skills directory could not be resolved; built-in skills may be missing.");
		}
		return {
			dir,
			names
		};
	}
	if (cachedBundledContext?.dir === dir) return {
		dir,
		names: new Set(cachedBundledContext.names)
	};
	const result = loadSkillsFromDirSafe({
		dir,
		source: "openclaw-bundled",
		onDiagnostic: (diagnostic) => skillsLogger.warn(`Skipping bundled skill with invalid frontmatter (${diagnostic.path}): ${diagnostic.message}`)
	});
	for (const skill of result.skills) if (skill.name.trim()) names.add(skill.name);
	cachedBundledContext = {
		dir,
		names: new Set(names)
	};
	return {
		dir,
		names
	};
}
//#endregion
//#region src/skills/discovery/status.ts
function resolveSkillStatusEntry(skills, requestedName) {
	const raw = requestedName.trim();
	if (!raw) return null;
	const lower = raw.toLowerCase();
	const normalized = normalizeSkillIndexName(raw);
	let caseInsensitiveMatch = null;
	let caseInsensitiveMatches = 0;
	let normalizedMatch = null;
	let normalizedMatches = 0;
	for (const skill of skills) {
		if (skill.name === raw || skill.skillKey === raw) return skill;
		const nameLower = skill.name.toLowerCase();
		const keyLower = skill.skillKey.toLowerCase();
		if (nameLower === lower || keyLower === lower) {
			caseInsensitiveMatch = skill;
			caseInsensitiveMatches += 1;
			continue;
		}
		if (normalized && (normalizeSkillIndexName(skill.name) === normalized || normalizeSkillIndexName(skill.skillKey) === normalized)) {
			normalizedMatch = skill;
			normalizedMatches += 1;
		}
	}
	if (caseInsensitiveMatches > 1) return null;
	if (caseInsensitiveMatches === 1) return caseInsensitiveMatch;
	if (normalizedMatches === 1) return normalizedMatch;
	return null;
}
function selectPreferredInstallSpec(install, prefs) {
	if (install.length === 0) return;
	const indexed = install.map((spec, index) => ({
		spec,
		index
	}));
	const findKind = (kind) => indexed.find((item) => item.spec.kind === kind);
	const brewSpec = findKind("brew");
	const nodeSpec = findKind("node");
	const goSpec = findKind("go");
	const uvSpec = findKind("uv");
	const downloadSpec = findKind("download");
	const brewAvailable = hasBinary("brew");
	const pickers = [
		() => prefs.preferBrew && brewAvailable ? brewSpec : void 0,
		() => uvSpec,
		() => nodeSpec,
		() => brewAvailable ? brewSpec : void 0,
		() => goSpec,
		() => downloadSpec,
		() => brewSpec,
		() => indexed[0]
	];
	for (const pick of pickers) {
		const selected = pick();
		if (selected) return selected;
	}
}
function normalizeInstallOptions(entry, prefs) {
	const requiredOs = entry.metadata?.os ?? [];
	if (requiredOs.length > 0 && !requiredOs.includes(process.platform)) return [];
	const install = entry.metadata?.install ?? [];
	if (install.length === 0) return [];
	const platform = process.platform;
	const filtered = install.filter((spec) => {
		const osList = spec.os ?? [];
		return osList.length === 0 || osList.includes(platform);
	});
	if (filtered.length === 0) return [];
	const toOption = (spec, index) => {
		const id = (spec.id ?? `${spec.kind}-${index}`).trim();
		const bins = spec.bins ?? [];
		let label = (spec.label ?? "").trim();
		if (spec.kind === "node" && spec.package) label = `Install ${spec.package} (${prefs.nodeManager})`;
		if (!label) if (spec.kind === "brew" && spec.formula) label = `Install ${spec.formula} (brew)`;
		else if (spec.kind === "node" && spec.package) label = `Install ${spec.package} (${prefs.nodeManager})`;
		else if (spec.kind === "go" && spec.module) label = `Install ${spec.module} (go)`;
		else if (spec.kind === "uv" && spec.package) label = `Install ${spec.package} (uv)`;
		else if (spec.kind === "download" && spec.url) {
			const url = spec.url.trim();
			const last = url.split("/").pop();
			label = `Download ${last && last.length > 0 ? last : url}`;
		} else label = "Run installer";
		return {
			id,
			kind: spec.kind,
			label,
			bins
		};
	};
	if (filtered.every((spec) => spec.kind === "download")) return filtered.map((spec, index) => toOption(spec, index));
	const preferred = selectPreferredInstallSpec(filtered, prefs);
	if (!preferred) return [];
	return [toOption(preferred.spec, preferred.index)];
}
function buildSkillStatus(indexed, context) {
	const entry = indexed.entry;
	const skillKey = indexed.skillKey;
	const { config, prefs, eligibility, allowBundled, agentSkillFilter, workspaceDir } = context;
	const skillConfig = resolveSkillConfig(config, skillKey);
	const disabled = skillConfig?.enabled === false;
	const blockedByAllowlist = !isBundledSkillAllowed(entry, allowBundled);
	const blockedByAgentFilter = agentSkillFilter !== void 0 && !indexed.agentAllowed;
	const always = entry.metadata?.always === true;
	const isEnvSatisfied = (envName) => isSkillEnvRequirementSatisfied({
		envName,
		skillConfig,
		primaryEnv: entry.metadata?.primaryEnv
	});
	const isConfigSatisfied = (pathStr) => isSkillConfigPathTruthy(config, pathStr);
	const skillSource = indexed.source;
	const bundled = indexed.bundled;
	const { emoji, homepage, required, missing, requirementsSatisfied, configChecks } = evaluateEntryRequirementsForCurrentPlatform({
		always,
		entry,
		hasLocalBin: hasBinary,
		remote: eligibility?.remote,
		isEnvSatisfied,
		isConfigSatisfied
	});
	const eligible = !disabled && !blockedByAllowlist && requirementsSatisfied;
	const platformIncompatible = missing.os.length > 0;
	const availableToAgent = eligible && !blockedByAgentFilter;
	const userInvocable = indexed.userInvocable;
	const isGlobalManagedSkill = !bundled && skillSource === "openclaw-managed";
	const clawhub = workspaceDir && !bundled ? resolveClawHubSkillStatusLinkSync({
		workspaceDir: isGlobalManagedSkill ? path.dirname(path.resolve(context.managedSkillsDir)) : workspaceDir,
		skillDir: entry.skill.baseDir,
		skillKey,
		lockRead: isGlobalManagedSkill ? context.managedLockRead : context.clawhubLockRead,
		lockfileScope: isGlobalManagedSkill ? "managed" : "workspace"
	}) : void 0;
	const skillCard = resolveLocalSkillCardStatusSync(entry.skill.baseDir);
	return {
		name: entry.skill.name,
		description: entry.skill.description,
		source: skillSource,
		bundled,
		filePath: entry.skill.filePath,
		baseDir: entry.skill.baseDir,
		skillKey,
		primaryEnv: entry.metadata?.primaryEnv,
		emoji,
		homepage,
		always,
		disabled,
		blockedByAllowlist,
		blockedByAgentFilter,
		eligible,
		platformIncompatible,
		modelVisible: availableToAgent && indexed.promptVisible,
		userInvocable,
		commandVisible: availableToAgent && userInvocable,
		requirements: required,
		missing,
		configChecks,
		install: normalizeInstallOptions(entry, prefs),
		...clawhub ? { clawhub } : {},
		...skillCard ? { skillCard } : {}
	};
}
function buildWorkspaceSkillStatus(workspaceDir, opts) {
	const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
	const bundledContext = resolveBundledSkillsContext();
	const agentSkillFilter = opts?.agentId ? resolveEffectiveAgentSkillFilter(opts.config, opts.agentId) : void 0;
	const skillEntries = mergeRemoteNodeSkillEntries(opts?.entries ?? loadWorkspaceSkills(workspaceDir, {
		config: opts?.config,
		managedSkillsDir,
		bundledSkillsDir: bundledContext.dir,
		includeArchived: true
	}), {
		canExec: opts?.eligibility?.nodeSkills?.canExec,
		node: opts?.eligibility?.nodeSkills?.node
	});
	const prefs = resolveSkillsInstallPreferences(opts?.config);
	const allowBundled = resolveBundledAllowlist(opts?.config);
	const clawhubLockRead = readClawHubSkillsLockfileStatusSync(workspaceDir);
	const managedParentDir = path.dirname(path.resolve(managedSkillsDir));
	const managedLockRead = managedParentDir === path.resolve(workspaceDir) ? clawhubLockRead : readClawHubSkillsLockfileStatusSync(managedParentDir);
	const skillIndexEntries = buildSkillIndexEntries(skillEntries, {
		bundledNames: bundledContext.names,
		agentSkillFilter
	});
	return {
		workspaceDir,
		managedSkillsDir,
		agentId: opts?.agentId,
		agentSkillFilter,
		skills: skillIndexEntries.map((entry) => buildSkillStatus(entry, {
			config: opts?.config,
			prefs,
			eligibility: opts?.eligibility,
			allowBundled,
			agentSkillFilter,
			workspaceDir,
			clawhubLockRead,
			managedSkillsDir,
			managedLockRead
		}))
	};
}
//#endregion
export { resolveSkillStatusEntry as n, buildWorkspaceSkillStatus as t };
