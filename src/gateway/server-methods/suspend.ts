// Gateway RPC handlers for cooperative, host-neutral process suspension.
import {
  ErrorCodes,
  errorShape,
  validateGatewaySuspendPrepareParams,
  validateGatewaySuspendResumeParams,
  validateGatewaySuspendStatusParams,
} from "../../../packages/gateway-protocol/src/index.js";
import {
  getGatewaySuspendStatus,
  prepareGatewaySuspend,
  resolveGatewaySuspendHandoffPath,
  resumeGatewaySuspend,
} from "../../infra/gateway-suspend-coordinator.js";
import { createGatewayServerActiveWorkInspectors } from "../server-active-work.js";
import type { GatewayRequestHandlers } from "./types.js";

function invalidParams(method: string) {
  return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params`);
}

function schedulerRecoveryError(retryAfterMs: number) {
  return errorShape(ErrorCodes.UNAVAILABLE, "gateway scheduler recovery is pending", {
    retryable: true,
    retryAfterMs,
    details: { reason: "scheduler-resume-failed" },
  });
}

export const suspendHandlers: GatewayRequestHandlers = {
  "gateway.suspend.prepare": async ({ respond, params, context }) => {
    if (!validateGatewaySuspendPrepareParams(params)) {
      respond(false, undefined, invalidParams("gateway.suspend.prepare"));
      return;
    }
    const requestId = params.requestId.trim();
    const result = prepareGatewaySuspend({
      requestId,
      suspensionId: params.suspensionId?.trim(),
      gatewayInstanceId: params.gatewayInstanceId?.trim(),
      gatewayPid: params.gatewayPid,
      launchdRunCount: params.launchdRunCount,
      currentGatewayPid: process.pid,
      pauseScheduling: () => context.cron.pauseScheduling(),
      resumeScheduling: () => context.cron.resumeScheduling(),
      inspect: createGatewayServerActiveWorkInspectors(context),
      warn: (message) => context.logGateway.warn(message),
      durableHandoffPath: resolveGatewaySuspendHandoffPath(),
    });
    if (result.status === "conflict") {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.UNAVAILABLE, "another gateway suspension is already prepared", {
          retryable: true,
          retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
          details: { reason: "gateway-suspension-conflict", expiresAtMs: result.expiresAtMs },
        }),
      );
      return;
    }
    if (result.status === "process-mismatch") {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "gateway process incarnation does not match"),
      );
      return;
    }
    if (result.status === "recovering") {
      respond(false, undefined, schedulerRecoveryError(result.retryAfterMs));
      return;
    }
    respond(true, result);
  },
  "gateway.suspend.status": async ({ respond, params }) => {
    if (!validateGatewaySuspendStatusParams(params)) {
      respond(false, undefined, invalidParams("gateway.suspend.status"));
      return;
    }
    const result = getGatewaySuspendStatus({
      suspensionId: params.suspensionId.trim(),
      gatewayInstanceId: params.gatewayInstanceId.trim(),
    });
    if (result.status === "conflict") {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.UNAVAILABLE, "a different gateway suspension is prepared", {
          retryable: true,
          retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
          details: { reason: "gateway-suspension-conflict", expiresAtMs: result.expiresAtMs },
        }),
      );
      return;
    }
    if (result.status === "recovering") {
      respond(false, undefined, schedulerRecoveryError(result.retryAfterMs));
      return;
    }
    if (result.status === "process-mismatch") {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "gateway process incarnation does not match"),
      );
      return;
    }
    respond(true, result);
  },
  "gateway.suspend.resume": async ({ respond, params }) => {
    if (!validateGatewaySuspendResumeParams(params)) {
      respond(false, undefined, invalidParams("gateway.suspend.resume"));
      return;
    }
    const result = resumeGatewaySuspend({
      suspensionId: params.suspensionId.trim(),
      gatewayInstanceId: params.gatewayInstanceId.trim(),
      resumeBeforeMs: params.resumeBeforeMs,
    });
    if (!result.ok) {
      if (result.reason === "scheduler-resume-failed") {
        respond(false, undefined, schedulerRecoveryError(result.retryAfterMs));
        return;
      }
      if (result.reason === "process-mismatch") {
        respond(
          false,
          undefined,
          errorShape(ErrorCodes.INVALID_REQUEST, "gateway process incarnation does not match"),
        );
        return;
      }
      if (result.reason === "resume-authority-expired") {
        respond(
          false,
          undefined,
          errorShape(ErrorCodes.INVALID_REQUEST, "gateway resume authority expired"),
        );
        return;
      }
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "gateway suspension id does not match"),
      );
      return;
    }
    respond(true, result);
  },
};
