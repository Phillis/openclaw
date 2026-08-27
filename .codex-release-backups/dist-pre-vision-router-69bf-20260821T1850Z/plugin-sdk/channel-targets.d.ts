import { E as ChannelTtsVoiceDeliveryCapabilities } from "../types.core-CgEwvJMs.js";
import { t as ChannelId } from "../channel-id.types-DjYEl-_2.js";
import { n as resolveTargetsWithOptionalToken, t as buildUnresolvedTargetResults } from "../target-resolvers-D3GXUUGp.js";

//#region src/channels/channel-config.d.ts
/** How a channel config entry was selected. */
type ChannelMatchSource = "direct" | "parent" | "wildcard";
/** Match result carrying direct, parent, and wildcard candidates for channel config lookup. */
type ChannelEntryMatch<T> = {
  entry?: T;
  key?: string;
  wildcardEntry?: T;
  wildcardKey?: string;
  parentEntry?: T;
  parentKey?: string;
  matchKey?: string;
  matchSource?: ChannelMatchSource;
};
/** Copies match metadata onto resolved channel config output. */
declare function applyChannelMatchMeta<TResult extends {
  matchKey?: string;
  matchSource?: ChannelMatchSource;
}>(result: TResult, match: ChannelEntryMatch<unknown>): TResult;
/** Resolves a matched entry and preserves the config key that selected it. */
declare function resolveChannelMatchConfig<TEntry, TResult extends {
  matchKey?: string;
  matchSource?: ChannelMatchSource;
}>(match: ChannelEntryMatch<TEntry>, resolveEntry: (entry: TEntry) => TResult): TResult | null;
/** Normalizes human channel names into config-safe slugs. */
declare function normalizeChannelSlug(value: string): string;
/** Builds unique config lookup keys from optional channel/account identifiers. */
declare function buildChannelKeyCandidates(...keys: Array<string | undefined | null>): string[];
/** Finds a direct channel entry and separately carries a wildcard fallback candidate. */
declare function resolveChannelEntryMatch<T>(params: {
  entries?: Record<string, T>;
  keys: string[];
  wildcardKey?: string;
}): ChannelEntryMatch<T>;
/** Resolves config entry precedence: direct, normalized direct, parent, normalized parent, wildcard. */
declare function resolveChannelEntryMatchWithFallback<T>(params: {
  entries?: Record<string, T>;
  keys: string[];
  parentKeys?: string[];
  wildcardKey?: string;
  normalizeKey?: (value: string) => string;
}): ChannelEntryMatch<T>;
/** Resolves nested allowlists where an inner list only applies after the outer list matches. */
declare function resolveNestedAllowlistDecision(params: {
  outerConfigured: boolean;
  outerMatched: boolean;
  innerConfigured: boolean;
  innerMatched: boolean;
}): boolean;
//#endregion
//#region src/channels/targets.d.ts
/** Canonical route target families shared by channel-owned parsers. */
type MessagingTargetKind = "user" | "channel";
/** Parsed channel target with the original token and normalized lookup key. */
type MessagingTarget = {
  kind: MessagingTargetKind;
  id: string;
  raw: string;
  normalized: string;
};
/** Options for parsers that can infer a kind or reject ambiguous input. */
type MessagingTargetParseOptions = {
  defaultKind?: MessagingTargetKind;
  ambiguousMessage?: string;
};
/** Builds the stable lower-case lookup key used to compare channel targets. */
declare function normalizeTargetId(kind: MessagingTargetKind, id: string): string;
/** Creates a parsed target while preserving the user-provided raw token. */
declare function buildMessagingTarget(kind: MessagingTargetKind, id: string, raw: string): MessagingTarget;
/** Validates an extracted target id with a channel-owned grammar. */
declare function ensureTargetId(params: {
  candidate: string;
  pattern: RegExp;
  errorMessage: string;
}): string;
/** Parses one mention pattern whose first capture group is the target id. */
declare function parseTargetMention(params: {
  raw: string;
  mentionPattern: RegExp;
  kind: MessagingTargetKind;
}): MessagingTarget | undefined;
/** Parses a single kind-prefixed target such as channel:<id> or user:<id>. */
declare function parseTargetPrefix(params: {
  raw: string;
  prefix: string;
  kind: MessagingTargetKind;
}): MessagingTarget | undefined;
/** Parses the first matching kind-prefixed target from a channel grammar list. */
declare function parseTargetPrefixes(params: {
  raw: string;
  prefixes: Array<{
    prefix: string;
    kind: MessagingTargetKind;
  }>;
}): MessagingTarget | undefined;
/** Parses @user shorthand and validates it against a channel-owned user grammar. */
declare function parseAtUserTarget(params: {
  raw: string;
  pattern: RegExp;
  errorMessage: string;
}): MessagingTarget | undefined;
/** Tries mention, explicit prefixes, then @user shorthand in deterministic order. */
declare function parseMentionPrefixOrAtUserTarget(params: {
  raw: string;
  mentionPattern: RegExp;
  prefixes: Array<{
    prefix: string;
    kind: MessagingTargetKind;
  }>;
  atUserPattern: RegExp;
  atUserErrorMessage: string;
}): MessagingTarget | undefined;
/** Requires a parsed target of the requested kind and returns its channel id. */
declare function requireTargetKind(params: {
  platform: string;
  target: MessagingTarget | undefined;
  kind: MessagingTargetKind;
}): string;
//#endregion
//#region src/channels/plugins/chat-target-prefixes.d.ts
/**
 * Prefix mapping for service-qualified target strings.
 */
