import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-contract";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { DEFAULT_SEARCH_COUNT, buildSearchCacheKey, readCachedSearchPayload, readPositiveIntegerParam, readStringArrayParam, readStringParam, resolveSearchCacheTtlMs, resolveSearchTimeoutSeconds, resolveSiteName, wrapWebContent, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { normalizeBoundedOptionalString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/parallel/src/parallel-free-web-search-provider.shared.ts
const PARALLEL_FREE_ONBOARDING_SCOPES = ["text-inference"];
function createParallelFreeWebSearchProviderBase() {
	return {
		id: "parallel-free",
		label: "Parallel Search (Free)",
		hint: "Free web search via Parallel's hosted Search MCP — no API key required",
		onboardingScopes: [...PARALLEL_FREE_ONBOARDING_SCOPES],
		requiresCredential: false,
		envVars: [],
		placeholder: "(no key needed)",
		signupUrl: "https://parallel.ai",
		docsUrl: "https://docs.openclaw.ai/tools/parallel-search",
		credentialPath: "",
		...createWebSearchProviderContractFields({
			credentialPath: "",
			searchCredential: {
				type: "scoped",
				scopeId: "parallel-free"
			},
			selectionPluginId: "parallel"
		})
	};
}
//#endregion
//#region extensions/parallel/src/parallel-search-normalize.ts
const PARALLEL_MAX_SEARCH_COUNT$1 = 40;
const PARALLEL_MAX_SEARCH_QUERY_CHARS$1 = 200;
const PARALLEL_MAX_OBJECTIVE_CHARS$1 = 5e3;
const PARALLEL_MAX_SEARCH_QUERIES$1 = 5;
const PARALLEL_SESSION_ID_MAX_LENGTH = 1e3;
const PARALLEL_CLIENT_MODEL_MAX_LENGTH = 100;
const normalizeParallelSessionId = normalizeBoundedOptionalString;
function normalizeParallelSearchRequest(args, configuredCount, sessionIdMaxLength) {
	const objective = normalizeParallelObjective(readStringParam(args, "objective"));
	const cliQuery = normalizeParallelObjective(readStringParam(args, "query"));
	let searchQueries = normalizeParallelSearchQueries(readStringArrayParam(args, "search_queries"));
	if (searchQueries.length === 0 && cliQuery) searchQueries = normalizeParallelSearchQueries([cliQuery]);
	if (searchQueries.length === 0) return { error: invalidSearchQueriesPayload() };
	return {
		objective,
		searchQueries,
		count: resolveParallelSearchCount(args, configuredCount),
		sessionId: normalizeParallelSessionId(readStringParam(args, "session_id"), sessionIdMaxLength),
		clientModel: normalizeParallelClientModel(readStringParam(args, "client_model"))
	};
}
async function executeParallelSearchRequest(params) {
	const request = normalizeParallelSearchRequest(params.args, params.searchConfig?.maxResults, params.provider === "parallel" ? PARALLEL_SESSION_ID_MAX_LENGTH : 100);
	if ("error" in request) return request.error;
	const cacheKey = buildParallelCacheKey({
		endpoint: params.endpoint,
		...request
	});
	const cached = readCachedSearchPayload(cacheKey);
	if (cached) return cached;
	const start = Date.now();
	const response = await params.search(request, resolveSearchTimeoutSeconds(params.searchConfig));
	params.signal?.throwIfAborted();
	const payload = buildParallelSearchPayload({
		provider: params.provider,
		objective: request.objective,
		searchQueries: request.searchQueries,
		response,
		start
	});
	writeCachedSearchPayload(cacheKey, request.sessionId ? payload : stripParallelGeneratedSessionId(payload), resolveSearchCacheTtlMs(params.searchConfig));
	return payload;
}
function resolveParallelSearchCount(args, configuredCount) {
	return resolveIntegerOption(readPositiveIntegerParam(args, "count", {
		max: PARALLEL_MAX_SEARCH_COUNT$1,
		message: `count must be an integer from 1 to ${PARALLEL_MAX_SEARCH_COUNT$1}.`
	}) ?? (typeof configuredCount === "number" ? configuredCount : DEFAULT_SEARCH_COUNT), DEFAULT_SEARCH_COUNT, {
		min: 1,
		max: PARALLEL_MAX_SEARCH_COUNT$1
	});
}
function normalizeParallelObjective(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return trimmed.length <= PARALLEL_MAX_OBJECTIVE_CHARS$1 ? trimmed : truncateUtf16Safe(trimmed, PARALLEL_MAX_OBJECTIVE_CHARS$1);
}
function normalizeParallelClientModel(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return trimmed.length <= PARALLEL_CLIENT_MODEL_MAX_LENGTH ? trimmed : truncateUtf16Safe(trimmed, PARALLEL_CLIENT_MODEL_MAX_LENGTH);
}
function normalizeParallelSearchQueries(value) {
	const candidates = Array.isArray(value) ? value : [];
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const entry of candidates) {
		if (typeof entry !== "string") continue;
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const capped = trimmed.length <= PARALLEL_MAX_SEARCH_QUERY_CHARS$1 ? trimmed : truncateUtf16Safe(trimmed, PARALLEL_MAX_SEARCH_QUERY_CHARS$1);
		if (seen.has(capped)) continue;
		seen.add(capped);
		out.push(capped);
		if (out.length === PARALLEL_MAX_SEARCH_QUERIES$1) break;
	}
	return out;
}
function invalidSearchQueriesPayload() {
	return {
		error: "invalid_search_queries",
		message: "search_queries must be a non-empty array of keyword strings (max 5, max 200 chars each). See https://docs.parallel.ai/search/best-practices.",
		docs: "https://docs.openclaw.ai/tools/parallel-search"
	};
}
function normalizeParallelResults(payload) {
	if (!payload || typeof payload !== "object") return [];
	const results = payload.results;
	if (!Array.isArray(results)) return [];
	return results.filter((entry) => Boolean(entry && typeof entry === "object" && !Array.isArray(entry)));
}
/** Maps a Parallel v1 response into wrapped `web_search` result entries. */
function mapParallelResults(response) {
	return normalizeParallelResults(response).map((entry) => {
		const title = typeof entry.title === "string" ? entry.title : "";
		const url = typeof entry.url === "string" ? entry.url : "";
		const published = typeof entry.publish_date === "string" && entry.publish_date ? entry.publish_date : void 0;
		const excerpts = Array.isArray(entry.excerpts) ? entry.excerpts.filter((e) => typeof e === "string").map((e) => wrapWebContent(e, "web_search")) : [];
		const description = excerpts.join("\n\n");
		return Object.assign({
			title: title ? wrapWebContent(title, "web_search") : "",
			url,
			description,
			siteName: resolveSiteName(url) || void 0
		}, published ? { published } : {}, excerpts.length > 0 ? { excerpts } : {});
	});
}
function buildParallelSearchPayload(params) {
	const results = mapParallelResults(params.response);
	const payload = {
		...params.objective ? { objective: params.objective } : {},
		searchQueries: params.searchQueries,
		provider: params.provider,
		count: results.length,
		tookMs: Date.now() - params.start,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: params.provider,
			wrapped: true
		},
		results
	};
	if (typeof params.response.search_id === "string") payload.searchId = params.response.search_id;
	if (typeof params.response.session_id === "string") payload.sessionId = params.response.session_id;
	if (Array.isArray(params.response.warnings) && params.response.warnings.length > 0) payload.warnings = params.response.warnings;
	if (Array.isArray(params.response.usage) && params.response.usage.length > 0) payload.usage = params.response.usage;
	return payload;
}
/**
* Drops a Parallel-generated `sessionId` before caching. Identical queries from
* unrelated tasks would otherwise share that id; caller-supplied session ids are
* part of the cache key, so a cache hit only ever returns the matching id.
*/
function stripParallelGeneratedSessionId(payload) {
	if (!("sessionId" in payload)) return payload;
	const { sessionId: _omitted, ...rest } = payload;
	return rest;
}
function buildParallelCacheKey(params) {
	return buildSearchCacheKey([
		"parallel",
		params.endpoint,
		params.objective,
		params.searchQueries.join("\0"),
		params.count,
		params.sessionId,
		params.clientModel
	]);
}
//#endregion
//#region extensions/parallel/src/parallel-web-search-provider.shared.ts
const PARALLEL_CREDENTIAL_PATH = "plugins.entries.parallel.config.webSearch.apiKey";
const PARALLEL_ONBOARDING_SCOPES = ["text-inference"];
function createParallelWebSearchProviderBase() {
	return {
		id: "parallel",
		label: "Parallel Search",
		hint: "LLM-optimized dense excerpts from web sources",
		onboardingScopes: [...PARALLEL_ONBOARDING_SCOPES],
		credentialLabel: "Parallel API key",
		envVars: ["PARALLEL_API_KEY"],
		placeholder: "par-...",
		signupUrl: "https://platform.parallel.ai",
		docsUrl: "https://docs.openclaw.ai/tools/parallel-search",
		autoDetectOrder: 75,
		credentialPath: PARALLEL_CREDENTIAL_PATH,
		...createWebSearchProviderContractFields({
			credentialPath: PARALLEL_CREDENTIAL_PATH,
			searchCredential: {
				type: "scoped",
				scopeId: "parallel"
			},
			configuredCredential: { pluginId: "parallel" },
			selectionPluginId: "parallel"
		})
	};
}
//#endregion
//#region extensions/parallel/src/parallel-web-search-provider.ts
const PARALLEL_MAX_SEARCH_COUNT = 40;
const PARALLEL_MAX_SEARCH_QUERIES = 5;
const PARALLEL_MAX_SEARCH_QUERY_CHARS = 200;
const PARALLEL_MAX_OBJECTIVE_CHARS = 5e3;
const PARALLEL_MAX_SESSION_ID_CHARS = 1e3;
const PARALLEL_MAX_CLIENT_MODEL_CHARS = 100;
const loadParallelWebSearchRuntime = createLazyRuntimeModule(() => import("./parallel-web-search-provider.runtime-BIJCSTMR.js"));
const ParallelSearchSchema = {
	type: "object",
	properties: {
		objective: {
			type: "string",
			description: "Natural-language description of the underlying question or goal driving the search. Should be self-contained with enough context to understand the intent. Used together with search_queries to focus results on the most relevant content.",
			maxLength: PARALLEL_MAX_OBJECTIVE_CHARS
		},
		search_queries: {
			type: "array",
			description: "Concise keyword search queries, 3-6 words each. Provide 2-3 diverse queries for best results (max 5). Vary entity names, synonyms, and angles. Each query is a keyword phrase, not a sentence; do not use site: operators.",
			items: {
				type: "string",
				maxLength: PARALLEL_MAX_SEARCH_QUERY_CHARS
			},
			minItems: 1,
			maxItems: PARALLEL_MAX_SEARCH_QUERIES
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-40).",
			minimum: 1,
			maximum: PARALLEL_MAX_SEARCH_COUNT
		},
		session_id: {
			type: "string",
			description: "Optional session id returned by an earlier Parallel search. Pass it on follow-up searches that are part of the same task to keep Parallel's server-side context grouped (look for `sessionId` in the prior tool result).",
			maxLength: PARALLEL_MAX_SESSION_ID_CHARS
		},
		client_model: {
			type: "string",
			description: "The identifier of the LLM model making this tool call (e.g. 'claude-opus-4-7', 'gpt-5.6-sol', 'gemini-3.1-pro'). Pass the exact active model slug verbatim; never shorten or substitute a family alias like 'gpt-5'. Lets Parallel tailor default settings for your model's capabilities.",
			maxLength: PARALLEL_MAX_CLIENT_MODEL_CHARS
		}
	},
	required: ["objective", "search_queries"],
	additionalProperties: false
};
function createParallelWebSearchProvider() {
	return {
		...createParallelWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using Parallel. Returns ranked, LLM-optimized dense excerpts from web sources. Pass an `objective` describing the underlying question along with 2-3 short keyword `search_queries` (Parallel's recommended pairing). For multi-step research, thread the prior result's `sessionId` back in as `session_id` to keep Parallel's context grouped.",
			parameters: ParallelSearchSchema,
			execute: async (args, context) => {
				context?.signal?.throwIfAborted();
				const { executeParallelWebSearchProviderTool } = await loadParallelWebSearchRuntime();
				return await executeParallelWebSearchProviderTool(ctx, args, context?.signal);
			}
		})
	};
}
//#endregion
//#region extensions/parallel/src/parallel-free-web-search-provider.ts
const ParallelFreeSearchSchema = {
	...ParallelSearchSchema,
	properties: {
		...ParallelSearchSchema.properties,
		session_id: {
			...ParallelSearchSchema.properties.session_id,
			maxLength: 100
		}
	}
};
const loadParallelFreeWebSearchRuntime = createLazyRuntimeModule(() => import("./parallel-free-web-search-provider.runtime-C5mKRTmw.js"));
function createParallelFreeWebSearchProvider() {
	return {
		...createParallelFreeWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using Parallel's free Search MCP (no API key). Returns ranked, LLM-optimized dense excerpts from web sources. Pass an `objective` describing the underlying question along with 2-3 short keyword `search_queries` (Parallel's recommended pairing). For multi-step research, thread the prior result's `sessionId` back in as `session_id` to keep Parallel's context grouped.",
			parameters: ParallelFreeSearchSchema,
			execute: async (args, context) => {
				const { executeParallelFreeWebSearchProviderTool } = await loadParallelFreeWebSearchRuntime();
				return await executeParallelFreeWebSearchProviderTool(ctx, args, context?.signal);
			}
		})
	};
}
//#endregion
export { normalizeParallelClientModel as a, normalizeParallelSearchQueries as c, executeParallelSearchRequest as i, normalizeParallelSessionId as l, createParallelWebSearchProvider as n, normalizeParallelObjective as o, buildParallelCacheKey as r, normalizeParallelResults as s, createParallelFreeWebSearchProvider as t, resolveParallelSearchCount as u };
