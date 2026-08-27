import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { b as resolveModelRefFromString } from "./model-selection-shared-DbjoXfPH.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { i as resolveModelCatalogIdentityKey } from "./openai-model-routes-rndVcpg7.js";
import { d as getActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Cj3P99a_.js";
import "./workspace-DJ__UUS2.js";
//#region src/agents/harness/model-catalog.ts
function dedupeByKey(entries, keyOf) {
	const merged = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const key = keyOf(entry);
		if (!merged.has(key)) merged.set(key, entry);
	}
	return [...merged.values()];
}
function normalizeRouteBaseUrl(value) {
	if (!value) return "";
	try {
		const url = new URL(value);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return value.trim();
	}
}
function routeVariantKey(entry) {
	return [
		resolveModelCatalogIdentityKey(entry),
		entry.api ?? "",
		normalizeRouteBaseUrl(entry.baseUrl)
	].join("\0");
}
function mergeHarnessCompat(observed, provider) {
	if (!observed && !provider) return;
	const compat = {
		...provider,
		...observed
	};
	if (observed?.supportedReasoningEfforts?.length === 0) return {
		...compat,
		supportsReasoningEffort: false,
		supportedReasoningEfforts: []
	};
	const efforts = [.../* @__PURE__ */ new Set([...provider?.supportedReasoningEfforts ?? [], ...observed?.supportedReasoningEfforts ?? []])];
	return efforts.length > 0 ? {
		...compat,
		supportsReasoningEffort: true,
		supportedReasoningEfforts: efforts
	} : compat;
}
function enrichHarnessRows(rows, snapshot) {
	const routeDonors = /* @__PURE__ */ new Map();
	const identityDonors = /* @__PURE__ */ new Map();
	for (const donor of [...snapshot.entries, ...snapshot.staticEntries ?? []]) {
		const routeKey = routeVariantKey(donor);
		const identityKey = resolveModelCatalogIdentityKey(donor);
		if (!routeDonors.has(routeKey)) routeDonors.set(routeKey, donor);
		if (!identityDonors.has(identityKey)) identityDonors.set(identityKey, donor);
	}
	return rows.map((entry) => {
		const donor = routeDonors.get(routeVariantKey(entry)) ?? (entry.api === void 0 && entry.baseUrl === void 0 ? identityDonors.get(resolveModelCatalogIdentityKey(entry)) : void 0);
		if (!donor) return entry;
		const compat = mergeHarnessCompat(entry.compat, donor.compat);
		const mergedParams = donor.params || entry.params ? {
			...donor.params,
			...entry.params
		} : void 0;
		return {
			...donor,
			...entry,
			...mergedParams ? { params: mergedParams } : {},
			...compat ? { compat } : {}
		};
	});
}
async function augmentModelCatalogWithAgentHarness(params) {
	const rawDefaultModel = params.defaultModel?.trim();
	if (!rawDefaultModel) return params.snapshot;
	const ref = resolveModelRefFromString({
		cfg: params.cfg,
		raw: rawDefaultModel,
		defaultProvider: params.defaultProvider,
		allowManifestNormalization: true,
		allowPluginNormalization: true
	})?.ref;
	if (!ref) return params.snapshot;
	const refKey = resolveModelCatalogIdentityKey({
		provider: ref.provider,
		id: ref.model
	});
	const routeEntry = [...params.snapshot.entries, ...params.snapshot.staticEntries ?? []].find((entry) => resolveModelCatalogIdentityKey(entry) === refKey);
	const runtime = resolveAgentHarnessPolicy({
		provider: ref.provider,
		modelId: ref.model,
		modelApi: routeEntry?.api,
		modelBaseUrl: routeEntry?.baseUrl,
		config: params.cfg,
		agentId: params.agentId
	}).runtime;
	if (runtime === "auto" || runtime === "openclaw") return params.snapshot;
	const harness = (params.pluginRegistry ?? getActivePluginRegistry())?.agentHarnesses.find((entry) => entry.harness.id === runtime)?.harness;
	if (!harness?.loadModelCatalog) return params.snapshot;
	try {
		const listedRows = await harness.loadModelCatalog({
			config: params.cfg,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		});
		if (listedRows.length === 0) return params.snapshot;
		const rows = enrichHarnessRows(listedRows, params.snapshot);
		return {
			...params.snapshot,
			entries: dedupeByKey([...rows, ...params.snapshot.entries], resolveModelCatalogIdentityKey),
			routeVariants: dedupeByKey([...rows, ...params.snapshot.routeVariants], routeVariantKey)
		};
	} catch (error) {
		params.onError?.(error);
		return params.snapshot;
	}
}
function augmentPreparedModelCatalogWithAgentHarness(params) {
	const agentId = params.input.agentId ?? resolveDefaultAgentId(params.input.config);
	return augmentModelCatalogWithAgentHarness({
		cfg: params.input.config,
		agentId,
		agentDir: params.input.agentDir,
		workspaceDir: params.input.workspaceDir ?? resolveAgentWorkspaceDir(params.input.config, agentId) ?? resolveDefaultAgentWorkspaceDir(),
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: resolveAgentEffectiveModelPrimary(params.input.config, agentId),
		snapshot: params.snapshot,
		pluginRegistry: params.pluginRegistry
	});
}
//#endregion
export { augmentPreparedModelCatalogWithAgentHarness as n, augmentModelCatalogWithAgentHarness as t };
