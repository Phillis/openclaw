import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as mergePluginTextTransforms, t as resolveRuntimeTextTransforms } from "./text-transforms.runtime-C3pgI4wL.js";
import { i as resolvePluginSetupRegistry, n as resolvePluginSetupCliBackend } from "./setup-registry-DxR0jJ50.js";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
//#region src/agents/cli-backends.ts
/**
* Resolves CLI runtime backends registered by plugins or setup metadata.
*/
const defaultCliBackendsDeps = {
	resolvePluginSetupCliBackend,
	resolvePluginSetupRegistry,
	resolveRuntimeCliBackends
};
let cliBackendsDeps = defaultCliBackendsDeps;
const FALLBACK_CLI_BACKEND_POLICIES = {};
function normalizeBundleMcpMode(mode, enabled) {
	if (!enabled) return;
	return mode ?? "claude-config-file";
}
function resolveToolAvailabilityEnforcement(backend) {
	if (backend.toolAvailabilityEnforcement) return backend.toolAvailabilityEnforcement;
	const builtWith = backend.builtWithOpenClawVersion?.replace(/^v/u, "");
	return /^2026\.7\.2-beta\.[123]$/u.test(builtWith ?? "") && backend.nativeToolMode === "selectable" && backend.resolveExecutionArgs ? "execution-args" : void 0;
}
function resolveSetupCliBackendPolicy(provider) {
	const entry = cliBackendsDeps.resolvePluginSetupCliBackend({ backend: provider });
	if (!entry) return;
	return {
		bundleMcp: entry.backend.bundleMcp === true,
		modelProvider: resolveCliBackendModelProvider(entry.backend),
		bundleMcpMode: normalizeBundleMcpMode(entry.backend.bundleMcpMode, entry.backend.bundleMcp === true),
		baseConfig: entry.backend.config,
		normalizeConfig: entry.backend.normalizeConfig,
		transformSystemPrompt: entry.backend.transformSystemPrompt,
		textTransforms: entry.backend.textTransforms,
		defaultAuthProfileId: entry.backend.defaultAuthProfileId,
		authEpochMode: entry.backend.authEpochMode,
		autoSelectAuthProfile: entry.backend.autoSelectAuthProfile,
		contextEngineHostCapabilities: entry.backend.contextEngineHostCapabilities,
		ownsNativeCompaction: entry.backend.ownsNativeCompaction,
		manualCompaction: entry.backend.manualCompaction,
		prepareExecution: entry.backend.prepareExecution,
		resolveExecutionArgs: entry.backend.resolveExecutionArgs,
		parseJsonlEvent: entry.backend.parseJsonlEvent,
		toolAvailabilityEnforcement: entry.backend.toolAvailabilityEnforcement,
		nativeToolMode: entry.backend.nativeToolMode,
		sideQuestionToolMode: entry.backend.sideQuestionToolMode,
		runtimeArtifact: entry.backend.runtimeArtifact,
		liveSessionRequirement: entry.backend.liveSessionRequirement
	};
}
function resolveFallbackCliBackendPolicy(provider) {
	return FALLBACK_CLI_BACKEND_POLICIES[provider] ?? resolveSetupCliBackendPolicy(provider);
}
function normalizeBackendKey(key) {
	return normalizeProviderId(key);
}
function resolveRegisteredBackend(provider) {
	const normalized = normalizeBackendKey(provider);
	return cliBackendsDeps.resolveRuntimeCliBackends().find((entry) => normalizeBackendKey(entry.id) === normalized);
}
function resolveCliBackendModelProvider(backend) {
	const provider = backend.modelProvider?.trim();
	return provider ? normalizeProviderId(provider) : void 0;
}
function addCliRuntimeModelBinding(bindings, params) {
	const provider = resolveCliBackendModelProvider(params.backend);
	const runtime = normalizeBackendKey(params.backend.id);
	if (!provider || !runtime) return;
	bindings.set(`${provider}:${runtime}`, {
		provider,
		runtime,
		...params.pluginId ? { pluginId: params.pluginId } : {}
	});
}
/** Lists model-provider to CLI-runtime bindings from runtime and optional setup registries. */
function listCliRuntimeModelBackendBindings(params = {}) {
	const bindings = /* @__PURE__ */ new Map();
	for (const backend of cliBackendsDeps.resolveRuntimeCliBackends()) addCliRuntimeModelBinding(bindings, {
		backend,
		...backend.pluginId ? { pluginId: backend.pluginId } : {}
	});
	if (params.includeSetupRegistry === true) for (const entry of cliBackendsDeps.resolvePluginSetupRegistry({
		config: params.config,
		env: params.env
	}).cliBackends) addCliRuntimeModelBinding(bindings, {
		backend: entry.backend,
		pluginId: entry.pluginId
	});
	return [...bindings.values()].toSorted((left, right) => left.provider === right.provider ? left.runtime.localeCompare(right.runtime) : left.provider.localeCompare(right.provider));
}
/** Lists CLI runtime ids that alias canonical model providers. */
function listCliRuntimeProviderIds(params = {}) {
	return [...new Set(listCliRuntimeModelBackendBindings(params).map((binding) => normalizeBackendKey(binding.runtime)).filter(Boolean))].toSorted();
}
/** Resolves the canonical model provider served by a CLI runtime id. */
function resolveCliRuntimeCanonicalProvider(params) {
	const runtime = normalizeBackendKey(params.runtime ?? "");
	if (!runtime) return;
	const runtimeBinding = listCliRuntimeModelBackendBindings().find((binding) => binding.runtime === runtime);
	if (runtimeBinding) return runtimeBinding.provider;
	if (params.includeSetupRegistry !== true) return;
	const setupBackend = cliBackendsDeps.resolvePluginSetupCliBackend({
		backend: runtime,
		config: params.config,
		env: params.env
	});
	return setupBackend ? resolveCliBackendModelProvider(setupBackend.backend) : void 0;
}
/** Resolves the binding for one provider/runtime pair when registered. */
function resolveCliRuntimeModelBackendBinding(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const runtime = normalizeBackendKey(params.runtime ?? "");
	if (!provider || !runtime) return;
	const runtimeBinding = listCliRuntimeModelBackendBindings().find((binding) => binding.provider === provider && binding.runtime === runtime);
	if (runtimeBinding) return runtimeBinding;
	if (!(params.config !== void 0 || params.env !== void 0)) return;
	const setupBackend = cliBackendsDeps.resolvePluginSetupCliBackend({
		backend: runtime,
		config: params.config,
		env: params.env
	});
	if (!setupBackend) return;
	return resolveCliBackendModelProvider(setupBackend.backend) === provider ? {
		provider,
		runtime,
		...setupBackend.pluginId ? { pluginId: setupBackend.pluginId } : {}
	} : void 0;
}
/** Checks whether a runtime is registered to serve a model provider. */
function isCliRuntimeModelBackendForProvider(params) {
	return resolveCliRuntimeModelBackendBinding(params) !== void 0;
}
/** Resolves setup-safe live-session protocol metadata without normalizing runtime config. */
function resolveCliBackendLiveSessionRequirement(provider) {
	const normalized = normalizeBackendKey(provider);
	const entry = cliBackendsDeps.resolvePluginSetupCliBackend({ backend: normalized }) ?? cliBackendsDeps.resolveRuntimeCliBackends().find((backend) => normalizeBackendKey(backend.id) === normalized);
	if (!entry) return null;
	return ("backend" in entry ? entry.backend : entry).liveSessionRequirement ?? null;
}
/** Resolves the executable CLI backend registered by its owning plugin. */
function resolveCliBackendConfig(provider, cfg, options = {}) {
	const normalized = normalizeBackendKey(provider);
	const normalizeContext = {
		backendId: normalized,
		...options.agentId ? { agentId: options.agentId } : {},
		...cfg ? { config: cfg } : {}
	};
	const runtimeTextTransforms = resolveRuntimeTextTransforms();
	const registered = resolveRegisteredBackend(normalized);
	if (registered) {
		const registeredConfig = { ...registered.config };
		const config = registered.normalizeConfig ? registered.normalizeConfig(registeredConfig, normalizeContext) : registeredConfig;
		const command = config.command?.trim();
		if (!command) return null;
		return {
			id: normalized,
			...registered.modelProvider ? { modelProvider: normalizeProviderId(registered.modelProvider) } : {},
			config: {
				...config,
				command
			},
			bundleMcp: registered.bundleMcp === true,
			bundleMcpMode: normalizeBundleMcpMode(registered.bundleMcpMode, registered.bundleMcp === true),
			pluginId: registered.pluginId,
			transformSystemPrompt: registered.transformSystemPrompt,
			textTransforms: mergePluginTextTransforms(runtimeTextTransforms, registered.textTransforms),
			defaultAuthProfileId: registered.defaultAuthProfileId,
			authEpochMode: registered.authEpochMode,
			autoSelectAuthProfile: registered.autoSelectAuthProfile,
			contextEngineHostCapabilities: registered.contextEngineHostCapabilities,
			ownsNativeCompaction: registered.ownsNativeCompaction,
			manualCompaction: registered.manualCompaction,
			prepareExecution: registered.prepareExecution,
			resolveExecutionArgs: registered.resolveExecutionArgs,
			parseJsonlEvent: registered.parseJsonlEvent,
			toolAvailabilityEnforcement: resolveToolAvailabilityEnforcement(registered),
			nativeToolMode: registered.nativeToolMode,
			sideQuestionToolMode: registered.sideQuestionToolMode,
			runtimeArtifact: registered.runtimeArtifact,
			liveSessionRequirement: registered.liveSessionRequirement
		};
	}
	const fallbackPolicy = resolveFallbackCliBackendPolicy(normalized);
	if (!fallbackPolicy?.baseConfig) return null;
	const config = fallbackPolicy.normalizeConfig ? fallbackPolicy.normalizeConfig(fallbackPolicy.baseConfig, normalizeContext) : fallbackPolicy.baseConfig;
	const command = config.command?.trim();
	if (!command) return null;
	return {
		id: normalized,
		...fallbackPolicy.modelProvider ? { modelProvider: fallbackPolicy.modelProvider } : {},
		config: {
			...config,
			command
		},
		bundleMcp: fallbackPolicy.bundleMcp,
		bundleMcpMode: fallbackPolicy.bundleMcpMode,
		transformSystemPrompt: fallbackPolicy.transformSystemPrompt,
		textTransforms: mergePluginTextTransforms(runtimeTextTransforms, fallbackPolicy.textTransforms),
		defaultAuthProfileId: fallbackPolicy.defaultAuthProfileId,
		authEpochMode: fallbackPolicy.authEpochMode,
		autoSelectAuthProfile: fallbackPolicy.autoSelectAuthProfile,
		contextEngineHostCapabilities: fallbackPolicy.contextEngineHostCapabilities,
		ownsNativeCompaction: fallbackPolicy.ownsNativeCompaction,
		manualCompaction: fallbackPolicy.manualCompaction,
		prepareExecution: fallbackPolicy.prepareExecution,
		resolveExecutionArgs: fallbackPolicy.resolveExecutionArgs,
		parseJsonlEvent: fallbackPolicy.parseJsonlEvent,
		toolAvailabilityEnforcement: fallbackPolicy.toolAvailabilityEnforcement,
		nativeToolMode: fallbackPolicy.nativeToolMode,
		sideQuestionToolMode: fallbackPolicy.sideQuestionToolMode,
		runtimeArtifact: fallbackPolicy.runtimeArtifact,
		liveSessionRequirement: fallbackPolicy.liveSessionRequirement
	};
}
/** Test-only dependency controls for CLI backend registry resolution. */
const testing = {
	resetDepsForTest() {
		cliBackendsDeps = defaultCliBackendsDeps;
	},
	setDepsForTest(deps) {
		cliBackendsDeps = {
			...defaultCliBackendsDeps,
			...deps
		};
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cliBackendsTestApi")] = testing;
//#endregion
export { resolveCliBackendLiveSessionRequirement as a, resolveCliBackendConfig as i, listCliRuntimeModelBackendBindings as n, resolveCliRuntimeCanonicalProvider as o, listCliRuntimeProviderIds as r, resolveCliRuntimeModelBackendBinding as s, isCliRuntimeModelBackendForProvider as t };
