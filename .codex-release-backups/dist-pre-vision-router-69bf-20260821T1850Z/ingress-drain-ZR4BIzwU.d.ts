import { M as AccessGroupConfig, r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { C as ChannelImplicitMentionsConfig } from "./types.channels-B7ph6mKI.js";
import { t as InboundEventKind } from "./kind-CC2t750M.js";
import { n as ChatChannelId } from "./channel-id.types-CjcGKHk0.js";
import { DatabaseSync } from "node:sqlite";

//#region src/config/implicit-mentions.d.ts
type ResolvedChannelImplicitMentions = Required<ChannelImplicitMentionsConfig>;
/** Resolves each implicit-mention kind using account, channel, defaults, then shipped behavior. */
declare function resolveChannelImplicitMentions(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string | null;
}): ResolvedChannelImplicitMentions;
//#endregion
//#region src/channels/mention-gating.d.ts
type InboundImplicitMentionKind = "reply_to_bot" | "quoted_bot" | "bot_thread_participant" | "native";
type InboundMentionFacts = {
  canDetectMention: boolean;
  wasMentioned: boolean;
  hasAnyMention?: boolean;
  implicitMentionKinds?: readonly InboundImplicitMentionKind[];
};
type InboundMentionPolicy = {
  isGroup: boolean;
  requireMention: boolean;
  implicitMentions?: ChannelImplicitMentionsConfig;
  allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
  allowTextCommands: boolean;
  hasControlCommand: boolean;
  commandAuthorized: boolean;
};
/** @deprecated Prefer the nested `{ facts, policy }` call shape for new code. */
type ResolveInboundMentionDecisionFlatParams = InboundMentionFacts & InboundMentionPolicy;
type ResolveInboundMentionDecisionNestedParams = {
  facts: InboundMentionFacts;
  policy: InboundMentionPolicy;
};
type ResolveInboundMentionDecisionParams = ResolveInboundMentionDecisionFlatParams | ResolveInboundMentionDecisionNestedParams;
type InboundMentionDecision = {
  effectiveWasMentioned: boolean;
  shouldSkip: boolean;
  implicitMention: boolean;
  matchedImplicitMentionKinds: InboundImplicitMentionKind[];
  shouldBypassMention: boolean;
};
declare function implicitMentionKindWhen(kind: InboundImplicitMentionKind, enabled: boolean): InboundImplicitMentionKind[];
declare function resolveInboundMentionDecision(params: ResolveInboundMentionDecisionParams): InboundMentionDecision;
//#endregion
//#region src/channels/message-access/types.d.ts
/** Channel identifier used in ingress diagnostics and config lookups. */
type ChannelIngressChannelId = ChatChannelId;
/** Redacted identifier category used by allowlist normalization and matching. */
type ChannelIngressIdentifierKind = "stable-id" | "username" | "email" | "phone" | "role" | `plugin:${string}`;
/** Public, redacted identifier material that can participate in allowlist matching. */
type MatchableIdentifier = {
  opaqueId: string;
  kind: ChannelIngressIdentifierKind;
  dangerous?: boolean;
  sensitivity?: "normal" | "pii";
};
/** Internal identifier material with the raw comparable value retained. */
type InternalMatchMaterial = MatchableIdentifier & {
  value: string;
};
/** Internal subject representation used by the shared ingress kernel. */
type InternalChannelIngressSubject = {
  identifiers: InternalMatchMaterial[];
};
/** Public, redacted form of a normalized allowlist entry. */
type ChannelIngressNormalizedEntry = {
  opaqueEntryId: string;
  kind: ChannelIngressIdentifierKind;
  dangerous?: boolean;
  sensitivity?: "normal" | "pii";
};
/** Internal normalized allowlist entry with its raw comparable value retained. */
type InternalNormalizedEntry = ChannelIngressNormalizedEntry & {
  value: string;
};
/** Redacted diagnostic for an invalid, disabled, or unsupported allowlist entry. */
type RedactedIngressEntryDiagnostic = {
  opaqueEntryId?: string;
  reasonCode: IngressReasonCode;
};
/** Redacted allowlist match result exposed to callers and access facts. */
type RedactedIngressMatch = {
  matched: boolean;
  matchedEntryIds: string[];
};
/** Public normalization result for a set of allowlist entries. */
type ChannelIngressNormalizeResult = {
  matchable: ChannelIngressNormalizedEntry[];
  invalid: RedactedIngressEntryDiagnostic[];
  disabled: RedactedIngressEntryDiagnostic[];
};
/** Internal normalization result with raw comparable entry values retained. */
type InternalChannelIngressNormalizeResult = Omit<ChannelIngressNormalizeResult, "matchable"> & {
  matchable: InternalNormalizedEntry[];
};
/** Adapter that gives the shared ingress kernel channel-specific identity matching. */
type InternalChannelIngressAdapter = {
  normalizeEntries(params: {
    entries: readonly string[];
    context: "dm" | "group" | "route" | "command";
    accountId: string;
  }): InternalChannelIngressNormalizeResult | Promise<InternalChannelIngressNormalizeResult>;
  matchSubject(params: {
    subject: InternalChannelIngressSubject;
    entries: readonly InternalNormalizedEntry[];
    context: "dm" | "group" | "route" | "command";
  }): RedactedIngressMatch | Promise<RedactedIngressMatch>;
};
/** Resolved access-group membership fact used by allowlist entries. */
type AccessGroupMembershipFact = {
  kind: "matched";
  groupName: string;
  source: "static" | "dynamic";
  matchedEntryIds: string[];
} | {
  kind: "not-matched";
  groupName: string;
  source: "static" | "dynamic";
} | {
  kind: "missing" | "unsupported" | "failed";
  groupName: string;
  source: "static" | "dynamic";
  reasonCode: IngressReasonCode;
  diagnosticId?: string;
};
/** Fully normalized allowlist facts for one ingress gate. */
type ResolvedIngressAllowlist = {
  rawEntryCount: number;
  normalizedEntries: ChannelIngressNormalizedEntry[];
  invalidEntries: RedactedIngressEntryDiagnostic[];
  disabledEntries: RedactedIngressEntryDiagnostic[];
  matchedEntryIds: string[];
  hasConfiguredEntries: boolean;
  hasMatchableEntries: boolean;
  hasWildcard: boolean;
  accessGroups: {
    referenced: string[];
    matched: string[];
    missing: string[];
    unsupported: string[];
    failed: string[];
  };
  match: RedactedIngressMatch;
};
/** Redacted allowlist facts safe to expose in the access graph. */
type RedactedIngressAllowlistFacts = {
  configured: boolean;
  matched: boolean;
  reasonCode: IngressReasonCode;
  matchedEntryIds: string[];
  invalidEntryCount: number;
  disabledEntryCount: number;
  accessGroups: ResolvedIngressAllowlist["accessGroups"];
};
/** Route lookup state projected into the ingress access graph. */
type RouteGateState = "not-configured" | "matched" | "not-matched" | "disabled" | "lookup-failed";
/** How a matched route affects sender allowlist evaluation. */
type RouteSenderPolicy = "inherit" | "replace" | "deny-when-empty";
/** Source list used when a route sender policy contributes sender entries. */
type RouteSenderAllowlistSource = "effective-dm" | "effective-group";
/** Raw route gate facts supplied by a channel-specific router. */
type RouteGateFacts = {
  id: string;
  kind: "route" | "routeSender" | "membership" | "ownerAllowlist" | "nestedAllowlist";
  gate: RouteGateState;
  effect: "allow" | "block-dispatch" | "ignore";
  precedence: number;
  senderPolicy: RouteSenderPolicy;
  senderAllowFrom?: Array<string | number>;
  senderAllowFromSource?: RouteSenderAllowlistSource;
  match?: RedactedIngressMatch;
};
/** Route gate facts after any route-specific sender allowlist is normalized. */
type ResolvedRouteGateFacts = Omit<RouteGateFacts, "senderAllowFrom" | "senderAllowFromSource"> & {
  senderAllowlist?: ResolvedIngressAllowlist;
};
/** Inbound event facts used to choose command, pairing, and origin-subject rules. */
type ChannelIngressEventInput = {
  kind: "message" | "reaction" | "button" | "postback" | "native-command" | "slash-command" | "system";
  authMode: "inbound" | "command" | "origin-subject" | "route-only" | "none";
  mayPair: boolean;
  originSubject?: InternalChannelIngressSubject;
};
/** Redacted event facts exposed in decisions and access facts. */
type RedactedChannelIngressEvent = Omit<ChannelIngressEventInput, "originSubject"> & {
  hasOriginSubject: boolean;
  originSubjectMatched: boolean;
};
/** Complete raw input to the shared ingress state resolver. */
type ChannelIngressStateInput = {
  channelId: ChannelIngressChannelId;
  accountId: string;
  subject: InternalChannelIngressSubject;
  conversation: {
    kind: "direct" | "group" | "channel";
    id: string;
    parentId?: string;
    threadId?: string;
    title?: string;
  };
  adapter: InternalChannelIngressAdapter;
  accessGroups?: Record<string, AccessGroupConfig>;
  accessGroupMembership?: readonly AccessGroupMembershipFact[];
  routeFacts?: RouteGateFacts[];
  mentionFacts?: InboundMentionFacts;
  event: ChannelIngressEventInput;
  allowlists: {
    dm?: Array<string | number>;
    group?: Array<string | number>;
    commandOwner?: Array<string | number>;
    commandGroup?: Array<string | number>;
    pairingStore?: Array<string | number>;
  };
};
/** Policy knobs that decide how the ingress graph is evaluated. */
type ChannelIngressPolicyInput = {
  dmPolicy: "pairing" | "allowlist" | "open" | "disabled";
  groupPolicy: "allowlist" | "open" | "disabled";
  groupAllowFromFallbackToAllowFrom?: boolean;
  mutableIdentifierMatching?: "disabled" | "enabled";
  activation?: {
    requireMention: boolean;
    allowTextCommands: boolean;
    implicitMentions?: ResolvedChannelImplicitMentions;
    allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
    order?: "before-sender" | "after-command";
  };
  command?: {
    useAccessGroups?: boolean;
    allowTextCommands: boolean;
    hasControlCommand: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
  };
};
/** Ordered phase for a gate in the ingress graph. */
type IngressGatePhase = "route" | "sender" | "command" | "event" | "activation";
/** Gate kind used in the ingress graph and projected access facts. */
type IngressGateKind = "route" | "routeSender" | "dmSender" | "groupSender" | "membership" | "ownerAllowlist" | "nestedAllowlist" | "command" | "event" | "mention";
/** Effect produced by a gate when computing final ingress admission. */
type IngressGateEffect = "allow" | "block-dispatch" | "block-command" | "skip" | "observe" | "ignore";
/** Stable machine-readable reason code for ingress diagnostics. */
type IngressReasonCode = "allowed" | "route_blocked" | "route_sender_empty" | "dm_policy_disabled" | "dm_policy_open" | "dm_policy_allowlisted" | "dm_policy_pairing_required" | "dm_policy_not_allowlisted" | "group_policy_disabled" | "group_policy_open" | "group_policy_allowed" | "group_policy_empty_allowlist" | "group_policy_not_allowlisted" | "command_authorized" | "control_command_unauthorized" | "event_authorized" | "event_unauthorized" | "event_pairing_not_allowed" | "sender_not_required" | "origin_subject_missing" | "origin_subject_not_matched" | "activation_allowed" | "activation_skipped" | "access_group_missing" | "access_group_unsupported" | "access_group_failed" | "mutable_identifier_disabled" | "no_policy_match";
/** One evaluated gate in the ordered ingress access graph. */
type AccessGraphGate = {
  id: string;
  phase: IngressGatePhase;
  kind: IngressGateKind;
  effect: IngressGateEffect;
  allowed: boolean;
  reasonCode: IngressReasonCode;
  match?: RedactedIngressMatch;
  allowlist?: RedactedIngressAllowlistFacts;
  sender?: {
    policy: ChannelIngressPolicyInput["dmPolicy"] | ChannelIngressPolicyInput["groupPolicy"];
  };
  command?: {
    useAccessGroups: boolean;
    allowTextCommands: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    shouldBlockControlCommand: boolean;
  };
  event?: RedactedChannelIngressEvent;
  activation?: {
    hasMentionFacts: boolean;
    requireMention: boolean;
    allowTextCommands: boolean;
    allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
    order?: "before-sender" | "after-command";
    shouldSkip: boolean;
    canDetectMention?: boolean;
    wasMentioned?: boolean;
    hasAnyMention?: boolean;
    implicitMentionKinds?: readonly InboundImplicitMentionKind[];
    effectiveWasMentioned?: boolean;
    shouldBypassMention?: boolean;
  };
};
/** Ordered graph of all evaluated ingress gates. */
type AccessGraph = {
  gates: AccessGraphGate[];
};
/** Normalized ingress state before policy gates are reduced into a decision. */
type ChannelIngressState = {
  channelId: ChannelIngressChannelId;
  accountId: string;
  conversationKind: "direct" | "group" | "channel";
  event: RedactedChannelIngressEvent;
  mentionFacts?: InboundMentionFacts;
  routeFacts: ResolvedRouteGateFacts[];
  allowlists: {
    dm: ResolvedIngressAllowlist;
    pairingStore: ResolvedIngressAllowlist;
    group: ResolvedIngressAllowlist;
    commandOwner: ResolvedIngressAllowlist;
    commandGroup: ResolvedIngressAllowlist;
  };
};
/** Final runtime admission action for the inbound event. */
type ChannelIngressAdmission = "dispatch" | "observe" | "skip" | "drop" | "pairing-required";
/** Final decision and graph for a resolved channel ingress event. */
type ChannelIngressDecision = {
  admission: ChannelIngressAdmission;
  decision: "allow" | "block" | "pairing";
  decisiveGateId: string;
  reasonCode: IngressReasonCode;
  graph: AccessGraph;
};
//#endregion
//#region src/channels/message-access/runtime-types.d.ts
/** Redacted subject identity assembled from a stable id plus optional platform aliases. */
type ChannelIngressSubject = InternalChannelIngressSubject;
/** Normalized allowlist entry material produced by a channel identity adapter. */
type ChannelIngressAdapterEntry = InternalNormalizedEntry;
/** Describes one identity field used for stable ids or platform-specific aliases. */
type ChannelIngressIdentityField = {
  /** Unique field key used in subject alias maps and diagnostics. */key?: string; /** Redacted identifier kind written into the access graph. */
  kind?: ChannelIngressIdentifierKind; /** Shared normalizer used for both entries and subjects when no side-specific normalizer exists. */
  normalize?: (value: string) => string | null | undefined; /** Normalizes configured allowlist entries for this identity field. */
  normalizeEntry?: (value: string) => string | null | undefined; /** Normalizes inbound subject values for this identity field. */
  normalizeSubject?: (value: string) => string | null | undefined; /** Marks identifiers as dangerous in diagnostics, for example mutable display names. */
  dangerous?: boolean | ((value: string) => boolean | undefined); /** Redaction hint for diagnostics and access graph consumers. */
  sensitivity?: "normal" | "pii";
};
/** Named alias field such as email, phone, UUID, room id, or platform user id. */
type ChannelIngressIdentityAlias = ChannelIngressIdentityField & {
  key: string;
};
/** Identity contract for a channel resolver. Plugins provide platform normalization here. */
type ChannelIngressIdentityDescriptor = {
  /** Primary stable identity field. Prefer immutable sender ids when the platform has one. */primary: ChannelIngressIdentityField; /** Additional identifiers that can match legacy or platform-specific allowlist entries. */
  aliases?: readonly ChannelIngressIdentityAlias[]; /** Returns true when a raw allowlist entry should authorize every sender. */
  isWildcardEntry?: (value: string) => boolean; /** Optional custom match hook for platform-specific identity equivalence. */
  matchEntry?: (params: {
    subject: ChannelIngressSubject;
    entry: ChannelIngressAdapterEntry;
    context: "dm" | "group" | "route" | "command";
  }) => boolean | undefined; /** Generates stable redacted entry ids for diagnostics. */
  resolveEntryId?: (params: {
    entry: string;
    entryIndex: number;
    fieldKey: string;
    fieldIndex: number;
  }) => string;
};
/** Convenience input for defining a stable identity descriptor with optional aliases. */
type StableChannelIngressIdentityParams = ChannelIngressIdentityField & Pick<ChannelIngressIdentityDescriptor, "aliases" | "isWildcardEntry" | "matchEntry"> & {
  /** Prefix used for generated entry ids when `resolveEntryId` is omitted. */entryIdPrefix?: string; /** Custom entry-id generator used in redacted diagnostics. */
  resolveEntryId?: ChannelIngressIdentityDescriptor["resolveEntryId"];
};
/** Raw sender identity passed by a plugin for one inbound event. */
type ChannelIngressIdentitySubjectInput = {
  /** Stable sender id appended to effective allowlists when access groups matched. */stableId?: string | number | null; /** Optional identity aliases keyed by `ChannelIngressIdentityAlias.key`. */
  aliases?: Record<string, string | number | null | undefined>;
};
/** Minimal config subset consumed by the ingress resolver. */
type ChannelIngressConfigInput = {
  /** Static or dynamic access group definitions referenced by allowlist entries. */accessGroups?: ChannelIngressStateInput["accessGroups"];
} | null;
/** Command gate input for control-command authorization. */
type ChannelMessageIngressCommandInput = NonNullable<ChannelIngressPolicyInput["command"]> & {
  /** Explicit command-owner allowlist; defaults to effective DM allowlist. */commandOwnerAllowFrom?: Array<string | number> | null; /** Controls whether group command owners inherit configured DM owners. */
  groupOwnerAllowFrom?: "configured" | "none"; /** Allows direct-message command checks to reuse effective group allowlists. */
  directGroupAllowFrom?: "effective" | "none"; /** Group command allowFrom fallback, separate from normal group sender policy. */
  commandGroupAllowFromFallbackToAllowFrom?: boolean;
};
/** Preset form for command gates accepted by `createChannelIngressResolver`. */
type ChannelIngressCommandPresetInput = Omit<Partial<ChannelMessageIngressCommandInput>, "useAccessGroups"> & {
  /** Set false to omit the command gate entirely. */requested?: boolean; /** Internal override for this command decision. */
  useAccessGroups?: boolean | null; /** Config subset used to derive command access-group behavior. */
  cfg?: ChannelIngressConfigInput;
};
/** Preset form for event gates accepted by `createChannelIngressResolver`. */
type ChannelIngressEventPresetInput = Partial<ChannelIngressEventInput> & {
  /** Convenience flag used to derive pairing defaults for group events. */isGroup?: boolean;
};
/** Final host-context identity that an ingress result is eligible to enter once. */
type ChannelIngressContextBinding = {
  /** Final routed agent selected by the channel producer. */agentId: string; /** Final dispatch or route session selected by the channel producer. */
  sessionKey: string; /** Stable transport message id when the event has one. */
  messageId?: string; /** Native transport conversation id when it differs from the canonical conversation id. */
  nativeChannelId?: string; /** Final inbound event classification used by the host context. */
  inboundEventKind: InboundEventKind;
};
/** Optional route gate, such as a room, thread, topic, guild, or group route. */
type ChannelIngressRouteDescriptor = {
  /** Stable route id used in diagnostics. */id: string; /** Route kind for diagnostics and graph consumers. */
  kind?: RouteGateFacts["kind"]; /** Whether this route policy is configured. */
  configured?: boolean; /** Whether the inbound event matched this route. */
  matched?: boolean; /** Whether this route admits the inbound event. */
  allowed?: boolean; /** Whether to include this route descriptor in the graph. */
  enabled?: boolean; /** Ordering hint when multiple route descriptors are supplied. */
  precedence?: number; /** How route sender allowlists combine with effective channel allowlists. */
  senderPolicy?: RouteGateFacts["senderPolicy"]; /** Route-specific sender allowlist entries. */
  senderAllowFrom?: Array<string | number> | null; /** Indicates whether route sender entries came from effective DM or group policy. */
  senderAllowFromSource?: RouteGateFacts["senderAllowFromSource"]; /** Optional redacted match id for the route. */
  matchId?: string; /** Reason used when this route blocks the event. */
  blockReason?: string;
};
/** Dynamic access-group resolver invoked for groups that need platform lookups. */
type ChannelIngressAccessGroupMembershipResolver = (params: {
  name: string;
  group: AccessGroupConfig;
  channelId: ChannelIngressChannelId;
  accountId: string;
  subject: ChannelIngressIdentitySubjectInput;
}) => boolean | Promise<boolean>;
/** Complete input for resolving one inbound channel message or event. */
type ResolveChannelMessageIngressParams = {
  /** Channel id used for config, diagnostics, access groups, and pairing-store reads. */channelId: ChannelIngressChannelId; /** Account id scoped to this channel instance. */
  accountId: string; /** Identity descriptor that normalizes sender and allowlist material. */
  identity: ChannelIngressIdentityDescriptor; /** Inbound sender identity for this event. */
  subject: ChannelIngressIdentitySubjectInput; /** Conversation classification and id. */
  conversation: ChannelIngressStateInput["conversation"]; /** Event auth mode and pairing/origin-subject facts. */
  event: ChannelIngressEventInput; /** Exact finalized host context this result may enter; omit for decision-only checks. */
  contextBinding?: ChannelIngressContextBinding; /** Sender, command, event, route, and activation policy. */
  policy: ChannelIngressPolicyInput; /** Raw direct-message allowlist entries. */
  allowFrom?: Array<string | number> | null; /** Raw group sender allowlist entries. */
  groupAllowFrom?: Array<string | number> | null; /** Route descriptors used to build route gates. */
  route?: ChannelIngressRouteDescriptor | readonly ChannelIngressRouteDescriptor[]; /** Prebuilt route facts for lower-level callers. */
  routeFacts?: RouteGateFacts[]; /** Access group config referenced by allowlist entries. */
  accessGroups?: ChannelIngressStateInput["accessGroups"]; /** Precomputed access-group memberships for this subject. */
  accessGroupMembership?: readonly AccessGroupMembershipFact[]; /** Resolver for dynamic access groups. */
  resolveAccessGroupMembership?: ChannelIngressAccessGroupMembershipResolver; /** Concrete sender entry appended to effective allowlists when an access group matched. */
  accessGroupMatchedAllowFromEntry?: string | number | null; /** Records whether a provider-specific missing-config fallback was applied. */
  providerMissingFallbackApplied?: boolean; /** Mention or activation facts for activation gates. */
  mentionFacts?: ChannelIngressStateInput["mentionFacts"]; /** Optional pairing-store reader for direct-message allowlist material. */
  readStoreAllowFrom?: (params: {
    channelId: ChannelIngressChannelId;
    accountId: string;
    dmPolicy: ChannelIngressPolicyInput["dmPolicy"];
  }) => Promise<readonly (string | number)[] | null | undefined>; /** Reads the default pairing store when no explicit reader is supplied. */
  useDefaultPairingStore?: boolean; /** Command gate input; omit when no command policy is requested. */
  command?: ChannelMessageIngressCommandInput;
};
/** Shared resolver defaults for repeated events from the same channel account. */
type CreateChannelIngressResolverParams = Pick<ResolveChannelMessageIngressParams, "channelId" | "accountId" | "identity" | "accessGroups" | "accessGroupMembership" | "resolveAccessGroupMembership" | "accessGroupMatchedAllowFromEntry" | "readStoreAllowFrom" | "useDefaultPairingStore"> & {
  /** Config subset used for access groups and command behavior. */cfg?: ChannelIngressConfigInput; /** Global override for access-group expansion in this resolver. */
  useAccessGroups?: boolean | null; /** Default DM policy for message calls that omit it. */
  defaultDmPolicy?: ChannelIngressPolicyInput["dmPolicy"]; /** Default group policy for message calls that omit it. */
  defaultGroupPolicy?: ChannelIngressPolicyInput["groupPolicy"]; /** Default group allowlist fallback behavior. */
  groupAllowFromFallbackToAllowFrom?: boolean; /** Mutable identifier matching policy for this resolver. */
  mutableIdentifierMatching?: ChannelIngressPolicyInput["mutableIdentifierMatching"];
};
/** Per-message input for a resolver created by `createChannelIngressResolver`. */
type ChannelIngressResolverMessageParams = Omit<ResolveChannelMessageIngressParams, "channelId" | "accountId" | "identity" | "accessGroups" | "resolveAccessGroupMembership" | "accessGroupMatchedAllowFromEntry" | "readStoreAllowFrom" | "useDefaultPairingStore" | "event" | "policy" | "command"> & {
  /** Event facts or presets; defaults to a normal inbound message event. */event?: ChannelIngressEventInput | ChannelIngressEventPresetInput; /** DM policy override for this event. */
  dmPolicy?: ChannelIngressPolicyInput["dmPolicy"]; /** Group policy override for this event. */
  groupPolicy?: ChannelIngressPolicyInput["groupPolicy"]; /** Additional policy fields merged with resolver defaults. */
  policy?: Partial<Omit<ChannelIngressPolicyInput, "dmPolicy" | "groupPolicy">>; /** Command gate input, preset, or false to suppress command checks. */
  command?: ChannelMessageIngressCommandInput | ChannelIngressCommandPresetInput | false;
};
/** Reusable high-level ingress resolver for message, command, and event surfaces. */
type ChannelIngressResolver = {
  /** Resolve a normal inbound message with sender, route, command, event, and activation gates. */message(params: ChannelIngressResolverMessageParams): Promise<ResolvedChannelMessageIngress>; /** Resolve a command-oriented event with command auth defaults enabled. */
  command(params: ChannelIngressResolverMessageParams): Promise<ResolvedChannelMessageIngress>; /** Resolve a non-message event with event-gate defaults enabled. */
  event(params: ChannelIngressResolverMessageParams): Promise<ResolvedChannelMessageIngress>;
};
/** One-shot helper input using a simple stable identity descriptor. */
type ResolveStableChannelMessageIngressParams = Omit<CreateChannelIngressResolverParams, "identity"> & ChannelIngressResolverMessageParams & {
  identity?: StableChannelIngressIdentityParams;
};
/** Sender/conversation projection consumed by channel handlers. */
type ChannelIngressSenderAccess = {
  /** True when the sender gate admits the event. */allowed: boolean; /** Final ingress decision after all gates, not just the sender gate. */
  decision: ChannelIngressDecision["decision"]; /** Sender gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode; /** Sender gate from the access graph, when one ran. */
  gate?: AccessGraphGate; /** Effective DM allowlist entries after store and access-group processing. */
  effectiveAllowFrom: string[]; /** Effective group allowlist entries after fallback and access-group processing. */
  effectiveGroupAllowFrom: string[]; /** Whether provider-specific fallback behavior was applied. */
  providerMissingFallbackApplied: boolean;
};
/** Command projection consumed by channel command/control handlers. */
type ChannelIngressCommandAccess = {
  /** True when a command gate was requested for this event. */requested: boolean; /** True when the command gate authorizes this sender. */
  authorized: boolean; /** True when an unauthorized control command should be blocked. */
  shouldBlockControlCommand: boolean; /** Command gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode; /** Command gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Route projection consumed by room/thread/topic handlers. */
type ChannelIngressRouteAccess = {
  /** True when all configured route gates admit the event. */allowed: boolean; /** Route gate reason when a route gate decided. */
  reasonCode?: IngressReasonCode; /** Optional route-specific reason text. */
  reason?: string; /** Route gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Activation/mention projection consumed by group handlers. */
type ChannelIngressActivationAccess = {
  /** True when an activation gate ran. */ran: boolean; /** True when activation admits the event. */
  allowed: boolean; /** True when the event should be skipped instead of dispatched. */
  shouldSkip: boolean; /** Activation gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode; /** Effective mention match after command bypass and activation policy. */
  effectiveWasMentioned?: boolean; /** True when mention gating was bypassed by policy or command facts. */
  shouldBypassMention?: boolean; /** Activation gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Full ingress result returned by runtime resolvers. */
type ResolvedChannelMessageIngress = {
  /** Redacted normalized state used as input to the decision engine. */state: ChannelIngressState; /** Ordered access graph plus final admission decision. */
  ingress: ChannelIngressDecision; /** Sender/conversation projection. */
  senderAccess: ChannelIngressSenderAccess; /** Route projection. */
  routeAccess: ChannelIngressRouteAccess; /** Command projection. */
  commandAccess: ChannelIngressCommandAccess; /** Activation/mention projection. */
  activationAccess: ChannelIngressActivationAccess;
};
//#endregion
//#region src/channels/message/ingress-queue.d.ts
/** Pending or retryable inbound channel event stored in the durable ingress queue. */
type ChannelIngressQueueRecord<TPayload, TMetadata = unknown> = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  payload: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  laneKey?: string;
  attempts: number;
  lastAttemptAt?: number;
  lastError?: string;
};
/** Pending ingress event currently claimed by a worker. */
type ChannelIngressQueueClaim<TPayload, TMetadata = unknown> = ChannelIngressQueueRecord<TPayload, TMetadata> & {
  claim: {
    token: string;
    ownerId: string;
    claimedAt: number;
  };
};
/** Minimal claim reference used to guard completion/release/failure with a claim token. */
type ChannelIngressQueueClaimRef = {
  id: string;
  claim: {
    token: string;
  };
};
/** Claim identity available when a stale row's payload cannot be decoded. */
type ChannelIngressQueueCorruptClaim = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  laneKey?: string;
  reason: "corrupt_payload";
  claim: {
    token: string;
    ownerId: string;
    claimedAt: number;
  };
};
/** Completed ingress event tombstone retained for duplicate detection. */
type ChannelIngressQueueCompletedRecord<TCompletedMetadata = unknown> = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  completedAt: number;
  metadata?: TCompletedMetadata;
};
/** Failed ingress event tombstone retained for duplicate detection. */
type ChannelIngressQueueFailedRecord = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  failedAt: number;
  reason: string;
  message?: string;
};
/** Rich failed ingress event retained for diagnostics and operator recovery. */
type ChannelIngressQueueDeadLetterRecord<TPayload = unknown, TMetadata = unknown> = ChannelIngressQueueFailedRecord & {
  payload?: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  laneKey?: string;
  attempts: number;
  lastAttemptAt?: number;
};
/** Outcome of asking a channel/account queue to re-enqueue one failed event. */
type ChannelIngressQueueResubmitResult<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  kind: "resubmitted";
  record: ChannelIngressQueueRecord<TPayload, TMetadata>;
  previous: ChannelIngressQueueDeadLetterRecord<TPayload, TMetadata>;
} | {
  kind: "not-found";
} | {
  kind: "completed";
  record: ChannelIngressQueueCompletedRecord<TCompletedMetadata>;
} | {
  kind: "active";
  status: "pending" | "claimed";
} | {
  kind: "unrecoverable";
  record: ChannelIngressQueueDeadLetterRecord<TPayload, TMetadata>;
};
/** Retention options for pending, completed, and failed ingress queue rows. */
type ChannelIngressQueuePruneOptions = {
  pendingTtlMs?: number;
  completedTtlMs?: number;
  failedTtlMs?: number;
  pendingMaxEntries?: number;
  completedMaxEntries?: number;
  failedMaxEntries?: number;
  protectIds?: Iterable<string>;
  now?: number;
};
/** Result of enqueueing a possibly duplicate ingress event id. */
type ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata> = {
  kind: "accepted";
  duplicate: false;
  record: ChannelIngressQueueRecord<TPayload, TMetadata>;
} | {
  kind: "pending";
  duplicate: true;
  record: ChannelIngressQueueRecord<TPayload, TMetadata>;
} | {
  kind: "claimed";
  duplicate: true;
  record: ChannelIngressQueueClaim<TPayload, TMetadata>;
} | {
  kind: "completed";
  duplicate: true;
  record: ChannelIngressQueueCompletedRecord<TCompletedMetadata>;
} | {
  kind: "failed";
  duplicate: true;
  record: ChannelIngressQueueFailedRecord;
};
/** Durable FIFO-ish ingress queue with claims, duplicate detection, and retention pruning. */
type ChannelIngressQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  enqueue(id: string, payload: TPayload, options?: {
    metadata?: TMetadata;
    receivedAt?: number;
    laneKey?: string;
  }): Promise<ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata>>;
  listPending(options?: {
    limit?: number | "all";
    orderBy?: "received" | "id";
  }): Promise<Array<ChannelIngressQueueRecord<TPayload, TMetadata>>>;
  listClaims(): Promise<Array<ChannelIngressQueueClaim<TPayload, TMetadata>>>; /** Additive SDK seam; optional so existing external queue test doubles remain compatible. */
  listFailed?(options?: {
    limit?: number | "all";
  }): Promise<Array<ChannelIngressQueueDeadLetterRecord<TPayload, TMetadata>>>;
  claimNext(options?: {
    ownerId?: string;
    blockedLaneKeys?: Iterable<string>;
    staleMs?: number;
    orderBy?: "received" | "id";
    scanLimit?: number;
    candidateIds?: Iterable<string>;
    deriveLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>) => string | undefined; /** Authorize a changed durable lane before the atomic pending-to-claimed transition. */
    reconcileStoredLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>, storedLaneKey: string, derivedLaneKey: string) => boolean;
  }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
  claim(id: string, options?: {
    ownerId?: string;
  }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
  refreshClaim?(claim: ChannelIngressQueueClaimRef, options?: {
    refreshedAt?: number;
  }): Promise<boolean>;
  complete(idOrClaim: string | ChannelIngressQueueClaimRef, options?: {
    metadata?: TCompletedMetadata;
    completedAt?: number;
  }): Promise<boolean>;
  release(idOrClaim: string | ChannelIngressQueueClaimRef, options?: {
    lastError?: string;
    releasedAt?: number;
    recordAttempt?: boolean;
  }): Promise<boolean>;
  fail(idOrClaim: string | ChannelIngressQueueClaimRef, options: {
    reason: string;
    message?: string;
    failedAt?: number;
  }): Promise<boolean>; /** Additive SDK seam; actual runtime queues support operator resubmission. */
  resubmit?(id: string, options?: {
    resubmittedAt?: number;
  }): Promise<ChannelIngressQueueResubmitResult<TPayload, TMetadata, TCompletedMetadata>>;
  delete(idOrClaim: string | ChannelIngressQueueRecord<TPayload, TMetadata> | ChannelIngressQueueClaimRef): Promise<boolean>;
  recoverStaleClaims(options?: {
    staleMs?: number;
    now?: number;
    shouldRecover?: (claim: ChannelIngressQueueClaim<TPayload, TMetadata>) => boolean | Promise<boolean>;
    shouldRecoverCorrupt?: (claim: ChannelIngressQueueCorruptClaim) => boolean | Promise<boolean>;
  }): Promise<number>;
  prune(options?: ChannelIngressQueuePruneOptions): Promise<number>;
};
/** Construction options for a channel/account-scoped ingress queue. */
type CreateChannelIngressQueueOptions = {
  channelId: string;
  accountId?: string;
  stateDir?: string;
  now?: () => number;
};
//#endregion
//#region src/channels/message/ingress-drain-lifecycle.d.ts
/** Full pre-adoption -> adoption ownership lifecycle for one claimed event. */
type ChannelIngressDispatchLifecycle = {
  /** Pre-adoption only. After adopt the drain treats this signal as inert. */abortSignal: AbortSignal;
  /**
   * Fires when recovery-relevant session/run state is durable.
   * Drain completes (tombstones) the claim here -- never at settle.
   */
  onAdopted: () => void | Promise<void>;
  /**
   * Turn ownership deferred to reply-lane admission (queued followup).
   * Claim remains held until adopted or abandoned.
   */
  onDeferred: () => void;
  /**
   * Durable adoption finalization is in progress (e.g. settlement hold while
   * committing dedupe). Clears the pre-adoption stall watchdog so a timeout
   * settlement cannot race and dead-letter an about-to-complete claim.
   * Claim stays held until onAdopted / onAbandoned / fail.
   */
  onAdoptionFinalizing: () => void; /** Deferred work terminally failed after dispatch returned. */
  onFailed?: (error: unknown) => void | Promise<void>; /** Explicit cancellation before adoption; releases without consuming retry budget. */
  onCancelled?: () => void | Promise<void>;
  /**
   * Deferred turn finished without ever owning the reply lane.
   * Drain releases the claim for retry.
   */
  onAbandoned: () => void | Promise<void>;
};
/** Maps a drain lifecycle onto the reply-lane ownership surface. */
declare function bindIngressLifecycleToReplyOptions(lifecycle: ChannelIngressDispatchLifecycle): {
  turnAdoptionLifecycle: {
    admission: "exclusive";
    onAdopted: () => void | Promise<void>;
    onDeferred: () => void;
    onAbandoned: () => void | Promise<void>;
    abortSignal: AbortSignal;
  };
};
//#endregion
//#region src/channels/message/ingress-drain-state.d.ts
type ChannelIngressDrainDispatchResult = {
  kind: "completed";
} | {
  kind: "deferred";
} | {
  kind: "failed-retryable";
  error: unknown;
};
//#endregion
//#region src/channels/message/ingress-retry-policy.d.ts
declare const DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS = 8;
declare const DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS: number;
type IngressRetryPolicyConfig = {
  maxAttempts?: number;
  deadLetterMinAgeMs?: number;
  baseMs?: number;
  maxMs?: number;
};
type IngressNonRetryableFailure = {
  reason: string;
  message: string;
};
//#endregion
//#region src/channels/message/ingress-drain.d.ts
/** Default claim→adoption stall before dead-lettering with handler-timeout. */
declare const DEFAULT_INGRESS_ADOPTION_STALL_MS: number;
type DeferredLaneOccupancy = "hold" | "release";
type CreateChannelIngressDrainOptions<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  /**
   * Dispatch a claimed event. Wire lifecycle into reply options (see
   * bindIngressLifecycleToReplyOptions). Return deferred when ownership will
   * transfer at reply-lane admission; otherwise complete or throw.
   */
  dispatchClaimedEvent: (event: ChannelIngressQueueClaim<TPayload, TMetadata>, lifecycle: ChannelIngressDispatchLifecycle) => Promise<ChannelIngressDrainDispatchResult | void> | ChannelIngressDrainDispatchResult | void;
  resolveNonRetryableFailure?: (err: unknown) => IngressNonRetryableFailure | null;
  shouldSupersedePending?: (newEvent: ChannelIngressQueueRecord<TPayload, TMetadata> | ChannelIngressQueueClaim<TPayload, TMetadata>, pendingEvent: ChannelIngressQueueClaim<TPayload, TMetadata>) => boolean | Promise<boolean>;
  deriveLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>) => string | undefined;
  reconcileStoredLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>, storedLaneKey: string, derivedLaneKey: string) => boolean;
  ownerId?: string;
  adoptionStallTimeoutMs?: number;
  claimLeaseMs?: number;
  /**
   * Whether a claimed event keeps occupying its ingress serialization lane after
   * dispatch hands ownership to deferred work. Default "hold" (current behavior).
   */
  deferredLaneOccupancy?: DeferredLaneOccupancy;
  retryPolicy?: IngressRetryPolicyConfig;
  now?: () => number;
  formatError?: (err: unknown) => string;
  onLog?: (message: string) => void;
  abortSignal?: AbortSignal;
  orderBy?: "received" | "id";
  scanLimit?: number;
  startLimit?: number;
};
type ChannelIngressDrain = {
  recoverStaleClaims: () => Promise<number>;
  drainOnce: (options?: {
    shouldStop?: () => boolean;
  }) => Promise<{
    started: number;
  }>;
  activeLaneKeys: () => ReadonlySet<string>;
  waitForIdle: () => Promise<void>;
  dispose: () => void;
};
/** Creates a channel-agnostic durable ingress drain over an existing queue. */
declare function createChannelIngressDrain<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: CreateChannelIngressDrainOptions<TPayload, TMetadata, TCompletedMetadata>): ChannelIngressDrain;
//#endregion
export { resolveChannelImplicitMentions as $, CreateChannelIngressResolverParams as A, ChannelIngressState as B, ChannelIngressIdentityField as C, ChannelIngressRouteAccess as D, ChannelIngressResolverMessageParams as E, AccessGroupMembershipFact as F, InboundMentionFacts as G, IngressReasonCode as H, ChannelIngressDecision as I, ResolveInboundMentionDecisionNestedParams as J, InboundMentionPolicy as K, ChannelIngressEventInput as L, ResolveStableChannelMessageIngressParams as M, ResolvedChannelMessageIngress as N, ChannelIngressRouteDescriptor as O, StableChannelIngressIdentityParams as P, ResolvedChannelImplicitMentions as Q, ChannelIngressIdentifierKind as R, ChannelIngressIdentityDescriptor as S, ChannelIngressResolver as T, InboundImplicitMentionKind as U, ChannelIngressStateInput as V, InboundMentionDecision as W, implicitMentionKindWhen as X, ResolveInboundMentionDecisionParams as Y, resolveInboundMentionDecision as Z, ChannelIngressCommandPresetInput as _, DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS as a, ChannelIngressEventPresetInput as b, ChannelIngressQueue as c, ChannelIngressQueueCorruptClaim as d, ChannelIngressQueuePruneOptions as f, ChannelIngressCommandAccess as g, ChannelIngressAccessGroupMembershipResolver as h, createChannelIngressDrain as i, ResolveChannelMessageIngressParams as j, ChannelMessageIngressCommandInput as k, ChannelIngressQueueClaim as l, CreateChannelIngressQueueOptions as m, CreateChannelIngressDrainOptions as n, DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS as o, ChannelIngressQueueRecord as p, ResolveInboundMentionDecisionFlatParams as q, DEFAULT_INGRESS_ADOPTION_STALL_MS as r, bindIngressLifecycleToReplyOptions as s, ChannelIngressDrain as t, ChannelIngressQueueClaimRef as u, ChannelIngressConfigInput as v, ChannelIngressIdentitySubjectInput as w, ChannelIngressIdentityAlias as x, ChannelIngressContextBinding as y, ChannelIngressPolicyInput as z };