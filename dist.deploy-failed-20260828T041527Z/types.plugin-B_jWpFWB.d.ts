import { b as OperatorScope } from "./types.openclaw-CflOMr0r.js";
import { c as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-fJ5PmDA1.js";
import { n as ChannelConfigSchema } from "./types.config-CGDAHrEQ.js";
import { a as ChannelAgentPromptAdapter, b as ChannelMessagingAdapter, c as ChannelCapabilities, h as ChannelMessageActionAdapter, j as ChannelThreadingAdapter, k as ChannelStreamingAdapter, m as ChannelMentionAdapter, o as ChannelAgentTool, s as ChannelAgentToolFactory, x as ChannelMeta } from "./types.core-CMY5bxhQ.js";
import { n as ChannelMessageAdapterShape } from "./types-DoOzdtUM.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { C as ChannelLifecycleAdapter, D as ChannelSecretsAdapter, E as ChannelResolverAdapter, O as ChannelSecurityAdapter, S as ChannelHeartbeatAdapter, a as ChannelCommandAdapter, d as ChannelConversationBindingSupport, f as ChannelDirectoryAdapter, i as ChannelAuthAdapter, k as ChannelStatusAdapter, p as ChannelDoctorAdapter, r as ChannelApprovalCapability, s as ChannelConfigAdapter, t as ChannelAllowlistAdapter, u as ChannelConfiguredBindingProvider, v as ChannelElevatedAdapter, x as ChannelGroupAdapter, y as ChannelGatewayAdapter } from "./types.adapters-BTze_x-2.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-CjLqEEYw.js";
import { t as ChannelPairingAdapter } from "./pairing.types-fJF0YxFx.js";
import { n as ChannelSetupWizard, r as ChannelSetupWizardAdapter } from "./setup-wizard-types-CFlUscUd.js";
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