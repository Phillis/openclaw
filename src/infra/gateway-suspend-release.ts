import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import {
  GATEWAY_SUSPEND_MODE_DURABLE,
  type GatewaySuspendReleaseCommittedReceipt,
  type GatewaySuspendReleaseCompletedReceipt,
  type GatewaySuspendReleaseReceipt,
} from "../../packages/gateway-protocol/src/index.js";
import {
  compareAndSwapPrivateDurableBytes,
  GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE,
  proveDurableHandoff,
  provePrivateDurableBytes,
  readPrivateDurableBytes,
  recoverPrivateDurableBytesCompareAndSwap,
  type GatewaySuspendHandoff,
} from "./gateway-suspend-handoff.js";

export const GATEWAY_SUSPEND_RELEASE_SCHEMA = "openclaw-gateway-suspend-release/v1";
const GATEWAY_SUSPEND_RELEASE_FILENAME_PREFIX = "gateway-suspend-release-";
const MAX_RELEASE_RECEIPT_BYTES = 16 * 1024;
const SHA256_RE = /^[a-f0-9]{64}$/u;
const RELEASE_REQUEST_ID_RE = /^handoff-v2-release:[a-f0-9]{32}$/u;
const TOKEN_RE = /\S/u;

const COMMON_KEYS = [
  "schema",
  "status",
  "releaseRequestId",
  "releaseAuthoritySha256",
  "suspendRequestId",
  "suspensionId",
  "gatewayInstanceId",
  "gatewayPid",
  "launchdRunCount",
  "suspendMode",
  "resumeBeforeMs",
  "committedAtMs",
  "requiredAdmissionReopened",
  "requiredSchedulerReopened",
  "nonReusable",
] as const;
const COMPLETED_KEYS = [
  ...COMMON_KEYS,
  "completedAtMs",
  "admissionReopened",
  "schedulerReopened",
] as const;

function compareBytes(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  return (
    JSON.stringify(Object.keys(value).toSorted(compareBytes)) ===
    JSON.stringify(expected.toSorted(compareBytes))
  );
}

function isToken(value: unknown): value is string {
  return typeof value === "string" && value.length <= 128 && TOKEN_RE.test(value);
}

export function isGatewaySuspendReleaseAuthorityPair(
  releaseRequestId: unknown,
  releaseAuthoritySha256: unknown,
): releaseRequestId is string {
  return (
    typeof releaseRequestId === "string" &&
    RELEASE_REQUEST_ID_RE.test(releaseRequestId) &&
    typeof releaseAuthoritySha256 === "string" &&
    SHA256_RE.test(releaseAuthoritySha256) &&
    releaseRequestId === `handoff-v2-release:${releaseAuthoritySha256.slice(0, 32)}`
  );
}

function hasValidCommonBinding(value: Record<string, unknown>): boolean {
  return (
    value.schema === GATEWAY_SUSPEND_RELEASE_SCHEMA &&
    isGatewaySuspendReleaseAuthorityPair(value.releaseRequestId, value.releaseAuthoritySha256) &&
    isToken(value.suspendRequestId) &&
    isToken(value.suspensionId) &&
    isToken(value.gatewayInstanceId) &&
    Number.isSafeInteger(value.gatewayPid) &&
    Number(value.gatewayPid) >= 1 &&
    Number.isSafeInteger(value.launchdRunCount) &&
    Number(value.launchdRunCount) >= 1 &&
    value.suspendMode === GATEWAY_SUSPEND_MODE_DURABLE &&
    Number.isSafeInteger(value.resumeBeforeMs) &&
    Number(value.resumeBeforeMs) >= 0 &&
    Number.isSafeInteger(value.committedAtMs) &&
    Number(value.committedAtMs) >= 0 &&
    Number(value.committedAtMs) < Number(value.resumeBeforeMs) &&
    value.requiredAdmissionReopened === true &&
    value.requiredSchedulerReopened === true &&
    value.nonReusable === true
  );
}

function canonicalReceiptBytes(receipt: GatewaySuspendReleaseReceipt): Buffer {
  const canonical = Object.fromEntries(
    Object.entries(receipt).toSorted(([left], [right]) => compareBytes(left, right)),
  );
  return Buffer.from(`${JSON.stringify(canonical)}\n`, "utf8");
}

function gatewaySuspendReleaseReceiptIdentity(receipt: GatewaySuspendReleaseReceipt): string {
  return createHash("sha256").update(canonicalReceiptBytes(receipt)).digest("hex");
}

