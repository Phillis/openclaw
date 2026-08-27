import { r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import "./types-DFD58Wgt.js";
//#region src/media/local-roots.d.ts
/** Adds the active agent workspace to the default media roots without exposing all agent state. */
declare function getAgentScopedMediaLocalRoots(cfg: OpenClawConfig, agentId?: string): readonly string[];
/** Resolves outbound media roots, expanding for local sources only when filesystem policy allows it. */
declare function getAgentScopedMediaLocalRootsForSources(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  mediaSources?: readonly string[];
}): readonly string[];
//#endregion
export { getAgentScopedMediaLocalRootsForSources as n, getAgentScopedMediaLocalRoots as t };