import "./validation-B61OhAio.js";
//#region packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
	const normalized = modelId?.trim().toLowerCase() ?? "";
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
const CLAUDE_FABLE_5_THINKING_PROFILE = {
	levels: [
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "adaptive" },
		{ id: "max" }
	],
	defaultLevel: "high",
	preserveWhenCatalogReasoningFalse: true
};
const CLAUDE_SONNET_5_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "adaptive" },
		{ id: "max" }
	],
	defaultLevel: "high"
};
const CLAUDE_OPUS_5_THINKING_PROFILE = CLAUDE_SONNET_5_THINKING_PROFILE;
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
function resolveClaudeModelIdentity(ref) {
	const normalized = normalizeClaudeModelId((typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0) ?? ref.id);
	const match = /(?:^|[-/])claude-/.exec(normalized);
	return match ? normalized.slice((match.index ?? 0) + (match[0].startsWith("claude-") ? 0 : 1)) : normalized;
}
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeFable5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeMythos5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-mythos-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
function requiresClaudeMandatoryAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/** Resolve Claude Sonnet 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeSonnet5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
function resolveClaudeOpus5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	if (normalized === "opus" || normalized === "opus-5") return "claude-opus-5";
	const match = /(?:^|-)claude-opus-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Return whether a Claude model supports adaptive thinking. */
function supportsClaudeAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model has a native 1M-token context window. */
function supportsClaude1MContext(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports Anthropic's native fast mode. */
function supportsClaudeFastMode(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-opus-4-8(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native max effort. */
function supportsClaudeNativeMaxEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native xhigh effort. */
function supportsClaudeNativeXhighEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8)|sonnet-5)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model rejects caller-selected sampling parameters. */
function requiresClaudeDefaultSampling(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return supportsClaudeNativeXhighEffort(ref) || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/**
* Fill native Claude effort mappings only when the provider did not publish a
* narrower route-specific contract.
*/
function resolveClaudeNativeThinkingLevelMap(ref) {
	if (ref.thinkingLevelMap !== void 0) return ref.thinkingLevelMap;
	if (!supportsClaudeNativeMaxEffort(ref)) return;
	return {
		xhigh: supportsClaudeNativeXhighEffort(ref) ? "xhigh" : null,
		max: "max"
	};
}
//#endregion
export { requiresClaudeMandatoryAdaptiveThinking as a, resolveClaudeMythos5ModelIdentity as c, resolveClaudeSonnet5ModelIdentity as d, supportsClaude1MContext as f, supportsClaudeNativeXhighEffort as g, supportsClaudeNativeMaxEffort as h, requiresClaudeDefaultSampling as i, resolveClaudeNativeThinkingLevelMap as l, supportsClaudeFastMode as m, CLAUDE_OPUS_5_THINKING_PROFILE as n, resolveClaudeFable5ModelIdentity as o, supportsClaudeAdaptiveThinking as p, CLAUDE_SONNET_5_THINKING_PROFILE as r, resolveClaudeModelIdentity as s, CLAUDE_FABLE_5_THINKING_PROFILE as t, resolveClaudeOpus5ModelIdentity as u };
