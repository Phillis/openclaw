import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import "./config-Dl8DJbzM.js";
import { t as createOnboardingRecommendationsStore } from "./onboarding-recommendations-BRmBZrwi.js";
//#region src/commands/onboard-recommendations.ts
const SAFE_INSTALL_ID_RE = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/iu;
function createDefaultOnboardingRecommendationsStore() {
	const cfg = getRuntimeConfig();
	return createOnboardingRecommendationsStore({ workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)) });
}
function createDefaultStoreAccessor() {
	let store;
	return () => store ??= createDefaultOnboardingRecommendationsStore();
}
function isLegacyBareClawHubId(match) {
	return match.candidate.source === "clawhub-skill" && SAFE_INSTALL_ID_RE.test(match.candidate.id) && !match.candidate.id.startsWith("@");
}
function bootstrapRecommendations(record) {
	if (record?.acceptedAt != null) return [];
	const byInstall = /* @__PURE__ */ new Map();
	for (const match of record?.matches ?? []) {
		const id = match.candidate.id;
		if (!SAFE_INSTALL_ID_RE.test(id) || match.candidate.source === "clawhub-skill" && !id.startsWith("@")) continue;
		const source = match.candidate.source === "clawhub-skill" ? "clawhub-skill" : "official-plugin";
		const key = `${source}:${id.toLocaleLowerCase("en-US")}`;
		const existing = byInstall.get(key);
		if (!existing || existing.tier === "optional" && match.tier === "recommended") byInstall.set(key, {
			id,
			source,
			tier: match.tier
		});
	}
	return [...byInstall.values()];
}
function onboardRecommendationsCommand(opts, runtime, deps = {}) {
	const defaultStore = createDefaultStoreAccessor();
	const stored = (deps.read ?? defaultStore().read)();
	const hasLegacyClawHubId = stored?.matches.some(isLegacyBareClawHubId);
	if (hasLegacyClawHubId && stored && stored.acceptedAt == null) {
		if (!(deps.clearPending ?? defaultStore().clearPending)({ expected: stored })) {
			runtime.error("Stored recommendations changed; read them again.");
			runtime.exit(1);
			return;
		}
	}
	const matches = bootstrapRecommendations(hasLegacyClawHubId ? null : stored);
	if (opts.json) {
		writeRuntimeJson(runtime, matches);
		return;
	}
	if (matches.length === 0) {
		runtime.log("No stored onboarding recommendations.");
		return;
	}
	runtime.log(matches.map((match) => {
		const source = match.source === "clawhub-skill" ? "ClawHub skill" : "official plugin";
		return `- ${match.id} [${source}; ${match.tier}]`;
	}).join("\n"));
}
function acknowledgeOnboardRecommendationsCommand(opts, runtime, deps = {}) {
	const defaultStore = createDefaultStoreAccessor();
	const retryIds = [...new Set(opts.retry ?? [])];
	if (retryIds.length > 0) {
		const record = (deps.read ?? defaultStore().read)();
		if (!record || record.acceptedAt != null) {
			runtime.error("No pending onboarding recommendations to retry.");
			runtime.exit(1);
			return;
		}
		const pending = bootstrapRecommendations(record);
		const pendingIds = new Set(pending.map((match) => match.id));
		const unknownIds = retryIds.filter((id) => !pendingIds.has(id));
		if (unknownIds.length > 0) {
			runtime.error(`Unknown pending recommendation id: ${unknownIds.join(", ")}`);
			runtime.exit(1);
			return;
		}
		const retryIdSet = new Set(retryIds);
		const retryMatches = record?.matches.filter((match) => retryIdSet.has(match.candidate.id)) ?? [];
		if (!(deps.updatePending ?? defaultStore().updatePending)({
			matches: retryMatches,
			expected: record
		})) {
			runtime.error("Stored recommendations changed; read them again before recording retries.");
			runtime.exit(1);
			return;
		}
		runtime.log(`Onboarding recommendations updated; ${retryIds.length} left pending for retry.`);
		return;
	}
	const record = (deps.acknowledge ?? defaultStore().acknowledge)();
	runtime.log(record ? "Onboarding recommendations acknowledged." : "No stored recommendations.");
}
function refreshOnboardRecommendationsCommand(runtime, deps = {}) {
	const defaultStore = createDefaultStoreAccessor();
	const cleared = (deps.clear ?? defaultStore().clear)();
	runtime.log(cleared ? "Onboarding recommendations cleared. The next onboarding run will rescan." : "No stored recommendations.");
}
//#endregion
export { acknowledgeOnboardRecommendationsCommand, onboardRecommendationsCommand, refreshOnboardRecommendationsCommand };
