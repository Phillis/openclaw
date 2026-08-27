import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { a as listAgentIds, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-DIK_QG79.js";
import { a as resolveSharedAuthStorePath } from "./path-resolve-Bjd7UUgA.js";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-DCEipwnb.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-BsvahKHa.js";
import { a as getRuntimeAuthProfileStoreCredentialsRevision } from "./runtime-snapshots-a_60jBeK.js";
import { n as hasSecretRefCandidate, t as hasCredentialBearingObjectValue } from "./runtime-secret-scan-D-4Oecwd.js";
import { existsSync } from "node:fs";
//#region src/secrets/runtime-fast-path.ts
/** Detects when secrets runtime preparation can safely use a fast path. */
const RUNTIME_PATH_ENV_KEYS = [
	"HOME",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"OPENCLAW_HOME",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_AGENT_DIR"
];
/**
* Merges caller env with process path env needed for config and agent-dir resolution.
*/
function mergeSecretsRuntimeEnv(env) {
	const merged = { ...env ?? process.env };
	for (const key of RUNTIME_PATH_ENV_KEYS) {
		if (merged[key] !== void 0) continue;
		const processValue = process.env[key];
		if (processValue !== void 0) merged[key] = processValue;
	}
	return merged;
}
/**
* Collects default and named agent directories that may contain auth profile stores.
*/
function collectCandidateAgentDirs(config, env = process.env) {
	const dirs = /* @__PURE__ */ new Set();
	dirs.add(resolveUserPath(resolveAgentDir(config, "main", env), env));
	dirs.add(resolveUserPath(resolveLegacyInheritedAuthAgentDir(config, env), env));
	for (const agentId of listAgentIds(config)) dirs.add(resolveUserPath(resolveAgentDir(config, agentId, env), env));
	return [...dirs];
}
/**
* Combines explicit refresh agent dirs with config-derived dirs for runtime refresh.
*/
function resolveRefreshAgentDirs(config, context) {
	const configDerived = collectCandidateAgentDirs(config, context.env);
	if (!context.explicitAgentDirs || context.explicitAgentDirs.length === 0) return configDerived;
	return uniqueStrings([...context.explicitAgentDirs, ...configDerived]);
}
function resolveCandidateAgentDirs(params) {
	return params.agentDirs?.length ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, params.env))) : collectCandidateAgentDirs(params.config, params.env);
}
function hasCandidateAuthProfileStoreSource(agentDir) {
	return existsSync(resolveAuthProfileDatabasePath(agentDir));
}
/**
* Returns whether canonical auth-profile databases exist for candidate agent dirs.
*/
function hasCandidateAuthProfileStoreSources(params) {
	return resolveCandidateAgentDirs(params).some((agentDir) => hasCandidateAuthProfileStoreSource(agentDir)) || existsSync(resolveSharedAuthStorePath(params.env));
}
/**
* Creates empty web-tool metadata for snapshots that do not need secret resolution.
*/
function createEmptyRuntimeWebToolsMetadata() {
	return {
		search: {
			providerSource: "none",
			diagnostics: []
		},
		fetch: {
			providerSource: "none",
			diagnostics: []
		},
		diagnostics: []
	};
}
function hasActiveRuntimeWebFetchProviderSurface(fetch, defaults) {
	if (!fetch || typeof fetch !== "object" || Array.isArray(fetch)) return false;
	const fetchConfig = fetch;
	if (fetchConfig.enabled === false) return false;
	if (typeof fetchConfig.provider === "string" && fetchConfig.provider.trim()) return true;
	return hasCredentialBearingObjectValue(fetchConfig, defaults);
}
function hasRuntimeWebToolConfigSurface(config) {
	const web = config.tools?.web;
	const defaults = config.secrets?.defaults;
	const fetchExplicitlyDisabled = web && typeof web === "object" && !Array.isArray(web) && typeof web.fetch === "object" && web.fetch?.enabled === false;
	if (web && typeof web === "object" && !Array.isArray(web)) {
		const webRecord = web;
		if ("search" in webRecord) return true;
		if ("fetch" in webRecord && hasActiveRuntimeWebFetchProviderSurface(webRecord.fetch, defaults)) return true;
	}
	const entries = config.plugins?.entries;
	if (!entries || typeof entries !== "object" || Array.isArray(entries)) return false;
	return Object.values(entries).some((entry) => {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
		const pluginConfig = entry.config;
		return pluginConfig !== null && typeof pluginConfig === "object" && !Array.isArray(pluginConfig) && ("webSearch" in pluginConfig || !fetchExplicitlyDisabled && "webFetch" in pluginConfig);
	});
}
/**
* Returns whether a snapshot can skip full SecretRef/web-tool resolution.
*/
/** Returns whether current config/auth/plugin state allows skipping full secret preparation. */
function canUseSecretsRuntimeFastPath(params) {
	if (hasRuntimeWebToolConfigSurface(params.sourceConfig)) return false;
	const defaults = params.sourceConfig.secrets?.defaults;
	if (hasSecretRefCandidate(params.sourceConfig, defaults)) return false;
	return !params.authStores.some((entry) => hasSecretRefCandidate(entry.store, defaults));
}
/**
* Prepares a runtime snapshot without resolving refs when config and auth stores contain none.
*/
function prepareSecretsRuntimeFastPathSnapshot(params) {
	const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
	const authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	const sourceConfig = cloneConfigWithResolutionFacts(params.config);
	const resolvedConfig = cloneConfigWithResolutionFacts(params.config);
	const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
	const candidateDirs = resolveCandidateAgentDirs({
		config: resolvedConfig,
		env: runtimeEnv,
		agentDirs: params.agentDirs
	});
	let authStores = [];
	if (includeAuthStoreRefs) if (!params.loadAuthStore) {
		if (hasCandidateAuthProfileStoreSources({
			config: resolvedConfig,
			env: runtimeEnv,
			agentDirs: candidateDirs
		})) return null;
		authStores = candidateDirs.map((agentDir) => ({
			agentDir,
			store: {
				version: 1,
				profiles: {}
			}
		}));
	} else {
		const loadAuthStore = params.loadAuthStore;
		authStores = candidateDirs.map((agentDir) => ({
			agentDir,
			store: structuredClone(loadAuthStore(agentDir))
		}));
	}
	if (!canUseSecretsRuntimeFastPath({
		sourceConfig,
		authStores
	})) return null;
	return {
		snapshot: {
			sourceConfig,
			config: resolvedConfig,
			authStores,
			authStoreCredentialsRevision,
			warnings: [],
			degradedOwners: [],
			secretOwners: [],
			webTools: createEmptyRuntimeWebToolsMetadata()
		},
		usesAuthStoreFallback: !params.loadAuthStore,
		refreshContext: {
			env: runtimeEnv,
			explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
			includeAuthStoreRefs,
			loadablePluginOrigins: params.loadablePluginOrigins ?? /* @__PURE__ */ new Map(),
			...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
			...params.loadAuthStore ? { loadAuthStore: params.loadAuthStore } : {}
		}
	};
}
//#endregion
//#region src/secrets/runtime-provider-auth-activation.ts
let activationHandler = null;
function registerProviderAuthRuntimeSnapshotActivation(handler) {
	activationHandler = handler;
}
function registerProviderAuthRuntimeSnapshotActivationOwner(owner) {
	registerProviderAuthRuntimeSnapshotActivation(async (params) => await owner.runExclusive(async () => {
		if (!owner.isCurrent(params.snapshot, params.expectedRevision)) return false;
		try {
			owner.assertValid(params.snapshot);
			if (!params.activateSnapshotIfCurrent()) return false;
			await owner.publish(params.snapshot);
			return true;
		} catch (error) {
			return owner.onError(error, params.snapshot);
		}
	}));
}
function clearProviderAuthRuntimeSnapshotActivation() {
	activationHandler = null;
}
async function activateProviderAuthRuntimeSnapshot(params) {
	return activationHandler ? await activationHandler(params) : params.activateSnapshotIfCurrent();
}
//#endregion
export { collectCandidateAgentDirs as a, prepareSecretsRuntimeFastPathSnapshot as c, canUseSecretsRuntimeFastPath as i, resolveRefreshAgentDirs as l, clearProviderAuthRuntimeSnapshotActivation as n, createEmptyRuntimeWebToolsMetadata as o, registerProviderAuthRuntimeSnapshotActivationOwner as r, mergeSecretsRuntimeEnv as s, activateProviderAuthRuntimeSnapshot as t };
