import { k as AgentBinding, n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import "../types-B4QsRB1k.js";
import { t as ChannelId } from "../channel-id.types-myn0PI2A.js";
import { c as ChannelConfiguredBindingProvider, o as ChannelConfiguredBindingConversationRef, q as ResolvedAgentRoute, s as ChannelConfiguredBindingMatch } from "../types.adapters-DSFOIJRX.js";
import "../types.public-CrLR9xRK.js";
import { n as ConversationRef, o as SessionBindingRecord } from "../session-binding.types-iPttD8T3.js";
import { r as getSessionBindingService } from "../session-binding-service-BxW9NhJD.js";
import "../conversation-binding.types-BD9crVlm.js";
import { t as buildPairingReply } from "../pairing-messages-TqyEWnss.js";
//#region src/channels/plugins/binding-types.d.ts
/**
 * Normalized conversation facts used to match configured channel bindings.
 */
type ConfiguredBindingConversation = ConversationRef;
/**
 * Channel id used by configured binding rules.
 */
type ConfiguredBindingChannel = ChannelId;
/**
 * Raw binding config entry from OpenClaw config.
 */
type ConfiguredBindingRuleConfig = AgentBinding;
/**
 * Stateful target descriptor produced by a binding consumer.
 */
type StatefulBindingTargetDescriptor = {
  kind: "stateful";
  driverId: string;
  sessionKey: string;
  agentId: string;
  label?: string;
};
/**
 * Materialized binding record plus the stateful target it points at.
 */
type ConfiguredBindingRecordResolution = {
  record: SessionBindingRecord;
  statefulTarget: StatefulBindingTargetDescriptor;
};
/**
 * Factory that materializes a configured binding for one account/conversation pair.
 */
type ConfiguredBindingTargetFactory = {
  driverId: string;
  materialize: (params: {
    accountId: string;
    conversation: ChannelConfiguredBindingConversationRef;
  }) => ConfiguredBindingRecordResolution;
};
/**
 * Compiled binding rule with provider matcher, target factory, and static target facts.
 */
type CompiledConfiguredBinding = {
  channel: ConfiguredBindingChannel;
  accountPattern?: string;
  binding: ConfiguredBindingRuleConfig;
  bindingConversationId: string;
  target: ChannelConfiguredBindingConversationRef;
  agentId: string;
  provider: ChannelConfiguredBindingProvider;
  targetFactory: ConfiguredBindingTargetFactory;
};
/**
 * Full configured binding resolution used to rewrite routes and prepare target sessions.
 */
type ConfiguredBindingResolution = ConfiguredBindingRecordResolution & {
  conversation: ConfiguredBindingConversation;
  compiledBinding: CompiledConfiguredBinding;
  match: ChannelConfiguredBindingMatch;
};
//#endregion
//#region src/channels/plugins/binding-routing.d.ts
/**
 * Route resolution after applying a configured channel binding.
 */
type ConfiguredBindingRouteResult = {
  bindingResolution: ConfiguredBindingResolution | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
};
/**
 * Route resolution after applying a runtime conversation binding record.
 */
type RuntimeConversationBindingRouteResult = {
  /** False only when the authoritative channel-owned binding store is temporarily unavailable. */
  bindingOwnerAvailable?: boolean;
  bindingRecord: SessionBindingRecord | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
  pluginId?: string;
};
type ConfiguredBindingRouteConversationInput = {
  conversation: ConversationRef;
} | {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};
/**
 * Rewrites an agent route when the current conversation matches a configured binding.
 */
declare function resolveConfiguredBindingRoute(params: {
  cfg: OpenClawConfig;
  route: ResolvedAgentRoute;
} & ConfiguredBindingRouteConversationInput): ConfiguredBindingRouteResult;
/**
 * Rewrites an agent route using a persisted runtime conversation binding, when applicable.
 */
declare function resolveRuntimeConversationBindingRoute(params: {
  route: ResolvedAgentRoute;
  /** Set false for read-only ownership checks that must not extend binding liveness. */
  touchBinding?: boolean;
} & ConfiguredBindingRouteConversationInput): RuntimeConversationBindingRouteResult;
/**
 * Ensures a configured binding target is ready without blocking route resolution indefinitely.
 */
declare function ensureConfiguredBindingRouteReady(params: {
  cfg: OpenClawConfig;
  bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
  ok: true;
} | {
  ok: false;
  error: string;
}>;
//#endregion
//#region src/plugins/conversation-binding.d.ts
declare function isPluginOwnedSessionBindingRecord(record: {
  metadata?: Record<string, unknown>;
} | null | undefined): boolean;
//#endregion
export { type ConfiguredBindingRouteResult, type RuntimeConversationBindingRouteResult, type SessionBindingRecord, buildPairingReply, ensureConfiguredBindingRouteReady, getSessionBindingService, isPluginOwnedSessionBindingRecord, resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute };