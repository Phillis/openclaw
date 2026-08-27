import { s as OperatorScope } from "./types.openclaw-CZEJqSSW.js";
import { E as ChannelConfigSchema, f as ChannelOwnedSetupContract, p as ChannelSetupAdapter } from "./target-registry-types-Ny7UXMrh.js";
import { $ as ChannelMentionAdapter, C as ChannelResolverAdapter, D as ChannelPairingAdapter, E as ChannelStatusAdapter, J as ChannelAgentPromptAdapter, T as ChannelSecurityAdapter, X as ChannelAgentToolFactory, Y as ChannelAgentTool, Z as ChannelCapabilities, a as ChannelApprovalCapability, at as ChannelStreamingAdapter, b as ChannelLifecycleAdapter, c as ChannelConfigAdapter, d as ChannelDirectoryAdapter, et as ChannelMessageActionAdapter, f as ChannelDoctorAdapter, g as ChannelGatewayAdapter, h as ChannelElevatedAdapter, i as ChannelAllowlistAdapter, k as ChannelOutboundAdapter, l as ChannelConfiguredBindingProvider, n as ChannelSetupWizardAdapter, nt as ChannelMessagingAdapter, o as ChannelAuthAdapter, ot as ChannelThreadingAdapter, rt as ChannelMeta, s as ChannelCommandAdapter, t as ChannelSetupWizard, u as ChannelConversationBindingSupport, ut as ChannelMessageAdapterShape, v as ChannelGroupAdapter, w as ChannelSecretsAdapter, y as ChannelHeartbeatAdapter } from "./setup-wizard-types-BW-DTrda.js";
import { t as ChannelId } from "./channel-id.types-CSuowlIu.js";
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
export { ChannelPlugin as t };