// Receipt-backed guarded replacement for one already-installed archive plugin.
import { createHash, randomBytes } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import { encodePluginInstallDirName } from "../plugins/install-paths.js";
import { installPluginFromArchive } from "../plugins/install.js";
import { hashJson } from "../plugins/installed-plugin-index-hash.js";
import { normalizeInstallRecordMap } from "../plugins/installed-plugin-index-install-records.js";
import { loadInstalledPluginIndexInstallRecords } from "../plugins/installed-plugin-index-records.js";
import { resolveInstalledPluginIndexStateDatabaseOptions } from "../plugins/installed-plugin-index-store-path.js";
import { resolveInstalledPluginIndexStorePath } from "../plugins/installed-plugin-index-store-path.js";
import {
  compareAndSwapPersistedInstalledPluginIndexInstallRecord,
  type InstalledPluginIndexWriteLease,
} from "../plugins/installed-plugin-index-store.js";
import { withPluginLifecycleLease } from "../plugins/plugin-lifecycle-lease.js";
import { runInstallPolicy } from "../security/install-policy.js";
import {
  openOpenClawStateDatabase,
  runOpenClawStateWriteTransaction,
} from "../state/openclaw-state-db.js";
import {
  OpenClawStateLeaseError,
  type OpenClawStateLeaseContext,
} from "../state/openclaw-state-lease.js";
import { resolveUserPath } from "../utils.js";
import {
  ensureDurableDirectory,
  requireDirectorySync,
  syncDirectory,
} from "./directory-durability.js";
import { pathExists } from "./fs-safe.js";
import { assertCanonicalPathWithinBase, resolveSafeInstallDir } from "./install-safe-path.js";
import { resolveOpenClawPackageRootSync } from "./openclaw-root.js";
import { movePathWithCopyFallback, replaceFileAtomic } from "./replace-file.js";

const RECEIPT_SCHEMA_VERSION = "openclaw.plugins.replace-guarded.v2" as const;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-7[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/u;
const TRUST_ANCHOR_PLUGIN_ID = "openclaw-core";
const TRUST_ANCHOR_NAMESPACE = "guarded-plugin-replace";

export const GUARDED_REPLACE_FAILURE_CODE = {
  INVALID_INPUT: "guarded_replace_invalid_input",
  IDENTITY_MISMATCH: "guarded_replace_identity_mismatch",
  TARGET_NOT_INSTALLED: "guarded_replace_target_not_installed",
  INSTALLED_STATE_MISMATCH: "guarded_replace_installed_state_mismatch",
  RECEIPT_RESERVATION_FAILED: "guarded_replace_receipt_reservation_failed",
  RECEIPT_DURABILITY_FAILED: "guarded_replace_receipt_durability_failed",
  LEASE_UNAVAILABLE: "guarded_replace_lease_unavailable",
  STAGING_FAILED: "guarded_replace_staging_failed",
  GUARD_FAILED: "guarded_replace_guard_failed",
  PREDECESSOR_CAPTURE_FAILED: "guarded_replace_predecessor_capture_failed",
  SWAP_FAILED: "guarded_replace_swap_failed",
  STATE_FINALIZE_FAILED: "guarded_replace_state_finalize_failed",
  RECEIPT_FINALIZE_FAILED: "guarded_replace_receipt_finalize_failed",
  RECOVERY_INCOMPLETE: "guarded_replace_recovery_incomplete",
  FAULT_INJECTED: "guarded_replace_fault_injected",
} as const;

export type GuardedReplaceFailureCode =
  (typeof GUARDED_REPLACE_FAILURE_CODE)[keyof typeof GUARDED_REPLACE_FAILURE_CODE];

export class GuardedReplaceError extends Error {
  constructor(
    readonly code: GuardedReplaceFailureCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "GuardedReplaceError";
  }
}

type GuardOutcome = {
  name: "manifest" | "package" | "policy" | "security_scan" | "installed_state";
  outcome: "PASS" | "FAIL" | "NOT_CONFIGURED";
  evidence: Record<string, unknown>;
};

export type GuardedReplaceStageName =
  | "IDENTITY_VERIFIED"
  | "RECEIPT_RESERVED"
  | "LEASE_HELD"
  | "STAGED"
  | "GUARDS_RAN"
  | "PREDECESSOR_CAPTURED"
  | "SWAP_PUBLISHED"
  | "STATE_FINALIZED"
  | "RECEIPT_FINALIZED";

type ReceiptOutcome = "SUCCESS" | "ROLLED_BACK" | "ABORTED" | "INCOMPLETE";
type ReceiptStatus = "RESERVED" | "ACTIVE" | "COMPLETED" | "ROLLED_BACK" | "ABORTED" | "INCOMPLETE";

type GuardedReplaceTrustAnchor = {
  schemaVersion: 2;
  revision: number;
  receiptPath: string;
  previousReceiptSha256: string | null;
  receipt: GuardedReplaceReceipt;
  previousRecord: PluginInstallRecord;
  candidateRecord: PluginInstallRecord | null;
  createdAtMs: number;
};

export type GuardedReplaceReceipt = {
  schemaVersion: typeof RECEIPT_SCHEMA_VERSION;
  transactionId: string;
  leaseId: string;
  durability: {
    fileSync: "REQUIRED";
    directorySync: "REQUIRED" | "UNAVAILABLE_WINDOWS";
  };
  pluginId: string;
  status: ReceiptStatus;
  canonicalTarget: {
    realPath: string;
    boundaryLabel: "extensions directory";
    nameEncoder: "encodePluginInstallDirName";
  };
  predecessor: {
    payloadSha256: string;
    capturedBackup: string;
    capturedAtMs: number | null;
  };
  candidate: {
    archivePath: string;
    archiveSha256: string;
    stagedPayloadSha256: string | null;
    manifest: { id: string; name?: string; version?: string } | null;
  };
  rollback: {
    archivePath: string;
    archiveSha256: string;
    stagedPayloadPath: string;
    stagedPayloadSha256: string | null;
  };
  installedIndex: {
    previousRecordSha256: string;
    candidateRecordSha256: string | null;
  };
  transactionRoot: string;
  stages: Array<{ name: GuardedReplaceStageName; atMs: number; evidence: Record<string, unknown> }>;
  guards: GuardOutcome[];
  finalInstalledSha256: string | null;
  outcome: ReceiptOutcome | null;
  failure_code: GuardedReplaceFailureCode | null;
  failure_message: string | null;
  recovery_status: "RESUMABLE" | "FINALIZED" | "REQUIRES_OPERATOR";
};

export type GuardedReplaceFault =
  | "after-receipt-reserved"
  | "after-anchor-advance"
  | "receipt-directory-sync-failure"
  | "predecessor-mode-drift"
  | "candidate-mode-drift"
  | "rollback-mode-drift"
  | "before-swap"
  | "after-swap"
  | "after-state-finalize"
  | "cleanup-failure"
  | "after-lease-release";

export type InstallGuardedReplaceParams = {
  candidateArchive: string;
  candidateSha256: string;
  expectedPredecessorSha256: string;
  pluginId: string;
  receiptPath: string;
  rollbackArchive: string;
  rollbackSha256: string;
  config: OpenClawConfig;
  extensionsDir: string;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
  fault?: GuardedReplaceFault;
  now?: () => number;
  createId?: (nowMs: number) => string;
};

export type ReconcileGuardedReplaceParams = {
  receiptPath: string;
  extensionsDir: string;
  config: OpenClawConfig;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  now?: () => number;
};

const ReceiptSchema = z.object({
  schemaVersion: z.literal(RECEIPT_SCHEMA_VERSION),
  transactionId: z.string().regex(UUID_PATTERN),
  leaseId: z.string().regex(UUID_PATTERN),
  durability: z.object({
    fileSync: z.literal("REQUIRED"),
    directorySync: z.enum(["REQUIRED", "UNAVAILABLE_WINDOWS"]),
  }),
  pluginId: z.string().min(1),
  status: z.enum(["RESERVED", "ACTIVE", "COMPLETED", "ROLLED_BACK", "ABORTED", "INCOMPLETE"]),
  canonicalTarget: z.object({
    realPath: z.string().min(1),
    boundaryLabel: z.literal("extensions directory"),
    nameEncoder: z.literal("encodePluginInstallDirName"),
  }),
  predecessor: z.object({
    payloadSha256: z.string().regex(SHA256_PATTERN),
    capturedBackup: z.string().min(1),
    capturedAtMs: z.number().nullable(),
  }),
  candidate: z.object({
    archivePath: z.string().min(1),
    archiveSha256: z.string().regex(SHA256_PATTERN),
    stagedPayloadSha256: z.string().regex(SHA256_PATTERN).nullable(),
    manifest: z
      .object({ id: z.string(), name: z.string().optional(), version: z.string().optional() })
      .nullable(),
  }),
  rollback: z.object({
    archivePath: z.string().min(1),
    archiveSha256: z.string().regex(SHA256_PATTERN),
    stagedPayloadPath: z.string().min(1),
    stagedPayloadSha256: z.string().regex(SHA256_PATTERN).nullable(),
  }),
  installedIndex: z.object({
    previousRecordSha256: z.string().regex(SHA256_PATTERN),
    candidateRecordSha256: z.string().regex(SHA256_PATTERN).nullable(),
  }),
  transactionRoot: z.string().min(1),
  stages: z.array(
    z.object({ name: z.string(), atMs: z.number(), evidence: z.record(z.string(), z.unknown()) }),
  ),
  guards: z.array(
    z.object({
      name: z.enum(["manifest", "package", "policy", "security_scan", "installed_state"]),
      outcome: z.enum(["PASS", "FAIL", "NOT_CONFIGURED"]),
      evidence: z.record(z.string(), z.unknown()),
    }),
  ),
  finalInstalledSha256: z.string().regex(SHA256_PATTERN).nullable(),
  outcome: z.enum(["SUCCESS", "ROLLED_BACK", "ABORTED", "INCOMPLETE"]).nullable(),
  failure_code: z.string().nullable(),
  failure_message: z.string().nullable(),
  recovery_status: z.enum(["RESUMABLE", "FINALIZED", "REQUIRES_OPERATOR"]),
});

const TrustAnchorInstallRecordSchema = z
  .record(z.string(), z.unknown())
  .refine((record) => typeof record.source === "string");
const TrustAnchorSchema = z.object({
  schemaVersion: z.literal(2),
  revision: z.number().int().nonnegative(),
  receiptPath: z.string().min(1),
  previousReceiptSha256: z.string().regex(SHA256_PATTERN).nullable(),
  receipt: ReceiptSchema,
  previousRecord: TrustAnchorInstallRecordSchema,
  candidateRecord: TrustAnchorInstallRecordSchema.nullable(),
  createdAtMs: z.number(),
});

function guardedError(code: GuardedReplaceFailureCode, message: string, cause?: unknown) {
  return new GuardedReplaceError(code, message, cause === undefined ? undefined : { cause });
}

function assertSha256(value: string, label: string): string {
  if (!SHA256_PATTERN.test(value)) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      `${label} must be lowercase SHA-256 hex`,
    );
  }
  return value;
}

