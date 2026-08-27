import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider } from "./order-C7dw_-HZ.js";
import { n as readCodexCliCredentialsCached } from "./cli-credentials-DZ9rGNcm.js";
import { p as loadAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore } from "./store-C0UG5FOx.js";
import { t as resolveEnvApiKey } from "./model-auth-env-BF4kxQxW.js";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-zge5bJtu.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kohNMVnn.js";
import { b as resolveProviderEntryApiKeyProfileReference, x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-DW3Bgqni.js";
import "./model-auth-e0nL7cI2.js";
//#region src/agents/model-auth-label.ts
/**
* Formats user-facing auth labels for resolved provider/model credentials.
*/
/** Resolve the display label that describes how a provider is authenticated. */
function resolveModelAuthLabel(params) {
	const resolvedProvider = params.provider?.trim();
	if (!resolvedProvider) return;
	const providerKey = normalizeProviderId(resolvedProvider);
	const store = params.includeExternalProfiles === false ? loadAuthProfileStoreWithoutExternalProfiles(params.agentDir) : ensureAuthProfileStore(params.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg: params.cfg,
		provider: providerKey,
		preferredProfile: params.sessionEntry?.authProfileOverride
	}) });
	const profileOverride = params.sessionEntry?.authProfileOverride?.trim();
	const acceptedProviderKeys = uniqueStrings([...(params.acceptedProviderIds ?? []).map(normalizeProviderId), providerKey].filter(Boolean));
	const candidates = [profileOverride, ...uniqueStrings(acceptedProviderKeys.flatMap((acceptedProvider) => resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: acceptedProvider,
		preferredProfile: profileOverride
	})))].filter(Boolean);
	for (const profileId of candidates) {
		const profile = store.profiles[profileId];
		if (!profile || !acceptedProviderKeys.some((acceptedProvider) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: params.cfg,
			provider: acceptedProvider,
			credential: profile
		}))) continue;
		const label = resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store,
			profileId
		});
		if (profile.type === "oauth") return `oauth${label ? ` (${label})` : ""}`;
		if (profile.type === "token") return `token${label ? ` (${label})` : ""}`;
		return `api-key${label ? ` (${label})` : ""}`;
	}
	const providerEntryProfileRef = resolveProviderEntryApiKeyProfileReference({
		cfg: params.cfg,
		provider: providerKey,
		store
	});
	if (providerEntryProfileRef.kind === "profile") {
		const label = resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store,
			profileId: providerEntryProfileRef.profileId
		});
		if (providerEntryProfileRef.mode === "token") return `token${label ? ` (${label})` : ""}`;
		return `api-key${label ? ` (${label})` : ""}`;
	}
	if (providerEntryProfileRef.kind === "profile-incompatible") return "unknown";
	if (params.codexCliCredentialsHome && (providerKey === "openai" || providerKey === "codex") && readCodexCliCredentialsCached({
		codexHome: params.codexCliCredentialsHome,
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth (codex-cli)";
	const envKey = resolveEnvApiKey(providerKey, process.env, {
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	if (envKey?.apiKey) {
		if (envKey.source.includes("OAUTH_TOKEN")) return `oauth (${envKey.source})`;
		return `api-key (${envKey.source})`;
	}
	if (providerKey === "codex" && readCodexCliCredentialsCached({
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth (codex-cli)";
	if (providerKey === "claude-cli") return "native (claude-cli)";
	if (resolveUsableCustomProviderApiKey({
		cfg: params.cfg,
		provider: providerKey
	})) return `api-key (models.json)`;
	return "unknown";
}
//#endregion
export { resolveModelAuthLabel as t };
