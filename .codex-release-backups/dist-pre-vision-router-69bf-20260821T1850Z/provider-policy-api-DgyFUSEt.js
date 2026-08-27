//#region extensions/opencode-go/provider-policy-api.ts
const KIMI_K2_THINKING_PROFILE = {
	levels: [{ id: "off" }],
	defaultLevel: "off"
};
const BINARY_REASONING_PROFILE = {
	levels: [{ id: "off" }, {
		id: "high",
		label: "on"
	}],
	defaultLevel: "high"
};
const FIXED_REASONING_PROFILE = {
	levels: [{
		id: "off",
		label: "always on"
	}],
	defaultLevel: "off"
};
const FIXED_ANTHROPIC_REASONING_PROFILE = {
	levels: [{
		id: "high",
		label: "always on"
	}],
	defaultLevel: "high"
};
const KIMI_K2_MODEL_IDS = /* @__PURE__ */ new Set([
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code"
]);
const FIXED_ANTHROPIC_REASONING_MODEL_IDS = /* @__PURE__ */ new Set(["minimax-m2.5", "minimax-m2.7"]);
const BINARY_REASONING_MODEL_IDS = /* @__PURE__ */ new Set(["minimax-m3"]);
const THINKING_LEVEL_IDS = /* @__PURE__ */ new Set([
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
]);
function resolveEffortThinkingProfile(efforts) {
	if (!efforts || efforts.length === 0) return;
	const acceptedLevelIds = ["off", ...efforts.map((effort) => effort === "none" ? "off" : effort)].filter((id) => THINKING_LEVEL_IDS.has(id)).filter((id, index, values) => values.indexOf(id) === index);
	const levels = acceptedLevelIds.map((id) => ({ id }));
	const levelIdSet = new Set(acceptedLevelIds);
	return {
		levels,
		defaultLevel: levelIdSet.has("medium") ? "medium" : levelIdSet.has("high") ? "high" : levelIdSet.has("low") ? "low" : "off"
	};
}
function isOpencodeGoFixedAnthropicReasoningModelId(modelId) {
	return typeof modelId === "string" && FIXED_ANTHROPIC_REASONING_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function resolveOpencodeGoThinkingProfile(modelId, context) {
	const normalized = modelId.trim().toLowerCase();
	if (normalized === "deepseek-v4-flash") return {
		levels: [
			{ id: "off" },
			{ id: "low" },
			{ id: "high" },
			{ id: "max" }
		],
		defaultLevel: "high"
	};
	if (normalized === "deepseek-v4-pro") return {
		levels: [
			{ id: "off" },
			{ id: "high" },
			{ id: "max" }
		],
		defaultLevel: "high"
	};
	if (normalized === "kimi-k3") return {
		levels: [{ id: "off" }, { id: "max" }],
		defaultLevel: "off"
	};
	if (KIMI_K2_MODEL_IDS.has(normalized)) return KIMI_K2_THINKING_PROFILE;
	const effortProfile = resolveEffortThinkingProfile(context?.compat?.supportedReasoningEfforts);
	if (effortProfile) return effortProfile;
	if (BINARY_REASONING_MODEL_IDS.has(normalized)) return BINARY_REASONING_PROFILE;
	if (FIXED_ANTHROPIC_REASONING_MODEL_IDS.has(normalized)) return FIXED_ANTHROPIC_REASONING_PROFILE;
	if (context?.reasoning === true && context.api === "openai-completions") return FIXED_REASONING_PROFILE;
}
function resolveThinkingProfile(context) {
	return context.provider.trim().toLowerCase() === "opencode-go" ? resolveOpencodeGoThinkingProfile(context.modelId, context) : void 0;
}
//#endregion
export { resolveOpencodeGoThinkingProfile as n, resolveThinkingProfile as r, isOpencodeGoFixedAnthropicReasoningModelId as t };