function createUuidV7(nowMs: number): string {
  const bytes = randomBytes(16);
  let timestamp = BigInt(Math.max(0, Math.trunc(nowMs)));
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(timestamp & 0xffn);
    timestamp >>= 8n;
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function resolveArchiveCustodySuffix(filePath: string): ".zip" | ".tgz" | ".tar.gz" {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".tar.gz")) {
    return ".tar.gz";
  }
  if (lower.endsWith(".tgz")) {
    return ".tgz";
  }
  if (lower.endsWith(".zip")) {
    return ".zip";
  }
  throw guardedError(
    GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
    "archive must use a supported .zip, .tgz, or .tar.gz extension",
  );
}

async function hashRegularFileDescriptor(
  filePath: string,
  options: { sealReadOnly?: boolean } = {},
): Promise<string> {
  let handle: Awaited<ReturnType<typeof fs.open>> | undefined;
  try {
    handle = await fs.open(
      filePath,
      fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0) | (fsConstants.O_NONBLOCK ?? 0),
    );
    const stat = await handle.stat();
    if (!stat.isFile()) {
      throw new Error("not a regular file");
    }
    const hash = createHash("sha256");
    const buffer = Buffer.allocUnsafe(64 * 1024);
    for (;;) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
      if (bytesRead === 0) {
        if (options.sealReadOnly) {
          await handle.chmod(0o400);
          await handle.sync();
        }
        return hash.digest("hex");
      }
      hash.update(buffer.subarray(0, bytesRead));
    }
  } catch (error) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "archive must exist as a regular file",
      error,
    );
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

/** Copies one caller-owned archive into create-only transaction custody while hashing one FD. */
export async function copyGuardedArchiveToCustody(params: {
  sourcePath: string;
  custodyPath: string;
  expectedSha256: string;
  label: string;
  afterSourceOpen?: () => Promise<void>;
}): Promise<void> {
  let source: Awaited<ReturnType<typeof fs.open>> | undefined;
  let custody: Awaited<ReturnType<typeof fs.open>> | undefined;
  let failure: unknown;
  try {
    source = await fs.open(
      params.sourcePath,
      fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0) | (fsConstants.O_NONBLOCK ?? 0),
    );
    if (!(await source.stat()).isFile()) {
      throw guardedError(
        GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
        `${params.label} must be a regular file`,
      );
    }
    await params.afterSourceOpen?.();
    custody = await fs.open(params.custodyPath, "wx", 0o600);
    const hash = createHash("sha256");
    const buffer = Buffer.allocUnsafe(64 * 1024);
    for (;;) {
      const { bytesRead } = await source.read(buffer, 0, buffer.length, null);
      if (bytesRead === 0) {
        break;
      }
      hash.update(buffer.subarray(0, bytesRead));
      let written = 0;
      while (written < bytesRead) {
        const result = await custody.write(buffer, written, bytesRead - written, null);
        if (result.bytesWritten === 0) {
          throw new Error("archive custody write made no progress");
        }
        written += result.bytesWritten;
      }
    }
    assertExpectedHash(hash.digest("hex"), params.expectedSha256, params.label);
    await custody.chmod(0o400);
    await custody.sync();
  } catch (error) {
    failure = error;
  } finally {
    await custody?.close().catch(() => undefined);
    await source?.close().catch(() => undefined);
  }
  if (failure !== undefined) {
    await fs.rm(params.custodyPath, { force: true }).catch(() => undefined);
    if (failure instanceof GuardedReplaceError) {
      throw failure;
    }
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      `failed to acquire immutable ${params.label} custody`,
      failure,
    );
  }
}

function resolveDurableCandidateCustodyPath(params: {
  candidateSha256: string;
  candidateSuffix: ".zip" | ".tgz" | ".tar.gz";
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
}): string {
  const databasePath = resolveInstalledPluginIndexStorePath(stateOptions(params));
  return path.join(
    path.dirname(databasePath),
    "plugin-archive-custody",
    "sha256",
    `${params.candidateSha256}${params.candidateSuffix}`,
  );
}

async function acquireDurableCandidateCustody(params: {
  sourcePath: string;
  custodyPath: string;
  expectedSha256: string;
  transactionId: string;
}): Promise<void> {
  const custodyDir = path.dirname(params.custodyPath);
  const custodyDirectory = await ensureDurableDirectory({
    directoryPath: custodyDir,
    label: "plugin archive custody",
    mode: 0o700,
  });
  requireDirectorySync(custodyDirectory.parentSync, "Plugin archive custody");
  const temporaryPath = path.join(
    custodyDir,
    `.${params.expectedSha256}.${params.transactionId}.tmp`,
  );
  await copyGuardedArchiveToCustody({
    sourcePath: params.sourcePath,
    custodyPath: temporaryPath,
    expectedSha256: params.expectedSha256,
    label: "candidate archive",
  });
  try {
    await fs.link(temporaryPath, params.custodyPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw guardedError(
        GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
        "failed to publish durable candidate custody",
        error,
      );
    }
    assertExpectedHash(
      await hashRegularFileDescriptor(params.custodyPath, { sealReadOnly: true }),
      params.expectedSha256,
      "existing candidate custody archive",
    );
  } finally {
    await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
  }
  const outcome = await syncDirectory(custodyDir, { label: "plugin archive custody" });
  if (outcome.status === "unsupported" && process.platform !== "win32") {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECEIPT_DURABILITY_FAILED,
      "candidate custody directory synchronization is unsupported",
    );
  }
}

function isPathWithinBoundary(candidate: string, boundary: string): boolean {
  const relative = path.relative(boundary, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== "..");
}

