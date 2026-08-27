import { C as AgentBinding, r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { S as ReplyToMode } from "../types.base-DUfwpzwr.js";
import { j as ChannelThreadingAdapter } from "../types.core-D43joVXt.js";
import { s as MsgContext } from "../templating-CW47wETJ.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { c as ChannelConfiguredBindingConversationRef, l as ChannelConfiguredBindingMatch, u as ChannelConfiguredBindingProvider } from "../types.adapters-CGZ7Q0kD.js";
import { n as ResolvedAgentRoute } from "../resolve-route-CbLzYrI1.js";
import { a as SessionBindingCapabilities, c as SessionBindingUnbindInput, i as SessionBindingBindInput, n as BindingTargetKind, o as SessionBindingPlacement, r as ConversationRef, s as SessionBindingRecord, t as buildPairingReply } from "../pairing-messages-Cn-H_QsE.js";
import { t as PairingChannel } from "../pairing-store.types-B0TyHydX.js";
import { s as resolvePinnedMainDmOwnerFromAllowlist } from "../dm-policy-shared-DaEyJ0H1.js";
import { r as upsertChannelPairingRequest, t as readChannelAllowFromStore } from "../pairing-store-TBPkNPPL.js";
import { t as recordInboundSession } from "../session-O6jEenpr.js";
import { a as resolvePluginConversationBindingApproval, n as buildPluginBindingResolvedText, r as parsePluginBindingApprovalCustomId, t as buildPluginBindingApprovalCustomId } from "../conversation-binding-JF3Ej7jU.js";

//#region src/infra/outbound/session-binding-service.d.ts
type SessionBindingService = {
  bind: (input: SessionBindingBindInput) => Promise<SessionBindingRecord>;
  getCapabilities: (params: {
    channel: string;
    accountId: string;
  }) => SessionBindingCapabilities;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  touch: (bindingId: string, at?: number) => void;
  unbind: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
type SessionBindingAdapterCapabilities = {
  placements?: SessionBindingPlacement[];
  bindSupported?: boolean;
  unbindSupported?: boolean;
};
type SessionBindingAdapter = {
  channel: string;
  accountId: string;
  capabilities?: SessionBindingAdapterCapabilities;
  bind?: (input: SessionBindingBindInput) => Promise<SessionBindingRecord | null>;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  touch?: (bindingId: string, at?: number) => void;
  unbind?: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
declare function registerSessionBindingAdapter(adapter: SessionBindingAdapter): void;
declare function unregisterSessionBindingAdapter(params: {
  channel: string;
  accountId: string;
  adapter?: SessionBindingAdapter;
}): void;
declare function getSessionBindingService(): SessionBindingService;
declare const testing: {
  resetSessionBindingAdaptersForTests(): void;
  getRegisteredAdapterKeys(): string[];
};
//#endregion
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
  bindingRecord: SessionBindingRecord | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
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
//#region src/channels/conversation-label.d.ts
/**
 * Resolves the most readable conversation label from normalized inbound message context.
 */
declare function resolveConversationLabel(ctx: MsgContext): string | undefined;
//#endregion
//#region src/channels/session-meta.d.ts
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
declare function recordInboundSessionMetaSafe(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  ctx: MsgContext;
  onError?: (error: unknown) => void;
}): Promise<void>;
//#endregion
//#region src/channels/thread-binding-id.d.ts
/** Parses an account-prefixed binding id back into a conversation id. */
declare function resolveThreadBindingConversationIdFromBindingId(params: {
  accountId: string;
  bindingId?: string;
}): string | undefined;
//#endregion
//#region src/channels/plugins/threading-helpers.d.ts
type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
declare function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
declare function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
declare function createScopedAccountReplyToModeResolver<TAccount>(params: {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
  resolveReplyToMode: (account: TAccount, chatType?: string | null) => ReplyToMode | null | undefined;
  fallback?: ReplyToMode;
}): ReplyToModeResolver;
//#endregion
//#region src/channels/thread-bindings-messages.d.ts
/** Formats thread-binding timeout durations for compact user-facing messages. */
declare function formatThreadBindingDurationLabel(durationMs: number): string;
/** Builds the native thread name for a focused thread-bound session. */
declare function resolveThreadBindingThreadName(params: {
  agentId?: string;
  label?: string;
}): string;
/** Builds the system-prefixed intro text posted when a thread binding becomes active. */
declare function resolveThreadBindingIntroText(params: {
  agentId?: string;
  label?: string;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
  sessionCwd?: string;
  sessionDetails?: string[];
}): string;
/** Builds the system-prefixed farewell text posted when a thread binding ends. */
declare function resolveThreadBindingFarewellText(params: {
  reason?: string;
  farewellText?: string;
  idleTimeoutMs: number;
  maxAgeMs: number;
}): string;
//#endregion
//#region src/shared/thread-binding-lifecycle.d.ts
/** Persisted timestamps and optional TTL overrides for one channel thread binding. */
type ThreadBindingLifecycleRecord = {
  /** Epoch milliseconds when the binding was created. */boundAt: number; /** Epoch milliseconds of the latest activity seen for the bound conversation. */
  lastActivityAt: number; /** Optional idle timeout override in milliseconds; zero disables idle expiry. */
  idleTimeoutMs?: number; /** Optional max-age override in milliseconds; zero disables max-age expiry. */
  maxAgeMs?: number;
};
/** Resolves the next expiration for a channel thread binding from idle and max-age limits. */
declare function resolveThreadBindingLifecycle(params: {
  /** Stored binding timestamps and optional timeout overrides. */record: ThreadBindingLifecycleRecord; /** Fallback idle timeout in milliseconds when the record has no override. */
  defaultIdleTimeoutMs: number; /** Fallback max-age timeout in milliseconds when the record has no override. */
  defaultMaxAgeMs: number;
}): {
  /** Earliest expiration timestamp, omitted when both limits are disabled. */expiresAt?: number; /** Expiration source corresponding to `expiresAt`. */
  reason?: "idle-expired" | "max-age-expired";
};
//#endregion
//#region src/channels/thread-bindings-policy.d.ts
/** Thread-bound session type controlled by spawn policy. */
type ThreadBindingSpawnKind = "subagent" | "acp";
/** Effective per-channel/account policy for creating thread-bound sessions. */
type ThreadBindingSpawnPolicy = {
  channel: string;
  accountId: string;
  enabled: boolean;
  spawnEnabled: boolean;
  defaultSpawnContext: ThreadBindingSpawnContext;
};
/** Starting transcript mode for a spawned thread-bound session. */
type ThreadBindingSpawnContext = "isolated" | "fork";
/** Returns true when top-level commands should spawn in a child thread by default. */
/** Resolves thread-binding idle timeout with channel/account override before session default. */
declare function resolveThreadBindingIdleTimeoutMs(params: {
  channelIdleHoursRaw: unknown;
  sessionIdleHoursRaw: unknown;
}): number;
/** Resolves thread-binding max age with channel/account override before session default. */
declare function resolveThreadBindingMaxAgeMs(params: {
  channelMaxAgeHoursRaw: unknown;
  sessionMaxAgeHoursRaw: unknown;
}): number;
/** Computes the effective expiry timestamp for a thread-binding lifecycle record. */
declare function resolveThreadBindingEffectiveExpiresAt(params: {
  record: ThreadBindingLifecycleRecord;
  defaultIdleTimeoutMs: number;
  defaultMaxAgeMs: number;
}): number | undefined;
/** Resolves the effective enabled flag for thread bindings. */
declare function resolveThreadBindingsEnabled(params: {
  channelEnabledRaw: unknown;
  sessionEnabledRaw: unknown;
}): boolean;
/** Resolves effective spawn policy from account, channel, then global thread-binding config. */
declare function resolveThreadBindingSpawnPolicy(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  kind: ThreadBindingSpawnKind;
}): ThreadBindingSpawnPolicy;
/** Resolves idle timeout for a concrete channel/account config scope. */
declare function resolveThreadBindingIdleTimeoutMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Resolves max age for a concrete channel/account config scope. */
declare function resolveThreadBindingMaxAgeMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Formats the user-facing error for disabled thread bindings. */
declare function formatThreadBindingDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string;
/** Formats the user-facing error for disabled thread-bound session spawning. */
declare function formatThreadBindingSpawnDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string;
//#endregion
//#region src/pairing/pairing-labels.d.ts
declare function resolvePairingIdLabel(channel: PairingChannel): string;
//#endregion
export { type BindingTargetKind, type ConfiguredBindingRouteResult, type RuntimeConversationBindingRouteResult, type SessionBindingAdapter, type SessionBindingBindInput, type SessionBindingRecord, buildPairingReply, buildPluginBindingApprovalCustomId, buildPluginBindingResolvedText, createScopedAccountReplyToModeResolver, createStaticReplyToModeResolver, createTopLevelChannelReplyToModeResolver, ensureConfiguredBindingRouteReady, formatThreadBindingDisabledError, formatThreadBindingDurationLabel, formatThreadBindingSpawnDisabledError, getSessionBindingService, parsePluginBindingApprovalCustomId, readChannelAllowFromStore, recordInboundSession, recordInboundSessionMetaSafe, registerSessionBindingAdapter, resolveConfiguredBindingRoute, resolveConversationLabel, resolvePairingIdLabel, resolvePinnedMainDmOwnerFromAllowlist, resolvePluginConversationBindingApproval, resolveRuntimeConversationBindingRoute, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingEffectiveExpiresAt, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMs, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingIntroText, resolveThreadBindingLifecycle, resolveThreadBindingMaxAgeMs, resolveThreadBindingMaxAgeMsForChannel, resolveThreadBindingSpawnPolicy, resolveThreadBindingThreadName, resolveThreadBindingsEnabled, testing, unregisterSessionBindingAdapter, upsertChannelPairingRequest };