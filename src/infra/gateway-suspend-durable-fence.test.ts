import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isGatewayWorkAdmissionClosed,
  markGatewayRestartDraining,
  resetGatewayWorkAdmission,
} from "../process/gateway-work-admission.js";
import type { GatewayActiveWorkInspectors } from "./gateway-active-work.js";
import {
  adoptGatewaySuspendHandoffAtStartup,
  prepareGatewaySuspend,
  resetGatewaySuspendCoordinatorForLifecycleRestart,
  resumeGatewaySuspend,
} from "./gateway-suspend-coordinator.js";
import { getTestGatewaySuspendStatus } from "./gateway-suspend-coordinator.test-support.js";

const SUSPEND_TTL_MS = 2 * 60_000;

const idleInspectors: GatewayActiveWorkInspectors = {
  getQueueSize: () => 0,
  getPendingReplies: () => 0,
  getEmbeddedRuns: () => 0,
  getBackgroundExecSessions: () => 0,
  getCronRuns: () => 0,
  getActiveTasks: () => 0,
  getTaskBlockers: () => [],
  getRootRequests: () => 0,
  getSessionAdmissions: () => 0,
  getSessionMutations: () => 0,
  getChatRuns: () => 0,
  getQueuedTurns: () => 0,
  getTerminalPersistence: () => 0,
  getTerminalSessions: () => 0,
};

function requireReady(result: ReturnType<typeof prepareGatewaySuspend>) {
  if (result.status !== "ready") {
    throw new Error(`expected a ready suspension, got ${result.status}`);
  }
  return result;
}

function prepareDurableFence(params: {
  requestId: string;
  suspensionId?: string;
  durableHandoffPath: string;
  nowMs: () => number;
  createSuspensionId?: () => string;
  gatewayInstanceId?: string;
  gatewayPid?: number;
  launchdRunCount?: number;
  pauseScheduling?: () => void;
  resumeScheduling?: () => void;
}) {
  return prepareGatewaySuspend({
    requestId: params.requestId,
    suspensionId: params.suspensionId,
    gatewayPid: params.gatewayPid ?? process.pid,
    launchdRunCount: params.launchdRunCount ?? 1,
    currentGatewayInstanceId: params.gatewayInstanceId,
    currentGatewayPid: params.gatewayPid,
    pauseScheduling: params.pauseScheduling ?? vi.fn(),
    resumeScheduling: params.resumeScheduling ?? vi.fn(),
    inspect: idleInspectors,
    nowMs: params.nowMs,
    createSuspensionId: params.createSuspensionId,
    durableHandoffPath: params.durableHandoffPath,
  });
}

