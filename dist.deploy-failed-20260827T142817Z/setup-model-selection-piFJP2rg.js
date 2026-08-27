import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./error-runtime-CmlvK1A3.js";
import { f as selectPreferredLocalModelId } from "./provider-model-shared-T9VIzWk7.js";
import { c as enrichOllamaModelsWithContext, f as isReasoningModelHeuristic, g as resolveOllamaApiBase, h as readOllamaModelShowInfo, r as buildOllamaModelDefinition, t as buildDefaultOllamaCloudModelDefinition, u as fetchOllamaModels } from "./provider-models-ClNKE4rG.js";
//#region extensions/ollama/src/setup-model-selection.ts
const OLLAMA_CONTEXT_ENRICH_LIMIT = 200;
const OLLAMA_TOOLS_SCAN_CONCURRENCY = 8;
const OLLAMA_APP_GUIDED_MIN_CONTEXT_TOKENS = 16384;
function normalizeOllamaModelName(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	return trimmed.toLowerCase().startsWith("ollama/") ? trimmed.slice(7).trim() || void 0 : trimmed;
}
function getOllamaLatestDedupeKey(name) {
	const normalized = name.trim().toLowerCase();
	return normalized.endsWith(":latest") ? normalized.slice(0, -7) : normalized;
}
function mergeUniqueModelNames(...groups) {
	const mergedByKey = /* @__PURE__ */ new Map();
	for (const group of groups) for (const name of group) {
		const key = getOllamaLatestDedupeKey(name);
		const existing = mergedByKey.get(key);
		if (existing === void 0 || !existing.trim().toLowerCase().endsWith(":latest") && name.trim().toLowerCase().endsWith(":latest")) mergedByKey.set(key, name);
	}
	return [...mergedByKey.values()];
}
function findAvailableOllamaModelName(modelName, availableModelNames) {
	const wantedKey = getOllamaLatestDedupeKey(modelName);
	for (const available of availableModelNames) if (getOllamaLatestDedupeKey(available) === wantedKey) return available;
}
function orderPreferredOllamaModelIds(modelIds) {
	const remaining = [...modelIds];
	const ordered = [];
	while (remaining.length > 0) {
		const preferredId = selectPreferredLocalModelId(remaining);
		const preferredIndex = preferredId ? remaining.indexOf(preferredId) : 0;
		const [candidate] = remaining.splice(Math.max(preferredIndex, 0), 1);
		if (candidate) ordered.push(candidate);
	}
	return ordered;
}
function selectAppGuidedOllamaModelId(models) {
	const eligible = [...models].filter((model) => model.supportsTools === true && model.contextWindow !== void 0 && model.contextWindow >= 16384);
	const nonReasoning = eligible.filter((model) => model.reasoning !== true);
	const pool = nonReasoning.length > 0 ? nonReasoning : eligible;
	const measuredSizes = pool.map((model) => model.size).filter((size) => typeof size === "number" && size > 0);
	const smallestSize = measuredSizes.length > 0 ? Math.min(...measuredSizes) : void 0;
	return orderPreferredOllamaModelIds((smallestSize === void 0 ? pool : pool.filter((model) => model.size === smallestSize)).map((model) => model.id))[0];
}
function selectAppGuidedOllamaModelFromDiscovery(models) {
	return selectAppGuidedOllamaModelId([...models].map((model) => ({
		id: model.name,
		contextWindow: model.contextWindow,
		supportsTools: model.capabilities?.includes("tools") === true,
		reasoning: model.capabilities?.includes("thinking") === true || isReasoningModelHeuristic(model.name),
		size: model.size
	})));
}
function buildOllamaModelsConfig(modelNames, discoveredModelsByName, defaultModels = []) {
	return modelNames.map((name) => {
		const discovered = discoveredModelsByName?.get(name);
		const defaultModel = defaultModels.find((model) => model.id === name);
		if (defaultModel && !discovered) return buildDefaultOllamaCloudModelDefinition(defaultModel);
		const capabilities = discovered?.capabilities ?? (defaultModel ? [...defaultModel.capabilities] : void 0);
		return buildOllamaModelDefinition(name, discovered?.contextWindow ?? defaultModel?.contextWindow, capabilities, { showInspectionFailed: discovered?.showInspectionFailed });
	});
}
async function inspectOllamaModelsForSetup(baseUrl, models, signal) {
	const apiBase = resolveOllamaApiBase(baseUrl);
	const inspected = [];
	const inspectionFailures = [];
	for (let index = 0; index < models.length; index += OLLAMA_TOOLS_SCAN_CONCURRENCY) {
		signal?.throwIfAborted();
		const batch = models.slice(index, index + OLLAMA_TOOLS_SCAN_CONCURRENCY);
		const results = await Promise.all(batch.map(async (model) => {
			try {
				const showInfo = await readOllamaModelShowInfo(apiBase, model.name, {
					timeoutMs: 3e3,
					signal,
					auditContext: "ollama-setup.tools-scan"
				});
				return Object.assign({}, model, showInfo);
			} catch (error) {
				signal?.throwIfAborted();
				inspectionFailures.push(`${model.name}: ${formatErrorMessage(error)}`);
				return Object.assign({}, model, { showInspectionFailed: true });
			}
		}));
		inspected.push(...results);
	}
	return {
		inspected,
		inspectionFailures
	};
}
async function discoverOllamaModelsForSetup(params) {
	const { reachable, models } = await fetchOllamaModels(params.baseUrl, { signal: params.signal });
	const firstModels = models.slice(0, OLLAMA_CONTEXT_ENRICH_LIMIT);
	const inspection = !reachable ? {
		inspected: [],
		inspectionFailures: []
	} : params.inspectTools ? await inspectOllamaModelsForSetup(params.baseUrl, firstModels, params.signal) : {
		inspected: await enrichOllamaModelsWithContext(params.baseUrl, firstModels, { signal: params.signal }),
		inspectionFailures: []
	};
	if (params.inspectTools && !inspection.inspected.some((model) => model.capabilities?.includes("tools")) && models.length > OLLAMA_CONTEXT_ENRICH_LIMIT) {
		const remainingScan = await inspectOllamaModelsForSetup(params.baseUrl, models.slice(OLLAMA_CONTEXT_ENRICH_LIMIT), params.signal);
		inspection.inspected.push(...remainingScan.inspected);
		inspection.inspectionFailures.push(...remainingScan.inspectionFailures);
	}
	return {
		reachable,
		models,
		inspectedModels: inspection.inspected,
		discoveredModelsByName: new Map(inspection.inspected.map((model) => [model.name, model])),
		inspectionFailures: inspection.inspectionFailures,
		hasToolsCapableModel: inspection.inspected.some((model) => model.capabilities?.includes("tools"))
	};
}
//#endregion
export { inspectOllamaModelsForSetup as a, orderPreferredOllamaModelIds as c, findAvailableOllamaModelName as i, selectAppGuidedOllamaModelFromDiscovery as l, buildOllamaModelsConfig as n, mergeUniqueModelNames as o, discoverOllamaModelsForSetup as r, normalizeOllamaModelName as s, OLLAMA_APP_GUIDED_MIN_CONTEXT_TOKENS as t };
