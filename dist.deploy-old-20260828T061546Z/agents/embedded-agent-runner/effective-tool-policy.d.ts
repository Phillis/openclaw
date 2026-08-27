import { i as OpenClawConfig } from "../../types.openclaw-Bon4guJK.js";
import { t as AnyAgentTool } from "../../common-DShThCoh.js";
import { r as PluginMetadataSnapshot } from "../../plugin-metadata-snapshot.types-B_pmflbL.js";
import { i as ToolPolicyLike, n as ResolvedConversationCapabilityProfile } from "../../conversation-capability-profile-Bl-IHbwA.js";
import "../../agent-tools.types-BEuufXF_.js";
//#region src/agents/tool-policy-pipeline.d.ts
/** One named policy layer in the effective runtime tool policy pipeline. */
type ToolPolicyPipelineStep = {
  policy: ToolPolicyLike | undefined;
  label: string;
  stripPluginOnlyAllowlist?: boolean;
  suppressUnavailableCoreToolWarning?: boolean;
  suppressUnavailableCoreToolWarningAllowlist?: string[];
  unavailableCoreToolReason?: string;
};
/** One policy application, exposed for diagnostics that need exclusion provenance. */
type ToolPolicyFilterEvent<TTool extends {
  name: string;
} = AnyAgentTool> = {
  step: ToolPolicyPipelineStep;
  policy: ToolPolicyLike;
  before: readonly TTool[];
  after: readonly TTool[];
};
//#endregion
//#region src/agents/embedded-agent-runner/effective-tool-policy.d.ts
/**
 * The capability profile is an authorization signal (group/sender policies can
 * widen bundled-tool availability), so callers MUST resolve it from
 * server-verified session metadata (session key, inbound transport event),
 * never from tool-call or model-controlled input. Passing the same profile
 * that constructed the core tool set keeps this final bundled-tool pass and
 * tool construction from ever disagreeing about policy inputs.
 */
type FinalEffectiveToolPolicyParams = {
  bundledTools: AnyAgentTool[];
  config?: OpenClawConfig;
  workspaceDir?: string;
  metadataSnapshot?: PluginMetadataSnapshot;
  conversationCapabilityProfile: ResolvedConversationCapabilityProfile;
  warn: (message: string) => void;
  onFilter?: (event: ToolPolicyFilterEvent) => void;
};
declare function applyFinalEffectiveToolPolicy(params: FinalEffectiveToolPolicyParams): AnyAgentTool[];
//#endregion
export { applyFinalEffectiveToolPolicy };