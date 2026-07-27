import { closeSync, constants as fsConstants, fstatSync, openSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import process from "node:process";
import { isDeepStrictEqual } from "node:util";
import type { CronJob, CronStoreFile } from "../types.js";

const GUARD_SCHEMA_VERSION = "model-router-evidence-cron-mutation-guard/v1";
const DEFAULT_GUARD_PATH = path.join(
  homedir(),
  ".openclaw",
  "state",
  "model-router-evidence-cron-mutation-guard.json",
);
const DEFAULT_ROLLOUT_LOCK_PATH = path.join(
  homedir(),
  ".openclaw",
  "state",
  "model-router-rollout.lock",
);
const REQUIRED_BLOCKED_ACTIONS = ["add", "remove", "update"];
const MAX_BYTES = 16 * 1024;
let testPathOverrides: { guardPath: string; rolloutLockPath: string } | undefined;

type GuardState =
  | { active: false }
  | {
      active: true;
      failClosed: boolean;
      planSha256?: string;
      runId?: string;
    };

export class CronMutationGuardActiveError extends Error {
  code = "CRON_MUTATION_GUARD_ACTIVE" as const;

  constructor() {
    super(
      "cron definition and enabled-state mutations are frozen during a model-router evidence campaign",
    );
    this.name = "CronMutationGuardActiveError";
  }
}

function exactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    JSON.stringify(Object.keys(value).toSorted()) === JSON.stringify(keys.toSorted())
  );
}

function validSha256(value: unknown): value is string {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/u.test(value);
}

function validRunId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 1 &&
    value.length <= 200 &&
    /^[a-zA-Z0-9:._-]+$/u.test(value)
  );
}

function canonicalUtcIso(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(value)) {
    return false;
  }
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value;
}

