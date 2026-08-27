import { Cl as buildMemoryPromptSection, Dl as registerMemoryCapability, El as listActiveMemoryPublicArtifacts, Ol as registerMemoryCorpusSupplement, Tl as getMemoryCapabilityRegistration, _l as MemoryPluginPublicArtifact, gl as MemoryPluginCapability, wl as clearMemoryPluginState, yl as MemoryPromptSectionBuilder } from "../agent-harness-runtime-D3DJE4wK.js";
import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import "../config-C5ZMVTaL.js";
import { r as resolveSessionAgentId } from "../agent-scope-BbRoyveY.js";
import { s as resolveDefaultAgentId } from "../agent-scope-config-BXJ1Cy-i.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-ksWeUTdn.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, listMemoryHostPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };