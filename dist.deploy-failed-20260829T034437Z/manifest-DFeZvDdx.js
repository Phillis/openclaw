import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { l as asNonNegativeFiniteNumber, s as asFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { f as normalizeTrimmedStringList, o as normalizeOptionalTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { D as parseJsonWithJson5Fallback } from "./redact-CWP17HFN.js";
import { t as isBlockedObjectKey$1 } from "./prototype-keys-CuYw53fZ.js";
import { i as openRootFileSync, n as matchRootFileOpenFailure } from "./root-file-B4L4VJ7-.js";
import "./utils-Bw16L5tB.js";
import { n as ENV_SECRET_REF_ID_RE } from "./types.secrets-Bre8L6Ts.js";
import "./boundary-file-read-h_n3tTfV.js";
import { a as sanitizeCommandDescriptorDescription, i as normalizeCommandDescriptorName } from "./command-descriptor-utils-C7spGKc4.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as buildModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-BdjEHOKQ.js";
import { r as createPluginCacheKey, t as PluginLruCache } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { t as normalizeManifestCommandAliases } from "./manifest-command-aliases-1m0oXcVG.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import fs from "node:fs";
import path from "node:path";
//#region packages/model-catalog-core/src/model-catalog-types.ts
/** Supported API protocols for model catalog entries. */
const MODEL_CATALOG_APIS = [
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"anthropic-messages",
	"google-generative-ai",
	"google-vertex",
	"github-copilot",
	"bedrock-converse-stream",
	"ollama",
	"azure-openai-responses"
];
/** Supported model thinking/reasoning wire formats. */
const MODEL_CATALOG_THINKING_FORMATS = [
	"openai",
	"openrouter",
	"deepseek",
	"together",
	"qwen",
	"qwen-chat-template",
	"zai"
];
/** Narrow a string to a supported model catalog thinking format. */
function isModelCatalogThinkingFormat(value) {
	return MODEL_CATALOG_THINKING_FORMATS.includes(value);
}
/** Model-level thinking settings carried by provider catalog metadata. */
const MODEL_CATALOG_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
//#endregion
//#region packages/model-catalog-core/src/model-catalog-context-windows.ts
function normalizePositiveInteger$1(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogContextWindows(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const contextWindows = value.slice(0, 16).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const id = normalizeOptionalString(entry.id) ?? "";
		const label = normalizeOptionalString(entry.label) ?? "";
		const contextWindow = normalizePositiveInteger$1(entry.contextWindow);
		if (!id || !label || contextWindow === void 0 || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			label,
			contextWindow
		}];
	});
	return contextWindows.length > 0 ? contextWindows.toSorted((left, right) => left.contextWindow - right.contextWindow || left.id.localeCompare(right.id)) : void 0;
}
function normalizeModelCatalogContextWindowDefault(value, contextWindows) {
	const contextWindowDefault = normalizeOptionalString(value);
	return contextWindowDefault && contextWindows?.some((option) => option.id === contextWindowDefault) ? contextWindowDefault : void 0;
}
function normalizeModelCatalogContextWindowSelection(value) {
	const contextWindows = normalizeModelCatalogContextWindows(value.contextWindows);
	const contextWindowDefault = normalizeModelCatalogContextWindowDefault(value.contextWindowDefault, contextWindows);
	return contextWindows && contextWindowDefault ? {
		contextWindows,
		contextWindowDefault
	} : {};
}
//#endregion
//#region packages/model-catalog-core/src/model-catalog-normalize.ts
const MODEL_CATALOG_INPUTS = /* @__PURE__ */ new Set([
	"text",
	"image",
	"document"
]);
const MODEL_CATALOG_DISCOVERY_MODES = /* @__PURE__ */ new Set([
	"static",
	"refreshable",
	"runtime"
]);
const MODEL_CATALOG_STATUSES = /* @__PURE__ */ new Set([
	"available",
	"preview",
	"deprecated",
	"disabled"
]);
const MODEL_CATALOG_API_SET = new Set(MODEL_CATALOG_APIS);
const DEFAULT_MODEL_INPUT = ["text"];
const DEFAULT_MODEL_STATUS = "available";
/** Reject object keys that can mutate prototypes when copied into records. */
function isBlockedObjectKey(key) {
	return key === "__proto__" || key === "prototype" || key === "constructor";
}
function normalizeModelCatalogThinkingLevelMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const level of MODEL_CATALOG_THINKING_LEVELS) {
		const mapped = value[level];
		if (mapped === null) {
			normalized[level] = null;
			continue;
		}
		const normalizedValue = normalizeOptionalString(mapped);
		if (normalizedValue !== void 0) normalized[level] = normalizedValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeSafeRecordKey(value) {
	const key = normalizeOptionalString(value) ?? "";
	return key && !isBlockedObjectKey(key) ? key : "";
}
function normalizeOwnedProviderSet(providers) {
	const normalized = /* @__PURE__ */ new Set();
	for (const provider of providers) {
		const providerId = normalizeProviderId(provider);
		if (providerId) normalized.add(providerId);
	}
	return normalized;
}
function normalizeStringMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeSafeRecordKey(rawKey);
		const mapValue = normalizeOptionalString(rawValue) ?? "";
		if (key && mapValue) normalized[key] = mapValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function mergeStringMaps(base, override) {
	if (!base && !override) return;
	return {
		...base,
		...override
	};
}
function normalizeModelCatalogApi(value) {
	const api = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_API_SET.has(api) ? api : void 0;
}
function normalizeModelCatalogInputs(value) {
	const inputs = normalizeTrimmedStringList(value).filter((input) => MODEL_CATALOG_INPUTS.has(input));
	return inputs.length > 0 ? inputs : void 0;
}
function normalizePositiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogTieredCost(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry) || !Array.isArray(entry.range)) continue;
		const input = asNonNegativeFiniteNumber(entry.input);
		const output = asNonNegativeFiniteNumber(entry.output);
		const cacheRead = asNonNegativeFiniteNumber(entry.cacheRead);
		const cacheWrite = asNonNegativeFiniteNumber(entry.cacheWrite);
		if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0 || entry.range.length < 1 || entry.range.length > 2) continue;
		const rangeValues = entry.range.map((rangeValue) => asNonNegativeFiniteNumber(rangeValue));
		if (rangeValues.some((rangeValue) => rangeValue === void 0)) continue;
		normalized.push({
			input,
			output,
			cacheRead,
			cacheWrite,
			range: rangeValues.length === 1 ? [rangeValues[0]] : [rangeValues[0], rangeValues[1]]
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeModelCatalogCost(value) {
	if (!isRecord(value)) return;
	const input = asNonNegativeFiniteNumber(value.input);
	const output = asNonNegativeFiniteNumber(value.output);
	const cacheRead = asNonNegativeFiniteNumber(value.cacheRead);
	const cacheWrite = asNonNegativeFiniteNumber(value.cacheWrite);
	const tieredPricing = normalizeModelCatalogTieredCost(value.tieredPricing);
	const cost = {
		...input !== void 0 ? { input } : {},
		...output !== void 0 ? { output } : {},
		...cacheRead !== void 0 ? { cacheRead } : {},
		...cacheWrite !== void 0 ? { cacheWrite } : {},
		...tieredPricing ? { tieredPricing } : {}
	};
	return Object.keys(cost).length > 0 ? cost : void 0;
}
function normalizeOpenRouterPrice(value) {
	if (!isRecord(value)) return;
	const maxPrice = {};
	for (const field of [
		"prompt",
		"completion",
		"image",
		"audio",
		"request"
	]) {
		const candidate = value[field];
		const normalized = normalizeOptionalString(candidate) ?? asFiniteNumber(candidate);
		if (normalized !== void 0) maxPrice[field] = normalized;
	}
	return Object.keys(maxPrice).length > 0 ? maxPrice : void 0;
}
function normalizeOpenRouterMetricPreference(value) {
	const numeric = asFiniteNumber(value);
	if (numeric !== void 0) return numeric;
	if (!isRecord(value)) return;
	const normalized = {};
	for (const field of [
		"p50",
		"p75",
		"p90",
		"p99"
	]) {
		const cutoff = asFiniteNumber(value[field]);
		if (cutoff !== void 0) normalized[field] = cutoff;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterSort(value) {
	const sort = normalizeOptionalString(value);
	if (sort) return sort;
	if (!isRecord(value)) return;
	const by = normalizeOptionalString(value.by);
	const partition = value.partition === null ? null : normalizeOptionalString(value.partition) ?? void 0;
	const normalized = {
		...by ? { by } : {},
		...partition !== void 0 ? { partition } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterRouting(value) {
	if (!isRecord(value)) return;
	const routing = {
		...typeof value.allow_fallbacks === "boolean" ? { allow_fallbacks: value.allow_fallbacks } : {},
		...typeof value.require_parameters === "boolean" ? { require_parameters: value.require_parameters } : {},
		...value.data_collection === "deny" || value.data_collection === "allow" ? { data_collection: value.data_collection } : {},
		...typeof value.zdr === "boolean" ? { zdr: value.zdr } : {},
		...typeof value.enforce_distillable_text === "boolean" ? { enforce_distillable_text: value.enforce_distillable_text } : {}
	};
	for (const field of [
		"order",
		"only",
		"ignore",
		"quantizations"
	]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	const sort = normalizeOpenRouterSort(value.sort);
	if (sort) routing.sort = sort;
	const maxPrice = normalizeOpenRouterPrice(value.max_price);
	if (maxPrice) routing.max_price = maxPrice;
	for (const field of ["preferred_min_throughput", "preferred_max_latency"]) {
		const normalized = normalizeOpenRouterMetricPreference(value[field]);
		if (normalized !== void 0) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeVercelGatewayRouting(value) {
	if (!isRecord(value)) return;
	const routing = {};
	for (const field of ["only", "order"]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeModelCatalogCompat(value) {
	if (!isRecord(value)) return;
	const compat = {};
	for (const field of [
		"supportsStore",
		"supportsPromptCacheKey",
		"supportsDeveloperRole",
		"supportsReasoningEffort",
		"supportsTemperature",
		"supportsUsageInStreaming",
		"supportsTools",
		"supportsStrictMode",
		"supportsJsonSchemaResponseFormat",
		"requiresStringContent",
		"strictMessageKeys",
		"requiresToolResultName",
		"requiresAssistantAfterToolResult",
		"requiresThinkingAsText",
		"requiresReasoningContentOnAssistantMessages",
		"zaiToolStream",
		"sendSessionAffinityHeaders",
		"sendSessionIdHeader",
		"supportsEagerToolInputStreaming",
		"supportsLongCacheRetention",
		"requiresOpenAiAnthropicToolPayload"
	]) if (typeof value[field] === "boolean") compat[field] = value[field];
	for (const field of ["toolSchemaProfile", "toolCallArgumentsEncoding"]) {
		const normalized = normalizeOptionalString(value[field]) ?? "";
		if (normalized) compat[field] = normalized;
	}
	for (const field of [
		"visibleReasoningDetailTypes",
		"supportedReasoningEfforts",
		"unsupportedToolSchemaKeywords"
	]) {
		const normalized = normalizeTrimmedStringList(value[field]);
		if (normalized.length > 0) compat[field] = normalized;
	}
	if (isRecord(value.reasoningEffortMap)) {
		const reasoningEffortMap = Object.fromEntries(Object.entries(value.reasoningEffortMap).flatMap(([rawKey, rawMapped]) => {
			const key = rawKey.trim();
			const mapped = typeof rawMapped === "string" ? rawMapped.trim() : "";
			return key && mapped ? [[key, mapped]] : [];
		}));
		if (Object.keys(reasoningEffortMap).length > 0) compat.reasoningEffortMap = reasoningEffortMap;
	}
	const codeMode = normalizeOptionalString(value.codeMode) ?? "";
	if (codeMode === "preferred" || codeMode === "capable") compat.codeMode = codeMode;
	const maxTokensField = normalizeOptionalString(value.maxTokensField) ?? "";
	if (maxTokensField === "max_completion_tokens" || maxTokensField === "max_tokens") compat.maxTokensField = maxTokensField;
	const thinkingFormat = normalizeOptionalString(value.thinkingFormat) ?? "";
	if (isModelCatalogThinkingFormat(thinkingFormat)) compat.thinkingFormat = thinkingFormat;
	if (value.cacheControlFormat === "anthropic") compat.cacheControlFormat = "anthropic";
	const openRouterRouting = normalizeOpenRouterRouting(value.openRouterRouting);
	if (openRouterRouting) compat.openRouterRouting = openRouterRouting;
	const vercelGatewayRouting = normalizeVercelGatewayRouting(value.vercelGatewayRouting);
	if (vercelGatewayRouting) compat.vercelGatewayRouting = vercelGatewayRouting;
	return Object.keys(compat).length > 0 ? compat : void 0;
}
function normalizeModelCatalogStatus(value) {
	const status = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_STATUSES.has(status) ? status : void 0;
}
function normalizeModelCatalogImageTokenMode(value) {
	const tokenMode = normalizeOptionalString(value) ?? "";
	if (tokenMode === "tile" || tokenMode === "detail" || tokenMode === "provider") return tokenMode;
}
function normalizeModelCatalogMediaInput(value) {
	if (!isRecord(value) || !isRecord(value.image)) return;
	const maxBytes = normalizePositiveInteger(value.image.maxBytes);
	const maxPixels = normalizePositiveInteger(value.image.maxPixels);
	const maxSidePx = normalizePositiveInteger(value.image.maxSidePx);
	const preferredSidePx = normalizePositiveInteger(value.image.preferredSidePx);
	const tokenMode = normalizeModelCatalogImageTokenMode(value.image.tokenMode);
	const normalizedImage = {
		...maxBytes !== void 0 ? { maxBytes } : {},
		...maxPixels !== void 0 ? { maxPixels } : {},
		...maxSidePx !== void 0 ? { maxSidePx } : {},
		...preferredSidePx !== void 0 ? { preferredSidePx } : {},
		...tokenMode ? { tokenMode } : {}
	};
	return Object.keys(normalizedImage).length > 0 ? { image: normalizedImage } : void 0;
}
function normalizeModelCatalogModel(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id) ?? "";
	if (!id) return;
	const name = normalizeOptionalString(value.name) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const headers = normalizeStringMap(value.headers);
	const input = normalizeModelCatalogInputs(value.input);
	const reasoning = typeof value.reasoning === "boolean" ? value.reasoning : void 0;
	const contextWindow = asPositiveFiniteNumber(value.contextWindow);
	const contextWindowSelection = normalizeModelCatalogContextWindowSelection(value);
	const contextTokens = normalizePositiveInteger(value.contextTokens);
	const maxTokens = asPositiveFiniteNumber(value.maxTokens);
	const thinkingLevelMap = normalizeModelCatalogThinkingLevelMap(value.thinkingLevelMap);
	const cost = normalizeModelCatalogCost(value.cost);
	const compat = normalizeModelCatalogCompat(value.compat);
	const mediaInput = normalizeModelCatalogMediaInput(value.mediaInput);
	const status = normalizeModelCatalogStatus(value.status);
	const statusReason = normalizeOptionalString(value.statusReason) ?? "";
	const replaces = normalizeTrimmedStringList(value.replaces);
	const replacedBy = normalizeOptionalString(value.replacedBy) ?? "";
	const tags = normalizeTrimmedStringList(value.tags);
	return {
		id,
		...name ? { name } : {},
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {},
		...headers ? { headers } : {},
		...input ? { input } : {},
		...reasoning !== void 0 ? { reasoning } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...contextWindowSelection,
		...contextTokens !== void 0 ? { contextTokens } : {},
		...maxTokens !== void 0 ? { maxTokens } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {},
		...cost ? { cost } : {},
		...compat ? { compat } : {},
		...mediaInput ? { mediaInput } : {},
		...status ? { status } : {},
		...statusReason ? { statusReason } : {},
		...replaces.length > 0 ? { replaces } : {},
		...replacedBy ? { replacedBy } : {},
		...tags.length > 0 ? { tags } : {}
	};
}
function normalizeModelCatalogProvider(value) {
	if (!isRecord(value)) return;
	const models = Array.isArray(value.models) ? value.models.map((entry) => normalizeModelCatalogModel(entry)).filter((entry) => Boolean(entry)) : [];
	if (models.length === 0) return;
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const headers = normalizeStringMap(value.headers);
	const defaultModel = normalizeOptionalString(value.defaultModel) ?? "";
	const defaultUtilityModel = normalizeOptionalString(value.defaultUtilityModel) ?? "";
	return {
		...baseUrl ? { baseUrl } : {},
		...api ? { api } : {},
		...headers ? { headers } : {},
		...defaultModel ? { defaultModel } : {},
		...defaultUtilityModel ? { defaultUtilityModel } : {},
		models
	};
}
function normalizeModelCatalogProviders(value, ownedProviders) {
	if (!isRecord(value)) return;
	const providers = {};
	for (const [rawProviderId, rawProvider] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		if (!providerId || !ownedProviders.has(providerId)) continue;
		const provider = normalizeModelCatalogProvider(rawProvider);
		if (provider) providers[providerId] = provider;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeModelCatalogAliases(value, ownedProviders) {
	if (!isRecord(value)) return;
	const aliases = {};
	for (const [rawAlias, rawTarget] of Object.entries(value)) {
		const alias = normalizeProviderId(rawAlias);
		if (!alias || !isRecord(rawTarget)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(rawTarget.provider) ?? "");
		if (!provider || !ownedProviders.has(provider)) continue;
		const api = normalizeModelCatalogApi(rawTarget.api);
		const baseUrl = normalizeOptionalString(rawTarget.baseUrl) ?? "";
		aliases[alias] = {
			provider,
			...api ? { api } : {},
			...baseUrl ? { baseUrl } : {}
		};
	}
	return Object.keys(aliases).length > 0 ? aliases : void 0;
}
function normalizeModelCatalogSuppressions(value) {
	if (!Array.isArray(value)) return;
	const suppressions = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(entry.provider) ?? "");
		const model = normalizeOptionalString(entry.model) ?? "";
		if (!provider || !model) continue;
		const reason = normalizeOptionalString(entry.reason) ?? "";
		const rawWhen = isRecord(entry.when) ? entry.when : void 0;
		const baseUrlHosts = normalizeTrimmedStringList(rawWhen?.baseUrlHosts).map((host) => host.toLowerCase());
		const providerConfigApiIn = normalizeTrimmedStringList(rawWhen?.providerConfigApiIn).map((api) => api.toLowerCase());
		const when = baseUrlHosts.length > 0 || providerConfigApiIn.length > 0 ? {
			...baseUrlHosts.length > 0 ? { baseUrlHosts } : {},
			...providerConfigApiIn.length > 0 ? { providerConfigApiIn } : {}
		} : void 0;
		suppressions.push({
			provider,
			model,
			...reason ? { reason } : {},
			...when ? { when } : {}
		});
	}
	return suppressions.length > 0 ? suppressions : void 0;
}
function normalizeModelCatalogDiscovery(value, ownedProviders) {
	if (!isRecord(value)) return;
	const discovery = {};
	for (const [rawProviderId, rawMode] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		const mode = normalizeOptionalString(rawMode) ?? "";
		if (providerId && ownedProviders.has(providerId) && MODEL_CATALOG_DISCOVERY_MODES.has(mode)) discovery[providerId] = mode;
	}
	return Object.keys(discovery).length > 0 ? discovery : void 0;
}
/** Normalize a raw model catalog object for the set of providers owned by a plugin/manifest. */
function normalizeModelCatalog(value, params) {
	if (!isRecord(value)) return;
	const ownedProviders = normalizeOwnedProviderSet(params.ownedProviders);
	const providers = normalizeModelCatalogProviders(value.providers, ownedProviders);
	const aliases = normalizeModelCatalogAliases(value.aliases, ownedProviders);
	const suppressions = normalizeModelCatalogSuppressions(value.suppressions);
	const discovery = normalizeModelCatalogDiscovery(value.discovery, ownedProviders);
	const runtimeAugment = value.runtimeAugment === true;
	const catalog = {
		...providers ? { providers } : {},
		...aliases ? { aliases } : {},
		...suppressions ? { suppressions } : {},
		...discovery ? { discovery } : {},
		...runtimeAugment ? { runtimeAugment } : {}
	};
	return Object.keys(catalog).length > 0 ? catalog : void 0;
}
/** Normalize one provider catalog into sorted runtime rows. */
function normalizeModelCatalogProviderRows(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider || !Array.isArray(params.providerCatalog.models)) return [];
	const providerApi = normalizeModelCatalogApi(params.providerCatalog.api);
	const providerBaseUrl = normalizeOptionalString(params.providerCatalog.baseUrl) ?? "";
	const providerHeaders = normalizeStringMap(params.providerCatalog.headers);
	const rows = [];
	for (const rawModel of params.providerCatalog.models) {
		const model = normalizeModelCatalogModel(rawModel);
		if (!model) continue;
		const api = model.api ?? providerApi;
		const baseUrl = model.baseUrl ?? providerBaseUrl;
		const headers = mergeStringMaps(providerHeaders, model.headers);
		rows.push({
			...model,
			provider,
			ref: buildModelCatalogRef(provider, model.id),
			mergeKey: buildModelCatalogMergeKey(provider, model.id),
			name: model.name ?? model.id,
			source: params.source,
			input: model.input ?? [...DEFAULT_MODEL_INPUT],
			reasoning: model.reasoning ?? false,
			status: model.status ?? DEFAULT_MODEL_STATUS,
			...api ? { api } : {},
			...baseUrl ? { baseUrl } : {},
			...headers ? { headers } : {}
		});
	}
	return rows.toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
}
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.ts
function isDoctorSessionRouteStateOwner(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && typeof candidate.label === "string" && candidate.id.trim().length > 0 && candidate.label.trim().length > 0 && (candidate.providerIds === void 0 || normalizeTrimmedStringList(candidate.providerIds).length > 0) && (candidate.runtimeIds === void 0 || normalizeTrimmedStringList(candidate.runtimeIds).length > 0) && (candidate.cliSessionKeys === void 0 || normalizeTrimmedStringList(candidate.cliSessionKeys).length > 0) && (candidate.authProfilePrefixes === void 0 || normalizeTrimmedStringList(candidate.authProfilePrefixes).length > 0);
}
function coerceDoctorSessionRouteStateOwners(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isDoctorSessionRouteStateOwner).map((owner) => ({
		id: owner.id.trim(),
		label: owner.label.trim(),
		providerIds: normalizeTrimmedStringList(owner.providerIds),
		runtimeIds: normalizeTrimmedStringList(owner.runtimeIds),
		cliSessionKeys: normalizeTrimmedStringList(owner.cliSessionKeys),
		authProfilePrefixes: normalizeTrimmedStringList(owner.authProfilePrefixes)
	}));
}
//#endregion
//#region src/plugins/manifest-capability-normalizers.ts
function isPluginToolProfile(profile) {
	return profile === "minimal" || profile === "coding" || profile === "messaging" || profile === "full";
}
function normalizeStringListRecord(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [key, rawValues] of Object.entries(value)) {
		const providerId = normalizeOptionalString(key) ?? "";
		if (!providerId || isBlockedObjectKey$1(providerId)) continue;
		const values = normalizeTrimmedStringList(rawValues);
		if (values.length === 0) continue;
		normalized[providerId] = values;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestStringRecord(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeOptionalString(rawKey) ?? "";
		const valueLocal = normalizeOptionalString(rawValue) ?? "";
		if (!key || isBlockedObjectKey$1(key) || !valueLocal) continue;
		normalized[key] = valueLocal;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestMcpServers(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawName, rawServer] of Object.entries(value)) {
		const name = normalizeOptionalString(rawName) ?? "";
		if (!name || isBlockedObjectKey$1(name) || !isRecord(rawServer)) continue;
		normalized[name] = { ...rawServer };
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeNamedMetadataRecord(value, normalizeEntry) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawId, rawEntry] of Object.entries(value)) {
		const id = normalizeOptionalString(rawId) ?? "";
		const entry = !id || isBlockedObjectKey$1(id) || !isRecord(rawEntry) ? void 0 : normalizeEntry(rawEntry);
		if (entry) normalized[id] = entry;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
const MEDIA_UNDERSTANDING_CAPABILITIES = /* @__PURE__ */ new Set([
	"image",
	"audio",
	"video"
]);
function normalizeMediaUnderstandingCapabilityRecord(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		if (!MEDIA_UNDERSTANDING_CAPABILITIES.has(rawKey)) continue;
		const model = normalizeOptionalString(rawValue);
		if (model) normalized[rawKey] = model;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeMediaUnderstandingPriorityRecord(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		if (!MEDIA_UNDERSTANDING_CAPABILITIES.has(rawKey) || typeof rawValue !== "number" || !Number.isFinite(rawValue)) continue;
		normalized[rawKey] = rawValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeMediaUnderstandingCapabilities(value) {
	const values = normalizeTrimmedStringList(value).filter((entry) => MEDIA_UNDERSTANDING_CAPABILITIES.has(entry));
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingNativeDocumentInputs(value) {
	const values = normalizeTrimmedStringList(value).filter((entry) => entry === "pdf");
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingDocumentModels(value) {
	if (!isRecord(value)) return;
	const pdfRaw = value.pdf;
	if (!isRecord(pdfRaw)) return;
	const textExtraction = normalizeOptionalString(pdfRaw.textExtraction);
	const image = pdfRaw.image === false ? false : normalizeOptionalString(pdfRaw.image);
	const pdf = {
		...textExtraction ? { textExtraction } : {},
		...image !== void 0 ? { image } : {}
	};
	return Object.keys(pdf).length > 0 ? { pdf } : void 0;
}
function normalizeMediaUnderstandingProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const capabilities = normalizeMediaUnderstandingCapabilities(rawMetadata.capabilities);
		const defaultModels = normalizeMediaUnderstandingCapabilityRecord(rawMetadata.defaultModels);
		const autoPriority = normalizeMediaUnderstandingPriorityRecord(rawMetadata.autoPriority);
		const nativeDocumentInputs = normalizeMediaUnderstandingNativeDocumentInputs(rawMetadata.nativeDocumentInputs);
		const documentModels = normalizeMediaUnderstandingDocumentModels(rawMetadata.documentModels);
		const metadata = {
			...capabilities ? { capabilities } : {},
			...defaultModels ? { defaultModels } : {},
			...autoPriority ? { autoPriority } : {},
			...nativeDocumentInputs ? { nativeDocumentInputs } : {},
			...documentModels ? { documentModels } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeProviderBaseUrlGuard(value) {
	if (!isRecord(value)) return;
	const provider = normalizeOptionalString(value.provider);
	const allowedBaseUrls = normalizeTrimmedStringList(value.allowedBaseUrls);
	if (!provider || allowedBaseUrls.length === 0) return;
	const defaultBaseUrl = normalizeOptionalString(value.defaultBaseUrl);
	return {
		provider,
		...defaultBaseUrl ? { defaultBaseUrl } : {},
		allowedBaseUrls
	};
}
function normalizeCapabilityProviderAuthSignals(value) {
	if (!Array.isArray(value)) return;
	const signals = [];
	for (const rawSignal of value) {
		if (!isRecord(rawSignal)) continue;
		const provider = normalizeOptionalString(rawSignal.provider);
		if (!provider) continue;
		const providerBaseUrl = normalizeProviderBaseUrlGuard(rawSignal.providerBaseUrl);
		signals.push({
			provider,
			...providerBaseUrl ? { providerBaseUrl } : {}
		});
	}
	return signals.length > 0 ? signals : void 0;
}
function normalizeCapabilityProviderModeConfigSignal(value) {
	if (!isRecord(value)) return;
	const pathResult = normalizeOptionalString(value.path);
	const defaultValue = normalizeOptionalString(value.default);
	const allowed = normalizeTrimmedStringList(value.allowed);
	const disallowed = normalizeTrimmedStringList(value.disallowed);
	const signal = {
		...pathResult ? { path: pathResult } : {},
		...defaultValue ? { default: defaultValue } : {},
		...allowed.length > 0 ? { allowed } : {},
		...disallowed.length > 0 ? { disallowed } : {}
	};
	return Object.keys(signal).length > 0 ? signal : void 0;
}
function normalizeCapabilityProviderConfigSignals(value) {
	if (!Array.isArray(value)) return;
	const signals = [];
	for (const rawSignal of value) {
		if (!isRecord(rawSignal)) continue;
		const rootPath = normalizeOptionalString(rawSignal.rootPath);
		if (!rootPath) continue;
		const overlayPath = normalizeOptionalString(rawSignal.overlayPath);
		const overlayMapPath = normalizeOptionalString(rawSignal.overlayMapPath);
		const required = normalizeTrimmedStringList(rawSignal.required);
		const requiredAny = normalizeTrimmedStringList(rawSignal.requiredAny);
		const mode = normalizeCapabilityProviderModeConfigSignal(rawSignal.mode);
		const signal = {
			rootPath,
			...overlayPath ? { overlayPath } : {},
			...overlayMapPath ? { overlayMapPath } : {},
			...required.length > 0 ? { required } : {},
			...requiredAny.length > 0 ? { requiredAny } : {},
			...mode ? { mode } : {}
		};
		if (required.length > 0 || requiredAny.length > 0 || mode) signals.push(signal);
	}
	return signals.length > 0 ? signals : void 0;
}
function normalizeCapabilityProviderMetadataEntry(rawMetadata) {
	const aliases = normalizeTrimmedStringList(rawMetadata.aliases);
	const authProviders = normalizeTrimmedStringList(rawMetadata.authProviders);
	const authSignals = normalizeCapabilityProviderAuthSignals(rawMetadata.authSignals);
	const configSignals = normalizeCapabilityProviderConfigSignals(rawMetadata.configSignals);
	const referenceAudioInputs = rawMetadata.referenceAudioInputs === true ? true : void 0;
	const metadata = {
		...aliases.length > 0 ? { aliases } : {},
		...authProviders.length > 0 ? { authProviders } : {},
		...authSignals ? { authSignals } : {},
		...configSignals ? { configSignals } : {},
		...referenceAudioInputs ? { referenceAudioInputs } : {}
	};
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function normalizeCapabilityProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, normalizeCapabilityProviderMetadataEntry);
}
function normalizePluginToolMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const providerMetadata = normalizeCapabilityProviderMetadataEntry(rawMetadata);
		const profiles = normalizeTrimmedStringList(rawMetadata.profiles).filter(isPluginToolProfile);
		const metadata = {
			...providerMetadata,
			...rawMetadata.optional === true ? { optional: true } : {},
			...profiles.length > 0 ? { profiles } : {},
			...rawMetadata.replaySafe === true ? { replaySafe: true } : {},
			...rawMetadata.sideEffecting === true ? { sideEffecting: true } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeManifestCatalog(value) {
	if (!isRecord(value)) return;
	const featured = typeof value.featured === "boolean" ? value.featured : void 0;
	const order = typeof value.order === "number" && Number.isFinite(value.order) ? value.order : void 0;
	if (featured === void 0 && order === void 0) return;
	return {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
const MANIFEST_CONTRACT_KEYS = [
	"embeddedExtensionFactories",
	"agentToolResultMiddleware",
	"trustedToolPolicies",
	"externalAuthProviders",
	"embeddingProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"transcriptSourceProviders",
	"documentExtractors",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webContentExtractors",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"usageProviders",
	"migrationProviders",
	"gatewayMethodDispatch",
	"tools"
];
function normalizeManifestContracts(value) {
	if (!isRecord(value)) return;
	const contracts = {};
	for (const key of MANIFEST_CONTRACT_KEYS) {
		const entries = normalizeTrimmedStringList(value[key]);
		if (entries.length > 0) contracts[key] = entries;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function isManifestConfigLiteral(value) {
	return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function normalizeManifestDangerousConfigFlags(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const pathValue = normalizeOptionalString(entry.path) ?? "";
		if (!pathValue || !isManifestConfigLiteral(entry.equals)) continue;
		normalized.push({
			path: pathValue,
			equals: entry.equals
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestSecretInputPaths(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const pathLocal = normalizeOptionalString(entry.path) ?? "";
		if (!pathLocal) continue;
		const expected = entry.expected === "string" ? entry.expected : void 0;
		const ownerKind = entry.ownerKind === "route" ? entry.ownerKind : void 0;
		normalized.push({
			path: pathLocal,
			...expected ? { expected } : {},
			...ownerKind ? { ownerKind } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestConfigContracts(value) {
	if (!isRecord(value)) return;
	const compatibilityMigrationPaths = normalizeTrimmedStringList(value.compatibilityMigrationPaths);
	const compatibilityRuntimePaths = normalizeTrimmedStringList(value.compatibilityRuntimePaths);
	const rawSecretInputs = isRecord(value.secretInputs) ? value.secretInputs : void 0;
	const dangerousFlags = normalizeManifestDangerousConfigFlags(value.dangerousFlags);
	const secretInputPaths = rawSecretInputs ? normalizeManifestSecretInputPaths(rawSecretInputs.paths) : void 0;
	const secretInputs = secretInputPaths && secretInputPaths.length > 0 ? {
		...rawSecretInputs?.bundledDefaultEnabled === true ? { bundledDefaultEnabled: true } : rawSecretInputs?.bundledDefaultEnabled === false ? { bundledDefaultEnabled: false } : {},
		paths: secretInputPaths
	} : void 0;
	const configContracts = {
		...compatibilityMigrationPaths.length > 0 ? { compatibilityMigrationPaths } : {},
		...compatibilityRuntimePaths.length > 0 ? { compatibilityRuntimePaths } : {},
		...dangerousFlags ? { dangerousFlags } : {},
		...secretInputs ? { secretInputs } : {}
	};
	return Object.keys(configContracts).length > 0 ? configContracts : void 0;
}
//#endregion
//#region src/plugins/manifest-model-provider-normalizers.ts
const MAX_SECRET_PROVIDER_EXEC_ARGS = 128;
const MAX_SECRET_PROVIDER_EXEC_ARG_BYTES = 1024;
const MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS = 12e4;
const MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES = 20 * 1024 * 1024;
const MAX_SECRET_PROVIDER_EXEC_PASS_ENV = 128;
const SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER = "${node}";
function normalizeManifestModelSupport(value) {
	if (!isRecord(value)) return;
	const modelPrefixes = normalizeTrimmedStringList(value.modelPrefixes);
	const modelPatterns = normalizeTrimmedStringList(value.modelPatterns);
	const modelSupport = {
		...modelPrefixes.length > 0 ? { modelPrefixes } : {},
		...modelPatterns.length > 0 ? { modelPatterns } : {}
	};
	return Object.keys(modelSupport).length > 0 ? modelSupport : void 0;
}
function normalizeManifestModelPricingSource(value) {
	if (value === false) return false;
	if (!isRecord(value)) return;
	const provider = normalizeProviderId(normalizeOptionalString(value.provider) ?? "");
	const modelIdTransforms = normalizeTrimmedStringList(value.modelIdTransforms).filter((entry) => entry === "version-dots");
	const source = {
		...provider ? { provider } : {},
		...value.passthroughProviderModel === true ? { passthroughProviderModel: true } : {},
		...modelIdTransforms.length > 0 ? { modelIdTransforms } : {}
	};
	return Object.keys(source).length > 0 ? source : void 0;
}
function normalizeManifestModelPricingProvider(value) {
	if (!isRecord(value)) return;
	const openRouter = normalizeManifestModelPricingSource(value.openRouter);
	const liteLLM = normalizeManifestModelPricingSource(value.liteLLM);
	const policy = {
		...typeof value.external === "boolean" ? { external: value.external } : {},
		...openRouter !== void 0 ? { openRouter } : {},
		...liteLLM !== void 0 ? { liteLLM } : {}
	};
	return Object.keys(policy).length > 0 ? policy : void 0;
}
function normalizeOwnedProviderMap(value, ownedProvidersRaw, normalizePolicy) {
	if (!isRecord(value) || !isRecord(value.providers)) return;
	const ownedProviders = new Set([...ownedProvidersRaw].map((provider) => normalizeProviderId(provider)).filter(Boolean));
	const providers = {};
	for (const [rawProviderId, rawPolicy] of Object.entries(value.providers)) {
		const providerId = normalizeProviderId(rawProviderId);
		const policy = providerId && ownedProviders.has(providerId) ? normalizePolicy(rawPolicy) : null;
		if (providerId && policy) providers[providerId] = policy;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeManifestModelPricing(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestModelPricingProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestModelIdPrefixRules(value) {
	if (!Array.isArray(value)) return;
	const rules = [];
	for (const rawRule of value) {
		if (!isRecord(rawRule)) continue;
		const modelPrefix = normalizeOptionalString(rawRule.modelPrefix);
		const prefix = normalizeOptionalString(rawRule.prefix);
		if (!modelPrefix || !prefix) continue;
		rules.push({
			modelPrefix,
			prefix
		});
	}
	return rules.length > 0 ? rules : void 0;
}
function normalizeManifestModelIdNormalizationProvider(value) {
	if (!isRecord(value)) return;
	const aliases = {};
	if (isRecord(value.aliases)) for (const [rawAlias, rawCanonical] of Object.entries(value.aliases)) {
		const alias = normalizeProviderId(rawAlias);
		const canonical = normalizeOptionalString(rawCanonical);
		if (alias && canonical) aliases[alias] = canonical;
	}
	const stripPrefixes = normalizeTrimmedStringList(value.stripPrefixes);
	const prefixWhenBare = normalizeOptionalString(value.prefixWhenBare);
	const prefixWhenBareAfterAliasStartsWith = normalizeManifestModelIdPrefixRules(value.prefixWhenBareAfterAliasStartsWith);
	const normalization = {
		...Object.keys(aliases).length > 0 ? { aliases } : {},
		...stripPrefixes.length > 0 ? { stripPrefixes } : {},
		...prefixWhenBare ? { prefixWhenBare } : {},
		...prefixWhenBareAfterAliasStartsWith ? { prefixWhenBareAfterAliasStartsWith } : {}
	};
	return Object.keys(normalization).length > 0 ? normalization : void 0;
}
function normalizeManifestModelIdNormalization(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestModelIdNormalizationProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestProviderEndpoints(value) {
	if (!Array.isArray(value)) return;
	const endpoints = [];
	for (const rawEndpoint of value) {
		if (!isRecord(rawEndpoint)) continue;
		const endpointClass = normalizeOptionalString(rawEndpoint.endpointClass);
		if (!endpointClass) continue;
		const hosts = normalizeTrimmedStringList(rawEndpoint.hosts).map((host) => host.toLowerCase());
		const hostSuffixes = normalizeTrimmedStringList(rawEndpoint.hostSuffixes).map((host) => host.toLowerCase());
		const baseUrls = normalizeTrimmedStringList(rawEndpoint.baseUrls);
		const googleVertexRegion = normalizeOptionalString(rawEndpoint.googleVertexRegion);
		const googleVertexRegionHostSuffix = normalizeOptionalString(rawEndpoint.googleVertexRegionHostSuffix)?.toLowerCase();
		if (hosts.length === 0 && hostSuffixes.length === 0 && baseUrls.length === 0) continue;
		endpoints.push({
			endpointClass,
			...hosts.length > 0 ? { hosts } : {},
			...hostSuffixes.length > 0 ? { hostSuffixes } : {},
			...baseUrls.length > 0 ? { baseUrls } : {},
			...googleVertexRegion ? { googleVertexRegion } : {},
			...googleVertexRegionHostSuffix ? { googleVertexRegionHostSuffix } : {}
		});
	}
	return endpoints.length > 0 ? endpoints : void 0;
}
function normalizeManifestProviderRequestProvider(value) {
	if (!isRecord(value)) return;
	const family = normalizeOptionalString(value.family);
	const compatibilityFamily = normalizeOptionalString(value.compatibilityFamily) === "moonshot" ? "moonshot" : void 0;
	const supportsStreamingUsage = isRecord(value.openAICompletions) ? value.openAICompletions.supportsStreamingUsage : void 0;
	const openAICompletions = typeof supportsStreamingUsage === "boolean" ? { supportsStreamingUsage } : void 0;
	const providerRequest = {
		...family ? { family } : {},
		...compatibilityFamily ? { compatibilityFamily } : {},
		...openAICompletions && Object.keys(openAICompletions).length > 0 ? { openAICompletions } : {}
	};
	return Object.keys(providerRequest).length > 0 ? providerRequest : void 0;
}
function normalizeManifestProviderRequest(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestProviderRequestProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestStringArray(value, options) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (typeof entry !== "string") continue;
		if (options?.maxLength !== void 0 && entry.length > options.maxLength) continue;
		if (options?.pattern && !options.pattern.test(entry)) continue;
		normalized.push(entry);
		if (options?.maxItems !== void 0 && normalized.length >= options.maxItems) break;
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestTrimmedStringArray(value, options) {
	const normalized = normalizeTrimmedStringList(value).filter((entry) => !options?.pattern || options.pattern.test(entry));
	const limited = options?.maxItems !== void 0 ? normalized.slice(0, options.maxItems) : normalized;
	return limited.length > 0 ? limited : void 0;
}
function normalizeManifestPositiveInteger(value, max) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max ? value : void 0;
}
function normalizeManifestSecretProviderIntegrations(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawId, rawIntegration] of Object.entries(value)) {
		const id = normalizeOptionalString(rawId) ?? "";
		if (!id || isBlockedObjectKey$1(id) || !isRecord(rawIntegration)) continue;
		const command = normalizeOptionalString(rawIntegration.command);
		if (rawIntegration.source !== "exec" || command !== SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER) continue;
		const providerAlias = normalizeOptionalString(rawIntegration.providerAlias);
		const displayName = normalizeOptionalString(rawIntegration.displayName);
		const description = normalizeOptionalString(rawIntegration.description);
		const args = normalizeManifestStringArray(rawIntegration.args, {
			maxItems: MAX_SECRET_PROVIDER_EXEC_ARGS,
			maxLength: MAX_SECRET_PROVIDER_EXEC_ARG_BYTES
		});
		const timeoutMs = normalizeManifestPositiveInteger(rawIntegration.timeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS);
		const noOutputTimeoutMs = normalizeManifestPositiveInteger(rawIntegration.noOutputTimeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS);
		const maxOutputBytes = normalizeManifestPositiveInteger(rawIntegration.maxOutputBytes, MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES);
		const env = normalizeManifestStringRecord(rawIntegration.env);
		const passEnv = normalizeManifestTrimmedStringArray(rawIntegration.passEnv, {
			maxItems: MAX_SECRET_PROVIDER_EXEC_PASS_ENV,
			pattern: ENV_SECRET_REF_ID_RE
		});
		normalized[id] = {
			...providerAlias ? { providerAlias } : {},
			...displayName ? { displayName } : {},
			...description ? { description } : {},
			source: "exec",
			command,
			...args ? { args } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...maxOutputBytes !== void 0 ? { maxOutputBytes } : {},
			...typeof rawIntegration.jsonOnly === "boolean" ? { jsonOnly: rawIntegration.jsonOnly } : {},
			...env ? { env } : {},
			...passEnv ? { passEnv } : {}
		};
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
//#endregion
//#region src/plugins/manifest-setup-normalizers.ts
function normalizeManifestActivation(value) {
	if (!isRecord(value)) return;
	const onProviders = normalizeTrimmedStringList(value.onProviders);
	const onAgentHarnesses = normalizeTrimmedStringList(value.onAgentHarnesses);
	const onCommands = normalizeTrimmedStringList(value.onCommands);
	const onChannels = normalizeTrimmedStringList(value.onChannels);
	const onRoutes = normalizeTrimmedStringList(value.onRoutes);
	const onConfigPaths = normalizeTrimmedStringList(value.onConfigPaths);
	const onStartup = typeof value.onStartup === "boolean" ? value.onStartup : void 0;
	const onCapabilities = normalizeTrimmedStringList(value.onCapabilities).filter((capability) => capability === "provider" || capability === "channel" || capability === "tool" || capability === "hook");
	const activation = {
		...onStartup !== void 0 ? { onStartup } : {},
		...onProviders.length > 0 ? { onProviders } : {},
		...onAgentHarnesses.length > 0 ? { onAgentHarnesses } : {},
		...onCommands.length > 0 ? { onCommands } : {},
		...onChannels.length > 0 ? { onChannels } : {},
		...onRoutes.length > 0 ? { onRoutes } : {},
		...onConfigPaths.length > 0 ? { onConfigPaths } : {},
		...onCapabilities.length > 0 ? { onCapabilities } : {}
	};
	return Object.keys(activation).length > 0 ? activation : void 0;
}
function normalizeManifestCliCommands(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const commands = [];
	for (const entry of value) {
		if (!isRecord(entry) || typeof entry.name !== "string" || typeof entry.description !== "string") continue;
		const name = normalizeCommandDescriptorName(entry.name);
		const description = sanitizeCommandDescriptorDescription(entry.description);
		if (!name || !description || typeof entry.hasSubcommands !== "boolean" || seen.has(name)) continue;
		seen.add(name);
		commands.push({
			name,
			description,
			hasSubcommands: entry.hasSubcommands
		});
	}
	return commands;
}
const MANIFEST_DEFAULT_ENABLEMENT_PLATFORMS = /* @__PURE__ */ new Set([
	"aix",
	"android",
	"darwin",
	"freebsd",
	"haiku",
	"linux",
	"openbsd",
	"sunos",
	"win32",
	"cygwin",
	"netbsd"
]);
function normalizeManifestDefaultPlatforms(value) {
	return normalizeTrimmedStringList(value).filter((platform) => MANIFEST_DEFAULT_ENABLEMENT_PLATFORMS.has(platform));
}
function normalizeManifestSetupProviders(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const id = normalizeOptionalString(entry.id) ?? "";
		if (!id) continue;
		const authMethods = normalizeTrimmedStringList(entry.authMethods);
		const envVars = normalizeTrimmedStringList(entry.envVars);
		const authEvidence = normalizeManifestSetupProviderAuthEvidence(entry.authEvidence);
		normalized.push({
			id,
			...authMethods.length > 0 ? { authMethods } : {},
			...envVars.length > 0 ? { envVars } : {},
			...authEvidence ? { authEvidence } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestSetupProviderAuthEvidence(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry) || entry.type !== "local-file-with-env") continue;
		const credentialMarker = normalizeOptionalString(entry.credentialMarker);
		if (!credentialMarker) continue;
		const fileEnvVar = normalizeOptionalString(entry.fileEnvVar);
		const fallbackPaths = normalizeTrimmedStringList(entry.fallbackPaths);
		if (!fileEnvVar && fallbackPaths.length === 0) continue;
		const requiresAnyEnv = normalizeTrimmedStringList(entry.requiresAnyEnv);
		const requiresAllEnv = normalizeTrimmedStringList(entry.requiresAllEnv);
		const source = normalizeOptionalString(entry.source);
		normalized.push({
			type: "local-file-with-env",
			...fileEnvVar ? { fileEnvVar } : {},
			...fallbackPaths.length > 0 ? { fallbackPaths } : {},
			...requiresAnyEnv.length > 0 ? { requiresAnyEnv } : {},
			...requiresAllEnv.length > 0 ? { requiresAllEnv } : {},
			credentialMarker,
			...source ? { source } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestSetup(value) {
	if (!isRecord(value)) return;
	const providers = normalizeManifestSetupProviders(value.providers);
	const cliBackends = normalizeTrimmedStringList(value.cliBackends);
	const configMigrations = normalizeTrimmedStringList(value.configMigrations);
	const requiresRuntime = typeof value.requiresRuntime === "boolean" ? value.requiresRuntime : void 0;
	const setup = {
		...providers ? { providers } : {},
		...cliBackends.length > 0 ? { cliBackends } : {},
		...configMigrations.length > 0 ? { configMigrations } : {},
		...requiresRuntime !== void 0 ? { requiresRuntime } : {}
	};
	return Object.keys(setup).length > 0 ? setup : void 0;
}
function normalizeManifestQaRunners(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const commandName = normalizeOptionalString(entry.commandName) ?? "";
		if (!commandName) continue;
		const description = normalizeOptionalString(entry.description) ?? "";
		normalized.push({
			commandName,
			...description ? { description } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeDashboardCapabilityBase(value, field, index) {
	if (!isRecord(value)) return `${field}[${index}] must be an object`;
	const id = normalizeOptionalString(value.id);
	const method = normalizeOptionalString(value.method);
	const description = normalizeOptionalString(value.description);
	if (!id || !/^[a-z0-9][a-z0-9._-]*$/u.test(id)) return `${field}[${index}].id must be a lowercase capability id`;
	if (!method) return `${field}[${index}].method must be a non-empty string`;
	if (!description) return `${field}[${index}].description must be a non-empty string`;
	return {
		id,
		method,
		description
	};
}
function normalizeManifestDashboard(value) {
	if (value === void 0) return { ok: true };
	if (!isRecord(value)) return {
		ok: false,
		error: "dashboard must be an object"
	};
	if (value.dataBindings !== void 0 && !Array.isArray(value.dataBindings)) return {
		ok: false,
		error: "dashboard.dataBindings must be an array"
	};
	if (value.actionVerbs !== void 0 && !Array.isArray(value.actionVerbs)) return {
		ok: false,
		error: "dashboard.actionVerbs must be an array"
	};
	const dataBindings = [];
	for (const [index, entry] of (value.dataBindings ?? []).entries()) {
		const normalized = normalizeDashboardCapabilityBase(entry, "dashboard.dataBindings", index);
		if (typeof normalized === "string") return {
			ok: false,
			error: normalized
		};
		dataBindings.push(normalized);
	}
	const actionVerbs = [];
	for (const [index, entry] of (value.actionVerbs ?? []).entries()) {
		const normalized = normalizeDashboardCapabilityBase(entry, "dashboard.actionVerbs", index);
		if (typeof normalized === "string") return {
			ok: false,
			error: normalized
		};
		const rawParamShape = isRecord(entry) ? entry.paramShape : void 0;
		if (rawParamShape !== void 0 && !isRecord(rawParamShape)) return {
			ok: false,
			error: `dashboard.actionVerbs[${index}].paramShape must be a JSON Schema object`
		};
		actionVerbs.push({
			...normalized,
			...rawParamShape ? { paramShape: rawParamShape } : {}
		});
	}
	if (dataBindings.length === 0 && actionVerbs.length === 0) return { ok: true };
	return {
		ok: true,
		dashboard: {
			...dataBindings.length > 0 ? { dataBindings } : {},
			...actionVerbs.length > 0 ? { actionVerbs } : {}
		}
	};
}
function normalizeManifestHttpsUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	try {
		const url = new URL(normalized);
		const canonical = url.toString();
		return url.protocol === "https:" && url.hostname && !url.username && !url.password && canonical.length <= 2048 ? canonical : void 0;
	} catch {
		return;
	}
}
function normalizeProviderAuthChoices(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeOptionalString(entry.provider) ?? "";
		const method = normalizeOptionalString(entry.method) ?? "";
		const choiceId = normalizeOptionalString(entry.choiceId) ?? "";
		if (!provider || !method || !choiceId) continue;
		const choiceLabel = normalizeOptionalString(entry.choiceLabel) ?? "";
		const choiceHint = normalizeOptionalString(entry.choiceHint) ?? "";
		const icon = normalizeManifestHttpsUrl(entry.icon);
		const website = normalizeManifestHttpsUrl(entry.website);
		const assistantPriority = typeof entry.assistantPriority === "number" && Number.isFinite(entry.assistantPriority) ? entry.assistantPriority : void 0;
		const assistantVisibility = entry.assistantVisibility === "manual-only" || entry.assistantVisibility === "visible" ? entry.assistantVisibility : void 0;
		const deprecatedChoiceIds = normalizeTrimmedStringList(entry.deprecatedChoiceIds);
		const groupId = normalizeOptionalString(entry.groupId) ?? "";
		const groupLabel = normalizeOptionalString(entry.groupLabel) ?? "";
		const groupHint = normalizeOptionalString(entry.groupHint) ?? "";
		const onboardingFeatured = entry.onboardingFeatured === true;
		const optionKey = normalizeOptionalString(entry.optionKey) ?? "";
		const cliFlag = normalizeOptionalString(entry.cliFlag) ?? "";
		const cliOption = normalizeOptionalString(entry.cliOption) ?? "";
		const cliDescription = normalizeOptionalString(entry.cliDescription) ?? "";
		const appGuidedSecret = entry.appGuidedSecret === true;
		const appGuidedActionLabel = normalizeOptionalString(entry.appGuidedActionLabel) ?? "";
		const appGuidedAuth = entry.appGuidedAuth === "oauth" || entry.appGuidedAuth === "device-code" ? entry.appGuidedAuth : void 0;
		const onboardingScopes = normalizeTrimmedStringList(entry.onboardingScopes).filter((scope) => scope === "text-inference" || scope === "image-generation" || scope === "music-generation");
		const appGuidedDiscovery = entry.appGuidedDiscovery === true;
		normalized.push({
			provider,
			method,
			choiceId,
			...choiceLabel ? { choiceLabel } : {},
			...choiceHint ? { choiceHint } : {},
			...icon ? { icon } : {},
			...website ? { website } : {},
			...assistantPriority !== void 0 ? { assistantPriority } : {},
			...assistantVisibility ? { assistantVisibility } : {},
			...deprecatedChoiceIds.length > 0 ? { deprecatedChoiceIds } : {},
			...groupId ? { groupId } : {},
			...groupLabel ? { groupLabel } : {},
			...groupHint ? { groupHint } : {},
			...onboardingFeatured ? { onboardingFeatured: true } : {},
			...appGuidedDiscovery ? { appGuidedDiscovery: true } : {},
			...optionKey ? { optionKey } : {},
			...cliFlag ? { cliFlag } : {},
			...cliOption ? { cliOption } : {},
			...cliDescription ? { cliDescription } : {},
			...appGuidedSecret ? { appGuidedSecret: true } : {},
			...appGuidedActionLabel ? { appGuidedActionLabel } : {},
			...appGuidedAuth ? { appGuidedAuth } : {},
			...onboardingScopes.length > 0 ? { onboardingScopes } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeConfigUiHints(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [hintPath, rawHint] of Object.entries(value)) {
		if (!isRecord(rawHint)) continue;
		const hint = { ...rawHint };
		if ("presentation" in hint && hint.presentation !== "phone-number") delete hint.presentation;
		normalized[hintPath] = hint;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeChannelConfigs(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [key, rawEntry] of Object.entries(value)) {
		const channelId = normalizeOptionalString(key) ?? "";
		if (!channelId || isBlockedObjectKey$1(channelId) || !isRecord(rawEntry)) continue;
		const schema = isRecord(rawEntry.schema) ? rawEntry.schema : null;
		if (!schema) continue;
		const uiHints = normalizeConfigUiHints(rawEntry.uiHints);
		const runtime = isRecord(rawEntry.runtime) && typeof rawEntry.runtime.safeParse === "function" ? rawEntry.runtime : void 0;
		const label = normalizeOptionalString(rawEntry.label) ?? "";
		const description = normalizeOptionalString(rawEntry.description) ?? "";
		const preferOver = normalizeTrimmedStringList(rawEntry.preferOver);
		const commandDefaults = normalizeManifestChannelCommandDefaults(rawEntry.commands);
		normalized[channelId] = {
			schema,
			...uiHints ? { uiHints } : {},
			...runtime ? { runtime } : {},
			...label ? { label } : {},
			...description ? { description } : {},
			...preferOver.length > 0 ? { preferOver } : {},
			...commandDefaults ? { commands: commandDefaults } : {}
		};
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestChannelCommandDefaults(value) {
	if (!isRecord(value)) return;
	const nativeCommandsAutoEnabled = typeof value.nativeCommandsAutoEnabled === "boolean" ? value.nativeCommandsAutoEnabled : void 0;
	const nativeSkillsAutoEnabled = typeof value.nativeSkillsAutoEnabled === "boolean" ? value.nativeSkillsAutoEnabled : void 0;
	return nativeCommandsAutoEnabled !== void 0 || nativeSkillsAutoEnabled !== void 0 ? {
		...nativeCommandsAutoEnabled !== void 0 ? { nativeCommandsAutoEnabled } : {},
		...nativeSkillsAutoEnabled !== void 0 ? { nativeSkillsAutoEnabled } : {}
	} : void 0;
}
//#endregion
//#region src/plugins/package-manifest.ts
const DEFAULT_PLUGIN_ENTRY_CANDIDATES = [
	"index.ts",
	"index.js",
	"index.mjs",
	"index.cjs"
];
function getPackageManifestMetadata(manifest) {
	if (!manifest) return;
	return manifest[MANIFEST_KEY];
}
function resolvePackageExtensionEntries(manifest) {
	const rawOpenClaw = manifest?.[MANIFEST_KEY];
	if (rawOpenClaw === void 0 || rawOpenClaw === null) return {
		status: "missing",
		entries: []
	};
	if (!isRecord(rawOpenClaw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw must be an object"
	};
	const raw = rawOpenClaw.extensions;
	if (raw === void 0 || raw === null) return {
		status: "missing",
		entries: []
	};
	if (!Array.isArray(raw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw.extensions must be an array"
	};
	const entries = [];
	for (const [index, entry] of raw.entries()) {
		const normalized = normalizeOptionalString(entry);
		if (!normalized) return {
			status: "invalid",
			entries: [],
			error: `package.json openclaw.extensions[${index}] must be a non-empty string`
		};
		entries.push(normalized);
	}
	if (entries.length === 0) return {
		status: "empty",
		entries: []
	};
	return {
		status: "ok",
		entries
	};
}
//#endregion
//#region src/plugins/manifest.ts
/** Loads and normalizes OpenClaw plugin manifests, including contracts and config schemas. */
/** Canonical plugin manifest filename inside plugin roots. */
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
const PLUGIN_MANIFEST_FILENAMES = [PLUGIN_MANIFEST_FILENAME];
const MAX_PLUGIN_MANIFEST_BYTES = 256 * 1024;
const MAX_PLUGIN_MANIFEST_LOAD_CACHE_ENTRIES = 512;
const CORE_RESERVED_PLUGIN_IDS = /* @__PURE__ */ new Set(["node-mcp"]);
const VALID_PLUGIN_KINDS = /* @__PURE__ */ new Set(["memory", "context-engine"]);
function isCoreReservedPluginId(id) {
	return CORE_RESERVED_PLUGIN_IDS.has(normalizePluginPolicyId(id));
}
const pluginManifestLoadCache = new PluginLruCache(MAX_PLUGIN_MANIFEST_LOAD_CACHE_ENTRIES);
function resolvePluginManifestPath(rootDir) {
	for (const filename of PLUGIN_MANIFEST_FILENAMES) {
		const candidate = path.join(rootDir, filename);
		if (fs.existsSync(candidate)) return candidate;
	}
	return path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
}
function buildPluginManifestLoadCacheKey(params) {
	return createPluginCacheKey([
		[
			path.resolve(params.manifestPath),
			params.rejectHardlinks,
			params.rootRealPath ?? "",
			params.stats.dev,
			params.stats.ino
		],
		params.stats.size,
		params.stats.mtimeMs,
		params.stats.ctimeMs
	]);
}
function getCachedPluginManifestLoadResult(key, stats) {
	const entry = pluginManifestLoadCache.get(key);
	if (!entry || entry.size !== stats.size || entry.mtimeMs !== stats.mtimeMs || entry.ctimeMs !== stats.ctimeMs) return;
	return entry.result;
}
function setCachedPluginManifestLoadResult(key, stats, result) {
	pluginManifestLoadCache.set(key, {
		result,
		size: stats.size,
		mtimeMs: stats.mtimeMs,
		ctimeMs: stats.ctimeMs
	});
}
function parsePluginKind(raw) {
	const values = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw : [];
	const kinds = [];
	for (const value of values) {
		if (typeof value !== "string" || !VALID_PLUGIN_KINDS.has(value)) continue;
		const kind = value;
		if (!kinds.includes(kind)) kinds.push(kind);
	}
	return kinds.length === 0 ? void 0 : kinds.length === 1 ? kinds[0] : kinds;
}
function parseManifestBackupResources(raw) {
	if (raw === void 0) return { ok: true };
	if (!Array.isArray(raw)) return {
		ok: false,
		error: "backupResources must be an array"
	};
	const resources = /* @__PURE__ */ new Map();
	for (const [index, entry] of raw.entries()) {
		if (!isRecord(entry) || Object.keys(entry).length !== 3 || !("disposition" in entry) || !("scope" in entry) || !("relativePath" in entry)) return {
			ok: false,
			error: `backupResources[${index}] must contain only disposition, scope, and relativePath`
		};
		const { disposition, scope, relativePath } = entry;
		if (disposition !== "include" && disposition !== "regenerable") return {
			ok: false,
			error: `backupResources[${index}].disposition is invalid`
		};
		if (scope !== "state" && scope !== "agent") return {
			ok: false,
			error: `backupResources[${index}].scope is invalid`
		};
		if (typeof relativePath !== "string" || !relativePath || relativePath.includes("\\") || relativePath.includes("\0") || path.posix.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath) || /^[A-Za-z][A-Za-z\d+.-]*:/.test(relativePath) || relativePath.split("/").some((segment) => !segment || segment === "." || segment === "..")) return {
			ok: false,
			error: `backupResources[${index}].relativePath must be a strict relative POSIX path`
		};
		const resource = {
			disposition,
			scope,
			relativePath
		};
		resources.set(`${scope}\0${relativePath}\0${disposition}`, resource);
	}
	return {
		ok: true,
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
function loadPluginManifest(rootDir, rejectHardlinks = true, rootRealPath) {
	const manifestPath = resolvePluginManifestPath(rootDir);
	const opened = openRootFileSync({
		absolutePath: manifestPath,
		rootPath: rootDir,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		boundaryLabel: "plugin root",
		maxBytes: MAX_PLUGIN_MANIFEST_BYTES,
		rejectHardlinks
	});
	if (!opened.ok) return matchRootFileOpenFailure(opened, {
		path: () => ({
			ok: false,
			error: `plugin manifest not found: ${manifestPath}`,
			manifestPath
		}),
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	const stats = opened.stat;
	const cacheKey = buildPluginManifestLoadCacheKey({
		manifestPath,
		rejectHardlinks,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		stats
	});
	const cached = getCachedPluginManifestLoadResult(cacheKey, stats);
	if (cached) {
		fs.closeSync(opened.fd);
		return cached;
	}
	const cacheResult = (result) => {
		setCachedPluginManifestLoadResult(cacheKey, stats, result);
		return result;
	};
	let raw;
	try {
		raw = parseJsonWithJson5Fallback(fs.readFileSync(opened.fd, "utf-8"));
	} catch (err) {
		return cacheResult({
			ok: false,
			error: `failed to parse plugin manifest: ${String(err)}`,
			manifestPath
		});
	} finally {
		fs.closeSync(opened.fd);
	}
	if (!isRecord(raw)) return cacheResult({
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	});
	const id = normalizeOptionalString(raw.id) ?? "";
	if (!id) return cacheResult({
		ok: false,
		error: "plugin manifest requires id",
		manifestPath
	});
	if (isCoreReservedPluginId(id)) return cacheResult({
		ok: false,
		error: `plugin manifest id "${id}" is reserved by OpenClaw core`,
		manifestPath
	});
	const configSchema = isRecord(raw.configSchema) ? raw.configSchema : null;
	if (!configSchema) return cacheResult({
		ok: false,
		error: "plugin manifest requires configSchema",
		manifestPath
	});
	const backupResources = parseManifestBackupResources(raw.backupResources);
	if (!backupResources.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest backupResources: ${backupResources.error}`,
		manifestPath,
		diagnosticCode: "backup-resource-declaration-invalid"
	});
	const requiresPlugins = normalizeTrimmedStringList(raw.requiresPlugins);
	const enabledByDefaultOnPlatforms = normalizeManifestDefaultPlatforms(raw.enabledByDefaultOnPlatforms);
	const legacyPluginIds = normalizeTrimmedStringList(raw.legacyPluginIds);
	const autoEnableWhenConfiguredProviders = normalizeTrimmedStringList(raw.autoEnableWhenConfiguredProviders);
	const providers = normalizeTrimmedStringList(raw.providers);
	const cliBackends = normalizeTrimmedStringList(raw.cliBackends);
	const rawDoctorContract = isRecord(raw.doctorContract) ? raw.doctorContract : void 0;
	const doctorContract = rawDoctorContract ? Object.fromEntries([
		"configRepair",
		"resolveSessionStoreAgentIds",
		"sessionRouteStateOwners",
		"stateMigrations"
	].flatMap((key) => typeof rawDoctorContract[key] === "boolean" ? [[key, rawDoctorContract[key]]] : [])) : void 0;
	const manifestBeforeDashboard = {
		id,
		configSchema,
		...backupResources.resources !== void 0 ? { backupResources: backupResources.resources } : {},
		...requiresPlugins.length > 0 ? { requiresPlugins } : {},
		...raw.enabledByDefault === true ? { enabledByDefault: true } : {},
		...enabledByDefaultOnPlatforms.length > 0 ? { enabledByDefaultOnPlatforms } : {},
		...legacyPluginIds.length > 0 ? { legacyPluginIds } : {},
		...autoEnableWhenConfiguredProviders.length > 0 ? { autoEnableWhenConfiguredProviders } : {},
		kind: parsePluginKind(raw.kind),
		channels: normalizeTrimmedStringList(raw.channels),
		providers,
		providerCatalogEntry: normalizeOptionalString(raw.providerCatalogEntry),
		modelSupport: normalizeManifestModelSupport(raw.modelSupport),
		modelCatalog: normalizeModelCatalog(raw.modelCatalog, { ownedProviders: /* @__PURE__ */ new Set([...providers, ...cliBackends]) }),
		modelPricing: normalizeManifestModelPricing(raw.modelPricing, { ownedProviders: new Set(providers) }),
		modelIdNormalization: normalizeManifestModelIdNormalization(raw.modelIdNormalization, { ownedProviders: new Set(providers) }),
		providerEndpoints: normalizeManifestProviderEndpoints(raw.providerEndpoints),
		providerRequest: normalizeManifestProviderRequest(raw.providerRequest, { ownedProviders: new Set(providers) }),
		secretProviderIntegrations: normalizeManifestSecretProviderIntegrations(raw.secretProviderIntegrations),
		cliBackends,
		syntheticAuthRefs: normalizeTrimmedStringList(raw.syntheticAuthRefs),
		nonSecretAuthMarkers: normalizeTrimmedStringList(raw.nonSecretAuthMarkers),
		commandAliases: normalizeManifestCommandAliases(raw.commandAliases),
		cliCommands: normalizeManifestCliCommands(raw.cliCommands),
		providerUsageAuthEnvVars: normalizeStringListRecord(raw.providerUsageAuthEnvVars),
		providerAuthAliases: normalizeManifestStringRecord(raw.providerAuthAliases),
		providerAuthChoices: normalizeProviderAuthChoices(raw.providerAuthChoices),
		activation: normalizeManifestActivation(raw.activation),
		setup: normalizeManifestSetup(raw.setup),
		doctorContract,
		sessionRouteStateOwners: raw.sessionRouteStateOwners === void 0 ? void 0 : coerceDoctorSessionRouteStateOwners(raw.sessionRouteStateOwners),
		qaRunners: normalizeManifestQaRunners(raw.qaRunners)
	};
	const dashboardResult = normalizeManifestDashboard(raw.dashboard);
	if (!dashboardResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest dashboard: ${dashboardResult.error}`,
		manifestPath
	});
	return cacheResult({
		ok: true,
		manifest: {
			...manifestBeforeDashboard,
			dashboard: dashboardResult.dashboard,
			mcpServers: normalizeManifestMcpServers(raw.mcpServers),
			skills: normalizeTrimmedStringList(raw.skills),
			name: normalizeOptionalString(raw.name),
			description: normalizeOptionalString(raw.description),
			catalog: normalizeManifestCatalog(raw.catalog),
			icon: normalizeOptionalString(raw.icon),
			version: normalizeOptionalString(raw.version),
			uiHints: normalizeConfigUiHints(raw.uiHints),
			contracts: normalizeManifestContracts(raw.contracts),
			mediaUnderstandingProviderMetadata: normalizeMediaUnderstandingProviderMetadata(raw.mediaUnderstandingProviderMetadata),
			imageGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.imageGenerationProviderMetadata),
			videoGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.videoGenerationProviderMetadata),
			musicGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.musicGenerationProviderMetadata),
			toolMetadata: normalizePluginToolMetadata(raw.toolMetadata),
			configContracts: normalizeManifestConfigContracts(raw.configContracts),
			channelConfigs: normalizeChannelConfigs(raw.channelConfigs)
		},
		manifestPath
	});
}
//#endregion
export { getPackageManifestMetadata as a, normalizeManifestChannelCommandDefaults as c, normalizeModelCatalogProviderRows as d, MODEL_CATALOG_APIS as f, DEFAULT_PLUGIN_ENTRY_CANDIDATES as i, coerceDoctorSessionRouteStateOwners as l, isCoreReservedPluginId as n, resolvePackageExtensionEntries as o, MODEL_CATALOG_THINKING_LEVELS as p, loadPluginManifest as r, normalizeManifestActivation as s, PLUGIN_MANIFEST_FILENAME as t, normalizeModelCatalog as u };