async function resolveGuardedPayloadRoot(params: {
  rootDir: string;
  boundaryDir?: string;
}): Promise<string> {
  const rootPath = path.resolve(params.rootDir);
  const stat = await fs.lstat(rootPath).catch((error) => {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
      "payload root is missing or unreadable",
      error,
    );
  });
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
      "payload root must be a real directory",
    );
  }
  const root = await fs.realpath(rootPath);
  if (params.boundaryDir) {
    const boundary = await fs.realpath(params.boundaryDir);
    if (!isPathWithinBoundary(root, boundary)) {
      throw guardedError(
        GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
        "payload root escapes the managed extensions directory",
      );
    }
  }
  return root;
}

async function isValidOpenClawHostPeerLink(params: {
  root: string;
  entryPath: string;
  relative: string;
}): Promise<boolean> {
  if (params.relative !== "node_modules/openclaw") {
    return false;
  }
  const packageJson = JSON.parse(
    await fs.readFile(path.join(params.root, "package.json"), "utf8"),
  ) as { peerDependencies?: Record<string, unknown> };
  if (typeof packageJson.peerDependencies?.openclaw !== "string") {
    return false;
  }
  const hostRoot = resolveOpenClawPackageRootSync({
    argv1: process.argv[1],
    moduleUrl: import.meta.url,
    cwd: process.cwd(),
  });
  if (!hostRoot) {
    return false;
  }
  const [actualTarget, expectedTarget] = await Promise.all([
    fs.realpath(params.entryPath).catch(() => ""),
    fs.realpath(hostRoot).catch(() => path.resolve(hostRoot)),
  ]);
  return actualTarget !== "" && actualTarget === expectedTarget;
}

/** Deterministically hashes names, kinds, safe link identities, and file bytes in one plugin tree. */
export async function hashGuardedPluginPayload(
  rootDir: string,
  options: { boundaryDir?: string } = {},
): Promise<string> {
  const root = await resolveGuardedPayloadRoot({ rootDir, boundaryDir: options.boundaryDir });
  const hash = createHash("sha256");
  hash.update("openclaw-guarded-plugin-payload-v2\0");
  hash.update(`root\0${(await fs.lstat(root)).mode & 0o7777}\0`);
  const visit = async (directory: string): Promise<void> => {
    const entries = (await fs.readdir(directory, { withFileTypes: true })).toSorted((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      const relative = path.relative(root, entryPath).split(path.sep).join("/");
      if (entry.isDirectory()) {
        hash.update(`d\0${relative}\0${(await fs.lstat(entryPath)).mode & 0o7777}\0`);
        await visit(entryPath);
      } else if (entry.isFile()) {
        hash.update(`f\0${relative}\0${(await fs.lstat(entryPath)).mode & 0o7777}\0`);
        hash.update(await fs.readFile(entryPath));
        hash.update("\0");
      } else if (entry.isSymbolicLink()) {
        const target = await fs.readlink(entryPath);
        if (await isValidOpenClawHostPeerLink({ root, entryPath, relative })) {
          hash.update(`l\0${relative}\0@openclaw-host-peer\0`);
          continue;
        }
        if (path.isAbsolute(target)) {
          throw guardedError(
            GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
            "absolute payload symlink rejected",
          );
        }
        const resolvedTarget = path.resolve(path.dirname(entryPath), target);
        if (!isPathWithinBoundary(resolvedTarget, root)) {
          throw guardedError(
            GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
            "payload symlink escapes the payload root",
          );
        }
        hash.update(`l\0${relative}\0${target}\0`);
      } else {
        throw guardedError(
          GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
          "unsupported payload entry rejected",
        );
      }
    }
  };
  await visit(root);
  return hash.digest("hex");
}

function receiptText(receipt: GuardedReplaceReceipt): string {
  return `${JSON.stringify(receipt, null, 2)}\n`;
}

export function receiptDurabilityForPlatform(
  platform: NodeJS.Platform,
): GuardedReplaceReceipt["durability"] {
  return {
    fileSync: "REQUIRED",
    directorySync: platform === "win32" ? "UNAVAILABLE_WINDOWS" : "REQUIRED",
  };
}

async function syncReceiptDirectory(params: {
  directory: string;
  platform: NodeJS.Platform;
  fault?: GuardedReplaceFault;
}): Promise<void> {
  if (params.platform === "win32") {
    return;
  }
  if (params.fault === "receipt-directory-sync-failure") {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECEIPT_DURABILITY_FAILED,
      "receipt directory synchronization failed",
      Object.assign(new Error("receipt directory sync failure injected"), { code: "EIO" }),
    );
  }
  try {
    const outcome = await syncDirectory(params.directory, { label: "guarded replacement receipt" });
    if (outcome.status !== "synced") {
      throw new Error(
        `unsupported directory synchronization${outcome.code ? ` (${outcome.code})` : ""}`,
      );
    }
  } catch (error) {
    if (error instanceof GuardedReplaceError) {
      throw error;
    }
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECEIPT_DURABILITY_FAILED,
      "receipt directory synchronization failed",
      error,
    );
  }
}

async function reserveReceipt(
  receiptPath: string,
  receipt: GuardedReplaceReceipt,
  params: { platform: NodeJS.Platform; fault?: GuardedReplaceFault },
): Promise<void> {
  const parent = path.dirname(receiptPath);
  const parentStat = await fs.stat(parent).catch(() => null);
  if (!parentStat?.isDirectory()) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECEIPT_RESERVATION_FAILED,
      "receipt parent directory must already exist",
    );
  }
  try {
    const handle = await fs.open(receiptPath, "wx", 0o600);
    try {
      await handle.writeFile(receiptText(receipt), "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await syncReceiptDirectory({ directory: parent, ...params });
  } catch (error) {
    if (error instanceof GuardedReplaceError) {
      throw error;
    }
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECEIPT_RESERVATION_FAILED,
      "create-only receipt reservation failed",
      error,
    );
  }
}

async function persistReceipt(
  receiptPath: string,
  receipt: GuardedReplaceReceipt,
  platform: NodeJS.Platform,
): Promise<void> {
  await replaceFileAtomic({
    filePath: receiptPath,
    content: receiptText(receipt),
    mode: 0o600,
    syncTempFile: true,
    syncParentDir: false,
  });
  await syncReceiptDirectory({ directory: path.dirname(receiptPath), platform });
}

function appendStage(
  receipt: GuardedReplaceReceipt,
  name: GuardedReplaceStageName,
  now: () => number,
  evidence: Record<string, unknown> = {},
): void {
  receipt.stages.push({ name, atMs: now(), evidence });
}

function recordHash(record: PluginInstallRecord | undefined): string {
  return hashJson(record ?? null);
}

function stateOptions(params: { stateDir?: string; env?: NodeJS.ProcessEnv }) {
  return {
    ...(params.stateDir ? { stateDir: params.stateDir } : {}),
    ...(params.env ? { env: params.env } : {}),
  };
}

function stateDatabaseOptions(params: { stateDir?: string; env?: NodeJS.ProcessEnv }) {
  return resolveInstalledPluginIndexStateDatabaseOptions(stateOptions(params));
}

function parseTrustAnchor(raw: string): GuardedReplaceTrustAnchor {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE,
      "guarded replacement trust anchor is corrupt",
      error,
    );
  }
  const parsed = TrustAnchorSchema.safeParse(value);
  if (!parsed.success) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE,
      "guarded replacement trust anchor is invalid",
    );
  }
  return parsed.data as GuardedReplaceTrustAnchor;
}

function reserveTrustAnchor(
  anchor: GuardedReplaceTrustAnchor,
  params: { stateDir?: string; env?: NodeJS.ProcessEnv },
): void {
  const inserted = runOpenClawStateWriteTransaction(({ db }) => {
    const result = db
      .prepare(
        `INSERT OR IGNORE INTO plugin_state_entries
           (plugin_id, namespace, entry_key, value_json, created_at, expires_at)
         VALUES (?, ?, ?, ?, ?, NULL)`,
      )
      .run(
        TRUST_ANCHOR_PLUGIN_ID,
        TRUST_ANCHOR_NAMESPACE,
        anchor.receipt.transactionId,
        JSON.stringify(anchor),
        anchor.createdAtMs,
      );
    return Number(result.changes) === 1;
  }, stateDatabaseOptions(params));
  if (!inserted) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECEIPT_RESERVATION_FAILED,
      "create-only guarded replacement trust anchor reservation failed",
    );
  }
}

function advanceTrustAnchor(
  anchor: GuardedReplaceTrustAnchor,
  receipt: GuardedReplaceReceipt,
  params: {
    stateDir?: string;
    env?: NodeJS.ProcessEnv;
    candidateRecord?: PluginInstallRecord | null;
  },
): GuardedReplaceTrustAnchor {
  const nextAnchor: GuardedReplaceTrustAnchor = {
    ...anchor,
    revision: anchor.revision + 1,
    previousReceiptSha256: hashJson(anchor.receipt),
    receipt: structuredClone(receipt),
    ...(params.candidateRecord !== undefined ? { candidateRecord: params.candidateRecord } : {}),
  };
  const expectedPreviousHash = hashJson(anchor);
  const changed = runOpenClawStateWriteTransaction(({ db }) => {
    const row = db
      .prepare(
        `SELECT value_json FROM plugin_state_entries
         WHERE plugin_id = ? AND namespace = ? AND entry_key = ?`,
      )
      .get(TRUST_ANCHOR_PLUGIN_ID, TRUST_ANCHOR_NAMESPACE, anchor.receipt.transactionId) as
      | { value_json: string }
      | undefined;
    if (!row || hashJson(parseTrustAnchor(row.value_json)) !== expectedPreviousHash) {
      return false;
    }
    const result = db
      .prepare(
        `UPDATE plugin_state_entries SET value_json = ?
         WHERE plugin_id = ? AND namespace = ? AND entry_key = ?`,
      )
      .run(
        JSON.stringify(nextAnchor),
        TRUST_ANCHOR_PLUGIN_ID,
        TRUST_ANCHOR_NAMESPACE,
        anchor.receipt.transactionId,
      );
    return Number(result.changes) === 1;
  }, stateDatabaseOptions(params));
  if (!changed) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.STATE_FINALIZE_FAILED,
      "guarded replacement trust anchor compare-and-swap failed",
    );
  }
  return nextAnchor;
}

async function advanceAndProjectReceipt(params: {
  anchor: GuardedReplaceTrustAnchor;
  receipt: GuardedReplaceReceipt;
  receiptPath: string;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  platform: NodeJS.Platform;
  fault?: GuardedReplaceFault;
  candidateRecord?: PluginInstallRecord | null;
}): Promise<GuardedReplaceTrustAnchor> {
  const anchor = advanceTrustAnchor(params.anchor, params.receipt, {
    ...(params.stateDir ? { stateDir: params.stateDir } : {}),
    ...(params.env ? { env: params.env } : {}),
    ...(params.candidateRecord !== undefined ? { candidateRecord: params.candidateRecord } : {}),
  });
  injectFault(params.fault, "after-anchor-advance");
  await persistReceipt(params.receiptPath, params.receipt, params.platform);
  return anchor;
}

function loadTrustAnchor(
  transactionId: string,
  params: { stateDir?: string; env?: NodeJS.ProcessEnv },
): GuardedReplaceTrustAnchor | null {
  const { db } = openOpenClawStateDatabase(stateDatabaseOptions(params));
  const row = db
    .prepare(
      `SELECT value_json FROM plugin_state_entries
       WHERE plugin_id = ? AND namespace = ? AND entry_key = ?`,
    )
    .get(TRUST_ANCHOR_PLUGIN_ID, TRUST_ANCHOR_NAMESPACE, transactionId) as
    | { value_json: string }
    | undefined;
  if (!row) {
    return null;
  }
  return parseTrustAnchor(row.value_json);
}

async function loadInstallRecords(params: { stateDir?: string; env?: NodeJS.ProcessEnv }) {
  return await loadInstalledPluginIndexInstallRecords(stateOptions(params));
}

async function compareAndSwapInstallRecord(params: {
  pluginId: string;
  expectedRecordSha256: string;
  nextRecord: PluginInstallRecord;
  config: OpenClawConfig;
  extensionsDir: string;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  lease: InstalledPluginIndexWriteLease;
}): Promise<void> {
  const committed = await compareAndSwapPersistedInstalledPluginIndexInstallRecord({
    ...stateOptions(params),
    pluginId: params.pluginId,
    expectedRecordSha256: params.expectedRecordSha256,
    nextRecord: params.nextRecord,
    config: params.config,
    lease: params.lease,
  });
  if (!committed) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.STATE_FINALIZE_FAILED,
      "installed plugin index compare-and-swap rejected stale state",
    );
  }
}

function buildGuardedReplaceInstallRecord(params: {
  previous: PluginInstallRecord;
  candidateArchivePath: string;
  candidateSha256: string;
  targetDir: string;
  version?: string;
  installedAt: string;
}): PluginInstallRecord {
  if (params.previous.source !== "archive") {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INSTALLED_STATE_MISMATCH,
      "guarded replacement requires an archive install record",
    );
  }
  const record: PluginInstallRecord = {
    ...params.previous,
    source: "archive",
    sourcePath: params.candidateArchivePath,
    integrity: `sha256-${Buffer.from(params.candidateSha256, "hex").toString("base64")}`,
    shasum: undefined,
    npmIntegrity: undefined,
    npmShasum: undefined,
    npmTarballName: undefined,
    clawpackSha256: undefined,
    clawpackSpecVersion: undefined,
    clawpackManifestSha256: undefined,
    clawpackSize: undefined,
    installPath: params.targetDir,
    ...(params.version ? { version: params.version } : {}),
    installedAt: params.installedAt,
  };
  return normalizeInstallRecordMap({ candidate: record }).candidate as PluginInstallRecord;
}

function assertExpectedHash(actual: string, expected: string, label: string): void {
  if (actual !== expected) {
    throw guardedError(GUARDED_REPLACE_FAILURE_CODE.IDENTITY_MISMATCH, `${label} SHA-256 mismatch`);
  }
}

async function withGuardedLifecycleLease<T>(
  params: { stateDir?: string; env?: NodeJS.ProcessEnv; owner: string },
  operation: (lease: OpenClawStateLeaseContext & InstalledPluginIndexWriteLease) => Promise<T>,
): Promise<T> {
  const databaseOptions = stateDatabaseOptions(params);
  try {
    return await withPluginLifecycleLease(
      {
        ...(databaseOptions.env ? { env: databaseOptions.env } : {}),
        ...(databaseOptions.path ? { path: databaseOptions.path } : {}),
        ...(databaseOptions.database ? { database: databaseOptions.database } : {}),
        waitMs: 0,
        owner: params.owner,
      },
      operation,
    );
  } catch (error) {
    if (error instanceof OpenClawStateLeaseError) {
      throw guardedError(
        GUARDED_REPLACE_FAILURE_CODE.LEASE_UNAVAILABLE,
        "exclusive plugin lifecycle lease unavailable",
        error,
      );
    }
    throw error;
  }
}

function injectFault(actual: GuardedReplaceFault | undefined, expected: GuardedReplaceFault): void {
  if (actual === expected) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.FAULT_INJECTED,
      `fault injected at ${expected}`,
    );
  }
}

async function readReceipt(receiptPath: string): Promise<GuardedReplaceReceipt> {
  const stat = await fs.lstat(receiptPath);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "receipt must be a regular file",
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(await fs.readFile(receiptPath, "utf8"));
  } catch (error) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "receipt is not valid JSON",
      error,
    );
  }
  const result = ReceiptSchema.safeParse(parsed);
  if (!result.success) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "receipt schema validation failed",
    );
  }
  return result.data as GuardedReplaceReceipt;
}

async function resolveBoundTarget(params: {
  extensionsDir: string;
  pluginId: string;
}): Promise<{ extensionsRealPath: string; targetDir: string }> {
  const extensionsRealPath = await fs.realpath(params.extensionsDir).catch(() => "");
  if (!extensionsRealPath) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.TARGET_NOT_INSTALLED,
      "extensions directory missing",
    );
  }
  const target = resolveSafeInstallDir({
    baseDir: extensionsRealPath,
    id: params.pluginId,
    invalidNameMessage: "invalid plugin name: path traversal detected",
    nameEncoder: encodePluginInstallDirName,
  });
  if (!target.ok) {
    throw guardedError(GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT, target.error);
  }
  try {
    await assertCanonicalPathWithinBase({
      baseDir: extensionsRealPath,
      candidatePath: target.path,
      boundaryLabel: "extensions directory",
    });
  } catch (error) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "plugin target is not canonical",
      error,
    );
  }
  if (!(await pathExists(target.path))) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.TARGET_NOT_INSTALLED,
      "plugin target is not installed",
    );
  }
  const targetStat = await fs.lstat(target.path);
  if (!targetStat.isDirectory() || targetStat.isSymbolicLink()) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.TARGET_NOT_INSTALLED,
      "plugin target is not a directory",
    );
  }
  return { extensionsRealPath, targetDir: target.path };
}

