import { i as normalizeModelCompat } from "./provider-model-compat-B1p8TIBp.js";
import "./provider-model-shared-T9VIzWk7.js";
import { n as buildLiveModelProviderConfig, o as fetchLiveProviderModelIds } from "./provider-catalog-live-runtime-DOx81j-v.js";
//#region extensions/opencode-go/provider-catalog.ts
const PROVIDER_ID = "opencode-go";
const OPENCODE_GO_OPENAI_BASE_URL = "https://opencode.ai/zen/go/v1";
const OPENCODE_GO_ANTHROPIC_BASE_URL = "https://opencode.ai/zen/go";
const OPENCODE_GO_KIMI_NO_REASONING_MODEL_IDS = /* @__PURE__ */ new Set([
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code"
]);
const OPENCODE_GO_MODELS_ENDPOINT = "https://opencode.ai/zen/go/v1/models";
const OPENCODE_GO_MODELS_TIMEOUT_MS = 5e3;
const OPENCODE_GO_MODELS_CACHE_TTL_MS = 6e4;
const T = ["text"];
const TI = ["text", "image"];
const E_HM = ["high", "max"];
const OPENCODE_GO_MODEL_ROWS = [
	[
		"deepseek-v4-pro",
		1e6,
		384e3,
		T,
		[
			.435,
			.87,
			.003625,
			0
		],
		E_HM
	],
	[
		"deepseek-v4-flash",
		1e6,
		384e3,
		T,
		[
			.14,
			.28,
			.0028,
			0
		],
		[
			"low",
			"high",
			"max"
		]
	],
	[
		"glm-5",
		202752,
		32768,
		T,
		[
			1,
			3.2,
			.2,
			0
		]
	],
	[
		"glm-5.1",
		202752,
		32768,
		T,
		[
			1.4,
			4.4,
			.26,
			0
		]
	],
	[
		"glm-5.2",
		1e6,
		131072,
		T,
		[
			1.4,
			4.4,
			.26,
			0
		],
		E_HM
	],
	[
		"gpt-5.6-luna",
		105e4,
		128e3,
		TI,
		[
			.2,
			1.2,
			.02,
			.25,
			272e3,
			.4,
			1.8,
			.04,
			.5
		],
		[
			"none",
			"low",
			"medium",
			"high",
			"xhigh",
			"max"
		],
		922e3
	],
	[
		"grok-4.5",
		5e5,
		5e5,
		TI,
		[
			2,
			6,
			.3,
			0
		],
		[
			"low",
			"medium",
			"high"
		]
	],
	[
		"hy3",
		256e3,
		64e3,
		T,
		[
			.14,
			.58,
			.035,
			0
		],
		[
			"none",
			"low",
			"high"
		]
	],
	[
		"hy3-preview",
		262144,
		32768,
		T,
		[
			0,
			0,
			0,
			0
		]
	],
	[
		"kimi-k2.5",
		262144,
		65536,
		TI,
		[
			.6,
			3,
			.1,
			0
		]
	],
	[
		"kimi-k2.6",
		262144,
		65536,
		TI,
		[
			.95,
			4,
			.16,
			0
		]
	],
	[
		"kimi-k2.7-code",
		262144,
		262144,
		TI,
		[
			.95,
			4,
			.19,
			0
		]
	],
	[
		"kimi-k3",
		1048576,
		131072,
		TI,
		[
			3,
			15,
			.3,
			0
		],
		["max"]
	],
	[
		"mimo-v2-omni",
		262144,
		128e3,
		TI,
		[
			.4,
			2,
			.08,
			0
		]
	],
	[
		"mimo-v2-pro",
		1048576,
		128e3,
		T,
		[
			1,
			3,
			.2,
			0,
			256e3,
			2,
			6,
			.4,
			0
		]
	],
	[
		"mimo-v2.5",
		1e6,
		128e3,
		TI,
		[
			.14,
			.28,
			.0028,
			0
		]
	],
	[
		"mimo-v2.5-pro",
		1048576,
		128e3,
		T,
		[
			.435,
			.87,
			.003625,
			0
		]
	],
	[
		"minimax-m2.5",
		204800,
		65536,
		T,
		[
			.3,
			1.2,
			.06,
			.375
		]
	],
	[
		"minimax-m2.7",
		204800,
		131072,
		T,
		[
			.3,
			1.2,
			.06,
			.375
		]
	],
	[
		"minimax-m3",
		1e6,
		131072,
		TI,
		[
			.3,
			1.2,
			.06,
			0,
			512e3,
			.6,
			2.4,
			.12,
			0
		]
	],
	[
		"qwen3.5-plus",
		262144,
		65536,
		TI,
		[
			.2,
			1.2,
			.02,
			.25
		]
	],
	[
		"qwen3.7-max",
		1e6,
		65536,
		T,
		[
			2.5,
			7.5,
			.5,
			3.125
		]
	],
	[
		"qwen3.7-plus",
		1e6,
		65536,
		TI,
		[
			.4,
			1.6,
			.04,
			.5,
			256e3,
			1.2,
			4.8,
			.12,
			1.5
		]
	],
	[
		"qwen3.8-max",
		1e6,
		131072,
		TI,
		[
			2,
			6,
			.25,
			2.5
		]
	],
	[
		"qwen3.6-plus",
		1e6,
		65536,
		TI,
		[
			.5,
			3,
			.05,
			.625,
			256e3,
			2,
			6,
			.2,
			2.5
		]
	]
];
const OPENCODE_GO_MODEL_STATUS = /* @__PURE__ */ new Map([
	["glm-5", "deprecated"],
	["qwen3.5-plus", "deprecated"],
	["mimo-v2-omni", "deprecated"],
	["kimi-k2.5", "deprecated"],
	["mimo-v2-pro", "deprecated"],
	["minimax-m2.5", "deprecated"],
	["hy3-preview", "preview"]
]);
function titleCaseModelPart(value) {
	return value ? `${value[0]?.toUpperCase()}${value.slice(1)}` : value;
}
function formatOpencodeGoModelName(id) {
	if (id === "hy3" || id === "hy3-preview") return id === "hy3" ? "Hy3" : "HY3 Preview";
	if (id.startsWith("qwen")) {
		const [version, ...parts] = id.slice(4).split("-");
		return `Qwen${version}${parts.length ? ` ${parts.map(titleCaseModelPart).join(" ")}` : ""}`;
	}
	const [family = "", ...parts] = id.split("-");
	const prefix = {
		deepseek: "DeepSeek",
		glm: "GLM",
		gpt: "GPT",
		grok: "Grok",
		kimi: "Kimi",
		mimo: "MiMo",
		minimax: "MiniMax"
	};
	const separator = family === "glm" || family === "gpt" ? "-" : " ";
	return `${prefix[family] ?? titleCaseModelPart(family)}${separator}${parts.map(titleCaseModelPart).join(" ")}`;
}
function buildOpencodeGoCost(row) {
	const [input, output, cacheRead, cacheWrite] = row;
	const cost = {
		input,
		output,
		cacheRead,
		cacheWrite
	};
	if (row.length === 4) return cost;
	const threshold = row[4];
	const tierInput = row[5];
	const tierOutput = row[6];
	const tierCacheRead = row[7];
	const tierCacheWrite = row[8];
	return {
		...cost,
		tieredPricing: [{
			...cost,
			range: [0, threshold]
		}, {
			input: tierInput,
			output: tierOutput,
			cacheRead: tierCacheRead,
			cacheWrite: tierCacheWrite,
			range: [threshold]
		}]
	};
}
function buildOpencodeGoModel(row) {
	const [id, contextWindow, maxTokens, input, cost, reasoningEfforts, contextTokens] = row;
	const anthropic = id.startsWith("minimax-") || id.startsWith("qwen");
	const api = id.startsWith("gpt-") ? "openai-responses" : anthropic ? "anthropic-messages" : "openai-completions";
	return normalizeModelCompat({
		id,
		name: formatOpencodeGoModelName(id),
		api,
		provider: PROVIDER_ID,
		baseUrl: anthropic ? OPENCODE_GO_ANTHROPIC_BASE_URL : OPENCODE_GO_OPENAI_BASE_URL,
		reasoning: true,
		input: [...input],
		cost: buildOpencodeGoCost(cost),
		contextWindow,
		...contextTokens ? { contextTokens } : {},
		maxTokens,
		...reasoningEfforts ? { compat: {
			supportsUsageInStreaming: true,
			supportsReasoningEffort: true,
			supportedReasoningEfforts: [...reasoningEfforts],
			maxTokensField: "max_tokens"
		} } : id.startsWith("qwen") ? { compat: { thinkingFormat: "qwen" } } : {}
	});
}
const OPENCODE_GO_RESOLVABLE_MODELS = OPENCODE_GO_MODEL_ROWS.map(buildOpencodeGoModel);
const OPENCODE_GO_MODEL_BY_ID = new Map(OPENCODE_GO_RESOLVABLE_MODELS.map((model) => [model.id, model]));
const OPENCODE_GO_MODELS = OPENCODE_GO_RESOLVABLE_MODELS.filter((model) => !OPENCODE_GO_MODEL_STATUS.has(model.id));
function buildStaticOpencodeGoProviderConfig(apiKey) {
	return {
		api: "openai-completions",
		baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
		...apiKey ? { apiKey } : {},
		models: OPENCODE_GO_MODELS
	};
}
async function resolveOpencodeGoStarterModel(params) {
	const liveModelIds = await fetchLiveProviderModelIds({
		providerId: PROVIDER_ID,
		endpoint: OPENCODE_GO_MODELS_ENDPOINT,
		discoveryApiKey: params.apiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		timeoutMs: OPENCODE_GO_MODELS_TIMEOUT_MS,
		auditContext: "opencode-go-onboarding-model-discovery"
	});
	const preferredModelId = params.preferredModelRef.replace(`${PROVIDER_ID}/`, "");
	return liveModelIds.includes(preferredModelId) ? params.preferredModelRef : void 0;
}
async function buildOpencodeGoLiveProviderConfig(params = {}) {
	return await buildLiveModelProviderConfig({
		providerId: PROVIDER_ID,
		endpoint: OPENCODE_GO_MODELS_ENDPOINT,
		providerConfig: {
			api: "openai-completions",
			baseUrl: OPENCODE_GO_OPENAI_BASE_URL
		},
		models: OPENCODE_GO_MODELS,
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		timeoutMs: OPENCODE_GO_MODELS_TIMEOUT_MS,
		ttlMs: OPENCODE_GO_MODELS_CACHE_TTL_MS,
		auditContext: "opencode-go-model-discovery"
	});
}
function listOpencodeGoModelCatalogEntries() {
	return OPENCODE_GO_RESOLVABLE_MODELS.map((model) => {
		const entry = {
			provider: model.provider,
			id: model.id,
			name: model.name,
			api: model.api,
			baseUrl: model.baseUrl,
			reasoning: model.reasoning,
			input: model.input,
			contextWindow: model.contextWindow,
			contextTokens: model.contextTokens,
			compat: model.compat
		};
		const status = OPENCODE_GO_MODEL_STATUS.get(model.id);
		if (status) entry.status = status;
		return entry;
	});
}
function resolveOpencodeGoModel(modelId) {
	const normalizedModelId = modelId.trim().toLowerCase();
	return OPENCODE_GO_MODEL_BY_ID.get(normalizedModelId);
}
function isOpencodeGoKimiNoReasoningModelId(modelId) {
	return typeof modelId === "string" && OPENCODE_GO_KIMI_NO_REASONING_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function normalizeOpencodeGoResolvedModel(model) {
	if (!isOpencodeGoKimiNoReasoningModelId(model.id)) return;
	const compat = model.compat && typeof model.compat === "object" && !Array.isArray(model.compat) ? model.compat : void 0;
	if (!model.reasoning && !compat?.supportsReasoningEffort) return;
	return {
		...model,
		reasoning: false,
		compat: {
			...compat,
			supportsReasoningEffort: false
		}
	};
}
function normalizeBaseUrl(baseUrl) {
	return (baseUrl ?? "").trim().replace(/\/+$/, "");
}
function normalizeOpencodeGoBaseUrl(params) {
	const normalized = normalizeBaseUrl(params.baseUrl);
	if (!normalized) return;
	if (normalized === OPENCODE_GO_OPENAI_BASE_URL) return OPENCODE_GO_OPENAI_BASE_URL;
	if (normalized === OPENCODE_GO_ANTHROPIC_BASE_URL) return OPENCODE_GO_ANTHROPIC_BASE_URL;
	if (normalized === "https://opencode.ai/go") return OPENCODE_GO_ANTHROPIC_BASE_URL;
	if (normalized === "https://opencode.ai/go/v1") return params.api === "anthropic-messages" ? OPENCODE_GO_ANTHROPIC_BASE_URL : OPENCODE_GO_OPENAI_BASE_URL;
}
//#endregion
export { normalizeOpencodeGoBaseUrl as a, resolveOpencodeGoStarterModel as c, listOpencodeGoModelCatalogEntries as i, buildStaticOpencodeGoProviderConfig as n, normalizeOpencodeGoResolvedModel as o, isOpencodeGoKimiNoReasoningModelId as r, resolveOpencodeGoModel as s, buildOpencodeGoLiveProviderConfig as t };
