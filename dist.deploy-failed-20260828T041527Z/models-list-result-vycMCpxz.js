import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import "./model-ref-shared-D4yx0hwT.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-DI1_0gqL.js";
import { c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { i as resolveModelCatalogIdentityKey, n as openAIModelCatalogRoutePolicy } from "./openai-model-routes-rndVcpg7.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Cj3P99a_.js";
import "./config-B_0xOnKq.js";
import { t as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-BVMJbn_l.js";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-Rrd1VaX1.js";
import "./workspace-DJ__UUS2.js";
import { t as augmentModelCatalogWithAgentHarness } from "./model-catalog-BlDLqKO_.js";
import { t as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-Cl1zepED.js";
import { p as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-DRxNQEhr.js";
import { a as resolveExternalCliAuthScopeFromConfig } from "./external-cli-discovery-kohNMVnn.js";
import { a as hasSyntheticLocalProviderAuthConfig } from "./model-auth-provider-config-6V9HXTpM.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-BvpvPrfG.js";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-DHZkyDhz.js";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-CugBJIqO.js";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-0m0xt0BZ.js";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-BBUsQPyl.js";
import { n as readPreparedCatalog, t as loadDeferredCatalog } from "./server-model-catalog-auth-DCNJBYb7.js";
import { n as loadPreparedModelCatalogSnapshotForBrowse, r as modelCatalogBrowseRequiresFullDiscovery, t as buildProviderConfigModelCatalogForBrowse } from "./model-catalog-browse-BPp0rpW7.js";
import { n as projectModelCatalogEntryForRoute, r as resolveConfiguredModelCatalogOverrides, t as findModelCatalogRouteDonor } from "./model-catalog-route-D1rTnqax.js";
import { n as resolveLogicalVisibleModelCatalog, t as resolveLogicalModelCatalogEntryState } from "./model-catalog-visibility-Dyd2-OVW.js";
import { t as resolveModelProviderCapabilities } from "./model-provider-capabilities-BS1ADwSu.js";
//#region src/gateway/server-methods/models-list-auth-resolver.ts
function listEnabledSyntheticAuthProviderRefs(metadataSnapshot, config) {
	return metadataSnapshot.plugins.filter((plugin) => isManifestPluginAvailableForControlPlane({
		snapshot: metadataSnapshot,
		plugin,
		config
	})).flatMap((plugin) => plugin.syntheticAuthRefs ?? []);
}
function createModelsListAuthResolver(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	return createModelAuthAvailabilityResolver({
		cfg: params.cfg,
		authStore: params.preparedAuthStore,
		agentDir,
		workspaceDir: params.workspaceDir,
		env: process.env,
		metadataSnapshot: params.metadataSnapshot,
		preparedRuntimeAuthModes: params.preparedRuntimeAuthModes,
		preparedRuntimeAuthMaterializations: params.preparedRuntimeAuthMaterializations,
		skipSetupProviderFallback: true,
		syntheticAuthProviderRefs: listEnabledSyntheticAuthProviderRefs(params.metadataSnapshot, params.cfg),
		externalCliProviderIds: resolveExternalCliAuthScopeFromConfig(params.cfg)?.providerIds ?? [],
		preparedRuntimeAuthStore: params.preparedAuthStore,
		routeResolverFactory: params.routeResolverFactory
	});
}
//#endregion
//#region src/gateway/server-methods/models-list-configured-static.ts
function includeConfiguredStaticCatalogEntries(params) {
	if (!params.enabled || !params.snapshot.staticEntries?.length) return [...params.snapshot.entries];
	const policy = createModelVisibilityPolicy({
		cfg: params.cfg,
		catalog: [...params.snapshot.entries],
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: params.defaultModel,
		agentId: params.agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: params.metadataSnapshot.plugins
	});
	const configuredKeys = new Set([...policy.configuredKeys].map((key) => {
		const separator = key.indexOf("/");
		return separator > 0 ? resolveModelCatalogIdentityKey({
			provider: key.slice(0, separator),
			id: key.slice(separator + 1)
		}) : key;
	}));
	const catalog = [...params.snapshot.entries];
	const seen = new Set(catalog.map(resolveModelCatalogIdentityKey));
	for (const entry of params.snapshot.staticEntries) {
		const key = resolveModelCatalogIdentityKey(entry);
		if (!seen.has(key) && configuredKeys.has(key)) {
			seen.add(key);
			catalog.push(entry);
		}
	}
	return catalog;
}
//#endregion
//#region src/gateway/server-methods/models-list-harness-catalog.ts
async function prepareModelsListHarnessCatalog(params) {
	const defaultModel = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const snapshot = params.allowHarnessDiscovery ? await augmentModelCatalogWithAgentHarness({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir ?? resolveAgentDir(params.cfg, params.agentId),
		workspaceDir: params.workspaceDir,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		snapshot: params.snapshot,
		onError: params.onError
	}) : params.snapshot;
	return {
		snapshot,
		defaultModel,
		catalog: includeConfiguredStaticCatalogEntries({
			...params,
			snapshot,
			defaultModel,
			enabled: params.view === "configured"
		})
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-public-projection.ts
/** Keeps concrete route, auth, cost, and provider parameters out of public model rows. */
function buildPublicModelProjection(entry) {
	const contextWindow = asPositiveSafeInteger(entry.contextWindow);
	return {
		id: entry.id,
		name: entry.name,
		provider: entry.provider,
		...entry.alias ? { alias: entry.alias } : {},
		...contextWindow ? { contextWindow } : {},
		...entry.contextWindows ? { contextWindows: entry.contextWindows } : {},
		...entry.contextWindowDefault ? { contextWindowDefault: entry.contextWindowDefault } : {},
		...typeof entry.reasoning === "boolean" ? { reasoning: entry.reasoning } : {},
		...typeof entry.compat?.supportsTools === "boolean" ? { supportsTools: entry.compat.supportsTools } : {}
	};
}
function resolveModelChoiceAgentRuntime(params) {
	const harnessPolicy = resolveAgentHarnessPolicy({
		provider: params.entry.provider,
		modelId: params.entry.id,
		modelApi: params.entry.api,
		modelBaseUrl: params.entry.baseUrl,
		config: params.cfg,
		agentId: params.agentId
	});
	if (harnessPolicy.runtime === "auto") return;
	return projectWorkerPlacementAgentRuntime({
		id: harnessPolicy.runtime,
		source: harnessPolicy.runtimeSource ?? "implicit"
	});
}
//#endregion
//#region src/gateway/server-methods/models-list-result.ts
let loggedSlowModelsListCatalog = false;
function resolveModelsListView(params) {
	const view = params.view;
	return view === "configured" || view === "provider-config" || view === "all" ? view : "default";
}
function resolveLegacyEntryAvailability(params) {
	if (params.primaryAvailability === true) return true;
	let available = params.primaryAvailability;
	const runtimeProvider = resolveCliRuntimeExecutionProvider({
		provider: params.entry.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: params.entry.id,
		metadataSnapshot: params.metadataSnapshot
	});
	if (runtimeProvider && normalizeProviderId(runtimeProvider) !== normalizeProviderId(params.entry.provider)) {
		const runtimeAvailable = params.authResolver.resolveProviderAuthAvailability(runtimeProvider);
		if (runtimeAvailable === true) return true;
		if (available === false && runtimeAvailable === void 0) available = void 0;
	}
	return available;
}
function createModelsListEntryEvaluator(params) {
	const pending = /* @__PURE__ */ new Map();
	return (entry, routeVariants = [entry]) => {
		const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
		const cacheKey = resolveModelCatalogIdentityKey(entry);
		const cached = pending.get(cacheKey);
		if (cached) return cached;
		const next = Promise.resolve().then(() => {
			const evaluation = params.authResolver.evaluateModelAuth(entry.provider, {
				modelId: identity?.id ?? entry.id,
				...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
				...params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {},
				observedRoutes: routeVariants.map((variant) => ({
					api: variant.api,
					baseUrl: variant.baseUrl
				}))
			});
			const resolved = evaluation.routeResolution === null && normalizeProviderId(entry.provider) !== "openai" ? {
				...evaluation,
				availability: resolveLegacyEntryAvailability({
					authResolver: params.authResolver,
					entry,
					primaryAvailability: evaluation.availability,
					cfg: params.cfg,
					agentId: params.agentId,
					metadataSnapshot: params.metadataSnapshot
				})
			} : evaluation;
			const provider = normalizeProviderId(entry.provider);
			return params.providerOutcomes?.some((outcome) => outcome.status === "auth-rejected" && normalizeProviderId(outcome.provider) === provider && (outcome.profileId === void 0 || outcome.profileId === resolved.selectedProfileId)) ? {
				...resolved,
				availability: false
			} : resolved;
		});
		pending.set(cacheKey, next);
		return next;
	};
}
/** Configured dynamic-catalog providers that omit explicit model inventory. */
function listConfiguredRuntimeDiscoveryProviderIds(cfg, metadataSnapshot) {
	const ids = /* @__PURE__ */ new Set();
	const providers = cfg.models?.providers;
	if (!providers || typeof providers !== "object" || !metadataSnapshot) return ids;
	const dynamicProviders = /* @__PURE__ */ new Set();
	for (const plugin of metadataSnapshot.plugins) for (const [providerRaw, mode] of Object.entries(plugin.modelCatalog?.discovery ?? {})) {
		const providerId = normalizeProviderId(providerRaw);
		if (providerId && (mode === "runtime" || mode === "refreshable")) dynamicProviders.add(providerId);
	}
	for (const [providerRaw, provider] of Object.entries(providers)) {
		const providerId = normalizeProviderId(providerRaw);
		if (providerId && dynamicProviders.has(providerId) && !Array.isArray(provider?.models)) ids.add(providerId);
	}
	return ids;
}
function resolveProviderConfigInventoryEntries(params) {
	const canonicalByKey = /* @__PURE__ */ new Map();
	for (const entry of params.canonicalEntries) {
		const key = resolveModelCatalogIdentityKey(entry);
		if (!canonicalByKey.has(key)) canonicalByKey.set(key, entry);
	}
	const seen = /* @__PURE__ */ new Set();
	const inventory = [];
	for (const authoredEntry of params.authoredEntries) {
		const key = resolveModelCatalogIdentityKey(authoredEntry);
		if (seen.has(key)) continue;
		seen.add(key);
		inventory.push(canonicalByKey.get(key) ?? authoredEntry);
	}
	if (params.discoveryOnlyProviderIds) for (const canonicalEntry of params.canonicalEntries) {
		const key = resolveModelCatalogIdentityKey(canonicalEntry);
		if (seen.has(key)) continue;
		if (!params.discoveryOnlyProviderIds.has(normalizeProviderId(canonicalEntry.provider))) continue;
		seen.add(key);
		inventory.push(canonicalEntry);
	}
	return inventory;
}
/** Builds one per-agent, snapshot-scoped route projection for Gateway thinking metadata. */
function createGatewayAgentModelCatalogProjector(params) {
	const metadataSnapshot = params.metadataSnapshot;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId) ?? resolveDefaultAgentWorkspaceDir();
	const projectionCatalog = params.snapshot.routeVariants.length > 0 ? params.snapshot.routeVariants : params.snapshot.entries;
	const routeVariantsByKey = /* @__PURE__ */ new Map();
	for (const entry of projectionCatalog) {
		const key = resolveModelCatalogIdentityKey(entry);
		const variants = routeVariantsByKey.get(key) ?? [];
		variants.push(entry);
		routeVariantsByKey.set(key, variants);
	}
	const resolveRouteVariants = (entry) => routeVariantsByKey.get(resolveModelCatalogIdentityKey(entry)) ?? [entry];
	const logicalEntries = [];
	const logicalEntryKeys = /* @__PURE__ */ new Set();
	for (const entry of params.snapshot.entries) {
		const key = resolveModelCatalogIdentityKey(entry);
		if (!logicalEntryKeys.has(key)) {
			logicalEntryKeys.add(key);
			logicalEntries.push(entry);
		}
	}
	const authResolver = createModelsListAuthResolver({
		cfg: params.cfg,
		agentId: params.agentId,
		metadataSnapshot,
		preparedAuthStore: params.preparedAuthStore,
		preparedRuntimeAuthModes: params.preparedRuntimeAuthModes,
		preparedRuntimeAuthMaterializations: params.preparedRuntimeAuthMaterializations,
		workspaceDir,
		routeResolverFactory: params.routeResolverFactory
	});
	const evaluateEntry = createModelsListEntryEvaluator({
		cfg: params.cfg,
		agentId: params.agentId,
		authResolver,
		metadataSnapshot,
		providerOutcomes: params.snapshot.providerOutcomes,
		...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
		...params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {}
	});
	let projectedCatalog;
	return {
		evaluateEntry,
		metadataSnapshot,
		authStore: params.preparedAuthStore,
		authModes: params.preparedRuntimeAuthModes,
		authMaterializations: params.preparedRuntimeAuthMaterializations,
		projectCatalog: () => projectedCatalog ??= Promise.all(logicalEntries.map(async (entry) => {
			const routeVariants = resolveRouteVariants(entry);
			const state = resolveLogicalModelCatalogEntryState({
				entry,
				evaluation: await evaluateEntry(entry, routeVariants),
				routePolicy: openAIModelCatalogRoutePolicy
			});
			const overrides = resolveConfiguredModelCatalogOverrides({
				cfg: params.cfg,
				entry,
				policy: openAIModelCatalogRoutePolicy
			});
			const projected = projectModelCatalogEntryForRoute({
				entry,
				projection: state.routeProjection,
				catalog: routeVariants,
				...overrides ? { overrides } : {}
			});
			if (state.routeProjection.kind !== "selected") return projected;
			const donor = findModelCatalogRouteDonor({
				entry,
				route: state.routeProjection.route,
				policy: openAIModelCatalogRoutePolicy,
				catalog: routeVariants
			});
			if (donor && Object.hasOwn(donor, "compat")) projected.compat = donor.compat;
			if (donor && Object.hasOwn(donor, "params")) projected.params = donor.params;
			return projected;
		}))
	};
}
async function buildPublicModelsListEntries(params) {
	return Promise.all(params.catalog.map(async (entry) => {
		const configuredEntry = params.configuredEntriesByKey.get(modelKey(entry.provider, entry.id));
		const alias = configuredEntry?.aliases.at(-1);
		const publicEntry = configuredEntry?.aliasDisabled ? {
			...entry,
			alias: void 0
		} : alias && alias !== entry.alias ? {
			...entry,
			alias
		} : entry;
		const evaluation = await params.evaluateEntry(entry);
		const syntheticLocalAvailable = evaluation.availability === void 0 && evaluation.routeResolution === null && normalizeProviderId(entry.provider) !== "openai" && hasSyntheticLocalProviderAuthConfig({
			cfg: params.cfg,
			provider: entry.provider
		});
		const available = evaluation.availability ?? (syntheticLocalAvailable ? true : void 0);
		const capabilityProvider = params.apiKeyCapabilities?.resolveProvider(entry.provider);
		const agentRuntime = resolveModelChoiceAgentRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			entry
		});
		const thinkingProfile = typeof publicEntry.reasoning !== "boolean" ? void 0 : resolveGatewayModelThinkingProfile({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: entry.provider,
			model: entry.id,
			modelCatalog: params.thinkingCatalog,
			configuredReasoning: publicEntry.configuredReasoning ?? publicEntry.reasoning,
			thinkingPolicyProvider: publicEntry.thinkingPolicyProvider
		});
		return {
			...buildPublicModelProjection(publicEntry),
			...configuredEntry?.tags.size ? { tags: [...configuredEntry.tags] } : {},
			...agentRuntime ? { agentRuntime } : {},
			...thinkingProfile,
			...capabilityProvider && params.apiKeyCapabilities?.providers.has(capabilityProvider) ? { apiKeySupported: params.apiKeyCapabilities.providers.get(capabilityProvider) === true } : {},
			...params.includeInput && entry.input?.length ? { input: entry.input } : {},
			...params.preserveUnknownAvailability && available === void 0 ? {} : { available: available ?? false }
		};
	}));
}
function apiKeyProviderCapabilities(params) {
	const { capabilities, resolveProvider } = resolveModelProviderCapabilities({
		config: params.cfg,
		metadataSnapshot: params.metadataSnapshot,
		workspaceDir: params.workspaceDir
	});
	return {
		providers: new Map(capabilities.map(({ provider, apiKeySupported }) => [provider, apiKeySupported])),
		resolveProvider
	};
}
async function buildModelsListResult(params) {
	const initialConfig = params.context.getRuntimeConfig();
	const initialAgentId = normalizeAgentId(params.agentId ?? resolveDefaultAgentId(initialConfig));
	const view = resolveModelsListView(params.params);
	const preparedOnly = params.params.preparedOnly === true;
	const refresh = params.params.refresh === true;
	const preloadedCatalog = params.preloadedCatalog?.agentId === initialAgentId && preparedModelRuntimeConfigsMatch(params.preloadedCatalog.config, initialConfig) ? params.preloadedCatalog : void 0;
	let loadedSnapshot;
	let loadedReadOnly = true;
	let usedPreloadedCatalog = false;
	let catalogTimedOut = false;
	const handleCatalogTimeout = (timeoutMs) => {
		catalogTimedOut = true;
		if (loggedSlowModelsListCatalog) return;
		loggedSlowModelsListCatalog = true;
		params.context.logGateway.warn(`models.list catalog load exceeded ${timeoutMs}ms; using the prepared catalog when available`);
	};
	let snapshot = await loadPreparedModelCatalogSnapshotForBrowse({
		cfg: initialConfig,
		agentId: initialAgentId,
		view,
		preparedOnly,
		refresh,
		loadCatalog: async (loadParams) => {
			loadedReadOnly = loadParams.readOnly ?? true;
			if (preloadedCatalog && (loadedReadOnly || params.preloadedOnly && isPreparedModelCatalogFull(preloadedCatalog.snapshot))) {
				usedPreloadedCatalog = true;
				return preloadedCatalog.snapshot;
			}
			if (params.preloadedOnly) return {
				entries: [],
				routeVariants: []
			};
			loadedSnapshot = await loadDeferredCatalog(params.context, initialAgentId, {
				readOnly: loadedReadOnly,
				refreshAuth: refresh && loadedReadOnly,
				refreshFullCatalog: loadParams.refresh === true
			});
			return loadedSnapshot;
		},
		onTimeout: handleCatalogTimeout
	});
	if (loadedSnapshot && loadedReadOnly && !preparedOnly && modelCatalogBrowseRequiresFullDiscovery({
		cfg: loadedSnapshot.config,
		agentId: loadedSnapshot.agentId,
		view
	})) {
		const escalationAgentId = loadedSnapshot.agentId;
		let escalationTimedOut = false;
		let fullSnapshot;
		const escalatedCatalog = await loadPreparedModelCatalogSnapshotForBrowse({
			cfg: loadedSnapshot.config,
			agentId: escalationAgentId,
			view,
			refresh,
			loadCatalog: async ({ readOnly }) => {
				fullSnapshot = await loadDeferredCatalog(params.context, escalationAgentId, {
					readOnly,
					refreshAuth: refresh && readOnly,
					refreshFullCatalog: refresh
				});
				return fullSnapshot;
			},
			timeoutFullDiscovery: true,
			onTimeout: (timeoutMs) => {
				escalationTimedOut = true;
				handleCatalogTimeout(timeoutMs);
			}
		});
		if (!escalationTimedOut && fullSnapshot) {
			if (!publishedModelCatalogOwnerMatchesAgent(fullSnapshot, escalationAgentId)) return { models: [] };
			loadedSnapshot = fullSnapshot;
			snapshot = escalatedCatalog;
		}
	}
	if (loadedSnapshot && params.agentId !== void 0 && !publishedModelCatalogOwnerMatchesAgent(loadedSnapshot, initialAgentId)) return { models: [] };
	const ownerSnapshot = loadedSnapshot ?? (preloadedCatalog && params.catalogProjector ? void 0 : await readPreparedCatalog(params.context, initialAgentId));
	if (catalogTimedOut && ownerSnapshot) snapshot = ownerSnapshot;
	const cfg = ownerSnapshot?.config ?? initialConfig;
	const agentId = ownerSnapshot?.agentId ?? initialAgentId;
	const workspaceDir = ownerSnapshot?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const preparedProjectionOwner = ownerSnapshot ?? params.catalogProjector;
	const metadataSnapshot = preparedProjectionOwner?.metadataSnapshot;
	const preparedAuthStore = ownerSnapshot?.authStore ?? params.catalogProjector?.authStore;
	if (!metadataSnapshot || !preparedAuthStore) throw new Error("Gateway model catalog owner omitted prepared metadata or auth state");
	const preparedCatalog = await prepareModelsListHarnessCatalog({
		cfg,
		agentId,
		agentDir: ownerSnapshot?.agentDir,
		workspaceDir,
		snapshot,
		view,
		metadataSnapshot,
		allowHarnessDiscovery: params.preloadedOnly !== true && !preparedOnly,
		onError: (error) => params.context.logGateway.debug(`models.list continuing without harness catalog: ${String(error)}`)
	});
	snapshot = preparedCatalog.snapshot;
	const { catalog, defaultModel } = preparedCatalog;
	const { routeVariants, providerOutcomes } = snapshot;
	const outcomeProjection = providerOutcomes?.length ? { providerOutcomes } : {};
	const preparedRuntimeAuthModes = preparedProjectionOwner?.authModes;
	const preparedRuntimeAuthMaterializations = preparedProjectionOwner?.authMaterializations;
	const capableProviders = params.params.includeProviderCapabilities === true ? apiKeyProviderCapabilities({
		cfg,
		metadataSnapshot,
		workspaceDir
	}) : void 0;
	const configuredEntriesByKey = resolveConfiguredModelEntries({
		cfg,
		agentId,
		defaultModel,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: metadataSnapshot.plugins
	}).byKey;
	if (view === "provider-config") {
		const sourceConfig = getRuntimeConfigSourceSnapshot() ?? cfg;
		const inventoryProjector = createGatewayAgentModelCatalogProjector({
			cfg,
			agentId,
			snapshot: {
				entries: resolveProviderConfigInventoryEntries({
					authoredEntries: buildProviderConfigModelCatalogForBrowse({
						cfg: sourceConfig,
						workspaceDir
					}),
					canonicalEntries: catalog,
					discoveryOnlyProviderIds: listConfiguredRuntimeDiscoveryProviderIds(sourceConfig, metadataSnapshot)
				}),
				routeVariants,
				...providerOutcomes?.length ? { providerOutcomes } : {}
			},
			metadataSnapshot,
			preparedAuthStore,
			preparedRuntimeAuthModes,
			preparedRuntimeAuthMaterializations,
			...params.routeResolverFactory ? { routeResolverFactory: params.routeResolverFactory } : {}
		});
		return {
			models: await buildPublicModelsListEntries({
				catalog: await inventoryProjector.projectCatalog(),
				thinkingCatalog: catalog,
				cfg,
				agentId,
				configuredEntriesByKey,
				evaluateEntry: inventoryProjector.evaluateEntry,
				includeInput: true,
				preserveUnknownAvailability: true,
				...capableProviders ? { apiKeyCapabilities: capableProviders } : {}
			}),
			...outcomeProjection
		};
	}
	const visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: metadataSnapshot?.plugins
	});
	const evaluateEntry = (usedPreloadedCatalog ? params.catalogProjector?.evaluateEntry : void 0) ?? createModelsListEntryEvaluator({
		cfg,
		agentId,
		authResolver: createModelsListAuthResolver({
			cfg,
			agentId,
			metadataSnapshot,
			preparedAuthStore,
			preparedRuntimeAuthModes,
			preparedRuntimeAuthMaterializations,
			workspaceDir,
			routeResolverFactory: params.routeResolverFactory
		}),
		metadataSnapshot,
		providerOutcomes
	});
	return {
		models: await buildPublicModelsListEntries({
			catalog: await resolveLogicalVisibleModelCatalog({
				cfg,
				catalog,
				defaultProvider: DEFAULT_PROVIDER,
				defaultModel,
				agentId,
				workspaceDir,
				view,
				policy: visibilityPolicy,
				routePolicy: openAIModelCatalogRoutePolicy,
				routeVariants,
				evaluateEntry: async (entry, variants) => {
					const evaluation = await evaluateEntry(entry, variants);
					const syntheticLocal = !(evaluation.routeResolution !== null) && normalizeProviderId(entry.provider) !== "openai" && evaluation.availability === void 0 && evaluation.evidence === "synthetic";
					return resolveLogicalModelCatalogEntryState({
						entry,
						evaluation,
						authBacked: evaluation.availability === true || syntheticLocal,
						routePolicy: openAIModelCatalogRoutePolicy
					});
				}
			}),
			thinkingCatalog: catalog,
			cfg,
			agentId,
			configuredEntriesByKey,
			evaluateEntry,
			...capableProviders ? { apiKeyCapabilities: capableProviders } : {}
		}),
		...outcomeProjection
	};
}
//#endregion
export { createGatewayAgentModelCatalogProjector as n, buildModelsListResult as t };
