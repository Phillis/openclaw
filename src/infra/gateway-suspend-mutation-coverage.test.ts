import { describe, expect, it } from "vitest";
import {
  GATEWAY_SUSPEND_MODE_DURABLE,
  validateGatewaySuspendPrepareResult,
  validateGatewaySuspendStatusResult,
} from "../../packages/gateway-protocol/src/index.js";
import { GATEWAY_SUSPEND_MUTATION_COVERAGE } from "./gateway-suspend-mutation-coverage.js";

describe("gateway suspension mutation coverage contract", () => {
  it("attests the exact generic mutation surfaces with a stable hash", () => {
    expect(GATEWAY_SUSPEND_MUTATION_COVERAGE).toEqual({
      schema: "openclaw-gateway-suspend-mutation-coverage/v1",
      surfaces: [
        "gateway_admission",
        "scheduler",
        "plugin_rpc_http",
        "task_controller",
        "channel_mutation",
        "provider_effect_admission",
        "legacy_state_writers",
      ],
      enforcement: {
        rootAdmission: "process-wide-refuse-and-drain",
        scheduler: "pause-before-idle-proof",
        durableHandoff: "private-single-link-cas",
        startupAdoption: "before-request-cron-task-roots",
        release: "explicit-non-reusable-authority",
      },
      coverageHash: "63f9811d2c999cc4844609c0bddab1f33b3ee4751931e7c0d7c71d652e70faf3",
    });
  });

  it("requires the coverage attestation on every ready prepare and status result", () => {
    const prepared = {
      status: "ready",
      suspensionId: "suspension",
      gatewayInstanceId: "gateway",
      gatewayPid: 42,
      launchdRunCount: 3,
      expiresAtMs: 1000,
      suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
      activeCount: 0,
      blockers: [],
      mutationCoverage: GATEWAY_SUSPEND_MUTATION_COVERAGE,
    };
    const status = {
      status: "ready",
      gatewayInstanceId: "gateway",
      expiresAtMs: 1000,
      suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
      mutationCoverage: GATEWAY_SUSPEND_MUTATION_COVERAGE,
    };
    expect(validateGatewaySuspendPrepareResult(prepared)).toBe(true);
    expect(validateGatewaySuspendPrepareResult({ ...prepared, mutationCoverage: undefined })).toBe(
      false,
    );
    expect(validateGatewaySuspendStatusResult(status)).toBe(true);
    expect(validateGatewaySuspendStatusResult({ ...status, mutationCoverage: undefined })).toBe(
      false,
    );
  });
});
