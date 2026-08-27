import { O as OperatorScope } from "./types.openclaw-CpYrAZv3.js";
import { C as ChannelId } from "./types-CkKOeDuP.js";
import { B as ChannelAgentToolFactory, C as ChannelPairingAdapter, G as ChannelMessagingAdapter, J as ChannelStreamingAdapter, K as ChannelMeta, Q as ChannelMessageActionName$1, R as ChannelAgentPromptAdapter, S as ChannelStatusAdapter, T as ChannelOutboundAdapter, U as ChannelMentionAdapter, V as ChannelCapabilities, W as ChannelMessageActionAdapter, Y as ChannelThreadingAdapter, _ as ChannelHeartbeatAdapter, a as ChannelApprovalCapability, b as ChannelSecretsAdapter, c as ChannelConfigAdapter, d as ChannelDirectoryAdapter, f as ChannelDoctorAdapter, g as ChannelGroupAdapter, h as ChannelGatewayAdapter, i as ChannelAllowlistAdapter, l as ChannelConfiguredBindingProvider, lt as ChannelMessageAdapterShape, m as ChannelElevatedAdapter, n as ChannelSetupWizard, o as ChannelAuthAdapter, r as ChannelSetupWizardAdapter, s as ChannelCommandAdapter, u as ChannelConversationBindingSupport, v as ChannelLifecycleAdapter, x as ChannelSecurityAdapter, y as ChannelResolverAdapter, z as ChannelAgentTool } from "./setup-wizard-types-DUwZ9UvR.js";
import { l as ChannelOwnedSetupContract, u as ChannelSetupAdapter, w as ChannelConfigSchema } from "./manifest-registry-BJDg-GrV.js";

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
  configSchema?: ChannelConfigSchema; /** Channel-owned typed setup contract. Preferred over the legacy shared input adapter. */
  setupContract?: ChannelOwnedSetupContract; /** @deprecated Use setupContract for new plugins. */
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