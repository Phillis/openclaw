import { n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import "./types-Ds34fJCS.js";
import { $ as ChannelLegacyStateMigrationPlan, Q as LegacyConfigRule } from "./types.adapters-B0aAZi8q.js";
import "./manifest-registry-BvU-V0_L.js";
import { n as PluginStateEntry, r as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "./plugin-state-store.types-DnCvxs0P.js";
import "./dangerous-name-matching-BqsacYyE.js";
import "./legacy-private-network-migration-Ldp8MFTL.js";
import { DatabaseSync } from "node:sqlite";
//#region src/channels/plugins/dm-access.d.ts
/**
 * Mutable config record used while migrating channel account DM fields.
 */
type DmAccessRecord = Record<string, unknown>;
/**
 * Result returned by compatibility helpers after optional DM config mutation.
 */
type CompatMutationResult = {
  entry: DmAccessRecord;
  changed: boolean;
};
/**
 * Migrates legacy `dm.*` aliases into the canonical DM access fields.
 */
declare function normalizeLegacyDmAliases(params: {
  entry: DmAccessRecord;
  pathPrefix: string;
  changes: string[];
  promoteAllowFrom?: boolean;
}): CompatMutationResult;
//#endregion
//#region src/plugin-state/plugin-state-store.sqlite.d.ts
type PluginDoctorRawStateEntry = Omit<PluginStateEntry<unknown>, "value" | "expiresAt"> & {
  valueJson: string;
  value?: unknown;
  expiresAt: number | null;
};
//#endregion
//#region src/config/channel-compat-normalization.d.ts
/** Resolved streaming values a channel doctor supplies while migrating legacy aliases. */
type LegacyStreamingAliasOptions = {
  resolvedMode: string;
  /**
   * Mode to persist when migration creates the `streaming` object from flat
   * delivery aliases alone (no streamMode/scalar/boolean mode source). Only
   * needed by channels whose "streaming absent" runtime default differs from
   * their object-without-mode default (Discord: progress vs off).
   */
  aliasOnlyMode?: string;
  includePreviewChunk?: boolean;
  resolvedNativeTransport?: unknown;
};
/** Account-level channel config passed to channel-specific doctor migrations. */
type NormalizeLegacyChannelAccountParams = {
  account: Record<string, unknown>;
  accountId: string;
  pathPrefix: string;
  changes: string[];
};
type NormalizeChannelConfigEntryParams = {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
  accountId?: string;
};
type RetiredChannelKeyRemoval = {
  key: string;
  pathPrefix: string;
};
/**
 * Doctor-only stream mode resolution across nested and legacy alias keys.
 *
 * Runtime helpers no longer read `streamMode`, so doctor contracts use this to
 * preserve legacy intent (nested mode > scalar string > streamMode > scalar
 * boolean) while migrating flat aliases into `streaming.mode`.
 */
declare function resolveLegacyAliasStreamingMode(entry: Record<string, unknown>, defaultMode: "off" | "partial" | "block" | "progress"): "off" | "partial" | "block" | "progress";
/** Checks whether any account entry still carries a channel-specific legacy alias. */
declare function hasLegacyAccountStreamingAliases(value: unknown, match: (entry: unknown) => boolean): boolean;
/**
 * Moves legacy flat streaming aliases into the nested `streaming` config shape.
 *
 * Existing nested values win over legacy aliases, matching doctor migration rules
 * that preserve explicit modern config while removing stale compatibility keys.
 */
declare function normalizeLegacyStreamingAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
} & LegacyStreamingAliasOptions): CompatMutationResult;
/**
 * Runs generic channel doctor alias migration for the root entry and accounts.
 *
 * Channel plugins provide streaming resolution and optional account-specific
 * migrations so core can keep one compatibility path for all channel shapes.
 */