function plannedTransactionRoot(extensionsDir: string, transactionId: string): string {
  return path.join(extensionsDir, `.openclaw-guarded-replace-${transactionId}`);
}

async function cleanupTransactionRoot(receipt: GuardedReplaceReceipt): Promise<void> {
  await fs.rm(receipt.transactionRoot, { recursive: true, force: true });
}

async function restorePredecessor(
  receipt: GuardedReplaceReceipt,
  extensionsRealPath: string,
): Promise<boolean> {
  const target = receipt.canonicalTarget.realPath;
  const backup = receipt.predecessor.capturedBackup;
  const backupExists = await pathExists(backup);
  const targetExists = await pathExists(target);
  const targetHash = targetExists
    ? await hashGuardedPluginPayload(target, { boundaryDir: extensionsRealPath })
    : null;
  if (targetHash === receipt.predecessor.payloadSha256) {
    if (backupExists) {
      await fs.rm(backup, { recursive: true, force: true });
    }
    return true;
  }
  const rollbackFallbackReady =
    receipt.rollback.stagedPayloadSha256 === receipt.predecessor.payloadSha256 &&
    (await pathExists(receipt.rollback.stagedPayloadPath));
  if (!backupExists && !rollbackFallbackReady) {
    return false;
  }
  const restoreSource = backupExists ? backup : receipt.rollback.stagedPayloadPath;
  assertExpectedHash(
    await hashGuardedPluginPayload(restoreSource, { boundaryDir: extensionsRealPath }),
    receipt.predecessor.payloadSha256,
    backupExists ? "captured predecessor" : "rollback predecessor fallback",
  );
  if (targetExists) {
    if (targetHash !== receipt.candidate.stagedPayloadSha256) {
      return false;
    }
    await fs.rm(target, { recursive: true, force: true });
  }
  await movePathWithCopyFallback({ from: restoreSource, to: target, sourceHardlinks: "reject" });
  return (
    (await hashGuardedPluginPayload(target, { boundaryDir: extensionsRealPath })) ===
    receipt.predecessor.payloadSha256
  );
}

