// Known chat-send admission errors with a dedicated retry/response contract.
// Extracted from chat-send-admission.ts to keep that module within the oxlint
// max-lines budget (fork refactor of upstream layout; behavior unchanged).
import { ErrorCodes, errorShape } from "../../../packages/gateway-protocol/src/index.js";
import { SESSION_ROUTING_CHANGED_ERROR_REASON } from "../../config/sessions/main-session.js";
import { SESSION_ROTATION_CHANGED_ERROR_REASON } from "../../sessions/session-rotation.js";
import {
  ACTIVE_LEAF_CHANGED_ERROR_REASON,
  respondChatSessionRoutingChanged,
} from "./chat-send-pre-admission.js";
import { SESSION_SETTINGS_CHANGED_ERROR_REASON } from "./chat-send-session-settings.js";
import type { GatewayRequestHandlerOptions } from "./types.js";

export type KnownChatSendErrorOutcome = { ok: false; retryAfterRotation: true } | { ok: false };

/**
 * Match an admission error carrying a dedicated retry/response contract,
 * perform that response, and return the admission result. Returns undefined
 * for unrecognized errors (the caller falls through to the generic shape).
 */
export function respondKnownChatSendError(
  err: unknown,
  respond: GatewayRequestHandlerOptions["respond"],
): KnownChatSendErrorOutcome | undefined {
  if (!(err instanceof Error)) {
    return undefined;
  }
  switch (err.message) {
    case SESSION_ROUTING_CHANGED_ERROR_REASON:
      respondChatSessionRoutingChanged(respond);
      return { ok: false };
    case ACTIVE_LEAF_CHANGED_ERROR_REASON:
      // 2026.9.2: upstream folded respondChatActiveLeafChanged into
      // respondChatSendAdmissionError; keep the exact response shape here.
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "active branch changed; review and retry", {
          details: { reason: ACTIVE_LEAF_CHANGED_ERROR_REASON },
        }),
      );
      return { ok: false };
    case SESSION_ROTATION_CHANGED_ERROR_REASON:
      // Mid-queue capture across an epoch boundary: the orchestrator re-resolves
      // the current epoch once and re-admits on the new key (no response yet).
      return { ok: false, retryAfterRotation: true };
    case SESSION_SETTINGS_CHANGED_ERROR_REASON:
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "Session settings changed before send. Retry.", {
          details: { reason: SESSION_SETTINGS_CHANGED_ERROR_REASON },
        }),
      );
      return { ok: false };
    default:
      return undefined;
  }
}
