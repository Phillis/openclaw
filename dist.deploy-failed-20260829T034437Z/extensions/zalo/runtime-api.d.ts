import { Cn as jsonResult, D as buildBaseAccountStatusSnapshot, Gn as normalizeAccountId, I as buildChannelConfigSchema, Jn as OutboundReplyPayload, N as PAIRING_APPROVED_MESSAGE, O as buildTokenChannelStatusSummary, P as formatPairingApproveHint, Qn as sendPayloadWithChunkedTextAndMedia, Sn as readToolStringParam, Wn as DEFAULT_ACCOUNT_ID, Xn as deliverTextOrMediaReply, Yn as ReplyPayload, Zn as isNumericTargetId, en as PluginRuntime, i as PluginHttpRouteRegistration, tn as createChannelReplyPipeline, zt as PluginRegistry } from "../../acpx-D5fMZfg0.js";
import { At as MarkdownTableMode, Bt as normalizeResolvedSecretInputString, Et as GroupPolicy, Lt as SecretInput, Vt as normalizeSecretInputString, n as OpenClawConfig, zt as hasConfiguredSecretInput } from "../../types.openclaw-Ca71eRYk.js";
import "../../config-contracts-DfVpGCcF.js";
import { pt as ChannelId } from "../../types-DsxVAMKG.js";
import "../../channel-contract-CRFpY1xx.js";
import { f as RuntimeEnv } from "../../manifest-registry-kLzFkgEP.js";
import { G as BaseTokenResolution, K as ChannelAccountSnapshot, W as BaseProbeResult, et as ChannelMessageActionAdapter, i as WizardPrompter, it as ChannelStatusIssue } from "../../setup-wizard-types-BoxqfOlR.js";
import { n as ChannelPlugin, t as ChannelMessageActionName } from "../../types.public-DkxVn6s3.js";
import { n as applySetupAccountConfigPatch, r as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../../runtime-env-lLLj49vk.js";
import "../../reply-runtime-j66X1nT0.js";
import { t as buildSecretInputSchema } from "../../secret-input-DTSGM9o9.js";
import { a as runSingleChannelSecretStep, i as promptSingleChannelSecretInput, n as buildSingleChannelSecretPromptState, o as setTopLevelChannelDmPolicyWithAllowFrom, r as mergeAllowFromEntries, t as addWildcardAllowFrom } from "../../setup-BHCR1uqJ.js";
import { IncomingMessage, ServerResponse } from "node:http";
import "ws";
//#region src/plugin-sdk/allow-from.d.ts
/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
declare function formatAllowFromLowercase(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */
  allowFrom: Array<string | number>;
  /** Optional prefix remover for channel aliases such as `tg:` or `zalo:`. */
  stripPrefixRe?: RegExp;
}): string[];
/** Check whether a sender id matches a simple normalized allowlist with wildcard support. */
declare function isNormalizedSenderAllowed(params: {
  /** Sender id or handle to compare after string coercion and lowercase normalization. */
  senderId: string | number;
  /** Raw allowlist entries; `*` allows every sender. */
  allowFrom: Array<string | number>;
  /** Optional prefix remover applied to allowlist entries before comparison. */
  stripPrefixRe?: RegExp;
}): boolean;
//#endregion
//#region src/channels/logging.d.ts
/**
 * Shared channel diagnostic formatters exposed through the plugin SDK.
 * Keep messages compact and stable enough for plugin logs without making them machine contracts.
 */
