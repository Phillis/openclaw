import { B as buildChannelInboundEventContext, G as ChannelIngressContextBinding, K as ResolvedChannelMessageIngress, U as NativeCommandSpec, W as SessionBindingRecord, o as PluginCommandContext, s as PluginCommandResult, v as ChannelIngressQueue } from "./types-CCx6rk6K.js";
import { H as ReplyToMode, h as DiscordAccountConfig, n as OpenClawConfig, v as DiscordGuildEntry, y as DiscordIntentsConfig } from "./types.openclaw-LvSHMCsQ.js";
import { ft as resolveAgentRoute, ut as ChannelRuntimeSurface } from "./setup-wizard-types-D4fC5oCf.js";
import { E as RuntimeEnv$1 } from "./manifest-registry-BwZ4TKdq.js";
import { h as InboundEventKind, l as HistoryEntry } from "./templating-Ssjufrj6.js";
import { n as ChannelIngressMonitorLifecycle, t as ChannelIngressMonitorDeliveryResult } from "./channel-outbound-qWHa8XwZ.js";
import { M as GatewayPresenceUpdate, P as ChannelType, _ as GatewayPresenceUpdateData, a as Command, b as GatewayVoiceStateUpdateData, d as Guild, f as User, h as DiscordCommandDeployHashStore, i as Plugin, j as APIGatewayBotInfo, k as APIMessage, n as MessageCreateListener, r as Client, t as DiscordMessageDispatchData, v as GatewayReceivePayload, x as APIVoiceState, y as GatewaySendPayload } from "./discord-D6KekbmH.js";
import { p as ThreadBindingManager } from "./thread-bindings-EOC1OZLV.js";
import { t as MediaPlaceholderTextFact } from "./reply-reference-DcN72gHl.js";
import * as ws from "ws";
import { Agent } from "node:http";
import { EventEmitter } from "node:events";

//#region src/channels/channel-config.d.ts
/** How a channel config entry was selected. */
type ChannelMatchSource = "direct" | "parent" | "wildcard";
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
  guildInfo?: DiscordGuildEntryResolved | null; /** Pass pre-computed value to avoid redundant checks. */
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
type DiscordMessageEvent$1 = DiscordMessageDispatchData;
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
type DiscordIngressDispatch = (event: DiscordMessageEvent$1, lifecycle: DiscordIngressLifecycle) => Promise<DiscordIngressDispatchResult | void> | DiscordIngressDispatchResult | void;
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
//#region extensions/discord/src/monitor/message-channel-info-state.d.ts
type DiscordChannelInfo = {
  type: ChannelType;
  name?: string;
  topic?: string;
  parentId?: string;
  ownerId?: string;
};
//#endregion
//#region extensions/discord/src/monitor/message-media.d.ts
type DiscordMediaInfo = Pick<MediaPlaceholderTextFact, "contentType" | "kind" | "path">;
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
type DiscordMessageEvent = DiscordMessageEvent$1;
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
  data: DiscordMessageEvent;
  client: Client;
  message: DiscordMessageEvent["message"];
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
  data: DiscordMessageEvent;
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
type DiscordMessageDispatcher = (data: DiscordMessageEvent$1, client: Client, options?: {
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
  listVoiceChannelStates(guildId: string, channelId: string): APIVoiceState[];
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
export { resolveDiscordCommandAuthorized as A, DiscordGuildEntryResolved as C, normalizeDiscordSlug as D, normalizeDiscordAllowList as E, resolveDiscordShouldRequireMention as M, resolveGroupDmAllow as N, resolveDiscordChannelConfig as O, shouldEmitDiscordReactionNotification as P, DiscordChannelConfigResolved as S, isDiscordGroupAllowedByPolicy as T, sanitizeDiscordThreadName as _, clearGateways as a, registerDiscordListener as b, unregisterGateway as c, waitForDiscordGatewayPluginRegistration as d, MonitorDiscordOpts as f, resolveDiscordReplyTarget as g, createDiscordMessageHandler as h, setPresence as i, resolveDiscordGuildEntry as j, resolveDiscordChannelConfigWithFallback as k, createDiscordGatewayPlugin as l, createDiscordNativeCommand as m, getPresence as n, getGateway as o, monitorDiscordProvider as p, presenceCacheSize as r, registerGateway as s, clearPresences as t, resolveDiscordGatewayIntents as u, DiscordMessageEvent$1 as v, allowListMatches as w, DiscordAllowList as x, DiscordMessageHandler as y };