import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-UFPP-fbI.js";
import { o as withTrustedEnvProxyGuardedFetchMode, r as fetchWithSsrFGuard } from "./fetch-guard-Bk80Ti5l.js";
import "./fetch-runtime-ULXJgZw8.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import { n as buildLiveModelProviderConfig } from "./provider-catalog-live-runtime-DOx81j-v.js";
//#region extensions/huggingface/models.ts
const HUGGINGFACE_BASE_URL = "https://router.huggingface.co/v1";
const HUGGINGFACE_POLICY_SUFFIXES = ["cheapest", "fastest"];
const HUGGINGFACE_DISCOVERY_TIMEOUT_MS = 3e4;
const HUGGINGFACE_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const HUGGINGFACE_DEFAULT_CONTEXT_WINDOW = 131072;
const HUGGINGFACE_DEFAULT_MAX_TOKENS = 8192;
const HUGGINGFACE_MODEL_CATALOG = [
	{
		id: "deepseek-ai/DeepSeek-R1",
		name: "DeepSeek R1",
		reasoning: true,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: 3,
			output: 7,
			cacheRead: 3,
			cacheWrite: 3
		}
	},
	{
		id: "deepseek-ai/DeepSeek-V3.1",
		name: "DeepSeek V3.1",
		reasoning: false,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: .6,
			output: 1.25,
			cacheRead: .6,
			cacheWrite: .6
		}
	},
	{
		id: "openai/gpt-oss-120b",
		name: "GPT-OSS 120B",
		reasoning: false,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		}
	}
];
function isHuggingfacePolicyLocked(modelRef) {
	const ref = modelRef.trim();
	return HUGGINGFACE_POLICY_SUFFIXES.some((suffix) => ref.endsWith(`:${suffix}`) || ref === suffix);
}
function isReasoningModelHeuristic(modelId) {
	const lower = normalizeLowercaseStringOrEmpty(modelId);
	return lower.includes("r1") || lower.includes("reason") || lower.includes("thinking") || lower.includes("reasoner") || lower.includes("grok") || lower.includes("qwq");
}
function inferredMetaFromModelId(id) {
	const base = id.split("/").pop() ?? id;
	const reasoning = isReasoningModelHeuristic(id);
	return {
		name: base.replace(/-/g, " ").replace(/\b(\w)/g, (c) => c.toUpperCase()),
		reasoning
	};
}
function displayNameFromApiEntry(entry, inferredName) {
	const fromApi = typeof entry.name === "string" && entry.name.trim() || typeof entry.title === "string" && entry.title.trim() || typeof entry.display_name === "string" && entry.display_name.trim();
	if (fromApi) return fromApi;
	if (typeof entry.owned_by === "string" && entry.owned_by.trim()) {
		const base = entry.id.split("/").pop() ?? entry.id;
		return `${entry.owned_by.trim()}/${base}`;
	}
	return inferredName;
}
function readHuggingfaceModelRows(body) {
	const data = body?.data;
	if (!Array.isArray(data)) throw new Error("Hugging Face model discovery response must contain a data array");
	return data;
}
function projectHuggingfaceModels(rows) {
	const catalogById = new Map(HUGGINGFACE_MODEL_CATALOG.map((model) => [model.id, model]));
	const seen = /* @__PURE__ */ new Set();
	const models = [];
	for (const row of rows) {
		const entry = row;
		const id = typeof entry?.id === "string" ? entry.id.trim() : "";
		if (!entry || !id || seen.has(id)) continue;
		seen.add(id);
		const catalogEntry = catalogById.get(id);
		if (catalogEntry) {
			models.push(Object.assign({}, catalogEntry));
			continue;
		}
		const inferred = inferredMetaFromModelId(id);
		const modalities = entry?.architecture?.input_modalities;
		const providerWithContext = (Array.isArray(entry?.providers) ? entry.providers : []).find((provider) => typeof provider?.context_length === "number" && provider.context_length > 0);
		models.push({
			id,
			name: displayNameFromApiEntry(entry, inferred.name),
			reasoning: inferred.reasoning,
			input: Array.isArray(modalities) && modalities.includes("image") ? ["text", "image"] : ["text"],
			cost: HUGGINGFACE_DEFAULT_COST,
			contextWindow: providerWithContext?.context_length ?? HUGGINGFACE_DEFAULT_CONTEXT_WINDOW,
			maxTokens: HUGGINGFACE_DEFAULT_MAX_TOKENS
		});
	}
	return models;
}
async function discoverHuggingfaceModels(apiKey, timeoutMs = HUGGINGFACE_DISCOVERY_TIMEOUT_MS) {
	const trimmedKey = apiKey?.trim();
	if (!trimmedKey) return HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model));
	const requestTimeoutMs = resolveTimerTimeoutMs(timeoutMs, HUGGINGFACE_DISCOVERY_TIMEOUT_MS);
	return (await buildLiveModelProviderConfig({
		providerId: "huggingface",
		endpoint: `${HUGGINGFACE_BASE_URL}/models`,
		providerConfig: {
			baseUrl: HUGGINGFACE_BASE_URL,
			api: "openai-completions"
		},
		models: HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model)),
		discoveryApiKey: trimmedKey,
		signal: AbortSignal.timeout(requestTimeoutMs),
		timeoutMs: requestTimeoutMs,
		ttlMs: 0,
		readRows: readHuggingfaceModelRows,
		buildRequestHeaders: () => ({
			Authorization: `Bearer ${trimmedKey}`,
			"Content-Type": "application/json"
		}),
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(HUGGINGFACE_BASE_URL),
		auditContext: "huggingface-model-discovery",
		fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params)),
		projectRows: projectHuggingfaceModels
	})).models;
}
//#endregion
export { isHuggingfacePolicyLocked as a, discoverHuggingfaceModels as i, HUGGINGFACE_MODEL_CATALOG as n, HUGGINGFACE_POLICY_SUFFIXES as r, HUGGINGFACE_BASE_URL as t };
