import { A as PluginCommandContext, N as RetryConfig, d as ResolvedChannelMessageIngress, f as ChannelIngressQueue, i as buildChannelInboundEventContext, j as PluginCommandResult, l as NativeCommandSpec, u as ChannelIngressContextBinding, vt as SessionBindingRecord } from "../../runtime-api-B8urSeFb.js";
import { J as ReplyToMode, b as DiscordIntentsConfig, g as DiscordAccountConfig, n as OpenClawConfig, q as MarkdownTableMode, y as DiscordGuildEntry } from "../../types.openclaw-R2xZRh0U.js";
import "../../types-BRhHKLsn.js";
import "../../config-contracts-CGgezQeX.js";
import { I as ChannelOutboundSessionRoute, J as OutboundMediaAccess, K as PollInput, M as ChannelDirectoryEntry, O as resolveAgentRoute, P as ChannelMessageActionAdapter, T as ChannelRuntimeSurface, _t as HistoryEntry, kt as InboundEventKind, m as ChunkMode } from "../../channel-contract-C7AAps4m.js";
import { D as RuntimeEnv$1 } from "../../manifest-registry-Bng9dXoi.js";
import "../../ssrf-runtime-if6qmXwZ.js";
import { $ as APIMessage, B as RequestClient, C as DiscordTimeoutTarget, D as Plugin, E as Client, F as User, G as APIVoiceState, H as GatewayReceivePayload, J as APIGuildScheduledEventRecurrenceRule, K as APIGuildScheduledEvent, O as Command, P as Guild, S as DiscordThreadList, T as MessageCreateListener, U as GatewaySendPayload, V as GatewayPresenceUpdateData, W as GatewayVoiceStateUpdateData, X as GuildScheduledEventPrivacyLevel, Y as GuildScheduledEventEntityType, _ as DiscordSearchQuery, a as DiscordChannelPermissionSet, at as APIEmoji, b as DiscordStickerUpload, c as DiscordMessageQuery, d as DiscordReactOpts, et as APIGuildMember, f as DiscordReactionRuntimeContext, g as DiscordRuntimeAccountContext, h as DiscordRoleChange, i as DiscordChannelMove, it as ChannelType, l as DiscordModerationTarget, m as DiscordReactionUser, n as DiscordChannelCreate, nt as GatewayPresenceUpdate, o as DiscordEmojiUpload, ot as APIRole, p as DiscordReactionSummary, q as APIGuildScheduledEventEntityMetadata, r as DiscordChannelEdit, rt as APIChannel, s as DiscordMessageEdit, st as Snowflake, tt as APIGatewayBotInfo, u as DiscordPermissionsSummary, v as DiscordSendError, w as DiscordMessageDispatchData, x as DiscordThreadCreate, y as DiscordSendResult, z as DiscordCommandDeployHashStore } from "../../runtime.messaging.shared-CkKyhXMl.js";
import { n as ChannelIngressMonitorLifecycle, t as ChannelIngressMonitorDeliveryResult } from "../../channel-outbound-Y2zUxgcH.js";
import { t as handleDiscordAction } from "../../runtime-_XCTOXRK.js";
import { a as fetchDiscordApplicationId, c as probeDiscord, i as DiscordProbe, l as resolveDiscordPrivilegedIntentsFromFlags, n as DiscordPrivilegedIntentStatus, o as fetchDiscordApplicationSummary, r as DiscordPrivilegedIntentsSummary, s as parseApplicationIdFromToken, t as DiscordApplicationSummary } from "../../probe-C4E3j0Fv.js";
import { $ as reconcileAcpThreadBindingsOnStartup, J as getThreadBindingManager, K as createNoopThreadBindingManager, O as DiscordComponentMessageSpec, Q as listThreadBindingsForAccount, X as autoBindSpawnedDiscordSubagent, Y as AcpThreadBindingReconciliationResult, Z as listThreadBindingsBySessionKey, a as DiscordReplyReference, at as ThreadBindingRecord, c as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, d as normalizeDiscordInboundWorkerTimeoutMs, et as unbindThreadBindingsBySessionKey, f as normalizeDiscordListenerTimeoutMs, i as resolveDiscordSendComponents, it as ThreadBindingManager, l as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, nt as resolveDiscordThreadBindingMaxAgeMs, o as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, ot as ThreadBindingTargetKind, p as runDiscordTaskWithTimeout, q as createThreadBindingManager, r as DiscordSendEmbeds, rt as resolveThreadBindingsEnabled, s as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, t as DiscordAllowedMentions, tt as resolveDiscordThreadBindingIdleTimeoutMs, u as isAbortError, w as DiscordComponentBuildResult } from "../../send.shared-s14lm5jB.js";
import { t as DirectoryConfigParams } from "../../directory-runtime-CekoOQfg.js";
import "../../runtime-env-CSgh0t1v.js";
import "../../media-runtime-DOU9CuQT.js";
import { t as setDiscordRuntime } from "../../runtime-CGVwdX3Q.js";
import { n as ChannelInboundMediaInput, t as ChannelInboundTurnPlan } from "../../reply-reference-DkrL3GVT.js";
import { Agent } from "node:http";
import * as ws from "ws";
import { EventEmitter } from "node:events";
//#region node_modules/discord-api-types/rest/v10/emoji.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/emoji#list-guild-emojis}
 */
type RESTGetAPIGuildEmojisResult = APIEmoji[];
//#endregion
//#region node_modules/discord-api-types/rest/v10/guildScheduledEvent.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event}
 */
