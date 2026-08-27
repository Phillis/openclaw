import { p as OperatorScope } from "./types.openclaw-Djf9z9fV.js";
import { C as ChannelSecurityAdapter, D as ChannelOutboundAdapter, G as ChannelCapabilities, H as ChannelAgentPromptAdapter, J as ChannelMentionAdapter, Q as ChannelMeta, S as ChannelSecretsAdapter, T as ChannelPairingAdapter, U as ChannelAgentTool, W as ChannelAgentToolFactory, Y as ChannelMessageActionAdapter, Z as ChannelMessagingAdapter, a as ChannelApprovalCapability, b as ChannelLifecycleAdapter, c as ChannelConfigAdapter, d as ChannelDirectoryAdapter, f as ChannelDoctorAdapter, g as ChannelGatewayAdapter, gt as ChannelMessageAdapterShape, h as ChannelElevatedAdapter, i as ChannelAllowlistAdapter, l as ChannelConfiguredBindingProvider, n as ChannelSetupWizard, o as ChannelAuthAdapter, r as ChannelSetupWizardAdapter, rt as ChannelThreadingAdapter, s as ChannelCommandAdapter, tt as ChannelStreamingAdapter, u as ChannelConversationBindingSupport, v as ChannelGroupAdapter, w as ChannelStatusAdapter, x as ChannelResolverAdapter, y as ChannelHeartbeatAdapter } from "./setup-wizard-types-BJbOEFA2.js";
import { l as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-CHpEok17.js";
import { n as ChannelConfigSchema } from "./types.config-C6_VK-8V.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";

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
export { ChannelPlugin as t };