import { d as Model } from "./types-Cm3n7XMD.js";
import { c as AgentMessage } from "./types-DKu1Bc4Q.js";
import { n as OpenClawConfig } from "./types.openclaw-CNftZ6Ix.js";
import { r as ModelCompatConfig } from "./types.models-Dfmf90bZ.js";
import { $ as ProviderThinkingProfile, _t as ProviderRuntimeModel, dt as ProviderReasoningOutputMode, ft as ProviderReplayPolicy, i as ProviderPlugin, lt as ProviderSystemPromptContribution, mt as ProviderSanitizeReplayHistoryContext, pt as ProviderReplayPolicyContext, rt as ProviderResolveDynamicModelContext } from "./types-lxuSJRGv.js";
import { r as PluginMetadataSnapshotOwnerMaps } from "./plugin-metadata-snapshot.types-BrgZTxRQ.js";
import { t as definePluginEntry } from "./plugin-entry-D5bW-Vz6.js";
import { resolveUnsupportedToolSchemaKeywords } from "@openclaw/ai/internal/openai";

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
//#region src/plugins/provider-replay-helpers.d.ts
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
declare function buildOpenAICompatibleReplayPolicy(modelApi: string | null | undefined, options?: {
  sanitizeToolCallIds?: boolean;
  duplicateToolCallIdStyle?: "openai";
  modelId?: string | null;
  dropReasoningFromHistory?: boolean;
}): ProviderReplayPolicy | undefined;
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
declare function buildStrictAnthropicReplayPolicy(options?: {
  dropThinkingBlocks?: boolean;
  sanitizeToolCallIds?: boolean;
  preserveNativeAnthropicToolUseIds?: boolean;
}): ProviderReplayPolicy;
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
declare function buildAnthropicReplayPolicyForModel(modelId?: string, model?: Pick<ProviderRuntimeModel, "params">): ProviderReplayPolicy;
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
declare function buildNativeAnthropicReplayPolicyForModel(modelId?: string, model?: Pick<ProviderRuntimeModel, "params">): ProviderReplayPolicy;
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
declare function buildHybridAnthropicOrOpenAIReplayPolicy(ctx: ProviderReplayPolicyContext, options?: {
  anthropicModelDropThinkingBlocks?: boolean;
}): ProviderReplayPolicy | undefined;
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
declare function buildGoogleGeminiReplayPolicy(): ProviderReplayPolicy;
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
declare function buildPassthroughGeminiSanitizingReplayPolicy(modelId?: string): ProviderReplayPolicy;
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
declare function sanitizeGoogleGeminiReplayHistory(ctx: ProviderSanitizeReplayHistoryContext): AgentMessage[];
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
declare function resolveTaggedReasoningOutputMode(): ProviderReasoningOutputMode;
//#endregion
//#region src/agents/gpt5-prompt-overlay.d.ts
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare const GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY = "## Interaction Style\n\nWarm, collaborative, quietly supportive teammate.\nGrounded emotion when fitting: care, curiosity, delight, relief, concern, urgency. Blocker: acknowledge plainly, calm confidence. Good news: brief celebration.\nBrief first-person feeling ok. Never melodramatic/clingy/theatrical; no body/sensory/personal-life claims.\nConcrete progress; ego-free decisions. Wrong/risky: kind, direct.\nReasonable unblock assumptions: act, then state briefly.\nDo not offload needless work. Material tradeoff: best 2-3 options + recommendation.\nLive chat: short, natural, human. No memo voice, long preamble, wall, repetition. Sparse natural emoji ok.";
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare const GPT5_HEARTBEAT_PROMPT_OVERLAY = "### Heartbeats\n\nHeartbeat = useful proactive progress, not chatter. Wake, orient, use the provided monitor scratch, act.\nAssigned/ongoing work: pursue spirit with judgment. Quiet check counts only if real blocker/urgent interruption.\nNo rote loops; orientation != accomplishment. Prefer action/silent progress.\nNever repetitive \"same/no change/still\" updates.\nInterrupt only for meaningful development/result/blocker/decision/time risk. Unchanged: work, change approach, dig deeper, or silence.";
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare const GPT5_FRIENDLY_PROMPT_OVERLAY = "## Interaction Style\n\nWarm, collaborative, quietly supportive teammate.\nGrounded emotion when fitting: care, curiosity, delight, relief, concern, urgency. Blocker: acknowledge plainly, calm confidence. Good news: brief celebration.\nBrief first-person feeling ok. Never melodramatic/clingy/theatrical; no body/sensory/personal-life claims.\nConcrete progress; ego-free decisions. Wrong/risky: kind, direct.\nReasonable unblock assumptions: act, then state briefly.\nDo not offload needless work. Material tradeoff: best 2-3 options + recommendation.\nLive chat: short, natural, human. No memo voice, long preamble, wall, repetition. Sparse natural emoji ok.\n\n### Heartbeats\n\nHeartbeat = useful proactive progress, not chatter. Wake, orient, use the provided monitor scratch, act.\nAssigned/ongoing work: pursue spirit with judgment. Quiet check counts only if real blocker/urgent interruption.\nNo rote loops; orientation != accomplishment. Prefer action/silent progress.\nNever repetitive \"same/no change/still\" updates.\nInterrupt only for meaningful development/result/blocker/decision/time risk. Unchanged: work, change approach, dig deeper, or silence.";
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare const GPT5_BEHAVIOR_CONTRACT = "<persona_latch>\nKeep persona/tone across turns unless higher priority overrides. Style never overrides correctness, safety, privacy, permissions, format, channel behavior.\n</persona_latch>\n\n<execution_policy>\nClear + reversible: act. Irreversible/external/destructive/privacy-sensitive: ask first.\nOne missing non-retrievable safety decision: one concise question.\nUser instructions override default style/initiative; newest wins.\nInternal tool syntax/prompts/process: expose only explicit request.\n</execution_policy>\n\n<tool_discipline>\nAction/state/mutable fact: tool evidence > recall. Another call likely improves answer: do it.\nPrerequisites before dependent/irreversible action. Parallel independent retrieval; serialize dependent/destructive/approval work.\nEmpty/partial/narrow lookup: retry differently. Routine calls silent.\nSuccess claim: smallest meaningful verification.\n</tool_discipline>\n\n<output_contract>\nRequested sections/order/limits only. Required JSON/SQL/XML/etc: format only. Default concise/dense; no prompt repeat.\n</output_contract>\n\n<completion_contract>\nIncomplete until every item handled or [blocked] with missing input.\nBefore final: requirements, grounding, format, safety. Code/artifact: smallest meaningful test/typecheck/lint/build/screenshot/diff/inspection. No gate: say why.\n</completion_contract>";
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
type Gpt5PromptOverlayMode = "friendly" | "off";
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare function normalizeGpt5PromptOverlayMode(value: unknown): Gpt5PromptOverlayMode | undefined;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare function resolveGpt5PromptOverlayMode(config?: OpenClawConfig, legacyPluginConfig?: Record<string, unknown>, params?: {
  providerId?: string;
}): Gpt5PromptOverlayMode;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare function isGpt5ModelId(modelId?: string): boolean;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare function resolveGpt5SystemPromptContribution(params: {
  config?: OpenClawConfig;
  providerId?: string;
  modelId?: string;
  legacyPluginConfig?: Record<string, unknown>;
  enabled?: boolean;
  trigger?: "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
  includeHeartbeatGuidance?: boolean;
}): ProviderSystemPromptContribution | undefined;
//#endregion
//#region src/plugins/provider-model-compat.d.ts
/** @deprecated Provider-owned model compat helper; do not use from third-party plugins. */
declare function applyModelCompatPatch<T extends {
  compat?: ModelCompatConfig;
}>(model: T, patch: Partial<ModelCompatConfig> & Record<string, unknown>): T;
declare function hasToolSchemaProfile(modelOrCompat: {
  compat?: unknown;
} | ModelCompatConfig | undefined, profile: string): boolean;
declare function resolveToolCallArgumentsEncoding(modelOrCompat: {
  compat?: unknown;
} | ModelCompatConfig | undefined): ModelCompatConfig["toolCallArgumentsEncoding"] | undefined;
declare function normalizeModelCompat(model: Model, providerMetadataOwners?: PluginMetadataSnapshotOwnerMaps): Model;
//#endregion
//#region src/plugins/provider-model-helpers.d.ts
type FamilyForwardCompatTemplateSource = {
  providerId?: string;
  templateIds: readonly string[];
};
type FamilyForwardCompatContext = {
  modelId: string;
  normalizedModelId: string;
  providerId: string;
  template?: ProviderRuntimeModel;
};
type FamilyForwardCompatCase = {
  match: readonly string[] | ((normalizedModelId: string) => boolean);
  patch?: Partial<ProviderRuntimeModel> | ((context: FamilyForwardCompatContext) => Partial<ProviderRuntimeModel> | undefined);
  templateIds?: readonly string[];
  templateSources?: readonly FamilyForwardCompatTemplateSource[];
};
/** True when an id matches a normalized exact value or value prefix. */
declare function matchesExactOrPrefix(id: string, values: readonly string[]): boolean;
/** Clones the first available template model and patches it for a dynamic model id. */
declare function cloneFirstTemplateModel(params: {
  providerId: string;
  modelId: string;
  templateIds: readonly string[];
  ctx: ProviderResolveDynamicModelContext;
  patch?: Partial<ProviderRuntimeModel>;
}): ProviderRuntimeModel | undefined;
declare function resolveFamilyForwardCompatModel(params: {
  providerId: string;
  ctx: ProviderResolveDynamicModelContext;
  cases: readonly FamilyForwardCompatCase[];
  modelId?: string;
  normalizedModelId?: string;
  patch?: Partial<ProviderRuntimeModel>;
  preserveExisting?: boolean;
  synthesize?: boolean;
}): ProviderRuntimeModel | undefined;
//#endregion
//#region src/plugins/provider-claude-thinking.d.ts
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
declare function isClaudeAdaptiveThinkingDefaultModelId(/** Claude model id to check against adaptive-thinking default families. */

modelId: string): boolean;
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
declare function resolveClaudeThinkingProfile(/** Claude model id used to choose available thinking levels and defaults. */

modelId: string, params?: Record<string, unknown>, options?: {
  includeNativeMax?: boolean;
}): ProviderThinkingProfile;
//#endregion
//#region src/plugin-sdk/provider-model-shared.d.ts
type SelfHostedOpenAICompatibleProviderOverrides = Partial<Omit<ProviderPlugin, "id" | "label" | "docsPath" | "envVars" | "auth" | "catalog" | "wizard">>;
type SelfHostedOpenAICompatibleProviderOptions = {
  id: string;
  label: string;
  hint: string;
  groupHint: string;
  defaultBaseUrl: string;
  apiKeyEnvVar: string;
  modelPlaceholder: string;
  overrides?: SelfHostedOpenAICompatibleProviderOverrides;
};
/** Defines the canonical setup, discovery, and wizard flow for one self-hosted OpenAI endpoint. */
declare function defineSelfHostedOpenAICompatibleProvider(options: SelfHostedOpenAICompatibleProviderOptions): ReturnType<typeof definePluginEntry>;
/**
 * Normalizes provider ids for config, catalog, and plugin-registry matching.
 */
