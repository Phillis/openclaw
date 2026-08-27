import { n as OpenClawConfig } from "./types.openclaw-6A5yUI1l.js";
//#region src/agents/agent-scope-config.d.ts
type AgentSelectionContext = {
  surface: string;
  hint: string;
};
/** Lists unique configured agent ids. */
declare function listAgentIds(cfg: OpenClawConfig): string[];
/** @deprecated Use resolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
declare function resolveDefaultAgentId(cfg: OpenClawConfig, context?: AgentSelectionContext): string;
declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
//#endregion
export { resolveDefaultAgentId as i, resolveAgentDir as n, resolveAgentWorkspaceDir as r, listAgentIds as t };