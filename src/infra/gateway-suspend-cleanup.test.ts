import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isGatewayWorkAdmissionClosed,
  resetGatewayWorkAdmission,
} from "../process/gateway-work-admission.js";
import {
  adoptGatewaySuspendHandoffAtStartup,
  getGatewaySuspendStatus,
  prepareGatewaySuspend,
  resetGatewaySuspendCoordinatorForLifecycleRestart,
  resumeGatewaySuspend,
} from "./gateway-suspend-coordinator.js";

const durableFault = vi.hoisted(() => ({
  path: "",
  failUnlinkOnce: false,
  failParentSyncAfterUnlink: false,
  pendingParentSyncFailure: false,
  fsyncCount: 0,
  advanceOnAuthorizedRename: undefined as (() => void) | undefined,
}));

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    unlinkSync: (path: import("node:fs").PathLike) => {
      if (durableFault.failUnlinkOnce && String(path) === durableFault.path) {
        durableFault.failUnlinkOnce = false;
        const error = new Error("injected unlink failure") as NodeJS.ErrnoException;
        error.code = "EIO";
        throw error;
      }
      actual.unlinkSync(path);
      if (durableFault.failParentSyncAfterUnlink && String(path) === durableFault.path) {
        durableFault.pendingParentSyncFailure = true;
        durableFault.failParentSyncAfterUnlink = false;
      }
    },
    renameSync: (oldPath: import("node:fs").PathLike, newPath: import("node:fs").PathLike) => {
      actual.renameSync(oldPath, newPath);
      if (
        String(newPath) === durableFault.path &&
        JSON.parse(actual.readFileSync(newPath, "utf8")).resumeState === "resume-reopen-authorized"
      ) {
        durableFault.advanceOnAuthorizedRename?.();
      }
    },
    fsyncSync: (descriptor: number) => {
      if (durableFault.pendingParentSyncFailure) {
        durableFault.pendingParentSyncFailure = false;
        const error = new Error("injected parent fsync failure") as NodeJS.ErrnoException;
        error.code = "EIO";
        throw error;
      }
      actual.fsyncSync(descriptor);
      durableFault.fsyncCount += 1;
    },
  };
});

