import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  existsSync,
  linkSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GATEWAY_SUSPEND_MODE_DURABLE,
  type GatewaySuspendReleaseCommittedReceipt,
} from "../../packages/gateway-protocol/src/index.js";
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
import {
  beginDurableHandoffRelease,
  compareAndSwapPrivateDurableBytes,
  createGatewaySuspendHandoff,
  readDurableHandoff,
  recoverPrivateDurableBytesCompareAndSwap,
} from "./gateway-suspend-handoff.js";
import { deletePrivateDurableBytesCompareAndSwapForTest } from "./gateway-suspend-handoff.test-support.js";
import {
  commitGatewaySuspendRelease,
  completeGatewaySuspendRelease,
  GATEWAY_SUSPEND_RELEASE_SCHEMA,
  readGatewaySuspendReleaseReceipt,
  resolveGatewaySuspendReleasePath,
} from "./gateway-suspend-release.js";

function sha256(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function releaseAuthority(seed: string) {
  const releaseAuthoritySha256 = sha256(seed);
  return {
    releaseAuthoritySha256,
    releaseRequestId: `handoff-v2-release:${releaseAuthoritySha256.slice(0, 32)}`,
  };
}

function requireReady(result: ReturnType<typeof prepareGatewaySuspend>) {
  if (result.status !== "ready") {
    throw new Error(`expected ready, got ${result.status}`);
  }
  return result;
}

function prepareFence(params: {
  path: string;
  requestId: string;
  suspensionId: string;
  gatewayInstanceId?: string;
  nowMs?: () => number;
  pauseScheduling?: () => void;
  resumeScheduling?: () => void;
}) {
  const gatewayInstanceId = params.gatewayInstanceId ?? "gateway-instance-1";
  return requireReady(
    prepareGatewaySuspend({
      requestId: params.requestId,
      gatewayPid: process.pid,
      launchdRunCount: 1,
      suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
      currentGatewayInstanceId: gatewayInstanceId,
      currentGatewayPid: process.pid,
      pauseScheduling: params.pauseScheduling ?? vi.fn(),
      resumeScheduling: params.resumeScheduling ?? vi.fn(),
      nowMs: params.nowMs ?? (() => 1_000),
      createSuspensionId: () => params.suspensionId,
      durableHandoffPath: params.path,
    }),
  );
}

function committedReceipt(
  handoff: NonNullable<ReturnType<typeof readDurableHandoff>>["handoff"],
): GatewaySuspendReleaseCommittedReceipt {
  if (
    handoff.resumeState !== "release-pending" ||
    handoff.resumeBeforeMs === null ||
    handoff.releaseRequestId === undefined ||
    handoff.releaseAuthoritySha256 === undefined ||
    handoff.releaseCommittedAtMs === undefined
  ) {
    throw new Error("test handoff is not release-pending");
  }
  return {
    schema: GATEWAY_SUSPEND_RELEASE_SCHEMA,
    status: "release_committed",
    releaseRequestId: handoff.releaseRequestId,
    releaseAuthoritySha256: handoff.releaseAuthoritySha256,
    suspendRequestId: handoff.requestId,
    suspensionId: handoff.suspensionId,
    gatewayInstanceId: handoff.gatewayInstanceId,
    gatewayPid: handoff.gatewayPid,
    launchdRunCount: handoff.launchdRunCount,
    suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
    resumeBeforeMs: handoff.resumeBeforeMs,
    committedAtMs: handoff.releaseCommittedAtMs,
    requiredAdmissionReopened: true,
    requiredSchedulerReopened: true,
    nonReusable: true,
  };
}

function writePrivate(path: string, bytes: Buffer): void {
  writeFileSync(path, bytes, { flag: "wx", mode: 0o600 });
}

function replaceHandoffWithNewerGeneration(path: string): void {
  const active = readDurableHandoff(path)?.handoff;
  if (!active) {
    throw new Error("test replacement lacks an active handoff");
  }
  const replacement = createGatewaySuspendHandoff({
    suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
    requestId: `${active.requestId}-newer`,
    suspensionId: `${active.suspensionId}-newer`,
    gatewayInstanceId: active.gatewayInstanceId,
    gatewayPid: active.gatewayPid,
    launchdRunCount: active.launchdRunCount + 1,
    expiresAtMs: active.expiresAtMs + 1_000,
    resumeState: "held",
    resumeBeforeMs: null,
  });
  const replacementPath = `${path}.test-replacement`;
  writePrivate(replacementPath, Buffer.from(`${JSON.stringify(replacement)}\n`, "utf8"));
  renameSync(replacementPath, path);
}

function casLockBytes(
  expected: Buffer | null,
  replacement: Buffer | null,
  operation: "delete" | "replace" = "replace",
): Buffer {
  return Buffer.from(
    `${JSON.stringify({
      expectedSha256: expected === null ? null : sha256(expected),
      operation,
      ownerPid: 2_147_483_647,
      ownerStartTime: null,
      replacementSha256: replacement === null ? null : sha256(replacement),
      schema: "openclaw-private-durable-cas/v2",
      txId: randomUUID(),
    })}\n`,
    "utf8",
  );
}

beforeEach(() => {
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

afterEach(() => {
  resetGatewaySuspendCoordinatorForLifecycleRestart();
  resetGatewayWorkAdmission();
});

describe("gateway durable release tombstones", () => {
  it("persists committed then completed evidence and rejects replay against a later generation", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-release-complete-"));
    const handoffPath = join(directory, "gateway-suspend-handoff.json");
    const pauseScheduling = vi.fn();
    const resumeScheduling = vi.fn();
    try {
      const prepared = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-1",
        suspensionId: "shared-suspension-id",
        pauseScheduling,
        resumeScheduling,
      });
      const authority = releaseAuthority("release-generation-1");
      const releaseParams = {
        suspensionId: prepared.suspensionId,
        gatewayInstanceId: prepared.gatewayInstanceId,
        resumeBeforeMs: prepared.expiresAtMs - 1,
        suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
        ...authority,
      } as const;

      const resumed = resumeGatewaySuspend(releaseParams, prepared.gatewayInstanceId, () => 2_000, {
        durableHandoffPath: handoffPath,
      });
      expect(resumed).toMatchObject({
        ok: true,
        status: "running",
        resumed: true,
        releaseReceipt: {
          status: "release_completed",
          ...authority,
          suspendRequestId: "suspend-request-1",
          suspensionId: "shared-suspension-id",
        },
      });
      if (!resumed.ok || resumed.suspendMode !== GATEWAY_SUSPEND_MODE_DURABLE) {
        throw new Error("expected a durable release result");
      }
      expect(existsSync(handoffPath)).toBe(false);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(
        getGatewaySuspendStatus(
          { suspendMode: GATEWAY_SUSPEND_MODE_DURABLE, ...authority },
          prepared.gatewayInstanceId,
          handoffPath,
        ),
      ).toMatchObject({ status: "release_completed", ...authority });
      expect(
        resumeGatewaySuspend(releaseParams, prepared.gatewayInstanceId, () => 3_000, {
          durableHandoffPath: handoffPath,
        }),
      ).toMatchObject({ ok: true, resumed: false, releaseReceipt: resumed.releaseReceipt });

      const later = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-2",
        suspensionId: "shared-suspension-id",
        pauseScheduling,
        resumeScheduling,
      });
      expect(
        resumeGatewaySuspend(
          {
            ...releaseParams,
            gatewayInstanceId: later.gatewayInstanceId,
            resumeBeforeMs: later.expiresAtMs - 1,
          },
          later.gatewayInstanceId,
          () => 2_000,
          { durableHandoffPath: handoffPath },
        ),
      ).toEqual({ ok: false, reason: "suspension-mismatch" });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(JSON.parse(readFileSync(handoffPath, "utf8"))).toMatchObject({
        requestId: "suspend-request-2",
        resumeState: "held",
      });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("reconstructs release_committed at startup and completes it across a process generation", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-release-startup-"));
    const handoffPath = join(directory, "gateway-suspend-handoff.json");
    let nowMs = 1_000;
    try {
      const prepared = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-startup",
        suspensionId: "suspension-startup",
        nowMs: () => nowMs,
      });
      const authority = releaseAuthority("release-startup");
      const active = readDurableHandoff(handoffPath);
      if (!active) {
        throw new Error("test handoff is missing");
      }
      const pending = beginDurableHandoffRelease({
        path: handoffPath,
        expected: active.handoff,
        ...authority,
        resumeBeforeMs: prepared.expiresAtMs - 1,
        committedAtMs: nowMs,
      });
      const releasePath = resolveGatewaySuspendReleasePath(
        handoffPath,
        authority.releaseRequestId,
        authority.releaseAuthoritySha256,
      );
      expect(readGatewaySuspendReleaseReceipt(releasePath)).toBeNull();
      expect(
        getGatewaySuspendStatus(
          { suspendMode: GATEWAY_SUSPEND_MODE_DURABLE, ...authority },
          prepared.gatewayInstanceId,
          handoffPath,
        ),
      ).toMatchObject({
        status: "release_recovery_needed",
        releaseReceipt: {
          status: "release_committed",
          gatewayInstanceId: pending.gatewayInstanceId,
          ...authority,
        },
      });

      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      nowMs = prepared.expiresAtMs + 10_000;
      expect(
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath: handoffPath,
          currentGatewayInstanceId: "gateway-instance-2",
          currentGatewayPid: process.pid,
          nowMs: () => nowMs,
        }),
      ).toBe(true);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(
        getGatewaySuspendStatus(
          { suspendMode: GATEWAY_SUSPEND_MODE_DURABLE, ...authority },
          "gateway-instance-2",
          handoffPath,
        ),
      ).toMatchObject({
        status: "release_recovery_needed",
        releaseReceipt: {
          status: "release_committed",
          gatewayInstanceId: pending.gatewayInstanceId,
          ...authority,
        },
      });

      const pauseScheduling = vi.fn();
      const resumeScheduling = vi.fn();
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: pending.suspensionId,
            gatewayInstanceId: pending.gatewayInstanceId,
            resumeBeforeMs: pending.resumeBeforeMs!,
            suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
            ...authority,
          },
          "gateway-instance-2",
          () => nowMs,
          {
            durableHandoffPath: handoffPath,
            pauseScheduling,
            resumeScheduling,
          },
        ),
      ).toMatchObject({
        ok: true,
        resumed: true,
        gatewayInstanceId: "gateway-instance-2",
        releaseReceipt: { status: "release_completed", ...authority },
      });
      expect(pauseScheduling).toHaveBeenCalledOnce();
      expect(resumeScheduling).toHaveBeenCalledOnce();
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(existsSync(handoffPath)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("clears a pending handoff at startup when release_completed is already durable", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-release-completed-startup-"));
    const handoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      const prepared = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-completed",
        suspensionId: "suspension-completed",
      });
      const authority = releaseAuthority("release-completed-startup");
      const active = readDurableHandoff(handoffPath);
      if (!active) {
        throw new Error("test handoff is missing");
      }
      const pending = beginDurableHandoffRelease({
        path: handoffPath,
        expected: active.handoff,
        ...authority,
        resumeBeforeMs: prepared.expiresAtMs - 1,
        committedAtMs: 1_000,
      });
      const committed = committedReceipt(pending);
      expect(
        commitGatewaySuspendRelease({
          handoffPath,
          expectedHandoff: pending,
          receipt: committed,
        }),
      ).toEqual(committed);
      const releasePath = resolveGatewaySuspendReleasePath(
        handoffPath,
        authority.releaseRequestId,
        authority.releaseAuthoritySha256,
      );
      expect(
        completeGatewaySuspendRelease({
          releasePath,
          committed,
          completedAtMs: 2_000,
        }),
      ).toMatchObject({ status: "release_completed" });
      expect(
        getGatewaySuspendStatus(
          { suspendMode: GATEWAY_SUSPEND_MODE_DURABLE, ...authority },
          prepared.gatewayInstanceId,
          handoffPath,
        ),
      ).toMatchObject({
        status: "release_recovery_needed",
        releaseReceipt: { status: "release_committed", ...authority },
      });

      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      expect(
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath: handoffPath,
          currentGatewayInstanceId: "gateway-instance-after-completion",
          currentGatewayPid: process.pid,
        }),
      ).toBe(false);
      expect(existsSync(handoffPath)).toBe(false);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(readGatewaySuspendReleaseReceipt(releasePath)?.receipt).toMatchObject({
        status: "release_completed",
        ...authority,
      });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("keeps completion nonterminal and re-closes admission until handoff cleanup is durable", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-release-cleanup-retry-"));
    const handoffPath = join(directory, "gateway-suspend-handoff.json");
    const pauseScheduling = vi.fn();
    const resumeScheduling = vi.fn();
    try {
      const prepared = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-cleanup",
        suspensionId: "suspension-cleanup",
        pauseScheduling,
        resumeScheduling,
      });
      const authority = releaseAuthority("release-cleanup-retry");
      const releaseParams = {
        suspensionId: prepared.suspensionId,
        gatewayInstanceId: prepared.gatewayInstanceId,
        resumeBeforeMs: prepared.expiresAtMs - 1,
        suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
        ...authority,
      } as const;
      const first = resumeGatewaySuspend(releaseParams, prepared.gatewayInstanceId, () => 2_000, {
        durableHandoffPath: handoffPath,
        afterReleaseCompleted: () => chmodSync(directory, 0o500),
      });
      chmodSync(directory, 0o700);
      expect(first).toEqual({
        ok: false,
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      expect(existsSync(handoffPath)).toBe(true);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(
        getGatewaySuspendStatus(
          { suspendMode: GATEWAY_SUSPEND_MODE_DURABLE, ...authority },
          prepared.gatewayInstanceId,
          handoffPath,
        ),
      ).toMatchObject({
        status: "release_recovery_needed",
        releaseReceipt: { status: "release_committed", ...authority },
      });

      expect(
        resumeGatewaySuspend(releaseParams, prepared.gatewayInstanceId, () => 3_000, {
          durableHandoffPath: handoffPath,
        }),
      ).toMatchObject({
        ok: true,
        status: "running",
        releaseReceipt: { status: "release_completed", ...authority },
      });
      expect(existsSync(handoffPath)).toBe(false);
      expect(isGatewayWorkAdmissionClosed()).toBe(false);
      expect(pauseScheduling).toHaveBeenCalledTimes(2);
      expect(resumeScheduling).toHaveBeenCalledTimes(2);
    } finally {
      chmodSync(directory, 0o700);
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("never deletes or overwrites a newer fence during synchronous completed cleanup", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-release-cleanup-race-"));
    const handoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      const prepared = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-race",
        suspensionId: "suspension-race",
      });
      const authority = releaseAuthority("release-cleanup-race");
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: prepared.suspensionId,
            gatewayInstanceId: prepared.gatewayInstanceId,
            resumeBeforeMs: prepared.expiresAtMs - 1,
            suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
            ...authority,
          },
          prepared.gatewayInstanceId,
          () => 2_000,
          {
            durableHandoffPath: handoffPath,
            afterReleaseCompleted: () => replaceHandoffWithNewerGeneration(handoffPath),
          },
        ),
      ).toEqual({
        ok: false,
        reason: "scheduler-resume-failed",
        retryAfterMs: 1_000,
      });
      expect(readDurableHandoff(handoffPath)?.handoff).toMatchObject({
        requestId: "suspend-request-race-newer",
        suspensionId: "suspension-race-newer",
        resumeState: "held",
      });
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("preserves a newer fence and aborts startup completed cleanup", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-release-startup-race-"));
    const handoffPath = join(directory, "gateway-suspend-handoff.json");
    try {
      const prepared = prepareFence({
        path: handoffPath,
        requestId: "suspend-request-startup-race",
        suspensionId: "suspension-startup-race",
      });
      const authority = releaseAuthority("release-startup-race");
      const active = readDurableHandoff(handoffPath);
      if (!active) {
        throw new Error("test handoff is missing");
      }
      const pending = beginDurableHandoffRelease({
        path: handoffPath,
        expected: active.handoff,
        ...authority,
        resumeBeforeMs: prepared.expiresAtMs - 1,
        committedAtMs: 1_000,
      });
      const committed = committedReceipt(pending);
      commitGatewaySuspendRelease({
        handoffPath,
        expectedHandoff: pending,
        receipt: committed,
      });
      completeGatewaySuspendRelease({
        releasePath: resolveGatewaySuspendReleasePath(
          handoffPath,
          authority.releaseRequestId,
          authority.releaseAuthoritySha256,
        ),
        committed,
        completedAtMs: 2_000,
      });

      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      expect(() =>
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath: handoffPath,
          currentGatewayInstanceId: "gateway-instance-startup-race",
          currentGatewayPid: process.pid,
          beforeCompletedReleaseCleanup: () => replaceHandoffWithNewerGeneration(handoffPath),
        }),
      ).toThrow("does not match the active durable fence");
      expect(readDurableHandoff(handoffPath)?.handoff).toMatchObject({
        requestId: "suspend-request-startup-race-newer",
        suspensionId: "suspension-startup-race-newer",
        resumeState: "held",
      });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