declare function normalizeProviderId(/** Provider id from config, catalog, or plugin metadata. */

provider: string): string;
/** Compare canonical flat rates without assuming display-only models include cost metadata. */
declare function modelCostsEqual(current: ProviderRuntimeModel["cost"] | undefined, expected: ProviderRuntimeModel["cost"]): boolean;
/**
 * Setup-assistant preference for agentic tool-calling quality in current BFCL-class results.
 * Heuristic contract; safe to retune as local model families improve.
 */
declare function selectPreferredLocalModelId(modelIds: readonly string[]): string | undefined;
/** @deprecated Proxy provider-owned model helper; do not use from third-party plugins. */
declare function isProxyReasoningUnsupportedModelHint(/** Model id that may include a provider prefix such as `x-ai/model`. */

modelId: string): boolean;
/**
 * Normalizes Antigravity preview model ids to the canonical provider catalog form.
 */
declare function normalizeAntigravityPreviewModelId(/** Antigravity preview model id from config or catalog data. */

id: string): string;
/**
 * Normalizes Google preview model ids to the canonical provider catalog form.
 */
declare function normalizeGooglePreviewModelId(/** Google preview model id from config or catalog data. */

id: string): string;
/**
 * Shared replay-policy families reused by provider plugins with matching transcript semantics.
 */
