import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { p as supportsClaudeAdaptiveThinking } from "./src-88rHSicm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./provider-model-shared-T9VIzWk7.js";
//#region extensions/github-copilot/model-metadata.ts
const DEFAULT_COPILOT_MODEL = "github-copilot/claude-sonnet-5";
const COPILOT_CHAT_COMPLETIONS_COMPAT = {
	supportsStore: false,
	supportsDeveloperRole: false,
	supportsUsageInStreaming: false,
	maxTokensField: "max_tokens"
};
const COPILOT_XHIGH_MODEL_IDS = /* @__PURE__ */ new Set([
	"gpt-5.6-sol",
	"gpt-5.6-terra",
	"gpt-5.6-luna",
	"gpt-5.5",
	"gpt-5.4",
	"gpt-5.3-codex"
]);
const STATIC_MODEL_OVERRIDES = /* @__PURE__ */ new Map([
	["claude-opus-4.6-1m", {
		name: "Claude Opus 4.6 (1M context)",
		api: "anthropic-messages",
		reasoning: true,
		contextWindow: 1e6,
		maxTokens: 64e3,
		thinkingLevelMap: {
			xhigh: null,
			max: null
		},
		compat: { supportedReasoningEfforts: [
			"low",
			"medium",
			"high"
		] }
	}],
	["claude-opus-4.7-1m-internal", {
		name: "Claude Opus 4.7 (1M context)",
		api: "anthropic-messages",
		reasoning: true,
		contextWindow: 1e6,
		maxTokens: 64e3,
		thinkingLevelMap: {
			xhigh: "xhigh",
			max: null
		},
		compat: { supportedReasoningEfforts: [
			"low",
			"medium",
			"high",
			"xhigh"
		] }
	}],
	["gpt-5.3-codex", {
		name: "GPT-5.3-Codex",
		api: "openai-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 1.75,
			output: 14,
			cacheRead: .175,
			cacheWrite: 0
		},
		contextWindow: 4e5,
		contextTokens: 272e3,
		maxTokens: 128e3
	}],
	["gpt-5.4", {
		name: "GPT-5.4",
		api: "openai-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 2.5,
			output: 15,
			cacheRead: .25,
			cacheWrite: 0
		},
		contextWindow: 105e4,
		maxTokens: 128e3
	}],
	["gpt-5.5", {
		name: "GPT-5.5",
		api: "openai-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 5,
			output: 30,
			cacheRead: .5,
			cacheWrite: 0
		},
		contextWindow: 105e4,
		contextTokens: 272e3,
		maxTokens: 128e3
	}]
]);
function isCopilotGeminiModelId(modelId) {
	return /(?:^|[-_.])gemini(?:$|[-_.])/.test(modelId);
}
function isCopilotClaude45ModelId(modelId) {
	return /^claude-(?:haiku|opus|sonnet)-4[.-]5(?:$|[-.])/.test(modelId);
}
function resolveCopilotTransportApi(modelId) {
	const normalized = normalizeOptionalLowercaseString(modelId) ?? "";
	if (normalized.includes("claude")) return "anthropic-messages";
	if (isCopilotGeminiModelId(normalized)) return "openai-completions";
	return "openai-responses";
}
function resolveCopilotModelCompat(modelId) {
	const normalized = normalizeOptionalLowercaseString(modelId) ?? "";
	if (isCopilotGeminiModelId(normalized)) return { ...COPILOT_CHAT_COMPLETIONS_COMPAT };
	if (isCopilotClaude45ModelId(normalized)) return { supportsEagerToolInputStreaming: false };
}
function compatSupportsEffort(compat, effort) {
	return Array.isArray(compat?.supportedReasoningEfforts) && compat.supportedReasoningEfforts.some((candidate) => normalizeOptionalLowercaseString(candidate) === effort);
}
function resolveCopilotExtendedThinkingLevels(modelId, compat) {
	const normalizedModelId = normalizeOptionalLowercaseString(modelId) ?? "";
	const staticCompat = resolveStaticCopilotModelOverride(normalizedModelId)?.compat;
	const isClaudeModel = normalizedModelId.includes("claude");
	const supportsAdaptiveClaudeEffort = !isClaudeModel || supportsClaudeAdaptiveThinking({ id: normalizedModelId });
	const levels = [];
	if (supportsAdaptiveClaudeEffort && (COPILOT_XHIGH_MODEL_IDS.has(normalizedModelId) || compatSupportsEffort(compat, "xhigh") || compatSupportsEffort(staticCompat, "xhigh"))) levels.push("xhigh");
	if (isClaudeModel && supportsAdaptiveClaudeEffort && (compatSupportsEffort(compat, "max") || compatSupportsEffort(staticCompat, "max"))) levels.push("max");
	return levels;
}
function resolveStaticCopilotModelOverride(modelId) {
	return STATIC_MODEL_OVERRIDES.get(normalizeOptionalLowercaseString(modelId) ?? "");
}
//#endregion
export { resolveStaticCopilotModelOverride as a, resolveCopilotTransportApi as i, resolveCopilotExtendedThinkingLevels as n, resolveCopilotModelCompat as r, DEFAULT_COPILOT_MODEL as t };
