import { createHash } from "node:crypto";
import type { GatewaySuspendMode } from "../../packages/gateway-protocol/src/index.js";
import { GATEWAY_SUSPEND_MODE_DURABLE } from "../../packages/gateway-protocol/src/index.js";
import { getGatewayProcessInstanceId } from "../gateway/process-instance.js";
import {
  getGatewaySuspendStatus as getGatewaySuspendStatusWithIdentity,
  prepareGatewaySuspend as prepareGatewaySuspendWithIdentity,
  resumeGatewaySuspend as resumeGatewaySuspendWithIdentity,
} from "./gateway-suspend-coordinator.js";

type PrepareParams = Parameters<typeof prepareGatewaySuspendWithIdentity>[0];

function omitGatewayInstance<T extends object>(result: T) {
  if (!("gatewayInstanceId" in result)) {
    return result;
  }
  const { gatewayInstanceId: _gatewayInstanceId, ...rest } = result;
  return rest;
}

export function prepareTestGatewaySuspend(
  params: Omit<PrepareParams, "gatewayPid" | "launchdRunCount"> &
    Partial<Pick<PrepareParams, "gatewayPid" | "launchdRunCount">>,
) {
  const currentGatewayInstanceId = getGatewayProcessInstanceId();
  return prepareGatewaySuspendWithIdentity({
    gatewayPid: process.pid,
    launchdRunCount: 1,
    currentGatewayInstanceId,
    ...params,
  });
}

export function getTestGatewaySuspendStatus(
  suspensionId: string,
  suspendMode?: GatewaySuspendMode,
) {
  const gatewayInstanceId = getGatewayProcessInstanceId();
  return omitGatewayInstance(
    getGatewaySuspendStatusWithIdentity(
      { suspensionId, gatewayInstanceId, suspendMode },
      gatewayInstanceId,
    ),
  );
}

export function resumeTestGatewaySuspend(suspensionId: string, suspendMode?: GatewaySuspendMode) {
  const gatewayInstanceId = getGatewayProcessInstanceId();
  const status = getGatewaySuspendStatusWithIdentity(
    { suspensionId, gatewayInstanceId, suspendMode },
    gatewayInstanceId,
  );
  const resumeBeforeMs = "expiresAtMs" in status ? status.expiresAtMs : Number.MAX_SAFE_INTEGER;
  const params =
    suspendMode === GATEWAY_SUSPEND_MODE_DURABLE
      ? (() => {
          const releaseAuthoritySha256 = createHash("sha256")
            .update(`test-release:${suspensionId}`, "utf8")
            .digest("hex");
          return {
            suspensionId,
            gatewayInstanceId,
            resumeBeforeMs,
            suspendMode,
            releaseRequestId: `handoff-v2-release:${releaseAuthoritySha256.slice(0, 32)}`,
            releaseAuthoritySha256,
          };
        })()
      : { suspensionId, gatewayInstanceId, resumeBeforeMs, suspendMode };
  return omitGatewayInstance(
    resumeGatewaySuspendWithIdentity(params, gatewayInstanceId, () => resumeBeforeMs - 1),
  );
}