function parseGatewaySuspendReleaseReceipt(bytes: Buffer): GatewaySuspendReleaseReceipt {
  if (bytes.length === 0 || bytes.length > MAX_RELEASE_RECEIPT_BYTES) {
    throw new Error("gateway suspension release receipt has an invalid size");
  }
  let value: unknown;
  try {
    value = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error("gateway suspension release receipt contains malformed JSON");
  }
  if (!isRecord(value) || !hasValidCommonBinding(value)) {
    throw new Error("gateway suspension release receipt is invalid");
  }
  if (value.status === "release_committed") {
    if (!hasExactKeys(value, COMMON_KEYS)) {
      throw new Error("gateway suspension committed release receipt has an invalid shape");
    }
    const receipt = value as GatewaySuspendReleaseCommittedReceipt;
    if (!bytes.equals(canonicalReceiptBytes(receipt))) {
      throw new Error("gateway suspension committed release receipt is not canonical");
    }
    return receipt;
  }
  if (
    value.status !== "release_completed" ||
    !hasExactKeys(value, COMPLETED_KEYS) ||
    !Number.isSafeInteger(value.completedAtMs) ||
    Number(value.completedAtMs) < Number(value.committedAtMs) ||
    value.admissionReopened !== true ||
    value.schedulerReopened !== true
  ) {
    throw new Error("gateway suspension completed release receipt is invalid");
  }
  const receipt = value as GatewaySuspendReleaseCompletedReceipt;
  if (!bytes.equals(canonicalReceiptBytes(receipt))) {
    throw new Error("gateway suspension completed release receipt is not canonical");
  }
  return receipt;
}

export function gatewaySuspendReleaseCommittedView(
  receipt: GatewaySuspendReleaseReceipt,
): GatewaySuspendReleaseCommittedReceipt {
  return {
    schema: receipt.schema,
    status: "release_committed",
    releaseRequestId: receipt.releaseRequestId,
    releaseAuthoritySha256: receipt.releaseAuthoritySha256,
    suspendRequestId: receipt.suspendRequestId,
    suspensionId: receipt.suspensionId,
    gatewayInstanceId: receipt.gatewayInstanceId,
    gatewayPid: receipt.gatewayPid,
    launchdRunCount: receipt.launchdRunCount,
    suspendMode: receipt.suspendMode,
    resumeBeforeMs: receipt.resumeBeforeMs,
    committedAtMs: receipt.committedAtMs,
    requiredAdmissionReopened: receipt.requiredAdmissionReopened,
    requiredSchedulerReopened: receipt.requiredSchedulerReopened,
    nonReusable: receipt.nonReusable,
  };
}

export function isSameGatewaySuspendReleaseCommit(
  left: GatewaySuspendReleaseReceipt,
  right: GatewaySuspendReleaseReceipt,
): boolean {
  return (
    gatewaySuspendReleaseReceiptIdentity(gatewaySuspendReleaseCommittedView(left)) ===
    gatewaySuspendReleaseReceiptIdentity(gatewaySuspendReleaseCommittedView(right))
  );
}

function sameReceipt(
  left: GatewaySuspendReleaseReceipt,
  right: GatewaySuspendReleaseReceipt,
): boolean {
  return gatewaySuspendReleaseReceiptIdentity(left) === gatewaySuspendReleaseReceiptIdentity(right);
}

function isValidCommittedToCompletedTransition(
  previousBytes: Buffer,
  currentBytes: Buffer,
): boolean {
  try {
    const previous = parseGatewaySuspendReleaseReceipt(previousBytes);
    const current = parseGatewaySuspendReleaseReceipt(currentBytes);
    return (
      previous.status === "release_committed" &&
      current.status === "release_completed" &&
      isSameGatewaySuspendReleaseCommit(previous, current)
    );
  } catch {
    return false;
  }
}

function releasePathDigest(releaseRequestId: string, releaseAuthoritySha256: string): string {
  return createHash("sha256")
    .update(releaseRequestId, "utf8")
    .update("\0", "utf8")
    .update(releaseAuthoritySha256, "utf8")
    .digest("hex");
}

export function resolveGatewaySuspendReleasePath(
  handoffPath: string,
  releaseRequestId: string,
  releaseAuthoritySha256: string,
): string {
  if (!isGatewaySuspendReleaseAuthorityPair(releaseRequestId, releaseAuthoritySha256)) {
    throw new Error("gateway suspension release authority binding is invalid");
  }
  return join(
    dirname(handoffPath),
    `${GATEWAY_SUSPEND_RELEASE_FILENAME_PREFIX}${releasePathDigest(
      releaseRequestId,
      releaseAuthoritySha256,
    )}.json`,
  );
}

export function readGatewaySuspendReleaseReceipt(
  releasePath: string,
): { receipt: GatewaySuspendReleaseReceipt; bytes: Buffer } | null {
  const bytes = readPrivateDurableBytes(releasePath);
  if (bytes === null) {
    return null;
  }
  return { receipt: parseGatewaySuspendReleaseReceipt(bytes), bytes };
}

/**
 * Recover a receipt CAS only after the caller owns the single-Gateway startup lock.
 * Status and retry paths must not recover a transaction owned by another live process.
 */
export function recoverGatewaySuspendReleaseCompareAndSwap(releasePath: string): void {
  recoverPrivateDurableBytesCompareAndSwap(releasePath, isValidCommittedToCompletedTransition);
}

