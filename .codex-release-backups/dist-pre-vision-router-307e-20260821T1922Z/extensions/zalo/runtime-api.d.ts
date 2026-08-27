import { A as createChannelReplyPipeline, D as PluginHttpRouteRegistration$1, F as isNumericTargetId, I as sendPayloadWithChunkedTextAndMedia, M as ReplyPayload, O as PluginRegistry, P as deliverTextOrMediaReply, a as OpenClawPluginGatewayRuntimeScopeSurface, at as readToolStringParam, j as OutboundReplyPayload, k as PluginRuntime, ot as jsonResult } from "../../types-BC3VLVBd.js";
import { Z as GroupPolicy, dt as normalizeSecretInputString, et as MarkdownTableMode, lt as hasConfiguredSecretInput, n as OpenClawConfig, st as SecretInput, ut as normalizeResolvedSecretInputString } from "../../types.openclaw-eGZBtvai.js";
import { F as BaseProbeResult, I as BaseTokenResolution, L as ChannelAccountSnapshot, W as ChannelMessageActionAdapter, ct as WizardPrompter, q as ChannelStatusIssue } from "../../setup-wizard-types-u0truel5.js";
import { j as RuntimeEnv } from "../../manifest-registry-BzRPksH-.js";
import { n as ChannelPlugin, t as ChannelMessageActionName } from "../../types.public-C4z0FyWm.js";
import { t as createDedupeCache } from "../../reply-runtime-Bj1cOltM.js";
import { n as buildChannelConfigSchema, t as formatPairingApproveHint } from "../../helpers-C9tA3RLL.js";
import { n as applySetupAccountConfigPatch, r as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../../setup-helpers-Br12IK0w.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, c as logTypingFailure, i as resolveOpenProviderRuntimeGroupPolicy, o as createChannelPairingController, r as resolveDefaultGroupPolicy } from "../../runtime-group-policy-B9qWT5eN.js";
import { t as buildSecretInputSchema } from "../../secret-input-8gKCGpR3.js";
import { a as runSingleChannelSecretStep, i as promptSingleChannelSecretInput, n as buildSingleChannelSecretPromptState, o as setTopLevelChannelDmPolicyWithAllowFrom, r as mergeAllowFromEntries, t as addWildcardAllowFrom } from "../../setup-_i0mgWM5.js";
import { a as WEBHOOK_ANOMALY_COUNTER_DEFAULTS, c as createWebhookAnomalyTracker, i as FixedWindowRateLimiter, n as applyBasicWebhookRequestGuards, o as WEBHOOK_RATE_LIMIT_DEFAULTS, r as readJsonWebhookBodyOrReject, s as createFixedWindowRateLimiter, t as WebhookInFlightLimiter } from "../../webhook-request-guards-COAHWgqN.js";
import { IncomingMessage, ServerResponse } from "node:http";

