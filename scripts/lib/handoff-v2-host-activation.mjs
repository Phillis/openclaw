import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  closeSync,
  constants,
  fstatSync,
  fsyncSync,
  linkSync,
  lstatSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export const HOST_ACTIVATION_PLAN_SCHEMA = "handoff-v2-host-activation-plan/v1";
export const HOST_ACTIVATION_RECEIPT_SCHEMA = "handoff-v2-host-activation-receipt/v1";
export const SLACK_ACCESS_PROOF_SCHEMA = "openclaw-slack-access-proof/v1";

const SHA256_RE = /^[a-f0-9]{64}$/u;
const GIT_OBJECT_RE = /^[a-f0-9]{40}$/u;
const ISO_INSTANT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const PLAN_KEYS = [
  "schema",
  "planId",
  "createdAt",
  "expiresAt",
  "authority",
  "host",
  "predecessor",
  "successor",
  "guard",
  "quiescence",
  "slack",
  "operations",
  "evidence",
];
const AUTHORITY_KEYS = ["kind", "grants", "reusable"];
const HOST_KEYS = [
  "platform",
  "uid",
  "homePath",
  "stateDir",
  "stagingRoot",
  "evidenceRoot",
  "launchdDomain",
  "launchdLabel",
  "gatewayPort",
];
const PREDECESSOR_KEYS = [
  "commit",
  "tree",
  "pid",
  "runCount",
  "cliPath",
  "cliSha256",
  "runtimePath",
  "runtimeSha256",
  "gatewayEntrypointPath",
  "gatewayEntrypointSha256",
  "wrapperPath",
  "wrapperSha256",
  "environmentFilePath",
  "environmentFileSha256",
  "runtimeStampPath",
  "runtimeStampSha256",
  "buildManifestPath",
  "buildManifestSha256",
  "expectedProcessCommand",
  "servicePlistPath",
  "servicePlistSha256",
  "configPath",
  "configSha256",
];
const SUCCESSOR_KEYS = [
  "commit",
  "tree",
  "cliPath",
  "cliSha256",
  "runtimePath",
  "runtimeSha256",
  "gatewayEntrypointPath",
  "gatewayEntrypointSha256",
  "wrapperPath",
  "wrapperSha256",
  "environmentFilePath",
  "environmentFileSha256",
  "runtimeStampPath",
  "runtimeStampSha256",
  "buildManifestPath",
  "buildManifestSha256",
  "expectedProcessCommand",
  "stagedServicePlistPath",
  "stagedServicePlistSha256",
  "installedServicePlistPath",
  "installedServicePlistSha256",
];
const GUARD_KEYS = [
  "path",
  "sha256",
  "rolloutLockPath",
  "rolloutLockSha256",
  "runId",
  "planSha256",
  "startsAt",
  "expiresAt",
];
const QUIESCENCE_KEYS = ["activeTasks", "activeRuns", "competingLifecycleAutomation"];
const SLACK_KEYS = [
  "accountId",
  "credentialKind",
  "expectedUserId",
  "expectedBotId",
  "expectedTeamId",
  "channelId",
  "expectedApiUrl",
  "totalTimeoutMs",
];
const OPERATIONS_KEYS = [
  "restartLimit",
  "disableLimit",
  "enableLimit",
  "bootoutLimit",
  "bootstrapLimit",
  "startupWaitMs",
  "probeIntervalMs",
  "stabilityWindowMs",
  "automaticRollback",
  "automaticSecondRestart",
];
const EVIDENCE_KEYS = [
  "supervisorLeasePath",
  "supervisorLeaseSha256",
  "ledgerDirectory",
  "predecessorPlistBackupPath",
  "receiptPath",
  "rollbackPacketPath",
];
const RECEIPT_KEYS = [
  "schema",
  "planId",
  "planSha256",
  "startedAt",
  "completedAt",
  "outcome",
  "authority",
  "operations",
  "predecessor",
  "successor",
  "proofs",
  "ledger",
  "rollbackPacketSha256",
  "holdReason",
];
const LIFECYCLE_PHASE_TO_OPERATION = new Map([
  ["disable-requested", "disableCount"],
  ["enable-requested", "enableCount"],
  ["pre-bootout-reenable-requested", "enableCount"],
  ["bootout-requested", "bootoutCount"],
  ["bootstrap-requested", "bootstrapCount"],
]);
const SUCCESS_PHASE_SEQUENCE = [
  "claim",
  "predecessor-plist-preserved",
  "suspension-prepared",
  "disable-requested",
  "disabled-proven",
  "bootout-requested",
  "bootout-invocation-started",
  "predecessor-stopped-proven",
  "successor-plist-installed",
  "enable-requested",
  "enabled-proven",
  "bootstrap-requested",
  "bootstrap-returned",
  "successor-suspension-prepared",
  "postflight-initial-proven",
  "stability-window-proven",
  "successor-suspension-resume-requested",
  "successor-suspension-resumed",
];
const RECOVERY_PHASES = new Set([
  "pre-bootout-service-loaded-proven",
  "pre-bootout-reenable-requested",
  "pre-bootout-reenabled-same-predecessor-proven",
  "pre-bootout-service-unloaded-proven",
  "pre-bootout-label-enabled-unloaded-proven",
  "pre-bootout-suspension-resume-requested",
  "pre-bootout-suspension-resumed",
  "interrupted-attempt-recovered",
]);
const PRE_BOOTOUT_RECOVERY_SEQUENCES = [
  ["pre-bootout-reenable-requested"],
  ["pre-bootout-reenable-requested", "pre-bootout-reenabled-same-predecessor-proven"],
  ["pre-bootout-suspension-resume-requested"],
  ["pre-bootout-suspension-resume-requested", "pre-bootout-suspension-resumed"],
  ["pre-bootout-reenable-requested", "pre-bootout-suspension-resume-requested"],
  [
    "pre-bootout-reenable-requested",
    "pre-bootout-suspension-resume-requested",
    "pre-bootout-suspension-resumed",
  ],
  [
    "pre-bootout-reenable-requested",
    "pre-bootout-reenabled-same-predecessor-proven",
    "pre-bootout-suspension-resume-requested",
  ],
  [
    "pre-bootout-reenable-requested",
    "pre-bootout-reenabled-same-predecessor-proven",
    "pre-bootout-suspension-resume-requested",
    "pre-bootout-suspension-resumed",
  ],
  ["pre-bootout-service-loaded-proven"],
  ["pre-bootout-service-loaded-proven", "pre-bootout-reenabled-same-predecessor-proven"],
  [
    "pre-bootout-service-loaded-proven",
    "pre-bootout-reenabled-same-predecessor-proven",
    "pre-bootout-suspension-resume-requested",
  ],
  [
    "pre-bootout-service-loaded-proven",
    "pre-bootout-reenabled-same-predecessor-proven",
    "pre-bootout-suspension-resume-requested",
    "pre-bootout-suspension-resumed",
  ],
  ["pre-bootout-service-loaded-proven", "pre-bootout-reenable-requested"],
  [
    "pre-bootout-service-loaded-proven",
    "pre-bootout-reenable-requested",
    "pre-bootout-reenabled-same-predecessor-proven",
  ],
  [
    "pre-bootout-service-loaded-proven",
    "pre-bootout-reenable-requested",
    "pre-bootout-reenabled-same-predecessor-proven",
    "pre-bootout-suspension-resume-requested",
  ],
  [
    "pre-bootout-service-loaded-proven",
    "pre-bootout-reenable-requested",
    "pre-bootout-reenabled-same-predecessor-proven",
    "pre-bootout-suspension-resume-requested",
    "pre-bootout-suspension-resumed",
  ],
  ["pre-bootout-service-unloaded-proven"],
  ["pre-bootout-service-unloaded-proven", "pre-bootout-label-enabled-unloaded-proven"],
  ["pre-bootout-service-unloaded-proven", "pre-bootout-reenable-requested"],
  [
    "pre-bootout-service-unloaded-proven",
    "pre-bootout-reenable-requested",
    "pre-bootout-label-enabled-unloaded-proven",
  ],
];

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, expected, path) {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object`);
  }
  const actual = Object.keys(value).toSorted();
  const wanted = expected.toSorted();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new Error(`${path} keys must be exactly: ${expected.join(", ")}`);
  }
}

function requiredString(value, path) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string`);
  }
  return value;
}

function requiredAbsolutePath(value, path) {
  const candidate = requiredString(value, path);
  if (resolve(candidate) !== candidate) {
    throw new Error(`${path} must be an absolute normalized path`);
  }
  return candidate;
}

function isWithin(candidate, root) {
  return candidate === root || candidate.startsWith(`${root}/`);
}

function requiredPathWithin(value, root, path) {
  const candidate = requiredAbsolutePath(value, path);
  if (!isWithin(candidate, root)) {
    throw new Error(`${path} must remain within ${root}`);
  }
  return candidate;
}

function requiredInteger(value, path, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new Error(`${path} must be an integer >= ${minimum}`);
  }
  return value;
}

function requiredSha256(value, path) {
  if (typeof value !== "string" || !SHA256_RE.test(value)) {
    throw new Error(`${path} must be a lowercase SHA-256`);
  }
  return value;
}

function requiredGitObject(value, path) {
  if (typeof value !== "string" || !GIT_OBJECT_RE.test(value)) {
    throw new Error(`${path} must be a lowercase 40-character Git object id`);
  }
  return value;
}

function requiredInstant(value, path) {
  if (
    typeof value !== "string" ||
    !ISO_INSTANT_RE.test(value) ||
    !Number.isFinite(Date.parse(value))
  ) {
    throw new Error(`${path} must be an ISO-8601 UTC instant`);
  }
  return value;
}

function requiredLiteral(value, expected, path) {
  if (value !== expected) {
    throw new Error(`${path} must equal ${JSON.stringify(expected)}`);
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function canonicalJson(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalJson);
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonicalJson(entry)]),
    );
  }
  return value;
}

export function canonicalJsonBytes(value) {
  return Buffer.from(`${JSON.stringify(canonicalJson(value), null, 2)}\n`, "utf8");
}

export function validateHostActivationPlan(value, options = {}) {
  exactKeys(value, PLAN_KEYS, "plan");
  requiredLiteral(value.schema, HOST_ACTIVATION_PLAN_SCHEMA, "plan.schema");
  requiredString(value.planId, "plan.planId");
  const createdAt = requiredInstant(value.createdAt, "plan.createdAt");
  const expiresAt = requiredInstant(value.expiresAt, "plan.expiresAt");
  if (Date.parse(createdAt) >= Date.parse(expiresAt)) {
    throw new Error("plan.expiresAt must be after plan.createdAt");
  }
  const nowMs = options.nowMs ?? Date.now();
  if (options.allowExpired !== true && nowMs >= Date.parse(expiresAt)) {
    throw new Error("plan is expired");
  }

  exactKeys(value.authority, AUTHORITY_KEYS, "plan.authority");
  requiredLiteral(value.authority.kind, "none", "plan.authority.kind");
  if (!Array.isArray(value.authority.grants) || value.authority.grants.length !== 0) {
    throw new Error("plan.authority.grants must be empty");
  }
  requiredLiteral(value.authority.reusable, false, "plan.authority.reusable");

  exactKeys(value.host, HOST_KEYS, "plan.host");
  requiredLiteral(value.host.platform, "darwin", "plan.host.platform");
  const uid = requiredInteger(value.host.uid, "plan.host.uid", 1);
  const homePath = requiredAbsolutePath(value.host.homePath, "plan.host.homePath");
  const stateDir = requiredPathWithin(value.host.stateDir, homePath, "plan.host.stateDir");
  const stagingRoot = requiredAbsolutePath(value.host.stagingRoot, "plan.host.stagingRoot");
  const evidenceRoot = requiredPathWithin(
    value.host.evidenceRoot,
    homePath,
    "plan.host.evidenceRoot",
  );
  if (stagingRoot === "/" || evidenceRoot === "/" || stateDir === "/") {
    throw new Error("host roots must not be filesystem root");
  }
  requiredLiteral(value.host.launchdDomain, `gui/${uid}`, "plan.host.launchdDomain");
  requiredString(value.host.launchdLabel, "plan.host.launchdLabel");
  requiredInteger(value.host.gatewayPort, "plan.host.gatewayPort", 1);
  if (value.host.gatewayPort > 65535) {
    throw new Error("plan.host.gatewayPort must be <= 65535");
  }

  exactKeys(value.predecessor, PREDECESSOR_KEYS, "plan.predecessor");
  requiredGitObject(value.predecessor.commit, "plan.predecessor.commit");
  requiredGitObject(value.predecessor.tree, "plan.predecessor.tree");
  requiredInteger(value.predecessor.pid, "plan.predecessor.pid", 1);
  requiredInteger(value.predecessor.runCount, "plan.predecessor.runCount", 1);
  for (const key of [
    "cliPath",
    "runtimePath",
    "gatewayEntrypointPath",
    "wrapperPath",
    "environmentFilePath",
    "runtimeStampPath",
    "buildManifestPath",
  ]) {
    requiredAbsolutePath(value.predecessor[key], `plan.predecessor.${key}`);
  }
  requiredLiteral(
    value.predecessor.servicePlistPath,
    `${homePath}/Library/LaunchAgents/${value.host.launchdLabel}.plist`,
    "plan.predecessor.servicePlistPath",
  );
  requiredPathWithin(value.predecessor.configPath, stateDir, "plan.predecessor.configPath");
  for (const key of [
    "cliSha256",
    "runtimeSha256",
    "gatewayEntrypointSha256",
    "wrapperSha256",
    "environmentFileSha256",
    "runtimeStampSha256",
    "buildManifestSha256",
    "servicePlistSha256",
    "configSha256",
  ]) {
    requiredSha256(value.predecessor[key], `plan.predecessor.${key}`);
  }
  requiredString(
    value.predecessor.expectedProcessCommand,
    "plan.predecessor.expectedProcessCommand",
  );

  exactKeys(value.successor, SUCCESSOR_KEYS, "plan.successor");
  requiredGitObject(value.successor.commit, "plan.successor.commit");
  requiredGitObject(value.successor.tree, "plan.successor.tree");
  for (const key of [
    "cliPath",
    "runtimePath",
    "gatewayEntrypointPath",
    "wrapperPath",
    "environmentFilePath",
    "runtimeStampPath",
    "buildManifestPath",
    "stagedServicePlistPath",
  ]) {
    requiredPathWithin(value.successor[key], stagingRoot, `plan.successor.${key}`);
  }
  requiredLiteral(
    value.successor.installedServicePlistPath,
    value.predecessor.servicePlistPath,
    "plan.successor.installedServicePlistPath",
  );
  for (const key of [
    "cliSha256",
    "runtimeSha256",
    "gatewayEntrypointSha256",
    "wrapperSha256",
    "environmentFileSha256",
    "runtimeStampSha256",
    "buildManifestSha256",
    "stagedServicePlistSha256",
    "installedServicePlistSha256",
  ]) {
    requiredSha256(value.successor[key], `plan.successor.${key}`);
  }
  requiredString(value.successor.expectedProcessCommand, "plan.successor.expectedProcessCommand");
  if (value.predecessor.cliPath === value.successor.cliPath) {
    throw new Error("predecessor and successor CLI paths must differ");
  }
  if (value.successor.installedServicePlistPath !== value.predecessor.servicePlistPath) {
    throw new Error("successor installed plist path must replace the predecessor plist path");
  }
  if (value.successor.installedServicePlistSha256 !== value.successor.stagedServicePlistSha256) {
    throw new Error("successor installed and staged plist hashes must match");
  }

  exactKeys(value.guard, GUARD_KEYS, "plan.guard");
  requiredPathWithin(value.guard.path, stateDir, "plan.guard.path");
  requiredSha256(value.guard.sha256, "plan.guard.sha256");
  requiredPathWithin(value.guard.rolloutLockPath, stateDir, "plan.guard.rolloutLockPath");
  requiredSha256(value.guard.rolloutLockSha256, "plan.guard.rolloutLockSha256");
  requiredString(value.guard.runId, "plan.guard.runId");
  requiredSha256(value.guard.planSha256, "plan.guard.planSha256");
  const guardStartsAt = requiredInstant(value.guard.startsAt, "plan.guard.startsAt");
  const guardExpiresAt = requiredInstant(value.guard.expiresAt, "plan.guard.expiresAt");
  if (
    Date.parse(guardStartsAt) > (options.allowExpired === true ? Date.parse(createdAt) : nowMs) ||
    (options.allowExpired !== true && Date.parse(guardExpiresAt) <= nowMs) ||
    Date.parse(guardExpiresAt) < Date.parse(expiresAt)
  ) {
    throw new Error("plan.guard must be active for the full activation-plan lifetime");
  }

  exactKeys(value.quiescence, QUIESCENCE_KEYS, "plan.quiescence");
  requiredLiteral(value.quiescence.activeTasks, 0, "plan.quiescence.activeTasks");
  requiredLiteral(value.quiescence.activeRuns, 0, "plan.quiescence.activeRuns");
  requiredLiteral(
    value.quiescence.competingLifecycleAutomation,
    false,
    "plan.quiescence.competingLifecycleAutomation",
  );

  exactKeys(value.slack, SLACK_KEYS, "plan.slack");
  requiredLiteral(value.slack.accountId, "oscar", "plan.slack.accountId");
  requiredLiteral(value.slack.credentialKind, "bot", "plan.slack.credentialKind");
  for (const key of ["expectedUserId", "expectedBotId", "expectedTeamId", "channelId"]) {
    requiredString(value.slack[key], `plan.slack.${key}`);
  }
  requiredLiteral(
    value.slack.expectedApiUrl,
    "https://slack.com/api/",
    "plan.slack.expectedApiUrl",
  );
  const timeout = requiredInteger(value.slack.totalTimeoutMs, "plan.slack.totalTimeoutMs", 1);
  if (timeout > 30_000) {
    throw new Error("plan.slack.totalTimeoutMs must be <= 30000");
  }

  exactKeys(value.operations, OPERATIONS_KEYS, "plan.operations");
  requiredLiteral(value.operations.restartLimit, 1, "plan.operations.restartLimit");
  requiredLiteral(value.operations.disableLimit, 1, "plan.operations.disableLimit");
  requiredLiteral(value.operations.enableLimit, 1, "plan.operations.enableLimit");
  requiredLiteral(value.operations.bootoutLimit, 1, "plan.operations.bootoutLimit");
  requiredLiteral(value.operations.bootstrapLimit, 1, "plan.operations.bootstrapLimit");
  requiredLiteral(value.operations.startupWaitMs, 30_000, "plan.operations.startupWaitMs");
  requiredLiteral(value.operations.probeIntervalMs, 1_000, "plan.operations.probeIntervalMs");
  requiredLiteral(value.operations.stabilityWindowMs, 60_000, "plan.operations.stabilityWindowMs");
  requiredLiteral(value.operations.automaticRollback, false, "plan.operations.automaticRollback");
  requiredLiteral(
    value.operations.automaticSecondRestart,
    false,
    "plan.operations.automaticSecondRestart",
  );

  exactKeys(value.evidence, EVIDENCE_KEYS, "plan.evidence");
  const supervisorLeasePath = requiredPathWithin(
    value.evidence.supervisorLeasePath,
    evidenceRoot,
    "plan.evidence.supervisorLeasePath",
  );
  requiredSha256(value.evidence.supervisorLeaseSha256, "plan.evidence.supervisorLeaseSha256");
  const ledgerDirectory = requiredPathWithin(
    value.evidence.ledgerDirectory,
    evidenceRoot,
    "plan.evidence.ledgerDirectory",
  );
  const backupPath = requiredPathWithin(
    value.evidence.predecessorPlistBackupPath,
    evidenceRoot,
    "plan.evidence.predecessorPlistBackupPath",
  );
  const receiptPath = requiredPathWithin(
    value.evidence.receiptPath,
    evidenceRoot,
    "plan.evidence.receiptPath",
  );
  const rollbackPath = requiredPathWithin(
    value.evidence.rollbackPacketPath,
    evidenceRoot,
    "plan.evidence.rollbackPacketPath",
  );
  const uniqueEvidencePaths = new Set([
    supervisorLeasePath,
    ledgerDirectory,
    backupPath,
    receiptPath,
    rollbackPath,
  ]);
  if (uniqueEvidencePaths.size !== 5) {
    throw new Error("evidence paths must all differ");
  }
  return value;
}

