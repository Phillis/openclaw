import { r as MemoryExtraPath } from "./types-Cyy1uoGn.js";
//#region packages/memory-host-sdk/src/host/config-utils.d.ts
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Citation injection behavior for memory search results. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** Top-level memory config shared by host and runtime callers. */
type MemoryConfig = {
  citations?: MemoryCitationsMode;
  search?: MemorySearchConfig;
};
/** Per-agent memory search enablement and extra collection paths. */
type MemorySearchConfig = {
  enabled?: boolean;
  rememberAcrossConversations?: boolean;
  extraPaths?: MemoryExtraPath[];
};
/** Agent context limits that bound memory file reads. */
type AgentContextLimitsConfig = {
  memoryGetMaxChars?: number;
};
/** Secret reference accepted by provider header config. */
type SecretInput = string | {
  source: string;
  provider: string;
  id: string;
};
/** Agent-level config fields consumed by memory host helpers. */
type AgentConfig = {
  id?: string;
  default?: boolean;
  workspace?: string;
  memory?: {
    search?: MemorySearchConfig;
  };
  contextLimits?: AgentContextLimitsConfig;
};
/** Narrow OpenClaw config shape consumed by memory host utilities. */
type OpenClawConfig = {
  agents?: {
    defaults?: {
      workspace?: string;
      contextLimits?: AgentContextLimitsConfig;
    };
    entries?: Record<string, Omit<AgentConfig, "id">>;
    list?: AgentConfig[];
  };
  session?: {
    dmScope?: DmScope;
  };
  bindings?: unknown[];
  memory?: MemoryConfig;
  models?: {
    providers?: Record<string, {
      api?: string;
      baseUrl?: string;
      headers?: Record<string, SecretInput>;
    }>;
  };
};
declare function resolveRememberAcrossConversations(cfg: OpenClawConfig, agentId: string): boolean;
//#endregion
export { OpenClawConfig as n, resolveRememberAcrossConversations as r, MemoryCitationsMode as t };