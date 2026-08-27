import { n as ProviderThinkingProfile } from "./provider-thinking.types-Dxc6gDm5.js";
//#region packages/llm-core/src/model-contracts/anthropic.d.ts
type ClaudeModelRef = {
  id?: string;
  params?: Record<string, unknown>;
};
type ClaudeEffortModelRef = ClaudeModelRef & {
  thinkingLevelMap?: Record<string, string | null | undefined>;
};
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeMythos5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
declare function requiresClaudeMandatoryAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Sonnet 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeSonnet5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeOpus5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model supports adaptive thinking. */
declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model has a native 1M-token context window. */
declare function supportsClaude1MContext(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports Anthropic's native fast mode. */
declare function supportsClaudeFastMode(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native max effort. */
declare function supportsClaudeNativeMaxEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native xhigh effort. */
declare function supportsClaudeNativeXhighEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model rejects caller-selected sampling parameters. */
declare function requiresClaudeDefaultSampling(ref: ClaudeModelRef): boolean;
/**
 * Fill native Claude effort mappings only when the provider did not publish a
 * narrower route-specific contract.
 */
declare function resolveClaudeNativeThinkingLevelMap(ref: ClaudeEffortModelRef): Record<string, string | null | undefined> | undefined;
//#endregion
//#region src/plugins/provider-claude-thinking.d.ts
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
declare function isClaudeAdaptiveThinkingDefaultModelId(
/** Claude model id to check against adaptive-thinking default families. */
modelId: string): boolean;
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
declare function resolveClaudeThinkingProfile(
/** Claude model id used to choose available thinking levels and defaults. */
modelId: string, params?: Record<string, unknown>, options?: {
  includeNativeMax?: boolean;
}): ProviderThinkingProfile;
//#endregion
export { resolveClaudeFable5ModelIdentity as a, resolveClaudeNativeThinkingLevelMap as c, supportsClaude1MContext as d, supportsClaudeAdaptiveThinking as f, supportsClaudeNativeXhighEffort as h, requiresClaudeMandatoryAdaptiveThinking as i, resolveClaudeOpus5ModelIdentity as l, supportsClaudeNativeMaxEffort as m, resolveClaudeThinkingProfile as n, resolveClaudeModelIdentity as o, supportsClaudeFastMode as p, requiresClaudeDefaultSampling as r, resolveClaudeMythos5ModelIdentity as s, isClaudeAdaptiveThinkingDefaultModelId as t, resolveClaudeSonnet5ModelIdentity as u };