declare function normalizeLegacyChannelAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
  normalizeDm?: boolean;
  rootDmPromoteAllowFrom?: boolean;
  normalizeAccountDm?: boolean;
  /**
   * Set for channels whose runtime account merge replaces the root `streaming`
   * object wholesale (`streaming` not deep-merged). Doctor then seeds account
   * objects it materializes with the inherited root settings. Channels that
   * deep-merge streaming (slack, imessage) must NOT seed: their runtime keeps
   * composing root+account, and seeded copies would freeze inheritance.
   */
  seedAccountStreamingFromRoot?: boolean;
  resolveStreamingOptions: (entry: Record<string, unknown>) => LegacyStreamingAliasOptions;
  normalizeAccountExtra?: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
}): CompatMutationResult;
/** Detects legacy streaming aliases on one channel or account config entry. */
declare function hasLegacyStreamingAliases(value: unknown, options?: {
  includePreviewChunk?: boolean;
  includeNativeTransport?: boolean;
}): boolean;
//#endregion
//#region src/plugins/doctor-contract-module.d.ts
type PluginDoctorStateMigrationDetection = {
  preview: string[];
};
type PluginDoctorStateMigrationContext = {
  openPluginStateKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
  /** Doctor-only batch import preserving source age and remaining retention. */
  importPluginStateEntries?: (options: OpenKeyedStoreOptions, entries: readonly {
    key: string;
    value: unknown;
    createdAt: number;
    ttlMs?: number;
  }[]) => void;
  /** Plugin-wide live-row capacity for import preflight. Older test hosts may omit it. */
  getPluginStateCapacity?: () => {
    liveEntries: number;
    maxEntries: number;
  };
  readPluginStateEntriesInKeyRange?: (namespace: string, range: {
    prefix: string;
    after?: string;
    limit: number;
  }) => PluginDoctorRawStateEntry[];
  readSessionIdentityEvidenceBatch?: (requests: readonly {
    agentId: string;
    sessionId: string;
  }[]) => Promise<({
    agentId: string;
    sessionId: string;
    state: "current";
    sessionKey: string;
  } | {
    agentId: string;
    sessionId: string;
    state: "absent" | "unknown";
  })[]>;
  /** Present only while the host owns the offline SQLite maintenance lock. */
  deletePluginStateEntriesIfUnchanged?: (namespace: string, entries: readonly PluginDoctorRawStateEntry[]) => {
    deleted: number;
    changed: number;
  };
};
type PluginDoctorStateMigration = {
  id: string;
  label: string;
  /** Import retired file state only during explicit `doctor --fix` repair. */
  doctorOnly?: boolean;
  phase?: "after-session-repair";
  detectLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) => Promise<PluginDoctorStateMigrationDetection | null> | PluginDoctorStateMigrationDetection | null;
  migrateLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) => Promise<{
    changes: string[];
    warnings: string[];
    notices?: string[];
  }> | {
    changes: string[];
    warnings: string[];
    notices?: string[];
  };
};
//#endregion
//#region src/config/channel-alias-migration.d.ts
type StreamingAliasMode = "off" | "partial" | "block" | "progress";
/**
 * Streaming half of a channel alias-migration spec.
 *
 * TMode widens the migrated `streaming.mode` value set for channels whose
 * nested schema keeps channel-local modes (Matrix adds "quiet"); the generic
 * default keeps the shared four-mode contract for everyone else.
 */