beforeEach(() => {
  durableFault.path = "";
  durableFault.failUnlinkOnce = false;
  durableFault.failParentSyncAfterUnlink = false;
  durableFault.pendingParentSyncFailure = false;
  durableFault.fsyncCount = 0;
  durableFault.advanceOnAuthorizedRename = undefined;
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

afterEach(() => {
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

describe("gateway suspend durable cleanup", () => {
  it("adopts a post-reopen crash solely as durable cleanup", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-cleanup-restart-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    const resumeScheduling = vi.fn();
    try {
      const prepared = prepareGatewaySuspend({
        requestId: "request-cleanup-restart",
        gatewayPid: process.pid,
        launchdRunCount: 1,
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: {},
        createSuspensionId: () => "suspension-cleanup-restart",
        durableHandoffPath,
      });
      expect(prepared).toMatchObject({ status: "ready" });
      if (prepared.status !== "ready") {
        throw new Error(`expected prepared suspension, received ${prepared.status}`);
      }

      durableFault.path = durableHandoffPath;
      durableFault.failUnlinkOnce = true;
      const gatewayInstanceId = prepared.gatewayInstanceId;
      const status = getGatewaySuspendStatus({
        suspensionId: "suspension-cleanup-restart",
        gatewayInstanceId,
      });
      expect("expiresAtMs" in status).toBe(true);
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: "suspension-cleanup-restart",
            gatewayInstanceId,
            resumeBeforeMs: "expiresAtMs" in status ? status.expiresAtMs : 0,
          },
          gatewayInstanceId,
          () => ("expiresAtMs" in status ? status.expiresAtMs - 1 : 0),
        ),
      ).toMatchObject({ ok: false, reason: "scheduler-resume-failed" });
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
        resumeState: "resume-cleanup",
      });

      resetGatewaySuspendCoordinatorForLifecycleRestart();
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);

      resetGatewayWorkAdmission();
      expect(
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath,
          currentGatewayInstanceId: "successor-cleanup-instance",
        }),
      ).toBe(false);
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(() => readFileSync(durableHandoffPath)).toThrow();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("expires instead of reopening when durable authorization crosses the deadline", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-cleanup-deadline-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    const gatewayInstanceId = "gateway-cleanup-deadline";
    const resumeScheduling = vi.fn();
    let nowMs = 1_000;
    try {
      expect(
        prepareGatewaySuspend({
          requestId: "request-cleanup-deadline",
          gatewayPid: process.pid,
          launchdRunCount: 1,
          currentGatewayInstanceId: gatewayInstanceId,
          pauseScheduling: vi.fn(),
          resumeScheduling,
          inspect: {},
          nowMs: () => nowMs,
          createSuspensionId: () => "suspension-cleanup-deadline",
          durableHandoffPath,
        }),
      ).toMatchObject({ status: "ready" });

      durableFault.path = durableHandoffPath;
      durableFault.advanceOnAuthorizedRename = () => {
        nowMs = 1_500;
        durableFault.advanceOnAuthorizedRename = undefined;
      };
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: "suspension-cleanup-deadline",
            gatewayInstanceId,
            resumeBeforeMs: 1_500,
          },
          gatewayInstanceId,
          () => nowMs,
        ),
      ).toEqual({ ok: false, reason: "resume-authority-expired" });
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
        resumeState: "resume-expired",
        resumeBeforeMs: 1_500,
      });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("re-proves absent cleanup markers after an unlink parent-sync failure", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-cleanup-absence-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      const prepared = prepareGatewaySuspend({
        requestId: "request-cleanup-absence",
        gatewayPid: process.pid,
        launchdRunCount: 1,
        pauseScheduling: vi.fn(),
        resumeScheduling: vi.fn(),
        inspect: {},
        createSuspensionId: () => "suspension-cleanup-absence",
        durableHandoffPath,
      });
      if (prepared.status !== "ready") {
        throw new Error(`expected prepared suspension, received ${prepared.status}`);
      }
      durableFault.path = durableHandoffPath;
      durableFault.failUnlinkOnce = true;
      const gatewayInstanceId = prepared.gatewayInstanceId;
      const status = getGatewaySuspendStatus({
        suspensionId: "suspension-cleanup-absence",
        gatewayInstanceId,
      });
      resumeGatewaySuspend(
        {
          suspensionId: "suspension-cleanup-absence",
          gatewayInstanceId,
          resumeBeforeMs: "expiresAtMs" in status ? status.expiresAtMs : 0,
        },
        gatewayInstanceId,
        () => ("expiresAtMs" in status ? status.expiresAtMs - 1 : 0),
      );
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();

      durableFault.failParentSyncAfterUnlink = true;
      expect(adoptGatewaySuspendHandoffAtStartup({ durableHandoffPath })).toBe(false);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      durableFault.fsyncCount = 0;
      expect(adoptGatewaySuspendHandoffAtStartup({ durableHandoffPath })).toBe(false);
      expect(durableFault.fsyncCount).toBeGreaterThan(0);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each([
    ["before", 1_499, false, "deleted"],
    ["at", 1_500, true, "resume-expired"],
  ] as const)(
    "adopts durable reopen authorization %s its deadline without replaying reopen",
    (_label, nowMs, adopted, expectedState) => {
      const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-authorized-restart-"));
      const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
      try {
        writeFileSync(
          durableHandoffPath,
          `${JSON.stringify({
            schema: "openclaw-gateway-suspend-handoff/v2",
            requestId: "request-authorized-restart",
            suspensionId: "suspension-authorized-restart",
            gatewayInstanceId: "predecessor-authorized-restart",
            gatewayPid: process.pid,
            launchdRunCount: 1,
            expiresAtMs: 2_000,
            resumeState: "resume-reopen-authorized",
            resumeBeforeMs: 1_500,
          })}\n`,
          { mode: 0o600 },
        );
        expect(
          adoptGatewaySuspendHandoffAtStartup({
            durableHandoffPath,
            nowMs: () => nowMs,
            currentGatewayInstanceId: "successor-authorized-restart",
          }),
        ).toBe(adopted);
        expect(isGatewayWorkAdmissionClosed()).toBe(adopted);
        if (expectedState === "deleted") {
          expect(() => readFileSync(durableHandoffPath)).toThrow();
        } else {
          expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
            resumeState: expectedState,
          });
        }
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
  );

  it.each([
    "resume-pending",
    "resume-expired",
    "resume-reopen-authorized",
    "resume-cleanup",
  ] as const)("rejects an overlong durable %s deadline during parsing", (resumeState) => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-invalid-deadline-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      writeFileSync(
        durableHandoffPath,
        `${JSON.stringify({
          schema: "openclaw-gateway-suspend-handoff/v2",
          requestId: "request-invalid-deadline",
          suspensionId: "suspension-invalid-deadline",
          gatewayInstanceId: "gateway-invalid-deadline",
          gatewayPid: process.pid,
          launchdRunCount: 1,
          expiresAtMs: 1_500,
          resumeState,
          resumeBeforeMs: 1_501,
        })}\n`,
        { mode: 0o600 },
      );
      expect(() =>
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath,
          nowMs: () => 1_000,
        }),
      ).toThrow("gateway suspension handoff is invalid");
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