describe("private durable compare-and-swap recovery", () => {
  it("never overwrites a pre-existing create-only target", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-cas-no-overwrite-"));
    const path = join(directory, "receipt.json");
    try {
      const original = Buffer.from("original\n", "utf8");
      writePrivate(path, original);
      expect(() =>
        compareAndSwapPrivateDurableBytes(path, null, Buffer.from("replacement\n", "utf8")),
      ).toThrow("already exists");
      expect(readFileSync(path)).toEqual(original);
      expect(existsSync(`${path}.cas-lock`)).toBe(false);
      expect(existsSync(`${path}.cas-new`)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each([
    "create-lock-only",
    "create-candidate",
    "create-linked",
    "replace-candidate",
    "replace-linked-old",
    "replace-renamed",
    "replace-old-cleaned",
  ])("recovers the %s crash cut without ambiguous overwrite", (cut) => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-cas-cut-"));
    const path = join(directory, "receipt.json");
    const lockPath = `${path}.cas-lock`;
    const candidatePath = `${path}.cas-new`;
    const oldPath = `${path}.cas-old`;
    const previous = Buffer.from("previous\n", "utf8");
    const replacement = Buffer.from("replacement\n", "utf8");
    const createOnly = cut.startsWith("create-");
    try {
      if (!createOnly) {
        writePrivate(path, previous);
      }
      writePrivate(lockPath, casLockBytes(createOnly ? null : previous, replacement));
      if (cut !== "create-lock-only") {
        writePrivate(candidatePath, replacement);
      }
      if (cut === "create-linked") {
        linkSync(candidatePath, path);
      }
      if (cut === "replace-linked-old" || cut === "replace-renamed") {
        linkSync(path, oldPath);
      }
      if (cut === "replace-renamed") {
        renameSync(candidatePath, path);
      }
      if (cut === "replace-old-cleaned") {
        unlinkSync(path);
        renameSync(candidatePath, path);
      }

      recoverPrivateDurableBytesCompareAndSwap(
        path,
        (before, after) => before.equals(previous) && after.equals(replacement),
      );

      const committed =
        cut === "create-linked" || cut === "replace-renamed" || cut === "replace-old-cleaned";
      if (committed) {
        expect(readFileSync(path)).toEqual(replacement);
      } else if (createOnly) {
        expect(existsSync(path)).toBe(false);
      } else {
        expect(readFileSync(path)).toEqual(previous);
      }
      expect(existsSync(lockPath)).toBe(false);
      expect(existsSync(candidatePath)).toBe(false);
      expect(existsSync(oldPath)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each(["delete-lock-only", "delete-linked", "delete-unlinked", "delete-cleaned"])(
    "recovers the %s crash cut with an identity-bound outcome",
    (cut) => {
      const directory = mkdtempSync(join(tmpdir(), "openclaw-delete-cas-cut-"));
      const path = join(directory, "handoff.json");
      const lockPath = `${path}.cas-lock`;
      const oldPath = `${path}.cas-old`;
      const expected = Buffer.from("expected fence\n", "utf8");
      try {
        if (cut !== "delete-unlinked" && cut !== "delete-cleaned") {
          writePrivate(path, expected);
        }
        writePrivate(lockPath, casLockBytes(expected, null, "delete"));
        if (cut === "delete-linked") {
          linkSync(path, oldPath);
        } else if (cut === "delete-unlinked") {
          writePrivate(oldPath, expected);
        }

        recoverPrivateDurableBytesCompareAndSwap(path, () => false);

        if (cut === "delete-lock-only" || cut === "delete-linked") {
          expect(readFileSync(path)).toEqual(expected);
        } else {
          expect(existsSync(path)).toBe(false);
        }
        expect(existsSync(lockPath)).toBe(false);
        expect(existsSync(oldPath)).toBe(false);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
  );

  it("preserves a competing replacement at the exact delete boundary", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-delete-cas-race-"));
    const path = join(directory, "handoff.json");
    const replacementPath = join(directory, "replacement.json");
    const expected = Buffer.from("expected fence\n", "utf8");
    const replacement = Buffer.from("newer fence\n", "utf8");
    try {
      writePrivate(path, expected);
      expect(() =>
        deletePrivateDurableBytesCompareAndSwapForTest(path, expected, {
          beforeDeleteCommit: () => {
            writePrivate(replacementPath, replacement);
            renameSync(replacementPath, path);
          },
        }),
      ).toThrow("changed at the CAS deletion boundary");
      expect(readFileSync(path)).toEqual(replacement);
      expect(existsSync(`${path}.cas-lock`)).toBe(true);
      expect(readFileSync(`${path}.cas-old`)).toEqual(expected);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("serializes a cooperating writer behind an in-flight delete", () => {
    const directory = mkdtempSync(join(tmpdir(), "openclaw-delete-cas-writer-lock-"));
    const path = join(directory, "handoff.json");
    const expected = Buffer.from("expected fence\n", "utf8");
    const replacement = Buffer.from("newer fence\n", "utf8");
    try {
      writePrivate(path, expected);
      deletePrivateDurableBytesCompareAndSwapForTest(path, expected, {
        beforeDeleteCommit: () => {
          expect(() => compareAndSwapPrivateDurableBytes(path, null, replacement)).toThrow();
          expect(readFileSync(path)).toEqual(expected);
        },
      });
      expect(existsSync(path)).toBe(false);
      expect(existsSync(`${path}.cas-lock`)).toBe(false);
      expect(existsSync(`${path}.cas-old`)).toBe(false);
      expect(existsSync(`${path}.cas-new`)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
