import { r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
//#region src/agents/agent-scope.d.ts
declare function resolveSessionAgentIds(params: {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string;
  fallbackAgentId?: string;
}): {
  defaultAgentId: string;
  sessionAgentId: string;
};
declare function resolveSessionAgentId(params: {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string;
  fallbackAgentId?: string;
}): string;
declare function resolveAgentEffectiveModelPrimary(cfg: OpenClawConfig, agentId: string): string | undefined;
type AgentModelPrimaryWriteTarget = "agent" | "defaults";
declare function setAgentEffectiveModelPrimary(cfg: OpenClawConfig, agentId: string, primary: string, options?: {
  forceAgent?: boolean;
}): AgentModelPrimaryWriteTarget;
//#endregion
export { setAgentEffectiveModelPrimary as i, resolveSessionAgentId as n, resolveSessionAgentIds as r, resolveAgentEffectiveModelPrimary as t };