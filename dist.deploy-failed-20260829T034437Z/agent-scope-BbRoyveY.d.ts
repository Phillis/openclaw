import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import "./types-336a6ztO.js";
import "./types-CNsppBy_.js";
import "./agent-scope-config-BXJ1Cy-i.js";
//#region src/agents/agent-scope.d.ts
declare function resolveSessionAgentIds(params: {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string | undefined;
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
  target?: AgentModelPrimaryWriteTarget;
  forceAgent?: boolean;
}): AgentModelPrimaryWriteTarget;
//#endregion
export { setAgentEffectiveModelPrimary as a, resolveSessionAgentIds as i, resolveAgentEffectiveModelPrimary as n, resolveSessionAgentId as r, AgentModelPrimaryWriteTarget as t };