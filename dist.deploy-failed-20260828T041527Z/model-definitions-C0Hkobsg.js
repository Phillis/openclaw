import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { i as normalizeXaiModelId, n as isXaiFrontierModelId, r as isXaiGrok46ModelId } from "./model-id-BJsQwvwb.js";
//#region extensions/xai/model-definitions.ts
const XAI_BASE_URL = "https://api.x.ai/v1";
const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
const XAI_IMAGE_MODELS = ["grok-imagine-image", "grok-imagine-image-quality"];
const XAI_DEFAULT_CONTEXT_WINDOW = 1e6;
const XAI_FRONTIER_CONTEXT_WINDOW = 5e5;
const XAI_CODE_CONTEXT_WINDOW = 256e3;
const XAI_DEFAULT_MAX_TOKENS = 64e3;
const XAI_DEFAULT_MODEL_ID = "grok-4.3";
const XAI_GROK_420_COST = {
	input: 1.25,
	output: 2.5,
	cacheRead: .2,
	cacheWrite: 0
};
const XAI_GROK_43_COST = {
	input: 1.25,
	output: 2.5,
	cacheRead: .2,
	cacheWrite: 0
};
const XAI_GROK_45_COST = {
	input: 2,
	output: 6,
	cacheRead: .3,
	cacheWrite: 0
};
const XAI_GROK_46_COST = {
	input: 2,
	output: 6,
	cacheRead: .5,
	cacheWrite: 0
};
const XAI_MODEL_CATALOG = [
	[
		"grok-4.6",
		"Grok 4.6",
		true,
		["text", "image"],
		{
			contextWindow: XAI_FRONTIER_CONTEXT_WINDOW,
			cost: XAI_GROK_46_COST
		}
	],
	[
		"grok-4.5",
		"Grok 4.5",
		true,
		["text", "image"],
		{
			contextWindow: XAI_FRONTIER_CONTEXT_WINDOW,
			cost: XAI_GROK_45_COST
		}
	],
	[
		"grok-build-0.1",
		"Grok Build 0.1",
		true,
		["text", "image"],
		{
			contextWindow: XAI_CODE_CONTEXT_WINDOW,
			omitMaxTokens: true,
			cost: {
				input: 1,
				output: 2,
				cacheRead: .2,
				cacheWrite: 0
			}
		}
	],
	[
		"grok-3",
		"Grok 3",
		false,
		["text"]
	],
	[
		"grok-3-fast",
		"Grok 3 Fast",
		false,
		["text"]
	],
	[
		"grok-3-mini",
		"Grok 3 Mini",
		true,
		["text"]
	],
	[
		"grok-3-mini-fast",
		"Grok 3 Mini Fast",
		true,
		["text"]
	],
	[
		"grok-4.3",
		"Grok 4.3",
		true,
		["text", "image"]
	],
	[
		"grok-4",
		"Grok 4",
		true,
		["text"]
	],
	[
		"grok-4-0709",
		"Grok 4 0709",
		true,
		["text"]
	],
	[
		"grok-4-fast",
		"Grok 4 Fast",
		true,
		["text", "image"]
	],
	[
		"grok-4-fast-non-reasoning",
		"Grok 4 Fast (Non-Reasoning)",
		false,
		["text", "image"]
	],
	[
		"grok-4-1-fast",
		"Grok 4.1 Fast",
		true,
		["text", "image"]
	],
	[
		"grok-4-1-fast-non-reasoning",
		"Grok 4.1 Fast (Non-Reasoning)",
		false,
		["text", "image"]
	],
	[
		"grok-4.20-0309-reasoning",
		"Grok 4.20 0309 (Reasoning)",
		true,
		["text", "image"],
		{
			maxTokens: 3e4,
			cost: XAI_GROK_420_COST
		}
	],
	[
		"grok-4.20-0309-non-reasoning",
		"Grok 4.20 0309 (Non-Reasoning)",
		false,
		["text", "image"],
		{
			maxTokens: 3e4,
			cost: XAI_GROK_420_COST
		}
	]
].map(([id, name, reasoning, input, overrides]) => {
	const model = {
		id,
		name,
		reasoning,
		input,
		contextWindow: overrides?.contextWindow ?? 1e6,
		maxTokens: overrides?.maxTokens ?? 64e3,
		cost: overrides?.cost ?? XAI_GROK_43_COST
	};
	if (overrides?.omitMaxTokens) delete model.maxTokens;
	return model;
});
const XAI_SELECTABLE_MODEL_IDS = /* @__PURE__ */ new Set([
	"grok-4.6",
	"grok-4.5",
	"grok-build-0.1",
	"grok-4.3",
	"grok-4.20-0309-reasoning",
	"grok-4.20-0309-non-reasoning"
]);
const LEGACY_XAI_BUILTIN_SIGNATURES = {
	"grok-3": [
		"Grok 3",
		false,
		"text",
		131072,
		8192,
		3,
		15,
		.75,
		0
	],
	"grok-3-fast": [
		"Grok 3 Fast",
		false,
		"text",
		131072,
		8192,
		5,
		25,
		1.25,
		0
	],
	"grok-3-mini": [
		"Grok 3 Mini",
		true,
		"text",
		131072,
		8192,
		.3,
		.5,
		.075,
		0
	],
	"grok-3-mini-fast": [
		"Grok 3 Mini Fast",
		true,
		"text",
		131072,
		8192,
		.6,
		4,
		.15,
		0
	],
	"grok-4": [
		"Grok 4",
		true,
		"text",
		256e3,
		64e3,
		3,
		15,
		.75,
		0
	],
	"grok-4-0709": [
		"Grok 4 0709",
		false,
		"text",
		256e3,
		64e3,
		3,
		15,
		.75,
		0
	],
	"grok-4-fast": [
		"Grok 4 Fast",
		true,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	],
	"grok-4-fast-non-reasoning": [
		"Grok 4 Fast (Non-Reasoning)",
		false,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	],
	"grok-4-1-fast": [
		"Grok 4.1 Fast",
		true,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	],
	"grok-4-1-fast-non-reasoning": [
		"Grok 4.1 Fast (Non-Reasoning)",
		false,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	]
};
const LEGACY_MODEL_KEYS = /* @__PURE__ */ new Set([
	"id",
	"name",
	"reasoning",
	"input",
	"cost",
	"contextWindow",
	"maxTokens"
]);
const LEGACY_COST_KEYS = /* @__PURE__ */ new Set([
	"input",
	"output",
	"cacheRead",
	"cacheWrite"
]);
function normalizeXaiCatalogModelId(modelId) {
	const lower = normalizeOptionalLowercaseString(modelId) ?? "";
	return normalizeXaiModelId(lower.startsWith("xai/") ? lower.slice(4) : lower);
}
function isLegacyXaiBuiltinModel(model) {
	const record = asOptionalRecord(model);
	const id = normalizeOptionalLowercaseString(record?.id);
	const signature = id ? LEGACY_XAI_BUILTIN_SIGNATURES[id] : void 0;
	const cost = asOptionalRecord(record?.cost);
	if (!record || !signature || !cost) return false;
	if (Object.keys(record).some((key) => !LEGACY_MODEL_KEYS.has(key)) || Object.keys(cost).some((key) => !LEGACY_COST_KEYS.has(key))) return false;
	const [name, reasoning, input, contextWindow, maxTokens, inputCost, outputCost, cacheReadCost, cacheWriteCost] = signature;
	return record.name === name && record.reasoning === reasoning && Array.isArray(record.input) && record.input.join(",") === input && record.contextWindow === contextWindow && record.maxTokens === maxTokens && cost.input === inputCost && cost.output === outputCost && cost.cacheRead === cacheReadCost && cost.cacheWrite === cacheWriteCost;
}
function toModelDefinition(entry) {
	return {
		id: entry.id,
		name: entry.name,
		reasoning: entry.reasoning,
		input: entry.input ?? ["text"],
		cost: entry.cost,
		contextWindow: entry.contextWindow,
		maxTokens: entry.maxTokens ?? 64e3
	};
}
function buildXaiModelDefinition() {
	return toModelDefinition(XAI_MODEL_CATALOG.find((entry) => entry.id === "grok-4.3") ?? {
		id: "grok-4.3",
		name: "Grok 4.3",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1e6,
		maxTokens: 64e3,
		cost: XAI_GROK_43_COST
	});
}
function buildXaiCatalogModels() {
	return XAI_MODEL_CATALOG.filter((entry) => XAI_SELECTABLE_MODEL_IDS.has(entry.id)).map((entry) => toModelDefinition(entry));
}
function resolveXaiCatalogEntry(modelId) {
	const trimmed = modelId.trim();
	const lower = normalizeXaiCatalogModelId(modelId);
	const exact = XAI_MODEL_CATALOG.find((entry) => normalizeOptionalLowercaseString(entry.id) === lower);
	if (exact) return toModelDefinition(exact);
	if (lower === "grok-latest") return toModelDefinition({
		id: trimmed,
		name: trimmed,
		reasoning: true,
		input: ["text", "image"],
		contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
		maxTokens: XAI_DEFAULT_MAX_TOKENS,
		cost: XAI_GROK_43_COST
	});
	if (lower.includes("multi-agent")) return;
	if (lower.startsWith("grok-3-mini-fast") || lower.startsWith("grok-3-mini") || lower.startsWith("grok-3-fast") || lower.startsWith("grok-3")) return toModelDefinition({
		id: trimmed,
		name: trimmed,
		reasoning: lower.includes("mini"),
		input: ["text"],
		contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
		maxTokens: XAI_DEFAULT_MAX_TOKENS,
		cost: XAI_GROK_43_COST
	});
	if (isXaiFrontierModelId(lower) || lower.startsWith("grok-4.3") || lower.startsWith("grok-4.20") || lower.startsWith("grok-4-1") || lower.startsWith("grok-4-fast")) return toModelDefinition({
		id: trimmed,
		name: trimmed,
		reasoning: !lower.includes("non-reasoning"),
		input: ["text", "image"],
		contextWindow: isXaiFrontierModelId(lower) ? XAI_FRONTIER_CONTEXT_WINDOW : XAI_DEFAULT_CONTEXT_WINDOW,
		maxTokens: isXaiFrontierModelId(lower) || lower.startsWith("grok-4.3") ? XAI_DEFAULT_MAX_TOKENS : lower.startsWith("grok-4.20") ? 3e4 : XAI_DEFAULT_MAX_TOKENS,
		cost: isXaiFrontierModelId(lower) ? isXaiGrok46ModelId(lower) ? XAI_GROK_46_COST : XAI_GROK_45_COST : lower.startsWith("grok-4.3") ? XAI_GROK_43_COST : lower.startsWith("grok-4.20") ? XAI_GROK_420_COST : XAI_GROK_43_COST
	});
	if (lower.startsWith("grok-4")) return toModelDefinition({
		id: modelId.trim(),
		name: modelId.trim(),
		reasoning: !lower.includes("non-reasoning"),
		input: ["text"],
		contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
		maxTokens: XAI_DEFAULT_MAX_TOKENS,
		cost: XAI_GROK_43_COST
	});
}
//#endregion
export { XAI_DEFAULT_MODEL_ID as a, buildXaiModelDefinition as c, XAI_DEFAULT_MAX_TOKENS as i, isLegacyXaiBuiltinModel as l, XAI_DEFAULT_CONTEXT_WINDOW as n, XAI_IMAGE_MODELS as o, XAI_DEFAULT_IMAGE_MODEL as r, buildXaiCatalogModels as s, XAI_BASE_URL as t, resolveXaiCatalogEntry as u };
