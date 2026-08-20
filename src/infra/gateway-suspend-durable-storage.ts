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
import { getFileLockProcessStartTime, isPidAlive } from "../shared/pid-alive.js";

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

export function syncPrivateDurableParentDirectory(path: string): void {
  syncDirectory(dirname(path));
}

if (process.env.VITEST || process.env.NODE_ENV === "test") {
  (globalThis as Record<PropertyKey, unknown>)[
    Symbol.for("openclaw.gatewaySuspendHandoffTestApi")
  ] = {
    deletePrivateDurableBytesCompareAndSwap,
  };
}