type StreamingAliasSpec<TMode extends string = StreamingAliasMode> = {
  /** Default passed to resolveLegacyAliasStreamingMode for mode-source migration. */
  defaultMode: StreamingAliasMode;
  /** Channel-specific mode resolver override (Slack maps legacy draft stream modes). */
  resolveMode?: (entry: Record<string, unknown>) => TMode;
  /**
   * The channel's runtime default when `streaming` is entirely absent, if it
   * differs from the object-without-mode default (Discord: progress vs off).
   * Pinned when delivery-only aliases materialize the object and no root
   * streaming object exists to seed inherited settings from.
   */
  absentObjectDefault?: StreamingAliasMode;
  /** Channel accepts flat `draftChunk` (Discord, Telegram). */
  includePreviewChunk?: boolean;
  /** Channel accepts flat `nativeStreaming`; returns the resolved nativeTransport (Slack). */
  resolveNativeTransport?: (entry: Record<string, unknown>) => unknown;
  /**
   * Channel has no streaming mode: only delivery flat aliases migrate, and
   * scalar `streaming` values are plain validation errors (iMessage). The
   * detection matcher excludes streamMode/scalar streaming, and the migration
   * only runs when a delivery flat alias exists somewhere in the entry.
   */
  deliveryOnly?: boolean;
};
type ChannelAliasMigrationSpec<TMode extends string = StreamingAliasMode> = {
  /** Channel id under `channels.<id>`; also the doctor message path prefix. */
  channelId: string;
  streaming: StreamingAliasSpec<TMode>;
  /**
   * Set when the channel's runtime account merge replaces the root `streaming`
   * object wholesale (Discord). Migration then seeds account objects it
   * materializes with the inherited root settings. Leave unset for channels
   * that deep-merge streaming at runtime (Slack, iMessage) — seeding there
   * would freeze inheritance into the account config.
   */
  accountStreamingReplacesRoot?: boolean;
  /** Account resolution layers accounts.default between root and named accounts. */
  accountStreamingInheritsDefaultAccount?: boolean;
  dm?: {
    root?: boolean;
    accounts?: boolean;
    rootPromoteAllowFrom?: boolean;
  };
  /** Escape hatch for channel-specific per-account migrations (Discord voice.tts). */
  normalizeAccountExtra?: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
};
/**
 * Builds the standard channel doctor alias-migration surface from a small spec:
 * detection rules (root + accounts), the per-entry matcher, and the config
 * normalizer. Channels with additional migrations compose around these pieces.
 */
declare function defineChannelAliasMigration<TMode extends string = StreamingAliasMode>(spec: ChannelAliasMigrationSpec<TMode>): {
  legacyConfigRules: LegacyConfigRule[];
  hasLegacyAliases: (value: unknown) => boolean;
  normalizeChannelConfig: (params: {
    cfg: OpenClawConfig;
    changes?: string[];
  }) => {
    config: OpenClawConfig;
    changes: string[];
  };
};
//#endregion
//#region src/config/channel-doctor-helpers.d.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
declare function normalizeChannelAccounts(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
  normalizeAccount: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
}): CompatMutationResult;
/** Applies the same channel-specific doctor migration at root and account scope. */
declare function normalizeChannelConfigEntries(params: {
  cfg: OpenClawConfig;
  channelId: string;
  changes?: string[];
  normalizeEntry: (params: NormalizeChannelConfigEntryParams) => CompatMutationResult;
}): {
  config: OpenClawConfig;
  changes: string[];
};
/** Removes retired keys recursively or from a channel root and its accounts. */
declare function stripRetiredChannelKeys(params: {
  cfg: OpenClawConfig;
  channelId: string;
  keys: ReadonlySet<string>;
  scope: "recursive" | "root-and-accounts";
  onRemove?: (removed: RetiredChannelKeyRemoval) => void;
}): {
  config: OpenClawConfig;
  changed: boolean;
};
/** Materializes root/default-account inheritance after aliases create streaming. */
declare function materializeInheritedAccountStreaming(params: {
  cfg: OpenClawConfig;
  channelId: string;
  accountsBefore: Record<string, unknown> | null;
  changes: string[];
}): OpenClawConfig;
//#endregion
//#region src/plugins/doctor-state-migration-fs.d.ts
/** True when the legacy-state path exists and is a regular file. */
declare function legacyStateFileExists(filePath: string): Promise<boolean>;
/**
 * Renames a migrated legacy source to `<path>.migrated`, recording the outcome in the
 * doctor changes/warnings lists. Never throws: a failed archive leaves the source in
 * place so a later doctor run can retry without losing migrated data.
 */
