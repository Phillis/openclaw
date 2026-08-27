import { h as normalizeSecretInputString, s as coerceSecretRef, y as resolveSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { f as resolveNonEnvSecretRefApiKeyMarker } from "./model-auth-markers-B67UeNMn.js";
import "./provider-auth-CZW5iaiY.js";
import { m as readProviderEnvValue } from "./web-search-provider-common-BU-TfdKe.js";
import "./secret-input-Dv7SE4A5.js";
import { i as canResolveEnvSecretRefInReadOnlyPath } from "./extension-shared-BCgJMXly.js";
import { i as resolveProviderWebSearchPluginConfig } from "./web-search-provider-config-DP_T4wzm.js";
import "./provider-web-search-DfXrpO-M.js";
//#region extensions/xai/src/tool-auth-shared.ts
const XAI_API_KEY_ENV_VAR = "XAI_API_KEY";
const XAI_PROVIDER_ID = "xai";
function readConfiguredOrManagedApiKey(value) {
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	const ref = coerceSecretRef(value);
	return ref ? resolveNonEnvSecretRefApiKeyMarker(ref.source) : void 0;
}
function readConfiguredRuntimeApiKey(value, path, cfg) {
	const resolved = resolveSecretInputString({
		value,
		path,
		defaults: cfg?.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") return {
		status: "available",
		value: resolved.value
	};
	if (resolved.status === "missing") return { status: "missing" };
	if (resolved.ref.source !== "env") return { status: "blocked" };
	const envVarName = resolved.ref.id.trim();
	if (envVarName !== XAI_API_KEY_ENV_VAR) return { status: "blocked" };
	if (!canResolveEnvSecretRefInReadOnlyPath({
		cfg,
		provider: resolved.ref.provider,
		id: envVarName
	})) return { status: "blocked" };
	const envValue = normalizeSecretInputString(process.env[envVarName]);
	return envValue ? {
		status: "available",
		value: envValue
	} : { status: "missing" };
}
function readPluginXaiWebSearchApiKeyResult(cfg) {
	return readConfiguredRuntimeApiKey(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey, "plugins.entries.xai.config.webSearch.apiKey", cfg);
}
function resolveConfiguredXaiToolApiKeyResult(params) {
	const runtimePlugin = readPluginXaiWebSearchApiKeyResult(params.runtimeConfig);
	if (runtimePlugin.status === "available" || runtimePlugin.status === "blocked") return runtimePlugin;
	const sourcePlugin = readPluginXaiWebSearchApiKeyResult(params.sourceConfig);
	if (sourcePlugin.status === "available" || sourcePlugin.status === "blocked") return sourcePlugin;
	return { status: "missing" };
}
function hasXaiAuthProfile(auth) {
	return auth?.hasAuthForProvider?.(XAI_PROVIDER_ID) === true;
}
async function resolveXaiAuthProfileApiKey(auth) {
	return normalizeSecretInputString(await auth?.resolveApiKeyForProvider?.(XAI_PROVIDER_ID));
}
function resolveFallbackXaiAuth(cfg) {
	const pluginApiKey = readConfiguredOrManagedApiKey(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey);
	if (pluginApiKey) return {
		apiKey: pluginApiKey,
		source: "plugins.entries.xai.config.webSearch.apiKey"
	};
}
async function resolveXaiToolApiKeyWithAuth(params) {
	const configured = resolveConfiguredXaiToolApiKeyResult(params);
	if (configured.status === "available") return configured.value;
	if (configured.status === "blocked") return;
	return await resolveXaiAuthProfileApiKey(params.auth) ?? readProviderEnvValue([XAI_API_KEY_ENV_VAR]);
}
function isXaiToolEnabled(params) {
	if (params.enabled === false) return false;
	const configured = resolveConfiguredXaiToolApiKeyResult(params);
	if (configured.status === "available") return true;
	if (configured.status === "blocked") return false;
	return hasXaiAuthProfile(params.auth) || Boolean(readProviderEnvValue([XAI_API_KEY_ENV_VAR]));
}
//#endregion
export { resolveFallbackXaiAuth as n, resolveXaiToolApiKeyWithAuth as r, isXaiToolEnabled as t };
