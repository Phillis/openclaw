import { resolveClaudeThinkingProfile } from "openclaw/plugin-sdk/claude-model-runtime";
//#region extensions/opencode/provider-policy-api.ts
const FIXED_REASONING_PROFILE = {
	levels: [{
		id: "off",
		label: "always on"
	}],
	defaultLevel: "off"
};
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
function resolveThinkingProfile(params) {
	const modelId = params.modelId.trim().toLowerCase();
	if (modelId.startsWith("claude-")) return resolveClaudeThinkingProfile(modelId);
	const effortProfile = resolveEffortThinkingProfile(params.compat?.supportedReasoningEfforts);
	if (effortProfile) return effortProfile;
	return params.reasoning === true && params.api !== "anthropic-messages" ? FIXED_REASONING_PROFILE : void 0;
}
//#endregion
export { resolveThinkingProfile };
