import { s as coerceSecretRef } from "./types.secrets-Bre8L6Ts.js";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-DRjRnS6Y.js";
import { n as resolveConfiguredSecretInputWithFallback, r as resolveRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-B8bcUz8d.js";
import { n as listProfilesForProvider } from "./profile-list-CFe_FbXc.js";
import { i as resolveAuthProfileOrder } from "./order-BxFkXXxj.js";
import { r as ensureAuthProfileStore } from "./store-C6iqqcJy.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import "./provider-auth-Bfz7g31-.js";
import "./agent-runtime-dai5X0jZ.js";
import "./secret-input-runtime-BSLNpSkt.js";
import "./domain-Bbe8oFEv.js";
import { n as PROVIDER_ID } from "./models-CxDII3aw.js";
import { i as parseGithubCopilotApiKey, n as formatGithubCopilotApiKey } from "./oauth-CUz7YQKY.js";
//#region extensions/github-copilot/auth.ts
async function resolveFirstGithubToken(params) {
	const authStore = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false });
	const profileIds = listProfilesForProvider(authStore, PROVIDER_ID);
	const hasProfile = profileIds.length > 0;
	const requestedProfileId = params.profileId?.trim();
	const githubToken = [
		params.env.COPILOT_GITHUB_TOKEN,
		params.env.GH_TOKEN,
		params.env.GITHUB_TOKEN
	].map((value) => normalizeOptionalSecretInput(value)).find((value) => value !== void 0) ?? "";
	const providerConfig = params.config?.models?.providers?.[PROVIDER_ID];
	const configuredRefCanOwnAuth = providerConfig?.auth === void 0 || providerConfig.auth === "api-key" || providerConfig.auth === "token";
	const preferConfiguredToken = configuredRefCanOwnAuth && Boolean(coerceSecretRef(providerConfig?.apiKey, params.config?.secrets?.defaults)) || providerConfig?.auth === "api-key" && Boolean(normalizeOptionalSecretInput(providerConfig.apiKey));
	if (!requestedProfileId && (params.authProfileMode || preferConfiguredToken || githubToken || !hasProfile)) {
		if (githubToken && !preferConfiguredToken) return {
			githubToken,
			hasProfile: false
		};
		if (!params.config) return {
			githubToken: "",
			hasProfile: false
		};
		const resolved = await resolveConfiguredSecretInputWithFallback({
			config: params.config,
			env: params.env,
			value: configuredRefCanOwnAuth ? providerConfig?.apiKey : normalizeOptionalSecretInput(providerConfig?.apiKey),
			path: `models.providers.${PROVIDER_ID}.apiKey`,
			readFallback: () => ""
		});
		if (resolved.secretRefConfigured && !resolved.value) throw new Error(resolved.unresolvedRefReason ?? `models.providers.github-copilot.apiKey SecretRef is unresolved.`);
		return {
			githubToken: resolved.value?.trim() || githubToken,
			hasProfile: false
		};
	}
	const explicitProfileOrder = findNormalizedProviderValue(authStore.order, "github-copilot") ?? findNormalizedProviderValue(params.config?.auth?.order, "github-copilot");
	const profileId = requestedProfileId ? profileIds.find((candidate) => candidate === requestedProfileId) : explicitProfileOrder === void 0 ? profileIds[0] : resolveAuthProfileOrder({
		cfg: params.config,
		store: authStore,
		provider: PROVIDER_ID
	})[0];
	const profile = profileId ? authStore.profiles[profileId] : void 0;
	if (profile?.type === "oauth") {
		const formatted = formatGithubCopilotApiKey(profile);
		if (!normalizeOptionalSecretInput(profile.refresh)) return {
			githubToken: "",
			hasProfile
		};
		const parsed = parseGithubCopilotApiKey(formatted);
		return {
			...parsed,
			githubDomain: parsed.githubDomain ?? "github.com",
			hasProfile
		};
	}
	if (profile?.type !== "token") return {
		githubToken: "",
		hasProfile
	};
	return {
		githubToken: (await resolveRequiredConfiguredSecretRefInputString({
			config: params.config ?? {},
			env: params.env,
			value: profile.tokenRef,
			path: `providers.github-copilot.authProfiles.${profileId ?? "default"}.tokenRef`
		}) ?? profile.token ?? "").trim(),
		hasProfile
	};
}
//#endregion
export { resolveFirstGithubToken as t };
