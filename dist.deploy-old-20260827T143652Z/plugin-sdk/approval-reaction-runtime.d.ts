import { y as MessagePresentation } from "../types-CoqV37wL.js";
import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { D as ChannelOutboundPayloadHint, L as ApprovalRequest, R as PendingApprovalView } from "../types.adapters-BQbR8pan.js";
import { t as ExecApprovalDecision } from "../exec-approvals-core-CYhVMCan.js";
import { t as ReplyPayload } from "../model-selection-D3tdqdDP.js";
//#region src/infra/exec-approval-reply.d.ts
type ExecApprovalReplyDecision = ExecApprovalDecision;
type ExecApprovalReplyMetadata = {
  approvalId: string;
  approvalSlug: string;
  approvalKind: "exec" | "plugin";
  agentId?: string;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  sessionKey?: string;
};
//#endregion
//#region src/plugin-sdk/approval-native-helpers.d.ts
type LocalNativeExecApprovalConfig = {
  enabled?: boolean | "auto";
  mode?: string | null;
  agentFilter?: string[];
  sessionFilter?: string[];
};
/** Decide whether a channel-native exec approval route replaces the local text prompt. */
declare function shouldSuppressLocalNativeExecApprovalPrompt(params: {
  /** Full config containing top-level or channel-specific approval settings. */cfg: OpenClawConfig; /** Optional channel account id for account-scoped native delivery checks. */
  accountId?: string | null; /** Reply payload that may already contain exec approval metadata. */
  payload: ReplyPayload; /** Outbound payload hint proving an active native exec approval route. */
  hint?: ChannelOutboundPayloadHint; /** Legacy transport gate for native delivery. */
  isTransportEnabled?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean; /** Preferred transport gate for native delivery. */
  isNativeDeliveryEnabled?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean; /** Optional channel-specific approval config resolver. */
  resolveApprovalConfig?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    metadata: ExecApprovalReplyMetadata;
  }) => LocalNativeExecApprovalConfig | undefined; /** Whether the resolved approval config must be enabled before suppressing local prompt. */
  requireApprovalConfigEnabled?: boolean; /** Whether forwarding mode must be session/both unless exact target proof is present. */
  enforceForwardingMode?: boolean; /** Optional session-route gate for the approval metadata. */
  isSessionRouteEligible?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    metadata: ExecApprovalReplyMetadata;
  }) => boolean; /** Proof that target-mode forwarding already matched this exact native target. */
  hasExactTargetProof?: boolean; /** Whether agent filters may fall back to the agent segment in sessionKey. */
  fallbackAgentIdFromSessionKey?: boolean;
}): boolean;
//#endregion
//#region src/plugin-sdk/approval-reaction-binding.d.ts
type ApprovalKind$1 = "exec" | "plugin";
/** Validated identity and decisions shared by typed approval delivery surfaces. */
type ApprovalReactionDeliveryBinding = {
  approvalId: string;
  approvalKind: ApprovalKind$1;
  allowedDecisions: ExecApprovalReplyDecision[];
  approvalSlug?: string;
};
/** Read a nonempty, duplicate-free list without accepting unrecognized decisions. */
declare function readApprovalReactionDecisionList(value: unknown): ExecApprovalReplyDecision[] | null;
/** Normalize the shipped approval command spelling without accepting other decisions. */
declare function normalizeApprovalReactionDecision(value: string): ExecApprovalReplyDecision | null;
/** Read only canonical approval prompts; unrelated `/approve` help must never gain controls. */
declare function extractApprovalReactionPromptBinding(params: {
  text: string;
  approvalKind?: ApprovalKind$1;
  replyInstructionOnly?: boolean;
}): ApprovalReactionDeliveryBinding | null;
/** Compare approved decision sets independently of presentation order. */
declare function approvalReactionDecisionSetsMatch(left: readonly ExecApprovalReplyDecision[], right: readonly ExecApprovalReplyDecision[]): boolean;
/** Validate canonical approval metadata without inferring its owner from text. */
declare function readApprovalReactionDeliveryMetadata(payload: ReplyPayload, options?: {
  requireApprovalSlug?: boolean;
  trimApprovalId?: boolean;
}): ApprovalReactionDeliveryBinding | null;
/** Verify that typed presentation controls exactly match authoritative approval metadata. */
declare function readApprovalReactionPresentationBinding(params: {
  payload: ReplyPayload;
  presentation?: MessagePresentation;
  requireApprovalSlug?: boolean;
  trimApprovalId?: boolean;
}): ApprovalReactionDeliveryBinding | null;
/** Revalidate the private delivery marker against canonical typed approval metadata. */
declare function readApprovalReactionDeliveredBinding(params: {
  payload: ReplyPayload;
  channelDataKey: string;
  requireApprovalSlug?: boolean;
  trimApprovalId?: boolean;
}): ApprovalReactionDeliveryBinding | null;
//#endregion
//#region src/plugin-sdk/approval-reaction-runtime.d.ts
type ApprovalKind = "exec" | "plugin";
type KeyedStore<TValue> = {
  register(key: string, value: TValue, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  lookup(key: string): Promise<TValue | undefined>;
  delete(key: string): Promise<boolean>;
};
type PersistedApprovalReactionTarget<TTarget> = {
  version: 1;
  target: TTarget;
};
/** In-memory or backed store for approval targets awaiting reaction decisions. */
type ApprovalReactionTargetStore<TTarget> = {
  register(key: string, target: TTarget, opts?: {
    ttlMs?: number;
  }): void;
  lookup(key: string): Promise<TTarget | null>;
  delete(key: string): void;
  clearForTest(): void;
};
/** Product-ordered emoji binding for one approval decision. */
type ApprovalReactionDecisionBinding = {
  decision: ExecApprovalReplyDecision;
  emoji: string;
  label: string;
};
/** Normalized reaction decision resolved from a channel reaction key. */
type ApprovalReactionDecisionResolution = {
  decision: ExecApprovalReplyDecision;
  normalizedEmoji: string;
};
/** Stored target metadata needed to convert a reaction into an approval decision. */
type ApprovalReactionTargetRecord<TRoute = unknown> = {
  approvalId: string; /** Explicit ownership; omission is supported only by the deprecated resolver. */
  approvalKind?: ApprovalKind;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
  route?: TRoute;
  expiresAtMs?: number;
};
/** Resolved approval target and decision produced from a reaction event. */
type ApprovalReactionTargetResolution<TRoute = unknown> = ApprovalReactionDecisionResolution & {
  approvalId: string;
  approvalKind: ApprovalKind;
  route?: TRoute;
};
/** Reply payload enriched with reaction decision metadata. */
type ApprovalReactionPromptPayload = ReplyPayload & {
  allowedDecisions: readonly ExecApprovalReplyDecision[];
  reactionBindings: readonly ApprovalReactionDecisionBinding[];
};
/** Pair of reaction-enabled and manual-fallback approval prompt payloads. */
type ApprovalReactionPendingContent = {
  reactionPayload: ApprovalReactionPromptPayload;
  manualFallbackPayload: ReplyPayload;
};
/** Canonical reaction controls shown for approval prompts, in product display order. */
declare const APPROVAL_REACTION_BINDINGS: readonly [{
  readonly decision: "allow-once";
  readonly emoji: "👍";
  readonly label: "Allow Once";
}, {
  readonly decision: "allow-always";
  readonly emoji: "♾️";
  readonly label: "Allow Always";
}, {
  readonly decision: "deny";
  readonly emoji: "👎";
  readonly label: "Deny";
}];
/** List the canonical reaction bindings allowed for a specific approval request. */
declare function listApprovalReactionBindings(params: {
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): ApprovalReactionDecisionBinding[];
/** Build user-facing reaction instructions, or null when no reaction decisions are allowed. */
declare function buildApprovalReactionHint(params: {
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): string | null;
/** True when approval prompt text already carries a reaction hint block. */
declare function hasApprovalReactionHintText(text?: string | null): boolean;
/** Inserts a reaction hint after the `ID: <id>` header line, else prepends it. */
declare function insertApprovalReactionHintNearIdHeader(params: {
  text: string;
  hint: string;
}): string;
/** Adds the canonical reaction hint to approval prompt text unless one is present. */
declare function addApprovalReactionHintToText(params: {
  text: string;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): string;
/** Normalize reaction emoji so skin-tone and text/presentation variants match canonical bindings. */
declare function normalizeApprovalReactionEmoji(reactionKey: string): string;
/** Resolve a reaction key to an allowed approval decision. */
declare function resolveApprovalReactionDecision(params: {
  reactionKey: string;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): ApprovalReactionDecisionResolution | null;
/** Resolve an explicitly typed target without deriving ownership from its id. */
declare function resolveTypedApprovalReactionTarget<TRoute = unknown>(params: {
  target: (ApprovalReactionTargetRecord<TRoute> & {
    approvalKind: ApprovalKind;
  }) | null | undefined;
  reactionKey: string;
}): ApprovalReactionTargetResolution<TRoute> | null;
/** Build an approval prompt payload with reaction bindings for a prepared view. */
declare function buildApprovalPendingPromptPayload(params: {
  request: ApprovalRequest;
  view: PendingApprovalView;
  nowMs: number;
}): ApprovalReactionPromptPayload;
/** Build an approval prompt payload with reaction bindings directly from a request. */
declare function buildApprovalReactionPromptPayloadForRequest(params: {
  request: ApprovalRequest;
  nowMs: number;
}): ApprovalReactionPromptPayload;
/** Build reaction and manual-fallback pending approval content for a prepared view. */
declare function buildApprovalReactionPendingContent(params: {
  request: ApprovalRequest;
  view: PendingApprovalView;
  nowMs: number;
}): ApprovalReactionPendingContent;
/**
 * Prompt copy for channels whose native controls (Apple Messages polls, inline
 * buttons) own the decision surface. Same bold headers and labels as the
 * reaction prompt (#85954) minus the tapback hint, which would advertise a
 * second, redundant control path next to the native one.
 */
declare function buildApprovalNativeControlsPromptText(params: {
  view: PendingApprovalView;
  nowMs: number;
}): string;
/** Build reaction and manual-fallback pending approval content directly from a request. */
declare function buildApprovalReactionPendingContentForRequest(params: {
  request: ApprovalRequest;
  nowMs: number;
}): ApprovalReactionPendingContent;
/** Create an approval target store backed by memory with optional persistent storage. */
declare function createApprovalReactionTargetStore<TTarget>(params: {
  namespace: string;
  maxEntries: number;
  defaultTtlMs: number;
  openStore?: (params: {
    namespace: string;
    maxEntries: number;
    defaultTtlMs: number;
  }) => KeyedStore<PersistedApprovalReactionTarget<TTarget>> | undefined;
  logPersistentError?: (error: unknown) => void;
  readPersistedTarget?: (target: unknown) => TTarget | null;
  nowMs?: () => number;
}): ApprovalReactionTargetStore<TTarget>;
//#endregion
export { APPROVAL_REACTION_BINDINGS, ApprovalReactionDecisionBinding, ApprovalReactionDecisionResolution, type ApprovalReactionDeliveryBinding, ApprovalReactionPendingContent, ApprovalReactionPromptPayload, ApprovalReactionTargetRecord, ApprovalReactionTargetResolution, ApprovalReactionTargetStore, addApprovalReactionHintToText, approvalReactionDecisionSetsMatch, buildApprovalNativeControlsPromptText, buildApprovalPendingPromptPayload, buildApprovalReactionHint, buildApprovalReactionPendingContent, buildApprovalReactionPendingContentForRequest, buildApprovalReactionPromptPayloadForRequest, createApprovalReactionTargetStore, extractApprovalReactionPromptBinding, hasApprovalReactionHintText, insertApprovalReactionHintNearIdHeader, listApprovalReactionBindings, normalizeApprovalReactionDecision, normalizeApprovalReactionEmoji, readApprovalReactionDecisionList, readApprovalReactionDeliveredBinding, readApprovalReactionDeliveryMetadata, readApprovalReactionPresentationBinding, resolveApprovalReactionDecision, resolveTypedApprovalReactionTarget, shouldSuppressLocalNativeExecApprovalPrompt };