async function finalizeFailure(params: {
  anchor: GuardedReplaceTrustAnchor;
  receipt: GuardedReplaceReceipt;
  receiptPath: string;
  code: GuardedReplaceFailureCode;
  now: () => number;
  incomplete: boolean;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<GuardedReplaceTrustAnchor> {
  params.receipt.status = params.incomplete ? "INCOMPLETE" : "ROLLED_BACK";
  params.receipt.outcome = params.incomplete ? "INCOMPLETE" : "ROLLED_BACK";
  params.receipt.failure_code = params.code;
  params.receipt.failure_message = params.incomplete
    ? "automatic recovery could not prove a safe predecessor and index state"
    : "guarded replacement rolled back before completion";
  params.receipt.recovery_status = params.incomplete ? "REQUIRES_OPERATOR" : "FINALIZED";
  appendStage(params.receipt, "RECEIPT_FINALIZED", params.now, {
    outcome: params.receipt.outcome,
  });
  return await advanceAndProjectReceipt({
    anchor: params.anchor,
    receipt: params.receipt,
    receiptPath: params.receiptPath,
    ...(params.stateDir ? { stateDir: params.stateDir } : {}),
    ...(params.env ? { env: params.env } : {}),
    platform: process.platform,
  });
}

/** Runs the bounded guarded archive replacement transaction. */
export async function installGuardedReplace(
  params: InstallGuardedReplaceParams,
): Promise<GuardedReplaceReceipt> {
  const now = params.now ?? Date.now;
  const createId = params.createId ?? createUuidV7;
  const candidateSha256 = assertSha256(params.candidateSha256, "candidate identity");
  const predecessorSha256 = assertSha256(params.expectedPredecessorSha256, "predecessor identity");
  const rollbackSha256 = assertSha256(params.rollbackSha256, "rollback identity");
  const candidatePath = resolveUserPath(params.candidateArchive);
  const rollbackPath = resolveUserPath(params.rollbackArchive);
  const receiptPath = path.resolve(resolveUserPath(params.receiptPath));
  const candidateSuffix = resolveArchiveCustodySuffix(candidatePath);
  const rollbackSuffix = resolveArchiveCustodySuffix(rollbackPath);
  assertExpectedHash(
    await hashRegularFileDescriptor(candidatePath),
    candidateSha256,
    "candidate archive",
  );
  assertExpectedHash(
    await hashRegularFileDescriptor(rollbackPath),
    rollbackSha256,
    "rollback archive",
  );

  const { extensionsRealPath, targetDir } = await resolveBoundTarget(params);
  assertExpectedHash(
    await hashGuardedPluginPayload(targetDir, { boundaryDir: extensionsRealPath }),
    predecessorSha256,
    "installed predecessor",
  );
  const previousRecords = await loadInstallRecords(params);
  const previousRecord = previousRecords[params.pluginId];
  const previousInstallRealPath = previousRecord?.installPath
    ? await fs.realpath(resolveUserPath(previousRecord.installPath)).catch(() => null)
    : null;
  if (
    !previousRecord ||
    previousRecord.source !== "archive" ||
    !previousInstallRealPath ||
    path.resolve(previousInstallRealPath) !== path.resolve(targetDir)
  ) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INSTALLED_STATE_MISMATCH,
      "guarded replacement requires a tracked local-archive install at the canonical target",
    );
  }

  const transactionId = createId(now());
  if (!UUID_PATTERN.test(transactionId)) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "transaction ids must be UUIDv7",
    );
  }
  const transactionRoot = plannedTransactionRoot(extensionsRealPath, transactionId);
  const backupDir = path.join(transactionRoot, "predecessor");
  const stagingExtensionsDir = path.join(transactionRoot, "staged");
  const rollbackStagingExtensionsDir = path.join(transactionRoot, "rollback-staged");
  const rollbackStagedPayload = path.join(
    rollbackStagingExtensionsDir,
    encodePluginInstallDirName(params.pluginId),
  );
  const transactionCustodyDir = path.join(transactionRoot, "custody");
  const candidateCustodyPath = resolveDurableCandidateCustodyPath({
    candidateSha256,
    candidateSuffix,
    ...stateOptions(params),
  });
  const rollbackCustodyPath = path.join(transactionCustodyDir, `rollback${rollbackSuffix}`);
  const receipt: GuardedReplaceReceipt = {
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    transactionId,
    leaseId: transactionId,
    durability: receiptDurabilityForPlatform(process.platform),
    pluginId: params.pluginId,
    status: "RESERVED",
    canonicalTarget: {
      realPath: targetDir,
      boundaryLabel: "extensions directory",
      nameEncoder: "encodePluginInstallDirName",
    },
    predecessor: {
      payloadSha256: predecessorSha256,
      capturedBackup: backupDir,
      capturedAtMs: null,
    },
    candidate: {
      archivePath: candidateCustodyPath,
      archiveSha256: candidateSha256,
      stagedPayloadSha256: null,
      manifest: null,
    },
    rollback: {
      archivePath: rollbackCustodyPath,
      archiveSha256: rollbackSha256,
      stagedPayloadPath: rollbackStagedPayload,
      stagedPayloadSha256: null,
    },
    installedIndex: {
      previousRecordSha256: recordHash(previousRecord),
      candidateRecordSha256: null,
    },
    transactionRoot,
    stages: [],
    guards: [],
    finalInstalledSha256: null,
    outcome: null,
    failure_code: null,
    failure_message: null,
    recovery_status: "RESUMABLE",
  };
  appendStage(receipt, "IDENTITY_VERIFIED", now, {
    candidateArchiveSha256: candidateSha256,
    predecessorPayloadSha256: predecessorSha256,
    rollbackArchiveSha256: rollbackSha256,
  });
  appendStage(receipt, "RECEIPT_RESERVED", now, {
    createOnly: true,
    durability: receipt.durability,
  });
  await reserveReceipt(receiptPath, receipt, {
    platform: process.platform,
    fault: params.fault,
  });
  injectFault(params.fault, "after-receipt-reserved");
  let trustAnchor: GuardedReplaceTrustAnchor = {
    schemaVersion: 2,
    revision: 0,
    receiptPath,
    previousReceiptSha256: null,
    receipt: structuredClone(receipt),
    previousRecord,
    candidateRecord: null,
    createdAtMs: now(),
  };
  reserveTrustAnchor(trustAnchor, params);

  let leaseEntered = false;
  let stateCommitted = false;
  let receiptFinalized = false;
  let candidateRecord: PluginInstallRecord | undefined;
  try {
    const completed = await withGuardedLifecycleLease(
      { ...stateOptions(params), owner: transactionId },
      async (lease) => {
        leaseEntered = true;
        try {
          if (lease.owner !== receipt.leaseId) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.LEASE_UNAVAILABLE,
              "lifecycle lease owner does not match the durable transaction owner",
            );
          }
          receipt.status = "ACTIVE";
          appendStage(receipt, "LEASE_HELD", now, { leaseId: lease.owner });
          trustAnchor = await advanceAndProjectReceipt({
            anchor: trustAnchor,
            receipt,
            receiptPath,
            ...stateOptions(params),
            platform: process.platform,
            fault: params.fault,
          });

          lease.assertOwned();
          const leasedRecords = await loadInstallRecords(params);
          if (
            recordHash(leasedRecords[params.pluginId]) !==
            trustAnchor.receipt.installedIndex.previousRecordSha256
          ) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.INSTALLED_STATE_MISMATCH,
              "installed plugin record changed before the lifecycle lease was acquired",
            );
          }
          await fs.mkdir(transactionRoot, { mode: 0o700 });
          await fs.mkdir(transactionCustodyDir, { mode: 0o700 });
          await acquireDurableCandidateCustody({
            sourcePath: candidatePath,
            custodyPath: candidateCustodyPath,
            expectedSha256: candidateSha256,
            transactionId,
          });
          await copyGuardedArchiveToCustody({
            sourcePath: rollbackPath,
            custodyPath: rollbackCustodyPath,
            expectedSha256: rollbackSha256,
            label: "rollback archive",
          });
          await syncDirectory(transactionCustodyDir);
          await fs.mkdir(stagingExtensionsDir, { recursive: true, mode: 0o700 });
          const staged = await installPluginFromArchive({
            archivePath: candidateCustodyPath,
            config: params.config,
            expectedPluginId: params.pluginId,
            extensionsDir: stagingExtensionsDir,
            mode: "install",
            timeoutMs: params.timeoutMs,
          });
          if (!staged.ok) {
            throw guardedError(
              staged.code
                ? GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED
                : GUARDED_REPLACE_FAILURE_CODE.STAGING_FAILED,
              staged.error,
            );
          }
          const expectedStagedTarget = path.join(
            stagingExtensionsDir,
            encodePluginInstallDirName(params.pluginId),
          );
          if (path.resolve(staged.targetDir) !== path.resolve(expectedStagedTarget)) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
              "staged target identity drifted",
            );
          }
          const stagedPayloadSha256 = await hashGuardedPluginPayload(staged.targetDir, {
            boundaryDir: extensionsRealPath,
          });
          const rollbackStaged = await installPluginFromArchive({
            archivePath: rollbackCustodyPath,
            config: params.config,
            expectedPluginId: params.pluginId,
            extensionsDir: rollbackStagingExtensionsDir,
            mode: "install",
            timeoutMs: params.timeoutMs,
          });
          if (!rollbackStaged.ok) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
              `rollback archive validation failed: ${rollbackStaged.error}`,
            );
          }
          if (path.resolve(rollbackStaged.targetDir) !== path.resolve(rollbackStagedPayload)) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
              "rollback staged target identity drifted",
            );
          }
          const rollbackPayloadSha256 = await hashGuardedPluginPayload(rollbackStaged.targetDir, {
            boundaryDir: extensionsRealPath,
          });
          assertExpectedHash(
            rollbackPayloadSha256,
            predecessorSha256,
            "rollback predecessor payload",
          );
          receipt.candidate.stagedPayloadSha256 = stagedPayloadSha256;
          receipt.candidate.manifest = {
            id: staged.pluginId,
            ...(staged.manifestName ? { name: staged.manifestName } : {}),
            ...(staged.version ? { version: staged.version } : {}),
          };
          receipt.rollback.stagedPayloadSha256 = rollbackPayloadSha256;
          candidateRecord = buildGuardedReplaceInstallRecord({
            previous: previousRecord,
            candidateArchivePath: candidateCustodyPath,
            candidateSha256,
            targetDir,
            version: staged.version,
            installedAt: new Date(now()).toISOString(),
          });
          receipt.installedIndex.candidateRecordSha256 = recordHash(candidateRecord);
          const policyFacts = {
            transactionId,
            targetPath: targetDir,
            candidateArchiveSha256: candidateSha256,
            candidatePayloadSha256: stagedPayloadSha256,
            predecessorPayloadSha256: predecessorSha256,
            rollbackArchiveSha256: rollbackSha256,
            rollbackPayloadSha256,
            configSha256: hashJson(params.config),
          };
          const policyDecision = await runInstallPolicy({
            config: params.config,
            env: params.env,
            request: {
              targetType: "plugin",
              targetName: params.pluginId,
              sourcePath: candidateCustodyPath,
              sourcePathKind: "file",
              source: {
                kind: "archive",
                authority: "user",
                mutable: false,
                network: false,
              },
              origin: { type: "plugin-guarded-replace", ...policyFacts },
              request: {
                kind: "plugin-archive",
                mode: "update",
                requestedSpecifier: `sha256:${candidateSha256}`,
              },
              plugin: {
                pluginId: params.pluginId,
                contentType: "package",
                manifestId: staged.pluginId,
                ...(staged.version ? { version: staged.version } : {}),
                extensions: staged.extensions,
              },
            },
          });
          appendStage(receipt, "STAGED", now, {
            stagedPayloadSha256,
            rollbackPayloadSha256,
          });
          receipt.guards = [
            { name: "manifest", outcome: "PASS", evidence: { pluginId: staged.pluginId } },
            { name: "package", outcome: "PASS", evidence: { version: staged.version ?? null } },
            {
              name: "policy",
              outcome: policyDecision?.blocked
                ? "FAIL"
                : policyDecision === undefined
                  ? "NOT_CONFIGURED"
                  : "PASS",
              evidence: {
                mode: "update",
                facts: policyFacts,
                decision: policyDecision ?? null,
              },
            },
            {
              name: "security_scan",
              outcome: "PASS",
              evidence: { source: "archive", stagingMode: "install" },
            },
            { name: "installed_state", outcome: "PASS", evidence: { source: "archive" } },
          ];
          appendStage(receipt, "GUARDS_RAN", now, {
            outcome: policyDecision?.blocked ? "FAIL" : "PASS",
          });
          trustAnchor = await advanceAndProjectReceipt({
            anchor: trustAnchor,
            receipt,
            receiptPath,
            ...stateOptions(params),
            platform: process.platform,
            fault: params.fault,
            candidateRecord,
          });
          if (policyDecision?.blocked) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
              policyDecision.blocked.reason,
            );
          }

          assertExpectedHash(
            await hashRegularFileDescriptor(candidateCustodyPath),
            candidateSha256,
            "candidate custody archive",
          );
          assertExpectedHash(
            await hashRegularFileDescriptor(rollbackCustodyPath),
            rollbackSha256,
            "rollback custody archive",
          );
          if (params.fault === "predecessor-mode-drift") {
            await fs.chmod(targetDir, 0o755);
          }
          assertExpectedHash(
            await hashGuardedPluginPayload(targetDir, { boundaryDir: extensionsRealPath }),
            predecessorSha256,
            "installed predecessor",
          );
          if (params.fault === "candidate-mode-drift") {
            await fs.chmod(staged.targetDir, 0o755);
          }
          if (params.fault === "rollback-mode-drift") {
            await fs.chmod(rollbackStaged.targetDir, 0o755);
          }
          assertExpectedHash(
            await hashGuardedPluginPayload(staged.targetDir, { boundaryDir: extensionsRealPath }),
            stagedPayloadSha256,
            "staged candidate payload",
          );
          assertExpectedHash(
            await hashGuardedPluginPayload(rollbackStaged.targetDir, {
              boundaryDir: extensionsRealPath,
            }),
            rollbackPayloadSha256,
            "staged rollback payload",
          );
          injectFault(params.fault, "before-swap");

          lease.assertOwned();
          await movePathWithCopyFallback({
            from: targetDir,
            to: backupDir,
            sourceHardlinks: "reject",
          }).catch((error) => {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.PREDECESSOR_CAPTURE_FAILED,
              "failed to capture recoverable predecessor",
              error,
            );
          });
          assertExpectedHash(
            await hashGuardedPluginPayload(backupDir, { boundaryDir: extensionsRealPath }),
            predecessorSha256,
            "captured predecessor",
          );
          receipt.predecessor.capturedAtMs = now();
          appendStage(receipt, "PREDECESSOR_CAPTURED", now, { payloadSha256: predecessorSha256 });
          trustAnchor = await advanceAndProjectReceipt({
            anchor: trustAnchor,
            receipt,
            receiptPath,
            ...stateOptions(params),
            platform: process.platform,
          });

          lease.assertOwned();
          await movePathWithCopyFallback({
            from: staged.targetDir,
            to: targetDir,
            sourceHardlinks: "reject",
          }).catch((error) => {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.SWAP_FAILED,
              "candidate swap failed",
              error,
            );
          });
          const finalInstalledSha256 = await hashGuardedPluginPayload(targetDir, {
            boundaryDir: extensionsRealPath,
          });
          assertExpectedHash(finalInstalledSha256, stagedPayloadSha256, "published candidate");
          receipt.finalInstalledSha256 = finalInstalledSha256;
          appendStage(receipt, "SWAP_PUBLISHED", now, { finalInstalledSha256 });
          trustAnchor = await advanceAndProjectReceipt({
            anchor: trustAnchor,
            receipt,
            receiptPath,
            ...stateOptions(params),
            platform: process.platform,
          });
          injectFault(params.fault, "after-swap");

          await compareAndSwapInstallRecord({
            ...params,
            expectedRecordSha256: trustAnchor.receipt.installedIndex.previousRecordSha256,
            nextRecord: candidateRecord,
            lease,
          }).catch((error) => {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.STATE_FINALIZE_FAILED,
              "installed plugin index transaction failed",
              error,
            );
          });
          stateCommitted = true;
          injectFault(params.fault, "after-state-finalize");

          appendStage(receipt, "STATE_FINALIZED", now, {
            installRecordSha256: receipt.installedIndex.candidateRecordSha256,
          });
          receipt.status = "COMPLETED";
          receipt.outcome = "SUCCESS";
          receipt.recovery_status = "FINALIZED";
          appendStage(receipt, "RECEIPT_FINALIZED", now, { outcome: "SUCCESS" });
          try {
            trustAnchor = await advanceAndProjectReceipt({
              anchor: trustAnchor,
              receipt,
              receiptPath,
              ...stateOptions(params),
              platform: process.platform,
            });
          } catch (error) {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.RECEIPT_FINALIZE_FAILED,
              "receipt finalization failed after state commit",
              error,
            );
          }
          receiptFinalized = true;
          if (params.fault === "cleanup-failure") {
            throw guardedError(
              GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
              "post-finalization cleanup failure injected",
            );
          }
          await cleanupTransactionRoot(receipt);
          return receipt;
        } catch (error) {
          const failure =
            error instanceof GuardedReplaceError
              ? error
              : guardedError(
                  GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
                  "guarded replacement failed",
                  error,
                );
          // A durable success receipt is the transaction commit point. Cleanup
          // errors after it must never enter rollback compensation.
          if (receiptFinalized) {
            throw failure;
          }
          // Fault injection models abrupt process loss: leave the receipt and
          // planned recovery artifacts exactly at that boundary for reconciliation.
          if (
            failure.code === GUARDED_REPLACE_FAILURE_CODE.FAULT_INJECTED ||
            (stateCommitted &&
              failure.code === GUARDED_REPLACE_FAILURE_CODE.RECEIPT_FINALIZE_FAILED)
          ) {
            throw failure;
          }
          let incomplete = false;
          try {
            lease.assertOwned();
            incomplete = !(await restorePredecessor(receipt, extensionsRealPath));
            if (!incomplete && stateCommitted) {
              await compareAndSwapInstallRecord({
                ...params,
                expectedRecordSha256:
                  trustAnchor.receipt.installedIndex.candidateRecordSha256 ?? recordHash(undefined),
                nextRecord: trustAnchor.previousRecord,
                lease,
              });
            }
            if (!incomplete) {
              await cleanupTransactionRoot(receipt);
            }
          } catch {
            incomplete = true;
          }
          try {
            trustAnchor = await finalizeFailure({
              anchor: trustAnchor,
              receipt,
              receiptPath,
              code: incomplete ? GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE : failure.code,
              now,
              incomplete,
              ...stateOptions(params),
            });
          } catch {
            // The independently persisted anchor remains the recovery authority.
          }
          throw failure;
        }
      },
    );
    injectFault(params.fault, "after-lease-release");
    return completed;
  } catch (error) {
    const failure =
      error instanceof GuardedReplaceError
        ? error
        : guardedError(
            GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
            "guarded replacement failed",
            error,
          );
    // Callback entry proves that transaction failure handling already ran under
    // the lease. This also protects a durable result from post-release errors.
    if (leaseEntered) {
      throw failure;
    }
    receipt.status = "ABORTED";
    receipt.outcome = "ABORTED";
    receipt.failure_code = failure.code;
    receipt.failure_message = "guarded replacement aborted before acquiring the lifecycle lease";
    receipt.recovery_status = "FINALIZED";
    appendStage(receipt, "RECEIPT_FINALIZED", now, { outcome: "ABORTED" });
    await cleanupTransactionRoot(receipt).catch(() => undefined);
    trustAnchor = await advanceAndProjectReceipt({
      anchor: trustAnchor,
      receipt,
      receiptPath,
      ...stateOptions(params),
      platform: process.platform,
    }).catch(() => trustAnchor);
    throw failure;
  }
}