declare function archiveLegacyStateSource(params: {
  filePath: string;
  label: string;
  changes: string[];
  warnings: string[];
}): Promise<void>;
//#endregion
//#region src/channels/plugins/legacy-state-migration-preview.d.ts
declare function buildLegacyMigrationPreview(plan: ChannelLegacyStateMigrationPlan): string;
//#endregion
//#region src/plugin-sdk/doctor-migration-plan-adapter.d.ts
type PluginDoctorPlanResolver = (params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  oauthDir: string;
}) => ChannelLegacyStateMigrationPlan[] | Promise<ChannelLegacyStateMigrationPlan[] | null | undefined> | null | undefined;
/** Adapts legacy channel migration plans to the canonical plugin doctor contract. */
declare function definePluginDoctorMigrationFromPlans(params: {
  id: string;
  label: string;
  doctorOnly?: boolean;
  resolvePlans: PluginDoctorPlanResolver;
}): PluginDoctorStateMigration;
//#endregion
//#region src/plugin-sdk/runtime-doctor-migrations.d.ts
type KeyMoveValue = {
  value: unknown;
};
type KeyMoveChangeContext = {
  sourcePath: string;
  targetPath: string;
  sourceValue: unknown;
  targetValue: unknown;
  mappedValue: unknown;
};
/** Collects a channel's root config and object-shaped account overrides in config order. */
declare function collectChannelAccountScopes(params: {
  cfg: OpenClawConfig;
  channelId: string;
}): Array<{
  prefix: string;
  pathSegments: string[];
  account: Record<string, unknown>;
}>;
/** Defines an immutable legacy-key move across fixed or `*`-mapped object paths. */
declare function defineKeyMoveMigration(params: {
  scope?: readonly string[];
  from: readonly string[];
  to: readonly string[];
  match?: (value: unknown) => boolean;
  sourceOwn?: boolean;
  map?: (value: unknown) => KeyMoveValue | null;
  targetIsSet?: (value: unknown) => boolean;
  pruneEmptySource?: boolean;
  movedMessage?: (context: KeyMoveChangeContext) => string;
  existingMessage?: (context: KeyMoveChangeContext) => string;
  invalidMessage?: (context: KeyMoveChangeContext) => string;
}): {
  hasLegacy: (value: unknown) => boolean;
  normalize: (params: {
    entry: Record<string, unknown>;
    pathPrefix: string;
    changes: string[];
  }) => CompatMutationResult;
};
/** Defines a single-file legacy JSON import into one keyed plugin-state namespace. */
declare function defineLegacyJsonStateMigration<TSource>(params: {
  id: string;
  label: string;
  resolvePath: (stateDir: string) => string;
  parse: (value: unknown) => TSource | null;
  namespace: string;
  maxEntries: number;
  overflowPolicy?: OpenKeyedStoreOptions["overflowPolicy"];
  archiveLabel?: string;
  capacityPrecheck?: {
    warning: (stats: {
      available: number;
      missing: number;
    }) => string;
  };
  describeEntries: (source: TSource, context: {
    filePath: string;
    namespace: string;
  }) => {
    preview: string[];
    change: (stats: {
      imported: number;
      alreadyPresent: number;
    }) => string | null;
  };
  toRows: (source: TSource) => readonly {
    key: string;
    value: unknown;
  }[];
}): PluginDoctorStateMigration;
//#endregion
export { normalizeLegacyChannelAliases as C, normalizeLegacyDmAliases as D, CompatMutationResult as E, hasLegacyStreamingAliases as S, resolveLegacyAliasStreamingMode as T, LegacyStreamingAliasOptions as _, buildLegacyMigrationPreview as a, RetiredChannelKeyRemoval as b, materializeInheritedAccountStreaming as c, stripRetiredChannelKeys as d, ChannelAliasMigrationSpec as f, PluginDoctorStateMigrationContext as g, PluginDoctorStateMigration as h, definePluginDoctorMigrationFromPlans as i, normalizeChannelAccounts as l, defineChannelAliasMigration as m, defineKeyMoveMigration as n, archiveLegacyStateSource as o, StreamingAliasMode as p, defineLegacyJsonStateMigration as r, legacyStateFileExists as s, collectChannelAccountScopes as t, normalizeChannelConfigEntries as u, NormalizeChannelConfigEntryParams as v, normalizeLegacyStreamingAliases as w, hasLegacyAccountStreamingAliases as x, NormalizeLegacyChannelAccountParams as y };