function serviceLifecycleClaimPath(plan, hostIdentity) {
  const serviceKey = sha256(
    Buffer.from(`${plan.host.uid}\0${plan.host.launchdDomain}\0${plan.host.launchdLabel}`, "utf8"),
  ).slice(0, 32);
  return `${hostIdentity.homePath}/.openclaw/handoff-v2-lifecycle-${serviceKey}.claim.json`;
}

function recoveryOwnershipPath(globalClaimPath) {
  return `${globalClaimPath}.recovery.lock`;
}

function assertActivationWindow(plan, runtime, description, minimumRemainingMs = 0) {
  const nowMs = Date.parse(runtime.now());
  if (
    !Number.isFinite(nowMs) ||
    nowMs + minimumRemainingMs >= Date.parse(plan.expiresAt) ||
    nowMs + minimumRemainingMs >= Date.parse(plan.guard.expiresAt)
  ) {
    throw new Error(`${description} occurred outside the active plan and guard window`);
  }
}

export function parseLaunchdServiceState(output, expectedLabel) {
  const pidMatches = [...output.matchAll(/^\s*pid\s*=\s*(\d+)\s*$/gmu)];
  const runMatches = [...output.matchAll(/^\s*runs\s*=\s*(\d+)\s*$/gmu)];
  const labelMatches = [...output.matchAll(/^\s*label\s*=\s*(\S+)\s*$/gmu)];
  if (pidMatches.length !== 1 || runMatches.length !== 1 || labelMatches.length !== 1) {
    throw new Error("launchctl print output must contain exactly one label, pid, and runs field");
  }
  if (labelMatches[0][1] !== expectedLabel) {
    throw new Error("launchctl service label mismatch");
  }
  return {
    pid: requiredInteger(Number(pidMatches[0][1]), "launchctl pid", 1),
    runCount: requiredInteger(Number(runMatches[0][1]), "launchctl runs", 1),
  };
}

export function parseLaunchdEnabledState(output, expectedLabel) {
  const escaped = expectedLabel.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const matches = [
    ...output.matchAll(new RegExp(`^\\s*"${escaped}"\\s*=>\\s*(enabled|disabled)\\s*$`, "gmu")),
  ];
  if (matches.length !== 1) {
    throw new Error(
      "launchctl print-disabled output must contain one enabled/disabled label entry",
    );
  }
  return matches[0][1] === "enabled";
}

function assertSecureFileStat(stat, description) {
  if (
    !stat.isFile() ||
    stat.nlink !== 1 ||
    (stat.mode & 0o022) !== 0 ||
    (typeof process.getuid === "function" && stat.uid !== process.getuid()) ||
    stat.size < 1 ||
    stat.size > 16 * 1024 * 1024
  ) {
    throw new Error(`${description} must be one owner-controlled regular file`);
  }
}

function readSecureFile(path, description) {
  let descriptor;
  try {
    descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(descriptor);
    assertSecureFileStat(before, description);
    const bytes = readFileSync(descriptor);
    const after = fstatSync(descriptor);
    if (
      before.dev !== after.dev ||
      before.ino !== after.ino ||
      before.size !== after.size ||
      before.mtimeMs !== after.mtimeMs ||
      before.ctimeMs !== after.ctimeMs
    ) {
      throw new Error(`${description} changed while it was read`);
    }
    return bytes;
  } finally {
    if (descriptor !== undefined) {
      closeSync(descriptor);
    }
  }
}

function verifyFile(path, expectedSha256, description) {
  const bytes = readSecureFile(path, description);
  const actual = sha256(bytes);
  if (actual !== expectedSha256) {
    throw new Error(`${description} SHA-256 mismatch`);
  }
  return bytes;
}

function assertSecureDirectory(path, description) {
  const stat = lstatSync(path);
  if (
    !stat.isDirectory() ||
    stat.isSymbolicLink() ||
    (stat.mode & 0o077) !== 0 ||
    (typeof process.getuid === "function" && stat.uid !== process.getuid())
  ) {
    throw new Error(`${description} must be an owner-only non-symlink directory`);
  }
}

function assertSecureDirectoryChain(path, allowedRoot, description) {
  if (!isWithin(path, allowedRoot)) {
    throw new Error(`${description} must remain within its allowed root`);
  }
  const rootStat = lstatSync(allowedRoot);
  if (
    !rootStat.isDirectory() ||
    rootStat.isSymbolicLink() ||
    (rootStat.mode & 0o022) !== 0 ||
    (typeof process.getuid === "function" && rootStat.uid !== process.getuid())
  ) {
    throw new Error(`${description} has an unsafe allowed root at ${allowedRoot}`);
  }
  const relative = path.slice(allowedRoot.length).split("/").filter(Boolean);
  let cursor = allowedRoot;
  for (const segment of relative) {
    cursor = `${cursor}/${segment}`;
    const stat = lstatSync(cursor);
    if (
      !stat.isDirectory() ||
      stat.isSymbolicLink() ||
      (stat.mode & 0o022) !== 0 ||
      (typeof process.getuid === "function" && stat.uid !== process.getuid())
    ) {
      throw new Error(`${description} contains an unsafe directory at ${cursor}`);
    }
  }
}

function assertOutputAvailable(path, description) {
  assertSecureDirectory(dirname(path), `${description} parent`);
  try {
    lstatSync(path);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return;
    }
    throw error;
  }
  throw new Error(`${description} already exists`);
}

function parseJsonOutput(result, description) {
  if (result.status !== 0 || result.signal || result.error) {
    throw new Error(`${description} failed`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`${description} returned malformed JSON`);
  }
}

function assertDeterministicCommandResult(result, description) {
  if (result.signal !== undefined && result.signal !== null && result.signal !== "") {
    throw new Error(`${description} was interrupted by ${result.signal}`);
  }
  if (result.error) {
    throw new Error(`${description} failed to execute: ${result.error}`);
  }
  if (!Number.isInteger(result.status)) {
    throw new Error(`${description} returned no deterministic exit status`);
  }
}

function inspectPlist(bytes, description, runtime) {
  return parseJsonOutput(
    runtime.run("/usr/bin/plutil", ["-convert", "json", "-o", "-", "-"], { input: bytes }),
    `plist inspection for ${description}`,
  );
}

function withoutMutablePlistIdentity(value) {
  if (!isRecord(value)) {
    throw new Error("LaunchAgent plist must decode to an object");
  }
  const { ProgramArguments: _programArguments, Comment: _comment, ...preserved } = value;
  return preserved;
}

function verifyPlistTransition(plan, runtime, predecessorPlistBytes, successorPlistBytes) {
  const predecessor = inspectPlist(predecessorPlistBytes, "predecessor", runtime);
  const successor = inspectPlist(successorPlistBytes, "successor", runtime);
  if (predecessor.Label !== plan.host.launchdLabel || successor.Label !== plan.host.launchdLabel) {
    throw new Error("LaunchAgent Label does not match the activation plan");
  }
  if (
    !Array.isArray(predecessor.ProgramArguments) ||
    !Array.isArray(successor.ProgramArguments) ||
    predecessor.ProgramArguments.length < 5 ||
    successor.ProgramArguments.length < 5 ||
    predecessor.ProgramArguments.some((entry) => typeof entry !== "string") ||
    successor.ProgramArguments.some((entry) => typeof entry !== "string")
  ) {
    throw new Error("LaunchAgent ProgramArguments must contain the wrapper and runtime identities");
  }
  const predecessorExpectedPrefix = [
    "/bin/sh",
    plan.predecessor.wrapperPath,
    plan.predecessor.environmentFilePath,
    plan.predecessor.runtimePath,
    plan.predecessor.cliPath,
  ];
  const successorExpectedPrefix = [
    "/bin/sh",
    plan.successor.wrapperPath,
    plan.successor.environmentFilePath,
    plan.successor.runtimePath,
    plan.successor.cliPath,
  ];
  if (
    JSON.stringify(predecessor.ProgramArguments.slice(0, 5)) !==
      JSON.stringify(predecessorExpectedPrefix) ||
    JSON.stringify(successor.ProgramArguments.slice(0, 5)) !==
      JSON.stringify(successorExpectedPrefix)
  ) {
    throw new Error(
      "LaunchAgent wrapper, environment file, runtime, or CLI identity does not match the plan",
    );
  }
  if (
    JSON.stringify(predecessor.ProgramArguments.slice(5)) !==
      JSON.stringify(successor.ProgramArguments.slice(5)) ||
    JSON.stringify(canonicalJson(withoutMutablePlistIdentity(predecessor))) !==
      JSON.stringify(canonicalJson(withoutMutablePlistIdentity(successor)))
  ) {
    throw new Error("LaunchAgent non-identity arguments or environment bindings changed");
  }
  const predecessorEnvironment = verifyEnvironmentFileBindings(plan, "predecessor", runtime);
  const successorEnvironment = verifyEnvironmentFileBindings(plan, "successor", runtime);
  if (
    JSON.stringify(canonicalJson(predecessorEnvironment)) !==
    JSON.stringify(canonicalJson(successorEnvironment))
  ) {
    throw new Error("successor environment exports differ from the predecessor environment");
  }
}

function parseGeneratedEnvironmentFile(bytes, description) {
  const lines = bytes.toString("utf8").split("\n");
  if (
    lines.shift() !== "# Generated by OpenClaw. Do not edit while the gateway service is installed."
  ) {
    throw new Error(`${description} is not an OpenClaw generated environment file`);
  }
  const values = {};
  for (const line of lines) {
    if (line === "") {
      continue;
    }
    const match = /^export ([A-Z_][A-Z0-9_]*)=(.+)$/u.exec(line);
    const encodedValue = match?.[2];
    if (
      !match ||
      !encodedValue?.startsWith("'") ||
      !encodedValue.endsWith("'") ||
      encodedValue.slice(1, -1).replaceAll("'\\''", "").includes("'")
    ) {
      throw new Error(`${description} contains an unsupported environment entry`);
    }
    const name = match[1];
    if (Object.hasOwn(values, name)) {
      throw new Error(`${description} contains duplicate environment entries`);
    }
    values[name] = encodedValue.slice(1, -1).replaceAll("'\\''", "'");
  }
  return values;
}

function verifyEnvironmentFileBindings(plan, generation, runtime) {
  const identity = plan[generation];
  const values = parseGeneratedEnvironmentFile(
    runtime.verifyFile(
      identity.environmentFilePath,
      identity.environmentFileSha256,
      `${generation} environment file bindings`,
    ),
    `${generation} environment file`,
  );
  for (const [name, expected] of Object.entries({
    HOME: plan.host.homePath,
    OPENCLAW_CONFIG_PATH: plan.predecessor.configPath,
    OPENCLAW_GATEWAY_PORT: String(plan.host.gatewayPort),
    OPENCLAW_STATE_DIR: plan.host.stateDir,
  })) {
    if (values[name] !== expected) {
      throw new Error(`${generation} environment file ${name} does not match the plan`);
    }
  }
  return values;
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    env: options.env ?? process.env,
    timeout: options.timeoutMs ?? 30_000,
    maxBuffer: 1024 * 1024,
    input: options.input,
  });
  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error?.message,
  };
}

function invokeCli(plan, generation, args, runtime) {
  const identity = plan[generation];
  return runtime.run(identity.runtimePath, [identity.cliPath, ...args], {
    timeoutMs: Math.max(30_000, plan.slack.totalTimeoutMs + 5_000),
    env: {
      HOME: plan.host.homePath,
      LANG: "C",
      LC_ALL: "C",
      PATH: "/usr/bin:/bin:/usr/sbin:/sbin",
      OPENCLAW_CONFIG_PATH: plan.predecessor.configPath,
      OPENCLAW_ENV_FILE: identity.environmentFilePath,
      OPENCLAW_HOME: plan.host.stateDir,
      OPENCLAW_NO_RESPAWN: "1",
      OPENCLAW_STATE_DIR: plan.host.stateDir,
    },
  });
}

function gatewaySuspendHandoffPath(plan) {
  return `${plan.host.stateDir}/gateway-suspend-handoff.json`;
}

function gatewaySuspendHandoffBytes(suspension) {
  return canonicalJsonBytes({
    schema: "openclaw-gateway-suspend-handoff/v2",
    requestId: suspension.requestId,
    suspensionId: suspension.suspensionId,
    gatewayInstanceId: suspension.gatewayInstanceId,
    gatewayPid: suspension.gatewayPid,
    launchdRunCount: suspension.launchdRunCount,
    expiresAtMs: suspension.expiresAtMs,
    resumeState: "held",
    resumeBeforeMs: null,
  });
}

function validateGatewaySuspendHandoff(bytes, suspension) {
  let handoff;
  try {
    handoff = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error("Gateway suspension handoff contains malformed JSON");
  }
  exactKeys(
    handoff,
    [
      "schema",
      "requestId",
      "suspensionId",
      "gatewayInstanceId",
      "gatewayPid",
      "launchdRunCount",
      "expiresAtMs",
      "resumeState",
      "resumeBeforeMs",
    ],
    "Gateway suspension handoff",
  );
  if (
    handoff.schema !== "openclaw-gateway-suspend-handoff/v2" ||
    handoff.requestId !== suspension.requestId ||
    handoff.suspensionId !== suspension.suspensionId ||
    handoff.gatewayInstanceId !== suspension.gatewayInstanceId ||
    handoff.gatewayPid !== suspension.gatewayPid ||
    handoff.launchdRunCount !== suspension.launchdRunCount ||
    handoff.expiresAtMs !== suspension.expiresAtMs ||
    handoff.resumeState !== "held" ||
    handoff.resumeBeforeMs !== null
  ) {
    throw new Error("Gateway suspension handoff does not bind the active suspension");
  }
  return handoff;
}

function persistGatewaySuspendHandoff(
  plan,
  suspension,
  runtime,
  allowGatewayInstanceTransition = false,
) {
  const path = gatewaySuspendHandoffPath(plan);
  runtime.assertSecureDirectoryChain(
    dirname(path),
    plan.host.stateDir,
    "Gateway suspension handoff parent chain",
  );
  const bytes = gatewaySuspendHandoffBytes(suspension);
  const existing = runtime.readOptionalFile(path, "Gateway suspension handoff");
  if (existing === null) {
    try {
      runtime.writeExclusive(path, bytes);
      return;
    } catch (error) {
      const exposed = readOptionalFileForPersistence(
        runtime,
        path,
        "Gateway suspension handoff",
        PhasePersistenceError,
      );
      if (exposed === null || !exposed.equals(bytes)) {
        throw new PhasePersistenceError("Gateway suspension handoff", error);
      }
      proveExactFileDurable(
        runtime,
        path,
        bytes,
        "Gateway suspension handoff",
        PhasePersistenceError,
      );
      return;
    }
  }
  let existingHandoff;
  try {
    existingHandoff = JSON.parse(existing.toString("utf8"));
    exactKeys(
      existingHandoff,
      [
        "schema",
        "requestId",
        "suspensionId",
        "gatewayInstanceId",
        "gatewayPid",
        "launchdRunCount",
        "expiresAtMs",
        "resumeState",
        "resumeBeforeMs",
      ],
      "existing Gateway suspension handoff",
    );
  } catch {
    throw new Error("existing Gateway suspension handoff contains malformed JSON");
  }
  if (
    existingHandoff?.schema !== "openclaw-gateway-suspend-handoff/v2" ||
    existingHandoff?.resumeState !== "held" ||
    existingHandoff?.resumeBeforeMs !== null ||
    existingHandoff?.requestId !== suspension.requestId ||
    existingHandoff?.suspensionId !== suspension.suspensionId ||
    (!allowGatewayInstanceTransition &&
      (existingHandoff?.gatewayInstanceId !== suspension.gatewayInstanceId ||
        existingHandoff?.gatewayPid !== suspension.gatewayPid ||
        existingHandoff?.launchdRunCount !== suspension.launchdRunCount))
  ) {
    throw new Error("another suspension owns the Gateway suspension handoff");
  }
  try {
    runtime.replaceFileDurably(bytes, path);
  } catch (error) {
    const exposed = readOptionalFileForPersistence(
      runtime,
      path,
      "Gateway suspension handoff",
      PhasePersistenceError,
    );
    if (exposed === null || !exposed.equals(bytes)) {
      throw new PhasePersistenceError("Gateway suspension handoff", error);
    }
    proveExactFileDurable(
      runtime,
      path,
      bytes,
      "Gateway suspension handoff",
      PhasePersistenceError,
    );
    return;
  }
  validateGatewaySuspendHandoff(
    runtime.readOptionalFile(path, "Gateway suspension handoff") ??
      (() => {
        throw new Error("Gateway suspension handoff disappeared after persistence");
      })(),
    suspension,
  );
}

