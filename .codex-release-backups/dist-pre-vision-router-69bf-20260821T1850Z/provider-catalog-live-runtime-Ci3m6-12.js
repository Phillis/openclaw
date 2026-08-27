import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { d as readResponseWithLimit, i as cancelUnreadResponseBody } from "./http-body-B0Ouh_va.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-CQ4RdJXm.js";
import { c as retainSafeHeadersForCrossOriginRedirect, r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-DzAepWRR.js";
import "./ssrf-runtime-D3OHU1vE.js";
import { d as buildSingleProviderApiKeyCatalog, o as getCachedLiveCatalogValue } from "./provider-catalog-shared-DQtlsVxE.js";
//#region src/plugin-sdk/provider-catalog-live-normalize.internal.ts
function readLiveModelCatalogRecord(body) {
	return asOptionalRecord(body);
}
function readLiveModelCatalogStringField(row, keys) {
	const record = readLiveModelCatalogRecord(row);
	for (const key of typeof keys === "string" ? [keys] : keys) {
		const value = record?.[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
}
function readLiveModelCatalogBooleanField(row, keys) {
	const record = readLiveModelCatalogRecord(row);
	for (const key of typeof keys === "string" ? [keys] : keys) {
		const value = record?.[key];
		if (typeof value === "boolean") return value;
	}
}
function readLiveModelCatalogPositiveSafeIntegerField(row, keys) {
	const record = readLiveModelCatalogRecord(row);
	for (const key of typeof keys === "string" ? [keys] : keys) {
		const value = record?.[key];
		if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
	}
}
function readLiveModelPositiveIntegerFromRecords(records, keys) {
	for (const record of records) {
		const value = readLiveModelCatalogPositiveSafeIntegerField(record, keys);
		if (value !== void 0) return value;
	}
}
function readLiveModelStringArray(records, keys) {
	for (const record of records) for (const key of keys) {
		const value = record?.[key];
		if (Array.isArray(value)) {
			const strings = value.filter((entry) => typeof entry === "string").map((entry) => entry.trim().toLowerCase()).filter(Boolean);
			if (strings.length > 0) return strings;
		}
	}
	return [];
}
function isSafeLiveModelId(value) {
	if (!value || value.length > 512) return false;
	for (const char of value) {
		const codePoint = char.codePointAt(0) ?? 0;
		if (codePoint <= 32 || codePoint === 127) return false;
	}
	return true;
}
const NON_TEXT_MODEL_ID_PATTERN = /(?:^|[/_:.-])(?:embed(?:ding)?|rerank(?:er)?|whisper|transcri(?:be|ption)|tts|speech|moderation|guard|gpt-image|dall-e|flux|sdxl|stable-diffusion|imagen|image-gen(?:eration)?|text-to-image|veo|sora|video-gen(?:eration)?|text-to-video)(?:$|[/_:.-])/i;
function rowAdvertisesNonTextModel(record, nestedRecords) {
	const outputModalities = readLiveModelStringArray([record, ...nestedRecords], [
		"output_modalities",
		"outputModalities",
		"output"
	]);
	if (outputModalities.length > 0 && !outputModalities.includes("text")) return true;
	const kind = readLiveModelCatalogStringField(record, [
		"type",
		"task",
		"model_type",
		"modelType",
		"pipeline_tag"
	]);
	return Boolean(kind && NON_TEXT_MODEL_ID_PATTERN.test(kind));
}
function rowAdvertisesChatModel(record, nestedRecords) {
	const explicitChatCapability = readLiveModelCatalogBooleanField(nestedRecords[0], [
		"completion_chat",
		"chat_completion",
		"chatCompletion"
	]);
	if (explicitChatCapability !== void 0) return explicitChatCapability;
	if (readLiveModelStringArray([record, ...nestedRecords], [
		"capabilities",
		"features",
		"endpoints",
		"supported_endpoints"
	]).some((value) => /(?:^|[./:])(?:chat|responses?|generate|completions?)(?:$|[./:])|(?:^|[./:_-])(?:chat[-_]completions?|completions?[-_]chat|text[-_]generation)(?:$|[./:_-])/.test(value))) return true;
}
function commonPrefixLength(left, right) {
	const limit = Math.min(left.length, right.length);
	let index = 0;
	while (index < limit && left[index] === right[index]) index += 1;
	return index;
}
function findLiveModelTemplate(modelId, models) {
	const exact = models.find((model) => model.id === modelId);
	if (exact) return exact;
	const normalizedId = modelId.toLowerCase();
	let best;
	let bestScore = 0;
	for (const model of models) {
		const score = commonPrefixLength(normalizedId, model.id.toLowerCase());
		if (score > bestScore) {
			best = model;
			bestScore = score;
		}
	}
	return bestScore >= 4 ? best : void 0;
}
function inferLiveModelReasoning(modelId) {
	return /(?:^|[/_:.-])(?:reason(?:er|ing)?|thinking|deepseek-r1|o[134](?:-mini)?|gpt-5)(?:$|[/_:.-])/i.test(modelId);
}
function buildOpenAICompatibleLiveModel(row, fallback, acceptUnknownModel) {
	const record = readLiveModelCatalogRecord(row);
	const id = readLiveModelCatalogStringField(record, [
		"id",
		"model",
		"model_name",
		"modelName"
	]);
	if (!record || !id || !isSafeLiveModelId(id)) return;
	if (readLiveModelCatalogBooleanField(record, [
		"active",
		"enabled",
		"available"
	]) === false) return;
	if (readLiveModelCatalogBooleanField(record, ["archived", "deprecated"]) === true) return;
	const capabilities = readLiveModelCatalogRecord(record.capabilities);
	const architecture = readLiveModelCatalogRecord(record.architecture);
	const topProvider = readLiveModelCatalogRecord(record.top_provider);
	const modelInfo = readLiveModelCatalogRecord(record.model_info);
	const nestedRecords = [
		capabilities,
		architecture,
		topProvider,
		modelInfo
	];
	const advertisedChatCapability = rowAdvertisesChatModel(record, nestedRecords);
	if (advertisedChatCapability === false || advertisedChatCapability !== true && (rowAdvertisesNonTextModel(record, nestedRecords) || NON_TEXT_MODEL_ID_PATTERN.test(id))) return;
	const exact = fallback.models.find((model) => model.id === id);
	if (exact) return exact;
	if (acceptUnknownModel && !acceptUnknownModel({
		id,
		record
	})) return;
	const template = findLiveModelTemplate(id, fallback.models);
	const inputModalities = readLiveModelStringArray([
		record,
		architecture,
		capabilities,
		modelInfo
	], [
		"input_modalities",
		"inputModalities",
		"input"
	]);
	const contextWindow = readLiveModelPositiveIntegerFromRecords([
		record,
		topProvider,
		capabilities,
		modelInfo
	], [
		"context_window",
		"contextWindow",
		"context_length",
		"contextLength",
		"context_size",
		"contextSize",
		"max_context_length",
		"maxModelLen",
		"max_model_len",
		"max_input_tokens",
		"maxInputTokens"
	]) ?? fallback.contextWindow ?? template?.contextWindow ?? 128e3;
	const maxTokens = readLiveModelPositiveIntegerFromRecords([
		record,
		topProvider,
		capabilities,
		modelInfo
	], [
		"max_completion_tokens",
		"maxCompletionTokens",
		"max_output_tokens",
		"maxOutputTokens",
		"output_token_limit",
		"outputTokenLimit",
		"max_tokens",
		"maxTokens"
	]) ?? fallback.maxTokens ?? template?.maxTokens ?? Math.min(contextWindow, 8192);
	const explicitReasoning = readLiveModelCatalogBooleanField(record, [
		"reasoning",
		"supports_reasoning",
		"supportsReasoning",
		"thinking"
	]);
	const featureNames = readLiveModelStringArray([
		record,
		capabilities,
		modelInfo
	], [
		"features",
		"supported_parameters",
		"supportedParameters"
	]);
	const reasoning = explicitReasoning ?? (featureNames.some((feature) => /reason|think/.test(feature)) || template?.reasoning === true || inferLiveModelReasoning(id));
	const input = inputModalities.includes("image") ? ["text", "image"] : template?.input ?? ["text"];
	return {
		id,
		name: readLiveModelCatalogStringField(record, [
			"display_name",
			"displayName",
			"name"
		]) ?? id,
		...template?.api ? { api: template.api } : {},
		reasoning,
		input,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow,
		maxTokens,
		...template?.compat ? { compat: template.compat } : {},
		...template?.thinkingLevelMap ? { thinkingLevelMap: template.thinkingLevelMap } : {}
	};
}
function buildOpenAICompatibleLiveModels(rows, fallback, acceptUnknownModel) {
	const models = rows.map((row) => buildOpenAICompatibleLiveModel(row, fallback, acceptUnknownModel)).filter((model) => Boolean(model));
	return [...new Map(models.map((model) => [model.id, model])).values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
//#endregion
//#region src/plugin-sdk/provider-catalog-live-runtime.ts
const LIVE_MODEL_CATALOG_BODY_MAX_BYTES = 4 * 1024 * 1024;
const LIVE_MODEL_CATALOG_MAX_PAGES = 50;
var LiveModelCatalogHttpError = class extends Error {
	constructor(providerId, status) {
		super(`${providerId} model discovery failed: HTTP ${status}`);
		this.name = "LiveModelCatalogHttpError";
		this.status = status;
	}
};
function readDefaultLiveModelCatalogRows(body) {
	if (Array.isArray(body)) return body;
	if (body && typeof body === "object" && Array.isArray(body.data)) return body.data;
	throw new Error("Live model catalog response must be an array or { data: [] }");
}
function readDefaultLiveModelId(row) {
	if (!row || typeof row !== "object" || Array.isArray(row)) return;
	const candidate = row;
	if (candidate.object !== void 0 && candidate.object !== "model") return;
	if (typeof candidate.id !== "string") return;
	return candidate.id.trim() || void 0;
}
function normalizeLiveModelCatalogRequestApiKey(value) {
	const trimmed = value?.trim();
	if (!trimmed || isNonSecretApiKeyMarker(trimmed)) return;
	return trimmed;
}
function selectLiveModelCatalogRequestApiKey(ctx) {
	return normalizeLiveModelCatalogRequestApiKey(ctx.discoveryApiKey) ?? normalizeLiveModelCatalogRequestApiKey(ctx.apiKey);
}
function buildDefaultLiveModelCatalogHeaders(ctx) {
	const requestApiKey = selectLiveModelCatalogRequestApiKey(ctx);
	return {
		Accept: "application/json",
		...requestApiKey ? { Authorization: `Bearer ${requestApiKey}` } : {}
	};
}
function buildHeaders(params, safeReplayHeaders) {
	const headers = safeReplayHeaders ? new Headers(safeReplayHeaders) : new Headers((params.buildRequestHeaders ?? buildDefaultLiveModelCatalogHeaders)({
		apiKey: normalizeLiveModelCatalogRequestApiKey(params.apiKey),
		discoveryApiKey: selectLiveModelCatalogRequestApiKey(params)
	}));
	if (!headers.has("accept")) headers.set("accept", "application/json");
	return headers;
}
async function readLiveModelCatalogJson(response, timeoutMs) {
	const buffer = await readResponseWithLimit(response, LIVE_MODEL_CATALOG_BODY_MAX_BYTES, {
		chunkTimeoutMs: timeoutMs,
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Live model catalog response exceeded ${maxBytes} bytes (${size} bytes received)`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Live model catalog response stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
}
function readLiveModelCatalogNextUrl(body) {
	const record = readLiveModelCatalogRecord(body);
	if (!record) return;
	const links = readLiveModelCatalogRecord(record.links);
	return normalizeOptionalString(record.next) ?? normalizeOptionalString(links?.next);
}
function readLiveModelCatalogCursor(body) {
	const record = readLiveModelCatalogRecord(body);
	if (!record || record.has_more === false) return;
	const nextCursor = normalizeOptionalString(record.next_cursor);
	if (nextCursor) return {
		name: "after",
		value: nextCursor
	};
	const lastId = normalizeOptionalString(record.last_id) ?? normalizeOptionalString(record.lastId);
	if (lastId) return {
		name: "after_id",
		value: lastId
	};
	const nextPageToken = normalizeOptionalString(record.nextPageToken);
	if (nextPageToken) return {
		name: "pageToken",
		value: nextPageToken
	};
	const nextPageTokenSnakeCase = normalizeOptionalString(record.next_page_token);
	return nextPageTokenSnakeCase ? {
		name: "page_token",
		value: nextPageTokenSnakeCase
	} : void 0;
}
function bodyAdvertisesMoreLiveModelCatalogPages(body) {
	const record = readLiveModelCatalogRecord(body);
	if (!record || record.has_more === false) return false;
	return Boolean(record.has_more === true || readLiveModelCatalogNextUrl(body) || normalizeOptionalString(record.next_cursor) || normalizeOptionalString(record.nextPageToken) || normalizeOptionalString(record.next_page_token));
}
function tryParseUrl(url, base) {
	try {
		return new URL(url, base);
	} catch {
		return;
	}
}
function resolveLiveModelCatalogNextPage(currentUrl, body) {
	const rawNextUrl = readLiveModelCatalogNextUrl(body);
	if (rawNextUrl) {
		const currentParsed = tryParseUrl(currentUrl);
		const nextUrl = tryParseUrl(rawNextUrl, currentUrl);
		if (nextUrl && currentParsed && nextUrl.origin === currentParsed.origin) return {
			status: "next",
			url: nextUrl.toString()
		};
		const cursor = readLiveModelCatalogCursor(body);
		if (cursor) {
			const cursorUrl = tryParseUrl(currentUrl);
			if (cursorUrl) {
				cursorUrl.searchParams.set(cursor.name, cursor.value);
				return {
					status: "next",
					url: cursorUrl.toString()
				};
			}
		}
		return { status: "incomplete" };
	}
	const cursor = readLiveModelCatalogCursor(body);
	if (cursor) {
		const nextUrl = tryParseUrl(currentUrl);
		if (nextUrl) {
			nextUrl.searchParams.set(cursor.name, cursor.value);
			return {
				status: "next",
				url: nextUrl.toString()
			};
		}
	}
	return bodyAdvertisesMoreLiveModelCatalogPages(body) ? { status: "incomplete" } : { status: "complete" };
}
async function fetchLiveProviderModelCatalogPage(params) {
	const requestHeaders = buildHeaders(params, params.safeReplayHeaders);
	const { response, finalUrl, release } = await params.fetchGuard({
		url: params.url,
		init: { headers: requestHeaders },
		signal: params.signal,
		timeoutMs: params.timeoutMs,
		policy: params.policy ?? ssrfPolicyFromHttpBaseUrlAllowedHostname(params.endpoint),
		...params.lookupFn ? { lookupFn: params.lookupFn } : {},
		...params.requireHttps !== void 0 ? { requireHttps: params.requireHttps } : {},
		auditContext: params.auditContext ?? `${params.providerId}-model-discovery`
	});
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new LiveModelCatalogHttpError(params.providerId, response.status);
		}
		const body = await readLiveModelCatalogJson(response, params.timeoutMs);
		return {
			body,
			finalUrl,
			requestHeaders,
			rows: (params.readRows ?? readDefaultLiveModelCatalogRows)(body)
		};
	} finally {
		await release();
	}
}
async function fetchLiveProviderModelRows(params) {
	const fetchGuard = params.fetchGuard ?? fetchWithSsrFGuard;
	const timeoutMs = params.timeoutMs ?? 5e3;
	const startedAt = Date.now();
	const rows = [];
	const seenPageUrls = /* @__PURE__ */ new Set();
	let pageUrl = params.endpoint;
	let safeReplayHeaders;
	for (let page = 0; page < LIVE_MODEL_CATALOG_MAX_PAGES && pageUrl; page += 1) {
		if (seenPageUrls.has(pageUrl)) break;
		const remainingTimeoutMs = timeoutMs - (Date.now() - startedAt);
		if (remainingTimeoutMs <= 0) throw new Error(`${params.providerId} model discovery exceeded ${timeoutMs}ms before the catalog completed`);
		seenPageUrls.add(pageUrl);
		const requestedPageUrl = pageUrl;
		const result = await fetchLiveProviderModelCatalogPage({
			...params,
			fetchGuard,
			url: requestedPageUrl,
			timeoutMs: remainingTimeoutMs,
			safeReplayHeaders
		});
		rows.push(...result.rows);
		const finalParsed = tryParseUrl(result.finalUrl);
		const requestedParsed = tryParseUrl(requestedPageUrl);
		if (safeReplayHeaders || !finalParsed || !requestedParsed || finalParsed.origin !== requestedParsed.origin) safeReplayHeaders = new Headers(retainSafeHeadersForCrossOriginRedirect(result.requestHeaders));
		const nextPage = resolveLiveModelCatalogNextPage(result.finalUrl, result.body);
		if (nextPage.status === "incomplete") throw new Error(`${params.providerId} model discovery did not include a supported next page before the catalog completed`);
		pageUrl = nextPage.status === "next" ? nextPage.url : void 0;
	}
	if (pageUrl) throw new Error(`${params.providerId} model discovery exceeded ${LIVE_MODEL_CATALOG_MAX_PAGES} pages before the catalog completed`);
	return rows;
}
function liveModelCatalogAuthCacheKey(params) {
	return selectLiveModelCatalogRequestApiKey(params);
}
async function getCachedLiveProviderModelRows(params) {
	return await getCachedLiveCatalogValue({
		keyParts: params.cacheKeyParts ?? [
			params.providerId,
			"model-rows",
			params.endpoint,
			liveModelCatalogAuthCacheKey(params)
		],
		ttlMs: params.ttlMs,
		load: async () => await fetchLiveProviderModelRows(params),
		shouldCache: params.shouldCacheRows
	});
}
async function fetchLiveProviderModelIds(params) {
	const rows = await fetchLiveProviderModelRows(params);
	const readModelId = params.readModelId ?? readDefaultLiveModelId;
	const seen = /* @__PURE__ */ new Set();
	const modelIds = [];
	for (const row of rows) {
		const modelId = readModelId(row);
		if (!modelId || seen.has(modelId)) continue;
		seen.add(modelId);
		modelIds.push(modelId);
	}
	return modelIds;
}
function buildProviderConfig(params, models) {
	return {
		...params.providerConfig,
		...params.apiKey ? { apiKey: params.apiKey } : {},
		models: [...models]
	};
}
async function projectCachedLiveModelRows(params) {
	const load = async (requestAuth) => {
		const rows = await getCachedLiveProviderModelRows({
			...params,
			...requestAuth,
			cacheKeyParts: requestAuth.apiKey === params.apiKey && requestAuth.discoveryApiKey === params.discoveryApiKey ? params.cacheKeyParts : void 0,
			shouldCacheRows: (candidateRows) => params.projectRows(candidateRows, params.fallback).length > 0
		});
		return params.projectRows(rows, params.fallback);
	};
	try {
		return await load({
			apiKey: params.apiKey,
			discoveryApiKey: params.discoveryApiKey
		});
	} catch (error) {
		if (params.fallbackToAnonymousOnUnauthorized && error instanceof LiveModelCatalogHttpError && error.status === 401 && (params.apiKey || params.discoveryApiKey)) return await load({
			apiKey: void 0,
			discoveryApiKey: void 0
		});
		throw error;
	}
}
async function buildLiveModelProviderConfig(params) {
	const fallback = buildProviderConfig(params, params.models);
	try {
		if (params.projectRows) {
			const models = await projectCachedLiveModelRows({
				...params,
				fallback,
				projectRows: params.projectRows
			});
			if (models.length > 0) return {
				...fallback,
				models: [...models]
			};
			return fallback;
		}
		const liveModelIds = await getCachedLiveCatalogValue({
			keyParts: params.cacheKeyParts ?? [
				params.providerId,
				"models",
				params.endpoint,
				liveModelCatalogAuthCacheKey(params)
			],
			ttlMs: params.ttlMs,
			load: async () => await fetchLiveProviderModelIds(params),
			shouldCache: (modelIds) => modelIds.length > 0
		});
		const liveModelIdSet = new Set(liveModelIds);
		const models = params.models.filter((model) => liveModelIdSet.has(model.id));
		if (models.length > 0) return buildProviderConfig(params, models);
	} catch {}
	return fallback;
}
function resolveLiveModelDiscoveryEndpoint(baseUrl, endpointPath) {
	return `${baseUrl.trim().replace(/\/+$/, "")}/${endpointPath.trim().replace(/^\/+/, "")}`;
}
function resolveFixedLiveModelDiscoveryEndpoint(baseUrl, endpoint) {
	return baseUrl.trim().replace(/\/+$/, "") === endpoint.requireBaseUrl.trim().replace(/\/+$/, "") ? endpoint.url : void 0;
}
async function buildOpenAICompatibleLiveModelProviderConfig(params) {
	const { models, ...providerConfig } = params.providerConfig;
	const fallback = {
		...params.providerConfig,
		...params.apiKey ? { apiKey: params.apiKey } : {}
	};
	const acceptUnknownModel = params.modelDiscovery?.acceptUnknownModel;
	const endpoint = params.modelDiscovery?.endpointUrl ? resolveFixedLiveModelDiscoveryEndpoint(fallback.baseUrl, params.modelDiscovery.endpointUrl) : resolveLiveModelDiscoveryEndpoint(fallback.baseUrl, params.modelDiscovery?.endpointPath ?? "models");
	if (!endpoint) return fallback;
	return await buildLiveModelProviderConfig({
		providerId: params.providerId,
		endpoint,
		providerConfig,
		models,
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		timeoutMs: params.modelDiscovery?.timeoutMs,
		ttlMs: params.modelDiscovery?.ttlMs ?? 6e4,
		auditContext: `${params.providerId}-model-discovery`,
		readRows: params.modelDiscovery?.readRows,
		buildRequestHeaders: params.modelDiscovery?.buildRequestHeaders,
		projectRows: params.modelDiscovery?.projectRows ?? ((rows, fallbackProvider) => buildOpenAICompatibleLiveModels(rows, fallbackProvider, acceptUnknownModel))
	});
}
/** Builds the shared authenticated live/static hooks for an ordered provider family. */
function buildOpenAICompatibleProviderFamilyCatalog(params) {
	return {
		catalog: {
			order: "paired",
			run: async (ctx) => {
				const auth = ctx.resolveProviderApiKey(params.credentialProviderId);
				if (!auth.apiKey) return null;
				return { providers: Object.fromEntries(await Promise.all(params.entries.map(async ({ id, buildProvider }) => [id, await buildOpenAICompatibleLiveModelProviderConfig({
					providerId: id,
					providerConfig: buildProvider(),
					apiKey: auth.apiKey,
					discoveryApiKey: auth.discoveryApiKey
				})]))) };
			},
			staticRun: params.staticCatalog
		},
		augmentModelCatalog: params.augmentModelCatalog
	};
}
async function buildOpenAICompatibleProviderCatalog(params) {
	const result = await buildSingleProviderApiKeyCatalog({
		ctx: params.ctx,
		providerId: params.providerId,
		buildProvider: params.buildProvider,
		allowExplicitBaseUrl: params.allowExplicitBaseUrl
	});
	if (!result || !("provider" in result)) return result;
	const auth = params.ctx.resolveProviderApiKey(params.providerId);
	return { provider: await buildOpenAICompatibleLiveModelProviderConfig({
		providerId: params.providerId,
		providerConfig: result.provider,
		apiKey: auth.apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		modelDiscovery: params.modelDiscovery
	}) };
}
//#endregion
export { buildOpenAICompatibleProviderFamilyCatalog as a, getCachedLiveProviderModelRows as c, readLiveModelCatalogStringField as d, buildOpenAICompatibleProviderCatalog as i, readLiveModelCatalogBooleanField as l, buildLiveModelProviderConfig as n, fetchLiveProviderModelIds as o, buildOpenAICompatibleLiveModelProviderConfig as r, fetchLiveProviderModelRows as s, LiveModelCatalogHttpError as t, readLiveModelCatalogPositiveSafeIntegerField as u };