interface RESTPostAPIGuildScheduledEventJSONBody {
  /**
   * The stage channel id of the guild event
   */
  channel_id?: Snowflake | undefined;
  /**
   * The name of the guild event
   */
  name: string;
  /**
   * The privacy level of the guild event
   */
  privacy_level: GuildScheduledEventPrivacyLevel;
  /**
   * The time to schedule the guild event at
   */
  scheduled_start_time: string;
  /**
   * The time when the scheduled event is scheduled to end
   */
  scheduled_end_time?: string | undefined;
  /**
   * The description of the guild event
   */
  description?: string | undefined;
  /**
   * The scheduled entity type of the guild event
   */
  entity_type: GuildScheduledEventEntityType;
  /**
   * The entity metadata of the scheduled event
   */
  entity_metadata?: APIGuildScheduledEventEntityMetadata | undefined;
  /**
   * The cover image of the scheduled event
   */
  image?: string | null | undefined;
  /**
   * The definition for how often this event should recur
   */
  recurrence_rule?: APIGuildScheduledEventRecurrenceRule | undefined;
}
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
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.persona.d.ts
declare function resolveThreadBindingPersona(params: {
  label?: string;
  agentId?: string;
}): string;
declare function resolveThreadBindingPersonaFromRecord(record: ThreadBindingRecord): string;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.state.d.ts
declare function resolveThreadBindingIdleTimeoutMs(params: {
  record: Pick<ThreadBindingRecord, "idleTimeoutMs">;
  defaultIdleTimeoutMs: number;
}): number;
declare function resolveThreadBindingMaxAgeMs(params: {
  record: Pick<ThreadBindingRecord, "maxAgeMs">;
  defaultMaxAgeMs: number;
}): number;
declare function resolveThreadBindingInactivityExpiresAt(params: {
  record: Pick<ThreadBindingRecord, "lastActivityAt" | "idleTimeoutMs">;
  defaultIdleTimeoutMs: number;
}): number | undefined;
declare function resolveThreadBindingMaxAgeExpiresAt(params: {
  record: Pick<ThreadBindingRecord, "boundAt" | "maxAgeMs">;
  defaultMaxAgeMs: number;
}): number | undefined;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-updates.d.ts
declare function setThreadBindingIdleTimeoutBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  idleTimeoutMs: number;
}): ThreadBindingRecord[];
declare function setThreadBindingMaxAgeBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  maxAgeMs: number;
}): ThreadBindingRecord[];
//#endregion
//#region src/channels/channel-config.d.ts
/** How a channel config entry was selected. */
type ChannelMatchSource = "direct" | "parent" | "wildcard";
//#endregion
//#region extensions/discord/src/actions/runtime.moderation-shared.d.ts
type DiscordModerationAction = "timeout" | "kick" | "ban";
type DiscordModerationCommand = {
  action: DiscordModerationAction;
  guildId: string;
  userId: string;
  durationMinutes?: number;
  until?: string;
  reason?: string;
  deleteMessageDays?: number;
};
declare function isDiscordModerationAction(action: string): action is DiscordModerationAction;
declare function requiredGuildPermissionForModerationAction(action: DiscordModerationAction): bigint;
declare function readDiscordModerationCommand(action: string, params: Record<string, unknown>): DiscordModerationCommand;
//#endregion
//#region extensions/discord/src/actions/runtime.shared.d.ts
declare function readDiscordParentIdParam(params: Record<string, unknown>): string | null | undefined;
declare function readDiscordChannelCreateParams(params: Record<string, unknown>): DiscordChannelCreate;
declare function readDiscordChannelEditParams(params: Record<string, unknown>): DiscordChannelEdit;
declare function readDiscordChannelMoveParams(params: Record<string, unknown>): DiscordChannelMove;
//#endregion
//#region extensions/discord/src/channel-actions.d.ts
declare const discordMessageActions: ChannelMessageActionAdapter;
//#endregion
//#region extensions/discord/src/audit-core.d.ts
type DiscordChannelPermissionsAuditEntry = {
  channelId: string;
  ok: boolean;
  missing?: string[];
  error?: string | null;
  matchKey?: string;
  matchSource?: "id";
};
type DiscordChannelPermissionsAudit = {
  ok: boolean;
  checkedChannels: number;
  unresolvedChannels: number;
  channels: DiscordChannelPermissionsAuditEntry[];
  elapsedMs: number;
};
//#endregion
//#region extensions/discord/src/audit.d.ts
declare function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): {
  channelIds: string[];
  unresolvedChannels: number;
};
declare function auditDiscordChannelPermissions(params: {
  cfg: OpenClawConfig;
  token: string;
  accountId?: string | null;
  channelIds: string[];
  timeoutMs: number;
}): Promise<DiscordChannelPermissionsAudit>;
//#endregion
//#region extensions/discord/src/directory-live.d.ts
declare function listDiscordDirectoryGroupsLive(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
declare function listDiscordDirectoryPeersLive(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
//#endregion
//#region extensions/discord/src/resolve-channels.d.ts
type DiscordChannelResolution = {
  input: string;
  resolved: boolean;
  guildId?: string;
  guildName?: string;
  channelId?: string;
  channelName?: string;
  archived?: boolean;
  note?: string;
};
declare function resolveDiscordChannelAllowlist(params: {
  token: string;
  entries: string[];
  fetcher?: typeof fetch;
}): Promise<DiscordChannelResolution[]>;
//#endregion
//#region extensions/discord/src/resolve-users.d.ts
type DiscordUserResolution = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  guildId?: string;
  guildName?: string;
  note?: string;
};
declare function resolveDiscordUserAllowlist(params: {
  token: string;
  entries: string[];
  fetcher?: typeof fetch;
}): Promise<DiscordUserResolution[]>;
//#endregion
//#region extensions/discord/src/monitor/allow-list.d.ts
type DiscordAllowList = {
  allowAll: boolean;
  ids: Set<string>;
  names: Set<string>;
};
type DiscordChannelOverrideConfig = {
  requireMention?: boolean;
  ignoreOtherMentions?: boolean;
  skills?: string[];
  enabled?: boolean;
  users?: string[];
  roles?: string[];
  systemPrompt?: string;
  includeThreadStarter?: boolean;
  autoThread?: boolean;
  autoThreadName?: "message" | "generated";
  autoArchiveDuration?: "60" | "1440" | "4320" | "10080" | 60 | 1440 | 4320 | 10080;
};
type DiscordGuildEntryResolved = Pick<DiscordGuildEntry, "presenceEvents"> & {
  id?: string;
  slug?: string;
  requireMention?: boolean;
  ignoreOtherMentions?: boolean;
  reactionNotifications?: "off" | "own" | "all" | "allowlist";
  users?: string[];
  roles?: string[];
  channels?: Record<string, DiscordChannelOverrideConfig>;
};
type DiscordChannelConfigResolved = DiscordChannelOverrideConfig & {
  allowed: boolean;
  matchKey?: string;
  matchSource?: ChannelMatchSource;
};
declare function normalizeDiscordAllowList(raw: string[] | undefined, prefixes: string[]): {
  allowAll: boolean;
  ids: Set<string>;
  names: Set<string>;
} | null;
declare function normalizeDiscordSlug(value: string): string;
declare function allowListMatches(list: DiscordAllowList, candidate: {
  id?: string;
  name?: string;
  tag?: string;
}, params?: {
  allowNameMatching?: boolean;
}): boolean;
declare function resolveDiscordCommandAuthorized(params: {
  isDirectMessage: boolean;
  allowFrom?: string[];
  guildInfo?: DiscordGuildEntryResolved | null;
  author: User;
  allowNameMatching?: boolean;
}): boolean;
declare function resolveDiscordGuildEntry(params: {
  guild?: Guild<true> | Guild | null;
  guildId?: string | null;
  guildEntries?: Record<string, DiscordGuildEntryResolved>;
}): DiscordGuildEntryResolved | null;
type DiscordChannelScope = "channel" | "thread";
declare function resolveDiscordChannelConfig(params: {
  guildInfo?: DiscordGuildEntryResolved | null;
  channelId: string;
  channelName?: string;
  channelSlug: string;
}): DiscordChannelConfigResolved | null;
declare function resolveDiscordChannelConfigWithFallback(params: {
  guildInfo?: DiscordGuildEntryResolved | null;
  channelId: string;
  channelName?: string;
  channelSlug: string;
  parentId?: string;
  parentName?: string;
  parentSlug?: string;
  scope?: DiscordChannelScope;
}): DiscordChannelConfigResolved | null;
declare function resolveDiscordShouldRequireMention(params: {
  isGuildMessage: boolean;
  isThread: boolean;
  botId?: string | null;
  threadOwnerId?: string | null;
  channelConfig?: DiscordChannelConfigResolved | null;
  guildInfo?: DiscordGuildEntryResolved | null;
  /** Pass pre-computed value to avoid redundant checks. */
  isAutoThreadOwnedByBot?: boolean;
}): boolean;
declare function isDiscordGroupAllowedByPolicy(params: {
  groupPolicy: "open" | "disabled" | "allowlist";
  guildAllowlisted: boolean;
  channelAllowlistConfigured: boolean;
  channelAllowed: boolean;
}): boolean;
declare function resolveGroupDmAllow(params: {
  channels?: string[];
  channelId: string;
  channelName?: string;
  channelSlug: string;
}): boolean;
declare function shouldEmitDiscordReactionNotification(params: {
  mode?: "off" | "own" | "all" | "allowlist";
  botId?: string;
  messageAuthorId?: string;
  userId: string;
  userName?: string;
  userTag?: string;
  channelConfig?: DiscordChannelConfigResolved | null;
  guildInfo?: DiscordGuildEntryResolved | null;
  memberRoleIds?: string[];
  allowlist?: string[];
  allowNameMatching?: boolean;
}): boolean;
//#endregion
//#region extensions/discord/src/monitor/listeners.d.ts
type DiscordRawMessageEvent = Parameters<MessageCreateListener["handle"]>[0];
type DiscordMessageEvent = DiscordMessageDispatchData;
type DiscordMessageHandler = (data: DiscordRawMessageEvent, client: Client, options?: {
  abortSignal?: AbortSignal;
}) => Promise<void>;
declare function registerDiscordListener(listeners: Array<object>, listener: object): boolean;
//#endregion
//#region extensions/discord/src/monitor/ingress.d.ts
type DiscordIngressPayload = {
  version: 1;
  receivedAt: number;
  rawMessage: APIMessage;
};
type DiscordIngressLifecycle = Omit<ChannelIngressMonitorLifecycle, "admission">;
type DiscordIngressDispatchResult = ChannelIngressMonitorDeliveryResult;
type DiscordIngressDispatch = (event: DiscordMessageEvent, lifecycle: DiscordIngressLifecycle) => Promise<DiscordIngressDispatchResult | void> | DiscordIngressDispatchResult | void;
type DiscordIngressMonitor = {
  accept: (rawMessage: APIMessage) => Promise<void>;
  start: () => void;
  stop: () => Promise<void>;
};
declare function createDiscordIngressMonitor(params: {
  accountId: string;
  client: Client;
  runtime: Pick<RuntimeEnv$1, "error" | "log">;
  dispatch: DiscordIngressDispatch;
  queue?: ChannelIngressQueue<DiscordIngressPayload>;
}): DiscordIngressMonitor;
//#endregion
//#region extensions/discord/src/monitor/message-avatar.d.ts
/** Dispatcher-lifetime resolver for eventually available Discord conversation images. */
declare function createDiscordAvatarResolver(): {
  resolve(params: {
    client: Client;
    conversationId: string;
    author: User;
    guildId?: string;
  }): string | undefined;
};
type DiscordAvatarResolver = ReturnType<typeof createDiscordAvatarResolver>;
//#endregion
//#region extensions/discord/src/monitor/message-channel-info-state.d.ts
type DiscordChannelInfo = {
  type: ChannelType;
  name?: string;
  topic?: string;
  parentId?: string;
  ownerId?: string;
};
//#endregion
//#region extensions/discord/src/monitor/sender-identity.d.ts
type DiscordSenderIdentity = {
  id: string;
  name?: string;
  tag?: string;
  label: string;
  isPluralKit: boolean;
  pluralkit?: {
    memberId: string;
    memberName?: string;
    systemId?: string;
    systemName?: string;
  };
};
//#endregion
//#region extensions/discord/src/monitor/message-handler.history.d.ts
type DiscordHistorySenderProvenance = Readonly<{
  id: string;
  name?: string;
  tag?: string;
  memberRoleIds: readonly string[];
}>;
type DiscordHistoryEntry = HistoryEntry & {
  senderProvenance: DiscordHistorySenderProvenance;
};
//#endregion
//#region extensions/discord/src/monitor/message-media.d.ts
type DiscordMediaInfo = Pick<ChannelInboundMediaInput, "contentType" | "fileName" | "kind" | "path">;
//#endregion
//#region extensions/discord/src/monitor/reply-delivery.d.ts
type DiscordThreadBindingLookupRecord = {
  accountId: string;
  channelId: string;
  threadId: string;
  agentId: string;
  label?: string;
  webhookId?: string;
  webhookToken?: string;
};
type DiscordThreadBindingLookup = {
  listBySessionKey: (targetSessionKey: string) => DiscordThreadBindingLookupRecord[];
  touchThread?: (params: {
    threadId: string;
    at?: number;
    persist?: boolean;
  }) => unknown;
};
//#endregion
//#region extensions/discord/src/monitor/threading.types.d.ts
type DiscordThreadChannel = {
  id: string;
  name?: string | null;
  parentId?: string | null;
  parent?: {
    id?: string;
    name?: string;
  };
  ownerId?: string | null;
};
//#endregion
//#region extensions/discord/src/monitor/threading.starter.d.ts
declare function resolveDiscordReplyTarget(opts: {
  replyToMode: ReplyToMode;
  replyToId?: string;
  hasReplied: boolean;
}): string | undefined;
declare function sanitizeDiscordThreadName(rawName: string, fallbackId: string): string;
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight.types.d.ts
type LoadedConfig = OpenClawConfig;
type BuildChannelInboundContext = typeof buildChannelInboundEventContext;
type RuntimeEnv = RuntimeEnv$1;
type DiscordMessageEvent$1 = DiscordMessageEvent;
type DiscordMessagePreflightSharedFields = {
  cfg: LoadedConfig;
  discordConfig: NonNullable<OpenClawConfig["channels"]>["discord"];
  accountId: string;
  token: string;
  runtime: RuntimeEnv;
  buildContext?: BuildChannelInboundContext;
  botUserId?: string;
  abortSignal?: AbortSignal;
  guildHistories: Map<string, DiscordHistoryEntry[]>;
  historyLimit: number;
  mediaMaxBytes: number;
  textLimit: number;
  replyToMode: ReplyToMode;
  ackReactionScope: "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
  groupPolicy: "open" | "disabled" | "allowlist";
  turnAdoptionLifecycle?: DiscordIngressLifecycle;
};
type DiscordMessagePreflightContext = DiscordMessagePreflightSharedFields & {
  data: DiscordMessageEvent$1;
  client: Client;
  message: DiscordMessageEvent$1["message"];
  messageChannelId: string;
  author: User;
  sender: DiscordSenderIdentity;
  canonicalMessageId?: string;
  memberRoleIds: string[];
  channelInfo: DiscordChannelInfo | null;
  channelName?: string;
  isGuildMessage: boolean;
  isDirectMessage: boolean;
  isGroupDm: boolean;
  commandAuthorized: boolean;
  channelIngress: ResolvedChannelMessageIngress;
  resolveChannelIngress: (contextBinding: ChannelIngressContextBinding, conversation?: {
    parentId?: string;
    threadId?: string;
  }) => Promise<ResolvedChannelMessageIngress>;
  baseText: string;
  messageText: string;
  preflightAudioTranscript?: string;
  preparedMedia: DiscordMediaInfo[];
  wasMentioned: boolean;
  conversationAvatar?: string;
  route: ReturnType<typeof resolveAgentRoute>;
  threadBinding?: SessionBindingRecord;
  boundSessionKey?: string;
  boundAgentId?: string;
  guildInfo: DiscordGuildEntryResolved | null;
  guildSlug: string;
  threadChannel: DiscordThreadChannel | null;
  threadParentId?: string;
  threadParentName?: string;
  threadParentType?: ChannelType;
  threadName?: string | null;
  configChannelName?: string;
  configChannelSlug: string;
  displayChannelName?: string;
  displayChannelSlug: string;
  baseSessionKey: string;
  channelConfig: DiscordChannelConfigResolved | null;
  channelAllowlistConfigured: boolean;
  channelAllowed: boolean;
  shouldRequireMention: boolean;
  groupRequireMention: boolean;
  hasAnyMention: boolean;
  hasControlCommand: boolean;
  allowTextCommands: boolean;
  shouldBypassMention: boolean;
  effectiveWasMentioned: boolean;
  inboundEventKind: InboundEventKind;
  canDetectMention: boolean;
  historyEntry?: DiscordHistoryEntry;
  threadBindings: DiscordThreadBindingLookup;
  discordRestFetch?: typeof fetch;
};
type DiscordMessagePreflightParams = DiscordMessagePreflightSharedFields & {
  dmEnabled: boolean;
  groupDmEnabled: boolean;
  groupDmChannels?: string[];
  dmPolicy: "open" | "pairing" | "allowlist" | "disabled";
  allowFrom?: string[];
  guildEntries?: Record<string, DiscordGuildEntryResolved>;
  ackReactionScope: DiscordMessagePreflightContext["ackReactionScope"];
  groupPolicy: DiscordMessagePreflightContext["groupPolicy"];
  threadBindings: DiscordThreadBindingLookup;
  discordRestFetch?: typeof fetch;
  avatarResolver?: DiscordAvatarResolver;
  data: DiscordMessageEvent$1;
  client: Client;
};
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight.d.ts
declare function preflightDiscordMessage(params: DiscordMessagePreflightParams): Promise<DiscordMessagePreflightContext | null>;
//#endregion
//#region extensions/discord/src/monitor/message-handler.process.d.ts
type DiscordMessageProcessObserver = {
  onFinalReplyStart?: () => void;
  onFinalReplyDelivered?: () => void;
  onReplyPlanResolved?: (params: {
    createdThreadId?: string;
    sessionKey?: string;
  }) => void;
};
declare function processDiscordMessage(ctx: DiscordMessagePreflightContext, observer?: DiscordMessageProcessObserver): Promise<void>;
//#endregion
//#region extensions/discord/src/monitor/status.d.ts
type DiscordMonitorStatusPatch = {
  connected?: boolean;
  lastEventAt?: number | null;
  lastTransportActivityAt?: number | null;
  lastConnectedAt?: number | null;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | null;
  lastInboundAt?: number | null;
  lastError?: string | null;
  lifecycle?: "ready" | "recovering" | "blocked";
  terminalDisconnect?: boolean;
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
};
type DiscordMonitorStatusSink = (patch: DiscordMonitorStatusPatch) => void;
//#endregion
//#region extensions/discord/src/monitor/message-run-queue.d.ts
type ProcessDiscordMessage = typeof processDiscordMessage;
type DiscordMessageRunQueueTestingHooks = {
  processDiscordMessage?: ProcessDiscordMessage;
};
//#endregion
//#region extensions/discord/src/monitor/message-dispatcher.d.ts
type PreflightDiscordMessage = typeof preflightDiscordMessage;
type DiscordMessageHandlerParams$1 = Omit<DiscordMessagePreflightParams, "ackReactionScope" | "groupPolicy" | "data" | "client"> & {
  setStatus?: DiscordMonitorStatusSink;
  abortSignal?: AbortSignal;
  testing?: DiscordMessageHandlerTestingHooks;
};
type DiscordMessageHandlerTestingHooks = DiscordMessageRunQueueTestingHooks & {
  preflightDiscordMessage?: PreflightDiscordMessage;
  createIngressMonitor?: typeof createDiscordIngressMonitor;
};
type DiscordMessageDispatcher = (data: DiscordMessageEvent, client: Client, options?: {
  abortSignal?: AbortSignal;
  turnAdoptionLifecycle?: DiscordIngressLifecycle;
}) => Promise<DiscordIngressDispatchResult | void>;
type DiscordMessageDispatcherWithLifecycle = DiscordMessageDispatcher & {
  deactivate: () => Promise<void>;
};
declare function createDiscordMessageDispatcher(params: DiscordMessageHandlerParams$1): DiscordMessageDispatcherWithLifecycle;
//#endregion
//#region extensions/discord/src/monitor/message-handler.d.ts
type DiscordMessageHandlerParams = Parameters<typeof createDiscordMessageDispatcher>[0];
type DiscordMessageHandlerWithLifecycle = DiscordMessageHandler & {
  deactivate: () => Promise<void>;
};
declare function createDiscordMessageHandler(params: DiscordMessageHandlerParams & {
  client: Client;
}): DiscordMessageHandlerWithLifecycle;
//#endregion
//#region src/plugins/plugin-command-runtime.d.ts
declare const pluginCommandDispatchBrand: unique symbol;
type PluginCommandDispatchContext = Readonly<{
  senderId?: string;
  channel: string;
  channelId?: PluginCommandContext["channelId"];
  isAuthorizedSender: boolean;
  senderIsOwner?: boolean;
  gatewayClientScopes?: PluginCommandContext["gatewayClientScopes"];
  agentId?: string;
  sessionKey?: PluginCommandContext["sessionKey"];
  sessionId?: PluginCommandContext["sessionId"];
  sessionTarget?: PluginCommandContext["sessionTarget"];
  sessionFile?: PluginCommandContext["sessionFile"];
  authProfileId?: string;
  commandBody: string;
  config: OpenClawConfig;
  from?: PluginCommandContext["from"];
  to?: PluginCommandContext["to"];
  originatingTo?: string;
  accountId?: PluginCommandContext["accountId"];
  messageThreadId?: PluginCommandContext["messageThreadId"];
  threadParentId?: PluginCommandContext["threadParentId"];
  diagnosticsSessions?: PluginCommandContext["diagnosticsSessions"];
  diagnosticsUploadApproved?: PluginCommandContext["diagnosticsUploadApproved"];
  diagnosticsPreviewOnly?: PluginCommandContext["diagnosticsPreviewOnly"];
  diagnosticsPrivateRouted?: PluginCommandContext["diagnosticsPrivateRouted"];
  runtimeContext?: {
    compactCurrent?: (signal?: AbortSignal) => ReturnType<NonNullable<NonNullable<PluginCommandContext["runtimeContext"]>["compactCurrent"]>>;
  };
}>;
/** Opaque capability bound to one selected command in one registry generation. */
type PluginCommandDispatch = Readonly<{
  kind: "plugin";
  execute: (context: PluginCommandDispatchContext) => Promise<PluginCommandResult>;
  [pluginCommandDispatchBrand]: true;
}>;
type PluginCommandCatalogDecision = PluginCommandDispatch | Readonly<{
  kind: "non-plugin";
}>;
type PluginCommandNativeCandidate = Readonly<{
  name: string;
  description: string;
  descriptionLocalizations?: Readonly<Record<string, string>>;
  acceptsArgs: boolean;
  requireAuth: boolean;
  progressMessage?: string;
  prepareDispatch: (rawArgs?: string) => PluginCommandCatalogDecision;
}>;
//#endregion
//#region extensions/discord/src/monitor/native-command.types.d.ts
type DiscordConfig = NonNullable<OpenClawConfig["channels"]>["discord"];
type DiscordDispatchReplyFromConfig = NonNullable<ChannelInboundTurnPlan["dispatchReplyFromConfig"]>;
//#endregion
//#region extensions/discord/src/monitor/native-command.d.ts
declare function createDiscordNativeCommand(params: {
  command: NativeCommandSpec | PluginCommandNativeCandidate;
  cfg: OpenClawConfig;
  discordConfig: DiscordConfig;
  accountId: string;
  sessionPrefix: string;
  ephemeralDefault: boolean;
  threadBindings: ThreadBindingManager;
  dispatchReplyFromConfig?: DiscordDispatchReplyFromConfig;
}): Command;
//#endregion
//#region extensions/discord/src/monitor/provider.d.ts
type MonitorDiscordOpts = {
  token?: string;
  accountId?: string;
  config?: OpenClawConfig;
  runtime?: RuntimeEnv$1;
  channelRuntime?: ChannelRuntimeSurface;
  abortSignal?: AbortSignal;
  mediaMaxMb?: number;
  historyLimit?: number;
  replyToMode?: ReplyToMode;
  setStatus?: DiscordMonitorStatusSink;
  commandDeployHashStore?: DiscordCommandDeployHashStore;
};
declare function monitorDiscordProvider(opts?: MonitorDiscordOpts): Promise<void>;
//#endregion
//#region extensions/discord/src/internal/gateway-voice-state-cache.d.ts
type DiscordGatewayVoiceStateTransition = {
  current: APIVoiceState;
  previous?: APIVoiceState;
};
//#endregion
//#region extensions/discord/src/internal/gateway.d.ts
type UpdatePresenceData = Omit<GatewayPresenceUpdateData, "status"> & {
  status: "online" | "idle" | "dnd" | "invisible" | "offline";
};
type RequestGuildMembersData = {
  guild_id: string;
  query?: string;
  limit: number;
  presences?: boolean;
  user_ids?: string | string[];
  nonce?: string;
};
type GatewayPluginOptions = {
  reconnect?: {
    maxAttempts?: number;
  };
  intents?: number;
  autoInteractions?: boolean;
  shard?: [number, number];
  url?: string;
};
declare class GatewayPlugin extends Plugin {
  readonly id = "gateway";
  protected client?: Client;
  readonly options: Required<Pick<GatewayPluginOptions, "autoInteractions">> & GatewayPluginOptions;
  ws: ws.WebSocket | null;
  sequence: number | null;
  lastHeartbeatAck: boolean;
  emitter: EventEmitter<any>;
  shardId?: number;
  totalShards?: number;
  protected gatewayInfo?: APIGatewayBotInfo;
  isConnected: boolean;
  private sessionId;
  private resumeGatewayUrl;
  private reconnectAttempts;
  private consecutiveResumeFailures;
  private shouldReconnect;
  private isConnecting;
  private readonly heartbeatTimers;
  private readonly reconnectTimer;
  private readonly voiceStateCache;
  private outboundLimiter;
  constructor(options: GatewayPluginOptions, gatewayInfo?: APIGatewayBotInfo);
  get ping(): number | null;
  listVoiceChannelStates(guildId: string, channelId: string): APIVoiceState[] | null;
  fetchGuildEmojis<T>(guildId: string, fetcher: () => Promise<T>): Promise<T>;
  takeVoiceStateTransition(state: APIVoiceState): DiscordGatewayVoiceStateTransition | null;
  get heartbeatInterval(): NodeJS.Timeout | undefined;
  set heartbeatInterval(timer: NodeJS.Timeout | undefined);
  get firstHeartbeatTimeout(): NodeJS.Timeout | undefined;
  set firstHeartbeatTimeout(timer: NodeJS.Timeout | undefined);
  registerClient(client: Client): Promise<void>;
  connect(resume?: boolean): void;
  disconnect(): void;
  protected createWebSocket(url: string): ws.WebSocket;
  private setupWebSocket;
  private handlePayload;
  private startHeartbeat;
  private stopHeartbeat;
  private stopReconnectTimer;
  private sendHeartbeat;
  private identify;
  private identifyWithConcurrency;
  send(payload: GatewaySendPayload | GatewayReceivePayload, skipRateLimit?: boolean): void;
  private sendSerializedGatewayEvent;
  private handleDispatch;
  private resetSessionState;
  private getResumeState;
  private scheduleReconnect;
  updatePresence(data: UpdatePresenceData): void;
  updateVoiceState(data: GatewayVoiceStateUpdateData): void;
  requestGuildMembers(data: RequestGuildMembersData): void;
  getRateLimitStatus(): {
    remainingEvents: number;
    resetTime: number;
    currentEventCount: number;
    queuedEvents: number;
    droppedEvents: number;
  };
  hasIntent(intent: number): boolean;
}
//#endregion
//#region extensions/discord/src/monitor/gateway-plugin.d.ts
type DiscordGatewayWebSocketCtor = typeof ws.WebSocket;
type DiscordGatewayClient = Parameters<GatewayPlugin["registerClient"]>[0];
type GatewayPluginTestingOptions = {
  registerClient?: (plugin: GatewayPlugin, client: DiscordGatewayClient) => Promise<void>;
  webSocketCtor?: DiscordGatewayWebSocketCtor;
};
type CreateDiscordGatewayPluginTestingOptions = GatewayPluginTestingOptions & {
  createProxyAgent?: (proxyUrl: string) => Agent;
};
type ResolveDiscordGatewayIntentsParams = {
  intentsConfig?: DiscordIntentsConfig;
  voiceEnabled?: boolean;
};
declare function resolveDiscordGatewayIntents(params?: ResolveDiscordGatewayIntentsParams): number;
declare function waitForDiscordGatewayPluginRegistration(plugin: unknown): Promise<void> | undefined;
declare function createDiscordGatewayPlugin(params: {
  discordConfig: DiscordAccountConfig;
  runtime: RuntimeEnv$1;
  testing?: CreateDiscordGatewayPluginTestingOptions;
}): GatewayPlugin;
//#endregion
//#region extensions/discord/src/monitor/gateway-registry.d.ts
/** Register a GatewayPlugin instance for an account. */
declare function registerGateway(accountId: string | undefined, gateway: GatewayPlugin): void;
/** Unregister a GatewayPlugin instance for an account. */
declare function unregisterGateway(accountId?: string): void;
/** Get the GatewayPlugin for an account. Returns undefined if not registered. */
declare function getGateway(accountId?: string): GatewayPlugin | undefined;
/** Clear all registered gateways (for testing). */
declare function clearGateways(): void;
//#endregion
//#region extensions/discord/src/monitor/presence-cache.d.ts
/** Update cached presence for a user. */
declare function setPresence(accountId: string | undefined, userId: string, data: GatewayPresenceUpdate): void;
/** Get cached presence for a user. Returns undefined if not cached. */
declare function getPresence(accountId: string | undefined, userId: string): GatewayPresenceUpdate | undefined;
/** Clear cached presence data. */
declare function clearPresences(accountId?: string): void;
/** Get the number of cached presence entries. */
declare function presenceCacheSize(): number;
//#endregion
//#region extensions/discord/src/outbound-session-route.d.ts
type ResolveDiscordOutboundSessionRouteParams = {
  cfg: OpenClawConfig;
  agentId: string;
  accountId?: string | null;
  target: string;
  resolvedTarget?: {
    kind: string;
  };
  replyToId?: string | null;
  threadId?: string | number | null;
};
declare function resolveDiscordOutboundSessionRoute(params: ResolveDiscordOutboundSessionRouteParams): ChannelOutboundSessionRoute | null;
//#endregion
//#region extensions/discord/src/send.channels.d.ts
declare function createChannelDiscord(payload: DiscordChannelCreate, opts: DiscordReactOpts): Promise<APIChannel>;
declare function editChannelDiscord(payload: DiscordChannelEdit, opts: DiscordReactOpts): Promise<APIChannel>;
declare function deleteChannelDiscord(channelId: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
  channelId: string;
}>;
declare function moveChannelDiscord(payload: DiscordChannelMove, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function setChannelPermissionDiscord(payload: DiscordChannelPermissionSet, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function removeChannelPermissionDiscord(channelId: string, targetId: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
//#endregion
//#region extensions/discord/src/send.emojis-stickers.d.ts
declare function listGuildEmojisDiscord(guildId: string, opts: DiscordReactOpts): Promise<RESTGetAPIGuildEmojisResult>;
declare function uploadEmojiDiscord(payload: DiscordEmojiUpload, opts: DiscordReactOpts): Promise<unknown>;
declare function uploadStickerDiscord(payload: DiscordStickerUpload, opts: DiscordReactOpts): Promise<unknown>;
//#endregion
//#region extensions/discord/src/send.guild.d.ts
type DiscordAbsentVoiceState = Pick<APIVoiceState, "guild_id" | "user_id" | "channel_id"> & {
  connected: false;
  absent: true;
  reason: "unknown_voice_state";
};
type DiscordVoiceStatus = APIVoiceState | DiscordAbsentVoiceState;
declare function fetchMemberInfoDiscord(guildId: string, userId: string, opts: DiscordReactOpts): Promise<APIGuildMember>;
declare function fetchRoleInfoDiscord(guildId: string, opts: DiscordReactOpts): Promise<APIRole[]>;
declare function addRoleDiscord(payload: DiscordRoleChange, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function removeRoleDiscord(payload: DiscordRoleChange, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function fetchChannelInfoDiscord(channelId: string, opts: DiscordReactOpts): Promise<APIChannel>;
declare function listGuildChannelsDiscord(guildId: string, opts: DiscordReactOpts): Promise<APIChannel[]>;
declare function fetchVoiceStatusDiscord(guildId: string, userId: string, opts: DiscordReactOpts): Promise<DiscordVoiceStatus>;
declare function listScheduledEventsDiscord(guildId: string, opts: DiscordReactOpts): Promise<APIGuildScheduledEvent[]>;
declare function resolveEventCoverImage(imageUrl: string, opts?: {
  localRoots?: readonly string[];
}): Promise<string>;
declare function createScheduledEventDiscord(guildId: string, payload: RESTPostAPIGuildScheduledEventJSONBody, opts: DiscordReactOpts): Promise<APIGuildScheduledEvent>;
declare function timeoutMemberDiscord(payload: DiscordTimeoutTarget, opts: DiscordReactOpts): Promise<APIGuildMember>;
declare function kickMemberDiscord(payload: DiscordModerationTarget, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function banMemberDiscord(payload: DiscordModerationTarget & {
  deleteMessageDays?: number;
}, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
//#endregion
//#region extensions/discord/src/send.messages.d.ts
declare function readMessagesDiscord(channelId: string, query: DiscordMessageQuery | undefined, opts: DiscordReactOpts): Promise<APIMessage[]>;
declare function fetchMessageDiscord(channelId: string, messageId: string, opts: DiscordReactOpts): Promise<APIMessage>;
declare function editMessageDiscord(channelId: string, messageId: string, payload: DiscordMessageEdit, opts: DiscordReactOpts): Promise<APIMessage>;
declare function deleteMessageDiscord(channelId: string, messageId: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function pinMessageDiscord(channelId: string, messageId: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function unpinMessageDiscord(channelId: string, messageId: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function listPinsDiscord(channelId: string, opts: DiscordReactOpts): Promise<APIMessage[]>;
declare function createThreadDiscord(channelId: string, payload: DiscordThreadCreate, opts: DiscordReactOpts): Promise<APIChannel>;
declare function listThreadsDiscord(payload: DiscordThreadList, opts: DiscordReactOpts): Promise<unknown>;
declare function searchMessagesDiscord(query: DiscordSearchQuery, opts: DiscordReactOpts): Promise<Record<string, unknown>>;
//#endregion
//#region extensions/discord/src/send.outbound.d.ts
type DiscordSendOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  mediaUrl?: string;
  filename?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  verbose?: boolean;
  rest?: RequestClient;
  reply?: DiscordReplyReference;
  retry?: RetryConfig;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  components?: Parameters<typeof resolveDiscordSendComponents>[0]["components"];
  embeds?: DiscordSendEmbeds;
  silent?: boolean;
  threadId?: string | number;
  suppressEmbeds?: boolean;
  allowedMentions?: DiscordAllowedMentions;
  /** Persist each concrete platform send before any later chunk can fail. */
  onDeliveryResult?: (result: DiscordSendResult) => Promise<void> | void;
  /** @internal Refresh durable custody immediately before Discord REST I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
};
declare function sendMessageDiscord(to: string, text: string, opts: DiscordSendOpts): Promise<DiscordSendResult>;
declare function sendStickerDiscord(to: string, stickerIds: string[], opts: DiscordSendOpts & {
  content?: string;
}): Promise<DiscordSendResult>;
declare function sendPollDiscord(to: string, poll: PollInput, opts: DiscordSendOpts & {
  content?: string;
}): Promise<DiscordSendResult>;
//#endregion
//#region extensions/discord/src/send.webhook.d.ts
type DiscordWebhookSendOpts = {
  cfg: OpenClawConfig;
  webhookId: string;
  webhookToken: string;
  accountId?: string;
  threadId?: string | number;
  replyTo?: string;
  username?: string;
  avatarUrl?: string;
  wait?: boolean;
  onPlatformSendDispatch?: () => Promise<void>;
};
declare function sendWebhookMessageDiscord(text: string, opts: DiscordWebhookSendOpts): Promise<DiscordSendResult>;
//#endregion
//#region extensions/discord/src/send.voice.d.ts
type VoiceMessageOpts = Pick<Parameters<typeof sendMessageDiscord>[2], "cfg" | "token" | "accountId" | "verbose" | "rest" | "reply" | "retry" | "silent" | "mediaAccess" | "mediaLocalRoots" | "mediaReadFile" | "onPlatformSendDispatch">;
/**
 * Send a voice message to Discord.
 *
 * Voice messages are a special Discord feature that displays audio with a waveform
 * visualization. They require OGG/Opus format and cannot include text content.
 *
 * @param to - Recipient (user ID for DM or channel ID)
 * @param audioPath - Path to local audio file (will be converted to OGG/Opus if needed)
 * @param opts - Send options
 */
declare function sendVoiceMessageDiscord(to: string, audioPath: string, opts: VoiceMessageOpts): Promise<DiscordSendResult>;
//#endregion
//#region extensions/discord/src/send.typing.d.ts
declare function sendTypingDiscord(channelId: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
  channelId: string;
}>;
//#endregion
//#region extensions/discord/src/send.permissions.d.ts
/**
 * Fetch guild-level permissions for a user. This does not include channel-specific overwrites.
 */
declare function fetchMemberGuildPermissionsDiscord(guildId: string, userId: string, opts: DiscordReactOpts): Promise<bigint | null>;
/**
 * Returns true when the user has ADMINISTRATOR or any required permission bit.
 */
declare function hasAnyGuildPermissionDiscord(guildId: string, userId: string, requiredPermissions: bigint[], opts: DiscordReactOpts): Promise<boolean>;
/**
 * Returns true when the user has ADMINISTRATOR or all required permission bits.
 */
declare function hasAllGuildPermissionsDiscord(guildId: string, userId: string, requiredPermissions: bigint[], opts: DiscordReactOpts): Promise<boolean>;
declare function fetchChannelPermissionsDiscord(channelId: string, opts: DiscordReactOpts): Promise<DiscordPermissionsSummary>;
//#endregion
//#region extensions/discord/src/send.reactions.d.ts
declare function reactMessageDiscord(channelId: string, messageId: string, emoji: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function removeReactionDiscord(channelId: string, messageId: string, emoji: string, opts: DiscordReactOpts): Promise<{
  ok: boolean;
}>;
declare function removeOwnReactionsDiscord(channelId: string, messageId: string, opts: DiscordReactOpts): Promise<{
  ok: true;
  removed: string[];
}>;
declare function fetchReactionsDiscord(channelId: string, messageId: string, opts: DiscordReactOpts & {
  limit?: number;
}): Promise<DiscordReactionSummary[]>;
//#endregion
//#region extensions/discord/src/send.components.d.ts
type DiscordComponentSendOpts = {
  cfg: OpenClawConfig;
  accountId?: string;
  token?: string;
  rest?: RequestClient;
  silent?: boolean;
  reply?: DiscordReplyReference;
  sessionKey?: string;
  agentId?: string;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  suppressEmbeds?: boolean;
  allowedMentions?: DiscordAllowedMentions;
  /** Persist the concrete platform send before component bookkeeping can fail. */
  onDeliveryResult?: (result: DiscordSendResult) => Promise<void> | void;
  onPlatformSendDispatch?: () => Promise<void>;
};
declare function registerBuiltDiscordComponentMessage(params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
  ttlMs?: number;
}): void;
declare function sendDiscordComponentMessage(to: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
declare function editDiscordComponentMessage(to: string, messageId: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
//#endregion
export { type AcpThreadBindingReconciliationResult, DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, type DiscordAllowList, type DiscordApplicationSummary, type DiscordChannelConfigResolved, type DiscordChannelCreate, type DiscordChannelEdit, type DiscordChannelMove, type DiscordChannelPermissionSet, type DiscordChannelResolution, type DiscordEmojiUpload, type DiscordGuildEntryResolved, type DiscordMessageEdit, type DiscordMessageEvent, type DiscordMessageHandler, type DiscordMessageQuery, type DiscordModerationAction, type DiscordModerationCommand, type DiscordModerationTarget, type DiscordPermissionsSummary, type DiscordPrivilegedIntentStatus, type DiscordPrivilegedIntentsSummary, type DiscordProbe, type DiscordReactOpts, type DiscordReactionRuntimeContext, type DiscordReactionSummary, type DiscordReactionUser, type DiscordRoleChange, type DiscordRuntimeAccountContext, type DiscordSearchQuery, DiscordSendError, type DiscordSendResult, type DiscordStickerUpload, type DiscordThreadCreate, type DiscordThreadList, type DiscordTimeoutTarget, type DiscordUserResolution, type MonitorDiscordOpts, type ResolveDiscordOutboundSessionRouteParams, type ThreadBindingManager, type ThreadBindingRecord, type ThreadBindingTargetKind, addRoleDiscord, allowListMatches, auditDiscordChannelPermissions, autoBindSpawnedDiscordSubagent, banMemberDiscord, clearGateways, clearPresences, collectDiscordAuditChannelIds, createChannelDiscord, createDiscordGatewayPlugin, createDiscordMessageHandler, createDiscordNativeCommand, createNoopThreadBindingManager, createScheduledEventDiscord, createThreadBindingManager, createThreadDiscord, deleteChannelDiscord, deleteMessageDiscord, discordMessageActions, editChannelDiscord, editDiscordComponentMessage, editMessageDiscord, fetchChannelInfoDiscord, fetchChannelPermissionsDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchMemberGuildPermissionsDiscord, fetchMemberInfoDiscord, fetchMessageDiscord, fetchReactionsDiscord, fetchRoleInfoDiscord, fetchVoiceStatusDiscord, formatThreadBindingDurationLabel, getGateway, getPresence, getThreadBindingManager, handleDiscordAction, hasAllGuildPermissionsDiscord, hasAnyGuildPermissionDiscord, isAbortError, isDiscordGroupAllowedByPolicy, isDiscordModerationAction, kickMemberDiscord, listDiscordDirectoryGroupsLive, listDiscordDirectoryPeersLive, listGuildChannelsDiscord, listGuildEmojisDiscord, listPinsDiscord, listScheduledEventsDiscord, listThreadBindingsBySessionKey, listThreadBindingsForAccount, listThreadsDiscord, monitorDiscordProvider, moveChannelDiscord, normalizeDiscordAllowList, normalizeDiscordInboundWorkerTimeoutMs, normalizeDiscordListenerTimeoutMs, normalizeDiscordSlug, parseApplicationIdFromToken, pinMessageDiscord, presenceCacheSize, probeDiscord, reactMessageDiscord, readDiscordChannelCreateParams, readDiscordChannelEditParams, readDiscordChannelMoveParams, readDiscordModerationCommand, readDiscordParentIdParam, readMessagesDiscord, reconcileAcpThreadBindingsOnStartup, registerBuiltDiscordComponentMessage, registerDiscordListener, registerGateway, removeChannelPermissionDiscord, removeOwnReactionsDiscord, removeReactionDiscord, removeRoleDiscord, requiredGuildPermissionForModerationAction, resolveDiscordChannelAllowlist, resolveDiscordChannelConfig, resolveDiscordChannelConfigWithFallback, resolveDiscordCommandAuthorized, resolveDiscordGatewayIntents, resolveDiscordGuildEntry, resolveDiscordOutboundSessionRoute, resolveDiscordPrivilegedIntentsFromFlags, resolveDiscordReplyTarget, resolveDiscordShouldRequireMention, resolveDiscordThreadBindingIdleTimeoutMs, resolveDiscordThreadBindingMaxAgeMs, resolveDiscordUserAllowlist, resolveEventCoverImage, resolveGroupDmAllow, resolveThreadBindingIdleTimeoutMs, resolveThreadBindingInactivityExpiresAt, resolveThreadBindingIntroText, resolveThreadBindingMaxAgeExpiresAt, resolveThreadBindingMaxAgeMs, resolveThreadBindingPersona, resolveThreadBindingPersonaFromRecord, resolveThreadBindingThreadName, resolveThreadBindingsEnabled, runDiscordTaskWithTimeout, sanitizeDiscordThreadName, searchMessagesDiscord, sendDiscordComponentMessage, sendMessageDiscord, sendPollDiscord, sendStickerDiscord, sendTypingDiscord, sendVoiceMessageDiscord, sendWebhookMessageDiscord, setChannelPermissionDiscord, setDiscordRuntime, setPresence, setThreadBindingIdleTimeoutBySessionKey, setThreadBindingMaxAgeBySessionKey, shouldEmitDiscordReactionNotification, timeoutMemberDiscord, unbindThreadBindingsBySessionKey, unpinMessageDiscord, unregisterGateway, uploadEmojiDiscord, uploadStickerDiscord, waitForDiscordGatewayPluginRegistration };