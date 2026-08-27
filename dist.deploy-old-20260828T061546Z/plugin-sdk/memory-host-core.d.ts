import { Cl as buildMemoryPromptSection, Dl as registerMemoryCapability, El as listActiveMemoryPublicArtifacts, Ol as registerMemoryCorpusSupplement, Tl as getMemoryCapabilityRegistration, _l as MemoryPluginPublicArtifact, gl as MemoryPluginCapability, wl as clearMemoryPluginState, yl as MemoryPromptSectionBuilder } from "../agent-harness-runtime-CESurA0d.js";
import { r as OpenClawConfig } from "../types.openclaw-CflOMr0r.js";
import "../config-Cj6rqxXJ.js";
import { r as resolveSessionAgentId } from "../agent-scope-D0f3GU21.js";
import { s as resolveDefaultAgentId } from "../agent-scope-config-BcMSLiU-.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-ksWeUTdn.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, listMemoryHostPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };