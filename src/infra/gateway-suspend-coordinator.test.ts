import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const durableDeletionFault = vi.hoisted(() => ({
  path: "",
  failParentSyncAfterUnlink: false,
  pendingParentSync: false,
  awaitingRetryParentSync: false,
  retryParentSyncCount: 0,
  pathAfterRename: "",
  failParentSyncAfterRename: false,
  renameProofSyncsRemaining: 0,
  postFailureProofSyncCount: 0,
  mutateAfterPostFailureProof: false,
  adoptionProofSyncsRemaining: 0,
  adoptionProofSyncCount: 0,
  observeUnlink: undefined as (() => void) | undefined,
}));

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    unlinkSync: (path: import("node:fs").PathLike) => {
      durableDeletionFault.observeUnlink?.();
      actual.unlinkSync(path);
      if (
        durableDeletionFault.failParentSyncAfterUnlink &&
        String(path) === durableDeletionFault.path
      ) {
        durableDeletionFault.pendingParentSync = true;
      }
    },
    renameSync: (oldPath: import("node:fs").PathLike, newPath: import("node:fs").PathLike) => {
      actual.renameSync(oldPath, newPath);
      if (
        durableDeletionFault.failParentSyncAfterRename &&
        String(newPath) === durableDeletionFault.pathAfterRename
      ) {
        durableDeletionFault.renameProofSyncsRemaining = 2;
      }
    },
    fsyncSync: (descriptor: number) => {
      if (durableDeletionFault.pendingParentSync) {
        durableDeletionFault.pendingParentSync = false;
        durableDeletionFault.failParentSyncAfterUnlink = false;
        durableDeletionFault.awaitingRetryParentSync = true;
        const error = new Error("injected parent fsync failure") as NodeJS.ErrnoException;
        error.code = "EIO";
        throw error;
      }
      if (durableDeletionFault.renameProofSyncsRemaining > 0) {
        durableDeletionFault.renameProofSyncsRemaining -= 1;
        if (durableDeletionFault.renameProofSyncsRemaining === 0) {
          durableDeletionFault.failParentSyncAfterRename = false;
          durableDeletionFault.postFailureProofSyncCount = -2;
          const error = new Error("injected rename parent fsync failure") as NodeJS.ErrnoException;
          error.code = "EIO";
          throw error;
        }
      }
      actual.fsyncSync(descriptor);
      if (durableDeletionFault.postFailureProofSyncCount < 0) {
        durableDeletionFault.postFailureProofSyncCount += 1;
        if (
          durableDeletionFault.postFailureProofSyncCount === 0 &&
          durableDeletionFault.mutateAfterPostFailureProof
        ) {
          actual.writeFileSync(
            durableDeletionFault.pathAfterRename,
            Buffer.from("changed after recovery durability proof", "utf8"),
          );
        }
      }
      if (durableDeletionFault.adoptionProofSyncsRemaining > 0) {
        durableDeletionFault.adoptionProofSyncsRemaining -= 1;
        durableDeletionFault.adoptionProofSyncCount += 1;
      }
      if (durableDeletionFault.awaitingRetryParentSync) {
        durableDeletionFault.awaitingRetryParentSync = false;
        durableDeletionFault.retryParentSyncCount += 1;
      }
    },
  };
});
import {
  addSession,
  deleteSession,
  getActiveBackgroundExecSessionCount,
  markBackgrounded,
  markExited,
} from "../agents/bash-process-registry.js";
import { createProcessSessionFixture } from "../agents/bash-process-registry.test-helpers.js";
import { resetProcessRegistryForTests } from "../agents/bash-process-registry.test-support.js";
import {
  isGatewayWorkAdmissionClosed,
  markGatewayRestartDraining,
  resetGatewayWorkAdmission,
} from "../process/gateway-work-admission.js";
import type { GatewayActiveWorkInspectors } from "./gateway-active-work.js";
import {
  adoptGatewaySuspendHandoffAtStartup,
  getGatewayProcessIncarnationId,
  getGatewaySuspendStatus as getGatewaySuspendStatusWithIdentity,
  prepareGatewaySuspend as prepareGatewaySuspendWithIdentity,
  resetGatewaySuspendCoordinatorForLifecycleRestart,
  resumeGatewaySuspend as resumeGatewaySuspendWithIdentity,
} from "./gateway-suspend-coordinator.js";

const SUSPEND_TTL_MS = 2 * 60_000;
const SUSPEND_RETRY_AFTER_MS = 20_000;

function prepareGatewaySuspend(
  params: Omit<
    Parameters<typeof prepareGatewaySuspendWithIdentity>[0],
    "gatewayPid" | "launchdRunCount"
  > &
    Partial<
      Pick<
        Parameters<typeof prepareGatewaySuspendWithIdentity>[0],
        "gatewayPid" | "launchdRunCount"
      >
    >,
) {
  return prepareGatewaySuspendWithIdentity({
    gatewayPid: process.pid,
    launchdRunCount: 1,
    ...params,
  });
}

function getGatewaySuspendStatus(suspensionId: string) {
  const { gatewayInstanceId: _gatewayInstanceId, ...result } = getGatewaySuspendStatusWithIdentity({
    suspensionId,
    gatewayInstanceId: getGatewayProcessIncarnationId(),
  });
  return result;
}

function resumeGatewaySuspend(suspensionId: string) {
  const gatewayInstanceId = getGatewayProcessIncarnationId();
  const status = getGatewaySuspendStatusWithIdentity({ suspensionId, gatewayInstanceId });
  const resumeBeforeMs = "expiresAtMs" in status ? status.expiresAtMs : Number.MAX_SAFE_INTEGER;
  const { gatewayInstanceId: _gatewayInstanceId, ...result } = resumeGatewaySuspendWithIdentity(
    { suspensionId, gatewayInstanceId, resumeBeforeMs },
    gatewayInstanceId,
    () => resumeBeforeMs - 1,
  );
  return result;
}

function inspectors(
  overrides: Partial<GatewayActiveWorkInspectors> = {},
): GatewayActiveWorkInspectors {
  return {
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
    ...overrides,
  };
}

