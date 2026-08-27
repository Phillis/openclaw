import { c as ChannelDirectoryEntry, l as ChannelDirectoryEntryKind } from "../types.core-D9YiZM0R.js";
import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import "../types-B4QsRB1k.js";
import "../types.public-CrLR9xRK.js";
//#region src/channels/plugins/directory-types.d.ts
/**
 * Shared input for channel directory lookups.
 *
 * Directory-capable plugins receive the active config plus optional account
 * scope, search text, and result limit from setup or command surfaces.
 */
type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
//#endregion
//#region src/channels/plugins/directory-config-helpers.d.ts
/**
 * Applies case-insensitive query filtering and a positive result limit to ids.
 */
declare function applyDirectoryQueryAndLimit(ids: string[], params: {
  query?: string | null;
  limit?: number | null;
}): string[];
/**
 * Converts normalized ids into channel directory entries of one kind.
 */
declare function toDirectoryEntries(kind: "user" | "group", ids: string[]): ChannelDirectoryEntry[];
/**
 * Collects unique normalized ids from multiple raw config sources.
 */
declare function collectNormalizedDirectoryIds(params: {
  sources: Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): string[];
/**
 * Lists directory entries from arbitrary config sources.
 *
 * Callers supply source iterables and an id normalizer so channel-specific
 * config shapes share the same wildcard filtering, dedupe, query, and limit
 * behavior.
 */
declare function listDirectoryEntriesFromSources(params: {
  kind: "user" | "group";
  sources: Iterable<unknown>[];
  query?: string | null;
  limit?: number | null;
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists directory entries for channels that inspect optional configured accounts.
 */
declare function listInspectedDirectoryEntriesFromSources<InspectedAccount>(params: DirectoryConfigParams & {
  kind: "user" | "group";
  inspectAccount: (cfg: OpenClawConfig, accountId?: string | null) => InspectedAccount | null | undefined;
  resolveSources: (account: InspectedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Builds an async lister around an inspected-account directory source.
 */
declare function createInspectedDirectoryEntriesLister<InspectedAccount>(params: {
  kind: "user" | "group";
  inspectAccount: (cfg: OpenClawConfig, accountId?: string | null) => InspectedAccount | null | undefined;
  resolveSources: (account: InspectedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
/**
 * Lists directory entries for channels whose account resolver always returns a config object.
 */
declare function listResolvedDirectoryEntriesFromSources<ResolvedAccount>(params: DirectoryConfigParams & {
  kind: "user" | "group";
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveSources: (account: ResolvedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Builds an async lister around a required resolved-account directory source.
 */
declare function createResolvedDirectoryEntriesLister<ResolvedAccount>(params: {
  kind: "user" | "group";
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveSources: (account: ResolvedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
/**
 * Lists user directory entries from an allowlist-style config array.
 */
declare function listDirectoryUserEntriesFromAllowFrom(params: {
  allowFrom?: readonly unknown[];
  query?: string | null;
  limit?: number | null;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists user entries from both direct allowlists and map-key config.
 */
declare function listDirectoryUserEntriesFromAllowFromAndMapKeys(params: {
  allowFrom?: readonly unknown[];
  map?: Record<string, unknown>;
  query?: string | null;
  limit?: number | null;
  normalizeAllowFromId?: (entry: string) => string | null | undefined;
  normalizeMapKeyId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists group directory entries from map-key config.
 */
declare function listDirectoryGroupEntriesFromMapKeys(params: {
  groups?: Record<string, unknown>;
  query?: string | null;
  limit?: number | null;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists group entries from both map-key config and allowlist values.
 */
declare function listDirectoryGroupEntriesFromMapKeysAndAllowFrom(params: {
  groups?: Record<string, unknown>;
  allowFrom?: readonly unknown[];
  query?: string | null;
  limit?: number | null;
  normalizeMapKeyId?: (entry: string) => string | null | undefined;
  normalizeAllowFromId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists resolved-account user entries from an allowlist selector.
 */
declare function listResolvedDirectoryUserEntriesFromAllowFrom<ResolvedAccount>(params: DirectoryConfigParams & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveAllowFrom: (account: ResolvedAccount) => readonly unknown[] | undefined;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists resolved-account group entries from a group-map selector.
 */
declare function listResolvedDirectoryGroupEntriesFromMapKeys<ResolvedAccount>(params: DirectoryConfigParams & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveGroups: (account: ResolvedAccount) => Record<string, unknown> | undefined;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
//#endregion
export { type ChannelDirectoryEntry, type ChannelDirectoryEntryKind, type DirectoryConfigParams, applyDirectoryQueryAndLimit, collectNormalizedDirectoryIds, createInspectedDirectoryEntriesLister, createResolvedDirectoryEntriesLister, listDirectoryEntriesFromSources, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, listInspectedDirectoryEntriesFromSources, listResolvedDirectoryEntriesFromSources, listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom, toDirectoryEntries };