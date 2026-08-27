import { n as RuntimeEnv } from "../runtime-DlqUc5_p.js";
import { a as formatAllowlistMatchMeta, c as resolveAllowlistMatchSimple, i as compileAllowlist, l as resolveCompiledAllowlistMatch, n as AllowlistMatchSource, o as resolveAllowlistCandidates, r as CompiledAllowlist, s as resolveAllowlistMatchByCandidates, t as AllowlistMatch } from "../allowlist-match-Bmdv70ad.js";
import { i as mergeDmAllowFromSources, n as firstDefined, o as resolveGroupAllowFromSources, r as isSenderIdAllowed } from "../allow-from-Bdiy2LH6.js";
//#region src/channels/plugins/chat-target-prefixes.d.ts
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
 * Checks whether a sender or current conversation matches an allowlist entry.
 */
declare function isAllowedParsedChatSender(params: {
  allowFrom: Array<string | number>;
  sender: string;
  chatId?: number | null;
  chatGuid?: string | null;
  chatIdentifier?: string | null;
  allowConversationTargets?: boolean | null;
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
}): boolean;
//#endregion
//#region src/channels/allowlists/resolve-utils.d.ts
type AllowlistUserResolutionLike = {
  input: string;
  resolved: boolean;
  id?: string;
};
declare function mergeAllowlist(params: {
  existing?: Array<string | number>;
  additions: string[];
}): string[];
/** Splits lookup results into resolved mappings, unresolved display text, and id additions. */
declare function buildAllowlistResolutionSummary<T extends AllowlistUserResolutionLike>(resolvedUsers: T[], opts?: {
  /** Return null to omit an entry from the logged mapping (e.g. identity lookups). */
  formatResolved?: (entry: T) => string | null;
  formatUnresolved?: (entry: T) => string;
}): {
  resolvedMap: Map<string, T>;
  mapping: string[];
  unresolved: string[];
  additions: string[];
};
/** Replaces resolvable user entries with canonical ids while preserving unresolved entries and `*`. */
declare function canonicalizeAllowlistWithResolvedIds<T extends AllowlistUserResolutionLike>(params: {
  existing?: Array<string | number>;
  resolvedMap: Map<string, T>;
  entryKey?: (entry: string) => string;
}): string[];
/** Updates nested `{ users }` allowlist entries using merge or canonicalize semantics. */
declare function patchAllowlistUsersInConfigEntries<T extends AllowlistUserResolutionLike, TEntries extends Record<string, unknown>>(params: {
  entries: TEntries;
  resolvedMap: Map<string, T>;
  strategy?: "merge" | "canonicalize";
  entryKey?: (entry: string) => string;
}): TEntries;
/** Collects concrete user lookup targets from one config entry, excluding wildcard policy entries. */
declare function addAllowlistUserEntriesFromConfigEntry(target: Set<string>, entry: unknown): void;
/** Logs a compact resolved/unresolved allowlist lookup summary when there is anything to report. */
declare function summarizeMapping(label: string, mapping: string[], unresolved: string[], runtime: RuntimeEnv): void;
//#endregion
//#region src/plugin-sdk/allow-from.d.ts
/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
declare function formatAllowFromLowercase(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */
  allowFrom: Array<string | number>;
  /** Optional prefix remover for channel aliases such as `tg:` or `zalo:`. */
  stripPrefixRe?: RegExp;
}): string[];
/** Normalize allowlist entries through a channel-provided parser or canonicalizer. */
declare function formatNormalizedAllowFromEntries(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */
  allowFrom: Array<string | number>;
  /** Channel-specific canonicalizer; empty results are omitted. */
  normalizeEntry: (entry: string) => string | undefined | null;
}): string[];
type ParsedAllowFromEntry = {
  value: string;
} | {
  error: string;
};
/** Parse, validate, and deduplicate setup allow-from entries with wildcard support. */
declare function parseAllowFromEntries(raw: string, parseEntry: (entry: string) => ParsedAllowFromEntry): {
  entries: string[];
  error?: string;
};
/** Resolve basic setup allow-from entries when a channel token is available. */
declare function resolveBasicAllowFromEntries(params: {
  token?: string | null;
  entries: string[];
  resolveEntries: (params: {
    token: string;
    entries: string[];
  }) => Promise<Array<{
    input: string;
    resolved: boolean;
    id?: string | null;
  }>>;
}): Promise<Array<{
  input: string;
  resolved: boolean;
  id: string | null;
}>>;
/** Check whether a sender id matches a simple normalized allowlist with wildcard support. */
declare function isNormalizedSenderAllowed(params: {
  /** Sender id or handle to compare after string coercion and lowercase normalization. */
  senderId: string | number;
  /** Raw allowlist entries; `*` allows every sender. */
  allowFrom: Array<string | number>;
  /** Optional prefix remover applied to allowlist entries before comparison. */
  stripPrefixRe?: RegExp;
}): boolean;
/** Serializable allowlist resolution record used by setup/status UI surfaces. */
type BasicAllowlistResolutionEntry = {
  /** Original allowlist input. */
  input: string;
  /** Whether resolution found a concrete account/user id. */
  resolved: boolean;
  /** Resolved id when available. */
  id?: string;
  /** Resolved display name when available. */
  name?: string;
  /** Optional resolver note for UI or docs output. */
  note?: string;
};
/** Clone allowlist resolution entries into a plain serializable shape for UI and docs output. */
declare function mapBasicAllowlistResolutionEntries(entries: BasicAllowlistResolutionEntry[]): BasicAllowlistResolutionEntry[];
/** Map allowlist inputs sequentially so resolver side effects stay ordered and predictable. */
declare function mapAllowlistResolutionInputs<T>(params: {
  /** Ordered allowlist inputs to resolve. */
  inputs: string[];
  /** Resolver callback invoked once per input in order. */
  mapInput: (input: string) => Promise<T> | T;
}): Promise<T[]>;
//#endregion
export { type AllowlistMatch, type AllowlistMatchSource, type AllowlistUserResolutionLike, BasicAllowlistResolutionEntry, type CompiledAllowlist, addAllowlistUserEntriesFromConfigEntry, buildAllowlistResolutionSummary, canonicalizeAllowlistWithResolvedIds, compileAllowlist, firstDefined, formatAllowFromLowercase, formatAllowlistMatchMeta, formatNormalizedAllowFromEntries, isAllowedParsedChatSender, isNormalizedSenderAllowed, isSenderIdAllowed, mapAllowlistResolutionInputs, mapBasicAllowlistResolutionEntries, mergeAllowlist, mergeDmAllowFromSources, parseAllowFromEntries, patchAllowlistUsersInConfigEntries, resolveAllowlistCandidates, resolveAllowlistMatchByCandidates, resolveAllowlistMatchSimple, resolveBasicAllowFromEntries, resolveCompiledAllowlistMatch, resolveGroupAllowFromSources, summarizeMapping };