type ServicePrefix<TService extends string> = {
  prefix: string;
  service: TService;
};
/**
 * Normalized input used by chat target prefix parsers.
 */
type ChatTargetPrefixesParams = {
  trimmed: string;
  lower: string;
  chatIdPrefixes: string[];
  chatGuidPrefixes: string[];
  chatIdentifierPrefixes: string[];
};
/**
 * Parsed conversation target forms accepted by channel allowlists and target resolvers.
 */
type ParsedChatTarget = {
  kind: "chat_id";
  chatId: number;
} | {
  kind: "chat_guid";
  chatGuid: string;
} | {
  kind: "chat_identifier";
  chatIdentifier: string;
};
/**
 * Parsed allowlist target, including sender handles.
 */
type ParsedChatAllowTarget = ParsedChatTarget | {
  kind: "handle";
  handle: string;
};
/**
 * Sender metadata used for chat-aware allowlist checks.
 */
type ChatSenderAllowParams = {
  allowFrom: Array<string | number>;
  sender: string;
  chatId?: number | null;
  chatGuid?: string | null;
  chatIdentifier?: string | null;
  allowConversationTargets?: boolean | null;
};
/**
 * Resolves service-prefixed handle targets, delegating chat-shaped remainders.
 */
declare function resolveServicePrefixedTarget<TService extends string, TTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<ServicePrefix<TService>>;
  isChatTarget: (remainderLower: string) => boolean;
  parseTarget: (remainder: string) => TTarget;
}): ({
  kind: "handle";
  to: string;
  service: TService;
} | TTarget) | null;
/**
 * Resolves service-prefixed targets where chat ids should bypass handle parsing.
 */
declare function resolveServicePrefixedChatTarget<TService extends string, TTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<ServicePrefix<TService>>;
  chatIdPrefixes: string[];
  chatGuidPrefixes: string[];
  chatIdentifierPrefixes: string[];
  extraChatPrefixes?: string[];
  parseTarget: (remainder: string) => TTarget;
}): ({
  kind: "handle";
  to: string;
  service: TService;
} | TTarget) | null;
/**
 * Parses chat target prefixes and throws for malformed prefixed values.
 */
declare function parseChatTargetPrefixesOrThrow(params: ChatTargetPrefixesParams): ParsedChatTarget | null;
/**
 * Resolves service-prefixed allowlist targets.
 */
declare function resolveServicePrefixedAllowTarget<TAllowTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<{
    prefix: string;
  }>;
  parseAllowTarget: (remainder: string) => TAllowTarget;
}): (TAllowTarget | {
  kind: "handle";
  handle: string;
}) | null;
/**
 * Resolves service-prefixed allow targets before falling back to chat prefixes.
 */
declare function resolveServicePrefixedOrChatAllowTarget<TAllowTarget extends ParsedChatAllowTarget>(params: {
  trimmed: string;
  lower: string;
  servicePrefixes: Array<{
    prefix: string;
  }>;
  parseAllowTarget: (remainder: string) => TAllowTarget;
  chatIdPrefixes: string[];
  chatGuidPrefixes: string[];
  chatIdentifierPrefixes: string[];
}): TAllowTarget | null;
/**
 * Creates a reusable sender matcher for chat-aware channel allowlists.
 */
declare function createAllowedChatSenderMatcher(params: {
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
  allowConversationTargets?: boolean;
}): (input: ChatSenderAllowParams) => boolean;
/**
 * Parses chat target prefixes for allowlist entries, ignoring malformed values.
 */
declare function parseChatAllowTargetPrefixes(params: ChatTargetPrefixesParams): ParsedChatTarget | null;
//#endregion
//#region src/channels/plugins/registry.d.ts
/**
 * Normalizes user-facing channel aliases to canonical channel ids.
 */
declare function normalizeChannelId(raw?: string | null): ChannelId | null;
//#endregion
//#region src/channels/plugins/tts-capabilities.d.ts
declare function resolveChannelTtsVoiceDelivery(channel: string | undefined): ChannelTtsVoiceDeliveryCapabilities | undefined;
//#endregion
export { type ChannelEntryMatch, type ChannelId, type ChannelMatchSource, type ChatSenderAllowParams, type ChatTargetPrefixesParams, type MessagingTarget, type MessagingTargetKind, type MessagingTargetParseOptions, type ParsedChatAllowTarget, type ParsedChatTarget, type ServicePrefix, applyChannelMatchMeta, buildChannelKeyCandidates, buildMessagingTarget, buildUnresolvedTargetResults, createAllowedChatSenderMatcher, ensureTargetId, normalizeChannelId, normalizeChannelSlug, normalizeTargetId, parseAtUserTarget, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow, parseMentionPrefixOrAtUserTarget, parseTargetMention, parseTargetPrefix, parseTargetPrefixes, requireTargetKind, resolveChannelEntryMatch, resolveChannelEntryMatchWithFallback, resolveChannelMatchConfig, resolveChannelTtsVoiceDelivery, resolveNestedAllowlistDecision, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget, resolveServicePrefixedOrChatAllowTarget, resolveServicePrefixedTarget, resolveTargetsWithOptionalToken };