beforeEach(() => {
  durableDeletionFault.path = "";
  durableDeletionFault.failParentSyncAfterUnlink = false;
  durableDeletionFault.pendingParentSync = false;
  durableDeletionFault.awaitingRetryParentSync = false;
  durableDeletionFault.retryParentSyncCount = 0;
  durableDeletionFault.pathAfterRename = "";
  durableDeletionFault.failParentSyncAfterRename = false;
  durableDeletionFault.renameProofSyncsRemaining = 0;
  durableDeletionFault.postFailureProofSyncCount = 0;
  durableDeletionFault.mutateAfterPostFailureProof = false;
  durableDeletionFault.adoptionProofSyncsRemaining = 0;
  durableDeletionFault.adoptionProofSyncCount = 0;
  durableDeletionFault.observeUnlink = undefined;
  resetProcessRegistryForTests();
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

afterEach(() => {
  resetProcessRegistryForTests();
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

describe("gateway suspend coordinator", () => {
  it("accepts initial handoff creation only after an exposed rename is freshly re-proven", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-rename-retry-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      durableDeletionFault.pathAfterRename = durableHandoffPath;
      durableDeletionFault.failParentSyncAfterRename = true;

      expect(
        prepareGatewaySuspend({
          requestId: "request-rename-retry",
          pauseScheduling: vi.fn(),
          resumeScheduling: vi.fn(),
          inspect: inspectors(),
          createSuspensionId: () => "suspension-rename-retry",
          durableHandoffPath,
        }),
      ).toMatchObject({ status: "ready", suspensionId: "suspension-rename-retry" });
      expect(durableDeletionFault.postFailureProofSyncCount).toBe(0);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("updates renewal memory only after an exposed replacement is freshly re-proven", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-renew-retry-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      expect(
        prepareGatewaySuspend({
          requestId: "request-renew-retry",
          pauseScheduling: vi.fn(),
          resumeScheduling: vi.fn(),
          inspect: inspectors(),
          nowMs: () => 1_000,
          createSuspensionId: () => "suspension-renew-retry",
          durableHandoffPath,
        }),
      ).toMatchObject({ expiresAtMs: 1_000 + SUSPEND_TTL_MS });
      durableDeletionFault.pathAfterRename = durableHandoffPath;
      durableDeletionFault.failParentSyncAfterRename = true;

      expect(
        prepareGatewaySuspend({
          requestId: "request-renew-retry",
          pauseScheduling: vi.fn(),
          resumeScheduling: vi.fn(),
          inspect: inspectors(),
          nowMs: () => 2_000,
          durableHandoffPath,
        }),
      ).toMatchObject({
        status: "ready",
        suspensionId: "suspension-renew-retry",
        expiresAtMs: 2_000 + SUSPEND_TTL_MS,
      });
      expect(durableDeletionFault.postFailureProofSyncCount).toBe(0);
      expect(getGatewaySuspendStatus("suspension-renew-retry")).toEqual({
        status: "ready",
        expiresAtMs: 2_000 + SUSPEND_TTL_MS,
      });
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("keeps admission closed when an exposed handoff changes during fresh re-proof", () => {
    vi.useFakeTimers();
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-rename-drift-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    const resumeScheduling = vi.fn();
    try {
      durableDeletionFault.pathAfterRename = durableHandoffPath;
      durableDeletionFault.failParentSyncAfterRename = true;
      durableDeletionFault.mutateAfterPostFailureProof = true;

      expect(
        prepareGatewaySuspend({
          requestId: "request-rename-drift",
          pauseScheduling: vi.fn(),
          resumeScheduling,
          inspect: inspectors(),
          createSuspensionId: () => "suspension-rename-drift",
          durableHandoffPath,
        }),
      ).toEqual({
        status: "recovering",
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);

      vi.advanceTimersByTime(1_000);

      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(getGatewaySuspendStatus("suspension-rename-drift")).toEqual({
        status: "running",
      });
    } finally {
      vi.useRealTimers();
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("deletes the durable marker only after admission has reopened", () => {
    vi.useFakeTimers();
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-unlink-retry-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      expect(
        prepareGatewaySuspend({
          requestId: "request-unlink-retry",
          pauseScheduling: vi.fn(),
          resumeScheduling: vi.fn(),
          inspect: inspectors(),
          createSuspensionId: () => "suspension-unlink-retry",
          durableHandoffPath,
        }),
      ).toMatchObject({ status: "ready", suspensionId: "suspension-unlink-retry" });

      durableDeletionFault.path = durableHandoffPath;
      durableDeletionFault.failParentSyncAfterUnlink = true;
      durableDeletionFault.observeUnlink = () => {
        expect(isGatewayWorkAdmissionClosed()).toBe(false);
      };
      expect(resumeGatewaySuspend("suspension-unlink-retry")).toEqual({
        ok: false,
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      vi.advanceTimersByTime(1_000);

      expect(durableDeletionFault.retryParentSyncCount).toBe(1);
      expect(getGatewaySuspendStatus("suspension-unlink-retry")).toEqual({
        status: "running",
      });
    } finally {
      vi.useRealTimers();
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("durably transfers a prepared fence to a fresh successor before work admission", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-suspend-handoff-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    const predecessorResume = vi.fn();
    try {
      expect(
        prepareGatewaySuspend({
          requestId: "request-cross-process",
          pauseScheduling: vi.fn(),
          resumeScheduling: predecessorResume,
          inspect: inspectors(),
          createSuspensionId: () => "suspension-cross-process",
          durableHandoffPath,
        }),
      ).toMatchObject({ status: "ready", suspensionId: "suspension-cross-process" });

      markGatewayRestartDraining();
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      durableDeletionFault.adoptionProofSyncsRemaining = 2;
      expect(
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath,
        }),
      ).toBe(true);
      expect(durableDeletionFault.adoptionProofSyncCount).toBe(2);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);

      const successorPause = vi.fn();
      const successorResume = vi.fn();
      expect(
        prepareGatewaySuspend({
          requestId: "request-cross-process",
          suspensionId: "suspension-cross-process",
          pauseScheduling: successorPause,
          resumeScheduling: successorResume,
          inspect: inspectors(),
          durableHandoffPath,
        }),
      ).toMatchObject({ status: "ready", suspensionId: "suspension-cross-process" });
      expect(successorPause).toHaveBeenCalledOnce();
      expect(resumeGatewaySuspend("suspension-cross-process")).toEqual({
        ok: true,
        status: "running",
        resumed: true,
      });
      expect(successorResume).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("lifecycle reset resumes a held scheduler before admission is cleared", () => {
    const resumeScheduling = vi.fn(() => {
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
    });
    expect(
      prepareGatewaySuspend({
        requestId: "request-lifecycle-reset",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
      }),
    ).toMatchObject({ status: "ready" });

    markGatewayRestartDraining();
    expect(resumeScheduling).not.toHaveBeenCalled();
    expect(isGatewayWorkAdmissionClosed()).toBe(true);

    resetGatewaySuspendCoordinatorForLifecycleRestart();

    expect(resumeScheduling).toHaveBeenCalledOnce();
    resetGatewayWorkAdmission();
    expect(isGatewayWorkAdmissionClosed()).toBe(false);
  });

  it("test reset resumes a held scheduler before admission is cleared", () => {
    const resumeScheduling = vi.fn(() => {
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
    });
    expect(
      prepareGatewaySuspend({
        requestId: "request-lifecycle-reset",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
      }),
    ).toMatchObject({ status: "ready" });

    resetGatewaySuspendCoordinatorForLifecycleRestart();
    resetGatewayWorkAdmission();

    expect(resumeScheduling).toHaveBeenCalledOnce();
    expect(isGatewayWorkAdmissionClosed()).toBe(false);
  });

  it("reopens admission in the same turn when active work refuses preparation", () => {
    const events: string[] = [];
    const result = prepareGatewaySuspend({
      requestId: "request-busy",
      pauseScheduling: () => events.push("pause"),
      resumeScheduling: () => events.push("resume"),
      inspect: inspectors({
        getQueueSize: () => {
          events.push("inspect");
          return 1;
        },
      }),
    });

    expect(result.status).toBe("busy");
    expect(events).toEqual(["pause", "inspect", "resume"]);
    expect(isGatewayWorkAdmissionClosed()).toBe(false);
  });

  it("stays busy after a background session is hidden until its process exits", () => {
    const session = createProcessSessionFixture({
      id: "private-background-session",
      command: "private command",
    });
    addSession(session);
    markBackgrounded(session);
    deleteSession(session.id);

    const inspect = inspectors({
      getBackgroundExecSessions: getActiveBackgroundExecSessionCount,
    });
    expect(
      prepareGatewaySuspend({
        requestId: "request-background-exec",
        pauseScheduling: vi.fn(),
        resumeScheduling: vi.fn(),
        inspect,
      }),
    ).toEqual({
      status: "busy",
      reason: "active-work",
      retryAfterMs: SUSPEND_RETRY_AFTER_MS,
      activeCount: 1,
      blockers: [
        {
          kind: "background-exec",
          count: 1,
          message: "1 active background exec session(s)",
        },
      ],
    });

    markExited(session, 0, null, "completed");
    expect(
      prepareGatewaySuspend({
        requestId: "request-background-exec",
        pauseScheduling: vi.fn(),
        resumeScheduling: vi.fn(),
        inspect,
      }),
    ).toMatchObject({ status: "ready", activeCount: 0, blockers: [] });
  });

  it("keeps admission closed until a failed busy rollback resumes scheduling", () => {
    vi.useFakeTimers();
    try {
      const resumeScheduling = vi
        .fn()
        .mockImplementationOnce(() => {
          throw new Error("timer unavailable");
        })
        .mockImplementationOnce(() => {});
      const first = prepareGatewaySuspend({
        requestId: "request-busy-resume-retry",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors({ getQueueSize: () => 1 }),
      });

      expect(first).toEqual({
        status: "recovering",
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(getGatewaySuspendStatus("stale-id")).toEqual(first);
      expect(resumeGatewaySuspend("stale-id")).toEqual({
        ok: false,
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      expect(
        prepareGatewaySuspend({
          requestId: "request-before-scheduler-resume",
          pauseScheduling: vi.fn(),
          resumeScheduling,
          inspect: inspectors(),
        }),
      ).toEqual(first);

      vi.advanceTimersByTime(1_000);
      expect(resumeScheduling).toHaveBeenCalledTimes(2);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(getGatewaySuspendStatus("stale-id")).toEqual({ status: "running" });

      expect(
        prepareGatewaySuspend({
          requestId: "request-after-scheduler-resume",
          pauseScheduling: vi.fn(),
          resumeScheduling,
          inspect: inspectors(),
          createSuspensionId: () => "suspension-after-scheduler-resume",
        }),
      ).toMatchObject({
        status: "ready",
        suspensionId: "suspension-after-scheduler-resume",
      });
      vi.advanceTimersByTime(1_000);
      expect(resumeScheduling).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("cancels scheduler recovery when restart supersedes suspension", () => {
    vi.useFakeTimers();
    try {
      const resumeScheduling = vi.fn(() => {
        throw new Error("timer unavailable");
      });
      expect(
        prepareGatewaySuspend({
          requestId: "request-recovery-restart",
          pauseScheduling: vi.fn(),
          resumeScheduling,
          inspect: inspectors({ getQueueSize: () => 1 }),
        }),
      ).toMatchObject({ status: "recovering" });

      markGatewayRestartDraining();
      vi.advanceTimersByTime(1_000);

      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(getGatewaySuspendStatus("stale-id")).toEqual({ status: "running" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("owns recovery when inspection fails before admission commits", () => {
    vi.useFakeTimers();
    try {
      const resumeScheduling = vi
        .fn()
        .mockImplementationOnce(() => {
          throw new Error("timer unavailable");
        })
        .mockImplementationOnce(() => {});
      const result = prepareGatewaySuspend({
        requestId: "request-inspection-failure",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors({
          getQueueSize: () => {
            throw new Error("inspection failed");
          },
        }),
      });

      expect(result).toMatchObject({ status: "recovering" });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      vi.advanceTimersByTime(1_000);
      expect(resumeScheduling).toHaveBeenCalledTimes(2);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("renews one ready lease and resumes only with the matching id", () => {
    const resumeScheduling = vi.fn();
    expect(
      prepareGatewaySuspend({
        requestId: "request-ready",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
        nowMs: () => 1_000,
        createSuspensionId: () => "suspension-1",
      }),
    ).toMatchObject({
      status: "ready",
      suspensionId: "suspension-1",
      expiresAtMs: 1_000 + SUSPEND_TTL_MS,
    });
    expect(isGatewayWorkAdmissionClosed()).toBe(true);

    expect(
      prepareGatewaySuspend({
        requestId: "request-ready",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors({ getQueueSize: () => 99 }),
        nowMs: () => 2_000,
      }),
    ).toMatchObject({
      status: "ready",
      suspensionId: "suspension-1",
      expiresAtMs: 2_000 + SUSPEND_TTL_MS,
    });
    expect(
      prepareGatewaySuspend({
        requestId: "request-other",
        pauseScheduling: vi.fn(),
        resumeScheduling,
      }).status,
    ).toBe("conflict");

    expect(resumeGatewaySuspend("wrong-id")).toEqual({
      ok: false,
      reason: "suspension-mismatch",
    });
    expect(resumeGatewaySuspend("suspension-1")).toEqual({
      ok: true,
      status: "running",
      resumed: true,
    });
    expect(resumeScheduling).toHaveBeenCalledOnce();
    expect(isGatewayWorkAdmissionClosed()).toBe(false);
  });

  it("atomically rejects a replacement process for status, renewal, and resume", () => {
    const resumeScheduling = vi.fn();
    const originalGatewayInstanceId = "gateway-instance-original";
    const replacementGatewayInstanceId = "gateway-instance-replacement";
    expect(
      prepareGatewaySuspendWithIdentity({
        requestId: "request-process-bound",
        gatewayPid: process.pid + 1,
        launchdRunCount: 1,
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
      }),
    ).toEqual({ status: "process-mismatch" });
    expect(
      prepareGatewaySuspend({
        requestId: "request-process-bound",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
        nowMs: () => 1_000,
        createSuspensionId: () => "suspension-process-bound",
        currentGatewayInstanceId: originalGatewayInstanceId,
      }),
    ).toMatchObject({
      status: "ready",
      suspensionId: "suspension-process-bound",
      gatewayInstanceId: originalGatewayInstanceId,
    });

    expect(
      getGatewaySuspendStatusWithIdentity(
        {
          suspensionId: "suspension-process-bound",
          gatewayInstanceId: originalGatewayInstanceId,
        },
        replacementGatewayInstanceId,
      ),
    ).toEqual({ status: "process-mismatch" });
    expect(
      prepareGatewaySuspend({
        requestId: "request-process-bound",
        gatewayInstanceId: originalGatewayInstanceId,
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
        nowMs: () => 2_000,
        currentGatewayInstanceId: replacementGatewayInstanceId,
      }),
    ).toEqual({ status: "process-mismatch" });
    expect(
      resumeGatewaySuspendWithIdentity(
        {
          suspensionId: "suspension-process-bound",
          gatewayInstanceId: originalGatewayInstanceId,
          resumeBeforeMs: 30_000,
        },
        replacementGatewayInstanceId,
        () => 2_000,
      ),
    ).toEqual({ ok: false, reason: "process-mismatch" });
    expect(resumeScheduling).not.toHaveBeenCalled();
    expect(isGatewayWorkAdmissionClosed()).toBe(true);
  });

  it("rejects an expired resume deadline before reopening admission", () => {
    const resumeScheduling = vi.fn();
    const gatewayInstanceId = "gateway-instance-deadline";
    prepareGatewaySuspend({
      requestId: "request-deadline",
      pauseScheduling: vi.fn(),
      resumeScheduling,
      inspect: inspectors(),
      nowMs: () => 1_000,
      createSuspensionId: () => "suspension-deadline",
      currentGatewayInstanceId: gatewayInstanceId,
    });

    expect(
      resumeGatewaySuspendWithIdentity(
        {
          suspensionId: "suspension-deadline",
          gatewayInstanceId,
          resumeBeforeMs: 1_500,
        },
        gatewayInstanceId,
        () => 1_501,
      ),
    ).toEqual({ ok: false, reason: "resume-authority-expired" });
    expect(resumeScheduling).not.toHaveBeenCalled();
  });

  it("rejects a resume deadline beyond the suspension lease", () => {
    const resumeScheduling = vi.fn();
    const gatewayInstanceId = "gateway-instance-overlong-deadline";
    prepareGatewaySuspend({
      requestId: "request-overlong-deadline",
      pauseScheduling: vi.fn(),
      resumeScheduling,
      inspect: inspectors(),
      nowMs: () => 1_000,
      createSuspensionId: () => "suspension-overlong-deadline",
      currentGatewayInstanceId: gatewayInstanceId,
    });

    expect(
      resumeGatewaySuspendWithIdentity(
        {
          suspensionId: "suspension-overlong-deadline",
          gatewayInstanceId,
          resumeBeforeMs: 1_000 + SUSPEND_TTL_MS + 1,
        },
        gatewayInstanceId,
        () => 1_000,
      ),
    ).toEqual({ ok: false, reason: "resume-authority-expired" });
    expect(resumeScheduling).not.toHaveBeenCalled();
    expect(isGatewayWorkAdmissionClosed()).toBe(true);
  });

  it("persists the deadline across a scheduler failure and expires without reopening", () => {
    vi.useFakeTimers();
    const directory = mkdtempSync(join(tmpdir(), "openclaw-resume-deadline-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    let nowMs = 1_000;
    const resumeScheduling = vi.fn(() => {
      throw new Error("injected scheduler resume failure");
    });
    const gatewayInstanceId = "gateway-instance-resume-deadline";
    try {
      prepareGatewaySuspend({
        requestId: "request-resume-deadline",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
        nowMs: () => nowMs,
        createSuspensionId: () => "suspension-resume-deadline",
        currentGatewayInstanceId: gatewayInstanceId,
        durableHandoffPath,
      });
      expect(
        resumeGatewaySuspendWithIdentity(
          {
            suspensionId: "suspension-resume-deadline",
            gatewayInstanceId,
            resumeBeforeMs: 1_500,
          },
          gatewayInstanceId,
          () => nowMs,
        ),
      ).toMatchObject({ ok: false, reason: "scheduler-resume-failed" });
      expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
        resumeState: "resume-pending",
        resumeBeforeMs: 1_500,
      });

      nowMs = 1_500;
      vi.advanceTimersByTime(1_000);

      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
        resumeState: "resume-expired",
        resumeBeforeMs: 1_500,
      });
    } finally {
      vi.useRealTimers();
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each([
    ["before", 1_499],
    ["at", 1_500],
  ])("re-adopts a pending resume fence %s its deadline", (_label, restartNowMs) => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-resume-restart-"));
    const durableHandoffPath = join(directory, "gateway-suspend-handoff.json");
    const gatewayInstanceId = "gateway-instance-resume-restart";
    const resumeScheduling = vi.fn(() => {
      throw new Error("injected scheduler resume failure");
    });
    try {
      prepareGatewaySuspend({
        requestId: "request-resume-restart",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
        nowMs: () => 1_000,
        createSuspensionId: () => "suspension-resume-restart",
        currentGatewayInstanceId: gatewayInstanceId,
        durableHandoffPath,
      });
      resumeGatewaySuspendWithIdentity(
        {
          suspensionId: "suspension-resume-restart",
          gatewayInstanceId,
          resumeBeforeMs: 1_500,
        },
        gatewayInstanceId,
        () => 1_000,
      );

      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      expect(
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath,
          nowMs: () => restartNowMs,
          currentGatewayInstanceId: "successor-instance",
        }),
      ).toBe(true);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(JSON.parse(readFileSync(durableHandoffPath, "utf8"))).toMatchObject({
        resumeState: restartNowMs === 1_500 ? "resume-expired" : "resume-pending",
        resumeBeforeMs: 1_500,
      });
      expect(
        resumeGatewaySuspendWithIdentity(
          {
            suspensionId: "suspension-resume-restart",
            gatewayInstanceId: "successor-instance",
            resumeBeforeMs: 1_500,
          },
          "successor-instance",
          () => restartNowMs,
        ),
      ).toEqual({ ok: false, reason: "suspension-mismatch" });
      expect(
        prepareGatewaySuspend({
          requestId: "request-resume-restart",
          pauseScheduling: vi.fn(),
          resumeScheduling: vi.fn(),
          inspect: inspectors(),
          currentGatewayInstanceId: "successor-instance",
        }),
      ).toMatchObject({ status: "conflict" });
      expect(
        getGatewaySuspendStatusWithIdentity(
          {
            suspensionId: "suspension-resume-restart",
            gatewayInstanceId: "successor-instance",
          },
          "successor-instance",
        ),
      ).toMatchObject({ status: "ready" });
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("lets restart supersede a suspension without reopening its scheduler", () => {
    const resumeScheduling = vi.fn();
    const result = prepareGatewaySuspend({
      requestId: "request-restart",
      pauseScheduling: vi.fn(),
      resumeScheduling,
      inspect: inspectors(),
      createSuspensionId: () => "suspension-restart",
    });
    expect(result.status).toBe("ready");

    markGatewayRestartDraining();

    expect(getGatewaySuspendStatus("suspension-restart")).toEqual({ status: "running" });
    expect(resumeScheduling).not.toHaveBeenCalled();
    expect(isGatewayWorkAdmissionClosed()).toBe(true);
  });

  it("retains resume authority while retrying a ready lease scheduler failure", () => {
    vi.useFakeTimers();
    try {
      const resumeScheduling = vi
        .fn()
        .mockImplementationOnce(() => {
          throw new Error("timer unavailable");
        })
        .mockImplementationOnce(() => {});
      prepareGatewaySuspend({
        requestId: "request-resume-retry",
        pauseScheduling: vi.fn(),
        resumeScheduling,
        inspect: inspectors(),
        createSuspensionId: () => "suspension-resume-retry",
      });

      expect(resumeGatewaySuspend("suspension-resume-retry")).toMatchObject({
        ok: false,
        reason: "scheduler-resume-failed",
      });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(getGatewaySuspendStatus("suspension-resume-retry")).toMatchObject({
        status: "ready",
      });
      expect(
        prepareGatewaySuspend({
          requestId: "request-conflicting-resume-retry",
          pauseScheduling: vi.fn(),
          resumeScheduling,
          inspect: inspectors(),
        }),
      ).toMatchObject({ status: "conflict" });

      vi.advanceTimersByTime(1_000);
      expect(resumeScheduling).toHaveBeenCalledTimes(2);
      expect(getGatewaySuspendStatus("suspension-resume-retry")).toEqual({ status: "running" });
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