//#region src/routing/account-id.d.ts
declare const DEFAULT_ACCOUNT_ID = "default";
declare function normalizeAccountId(value: string | undefined | null): string;
//#endregion
//#region src/gateway/net.d.ts
declare function resolveClientIp(params: {
  remoteAddr?: string;
  forwardedFor?: string;
  realIp?: string;
  trustedProxies?: string[]; /** Default false: only trust X-Real-IP when explicitly enabled. */
  allowRealIpFallback?: boolean;
}): string | undefined;
//#endregion
//#region src/plugin-sdk/allow-from.d.ts
/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
declare function formatAllowFromLowercase(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */allowFrom: Array<string | number>; /** Optional prefix remover for channel aliases such as `tg:` or `zalo:`. */
  stripPrefixRe?: RegExp;
}): string[];
/** Check whether a sender id matches a simple normalized allowlist with wildcard support. */
declare function isNormalizedSenderAllowed(params: {
  /** Sender id or handle to compare after string coercion and lowercase normalization. */senderId: string | number; /** Raw allowlist entries; `*` allows every sender. */
  allowFrom: Array<string | number>; /** Optional prefix remover applied to allowlist entries before comparison. */
  stripPrefixRe?: RegExp;
}): boolean;
//#endregion
//#region src/infra/abort-signal.d.ts
/** Resolves when the signal aborts, or immediately when no wait is needed. */
declare function waitForAbortSignal(signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/channels/plugins/pairing-message.d.ts
/**
 * Default approval message sent after channel pairing succeeds.
 */
declare const PAIRING_APPROVED_MESSAGE = "\u2705 OpenClaw access approved. Send a message to start chatting.";
//#endregion
//#region src/plugin-sdk/status-helpers.d.ts
type RuntimeLifecycleSnapshot = {
  linked?: boolean | null;
  running?: boolean | null;
  connected?: boolean | null;
  restartPending?: boolean | null;
  reconnectAttempts?: number | null;
  socketModeConnectionCount?: number | null;
  socketModeConnectionCountObservedAt?: number | null;
  socketModeSharedConnection?: boolean | null;
  lastConnectedAt?: number | null;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | null;
  lastEventAt?: number | null;
  lastTransportActivityAt?: number | null;
  healthState?: string | null;
  lifecycle?: ChannelAccountSnapshot["lifecycle"] | null;
  ingressUnavailable?: true | null;
  terminalDisconnect?: boolean | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
  busy?: boolean | null;
  activeRuns?: number | null;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
};
type StatusSnapshotExtra = Record<string, unknown>;
/** Build the standard per-account status payload from config metadata plus runtime state. */
declare function buildBaseAccountStatusSnapshot<TExtra extends StatusSnapshotExtra>(params: {
  account: {
    accountId: string;
    name?: string;
    enabled?: boolean;
    configured?: boolean;
  };
  runtime?: RuntimeLifecycleSnapshot | null;
  probe?: unknown;
}, extra?: TExtra): {
  lastInboundAt: number | null;
  lastOutboundAt: number | null;
  activeRunStartedAt?: number | undefined;
  lastRunActivityAt?: number | undefined;
  activeRuns?: number | undefined;
  busy?: boolean | undefined;
  terminalDisconnect?: true | undefined;
  ingressUnavailable?: true | undefined;
  lifecycle?: "blocked" | "starting" | "stopped" | "ready" | "recovering" | undefined;
  healthState?: string | undefined;
  lastTransportActivityAt?: number | undefined;
  lastEventAt?: number | undefined;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | undefined;
  lastConnectedAt?: number | undefined;
  socketModeSharedConnection?: boolean | undefined;
  socketModeConnectionCountObservedAt?: number | undefined;
  socketModeConnectionCount?: number | undefined;
  reconnectAttempts?: number | undefined;
  restartPending?: boolean | undefined;
  connected?: boolean | undefined;
  linked?: boolean | undefined;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  probe: unknown;
  accountId: string;
  name: string | undefined;
  enabled: boolean | undefined;
  configured: boolean | undefined;
} & TExtra;
/** Build token-based channel status summaries with optional mode reporting. */
declare function buildTokenChannelStatusSummary(snapshot: {
  configured?: boolean | null;
  tokenSource?: string | null;
  running?: boolean | null;
  mode?: string | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: unknown;
  lastProbeAt?: number | null;
}, opts?: {
  includeMode?: boolean;
}): {
  tokenSource: string;
  probe: unknown;
  lastProbeAt: number | null;
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
} | {
  mode: string | null;
  tokenSource: string;
  probe: unknown;
  lastProbeAt: number | null;
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
};
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
//#region src/plugins/registry.d.ts
type PluginHttpRouteRegistration = PluginHttpRouteRegistration$1 & {
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface;
};
//#endregion
//#region src/plugins/http-registry.d.ts
type PluginHttpRouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean | void> | boolean | void;
declare function registerPluginHttpRoute(params: {
  path?: string | null;
  fallbackPath?: string | null;
  handler: PluginHttpRouteHandler;
  auth: PluginHttpRouteRegistration["auth"];
  match?: PluginHttpRouteRegistration["match"];
  gatewayRuntimeScopeSurface?: PluginHttpRouteRegistration["gatewayRuntimeScopeSurface"]; /** Replace an existing canonical route owned by the same plugin and compatible route source. */
  replaceExisting?: boolean; /** Reuse an existing canonical route only when its nonempty plugin and source owners match. */
  reuseExistingSameOwner?: boolean; /** Throw when the route cannot be registered instead of returning a no-op cleanup. */
  throwOnFailure?: boolean;
  pluginId?: string; /** Stable same-plugin sub-owner for replacement; omit consistently for legacy behavior. */
  source?: string;
  accountId?: string;
  log?: (message: string) => void;
  registry?: PluginRegistry;
}): () => void;
//#endregion
//#region src/plugin-sdk/webhook-targets.d.ts
/** Registration handle returned for one live webhook target. */
type RegisteredWebhookTarget<T> = {
  /** Normalized target stored in the caller-owned path registry. */target: T; /** Idempotently remove this target and run path teardown when it was the last target. */
  unregister: () => void;
};
/** Lifecycle hooks for path-level webhook target registration. */
type RegisterWebhookTargetOptions<T extends {
  path: string;
}> = {
  /** Called before the first target for a normalized path is stored; may return path teardown. */onFirstPathTarget?: (params: {
    path: string;
    target: T;
  }) => void | (() => void); /** Called after the last target for a normalized path has been removed. */
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
  /** Caller-owned normalized path registry shared by all targets for this plugin/runtime. */targetsByPath: Map<string, T[]>; /** Target to normalize, store, and later return from the registration handle. */
  target: T; /** Plugin HTTP route configuration used when the first target for a path is registered. */
  route: RegisterWebhookPluginRouteOptions; /** Optional last-target hook forwarded to `registerWebhookTarget`. */
  onLastPathTargetRemoved?: RegisterWebhookTargetOptions<T>["onLastPathTargetRemoved"];
}): RegisteredWebhookTarget<T>;
/** Add a normalized target to a path bucket and clean up route state when the last target leaves. */
declare function registerWebhookTarget<T extends {
  path: string;
}>(targetsByPath: Map<string, T[]>, target: T, opts?: RegisterWebhookTargetOptions<T>): RegisteredWebhookTarget<T>;
/** Run common webhook guards, then dispatch only when the request path resolves to live targets. */
declare function withResolvedWebhookRequestPipeline<T>(params: {
  /** Incoming HTTP request whose pathname selects the target bucket. */req: IncomingMessage; /** HTTP response used by guard failures before handler dispatch. */
  res: ServerResponse; /** Caller-owned target registry keyed by normalized webhook path. */
  targetsByPath: Map<string, T[]>; /** Allowed methods for the common request guard. */
  allowMethods?: readonly string[]; /** Optional per-key fixed-window limiter shared across requests. */
  rateLimiter?: FixedWindowRateLimiter; /** Explicit rate-limit key; defaults are owned by the request guard. */
  rateLimitKey?: string; /** Clock override for deterministic limiter tests. */
  nowMs?: number; /** Require JSON content type before dispatching to the webhook handler. */
  requireJsonContentType?: boolean; /** Optional in-flight limiter to cap concurrent handling for a key. */
  inFlightLimiter?: WebhookInFlightLimiter; /** Explicit or derived key for concurrent request limiting. */
  inFlightKey?: string | ((args: {
    req: IncomingMessage;
    path: string;
    targets: T[];
  }) => string); /** Status code returned when the in-flight guard rejects. */
  inFlightLimitStatusCode?: number; /** Response body returned when the in-flight guard rejects. */
  inFlightLimitMessage?: string; /** Handler invoked only after target resolution and common guards succeed. */
  handle: (args: {
    path: string;
    targets: T[];
  }) => Promise<boolean | void> | boolean | void;
}): Promise<boolean>;
/** Synchronous variant of webhook auth resolution for cheap in-memory match checks. */
declare function resolveWebhookTargetWithAuthOrRejectSync<T>(params: {
  /** Candidate targets for the already-resolved webhook path. */targets: readonly T[]; /** HTTP response used to send unauthorized or ambiguous failures. */
  res: ServerResponse; /** Synchronous auth or routing predicate; exactly one target must match. */
  isMatch: (target: T) => boolean; /** Status code for no matching target. Defaults to 401. */
  unauthorizedStatusCode?: number; /** Response body for no matching target. */
  unauthorizedMessage?: string; /** Status code for multiple matching targets. Defaults to 401. */
  ambiguousStatusCode?: number; /** Response body for multiple matching targets. */
  ambiguousMessage?: string;
}): T | null;
//#endregion
//#region extensions/zalo/src/runtime.d.ts
declare const setZaloRuntime: (next: PluginRuntime) => void, getZaloRuntime: () => PluginRuntime;
//#endregion
export { type BaseProbeResult, type BaseTokenResolution, type ChannelAccountSnapshot, type ChannelMessageActionAdapter, type ChannelMessageActionName, type ChannelPlugin, type ChannelStatusIssue, DEFAULT_ACCOUNT_ID, type GroupPolicy, type MarkdownTableMode, type OpenClawConfig, type OutboundReplyPayload, PAIRING_APPROVED_MESSAGE, type PluginRuntime, type RegisterWebhookPluginRouteOptions, type RegisterWebhookTargetOptions, type ReplyPayload, type RuntimeEnv, type SecretInput, WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, type WizardPrompter, addWildcardAllowFrom, applyAccountNameToChannelSection, applyBasicWebhookRequestGuards, applySetupAccountConfigPatch, buildBaseAccountStatusSnapshot, buildChannelConfigSchema, buildSecretInputSchema, buildSingleChannelSecretPromptState, buildTokenChannelStatusSummary, chunkTextForOutbound, createChannelReplyPipeline as createChannelMessageReplyPipeline, createChannelPairingController, createDedupeCache, createFixedWindowRateLimiter, createWebhookAnomalyTracker, deliverTextOrMediaReply, formatAllowFromLowercase, formatPairingApproveHint, hasConfiguredSecretInput, isNormalizedSenderAllowed, isNumericTargetId, jsonResult, logTypingFailure, mergeAllowFromEntries, migrateBaseNameToDefaultAccount, normalizeAccountId, normalizeResolvedSecretInputString, normalizeSecretInputString, promptSingleChannelSecretInput, readJsonWebhookBodyOrReject, readToolStringParam as readStringParam, registerPluginHttpRoute, registerWebhookTarget, registerWebhookTargetWithPluginRoute, resolveClientIp, resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, resolveWebhookPath, resolveWebhookTargetWithAuthOrRejectSync, runSingleChannelSecretStep, sendPayloadWithChunkedTextAndMedia, setTopLevelChannelDmPolicyWithAllowFrom, setZaloRuntime, waitForAbortSignal, warnMissingProviderGroupPolicyFallbackOnce, withResolvedWebhookRequestPipeline };