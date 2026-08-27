import { O as OperatorScope } from "./types.openclaw-OHssSjQn.js";
import { l as ChannelOwnedSetupContract, u as ChannelSetupAdapter, w as ChannelConfigSchema } from "./manifest-registry-C6kEXbju.js";
import { $ as ChannelMessageActionAdapter, C as ChannelSecurityAdapter, D as ChannelOutboundAdapter, J as ChannelAgentToolFactory, K as ChannelAgentPromptAdapter, Q as ChannelMentionAdapter, S as ChannelSecretsAdapter, T as ChannelPairingAdapter, Y as ChannelCapabilities, a as ChannelApprovalCapability, at as ChannelThreadingAdapter, b as ChannelLifecycleAdapter, c as ChannelConfigAdapter, d as ChannelDirectoryAdapter, et as ChannelMessagingAdapter, f as ChannelDoctorAdapter, g as ChannelGatewayAdapter, h as ChannelElevatedAdapter, i as ChannelAllowlistAdapter, it as ChannelStreamingAdapter, l as ChannelConfiguredBindingProvider, lt as ChannelMessageAdapterShape, n as ChannelSetupWizardAdapter, o as ChannelAuthAdapter, q as ChannelAgentTool, s as ChannelCommandAdapter, t as ChannelSetupWizard, tt as ChannelMeta, u as ChannelConversationBindingSupport, v as ChannelGroupAdapter, w as ChannelStatusAdapter, x as ChannelResolverAdapter, y as ChannelHeartbeatAdapter } from "./setup-wizard-types-DVg7Zco4.js";
import { t as ChannelId } from "./channel-id.types-D3kXkqAw.js";
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