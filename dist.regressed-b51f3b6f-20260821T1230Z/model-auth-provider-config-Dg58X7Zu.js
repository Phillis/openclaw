import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BDz7f4XS.js";
import { y as resolveMergedModelProviderConfig } from "./openai-model-routes-lYZ0ONoM.js";
import { n as getShellEnvAppliedKeys } from "./shell-env-hxMHzmqv.js";
import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, u as hashRuntimeConfigValue } from "./runtime-snapshot-Dp7mvsA3.js";
import "./config-Dl8DJbzM.js";
import { s as mintSecretSentinel } from "./sentinel-DFKnr2-n.js";
import { i as isAuthCooldownBypassedForProvider, s as resolveProfileUnusableUntil } from "./usage-state-B_WYg1ed.js";
import { n as isStoredCredentialCompatibleWithAuthProvider, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-jGX4iJ3y.js";
import { a as NON_ENV_SECRETREF_MARKER, c as isNonSecretApiKeyMarker, n as CUSTOM_LOCAL_AUTH_MARKER, o as SECRETREF_ENV_HEADER_MARKER_PREFIX, s as isKnownEnvApiKeyMarker } from "./model-auth-markers-B67UeNMn.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { t as resolveEnvApiKey } from "./model-auth-env-B8fM73iy.js";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DqIBoQI-.js";
import { t as isLocalProviderBaseUrl } from "./model-provider-local-gImPEhcA.js";
//#region src/agents/model-auth-provider-config.ts
/**
* Provider-entry configuration and stored-profile binding for model auth.
*/
const MODEL_AUTH_LOCAL_HOST_ALIASES = /* @__PURE__ */ new Set([
	"docker.orb.internal",
	"host.docker.internal",
	"host.orb.internal"
]);
function sentinelizeSecretRefProfileApiKey(params) {
	const credential = params.store.profiles[params.profileId];
	return (credential?.type === "api_key" ? coerceSecretRef(credential.keyRef) : credential?.type === "token" ? coerceSecretRef(credential.tokenRef) : null) && params.enabled ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` }) : params.apiKey;
}
function resolveConfigAwareEnvApiKey(cfg, provider, workspaceDir, skipSetupProviderFallback) {
	return resolveEnvApiKey(provider, process.env, {
		config: cfg,
		workspaceDir,
		...skipSetupProviderFallback ? { skipSetupProviderFallback: true } : {}
	});
}
function resolveProviderConfig(cfg, provider) {
	return resolveMergedModelProviderConfig(cfg, provider);
}
/** Reads a literal or env-secret marker for a custom provider entry. */
function getCustomProviderApiKey(cfg, provider) {
	const entry = resolveProviderConfig(cfg, provider);
	const literal = normalizeOptionalSecretInput(entry?.apiKey);
	if (literal) return literal;
	const ref = coerceSecretRef(entry?.apiKey);
	if (!ref) return;
	if (ref.source === "env") return ref.id.trim() || "secretref-managed";
	return NON_ENV_SECRETREF_MARKER;
}
function canResolveEnvSecretRefInReadOnlyPath(params) {
	const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
	if (!providerConfig) return params.provider === resolveDefaultSecretProviderAlias(params.cfg ?? {}, "env");
	if (providerConfig.source !== "env") return false;
	const allowlist = providerConfig.allowlist;
	return !allowlist || allowlist.includes(params.id);
}
/** Resolves custom provider API keys that are usable without mutating secret stores. */
function resolveUsableCustomProviderApiKey(params) {
	const customProviderConfig = resolveProviderConfig(params.cfg, params.provider);
	const apiKeyRef = coerceSecretRef(customProviderConfig?.apiKey);
	if (apiKeyRef) {
		if (apiKeyRef.source !== "env") return null;
		const envVarName = apiKeyRef.id.trim();
		if (!envVarName) return null;
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: apiKeyRef.provider,
			id: envVarName
		})) return null;
		const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[envVarName]);
		if (!envValue) return null;
		const applied = new Set(getShellEnvAppliedKeys());
		return {
			apiKey: params.secretSentinels ? mintSecretSentinel(envValue, { label: `model-auth:${params.provider}` }) : envValue,
			source: resolveEnvSourceLabel({
				applied,
				envVars: [envVarName],
				label: `${envVarName} (models.json secretref)`
			})
		};
	}
	const customKey = getCustomProviderApiKey(params.cfg, params.provider);
	if (!customKey) return null;
	if (!isNonSecretApiKeyMarker(customKey)) return {
		apiKey: customKey,
		source: "models.json"
	};
	if (isKnownEnvApiKeyMarker(customKey)) {
		const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[customKey]);
		if (!envValue) return null;
		return {
			apiKey: envValue,
			source: resolveEnvSourceLabel({
				applied: new Set(getShellEnvAppliedKeys()),
				envVars: [customKey],
				label: `${customKey} (models.json marker)`
			})
		};
	}
	if (customProviderConfig && isCustomLocalProviderConfig(customProviderConfig) && (customProviderConfig.api === "openai-completions" || customProviderConfig.api === "ollama") && customProviderConfig.baseUrl && isLocalAuthProviderBaseUrl(customProviderConfig.baseUrl)) return {
		apiKey: customProviderConfig.api === "ollama" ? customKey : CUSTOM_LOCAL_AUTH_MARKER,
		source: "models.json (local marker)"
	};
	return null;
}
/** True when a custom provider has a literal/env/local key available now. */
function hasUsableCustomProviderApiKey(cfg, provider, env) {
	return Boolean(resolveUsableCustomProviderApiKey({
		cfg,
		provider,
		env
	}));
}
/** True when explicit provider config should outrank profile/environment auth. */
function shouldPreferExplicitConfigApiKeyAuth(cfg, provider) {
	const providerConfig = resolveProviderConfig(cfg, provider);
	return resolveProviderAuthOverride(cfg, provider) === "api-key" && providerConfig !== void 0 && hasExplicitProviderApiKeyConfig(providerConfig);
}
/** True when a custom local provider can use a synthetic no-auth placeholder. */
function hasSyntheticLocalProviderAuthConfig(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (!providerConfig) return false;
	if (!(Boolean(providerConfig.api?.trim()) || Boolean(providerConfig.baseUrl?.trim()) || Array.isArray(providerConfig.models) && providerConfig.models.length > 0)) return false;
	const authOverride = resolveProviderAuthOverride(params.cfg, params.provider);
	if (authOverride && authOverride !== "api-key") return false;
	if (!isCustomLocalProviderConfig(providerConfig) || hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	return Boolean(providerConfig.baseUrl && isLocalAuthProviderBaseUrl(providerConfig.baseUrl));
}
function resolveProviderAuthOverride(cfg, provider) {
	const auth = resolveProviderConfig(cfg, provider)?.auth;
	if (auth === "api-key" || auth === "aws-sdk" || auth === "oauth" || auth === "token") return auth;
}
function resolveDirectProviderCredentialMode(params) {
	const configuredMode = resolveProviderAuthOverride(params.cfg, params.provider);
	return configuredMode === "oauth" || configuredMode === "token" ? configuredMode : params.inferredMode;
}
function shouldUseImplicitAwsSdkAuth(params) {
	if (params.modelApi !== "bedrock-converse-stream") return false;
	if (normalizeProviderId(params.provider) !== "amazon-bedrock") return false;
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	return resolveProviderAuthOverride(params.cfg, params.provider) === void 0 && (providerConfig === void 0 || !hasExplicitProviderApiKeyConfig(providerConfig));
}
function profileTypeToAuthMode(type) {
	return type === "oauth" ? "oauth" : type === "token" ? "token" : "api-key";
}
function normalizeProviderEntryBaseUrlForBinding(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		parsed.hash = "";
		parsed.search = "";
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
		return parsed.toString().replace(/\/+$/, "");
	} catch {
		return trimmed.toLowerCase().replace(/\/+$/, "");
	}
}
function providerEntriesShareBaseUrl(params) {
	const providerBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveProviderConfig(params.cfg, params.provider)?.baseUrl);
	const credentialProviderBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveProviderConfig(params.cfg, params.credentialProvider)?.baseUrl);
	return Boolean(providerBaseUrl && credentialProviderBaseUrl && providerBaseUrl === credentialProviderBaseUrl);
}
function isBearerProfileCredential(credential) {
	return credential.type === "api_key" || credential.type === "token";
}
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
function canUseProfileAsProviderEntryApiKey(params) {
	if (!isBearerProfileCredential(params.credential)) return false;
	if (isStoredCredentialCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		provider: params.provider,
		credential: params.credential
	})) return true;
	return providerEntriesShareBaseUrl({
		cfg: params.cfg,
		provider: params.provider,
		credentialProvider: params.credential.provider
	});
}
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
function resolveProviderEntryApiKeyProfileReference(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (coerceSecretRef(providerConfig?.apiKey)) return { kind: "none" };
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (!perEntryRawKey) return { kind: "none" };
	if (isNonSecretApiKeyMarker(perEntryRawKey)) return { kind: "marker" };
	const credential = params.store.profiles[perEntryRawKey];
	if (!credential) return {
		kind: "literal",
		apiKey: perEntryRawKey,
		source: "models.json"
	};
	if (!isBearerProfileCredential(credential)) return {
		kind: "profile-incompatible",
		profileId: perEntryRawKey,
		credentialProvider: credential.provider,
		credentialType: credential.type,
		reason: "credential-class"
	};
	if (!canUseProfileAsProviderEntryApiKey({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		provider: params.provider,
		credential
	})) return {
		kind: "profile-incompatible",
		profileId: perEntryRawKey,
		credentialProvider: credential.provider,
		credentialType: credential.type,
		reason: "provider-binding"
	};
	return {
		kind: "profile",
		profileId: perEntryRawKey,
		credential,
		mode: profileTypeToAuthMode(credential.type)
	};
}
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
async function resolveProviderEntryApiKeyBinding(params) {
	const reference = resolveProviderEntryApiKeyProfileReference(params);
	if (reference.kind === "none" || reference.kind === "marker") return { kind: "none" };
	if (reference.kind === "literal") return reference;
	if (reference.kind === "profile-incompatible") return reference;
	try {
		const { resolveApiKeyForProfile } = await import("./oauth-Zu1LuEnv.js");
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store: params.store,
			profileId: reference.profileId,
			agentDir: params.agentDir
		});
		if (!resolved) return {
			kind: "profile-unresolved",
			profileId: reference.profileId
		};
		const resolvedProfileId = resolved.profileId ?? reference.profileId;
		return {
			kind: "profile-resolved",
			auth: {
				apiKey: sentinelizeSecretRefProfileApiKey({
					apiKey: resolved.apiKey,
					enabled: params.secretSentinels,
					profileId: resolvedProfileId,
					provider: params.provider,
					store: params.store
				}),
				profileId: resolvedProfileId,
				source: `profile:${resolvedProfileId}`,
				mode: resolved.profileType ? profileTypeToAuthMode(resolved.profileType) : reference.mode
			}
		};
	} catch (err) {
		if (err instanceof SecretSurfaceUnavailableError) throw err;
		return {
			kind: "profile-unresolved",
			profileId: reference.profileId,
			error: err
		};
	}
}
function resolveConfiguredAwsSdkProfileAuth(params) {
	if (!isConfiguredAwsSdkAuthProfileForProvider(params)) return null;
	return {
		...resolveAwsSdkAuthInfo(),
		profileId: params.profileId,
		source: `profile:${params.profileId}`
	};
}
function isLocalAuthProviderBaseUrl(baseUrl) {
	return isLocalProviderBaseUrl(baseUrl, MODEL_AUTH_LOCAL_HOST_ALIASES);
}
function hasExplicitProviderApiKeyConfig(providerConfig) {
	return normalizeOptionalSecretInput(providerConfig.apiKey) !== void 0 || coerceSecretRef(providerConfig.apiKey) !== null;
}
function isInlineProviderApiKeySource(source) {
	return source === "models.json" || source.endsWith(" (models.json secretref)") || source.endsWith(" (models.json marker)");
}
/** True when a resolved credential came from an inline `models.providers.<id>.apiKey`. */
function isConfigBackedInlineProviderApiKey(params) {
	if (isInlineProviderApiKeySource(params.source)) return true;
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (!providerConfig || !hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	if (coerceSecretRef(providerConfig.apiKey)) return true;
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig.apiKey);
	return Boolean(perEntryRawKey && !params.store?.profiles[perEntryRawKey]);
}
function resolveInlineProviderApiKeyCooldownUntil(store, provider) {
	if (isAuthCooldownBypassedForProvider(provider)) return null;
	const stats = store.usageStats?.[`inline-api-key:${normalizeProviderId(provider)}`];
	return stats ? resolveProfileUnusableUntil(stats) : null;
}
/** Fails closed while an inline provider API key is inside its billing/auth cooldown. */
function assertInlineProviderApiKeyUsable(params) {
	const unusableUntil = resolveInlineProviderApiKeyCooldownUntil(params.store, params.provider);
	if (typeof unusableUntil !== "number" || unusableUntil <= Date.now()) return;
	const waitMs = Math.max(0, unusableUntil - Date.now());
	const waitMinutes = Math.max(1, Math.ceil(waitMs / 6e4));
	throw new Error(`Inline API key for provider "${params.provider}" is temporarily disabled after a provider auth/billing failure. Retry after about ${waitMinutes} minute${waitMinutes === 1 ? "" : "s"}, or switch to a different auth profile/API key.`);
}
function isCustomLocalProviderConfig(providerConfig) {
	return typeof providerConfig.baseUrl === "string" && providerConfig.baseUrl.trim().length > 0 && typeof providerConfig.api === "string" && providerConfig.api.trim().length > 0 && Array.isArray(providerConfig.models) && providerConfig.models.length > 0;
}
function isManagedSecretRefApiKeyMarker(apiKey) {
	return apiKey?.trim() === NON_ENV_SECRETREF_MARKER;
}
function hasSecretRefProviderApiKey(cfg, provider) {
	const apiKey = resolveProviderConfig(cfg, provider)?.apiKey;
	if (coerceSecretRef(apiKey)) return true;
	return typeof apiKey === "string" && (isManagedSecretRefApiKeyMarker(apiKey) || apiKey.trim().startsWith("secretref-env:"));
}
function providerConfigMatchesRuntimeSnapshot(params) {
	const inputProvider = resolveProviderConfig(params.inputConfig, params.provider);
	const runtimeProvider = resolveProviderConfig(params.runtimeConfig ?? void 0, params.provider);
	if (!inputProvider || !runtimeProvider) return false;
	const toComparableConfig = (providerConfig) => ({ models: { providers: { [params.provider]: providerConfig } } });
	return hashRuntimeConfigValue(toComparableConfig(inputProvider)) === hashRuntimeConfigValue(toComparableConfig(runtimeProvider));
}
function sentinelizeConfigSecretRefEnvApiKey(params) {
	if (!params.enabled) return params.apiKey;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	const configured = resolveProviderConfig(providerConfigMatchesRuntimeSnapshot({
		inputConfig: params.cfg,
		runtimeConfig,
		provider: params.provider
	}) ? runtimeSourceConfig ?? params.cfg : params.cfg, params.provider)?.apiKey;
	const ref = coerceSecretRef(configured);
	const envId = ref?.source === "env" ? ref.id : typeof configured === "string" && configured.trim().startsWith("secretref-env:") ? configured.trim().slice(SECRETREF_ENV_HEADER_MARKER_PREFIX.length) : void 0;
	return envId && params.source.includes(envId) ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` }) : params.apiKey;
}
function resolveLiteralProviderConfigApiKeyAuth(params) {
	const apiKey = normalizeOptionalSecretInput(resolveProviderConfig(params.cfg, params.provider)?.apiKey);
	if (!apiKey || isNonSecretApiKeyMarker(apiKey)) return;
	return {
		apiKey,
		source: `models.providers.${params.provider}`,
		mode: resolveDirectProviderCredentialMode({
			cfg: params.cfg,
			provider: params.provider,
			inferredMode: "api-key"
		})
	};
}
function resolveEnvSourceLabel(params) {
	return `${params.envVars.some((envVar) => params.applied.has(envVar)) ? "shell env: " : "env: "}${params.label}`;
}
function resolveAwsSdkAuthInfo() {
	const applied = new Set(getShellEnvAppliedKeys());
	if (process.env.AWS_BEARER_TOKEN_BEDROCK?.trim()) return {
		mode: "aws-sdk",
		source: resolveEnvSourceLabel({
			applied,
			envVars: ["AWS_BEARER_TOKEN_BEDROCK"],
			label: "AWS_BEARER_TOKEN_BEDROCK"
		})
	};
	if (process.env.AWS_ACCESS_KEY_ID?.trim() && process.env.AWS_SECRET_ACCESS_KEY?.trim()) return {
		mode: "aws-sdk",
		source: resolveEnvSourceLabel({
			applied,
			envVars: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
			label: "AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY"
		})
	};
	if (process.env.AWS_PROFILE?.trim()) return {
		mode: "aws-sdk",
		source: resolveEnvSourceLabel({
			applied,
			envVars: ["AWS_PROFILE"],
			label: "AWS_PROFILE"
		})
	};
	return {
		mode: "aws-sdk",
		source: "aws-sdk default chain"
	};
}
//#endregion
export { sentinelizeSecretRefProfileApiKey as C, sentinelizeConfigSecretRefEnvApiKey as S, shouldUseImplicitAwsSdkAuth as T, resolveProviderAuthOverride as _, hasSyntheticLocalProviderAuthConfig as a, resolveProviderEntryApiKeyProfileReference as b, isManagedSecretRefApiKeyMarker as c, resolveAwsSdkAuthInfo as d, resolveConfigAwareEnvApiKey as f, resolveLiteralProviderConfigApiKeyAuth as g, resolveInlineProviderApiKeyCooldownUntil as h, hasSecretRefProviderApiKey as i, profileTypeToAuthMode as l, resolveDirectProviderCredentialMode as m, canUseProfileAsProviderEntryApiKey as n, hasUsableCustomProviderApiKey as o, resolveConfiguredAwsSdkProfileAuth as p, getCustomProviderApiKey as r, isConfigBackedInlineProviderApiKey as s, assertInlineProviderApiKeyUsable as t, providerConfigMatchesRuntimeSnapshot as u, resolveProviderConfig as v, shouldPreferExplicitConfigApiKeyAuth as w, resolveUsableCustomProviderApiKey as x, resolveProviderEntryApiKeyBinding as y };
