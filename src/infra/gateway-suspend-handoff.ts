import { createHash, randomUUID } from "node:crypto";
import {
  closeSync,
  constants,
  fstatSync,
  fsyncSync,
  linkSync,
  openSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
  type Stats,
} from "node:fs";
import { dirname } from "node:path";
import {
  GATEWAY_SUSPEND_MODE_DURABLE,
  GATEWAY_SUSPEND_MODE_LEGACY,
  type GatewaySuspendMode,
} from "../../packages/gateway-protocol/src/index.js";
import { getFileLockProcessStartTime, isPidAlive } from "../shared/pid-alive.js";

export const GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY = "openclaw-gateway-suspend-handoff/v2";
export const GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE = "openclaw-gateway-suspend-handoff/v3";
export const GATEWAY_SUSPEND_HANDOFF_SCHEMA = GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY;

type GatewaySuspendHandoffValue = {
  requestId: string;
  suspensionId: string;
  gatewayInstanceId: string;
  gatewayPid: number;
  launchdRunCount: number;
  expiresAtMs: number;
  resumeState:
    | "held"
    | "resume-pending"
    | "resume-expired"
    | "resume-reopen-authorized"
    | "resume-cleanup"
    | "release-pending";
  resumeBeforeMs: number | null;
  releaseRequestId?: string;
  releaseAuthoritySha256?: string;
  releaseCommittedAtMs?: number;
};

type LegacyGatewaySuspendHandoff = GatewaySuspendHandoffValue & {
  schema: typeof GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY;
};

type DurableGatewaySuspendHandoff = GatewaySuspendHandoffValue & {
  schema: typeof GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE;
  suspendMode: typeof GATEWAY_SUSPEND_MODE_DURABLE;
};

export type GatewaySuspendHandoff = LegacyGatewaySuspendHandoff | DurableGatewaySuspendHandoff;

export function createGatewaySuspendHandoff(
  value: GatewaySuspendHandoffValue & { suspendMode: GatewaySuspendMode },
): GatewaySuspendHandoff {
  const { suspendMode, ...handoff } = value;
  return suspendMode === GATEWAY_SUSPEND_MODE_DURABLE
    ? {
        schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE,
        suspendMode,
        ...handoff,
      }
    : { schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY, ...handoff };
}

export function gatewaySuspendModeForHandoff(handoff: GatewaySuspendHandoff): GatewaySuspendMode {
  return handoff.schema === GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE
    ? handoff.suspendMode
    : GATEWAY_SUSPEND_MODE_LEGACY;
}

function gatewaySuspendHandoffBytes(handoff: GatewaySuspendHandoff): Buffer {
  return Buffer.from(`${JSON.stringify(handoff)}\n`, "utf8");
}

