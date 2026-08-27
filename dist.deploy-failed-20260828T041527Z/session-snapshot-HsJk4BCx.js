import "./src-BntaCZM-.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as matchesSkillFilter } from "./agent-filter-BQrGxhsA.js";
import { r as getSkillsSnapshotVersion, s as shouldRefreshSnapshotForVersion } from "./refresh-state-DHnXO3IV.js";
import { a as normalizeWorkspaceSkillRoots, c as fingerprintSkillSnapshotConfig, n as loadMergedWorkspaceSkills } from "./workspace-skill-loader-CRn-e6M4.js";
import { t as buildSkillSnapshot } from "./workspace-skill-prompt-Ds9qdFF5.js";
import { n as ensureSkillsWatcher } from "./refresh-C8EvrfGV.js";
//#region src/skills/runtime/snapshot-hydration.ts
function hydrateResolvedSkills(snapshot, rebuild) {
	if (snapshot.resolvedSkills !== void 0) return snapshot;
	return {
		...snapshot,
		resolvedSkills: rebuild().resolvedSkills
	};
}
//#endregion
//#region src/skills/runtime/session-snapshot.ts
const skillSnapshotCache = /* @__PURE__ */ new Map();
const SKILL_SNAPSHOT_CACHE_MAX = 10;
function cacheSkillSnapshot(cacheKey, snapshot) {
	skillSnapshotCache.set(cacheKey, snapshot);
	pruneMapToMaxSize(skillSnapshotCache, SKILL_SNAPSHOT_CACHE_MAX);
	return snapshot;
}
function resolveReusableWorkspaceSkillSnapshot(params) {
	const normalizedRoots = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: params.workspaceDir,
		...params.executionSkillsDir ? { executionSkillsDir: params.executionSkillsDir } : {}
	});
	const skillRoots = normalizedRoots.executionSkillsDir ? {
		agentWorkspaceDir: normalizedRoots.agentWorkspaceDir,
		executionSkillsDir: normalizedRoots.executionSkillsDir
	} : void 0;
	const watcherWorkspaceDir = skillRoots?.agentWorkspaceDir ?? params.workspaceDir;
	if (params.watch !== false) ensureSkillsWatcher({
		workspaceDir: watcherWorkspaceDir,
		...skillRoots ? { executionSkillsDir: skillRoots.executionSkillsDir } : {},
		config: params.config,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	const snapshotVersion = params.snapshotVersion ?? getSkillsSnapshotVersion(watcherWorkspaceDir);
	const promptFormatChanged = params.existingSnapshot?.promptFormatVersion !== 4;
	const skillVersionChanged = shouldRefreshSnapshotForVersion(params.existingSnapshot?.version, snapshotVersion);
	const nodeSkillsEligibilityChanged = stableStringify(params.existingSnapshot?.nodeSkillsEligibility) !== stableStringify(params.eligibility?.nodeSkills);
	const skillOverridesChanged = stableStringify(params.existingSnapshot?.skillOverrides) !== stableStringify(params.skillOverrides);
	const skillRootsChanged = stableStringify(params.existingSnapshot?.skillRoots) !== stableStringify(skillRoots);
	const shouldRefresh = promptFormatChanged || skillVersionChanged || nodeSkillsEligibilityChanged || skillRootsChanged || !matchesSkillFilter(params.existingSnapshot?.skillFilter, params.skillFilter) || skillOverridesChanged;
	const buildSnapshot = () => {
		const entries = skillRoots ? loadMergedWorkspaceSkills({
			...skillRoots,
			config: params.config,
			agentId: params.agentId,
			skillFilter: params.skillFilter,
			skillOverrides: params.skillOverrides,
			eligibility: params.eligibility,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		}) : void 0;
		const snapshot = buildSkillSnapshot(params.workspaceDir, {
			config: params.config,
			...entries ? {
				entries,
				preserveEntryOrder: true
			} : {},
			agentId: params.agentId,
			skillFilter: params.skillFilter,
			skillOverrides: params.skillOverrides,
			eligibility: params.eligibility,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot,
			snapshotVersion
		});
		return skillRoots ? {
			...snapshot,
			skillRoots
		} : snapshot;
	};
	const buildSnapshotCacheKey = () => JSON.stringify([
		params.workspaceDir,
		skillRoots,
		snapshotVersion,
		params.skillFilter,
		params.skillOverrides,
		params.agentId,
		params.eligibility,
		fingerprintSkillSnapshotConfig(params.config)
	]);
	const cachedRebuild = (snapshotCacheKey = buildSnapshotCacheKey()) => {
		const cachedSnapshot = skillSnapshotCache.get(snapshotCacheKey);
		if (cachedSnapshot) return cachedSnapshot;
		return cacheSkillSnapshot(snapshotCacheKey, buildSnapshot());
	};
	return {
		snapshot: !params.existingSnapshot || shouldRefresh ? cachedRebuild() : params.hydrateExisting === false ? params.existingSnapshot : hydrateResolvedSkills(params.existingSnapshot, cachedRebuild),
		shouldRefresh,
		snapshotVersion
	};
}
//#endregion
export { resolveReusableWorkspaceSkillSnapshot as t };
