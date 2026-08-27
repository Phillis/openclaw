import { n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import "./types-Kt4lh6nX.js";
import "./templating-BCMFHjRY.js";
import "./types-Ds34fJCS.js";
import "./input-provenance-tG11qAd-.js";
import "./session-manager-Dxs2hJ-i.js";
import "./transcript-BIEElU_3.js";
//#region src/agents/agent-scope-config.d.ts
type AgentSelectionContext = {
  surface: string;
  hint: string;
};
/** Lists unique configured agent ids. */
declare function listAgentIds(cfg: OpenClawConfig): string[];
/** Returns a configured agent id or throws the canonical CLI selection error. */
declare function resolveConfiguredAgentId(cfg: OpenClawConfig, agentId: string): string;
/**
 * @deprecated Ambient system work uses resolveAmbientOwnerAgentId so the configured
 * system agent is honored; explicit-selection surfaces use resolveSoleAgentId. This
 * accepts raw shipped markers only for input compatibility.
 */
declare function resolveDefaultAgentId(cfg: OpenClawConfig, context?: AgentSelectionContext): string;
declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
//#endregion
export { resolveDefaultAgentId as a, resolveConfiguredAgentId as i, resolveAgentDir as n, resolveAgentWorkspaceDir as r, listAgentIds as t };