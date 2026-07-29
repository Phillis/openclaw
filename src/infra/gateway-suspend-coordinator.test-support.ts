import type { GatewaySuspendMode } from "../../packages/gateway-protocol/src/index.js";
import {
  getGatewaySuspendStatus as getGatewaySuspendStatusWithIdentity,
  prepareGatewaySuspend as prepareGatewaySuspendWithIdentity,
  resumeGatewaySuspend as resumeGatewaySuspendWithIdentity,
} from "./gateway-suspend-coordinator.js";

type PrepareParams = Parameters<typeof prepareGatewaySuspendWithIdentity>[0];
type GatewaySuspendTestApi = { getGatewayInstanceId(): string };

function getGatewayInstanceId(): string {
  const api = (globalThis as Record<PropertyKey, unknown>)[
    Symbol.for("openclaw.gatewaySuspendTestApi")
  ] as GatewaySuspendTestApi;
  return api.getGatewayInstanceId();
}

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
  const currentGatewayInstanceId = getGatewayInstanceId();
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
  const gatewayInstanceId = getGatewayInstanceId();
  return omitGatewayInstance(
    getGatewaySuspendStatusWithIdentity(
      { suspensionId, gatewayInstanceId, suspendMode },
      gatewayInstanceId,
    ),
  );
}

export function resumeTestGatewaySuspend(suspensionId: string, suspendMode?: GatewaySuspendMode) {
  const gatewayInstanceId = getGatewayInstanceId();
  const status = getGatewaySuspendStatusWithIdentity(
    { suspensionId, gatewayInstanceId, suspendMode },
    gatewayInstanceId,
  );
  const resumeBeforeMs = "expiresAtMs" in status ? status.expiresAtMs : Number.MAX_SAFE_INTEGER;
  return omitGatewayInstance(
    resumeGatewaySuspendWithIdentity(
      { suspensionId, gatewayInstanceId, resumeBeforeMs, suspendMode },
      gatewayInstanceId,
      () => resumeBeforeMs - 1,
    ),
  );
}
