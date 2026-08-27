import { j as OperatorScope } from "./types.openclaw-n6JIVcIK.js";
import { pt as ChannelId } from "./types-CfTnTG4l.js";
import { T as ChannelConfigSchema, l as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-CMV4LCJ1.js";
import { $ as ChannelMentionAdapter, C as ChannelSecurityAdapter, D as ChannelOutboundAdapter, En as ChannelMessageActionName$1, J as ChannelAgentTool, S as ChannelSecretsAdapter, T as ChannelPairingAdapter, X as ChannelCapabilities, Y as ChannelAgentToolFactory, _ as ChannelGatewayAdapter, a as ChannelAllowlistAdapter, at as ChannelStreamingAdapter, b as ChannelLifecycleAdapter, c as ChannelCommandAdapter, d as ChannelConversationBindingSupport, et as ChannelMessageActionAdapter, f as ChannelDirectoryAdapter, g as ChannelElevatedAdapter, l as ChannelConfigAdapter, n as ChannelSetupWizard, nt as ChannelMeta, o as ChannelApprovalCapability, ot as ChannelThreadingAdapter, p as ChannelDoctorAdapter, q as ChannelAgentPromptAdapter, r as ChannelSetupWizardAdapter, s as ChannelAuthAdapter, tt as ChannelMessagingAdapter, u as ChannelConfiguredBindingProvider, ut as ChannelMessageAdapterShape, v as ChannelGroupAdapter, w as ChannelStatusAdapter, x as ChannelResolverAdapter, y as ChannelHeartbeatAdapter } from "./setup-wizard-types-CEvwzrXW.js";
//#region src/channels/plugins/types.plugin.d.ts
/** Full capability contract for a native channel plugin. */
type ChannelPluginSetupWizard = ChannelSetupWizard | ChannelSetupWizardAdapter;
type ChannelGatewayMethodDescriptor = {
  name: string;
  scope?: OperatorScope;
  description?: string;
};
type ChannelPlugin<ResolvedAccount = any, Probe = unknown, Audit = unknown> = {
  id: ChannelId;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  defaults?: {
    queue?: {
      debounceMs?: number;
    };
  };
  reload?: {
    configPrefixes: string[];
    noopPrefixes?: string[];
    /**
     * Opt into restarting only the changed non-default named account.
     * Set only when sibling account resolution and lifecycle state are isolated and
     * account stop fully settles owned work. Shared, default, removed, or unresolved
     * account changes still restart the whole channel.
     */
    accountScopedRestart?: boolean;
  };
  setupWizard?: ChannelPluginSetupWizard;
  config: ChannelConfigAdapter<ResolvedAccount>;
  configSchema?: ChannelConfigSchema;
  /** Channel-owned typed setup contract. Preferred over the legacy shared input adapter. */
  setupContract?: ChannelOwnedSetupContract;
  /** @deprecated Use setupContract for new plugins. */
  setup?: ChannelSetupAdapter;
  pairing?: ChannelPairingAdapter;
  security?: ChannelSecurityAdapter<ResolvedAccount>;
  groups?: ChannelGroupAdapter;
  mentions?: ChannelMentionAdapter;
  outbound?: ChannelOutboundAdapter;
  status?: ChannelStatusAdapter<ResolvedAccount, Probe, Audit>;
  gatewayMethods?: string[];
  gatewayMethodDescriptors?: ChannelGatewayMethodDescriptor[];
  gateway?: ChannelGatewayAdapter<ResolvedAccount>;
  auth?: ChannelAuthAdapter;
  approvalCapability?: ChannelApprovalCapability;
  elevated?: ChannelElevatedAdapter;
  commands?: ChannelCommandAdapter;
  lifecycle?: ChannelLifecycleAdapter;
  secrets?: ChannelSecretsAdapter;
  allowlist?: ChannelAllowlistAdapter;
  doctor?: ChannelDoctorAdapter;
  bindings?: ChannelConfiguredBindingProvider;
  conversationBindings?: ChannelConversationBindingSupport;
  streaming?: ChannelStreamingAdapter;
  threading?: ChannelThreadingAdapter;
  message?: ChannelMessageAdapterShape;
  messaging?: ChannelMessagingAdapter;
  agentPrompt?: ChannelAgentPromptAdapter;
  directory?: ChannelDirectoryAdapter;
  resolver?: ChannelResolverAdapter;
  actions?: ChannelMessageActionAdapter;
  heartbeat?: ChannelHeartbeatAdapter;
  agentTools?: ChannelAgentToolFactory | ChannelAgentTool[];
};
//#endregion
//#region src/channels/plugins/types.public.d.ts
/** Stable message action name union derived from the registered action list. */
type ChannelMessageActionName = ChannelMessageActionName$1;
//#endregion
export { ChannelPlugin as n, ChannelMessageActionName as t };