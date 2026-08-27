import { i as PlatformMessageNotDispatchedError } from "../deliver-types-9ETNkFfw.js";
import { i as toStringifiedError, r as toErrorObject, t as coerceErrorMessage } from "../error-coercion--yphJjqt.js";
import { a as readErrorName, i as formatUncaughtError, n as extractErrorCode, r as formatErrorMessage, t as collectErrorGraphCandidates } from "../errors-Dxvo_HjC.js";

//#region src/infra/approval-errors.d.ts
/**
 * Detects approval-not-found failures across gateway error shapes.
 * Kept broad enough for legacy message-only errors emitted before structured codes.
 */
declare function isApprovalNotFoundError(err: unknown): boolean;
//#endregion
//#region src/plugin-sdk/error-runtime.d.ts
/** Stable error code for subagent APIs called outside an authenticated gateway request. */
declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Default message paired with `SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE`. */
declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE = "Plugin runtime subagent methods are only available during a gateway request.";
/** Error thrown when request-scoped plugin runtime APIs are used outside their scope. */
declare class RequestScopedSubagentRuntimeError extends Error {
  code: string;
  constructor(message?: string);
}
//#endregion
export { PlatformMessageNotDispatchedError, RequestScopedSubagentRuntimeError, SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE, SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE, coerceErrorMessage, collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, formatUncaughtError, isApprovalNotFoundError, readErrorName, toErrorObject, toStringifiedError };