function assertReceiptMatchesHandoff(
  receipt: GatewaySuspendReleaseCommittedReceipt,
  handoff: GatewaySuspendHandoff,
): void {
  if (
    handoff.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE ||
    handoff.suspendMode !== GATEWAY_SUSPEND_MODE_DURABLE ||
    handoff.resumeState !== "release-pending" ||
    handoff.releaseRequestId !== receipt.releaseRequestId ||
    handoff.releaseAuthoritySha256 !== receipt.releaseAuthoritySha256 ||
    handoff.requestId !== receipt.suspendRequestId ||
    handoff.suspensionId !== receipt.suspensionId ||
    handoff.gatewayInstanceId !== receipt.gatewayInstanceId ||
    handoff.gatewayPid !== receipt.gatewayPid ||
    handoff.launchdRunCount !== receipt.launchdRunCount ||
    handoff.resumeBeforeMs !== receipt.resumeBeforeMs ||
    handoff.releaseCommittedAtMs !== receipt.committedAtMs
  ) {
    throw new Error("gateway suspension release receipt does not match the durable handoff");
  }
}

export function commitGatewaySuspendRelease(params: {
  handoffPath: string;
  expectedHandoff: GatewaySuspendHandoff;
  receipt: GatewaySuspendReleaseCommittedReceipt;
}): GatewaySuspendReleaseReceipt {
  const validatedReceipt = parseGatewaySuspendReleaseReceipt(canonicalReceiptBytes(params.receipt));
  if (validatedReceipt.status !== "release_committed") {
    throw new Error("gateway suspension release commit requires a committed receipt");
  }
  assertReceiptMatchesHandoff(validatedReceipt, params.expectedHandoff);
  proveDurableHandoff(params.handoffPath, params.expectedHandoff);
  const releasePath = resolveGatewaySuspendReleasePath(
    params.handoffPath,
    validatedReceipt.releaseRequestId,
    validatedReceipt.releaseAuthoritySha256,
  );
  const existing = readGatewaySuspendReleaseReceipt(releasePath);
  if (existing) {
    if (!isSameGatewaySuspendReleaseCommit(existing.receipt, validatedReceipt)) {
      throw new Error("gateway suspension release authority is non-reusable");
    }
    provePrivateDurableBytes(releasePath, existing.bytes);
    return existing.receipt;
  }
  const bytes = canonicalReceiptBytes(validatedReceipt);
  compareAndSwapPrivateDurableBytes(releasePath, null, bytes);
  proveDurableHandoff(params.handoffPath, params.expectedHandoff);
  const persisted = readGatewaySuspendReleaseReceipt(releasePath);
  if (
    !persisted ||
    !persisted.bytes.equals(bytes) ||
    !sameReceipt(persisted.receipt, validatedReceipt)
  ) {
    throw new Error("gateway suspension committed release receipt was not durable");
  }
  return persisted.receipt;
}

export function completeGatewaySuspendRelease(params: {
  releasePath: string;
  committed: GatewaySuspendReleaseCommittedReceipt;
  completedAtMs: number;
}): GatewaySuspendReleaseCompletedReceipt {
  const existing = readGatewaySuspendReleaseReceipt(params.releasePath);
  if (!existing || !isSameGatewaySuspendReleaseCommit(existing.receipt, params.committed)) {
    throw new Error("gateway suspension committed release receipt is missing or mismatched");
  }
  if (existing.receipt.status === "release_completed") {
    provePrivateDurableBytes(params.releasePath, existing.bytes);
    return existing.receipt;
  }
  const completed = parseGatewaySuspendReleaseReceipt(
    canonicalReceiptBytes({
      ...params.committed,
      status: "release_completed",
      completedAtMs: params.completedAtMs,
      admissionReopened: true,
      schedulerReopened: true,
    }),
  );
  if (completed.status !== "release_completed") {
    throw new Error("gateway suspension release completion is invalid");
  }
  const bytes = canonicalReceiptBytes(completed);
  compareAndSwapPrivateDurableBytes(params.releasePath, existing.bytes, bytes);
  const persisted = readGatewaySuspendReleaseReceipt(params.releasePath);
  if (
    !persisted ||
    persisted.receipt.status !== "release_completed" ||
    !persisted.bytes.equals(bytes)
  ) {
    throw new Error("gateway suspension completed release receipt was not durable");
  }
  return persisted.receipt;
}

export function readExactGatewaySuspendReleaseReceipt(params: {
  handoffPath: string;
  releaseRequestId: string;
  releaseAuthoritySha256: string;
}): GatewaySuspendReleaseReceipt | null {
  const releasePath = resolveGatewaySuspendReleasePath(
    params.handoffPath,
    params.releaseRequestId,
    params.releaseAuthoritySha256,
  );
  const persisted = readGatewaySuspendReleaseReceipt(releasePath);
  if (!persisted) {
    return null;
  }
  if (
    persisted.receipt.releaseRequestId !== params.releaseRequestId ||
    persisted.receipt.releaseAuthoritySha256 !== params.releaseAuthoritySha256
  ) {
    throw new Error("gateway suspension release receipt authority does not match");
  }
  provePrivateDurableBytes(releasePath, persisted.bytes);
  return persisted.receipt;
}
