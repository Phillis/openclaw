import type { z } from "zod";
// Defines agent routing, model, and runtime configuration types.
import type {
  AgentContextLimitsConfig,
  AgentDefaultsConfig,
  AgentModelEntryConfig,
} from "./types.agent-defaults.js";
import type { AgentSandboxConfig } from "./types.agents-shared.js";
import type { HumanDelayConfig, IdentityConfig } from "./types.base.js";
import type { MemorySearchConfig } from "./types.memory.js";
import type { GroupChatConfig } from "./types.messages.js";
import type { SkillsLimitsConfig } from "./types.skills.js";
import type { AgentToolsConfig } from "./types.tools.js";
import type { TtsConfig } from "./types.tts.js";
import type { AgentEntryBaseSchema } from "./zod-schema.agent-entry-base.js";
import type { BindingsSchema } from "./zod-schema.agents.js";
type SchemaAgentBinding = NonNullable<z.input<typeof BindingsSchema>>[number];

export type AgentRuntimeAcpConfig = NonNullable<
  Extract<AgentRuntimeConfig, { type: "acp" }>["acp"]
>;

export type AgentRuntimeConfig = NonNullable<z.input<typeof AgentEntryBaseSchema>["runtime"]>;

export type AgentBindingMatch = AgentRouteBinding["match"];

export type AgentRouteBinding = Extract<SchemaAgentBinding, { type?: "route" }>;

export type AgentAcpBinding = Extract<SchemaAgentBinding, { type: "acp" }>;

export type AgentBinding = AgentRouteBinding | AgentAcpBinding;

export type AgentConfig = z.input<typeof AgentEntryBaseSchema> & {
  /** @deprecated Raw legacy list compatibility only; canonical agents.entries rejects this key. */
  default?: boolean;
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentModelEntryConfig["agentRuntime"];
  /** @deprecated Legacy per-agent compaction config is kept for raw doctor migration/repair. */
  compaction?: AgentDefaultsConfig["compaction"];
  memory?: {
    search?: MemorySearchConfig;
  };
  humanDelay?: HumanDelayConfig;
  typingMode?: AgentDefaultsConfig["typingMode"];
  tts?: TtsConfig & { prefsPath?: string };
  skillsLimits?: Pick<SkillsLimitsConfig, "maxSkillsPromptChars">;
  contextLimits?: AgentContextLimitsConfig;
  heartbeat?: Omit<NonNullable<AgentDefaultsConfig["heartbeat"]>, "agentId">;
  identity?: IdentityConfig;
  groupChat?: Omit<GroupChatConfig, "visibleReplies">;
  /** Optional per-agent sandbox overrides. */
  sandbox?: AgentSandboxConfig;
  tools?: AgentToolsConfig;
};

export type AgentEntryConfig = Omit<AgentConfig, "id">;

export type LoopGovernorAlertChannel = {
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
};

export type LoopGovernorConfig = {
  /** Agent ids governed by the loop budget; only non-interactive turns count. */
  agents: string[];
  /**
   * Max non-interactive admissions per agent per UTC hour before parking.
   * Recommended live value for bursty automation agents (e.g. oscar): 40 —
   * heartbeat beats, supervision nudges, and cron runs no longer share one
   * 20/hour budget once byKind splits the counters.
   */
  maxTurnsPerHour: number;
  /**
   * Optional per-session-kind hourly budgets overriding maxTurnsPerHour.
   * Keys are session-kind prefixes ("cron", "cron:", "subagent", "subagent:",
   * "incognito", "incognito:"); kinds without an entry inherit
   * maxTurnsPerHour. When absent, one shared budget applies to all
   * non-interactive kinds (today's behavior).
   */
  byKind?: Record<string, number>;
  /** Optional alert delivery target for the once-per-breach-hour notification. */
  alertChannel?: LoopGovernorAlertChannel;
};

export type AgentsConfig = {
  ownership?: "explicit";
  defaults?: AgentDefaultsConfig;
  entries?: Record<string, AgentEntryConfig>;
  /**
   * Per-agent non-interactive run governor. When present, non-interactive
   * turns (cron:/subagent:/incognito: shapes) for the listed agents are
   * capped at maxTurnsPerHour per UTC hour. Interactive DM turns are never
   * governed. Absent => feature off.
   */
  loopGovernor?: LoopGovernorConfig;
  /** Internal non-serialized projection materialized by validation for ID-based runtime code. */
  list?: AgentConfig[];
};
