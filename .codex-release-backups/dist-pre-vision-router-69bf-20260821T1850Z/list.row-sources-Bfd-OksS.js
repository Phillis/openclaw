import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as normalizeProviderIdForAuth, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { c as stripSelfProviderModelPrefix } from "./provider-model-id-normalization-DvssXFxG.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-poyRjWh_.js";
import { d as modelCatalogLogicalKey } from "./model-selection-shared-0DI3vxkL.js";
import "./defaults-CdX9UGcX.js";
import { n as openAIModelCatalogRoutePolicy } from "./openai-model-routes-oiuFxnRn.js";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-pzzTYlfq.js";
import { t as resolveBundledProviderPolicySurface } from "./provider-public-artifacts-CUyXoT9F.js";
import { i as shouldSuppressBuiltInModelFromManifest, r as shouldSuppressBuiltInModelCore } from "./model-suppression-CmRY7M_H.js";
import { t as canonicalizeModelCatalogProviderAlias } from "./provider-aliases-BpukLXru.js";
import { n as projectModelCatalogEntryForRoute, r as resolveConfiguredModelCatalogOverrides } from "./model-catalog-route-Cj6c_KQw.js";
//#region src/commands/models/list.local-url.ts
/** Local URL classifier for model provider status/list output. */
/** Returns true for loopback, wildcard, and mDNS local base URLs. */
const isLocalBaseUrl = (baseUrl) => {
	try {
		const host = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname).replace(/^\[|\]$/g, "");
		return host === "localhost" || isCanonicalDottedDecimalIPv4(host) && isLoopbackIpAddress(host) || host === "0.0.0.0" || host === "::" || host === "::1" || host.endsWith(".local");
	} catch {
		return false;
	}
};
//#endregion
//#region src/commands/models/list.model-projection.ts
const providerRuntimeModuleLoader = createLazyImportLoader(() => import("./provider-runtime-BUKNycQK.js"));
function toListRowInput$1(input) {
	const parsed = input?.filter((item) => item === "text" || item === "image" || item === "document");
	return parsed?.length ? parsed : ["text"];
}
function mergeNormalizedListRow(model, normalized) {
	return {
		...model,
		id: normalized.id,
		name: normalized.name,
		provider: normalized.provider,
		api: normalized.api ?? model.api,
		baseUrl: normalized.baseUrl ?? model.baseUrl,
		input: toListRowInput$1(normalized.input),
		contextWindow: normalized.contextWindow,
		contextTokens: normalized.contextTokens
	};
}
/** Projects one authored provider row while keeping full runtime loading optional. */
async function normalizeConfiguredProviderListRow(params) {
	const normalizationContext = {
		config: params.context.cfg,
		agentDir: params.context.agentDir,
		workspaceDir: params.context.workspaceDir,
		provider: params.model.provider,
		modelId: params.model.id,
		model: params.model
	};
	const policySurface = resolveBundledProviderPolicySurface(params.model.provider, { manifestRegistry: params.context.metadataSnapshot?.manifestRegistry });
	if (policySurface?.projectConfiguredModelRow) {
		const projected = policySurface.projectConfiguredModelRow(normalizationContext);
		if (projected === null) return params.model;
		if (projected !== void 0) return mergeNormalizedListRow(params.model, projected);
	}
	const { normalizeProviderResolvedModelWithPlugin } = await providerRuntimeModuleLoader.load();
	const normalized = normalizeProviderResolvedModelWithPlugin({
		provider: params.model.provider,
		config: params.context.cfg,
		workspaceDir: params.context.workspaceDir,
		pluginMetadataSnapshot: params.context.metadataSnapshot,
		context: normalizationContext
	});
	return normalized ? mergeNormalizedListRow(params.model, normalized) : params.model;
}
//#endregion
//#region src/commands/models/list.model-row.ts
/** Converts registry/catalog models into printable model-list rows. */
/** Builds a display row, preserving configured tags and alias metadata. */
function toModelRow(params) {
	const { model, key, tags, aliases = [], availableKeys, authAvailability, authAvailabilityAuthoritative = false } = params;
	if (!model) return {
		key,
		name: key,
		input: "-",
		contextWindow: null,
		local: null,
		available: null,
		tags: [...tags, "missing"],
		missing: true
	};
	const input = model.input?.join("+") || "-";
	const local = isLocalBaseUrl(model.baseUrl ?? "");
	const modelIsAvailable = local || (availableKeys?.has(modelKey(model.provider, model.id)) ?? false);
	const available = authAvailabilityAuthoritative ? authAvailability ?? null : availableKeys !== void 0 ? modelIsAvailable : authAvailability ?? (modelIsAvailable ? true : null);
	const aliasTags = aliases.length > 0 ? [`alias:${aliases.join(",")}`] : [];
	const mergedTags = new Set(tags);
	if (aliasTags.length > 0) {
		for (const tag of mergedTags) if (tag === "alias" || tag.startsWith("alias:")) mergedTags.delete(tag);
		for (const tag of aliasTags) mergedTags.add(tag);
	}
	return {
		key,
		name: model.name || model.id,
		input,
		contextWindow: model.contextWindow ?? null,
		...typeof model.contextTokens === "number" ? { contextTokens: model.contextTokens } : {},
		local,
		available,
		tags: Array.from(mergedTags),
		missing: false
	};
}
//#endregion
//#region src/commands/models/list.rows.ts
/** Row builders used by `openclaw models list` source orchestration. */
const modelCatalogModuleLoader = createLazyImportLoader(() => import("./prepared-model-catalog-BnhcKv7r.js"));
const scopedModelCatalogModuleLoader = createLazyImportLoader(() => import("./list.scoped-catalog-BII_dZhh.js"));
const modelResolverModuleLoader = createLazyImportLoader(() => import("./model-D3tTUTet.js"));
function loadPreparedModelCatalogModule() {
	return modelCatalogModuleLoader.load();
}
function loadScopedModelCatalogModule() {
	return scopedModelCatalogModuleLoader.load();
}
function loadModelResolverModule() {
	return modelResolverModuleLoader.load();
}
function matchesProviderFilter(context, provider) {
	const providerFilter = context.filter.provider;
	if (!providerFilter) return true;
	return normalizeProviderId(canonicalizeModelCatalogProviderAlias(provider, {
		cfg: context.cfg,
		metadataSnapshot: context.metadataSnapshot
	})) === providerFilter;
}
function matchesRowFilter(context, model) {
	if (!matchesProviderFilter(context, model.provider)) return false;
	if (context.filter.local && !isLocalBaseUrl(model.baseUrl ?? "")) return false;
	return true;
}
function resolveCatalogLogicalKey(model) {
	return openAIModelCatalogRoutePolicy.resolveIdentity(model)?.key ?? modelCatalogLogicalKey(model);
}
function createModelCatalogLogicalRouteIndex(catalog) {
	const index = /* @__PURE__ */ new Map();
	for (const entry of catalog) {
		const key = resolveCatalogLogicalKey(entry);
		const variants = index.get(key) ?? [];
		variants.push(entry);
		index.set(key, variants);
	}
	return index;
}
function resolveCatalogLogicalRoutes(model, routeIndex) {
	return routeIndex?.get(resolveCatalogLogicalKey(model));
}
function toModelAuthRef(model, routeIndex) {
	const identity = openAIModelCatalogRoutePolicy.resolveIdentity(model);
	const observedRoutes = resolveCatalogLogicalRoutes(model, routeIndex)?.map((entry) => ({
		api: entry.api,
		baseUrl: entry.baseUrl
	}));
	return {
		modelId: identity?.id ?? model.id,
		...observedRoutes && observedRoutes.length > 0 ? { observedRoutes } : {
			api: model.api,
			baseUrl: model.baseUrl
		}
	};
}
function toCatalogProjectionEntry(model) {
	return {
		id: model.id,
		name: model.name,
		provider: model.provider,
		...typeof model.api === "string" ? { api: model.api } : {},
		...model.baseUrl !== void 0 ? { baseUrl: model.baseUrl } : {},
		...typeof model.contextWindow === "number" ? { contextWindow: model.contextWindow } : {},
		...typeof model.contextTokens === "number" ? { contextTokens: model.contextTokens } : {},
		...model.input !== void 0 ? { input: model.input } : {}
	};
}
function hasSameCatalogRoute(left, right) {
	return left.api === right.api && left.baseUrl === right.baseUrl;
}
function projectListRowModel(params) {
	const projection = params.evaluation.routeResolution === null ? { kind: "unmanaged" } : params.evaluation.selectedRoute ? {
		kind: "selected",
		route: params.evaluation.selectedRoute,
		policy: openAIModelCatalogRoutePolicy
	} : {
		kind: "unresolved",
		policy: openAIModelCatalogRoutePolicy
	};
	const entry = toCatalogProjectionEntry(params.model);
	const overrides = resolveConfiguredModelCatalogOverrides({
		cfg: params.cfg,
		entry,
		policy: openAIModelCatalogRoutePolicy
	});
	const routeVariants = resolveCatalogLogicalRoutes(entry, params.routeIndex);
	const projected = projectModelCatalogEntryForRoute({
		entry,
		projection,
		...routeVariants ? { catalog: routeVariants } : {},
		...overrides ? { overrides } : {}
	});
	return {
		...params.model,
		name: projected.name,
		api: projected.api,
		baseUrl: projected.baseUrl,
		input: projected.input?.filter((item) => item === "text" || item === "image" || item === "document"),
		contextWindow: projected.contextWindow,
		contextTokens: projected.contextTokens
	};
}
async function buildRow(params) {
	const configured = params.configuredEntry ?? params.context.configuredByKey.get(params.key);
	const authRef = toModelAuthRef(params.model, params.routeIndex);
	const authEvaluation = params.authEvaluation ?? params.context.authIndex.evaluateModelAuth(params.model.provider, authRef);
	return toModelRow({
		model: projectListRowModel({
			model: params.model,
			evaluation: authEvaluation,
			cfg: params.context.cfg,
			...params.routeIndex ? { routeIndex: params.routeIndex } : {}
		}),
		key: params.key,
		tags: configured ? Array.from(configured.tags) : [],
		aliases: configured?.aliases ?? [],
		availableKeys: params.context.availableKeys,
		authAvailability: authEvaluation.availability,
		authAvailabilityAuthoritative: params.allowAuthAvailabilityOverride === true || normalizeProviderIdForAuth(params.model.provider) === "openai" || authEvaluation.routeResolution !== null
	});
}
function shouldSuppressListModel(params) {
	if (params.context.skipRuntimeModelSuppression) return shouldSuppressBuiltInModelFromManifest({
		provider: params.model.provider,
		id: params.model.id,
		baseUrl: params.model.baseUrl,
		config: params.context.cfg
	});
	return shouldSuppressBuiltInModelCore({
		provider: params.model.provider,
		id: params.model.id,
		baseUrl: params.model.baseUrl,
		config: params.context.cfg
	});
}
async function appendVisibleRow(params) {
	if (params.seenKeys?.has(params.key)) return false;
	const model = params.normalizeWithProviderPlugin ? await normalizeConfiguredProviderListRow({
		model: params.model,
		context: params.context
	}) : params.model;
	const authEvaluation = params.authEvaluation ?? params.context.authIndex.evaluateModelAuth(model.provider, toModelAuthRef(model, params.routeIndex));
	const projectedModel = projectListRowModel({
		model,
		evaluation: authEvaluation,
		cfg: params.context.cfg,
		...params.routeIndex ? { routeIndex: params.routeIndex } : {}
	});
	if (!matchesRowFilter(params.context, projectedModel)) return false;
	if (!params.skipSuppression && shouldSuppressListModel({
		model: projectedModel,
		context: params.context
	})) return false;
	params.rows.push(await buildRow({
		model,
		key: params.key,
		context: params.context,
		...params.routeIndex ? { routeIndex: params.routeIndex } : {},
		authEvaluation,
		allowAuthAvailabilityOverride: params.allowAuthAvailabilityOverride,
		...params.configuredEntry ? { configuredEntry: params.configuredEntry } : {}
	}));
	params.seenKeys?.add(params.key);
	return true;
}
function resolveConfiguredModelInput(params) {
	const input = Array.isArray(params.model.input) ? params.model.input.filter((item) => item === "text" || item === "image") : [];
	return input.length > 0 ? input : ["text"];
}
function toConfiguredProviderListModel(params) {
	return {
		provider: params.provider,
		id: params.model.id,
		name: params.model.name ?? params.model.id,
		api: params.model.api ?? params.providerConfig.api,
		baseUrl: params.model.baseUrl ?? params.providerConfig.baseUrl,
		input: resolveConfiguredModelInput({ model: params.model }),
		contextWindow: params.model.contextWindow ?? 2e5,
		contextTokens: params.model.contextTokens
	};
}
function toListRowInput(input) {
	const parsed = input?.filter((item) => item === "text" || item === "image" || item === "document");
	return parsed?.length ? parsed : ["text"];
}
function toPreparedCatalogListModel(row) {
	return {
		provider: row.provider,
		id: row.id,
		name: row.name,
		api: row.api,
		baseUrl: row.baseUrl,
		input: toListRowInput(row.input),
		contextWindow: row.contextWindow ?? 2e5,
		contextTokens: row.contextTokens
	};
}
function shouldListConfiguredProviderModel(params) {
	return params.providerConfig.api !== void 0 || params.model.api !== void 0;
}
function findConfiguredProviderModel(params) {
	const providerConfig = params.cfg.models?.providers?.[params.provider];
	const configuredModel = providerConfig?.models?.find((model) => model.id === params.modelId);
	if (!providerConfig || !configuredModel) return;
	return toConfiguredProviderListModel({
		provider: params.provider,
		providerConfig,
		model: configuredModel
	});
}
function toFallbackConfiguredListModel(entry, cfg, catalogEntry) {
	return findConfiguredProviderModel({
		cfg,
		provider: entry.ref.provider,
		modelId: entry.ref.model
	}) ?? (catalogEntry ? toPreparedCatalogListModel(catalogEntry) : void 0) ?? {
		provider: entry.ref.provider,
		id: entry.ref.model,
		name: entry.ref.model,
		input: ["text"],
		contextWindow: 2e5
	};
}
/** Loads the committed catalog generation shared by every model-list row source. */
async function loadListModelCatalogSnapshot(context) {
	const workspaceDir = context.workspaceDir ?? context.metadataSnapshot?.workspaceDir;
	if (context.providerDiscoveryProviderIds) {
		const { loadScopedListModelCatalogSnapshot } = await loadScopedModelCatalogModule();
		return loadScopedListModelCatalogSnapshot({
			cfg: context.cfg,
			...context.agentId ? { agentId: context.agentId } : {},
			agentDir: context.agentDir,
			inheritedAuthDir: context.inheritedAuthDir ?? context.agentDir,
			...workspaceDir ? { workspaceDir } : {},
			providerIds: context.providerDiscoveryProviderIds,
			runtimeProviderIds: context.providerRuntimeDiscoveryProviderIds,
			manifestFallbackProviderIds: context.providerManifestFallbackProviderIds,
			configuredKeys: [...context.configuredByKey.keys()],
			...context.metadataSnapshot ? { metadataSnapshot: context.metadataSnapshot } : {}
		});
	}
	const { loadPreparedModelCatalogSnapshot } = await loadPreparedModelCatalogModule();
	return loadPreparedModelCatalogSnapshot({
		config: context.cfg,
		...context.agentId ? { agentId: context.agentId } : {},
		agentDir: context.agentDir,
		...workspaceDir ? { workspaceDir } : {},
		readOnly: true
	});
}
/** Indexes a catalog generation by model key so configured refs can reuse its metadata. */
function indexModelCatalogEntriesByKey(snapshot) {
	const byKey = /* @__PURE__ */ new Map();
	for (const entry of [...snapshot.entries, ...snapshot.staticEntries ?? []]) {
		const key = modelKey(entry.provider, entry.id);
		if (!byKey.has(key)) byKey.set(key, entry);
	}
	return byKey;
}
/** Appends rows discovered from the loaded model registry. */
async function appendDiscoveredRows(params) {
	const seenKeys = /* @__PURE__ */ new Set();
	const modelResolver = params.modelRegistry && params.resolveWithRegistry !== false ? (await loadModelResolverModule()).resolveModelWithRegistry : void 0;
	const preparedModels = [...params.models].toSorted((a, b) => {
		const providerCompare = a.provider.localeCompare(b.provider);
		if (providerCompare !== 0) return providerCompare;
		return a.id.localeCompare(b.id);
	}).map((model) => {
		const key = modelKey(model.provider, model.id);
		const resolvedModel = params.modelRegistry && modelResolver ? modelResolver({
			provider: model.provider,
			modelId: model.id,
			modelRegistry: params.modelRegistry,
			cfg: params.context.cfg,
			agentDir: params.context.agentDir
		}) : void 0;
		return {
			key,
			model,
			rowModel: resolvedModel && modelKey(resolvedModel.provider, resolvedModel.id) === key ? resolvedModel : model
		};
	});
	const routeIndex = createModelCatalogLogicalRouteIndex(preparedModels.map(({ model, rowModel }) => toCatalogProjectionEntry(hasSameCatalogRoute(model, rowModel) ? rowModel : model)));
	for (const { key, rowModel } of preparedModels) await appendVisibleRow({
		rows: params.rows,
		model: rowModel,
		key,
		context: params.context,
		seenKeys,
		routeIndex,
		skipSuppression: params.skipSuppression
	});
	return seenKeys;
}
/** Appends models explicitly configured under models.providers. */
async function appendConfiguredProviderRows(params) {
	const replaceMode = params.context.cfg.models?.mode === "replace";
	for (const [provider, providerConfig] of Object.entries(params.context.cfg.models?.providers ?? {})) for (const configuredModel of providerConfig.models ?? []) {
		if (!replaceMode && !shouldListConfiguredProviderModel({
			providerConfig,
			model: configuredModel
		})) continue;
		const modelId = replaceMode ? normalizeConfiguredProviderCatalogModelId(provider, stripSelfProviderModelPrefix(provider, configuredModel.id), { manifestPlugins: params.context.metadataSnapshot?.manifestRegistry.plugins }) : configuredModel.id;
		const key = modelKey(replaceMode ? canonicalizeModelCatalogProviderAlias(provider, {
			cfg: params.context.cfg,
			metadataSnapshot: params.context.metadataSnapshot
		}) : provider, modelId);
		const model = toConfiguredProviderListModel({
			provider,
			providerConfig,
			model: {
				...configuredModel,
				id: modelId
			}
		});
		const authEvaluation = replaceMode ? params.context.authIndex.evaluateModelAuth(provider, toModelAuthRef(model)) : void 0;
		await appendVisibleRow({
			rows: params.rows,
			model,
			key,
			context: params.context,
			seenKeys: params.seenKeys,
			...authEvaluation ? { authEvaluation } : {},
			allowAuthAvailabilityOverride: true,
			normalizeWithProviderPlugin: true
		});
	}
}
/** Appends catalog models for providers that have configured auth. */
async function appendAuthenticatedCatalogRows(params) {
	if (params.context.cfg.models?.mode === "replace") return;
	const { entries: catalog, routeVariants } = params.catalogSnapshot ?? await loadListModelCatalogSnapshot(params.context);
	const routeIndex = createModelCatalogLogicalRouteIndex(routeVariants);
	for (const entry of catalog) {
		const model = toPreparedCatalogListModel(entry);
		const authEvaluation = params.context.authIndex.evaluateModelAuth(entry.provider, toModelAuthRef(model, routeIndex));
		const hasRunnableSyntheticAuth = authEvaluation.availability === void 0 && authEvaluation.evidence === "synthetic";
		if (authEvaluation.availability !== true && !hasRunnableSyntheticAuth) continue;
		const key = modelKey(entry.provider, entry.id);
		await appendVisibleRow({
			rows: params.rows,
			model,
			key,
			context: params.context,
			seenKeys: params.seenKeys,
			routeIndex,
			authEvaluation,
			allowAuthAvailabilityOverride: !hasRunnableSyntheticAuth
		});
	}
}
/** Projects every model from the same lifecycle generation used by the Gateway. */
async function appendPreparedModelCatalogRows(params) {
	const catalogSnapshot = params.catalogSnapshot ?? await loadListModelCatalogSnapshot(params.context);
	const staticEntries = catalogSnapshot.staticEntries ?? [];
	const routeVariants = [...catalogSnapshot.routeVariants];
	const seenRouteVariants = new Set(routeVariants.map((entry) => `${resolveCatalogLogicalKey(entry)}\0${entry.api ?? ""}\0${entry.baseUrl ?? ""}`));
	for (const entry of staticEntries) {
		const routeKey = `${resolveCatalogLogicalKey(entry)}\0${entry.api ?? ""}\0${entry.baseUrl ?? ""}`;
		if (!seenRouteVariants.has(routeKey)) {
			routeVariants.push(entry);
			seenRouteVariants.add(routeKey);
		}
	}
	const routeIndex = createModelCatalogLogicalRouteIndex(routeVariants);
	for (const entry of [...catalogSnapshot.entries, ...staticEntries]) await appendVisibleRow({
		rows: params.rows,
		model: toPreparedCatalogListModel(entry),
		key: modelKey(entry.provider, entry.id),
		context: params.context,
		seenKeys: params.seenKeys,
		routeIndex,
		allowAuthAvailabilityOverride: !params.context.discoveredKeys.has(modelKey(entry.provider, entry.id))
	});
}
/** Appends rows from default/fallback/configured model references. */
async function appendConfiguredRows(params) {
	const resolveModelWithRegistry = params.modelRegistry ? (await loadModelResolverModule()).resolveModelWithRegistry : void 0;
	const catalogByKey = params.catalogSnapshot ? indexModelCatalogEntriesByKey(params.catalogSnapshot) : void 0;
	const routeIndex = params.catalogSnapshot ? createModelCatalogLogicalRouteIndex(params.catalogSnapshot.routeVariants) : void 0;
	for (const entry of params.entries) {
		if (!matchesProviderFilter(params.context, entry.ref.provider)) continue;
		const resolvedModel = params.modelRegistry && resolveModelWithRegistry ? resolveModelWithRegistry({
			provider: entry.ref.provider,
			modelId: entry.ref.model,
			modelRegistry: params.modelRegistry,
			cfg: params.context.cfg
		}) : toFallbackConfiguredListModel(entry, params.context.cfg, catalogByKey?.get(entry.key));
		if (!resolvedModel) {
			if (!params.context.filter.local) params.rows.push(toModelRow({
				key: entry.key,
				tags: Array.from(entry.tags),
				aliases: entry.aliases,
				availableKeys: params.context.availableKeys,
				authAvailability: void 0
			}));
			continue;
		}
		await appendVisibleRow({
			rows: params.rows,
			model: resolvedModel,
			key: entry.key,
			context: params.context,
			...routeIndex ? { routeIndex } : {},
			configuredEntry: entry,
			normalizeWithProviderPlugin: true,
			allowAuthAvailabilityOverride: !params.context.discoveredKeys.has(modelKey(resolvedModel.provider, resolvedModel.id))
		});
	}
}
//#endregion
//#region src/commands/models/list.row-sources.ts
/** Appends all rows requested by `models list --all` or a provider-filtered list. */
async function appendAllModelRowSources(params) {
	const seenKeys = await appendDiscoveredRows({
		rows: params.rows,
		models: params.registryModels ?? params.modelRegistry?.getAll() ?? [],
		modelRegistry: params.modelRegistry,
		context: params.context,
		resolveWithRegistry: Boolean(params.context.filter.provider),
		skipSuppression: Boolean(params.modelRegistry)
	});
	await appendPreparedModelCatalogRows({
		rows: params.rows,
		context: params.context,
		seenKeys
	});
	await appendConfiguredProviderRows({
		rows: params.rows,
		context: params.context,
		seenKeys
	});
	if (params.context.filter.provider && params.entries && params.entries.length > 0) {
		const missingEntries = params.entries.filter((entry) => !seenKeys.has(entry.key));
		if (missingEntries.length > 0) {
			const appendedRowsStart = params.rows.length;
			await appendConfiguredRows({
				rows: params.rows,
				entries: missingEntries,
				modelRegistry: params.modelRegistry,
				context: params.context
			});
			for (const row of params.rows.slice(appendedRowsStart)) seenKeys.add(row.key);
		}
	}
}
/** Appends the configured/default rows used by the cheap default list path. */
async function appendConfiguredModelRowSources(params) {
	if (params.context.cfg.models?.mode === "replace") {
		await appendConfiguredProviderRows({
			rows: params.rows,
			context: params.context,
			seenKeys: /* @__PURE__ */ new Set()
		});
		return;
	}
	const catalogSnapshot = await loadListModelCatalogSnapshot(params.context);
	await appendConfiguredRows({
		...params,
		catalogSnapshot
	});
	const seenKeys = new Set(params.rows.map((row) => row.key));
	await appendConfiguredProviderRows({
		rows: params.rows,
		context: params.context,
		seenKeys
	});
	await appendAuthenticatedCatalogRows({
		rows: params.rows,
		context: params.context,
		seenKeys,
		catalogSnapshot
	});
}
//#endregion
export { appendAllModelRowSources, appendConfiguredModelRowSources };
