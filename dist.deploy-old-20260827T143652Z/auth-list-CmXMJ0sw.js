import { R as timestampMsToIsoString } from "./number-coercion-oCkfUEEq.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BdBosV0l.js";
import { r as resolveAuthStatePathForDisplay } from "./path-resolve-CttHagpC.js";
import { r as ensureAuthProfileStore } from "./store-2zwMbXSG.js";
import { n as buildAuthProfileUnusableHint } from "./oauth-refresh-failure-DLKK-cud.js";
import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-i3N9ji0c.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DM5kEN0f.js";
import { c as resolveModelsTargetAgent } from "./shared-BmUAvHoe.js";
import { t as loadModelsConfig } from "./load-config-BLw-SlVx.js";
//#region src/commands/models/auth-list.ts
/** Command helpers for listing saved model auth profiles. */
function resolveProviderFilter(rawProvider) {
	const provider = rawProvider?.trim() ? resolveProviderIdForAuth(rawProvider) : void 0;
	if (!provider) return {
		provider: void 0,
		externalCliProvider: void 0,
		matches: () => true
	};
	return {
		provider,
		externalCliProvider: provider,
		matches: (profile) => profile.provider === provider
	};
}
function formatTimestamp(value) {
	return timestampMsToIsoString(value);
}
function resolveProfileExpiry(profile) {
	return profile.type === "api_key" ? void 0 : formatTimestamp(profile.expires);
}
function summarizeProfile(params) {
	const expiresAt = resolveProfileExpiry(params.profile);
	const cooldownUntil = formatTimestamp(params.usage?.cooldownUntil);
	const disabledUntil = formatTimestamp(params.usage?.disabledUntil);
	const disabledActive = Boolean(disabledUntil);
	const reason = disabledActive ? params.usage?.disabledReason : cooldownUntil ? params.usage?.cooldownReason : void 0;
	const recoveryHint = disabledUntil || cooldownUntil ? buildAuthProfileUnusableHint({
		kind: disabledActive ? "disabled" : "cooldown",
		reason,
		provider: params.profile.provider,
		profileId: params.profileId
	}) : void 0;
	return {
		id: params.profileId,
		provider: resolveProviderIdForAuth(params.profile.provider),
		type: params.profile.type,
		label: resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store: params.store,
			profileId: params.profileId
		}),
		...params.profile.email ? { email: params.profile.email } : {},
		...params.profile.displayName ? { displayName: params.profile.displayName } : {},
		...expiresAt ? { expiresAt } : {},
		...cooldownUntil ? { cooldownUntil } : {},
		...disabledUntil ? { disabledUntil } : {},
		...params.usage?.cooldownReason ? { cooldownReason: params.usage.cooldownReason } : {},
		...params.usage?.disabledReason ? { disabledReason: params.usage.disabledReason } : {},
		...recoveryHint ? { recoveryHint } : {}
	};
}
function formatProfileLine(profile) {
	const details = [`${profile.provider}/${profile.type}`];
	if (profile.expiresAt) details.push(`expires ${profile.expiresAt}`);
	if (profile.cooldownUntil) details.push(`cooldown${profile.cooldownReason ? `:${profile.cooldownReason}` : ""} until ${profile.cooldownUntil}`);
	if (profile.disabledUntil) details.push(`disabled${profile.disabledReason ? `:${profile.disabledReason}` : ""} until ${profile.disabledUntil}`);
	return `- ${profile.label} [${details.join("; ")}]${profile.recoveryHint ? ` — ${profile.recoveryHint}` : ""}`;
}
/** Lists auth profiles for the selected agent, optionally filtered by provider. */
async function modelsAuthListCommand(opts, runtime) {
	const cfg = await loadModelsConfig({
		commandName: "models auth list",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent);
	const providerFilter = resolveProviderFilter(opts.provider);
	const store = ensureAuthProfileStore(agentDir, providerFilter.externalCliProvider ? { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider: providerFilter.externalCliProvider
	}) } : void 0);
	const profiles = Object.entries(store.profiles).map(([profileId, profile]) => summarizeProfile({
		cfg,
		store,
		profileId,
		profile,
		usage: store.usageStats?.[profileId]
	})).filter((profile) => providerFilter.matches(profile)).toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			agentDir: shortenHomePath(agentDir),
			authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
			provider: providerFilter.provider ?? null,
			profiles
		});
		return;
	}
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
	if (providerFilter.provider) runtime.log(`Provider: ${providerFilter.provider}`);
	if (profiles.length === 0) {
		runtime.log("Profiles: (none)");
		return;
	}
	runtime.log("Profiles:");
	for (const profile of profiles) runtime.log(formatProfileLine(profile));
}
//#endregion
export { modelsAuthListCommand };
