import { p as OperatorScope } from "./types.openclaw-BjZ8Xxcu.js";
import { pt as ChannelId } from "./types-CW5W8UCv.js";
import { l as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-BJhqwERh.js";
import { n as ChannelConfigSchema } from "./types.config-CGDAHrEQ.js";
import { C as ChannelOutboundAdapter, H as ChannelAgentTool, J as ChannelMessageActionAdapter, U as ChannelAgentToolFactory, V as ChannelAgentPromptAdapter, W as ChannelCapabilities, X as ChannelMessagingAdapter, Z as ChannelMeta, _ as ChannelResolverAdapter, a as ChannelConfigAdapter, at as ChannelMessageAdapterShape, b as ChannelStatusAdapter, c as ChannelDirectoryAdapter, cn as ChannelMessageActionName$1, et as ChannelStreamingAdapter, f as ChannelElevatedAdapter, g as ChannelLifecycleAdapter, h as ChannelHeartbeatAdapter, i as ChannelCommandAdapter, l as ChannelDoctorAdapter, m as ChannelGroupAdapter, n as ChannelApprovalCapability, o as ChannelConfiguredBindingProvider, p as ChannelGatewayAdapter, q as ChannelMentionAdapter, r as ChannelAuthAdapter, s as ChannelConversationBindingSupport, t as ChannelAllowlistAdapter, tt as ChannelThreadingAdapter, v as ChannelSecretsAdapter, x as ChannelPairingAdapter, y as ChannelSecurityAdapter } from "./types.adapters-UsYT95C9.js";
import { n as ChannelSetupWizardAdapter, t as ChannelSetupWizard } from "./setup-wizard-types-CTl56MML.js";
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