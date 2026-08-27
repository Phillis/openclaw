import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { d as normalizeProviderModelIdWithManifest } from "./model-ref-shared-D4yx0hwT.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { n as matchesProviderPluginRef } from "./provider-registry-shared-CYfJZ_PT.js";
import { i as resolveProviderPolicySurface, r as resolveBundledProviderPolicySurface } from "./provider-public-artifacts--Ss5eLs5.js";
import { c as resolveGpt5SystemPromptContribution } from "./gpt5-prompt-overlay-1wvhhu5B.js";
import { n as getRegisteredAgentHarness } from "./registry-CWcxV14-.js";
import { n as applyPluginTextReplacements, r as mergePluginTextTransforms, t as resolveRuntimeTextTransforms } from "./text-transforms.runtime-t00RPT18.js";
import { a as unwrapSecretSentinelsForProviderEgress } from "./provider-secret-egress-C6cfX3SL.js";
import { o as providerUsageLabel } from "./provider-usage.shared-BBSavFhT.js";
import { d as resolveOwningPluginIdsForProviderRef, f as resolveProviderRefOwnership, p as resolveUsageHookProviderPluginContracts, r as resolveCatalogHookProviderPluginIds, s as resolveExternalAuthProfileProviderPluginIds, u as resolveOwningPluginIdsForProvider } from "./providers-BY0gR-NY.js";
import { t as resolvePluginDiscoveryProvidersRuntime } from "./provider-discovery.runtime.js";
import { a as resolveLoadedProviderRuntimePlugin, d as resolveProviderRuntimePlugin, l as resolveProviderHookPlugin, n as ensureProviderRuntimePluginHandle, u as resolveProviderPluginsForHooks } from "./provider-hook-runtime-D8D6y2A9.js";
//#region src/plugins/provider-runtime.ts
function resolveProviderHookRefs(provider, providerConfig, modelApi) {
	const refs = [provider];
	const apiRef = normalizeOptionalString(modelApi ?? providerConfig?.api);
	if (apiRef && normalizeProviderId(apiRef) !== normalizeProviderId(provider)) refs.push(apiRef);
	return uniqueStrings(refs);
}
function matchesAnyProviderPluginRef(provider, providerRefs) {
	return providerRefs.some((providerRef) => matchesProviderPluginRef(provider, providerRef));
}
function hasExplicitProviderRuntimePluginActivation(params) {
	if (!params.config) return true;
	const ownerPluginIds = resolveOwningPluginIdsForProvider({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) ?? [];
	if (ownerPluginIds.length === 0) return false;
	const allow = new Set(params.config.plugins?.allow ?? []);
	const entries = params.config.plugins?.entries ?? {};
	return ownerPluginIds.some((pluginId) => allow.has(pluginId) || entries[pluginId] !== void 0);
}
function hasConfiguredModelProvider(params) {
	return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
}
function resolveProviderPluginsForCatalogHooks(params) {
	const workspaceDir = params.workspaceDir ?? params.metadataSnapshot?.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	const env = params.env ?? process.env;
	const onlyPluginIds = resolveCatalogHookProviderPluginIds({
		config: params.config,
		workspaceDir,
		env,
		metadataSnapshot: params.metadataSnapshot
	});
	if (onlyPluginIds.length === 0) return [];
	return resolveProviderPluginsForHooks({
		...params,
		workspaceDir,
		env,
		onlyPluginIds,
		pluginMetadataSnapshot: params.metadataSnapshot
	});
}
function runProviderDynamicModel(params) {
	return resolveProviderRuntimePlugin(params)?.resolveDynamicModel?.(params.context) ?? void 0;
}
function resolveProviderSystemPromptContribution(params) {
	const plugin = ensureProviderRuntimePluginHandle(params).plugin;
	const baseOverlay = resolveGpt5SystemPromptContribution({
		config: params.context.config ?? params.config,
		providerId: params.context.provider ?? params.provider,
		modelId: params.context.modelId,
		trigger: params.context.trigger
	});
	return mergeProviderSystemPromptContributions(mergeProviderSystemPromptContributions(baseOverlay, plugin?.resolvePromptOverlay?.({
		...params.context,
		baseOverlay
	}) ?? void 0), plugin?.resolveSystemPromptContribution?.(params.context) ?? void 0);
}
function mergeProviderSystemPromptContributions(base, override) {
	if (!base) return override;
	if (!override) return base;
	const stablePrefix = mergeUniquePromptSections(base.stablePrefix, override.stablePrefix);
	const dynamicSuffix = mergeUniquePromptSections(base.dynamicSuffix, override.dynamicSuffix);
	return {
		...stablePrefix ? { stablePrefix } : {},
		...dynamicSuffix ? { dynamicSuffix } : {},
		sectionOverrides: {
			...base.sectionOverrides,
			...override.sectionOverrides
		}
	};
}
function mergeUniquePromptSections(...sections) {
	const uniqueSections = uniqueStrings(sections.filter((section) => Boolean(section?.trim())));
	return uniqueSections.length > 0 ? uniqueSections.join("\n\n") : void 0;
}
function transformProviderSystemPrompt(params) {
	const plugin = ensureProviderRuntimePluginHandle(params).plugin;
	const textTransforms = mergePluginTextTransforms(resolveRuntimeTextTransforms(), plugin?.textTransforms);
	return applyPluginTextReplacements(plugin?.transformSystemPrompt?.(params.context) ?? params.context.systemPrompt, textTransforms?.input);
}
function resolveProviderTextTransforms(params) {
	return mergePluginTextTransforms(resolveRuntimeTextTransforms(), ensureProviderRuntimePluginHandle(params).plugin?.textTransforms);
}
async function prepareProviderDynamicModel(params) {
	return resolveProviderRuntimePlugin(params)?.prepareDynamicModel?.(params.context);
}
function shouldPreferProviderRuntimeResolvedModel(params) {
	return resolveProviderRuntimePlugin(params)?.preferRuntimeResolvedModel?.(params.context) ?? false;
}
function normalizeProviderResolvedModelWithPlugin(params) {
	const context = {
		...params.context,
		...params.context.config === void 0 && params.config !== void 0 ? { config: params.config } : {},
		...params.context.workspaceDir === void 0 && params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	};
	return resolveProviderRuntimePlugin({
		...params,
		modelId: params.context.modelId
	})?.normalizeResolvedModel?.(context) ?? void 0;
}
function applyProviderResolvedTransportWithPlugin(params) {
	const config = params.context.config ?? params.config;
	const workspaceDir = params.context.workspaceDir ?? params.workspaceDir;
	const normalized = normalizeProviderTransportWithPlugin({
		provider: params.provider,
		config,
		workspaceDir,
		env: params.env,
		modelId: params.context.modelId,
		context: {
			...config !== void 0 ? { config } : {},
			...workspaceDir !== void 0 ? { workspaceDir } : {},
			provider: params.context.provider,
			modelId: params.context.modelId,
			api: params.context.model.api,
			baseUrl: params.context.model.baseUrl
		}
	});
	if (!normalized) return;
	const nextApi = normalized.api ?? params.context.model.api;
	const nextBaseUrl = normalized.baseUrl ?? params.context.model.baseUrl;
	if (nextApi === params.context.model.api && nextBaseUrl === params.context.model.baseUrl) return;
	return {
		...params.context.model,
		api: nextApi,
		baseUrl: nextBaseUrl
	};
}
function normalizeProviderModelIdWithPlugin(params) {
	return normalizeOptionalString(resolveProviderHookPlugin(params)?.normalizeModelId?.(params.context)) ?? normalizeProviderModelIdWithManifest(params);
}
function normalizeProviderTransportWithPlugin(params) {
	const hasTransportChange = (normalized) => (normalized.api ?? params.context.api) !== params.context.api || (normalized.baseUrl ?? params.context.baseUrl) !== params.context.baseUrl;
	const context = {
		...params.context,
		...params.context.config === void 0 && params.config !== void 0 ? { config: params.config } : {},
		...params.context.workspaceDir === void 0 && params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	};
	const matchedPlugin = resolveProviderHookPlugin(params);
	const normalizedMatched = matchedPlugin?.normalizeTransport?.(context);
	if (normalizedMatched && hasTransportChange(normalizedMatched)) return normalizedMatched;
	if (hasConfiguredModelProvider(params)) return;
	for (const candidate of resolveProviderPluginsForHooks(params)) {
		if (!candidate.normalizeTransport || candidate === matchedPlugin) continue;
		const normalized = candidate.normalizeTransport(context);
		if (normalized && hasTransportChange(normalized)) return normalized;
	}
}
function normalizeProviderConfigWithPlugin(params) {
	const hasConfigChange = (normalized) => normalized !== params.context.providerConfig;
	const bundledSurface = resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry });
	if (bundledSurface?.normalizeConfig) {
		const normalized = bundledSurface.normalizeConfig(params.context);
		return normalized && hasConfigChange(normalized) ? normalized : void 0;
	}
	if (!hasExplicitProviderRuntimePluginActivation(params)) return;
	if (params.allowRuntimePluginLoad === false) return;
	const normalizedMatched = resolveProviderRuntimePlugin(params)?.normalizeConfig?.(params.context);
	return normalizedMatched && hasConfigChange(normalizedMatched) ? normalizedMatched : void 0;
}
function resolveProviderConfigApiKeyWithPlugin(params) {
	const bundledSurface = resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry });
	if (bundledSurface?.resolveConfigApiKey) return normalizeOptionalString(bundledSurface.resolveConfigApiKey(params.context));
	if (params.allowRuntimePluginLoad === false) return;
	return normalizeOptionalString(resolveProviderRuntimePlugin(params)?.resolveConfigApiKey?.(params.context));
}
async function sanitizeProviderReplayHistoryWithPlugin(params) {
	return await resolveProviderRuntimePlugin(params)?.sanitizeReplayHistory?.(params.context);
}
async function validateProviderReplayTurnsWithPlugin(params) {
	return await resolveProviderRuntimePlugin(params)?.validateReplayTurns?.(params.context);
}
function normalizeProviderToolSchemasWithPlugin(params) {
	return (params.allowRuntimePluginLoad === false ? params.runtimeHandle?.plugin ?? resolveLoadedProviderRuntimePlugin(params) : ensureProviderRuntimePluginHandle(params).plugin)?.normalizeToolSchemas?.(params.context) ?? void 0;
}
function inspectProviderToolSchemasWithPlugin(params) {
	return (params.allowRuntimePluginLoad === false ? params.runtimeHandle?.plugin ?? resolveLoadedProviderRuntimePlugin(params) : ensureProviderRuntimePluginHandle(params).plugin)?.inspectToolSchemas?.(params.context) ?? void 0;
}
function resolveProviderReasoningOutputModeWithPlugin(params) {
	const mode = ensureProviderRuntimePluginHandle({
		provider: params.provider,
		modelId: params.context.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		runtimeHandle: params.runtimeHandle
	}).plugin?.resolveReasoningOutputMode?.(params.context);
	return mode === "native" || mode === "tagged" ? mode : void 0;
}
function resolveProviderStreamFn(params) {
	return (params.allowRuntimePluginLoad === false ? resolveLoadedProviderRuntimePlugin(params) : resolveProviderRuntimePlugin(params))?.createStreamFn?.(params.context) ?? void 0;
}
function resolveProviderTransportTurnStateWithPlugin(params) {
	const plugin = params.runtimeHandle ? ensureProviderRuntimePluginHandle(params).plugin : params.allowRuntimePluginLoad === false ? resolveLoadedProviderRuntimePlugin(params) : resolveProviderRuntimePlugin(params);
	const turnState = plugin?.resolveTransportTurnState?.(params.context) ?? void 0;
	if (params.context.transport !== "websocket") return turnState;
	const legacyPolicy = plugin?.resolveWebSocketSessionPolicy?.(params.context);
	if (!legacyPolicy) return turnState;
	return {
		...turnState,
		websocket: {
			...legacyPolicy,
			...turnState?.websocket
		}
	};
}
async function prepareProviderRuntimeAuth(params) {
	const prepareRuntimeAuth = resolveProviderRuntimePlugin(params)?.prepareRuntimeAuth;
	if (!prepareRuntimeAuth) return;
	const preparedInput = unwrapSecretSentinelsForProviderEgress(params.context.apiKey, "provider runtime auth exchange");
	return await prepareRuntimeAuth({
		...params.context,
		apiKey: preparedInput
	});
}
async function resolveProviderUsageAuthWithPlugin(params) {
	const plugin = resolveProviderRuntimePlugin(params);
	if (!plugin?.resolveUsageAuth) return;
	const result = await plugin.resolveUsageAuth(params.context);
	if (!result) return;
	return result;
}
async function resolveProviderUsageSnapshotWithPlugin(params) {
	const providerHook = resolveProviderRuntimePlugin(params)?.fetchUsageSnapshot;
	if (providerHook) {
		const snapshot = await providerHook(params.context);
		if (snapshot != null) return snapshot;
	}
	if (params.provider === params.context.provider) return;
	const harness = getRegisteredAgentHarness(params.provider)?.harness;
	if (!harness) {
		const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState() ?? process.cwd();
		const { loadAgentRuntimePluginRegistryHandle } = await import("./runtime-plugins-CGNNJg_P.js");
		const { ensureSelectedAgentHarnessPlugin } = await import("./runtime-plugin-D6jV95uB.js");
		const pluginRegistry = loadAgentRuntimePluginRegistryHandle({
			config: params.config,
			workspaceDir,
			selections: [{
				provider: params.context.provider,
				modelId: "",
				runtime: params.provider
			}]
		});
		return await withPluginRuntimeRegistryScope(pluginRegistry, async () => {
			await ensureSelectedAgentHarnessPlugin({
				provider: params.context.provider,
				modelId: "",
				config: params.config,
				agentHarnessId: params.provider,
				workspaceDir,
				pluginRegistry
			});
			return await getRegisteredAgentHarness(params.provider)?.harness.fetchUsageSnapshot?.(params.context);
		});
	}
	return await harness?.fetchUsageSnapshot?.(params.context);
}
/** Lists provider plugins that own the complete usage auth + fetch lifecycle. */
function listProviderUsagePluginDescriptors(params) {
	const descriptors = /* @__PURE__ */ new Map();
	for (const contract of resolveUsageHookProviderPluginContracts(params)) for (const declaredProviderId of contract.providerIds) {
		const provider = normalizeProviderId(declaredProviderId);
		if (!provider || descriptors.has(provider)) continue;
		descriptors.set(provider, {
			provider,
			displayName: providerUsageLabel(provider) ?? provider
		});
	}
	return [...descriptors.values()].toSorted((a, b) => a.provider.localeCompare(b.provider));
}
function classifyProviderFailoverSignalWithPlugin(params) {
	const plugins = resolveProviderPluginsForScopedHook(params);
	for (const plugin of plugins) {
		if (plugin.matchesContextOverflowError?.(params.context)) return "context_overflow";
		const reason = plugin.classifyFailoverReason?.(params.context);
		if (reason) return reason;
	}
}
function resolveProviderPluginsForScopedHook(params) {
	if (!params.provider) return resolveProviderPluginsForHooks(params);
	const plugin = resolveProviderHookPlugin({
		...params,
		provider: params.provider
	});
	if (plugin) return [plugin];
	if (hasStructuredFailoverDescriptor(params.context)) return [];
	return resolveProviderPluginsForHooks(params);
}
function hasStructuredFailoverDescriptor(context) {
	return context.status !== void 0 || context.code !== void 0 || context.errorType !== void 0;
}
function formatProviderAuthProfileApiKeyWithPlugin(params) {
	return resolveProviderRuntimePlugin(params)?.formatApiKey?.(params.context);
}
async function loginProviderOAuthWithPlugin(params) {
	const ownership = resolveProviderRefOwnership(params);
	const loginOAuth = resolveProviderRuntimePlugin(params)?.loginOAuth;
	if (!loginOAuth) return { status: ownership.status === "unowned" ? "unowned" : "configured-unavailable" };
	return {
		status: "available",
		credentials: await loginOAuth(params.context)
	};
}
async function resolveProviderOAuthCredentialWithPlugin(params) {
	const ownership = resolveProviderRefOwnership(params);
	const plugin = resolveProviderRuntimePlugin(params);
	if (!plugin) return { status: ownership.status === "unowned" ? "unowned" : "configured-unavailable" };
	let credential = params.credential;
	if (params.refresh) {
		const refreshOAuth = plugin.refreshOAuth;
		if (!refreshOAuth) return { status: "unhandled" };
		credential = await refreshOAuth(params.credential);
	}
	if (!credential) return { status: "unhandled" };
	const apiKey = plugin.formatApiKey?.(credential) ?? credential.access;
	if (typeof apiKey !== "string" || !apiKey) return { status: "unhandled" };
	return {
		status: "available",
		credential,
		apiKey
	};
}
async function refreshProviderOAuthCredentialWithPlugin(params) {
	return await resolveProviderRuntimePlugin(params)?.refreshOAuth?.(params.context);
}
async function buildProviderAuthDoctorHintWithPlugin(params) {
	return await resolveProviderRuntimePlugin(params)?.buildAuthDoctorHint?.(params.context);
}
function resolveProviderCacheTtlEligibility(params) {
	return resolveProviderRuntimePlugin(params)?.isCacheTtlEligible?.(params.context);
}
function resolveProviderModernModelRef(params) {
	return resolveProviderRuntimePlugin(params)?.isModernModelRef?.(params.context);
}
/** Returns provider-owned profile ids retired from generic credential resolution. */
function resolveProviderDeprecatedAuthProfileIds(params) {
	const metadataSnapshot = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	});
	return resolveProviderPolicySurface(params.provider, { manifestRegistry: metadataSnapshot?.manifestRegistry })?.deprecatedProfileIds ?? resolveLoadedProviderRuntimePlugin(params)?.deprecatedProfileIds ?? [];
}
function buildProviderMissingAuthMessageWithPlugin(params) {
	return resolveProviderRuntimePlugin(params)?.buildMissingAuthMessage?.(params.context) ?? void 0;
}
function buildProviderUnknownModelHintWithPlugin(params) {
	return resolveProviderRuntimePlugin(params)?.buildUnknownModelHint?.(params.context) ?? void 0;
}
function resolveProviderSyntheticAuthWithPlugin(params) {
	const providerRefs = resolveProviderHookRefs(params.provider, params.context.providerConfig, params.modelApi);
	const discoveryPluginIds = [...new Set(providerRefs.flatMap((provider) => resolveOwningPluginIdsForProviderRef({
		provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) ?? []))];
	const discoveryProvider = (discoveryPluginIds.length > 0 ? resolvePluginDiscoveryProvidersRuntime({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: discoveryPluginIds,
		discoveryEntriesOnly: true
	}) : []).find((provider) => matchesAnyProviderPluginRef(provider, providerRefs));
	if (typeof discoveryProvider?.resolveSyntheticAuth === "function") return discoveryProvider.resolveSyntheticAuth(params.context) ?? void 0;
	const runtimeResolved = resolveProviderRuntimePlugin({
		...params,
		applyAutoEnable: false
	})?.resolveSyntheticAuth?.(params.context);
	if (runtimeResolved) return runtimeResolved;
	for (const providerRef of providerRefs) {
		if (normalizeProviderId(providerRef) === normalizeProviderId(params.provider)) continue;
		const runtimeProviderResolved = resolveProviderRuntimePlugin({
			...params,
			provider: providerRef,
			applyAutoEnable: false
		})?.resolveSyntheticAuth?.(params.context);
		if (runtimeProviderResolved) return runtimeProviderResolved;
	}
	if (providerRefs.length === 1) return resolvePluginDiscoveryProvidersRuntime({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		discoveryEntriesOnly: true,
		includeSyntheticAuthProviders: true
	}).find((provider) => matchesAnyProviderPluginRef(provider, providerRefs))?.resolveSyntheticAuth?.(params.context);
}
function resolveExternalAuthProfilesWithPlugins(params) {
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	const env = params.env ?? process.env;
	const config = params.config ?? {};
	const currentMetadataSnapshot = getCurrentPluginMetadataSnapshot({
		env,
		...params.config ? { config } : { requireDefaultDiscoveryContext: true },
		...workspaceDir ? { workspaceDir } : { allowWorkspaceScopedSnapshot: true }
	});
	const { manifestRegistry } = currentMetadataSnapshot ?? resolvePluginMetadataSnapshot({
		config,
		workspaceDir,
		env
	});
	if (currentMetadataSnapshot && !manifestRegistry.plugins.some((plugin) => plugin.contracts?.externalAuthProviders?.length)) return [];
	const externalAuthPluginIds = resolveExternalAuthProfileProviderPluginIds({
		config: params.config,
		workspaceDir,
		env,
		manifestRegistry
	});
	if (externalAuthPluginIds.length === 0) return [];
	const matches = [];
	for (const plugin of resolveProviderPluginsForHooks({
		...params,
		workspaceDir,
		env,
		onlyPluginIds: externalAuthPluginIds
	})) {
		const profiles = plugin.resolveExternalAuthProfiles?.(params.context);
		if (!profiles || profiles.length === 0) continue;
		matches.push(...profiles);
	}
	return matches;
}
function shouldDeferProviderSyntheticProfileAuthWithPlugin(params) {
	const providerRefs = resolveProviderHookRefs(params.provider, params.context.providerConfig, params.modelApi);
	for (const providerRef of providerRefs) {
		const resolved = resolveProviderRuntimePlugin({
			...params,
			provider: providerRef
		})?.shouldDeferSyntheticProfileAuth?.(params.context);
		if (resolved !== void 0) return resolved;
	}
}
async function augmentModelCatalogWithProviderPlugins(params) {
	const supplemental = [];
	for (const plugin of resolveProviderPluginsForCatalogHooks(params)) {
		const next = await plugin.augmentModelCatalog?.(params.context);
		if (!next || next.length === 0) continue;
		supplemental.push(...next);
	}
	return supplemental;
}
//#endregion
export { resolveProviderTransportTurnStateWithPlugin as A, resolveProviderModernModelRef as C, resolveProviderSyntheticAuthWithPlugin as D, resolveProviderStreamFn as E, shouldDeferProviderSyntheticProfileAuthWithPlugin as F, shouldPreferProviderRuntimeResolvedModel as I, transformProviderSystemPrompt as L, resolveProviderUsageSnapshotWithPlugin as M, runProviderDynamicModel as N, resolveProviderSystemPromptContribution as O, sanitizeProviderReplayHistoryWithPlugin as P, validateProviderReplayTurnsWithPlugin as R, resolveProviderDeprecatedAuthProfileIds as S, resolveProviderReasoningOutputModeWithPlugin as T, prepareProviderRuntimeAuth as _, buildProviderUnknownModelHintWithPlugin as a, resolveProviderCacheTtlEligibility as b, inspectProviderToolSchemasWithPlugin as c, normalizeProviderConfigWithPlugin as d, normalizeProviderModelIdWithPlugin as f, prepareProviderDynamicModel as g, normalizeProviderTransportWithPlugin as h, buildProviderMissingAuthMessageWithPlugin as i, resolveProviderUsageAuthWithPlugin as j, resolveProviderTextTransforms as k, listProviderUsagePluginDescriptors as l, normalizeProviderToolSchemasWithPlugin as m, augmentModelCatalogWithProviderPlugins as n, classifyProviderFailoverSignalWithPlugin as o, normalizeProviderResolvedModelWithPlugin as p, buildProviderAuthDoctorHintWithPlugin as r, formatProviderAuthProfileApiKeyWithPlugin as s, applyProviderResolvedTransportWithPlugin as t, loginProviderOAuthWithPlugin as u, refreshProviderOAuthCredentialWithPlugin as v, resolveProviderOAuthCredentialWithPlugin as w, resolveProviderConfigApiKeyWithPlugin as x, resolveExternalAuthProfilesWithPlugins as y };
