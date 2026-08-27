import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { n as resolveConfiguredSecretInputWithFallback, r as resolveRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-CDcCLLxH.js";
import { n as listProfilesForProvider } from "./profile-list-C4c5_QKQ.js";
import { r as ensureAuthProfileStore } from "./store-DZy8rsrA.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import "./provider-auth-DqOUi0El.js";
import "./secret-input-runtime-CwN9f2gI.js";
import { t as PROVIDER_ID } from "./models-CbS71arC.js";
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
	const preferConfiguredToken = providerConfig?.auth === "api-key" && Boolean(normalizeOptionalSecretInput(providerConfig.apiKey) || coerceSecretRef(providerConfig.apiKey));
	const resolveConfiguredGithubToken = async () => {
		if (!params.config) return "";
		return (await resolveConfiguredSecretInputWithFallback({
			config: params.config,
			env: params.env,
			value: providerConfig?.apiKey,
			path: `models.providers.github-copilot.apiKey`,
			readFallback: () => ""
		})).value?.trim() ?? "";
	};
	const resolveDirectGithubToken = async () => {
		if (preferConfiguredToken) {
			const configuredToken = await resolveConfiguredGithubToken();
			if (configuredToken) return configuredToken;
		}
		if (githubToken) return githubToken;
		return preferConfiguredToken ? "" : await resolveConfiguredGithubToken();
	};
	if (!requestedProfileId && params.authProfileMode) return {
		githubToken: await resolveDirectGithubToken(),
		hasProfile: false
	};
	if (!requestedProfileId && (githubToken || !hasProfile)) return {
		githubToken: await resolveDirectGithubToken(),
		hasProfile
	};
	const profileId = requestedProfileId ? profileIds.find((candidate) => candidate === requestedProfileId) : profileIds[0];
	const profile = profileId ? authStore.profiles[profileId] : void 0;
	if (profile?.type !== "token") return {
		githubToken: "",
		hasProfile
	};
	const directToken = profile.token?.trim() ?? "";
	if (directToken) return {
		githubToken: directToken,
		hasProfile
	};
	const tokenRef = coerceSecretRef(profile.tokenRef);
	if (tokenRef?.source === "env" && tokenRef.id.trim()) return {
		githubToken: (params.env[tokenRef.id] ?? process.env[tokenRef.id] ?? "").trim(),
		hasProfile
	};
	if (tokenRef && params.config) try {
		return {
			githubToken: (await resolveRequiredConfiguredSecretRefInputString({
				config: params.config,
				env: params.env,
				value: profile.tokenRef,
				path: `providers.github-copilot.authProfiles.${profileId ?? "default"}.tokenRef`
			}))?.trim() ?? "",
			hasProfile
		};
	} catch {
		return {
			githubToken: "",
			hasProfile
		};
	}
	return {
		githubToken: "",
		hasProfile
	};
}
//#endregion
export { resolveFirstGithubToken as t };
