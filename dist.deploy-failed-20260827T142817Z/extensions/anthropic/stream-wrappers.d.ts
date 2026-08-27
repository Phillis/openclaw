import { h as ProviderWrapStreamFnContext } from "../../types-R6eI-mj_.js";
import { s as StreamFn } from "../../index-p-0Et-9w.js";
//#region extensions/anthropic/stream-wrappers.d.ts
type AnthropicServiceTier = "auto" | "standard_only";
type DynamicFastMode = boolean | (() => boolean | undefined);
/**
 * Claude subscription credentials are OAuth access tokens rather than API keys.
 * Anthropic authenticates them through `Authorization: Bearer`, so every caller
 * that builds request auth must branch on this instead of assuming `x-api-key`.
 */
declare function isAnthropicOAuthApiKey(apiKey: unknown): boolean;
/** Resolve configured Anthropic beta headers from extra model params. */
declare function resolveAnthropicBetas(extraParams: Record<string, unknown> | undefined, _modelId: string): string[] | undefined;
/** Wrap a stream function to merge OpenClaw and configured Anthropic beta headers. */
declare function createAnthropicBetaHeadersWrapper(baseStreamFn: StreamFn | undefined, betas: string[]): StreamFn;
/** Wrap a stream function with native fast mode or the legacy Priority Tier mapping. */
declare function createAnthropicFastModeWrapper(baseStreamFn: StreamFn | undefined, enabled: DynamicFastMode): StreamFn;
/** Wrap a stream function with an explicit Anthropic service tier when allowed. */
declare function createAnthropicServiceTierWrapper(baseStreamFn: StreamFn | undefined, serviceTier: AnthropicServiceTier): StreamFn;
/** Resolve Anthropic fast-mode setting from model extra params. */
declare function resolveAnthropicFastMode(extraParams: Record<string, unknown> | undefined): boolean | undefined;
/** Resolve Anthropic service tier from model extra params. */
declare function resolveAnthropicServiceTier(extraParams: Record<string, unknown> | undefined): AnthropicServiceTier | undefined;
/** Compose all Anthropic stream wrappers for one provider/model context. */
declare function wrapAnthropicProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { createAnthropicBetaHeadersWrapper, createAnthropicFastModeWrapper, createAnthropicServiceTierWrapper, isAnthropicOAuthApiKey, resolveAnthropicBetas, resolveAnthropicFastMode, resolveAnthropicServiceTier, wrapAnthropicProviderStream };