function assertGatewaySuspendHandoffWindow(plan, suspension, runtime, description) {
  const nowMs = Date.parse(runtime.now());
  if (!Number.isFinite(nowMs) || suspension.expiresAtMs - nowMs <= plan.operations.startupWaitMs) {
    throw new Error(`${description} lacks a complete durable suspension handoff window`);
  }
  const bytes = runtime.readOptionalFile(
    gatewaySuspendHandoffPath(plan),
    "Gateway suspension handoff",
  );
  if (bytes === null) {
    throw new Error(`${description} lacks its durable suspension handoff`);
  }
  validateGatewaySuspendHandoff(bytes, suspension);
  const path = gatewaySuspendHandoffPath(plan);
  runtime.ensureFileDurable(path);
  const durable = runtime.readOptionalFile(path, "Gateway suspension handoff");
  if (durable === null) {
    throw new PhasePersistenceError(
      "Gateway suspension handoff",
      new Error("handoff disappeared during durability verification"),
    );
  }
  validateGatewaySuspendHandoff(durable, suspension);
  const durableNowMs = Date.parse(runtime.now());
  if (
    !Number.isFinite(durableNowMs) ||
    suspension.expiresAtMs - durableNowMs <= plan.operations.startupWaitMs
  ) {
    throw new Error(`${description} lacks a complete durable suspension handoff window`);
  }
}

function verifyTasksQuiescent(plan, generation, runtime) {
  const value = parseJsonOutput(
    invokeCli(plan, generation, ["tasks", "--json"], runtime),
    "task quiescence probe",
  );
  if (!isRecord(value) || !Array.isArray(value.tasks)) {
    throw new Error("task quiescence probe returned an invalid shape");
  }
  const active = value.tasks.filter(
    (task) => isRecord(task) && (task.status === "queued" || task.status === "running"),
  );
  const activeRunIds = new Set(
    active.map((task) => (typeof task.runId === "string" ? task.runId : undefined)).filter(Boolean),
  );
  if (active.length !== 0 || activeRunIds.size !== 0) {
    throw new Error("active background tasks are present");
  }
  return { activeTasks: active.length, activeRuns: activeRunIds.size };
}

function prepareGatewaySuspension(
  plan,
  runtime,
  expectedService,
  expectedSuspensionId,
  generation = "predecessor",
) {
  const requestId = `handoff-v2:${plan.planId}`;
  const result = parseJsonOutput(
    invokeCli(
      plan,
      generation,
      [
        "gateway",
        "call",
        "gateway.suspend.prepare",
        "--params",
        JSON.stringify({
          requestId,
          ...(expectedSuspensionId === undefined ? {} : { suspensionId: expectedSuspensionId }),
          gatewayPid: expectedService.pid,
          launchdRunCount: expectedService.runCount,
        }),
        "--json",
      ],
      runtime,
    ),
    "Gateway suspension preparation",
  );
  if (
    result?.status !== "ready" ||
    typeof result.suspensionId !== "string" ||
    result.suspensionId.length === 0 ||
    typeof result.gatewayInstanceId !== "string" ||
    result.gatewayInstanceId.length === 0 ||
    result.gatewayPid !== expectedService.pid ||
    result.launchdRunCount !== expectedService.runCount ||
    !Number.isSafeInteger(result.expiresAtMs) ||
    result.expiresAtMs <= Date.parse(runtime.now()) ||
    result.activeCount !== 0 ||
    !Array.isArray(result.blockers) ||
    result.blockers.length !== 0 ||
    (expectedSuspensionId !== undefined && result.suspensionId !== expectedSuspensionId)
  ) {
    throw new Error("Gateway suspension did not establish an idle admission fence");
  }
  const serviceAfterPrepare = inspectService(plan, runtime);
  if (
    serviceAfterPrepare.pid !== expectedService.pid ||
    serviceAfterPrepare.runCount !== expectedService.runCount
  ) {
    throw new Error("Gateway process incarnation changed during suspension preparation");
  }
  verifyProcessIdentity(plan, generation, serviceAfterPrepare.pid, runtime);
  verifyPortOwned(plan, serviceAfterPrepare.pid, runtime);
  const suspension = {
    requestId,
    suspensionId: result.suspensionId,
    gatewayInstanceId: result.gatewayInstanceId,
    gatewayPid: result.gatewayPid,
    launchdRunCount: result.launchdRunCount,
    expiresAtMs: result.expiresAtMs,
  };
  persistGatewaySuspendHandoff(
    plan,
    suspension,
    runtime,
    generation === "successor" && expectedSuspensionId !== undefined,
  );
  assertGatewaySuspendHandoffWindow(plan, suspension, runtime, "Gateway suspension preparation");
  return suspension;
}

function renewGatewaySuspension(plan, suspension, runtime, generation = "predecessor") {
  const result = parseJsonOutput(
    invokeCli(
      plan,
      generation,
      [
        "gateway",
        "call",
        "gateway.suspend.prepare",
        "--params",
        JSON.stringify({
          requestId: suspension.requestId,
          suspensionId: suspension.suspensionId,
          gatewayInstanceId: suspension.gatewayInstanceId,
          gatewayPid: suspension.gatewayPid,
          launchdRunCount: suspension.launchdRunCount,
        }),
        "--json",
      ],
      runtime,
    ),
    "Gateway suspension renewal",
  );
  const nowMs = Date.parse(runtime.now());
  if (
    result?.status !== "ready" ||
    result.suspensionId !== suspension.suspensionId ||
    result.gatewayInstanceId !== suspension.gatewayInstanceId ||
    result.gatewayPid !== suspension.gatewayPid ||
    result.launchdRunCount !== suspension.launchdRunCount ||
    !Number.isSafeInteger(result.expiresAtMs) ||
    result.expiresAtMs - nowMs <= plan.operations.startupWaitMs ||
    result.activeCount !== 0 ||
    !Array.isArray(result.blockers) ||
    result.blockers.length !== 0
  ) {
    throw new Error("Gateway suspension admission fence could not be renewed for the mutation");
  }
  suspension.expiresAtMs = result.expiresAtMs;
  persistGatewaySuspendHandoff(plan, suspension, runtime);
  assertGatewaySuspendHandoffWindow(plan, suspension, runtime, "Gateway suspension renewal");
}

function resumeGatewaySuspension(plan, suspension, runtime, generation = "predecessor") {
  const nowMs = Date.parse(runtime.now());
  const resumeBeforeMs =
    Math.min(Date.parse(plan.expiresAt), Date.parse(plan.guard.expiresAt), suspension.expiresAtMs) -
    plan.operations.startupWaitMs;
  if (
    !Number.isSafeInteger(nowMs) ||
    !Number.isSafeInteger(resumeBeforeMs) ||
    resumeBeforeMs <= nowMs
  ) {
    throw new Error("Gateway suspension resume lacks a complete authority window");
  }
  const result = parseJsonOutput(
    invokeCli(
      plan,
      generation,
      [
        "gateway",
        "call",
        "gateway.suspend.resume",
        "--params",
        JSON.stringify({
          suspensionId: suspension.suspensionId,
          gatewayInstanceId: suspension.gatewayInstanceId,
          resumeBeforeMs,
        }),
        "--json",
      ],
      runtime,
    ),
    "Gateway suspension resume",
  );
  if (
    result?.ok !== true ||
    result.status !== "running" ||
    result.resumed !== true ||
    result.gatewayInstanceId !== suspension.gatewayInstanceId
  ) {
    throw new Error("Gateway suspension admission fence did not resume cleanly");
  }
  const handoffPath = gatewaySuspendHandoffPath(plan);
  runtime.removeFileDurably(handoffPath);
  if (runtime.readOptionalFile(handoffPath, "Gateway suspension handoff") !== null) {
    throw new Error("Gateway suspension handoff remained after resume");
  }
}

function getGatewaySuspensionStatus(plan, suspension, runtime) {
  return parseJsonOutput(
    invokeCli(
      plan,
      "predecessor",
      [
        "gateway",
        "call",
        "gateway.suspend.status",
        "--params",
        JSON.stringify({
          suspensionId: suspension.suspensionId,
          gatewayInstanceId: suspension.gatewayInstanceId,
        }),
        "--json",
      ],
      runtime,
    ),
    "Gateway suspension recovery status",
  );
}

function readGatewaySuspendHandoffForRecovery(plan, runtime, expectedSuspension) {
  const handoffPath = gatewaySuspendHandoffPath(plan);
  const handoffBytes = runtime.readOptionalFile(handoffPath, "Gateway suspension handoff recovery");
  if (handoffBytes === null) {
    return null;
  }
  let handoff;
  try {
    handoff = JSON.parse(handoffBytes.toString("utf8"));
    exactKeys(
      handoff,
      [
        "schema",
        "requestId",
        "suspensionId",
        "gatewayInstanceId",
        "gatewayPid",
        "launchdRunCount",
        "expiresAtMs",
        "resumeState",
        "resumeBeforeMs",
      ],
      "Gateway suspension handoff recovery",
    );
  } catch (error) {
    throw new PhasePersistenceError("Gateway suspension handoff recovery", error);
  }
  if (
    handoff.schema !== "openclaw-gateway-suspend-handoff/v2" ||
    handoff.requestId !== `handoff-v2:${plan.planId}` ||
    typeof handoff.suspensionId !== "string" ||
    handoff.suspensionId.length === 0 ||
    typeof handoff.gatewayInstanceId !== "string" ||
    handoff.gatewayInstanceId.length === 0 ||
    !Number.isSafeInteger(handoff.gatewayPid) ||
    handoff.gatewayPid < 1 ||
    !Number.isSafeInteger(handoff.launchdRunCount) ||
    handoff.launchdRunCount < 1 ||
    !Number.isSafeInteger(handoff.expiresAtMs) ||
    handoff.resumeState !== "held" ||
    handoff.resumeBeforeMs !== null
  ) {
    throw new PhasePersistenceError(
      "Gateway suspension handoff recovery",
      new Error("handoff does not bind the interrupted activation"),
    );
  }
  if (
    expectedSuspension !== undefined &&
    (handoff.requestId !== expectedSuspension.requestId ||
      handoff.suspensionId !== expectedSuspension.suspensionId ||
      handoff.gatewayInstanceId !== expectedSuspension.gatewayInstanceId ||
      handoff.gatewayPid !== expectedSuspension.gatewayPid ||
      handoff.launchdRunCount !== expectedSuspension.launchdRunCount ||
      handoff.expiresAtMs < expectedSuspension.expiresAtMs)
  ) {
    throw new PhasePersistenceError(
      "Gateway suspension handoff recovery",
      new Error("handoff does not preserve the durable suspension-prepared identity"),
    );
  }
  proveExactFileDurable(
    runtime,
    handoffPath,
    handoffBytes,
    "Gateway suspension handoff recovery",
    PhasePersistenceError,
  );
  return { ...handoff, bytes: handoffBytes };
}

function recoverPreBootoutGatewaySuspension(
  plan,
  runtime,
  recoveredHandoff,
  expectedSuspension,
  beforeResume,
) {
  const handoffPath = gatewaySuspendHandoffPath(plan);
  const handoff =
    recoveredHandoff ?? readGatewaySuspendHandoffForRecovery(plan, runtime, expectedSuspension);
  if (handoff !== null) {
    const status = getGatewaySuspensionStatus(plan, handoff, runtime);
    if (status?.gatewayInstanceId !== handoff.gatewayInstanceId) {
      throw new Error("Gateway suspension recovery status changed process incarnation");
    }
    if (status?.status === "ready") {
      if (!Number.isSafeInteger(status.expiresAtMs) || status.expiresAtMs !== handoff.expiresAtMs) {
        throw new Error("Gateway suspension recovery status does not match its handoff");
      }
      beforeResume(handoff);
      resumeGatewaySuspension(plan, handoff, runtime);
      return;
    }
    if (status?.status !== "running") {
      throw new Error("Gateway suspension recovery status is not safe");
    }
    runtime.removeFileDurably(handoffPath);
    if (runtime.readOptionalFile(handoffPath, "Gateway suspension handoff recovery") !== null) {
      throw new PhasePersistenceError(
        "Gateway suspension handoff recovery",
        new Error("stale handoff remained after durable removal"),
      );
    }
  }
  if (expectedSuspension !== undefined) {
    throw new Error("durable suspension-prepared recovery lacks its exact handoff");
  }
  const reacquired = prepareGatewaySuspension(plan, runtime, plan.predecessor);
  beforeResume(reacquired);
  resumeGatewaySuspension(plan, reacquired, runtime);
}

function verifySlack(plan, generation, runtime) {
  const params = {
    contractVersion: SLACK_ACCESS_PROOF_SCHEMA,
    accountId: plan.slack.accountId,
    credentialKind: plan.slack.credentialKind,
    expectedUserId: plan.slack.expectedUserId,
    expectedBotId: plan.slack.expectedBotId,
    expectedTeamId: plan.slack.expectedTeamId,
    channelId: plan.slack.channelId,
    expectedApiUrl: plan.slack.expectedApiUrl,
    totalTimeoutMs: plan.slack.totalTimeoutMs,
  };
  const result = parseJsonOutput(
    invokeCli(
      plan,
      generation,
      [
        "gateway",
        "call",
        "slack.access.verify",
        "--operator-read-only",
        "--params",
        JSON.stringify(params),
        "--json",
      ],
      runtime,
    ),
    "Slack access probe",
  );
  if (
    !isRecord(result) ||
    result.contractVersion !== SLACK_ACCESS_PROOF_SCHEMA ||
    result.ok !== true ||
    result.requested?.accountId !== plan.slack.accountId ||
    result.requested?.channelId !== plan.slack.channelId ||
    result.auth?.userId !== plan.slack.expectedUserId ||
    result.auth?.botId !== plan.slack.expectedBotId ||
    result.auth?.teamId !== plan.slack.expectedTeamId ||
    result.access?.performedWrites !== false ||
    result.access?.channelInfoVerified !== true ||
    result.access?.historyVerified !== true ||
    result.access?.sameCredentialForIdentityAndAccess !== true
  ) {
    throw new Error("Slack access proof did not bind the expected account, identity, and channel");
  }
  return result;
}

function verifyGatewayHealth(plan, generation, runtime) {
  const result = parseJsonOutput(
    invokeCli(plan, generation, ["gateway", "call", "health", "--json"], runtime),
    "Gateway health probe",
  );
  if (!isRecord(result) || result.ok !== true) {
    throw new Error("Gateway health probe did not report ok");
  }
  return result;
}

function verifyChannelsStatus(plan, generation, runtime) {
  const result = parseJsonOutput(
    invokeCli(plan, generation, ["gateway", "call", "channels.status", "--json"], runtime),
    "channels.status probe",
  );
  const accounts = Array.isArray(result?.channelAccounts?.slack)
    ? result.channelAccounts.slack
    : undefined;
  const oscar = accounts?.find((account) => isRecord(account) && account.accountId === "oscar");
  if (
    !isRecord(oscar) ||
    oscar.connected !== true ||
    oscar.running !== true ||
    oscar.restartPending === true ||
    (oscar.lastError !== undefined && oscar.lastError !== null && oscar.lastError !== "")
  ) {
    throw new Error("channels.status did not prove the oscar Slack account healthy");
  }
  return result;
}

function inspectService(plan, runtime) {
  const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
  const printed = runtime.run("/bin/launchctl", ["print", target]);
  assertDeterministicCommandResult(printed, "launchctl service inspection");
  if (printed.status !== 0) {
    throw new Error("launchctl service inspection failed");
  }
  return parseLaunchdServiceState(printed.stdout, plan.host.launchdLabel);
}

function inspectLaunchdEnabledState(plan, runtime) {
  const result = runtime.run("/bin/launchctl", ["print-disabled", plan.host.launchdDomain]);
  assertDeterministicCommandResult(result, "launchctl enabled-state inspection");
  if (result.status !== 0 || result.stderr.trim() !== "") {
    throw new Error("launchctl enabled-state inspection failed");
  }
  return parseLaunchdEnabledState(result.stdout, plan.host.launchdLabel);
}

function classifyInterruptedPredecessorService(plan, runtime) {
  const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
  const result = runtime.run("/bin/launchctl", ["print", target]);
  assertDeterministicCommandResult(result, "interrupted predecessor service inspection");
  if (result.status === 0) {
    const service = parseLaunchdServiceState(result.stdout, plan.host.launchdLabel);
    if (service.pid !== plan.predecessor.pid || service.runCount !== plan.predecessor.runCount) {
      throw new Error("interrupted predecessor service was replaced by a different process");
    }
    verifyProcessIdentity(plan, "predecessor", service.pid, runtime);
    verifyPortOwned(plan, service.pid, runtime);
    return { state: "loaded", service };
  }
  if (
    result.stdout.trim() !== "" ||
    !/(?:could not find service|service (?:was )?not found|no such process)/iu.test(result.stderr)
  ) {
    throw new Error("interrupted predecessor service state was ambiguous");
  }
  verifyPidDead(plan.predecessor.pid, runtime);
  verifyPortFree(plan, runtime);
  verifyNoReplacementGatewayProcess(plan, runtime);
  return { state: "unloaded" };
}

function verifyProcessIdentity(plan, generation, pid, runtime) {
  const command = runtime.run("/bin/ps", ["-ww", "-p", String(pid), "-o", "command="]);
  assertDeterministicCommandResult(command, `${generation} process inspection`);
  if (command.status !== 0 || command.stdout.trim() !== plan[generation].expectedProcessCommand) {
    throw new Error(`${generation} process command does not match the activation plan`);
  }
}

export function verifyPidDead(pid, runtime) {
  const result = runtime.run("/bin/kill", ["-0", String(pid)]);
  assertDeterministicCommandResult(result, "predecessor PID absence probe");
  if (result.status === 0) {
    throw new Error("predecessor PID remains alive after bootout");
  }
  if (
    result.status !== 1 ||
    result.stdout.trim() !== "" ||
    !/(?:no such process|not found)/iu.test(result.stderr)
  ) {
    throw new Error("predecessor PID absence probe was ambiguous");
  }
}

export function hostActivationExitCode(receipt) {
  return receipt?.outcome === "HOLD" ? 2 : 0;
}

