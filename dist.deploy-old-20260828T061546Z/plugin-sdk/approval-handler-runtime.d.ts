import { r as OpenClawConfig } from "../types.openclaw-CflOMr0r.js";
import { d as PluginApprovalRequest, dt as ExecApprovalRequest, n as ChannelApprovalKind, p as PluginApprovalResolved, pt as ExecApprovalResolved } from "../approval-types-CE7E0Chc.js";
import { r as ChannelApprovalCapability } from "../types.adapters-BTze_x-2.js";
import { A as ChannelApprovalNativeAdapter, C as ResolvedApprovalView, S as PluginApprovalResolvedView, T as ChannelNativeApprovalTransportSpec, _ as ExecApprovalResolvedView, a as ChannelApprovalNativeFinalAction, b as PluginApprovalExpiredView, c as ChannelApprovalNativePresentationAdapter, d as ChannelApprovalNativeTransportAdapter, f as ApprovalActionView, g as ExecApprovalPendingView, h as ExecApprovalExpiredView, i as ChannelApprovalNativeAvailabilityAdapter, l as ChannelApprovalNativeRuntimeAdapter, m as ApprovalViewModel, n as ApprovalResolved$1, o as ChannelApprovalNativeInteractionAdapter, p as ApprovalMetadataView, r as ChannelApprovalCapabilityHandlerContext, s as ChannelApprovalNativeObserveAdapter, t as ApprovalRequest$1, u as ChannelApprovalNativeRuntimeSpec, v as ExpiredApprovalView, w as ChannelNativeApprovalDeliveryCallbacks, x as PluginApprovalPendingView, y as PendingApprovalView } from "../approval-handler-runtime-types-D_xrhPpo.js";
import { t as resolveApprovalOverGateway } from "../approval-gateway-runtime-CW1Kh5OM.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter, t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "../approval-handler-adapter-runtime-_Ch4MmXR.js";
import { i as ExecApprovalChannelRuntime } from "../exec-approval-channel-runtime-imE234At.js";
//#region src/infra/approval-handler-runtime.d.ts
type ChannelApprovalHandler<TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1> = ExecApprovalChannelRuntime<TRequest, TResolved>;
/** Adapts a strongly typed channel native approval spec into the erased runtime contract. */
declare function createChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView, TResolvedView extends ResolvedApprovalView = ResolvedApprovalView, TExpiredView extends ExpiredApprovalView = ExpiredApprovalView>(spec: ChannelApprovalNativeRuntimeSpec<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload, TPendingView, TResolvedView, TExpiredView>): ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>;
type ChannelApprovalHandlerRuntimeSpec<TRequest extends ApprovalRequest$1> = {
  label: string;
  clientDisplayName: string;
  cfg: OpenClawConfig;
  gatewayUrl?: string;
  eventKinds?: readonly ChannelApprovalKind[];
  channel?: string;
  channelLabel?: string;
  accountId?: string | null;
  nativeAdapter?: ChannelApprovalNativeAdapter | null;
  /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */
  resolveApprovalKind?: (request: TRequest) => ChannelApprovalKind;
  isConfigured: () => boolean;
  shouldHandle: (request: TRequest) => boolean;
  nowMs?: () => number;
};
type ChannelApprovalHandlerContentSpec<TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1> = {
  buildPendingContent: (params: {
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    nowMs: number;
  }) => TPendingContent | Promise<TPendingContent>;
};
type ChannelApprovalHandlerTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1> = ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest>;
type ChannelApprovalHandlerLifecycleSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1> = ChannelNativeApprovalDeliveryCallbacks<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> & {
  finalizeResolved: (params: {
    request: TRequest;
    resolved: TResolved;
    entries: TPendingEntry[];
  }) => Promise<void>;
  finalizeExpired?: (params: {
    request: TRequest;
    entries: TPendingEntry[];
  }) => Promise<void>;
  onStopped?: () => Promise<void> | void;
};
/** Adapter contract used by core to run a channel's native approval delivery lifecycle. */
type ChannelApprovalHandlerAdapter<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1> = {
  runtime: ChannelApprovalHandlerRuntimeSpec<TRequest>;
  content: ChannelApprovalHandlerContentSpec<TPendingContent, TRequest>;
  transport: ChannelApprovalHandlerTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest>;
  lifecycle: ChannelApprovalHandlerLifecycleSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest, TResolved>;
};
/** Creates the shared approval handler runtime from channel-specific content and transport hooks. */
declare function createChannelApprovalHandler<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1>(adapter: ChannelApprovalHandlerAdapter<TPendingEntry, TPreparedTarget, TPendingContent, TRequest, TResolved>): ChannelApprovalHandler<TRequest, TResolved>;
/** Builds a shared approval handler from a plugin approval capability, or null when unsupported. */
declare function createChannelApprovalHandlerFromCapability(params: {
  capability?: Pick<ChannelApprovalCapability, "native" | "nativeRuntime"> | null;
  label: string;
  clientDisplayName: string;
  channel: string;
  channelLabel: string;
  cfg: OpenClawConfig;
  accountId?: string | null;
  gatewayUrl?: string;
  context?: unknown;
  nowMs?: () => number;
}): Promise<ChannelApprovalHandler | null>;
//#endregion
//#region src/plugin-sdk/approval-handler-runtime.d.ts
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
/** Builds channel-visible resolved approval text for exec and plugin approvals. */
declare function buildChannelApprovalResolvedText(params: {
  request: ApprovalRequest;
  resolved: ApprovalResolved;
  view: ResolvedApprovalView;
}): string;
/** Builds channel-visible expiration text for exec and plugin approvals. */
declare function buildChannelApprovalExpiredText(params: {
  request: ApprovalRequest;
  view: ExpiredApprovalView;
}): string;
/** Resolves the account id prepared for approval routing with planned/context fallback order. */
declare function resolvePreparedApprovalAccountId(params: {
  plannedAccountId?: string | null;
  contextAccountId?: string | null;
  fallbackAccountId: string;
}): string;
/** Resolve prepared approval account id when every source may be missing. */
declare function resolvePreparedApprovalAccountId(params: {
  plannedAccountId?: string | null;
  contextAccountId?: string | null;
  fallbackAccountId?: string | null;
}): string | undefined;
//#endregion
export { type ApprovalActionView, type ApprovalMetadataView, type ApprovalViewModel, CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY, type ChannelApprovalCapabilityHandlerContext, type ChannelApprovalHandler, type ChannelApprovalHandlerAdapter, type ChannelApprovalKind, type ChannelApprovalNativeAvailabilityAdapter, type ChannelApprovalNativeFinalAction, type ChannelApprovalNativeInteractionAdapter, type ChannelApprovalNativeObserveAdapter, type ChannelApprovalNativePresentationAdapter, type ChannelApprovalNativeRuntimeAdapter, type ChannelApprovalNativeRuntimeSpec, type ChannelApprovalNativeTransportAdapter, type ExecApprovalExpiredView, type ExecApprovalPendingView, type ExecApprovalResolvedView, type ExpiredApprovalView, type PendingApprovalView, type PluginApprovalExpiredView, type PluginApprovalPendingView, type PluginApprovalResolvedView, type ResolvedApprovalView, buildChannelApprovalExpiredText, buildChannelApprovalResolvedText, createChannelApprovalHandler, createChannelApprovalHandlerFromCapability, createChannelApprovalNativeRuntimeAdapter, createLazyChannelApprovalNativeRuntimeAdapter, resolveApprovalOverGateway, resolvePreparedApprovalAccountId };