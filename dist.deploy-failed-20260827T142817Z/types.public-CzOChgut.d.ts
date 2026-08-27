import { _ as OperatorScope } from "./types.openclaw-BrHw7tim.js";
import { t as ChannelId } from "./channel-id.types-BttgjDbS.js";
import { B as ChannelMentionAdapter, C as ChannelPairingAdapter, G as ChannelStreamingAdapter, H as ChannelMessagingAdapter, I as ChannelAgentPromptAdapter, K as ChannelThreadingAdapter, L as ChannelAgentTool, R as ChannelAgentToolFactory, S as ChannelStatusAdapter, T as ChannelOutboundAdapter, U as ChannelMeta, V as ChannelMessageActionAdapter, Y as ChannelMessageActionName$1, _ as ChannelHeartbeatAdapter, a as ChannelAuthAdapter, b as ChannelSecretsAdapter, c as ChannelConfiguredBindingProvider, d as ChannelDoctorAdapter, g as ChannelGroupAdapter, h as ChannelGatewayAdapter, i as ChannelApprovalCapability, l as ChannelConversationBindingSupport, m as ChannelElevatedAdapter, n as ChannelSetupWizardAdapter, o as ChannelCommandAdapter, r as ChannelAllowlistAdapter, s as ChannelConfigAdapter, st as ChannelMessageAdapterShape, t as ChannelSetupWizard, u as ChannelDirectoryAdapter, v as ChannelLifecycleAdapter, x as ChannelSecurityAdapter, y as ChannelResolverAdapter, z as ChannelCapabilities } from "./setup-wizard-types-CzVLMkGu.js";
import { l as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-BaFoN-en.js";
import { n as ChannelConfigSchema } from "./types.config-C6_VK-8V.js";

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