function gatewaySuspendHandoffIdentity(handoff: GatewaySuspendHandoff): string {
  const normalized = Object.fromEntries(
    Object.entries(handoff).toSorted(([left], [right]) => left.localeCompare(right)),
  );
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

function syncDirectory(path: string): void {
  const descriptor = openSync(path, constants.O_RDONLY);
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function assertPrivateHandoffStat(stat: Stats, allowedLinkCount = 1): void {
  if (
    !stat.isFile() ||
    stat.nlink !== allowedLinkCount ||
    (stat.mode & 0o077) !== 0 ||
    (typeof process.getuid === "function" && stat.uid !== process.getuid())
  ) {
    throw new Error("gateway suspension handoff must be a private owner-controlled regular file");
  }
}

function readPrivateDurableFileOnce(
  path: string,
  allowedLinkCounts: readonly number[] = [1],
): { bytes: Buffer; stat: Stats } {
  const descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = fstatSync(descriptor);
    if (!allowedLinkCounts.includes(before.nlink)) {
      throw new Error("gateway suspension handoff has an invalid link count");
    }
    assertPrivateHandoffStat(before, before.nlink);
    const bytes = readFileSync(descriptor);
    const after = fstatSync(descriptor);
    if (
      before.dev !== after.dev ||
      before.ino !== after.ino ||
      before.size !== after.size ||
      before.mtimeMs !== after.mtimeMs ||
      before.ctimeMs !== after.ctimeMs
    ) {
      throw new Error("gateway suspension handoff changed while it was read");
    }
    return { bytes, stat: after };
  } finally {
    closeSync(descriptor);
  }
}

function readPrivateDurableBytesOnce(path: string): Buffer {
  return readPrivateDurableFileOnce(path).bytes;
}

export function readPrivateDurableBytes(path: string): Buffer | null {
  try {
    return readPrivateDurableBytesOnce(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    syncDirectory(dirname(path));
    try {
      return readPrivateDurableBytesOnce(path);
    } catch (retryError) {
      if ((retryError as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw retryError;
    }
  }
}

export function provePrivateDurableBytes(path: string, expectedBytes: Buffer): void {
  const descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  let synced: Stats;
  try {
    assertPrivateHandoffStat(fstatSync(descriptor));
    fsyncSync(descriptor);
    synced = fstatSync(descriptor);
    assertPrivateHandoffStat(synced);
  } finally {
    closeSync(descriptor);
  }
  syncDirectory(dirname(path));
  const currentDescriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const current = fstatSync(currentDescriptor);
    assertPrivateHandoffStat(current);
    const actual = readFileSync(currentDescriptor);
    const after = fstatSync(currentDescriptor);
    if (
      synced.dev !== current.dev ||
      synced.ino !== current.ino ||
      synced.size !== current.size ||
      synced.mtimeMs !== current.mtimeMs ||
      synced.ctimeMs !== current.ctimeMs ||
      current.dev !== after.dev ||
      current.ino !== after.ino ||
      current.size !== after.size ||
      current.mtimeMs !== after.mtimeMs ||
      current.ctimeMs !== after.ctimeMs ||
      !actual.equals(expectedBytes)
    ) {
      throw new Error("gateway suspension handoff changed during durability proof");
    }
  } finally {
    closeSync(currentDescriptor);
  }
}

export function proveDurableHandoffBytes(path: string, expectedBytes: Buffer): void {
  provePrivateDurableBytes(path, expectedBytes);
}

export function persistPrivateDurableBytes(path: string, bytes: Buffer): void {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
    throw new Error("private durable file bytes are required");
  }
  compareAndSwapPrivateDurableBytes(path, null, bytes);
}

export function recoverPrivateDurableBytesCompareAndSwap(
  path: string,
  isValidReplacement: (previousBytes: Buffer, currentBytes: Buffer) => boolean,
  options: { allowLiveOwner?: boolean } = {},
): void {
  const lockPath = `${path}.cas-lock`;
  const oldPath = `${path}.cas-old`;
  const candidatePath = `${path}.cas-new`;
  let lockBytes: Buffer;
  try {
    lockBytes = readPrivateDurableBytesOnce(lockPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw error;
  }
  let lockValue: unknown;
  try {
    lockValue = JSON.parse(lockBytes.toString("utf8"));
  } catch {
    throw new Error("private durable file CAS lock is malformed");
  }
  if (
    !isRecord(lockValue) ||
    Object.keys(lockValue).toSorted().join(",") !==
      "expectedSha256,operation,ownerPid,ownerStartTime,replacementSha256,schema,txId" ||
    lockValue.schema !== "openclaw-private-durable-cas/v2" ||
    (lockValue.operation !== "replace" && lockValue.operation !== "delete") ||
    typeof lockValue.txId !== "string" ||
    !/^[a-f0-9-]{36}$/u.test(lockValue.txId) ||
    !Number.isSafeInteger(lockValue.ownerPid) ||
    Number(lockValue.ownerPid) < 1 ||
    (lockValue.ownerStartTime !== null &&
      (!Number.isSafeInteger(lockValue.ownerStartTime) || Number(lockValue.ownerStartTime) < 0)) ||
    (lockValue.expectedSha256 !== null &&
      (typeof lockValue.expectedSha256 !== "string" ||
        !/^[a-f0-9]{64}$/u.test(lockValue.expectedSha256))) ||
    (lockValue.replacementSha256 !== null &&
      (typeof lockValue.replacementSha256 !== "string" ||
        !/^[a-f0-9]{64}$/u.test(lockValue.replacementSha256))) ||
    (lockValue.operation === "replace" && lockValue.replacementSha256 === null) ||
    (lockValue.operation === "delete" && lockValue.replacementSha256 !== null)
  ) {
    throw new Error("private durable file CAS lock is invalid");
  }
  const ownerPid = Number(lockValue.ownerPid);
  const ownerStartTime =
    lockValue.ownerStartTime === null ? null : Number(lockValue.ownerStartTime);
  if (!options.allowLiveOwner && isPidAlive(ownerPid)) {
    const observedStartTime = getFileLockProcessStartTime(ownerPid);
    if (
      ownerPid === process.pid ||
      ownerStartTime === null ||
      observedStartTime === null ||
      ownerStartTime === observedStartTime
    ) {
      throw new Error("private durable file CAS is owned by a live process");
    }
  }
  const expectedSha256 = lockValue.expectedSha256 as string | null;
  const replacementSha256 = lockValue.replacementSha256 as string | null;
  const operation = lockValue.operation as "delete" | "replace";
  const readOptional = (candidate: string, allowedLinkCounts: readonly number[] = [1]) => {
    try {
      return readPrivateDurableFileOnce(candidate, allowedLinkCounts);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    }
  };
  const current = readOptional(path, [1, 2]);
  const old = readOptional(oldPath, [1, 2]);
  const candidate = readOptional(candidatePath, [1, 2]);
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  if (current === null && old !== null) {
    if (expectedSha256 === null || digest(old.bytes) !== expectedSha256) {
      throw new Error("private durable file CAS old bytes do not match the transaction");
    }
    if (operation === "delete") {
      if (candidate !== null) {
        throw new Error("private durable file delete CAS unexpectedly has a candidate");
      }
      unlinkSync(oldPath);
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      return;
    }
    renameSync(oldPath, path);
    if (candidate !== null) {
      unlinkSync(candidatePath);
    }
    unlinkSync(lockPath);
    syncDirectory(dirname(path));
    provePrivateDurableBytes(path, old.bytes);
    return;
  }
  if (current === null) {
    if (operation === "delete") {
      if (candidate !== null) {
        throw new Error("private durable file delete CAS unexpectedly has a candidate");
      }
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      return;
    }
    if (candidate !== null) {
      unlinkSync(candidatePath);
    }
    unlinkSync(lockPath);
    syncDirectory(dirname(path));
    return;
  }
  const currentSha256 = digest(current.bytes);
  if (old === null) {
    if (operation === "delete") {
      if (expectedSha256 !== null && currentSha256 === expectedSha256 && candidate === null) {
        unlinkSync(lockPath);
        syncDirectory(dirname(path));
        provePrivateDurableBytes(path, current.bytes);
        return;
      }
      throw new Error("private durable file delete CAS has an invalid recovery state");
    }
    if (
      currentSha256 === replacementSha256 &&
      (candidate === null ||
        (current.stat.dev === candidate.stat.dev && current.stat.ino === candidate.stat.ino))
    ) {
      if (candidate !== null) {
        unlinkSync(candidatePath);
      }
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      provePrivateDurableBytes(path, current.bytes);
      return;
    }
    if (currentSha256 === expectedSha256 && candidate === null) {
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      provePrivateDurableBytes(path, current.bytes);
      return;
    }
    if (
      currentSha256 === expectedSha256 &&
      candidate !== null &&
      digest(candidate.bytes) === replacementSha256
    ) {
      unlinkSync(candidatePath);
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      provePrivateDurableBytes(path, current.bytes);
      return;
    }
    throw new Error("private durable file CAS has an invalid create-only recovery state");
  }
  const oldSha256 = digest(old.bytes);
  if (expectedSha256 === null || oldSha256 !== expectedSha256) {
    throw new Error("private durable file CAS old bytes do not match the transaction");
  }
  if (operation === "delete") {
    if (candidate !== null) {
      throw new Error("private durable file delete CAS unexpectedly has a candidate");
    }
    if (
      current.stat.dev === old.stat.dev &&
      current.stat.ino === old.stat.ino &&
      currentSha256 === expectedSha256
    ) {
      unlinkSync(oldPath);
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      provePrivateDurableBytes(path, current.bytes);
      return;
    }
    throw new Error("private durable file delete CAS contains a mismatched target");
  }
  if (
    current.stat.dev === old.stat.dev &&
    current.stat.ino === old.stat.ino &&
    currentSha256 === expectedSha256 &&
    candidate !== null &&
    digest(candidate.bytes) === replacementSha256
  ) {
    unlinkSync(candidatePath);
    unlinkSync(oldPath);
    unlinkSync(lockPath);
    syncDirectory(dirname(path));
    provePrivateDurableBytes(path, current.bytes);
    return;
  }
  if (
    currentSha256 === replacementSha256 &&
    candidate === null &&
    isValidReplacement(old.bytes, current.bytes)
  ) {
    unlinkSync(oldPath);
    unlinkSync(lockPath);
    syncDirectory(dirname(path));
    provePrivateDurableBytes(path, current.bytes);
    return;
  }
  throw new Error("private durable file CAS contains a mismatched replacement");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function writePrivateDurableCandidate(path: string, bytes: Buffer): void {
  const descriptor = openSync(
    path,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

export function compareAndSwapPrivateDurableBytes(
  path: string,
  expectedBytes: Buffer | null,
  replacementBytes: Buffer,
): void {
  if (!Buffer.isBuffer(replacementBytes) || replacementBytes.length === 0) {
    throw new Error("private durable replacement bytes are required");
  }
  const candidatePath = `${path}.cas-new`;
  const oldPath = `${path}.cas-old`;
  const lockPath = `${path}.cas-lock`;
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  const lockBytes = Buffer.from(
    `${JSON.stringify({
      expectedSha256: expectedBytes === null ? null : digest(expectedBytes),
      operation: "replace",
      ownerPid: process.pid,
      ownerStartTime: getFileLockProcessStartTime(process.pid),
      replacementSha256: digest(replacementBytes),
      schema: "openclaw-private-durable-cas/v2",
      txId: randomUUID(),
    })}\n`,
    "utf8",
  );
  writePrivateDurableCandidate(lockPath, lockBytes);
  syncDirectory(dirname(path));
  writePrivateDurableCandidate(candidatePath, replacementBytes);
  try {
    if (expectedBytes === null) {
      if (readPrivateDurableBytes(path) !== null) {
        unlinkSync(candidatePath);
        unlinkSync(lockPath);
        syncDirectory(dirname(path));
        throw new Error("private durable file already exists before create-only CAS");
      }
      linkSync(candidatePath, path);
      syncDirectory(dirname(path));
      unlinkSync(candidatePath);
      syncDirectory(dirname(path));
      provePrivateDurableBytes(path, replacementBytes);
      unlinkSync(lockPath);
      syncDirectory(dirname(path));
      return;
    }
    linkSync(path, oldPath);
    const current = readPrivateDurableFileOnce(path, [2]);
    const old = readPrivateDurableFileOnce(oldPath, [2]);
    if (
      current.stat.dev !== old.stat.dev ||
      current.stat.ino !== old.stat.ino ||
      !current.bytes.equals(expectedBytes) ||
      !old.bytes.equals(expectedBytes)
    ) {
      throw new Error("private durable file changed before CAS replacement");
    }
    syncDirectory(dirname(path));
    renameSync(candidatePath, path);
    syncDirectory(dirname(path));
    provePrivateDurableBytes(path, replacementBytes);
    unlinkSync(oldPath);
    unlinkSync(lockPath);
    syncDirectory(dirname(path));
  } catch (error) {
    try {
      recoverPrivateDurableBytesCompareAndSwap(
        path,
        (previousBytes, currentBytes) =>
          expectedBytes !== null &&
          previousBytes.equals(expectedBytes) &&
          currentBytes.equals(replacementBytes),
        { allowLiveOwner: true },
      );
      const recovered = readPrivateDurableBytes(path);
      if (recovered?.equals(replacementBytes)) {
        provePrivateDurableBytes(path, replacementBytes);
        return;
      }
    } catch {
      // Preserve every mismatched artifact for fail-closed startup recovery.
    }
    throw error;
  }
}

export function deletePrivateDurableBytesCompareAndSwap(
  path: string,
  expectedBytes: Buffer,
  options: { beforeDeleteCommit?: () => void } = {},
): void {
  if (!Buffer.isBuffer(expectedBytes) || expectedBytes.length === 0) {
    throw new Error("private durable delete expected bytes are required");
  }
  const oldPath = `${path}.cas-old`;
  const lockPath = `${path}.cas-lock`;
  const expectedSha256 = createHash("sha256").update(expectedBytes).digest("hex");
  const lockBytes = Buffer.from(
    `${JSON.stringify({
      expectedSha256,
      operation: "delete",
      ownerPid: process.pid,
      ownerStartTime: getFileLockProcessStartTime(process.pid),
      replacementSha256: null,
      schema: "openclaw-private-durable-cas/v2",
      txId: randomUUID(),
    })}\n`,
    "utf8",
  );
  writePrivateDurableCandidate(lockPath, lockBytes);
  syncDirectory(dirname(path));
  try {
    linkSync(path, oldPath);
    let current = readPrivateDurableFileOnce(path, [2]);
    let old = readPrivateDurableFileOnce(oldPath, [2]);
    if (
      current.stat.dev !== old.stat.dev ||
      current.stat.ino !== old.stat.ino ||
      !current.bytes.equals(expectedBytes) ||
      !old.bytes.equals(expectedBytes)
    ) {
      throw new Error("private durable file changed before CAS deletion");
    }
    syncDirectory(dirname(path));
    options.beforeDeleteCommit?.();
    current = readPrivateDurableFileOnce(path, [1, 2]);
    old = readPrivateDurableFileOnce(oldPath, [1, 2]);
    if (
      current.stat.dev !== old.stat.dev ||
      current.stat.ino !== old.stat.ino ||
      !current.bytes.equals(expectedBytes) ||
      !old.bytes.equals(expectedBytes)
    ) {
      throw new Error("private durable file changed at the CAS deletion boundary");
    }
    unlinkSync(path);
    syncDirectory(dirname(path));
    provePrivateDurableBytes(oldPath, expectedBytes);
    unlinkSync(oldPath);
    unlinkSync(lockPath);
    syncDirectory(dirname(path));
  } catch (error) {
    try {
      recoverPrivateDurableBytesCompareAndSwap(path, () => false, {
        allowLiveOwner: true,
      });
      if (readPrivateDurableBytes(path) === null) {
        return;
      }
    } catch {
      // Preserve a mismatched target and every transaction artifact for
      // fail-closed startup recovery.
    }
    throw error;
  }
}

export function persistDurableHandoff(path: string, handoff: GatewaySuspendHandoff): void {
  persistPrivateDurableBytes(path, gatewaySuspendHandoffBytes(handoff));
}

export function proveDurableHandoff(
  path: string,
  expected: GatewaySuspendHandoff,
): { handoff: GatewaySuspendHandoff; bytes: Buffer } {
  const persisted = readDurableHandoff(path);
  const expectedIdentity = gatewaySuspendHandoffIdentity(expected);
  if (!persisted || gatewaySuspendHandoffIdentity(persisted.handoff) !== expectedIdentity) {
    throw new Error("gateway suspension handoff does not match the active durable fence");
  }
  provePrivateDurableBytes(path, persisted.bytes);
  const proven = readDurableHandoff(path);
  if (
    !proven ||
    !proven.bytes.equals(persisted.bytes) ||
    gatewaySuspendHandoffIdentity(proven.handoff) !== expectedIdentity
  ) {
    throw new Error("gateway suspension handoff changed before its durable replacement");
  }
  return proven;
}

export function replaceDurableHandoff(
  path: string,
  expected: GatewaySuspendHandoff,
  replacement: GatewaySuspendHandoff,
): void {
  const persisted = proveDurableHandoff(path, expected);
  if (
    !isValidDurableHandoffCasReplacement(persisted.bytes, gatewaySuspendHandoffBytes(replacement))
  ) {
    throw new Error("gateway suspension handoff replacement is not an allowed transition");
  }
  compareAndSwapPrivateDurableBytes(path, persisted.bytes, gatewaySuspendHandoffBytes(replacement));
  const proven = readDurableHandoff(path);
  if (
    !proven ||
    gatewaySuspendHandoffIdentity(proven.handoff) !== gatewaySuspendHandoffIdentity(replacement)
  ) {
    throw new Error("gateway suspension handoff replacement was not durable");
  }
}

export function beginDurableHandoffRelease(params: {
  path: string;
  expected: GatewaySuspendHandoff;
  releaseRequestId: string;
  releaseAuthoritySha256: string;
  resumeBeforeMs: number;
  committedAtMs: number;
}): GatewaySuspendHandoff {
  if (
    params.expected.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE ||
    params.expected.resumeState !== "held" ||
    !/^handoff-v2-release:[a-f0-9]{32}$/u.test(params.releaseRequestId) ||
    !/^[a-f0-9]{64}$/u.test(params.releaseAuthoritySha256) ||
    params.releaseRequestId !==
      `handoff-v2-release:${params.releaseAuthoritySha256.slice(0, 32)}` ||
    !Number.isSafeInteger(params.committedAtMs) ||
    !Number.isSafeInteger(params.resumeBeforeMs) ||
    params.committedAtMs >= params.resumeBeforeMs ||
    params.resumeBeforeMs > params.expected.expiresAtMs
  ) {
    throw new Error("gateway suspension durable release transition is invalid");
  }
  const expected = proveDurableHandoff(params.path, params.expected);
  const pending: GatewaySuspendHandoff = {
    ...params.expected,
    resumeState: "release-pending",
    resumeBeforeMs: params.resumeBeforeMs,
    releaseRequestId: params.releaseRequestId,
    releaseAuthoritySha256: params.releaseAuthoritySha256,
    releaseCommittedAtMs: params.committedAtMs,
  };
  compareAndSwapPrivateDurableBytes(
    params.path,
    expected.bytes,
    gatewaySuspendHandoffBytes(pending),
  );
  const persisted = readDurableHandoff(params.path);
  if (
    !persisted ||
    gatewaySuspendHandoffIdentity(persisted.handoff) !== gatewaySuspendHandoffIdentity(pending)
  ) {
    throw new Error("gateway suspension durable release handoff was not persisted");
  }
  return persisted.handoff;
}

export function clearDurableHandoff(path: string): void {
  const current = readPrivateDurableBytes(path);
  if (current !== null) {
    deletePrivateDurableBytesCompareAndSwap(path, current);
    return;
  }
  syncDirectory(dirname(path));
}

/**
 * Delete only the exact handoff generation the caller proved it owns.
 * A missing path is an idempotent retry after unlink; a replacement is never
 * removed. Callers must retain an independent durable transition record before
 * accepting the missing-path case.
 */
export function clearExactDurableHandoff(path: string, expected: GatewaySuspendHandoff): void {
  const current = readDurableHandoff(path);
  if (current === null) {
    clearDurableHandoff(path);
    return;
  }
  const proven = proveDurableHandoff(path, expected);
  deletePrivateDurableBytesCompareAndSwap(path, proven.bytes);
}

export function normalizeDurableHandoffAtStartup(
  path: string,
  handoff: GatewaySuspendHandoff,
  nowMs: number,
): GatewaySuspendHandoff | null {
  if (handoff.resumeState === "resume-cleanup") {
    clearExactDurableHandoff(path, handoff);
    return null;
  }
  if (handoff.resumeState === "resume-reopen-authorized") {
    if (handoff.resumeBeforeMs !== null && handoff.resumeBeforeMs > nowMs) {
      clearExactDurableHandoff(path, handoff);
      return null;
    }
    const expired = { ...handoff, resumeState: "resume-expired" as const };
    replaceDurableHandoff(path, handoff, expired);
    return expired;
  }
  if (
    handoff.resumeState === "resume-pending" &&
    handoff.resumeBeforeMs !== null &&
    handoff.resumeBeforeMs <= nowMs
  ) {
    const expired = { ...handoff, resumeState: "resume-expired" as const };
    replaceDurableHandoff(path, handoff, expired);
    return expired;
  }
  if (
    gatewaySuspendModeForHandoff(handoff) === GATEWAY_SUSPEND_MODE_LEGACY &&
    handoff.resumeState === "held" &&
    handoff.expiresAtMs <= nowMs
  ) {
    clearDurableHandoff(path);
    return null;
  }
  return handoff;
}

export function readDurableHandoff(
  path: string,
): { handoff: GatewaySuspendHandoff; bytes: Buffer } | null {
  const bytes = readPrivateDurableBytes(path);
  if (bytes === null) {
    return null;
  }
  return { handoff: parseGatewaySuspendHandoffBytes(bytes), bytes };
}

/**
 * Recover a handoff CAS only after the caller owns the single-Gateway startup lock.
 * Normal RPC/read paths must never recover another live process's transaction.
 */
export function recoverDurableHandoffCompareAndSwap(path: string): void {
  recoverPrivateDurableBytesCompareAndSwap(path, isValidDurableHandoffCasReplacement);
}

function parseGatewaySuspendHandoffBytes(bytes: Buffer): GatewaySuspendHandoff {
  const value: unknown = JSON.parse(bytes.toString("utf8"));
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("gateway suspension handoff has an invalid shape");
  }
  const handoff = value as Record<string, unknown>;
  const durable = handoff.schema === GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE;
  const releasePending = durable && handoff.resumeState === "release-pending";
  const expectedKeys = releasePending
    ? "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,releaseAuthoritySha256,releaseCommittedAtMs,releaseRequestId,requestId,resumeBeforeMs,resumeState,schema,suspendMode,suspensionId"
    : durable
      ? "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,requestId,resumeBeforeMs,resumeState,schema,suspendMode,suspensionId"
      : "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,requestId,resumeBeforeMs,resumeState,schema,suspensionId";
  if (Object.keys(handoff).toSorted().join(",") !== expectedKeys) {
    throw new Error("gateway suspension handoff has an invalid shape");
  }
  if (
    (handoff.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY &&
      handoff.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE) ||
    (durable && handoff.suspendMode !== GATEWAY_SUSPEND_MODE_DURABLE) ||
    typeof handoff.requestId !== "string" ||
    handoff.requestId.trim().length === 0 ||
    typeof handoff.suspensionId !== "string" ||
    handoff.suspensionId.trim().length === 0 ||
    typeof handoff.gatewayInstanceId !== "string" ||
    handoff.gatewayInstanceId.trim().length === 0 ||
    !Number.isSafeInteger(handoff.gatewayPid) ||
    Number(handoff.gatewayPid) < 1 ||
    !Number.isSafeInteger(handoff.launchdRunCount) ||
    Number(handoff.launchdRunCount) < 1 ||
    !Number.isSafeInteger(handoff.expiresAtMs) ||
    (handoff.resumeState !== "held" &&
      handoff.resumeState !== "resume-pending" &&
      handoff.resumeState !== "resume-expired" &&
      handoff.resumeState !== "resume-reopen-authorized" &&
      handoff.resumeState !== "resume-cleanup" &&
      handoff.resumeState !== "release-pending") ||
    (handoff.resumeState === "held"
      ? handoff.resumeBeforeMs !== null
      : !Number.isSafeInteger(handoff.resumeBeforeMs) ||
        Number(handoff.resumeBeforeMs) > Number(handoff.expiresAtMs)) ||
    (releasePending
      ? typeof handoff.releaseRequestId !== "string" ||
        !/^handoff-v2-release:[a-f0-9]{32}$/u.test(handoff.releaseRequestId) ||
        typeof handoff.releaseAuthoritySha256 !== "string" ||
        !/^[a-f0-9]{64}$/u.test(handoff.releaseAuthoritySha256) ||
        handoff.releaseRequestId !==
          `handoff-v2-release:${handoff.releaseAuthoritySha256.slice(0, 32)}` ||
        !Number.isSafeInteger(handoff.releaseCommittedAtMs) ||
        Number(handoff.releaseCommittedAtMs) >= Number(handoff.resumeBeforeMs)
      : "releaseRequestId" in handoff ||
        "releaseAuthoritySha256" in handoff ||
        "releaseCommittedAtMs" in handoff)
  ) {
    throw new Error("gateway suspension handoff is invalid");
  }
  return handoff as GatewaySuspendHandoff;
}

function isValidDurableHandoffCasReplacement(previousBytes: Buffer, currentBytes: Buffer): boolean {
  try {
    const previous = parseGatewaySuspendHandoffBytes(previousBytes);
    const current = parseGatewaySuspendHandoffBytes(currentBytes);
    if (
      previous.schema !== current.schema ||
      previous.requestId !== current.requestId ||
      previous.suspensionId !== current.suspensionId
    ) {
      return false;
    }
    if (previous.resumeState === "held" && current.resumeState === "held") {
      const sameProcessIncarnation =
        previous.gatewayInstanceId === current.gatewayInstanceId &&
        previous.gatewayPid === current.gatewayPid &&
        previous.launchdRunCount === current.launchdRunCount;
      const adoptedSuccessorIncarnation =
        previous.gatewayInstanceId !== current.gatewayInstanceId &&
        (previous.gatewayPid !== current.gatewayPid ||
          previous.launchdRunCount !== current.launchdRunCount);
      return (
        (sameProcessIncarnation
          ? current.expiresAtMs > previous.expiresAtMs
          : adoptedSuccessorIncarnation && current.expiresAtMs >= previous.expiresAtMs) &&
        current.resumeBeforeMs === null &&
        gatewaySuspendModeForHandoff(previous) === gatewaySuspendModeForHandoff(current)
      );
    }
    if (
      previous.gatewayInstanceId !== current.gatewayInstanceId ||
      previous.gatewayPid !== current.gatewayPid ||
      previous.launchdRunCount !== current.launchdRunCount ||
      previous.expiresAtMs !== current.expiresAtMs ||
      gatewaySuspendModeForHandoff(previous) !== gatewaySuspendModeForHandoff(current)
    ) {
      return false;
    }
    if (previous.resumeState === "held" && current.resumeState === "release-pending") {
      return (
        previous.schema === GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE &&
        current.schema === GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE &&
        current.resumeBeforeMs !== null &&
        current.releaseCommittedAtMs !== undefined &&
        current.releaseCommittedAtMs < current.resumeBeforeMs
      );
    }
    const allowedResumeTransition =
      (previous.resumeState === "held" && current.resumeState === "resume-pending") ||
      (previous.resumeState === "resume-pending" &&
        (current.resumeState === "resume-reopen-authorized" ||
          current.resumeState === "resume-expired")) ||
      (previous.resumeState === "resume-reopen-authorized" &&
        (current.resumeState === "resume-cleanup" || current.resumeState === "resume-expired"));
    return (
      allowedResumeTransition &&
      current.resumeBeforeMs !== null &&
      (previous.resumeState === "held" || previous.resumeBeforeMs === current.resumeBeforeMs)
    );
  } catch {
    return false;
  }
}