/** Minimal logger callback shape exposed through channel SDK helpers. */
type LogFn = (message: string) => void;
/** Emits a normalized typing-indicator failure diagnostic for channel plugins. */
declare function logTypingFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  action?: "start" | "stop";
  error: unknown;
}): void;
//#endregion
//#region src/infra/dedupe.d.ts
/** Small in-memory TTL/LRU-style cache for replay and duplicate suppression. */
type DedupeCache = {
  /** Returns true for a recent duplicate; records the key and optional owner when absent. */
  check: (key: string | undefined | null, now?: number, ownerToken?: object) => boolean;
  /** Returns true for a recent duplicate without refreshing or recording the key. */
  peek: (key: string | undefined | null, now?: number) => boolean;
  delete: (key: string | undefined | null, ownerToken?: object) => void;
  clear: () => void;
  size: () => number;
};
/** Dedupe cache bounds; ttlMs <= 0 disables expiry, maxSize <= 0 disables storage. */
type DedupeCacheOptions = {
  ttlMs: number;
  maxSize: number;
};
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
declare function createDedupeCache(options: DedupeCacheOptions): DedupeCache;
//#endregion
//#region src/gateway/net.d.ts
declare function resolveClientIp(params: {
  remoteAddr?: string;
  forwardedFor?: string;
  realIp?: string;
  trustedProxies?: string[];
  /** Default false: only trust X-Real-IP when explicitly enabled. */
  allowRealIpFallback?: boolean;
}): string | undefined;
//#endregion
//#region src/config/runtime-group-policy.d.ts
type RuntimeGroupPolicyResolution = {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
type ResolveProviderRuntimeGroupPolicyParams = {
  providerConfigPresent: boolean;
  groupPolicy?: GroupPolicy;
  defaultGroupPolicy?: GroupPolicy;
};
type GroupPolicyDefaultsConfig = {
  channels?: {
    defaults?: {
      groupPolicy?: GroupPolicy;
    };
  };
};
/** Read the shared channels default group policy used by provider-specific resolvers. */
declare function resolveDefaultGroupPolicy(cfg: GroupPolicyDefaultsConfig): GroupPolicy | undefined;
/**
 * Resolve the standard channel-provider policy.
 * Configured providers default open; missing provider config defaults allowlist.
 */
declare function resolveOpenProviderRuntimeGroupPolicy(params: ResolveProviderRuntimeGroupPolicyParams): RuntimeGroupPolicyResolution;
/**
 * Log the missing-provider fail-closed fallback once per provider/account.
 * Returns true only when this call emitted the warning.
 */
declare function warnMissingProviderGroupPolicyFallbackOnce(params: {
  providerMissingFallbackApplied: boolean;
  providerKey: string;
  accountId?: string;
  blockedLabel?: string;
  log: (message: string) => void;
}): boolean;
//#endregion
//#region src/infra/abort-signal.d.ts
/** Resolves when the signal aborts, or immediately when no wait is needed. */
declare function waitForAbortSignal(signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/plugin-sdk/text-chunking.d.ts
/**
 * Splits outbound channel text into chunks no longer than the requested limit.
 * Newline boundaries win over spaces; text without usable separators falls back
 * to a hard character split so channel senders always receive bounded strings.
 */
declare function chunkTextForOutbound(text: string, limit: number, options?: {
  preserveWhitespace?: boolean;
  formatting?: unknown;
}): string[];
//#endregion
//#region src/pairing/pairing-challenge.d.ts
type PairingMeta = Record<string, string | undefined>;
type PairingChallengeParams = {
  channel: string;
  accountId?: string;
  senderId: string;
  senderIdLine: string;
  meta?: PairingMeta;
  upsertPairingRequest: (params: {
    id: string;
    meta?: PairingMeta;
  }) => Promise<{
    code: string;
    created: boolean;
  }>;
  sendPairingReply: (text: string) => Promise<void>;
  buildReplyText?: (params: {
    code: string;
    senderIdLine: string;
  }) => string;
  onCreated?: (params: {
    code: string;
  }) => void;
  onReplyError?: (err: unknown) => void;
};
/**
 * Shared pairing challenge issuance for DM pairing policy pathways.
 * Ensures every channel follows the same create-if-missing + reply flow.
 */
declare function issuePairingChallenge(params: PairingChallengeParams): Promise<{
  created: boolean;
  code?: string;
}>;
//#endregion
//#region src/plugin-sdk/pairing-access.d.ts
type PairingApi = PluginRuntime["channel"]["pairing"];
type ScopedUpsertInput = Omit<Parameters<PairingApi["upsertPairingRequest"]>[0], "channel" | "accountId">;
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
declare function createScopedPairingAccess(params: {
  /** Plugin runtime that owns the channel pairing store API. */
  core: PluginRuntime;
  /** Channel id permanently attached to store reads and writes from this helper. */
  channel: ChannelId;
  /** Channel account id normalized once before store operations. */
  accountId: string;
}): {
  /** Normalized account id used by every channel-scoped pairing store operation. */
  accountId: string;
  /** Read allow-list entries for the scoped channel/account pair. */
  readAllowFromStore: () => Promise<string[]>;
  /** Delete one approval after the owning channel durably consumes it. */
  removeAllowFromStoreEntry: (entry: string | number) => Promise<{
    changed: boolean;
    allowFrom: string[];
  }>;
  /** Read another channel/account allow-list for DM policy cross-checks. */
  readStoreForDmPolicy: (provider: ChannelId, accountId: string) => Promise<string[]>;
  /** Upsert a pairing request with the scoped channel/account injected. */
  upsertPairingRequest: (input: ScopedUpsertInput) => Promise<{
    code: string;
    created: boolean;
  }>;
};
//#endregion
//#region src/plugin-sdk/channel-pairing.d.ts
type ScopedPairingAccess = ReturnType<typeof createScopedPairingAccess>;
/** Pairing helpers scoped to one channel account. */
type ChannelPairingController = ScopedPairingAccess & {
  /** Issue a pairing challenge using the controller's channel and scoped store writer. */
  issueChallenge: (params: Omit<Parameters<typeof issuePairingChallenge>[0], "channel" | "accountId" | "upsertPairingRequest">) => ReturnType<typeof issuePairingChallenge>;
};
/** Build the full scoped pairing controller used by channel runtime code. */
declare function createChannelPairingController(params: {
  /** Plugin runtime that provides pairing store operations. */
  core: PluginRuntime;
  /** Channel id scoped into reads, writes, and issued challenges. */
  channel: ChannelId;
  /** Channel account id normalized before pairing store access. */
  accountId: string;
}): ChannelPairingController;
//#endregion
//#region src/plugin-sdk/webhook-memory-guards.d.ts
/** In-memory fixed-window limiter used by webhook ingress handlers. */
type FixedWindowRateLimiter = {
  /** Return true once the key exceeds its allowed request count in the current window. */
  isRateLimited: (key: string, nowMs?: number) => boolean;
  /** Number of tracked keys currently retained in memory. */
  size: () => number;
  /** Drop all tracked keys and reset pruning state. */
  clear: () => void;
};
/** Default webhook ingress rate-limit settings for plugin monitors. */
declare const WEBHOOK_RATE_LIMIT_DEFAULTS: Readonly<{
  windowMs: 60000;
  maxRequests: 120;
  maxTrackedKeys: 4096;
}>;
/** Default cardinality and sampling settings for webhook anomaly counters. */
declare const WEBHOOK_ANOMALY_COUNTER_DEFAULTS: Readonly<{
  maxTrackedKeys: 4096;
  ttlMs: number;
  logEvery: 25;
}>;
/** Records repeated webhook failures and exposes bounded in-memory state controls. */
type WebhookAnomalyTracker = {
  /** Count one tracked status for a key; returns zero when the status/key is ignored. */
  record: (params: {
    /** Stable anomaly key, typically route plus sender or remote identity. */
    key: string;
    /** HTTP status to count when it is in the tracked status-code set. */
    statusCode: number;
    /** Build the sampled log message from the current key count. */
    message: (count: number) => string;
    /** Optional log sink invoked for the first hit and every sampled repeat. */
    log?: (message: string) => void;
    /** Clock override for deterministic tests. */
    nowMs?: number;
  }) => number;
  /** Number of tracked anomaly keys currently retained in memory. */
  size: () => number;
  /** Drop all tracked anomaly keys and reset pruning state. */
  clear: () => void;
};
/** Create a simple fixed-window rate limiter for in-memory webhook protection. */
declare function createFixedWindowRateLimiter(options: {
  /** Duration of one fixed window in milliseconds. */
  windowMs: number;
  /** Maximum accepted requests per key during one window. */
  maxRequests: number;
  /** Maximum number of keys retained before oldest entries are pruned. */
  maxTrackedKeys: number;
  /** Optional interval for expired-window pruning. Defaults to `windowMs`. */
  pruneIntervalMs?: number;
}): FixedWindowRateLimiter;
/** Track repeated webhook failures and emit sampled logs for suspicious request patterns. */
declare function createWebhookAnomalyTracker(options?: {
  /** Maximum number of anomaly keys retained before oldest entries are pruned. */
  maxTrackedKeys?: number;
  /** Key TTL in milliseconds; zero disables TTL expiry. */
  ttlMs?: number;
  /** Log every Nth repeat after the first hit. */
  logEvery?: number;
  /** HTTP status codes that should be counted as anomalies. */
  trackedStatusCodes?: readonly number[];
}): WebhookAnomalyTracker;
//#endregion
//#region src/plugin-sdk/webhook-request-guards.d.ts
/** Body-read profile for webhook payload limits before or after authentication. */
type WebhookBodyReadProfile = "pre-auth" | "post-auth";
/** Per-key in-flight limiter used to bound concurrent webhook handlers. */
type WebhookInFlightLimiter = {
  /** Acquire one in-flight slot for a key, returning false when the key is at capacity. */
  tryAcquire: (key: string) => boolean;
  /** Release one slot for a key after the handler completes. */
  release: (key: string) => void;
  /** Number of keys with retained in-flight state. */
  size: () => number;
  /** Drop all retained in-flight state. */
  clear: () => void;
};
/** Apply method, rate-limit, and content-type guards before a webhook handler reads the body. */
declare function applyBasicWebhookRequestGuards(params: {
  /** Incoming request to validate before body reads or handler dispatch. */
  req: IncomingMessage;
  /** Response used for method, rate-limit, or content-type rejections. */
  res: ServerResponse;
  /** Allowed HTTP methods; empty or omitted disables the method guard. */
  allowMethods?: readonly string[];
  /** Optional fixed-window limiter for pre-body request throttling. */
  rateLimiter?: FixedWindowRateLimiter;
  /** Key passed to the rate limiter when throttling is enabled. */
  rateLimitKey?: string;
  /** Clock override for deterministic limiter tests. */
  nowMs?: number;
  /** Require JSON content type for POST requests. */
  requireJsonContentType?: boolean;
}): boolean;
/** Read and parse a JSON webhook body, rejecting malformed or oversized payloads consistently. */
declare function readJsonWebhookBodyOrReject(params: {
  /** Incoming request body stream to read and parse as JSON. */
  req: IncomingMessage;
  /** Response used for JSON parse, body size, timeout, or close failures. */
  res: ServerResponse;
  /** Optional maximum body size override in bytes. */
  maxBytes?: number;
  /** Optional body read timeout override in milliseconds. */
  timeoutMs?: number;
  /** Default limit profile to use when explicit limits are omitted. */
  profile?: WebhookBodyReadProfile;
  /** Treat an empty body as `{}` instead of rejecting it as invalid JSON. */
  emptyObjectOnEmpty?: boolean;
  /** Response body for malformed JSON. */
  invalidJsonMessage?: string;
  /** Response status for malformed JSON. */
  invalidJsonStatusCode?: number;
}): Promise<{
  ok: true;
  value: unknown;
} | {
  ok: false;
}>;
//#endregion
//#region src/plugins/http-registry.d.ts
type PluginHttpRouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean | void> | boolean | void;
declare function registerPluginHttpRoute(params: {
  path?: string | null;
  fallbackPath?: string | null;
  handler: PluginHttpRouteHandler;
  auth: PluginHttpRouteRegistration["auth"];
  match?: PluginHttpRouteRegistration["match"];
  gatewayRuntimeScopeSurface?: PluginHttpRouteRegistration["gatewayRuntimeScopeSurface"];
  /** Replace an existing canonical route owned by the same plugin and compatible route source. */
  replaceExisting?: boolean;
  /** Reuse an existing canonical route only when its nonempty plugin and source owners match. */
  reuseExistingSameOwner?: boolean;
  /** Throw when the route cannot be registered instead of returning a no-op cleanup. */
  throwOnFailure?: boolean;
  pluginId?: string;
  /** Stable same-plugin sub-owner for replacement; omit consistently for legacy behavior. */
  source?: string;
  accountId?: string;
  log?: (message: string) => void;
  registry?: PluginRegistry;
}): () => void;
//#endregion
//#region src/plugin-sdk/webhook-targets.d.ts
/** Registration handle returned for one live webhook target. */
type RegisteredWebhookTarget<T> = {
  /** Normalized target stored in the caller-owned path registry. */
  target: T;
  /** Idempotently remove this target and run path teardown when it was the last target. */
  unregister: () => void;
};
/** Lifecycle hooks for path-level webhook target registration. */
type RegisterWebhookTargetOptions<T extends {
  path: string;
}> = {
  /** Called before the first target for a normalized path is stored; may return path teardown. */
  onFirstPathTarget?: (params: {
    path: string;
    target: T;
  }) => void | (() => void);
  /** Called after the last target for a normalized path has been removed. */
  onLastPathTargetRemoved?: (params: {
    path: string;
  }) => void;
};
type RegisterPluginHttpRouteParams = Parameters<typeof registerPluginHttpRoute>[0];
/** Resolve a webhook path from explicit config, URL pathname, or a caller default. */
declare function resolveWebhookPath(params: {
  webhookPath?: string;
  webhookUrl?: string;
  defaultPath?: string | null;
}): string | null;
/** Plugin HTTP route options supplied when webhook paths are registered lazily. */
type RegisterWebhookPluginRouteOptions = Omit<RegisterPluginHttpRouteParams, "path" | "fallbackPath">;
/** Register a webhook target and lazily install the matching plugin HTTP route on first use. */
declare function registerWebhookTargetWithPluginRoute<T extends {
  path: string;
}>(params: {
  /** Caller-owned normalized path registry shared by all targets for this plugin/runtime. */
  targetsByPath: Map<string, T[]>;
  /** Target to normalize, store, and later return from the registration handle. */
  target: T;
  /** Plugin HTTP route configuration used when the first target for a path is registered. */
  route: RegisterWebhookPluginRouteOptions;
  /** Optional last-target hook forwarded to `registerWebhookTarget`. */
  onLastPathTargetRemoved?: RegisterWebhookTargetOptions<T>["onLastPathTargetRemoved"];
}): RegisteredWebhookTarget<T>;
/** Add a normalized target to a path bucket and clean up route state when the last target leaves. */
declare function registerWebhookTarget<T extends {
  path: string;
}>(targetsByPath: Map<string, T[]>, target: T, opts?: RegisterWebhookTargetOptions<T>): RegisteredWebhookTarget<T>;
/** Run common webhook guards, then dispatch only when the request path resolves to live targets. */
declare function withResolvedWebhookRequestPipeline<T>(params: {
  /** Incoming HTTP request whose pathname selects the target bucket. */
  req: IncomingMessage;
  /** HTTP response used by guard failures before handler dispatch. */
  res: ServerResponse;
  /** Caller-owned target registry keyed by normalized webhook path. */
  targetsByPath: Map<string, T[]>;
  /** Allowed methods for the common request guard. */
  allowMethods?: readonly string[];
  /** Optional per-key fixed-window limiter shared across requests. */
  rateLimiter?: FixedWindowRateLimiter;
  /** Explicit rate-limit key; defaults are owned by the request guard. */
  rateLimitKey?: string;
  /** Clock override for deterministic limiter tests. */
  nowMs?: number;
  /** Require JSON content type before dispatching to the webhook handler. */
  requireJsonContentType?: boolean;
  /** Optional in-flight limiter to cap concurrent handling for a key. */
  inFlightLimiter?: WebhookInFlightLimiter;
  /** Explicit or derived key for concurrent request limiting. */
  inFlightKey?: string | ((args: {
    req: IncomingMessage;
    path: string;
    targets: T[];
  }) => string);
  /** Status code returned when the in-flight guard rejects. */
  inFlightLimitStatusCode?: number;
  /** Response body returned when the in-flight guard rejects. */
  inFlightLimitMessage?: string;
  /** Handler invoked only after target resolution and common guards succeed. */
  handle: (args: {
    path: string;
    targets: T[];
  }) => Promise<boolean | void> | boolean | void;
}): Promise<boolean>;
/** Synchronous variant of webhook auth resolution for cheap in-memory match checks. */
declare function resolveWebhookTargetWithAuthOrRejectSync<T>(params: {
  /** Candidate targets for the already-resolved webhook path. */
  targets: readonly T[];
  /** HTTP response used to send unauthorized or ambiguous failures. */
  res: ServerResponse;
  /** Synchronous auth or routing predicate; exactly one target must match. */
  isMatch: (target: T) => boolean;
  /** Status code for no matching target. Defaults to 401. */
  unauthorizedStatusCode?: number;
  /** Response body for no matching target. */
  unauthorizedMessage?: string;
  /** Status code for multiple matching targets. Defaults to 401. */
  ambiguousStatusCode?: number;
  /** Response body for multiple matching targets. */
  ambiguousMessage?: string;
}): T | null;
//#endregion
//#region extensions/zalo/src/runtime.d.ts
declare const setZaloRuntime: (next: PluginRuntime) => void, getZaloRuntime: () => PluginRuntime;
//#endregion
export { type BaseProbeResult, type BaseTokenResolution, type ChannelAccountSnapshot, type ChannelMessageActionAdapter, type ChannelMessageActionName, type ChannelPlugin, type ChannelStatusIssue, DEFAULT_ACCOUNT_ID, type GroupPolicy, type MarkdownTableMode, type OpenClawConfig, type OutboundReplyPayload, PAIRING_APPROVED_MESSAGE, type PluginRuntime, type RegisterWebhookPluginRouteOptions, type RegisterWebhookTargetOptions, type ReplyPayload, type RuntimeEnv, type SecretInput, WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, type WizardPrompter, addWildcardAllowFrom, applyAccountNameToChannelSection, applyBasicWebhookRequestGuards, applySetupAccountConfigPatch, buildBaseAccountStatusSnapshot, buildChannelConfigSchema, buildSecretInputSchema, buildSingleChannelSecretPromptState, buildTokenChannelStatusSummary, chunkTextForOutbound, createChannelReplyPipeline as createChannelMessageReplyPipeline, createChannelPairingController, createDedupeCache, createFixedWindowRateLimiter, createWebhookAnomalyTracker, deliverTextOrMediaReply, formatAllowFromLowercase, formatPairingApproveHint, hasConfiguredSecretInput, isNormalizedSenderAllowed, isNumericTargetId, jsonResult, logTypingFailure, mergeAllowFromEntries, migrateBaseNameToDefaultAccount, normalizeAccountId, normalizeResolvedSecretInputString, normalizeSecretInputString, promptSingleChannelSecretInput, readJsonWebhookBodyOrReject, readToolStringParam as readStringParam, registerPluginHttpRoute, registerWebhookTarget, registerWebhookTargetWithPluginRoute, resolveClientIp, resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, resolveWebhookPath, resolveWebhookTargetWithAuthOrRejectSync, runSingleChannelSecretStep, sendPayloadWithChunkedTextAndMedia, setTopLevelChannelDmPolicyWithAllowFrom, setZaloRuntime, waitForAbortSignal, warnMissingProviderGroupPolicyFallbackOnce, withResolvedWebhookRequestPipeline };