beforeEach(() => {
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

afterEach(() => {
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

describe("gateway durable suspension fence", () => {
  it("keeps an expired held fence closed until an exact renewal and explicit resume", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-expired-held-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    let nowMs = 1_000;
    const resumeScheduling = vi.fn();
    try {
      const prepared = requireReady(
        prepareDurableFence({
          requestId: "request-expired-held",
          durableHandoffPath,
          nowMs: () => nowMs,
          createSuspensionId: () => "suspension-expired-held",
          resumeScheduling,
        }),
      );
      nowMs = prepared.expiresAtMs;

      expect(getTestGatewaySuspendStatus(prepared.suspensionId)).toEqual({
        status: "ready",
        expiresAtMs: prepared.expiresAtMs,
      });
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: prepared.suspensionId,
            gatewayInstanceId: prepared.gatewayInstanceId,
            resumeBeforeMs: prepared.expiresAtMs,
          },
          prepared.gatewayInstanceId,
          () => nowMs,
        ),
      ).toEqual({ ok: false, reason: "resume-authority-expired" });
      expect(resumeScheduling).not.toHaveBeenCalled();
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
        suspensionId: prepared.suspensionId,
        resumeState: "held",
      });
      expect(
        prepareDurableFence({
          requestId: "request-expired-held",
          durableHandoffPath,
          nowMs: () => nowMs,
        }),
      ).toEqual({ status: "conflict", expiresAtMs: prepared.expiresAtMs });

      const renewed = requireReady(
        prepareDurableFence({
          requestId: "request-expired-held",
          suspensionId: prepared.suspensionId,
          durableHandoffPath,
          nowMs: () => nowMs,
        }),
      );
      expect(renewed.expiresAtMs).toBe(nowMs + SUSPEND_TTL_MS);
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: renewed.suspensionId,
            gatewayInstanceId: renewed.gatewayInstanceId,
            resumeBeforeMs: renewed.expiresAtMs,
          },
          renewed.gatewayInstanceId,
          () => nowMs + 1,
        ),
      ).toMatchObject({ ok: true, status: "running", resumed: true });
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("re-adopts an expired held fence after crash and requires exact successor rebinding", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-crash-restart-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    let nowMs = 1_000;
    const predecessorResume = vi.fn();
    const successorResume = vi.fn();
    try {
      const prepared = requireReady(
        prepareDurableFence({
          requestId: "request-crash-restart",
          durableHandoffPath,
          nowMs: () => nowMs,
          createSuspensionId: () => "suspension-crash-restart",
          resumeScheduling: predecessorResume,
        }),
      );

      markGatewayRestartDraining();
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      predecessorResume.mockClear();
      nowMs = prepared.expiresAtMs + 1;
      expect(
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath,
          nowMs: () => nowMs,
          currentGatewayInstanceId: "successor-instance",
          currentGatewayPid: process.pid,
        }),
      ).toBe(true);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(predecessorResume).not.toHaveBeenCalled();
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: prepared.suspensionId,
            gatewayInstanceId: "successor-instance",
            resumeBeforeMs: prepared.expiresAtMs,
          },
          "successor-instance",
          () => nowMs,
        ),
      ).toEqual({ ok: false, reason: "suspension-mismatch" });
      expect(
        prepareDurableFence({
          requestId: "request-crash-restart",
          durableHandoffPath,
          nowMs: () => nowMs,
          gatewayInstanceId: "successor-instance",
          launchdRunCount: 2,
        }),
      ).toEqual({ status: "conflict", expiresAtMs: prepared.expiresAtMs });

      const rebound = requireReady(
        prepareDurableFence({
          requestId: "request-crash-restart",
          suspensionId: prepared.suspensionId,
          durableHandoffPath,
          nowMs: () => nowMs,
          gatewayInstanceId: "successor-instance",
          launchdRunCount: 2,
          resumeScheduling: successorResume,
        }),
      );
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: rebound.suspensionId,
            gatewayInstanceId: rebound.gatewayInstanceId,
            resumeBeforeMs: rebound.expiresAtMs,
          },
          rebound.gatewayInstanceId,
          () => nowMs + 1,
        ),
      ).toMatchObject({ ok: true, status: "running", resumed: true });
      expect(successorResume).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each([
    ["missing", (path: string) => unlinkSync(path)],
    ["corrupt", (path: string) => writeFileSync(path, "{}\n")],
  ])("fails closed when the active durable state is %s", (_label, mutate) => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-durable-drift-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    let nowMs = 1_000;
    const resumeScheduling = vi.fn();
    try {
      const prepared = requireReady(
        prepareDurableFence({
          requestId: "request-durable-drift",
          durableHandoffPath,
          nowMs: () => nowMs,
          createSuspensionId: () => "suspension-durable-drift",
          resumeScheduling,
        }),
      );
      mutate(durableHandoffPath);

      expect(
        resumeGatewaySuspend(
          {
            suspensionId: prepared.suspensionId,
            gatewayInstanceId: prepared.gatewayInstanceId,
            resumeBeforeMs: prepared.expiresAtMs,
          },
          prepared.gatewayInstanceId,
          () => nowMs,
        ),
      ).toEqual({
        ok: false,
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      expect(resumeScheduling).not.toHaveBeenCalled();
      expect(isGatewayWorkAdmissionClosed()).toBe(true);

      nowMs += 1;
      expect(() =>
        prepareDurableFence({
          requestId: "request-durable-drift",
          suspensionId: prepared.suspensionId,
          durableHandoffPath,
          nowMs: () => nowMs,
        }),
      ).toThrow();
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("rejects a stale resume after a newer durable suspension is active", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-stale-resume-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    let nowMs = 1_000;
    try {
      const first = requireReady(
        prepareDurableFence({
          requestId: "request-first",
          durableHandoffPath,
          nowMs: () => nowMs,
          createSuspensionId: () => "suspension-first",
        }),
      );
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: first.suspensionId,
            gatewayInstanceId: first.gatewayInstanceId,
            resumeBeforeMs: first.expiresAtMs,
          },
          first.gatewayInstanceId,
          () => nowMs,
        ),
      ).toMatchObject({ ok: true, resumed: true });

      nowMs += 1;
      const second = requireReady(
        prepareDurableFence({
          requestId: "request-second",
          durableHandoffPath,
          nowMs: () => nowMs,
          createSuspensionId: () => "suspension-second",
        }),
      );
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: first.suspensionId,
            gatewayInstanceId: first.gatewayInstanceId,
            resumeBeforeMs: first.expiresAtMs,
          },
          first.gatewayInstanceId,
          () => nowMs,
        ),
      ).toEqual({ ok: false, reason: "suspension-mismatch" });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: second.suspensionId,
            gatewayInstanceId: second.gatewayInstanceId,
            resumeBeforeMs: second.expiresAtMs,
          },
          second.gatewayInstanceId,
          () => nowMs,
        ),
      ).toMatchObject({ ok: true, resumed: true });
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("rejects corrupt startup state and treats a truly absent marker as no fence", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-startup-state-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      expect(adoptGatewaySuspendHandoffAtStartup({ durableHandoffPath })).toBe(false);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);

      writeFileSync(durableHandoffPath, "{}\n", { mode: 0o600 });
      expect(() => adoptGatewaySuspendHandoffAtStartup({ durableHandoffPath })).toThrow(
        "gateway suspension handoff has an invalid shape",
      );
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