function verifyPortFree(plan, runtime) {
  const result = runtime.run("/usr/sbin/lsof", [
    "-nP",
    `-iTCP:${plan.host.gatewayPort}`,
    "-sTCP:LISTEN",
    "-t",
  ]);
  assertDeterministicCommandResult(result, "Gateway port absence probe");
  if (result.status !== 1 || result.stdout.trim() !== "" || result.stderr.trim() !== "") {
    throw new Error("Gateway port remains occupied after predecessor shutdown");
  }
}

function verifyNoReplacementGatewayProcess(plan, runtime) {
  const result = runtime.run("/bin/ps", ["-axo", "pid=,command="]);
  assertDeterministicCommandResult(result, "replacement Gateway process absence probe");
  if (result.status !== 0 || result.stderr.trim() !== "") {
    throw new Error("replacement Gateway process absence probe failed");
  }
  const commands = new Set(
    result.stdout
      .split("\n")
      .map((line) => line.trim().replace(/^\d+\s+/u, ""))
      .filter(Boolean),
  );
  if (
    commands.has(plan.predecessor.expectedProcessCommand) ||
    commands.has(plan.successor.expectedProcessCommand)
  ) {
    throw new Error("a replacement Gateway process remains outside launchd");
  }
}

function verifyPortOwned(plan, pid, runtime) {
  const result = runtime.run("/usr/sbin/lsof", [
    "-nP",
    `-iTCP:${plan.host.gatewayPort}`,
    "-sTCP:LISTEN",
    "-t",
  ]);
  assertDeterministicCommandResult(result, "Gateway port ownership probe");
  const pids = result.stdout.trim().split(/\s+/u).filter(Boolean);
  if (result.status !== 0 || pids.length !== 1 || pids[0] !== String(pid)) {
    throw new Error("Gateway port is not exclusively owned by the successor PID");
  }
}

function verifyUnloaded(plan, runtime) {
  const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
  const result = runtime.run("/bin/launchctl", ["print", target]);
  assertDeterministicCommandResult(result, "Gateway LaunchAgent absence probe");
  if (result.status === 0) {
    throw new Error("Gateway LaunchAgent remains loaded after bootout");
  }
  if (
    result.stdout.trim() !== "" ||
    !/(?:could not find service|service (?:was )?not found|no such process)/iu.test(result.stderr)
  ) {
    throw new Error("Gateway LaunchAgent absence probe was ambiguous");
  }
}

function verifyAtJobRollbackSafety(plan, generation, runtime, options = {}) {
  const enabledAtJobs = runtime.inspectDurableAtJobs(plan, generation);
  if (
    !Array.isArray(enabledAtJobs) ||
    enabledAtJobs.some(
      (job) =>
        !isRecord(job) ||
        typeof job.jobId !== "string" ||
        (job.startupInterruptedRunAtMs !== null &&
          !Number.isSafeInteger(job.startupInterruptedRunAtMs)),
    )
  ) {
    throw new Error("durable at-job rollback safety probe returned an invalid shape");
  }
  const unsafe = enabledAtJobs.filter((job) => job.startupInterruptedRunAtMs !== null);
  const proof = {
    checked: true,
    marker: "state.startupInterruptedRunAtMs:absent",
    enabledAtJobCount: enabledAtJobs.length,
    unsafeEnabledAtJobIds: unsafe.map((job) => job.jobId),
    disposition:
      unsafe.length === 0
        ? "safe_or_refused_before_lifecycle"
        : "unsafe_marker_requires_manual_migration",
  };
  if (unsafe.length > 0 && options.allowUnsafeEvidence !== true) {
    throw new Error(
      "enabled at jobs with durable startupInterruptedRunAtMs markers block activation",
    );
  }
  return proof;
}

function verifyEnabled(plan, runtime) {
  if (!inspectLaunchdEnabledState(plan, runtime)) {
    throw new Error("Gateway LaunchAgent is disabled");
  }
}

function makeReceipt(params) {
  const durableTerminalPhase = params.outcome === "HOLD" ? (params.phases?.at(-1) ?? null) : null;
  const terminalPhase =
    durableTerminalPhase === null
      ? null
      : { phase: durableTerminalPhase.phase, sha256: durableTerminalPhase.sha256 };
  const nonterminalPhases =
    durableTerminalPhase === null ? (params.phases ?? []) : params.phases.slice(0, -1);
  const firstRecoveryIndex = nonterminalPhases.findIndex((phase) =>
    RECOVERY_PHASES.has(phase.phase),
  );
  const receiptPhases =
    firstRecoveryIndex === -1 ? nonterminalPhases : nonterminalPhases.slice(0, firstRecoveryIndex);
  const recoveryPhases =
    firstRecoveryIndex === -1 ? [] : nonterminalPhases.slice(firstRecoveryIndex);
  return {
    schema: HOST_ACTIVATION_RECEIPT_SCHEMA,
    planId: params.plan.planId,
    planSha256: params.planSha256,
    startedAt: params.startedAt,
    completedAt: params.completedAt,
    outcome: params.outcome,
    authority: { kind: "none", grants: [], reusable: false },
    operations: {
      disableCount: params.disableCount,
      enableCount: params.enableCount,
      bootoutCount: params.bootoutCount,
      bootstrapCount: params.bootstrapCount,
      restartCount: params.restartCount,
      automaticRollbackCount: 0,
      automaticSecondRestartCount: 0,
    },
    predecessor: {
      commit: params.plan.predecessor.commit,
      tree: params.plan.predecessor.tree,
      pid: params.plan.predecessor.pid,
      runCount: params.plan.predecessor.runCount,
      cliSha256: params.plan.predecessor.cliSha256,
      runtimeSha256: params.plan.predecessor.runtimeSha256,
      gatewayEntrypointSha256: params.plan.predecessor.gatewayEntrypointSha256,
      wrapperSha256: params.plan.predecessor.wrapperSha256,
      environmentFileSha256: params.plan.predecessor.environmentFileSha256,
      runtimeStampSha256: params.plan.predecessor.runtimeStampSha256,
      buildManifestSha256: params.plan.predecessor.buildManifestSha256,
      servicePlistSha256: params.plan.predecessor.servicePlistSha256,
      configSha256: params.plan.predecessor.configSha256,
      processCommand: params.plan.predecessor.expectedProcessCommand,
    },
    successor: params.successor ?? null,
    proofs: params.proofs ?? null,
    ledger: {
      phases: receiptPhases,
      recoveryPhases,
      terminalPhase,
    },
    rollbackPacketSha256: params.rollbackPacketSha256 ?? null,
    holdReason: params.holdReason ?? null,
  };
}

function validateReceiptIdentity(value, path, options = {}) {
  const keys = [
    ...(options.successor
      ? ["pid", "runCount", "commit", "tree"]
      : ["commit", "tree", "pid", "runCount"]),
    "cliSha256",
    "runtimeSha256",
    "gatewayEntrypointSha256",
    "wrapperSha256",
    "environmentFileSha256",
    "runtimeStampSha256",
    "buildManifestSha256",
    "servicePlistSha256",
    "configSha256",
    "processCommand",
  ];
  exactKeys(value, keys, path);
  requiredGitObject(value.commit, `${path}.commit`);
  requiredGitObject(value.tree, `${path}.tree`);
  requiredInteger(value.pid, `${path}.pid`, 1);
  requiredInteger(value.runCount, `${path}.runCount`, 1);
  for (const key of keys.filter((candidateKey) => candidateKey.endsWith("Sha256"))) {
    requiredSha256(value[key], `${path}.${key}`);
  }
  requiredString(value.processCommand, `${path}.processCommand`);
}

function validateReceiptAtJobSafety(value, path) {
  exactKeys(
    value,
    ["checked", "marker", "enabledAtJobCount", "unsafeEnabledAtJobIds", "disposition"],
    path,
  );
  requiredLiteral(value.checked, true, `${path}.checked`);
  requiredLiteral(value.marker, "state.startupInterruptedRunAtMs:absent", `${path}.marker`);
  requiredInteger(value.enabledAtJobCount, `${path}.enabledAtJobCount`);
  if (!Array.isArray(value.unsafeEnabledAtJobIds) || value.unsafeEnabledAtJobIds.length !== 0) {
    throw new Error(`${path}.unsafeEnabledAtJobIds must be empty`);
  }
  requiredLiteral(value.disposition, "safe_or_refused_before_lifecycle", `${path}.disposition`);
}

function validateReceiptProofs(value, path, kind) {
  const extraKeys =
    kind === "preflight"
      ? ["predecessorBuild"]
      : kind === "activation"
        ? ["stabilityWindowMs"]
        : ["observedAt"];
  exactKeys(
    value,
    [
      ...extraKeys,
      "quiescence",
      "healthSha256",
      "channelsStatusSha256",
      "slackAccessSha256",
      "atJobSafety",
      "portOwnerPid",
      "processCommand",
    ],
    path,
  );
  exactKeys(value.quiescence, ["activeTasks", "activeRuns"], `${path}.quiescence`);
  requiredLiteral(value.quiescence.activeTasks, 0, `${path}.quiescence.activeTasks`);
  requiredLiteral(value.quiescence.activeRuns, 0, `${path}.quiescence.activeRuns`);
  for (const key of ["healthSha256", "channelsStatusSha256", "slackAccessSha256"]) {
    requiredSha256(value[key], `${path}.${key}`);
  }
  validateReceiptAtJobSafety(value.atJobSafety, `${path}.atJobSafety`);
  requiredInteger(value.portOwnerPid, `${path}.portOwnerPid`, 1);
  requiredString(value.processCommand, `${path}.processCommand`);
  if (kind === "preflight") {
    exactKeys(value.predecessorBuild, ["commit", "tree"], `${path}.predecessorBuild`);
    requiredGitObject(value.predecessorBuild.commit, `${path}.predecessorBuild.commit`);
    requiredGitObject(value.predecessorBuild.tree, `${path}.predecessorBuild.tree`);
  } else if (kind === "activation") {
    requiredLiteral(value.stabilityWindowMs, 60_000, `${path}.stabilityWindowMs`);
  } else {
    requiredInstant(value.observedAt, `${path}.observedAt`);
  }
}

function validateReceiptPhaseOrder(outcome, phases, recoveryPhases) {
  const names = phases.map((phase) => phase.phase);
  const recoveryNames = recoveryPhases.map((phase) => phase.phase);
  if (outcome === "PREFLIGHT_PASS") {
    if (names.length !== 0 || recoveryNames.length !== 0) {
      throw new Error("preflight receipt must not contain lifecycle phases");
    }
    return;
  }
  if (outcome === "ACTIVATED_VERIFIED") {
    if (
      JSON.stringify(names) !== JSON.stringify(SUCCESS_PHASE_SEQUENCE) ||
      recoveryNames.length !== 0
    ) {
      throw new Error("activated receipt phase sequence is invalid");
    }
    return;
  }
  if (names.length === 0 || names.some((phase, index) => phase !== SUCCESS_PHASE_SEQUENCE[index])) {
    throw new Error("HOLD receipt lifecycle phase sequence is invalid");
  }
  if (recoveryNames.length === 0) {
    return;
  }
  if (JSON.stringify(recoveryNames) === JSON.stringify(["interrupted-attempt-recovered"])) {
    return;
  }
  const predecessorPlistPreservedIndex = SUCCESS_PHASE_SEQUENCE.indexOf(
    "predecessor-plist-preserved",
  );
  const bootoutInvocationStartedIndex = SUCCESS_PHASE_SEQUENCE.indexOf(
    "bootout-invocation-started",
  );
  if (
    names.length <= predecessorPlistPreservedIndex ||
    names.length > bootoutInvocationStartedIndex + 1 ||
    !PRE_BOOTOUT_RECOVERY_SEQUENCES.some(
      (sequence) => JSON.stringify(sequence) === JSON.stringify(recoveryNames),
    )
  ) {
    throw new Error("HOLD receipt pre-bootout recovery phase sequence is invalid");
  }
}

export function validateHostActivationReceipt(value) {
  exactKeys(value, RECEIPT_KEYS, "activation receipt");
  requiredLiteral(value.schema, HOST_ACTIVATION_RECEIPT_SCHEMA, "activation receipt.schema");
  requiredString(value.planId, "activation receipt.planId");
  requiredSha256(value.planSha256, "activation receipt.planSha256");
  requiredInstant(value.startedAt, "activation receipt.startedAt");
  requiredInstant(value.completedAt, "activation receipt.completedAt");
  if (Date.parse(value.completedAt) < Date.parse(value.startedAt)) {
    throw new Error("activation receipt completion precedes its start");
  }
  validateReceiptIdentity(value.predecessor, "activation receipt.predecessor");
  exactKeys(value.authority, AUTHORITY_KEYS, "activation receipt.authority");
  requiredLiteral(value.authority.kind, "none", "activation receipt.authority.kind");
  requiredLiteral(value.authority.reusable, false, "activation receipt.authority.reusable");
  if (!Array.isArray(value.authority.grants) || value.authority.grants.length !== 0) {
    throw new Error("activation receipt authority grants must be empty");
  }
  exactKeys(
    value.operations,
    [
      "disableCount",
      "enableCount",
      "bootoutCount",
      "bootstrapCount",
      "restartCount",
      "automaticRollbackCount",
      "automaticSecondRestartCount",
    ],
    "activation receipt.operations",
  );
  for (const key of [
    "disableCount",
    "enableCount",
    "bootoutCount",
    "bootstrapCount",
    "restartCount",
  ]) {
    const count = requiredInteger(value.operations[key], `activation receipt.operations.${key}`);
    if (count > 1) {
      throw new Error(`activation receipt.operations.${key} exceeds its one-use limit`);
    }
  }
  requiredLiteral(
    value.operations.automaticRollbackCount,
    0,
    "activation receipt.operations.automaticRollbackCount",
  );
  requiredLiteral(
    value.operations.automaticSecondRestartCount,
    0,
    "activation receipt.operations.automaticSecondRestartCount",
  );
  if (value.operations.restartCount !== value.operations.bootstrapCount) {
    throw new Error("activation receipt restart count must equal its bootstrap count");
  }
  exactKeys(
    value.ledger,
    ["phases", "recoveryPhases", "terminalPhase"],
    "activation receipt.ledger",
  );
  if (!Array.isArray(value.ledger.phases) || !Array.isArray(value.ledger.recoveryPhases)) {
    throw new Error("activation receipt ledger phases must be arrays");
  }
  if (value.ledger.terminalPhase !== null && !isRecord(value.ledger.terminalPhase)) {
    throw new Error("activation receipt terminal phase must be an object or null");
  }
  if (value.ledger.terminalPhase !== null) {
    exactKeys(value.ledger.terminalPhase, ["phase", "sha256"], "activation receipt terminal phase");
    requiredLiteral(
      value.ledger.terminalPhase.phase,
      "hold",
      "activation receipt terminal phase.phase",
    );
    requiredSha256(value.ledger.terminalPhase.sha256, "activation receipt terminal phase.sha256");
  }
  const allPhases = [
    ...value.ledger.phases,
    ...value.ledger.recoveryPhases,
    ...(value.ledger.terminalPhase === null
      ? []
      : [
          {
            sequence: value.ledger.phases.length + value.ledger.recoveryPhases.length,
            ...value.ledger.terminalPhase,
          },
        ]),
  ];
  const observedCounts = {
    disableCount: 0,
    enableCount: 0,
    bootoutCount: 0,
    bootstrapCount: 0,
  };
  allPhases.forEach((phase, index) => {
    exactKeys(phase, ["sequence", "phase", "sha256"], `activation receipt phase ${index}`);
    requiredLiteral(phase.sequence, index, `activation receipt phase ${index}.sequence`);
    requiredString(phase.phase, `activation receipt phase ${index}.phase`);
    requiredSha256(phase.sha256, `activation receipt phase ${index}.sha256`);
    const operation = LIFECYCLE_PHASE_TO_OPERATION.get(phase.phase);
    if (operation) {
      observedCounts[operation] += 1;
    }
  });
  validateReceiptPhaseOrder(value.outcome, value.ledger.phases, value.ledger.recoveryPhases);
  for (const [key, count] of Object.entries(observedCounts)) {
    if (value.operations[key] !== count) {
      throw new Error(`activation receipt ${key} does not match its durable phase ledger`);
    }
  }
  if (value.outcome === "PREFLIGHT_PASS") {
    if (
      value.ledger.phases.length !== 0 ||
      value.ledger.recoveryPhases.length !== 0 ||
      value.ledger.terminalPhase !== null ||
      Object.values(observedCounts).some((count) => count !== 0) ||
      value.successor !== null ||
      value.rollbackPacketSha256 !== null ||
      value.holdReason !== null ||
      !isRecord(value.proofs)
    ) {
      throw new Error("preflight receipt fields are incoherent");
    }
    validateReceiptProofs(value.proofs, "activation receipt.proofs", "preflight");
    requiredLiteral(
      value.proofs.portOwnerPid,
      value.predecessor.pid,
      "activation receipt.proofs.portOwnerPid",
    );
    requiredLiteral(
      value.proofs.processCommand,
      value.predecessor.processCommand,
      "activation receipt.proofs.processCommand",
    );
    requiredLiteral(
      value.proofs.predecessorBuild.commit,
      value.predecessor.commit,
      "activation receipt.proofs.predecessorBuild.commit",
    );
    requiredLiteral(
      value.proofs.predecessorBuild.tree,
      value.predecessor.tree,
      "activation receipt.proofs.predecessorBuild.tree",
    );
  } else {
    if (value.ledger.phases[0]?.phase !== "claim") {
      throw new Error("terminal lifecycle receipt must bind its first claim phase");
    }
    if (value.outcome === "ACTIVATED_VERIFIED") {
      if (
        !isRecord(value.successor) ||
        !isRecord(value.proofs) ||
        value.rollbackPacketSha256 !== null ||
        value.holdReason !== null ||
        value.ledger.recoveryPhases.length !== 0 ||
        value.ledger.terminalPhase !== null ||
        Object.values(observedCounts).some((count) => count !== 1)
      ) {
        throw new Error("activated receipt fields are incoherent");
      }
      validateReceiptIdentity(value.successor, "activation receipt.successor", {
        successor: true,
      });
      validateReceiptProofs(value.proofs, "activation receipt.proofs", "activation");
      if (Date.parse(value.completedAt) - Date.parse(value.startedAt) < 60_000) {
        throw new Error("activated receipt does not span the mandatory stability window");
      }
      requiredLiteral(
        value.proofs.portOwnerPid,
        value.successor.pid,
        "activation receipt.proofs.portOwnerPid",
      );
      requiredLiteral(
        value.proofs.processCommand,
        value.successor.processCommand,
        "activation receipt.proofs.processCommand",
      );
    } else if (value.outcome === "HOLD") {
      if (value.ledger.terminalPhase?.phase !== "hold") {
        throw new Error("HOLD receipt lacks its structurally terminal hold phase");
      }
      requiredSha256(value.rollbackPacketSha256, "activation receipt.rollbackPacketSha256");
      requiredString(value.holdReason, "activation receipt.holdReason");
      if (value.proofs !== null && !isRecord(value.proofs)) {
        throw new Error("HOLD receipt proofs must be an object or null");
      }
      if (value.successor !== null && !isRecord(value.successor)) {
        throw new Error("HOLD receipt successor must be an object or null");
      }
      if ((value.successor === null) !== (value.proofs === null)) {
        throw new Error("HOLD receipt successor and proofs must be present together");
      }
      if (value.successor !== null) {
        const phaseNames = new Set(allPhases.map((phase) => phase.phase));
        if (!phaseNames.has("bootstrap-returned") || !phaseNames.has("postflight-initial-proven")) {
          throw new Error("HOLD successor proof lacks bootstrap and postflight phases");
        }
        validateReceiptIdentity(value.successor, "activation receipt.successor", {
          successor: true,
        });
        validateReceiptProofs(value.proofs, "activation receipt.proofs", "observed");
        requiredLiteral(
          value.proofs.portOwnerPid,
          value.successor.pid,
          "activation receipt.proofs.portOwnerPid",
        );
        requiredLiteral(
          value.proofs.processCommand,
          value.successor.processCommand,
          "activation receipt.proofs.processCommand",
        );
        if (
          Date.parse(value.proofs.observedAt) < Date.parse(value.startedAt) ||
          Date.parse(value.proofs.observedAt) > Date.parse(value.completedAt)
        ) {
          throw new Error("HOLD successor observation falls outside the receipt interval");
        }
      }
    } else {
      throw new Error("activation receipt outcome is invalid");
    }
  }
  return value;
}

export function validateHostRollbackEvidence(value) {
  exactKeys(
    value,
    [
      "schema",
      "planId",
      "planSha256",
      "createdAt",
      "authority",
      "policy",
      "phase",
      "atJobSafety",
      "serviceRecovery",
      "predecessorPlistBackup",
      "predecessor",
      "reason",
    ],
    "rollback evidence",
  );
  requiredLiteral(value.schema, "handoff-v2-host-rollback-evidence/v1", "rollback evidence.schema");
  requiredString(value.planId, "rollback evidence.planId");
  requiredSha256(value.planSha256, "rollback evidence.planSha256");
  requiredInstant(value.createdAt, "rollback evidence.createdAt");
  requiredString(value.phase, "rollback evidence.phase");
  if (!SUCCESS_PHASE_SEQUENCE.includes(value.phase)) {
    throw new Error("rollback evidence phase is not a recoverable lifecycle phase");
  }
  requiredString(value.reason, "rollback evidence.reason");
  if (value.serviceRecovery !== null) {
    requiredLiteral(
      value.phase,
      "bootout-invocation-started",
      "rollback evidence.phase for unloaded service recovery",
    );
    exactKeys(
      value.serviceRecovery,
      [
        "manualRollbackRequired",
        "serviceState",
        "launchdEnabled",
        "predecessorPidDead",
        "portFree",
        "replacementProcessAbsent",
        "replacementProcessProbe",
        "handoff",
        "operations",
      ],
      "rollback evidence.serviceRecovery",
    );
    requiredLiteral(
      value.serviceRecovery.manualRollbackRequired,
      true,
      "rollback evidence.serviceRecovery.manualRollbackRequired",
    );
    requiredLiteral(
      value.serviceRecovery.serviceState,
      "unloaded",
      "rollback evidence.serviceRecovery.serviceState",
    );
    for (const key of [
      "launchdEnabled",
      "predecessorPidDead",
      "portFree",
      "replacementProcessAbsent",
    ]) {
      requiredLiteral(value.serviceRecovery[key], true, `rollback evidence.serviceRecovery.${key}`);
    }
    requiredLiteral(
      value.serviceRecovery.replacementProcessProbe,
      "ps-axo-planned-gateway-commands-absent",
      "rollback evidence.serviceRecovery.replacementProcessProbe",
    );
    exactKeys(
      value.serviceRecovery.handoff,
      ["path", "sha256", "expiresAtMs", "retained"],
      "rollback evidence.serviceRecovery.handoff",
    );
    requiredAbsolutePath(
      value.serviceRecovery.handoff.path,
      "rollback evidence.serviceRecovery.handoff.path",
    );
    requiredSha256(
      value.serviceRecovery.handoff.sha256,
      "rollback evidence.serviceRecovery.handoff.sha256",
    );
    requiredInteger(
      value.serviceRecovery.handoff.expiresAtMs,
      "rollback evidence.serviceRecovery.handoff.expiresAtMs",
      1,
    );
    requiredLiteral(
      value.serviceRecovery.handoff.retained,
      true,
      "rollback evidence.serviceRecovery.handoff.retained",
    );
    exactKeys(
      value.serviceRecovery.operations,
      ["bootstrapCount", "automaticRollbackCount", "automaticSecondRestartCount"],
      "rollback evidence.serviceRecovery.operations",
    );
    for (const key of ["bootstrapCount", "automaticRollbackCount", "automaticSecondRestartCount"]) {
      requiredLiteral(
        value.serviceRecovery.operations[key],
        0,
        `rollback evidence.serviceRecovery.operations.${key}`,
      );
    }
  }
  exactKeys(value.authority, AUTHORITY_KEYS, "rollback evidence.authority");
  requiredLiteral(value.authority.kind, "none", "rollback evidence.authority.kind");
  requiredLiteral(value.authority.reusable, false, "rollback evidence.authority.reusable");
  if (!Array.isArray(value.authority.grants) || value.authority.grants.length !== 0) {
    throw new Error("rollback evidence authority grants must be empty");
  }
  exactKeys(
    value.policy,
    ["automaticExecution", "automaticRestart", "requiredDisposition"],
    "rollback evidence.policy",
  );
  requiredLiteral(
    value.policy.automaticExecution,
    false,
    "rollback evidence.policy.automaticExecution",
  );
  requiredLiteral(
    value.policy.automaticRestart,
    false,
    "rollback evidence.policy.automaticRestart",
  );
  requiredLiteral(
    value.policy.requiredDisposition,
    "HOLD_FOR_SEPARATE_MANUAL_AUTHORIZATION",
    "rollback evidence.policy.requiredDisposition",
  );
  exactKeys(
    value.predecessorPlistBackup,
    ["path", "sha256", "createdBeforeLifecycle", "markerBearingAtJobsMayRun"],
    "rollback evidence.predecessorPlistBackup",
  );
  if (
    value.predecessorPlistBackup.createdBeforeLifecycle !== true ||
    typeof value.predecessorPlistBackup.markerBearingAtJobsMayRun !== "boolean"
  ) {
    throw new Error("rollback evidence does not prove a safe predecessor plist backup");
  }
  requiredAbsolutePath(
    value.predecessorPlistBackup.path,
    "rollback evidence.predecessorPlistBackup.path",
  );
  requiredSha256(
    value.predecessorPlistBackup.sha256,
    "rollback evidence.predecessorPlistBackup.sha256",
  );
  if (
    value.atJobSafety !== null &&
    value.atJobSafety?.marker !== "state.startupInterruptedRunAtMs:absent"
  ) {
    throw new Error("rollback evidence does not bind the durable at-job marker");
  }
  const markerMayRun =
    value.atJobSafety === null ||
    !Array.isArray(value.atJobSafety.unsafeEnabledAtJobIds) ||
    value.atJobSafety.unsafeEnabledAtJobIds.length > 0;
  if (value.predecessorPlistBackup.markerBearingAtJobsMayRun !== markerMayRun) {
    throw new Error("rollback evidence at-job disposition is internally inconsistent");
  }
  if (value.atJobSafety !== null) {
    exactKeys(
      value.atJobSafety,
      ["checked", "marker", "enabledAtJobCount", "unsafeEnabledAtJobIds", "disposition"],
      "rollback evidence.atJobSafety",
    );
    requiredLiteral(value.atJobSafety.checked, true, "rollback evidence.atJobSafety.checked");
    requiredInteger(
      value.atJobSafety.enabledAtJobCount,
      "rollback evidence.atJobSafety.enabledAtJobCount",
    );
    if (
      !Array.isArray(value.atJobSafety.unsafeEnabledAtJobIds) ||
      value.atJobSafety.unsafeEnabledAtJobIds.some(
        (jobId) => typeof jobId !== "string" || jobId.length === 0,
      ) ||
      new Set(value.atJobSafety.unsafeEnabledAtJobIds).size !==
        value.atJobSafety.unsafeEnabledAtJobIds.length ||
      value.atJobSafety.unsafeEnabledAtJobIds.length > value.atJobSafety.enabledAtJobCount
    ) {
      throw new Error("rollback evidence unsafe at-job IDs are invalid");
    }
    const expectedDisposition =
      value.atJobSafety.unsafeEnabledAtJobIds.length === 0
        ? "safe_or_refused_before_lifecycle"
        : "unsafe_marker_requires_manual_migration";
    requiredLiteral(
      value.atJobSafety.disposition,
      expectedDisposition,
      "rollback evidence.atJobSafety.disposition",
    );
  }
  exactKeys(
    value.predecessor,
    [
      "commit",
      "tree",
      "cliPath",
      "cliSha256",
      "runtimePath",
      "runtimeSha256",
      "servicePlistPath",
      "servicePlistSha256",
      "configPath",
      "configSha256",
    ],
    "rollback evidence.predecessor",
  );
  requiredGitObject(value.predecessor.commit, "rollback evidence.predecessor.commit");
  requiredGitObject(value.predecessor.tree, "rollback evidence.predecessor.tree");
  for (const key of ["cliPath", "runtimePath", "servicePlistPath", "configPath"]) {
    requiredAbsolutePath(value.predecessor[key], `rollback evidence.predecessor.${key}`);
  }
  for (const key of ["cliSha256", "runtimeSha256", "servicePlistSha256", "configSha256"]) {
    requiredSha256(value.predecessor[key], `rollback evidence.predecessor.${key}`);
  }
  return value;
}

function writeExclusiveAtomic(path, bytes) {
  assertSecureDirectory(dirname(path), "exclusive evidence parent");
  const temporaryPath = `${path}.tmp-${process.pid}`;
  let descriptor;
  try {
    descriptor = openSync(
      temporaryPath,
      constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY,
      0o600,
    );
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    linkSync(temporaryPath, path);
    unlinkSync(temporaryPath);
    const directory = openSync(dirname(path), constants.O_RDONLY);
    try {
      fsyncSync(directory);
    } finally {
      closeSync(directory);
    }
  } catch (error) {
    if (descriptor !== undefined) {
      closeSync(descriptor);
    }
    try {
      unlinkSync(temporaryPath);
    } catch {}
    throw error;
  }
}

function syncParentDirectory(path) {
  const directory = openSync(dirname(path), constants.O_RDONLY);
  try {
    fsyncSync(directory);
  } finally {
    closeSync(directory);
  }
}

function syncFileAndParent(path) {
  const descriptor = openSync(path, constants.O_RDONLY);
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  syncParentDirectory(path);
}

function replaceFileDurably(bytes, destination) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
    throw new Error("durable replacement bytes are required");
  }
  const temporaryPath = `${destination}.activation-${process.pid}-${randomUUID()}`;
  const descriptor = openSync(
    temporaryPath,
    constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY,
    0o600,
  );
  try {
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  try {
    renameSync(temporaryPath, destination);
    syncParentDirectory(destination);
  } catch (error) {
    try {
      unlinkSync(temporaryPath);
    } catch {
      // Rename may already have exposed the replacement.
    }
    throw error;
  }
}

function removeFileDurably(path) {
  try {
    unlinkSync(path);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
  syncParentDirectory(path);
}

class TerminalPersistenceError extends Error {
  constructor(description, cause) {
    super(`${description} could not be proven durable`, { cause });
    this.name = "TerminalPersistenceError";
  }
}

class PhasePersistenceError extends Error {
  constructor(description, cause) {
    super(`${description} could not be proven durable`, { cause });
    this.name = "PhasePersistenceError";
  }
}

function readOptionalFileForPersistence(runtime, path, description, PersistenceError) {
  try {
    return runtime.readOptionalFile(path, description);
  } catch (error) {
    throw new PersistenceError(description, error);
  }
}

function proveExactFileDurable(runtime, path, bytes, description, PersistenceError) {
  try {
    runtime.ensureFileDurable(path);
  } catch (error) {
    throw new PersistenceError(description, error);
  }
  const durable = readOptionalFileForPersistence(runtime, path, description, PersistenceError);
  if (durable === null || !durable.equals(bytes)) {
    throw new PersistenceError(
      description,
      new Error("exact bytes changed during durability verification"),
    );
  }
}

function verifyActiveGuard(plan, runtime) {
  assertActivationWindow(plan, runtime, "mutation guard verification");
  const guardBytes = runtime.verifyFile(
    plan.guard.path,
    plan.guard.sha256,
    "active mutation guard",
  );
  const lockBytes = runtime.verifyFile(
    plan.guard.rolloutLockPath,
    plan.guard.rolloutLockSha256,
    "active rollout lock",
  );
  let guard;
  let lock;
  try {
    guard = JSON.parse(guardBytes.toString("utf8"));
    lock = JSON.parse(lockBytes.toString("utf8"));
  } catch {
    throw new Error("active mutation guard or rollout lock contains malformed JSON");
  }
  exactKeys(
    guard,
    [
      "allowScheduledExecution",
      "blockedActions",
      "expiresAt",
      "planSha256",
      "runId",
      "schemaVersion",
      "startsAt",
      "status",
    ],
    "active mutation guard",
  );
  if (
    guard.schemaVersion !== "model-router-evidence-cron-mutation-guard/v1" ||
    guard.status !== "active" ||
    guard.allowScheduledExecution !== true ||
    JSON.stringify(guard.blockedActions) !== JSON.stringify(["add", "remove", "update"]) ||
    guard.runId !== plan.guard.runId ||
    guard.planSha256 !== `sha256:${plan.guard.planSha256}` ||
    guard.startsAt !== plan.guard.startsAt ||
    guard.expiresAt !== plan.guard.expiresAt ||
    Date.parse(guard.startsAt) > Date.parse(runtime.now()) ||
    Date.parse(guard.expiresAt) <= Date.parse(runtime.now())
  ) {
    throw new Error("active mutation guard content does not match the activation plan");
  }
  exactKeys(lock, ["outputDir", "planSha256", "runId"], "active rollout lock");
  if (
    typeof lock.outputDir !== "string" ||
    lock.runId !== plan.guard.runId ||
    lock.planSha256 !== `sha256:${plan.guard.planSha256}`
  ) {
    throw new Error("active rollout lock content does not match the mutation guard");
  }
}

function verifyBuildIdentity(plan, generation, runtime) {
  const candidate = plan[generation];
  const manifestBytes = runtime.verifyFile(
    candidate.buildManifestPath,
    candidate.buildManifestSha256,
    `${generation} build manifest`,
  );
  runtime.verifyFile(candidate.cliPath, candidate.cliSha256, `${generation} CLI`);
  runtime.verifyFile(candidate.runtimePath, candidate.runtimeSha256, `${generation} Node runtime`);
  runtime.verifyFile(
    candidate.gatewayEntrypointPath,
    candidate.gatewayEntrypointSha256,
    `${generation} Gateway entrypoint`,
  );
  runtime.verifyFile(candidate.wrapperPath, candidate.wrapperSha256, `${generation} wrapper`);
  runtime.verifyFile(
    candidate.environmentFilePath,
    candidate.environmentFileSha256,
    `${generation} environment file`,
  );
  runtime.verifyFile(
    candidate.runtimeStampPath,
    candidate.runtimeStampSha256,
    `${generation} runtime stamp`,
  );
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString("utf8"));
  } catch {
    throw new Error(`${generation} build manifest contains malformed JSON`);
  }
  exactKeys(
    manifest,
    [
      "schema",
      "commit",
      "tree",
      "cliSha256",
      "runtimeSha256",
      "gatewayEntrypointSha256",
      "wrapperSha256",
      "environmentFileSha256",
      "runtimeStampSha256",
    ],
    `${generation} build manifest`,
  );
  if (
    manifest.schema !== "openclaw-host-build-manifest/v1" ||
    manifest.commit !== candidate.commit ||
    manifest.tree !== candidate.tree ||
    manifest.cliSha256 !== candidate.cliSha256 ||
    manifest.runtimeSha256 !== candidate.runtimeSha256 ||
    manifest.gatewayEntrypointSha256 !== candidate.gatewayEntrypointSha256 ||
    manifest.wrapperSha256 !== candidate.wrapperSha256 ||
    manifest.environmentFileSha256 !== candidate.environmentFileSha256 ||
    manifest.runtimeStampSha256 !== candidate.runtimeStampSha256
  ) {
    throw new Error(`${generation} build manifest does not bind the planned runtime identity`);
  }
  return { commit: manifest.commit, tree: manifest.tree };
}

function createRollbackPacket(
  plan,
  planSha256,
  createdAt,
  reason,
  atJobSafety,
  phase,
  serviceRecovery = null,
) {
  const packet = {
    schema: "handoff-v2-host-rollback-evidence/v1",
    planId: plan.planId,
    planSha256,
    createdAt,
    authority: { kind: "none", grants: [], reusable: false },
    policy: {
      automaticExecution: false,
      automaticRestart: false,
      requiredDisposition: "HOLD_FOR_SEPARATE_MANUAL_AUTHORIZATION",
    },
    phase,
    atJobSafety,
    serviceRecovery,
    predecessorPlistBackup: {
      path: plan.evidence.predecessorPlistBackupPath,
      sha256: plan.predecessor.servicePlistSha256,
      createdBeforeLifecycle: true,
      markerBearingAtJobsMayRun:
        atJobSafety === null || atJobSafety.unsafeEnabledAtJobIds.length > 0,
    },
    predecessor: {
      commit: plan.predecessor.commit,
      tree: plan.predecessor.tree,
      cliPath: plan.predecessor.cliPath,
      cliSha256: plan.predecessor.cliSha256,
      runtimePath: plan.predecessor.runtimePath,
      runtimeSha256: plan.predecessor.runtimeSha256,
      servicePlistPath: plan.predecessor.servicePlistPath,
      servicePlistSha256: plan.predecessor.servicePlistSha256,
      configPath: plan.predecessor.configPath,
      configSha256: plan.predecessor.configSha256,
    },
    reason,
  };
  validateHostRollbackEvidence(packet);
  const bytes = canonicalJsonBytes(packet);
  return { bytes, sha256: sha256(bytes) };
}