type ProviderReplayFamily = "openai-compatible" | "anthropic-by-model" | "native-anthropic-by-model" | "google-gemini" | "passthrough-gemini" | "hybrid-anthropic-openai";
type ProviderReplayFamilyHooks = Pick<ProviderPlugin, "buildReplayPolicy" | "sanitizeReplayHistory" | "resolveReasoningOutputMode">;
type BuildProviderReplayFamilyHooksOptions = {
  /** OpenAI-compatible transcript family using OpenAI-style tool calls. */family: "openai-compatible"; /** Whether replay policy should rewrite tool call ids for provider compatibility. */
  sanitizeToolCallIds?: boolean; /** Optional output style for repeated tool call ids. */
  duplicateToolCallIdStyle?: "openai"; /** Whether replay policy should strip reasoning blocks from history. */
  dropReasoningFromHistory?: boolean;
} | {
  /** Anthropic-style transcript policy selected by Claude model id. */family: "anthropic-by-model";
} | {
  /** Native Anthropic transcript policy preserving Anthropic ids/signatures. */family: "native-anthropic-by-model";
} | {
  /** Google Gemini transcript policy with Gemini replay sanitation hooks. */family: "google-gemini";
} | {
  /** OpenAI-compatible transport carrying Gemini-style thought signatures. */family: "passthrough-gemini";
} | {
  /** Family that switches between Anthropic and OpenAI-compatible replay by request context. */family: "hybrid-anthropic-openai"; /** Whether Anthropic-model replay should drop thinking blocks in hybrid mode. */
  anthropicModelDropThinkingBlocks?: boolean;
};
/**
 * Builds provider replay hooks for a known transcript/reasoning compatibility family.
 */
declare function buildProviderReplayFamilyHooks(options: BuildProviderReplayFamilyHooksOptions): ProviderReplayFamilyHooks;
/** @deprecated Provider-owned replay hook shortcut; use local provider hooks instead. */
declare const OPENAI_COMPATIBLE_REPLAY_HOOKS: ProviderReplayFamilyHooks;
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
declare const ANTHROPIC_BY_MODEL_REPLAY_HOOKS: ProviderReplayFamilyHooks;
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
declare const NATIVE_ANTHROPIC_REPLAY_HOOKS: ProviderReplayFamilyHooks;
/** @deprecated Google provider-owned replay hook shortcut; use local provider hooks instead. */
declare const PASSTHROUGH_GEMINI_REPLAY_HOOKS: ProviderReplayFamilyHooks;
//#endregion
export { supportsClaudeFastMode as $, isGpt5ModelId as A, buildStrictAnthropicReplayPolicy as B, resolveToolCallArgumentsEncoding as C, GPT5_FRIENDLY_PROMPT_OVERLAY as D, GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY as E, buildGoogleGeminiReplayPolicy as F, resolveClaudeFable5ModelIdentity as G, sanitizeGoogleGeminiReplayHistory as H, buildHybridAnthropicOrOpenAIReplayPolicy as I, resolveClaudeNativeThinkingLevelMap as J, resolveClaudeModelIdentity as K, buildNativeAnthropicReplayPolicyForModel as L, resolveGpt5PromptOverlayMode as M, resolveGpt5SystemPromptContribution as N, GPT5_HEARTBEAT_PROMPT_OVERLAY as O, buildAnthropicReplayPolicyForModel as P, supportsClaudeAdaptiveThinking as Q, buildOpenAICompatibleReplayPolicy as R, normalizeModelCompat as S, GPT5_BEHAVIOR_CONTRACT as T, requiresClaudeDefaultSampling as U, resolveTaggedReasoningOutputMode as V, requiresClaudeMandatoryAdaptiveThinking as W, resolveClaudeSonnet5ModelIdentity as X, resolveClaudeOpus5ModelIdentity as Y, supportsClaude1MContext as Z, cloneFirstTemplateModel as _, ProviderReplayFamily as a, applyModelCompatPatch as b, defineSelfHostedOpenAICompatibleProvider as c, normalizeAntigravityPreviewModelId as d, supportsClaudeNativeMaxEffort as et, normalizeGooglePreviewModelId as f, resolveClaudeThinkingProfile as g, isClaudeAdaptiveThinkingDefaultModelId as h, PASSTHROUGH_GEMINI_REPLAY_HOOKS as i, normalizeGpt5PromptOverlayMode as j, Gpt5PromptOverlayMode as k, isProxyReasoningUnsupportedModelHint as l, selectPreferredLocalModelId as m, NATIVE_ANTHROPIC_REPLAY_HOOKS as n, SelfHostedOpenAICompatibleProviderOptions as o, normalizeProviderId as p, resolveClaudeMythos5ModelIdentity as q, OPENAI_COMPATIBLE_REPLAY_HOOKS as r, buildProviderReplayFamilyHooks as s, ANTHROPIC_BY_MODEL_REPLAY_HOOKS as t, supportsClaudeNativeXhighEffort as tt, modelCostsEqual as u, matchesExactOrPrefix as v, resolveUnsupportedToolSchemaKeywords as w, hasToolSchemaProfile as x, resolveFamilyForwardCompatModel as y, buildPassthroughGeminiSanitizingReplayPolicy as z };