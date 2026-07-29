import { createHash } from "node:crypto";
import {
  GATEWAY_SUSPEND_MODE_DURABLE,
  GATEWAY_SUSPEND_MODE_LEGACY,
  type GatewaySuspendMode,
} from "../../packages/gateway-protocol/src/index.js";
import {
  compareAndSwapPrivateDurableBytes,
  deletePrivateDurableBytesCompareAndSwap,
  persistPrivateDurableBytes,
  provePrivateDurableBytes,
  readPrivateDurableBytes,
  recoverPrivateDurableBytesCompareAndSwap,
  syncPrivateDurableParentDirectory,
} from "./gateway-suspend-durable-storage.js";

export {
  compareAndSwapPrivateDurableBytes,
  provePrivateDurableBytes,
  readPrivateDurableBytes,
  recoverPrivateDurableBytesCompareAndSwap,
} from "./gateway-suspend-durable-storage.js";

const GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY = "openclaw-gateway-suspend-handoff/v2";
export const GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE = "openclaw-gateway-suspend-handoff/v3";

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

export function proveDurableHandoffBytes(path: string, expectedBytes: Buffer): void {
  provePrivateDurableBytes(path, expectedBytes);
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
  syncPrivateDurableParentDirectory(path);
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