function verifySupervisorLease(plan, runtime) {
  assertActivationWindow(plan, runtime, "supervisor lease verification");
  const bytes = runtime.verifyFile(
    plan.evidence.supervisorLeasePath,
    plan.evidence.supervisorLeaseSha256,
    "exclusive supervisor lease",
  );
  let lease;
  try {
    lease = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error("exclusive supervisor lease contains malformed JSON");
  }
  exactKeys(
    lease,
    ["schema", "planId", "owner", "exclusive", "createdAt", "expiresAt"],
    "exclusive supervisor lease",
  );
  if (
    lease.schema !== "handoff-v2-host-supervisor-lease/v1" ||
    lease.planId !== plan.planId ||
    lease.owner !== "openclaw-safe-gateway-restart" ||
    lease.exclusive !== true ||
    !ISO_INSTANT_RE.test(lease.createdAt) ||
    !Number.isFinite(Date.parse(lease.createdAt)) ||
    !ISO_INSTANT_RE.test(lease.expiresAt) ||
    !Number.isFinite(Date.parse(lease.expiresAt)) ||
    Date.parse(lease.createdAt) > Date.parse(plan.createdAt) ||
    Date.parse(lease.expiresAt) < Date.parse(plan.expiresAt) ||
    Date.parse(lease.expiresAt) <= Date.parse(runtime.now())
  ) {
    throw new Error("exclusive supervisor lease does not bind this activation plan");
  }
}

function verifyMutationAuthority(
  plan,
  runtime,
  description,
  suspension,
  generation = "predecessor",
) {
  verifySupervisorLease(plan, runtime);
  verifyActiveGuard(plan, runtime);
  if (suspension !== undefined) {
    renewGatewaySuspension(plan, suspension, runtime, generation);
    verifySupervisorLease(plan, runtime);
    verifyActiveGuard(plan, runtime);
  }
  assertActivationWindow(plan, runtime, description, plan.operations.startupWaitMs);
}

