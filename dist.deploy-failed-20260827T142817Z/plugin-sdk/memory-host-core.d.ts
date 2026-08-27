import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { $a as MemoryPromptSectionBuilder, Xa as MemoryPluginCapability, Za as MemoryPluginPublicArtifact, ao as clearMemoryPluginState, co as registerMemoryCapability, io as buildMemoryPromptSection, lo as registerMemoryCorpusSupplement, oo as getMemoryCapabilityRegistration, so as listActiveMemoryPublicArtifacts } from "../host-capability-types-3XBDy-df.js";
import { n as resolveSessionAgentId } from "../agent-scope-J2vKEzc7.js";
import { s as resolveDefaultAgentId } from "../agent-scope-config-m1tHy6iC.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-ksWeUTdn.js";

//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts across all configured memory workspaces. */
declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { type MemoryPluginCapability, type MemoryPluginPublicArtifact, type MemoryPromptSectionBuilder, buildMemoryPromptSection as buildActiveMemoryPromptSection, clearMemoryPluginState, getMemoryCapabilityRegistration, listActiveMemoryPublicArtifacts, listMemoryHostPublicArtifacts, registerMemoryCapability, registerMemoryCorpusSupplement, resolveDefaultAgentId, resolveSessionAgentId, resolveSessionTranscriptsDirForAgent };