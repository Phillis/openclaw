import type { ThinkLevel } from "../auto-reply/thinking.shared.js";

// before_model_resolve hook
export type PluginHookBeforeModelResolveAttachment = {
  kind: "image" | "video" | "audio" | "document" | "other";
  mimeType?: string;
};

export type PluginHookBeforeModelResolveOverrideName =
  | "modelOverride"
  | "providerOverride"
  | "thinkingLevelOverride"
  | "fastModeOverride";

export type PluginHookBeforeModelResolveEvent = {
  /**
   * Versioned host contract for model-resolution controls. Older hosts omit
   * this field, allowing plugins to degrade without guessing from host version.
   */
  readonly controlContractVersion?: 1;
  /** Result fields this host will honor for the current run. */
  readonly supportedOverrides?: readonly PluginHookBeforeModelResolveOverrideName[];
  /** User prompt for this run. No session messages are available yet in this phase. */
  prompt: string;
  /** Provider selected before model-routing hooks run. */
  provider?: string;
  /** Model selected before model-routing hooks run. */
  model?: string;
  /** Original primary provider before a configured fallback candidate was selected. */
  requestedProvider?: string;
  /** Original primary model before a configured fallback candidate was selected. */
  requestedModel?: string;
  /** True when this hook is resolving a non-primary configured fallback candidate. */
  fallbackUsed?: boolean;
  /** Attachment metadata for file-aware model routing. */
  attachments?: PluginHookBeforeModelResolveAttachment[];
};

export type PluginHookBeforeModelResolveResult = {
  /** Override the model for this agent run. E.g. "llama3.3:8b" */
  modelOverride?: string;
  /** Override the provider for this agent run. E.g. "local-provider" */
  providerOverride?: string;
  /** Override the run's reasoning effort after the selected model is resolved. */
  thinkingLevelOverride?: ThinkLevel;
  /** Enable or disable provider fast mode for this run. */
  fastModeOverride?: boolean;
};

// before_prompt_build hook
export type PluginHookBeforePromptBuildEvent = {
  prompt: string;
  /** Session messages prepared for this run. */
  messages: unknown[];
};

export type PluginHookBeforePromptBuildResult = {
  systemPrompt?: string;
  prependContext?: string;
  appendContext?: string;
  /**
   * Narrows the tools submitted to the model for this turn.
   * An empty array disables optional tools; omitted leaves the existing tool policy unchanged.
   */
  toolsAllow?: string[];
  /**
   * Prepended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  prependSystemContext?: string;
  /**
   * Appended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  appendSystemContext?: string;
};