function waitForSuccessor(plan, runtime) {
  const attempts = Math.floor(plan.operations.startupWaitMs / plan.operations.probeIntervalMs) + 1;
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return inspectService(plan, runtime);
    } catch (error) {
      lastError = error;
      if (attempt + 1 < attempts) {
        runtime.sleep(plan.operations.probeIntervalMs);
      }
    }
  }
  throw new Error(
    `successor did not become inspectable within startup deadline: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

function verifySuccessorPostflight(plan, runtime) {
  const successor = waitForSuccessor(plan, runtime);
  if (successor.pid === plan.predecessor.pid || successor.runCount !== 1) {
    throw new Error("successor process proof did not bind the enrolled first process incarnation");
  }
  const build = verifyBuildIdentity(plan, "successor", runtime);
  verifySupervisorLease(plan, runtime);
  verifyProcessIdentity(plan, "successor", successor.pid, runtime);
  verifyPortOwned(plan, successor.pid, runtime);
  runtime.verifyFile(plan.predecessor.configPath, plan.predecessor.configSha256, "configuration");
  verifyActiveGuard(plan, runtime);
  const quiescence = verifyTasksQuiescent(plan, "successor", runtime);
  const health = verifyGatewayHealth(plan, "successor", runtime);
  const channels = verifyChannelsStatus(plan, "successor", runtime);
  const slack = verifySlack(plan, "successor", runtime);
  return {
    successor,
    build,
    proofs: {
      quiescence,
      healthSha256: sha256(canonicalJsonBytes(health)),
      channelsStatusSha256: sha256(canonicalJsonBytes(channels)),
      slackAccessSha256: sha256(canonicalJsonBytes(slack)),
      portOwnerPid: successor.pid,
      processCommand: plan.successor.expectedProcessCommand,
    },
  };
}

function inspectDurableAtJobs(plan) {
  const stateDatabasePath = `${plan.host.stateDir}/state/openclaw.sqlite`;
  assertSecureDirectoryChain(
    dirname(stateDatabasePath),
    plan.host.stateDir,
    "OpenClaw state database parent chain",
  );
  const stat = lstatSync(stateDatabasePath);
  if (
    !stat.isFile() ||
    stat.isSymbolicLink() ||
    stat.nlink !== 1 ||
    (stat.mode & 0o022) !== 0 ||
    (typeof process.getuid === "function" && stat.uid !== process.getuid())
  ) {
    throw new Error("OpenClaw state database must be one owner-controlled regular file");
  }
  const database = new DatabaseSync(stateDatabasePath, { readOnly: true });
  let enabledAtJobs;
  try {
    const table = database
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'cron_jobs'")
      .get();
    if (!table) {
      enabledAtJobs = [];
    } else {
      enabledAtJobs = database
        .prepare(
          "SELECT job_id AS jobId, state_json AS stateJson FROM cron_jobs WHERE enabled = 1 AND schedule_kind = 'at' ORDER BY job_id",
        )
        .all()
        .map((row) => {
          let state;
          try {
            state = JSON.parse(String(row.stateJson));
          } catch {
            throw new Error(`durable at-job ${String(row.jobId)} has malformed state JSON`);
          }
          const marker = isRecord(state) ? state.startupInterruptedRunAtMs : undefined;
          if (marker !== undefined && !Number.isSafeInteger(marker)) {
            throw new Error(
              `durable at-job ${String(row.jobId)} has an invalid startup interruption marker`,
            );
          }
          return {
            jobId: String(row.jobId),
            startupInterruptedRunAtMs: marker ?? null,
          };
        });
    }
  } finally {
    database.close();
  }
  const after = lstatSync(stateDatabasePath);
  if (
    stat.dev !== after.dev ||
    stat.ino !== after.ino ||
    stat.mtimeMs !== after.mtimeMs ||
    stat.ctimeMs !== after.ctimeMs
  ) {
    throw new Error("OpenClaw state database changed during the durable at-job probe");
  }
  return enabledAtJobs;
}

function readOptionalSecureFile(path, description) {
  try {
    return readSecureFile(path, description);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function listLedgerPhaseEntries(directory, planId, planSha256) {
  assertSecureDirectory(directory, "activation ledger directory");
  const entries = [];
  for (const name of readdirSync(directory).toSorted()) {
    if (!/^\d{2}-[a-z0-9-]+\.json$/u.test(name)) {
      continue;
    }
    const bytes = readSecureFile(`${directory}/${name}`, `activation ledger phase ${name}`);
    let entry;
    try {
      entry = JSON.parse(bytes.toString("utf8"));
    } catch {
      throw new Error(`activation ledger phase ${name} contains malformed JSON`);
    }
    exactKeys(
      entry,
      ["schema", "planId", "planSha256", "sequence", "phase", "at", "detail"],
      `activation ledger phase ${name}`,
    );
    if (
      entry.schema !== "handoff-v2-host-activation-ledger-phase/v1" ||
      entry.planId !== planId ||
      entry.planSha256 !== planSha256 ||
      entry.sequence !== entries.length ||
      !ISO_INSTANT_RE.test(entry.at) ||
      !isRecord(entry.detail)
    ) {
      throw new Error(`activation ledger phase ${name} is incoherent`);
    }
    if (name !== `${String(entry.sequence).padStart(2, "0")}-${entry.phase}.json`) {
      throw new Error(`activation ledger phase ${name} does not match its filename`);
    }
    entries.push({ entry, sha256: sha256(bytes) });
  }
  return entries;
}

export function createDefaultHostActivationRuntime() {
  return {
    now: () => new Date().toISOString(),
    sleep: (milliseconds) => {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
    },
    run: runCommand,
    getHostIdentity: () => ({
      uid: typeof process.getuid === "function" ? process.getuid() : -1,
      homePath: homedir(),
      executorPid: process.pid,
    }),
    assertClaimOwnerDead: (pid) => verifyPidDead(pid, { run: runCommand }),
    acquireRecoveryOwnership: (path, executorPid) => {
      assertSecureDirectory(dirname(path), "recovery ownership parent");
      const acquired = runCommand("/usr/bin/shlock", ["-f", path, "-p", String(executorPid)]);
      if (acquired.status !== 0 || acquired.signal || acquired.error) {
        throw new Error("another process owns interrupted-attempt recovery");
      }
      const expected = Buffer.from(`${executorPid}\n`, "utf8");
      try {
        syncFileAndParent(path);
        const actual = readSecureFile(path, "recovery ownership");
        if (!actual.equals(expected)) {
          throw new Error("recovery ownership does not bind this executor");
        }
      } catch (error) {
        try {
          removeFileDurably(path);
        } catch {
          // Preserve the original acquisition failure.
        }
        throw error;
      }
    },
    releaseRecoveryOwnership: (path, executorPid) => {
      const expected = Buffer.from(`${executorPid}\n`, "utf8");
      const actual = readSecureFile(path, "recovery ownership");
      if (!actual.equals(expected)) {
        throw new Error("recovery ownership changed before release");
      }
      removeFileDurably(path);
    },
    verifyFile,
    assertSecureDirectory,
    assertSecureDirectoryChain,
    assertOutputAvailable,
    inspectDurableAtJobs,
    readOptionalFile: readOptionalSecureFile,
    listLedgerPhases: listLedgerPhaseEntries,
    ensureFileDurable: syncFileAndParent,
    replaceFileDurably,
    removeFileDurably,
    installFile: (bytes, destination) => {
      if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
        throw new Error("verified staged successor plist bytes are required");
      }
      replaceFileDurably(bytes, destination);
    },
    preserveFile: (source, destination) => {
      assertOutputAvailable(destination, "predecessor plist backup");
      const bytes = readSecureFile(source, "predecessor service plist");
      const descriptor = openSync(
        destination,
        constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY,
        0o600,
      );
      try {
        writeFileSync(descriptor, bytes);
        fsyncSync(descriptor);
      } finally {
        closeSync(descriptor);
      }
      syncParentDirectory(destination);
    },
    writeExclusive: writeExclusiveAtomic,
  };
}

export function executeHostActivation(params) {
  const runtime = params.runtime ?? createDefaultHostActivationRuntime();
  const startedAt = runtime.now();
  const planBytes = params.planBytes;
  const planSha256 = sha256(planBytes);
  if (planSha256 !== params.expectedPlanSha256) {
    throw new Error("activation plan SHA-256 mismatch");
  }
  const plan = validateHostActivationPlan(JSON.parse(planBytes.toString("utf8")), {
    nowMs: Date.parse(startedAt),
    allowExpired: true,
  });
  if (!planBytes.equals(canonicalJsonBytes(plan))) {
    throw new Error("activation plan bytes must use the canonical JSON encoding");
  }
  const hostIdentity = runtime.getHostIdentity();
  if (
    hostIdentity.uid !== plan.host.uid ||
    hostIdentity.homePath !== plan.host.homePath ||
    !Number.isSafeInteger(hostIdentity.executorPid) ||
    hostIdentity.executorPid < 1
  ) {
    throw new Error("activation plan host identity does not match the executing host");
  }
  const counts = {
    disableCount: 0,
    enableCount: 0,
    bootoutCount: 0,
    bootstrapCount: 0,
    restartCount: 0,
  };
  const phases = [];
  let claimSha256 = null;
  let lifecycleClaimed = false;
  let disabled = false;
  let bootoutAttempted = false;
  let currentPhase = "preflight";
  let atJobSafety;
  let suspension = null;
  let observedSuccessor = null;
  let observedSuccessorProofs = null;
  let successorSuspension;
  let recoveringExistingClaim = false;
  const globalClaimPath = serviceLifecycleClaimPath(plan, hostIdentity);

  const phasePath = (index, name) =>
    `${plan.evidence.ledgerDirectory}/${String(index).padStart(2, "0")}-${name}.json`;
  const writePhase = (name, detail = {}) => {
    const entry = {
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256,
      sequence: phases.length,
      phase: name,
      at: runtime.now(),
      detail,
    };
    const bytes = canonicalJsonBytes(entry);
    const path = phasePath(phases.length, name);
    try {
      runtime.writeExclusive(path, bytes);
    } catch (error) {
      const description = `activation ledger phase ${name}`;
      const existing = readOptionalFileForPersistence(
        runtime,
        path,
        description,
        PhasePersistenceError,
      );
      if (existing === null || !existing.equals(bytes)) {
        throw new PhasePersistenceError(description, error);
      }
      proveExactFileDurable(runtime, path, bytes, description, PhasePersistenceError);
    }
    const record = { sequence: phases.length, phase: name, sha256: sha256(bytes) };
    phases.push(record);
    currentPhase = name;
    return record.sha256;
  };

  const persistExact = (path, bytes, description) => {
    const existing = runtime.readOptionalFile(path, description);
    if (existing === null) {
      try {
        runtime.writeExclusive(path, bytes);
      } catch (error) {
        const exposed = readOptionalFileForPersistence(
          runtime,
          path,
          description,
          TerminalPersistenceError,
        );
        if (exposed === null || !exposed.equals(bytes)) {
          throw new TerminalPersistenceError(description, error);
        }
        proveExactFileDurable(runtime, path, bytes, description, TerminalPersistenceError);
      }
    } else if (!existing.equals(bytes)) {
      throw new Error(`${description} differs from the durable terminal snapshot`);
    } else {
      try {
        runtime.ensureFileDurable(path);
      } catch (error) {
        throw new TerminalPersistenceError(description, error);
      }
      const durable = runtime.readOptionalFile(path, description);
      if (durable === null || !durable.equals(bytes)) {
        throw new TerminalPersistenceError(
          description,
          new Error("exact terminal bytes changed during durability verification"),
        );
      }
    }
  };

  const persistClaimExact = (path, bytes, description) => {
    const existing = runtime.readOptionalFile(path, description);
    if (existing === null) {
      try {
        runtime.writeExclusive(path, bytes);
        return;
      } catch (error) {
        const exposed = readOptionalFileForPersistence(
          runtime,
          path,
          description,
          PhasePersistenceError,
        );
        if (exposed === null || !exposed.equals(bytes)) {
          throw new PhasePersistenceError(description, error);
        }
        proveExactFileDurable(runtime, path, bytes, description, PhasePersistenceError);
        return;
      }
    }
    if (!existing.equals(bytes)) {
      throw new Error(`${description} differs from the lifecycle claim`);
    }
    try {
      runtime.ensureFileDurable(path);
    } catch (error) {
      throw new PhasePersistenceError(description, error);
    }
    const durable = runtime.readOptionalFile(path, description);
    if (durable === null || !durable.equals(bytes)) {
      throw new PhasePersistenceError(
        description,
        new Error("exact claim bytes changed during durability verification"),
      );
    }
  };

  const finish = (outcome, extra = {}) => {
    const receipt = makeReceipt({
      plan,
      planSha256,
      startedAt: extra.startedAt ?? startedAt,
      completedAt: extra.completedAt ?? runtime.now(),
      outcome,
      ...counts,
      claimSha256,
      phases,
      ...extra,
    });
    validateHostActivationReceipt(receipt);
    persistExact(plan.evidence.receiptPath, canonicalJsonBytes(receipt), "activation receipt");
    return receipt;
  };

  const finishHold = ({
    reason,
    failedPhase,
    terminalAtJobSafety,
    successor = null,
    proofs = null,
    terminalStartedAt = startedAt,
    completedAt = runtime.now(),
    writeTerminalPhase = true,
    serviceRecovery = null,
  }) => {
    if (writeTerminalPhase) {
      writePhase("hold", {
        reason,
        failedPhase,
        startedAt: terminalStartedAt,
        completedAt,
        atJobSafety: terminalAtJobSafety,
        successor,
        proofs,
      });
    }
    const rollbackPacket = createRollbackPacket(
      plan,
      planSha256,
      completedAt,
      reason,
      terminalAtJobSafety,
      failedPhase,
      serviceRecovery,
    );
    persistExact(plan.evidence.rollbackPacketPath, rollbackPacket.bytes, "rollback packet");
    return finish("HOLD", {
      startedAt: terminalStartedAt,
      completedAt,
      holdReason: reason,
      rollbackPacketSha256: rollbackPacket.sha256,
      successor,
      proofs,
    });
  };

  try {
    runtime.assertSecureDirectory(plan.evidence.ledgerDirectory, "activation ledger directory");
    const existingGlobalClaim = runtime.readOptionalFile(
      globalClaimPath,
      "service-global lifecycle claim",
    );
    if (existingGlobalClaim) {
      try {
        runtime.ensureFileDurable(globalClaimPath);
      } catch (error) {
        throw new PhasePersistenceError("service-global lifecycle claim", error);
      }
      const durableGlobalClaim = runtime.readOptionalFile(
        globalClaimPath,
        "service-global lifecycle claim",
      );
      if (durableGlobalClaim === null || !durableGlobalClaim.equals(existingGlobalClaim)) {
        throw new PhasePersistenceError(
          "service-global lifecycle claim",
          new Error("claim changed during durability verification"),
        );
      }
      recoveringExistingClaim = true;
      let claim;
      try {
        claim = JSON.parse(existingGlobalClaim.toString("utf8"));
      } catch {
        throw new Error("service-global lifecycle claim contains malformed JSON");
      }
      exactKeys(
        claim,
        ["schema", "planId", "planSha256", "sequence", "phase", "at", "detail"],
        "service-global lifecycle claim",
      );
      exactKeys(
        claim.detail,
        [
          "launchdDomain",
          "launchdLabel",
          "executorPid",
          "predecessorPid",
          "predecessorRunCount",
          "supervisorLeaseSha256",
        ],
        "service-global lifecycle claim.detail",
      );
      if (
        claim.schema !== "handoff-v2-host-activation-ledger-phase/v1" ||
        claim.planId !== plan.planId ||
        claim.planSha256 !== planSha256 ||
        claim.sequence !== 0 ||
        claim.phase !== "claim" ||
        claim.detail?.launchdDomain !== plan.host.launchdDomain ||
        claim.detail?.launchdLabel !== plan.host.launchdLabel ||
        claim.detail?.predecessorPid !== plan.predecessor.pid ||
        claim.detail?.predecessorRunCount !== plan.predecessor.runCount ||
        claim.detail?.supervisorLeaseSha256 !== plan.evidence.supervisorLeaseSha256 ||
        !Number.isSafeInteger(claim.detail?.executorPid) ||
        claim.detail.executorPid < 1
      ) {
        throw new Error("another plan already owns the service-global lifecycle claim");
      }
      runtime.assertClaimOwnerDead(claim.detail.executorPid);
      const ownershipPath = recoveryOwnershipPath(globalClaimPath);
      runtime.acquireRecoveryOwnership(ownershipPath, hostIdentity.executorPid);
      try {
        runtime.verifyFile(
          plan.evidence.predecessorPlistBackupPath,
          plan.predecessor.servicePlistSha256,
          "predecessor plist backup for interrupted attempt",
        );
        const ledgerClaimPath = phasePath(0, "claim");
        const ledgerClaimBytes = runtime.readOptionalFile(
          ledgerClaimPath,
          "activation ledger claim",
        );
        if (ledgerClaimBytes === null) {
          persistClaimExact(ledgerClaimPath, existingGlobalClaim, "activation ledger claim");
        } else if (!ledgerClaimBytes.equals(existingGlobalClaim)) {
          throw new Error("interrupted attempt ledger claim differs from its service-global claim");
        } else {
          try {
            runtime.ensureFileDurable(ledgerClaimPath);
          } catch (error) {
            throw new PhasePersistenceError("activation ledger claim", error);
          }
          const durableLedgerClaim = runtime.readOptionalFile(
            ledgerClaimPath,
            "activation ledger claim",
          );
          if (durableLedgerClaim === null || !durableLedgerClaim.equals(existingGlobalClaim)) {
            throw new PhasePersistenceError(
              "activation ledger claim",
              new Error("ledger claim changed during durability verification"),
            );
          }
        }
        const recoveredEntries = runtime.listLedgerPhases(
          plan.evidence.ledgerDirectory,
          plan.planId,
          planSha256,
        );
        for (const { entry, sha256: entrySha256 } of recoveredEntries) {
          const recoveredPath = phasePath(entry.sequence, entry.phase);
          try {
            runtime.ensureFileDurable(recoveredPath);
          } catch (error) {
            throw new PhasePersistenceError(
              `recovered activation ledger phase ${entry.phase}`,
              error,
            );
          }
          const durableEntry = runtime.readOptionalFile(
            recoveredPath,
            `recovered activation ledger phase ${entry.phase}`,
          );
          if (durableEntry === null || sha256(durableEntry) !== entrySha256) {
            throw new PhasePersistenceError(
              `recovered activation ledger phase ${entry.phase}`,
              new Error("ledger phase changed during durability verification"),
            );
          }
        }
        claimSha256 = sha256(existingGlobalClaim);
        if (
          recoveredEntries.length > 0 &&
          (recoveredEntries[0].entry.phase !== "claim" ||
            recoveredEntries[0].sha256 !== claimSha256)
        ) {
          throw new Error("interrupted attempt ledger does not match its service-global claim");
        }
        const durableEntries =
          recoveredEntries.length > 0 ? recoveredEntries : [{ entry: claim, sha256: claimSha256 }];
        for (const { entry, sha256: entrySha256 } of durableEntries) {
          phases.push({
            sequence: entry.sequence,
            phase: entry.phase,
            sha256: entrySha256,
          });
          const operation = LIFECYCLE_PHASE_TO_OPERATION.get(entry.phase);
          if (operation) {
            counts[operation] += 1;
          }
        }
        counts.restartCount = counts.bootstrapCount;
        lifecycleClaimed = true;
        currentPhase = phases.at(-1)?.phase ?? "claim";
        const existingReceiptBytes = runtime.readOptionalFile(
          plan.evidence.receiptPath,
          "activation receipt",
        );
        if (existingReceiptBytes !== null && currentPhase !== "hold") {
          try {
            runtime.ensureFileDurable(plan.evidence.receiptPath);
          } catch (error) {
            throw new TerminalPersistenceError("activation receipt", error);
          }
          const durableReceiptBytes = runtime.readOptionalFile(
            plan.evidence.receiptPath,
            "activation receipt",
          );
          if (durableReceiptBytes === null || !durableReceiptBytes.equals(existingReceiptBytes)) {
            throw new TerminalPersistenceError(
              "activation receipt",
              new Error("receipt changed during durability verification"),
            );
          }
          let existingReceipt;
          try {
            existingReceipt = validateHostActivationReceipt(
              JSON.parse(existingReceiptBytes.toString("utf8")),
            );
          } catch {
            throw new Error("existing activation receipt is malformed or incoherent");
          }
          if (
            existingReceipt.outcome !== "ACTIVATED_VERIFIED" ||
            existingReceipt.planId !== plan.planId ||
            existingReceipt.planSha256 !== planSha256 ||
            !existingReceiptBytes.equals(canonicalJsonBytes(existingReceipt)) ||
            JSON.stringify(canonicalJson(existingReceipt.ledger.phases)) !==
              JSON.stringify(canonicalJson(phases))
          ) {
            throw new Error("existing activation receipt does not match the durable lifecycle");
          }
          return existingReceipt;
        }
        const lastRecoveredEntry = durableEntries.at(-1)?.entry;
        const lastSuccessEntry = durableEntries.findLast(({ entry }) =>
          SUCCESS_PHASE_SEQUENCE.includes(entry.phase),
        )?.entry;
        const lastSuccessIndex = SUCCESS_PHASE_SEQUENCE.indexOf(lastSuccessEntry?.phase);
        const predecessorPreservedIndex = SUCCESS_PHASE_SEQUENCE.indexOf(
          "predecessor-plist-preserved",
        );
        const bootoutInvocationStartedIndex = SUCCESS_PHASE_SEQUENCE.indexOf(
          "bootout-invocation-started",
        );
        const recoveredPhaseNames = durableEntries
          .filter(({ entry }) => RECOVERY_PHASES.has(entry.phase))
          .map(({ entry }) => entry.phase);
        const suspensionPreparedEntry = durableEntries.find(
          ({ entry }) => entry.phase === "suspension-prepared",
        )?.entry;
        let expectedRecoverySuspension;
        if (suspensionPreparedEntry !== undefined) {
          exactKeys(
            suspensionPreparedEntry.detail,
            [
              "requestId",
              "suspensionId",
              "gatewayInstanceId",
              "gatewayPid",
              "launchdRunCount",
              "expiresAtMs",
            ],
            "durable suspension-prepared recovery identity",
          );
          if (
            suspensionPreparedEntry.detail.requestId !== `handoff-v2:${plan.planId}` ||
            typeof suspensionPreparedEntry.detail.suspensionId !== "string" ||
            suspensionPreparedEntry.detail.suspensionId.length === 0 ||
            typeof suspensionPreparedEntry.detail.gatewayInstanceId !== "string" ||
            suspensionPreparedEntry.detail.gatewayInstanceId.length === 0 ||
            suspensionPreparedEntry.detail.gatewayPid !== plan.predecessor.pid ||
            suspensionPreparedEntry.detail.launchdRunCount !== plan.predecessor.runCount ||
            !Number.isSafeInteger(suspensionPreparedEntry.detail.expiresAtMs)
          ) {
            throw new Error("durable suspension-prepared recovery identity is invalid");
          }
          expectedRecoverySuspension = suspensionPreparedEntry.detail;
        }
        const interruptedLifecyclePhase = lastSuccessEntry?.phase;
        let performedRecovery = false;
        let serviceRecovery = null;
        let recoveryFailure = null;
        if (
          currentPhase !== "hold" &&
          lastSuccessIndex >= predecessorPreservedIndex &&
          lastSuccessIndex <= bootoutInvocationStartedIndex
        ) {
          try {
            const classification = classifyInterruptedPredecessorService(plan, runtime);
            if (classification.state === "loaded") {
              if (
                recoveredPhaseNames.length === 0 &&
                !recoveredPhaseNames.includes("pre-bootout-service-loaded-proven")
              ) {
                writePhase("pre-bootout-service-loaded-proven", {
                  predecessorPid: classification.service.pid,
                  predecessorRunCount: classification.service.runCount,
                });
                recoveredPhaseNames.push("pre-bootout-service-loaded-proven");
              }
              let recoveryHandoff = readGatewaySuspendHandoffForRecovery(
                plan,
                runtime,
                expectedRecoverySuspension,
              );
              if (recoveryHandoff === null) {
                if (expectedRecoverySuspension !== undefined) {
                  throw new Error("durable suspension-prepared recovery handoff is missing");
                }
                verifySupervisorLease(plan, runtime);
                verifyActiveGuard(plan, runtime);
                assertActivationWindow(
                  plan,
                  runtime,
                  "dead-owner suspension reacquisition",
                  plan.operations.startupWaitMs,
                );
                recoveryHandoff = prepareGatewaySuspension(plan, runtime, plan.predecessor);
              }
              verifyMutationAuthority(
                plan,
                runtime,
                "dead-owner predecessor recovery",
                recoveryHandoff,
              );
              const wasEnabled = inspectLaunchdEnabledState(plan, runtime);
              if (!wasEnabled) {
                if (!recoveredPhaseNames.includes("pre-bootout-reenable-requested")) {
                  writePhase("pre-bootout-reenable-requested", {
                    reason: `dead-owner recovery at ${interruptedLifecyclePhase}`,
                  });
                  recoveredPhaseNames.push("pre-bootout-reenable-requested");
                  counts.enableCount += 1;
                }
                verifyMutationAuthority(
                  plan,
                  runtime,
                  "dead-owner predecessor enable recovery",
                  recoveryHandoff,
                );
                const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
                const enable = runtime.run("/bin/launchctl", ["enable", target]);
                if (enable.status !== 0) {
                  throw new Error("dead-owner predecessor enable failed or was ambiguous");
                }
              }
              verifyEnabled(plan, runtime);
              const stablePredecessor = classifyInterruptedPredecessorService(plan, runtime);
              if (stablePredecessor.state !== "loaded") {
                throw new Error("predecessor disappeared during dead-owner recovery");
              }
              if (!recoveredPhaseNames.includes("pre-bootout-reenabled-same-predecessor-proven")) {
                writePhase("pre-bootout-reenabled-same-predecessor-proven", {
                  predecessorPid: stablePredecessor.service.pid,
                  predecessorRunCount: stablePredecessor.service.runCount,
                  enableMutationRequired: !wasEnabled,
                });
                recoveredPhaseNames.push("pre-bootout-reenabled-same-predecessor-proven");
              }
              if (!recoveredPhaseNames.includes("pre-bootout-suspension-resumed")) {
                if (!recoveredPhaseNames.includes("pre-bootout-suspension-resume-requested")) {
                  writePhase("pre-bootout-suspension-resume-requested");
                  recoveredPhaseNames.push("pre-bootout-suspension-resume-requested");
                }
                recoverPreBootoutGatewaySuspension(
                  plan,
                  runtime,
                  recoveryHandoff,
                  expectedRecoverySuspension,
                  (recoverySuspension) =>
                    verifyMutationAuthority(
                      plan,
                      runtime,
                      "dead-owner predecessor suspension resume recovery",
                      recoverySuspension,
                    ),
                );
                writePhase("pre-bootout-suspension-resumed");
                recoveredPhaseNames.push("pre-bootout-suspension-resumed");
              }
              performedRecovery = true;
            } else {
              if (lastSuccessIndex !== bootoutInvocationStartedIndex) {
                throw new Error(
                  "predecessor became unloaded before a durable bootout invocation boundary",
                );
              }
              const recoveryHandoff = readGatewaySuspendHandoffForRecovery(
                plan,
                runtime,
                expectedRecoverySuspension,
              );
              if (recoveryHandoff === null) {
                throw new Error(
                  "unloaded predecessor recovery lacks its retained suspension handoff",
                );
              }
              const wasEnabled = inspectLaunchdEnabledState(plan, runtime);
              if (!recoveredPhaseNames.includes("pre-bootout-service-unloaded-proven")) {
                writePhase("pre-bootout-service-unloaded-proven", {
                  predecessorPid: plan.predecessor.pid,
                  predecessorPidDead: true,
                  portFree: true,
                  replacementProcessAbsent: true,
                  replacementProcessProbe: "ps-axo-planned-gateway-commands-absent",
                  launchdEnabled: wasEnabled,
                  handoffPath: gatewaySuspendHandoffPath(plan),
                  handoffSha256: sha256(recoveryHandoff.bytes),
                  handoffExpiresAtMs: recoveryHandoff.expiresAtMs,
                });
                recoveredPhaseNames.push("pre-bootout-service-unloaded-proven");
              }
              if (!wasEnabled) {
                verifySupervisorLease(plan, runtime);
                verifyActiveGuard(plan, runtime);
                assertActivationWindow(
                  plan,
                  runtime,
                  "unloaded predecessor enable recovery",
                  plan.operations.startupWaitMs,
                );
                assertGatewaySuspendHandoffWindow(
                  plan,
                  recoveryHandoff,
                  runtime,
                  "unloaded predecessor enable recovery",
                );
                if (!recoveredPhaseNames.includes("pre-bootout-reenable-requested")) {
                  writePhase("pre-bootout-reenable-requested", {
                    reason: "bootout invocation potentially applied; enable label only",
                  });
                  recoveredPhaseNames.push("pre-bootout-reenable-requested");
                  counts.enableCount += 1;
                }
                assertGatewaySuspendHandoffWindow(
                  plan,
                  recoveryHandoff,
                  runtime,
                  "unloaded predecessor enable recovery",
                );
                verifyMutationAuthority(plan, runtime, "unloaded predecessor enable recovery");
                const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
                const enable = runtime.run("/bin/launchctl", ["enable", target]);
                if (enable.status !== 0) {
                  throw new Error("unloaded predecessor label enable failed or was ambiguous");
                }
              }
              verifyEnabled(plan, runtime);
              const stableAbsence = classifyInterruptedPredecessorService(plan, runtime);
              if (stableAbsence.state !== "unloaded") {
                throw new Error("a replacement process appeared during unloaded recovery");
              }
              if (!recoveredPhaseNames.includes("pre-bootout-label-enabled-unloaded-proven")) {
                writePhase("pre-bootout-label-enabled-unloaded-proven", {
                  predecessorPidDead: true,
                  portFree: true,
                  replacementProcessAbsent: true,
                  replacementProcessProbe: "ps-axo-planned-gateway-commands-absent",
                });
                recoveredPhaseNames.push("pre-bootout-label-enabled-unloaded-proven");
              }
              serviceRecovery = {
                manualRollbackRequired: true,
                serviceState: "unloaded",
                launchdEnabled: true,
                predecessorPidDead: true,
                portFree: true,
                replacementProcessAbsent: true,
                replacementProcessProbe: "ps-axo-planned-gateway-commands-absent",
                handoff: {
                  path: gatewaySuspendHandoffPath(plan),
                  sha256: sha256(recoveryHandoff.bytes),
                  expiresAtMs: recoveryHandoff.expiresAtMs,
                  retained: true,
                },
                operations: {
                  bootstrapCount: 0,
                  automaticRollbackCount: 0,
                  automaticSecondRestartCount: 0,
                },
              };
              performedRecovery = true;
            }
          } catch (error) {
            if (
              error instanceof PhasePersistenceError ||
              error instanceof TerminalPersistenceError
            ) {
              throw error;
            }
            performedRecovery = recoveredPhaseNames.length > 0;
            recoveryFailure = error instanceof Error ? error.message : String(error);
          }
        }
        if (currentPhase === "hold") {
          exactKeys(
            lastRecoveredEntry.detail,
            [
              "reason",
              "failedPhase",
              "startedAt",
              "completedAt",
              "atJobSafety",
              "successor",
              "proofs",
            ],
            "durable terminal HOLD snapshot",
          );
          requiredString(lastRecoveredEntry.detail.reason, "durable terminal HOLD snapshot.reason");
          requiredString(
            lastRecoveredEntry.detail.failedPhase,
            "durable terminal HOLD snapshot.failedPhase",
          );
          requiredInstant(
            lastRecoveredEntry.detail.startedAt,
            "durable terminal HOLD snapshot.startedAt",
          );
          requiredInstant(
            lastRecoveredEntry.detail.completedAt,
            "durable terminal HOLD snapshot.completedAt",
          );
          return finishHold({
            reason: lastRecoveredEntry.detail.reason,
            failedPhase: lastRecoveredEntry.detail.failedPhase,
            terminalAtJobSafety: lastRecoveredEntry.detail.atJobSafety,
            successor: lastRecoveredEntry.detail.successor,
            proofs: lastRecoveredEntry.detail.proofs,
            terminalStartedAt: lastRecoveredEntry.detail.startedAt,
            completedAt: lastRecoveredEntry.detail.completedAt,
            writeTerminalPhase: false,
          });
        }
        try {
          atJobSafety = verifyAtJobRollbackSafety(plan, "predecessor", runtime, {
            allowUnsafeEvidence: true,
          });
        } catch {
          atJobSafety = null;
        }
        const existingRecoveryIndex = durableEntries.findIndex(({ entry }) =>
          RECOVERY_PHASES.has(entry.phase),
        );
        const recoveredPhase =
          currentPhase === "interrupted-attempt-recovered"
            ? lastRecoveredEntry.detail.recoveredPhase
            : existingRecoveryIndex === -1 && !performedRecovery
              ? currentPhase
              : durableEntries
                  .slice(
                    0,
                    existingRecoveryIndex === -1 ? durableEntries.length : existingRecoveryIndex,
                  )
                  .findLast(({ entry }) => SUCCESS_PHASE_SEQUENCE.includes(entry.phase))?.entry
                  .phase;
        if (typeof recoveredPhase !== "string" || recoveredPhase.length === 0) {
          throw new Error("interrupted attempt recovery lacks its failed lifecycle phase");
        }
        if (
          existingRecoveryIndex === -1 &&
          !performedRecovery &&
          recoveryFailure === null &&
          currentPhase !== "interrupted-attempt-recovered"
        ) {
          writePhase("interrupted-attempt-recovered", {
            recoveredPhase,
          });
        }
        const reason =
          recoveryFailure !== null
            ? `interrupted prior activation attempt requires manual intervention at phase ${recoveredPhase}: ${recoveryFailure}`
            : serviceRecovery !== null
              ? `bootout invocation potentially applied at phase ${recoveredPhase}; predecessor absence proven and manual rollback required`
              : `interrupted prior activation attempt recovered at phase ${recoveredPhase}`;
        return finishHold({
          reason,
          failedPhase: recoveredPhase,
          terminalAtJobSafety: atJobSafety,
          serviceRecovery,
        });
      } finally {
        runtime.releaseRecoveryOwnership(ownershipPath, hostIdentity.executorPid);
      }
    }
    if (Date.parse(startedAt) >= Date.parse(plan.expiresAt)) {
      throw new Error("plan is expired");
    }
    runtime.assertOutputAvailable(
      `${plan.evidence.ledgerDirectory}/00-claim.json`,
      "activation ledger claim",
    );
    runtime.assertOutputAvailable(globalClaimPath, "service-global lifecycle claim");
    const existingPlistBackup = runtime.readOptionalFile(
      plan.evidence.predecessorPlistBackupPath,
      "predecessor plist backup",
    );
    if (existingPlistBackup === null) {
      runtime.assertOutputAvailable(plan.evidence.predecessorPlistBackupPath, "plist backup");
    } else if (sha256(existingPlistBackup) !== plan.predecessor.servicePlistSha256) {
      throw new Error("existing predecessor plist backup does not match the activation plan");
    } else {
      runtime.ensureFileDurable(plan.evidence.predecessorPlistBackupPath);
    }
    runtime.assertOutputAvailable(plan.evidence.receiptPath, "activation receipt");
    runtime.assertOutputAvailable(plan.evidence.rollbackPacketPath, "rollback packet");
    for (const stagedPath of [
      plan.successor.cliPath,
      plan.successor.runtimePath,
      plan.successor.gatewayEntrypointPath,
      plan.successor.wrapperPath,
      plan.successor.environmentFilePath,
      plan.successor.runtimeStampPath,
      plan.successor.buildManifestPath,
      plan.successor.stagedServicePlistPath,
    ]) {
      runtime.assertSecureDirectoryChain(
        dirname(stagedPath),
        plan.host.stagingRoot,
        "successor staging chain",
      );
    }
    verifySupervisorLease(plan, runtime);
    const predecessorBuild = verifyBuildIdentity(plan, "predecessor", runtime);
    const predecessorPlistBytes = runtime.verifyFile(
      plan.predecessor.servicePlistPath,
      plan.predecessor.servicePlistSha256,
      "predecessor service plist",
    );
    runtime.verifyFile(plan.predecessor.configPath, plan.predecessor.configSha256, "configuration");
    verifyActiveGuard(plan, runtime);
    verifyBuildIdentity(plan, "successor", runtime);
    const successorPlistBytes = runtime.verifyFile(
      plan.successor.stagedServicePlistPath,
      plan.successor.stagedServicePlistSha256,
      "staged successor service plist",
    );
    verifyPlistTransition(plan, runtime, predecessorPlistBytes, successorPlistBytes);
    verifyEnabled(plan, runtime);
    const predecessor = inspectService(plan, runtime);
    if (
      predecessor.pid !== plan.predecessor.pid ||
      predecessor.runCount !== plan.predecessor.runCount
    ) {
      throw new Error("Gateway predecessor process identity changed");
    }
    verifyProcessIdentity(plan, "predecessor", predecessor.pid, runtime);
    verifyPortOwned(plan, predecessor.pid, runtime);
    const preflightQuiescence = verifyTasksQuiescent(plan, "predecessor", runtime);
    const preflightHealth = verifyGatewayHealth(plan, "predecessor", runtime);
    const preflightChannels = verifyChannelsStatus(plan, "predecessor", runtime);
    const preflightSlack = verifySlack(plan, "predecessor", runtime);
    atJobSafety = verifyAtJobRollbackSafety(plan, "predecessor", runtime);
    if (!params.execute) {
      const preflightReceipt = makeReceipt({
        plan,
        planSha256,
        startedAt,
        completedAt: runtime.now(),
        outcome: "PREFLIGHT_PASS",
        ...counts,
        claimSha256,
        phases,
        proofs: {
          predecessorBuild,
          quiescence: preflightQuiescence,
          healthSha256: sha256(canonicalJsonBytes(preflightHealth)),
          channelsStatusSha256: sha256(canonicalJsonBytes(preflightChannels)),
          slackAccessSha256: sha256(canonicalJsonBytes(preflightSlack)),
          atJobSafety,
          portOwnerPid: predecessor.pid,
          processCommand: plan.predecessor.expectedProcessCommand,
        },
      });
      validateHostActivationReceipt(preflightReceipt);
      return preflightReceipt;
    }

    if (existingPlistBackup === null) {
      runtime.preserveFile(
        plan.predecessor.servicePlistPath,
        plan.evidence.predecessorPlistBackupPath,
      );
    }
    runtime.verifyFile(
      plan.evidence.predecessorPlistBackupPath,
      plan.predecessor.servicePlistSha256,
      "predecessor plist backup",
    );

    const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
    const claimEntry = {
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256,
      sequence: 0,
      phase: "claim",
      at: runtime.now(),
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: hostIdentity.executorPid,
        predecessorPid: predecessor.pid,
        predecessorRunCount: predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    };
    const claimBytes = canonicalJsonBytes(claimEntry);
    persistClaimExact(globalClaimPath, claimBytes, "service-global lifecycle claim");
    lifecycleClaimed = true;
    claimSha256 = sha256(claimBytes);
    phases.push({ sequence: 0, phase: "claim", sha256: claimSha256 });
    currentPhase = "claim";
    persistClaimExact(phasePath(0, "claim"), claimBytes, "activation ledger claim");
    writePhase("predecessor-plist-preserved", {
      backupSha256: plan.predecessor.servicePlistSha256,
      createdBeforeLifecycle: true,
    });

    verifyTasksQuiescent(plan, "predecessor", runtime);
    atJobSafety = verifyAtJobRollbackSafety(plan, "predecessor", runtime);
    const predecessorEnrollment = inspectService(plan, runtime);
    if (
      predecessorEnrollment.pid !== plan.predecessor.pid ||
      predecessorEnrollment.runCount !== plan.predecessor.runCount
    ) {
      throw new Error("Gateway predecessor changed before suspension preparation");
    }
    suspension = prepareGatewaySuspension(plan, runtime, predecessorEnrollment);
    writePhase("suspension-prepared", {
      requestId: suspension.requestId,
      suspensionId: suspension.suspensionId,
      gatewayInstanceId: suspension.gatewayInstanceId,
      gatewayPid: suspension.gatewayPid,
      launchdRunCount: suspension.launchdRunCount,
      expiresAtMs: suspension.expiresAtMs,
    });

    writePhase("disable-requested");
    counts.disableCount += 1;
    verifyMutationAuthority(plan, runtime, "disable mutation boundary", suspension);
    // launchctl may have applied the state transition even when its client
    // return is interrupted or non-zero, so recovery must treat it as applied.
    disabled = true;
    const disable = runtime.run("/bin/launchctl", ["disable", target]);
    if (disable.status !== 0) {
      throw new Error("sole launchctl disable failed or was ambiguous");
    }
    const disabledState = runtime.run("/bin/launchctl", [
      "print-disabled",
      plan.host.launchdDomain,
    ]);
    if (
      disabledState.status !== 0 ||
      parseLaunchdEnabledState(disabledState.stdout, plan.host.launchdLabel)
    ) {
      throw new Error("Gateway LaunchAgent disable state was not proven");
    }
    writePhase("disabled-proven");
    verifySupervisorLease(plan, runtime);

    writePhase("bootout-requested");
    counts.bootoutCount += 1;
    atJobSafety = verifyAtJobRollbackSafety(plan, "predecessor", runtime);
    verifyMutationAuthority(plan, runtime, "bootout mutation boundary", suspension);
    writePhase("bootout-invocation-started");
    bootoutAttempted = true;
    const bootout = runtime.run("/bin/launchctl", ["bootout", target]);
    if (bootout.status !== 0) {
      throw new Error("sole launchctl bootout failed or was ambiguous");
    }
    verifyUnloaded(plan, runtime);
    verifyPidDead(plan.predecessor.pid, runtime);
    verifyPortFree(plan, runtime);
    writePhase("predecessor-stopped-proven");

    verifySupervisorLease(plan, runtime);
    verifyActiveGuard(plan, runtime);
    verifyBuildIdentity(plan, "successor", runtime);
    runtime.verifyFile(plan.predecessor.configPath, plan.predecessor.configSha256, "configuration");
    const predecessorPlistBeforeInstall = runtime.verifyFile(
      plan.predecessor.servicePlistPath,
      plan.predecessor.servicePlistSha256,
      "predecessor service plist immediately before replacement",
    );
    runtime.assertSecureDirectoryChain(
      dirname(plan.successor.installedServicePlistPath),
      plan.host.homePath,
      "installed plist parent chain",
    );
    const stagedPlistBytes = runtime.verifyFile(
      plan.successor.stagedServicePlistPath,
      plan.successor.stagedServicePlistSha256,
      "staged successor service plist immediately before installation",
    );
    verifyPlistTransition(plan, runtime, predecessorPlistBeforeInstall, stagedPlistBytes);
    verifyMutationAuthority(plan, runtime, "plist installation mutation boundary");
    runtime.installFile(stagedPlistBytes, plan.successor.installedServicePlistPath);
    runtime.verifyFile(
      plan.successor.installedServicePlistPath,
      plan.successor.installedServicePlistSha256,
      "installed successor service plist",
    );
    writePhase("successor-plist-installed", {
      installedSha256: plan.successor.installedServicePlistSha256,
    });

    writePhase("enable-requested");
    counts.enableCount += 1;
    verifyMutationAuthority(plan, runtime, "enable mutation boundary");
    const enable = runtime.run("/bin/launchctl", ["enable", target]);
    if (enable.status !== 0) {
      throw new Error("sole launchctl enable failed or was ambiguous");
    }
    disabled = false;
    verifyEnabled(plan, runtime);
    writePhase("enabled-proven");

    writePhase("bootstrap-requested");
    counts.bootstrapCount += 1;
    counts.restartCount += 1;
    verifyMutationAuthority(plan, runtime, "bootstrap mutation boundary");
    assertGatewaySuspendHandoffWindow(plan, suspension, runtime, "bootstrap mutation boundary");
    const bootstrap = runtime.run("/bin/launchctl", [
      "bootstrap",
      plan.host.launchdDomain,
      plan.successor.installedServicePlistPath,
    ]);
    if (bootstrap.status !== 0) {
      throw new Error("sole launchctl bootstrap failed or was ambiguous");
    }
    writePhase("bootstrap-returned");

    const successorEnrollment = waitForSuccessor(plan, runtime);
    if (successorEnrollment.pid === plan.predecessor.pid || successorEnrollment.runCount !== 1) {
      throw new Error("Gateway successor first process incarnation was not proven");
    }
    successorSuspension = prepareGatewaySuspension(
      plan,
      runtime,
      successorEnrollment,
      suspension.suspensionId,
      "successor",
    );
    writePhase("successor-suspension-prepared", {
      requestId: successorSuspension.requestId,
      suspensionId: successorSuspension.suspensionId,
      gatewayInstanceId: successorSuspension.gatewayInstanceId,
      gatewayPid: successorSuspension.gatewayPid,
      launchdRunCount: successorSuspension.launchdRunCount,
      expiresAtMs: successorSuspension.expiresAtMs,
    });

    const firstPostflight = verifySuccessorPostflight(plan, runtime);
    atJobSafety = verifyAtJobRollbackSafety(plan, "successor", runtime);
    writePhase("postflight-initial-proven", {
      successorPid: firstPostflight.successor.pid,
      successorRunCount: firstPostflight.successor.runCount,
    });
    observedSuccessor = {
      pid: firstPostflight.successor.pid,
      runCount: firstPostflight.successor.runCount,
      commit: plan.successor.commit,
      tree: plan.successor.tree,
      cliSha256: plan.successor.cliSha256,
      runtimeSha256: plan.successor.runtimeSha256,
      gatewayEntrypointSha256: plan.successor.gatewayEntrypointSha256,
      wrapperSha256: plan.successor.wrapperSha256,
      environmentFileSha256: plan.successor.environmentFileSha256,
      runtimeStampSha256: plan.successor.runtimeStampSha256,
      buildManifestSha256: plan.successor.buildManifestSha256,
      servicePlistSha256: plan.successor.installedServicePlistSha256,
      configSha256: plan.predecessor.configSha256,
      processCommand: plan.successor.expectedProcessCommand,
    };
    observedSuccessorProofs = {
      ...firstPostflight.proofs,
      atJobSafety,
      observedAt: runtime.now(),
    };
    let stablePostflight = firstPostflight;
    for (
      let elapsedMs = plan.operations.probeIntervalMs;
      elapsedMs <= plan.operations.stabilityWindowMs;
      elapsedMs += plan.operations.probeIntervalMs
    ) {
      renewGatewaySuspension(plan, successorSuspension, runtime, "successor");
      runtime.sleep(plan.operations.probeIntervalMs);
      const observedPostflight = verifySuccessorPostflight(plan, runtime);
      atJobSafety = verifyAtJobRollbackSafety(plan, "successor", runtime);
      assertActivationWindow(plan, runtime, "continuous stability gate");
      if (
        observedPostflight.successor.pid !== firstPostflight.successor.pid ||
        observedPostflight.successor.runCount !== firstPostflight.successor.runCount
      ) {
        throw new Error("successor changed during the mandatory stability window");
      }
      stablePostflight = observedPostflight;
    }
    writePhase("stability-window-proven", {
      durationMs: plan.operations.stabilityWindowMs,
      successorPid: stablePostflight.successor.pid,
      successorRunCount: stablePostflight.successor.runCount,
    });
    writePhase("successor-suspension-resume-requested", {
      suspensionId: successorSuspension.suspensionId,
      gatewayInstanceId: successorSuspension.gatewayInstanceId,
    });
    verifyMutationAuthority(
      plan,
      runtime,
      "successor suspension resume boundary",
      successorSuspension,
      "successor",
    );
    resumeGatewaySuspension(plan, successorSuspension, runtime, "successor");
    writePhase("successor-suspension-resumed");
    return finish("ACTIVATED_VERIFIED", {
      successor: {
        pid: stablePostflight.successor.pid,
        runCount: stablePostflight.successor.runCount,
        commit: plan.successor.commit,
        tree: plan.successor.tree,
        cliSha256: plan.successor.cliSha256,
        runtimeSha256: plan.successor.runtimeSha256,
        gatewayEntrypointSha256: plan.successor.gatewayEntrypointSha256,
        wrapperSha256: plan.successor.wrapperSha256,
        environmentFileSha256: plan.successor.environmentFileSha256,
        runtimeStampSha256: plan.successor.runtimeStampSha256,
        buildManifestSha256: plan.successor.buildManifestSha256,
        servicePlistSha256: plan.successor.installedServicePlistSha256,
        configSha256: plan.predecessor.configSha256,
        processCommand: plan.successor.expectedProcessCommand,
      },
      proofs: {
        ...stablePostflight.proofs,
        atJobSafety,
        stabilityWindowMs: plan.operations.stabilityWindowMs,
      },
    });
  } catch (error) {
    if (error instanceof TerminalPersistenceError || error instanceof PhasePersistenceError) {
      throw error;
    }
    let reason = error instanceof Error ? error.message : String(error);
    if (recoveringExistingClaim) {
      throw error;
    }
    if (!lifecycleClaimed) {
      throw error;
    }
    const failedPhase = currentPhase;
    let preBootoutEnableRecoverySafe = !disabled;
    if (disabled && !bootoutAttempted) {
      const target = `${plan.host.launchdDomain}/${plan.host.launchdLabel}`;
      writePhase("pre-bootout-reenable-requested", { reason });
      counts.enableCount += 1;
      try {
        if (suspension === null) {
          throw new Error("pre-bootout recovery lacks its gateway suspension authority", {
            cause: error,
          });
        }
        verifyMutationAuthority(plan, runtime, "pre-bootout enable recovery", suspension);
        const enable = runtime.run("/bin/launchctl", ["enable", target]);
        if (enable.status !== 0) {
          throw new Error("pre-bootout recovery enable failed or was ambiguous", { cause: error });
        }
        disabled = false;
        verifyEnabled(plan, runtime);
        const samePredecessor = inspectService(plan, runtime);
        if (
          samePredecessor.pid !== plan.predecessor.pid ||
          samePredecessor.runCount !== plan.predecessor.runCount
        ) {
          throw new Error("pre-bootout recovery did not preserve the predecessor process", {
            cause: error,
          });
        }
        verifyProcessIdentity(plan, "predecessor", samePredecessor.pid, runtime);
        verifyPortOwned(plan, samePredecessor.pid, runtime);
        writePhase("pre-bootout-reenabled-same-predecessor-proven");
        preBootoutEnableRecoverySafe = true;
      } catch (recoveryError) {
        if (
          recoveryError instanceof TerminalPersistenceError ||
          recoveryError instanceof PhasePersistenceError
        ) {
          throw recoveryError;
        }
        reason = `${reason}; recovery failed: ${
          recoveryError instanceof Error ? recoveryError.message : String(recoveryError)
        }`;
      }
    }
    if (!bootoutAttempted && suspension !== null && preBootoutEnableRecoverySafe) {
      writePhase("pre-bootout-suspension-resume-requested", {
        suspensionId: suspension.suspensionId,
      });
      try {
        verifyMutationAuthority(
          plan,
          runtime,
          "pre-bootout suspension resume recovery",
          suspension,
        );
        resumeGatewaySuspension(plan, suspension, runtime);
        writePhase("pre-bootout-suspension-resumed");
        suspension = null;
      } catch (recoveryError) {
        if (
          recoveryError instanceof TerminalPersistenceError ||
          recoveryError instanceof PhasePersistenceError
        ) {
          throw recoveryError;
        }
        reason = `${reason}; suspension recovery failed: ${
          recoveryError instanceof Error ? recoveryError.message : String(recoveryError)
        }`;
      }
    }
    try {
      atJobSafety = verifyAtJobRollbackSafety(plan, "successor", runtime, {
        allowUnsafeEvidence: true,
      });
    } catch (inspectionError) {
      atJobSafety = null;
      reason = `${reason}; durable at-job evidence unavailable: ${
        inspectionError instanceof Error ? inspectionError.message : String(inspectionError)
      }`;
    }
    return finishHold({
      reason,
      failedPhase,
      terminalAtJobSafety: atJobSafety,
      successor: observedSuccessor,
      proofs: observedSuccessorProofs,
    });
  }
}

export function loadPlanBytes(path) {
  return readSecureFile(path, "activation plan");
}