function assertReceiptPathsBound(
  receipt: GuardedReplaceReceipt,
  extensionsRealPath: string,
  targetDir: string,
  params: { stateDir?: string; env?: NodeJS.ProcessEnv },
): void {
  const expectedRoot = plannedTransactionRoot(extensionsRealPath, receipt.transactionId);
  const expectedCustodyDir = path.join(expectedRoot, "custody");
  const expectedCandidateCustodyPath = resolveDurableCandidateCustodyPath({
    candidateSha256: receipt.candidate.archiveSha256,
    candidateSuffix: resolveArchiveCustodySuffix(receipt.candidate.archivePath),
    ...stateOptions(params),
  });
  const expectedRollbackStagedPayload = path.join(
    expectedRoot,
    "rollback-staged",
    encodePluginInstallDirName(receipt.pluginId),
  );
  if (
    path.resolve(receipt.canonicalTarget.realPath) !== path.resolve(targetDir) ||
    path.resolve(receipt.transactionRoot) !== path.resolve(expectedRoot) ||
    path.resolve(receipt.predecessor.capturedBackup) !==
      path.resolve(path.join(expectedRoot, "predecessor")) ||
    path.resolve(receipt.candidate.archivePath) !== path.resolve(expectedCandidateCustodyPath) ||
    path.resolve(path.dirname(receipt.rollback.archivePath)) !== path.resolve(expectedCustodyDir) ||
    !/^rollback\.(?:zip|tgz|tar\.gz)$/u.test(path.basename(receipt.rollback.archivePath)) ||
    path.resolve(receipt.rollback.stagedPayloadPath) !== path.resolve(expectedRollbackStagedPayload)
  ) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "receipt paths are not canonical",
    );
  }
}

function resolveAuthoritativeReceipt(params: {
  receipt: GuardedReplaceReceipt;
  receiptPath: string;
  anchor: GuardedReplaceTrustAnchor;
}): GuardedReplaceReceipt {
  const authoritativeHash = hashJson(params.anchor.receipt);
  const projectedHash = hashJson(params.receipt);
  const projectionIsCurrent = projectedHash === authoritativeHash;
  const projectionLagsOneRevision = projectedHash === params.anchor.previousReceiptSha256;
  const anchorRecordsMatch =
    recordHash(params.anchor.previousRecord) ===
      params.anchor.receipt.installedIndex.previousRecordSha256 &&
    recordHash(params.anchor.candidateRecord ?? undefined) ===
      (params.anchor.receipt.installedIndex.candidateRecordSha256 ?? recordHash(undefined));
  if (
    path.resolve(params.anchor.receiptPath) !== path.resolve(params.receiptPath) ||
    (!projectionIsCurrent && !projectionLagsOneRevision) ||
    !anchorRecordsMatch
  ) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE,
      "receipt projection does not match the current or immediately previous trust-anchor revision",
    );
  }
  return structuredClone(params.anchor.receipt);
}

