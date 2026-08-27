import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { W as applyProviderConfigDefaultsForConfig } from "./io-ClLVsBMp.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { a as loadPersistedAuthProfileStore } from "./persisted-Bjx2XcL3.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-C6iqqcJy.js";
import { t as repairOAuthProfileIdMismatch } from "./repair-B_GWNYPm.js";
import { i as removeAuthProfileConfig, r as configReferencesAuthProfile } from "./provider-auth-helpers-Ci8FjjB5.js";
import { t as listAuthProfileRepairCandidates } from "./doctor-auth-legacy-paths-CVFtjFfF.js";
//#region src/commands/doctor-auth-legacy-oauth.ts
/** Removes retired provider profiles and repairs legacy OAuth profile ids. */
async function loadProviderRuntime() {
	return import("./providers.runtime.js");
}
async function loadNoteRuntime() {
	return import("./terminal-core/note.js");
}
function hasConfigOAuthProfiles(cfg) {
	return Object.values(cfg.auth?.profiles ?? {}).some((profile) => profile?.mode === "oauth");
}
function sanitizePromptLabel(label) {
	return (label ? sanitizeForLog(label).trim() : void 0) || void 0;
}
function configSelectsProvider(cfg, providerIds) {
	const selectedProviders = new Set(providerIds);
	return collectConfiguredModelRefs(cfg).some(({ value }) => {
		const separator = value.indexOf("/");
		return separator > 0 && selectedProviders.has(value.slice(0, separator));
	});
}
/**
* Applies provider-declared OAuth profile id repairs to config after prompting.
*
* Providers own the legacy id mapping; doctor only loads setup-time provider metadata and asks
* before writing config so stale provider-specific ids do not silently shadow current profiles.
*/
async function maybeRepairLegacyOAuthProfileIds(cfg, prompter) {
	let nextCfg = cfg;
	const retiredProfileCleanupPlans = [];
	const { resolvePluginProvidersCore } = await loadProviderRuntime();
	const providers = resolvePluginProvidersCore({
		config: cfg,
		env: process.env,
		mode: "setup"
	});
	const repairCandidates = listAuthProfileRepairCandidates(nextCfg, process.env);
	for (const provider of providers) for (const profileId of provider.deprecatedProfileIds ?? []) {
		const storedProfileProviders = /* @__PURE__ */ new Set();
		const profileStores = repairCandidates.filter((candidate) => {
			const profile = loadPersistedAuthProfileStore(candidate.agentDir)?.profiles[profileId];
			if (!profile) return false;
			storedProfileProviders.add(profile.provider);
			return true;
		});
		if (profileStores.length === 0 && !configReferencesAuthProfile(nextCfg, profileId)) continue;
		const { note } = await loadNoteRuntime();
		note(`- Remove retired auth profile ${profileId}. The provider's native login remains unchanged.`, "Auth profiles");
		const label = sanitizePromptLabel(provider.label) ?? provider.id;
		if (!await prompter.confirm({
			message: `Remove retired ${label} auth profile now?`,
			initialValue: true
		})) continue;
		const configuredProfileProvider = nextCfg.auth?.profiles?.[profileId]?.provider;
		const selectedProviderIds = /* @__PURE__ */ new Set([provider.id, ...storedProfileProviders]);
		if (configuredProfileProvider) selectedProviderIds.add(configuredProfileProvider);
		if (configSelectsProvider(nextCfg, [...selectedProviderIds])) nextCfg = applyProviderConfigDefaultsForConfig({
			provider: provider.id,
			config: nextCfg,
			env: process.env
		});
		nextCfg = removeAuthProfileConfig(nextCfg, profileId);
		for (const candidate of profileStores) retiredProfileCleanupPlans.push({
			agentDir: candidate.agentDir,
			profileIds: [profileId]
		});
	}
	if (!hasConfigOAuthProfiles(nextCfg)) return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
	const store = ensureAuthProfileStoreWithoutExternalProfiles();
	if (Object.keys(store.profiles).length === 0) return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
	for (const provider of providers) for (const repairSpec of provider.oauthProfileIdRepairs ?? []) {
		const repair = repairOAuthProfileIdMismatch({
			cfg: nextCfg,
			store,
			provider: provider.id,
			legacyProfileId: repairSpec.legacyProfileId
		});
		if (!repair.migrated || repair.changes.length === 0) continue;
		const { note } = await loadNoteRuntime();
		note(repair.changes.map((c) => `- ${c}`).join("\n"), "Auth profiles");
		const label = sanitizePromptLabel(repairSpec.promptLabel) ?? sanitizePromptLabel(provider.label) ?? provider.id;
		if (!await prompter.confirm({
			message: `Update ${label} OAuth profile id in config now?`,
			initialValue: true
		})) continue;
		nextCfg = repair.config;
	}
	return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
}
//#endregion
export { maybeRepairLegacyOAuthProfileIds };
