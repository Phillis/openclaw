import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as OPENAI_GPT_54_MINI_MODEL_ID, c as OPENAI_GPT_54_PRO_MODEL_ID, f as OPENAI_GPT_56_MODEL_ID, l as OPENAI_GPT_55_MODEL_ID, o as OPENAI_GPT_54_MODEL_ID, r as OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, s as OPENAI_GPT_54_NANO_MODEL_ID, u as OPENAI_GPT_55_PRO_MODEL_ID, x as resolveOpenAICodexReasoningEfforts } from "./model-route-contract-B2Q_03Gg.js";
//#region extensions/openai/thinking-policy.ts
const OPENAI_THINKING_BASE_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" }
];
const OPENAI_THINKING_LEVEL_ORDER = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
];
const OPENAI_CODEX_XHIGH_MODEL_IDS = [
	OPENAI_GPT_56_MODEL_ID,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_53_CODEX_SPARK_MODEL_ID
];
const OPENAI_UNIFIED_XHIGH_MODEL_IDS = [
	...OPENAI_CODEX_XHIGH_MODEL_IDS,
	OPENAI_GPT_54_MINI_MODEL_ID,
	OPENAI_GPT_54_NANO_MODEL_ID
];
function matchesExactOrPrefix(id, values) {
	const normalizedId = normalizeLowercaseStringOrEmpty(id);
	return values.some((value) => {
		const normalizedValue = normalizeLowercaseStringOrEmpty(value);
		return normalizedId === normalizedValue || normalizedId.startsWith(normalizedValue);
	});
}
function normalizeCodexReasoningEffort(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (normalized === "none") return "off";
	return OPENAI_THINKING_LEVEL_ORDER.find((level) => level === normalized);
}
function buildCodexLevels(efforts) {
	const supported = /* @__PURE__ */ new Set(["off"]);
	for (const effort of efforts) {
		const level = normalizeCodexReasoningEffort(effort);
		if (level) supported.add(level);
	}
	return OPENAI_THINKING_LEVEL_ORDER.filter((level) => supported.has(level)).map((id) => ({ id }));
}
function buildOpenAIThinkingProfile(params) {
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const agentRuntime = normalizeLowercaseStringOrEmpty(params.agentRuntime ?? "");
	const codexEfforts = params.compat?.supportedReasoningEfforts?.map(normalizeLowercaseStringOrEmpty);
	const resolvedCodexEfforts = params.api === "openai-chatgpt-responses" ? resolveOpenAICodexReasoningEfforts(modelId, codexEfforts) : void 0;
	const knownCodexEfforts = resolveOpenAICodexReasoningEfforts(modelId, void 0);
	const isGpt56Variant = knownCodexEfforts !== void 0;
	const codexSupportsMax = (resolvedCodexEfforts ?? knownCodexEfforts)?.includes("max");
	const supportsMax = modelId.startsWith("gpt-5.6") && (agentRuntime !== "codex" || codexSupportsMax);
	const codexSupportsUltra = (resolvedCodexEfforts ?? knownCodexEfforts)?.includes("ultra");
	const supportsUltra = (modelId === "gpt-5.6" || isGpt56Variant) && (agentRuntime === "openclaw" || agentRuntime === "auto" || agentRuntime === "codex" && codexSupportsUltra);
	const defaultLevel = isGpt56Variant ? "medium" : void 0;
	const fallbackLevels = [
		...OPENAI_THINKING_BASE_LEVELS,
		...matchesExactOrPrefix(params.modelId, params.xhighModelIds) ? [{ id: "xhigh" }] : [],
		...supportsMax ? [{ id: "max" }] : [],
		...supportsUltra ? [{ id: "ultra" }] : []
	];
	const levels = agentRuntime === "codex" && resolvedCodexEfforts !== void 0 ? buildCodexLevels(resolvedCodexEfforts) : fallbackLevels;
	return {
		levels,
		...defaultLevel && levels.some((level) => level.id === defaultLevel) ? { defaultLevel } : {}
	};
}
function resolveOpenAICodexThinkingProfile(modelId, agentRuntime, compat, api) {
	return buildOpenAIThinkingProfile({
		modelId,
		xhighModelIds: OPENAI_CODEX_XHIGH_MODEL_IDS,
		agentRuntime,
		api,
		compat
	});
}
function resolveUnifiedOpenAIThinkingProfile(modelId, agentRuntime, compat, api) {
	return buildOpenAIThinkingProfile({
		modelId,
		xhighModelIds: OPENAI_UNIFIED_XHIGH_MODEL_IDS,
		agentRuntime,
		api,
		compat
	});
}
//#endregion
export { resolveUnifiedOpenAIThinkingProfile as n, resolveOpenAICodexThinkingProfile as t };