function readOwnerOnlyJson(
  filePath: string,
  allowedModes: ReadonlySet<number>,
): { status: "absent" } | { status: "invalid" } | { status: "ok"; value: unknown } {
  let directoryDescriptor: number | undefined;
  try {
    directoryDescriptor = openSync(
      path.dirname(filePath),
      fsConstants.O_RDONLY | fsConstants.O_DIRECTORY | fsConstants.O_NOFOLLOW,
    );
    const directory = fstatSync(directoryDescriptor);
    if (
      !directory.isDirectory() ||
      (directory.mode & 0o077) !== 0 ||
      (typeof process.getuid === "function" && directory.uid !== process.getuid())
    ) {
      return { status: "invalid" };
    }
  } catch {
    return { status: "invalid" };
  } finally {
    if (directoryDescriptor !== undefined) {
      closeSync(directoryDescriptor);
    }
  }
  let descriptor: number;
  let before;
  try {
    descriptor = openSync(filePath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
    before = fstatSync(descriptor);
  } catch (error) {
    return (error as NodeJS.ErrnoException)?.code === "ENOENT"
      ? { status: "absent" }
      : { status: "invalid" };
  }
  try {
    if (
      !before.isFile() ||
      before.nlink !== 1 ||
      !allowedModes.has(before.mode & 0o777) ||
      (typeof process.getuid === "function" && before.uid !== process.getuid()) ||
      before.size < 2 ||
      before.size > MAX_BYTES
    ) {
      return { status: "invalid" };
    }
    let bytes: string;
    let after;
    try {
      bytes = readFileSync(descriptor, "utf8");
      after = fstatSync(descriptor);
    } catch {
      return { status: "invalid" };
    }
    if (
      after.dev !== before.dev ||
      after.ino !== before.ino ||
      after.size !== before.size ||
      after.mtimeMs !== before.mtimeMs ||
      after.ctimeMs !== before.ctimeMs
    ) {
      return { status: "invalid" };
    }
    try {
      return { status: "ok", value: JSON.parse(bytes) };
    } catch {
      return { status: "invalid" };
    }
  } finally {
    closeSync(descriptor);
  }
}

export function inspectCronDefinitionMutationGuard({
  guardPath = testPathOverrides?.guardPath ?? DEFAULT_GUARD_PATH,
  rolloutLockPath = testPathOverrides?.rolloutLockPath ?? DEFAULT_ROLLOUT_LOCK_PATH,
  nowMs = Date.now(),
}: {
  guardPath?: string;
  rolloutLockPath?: string;
  nowMs?: number;
} = {}): GuardState {
  const guardRead = readOwnerOnlyJson(path.resolve(guardPath), new Set([0o400]));
  const lockRead = readOwnerOnlyJson(path.resolve(rolloutLockPath), new Set([0o400, 0o600]));
  const lockPresent = lockRead.status !== "absent";
  if (guardRead.status === "absent") {
    return lockPresent ? { active: true, failClosed: true } : { active: false };
  }
  if (guardRead.status !== "ok") {
    return { active: true, failClosed: true };
  }
  const guard = guardRead.value;
  const guardKeys = [
    "allowScheduledExecution",
    "blockedActions",
    "expiresAt",
    "planSha256",
    "runId",
    "schemaVersion",
    "startsAt",
    "status",
  ];
  if (
    !exactKeys(guard, guardKeys) ||
    guard.schemaVersion !== GUARD_SCHEMA_VERSION ||
    guard.status !== "active" ||
    guard.allowScheduledExecution !== true ||
    !validRunId(guard.runId) ||
    !validSha256(guard.planSha256) ||
    !canonicalUtcIso(guard.startsAt) ||
    !canonicalUtcIso(guard.expiresAt) ||
    JSON.stringify(guard.blockedActions) !== JSON.stringify(REQUIRED_BLOCKED_ACTIONS)
  ) {
    return { active: true, failClosed: true };
  }
  const startsAt = Date.parse(guard.startsAt);
  const expiresAt = Date.parse(guard.expiresAt);
  if (
    !Number.isFinite(startsAt) ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= startsAt ||
    nowMs < startsAt
  ) {
    return { active: true, failClosed: true };
  }
  if (nowMs >= expiresAt) {
    return lockPresent ? { active: true, failClosed: true } : { active: false };
  }
  if (lockPresent) {
    if (
      lockRead.status !== "ok" ||
      !exactKeys(lockRead.value, ["outputDir", "planSha256", "runId"]) ||
      lockRead.value.planSha256 !== guard.planSha256 ||
      lockRead.value.runId !== guard.runId
    ) {
      return { active: true, failClosed: true };
    }
  }
  return {
    active: true,
    failClosed: false,
    planSha256: guard.planSha256,
    runId: guard.runId,
  };
}

export function assertCronDefinitionMutationAllowed(
  options: Parameters<typeof inspectCronDefinitionMutationGuard>[0] = {},
): void {
  const guard = inspectCronDefinitionMutationGuard(options);
  if (guard.active) {
    throw new CronMutationGuardActiveError();
  }
}

function definitionProjection(
  job: CronJob,
): Omit<CronJob, "createdAtMs" | "state" | "updatedAtMs"> {
  const {
    createdAtMs: _createdAtMs,
    state: _state,
    updatedAtMs: _updatedAtMs,
    ...definition
  } = job;
  return definition;
}

export function assertCronDefinitionSnapshotMutationAllowed(
  before: CronStoreFile | null,
  after: CronStoreFile | null,
  options: Parameters<typeof inspectCronDefinitionMutationGuard>[0] = {},
): void {
  const beforeProjection = (before?.jobs ?? [])
    .map(definitionProjection)
    .toSorted((left, right) => left.id.localeCompare(right.id));
  const afterProjection = (after?.jobs ?? [])
    .map(definitionProjection)
    .toSorted((left, right) => left.id.localeCompare(right.id));
  if (!isDeepStrictEqual(beforeProjection, afterProjection)) {
    assertCronDefinitionMutationAllowed(options);
  }
}

if (process.env.VITEST || process.env.NODE_ENV === "test") {
  (globalThis as Record<PropertyKey, unknown>)[Symbol.for("openclaw.cronMutationGuardTestApi")] = {
    setPathOverrides(value?: { guardPath: string; rolloutLockPath: string }) {
      testPathOverrides = value;
    },
  };
}
