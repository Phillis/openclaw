import { describe, expect, it } from "vitest";
import {
  validateGatewaySuspendPrepareParams,
  validateGatewaySuspendResumeParams,
  validateGatewaySuspendStatusParams,
} from "./index.js";

describe("gateway suspension protocol", () => {
  it("keeps prepare params closed and bounded", () => {
    expect(
      validateGatewaySuspendPrepareParams({
        requestId: "host-request",
        gatewayPid: 100,
        launchdRunCount: 1,
      }),
    ).toBe(true);
    expect(
      validateGatewaySuspendPrepareParams({
        requestId: "host-request",
        suspensionId: "suspension-1",
        gatewayInstanceId: "gateway-instance-1",
        gatewayPid: 100,
        launchdRunCount: 1,
        suspendMode: "handoff-durable-hold/v1",
      }),
    ).toBe(true);
    expect(
      validateGatewaySuspendPrepareParams({
        requestId: "host-request",
        suspensionId: "   ",
        gatewayPid: 100,
        launchdRunCount: 1,
      }),
    ).toBe(false);
    expect(
      validateGatewaySuspendPrepareParams({
        requestId: "   ",
        gatewayPid: 100,
        launchdRunCount: 1,
      }),
    ).toBe(false);
    expect(
      validateGatewaySuspendPrepareParams({
        requestId: "host-request",
        gatewayPid: 100,
        launchdRunCount: 1,
        suspendMode: "unknown/v1",
      }),
    ).toBe(false);
    expect(
      validateGatewaySuspendPrepareParams({
        requestId: "host-request",
        gatewayPid: 100,
        launchdRunCount: 1,
        extra: true,
      }),
    ).toBe(false);
  });

  it("requires process identity for status and a bounded deadline for resume", () => {
    const releaseAuthoritySha256 = "a".repeat(64);
    const releaseRequestId = `handoff-v2-release:${releaseAuthoritySha256.slice(0, 32)}`;
    expect(
      validateGatewaySuspendStatusParams({
        suspensionId: "suspension-1",
        gatewayInstanceId: "gateway-instance-1",
        suspendMode: "handoff-durable-hold/v1",
      }),
    ).toBe(true);
    expect(validateGatewaySuspendStatusParams({ suspensionId: "suspension-1" })).toBe(false);
    expect(
      validateGatewaySuspendResumeParams({
        suspensionId: "suspension-1",
        gatewayInstanceId: "gateway-instance-1",
        resumeBeforeMs: 1_000,
        suspendMode: "handoff-durable-hold/v1",
        releaseRequestId,
        releaseAuthoritySha256,
      }),
    ).toBe(true);
    expect(
      validateGatewaySuspendStatusParams({
        suspendMode: "handoff-durable-hold/v1",
        releaseRequestId,
        releaseAuthoritySha256,
      }),
    ).toBe(true);
    expect(
      validateGatewaySuspendResumeParams({
        suspensionId: "suspension-1",
        gatewayInstanceId: "gateway-instance-1",
        resumeBeforeMs: 1_000,
        suspendMode: "handoff-durable-hold/v1",
      }),
    ).toBe(false);
    expect(
      validateGatewaySuspendResumeParams({
        suspensionId: "suspension-1",
        gatewayInstanceId: "gateway-instance-1",
      }),
    ).toBe(false);
  });
});
