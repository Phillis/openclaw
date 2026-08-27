import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as matchesSkillFilter } from "./agent-filter-CYpKkXA_.js";
import { r as getSkillsSnapshotVersion, s as shouldRefreshSnapshotForVersion } from "./refresh-state-DHnXO3IV.js";
import { t as buildSkillSnapshot } from "./workspace-skill-prompt-DB01Vq_9.js";
import { t as ensureSkillsWatcher } from "./refresh-B_obdiy_.js";
import { t as fingerprintSkillSnapshotConfig } from "./snapshot-config-fingerprint-DWHCYJul.js";
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
const resolvedSkillsCache = /* @__PURE__ */ new Map();
const RESOLVED_SKILLS_CACHE_MAX = 10;
function cacheResolvedSkills(cacheKey, snapshot) {
	resolvedSkillsCache.set(cacheKey, snapshot.resolvedSkills);
	pruneMapToMaxSize(resolvedSkillsCache, RESOLVED_SKILLS_CACHE_MAX);
	return snapshot;
}
function resolveReusableWorkspaceSkillSnapshot(params) {
	if (params.watch !== false) ensureSkillsWatcher({
		workspaceDir: params.workspaceDir,
		config: params.config
	});
	const snapshotVersion = params.snapshotVersion ?? getSkillsSnapshotVersion(params.workspaceDir);
	const promptFormatChanged = params.existingSnapshot?.promptFormatVersion !== 3;
	const skillVersionChanged = shouldRefreshSnapshotForVersion(params.existingSnapshot?.version, snapshotVersion);
	const nodeSkillsEligibilityChanged = stableStringify(params.existingSnapshot?.nodeSkillsEligibility) !== stableStringify(params.eligibility?.nodeSkills);
	const skillOverridesChanged = stableStringify(params.existingSnapshot?.skillOverrides) !== stableStringify(params.skillOverrides);
	const shouldRefresh = promptFormatChanged || skillVersionChanged || nodeSkillsEligibilityChanged || !matchesSkillFilter(params.existingSnapshot?.skillFilter, params.skillFilter) || skillOverridesChanged;
	const buildSnapshot = () => {
		return buildSkillSnapshot(params.workspaceDir, {
			config: params.config,
			agentId: params.agentId,
			skillFilter: params.skillFilter,
			skillOverrides: params.skillOverrides,
			eligibility: params.eligibility,
			snapshotVersion
		});
	};
	const buildSnapshotCacheKey = () => JSON.stringify([
		params.workspaceDir,
		snapshotVersion,
		params.skillFilter,
		params.skillOverrides,
		params.agentId,
		params.eligibility,
		fingerprintSkillSnapshotConfig(params.config)
	]);
	const cachedRebuild = (snapshotCacheKey = buildSnapshotCacheKey()) => {
		if (resolvedSkillsCache.has(snapshotCacheKey)) return { resolvedSkills: resolvedSkillsCache.get(snapshotCacheKey) };
		return cacheResolvedSkills(snapshotCacheKey, buildSnapshot());
	};
	return {
		snapshot: !params.existingSnapshot || shouldRefresh ? cacheResolvedSkills(buildSnapshotCacheKey(), buildSnapshot()) : params.hydrateExisting === false ? params.existingSnapshot : hydrateResolvedSkills(params.existingSnapshot, cachedRebuild),
		shouldRefresh,
		snapshotVersion
	};
}
//#endregion
export { resolveReusableWorkspaceSkillSnapshot as t };
