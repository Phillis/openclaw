// Defines agent default configuration types shared by runtime schemas.
import type { z } from "zod";
import type {
  AgentRuntimePolicyConfig,
  AgentSandboxConfig,
  AgentToolModelConfig,
} from "./types.agents-shared.js";
import type {
  BlockStreamingChunkConfig,
  BlockStreamingCoalesceConfig,
  HumanDelayConfig,
  TypingMode,
} from "./types.base.js";
import type { AgentDefaultsBaseSchema } from "./zod-schema.agent-defaults-base.js";
import type { AgentContextLimitsSchema, HeartbeatSchema } from "./zod-schema.agent-runtime.js";

type SchemaAgentDefaultsConfig = z.input<typeof AgentDefaultsBaseSchema>;

export type AgentContextInjection = NonNullable<SchemaAgentDefaultsConfig["contextInjection"]>;
export type OptionalBootstrapFileName = NonNullable<
  SchemaAgentDefaultsConfig["skipOptionalBootstrapFiles"]
>[number];
export type EmbeddedAgentExecutionContract = NonNullable<
  NonNullable<SchemaAgentDefaultsConfig["embeddedAgent"]>["executionContract"]
>;
export type SubagentDelegationMode = NonNullable<
  NonNullable<SchemaAgentDefaultsConfig["subagents"]>["delegationMode"]
>;
export type AgentImageQualityPreference = NonNullable<SchemaAgentDefaultsConfig["imageQuality"]>;
export type ModelSelectionScope = NonNullable<SchemaAgentDefaultsConfig["modelSelectionScope"]>;
export type AgentThinkingLevel = NonNullable<SchemaAgentDefaultsConfig["thinkingDefault"]>;

export type AgentModelEntryConfig = NonNullable<SchemaAgentDefaultsConfig["models"]>[string];

export type AgentModelPolicyConfig = NonNullable<SchemaAgentDefaultsConfig["modelPolicy"]>;

export type AgentModelListConfig = Exclude<NonNullable<SchemaAgentDefaultsConfig["model"]>, string>;

export type AgentContextPruningConfig = NonNullable<SchemaAgentDefaultsConfig["contextPruning"]>;

export type AgentStartupContextConfig = NonNullable<SchemaAgentDefaultsConfig["startupContext"]>;

export type AgentContextLimitsConfig = NonNullable<z.input<typeof AgentContextLimitsSchema>>;

export type AgentDefaultsConfig = SchemaAgentDefaultsConfig & {
  /** @deprecated Doctor-only legacy input. */
  imageGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  videoGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  musicGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  envelopeTimezone?: string;
  /** @deprecated Doctor-only legacy input. */
  envelopeTimestamp?: "on" | "off";
  /** @deprecated Doctor-only legacy input. */
  envelopeElapsed?: "on" | "off";
  /** @deprecated Doctor-only legacy input. */
  timeFormat?: "auto" | "12" | "24";
  /** @deprecated Doctor-only legacy input. */
  promptOverlays?: { gpt5?: { personality?: "friendly" | "on" | "off" } };
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentRuntimePolicyConfig;
  contextLimits?: AgentContextLimitsConfig;
  blockStreamingChunk?: BlockStreamingChunkConfig;
  blockStreamingCoalesce?: BlockStreamingCoalesceConfig;
  humanDelay?: HumanDelayConfig;
  typingMode?: TypingMode;
  heartbeat?: NonNullable<z.input<typeof HeartbeatSchema>> & {
    agentId?: string;
  };
  /**
   * Kill window for the heartbeat zero-transcript watchdog (P0-2): a running
   * beat with zero transcript events for its session within this window of run
   * start is killed and the cron retry is scheduled immediately. 0 disables
   * the watchdog; unset resolves to the default-on 300_000 ms window.
   */
  heartbeatZeroTranscriptKillMs?: number;
  /**
   * W2 turn-receipt enforcement for beat lanes: when enabled, a completed
   * beat must leave disk evidence of its work — a persisted heartbeat outcome
   * row, at least one transcript event for the run session, or an explicit
   * heartbeat tool response — before its `ran` result is authored. A beat
   * with no evidence fails as `turn-receipt-missing` (failureKind
   * local_kill, circuit-neutral) and the cron retry re-runs it. Default
   * false: unset keeps today's behavior byte-identical.
   */
  heartbeatTurnReceiptRequired?: boolean;
  sandbox?: AgentSandboxConfig;
};
export type AgentCompactionMode = NonNullable<AgentCompactionConfig["mode"]>;
export type AgentCompactionPostIndexSyncMode = NonNullable<AgentCompactionConfig["postIndexSync"]>;
export type AgentCompactionIdentifierPolicy = NonNullable<
  AgentCompactionConfig["identifierPolicy"]
>;
export type AgentCompactionQualityGuardConfig = NonNullable<AgentCompactionConfig["qualityGuard"]>;

export type AgentCompactionMidTurnPrecheckConfig = NonNullable<
  AgentCompactionConfig["midTurnPrecheck"]
>;

export type AgentCompactionConfig = NonNullable<SchemaAgentDefaultsConfig["compaction"]>;

export type AgentCompactionMemoryFlushConfig = NonNullable<AgentCompactionConfig["memoryFlush"]>;
