import { randomUUID } from "node:crypto";
import {
  closeSync,
  constants,
  fstatSync,
  fsyncSync,
  openSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
  type Stats,
} from "node:fs";
import { dirname } from "node:path";

export const GATEWAY_SUSPEND_HANDOFF_SCHEMA = "openclaw-gateway-suspend-handoff/v2";

export type GatewaySuspendHandoff = {
  schema: typeof GATEWAY_SUSPEND_HANDOFF_SCHEMA;
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
    | "resume-cleanup";
  resumeBeforeMs: number | null;
};

export function createGatewaySuspendHandoff(
  value: Omit<GatewaySuspendHandoff, "schema">,
): GatewaySuspendHandoff {
  return { schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA, ...value };
}

function syncDirectory(path: string): void {
  const descriptor = openSync(path, constants.O_RDONLY);
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function assertPrivateHandoffStat(stat: Stats): void {
  if (
    !stat.isFile() ||
    stat.nlink !== 1 ||
    (stat.mode & 0o077) !== 0 ||
    (typeof process.getuid === "function" && stat.uid !== process.getuid())
  ) {
    throw new Error("gateway suspension handoff must be a private owner-controlled regular file");
  }
}

function readPrivateHandoffBytes(path: string): Buffer {
  const descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = fstatSync(descriptor);
    assertPrivateHandoffStat(before);
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
    return bytes;
  } finally {
    closeSync(descriptor);
  }
}

export function proveDurableHandoffBytes(path: string, expectedBytes: Buffer): void {
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

export function persistDurableHandoff(path: string, handoff: GatewaySuspendHandoff): void {
  const bytes = Buffer.from(`${JSON.stringify(handoff)}\n`, "utf8");
  const temporaryPath = `${path}.tmp-${process.pid}-${randomUUID()}`;
  const descriptor = openSync(
    temporaryPath,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
    0o600,
  );
  try {
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  try {
    renameSync(temporaryPath, path);
    proveDurableHandoffBytes(path, bytes);
  } catch (error) {
    try {
      unlinkSync(temporaryPath);
    } catch {
      // The rename may already have exposed the durable target.
    }
    try {
      proveDurableHandoffBytes(path, bytes);
    } catch {
      throw error;
    }
  }
}

export function clearDurableHandoff(path: string): void {
  try {
    unlinkSync(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
  syncDirectory(dirname(path));
}

export function normalizeDurableHandoffAtStartup(
  path: string,
  handoff: GatewaySuspendHandoff,
  nowMs: number,
): GatewaySuspendHandoff | null {
  if (handoff.resumeState === "resume-cleanup") {
    clearDurableHandoff(path);
    return null;
  }
  if (handoff.resumeState === "resume-reopen-authorized") {
    if (handoff.resumeBeforeMs !== null && handoff.resumeBeforeMs > nowMs) {
      clearDurableHandoff(path);
      return null;
    }
    const expired = { ...handoff, resumeState: "resume-expired" as const };
    persistDurableHandoff(path, expired);
    return expired;
  }
  if (
    handoff.resumeState === "resume-pending" &&
    handoff.resumeBeforeMs !== null &&
    handoff.resumeBeforeMs <= nowMs
  ) {
    const expired = { ...handoff, resumeState: "resume-expired" as const };
    persistDurableHandoff(path, expired);
    return expired;
  }
  if (handoff.resumeState === "held" && handoff.expiresAtMs <= nowMs) {
    clearDurableHandoff(path);
    return null;
  }
  return handoff;
}

export function readDurableHandoff(
  path: string,
): { handoff: GatewaySuspendHandoff; bytes: Buffer } | null {
  let bytes: Buffer;
  try {
    bytes = readPrivateHandoffBytes(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      syncDirectory(dirname(path));
      try {
        bytes = readPrivateHandoffBytes(path);
      } catch (retryError) {
        if ((retryError as NodeJS.ErrnoException).code === "ENOENT") {
          return null;
        }
        throw retryError;
      }
    } else {
      throw error;
    }
  }
  const value: unknown = JSON.parse(bytes.toString("utf8"));
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).toSorted().join(",") !==
      "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,requestId,resumeBeforeMs,resumeState,schema,suspensionId"
  ) {
    throw new Error("gateway suspension handoff has an invalid shape");
  }
  const handoff = value as Record<string, unknown>;
  if (
    handoff.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA ||
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
      handoff.resumeState !== "resume-cleanup") ||
    (handoff.resumeState === "held"
      ? handoff.resumeBeforeMs !== null
      : !Number.isSafeInteger(handoff.resumeBeforeMs) ||
        Number(handoff.resumeBeforeMs) > Number(handoff.expiresAtMs))
  ) {
    throw new Error("gateway suspension handoff is invalid");
  }
  return { handoff: handoff as GatewaySuspendHandoff, bytes };
}