async function markReconciled(params: {
  anchor: GuardedReplaceTrustAnchor;
  receipt: GuardedReplaceReceipt;
  receiptPath: string;
  now: () => number;
  outcome: ReceiptOutcome;
  incomplete?: boolean;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<GuardedReplaceReceipt> {
  params.receipt.status = params.incomplete
    ? "INCOMPLETE"
    : params.outcome === "SUCCESS"
      ? "COMPLETED"
      : params.outcome === "ROLLED_BACK"
        ? "ROLLED_BACK"
        : "ABORTED";
  params.receipt.outcome = params.outcome;
  params.receipt.failure_code = params.incomplete
    ? GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE
    : null;
  params.receipt.failure_message = params.incomplete
    ? "automatic recovery requires operator authorization"
    : null;
  params.receipt.recovery_status = params.incomplete ? "REQUIRES_OPERATOR" : "FINALIZED";
  appendStage(params.receipt, "RECEIPT_FINALIZED", params.now, {
    reconciled: true,
    outcome: params.outcome,
  });
  await advanceAndProjectReceipt({
    anchor: params.anchor,
    receipt: params.receipt,
    receiptPath: params.receiptPath,
    ...(params.stateDir ? { stateDir: params.stateDir } : {}),
    ...(params.env ? { env: params.env } : {}),
    platform: process.platform,
  });
  return params.receipt;
}

/** Reconciles one create-only receipt without accepting any replacement arguments. */
export async function installGuardedReplaceReconcile(
  params: ReconcileGuardedReplaceParams,
): Promise<GuardedReplaceReceipt> {
  const now = params.now ?? Date.now;
  const receiptPath = resolveUserPath(params.receiptPath);
  let receipt = await readReceipt(receiptPath);
  const trustAnchor = loadTrustAnchor(receipt.transactionId, params);
  if (trustAnchor) {
    receipt = resolveAuthoritativeReceipt({ receipt, receiptPath, anchor: trustAnchor });
    await persistReceipt(receiptPath, receipt, process.platform);
  }
  const extensionsRealPath = await fs.realpath(params.extensionsDir);
  const target = resolveSafeInstallDir({
    baseDir: extensionsRealPath,
    id: receipt.pluginId,
    invalidNameMessage: "invalid plugin name: path traversal detected",
    nameEncoder: encodePluginInstallDirName,
  });
  if (!target.ok) {
    throw guardedError(GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT, target.error);
  }
  try {
    await assertCanonicalPathWithinBase({
      baseDir: extensionsRealPath,
      candidatePath: target.path,
      boundaryLabel: "extensions directory",
    });
  } catch (error) {
    throw guardedError(
      GUARDED_REPLACE_FAILURE_CODE.INVALID_INPUT,
      "plugin target is not canonical",
      error,
    );
  }
  const targetDir = target.path;
  assertReceiptPathsBound(receipt, extensionsRealPath, targetDir, params);

  if (!trustAnchor) {
    const bootstrapIsUntouched =
      receipt.status === "RESERVED" &&
      receipt.outcome === null &&
      receipt.predecessor.capturedAtMs === null &&
      receipt.candidate.stagedPayloadSha256 === null &&
      receipt.rollback.stagedPayloadSha256 === null &&
      !(await pathExists(receipt.transactionRoot));
    if (!bootstrapIsUntouched) {
      throw guardedError(
        GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE,
        "guarded replacement trust anchor is missing after setup began",
      );
    }
    return await withGuardedLifecycleLease(
      { ...stateOptions(params), owner: receipt.leaseId },
      async (lease) => {
        lease.assertOwned();
        const records = await loadInstallRecords(params);
        const targetSha256 = (await pathExists(targetDir))
          ? await hashGuardedPluginPayload(targetDir, { boundaryDir: extensionsRealPath })
          : null;
        if (
          recordHash(records[receipt.pluginId]) !== receipt.installedIndex.previousRecordSha256 ||
          targetSha256 !== receipt.predecessor.payloadSha256
        ) {
          throw guardedError(
            GUARDED_REPLACE_FAILURE_CODE.RECOVERY_INCOMPLETE,
            "bootstrap receipt cannot prove untouched predecessor state",
          );
        }
        receipt.status = "ABORTED";
        receipt.outcome = "ABORTED";
        receipt.recovery_status = "FINALIZED";
        appendStage(receipt, "RECEIPT_FINALIZED", now, {
          reconciled: true,
          outcome: "ABORTED",
          bootstrap: true,
        });
        await persistReceipt(receiptPath, receipt, process.platform);
        return receipt;
      },
    );
  }

  return await withGuardedLifecycleLease(
    { ...stateOptions(params), owner: receipt.leaseId },
    async (lease) => {
      lease.assertOwned();
      const records = await loadInstallRecords(params);
      const currentRecordSha256 = recordHash(records[receipt.pluginId]);
      const targetExists = await pathExists(targetDir);
      const targetSha256 = targetExists
        ? await hashGuardedPluginPayload(targetDir, { boundaryDir: extensionsRealPath })
        : null;
      const candidateRecordPresent =
        receipt.installedIndex.candidateRecordSha256 !== null &&
        currentRecordSha256 === receipt.installedIndex.candidateRecordSha256;
      const previousRecordPresent =
        currentRecordSha256 === receipt.installedIndex.previousRecordSha256;

      if (
        candidateRecordPresent &&
        targetSha256 !== null &&
        targetSha256 === receipt.candidate.stagedPayloadSha256
      ) {
        receipt.finalInstalledSha256 = targetSha256;
        if (receipt.status === "COMPLETED" && receipt.outcome === "SUCCESS") {
          await cleanupTransactionRoot(receipt);
          return receipt;
        }
        if (!receipt.stages.some((stage) => stage.name === "STATE_FINALIZED")) {
          appendStage(receipt, "STATE_FINALIZED", now, {
            installRecordSha256: currentRecordSha256,
            reconciled: true,
          });
        }
        const completed = await markReconciled({
          anchor: trustAnchor,
          receipt,
          receiptPath,
          now,
          outcome: "SUCCESS",
          ...stateOptions(params),
        });
        await cleanupTransactionRoot(receipt);
        return completed;
      }

      if (previousRecordPresent) {
        const restored = await restorePredecessor(receipt, extensionsRealPath);
        if (!restored) {
          return await markReconciled({
            anchor: trustAnchor,
            receipt,
            receiptPath,
            now,
            outcome: "INCOMPLETE",
            incomplete: true,
            ...stateOptions(params),
          });
        }
        await cleanupTransactionRoot(receipt);
        if (
          (receipt.status === "ROLLED_BACK" && receipt.outcome === "ROLLED_BACK") ||
          (receipt.status === "ABORTED" && receipt.outcome === "ABORTED")
        ) {
          return receipt;
        }
        return await markReconciled({
          anchor: trustAnchor,
          receipt,
          receiptPath,
          now,
          outcome: receipt.predecessor.capturedAtMs === null ? "ABORTED" : "ROLLED_BACK",
          ...stateOptions(params),
        });
      }

      if (candidateRecordPresent) {
        const restored = await restorePredecessor(receipt, extensionsRealPath);
        if (!restored) {
          return await markReconciled({
            anchor: trustAnchor,
            receipt,
            receiptPath,
            now,
            outcome: "INCOMPLETE",
            incomplete: true,
            ...stateOptions(params),
          });
        }
        await compareAndSwapInstallRecord({
          ...params,
          pluginId: receipt.pluginId,
          expectedRecordSha256: receipt.installedIndex.candidateRecordSha256!,
          nextRecord: trustAnchor.previousRecord,
          lease,
        });
        await cleanupTransactionRoot(receipt);
        return await markReconciled({
          anchor: trustAnchor,
          receipt,
          receiptPath,
          now,
          outcome: "ROLLED_BACK",
          ...stateOptions(params),
        });
      }

      return await markReconciled({
        anchor: trustAnchor,
        receipt,
        receiptPath,
        now,
        outcome: "INCOMPLETE",
        incomplete: true,
        ...stateOptions(params),
      });
    },
  );
}
