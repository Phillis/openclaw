import { A as AgentDefaultsConfig, k as AgentContextLimitsConfig, r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
//#region src/agents/agent-scope-config.d.ts
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];
type AgentSelectionContext = {
  surface: string;
  hint: string;
};
/** Per-agent config after applying agent defaults and normalizing scalar fields. */
type ResolvedAgentConfig = {
  name?: string;
  workspace?: string;
  agentDir?: string;
  model?: AgentEntry["model"];
  models?: AgentEntry["models"];
  params?: AgentEntry["params"];
  runtime?: AgentEntry["runtime"];
  modelPolicy?: AgentEntry["modelPolicy"];
  agentRuntime?: AgentEntry["agentRuntime"];
  utilityModel?: AgentEntry["utilityModel"];
  thinkingDefault?: AgentEntry["thinkingDefault"];
  verboseDefault?: AgentDefaultsConfig["verboseDefault"];
  reasoningDefault?: AgentEntry["reasoningDefault"];
  fastModeDefault?: AgentEntry["fastModeDefault"];
  contextTokens?: AgentEntry["contextTokens"];
  contextInjection?: AgentEntry["contextInjection"];
  bootstrapMaxChars?: AgentEntry["bootstrapMaxChars"];
  bootstrapTotalMaxChars?: AgentEntry["bootstrapTotalMaxChars"];
  experimental?: AgentDefaultsConfig["experimental"];
  skills?: AgentEntry["skills"];
  memory?: AgentEntry["memory"];
  humanDelay?: AgentEntry["humanDelay"];
  typingMode?: AgentEntry["typingMode"];
  tts?: AgentEntry["tts"];
  contextLimits?: AgentContextLimitsConfig;
  heartbeat?: AgentEntry["heartbeat"];
  identity?: AgentEntry["identity"];
  groupChat?: AgentEntry["groupChat"];
  subagents?: AgentEntry["subagents"];
  embeddedAgent?: AgentEntry["embeddedAgent"];
  sandbox?: AgentEntry["sandbox"];
  tools?: AgentEntry["tools"];
};
/** Lists unique configured agent ids. */
declare function listAgentIds(cfg: OpenClawConfig): string[];
/** @deprecated Use resolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
declare function resolveDefaultAgentId(cfg: OpenClawConfig, context?: AgentSelectionContext): string;
/** Resolves merged config for one agent id. */
declare function resolveAgentConfig(cfg: OpenClawConfig, agentId: string): ResolvedAgentConfig | undefined;
declare function resolveAgentContextLimits(cfg: OpenClawConfig | undefined, agentId?: string | null): AgentContextLimitsConfig | undefined;
declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveDefaultAgentDir(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string;
//#endregion
export { resolveAgentWorkspaceDir as a, resolveAgentDir as i, resolveAgentConfig as n, resolveDefaultAgentDir as o, resolveAgentContextLimits as r, resolveDefaultAgentId as s, listAgentIds as t };