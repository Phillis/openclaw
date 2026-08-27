import { a as ExecApprovalRequest, s as ExecApprovalResolved } from "./exec-approvals-core-ByvfWxmW.js";
import { f as ExecApprovalChannelRuntime, p as ExecApprovalChannelRuntimeAdapter } from "./approval-handler-runtime-types-BZ-ScdGo.js";
import { c as PluginApprovalRequest, u as PluginApprovalResolved } from "./plugin-approvals-Dx9uGZHC.js";
import { a as GatewayReconnectPausedInfo } from "./client-4Iumulij.js";

//#region src/infra/exec-approval-channel-runtime.d.ts
type ApprovalRequestEvent = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolvedEvent = ExecApprovalResolved | PluginApprovalResolved;
/** Error raised when the gateway pauses approval reconnects after a terminal startup failure. */
declare class ExecApprovalChannelRuntimeTerminalStartError extends Error {
  readonly detailCode: string | null;
  constructor(info: GatewayReconnectPausedInfo, cause?: unknown);
}
/** Narrows terminal approval runtime startup failures for bootstrap retry policy. */
declare function isExecApprovalChannelRuntimeTerminalStartError(error: unknown): error is ExecApprovalChannelRuntimeTerminalStartError;
/** Creates the gateway-backed approval runtime that tracks pending requests and finalization. */
declare function createExecApprovalChannelRuntime<TPending, TRequest extends ApprovalRequestEvent = ExecApprovalRequest, TResolved extends ApprovalResolvedEvent = ExecApprovalResolved>(adapter: ExecApprovalChannelRuntimeAdapter<TPending, TRequest, TResolved>): ExecApprovalChannelRuntime<TRequest, TResolved>;
//#endregion
export { createExecApprovalChannelRuntime as n, isExecApprovalChannelRuntimeTerminalStartError as r, ExecApprovalChannelRuntimeTerminalStartError as t };