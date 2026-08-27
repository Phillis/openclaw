import { c as resolveClaudeMythos5ModelIdentity, d as resolveClaudeSonnet5ModelIdentity, g as supportsClaudeNativeXhighEffort, n as CLAUDE_OPUS_5_THINKING_PROFILE, o as resolveClaudeFable5ModelIdentity, p as supportsClaudeAdaptiveThinking, r as CLAUDE_SONNET_5_THINKING_PROFILE, s as resolveClaudeModelIdentity, t as CLAUDE_FABLE_5_THINKING_PROFILE, u as resolveClaudeOpus5ModelIdentity } from "./src-88rHSicm.js";
//#region src/plugins/provider-claude-thinking.ts
const BASE_CLAUDE_THINKING_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" }
];
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
function isClaudeAdaptiveThinkingDefaultModelId(modelId) {
	const ref = { id: modelId };
	return supportsClaudeAdaptiveThinking(ref) && !supportsClaudeNativeXhighEffort(ref);
}
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
function resolveClaudeThinkingProfile(modelId, params, options) {
	const ref = {
		id: modelId,
		params
	};
	const canonicalModelId = resolveClaudeModelIdentity(ref);
	if (resolveClaudeFable5ModelIdentity(ref) || resolveClaudeMythos5ModelIdentity(ref)) return CLAUDE_FABLE_5_THINKING_PROFILE;
	if (resolveClaudeOpus5ModelIdentity(ref)) return CLAUDE_OPUS_5_THINKING_PROFILE;
	if (resolveClaudeSonnet5ModelIdentity(ref)) return CLAUDE_SONNET_5_THINKING_PROFILE;
	if (resolveClaudeOpus5ModelIdentity(ref)) return CLAUDE_OPUS_5_THINKING_PROFILE;
	if (supportsClaudeNativeXhighEffort(ref)) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "xhigh" },
			{ id: "adaptive" },
			{ id: "max" }
		],
		defaultLevel: "off"
	};
	if (isClaudeAdaptiveThinkingDefaultModelId(canonicalModelId)) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "adaptive" },
			...options?.includeNativeMax ? [{ id: "max" }] : []
		],
		defaultLevel: "adaptive"
	};
	return { levels: BASE_CLAUDE_THINKING_LEVELS };
}
//#endregion
export { resolveClaudeThinkingProfile as n, isClaudeAdaptiveThinkingDefaultModelId as t };
