import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Compile } from "typebox/compile";
import { Format } from "typebox/format";
import { describe, expect, it, vi } from "vitest";
import {
  canonicalJsonBytes,
  createDefaultHostActivationRuntime,
  executeHostActivation,
  hostActivationExitCode,
  HOST_ACTIVATION_RECEIPT_SCHEMA,
  parseLaunchdEnabledState,
  parseLaunchdServiceState,
  proveGatewaySuspendHandoff,
  validateHostActivationPlan,
  validateHostActivationReceipt,
  validateHostRollbackEvidence,
  verifyPidDead,
  type HostActivationRuntime,
} from "../../scripts/lib/handoff-v2-host-activation.mjs";
import {
  adoptGatewaySuspendHandoffAtStartup,
  getGatewaySuspendStatus,
  prepareGatewaySuspend,
  resetGatewaySuspendCoordinatorForLifecycleRestart,
  resumeGatewaySuspend,
} from "../../src/infra/gateway-suspend-coordinator.js";
import {
  beginDurableHandoffRelease,
  readDurableHandoff,
} from "../../src/infra/gateway-suspend-handoff.js";
import {
  isGatewayWorkAdmissionClosed,
  resetGatewayWorkAdmission,
  tryBeginGatewayRootWorkAdmission,
} from "../../src/process/gateway-work-admission.js";

const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const sha = (character: string) => character.repeat(64);
const GATEWAY_SUSPEND_MODE_LEGACY = "legacy-auto-expire/v1";

type MutableReceiptPhase = Record<string, unknown> & {
  phase: string;
  sequence: number;
  sha256: string;
};

type MutableHostActivationReceipt = Record<string, unknown> & {
  completedAt: string;
  startedAt: string;
  outcome: string;
  holdReason?: string;
  rollbackPacketSha256?: string;
  gatewaySuspension: Record<string, string>;
  operations: Record<string, number>;
  predecessor: Record<string, string>;
  proofs: Record<string, unknown> & {
    healthSha256: string;
    observedAt: string;
    predecessorBuild: Record<string, string>;
    stabilityWindowMs?: number;
  };
  ledger: Record<string, unknown> & {
    phases: MutableReceiptPhase[];
    recoveryPhases: MutableReceiptPhase[];
    terminalPhase: Record<string, unknown> & {
      phase: string;
      sequence?: number;
      sha256: string;
    };
  };
};

function mutableReceipt(value: unknown): MutableHostActivationReceipt {
  return value as MutableHostActivationReceipt;
}

function recoveryPhaseNames(value: unknown): string[] {
  return mutableReceipt(value).ledger.recoveryPhases.map((phase) => phase.phase);
}

function requiredArrayEntry<T>(values: readonly T[], index: number): T {
  const value = values[index];
  if (value === undefined) {
    throw new Error(`expected array entry ${index}`);
  }
  return value;
}

type RecoveryOwnershipTestHook = (
  stage: "after-owner-death-proof" | "before-release-delete",
  path: string,
) => void;

function setRecoveryOwnershipTestHook(hook?: RecoveryOwnershipTestHook): void {
  const api = (globalThis as Record<PropertyKey, unknown>)[
    Symbol.for("openclaw.hostActivationRecoveryOwnershipTestApi")
  ] as { setHook(value?: RecoveryOwnershipTestHook): void };
  api.setHook(hook);
}

function compileContractSchema(fileName: string) {
  type ContractValidator = ((value: unknown) => boolean) & { errors?: unknown };
  const withContractFormats = <T>(callback: () => T): T => {
    const previousFormats = Format.Entries();
    Format.Set("date-time", Format.IsDateTime);
    try {
      return callback();
    } finally {
      Format.Clear();
      for (const [format, check] of previousFormats) {
        Format.Set(format, check);
      }
    }
  };
  const schema = JSON.parse(
    readFileSync(path.resolve(process.cwd(), "scripts/contracts", fileName), "utf8"),
  );
  const compiled = withContractFormats(() => Compile(schema));
  const validate: ContractValidator = (value) =>
    withContractFormats(() => {
      const errors = [...compiled.Errors(value)];
      validate.errors = errors.length === 0 ? undefined : errors;
      return errors.length === 0;
    });
  return validate;
}

function fixturePlan() {
  const homePath = "/Users/test";
  const stateDir = `${homePath}/.openclaw`;
  const evidenceRoot = `${stateDir}/host-activation-evidence`;
  const successorCommit = "c3c7e9d999b4b167ec87adad39032f658df60ada";
  const stagingRoot = `${stateDir}/host-runtimes/${successorCommit}`;
  return {
    schema: "handoff-v2-host-activation-plan/v1",
    planId: "rc13-host-activation-001",
    createdAt: "2026-07-28T08:00:00.000Z",
    expiresAt: "2026-07-28T10:00:00.000Z",
    authority: { kind: "none", grants: [], reusable: false },
    host: {
      platform: "darwin",
      uid: 501,
      homePath,
      stateDir,
      stagingRoot,
      evidenceRoot,
      launchdDomain: "gui/501",
      launchdLabel: "ai.openclaw.gateway",
      gatewayPort: 18789,
    },
    predecessor: {
      commit: "1".repeat(40),
      tree: "2".repeat(40),
      pid: 4100,
      runCount: 17,
      cliPath: "/opt/openclaw-rc2/openclaw.mjs",
      cliSha256: sha("1"),
      runtimePath: "/opt/openclaw-rc2/node",
      runtimeSha256: sha("2"),
      gatewayEntrypointPath: "/opt/openclaw-rc2/dist/gateway.js",
      gatewayEntrypointSha256: sha("3"),
      wrapperPath: "/opt/openclaw-rc2/bin/openclaw",
      wrapperSha256: sha("4"),
      environmentFilePath: "/opt/openclaw-rc2/runtime.env",
      environmentFileSha256: sha("5"),
      runtimeStampPath: "/opt/openclaw-rc2/runtime-stamp.json",
      runtimeStampSha256: sha("6"),
      buildManifestPath: "/opt/openclaw-rc2/build-manifest.json",
      buildManifestSha256: sha("7"),
      expectedProcessCommand: "/opt/openclaw-rc2/node /opt/openclaw-rc2/dist/gateway.js gateway",
      servicePlistPath: `${homePath}/Library/LaunchAgents/ai.openclaw.gateway.plist`,
      servicePlistSha256: sha("8"),
      configPath: `${stateDir}/openclaw.json`,
      configSha256: sha("9"),
    },
    successor: {
      commit: successorCommit,
      tree: "c4f76e21e4d5753daad3c348297690968e92d520",
      cliPath: `${stagingRoot}/openclaw.mjs`,
      cliSha256: sha("a"),
      runtimePath: `${stagingRoot}/node`,
      runtimeSha256: sha("b"),
      gatewayEntrypointPath: `${stagingRoot}/dist/gateway.js`,
      gatewayEntrypointSha256: sha("c"),
      wrapperPath: `${stagingRoot}/bin/openclaw`,
      wrapperSha256: sha("d"),
      environmentFilePath: `${stagingRoot}/runtime.env`,
      environmentFileSha256: sha("e"),
      runtimeStampPath: `${stagingRoot}/runtime-stamp.json`,
      runtimeStampSha256: sha("f"),
      buildManifestPath: `${stagingRoot}/build-manifest.json`,
      buildManifestSha256: sha("0"),
      expectedProcessCommand: `${stagingRoot}/node ${stagingRoot}/dist/gateway.js gateway`,
      stagedServicePlistPath: `${stagingRoot}/ai.openclaw.gateway.plist`,
      stagedServicePlistSha256: sha("a"),
      installedServicePlistPath: `${homePath}/Library/LaunchAgents/ai.openclaw.gateway.plist`,
      installedServicePlistSha256: sha("a"),
    },
    guard: {
      path: `${stateDir}/handoff-v2-guard.json`,
      sha256: sha("b"),
      rolloutLockPath: `${stateDir}/model-router-rollout.lock`,
      rolloutLockSha256: sha("c"),
      runId: "model-router-campaign-001",
      planSha256: sha("d"),
      startsAt: "2026-07-28T07:00:00.000Z",
      expiresAt: "2026-07-28T10:00:00.000Z",
    },
    quiescence: {
      activeTasks: 0,
      activeRuns: 0,
      competingLifecycleAutomation: false,
    },
    slack: {
      accountId: "oscar",
      credentialKind: "bot",
      expectedUserId: "U0B4KHG0MKR",
      expectedBotId: "B0B4KHG0MKR",
      expectedTeamId: "T0B4KHG0MKR",
      channelId: "D0B4KHG0MKR",
      expectedApiUrl: "https://slack.com/api/",
      totalTimeoutMs: 20_000,
    },
    operations: {
      restartLimit: 1,
      disableLimit: 1,
      enableLimit: 1,
      bootoutLimit: 1,
      bootstrapLimit: 1,
      startupWaitMs: 30_000,
      probeIntervalMs: 1_000,
      stabilityWindowMs: 60_000,
      automaticRollback: false,
      automaticSecondRestart: false,
    },
    gatewaySuspension: {
      schema: "handoff-v2-gateway-suspension-binding/v1",
      suspendMode: "handoff-durable-hold/v1",
      handoffSchema: "openclaw-gateway-suspend-handoff/v3",
    },
    evidence: {
      supervisorLeasePath: `${evidenceRoot}/supervisor-lease.json`,
      supervisorLeaseSha256: sha("e"),
      ledgerDirectory: `${evidenceRoot}/ledger`,
      predecessorPlistBackupPath: `${evidenceRoot}/predecessor.plist`,
      receiptPath: `${evidenceRoot}/activation-receipt.json`,
      rollbackPacketPath: `${evidenceRoot}/rollback-packet.json`,
    },
  };
}

function fixtureGate7Plan() {
  const plan = fixturePlan();
  return {
    ...plan,
    schema: "handoff-v2-host-activation-plan/v2",
    authority: {
      kind: "gate7_rc17_host_activation",
      receiptRelativePath: "rollout/rc17-generation.json",
      receiptId: "rc17-initial-shadow-admission",
      receiptHash: `sha256:${"a".repeat(64)}`,
      verifierFileSha256: `sha256:${"f".repeat(64)}`,
      generation: 17,
      sourceCommit: "d".repeat(40),
      sourceTree: "e".repeat(40),
      hostCommit: plan.successor.commit,
      hostTree: plan.successor.tree,
      authorityUseHash: `sha256:${"b".repeat(64)}`,
      hostFenceHash: `sha256:${"c".repeat(64)}`,
      issuedAt: "2026-07-28T08:00:00.000Z",
      expiresAt: "2026-07-28T09:30:00.000Z",
      reusable: false,
    },
  };
}

function realisticMacHostPlan() {
  const plan = fixturePlan();
  const generation = plan.successor.commit;
  const predecessorRoot = `${plan.host.stateDir}/host-runtimes/${plan.predecessor.commit}`;
  const successorRoot = `${plan.host.stateDir}/host-runtimes/${generation}`;
  const predecessorRuntime = "/opt/homebrew/opt/node@24/bin/node";
  const successorRuntime = `${successorRoot}/toolchain/bin/node`;
  const wrapper = `${plan.host.stateDir}/service-env/ai.openclaw.gateway-env-wrapper.sh`;
  const environmentFile = `${plan.host.stateDir}/service-env/ai.openclaw.gateway.env`;

  plan.host.stagingRoot = plan.host.stateDir;
  plan.predecessor.cliPath = `${predecessorRoot}/openclaw.mjs`;
  plan.predecessor.runtimePath = predecessorRuntime;
  plan.predecessor.gatewayEntrypointPath = `${predecessorRoot}/dist/index.js`;
  plan.predecessor.wrapperPath = wrapper;
  plan.predecessor.environmentFilePath = environmentFile;
  plan.predecessor.runtimeStampPath = `${predecessorRoot}/dist/.runtime-postbuildstamp`;
  plan.predecessor.buildManifestPath = `${plan.host.evidenceRoot}/predecessor-build-manifest.json`;
  plan.predecessor.expectedProcessCommand = `${predecessorRuntime} ${predecessorRoot}/dist/index.js gateway --port 18789`;

  plan.successor.cliPath = `${successorRoot}/openclaw.mjs`;
  plan.successor.runtimePath = successorRuntime;
  plan.successor.gatewayEntrypointPath = `${successorRoot}/dist/index.js`;
  plan.successor.wrapperPath = wrapper;
  plan.successor.wrapperSha256 = plan.predecessor.wrapperSha256;
  plan.successor.environmentFilePath = environmentFile;
  plan.successor.environmentFileSha256 = plan.predecessor.environmentFileSha256;
  plan.successor.runtimeStampPath = `${successorRoot}/dist/.runtime-postbuildstamp`;
  plan.successor.buildManifestPath = `${successorRoot}/dist/openclaw-host-build-manifest.json`;
  plan.successor.expectedProcessCommand = `${successorRuntime} ${successorRoot}/dist/index.js gateway --port 18789`;
  plan.successor.stagedServicePlistPath = `${successorRoot}/ai.openclaw.gateway.plist`;

  return plan;
}

function launchdState(pid: number, runs: number) {
  return `label = ai.openclaw.gateway\npid = ${pid}\nruns = ${runs}\n`;
}

function slackProof(plan: ReturnType<typeof fixturePlan>) {
  return {
    contractVersion: "openclaw-slack-access-proof/v1",
    ok: true,
    requested: { accountId: "oscar", channelId: plan.slack.channelId },
    auth: {
      userId: plan.slack.expectedUserId,
      botId: plan.slack.expectedBotId,
      teamId: plan.slack.expectedTeamId,
    },
    access: {
      performedWrites: false,
      channelInfoVerified: true,
      historyVerified: true,
      sameCredentialForIdentityAndAccess: true,
    },
  };
}

function requestSuspendMode(args: string[]): unknown {
  const paramsIndex = args.indexOf("--params");
  return paramsIndex === -1 ? undefined : JSON.parse(args[paramsIndex + 1]!).suspendMode;
}

type RuntimeOptions = {
  failCommand?: (command: string, args: string[]) => string | undefined;
  activeTasks?: Array<Record<string, unknown>>;
  unsafeAtJob?: boolean;
  unsafeAtJobAfterClaim?: boolean;
  successorPid?: number;
  successorRunCount?: number;
  driftStablePid?: boolean;
  channelStatus?: Record<string, unknown>;
  slack?: Record<string, unknown>;
  unavailableOutput?: string;
  insecureDirectory?: string;
  insecureDirectoryChain?: string;
  sameRuntimeFileAlias?: boolean;
  ambiguousPidAbsence?: boolean;
  ambiguousPortAbsence?: boolean;
  ambiguousServiceAbsence?: boolean;
  existingGlobalClaim?: Buffer;
  existingPlistBackup?: Buffer;
  claimOwnerAlive?: boolean;
  environmentOverrides?: Record<string, string>;
  suspensionBusy?: boolean;
  failWritePhase?: string;
  failWritePath?: string;
  ambiguousWritePath?: string;
  failReadAfterWritePath?: string;
  mutateDuringEnsureFileDurablePath?: string;
  failEnsureFileDurable?: boolean;
  failEnsureFileDurablePath?: string;
  initialNowMs?: number;
  plistLabelOverride?: string;
  successorPlistEntrypointOverride?: string;
  successorSuspensionId?: string;
  predecessorGatewayInstanceId?: string;
  successorGatewayInstanceId?: string;
  resumeReturnsFalse?: boolean;
  initialEnabled?: boolean;
  initialLoaded?: boolean;
  initialGeneration?: "predecessor" | "successor";
  suspensionStatusRunning?: boolean;
  executorPid?: number;
  recoveryOwnership?: { executorPid: number | null };
  onRecoveryOwnershipAcquired?: () => void;
  replacementProcessCommand?: string;
  advanceAfterWritePhase?: { phase: string; milliseconds: number };
  advanceAfterSuspensionStatusMs?: number;
  advanceBeforeGatewayResumeMs?: number;
  advanceAfterEnsureFileDurable?: {
    path: string;
    occurrence: number;
    milliseconds: number;
  };
  existingFiles?: Map<string, Buffer>;
  existingLedger?: Array<{
    entry: {
      schema: string;
      planId: string;
      planSha256: string;
      sequence: number;
      phase: string;
      at: string;
      detail: Record<string, unknown>;
    };
    sha256: string;
  }>;
};

function buildManifest(
  plan: ReturnType<typeof fixturePlan>,
  generation: "predecessor" | "successor",
) {
  const candidate = plan[generation];
  return {
    schema: "openclaw-host-build-manifest/v1",
    commit: generation === "successor" ? plan.successor.commit : "1".repeat(40),
    tree: generation === "successor" ? plan.successor.tree : "2".repeat(40),
    cliSha256: candidate.cliSha256,
    runtimeSha256: candidate.runtimeSha256,
    gatewayEntrypointSha256: candidate.gatewayEntrypointSha256,
    wrapperSha256: candidate.wrapperSha256,
    environmentFileSha256: candidate.environmentFileSha256,
    runtimeStampSha256: candidate.runtimeStampSha256,
  };
}

function createRuntime(plan = fixturePlan(), options: RuntimeOptions = {}) {
  const commands: Array<{
    command: string;
    args: string[];
    options?: { timeoutMs?: number; env?: NodeJS.ProcessEnv; input?: Buffer };
  }> = [];
  const writes = new Map<string, Buffer>();
  const removedFiles = new Set<string>();
  let enabled = options.initialEnabled ?? true;
  let loaded = options.initialLoaded ?? true;
  let generation: "predecessor" | "successor" = options.initialGeneration ?? "predecessor";
  let successorServiceReads = 0;
  let matchingEnsureFileDurableCalls = 0;
  const successorPid = options.successorPid ?? 5100;
  const successorRunCount = options.successorRunCount ?? 1;
  const predecessorGatewayInstanceId =
    options.predecessorGatewayInstanceId ?? "fixture-predecessor-gateway-instance";
  const successorGatewayInstanceId =
    options.successorGatewayInstanceId ?? "fixture-successor-gateway-instance";
  let nowMs = options.initialNowMs ?? Date.parse("2026-07-28T08:30:00.000Z");

  const runtime: HostActivationRuntime = {
    now: vi.fn(() => new Date(nowMs).toISOString()),
    sleep: vi.fn((durationMs: number) => {
      nowMs += durationMs;
    }),
    getHostIdentity: vi.fn(() => ({
      uid: plan.host.uid,
      homePath: plan.host.homePath,
      executorPid: options.executorPid ?? 9_001,
    })),
    verifyGate7Admission: vi.fn(() => ({ admission: plan.authority })),
    assertClaimOwnerDead: vi.fn(() => {
      if (options.claimOwnerAlive) {
        throw new Error("claim owner remains alive");
      }
    }),
    acquireRecoveryOwnership: vi.fn((_path: string, executorPid: number) => {
      if (options.recoveryOwnership?.executorPid != null) {
        throw new Error("recovery ownership is already held");
      }
      if (options.recoveryOwnership) {
        options.recoveryOwnership.executorPid = executorPid;
      }
      options.onRecoveryOwnershipAcquired?.();
    }),
    releaseRecoveryOwnership: vi.fn((_path: string, executorPid: number) => {
      if (options.recoveryOwnership && options.recoveryOwnership.executorPid !== executorPid) {
        throw new Error("recovery ownership changed before release");
      }
      if (options.recoveryOwnership) {
        options.recoveryOwnership.executorPid = null;
      }
    }),
    assertSecureDirectory: vi.fn((filePath) => {
      if (filePath === options.insecureDirectory) {
        throw new Error("insecure directory");
      }
    }),
    assertSecureDirectoryChain: vi.fn((filePath) => {
      if (filePath === options.insecureDirectoryChain) {
        throw new Error("unsafe directory chain");
      }
    }),
    assertDistinctFiles: vi.fn(() => {
      if (options.sameRuntimeFileAlias) {
        throw new Error("predecessor and successor Node runtimes must be distinct physical files");
      }
    }),
    assertOutputAvailable: vi.fn((filePath) => {
      if (filePath === options.unavailableOutput || writes.has(filePath)) {
        throw new Error("evidence already exists");
      }
    }),
    inspectDurableAtJobs: vi.fn(() =>
      options.unsafeAtJob || (options.unsafeAtJobAfterClaim && writes.size > 0)
        ? [{ jobId: "unsafe", startupInterruptedRunAtMs: 1_785_230_000_000 }]
        : [{ jobId: "safe", startupInterruptedRunAtMs: null }],
    ),
    readOptionalFile: vi.fn((_filePath, description) => {
      if (removedFiles.has(_filePath)) {
        return null;
      }
      const written = writes.get(_filePath);
      if (written) {
        if (_filePath === options.failReadAfterWritePath) {
          throw new Error(`injected read failure for ${_filePath}`);
        }
        return Buffer.from(written);
      }
      const existingFile = options.existingFiles?.get(_filePath);
      if (existingFile) {
        return existingFile;
      }
      if (description === "service-global lifecycle claim") {
        return options.existingGlobalClaim ?? null;
      }
      if (description === "predecessor plist backup") {
        return options.existingPlistBackup ?? null;
      }
      const ledgerEntry = options.existingLedger?.find(
        ({ entry }) =>
          _filePath ===
          `${plan.evidence.ledgerDirectory}/${String(entry.sequence).padStart(2, "0")}-${
            entry.phase
          }.json`,
      );
      if (ledgerEntry) {
        return canonicalJsonBytes(ledgerEntry.entry);
      }
      return null;
    }),
    listLedgerPhases: vi.fn(() => options.existingLedger ?? []),
    ensureFileDurable: vi.fn((filePath: string) => {
      if (options.failEnsureFileDurable || filePath === options.failEnsureFileDurablePath) {
        throw new Error("injected backup durability failure");
      }
      if (filePath === options.mutateDuringEnsureFileDurablePath) {
        writes.set(filePath, Buffer.from("changed during durability sync"));
      }
      if (filePath === options.advanceAfterEnsureFileDurable?.path) {
        matchingEnsureFileDurableCalls += 1;
        if (matchingEnsureFileDurableCalls === options.advanceAfterEnsureFileDurable.occurrence) {
          nowMs += options.advanceAfterEnsureFileDurable.milliseconds;
        }
      }
    }),
    replaceFileDurably: vi.fn((bytes: Buffer, destination: string) => {
      removedFiles.delete(destination);
      writes.set(destination, Buffer.from(bytes));
    }),
    removeFileDurably: vi.fn((filePath: string) => {
      writes.delete(filePath);
      removedFiles.add(filePath);
    }),
    verifyFile: vi.fn((filePath: string) => {
      if (filePath === plan.evidence.supervisorLeasePath) {
        return Buffer.from(
          JSON.stringify({
            schema: "handoff-v2-host-supervisor-lease/v1",
            planId: plan.planId,
            owner: "openclaw-safe-gateway-restart",
            exclusive: true,
            createdAt: plan.createdAt,
            expiresAt: plan.expiresAt,
          }),
        );
      }
      if (filePath === plan.predecessor.buildManifestPath) {
        return Buffer.from(JSON.stringify(buildManifest(plan, "predecessor")));
      }
      if (filePath === plan.successor.buildManifestPath) {
        return Buffer.from(JSON.stringify(buildManifest(plan, "successor")));
      }
      if (filePath === plan.guard.path) {
        return Buffer.from(
          JSON.stringify({
            schemaVersion: "model-router-evidence-cron-mutation-guard/v1",
            status: "active",
            allowScheduledExecution: true,
            blockedActions: ["add", "remove", "update"],
            runId: plan.guard.runId,
            planSha256: `sha256:${plan.guard.planSha256}`,
            startsAt: plan.guard.startsAt,
            expiresAt: plan.guard.expiresAt,
          }),
        );
      }
      if (filePath === plan.guard.rolloutLockPath) {
        return Buffer.from(
          JSON.stringify({
            outputDir: plan.host.evidenceRoot,
            planSha256: `sha256:${plan.guard.planSha256}`,
            runId: plan.guard.runId,
          }),
        );
      }
      if (
        filePath === plan.predecessor.environmentFilePath ||
        filePath === plan.successor.environmentFilePath
      ) {
        const values = {
          HOME: plan.host.homePath,
          OPENCLAW_CONFIG_PATH: plan.predecessor.configPath,
          OPENCLAW_GATEWAY_PORT: String(plan.host.gatewayPort),
          OPENCLAW_STATE_DIR: plan.host.stateDir,
          ...options.environmentOverrides,
        };
        return Buffer.from(
          [
            "# Generated by OpenClaw. Do not edit while the gateway service is installed.",
            ...Object.entries(values)
              .toSorted(([left], [right]) => left.localeCompare(right))
              .map(([name, value]) => `export ${name}='${value}'`),
            "",
          ].join("\n"),
        );
      }
      if (filePath === plan.predecessor.servicePlistPath) {
        return Buffer.from("predecessor-plist");
      }
      if (
        filePath === plan.successor.stagedServicePlistPath ||
        filePath === plan.successor.installedServicePlistPath
      ) {
        return Buffer.from("successor-plist");
      }
      return Buffer.from("verified");
    }),
    installFile: vi.fn(),
    preserveFile: vi.fn(),
    writeExclusive: vi.fn((filePath: string, bytes: Buffer) => {
      if (filePath === options.failWritePath) {
        throw new Error(`injected write failure for ${filePath}`);
      }
      if (options.failWritePhase && filePath.endsWith(`-${options.failWritePhase}.json`)) {
        throw new Error(`injected ${options.failWritePhase} write failure`);
      }
      if (writes.has(filePath)) {
        throw new Error("evidence already exists");
      }
      removedFiles.delete(filePath);
      writes.set(filePath, Buffer.from(bytes));
      if (
        options.advanceAfterWritePhase &&
        filePath.endsWith(`-${options.advanceAfterWritePhase.phase}.json`)
      ) {
        nowMs += options.advanceAfterWritePhase.milliseconds;
      }
      if (filePath === options.ambiguousWritePath) {
        throw new Error(`injected ambiguous persistence for ${filePath}`);
      }
    }),
    run: vi.fn((command: string, args: string[], runOptions) => {
      commands.push({ command, args, options: runOptions });
      const injected = options.failCommand?.(command, args);
      if (injected) {
        return { status: 1, stdout: "", stderr: injected };
      }
      if (command === "/usr/bin/plutil") {
        const successor = runOptions?.input?.toString("utf8") === "successor-plist";
        return {
          status: 0,
          stdout: JSON.stringify({
            Label: options.plistLabelOverride ?? plan.host.launchdLabel,
            ProgramArguments: [
              "/bin/sh",
              successor ? plan.successor.wrapperPath : plan.predecessor.wrapperPath,
              successor ? plan.successor.environmentFilePath : plan.predecessor.environmentFilePath,
              successor ? plan.successor.runtimePath : plan.predecessor.runtimePath,
              successor
                ? (options.successorPlistEntrypointOverride ?? plan.successor.gatewayEntrypointPath)
                : plan.predecessor.gatewayEntrypointPath,
              "gateway",
            ],
            KeepAlive: true,
            RunAtLoad: true,
          }),
          stderr: "",
        };
      }
      if (command === "/bin/launchctl" && args[0] === "print-disabled") {
        return {
          status: 0,
          stdout: `"${plan.host.launchdLabel}" => ${enabled ? "enabled" : "disabled"}\n`,
          stderr: "",
        };
      }
      if (command === "/bin/launchctl" && args[0] === "disable") {
        enabled = false;
        return { status: 0, stdout: "", stderr: "" };
      }
      if (command === "/bin/launchctl" && args[0] === "enable") {
        enabled = true;
        return { status: 0, stdout: "", stderr: "" };
      }
      if (command === "/bin/launchctl" && args[0] === "bootout") {
        loaded = false;
        return { status: 0, stdout: "", stderr: "" };
      }
      if (command === "/bin/launchctl" && args[0] === "bootstrap") {
        loaded = true;
        generation = "successor";
        return { status: 0, stdout: "", stderr: "" };
      }
      if (command === "/bin/launchctl" && args[0] === "print") {
        if (!loaded) {
          if (options.ambiguousServiceAbsence) {
            return { status: 1, stdout: "", stderr: "Operation not permitted" };
          }
          return { status: 113, stdout: "", stderr: "Could not find service" };
        }
        if (generation === "predecessor") {
          return {
            status: 0,
            stdout: launchdState(plan.predecessor.pid, plan.predecessor.runCount),
            stderr: "",
          };
        }
        successorServiceReads += 1;
        const pid =
          options.driftStablePid && successorServiceReads > 3 ? successorPid + 1 : successorPid;
        return { status: 0, stdout: launchdState(pid, successorRunCount), stderr: "" };
      }
      if (command === "/bin/kill") {
        if (!loaded && options.ambiguousPidAbsence) {
          return { status: 1, stdout: "", stderr: "Operation not permitted" };
        }
        return {
          status: loaded && generation === "predecessor" ? 0 : 1,
          stdout: "",
          stderr: loaded && generation === "predecessor" ? "" : "No such process",
        };
      }
      if (command === "/usr/sbin/lsof") {
        if (!loaded) {
          if (options.ambiguousPortAbsence) {
            return { status: null, signal: "SIGTERM", stdout: "", stderr: "" };
          }
          return { status: 1, stdout: "", stderr: "" };
        }
        const pid =
          generation === "predecessor"
            ? plan.predecessor.pid
            : options.driftStablePid && successorServiceReads > 3
              ? successorPid + 1
              : successorPid;
        return { status: 0, stdout: `${pid}\n`, stderr: "" };
      }
      if (command === "/bin/ps") {
        if (args[0] === "-axo") {
          return {
            status: 0,
            stdout: options.replacementProcessCommand
              ? `9999 ${options.replacementProcessCommand}\n`
              : "",
            stderr: "",
          };
        }
        const pid = Number(args[2]);
        const expected =
          pid === plan.predecessor.pid
            ? plan.predecessor.expectedProcessCommand
            : plan.successor.expectedProcessCommand;
        return { status: 0, stdout: `${expected}\n`, stderr: "" };
      }
      if (args.includes("tasks")) {
        return {
          status: 0,
          stdout: JSON.stringify({ tasks: options.activeTasks ?? [] }),
          stderr: "",
        };
      }
      if (args.includes("health")) {
        return { status: 0, stdout: JSON.stringify({ ok: true }), stderr: "" };
      }
      if (args.includes("channels.status")) {
        return {
          status: 0,
          stdout: JSON.stringify(
            options.channelStatus ?? {
              channelAccounts: {
                slack: [
                  {
                    accountId: "oscar",
                    connected: true,
                    running: true,
                    restartPending: false,
                    lastError: null,
                  },
                ],
              },
            },
          ),
          stderr: "",
        };
      }
      if (args.includes("slack.access.verify")) {
        return {
          status: 0,
          stdout: JSON.stringify(options.slack ?? slackProof(plan)),
          stderr: "",
        };
      }
      if (args.includes("gateway.suspend.prepare")) {
        const request = JSON.parse(args[args.indexOf("--params") + 1]!);
        const suspension = {
          status: "ready",
          suspensionId:
            generation === "successor"
              ? (options.successorSuspensionId ?? "fixture-suspension")
              : "fixture-suspension",
          gatewayInstanceId:
            generation === "successor" ? successorGatewayInstanceId : predecessorGatewayInstanceId,
          gatewayPid: generation === "successor" ? successorPid : plan.predecessor.pid,
          launchdRunCount:
            generation === "successor" ? successorRunCount : plan.predecessor.runCount,
          expiresAtMs: nowMs + 120_000,
          suspendMode: requestSuspendMode(args),
          activeCount: 0,
          blockers: [],
        };
        if (!options.suspensionBusy) {
          const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
          const existingHandoffBytes =
            writes.get(handoffPath) ?? options.existingFiles?.get(handoffPath);
          const existingHandoff =
            existingHandoffBytes === undefined
              ? null
              : JSON.parse(existingHandoffBytes.toString("utf8"));
          if (existingHandoff === null || existingHandoff.resumeState === "held") {
            removedFiles.delete(handoffPath);
            writes.set(
              handoffPath,
              canonicalJsonBytes({
                schema: plan.gatewaySuspension.handoffSchema,
                requestId: request.requestId,
                suspensionId: suspension.suspensionId,
                gatewayInstanceId: suspension.gatewayInstanceId,
                gatewayPid: suspension.gatewayPid,
                launchdRunCount: suspension.launchdRunCount,
                expiresAtMs: suspension.expiresAtMs,
                suspendMode: suspension.suspendMode,
                resumeState: "held",
                resumeBeforeMs: null,
              }),
            );
          }
        }
        return {
          status: 0,
          stdout: JSON.stringify(
            options.suspensionBusy
              ? {
                  status: "busy",
                  reason: "active-work",
                  activeCount: 1,
                  blockers: ["cron"],
                }
              : suspension,
          ),
          stderr: "",
        };
      }
      if (args.includes("gateway.suspend.status")) {
        const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
        const persistedHandoffBytes =
          writes.get(handoffPath) ?? options.existingFiles?.get(handoffPath);
        const persistedHandoff =
          persistedHandoffBytes === undefined
            ? null
            : JSON.parse(persistedHandoffBytes.toString("utf8"));
        const expiresAtMs = persistedHandoff?.expiresAtMs ?? nowMs + 120_000;
        nowMs += options.advanceAfterSuspensionStatusMs ?? 0;
        return {
          status: 0,
          stdout: JSON.stringify(
            options.suspensionStatusRunning
              ? {
                  status: "running",
                  gatewayInstanceId:
                    persistedHandoff?.gatewayInstanceId ??
                    (generation === "successor"
                      ? successorGatewayInstanceId
                      : predecessorGatewayInstanceId),
                  suspendMode: requestSuspendMode(args),
                }
              : {
                  status: "ready",
                  gatewayInstanceId:
                    persistedHandoff?.gatewayInstanceId ??
                    (generation === "successor"
                      ? successorGatewayInstanceId
                      : predecessorGatewayInstanceId),
                  expiresAtMs,
                  suspendMode: requestSuspendMode(args),
                },
          ),
          stderr: "",
        };
      }
      if (args.includes("gateway.suspend.resume")) {
        const request = JSON.parse(args[args.indexOf("--params") + 1]!);
        nowMs += options.advanceBeforeGatewayResumeMs ?? 0;
        const gatewayInstanceId =
          generation === "successor" ? successorGatewayInstanceId : predecessorGatewayInstanceId;
        if (
          request.gatewayInstanceId !== gatewayInstanceId ||
          !Number.isSafeInteger(request.resumeBeforeMs) ||
          nowMs >= request.resumeBeforeMs ||
          request.suspendMode !== GATEWAY_SUSPEND_MODE_LEGACY
        ) {
          return {
            status: 0,
            stdout: JSON.stringify({
              ok: false,
              reason:
                request.gatewayInstanceId !== gatewayInstanceId
                  ? "process-mismatch"
                  : request.suspendMode !== GATEWAY_SUSPEND_MODE_LEGACY
                    ? "release-authority-required"
                    : "resume-authority-expired",
            }),
            stderr: "",
          };
        }
        const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
        writes.delete(handoffPath);
        removedFiles.add(handoffPath);
        return {
          status: 0,
          stdout: JSON.stringify({
            ok: true,
            status: "running",
            resumed: options.resumeReturnsFalse !== true,
            gatewayInstanceId,
            suspendMode: request.suspendMode,
          }),
          stderr: "",
        };
      }
      return { status: 1, stdout: "", stderr: "unexpected command" };
    }),
  };
  return { runtime, commands, writes };
}

function ledgerEntriesFromWrites(
  writes: Map<string, Buffer>,
  ledgerDirectory: string,
): NonNullable<RuntimeOptions["existingLedger"]> {
  return [...writes.entries()]
    .filter(([filePath]) => filePath.startsWith(`${ledgerDirectory}/`))
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([, bytes]) => ({
      entry: JSON.parse(bytes.toString("utf8")),
      sha256: hash(bytes),
    }));
}

function restoreSuspensionPreparedHandoff(
  plan: ReturnType<typeof fixturePlan>,
  entries: NonNullable<RuntimeOptions["existingLedger"]>,
  files: Map<string, Buffer>,
): void {
  const prepared = entries.find(({ entry }) => entry.phase === "suspension-prepared")?.entry;
  if (!prepared) {
    throw new Error("test fixture lacks suspension-prepared");
  }
  const { handoffSchema, suspendMode, ...identity } = prepared.detail;
  files.set(
    `${plan.host.stateDir}/gateway-suspend-handoff.json`,
    canonicalJsonBytes({
      schema: handoffSchema,
      ...identity,
      suspendMode,
      resumeState: "held",
      resumeBeforeMs: null,
    }),
  );
}

function executeFixture(plan = fixturePlan(), options: RuntimeOptions = {}, execute = true) {
  const fixture = createRuntime(plan, options);
  const planBytes = canonicalJsonBytes(plan);
  const receipt = executeHostActivation({
    planBytes,
    expectedPlanSha256: hash(planBytes),
    execute,
    runtime: fixture.runtime,
  });
  return { plan, fixture, receipt };
}

function exactLifecycleClaimBytes(plan: ReturnType<typeof fixturePlan>): Buffer {
  const planBytes = canonicalJsonBytes(plan);
  return canonicalJsonBytes({
    schema: "handoff-v2-host-activation-ledger-phase/v1",
    planId: plan.planId,
    planSha256: hash(planBytes),
    sequence: 0,
    phase: "claim",
    at: "2026-07-28T08:29:00.000Z",
    detail: {
      launchdDomain: plan.host.launchdDomain,
      launchdLabel: plan.host.launchdLabel,
      executorPid: 9_000,
      predecessorPid: plan.predecessor.pid,
      predecessorRunCount: plan.predecessor.runCount,
      supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
    },
  });
}

function expectExistingClaimPreflightRefusal(
  plan: ReturnType<typeof fixturePlan>,
  options: RuntimeOptions,
) {
  const fixture = createRuntime(plan, options);
  const planBytes = canonicalJsonBytes(plan);
  expect(() =>
    executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: false,
      runtime: fixture.runtime,
    }),
  ).toThrow("read-only preflight cannot recover an existing lifecycle claim");
  expect(fixture.commands).toHaveLength(0);
  expect(fixture.writes.size).toBe(0);
  expect(fixture.runtime.readOptionalFile).toHaveBeenCalledTimes(1);
  expect(fixture.runtime.readOptionalFile).toHaveBeenCalledWith(
    expect.any(String),
    "service-global lifecycle claim",
  );
  for (const method of [
    "run",
    "assertClaimOwnerDead",
    "listLedgerPhases",
    "verifyFile",
    "ensureFileDurable",
    "acquireRecoveryOwnership",
    "releaseRecoveryOwnership",
    "writeExclusive",
    "replaceFileDurably",
    "removeFileDurably",
    "installFile",
    "preserveFile",
    "sleep",
  ]) {
    expect(Reflect.get(fixture.runtime, method)).not.toHaveBeenCalled();
  }
}

describe("host activation plan contract", () => {
  it("accepts the closed authority-free v1 fixture", () => {
    const plan = fixturePlan();
    expect(
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toEqual(plan);
  });

  it("accepts a closed Gate 7 RC17 v2 authority binding", () => {
    const plan = fixtureGate7Plan();
    expect(
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toEqual(plan);
    const validateSchema = compileContractSchema("handoff-v2-host-activation-plan.v2.schema.json");
    expect(validateSchema(plan), JSON.stringify(validateSchema.errors)).toBe(true);
  });

  it("rejects a Gate 7 host identity that differs from the successor", () => {
    const plan = fixtureGate7Plan();
    plan.authority.hostCommit = "f".repeat(40);
    expect(() =>
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toThrow("must equal the planned successor");
  });

  it("accepts an external predecessor and a bundled successor Node runtime", () => {
    const plan = realisticMacHostPlan();
    expect(
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toEqual(plan);
  });

  it("rejects an external successor Node runtime even when it exactly matches the predecessor", () => {
    const plan = realisticMacHostPlan();
    plan.successor.runtimePath = plan.predecessor.runtimePath;
    plan.successor.runtimeSha256 = plan.predecessor.runtimeSha256;
    expect(() =>
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toThrow("must remain within");
  });

  it("rejects redefining staging as the Homebrew realpath root", () => {
    const plan = realisticMacHostPlan();
    plan.host.stagingRoot = "/opt/homebrew/Cellar/node@24/24.16.0";
    plan.successor.runtimePath = "/opt/homebrew/Cellar/node@24/24.16.0/bin/node";
    plan.successor.runtimeSha256 = plan.predecessor.runtimeSha256;
    expect(() =>
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toThrow("plan.host.stagingRoot must remain within");
  });

  it.each([
    ["extra field", (plan: any) => (plan.approval = true), "keys must be exactly"],
    ["authority", (plan: any) => (plan.authority.kind = "rollout"), "must equal"],
    ["reuse", (plan: any) => (plan.authority.reusable = true), "must equal"],
    ["second restart", (plan: any) => (plan.operations.restartLimit = 2), "must equal"],
    ["active task literal", (plan: any) => (plan.quiescence.activeTasks = 1), "must equal"],
    [
      "competing lifecycle literal",
      (plan: any) => (plan.quiescence.competingLifecycleAutomation = true),
      "must equal",
    ],
    ["wrong Slack account", (plan: any) => (plan.slack.accountId = "default"), "must equal"],
    [
      "wrong Gateway suspension mode",
      (plan: any) => (plan.gatewaySuspension.suspendMode = "legacy-auto-expire/v1"),
      "must equal",
    ],
    [
      "wrong Gateway handoff schema",
      (plan: any) => (plan.gatewaySuspension.handoffSchema = "openclaw-gateway-suspend-handoff/v2"),
      "must equal",
    ],
    [
      "equal CLI paths",
      (plan: any) => (plan.successor.cliPath = plan.predecessor.cliPath),
      "must remain within",
    ],
    [
      "unsafe installed plist path",
      (plan: any) => (plan.successor.installedServicePlistPath = "/tmp/gateway.plist"),
      "must equal",
    ],
    [
      "evidence outside root",
      (plan: any) => (plan.evidence.receiptPath = "/tmp/receipt.json"),
      "must remain within",
    ],
  ])("rejects %s", (_label, mutate, message) => {
    const plan = fixturePlan();
    mutate(plan);
    expect(() =>
      validateHostActivationPlan(plan, { nowMs: Date.parse("2026-07-28T08:30:00.000Z") }),
    ).toThrow(message);
  });

  it("rejects expiry using injected time", () => {
    expect(() =>
      validateHostActivationPlan(fixturePlan(), {
        nowMs: Date.parse("2026-07-28T10:00:00.000Z"),
      }),
    ).toThrow("expired");
  });
});

describe("exact-host launchd parsers", () => {
  it("accepts captured enabled/disabled grammar", () => {
    expect(
      parseLaunchdEnabledState('"ai.openclaw.gateway" => enabled\n', "ai.openclaw.gateway"),
    ).toBe(true);
    expect(
      parseLaunchdEnabledState('"ai.openclaw.gateway" => disabled\n', "ai.openclaw.gateway"),
    ).toBe(false);
  });

  it.each([
    '"ai.openclaw.gateway" => true\n',
    '"ai.openclaw.gateway" => false\n',
    '"ai.openclaw.gateway" => enabled\n"ai.openclaw.gateway" => enabled\n',
  ])("rejects incompatible or ambiguous grammar", (output) => {
    expect(() => parseLaunchdEnabledState(output, "ai.openclaw.gateway")).toThrow(
      "enabled/disabled",
    );
  });

  it("requires exact label, pid, and run count", () => {
    expect(parseLaunchdServiceState(launchdState(4100, 17), "ai.openclaw.gateway")).toEqual({
      pid: 4100,
      runCount: 17,
    });
  });
});

describe("one-use host activation lifecycle", () => {
  it("re-verifies the immutable Gate 7 binding before preflight and before mutation", () => {
    const plan = fixtureGate7Plan();
    const { fixture, receipt } = executeFixture(plan);
    expect(fixture.runtime.verifyGate7Admission).toHaveBeenCalledTimes(2);
    expect(fixture.runtime.verifyGate7Admission).toHaveBeenLastCalledWith({
      stateDir: plan.host.stateDir,
      receiptRelativePath: plan.authority.receiptRelativePath,
      expectedReceiptHash: plan.authority.receiptHash,
      expectedVerifierFileSha256: plan.authority.verifierFileSha256,
      requiredRemainingMs: 150_000,
      expectedBinding: {
        receiptId: plan.authority.receiptId,
        receiptHash: plan.authority.receiptHash,
        generation: plan.authority.generation,
        sourceCommit: plan.authority.sourceCommit,
        sourceTree: plan.authority.sourceTree,
        hostCommit: plan.authority.hostCommit,
        hostTree: plan.authority.hostTree,
        authorityUseHash: plan.authority.authorityUseHash,
        hostFenceHash: plan.authority.hostFenceHash,
        issuedAt: plan.authority.issuedAt,
        expiresAt: plan.authority.expiresAt,
      },
    });
    expect(receipt).toMatchObject({
      schema: "handoff-v2-host-activation-receipt/v2",
      authority: plan.authority,
      outcome: "ACTIVATED_VERIFIED",
    });
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v2.schema.json",
    );
    expect(validateReceiptSchema(receipt), JSON.stringify(validateReceiptSchema.errors)).toBe(true);
  });

  it("proves the complete one-restart lifecycle and accepts reset launchd run count", () => {
    const { plan, fixture, receipt } = executeFixture();
    expect(receipt).toMatchObject({
      schema: HOST_ACTIVATION_RECEIPT_SCHEMA,
      outcome: "ACTIVATED_VERIFIED",
      authority: { kind: "none", grants: [], reusable: false },
      operations: {
        disableCount: 1,
        enableCount: 1,
        bootoutCount: 1,
        bootstrapCount: 1,
        restartCount: 1,
        automaticRollbackCount: 0,
        automaticSecondRestartCount: 0,
      },
      successor: { pid: 5100, runCount: 1 },
      proofs: {
        portOwnerPid: 5100,
        stabilityWindowMs: 60_000,
        atJobSafety: { marker: "state.startupInterruptedRunAtMs:absent" },
      },
    });
    expect(fixture.runtime.sleep).toHaveBeenCalledTimes(60);
    expect(fixture.runtime.sleep).toHaveBeenCalledWith(1_000);
    expect(fixture.runtime.preserveFile).toHaveBeenCalledWith(
      plan.predecessor.servicePlistPath,
      plan.evidence.predecessorPlistBackupPath,
    );
    expect(fixture.writes.has(`${plan.evidence.ledgerDirectory}/00-claim.json`)).toBe(true);
    expect(fixture.writes.has(plan.evidence.receiptPath)).toBe(true);
  });

  it("accepts the real external predecessor and bundled successor runtime topology", () => {
    const plan = realisticMacHostPlan();
    const { fixture, receipt } = executeFixture(plan);
    expect(receipt.outcome).toBe("ACTIVATED_VERIFIED");
    expect(fixture.runtime.assertSecureDirectoryChain).toHaveBeenCalledWith(
      path.dirname(plan.successor.runtimePath),
      plan.host.stateDir,
      "successor staging chain",
    );
  });

  it("fails closed before probes when the bundled successor runtime chain is unsafe", () => {
    const plan = realisticMacHostPlan();
    const runtimeDirectory = path.dirname(plan.successor.runtimePath);
    const fixture = createRuntime(plan, { insecureDirectoryChain: runtimeDirectory });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("unsafe directory chain");
    expect(fixture.commands).toHaveLength(0);
  });

  it("rejects predecessor and successor runtime paths that alias one physical file", () => {
    const plan = realisticMacHostPlan();
    const fixture = createRuntime(plan, { sameRuntimeFileAlias: true });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("must be distinct physical files");
    expect(fixture.commands).toHaveLength(0);
  });

  it("rejects a successor plist that launches the CLI instead of the Gateway entrypoint", () => {
    const plan = realisticMacHostPlan();
    const fixture = createRuntime(plan, {
      successorPlistEntrypointOverride: plan.successor.cliPath,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: false,
        runtime: fixture.runtime,
      }),
    ).toThrow("Gateway entrypoint identity does not match");
    expect(fixture.writes.size).toBe(0);
  });

  it("keeps preflight read-only and does not claim the generation", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {}, false);
    expect(receipt).toMatchObject({ outcome: "PREFLIGHT_PASS" });
    expect(fixture.runtime.writeExclusive).not.toHaveBeenCalled();
    expect(fixture.commands.some(({ args }) => args[0] === "disable")).toBe(false);
  });

  it("keeps preflight read-only when the exact predecessor backup already exists", () => {
    const plan = fixturePlan();
    const predecessorBackup = Buffer.from("predecessor-plist");
    plan.predecessor.servicePlistSha256 = hash(predecessorBackup);
    const { fixture, receipt } = executeFixture(
      plan,
      { existingPlistBackup: predecessorBackup },
      false,
    );
    expect(receipt).toMatchObject({ outcome: "PREFLIGHT_PASS" });
    for (const method of [
      "ensureFileDurable",
      "writeExclusive",
      "replaceFileDurably",
      "removeFileDurably",
      "installFile",
      "preserveFile",
    ]) {
      expect(Reflect.get(fixture.runtime, method)).not.toHaveBeenCalled();
    }
    expect(fixture.writes.size).toBe(0);
    expect(
      fixture.commands.some(
        ({ command, args }) =>
          (command === "/bin/launchctl" &&
            ["disable", "enable", "bootout", "bootstrap"].includes(args[0] ?? "")) ||
          args.includes("gateway.suspend.prepare") ||
          args.includes("gateway.suspend.resume"),
      ),
    ).toBe(false);
  });

  it("rejects a mismatched predecessor backup during preflight without renewing durability", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, {
      existingPlistBackup: Buffer.from("mismatched-predecessor-plist"),
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: false,
        runtime: fixture.runtime,
      }),
    ).toThrow("existing predecessor plist backup does not match the activation plan");
    expect(fixture.runtime.ensureFileDurable).not.toHaveBeenCalled();
    expect(fixture.writes.size).toBe(0);
    expect(fixture.commands).toHaveLength(0);
  });

  it.each(["exact", "empty", "malformed", "foreign", "owner-alive", "ownership-held"] as const)(
    "refuses the %s existing claim before inspecting or recovering lifecycle state",
    (claimState) => {
      const plan = fixturePlan();
      const recoveryOwnership = { executorPid: 9_999 };
      let existingGlobalClaim = exactLifecycleClaimBytes(plan);
      if (claimState === "empty") {
        existingGlobalClaim = Buffer.alloc(0);
      } else if (claimState === "malformed") {
        existingGlobalClaim = Buffer.from("{");
      } else if (claimState === "foreign") {
        const foreignClaim = JSON.parse(existingGlobalClaim.toString("utf8"));
        foreignClaim.planId = "foreign-plan";
        existingGlobalClaim = canonicalJsonBytes(foreignClaim);
      }
      expectExistingClaimPreflightRefusal(plan, {
        existingGlobalClaim,
        claimOwnerAlive: claimState === "owner-alive",
        recoveryOwnership: claimState === "ownership-held" ? recoveryOwnership : undefined,
      });
      if (claimState === "ownership-held") {
        expect(recoveryOwnership.executorPid).toBe(9_999);
      }
    },
  );

  it.each(["resume-pending", "resume-expired"] as const)(
    "rejects a normal activation that encounters a %s marker",
    (resumeState) => {
      const plan = fixturePlan();
      const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
      const existingFiles = new Map([
        [
          handoffPath,
          canonicalJsonBytes({
            schema: "openclaw-gateway-suspend-handoff/v3",
            requestId: `handoff-v2:${plan.planId}`,
            suspensionId: "fixture-suspension",
            gatewayInstanceId: "fixture-predecessor-gateway-instance",
            gatewayPid: plan.predecessor.pid,
            launchdRunCount: plan.predecessor.runCount,
            expiresAtMs: Date.parse("2026-07-28T08:32:00.000Z"),
            suspendMode: "handoff-durable-hold/v1",
            resumeState,
            resumeBeforeMs: Date.parse("2026-07-28T08:31:00.000Z"),
          }),
        ],
      ]);
      const fixture = createRuntime(plan, { existingFiles });

      expect(
        executeHostActivation({
          planBytes: canonicalJsonBytes(plan),
          expectedPlanSha256: hash(canonicalJsonBytes(plan)),
          execute: true,
          runtime: fixture.runtime,
        }),
      ).toMatchObject({
        outcome: "HOLD",
        holdReason: expect.stringContaining(
          "Gateway suspension handoff does not bind the active suspension",
        ),
      });
      expect(fixture.commands.some(({ args }) => args[0] === "disable")).toBe(false);
    },
  );

  it("routes preflight and postflight through distinct immutable CLIs", () => {
    const { plan, fixture } = executeFixture();
    const cli = fixture.commands.filter(
      ({ command }) =>
        command === plan.predecessor.runtimePath || command === plan.successor.runtimePath,
    );
    expect(cli.some(({ command }) => command === plan.predecessor.runtimePath)).toBe(true);
    expect(cli.some(({ command }) => command === plan.successor.runtimePath)).toBe(true);
  });

  it("runs every CLI probe in the closed plan-bound environment", () => {
    const { plan, fixture } = executeFixture();
    const probes = fixture.commands.filter(
      ({ command }) =>
        command === plan.predecessor.runtimePath || command === plan.successor.runtimePath,
    );
    expect(probes.length).toBeGreaterThan(0);
    for (const probe of probes) {
      expect(probe.options?.env).toEqual({
        HOME: plan.host.homePath,
        LANG: "C",
        LC_ALL: "C",
        PATH: "/usr/bin:/bin:/usr/sbin:/sbin",
        OPENCLAW_CONFIG_PATH: plan.predecessor.configPath,
        OPENCLAW_ENV_FILE:
          probe.command === plan.predecessor.runtimePath
            ? plan.predecessor.environmentFilePath
            : plan.successor.environmentFilePath,
        OPENCLAW_HOME: plan.host.stateDir,
        OPENCLAW_NO_RESPAWN: "1",
        OPENCLAW_STATE_DIR: plan.host.stateDir,
      });
    }
  });

  it("binds real channels.status shape and Oscar's bot identity plus channel access", () => {
    const { plan, fixture } = executeFixture();
    const probes = fixture.commands.filter(({ args }) => args.includes("slack.access.verify"));
    expect(probes).toHaveLength(62);
    for (const probe of probes) {
      const index = probe.args.indexOf("--params");
      expect(JSON.parse(probe.args[index + 1]!)).toMatchObject({
        expectedUserId: plan.slack.expectedUserId,
        expectedBotId: plan.slack.expectedBotId,
        channelId: plan.slack.channelId,
      });
    }
  });

  it("rejects a predecessor replacement during its first suspension prepare", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    let replaced = false;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      const result = base(command, args, options);
      if (!replaced && args.includes("gateway.suspend.prepare")) {
        replaced = true;
        const body = JSON.parse(result.stdout);
        body.gatewayInstanceId = "replacement-predecessor-gateway-instance";
        body.gatewayPid = plan.predecessor.pid + 1;
        body.launchdRunCount = plan.predecessor.runCount + 1;
        return { ...result, stdout: JSON.stringify(body) };
      }
      return result;
    });

    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "Gateway suspension did not establish an idle admission fence",
      operations: { disableCount: 0, bootoutCount: 0, bootstrapCount: 0 },
    });
    expect(replaced).toBe(true);
    expect(fixture.commands.some(({ args }) => args[0] === "disable")).toBe(false);
  });

  it.each([
    ["active task", { activeTasks: [{ status: "running", runId: "r1" }] }, "active background"],
    ["unsafe at job", { unsafeAtJob: true }, "startupInterruptedRunAtMs"],
    [
      "unhealthy Oscar account",
      {
        channelStatus: {
          channelAccounts: {
            slack: [{ accountId: "oscar", connected: true, running: false }],
          },
        },
      },
      "oscar Slack account",
    ],
    [
      "wrong Oscar bot",
      {
        slack: {
          ...slackProof(fixturePlan()),
          auth: { ...slackProof(fixturePlan()).auth, botId: "BWRONGBOT0" },
        },
      },
      "did not bind",
    ],
  ])("refuses before claiming on %s", (_label, options, message) => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, options as RuntimeOptions);
    expect(() =>
      executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow(message);
    expect(fixture.writes.size).toBe(0);
  });

  it("rejects an existing durable claim before lifecycle mutation", () => {
    const plan = fixturePlan();
    const claim = `${plan.evidence.ledgerDirectory}/00-claim.json`;
    const fixture = createRuntime(plan, { unavailableOutput: claim });
    expect(() =>
      executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("already exists");
    expect(fixture.commands).toHaveLength(0);
  });

  it("recovers an interrupted exact-plan global claim into a terminal HOLD", () => {
    const plan = fixtureGate7Plan();
    const planBytes = canonicalJsonBytes(plan);
    const planSha256 = hash(planBytes);
    const claim = {
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256,
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    };
    const claimBytes = canonicalJsonBytes(claim);
    const fixture = createRuntime(plan, {
      existingGlobalClaim: claimBytes,
      existingLedger: [{ entry: claim, sha256: hash(claimBytes) }],
    });
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: planSha256,
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "interrupted prior activation attempt recovered at phase claim",
      operations: { disableCount: 0, bootoutCount: 0, bootstrapCount: 0 },
    });
    expect(fixture.commands).toHaveLength(0);
    expect(fixture.runtime.verifyGate7Admission).toHaveBeenCalledTimes(2);
    expect(fixture.writes.has(plan.evidence.rollbackPacketPath)).toBe(true);
    expect(fixture.writes.has(plan.evidence.receiptPath)).toBe(true);
    const rollback = JSON.parse(
      fixture.writes.get(plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    expect(rollback.phase).toBe("claim");
  });

  it("makes no recovery mutation when the immediate Gate 7 recheck expires", () => {
    const plan = fixtureGate7Plan();
    const planBytes = canonicalJsonBytes(plan);
    const planSha256 = hash(planBytes);
    const claim = {
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256,
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    };
    const claimBytes = canonicalJsonBytes(claim);
    const fixture = createRuntime(plan, {
      existingGlobalClaim: claimBytes,
      existingLedger: [{ entry: claim, sha256: hash(claimBytes) }],
    });
    vi.mocked(fixture.runtime.verifyGate7Admission!).mockImplementationOnce(() => ({}));
    vi.mocked(fixture.runtime.verifyGate7Admission!).mockImplementationOnce(() => {
      throw new Error("Gate 7 authority expired at recovery takeover");
    });

    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: planSha256,
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("expired at recovery takeover");
    expect(fixture.runtime.verifyGate7Admission).toHaveBeenCalledTimes(2);
    expect(fixture.runtime.ensureFileDurable).not.toHaveBeenCalled();
    expect(fixture.runtime.acquireRecoveryOwnership).not.toHaveBeenCalled();
    expect(fixture.commands).toHaveLength(0);
    expect(fixture.writes.size).toBe(0);
  });

  it.each([
    ["predecessor run count", "predecessorRunCount", 18],
    ["supervisor lease hash", "supervisorLeaseSha256", "f".repeat(64)],
  ])("rejects a recovered claim with a different %s", (_label, field, value) => {
    const plan = fixturePlan();
    const planBytes = canonicalJsonBytes(plan);
    const claim = {
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256: hash(planBytes),
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
        [field]: value,
      },
    };
    const claimBytes = canonicalJsonBytes(claim);
    const fixture = createRuntime(plan, {
      existingGlobalClaim: claimBytes,
      existingLedger: [{ entry: claim, sha256: hash(claimBytes) }],
    });
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("another plan already owns the service-global lifecycle claim");
    expect(fixture.commands).toHaveLength(0);
  });

  it("rejects an expired new attempt through the execution branch without claiming", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, {
      initialNowMs: Date.parse(plan.expiresAt),
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("plan is expired");
    expect(fixture.writes.size).toBe(0);
    expect(fixture.commands).toHaveLength(0);
  });

  it("repairs a missing ledger claim before recording interrupted recovery", () => {
    const plan = fixturePlan();
    const planBytes = canonicalJsonBytes(plan);
    const planSha256 = hash(planBytes);
    const claim = {
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256,
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    };
    const claimBytes = canonicalJsonBytes(claim);
    const fixture = createRuntime(plan, { existingGlobalClaim: claimBytes });
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: planSha256,
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt.outcome).toBe("HOLD");
    const ledgerClaimPath = `${plan.evidence.ledgerDirectory}/00-claim.json`;
    expect(fixture.writes.get(ledgerClaimPath)).toEqual(claimBytes);
    const writes = vi
      .mocked(fixture.runtime.writeExclusive)
      .mock.calls.map(([filePath]) => filePath);
    expect(writes.indexOf(ledgerClaimPath)).toBeLessThan(
      writes.findIndex((filePath) => filePath.endsWith("-interrupted-attempt-recovered.json")),
    );
  });

  it.each(["rollback", "receipt"])(
    "repairs terminal evidence after a crash before %s persistence",
    (failedWrite) => {
      const plan = fixturePlan();
      const failedPath =
        failedWrite === "rollback" ? plan.evidence.rollbackPacketPath : plan.evidence.receiptPath;
      const first = createRuntime(plan, {
        suspensionBusy: true,
        failWritePath: failedPath,
      });
      const planBytes = canonicalJsonBytes(plan);
      const planSha256 = hash(planBytes);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: planSha256,
          execute: true,
          runtime: first.runtime,
        }),
      ).toThrow("could not be proven durable");

      const globalClaim = [...first.writes.entries()].find(([filePath]) =>
        filePath.includes("handoff-v2-lifecycle-"),
      );
      expect(globalClaim).toBeDefined();
      const second = createRuntime(plan, {
        existingGlobalClaim: globalClaim![1],
        existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
        existingFiles: first.writes,
      });
      const receipt = executeHostActivation({
        planBytes,
        expectedPlanSha256: planSha256,
        execute: true,
        runtime: second.runtime,
      });
      expect(receipt).toMatchObject({
        outcome: "HOLD",
        holdReason: "Gateway suspension did not establish an idle admission fence",
      });
      expect(second.runtime.writeExclusive).toHaveBeenCalledWith(failedPath, expect.any(Buffer));
    },
  );

  it.each([
    ["disable-requested", "disabled-proven"],
    ["disabled-proven", "bootout-requested"],
    ["bootout-requested", "bootout-invocation-started"],
  ])(
    "dead-owner recovery restores the exact predecessor after %s",
    (expectedFailedPhase, injectedPhase) => {
      const plan = fixturePlan();
      const first = createRuntime(plan, { failWritePhase: injectedPhase });
      const planBytes = canonicalJsonBytes(plan);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: hash(planBytes),
          execute: true,
          runtime: first.runtime,
        }),
      ).toThrow(`activation ledger phase ${injectedPhase} could not be proven durable`);
      const globalClaim = [...first.writes.entries()].find(([filePath]) =>
        filePath.includes("handoff-v2-lifecycle-"),
      )!;
      const second = createRuntime(plan, {
        existingGlobalClaim: globalClaim[1],
        existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
        existingFiles: first.writes,
        initialEnabled: false,
        initialLoaded: true,
      });

      const receipt = executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      });

      expect(receipt).toMatchObject({
        outcome: "HOLD",
        operations: {
          enableCount: 1,
          bootstrapCount: 0,
          automaticRollbackCount: 0,
          automaticSecondRestartCount: 0,
        },
      });
      expect(receipt.holdReason).toContain(`recovered at phase ${expectedFailedPhase}`);
      expect(recoveryPhaseNames(receipt)).toEqual([
        "pre-bootout-service-loaded-proven",
        "pre-bootout-reenable-requested",
        "pre-bootout-reenabled-same-predecessor-proven",
        "pre-bootout-durable-suspension-retained",
      ]);
      expect(
        second.commands.filter(
          ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
        ),
      ).toHaveLength(1);
      expect(second.commands.some(({ args }) => args[0] === "bootout")).toBe(false);
      const validateReceipt = compileContractSchema(
        "handoff-v2-host-activation-receipt.v1.schema.json",
      );
      expect(validateReceipt(receipt), JSON.stringify(validateReceipt.errors)).toBe(true);
    },
  );

  it("classifies an applied ambiguous bootout and emits a retained-handoff manual HOLD", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "predecessor-stopped-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-stopped-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: false,
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: {
        enableCount: 1,
        bootstrapCount: 0,
        automaticRollbackCount: 0,
        automaticSecondRestartCount: 0,
      },
      holdReason: expect.stringContaining("manual rollback required"),
    });
    expect(recoveryPhaseNames(receipt)).toEqual([
      "pre-bootout-service-unloaded-proven",
      "pre-bootout-reenable-requested",
      "pre-bootout-label-enabled-unloaded-proven",
    ]);
    expect(second.commands.some(({ args }) => args[0] === "bootstrap")).toBe(false);
    expect(second.runtime.readOptionalFile(handoffPath, "retained handoff")).not.toBeNull();
    const rollback = JSON.parse(
      second.writes.get(plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    expect(rollback.serviceRecovery).toMatchObject({
      manualRollbackRequired: true,
      serviceState: "unloaded",
      launchdEnabled: true,
      predecessorPidDead: true,
      portFree: true,
      replacementProcessAbsent: true,
      handoff: {
        path: handoffPath,
        retained: true,
      },
      operations: {
        bootstrapCount: 0,
        automaticRollbackCount: 0,
        automaticSecondRestartCount: 0,
      },
    });
    const validateReceipt = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    const validateRollback = compileContractSchema(
      "handoff-v2-host-rollback-evidence.v1.schema.json",
    );
    expect(validateReceipt(receipt), JSON.stringify(validateReceipt.errors)).toBe(true);
    expect(validateRollback(rollback), JSON.stringify(validateRollback.errors)).toBe(true);
  });

  it("recovers the exact loaded predecessor after bootout invocation became possible", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "predecessor-stopped-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-stopped-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { enableCount: 1, bootstrapCount: 0 },
      holdReason: expect.stringContaining("recovered at phase bootout-invocation-started"),
    });
    expect(recoveryPhaseNames(receipt)).toEqual([
      "pre-bootout-service-loaded-proven",
      "pre-bootout-reenable-requested",
      "pre-bootout-reenabled-same-predecessor-proven",
      "pre-bootout-durable-suspension-retained",
    ]);
    expect(second.commands.some(({ args }) => args[0] === "bootstrap")).toBe(false);
  });

  it("emits manual HOLD without mutation when a different service process appears", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "predecessor-stopped-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-stopped-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
      initialGeneration: "successor",
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { enableCount: 0, bootstrapCount: 0 },
      holdReason: expect.stringContaining("different process"),
    });
    expect(
      second.commands.some(
        ({ command, args }) =>
          command === "/bin/launchctl" &&
          (args[0] === "enable" || args[0] === "bootstrap" || args[0] === "bootout"),
      ),
    ).toBe(false);
  });

  it("performs only read-only classification after recovery authority expires", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "bootout-invocation-started" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase bootout-invocation-started could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
      initialNowMs: Date.parse(plan.expiresAt) + 1,
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { enableCount: 0, bootstrapCount: 0 },
      holdReason: expect.stringContaining("manual intervention"),
    });
    expect(
      second.commands.some(
        ({ command, args }) =>
          command === "/bin/launchctl" &&
          (args[0] === "enable" || args[0] === "bootstrap" || args[0] === "bootout"),
      ),
    ).toBe(false);
    expect(second.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(false);
  });

  it("fails closed when running status conflicts with a retained durable handoff", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "disabled-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase disabled-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
      suspensionStatusRunning: true,
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt.outcome).toBe("HOLD");
    expect(receipt.holdReason).toContain("running Gateway suspension status conflicts");
    expect(second.runtime.removeFileDurably).not.toHaveBeenCalledWith(handoffPath);
    expect(second.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(false);
    expect(second.runtime.readOptionalFile(handoffPath, "retained handoff")).not.toBeNull();
  });

  it("allows exactly one atomic dead-owner recovery owner to mutate", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "disabled-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase disabled-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const existingLedger = ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory);
    const recoveryOwnership = { executorPid: null as number | null };
    const competing = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger,
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
      executorPid: 9_003,
      recoveryOwnership,
    });
    let competingError: unknown;
    const owner = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger,
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
      executorPid: 9_002,
      recoveryOwnership,
      onRecoveryOwnershipAcquired: () => {
        try {
          executeHostActivation({
            planBytes,
            expectedPlanSha256: hash(planBytes),
            execute: true,
            runtime: competing.runtime,
          });
        } catch (error) {
          competingError = error;
        }
      },
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: owner.runtime,
    });

    expect(receipt.outcome).toBe("HOLD");
    expect(competingError).toMatchObject({
      message: "recovery ownership is already held",
    });
    expect(
      competing.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
      ),
    ).toBe(false);
    expect(
      owner.commands.filter(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
      ),
    ).toHaveLength(1);
    expect(recoveryOwnership.executorPid).toBeNull();
  });

  it.each([
    {
      name: "loaded enable",
      failWritePhase: "disabled-proven",
      initialLoaded: true,
      phase: "pre-bootout-reenable-requested",
      forbidden: "enable",
    },
    {
      name: "loaded durable suspension retention",
      failWritePhase: "suspension-prepared",
      initialLoaded: true,
      phase: "pre-bootout-reenabled-same-predecessor-proven",
      forbidden: "gateway.suspend.resume",
    },
    {
      name: "unloaded label enable",
      failWritePhase: "predecessor-stopped-proven",
      initialLoaded: false,
      phase: "pre-bootout-reenable-requested",
      forbidden: "enable",
    },
  ])(
    "rechecks authority after durable $name recovery phase",
    ({ failWritePhase, initialLoaded, phase, forbidden }) => {
      const plan = fixturePlan();
      const first = createRuntime(plan, { failWritePhase });
      const planBytes = canonicalJsonBytes(plan);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: hash(planBytes),
          execute: true,
          runtime: first.runtime,
        }),
      ).toThrow(`activation ledger phase ${failWritePhase} could not be proven durable`);
      const globalClaim = [...first.writes.entries()].find(([filePath]) =>
        filePath.includes("handoff-v2-lifecycle-"),
      )!;
      const second = createRuntime(plan, {
        existingGlobalClaim: globalClaim[1],
        existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
        existingFiles: first.writes,
        initialEnabled: failWritePhase === "suspension-prepared",
        initialLoaded,
        advanceAfterWritePhase: { phase, milliseconds: 6_000_000 },
      });

      const receipt = executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      });

      expect(receipt).toMatchObject({
        outcome: "HOLD",
        holdReason: expect.stringContaining("manual intervention"),
      });
      expect(
        second.commands.some(({ args }) =>
          forbidden === "enable" ? args[0] === forbidden : args.includes(forbidden),
        ),
      ).toBe(false);
    },
  );

  it("rechecks dead-owner resume authority after the suspension status RPC returns", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "suspension-prepared" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase suspension-prepared could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: true,
      initialLoaded: true,
      advanceAfterSuspensionStatusMs: 6_000_000,
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("manual intervention"),
    });
    expect(second.commands.some(({ args }) => args.includes("gateway.suspend.status"))).toBe(true);
    expect(second.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(false);
  });

  it.each(["status", "renewal"])(
    "rejects a predecessor replacement during dead-owner suspension %s",
    (replacementBoundary) => {
      const plan = fixturePlan();
      const first = createRuntime(plan, { failWritePhase: "suspension-prepared" });
      const planBytes = canonicalJsonBytes(plan);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: hash(planBytes),
          execute: true,
          runtime: first.runtime,
        }),
      ).toThrow("activation ledger phase suspension-prepared could not be proven durable");
      const globalClaim = [...first.writes.entries()].find(([filePath]) =>
        filePath.includes("handoff-v2-lifecycle-"),
      )!;
      const second = createRuntime(plan, {
        existingGlobalClaim: globalClaim[1],
        existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
        existingFiles: first.writes,
        initialEnabled: true,
        initialLoaded: true,
      });
      const base = vi.mocked(second.runtime.run).getMockImplementation()!;
      let prepareCalls = 0;
      vi.mocked(second.runtime.run).mockImplementation((command, args, options) => {
        const result = base(command, args, options);
        if (args.includes("gateway.suspend.prepare")) {
          prepareCalls += 1;
          if (replacementBoundary === "renewal" && prepareCalls === 2) {
            const body = JSON.parse(result.stdout);
            body.gatewayInstanceId = "replacement-gateway-instance";
            return { ...result, stdout: JSON.stringify(body) };
          }
        }
        if (replacementBoundary === "status" && args.includes("gateway.suspend.status")) {
          const body = JSON.parse(result.stdout);
          body.gatewayInstanceId = "replacement-gateway-instance";
          return { ...result, stdout: JSON.stringify(body) };
        }
        return result;
      });

      const receipt = executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      });

      expect(receipt).toMatchObject({
        outcome: "HOLD",
        holdReason: expect.stringContaining("manual intervention"),
      });
      expect(second.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
        false,
      );
    },
  );

  it("rechecks unloaded enable authority after the final handoff fsync", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "predecessor-stopped-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-stopped-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: false,
      advanceAfterEnsureFileDurable: {
        path: handoffPath,
        occurrence: 3,
        milliseconds: 6_000_000,
      },
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { enableCount: 1 },
      holdReason: expect.stringContaining("manual intervention"),
    });
    expect(
      second.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
      ),
    ).toBe(false);
  });

  it("propagates ambiguous recovery-phase persistence without appending HOLD", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "disabled-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase disabled-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const recoveryPhasePath = `${plan.evidence.ledgerDirectory}/04-pre-bootout-service-loaded-proven.json`;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: true,
      ambiguousWritePath: recoveryPhasePath,
      failReadAfterWritePath: recoveryPhasePath,
    });

    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      }),
    ).toThrow(
      "activation ledger phase pre-bootout-service-loaded-proven could not be proven durable",
    );
    expect([...second.writes.keys()].some((filePath) => filePath.endsWith("-hold.json"))).toBe(
      false,
    );
  });

  it.each(["missing", "substituted"])(
    "rejects a %s marker after durable suspension-prepared",
    (condition) => {
      const plan = fixturePlan();
      const first = createRuntime(plan, { failWritePhase: "disable-requested" });
      const planBytes = canonicalJsonBytes(plan);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: hash(planBytes),
          execute: true,
          runtime: first.runtime,
        }),
      ).toThrow("activation ledger phase disable-requested could not be proven durable");
      const globalClaim = [...first.writes.entries()].find(([filePath]) =>
        filePath.includes("handoff-v2-lifecycle-"),
      )!;
      const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
      const existingFiles = new Map(first.writes);
      if (condition === "missing") {
        existingFiles.delete(handoffPath);
      } else {
        existingFiles.set(
          handoffPath,
          canonicalJsonBytes({
            schema: "openclaw-gateway-suspend-handoff/v3",
            requestId: `handoff-v2:${plan.planId}`,
            suspensionId: "substituted-suspension",
            gatewayInstanceId: "substituted-gateway-instance",
            gatewayPid: plan.predecessor.pid,
            launchdRunCount: plan.predecessor.runCount,
            expiresAtMs: Date.parse("2026-07-28T08:32:00.000Z"),
            suspendMode: "handoff-durable-hold/v1",
            resumeState: "held",
            resumeBeforeMs: null,
          }),
        );
      }
      const second = createRuntime(plan, {
        existingGlobalClaim: globalClaim[1],
        existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
        existingFiles,
        initialEnabled: true,
        initialLoaded: true,
      });

      if (condition === "missing") {
        expect(
          executeHostActivation({
            planBytes,
            expectedPlanSha256: hash(planBytes),
            execute: true,
            runtime: second.runtime,
          }),
        ).toMatchObject({
          outcome: "HOLD",
          holdReason: expect.stringContaining(
            "durable suspension-prepared recovery handoff is missing",
          ),
        });
        expect(second.commands.some(({ args }) => args.includes("gateway.suspend.prepare"))).toBe(
          false,
        );
      } else {
        let recoveryError: unknown;
        try {
          executeHostActivation({
            planBytes,
            expectedPlanSha256: hash(planBytes),
            execute: true,
            runtime: second.runtime,
          });
        } catch (error) {
          recoveryError = error;
        }
        expect(recoveryError).toMatchObject({
          message: "Gateway suspension handoff recovery could not be proven durable",
          cause: {
            message: "handoff does not preserve the durable suspension-prepared identity",
          },
        });
      }
      expect(second.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
        false,
      );
    },
  );

  it("does not claim replacement absence when the planned Gateway command still runs", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { failWritePhase: "predecessor-stopped-proven" });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-stopped-proven could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
      initialEnabled: false,
      initialLoaded: false,
      replacementProcessCommand: plan.successor.expectedProcessCommand,
    });

    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { enableCount: 0, bootstrapCount: 0 },
      holdReason: expect.stringContaining("replacement Gateway process remains"),
    });
    expect(
      second.commands.some(({ args }) => args[0] === "enable" || args[0] === "bootstrap"),
    ).toBe(false);
  });

  it("returns an exact completed success receipt on dead-owner re-entry", () => {
    const plan = fixturePlan();
    const first = executeFixture(plan);
    const globalClaim = [...first.fixture.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    );
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim![1],
      existingLedger: ledgerEntriesFromWrites(first.fixture.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.fixture.writes,
    });
    const planBytes = canonicalJsonBytes(plan);
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });
    expect(receipt).toEqual(first.receipt);
    expect(second.runtime.writeExclusive).not.toHaveBeenCalled();
  });

  it("repairs delayed HOLD evidence after the plan expires without changing its interval", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, {
      suspensionBusy: true,
      failWritePath: plan.evidence.receiptPath,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: first.runtime,
      }),
    ).toThrow("activation receipt could not be proven durable");
    const globalClaim = [...first.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      initialNowMs: Date.parse("2026-07-28T11:00:00.000Z"),
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.writes,
    });
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      startedAt: "2026-07-28T08:30:00.000Z",
    });
    expect(Date.parse(receipt.completedAt as string)).toBeGreaterThanOrEqual(
      Date.parse(receipt.startedAt as string),
    );
  });

  it("returns an exact completed success receipt after the plan expires", () => {
    const plan = fixturePlan();
    const first = executeFixture(plan);
    const globalClaim = [...first.fixture.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      initialNowMs: Date.parse("2026-07-28T11:00:00.000Z"),
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.fixture.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.fixture.writes,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      }),
    ).toEqual(first.receipt);
  });

  it("refuses a recovered non-claim phase that cannot be freshly re-fsynced", () => {
    const plan = fixturePlan();
    const first = executeFixture(plan, {
      failCommand: (_command, args) =>
        args[0] === "disable" ? "injected disable failure" : undefined,
    });
    const globalClaim = [...first.fixture.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const phasePath = `${plan.evidence.ledgerDirectory}/01-predecessor-plist-preserved.json`;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.fixture.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.fixture.writes,
      failEnsureFileDurablePath: phasePath,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      }),
    ).toThrow(
      "recovered activation ledger phase predecessor-plist-preserved could not be proven durable",
    );
  });

  it("refuses a completed SUCCESS receipt that cannot be freshly re-fsynced", () => {
    const plan = fixturePlan();
    const first = executeFixture(plan);
    const globalClaim = [...first.fixture.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: ledgerEntriesFromWrites(first.fixture.writes, plan.evidence.ledgerDirectory),
      existingFiles: first.fixture.writes,
      failEnsureFileDurablePath: plan.evidence.receiptPath,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      }),
    ).toThrow("activation receipt could not be proven durable");
  });

  it("terminalizes a crash during an existing pre-bootout recovery prefix", () => {
    const plan = fixturePlan();
    const first = executeFixture(plan, {
      failCommand: (_command, args) =>
        args[0] === "disable" ? "injected disable failure" : undefined,
    });
    const globalClaim = [...first.fixture.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const recoveryPrefix = ledgerEntriesFromWrites(
      first.fixture.writes,
      plan.evidence.ledgerDirectory,
    ).filter(
      ({ entry }) =>
        entry.phase !== "pre-bootout-durable-suspension-retained" && entry.phase !== "hold",
    );
    const existingFiles = new Map(
      [...first.fixture.writes.entries()].filter(
        ([filePath]) =>
          filePath !== plan.evidence.receiptPath && filePath !== plan.evidence.rollbackPacketPath,
      ),
    );
    restoreSuspensionPreparedHandoff(plan, recoveryPrefix, existingFiles);
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: recoveryPrefix,
      existingFiles,
    });
    const planBytes = canonicalJsonBytes(plan);
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });
    expect(receipt.outcome).toBe("HOLD");
    expect(recoveryPhaseNames(receipt)).toEqual([
      "pre-bootout-reenable-requested",
      "pre-bootout-reenabled-same-predecessor-proven",
      "pre-bootout-durable-suspension-retained",
    ]);
  });

  it.each([
    ["before", "suspension-prepared", true],
    ["after", "disable-requested", false],
  ])(
    "recovers a second-process crash %s suspension-prepared",
    (_position, failedPhase, removeHandoff) => {
      const plan = fixturePlan();
      const first = createRuntime(plan, { failWritePhase: failedPhase });
      const planBytes = canonicalJsonBytes(plan);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: hash(planBytes),
          execute: true,
          runtime: first.runtime,
        }),
      ).toThrow(`activation ledger phase ${failedPhase} could not be proven durable`);
      const globalClaim = [...first.writes.entries()].find(([filePath]) =>
        filePath.includes("handoff-v2-lifecycle-"),
      )!;
      const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
      const existingFiles = new Map(first.writes);
      if (removeHandoff) {
        existingFiles.delete(handoffPath);
      }
      const second = createRuntime(plan, {
        existingGlobalClaim: globalClaim[1],
        existingLedger: ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory),
        existingFiles,
      });
      const receipt = executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: second.runtime,
      });
      expect(receipt.outcome).toBe("HOLD");
      expect(recoveryPhaseNames(receipt)).toEqual([
        "pre-bootout-service-loaded-proven",
        "pre-bootout-reenabled-same-predecessor-proven",
        ...(removeHandoff ? [] : ["pre-bootout-durable-suspension-retained"]),
      ]);
      expect(second.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
        false,
      );
      expect(second.runtime.readOptionalFile(handoffPath, "test handoff") === null).toBe(
        removeHandoff,
      );
      const validateReceipt = compileContractSchema(
        "handoff-v2-host-activation-receipt.v1.schema.json",
      );
      expect(validateReceipt(receipt), JSON.stringify(validateReceipt.errors)).toBe(true);
    },
  );

  it.each([
    [["pre-bootout-reenable-requested"]],
    [["pre-bootout-reenable-requested", "pre-bootout-reenabled-same-predecessor-proven"]],
  ])("terminalizes the valid partial recovery prefix %j", (expectedRecoveryPhases) => {
    const plan = fixturePlan();
    const first = executeFixture(plan, {
      failCommand: (_command, args) =>
        args[0] === "disable" ? "injected disable failure" : undefined,
    });
    const globalClaim = [...first.fixture.writes.entries()].find(([filePath]) =>
      filePath.includes("handoff-v2-lifecycle-"),
    )!;
    const durableEntries = ledgerEntriesFromWrites(
      first.fixture.writes,
      plan.evidence.ledgerDirectory,
    );
    const recoveryPrefix = durableEntries.filter(({ entry }) => {
      if (!entry.phase.startsWith("pre-bootout-")) {
        return entry.phase !== "hold";
      }
      return expectedRecoveryPhases.includes(entry.phase);
    });
    const existingFiles = new Map(
      [...first.fixture.writes.entries()].filter(
        ([filePath]) =>
          filePath !== plan.evidence.receiptPath && filePath !== plan.evidence.rollbackPacketPath,
      ),
    );
    restoreSuspensionPreparedHandoff(plan, recoveryPrefix, existingFiles);
    const second = createRuntime(plan, {
      existingGlobalClaim: globalClaim[1],
      existingLedger: recoveryPrefix,
      existingFiles,
    });
    const planBytes = canonicalJsonBytes(plan);
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: second.runtime,
    });
    expect(receipt.outcome).toBe("HOLD");
    expect(recoveryPhaseNames(receipt)).toEqual([
      ...expectedRecoveryPhases,
      ...(expectedRecoveryPhases.includes("pre-bootout-reenabled-same-predecessor-proven")
        ? []
        : ["pre-bootout-reenabled-same-predecessor-proven"]),
      "pre-bootout-durable-suspension-retained",
    ]);
  });

  it("accepts an exact exposed phase only after re-fsyncing it", () => {
    const plan = fixturePlan();
    const phasePath = `${plan.evidence.ledgerDirectory}/01-predecessor-plist-preserved.json`;
    const { fixture, receipt } = executeFixture(plan, {
      ambiguousWritePath: phasePath,
    });
    expect(receipt.outcome).toBe("ACTIVATED_VERIFIED");
    expect(fixture.runtime.ensureFileDurable).toHaveBeenCalledWith(phasePath);
  });

  it("rejects an exposed phase whose bytes change during durability sync", () => {
    const plan = fixturePlan();
    const phasePath = `${plan.evidence.ledgerDirectory}/01-predecessor-plist-preserved.json`;
    const fixture = createRuntime(plan, {
      ambiguousWritePath: phasePath,
      mutateDuringEnsureFileDurablePath: phasePath,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-plist-preserved could not be proven durable");
    expect([...fixture.writes.keys()].some((filePath) => filePath.endsWith("-hold.json"))).toBe(
      false,
    );
  });

  it("turns an ambiguity-read failure into a non-forking phase persistence error", () => {
    const plan = fixturePlan();
    const phasePath = `${plan.evidence.ledgerDirectory}/01-predecessor-plist-preserved.json`;
    const fixture = createRuntime(plan, {
      ambiguousWritePath: phasePath,
      failReadAfterWritePath: phasePath,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("activation ledger phase predecessor-plist-preserved could not be proven durable");
    expect([...fixture.writes.keys()].some((filePath) => filePath.endsWith("-hold.json"))).toBe(
      false,
    );
  });

  it.each([
    [
      "ledger claim",
      (plan: ReturnType<typeof fixturePlan>) => `${plan.evidence.ledgerDirectory}/00-claim.json`,
      false,
    ],
    [
      "rollback packet",
      (plan: ReturnType<typeof fixturePlan>) => plan.evidence.rollbackPacketPath,
      true,
    ],
    [
      "activation receipt",
      (plan: ReturnType<typeof fixturePlan>) => plan.evidence.receiptPath,
      false,
    ],
  ])(
    "rejects ambiguous %s bytes changed during durability sync",
    (_label, resolvePath, suspensionBusy) => {
      const plan = fixturePlan();
      const targetPath = resolvePath(plan);
      const fixture = createRuntime(plan, {
        suspensionBusy,
        ambiguousWritePath: targetPath,
        mutateDuringEnsureFileDurablePath: targetPath,
      });
      const planBytes = canonicalJsonBytes(plan);
      expect(() =>
        executeHostActivation({
          planBytes,
          expectedPlanSha256: hash(planBytes),
          execute: true,
          runtime: fixture.runtime,
        }),
      ).toThrow("could not be proven durable");
    },
  );

  it("refuses a lifecycle mutation without a full command-duration authority margin", () => {
    const plan = fixturePlan();
    const { fixture, receipt } = executeFixture(plan, {
      initialNowMs: Date.parse(plan.expiresAt) - 29_999,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { disableCount: 1, bootoutCount: 0 },
      holdReason: expect.stringContaining("outside the active plan and guard window"),
    });
    expect(
      fixture.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "disable",
      ),
    ).toBe(false);
  });

  it.each([
    ["bootout", "disable", "bootout"],
    ["plist installation", "bootout", "install"],
    ["enable", "install", "enable"],
    ["bootstrap", "enable", "bootstrap"],
  ])(
    "refuses %s without a full command-duration authority margin",
    (_label, advanceAfter, forbiddenMutation) => {
      const plan = fixturePlan();
      const fixture = createRuntime(plan);
      const exhaustAuthorityMargin = () => {
        const remaining = Date.parse(plan.expiresAt) - Date.parse(fixture.runtime.now()) - 29_999;
        fixture.runtime.sleep(remaining);
      };
      if (advanceAfter === "install") {
        vi.mocked(fixture.runtime.installFile).mockImplementation(() => {
          exhaustAuthorityMargin();
        });
      } else {
        const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
        vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
          const result = base(command, args, options);
          if (command === "/bin/launchctl" && args[0] === advanceAfter) {
            exhaustAuthorityMargin();
          }
          return result;
        });
      }
      const receipt = executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      });
      expect(receipt).toMatchObject({
        outcome: "HOLD",
        holdReason: expect.stringContaining("outside the active plan and guard window"),
      });
      if (forbiddenMutation === "install") {
        expect(fixture.runtime.installFile).not.toHaveBeenCalled();
      } else {
        expect(
          fixture.commands.some(
            ({ command, args }) => command === "/bin/launchctl" && args[0] === forbiddenMutation,
          ),
        ).toBe(false);
      }
    },
  );

  it("returns an exact visible SUCCESS receipt after ambiguous directory fsync", () => {
    const plan = fixturePlan();
    const first = createRuntime(plan, { ambiguousWritePath: plan.evidence.receiptPath });
    const planBytes = canonicalJsonBytes(plan);
    const receipt = executeHostActivation({
      planBytes,
      expectedPlanSha256: hash(planBytes),
      execute: true,
      runtime: first.runtime,
    });
    expect(receipt.outcome).toBe("ACTIVATED_VERIFIED");
    expect(first.runtime.ensureFileDurable).toHaveBeenCalledWith(plan.evidence.receiptPath);
    expect(
      ledgerEntriesFromWrites(first.writes, plan.evidence.ledgerDirectory).at(-1)?.entry.phase,
    ).toBe("successor-suspension-held-proven");
  });

  it("does not invoke durable resume even when the mocked resume would fail", () => {
    const plan = fixturePlan();
    const { fixture, receipt } = executeFixture(plan, { resumeReturnsFalse: true });
    expect(receipt).toMatchObject({ outcome: "ACTIVATED_VERIFIED" });
    expect(
      ledgerEntriesFromWrites(fixture.writes, plan.evidence.ledgerDirectory).some(
        ({ entry }) => entry.phase === "successor-suspension-held-proven",
      ),
    ).toBe(true);
    expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
      false,
    );
    expect(fixture.runtime.removeFileDurably).not.toHaveBeenCalledWith(
      `${plan.host.stateDir}/gateway-suspend-handoff.json`,
    );
    expect(
      fixture.runtime.readOptionalFile(
        `${plan.host.stateDir}/gateway-suspend-handoff.json`,
        "retained successor handoff",
      ),
    ).not.toBeNull();
  });

  it("refuses to recover an exact-plan claim while its executor is alive", () => {
    const plan = fixturePlan();
    const planBytes = canonicalJsonBytes(plan);
    const planSha256 = hash(planBytes);
    const claim = canonicalJsonBytes({
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256,
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    });
    const fixture = createRuntime(plan, { existingGlobalClaim: claim, claimOwnerAlive: true });
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: planSha256,
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("claim owner remains alive");
    expect(fixture.writes.size).toBe(0);
  });

  it("rejects an exact-plan claim whose predecessor or lease binding differs", () => {
    const plan = fixturePlan();
    const planBytes = canonicalJsonBytes(plan);
    const claim = canonicalJsonBytes({
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: plan.planId,
      planSha256: hash(planBytes),
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid + 1,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    });
    const fixture = createRuntime(plan, { existingGlobalClaim: claim });
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("another plan");
  });

  it("rejects a plist whose environment is not bound to the plan", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, {
      environmentOverrides: {
        OPENCLAW_CONFIG_PATH: "/tmp/wrong-config.json",
      },
    });
    expect(() =>
      executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("OPENCLAW_CONFIG_PATH");
    expect(fixture.writes.size).toBe(0);
  });

  it("rejects hash-bound plists whose Label differs from the planned service", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, {
      plistLabelOverride: "ai.openclaw.unplanned",
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("Label does not match");
    expect(fixture.writes.size).toBe(0);
  });

  it("rejects additional successor exports that differ from the predecessor", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.verifyFile).getMockImplementation()!;
    vi.mocked(fixture.runtime.verifyFile).mockImplementation((filePath, digest, description) => {
      const bytes = base(filePath, digest, description);
      if (filePath !== plan.successor.environmentFilePath) {
        return bytes;
      }
      return Buffer.from(
        bytes.toString("utf8").replace("\n", "\nexport EXTRA_SETTING='changed'\n"),
      );
    });
    expect(() =>
      executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("environment exports differ");
    expect(fixture.writes.size).toBe(0);
  });

  it("uses one lifecycle claim for the same launchd target regardless of planned port", () => {
    const first = executeFixture();
    const secondPlan = fixturePlan();
    secondPlan.host.gatewayPort += 1;
    const second = executeFixture(secondPlan);
    const claimPath = (fixture: ReturnType<typeof createRuntime>) =>
      vi
        .mocked(fixture.runtime.writeExclusive)
        .mock.calls.map(([filePath]) => filePath)
        .find((filePath) => filePath.includes("handoff-v2-lifecycle-"));
    expect(claimPath(first.fixture)).toBe(claimPath(second.fixture));
  });

  it("refuses lifecycle mutation unless Gateway suspension closes work admission", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), { suspensionBusy: true });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "Gateway suspension did not establish an idle admission fence",
    });
    expect(
      fixture.commands.some(
        ({ command, args }) =>
          command === "/bin/launchctl" &&
          ["disable", "bootout", "enable", "bootstrap"].includes(args[0] ?? ""),
      ),
    ).toBe(false);
  });

  it("decodes only descriptor-verified plist bytes through plutil stdin", () => {
    const { fixture } = executeFixture();
    const plistInspections = fixture.commands.filter(
      ({ command }) => command === "/usr/bin/plutil",
    );
    expect(plistInspections.length).toBeGreaterThanOrEqual(4);
    for (const inspection of plistInspections) {
      expect(inspection.args).toEqual(["-convert", "json", "-o", "-", "-"]);
      expect(Buffer.isBuffer(inspection.options?.input)).toBe(true);
    }
  });

  it("refuses a service-global claim owned by another plan", () => {
    const plan = fixturePlan();
    const foreignClaim = canonicalJsonBytes({
      schema: "handoff-v2-host-activation-ledger-phase/v1",
      planId: "foreign-plan",
      planSha256: sha("f"),
      sequence: 0,
      phase: "claim",
      at: "2026-07-28T08:29:00.000Z",
      detail: {
        launchdDomain: plan.host.launchdDomain,
        launchdLabel: plan.host.launchdLabel,
        executorPid: 9_000,
        predecessorPid: plan.predecessor.pid,
        predecessorRunCount: plan.predecessor.runCount,
        supervisorLeaseSha256: plan.evidence.supervisorLeaseSha256,
      },
    });
    const fixture = createRuntime(plan, { existingGlobalClaim: foreignClaim });
    expect(() =>
      executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("another plan");
    expect(fixture.commands).toHaveLength(0);
  });

  it("refuses an insecure ledger directory before any probe", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, { insecureDirectory: plan.evidence.ledgerDirectory });
    expect(() =>
      executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("insecure directory");
    expect(fixture.commands).toHaveLength(0);
  });

  it("records HOLD before plist replacement when the installed-parent chain is unsafe", () => {
    const plan = fixturePlan();
    const { receipt, fixture } = executeFixture(plan, {
      insecureDirectoryChain: `${plan.host.homePath}/Library/LaunchAgents`,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "unsafe directory chain",
      operations: { bootoutCount: 1, bootstrapCount: 0 },
    });
    expect(fixture.runtime.installFile).not.toHaveBeenCalled();
  });

  it("preserves exact predecessor plist bytes before acquiring the lifecycle claim", () => {
    const { fixture } = executeFixture();
    const preserveOrder = vi.mocked(fixture.runtime.preserveFile).mock.invocationCallOrder[0]!;
    const firstClaimWriteOrder = vi.mocked(fixture.runtime.writeExclusive).mock
      .invocationCallOrder[0]!;
    expect(preserveOrder).toBeLessThan(firstClaimWriteOrder);
  });

  it("reuses an exact backup stranded before claim acquisition", () => {
    const plan = fixturePlan();
    const backup = Buffer.from("stranded-exact-predecessor-plist");
    plan.predecessor.servicePlistSha256 = hash(backup);
    const { fixture, receipt } = executeFixture(plan, { existingPlistBackup: backup });
    expect(receipt.outcome).toBe("ACTIVATED_VERIFIED");
    expect(fixture.runtime.preserveFile).not.toHaveBeenCalled();
    expect(fixture.runtime.ensureFileDurable).toHaveBeenCalledWith(
      plan.evidence.predecessorPlistBackupPath,
    );
  });

  it("refuses a stranded backup whose file and parent durability cannot be renewed", () => {
    const plan = fixturePlan();
    const backup = Buffer.from("stranded-exact-predecessor-plist");
    plan.predecessor.servicePlistSha256 = hash(backup);
    const fixture = createRuntime(plan, {
      existingPlistBackup: backup,
      failEnsureFileDurable: true,
    });
    const planBytes = canonicalJsonBytes(plan);
    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow("backup durability failure");
    expect(
      [...fixture.writes.keys()].some((filePath) => filePath.includes("handoff-v2-lifecycle-")),
    ).toBe(false);
  });

  it("rechecks task quiescence after claiming and immediately before disable", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    let taskReads = 0;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      if (args.includes("tasks")) {
        taskReads += 1;
        if (taskReads === 2) {
          fixture.commands.push({ command, args, options });
          return {
            status: 0,
            stdout: JSON.stringify({ tasks: [{ status: "running", runId: "late-run" }] }),
            stderr: "",
          };
        }
      }
      return base(command, args, options);
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "active background tasks are present",
      operations: { disableCount: 0, bootoutCount: 0 },
    });
    expect(fixture.commands.some(({ args }) => args[0] === "disable")).toBe(false);
  });

  it("counts a durable one-use request when authority fails before launchctl", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.verifyFile).getMockImplementation()!;
    vi.mocked(fixture.runtime.verifyFile).mockImplementation((filePath, digest, description) => {
      const disableRequested = [...fixture.writes.keys()].some((entry) =>
        entry.endsWith("-disable-requested.json"),
      );
      if (filePath === plan.guard.path && disableRequested) {
        throw new Error("injected guard expiry after durable disable request");
      }
      return base(filePath, digest, description);
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { disableCount: 1, bootoutCount: 0 },
      holdReason: expect.stringContaining("injected guard expiry after durable disable request"),
    });
    expect(
      fixture.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "disable",
      ),
    ).toBe(false);
  });

  it("records marker-bearing rollback risk truthfully if durable state changes after claim", () => {
    const { plan, fixture, receipt } = executeFixture(fixturePlan(), {
      unsafeAtJobAfterClaim: true,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("startupInterruptedRunAtMs"),
      operations: { disableCount: 0, bootoutCount: 0 },
    });
    const rollback = JSON.parse(
      fixture.writes.get(plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    expect(rollback).toMatchObject({
      atJobSafety: {
        unsafeEnabledAtJobIds: ["unsafe"],
        disposition: "unsafe_marker_requires_manual_migration",
      },
      predecessorPlistBackup: { markerBearingAtJobsMayRun: true },
    });
  });

  it("recovers the same predecessor if disable fails before bootout, then records HOLD", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {
      failCommand: (command, args) =>
        command === "/bin/launchctl" && args[0] === "disable" ? "ambiguous" : undefined,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { disableCount: 1, enableCount: 1, bootoutCount: 0 },
    });
    expect(
      fixture.commands.filter(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
      ),
    ).toHaveLength(1);
    expect(
      [...fixture.writes.keys()].some((entry) =>
        entry.endsWith("pre-bootout-reenabled-same-predecessor-proven.json"),
      ),
    ).toBe(true);
  });

  it("renews the same suspension immediately before lifecycle and recovery mutations", () => {
    const { plan, fixture } = executeFixture(fixturePlan(), {
      failCommand: (command, args) =>
        command === "/bin/launchctl" && args[0] === "disable" ? "ambiguous" : undefined,
    });
    const prepareCalls = fixture.commands.filter(({ args }) =>
      args.includes("gateway.suspend.prepare"),
    );
    expect(prepareCalls).toHaveLength(3);
    for (const [index, call] of prepareCalls.entries()) {
      const params = JSON.parse(call.args[call.args.indexOf("--params") + 1]!);
      expect(params).toMatchObject({ requestId: `handoff-v2:${plan.planId}` });
      if (index === 0) {
        expect(params).not.toHaveProperty("gatewayInstanceId");
      } else {
        expect(params.gatewayInstanceId).toBe("fixture-predecessor-gateway-instance");
      }
    }
    const enableIndex = fixture.commands.findIndex(
      ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
    );
    expect(enableIndex).toBeGreaterThan(0);
    expect(fixture.commands[enableIndex - 1]?.args).toContain("gateway.suspend.prepare");
  });

  it("does not resume ordinary recovery when predecessor enable recovery fails", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {
      failCommand: (command, args) =>
        command === "/bin/launchctl" && (args[0] === "disable" || args[0] === "enable")
          ? "ambiguous"
          : undefined,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("pre-bootout recovery enable failed or was ambiguous"),
    });
    expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
      false,
    );
  });

  it("rechecks ordinary recovery authority after its durable request phase", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {
      failCommand: (command, args) =>
        command === "/bin/launchctl" && args[0] === "disable" ? "ambiguous" : undefined,
      advanceAfterWritePhase: {
        phase: "pre-bootout-reenable-requested",
        milliseconds: 6_000_000,
      },
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("outside the active plan and guard window"),
    });
    expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
      false,
    );
  });

  it("rejects a predecessor replacement during ordinary recovery renewal", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, {
      failCommand: (command, args) =>
        command === "/bin/launchctl" && args[0] === "disable" ? "ambiguous" : undefined,
    });
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    let prepareCalls = 0;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      const result = base(command, args, options);
      if (args.includes("gateway.suspend.prepare")) {
        prepareCalls += 1;
        if (prepareCalls === 3) {
          const body = JSON.parse(result.stdout);
          body.gatewayInstanceId = "replacement-gateway-instance";
          return { ...result, stdout: JSON.stringify(body) };
        }
      }
      return result;
    });

    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining(
        "Gateway suspension admission fence could not be renewed for the mutation",
      ),
    });
    expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
      false,
    );
  });

  it.each([
    ["re-enabled proof", "05-pre-bootout-reenabled-same-predecessor-proven.json"],
    ["durable suspension-retained proof", "06-pre-bootout-durable-suspension-retained.json"],
  ])("propagates ordinary %s ambiguity without appending HOLD", (_label, phaseFile) => {
    const plan = fixturePlan();
    const phasePath = `${plan.evidence.ledgerDirectory}/${phaseFile}`;
    const fixture = createRuntime(plan, {
      failCommand: (command, args) =>
        command === "/bin/launchctl" && args[0] === "disable" ? "ambiguous" : undefined,
      ambiguousWritePath: phasePath,
      failReadAfterWritePath: phasePath,
    });
    const planBytes = canonicalJsonBytes(plan);

    expect(() =>
      executeHostActivation({
        planBytes,
        expectedPlanSha256: hash(planBytes),
        execute: true,
        runtime: fixture.runtime,
      }),
    ).toThrow(`activation ledger phase ${phaseFile.slice(3, -5)} could not be proven durable`);
    expect([...fixture.writes.keys()].some((filePath) => filePath.endsWith("-hold.json"))).toBe(
      false,
    );
  });

  it("proves the Gateway-authored durable handoff before bootout without rewriting it", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
    let handoffAtBootout: Record<string, unknown> | null = null;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      if (command === "/bin/launchctl" && args[0] === "bootout") {
        handoffAtBootout = JSON.parse(fixture.writes.get(handoffPath)!.toString("utf8"));
      }
      return base(command, args, options);
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt.outcome).toBe("ACTIVATED_VERIFIED");
    expect(handoffAtBootout).toEqual({
      schema: "openclaw-gateway-suspend-handoff/v3",
      requestId: `handoff-v2:${plan.planId}`,
      suspensionId: "fixture-suspension",
      gatewayInstanceId: "fixture-predecessor-gateway-instance",
      gatewayPid: plan.predecessor.pid,
      launchdRunCount: plan.predecessor.runCount,
      expiresAtMs: expect.any(Number),
      suspendMode: "handoff-durable-hold/v1",
      resumeState: "held",
      resumeBeforeMs: null,
    });
    expect(fixture.runtime.writeExclusive).not.toHaveBeenCalledWith(
      handoffPath,
      expect.any(Buffer),
    );
  });

  it("rejects a successor that does not adopt the predecessor suspension identity", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {
      successorSuspensionId: "fresh-successor-suspension",
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "Gateway suspension did not establish an idle admission fence",
    });
    const prepareCalls = fixture.commands.filter(({ args }) =>
      args.includes("gateway.suspend.prepare"),
    );
    expect(prepareCalls.length).toBeGreaterThan(2);
  });

  it("refuses bootstrap when the offline handoff lacks a complete startup window", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      const result = base(command, args, options);
      if (command === "/bin/launchctl" && args[0] === "enable") {
        fixture.runtime.sleep(90_001);
      }
      return result;
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("lacks a complete durable suspension handoff window"),
    });
    expect(
      fixture.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "bootstrap",
      ),
    ).toBe(false);
  });

  it("rechecks the complete startup window after handoff fsync and reread", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const handoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
    const ensureDurable = vi.mocked(fixture.runtime.ensureFileDurable).getMockImplementation()!;
    let advancedDuringFinalProof = false;
    vi.mocked(fixture.runtime.ensureFileDurable).mockImplementation((filePath) => {
      ensureDurable(filePath);
      const enabled = fixture.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "enable",
      );
      const bootstrapped = fixture.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "bootstrap",
      );
      if (filePath === handoffPath && enabled && !bootstrapped && !advancedDuringFinalProof) {
        advancedDuringFinalProof = true;
        fixture.runtime.sleep(90_001);
      }
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(advancedDuringFinalProof).toBe(true);
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("lacks a complete durable suspension handoff window"),
    });
    expect(
      fixture.commands.some(
        ({ command, args }) => command === "/bin/launchctl" && args[0] === "bootstrap",
      ),
    ).toBe(false);
  });

  it("retains the real scheduler admission fence after a gateway lifecycle reset", () => {
    resetGatewaySuspendCoordinatorForLifecycleRestart();
    resetGatewayWorkAdmission();
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const handoffDirectory = mkdtempSync(path.join(tmpdir(), "openclaw-host-handoff-"));
    const durableHandoffPath = path.join(handoffDirectory, "gateway-suspend-handoff.json");
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    const pauseScheduling = vi.fn();
    const resumeScheduling = vi.fn();
    let suspensionGeneration = 0;
    let successorBootstrapped = false;
    let successorFenceObserved = false;
    const predecessorGatewayInstanceId = "real-predecessor-gateway-instance";
    const successorGatewayInstanceId = "real-successor-gateway-instance";
    const planHandoffPath = `${plan.host.stateDir}/gateway-suspend-handoff.json`;
    const readOptionalFile = vi.mocked(fixture.runtime.readOptionalFile).getMockImplementation()!;
    vi.mocked(fixture.runtime.readOptionalFile).mockImplementation((filePath, description) => {
      if (filePath === planHandoffPath) {
        try {
          return readFileSync(durableHandoffPath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return null;
          }
          throw error;
        }
      }
      return readOptionalFile(filePath, description);
    });
    const inspect = {
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
    };
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      if (command === "/bin/launchctl" && args[0] === "bootstrap") {
        const result = base(command, args, options);
        resetGatewaySuspendCoordinatorForLifecycleRestart();
        resetGatewayWorkAdmission();
        adoptGatewaySuspendHandoffAtStartup({
          durableHandoffPath,
          nowMs: () => Date.parse(fixture.runtime.now()),
          currentGatewayInstanceId: successorGatewayInstanceId,
          currentGatewayPid: 5100,
        });
        successorFenceObserved =
          isGatewayWorkAdmissionClosed() && tryBeginGatewayRootWorkAdmission() === null;
        successorBootstrapped = true;
        return result;
      }
      if (args.includes("gateway.suspend.prepare")) {
        fixture.commands.push({ command, args, options });
        const request = JSON.parse(args[args.indexOf("--params") + 1]!);
        const result = prepareGatewaySuspend({
          requestId: request.requestId,
          suspensionId: request.suspensionId,
          gatewayInstanceId: request.gatewayInstanceId,
          gatewayPid: request.gatewayPid,
          launchdRunCount: request.launchdRunCount,
          suspendMode: request.suspendMode,
          currentGatewayInstanceId: successorBootstrapped
            ? successorGatewayInstanceId
            : predecessorGatewayInstanceId,
          currentGatewayPid: successorBootstrapped ? 5100 : plan.predecessor.pid,
          pauseScheduling,
          resumeScheduling,
          inspect,
          nowMs: () => Date.parse(fixture.runtime.now()),
          createSuspensionId: () => {
            suspensionGeneration += 1;
            return `real-coordinator-suspension-${suspensionGeneration}`;
          },
          durableHandoffPath,
        });
        return { status: 0, stdout: JSON.stringify(result), stderr: "" };
      }
      if (args.includes("gateway.suspend.resume")) {
        fixture.commands.push({ command, args, options });
        const request = JSON.parse(args[args.indexOf("--params") + 1]!);
        return {
          status: 0,
          stdout: JSON.stringify(
            resumeGatewaySuspend(
              request,
              successorBootstrapped ? successorGatewayInstanceId : predecessorGatewayInstanceId,
              () => Date.parse(fixture.runtime.now()),
            ),
          ),
          stderr: "",
        };
      }
      if (args.includes("gateway.suspend.status")) {
        fixture.commands.push({ command, args, options });
        const request = JSON.parse(args[args.indexOf("--params") + 1]!);
        return {
          status: 0,
          stdout: JSON.stringify(
            getGatewaySuspendStatus(
              request,
              successorBootstrapped ? successorGatewayInstanceId : predecessorGatewayInstanceId,
              durableHandoffPath,
            ),
          ),
          stderr: "",
        };
      }
      if (successorBootstrapped && args.includes("health")) {
        successorFenceObserved ||= isGatewayWorkAdmissionClosed();
      }
      return base(command, args, options);
    });
    try {
      const receipt = executeHostActivation({
        planBytes: canonicalJsonBytes(plan),
        expectedPlanSha256: hash(canonicalJsonBytes(plan)),
        execute: true,
        runtime: fixture.runtime,
      });
      expect(receipt.outcome).toBe("ACTIVATED_VERIFIED");
      expect(pauseScheduling).toHaveBeenCalledTimes(2);
      expect(resumeScheduling).toHaveBeenCalledTimes(1);
      expect(successorFenceObserved).toBe(true);
      expect(isGatewayWorkAdmissionClosed()).toBe(true);
      expect(
        getGatewaySuspendStatus(
          {
            suspensionId: "real-coordinator-suspension-1",
            gatewayInstanceId: successorGatewayInstanceId,
            suspendMode: "handoff-durable-hold/v1",
          },
          successorGatewayInstanceId,
          durableHandoffPath,
        ),
      ).toMatchObject({
        status: "ready",
        gatewayInstanceId: successorGatewayInstanceId,
        suspendMode: "handoff-durable-hold/v1",
      });
      expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
        false,
      );
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(handoffDirectory, { recursive: true, force: true });
    }
    expect(resumeScheduling).toHaveBeenCalledTimes(2);
  });

  it("proves the controller-authored handoff unchanged before an external paired release", () => {
    resetGatewaySuspendCoordinatorForLifecycleRestart();
    resetGatewayWorkAdmission();
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-handoff-rewrite-"));
    const durableHandoffPath = path.join(directory, "gateway-suspend-handoff.json");
    const plan = fixturePlan();
    plan.host.stateDir = directory;
    const runtime = createDefaultHostActivationRuntime();
    const pauseScheduling = vi.fn();
    const resumeScheduling = vi.fn();
    const gatewayInstanceId = "controller-rewrite-gateway-instance";
    const durableMode = "handoff-durable-hold/v1" as const;
    const nowMs = Date.parse("2026-07-28T08:30:00.000Z");
    try {
      expect(plan.gatewaySuspension.suspendMode).toBe(durableMode);
      const prepared = prepareGatewaySuspend({
        requestId: `handoff-v2:${plan.planId}`,
        gatewayPid: plan.predecessor.pid,
        launchdRunCount: plan.predecessor.runCount,
        suspendMode: durableMode,
        currentGatewayInstanceId: gatewayInstanceId,
        currentGatewayPid: plan.predecessor.pid,
        pauseScheduling,
        resumeScheduling,
        nowMs: () => nowMs,
        createSuspensionId: () => "controller-rewrite-suspension",
        durableHandoffPath,
      });
      expect(prepared).toMatchObject({
        status: "ready",
        suspensionId: "controller-rewrite-suspension",
        gatewayInstanceId,
        suspendMode: plan.gatewaySuspension.suspendMode,
      });
      if (prepared.status !== "ready") {
        throw new Error("test preparation did not establish the durable fence");
      }
      const compactBytes = readFileSync(durableHandoffPath);
      const suspension = {
        requestId: `handoff-v2:${plan.planId}`,
        suspensionId: prepared.suspensionId,
        gatewayInstanceId: prepared.gatewayInstanceId,
        gatewayPid: prepared.gatewayPid,
        launchdRunCount: prepared.launchdRunCount,
        expiresAtMs: prepared.expiresAtMs,
        suspendMode: durableMode,
        handoffSchema: "openclaw-gateway-suspend-handoff/v3" as const,
      };

      proveGatewaySuspendHandoff(plan, suspension, runtime);

      const provenBytes = readFileSync(durableHandoffPath);
      expect(provenBytes).toEqual(compactBytes);
      expect(
        prepareGatewaySuspend({
          requestId: suspension.requestId,
          suspensionId: suspension.suspensionId,
          gatewayInstanceId: suspension.gatewayInstanceId,
          gatewayPid: suspension.gatewayPid,
          launchdRunCount: suspension.launchdRunCount,
          suspendMode: suspension.suspendMode,
          currentGatewayInstanceId: gatewayInstanceId,
          currentGatewayPid: plan.predecessor.pid,
          pauseScheduling,
          resumeScheduling,
          nowMs: () => nowMs + 1_000,
          durableHandoffPath,
        }),
      ).toMatchObject({
        status: "ready",
        suspensionId: suspension.suspensionId,
        suspendMode: suspension.suspendMode,
      });
      const releaseAuthoritySha256 = hash("external-rc15-release");
      const releaseRequestId = `handoff-v2-release:${releaseAuthoritySha256.slice(0, 32)}`;
      expect(
        resumeGatewaySuspend(
          {
            suspensionId: suspension.suspensionId,
            gatewayInstanceId,
            resumeBeforeMs: nowMs + 60_000,
            suspendMode: suspension.suspendMode,
            releaseRequestId,
            releaseAuthoritySha256,
          },
          gatewayInstanceId,
          () => nowMs + 2_000,
          { durableHandoffPath },
        ),
      ).toMatchObject({
        ok: true,
        status: "running",
        resumed: true,
        gatewayInstanceId,
        suspendMode: suspension.suspendMode,
        releaseReceipt: {
          status: "release_completed",
          releaseRequestId,
          releaseAuthoritySha256,
        },
      });
      expect(runtime.readOptionalFile(durableHandoffPath, "test handoff")).toBeNull();
      expect(pauseScheduling).toHaveBeenCalledTimes(1);
      expect(resumeScheduling).toHaveBeenCalledTimes(1);
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("never rewrites a concurrently committed held-to-release-pending transition", () => {
    resetGatewaySuspendCoordinatorForLifecycleRestart();
    resetGatewayWorkAdmission();
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-handoff-release-race-"));
    const durableHandoffPath = path.join(directory, "gateway-suspend-handoff.json");
    const plan = fixturePlan();
    plan.host.stateDir = directory;
    const runtime = createDefaultHostActivationRuntime();
    const nowMs = Date.parse("2026-07-28T08:30:00.000Z");
    try {
      const prepared = prepareGatewaySuspend({
        requestId: `handoff-v2:${plan.planId}`,
        gatewayPid: plan.predecessor.pid,
        launchdRunCount: plan.predecessor.runCount,
        suspendMode: "handoff-durable-hold/v1",
        currentGatewayInstanceId: "release-race-gateway-instance",
        currentGatewayPid: plan.predecessor.pid,
        pauseScheduling: vi.fn(),
        resumeScheduling: vi.fn(),
        nowMs: () => nowMs,
        createSuspensionId: () => "release-race-suspension",
        durableHandoffPath,
      });
      if (prepared.status !== "ready") {
        throw new Error("test preparation did not establish the durable fence");
      }
      const active = readDurableHandoff(durableHandoffPath);
      if (!active) {
        throw new Error("test durable handoff is missing");
      }
      const releaseAuthoritySha256 = hash("concurrent-external-release");
      beginDurableHandoffRelease({
        path: durableHandoffPath,
        expected: active.handoff,
        releaseRequestId: `handoff-v2-release:${releaseAuthoritySha256.slice(0, 32)}`,
        releaseAuthoritySha256,
        resumeBeforeMs: nowMs + 60_000,
        committedAtMs: nowMs + 1_000,
      });
      const pendingBytes = readFileSync(durableHandoffPath);
      expect(() =>
        proveGatewaySuspendHandoff(
          plan,
          {
            requestId: `handoff-v2:${plan.planId}`,
            suspensionId: prepared.suspensionId,
            gatewayInstanceId: prepared.gatewayInstanceId,
            gatewayPid: prepared.gatewayPid,
            launchdRunCount: prepared.launchdRunCount,
            expiresAtMs: prepared.expiresAtMs,
            suspendMode: "handoff-durable-hold/v1",
            handoffSchema: "openclaw-gateway-suspend-handoff/v3",
          },
          runtime,
        ),
      ).toThrow("Gateway suspension handoff keys must be exactly");
      expect(readFileSync(durableHandoffPath)).toEqual(pendingBytes);
      expect(readDurableHandoff(durableHandoffPath)?.handoff).toMatchObject({
        resumeState: "release-pending",
        releaseAuthoritySha256,
      });
    } finally {
      resetGatewaySuspendCoordinatorForLifecycleRestart();
      resetGatewayWorkAdmission();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("rechecks full successor authority before recording the held fence", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {
      advanceAfterWritePhase: {
        phase: "stability-window-proven",
        milliseconds: 6_000_000,
      },
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("outside the active plan and guard window"),
    });
    expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
      false,
    );
  });

  it("rejects successor replacement during the final held-status proof", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      const result = base(command, args, options);
      const finalHeldProofStarted = [...fixture.writes.keys()].some((filePath) =>
        filePath.endsWith("-stability-window-proven.json"),
      );
      if (finalHeldProofStarted && args.includes("gateway.suspend.status")) {
        const body = JSON.parse(result.stdout);
        body.gatewayInstanceId = "replacement-successor-gateway-instance";
        return { ...result, stdout: JSON.stringify(body) };
      }
      return result;
    });

    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });

    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining(
        "successful host activation does not have an active ready suspension",
      ),
    });
    expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(
      false,
    );
  });

  it("leaves final release to the external paired-release controller", () => {
    const { fixture, receipt } = executeFixture(fixturePlan(), {
      advanceBeforeGatewayResumeMs: 6_000_000,
    });

    expect(receipt).toMatchObject({ outcome: "ACTIVATED_VERIFIED" });
    const resume = fixture.commands.find(({ args }) => args.includes("gateway.suspend.resume"));
    expect(resume).toBeUndefined();
    expect(
      ledgerEntriesFromWrites(fixture.writes, fixturePlan().evidence.ledgerDirectory).at(-1)?.entry
        .phase,
    ).toBe("successor-suspension-held-proven");
  });

  it("does not expose successor proofs if the postflight phase cannot be persisted", () => {
    expect(() =>
      executeFixture(fixturePlan(), {
        failWritePhase: "postflight-initial-proven",
      }),
    ).toThrow("activation ledger phase postflight-initial-proven could not be proven durable");
  });

  it("attempts same-process recovery when disable-state proof fails before bootout", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    let enabledReads = 0;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      if (command === "/bin/launchctl" && args[0] === "print-disabled") {
        enabledReads += 1;
        if (enabledReads === 2) {
          fixture.commands.push({ command, args });
          return { status: 1, stdout: "", stderr: "injected proof failure" };
        }
      }
      return base(command, args, options);
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      operations: { disableCount: 1, enableCount: 1, bootoutCount: 0 },
    });
    expect(fixture.commands.filter(({ args }) => args[0] === "enable")).toHaveLength(1);
  });

  it.each([
    [
      "bootout nonzero",
      (command: string, args: string[]) => command === "/bin/launchctl" && args[0] === "bootout",
    ],
    [
      "bootstrap nonzero",
      (command: string, args: string[]) => command === "/bin/launchctl" && args[0] === "bootstrap",
    ],
  ])("records one-use HOLD without retry on %s", (_label, match) => {
    const { plan, fixture, receipt } = executeFixture(fixturePlan(), {
      failCommand: (command, args) => (match(command, args) ? "injected" : undefined),
    });
    expect(receipt).toMatchObject({ outcome: "HOLD" });
    expect(fixture.writes.has(plan.evidence.rollbackPacketPath)).toBe(true);
    expect(fixture.commands.filter(({ args }) => args[0] === "bootout")).toHaveLength(1);
    expect(fixture.commands.filter(({ args }) => args[0] === "bootstrap")).toHaveLength(
      _label.startsWith("bootstrap") ? 1 : 0,
    );
    const rollback = JSON.parse(
      fixture.writes.get(plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    expect(rollback).toMatchObject({
      policy: {
        automaticExecution: false,
        automaticRestart: false,
        requiredDisposition: "HOLD_FOR_SEPARATE_MANUAL_AUTHORIZATION",
      },
      atJobSafety: { marker: "state.startupInterruptedRunAtMs:absent" },
      predecessorPlistBackup: {
        createdBeforeLifecycle: true,
        markerBearingAtJobsMayRun: false,
      },
    });
  });

  it.each([
    ["service-unloaded proof", { ambiguousServiceAbsence: true }],
    ["PID-dead proof", { ambiguousPidAbsence: true }],
    ["port-free proof", { ambiguousPortAbsence: true }],
  ])("holds on ambiguous %s", (_label, options) => {
    const { fixture, receipt } = executeFixture(fixturePlan(), options);
    expect(receipt).toMatchObject({ outcome: "HOLD" });
    expect(fixture.runtime.installFile).not.toHaveBeenCalled();
  });

  it("holds when the successor PID drifts during the 60-second stability window", () => {
    const { receipt } = executeFixture(fixturePlan(), { driftStablePid: true });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: "successor changed during the mandatory stability window",
    });
    expect(receipt.proofs).toMatchObject({ observedAt: "2026-07-28T08:30:00.000Z" });
    expect(receipt.proofs).not.toHaveProperty("stabilityWindowMs");
  });

  it("checks the successor continuously and retains observed identity if authority expires", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    let elapsed = false;
    vi.mocked(fixture.runtime.sleep).mockImplementation(() => {
      elapsed = true;
    });
    vi.mocked(fixture.runtime.now).mockImplementation(() =>
      elapsed ? "2026-07-28T10:00:00.001Z" : "2026-07-28T08:30:00.000Z",
    );
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({
      outcome: "HOLD",
      holdReason: expect.stringContaining("outside the active plan"),
      successor: { pid: 5100, commit: plan.successor.commit },
      proofs: { portOwnerPid: 5100 },
    });
    expect(fixture.runtime.sleep).toHaveBeenCalledTimes(1);
  });

  it("holds when the successor port is not owned after bootstrap", () => {
    let successorLsof = 0;
    const plan = fixturePlan();
    const fixture = createRuntime(plan);
    const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
    vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
      if (command === "/usr/sbin/lsof") {
        successorLsof += 1;
        if (successorLsof > 2) {
          return { status: 0, stdout: "9999\n", stderr: "" };
        }
      }
      return base(command, args, options);
    });
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    expect(receipt).toMatchObject({ outcome: "HOLD", holdReason: expect.stringContaining("port") });
  });

  it("has no caller-selected lifecycle command or hidden restart primitive", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "scripts/lib/handoff-v2-host-activation.mjs"),
      "utf8",
    );
    expect(source).not.toContain("plan.command");
    expect(source).not.toContain("plan.argv");
    expect(source).not.toContain('"kickstart"');
    expect(source).toMatch(
      /preserveFile: \(source, destination\) => \{[\s\S]*syncParentDirectory\(destination\);[\s\S]*writeExclusive:/u,
    );
  });
});

it("rejects a successor whose launchd run count proves an early relaunch", () => {
  const { fixture, receipt } = executeFixture(fixturePlan(), {
    successorRunCount: 2,
  });

  expect(receipt).toMatchObject({
    outcome: "HOLD",
    holdReason: "Gateway successor first process incarnation was not proven",
    operations: { bootstrapCount: 1, restartCount: 1 },
  });
  expect(
    fixture.commands.some(
      ({ args }) =>
        args.includes("gateway.suspend.prepare") &&
        args.some((arg) => arg.includes('"launchdRunCount":2')),
    ),
  ).toBe(false);
});

it("rejects a successor crash and relaunch during its first suspension prepare", () => {
  const plan = fixturePlan();
  const fixture = createRuntime(plan);
  const base = vi.mocked(fixture.runtime.run).getMockImplementation()!;
  let successorPrepareReplaced = false;
  vi.mocked(fixture.runtime.run).mockImplementation((command, args, options) => {
    const result = base(command, args, options);
    const bootstrapped = fixture.commands.some(
      ({ command: observedCommand, args: observedArgs }) =>
        observedCommand === "/bin/launchctl" && observedArgs[0] === "bootstrap",
    );
    if (bootstrapped && !successorPrepareReplaced && args.includes("gateway.suspend.prepare")) {
      successorPrepareReplaced = true;
      const body = JSON.parse(result.stdout);
      body.gatewayInstanceId = "relaunched-successor-gateway-instance";
      body.gatewayPid = 5_101;
      body.launchdRunCount = 2;
      return { ...result, stdout: JSON.stringify(body) };
    }
    return result;
  });

  const receipt = executeHostActivation({
    planBytes: canonicalJsonBytes(plan),
    expectedPlanSha256: hash(canonicalJsonBytes(plan)),
    execute: true,
    runtime: fixture.runtime,
  });

  expect(receipt).toMatchObject({
    outcome: "HOLD",
    holdReason: "Gateway suspension did not establish an idle admission fence",
  });
  expect(successorPrepareReplaced).toBe(true);
  expect(fixture.commands.some(({ args }) => args.includes("gateway.suspend.resume"))).toBe(false);
});

describe("real filesystem contention and path safety", () => {
  it("default durable deletion re-fsyncs the parent after an exposed unlink retry", () => {
    const script = String.raw`
      import { createRequire } from "node:module";
      import { syncBuiltinESMExports } from "node:module";
      import { pathToFileURL } from "node:url";
      import { resolve } from "node:path";
      const require = createRequire(import.meta.url);
      const fs = require("node:fs");
      const directory = fs.mkdtempSync("/tmp/openclaw-host-unlink-retry-");
      const target = resolve(directory, "handoff.json");
      fs.writeFileSync(target, "durable");
      const realFsyncSync = fs.fsyncSync;
      let directorySyncCalls = 0;
      fs.fsyncSync = (descriptor) => {
        directorySyncCalls += 1;
        if (directorySyncCalls === 1) {
          const error = new Error("injected parent fsync failure");
          error.code = "EIO";
          throw error;
        }
        return realFsyncSync(descriptor);
      };
      syncBuiltinESMExports();
      try {
        const moduleUrl = pathToFileURL(
          resolve("scripts/lib/handoff-v2-host-activation.mjs"),
        ).href;
        const { createDefaultHostActivationRuntime } = await import(moduleUrl);
        const runtime = createDefaultHostActivationRuntime();
        let firstFailed = false;
        try {
          runtime.removeFileDurably(target);
        } catch (error) {
          firstFailed = error?.code === "EIO";
        }
        if (!firstFailed || fs.existsSync(target)) {
          throw new Error("first removal did not expose the expected ambiguous unlink");
        }
        runtime.removeFileDurably(target);
        if (directorySyncCalls !== 2 || fs.existsSync(target)) {
          throw new Error("ENOENT retry did not re-fsync the parent directory");
        }
      } finally {
        fs.fsyncSync = realFsyncSync;
        syncBuiltinESMExports();
        fs.rmSync(directory, { recursive: true, force: true });
      }
    `;
    const result = spawnSync(process.execPath, ["--input-type=module", "--eval", script], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
  });

  it("allows only one of two concurrent processes to acquire the same claim", async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-race-"));
    try {
      const claimPath = path.join(directory, "claim.json");
      const modulePath = path.resolve(process.cwd(), "scripts/lib/handoff-v2-host-activation.mjs");
      const startsAt = Date.now() + 250;
      const childSource = `
        import { pathToFileURL } from "node:url";
        const module = await import(pathToFileURL(process.argv[1]).href);
        const deadline = Number(process.argv[3]);
        while (Date.now() < deadline) {
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
        }
        try {
          module.createDefaultHostActivationRuntime().writeExclusive(
            process.argv[2],
            Buffer.from(process.argv[4]),
          );
          process.exit(0);
        } catch {
          process.exit(2);
        }
      `;
      const runWriter = (value: string) =>
        new Promise<number>((resolve, reject) => {
          const child = spawn(process.execPath, [
            "--input-type=module",
            "-e",
            childSource,
            modulePath,
            claimPath,
            String(startsAt),
            value,
          ]);
          child.once("error", reject);
          child.once("exit", (code) => resolve(code ?? -1));
        });
      const results = await Promise.all([runWriter("writer-one"), runWriter("writer-two")]);
      expect(results.toSorted()).toEqual([0, 2]);
      expect(["writer-one", "writer-two"]).toContain(readFileSync(claimPath, "utf8"));
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("permits exactly one atomic writer for the same service claim path", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-claim-"));
    try {
      const runtime = createDefaultHostActivationRuntime();
      const claimPath = path.join(directory, "claim.json");
      runtime.writeExclusive(claimPath, Buffer.from('{"claim":1}\n'));
      expect(() => runtime.writeExclusive(claimPath, Buffer.from('{"claim":2}\n'))).toThrow();
      expect(readFileSync(claimPath, "utf8")).toBe('{"claim":1}\n');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("re-fsyncs an existing exact file and its parent with the default runtime", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-durable-"));
    try {
      const runtime = createDefaultHostActivationRuntime();
      const exactPath = path.join(directory, "exact.json");
      writeFileSync(exactPath, '{"exact":true}\n', { mode: 0o600 });
      expect(() => runtime.ensureFileDurable(exactPath)).not.toThrow();
      expect(readFileSync(exactPath, "utf8")).toBe('{"exact":true}\n');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("durably creates, replaces, and removes a real suspension handoff file", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-handoff-runtime-"));
    try {
      const runtime = createDefaultHostActivationRuntime();
      const handoffPath = path.join(directory, "gateway-suspend-handoff.json");
      const first = Buffer.from('{"generation":1}\n');
      const second = Buffer.from('{"generation":2}\n');
      runtime.writeExclusive(handoffPath, first);
      runtime.replaceFileDurably(second, handoffPath);
      runtime.ensureFileDurable(handoffPath);
      expect(readFileSync(handoffPath)).toEqual(second);
      runtime.removeFileDurably(handoffPath);
      expect(runtime.readOptionalFile(handoffPath, "test handoff")).toBeNull();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("rejects a symlink used as the allowed filesystem root", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-root-"));
    try {
      const realRoot = path.join(directory, "real");
      const linkedRoot = path.join(directory, "linked");
      mkdirSync(realRoot, { mode: 0o700 });
      symlinkSync(realRoot, linkedRoot);
      const runtime = createDefaultHostActivationRuntime();
      expect(() => runtime.assertSecureDirectoryChain(linkedRoot, linkedRoot, "test root")).toThrow(
        "unsafe allowed root",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("rejects canonical-path aliases as the same physical runtime file", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-host-runtime-alias-"));
    try {
      const predecessor = path.join(directory, "predecessor-node");
      const successor = path.join(directory, "successor-node");
      writeFileSync(predecessor, "runtime-bytes", { mode: 0o600 });
      symlinkSync(predecessor, successor);
      const runtime = createDefaultHostActivationRuntime();
      expect(() =>
        runtime.assertDistinctFiles(
          predecessor,
          successor,
          "predecessor and successor Node runtimes",
        ),
      ).toThrow("must be distinct physical files");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("reads durable interruption markers from the real SQLite state store", () => {
    const stateDir = mkdtempSync(path.join(tmpdir(), "openclaw-host-state-"));
    try {
      const stateDatabaseDir = path.join(stateDir, "state");
      mkdirSync(stateDatabaseDir, { mode: 0o700 });
      const database = new DatabaseSync(path.join(stateDatabaseDir, "openclaw.sqlite"));
      try {
        database.exec(
          "CREATE TABLE cron_jobs (job_id TEXT NOT NULL, state_json TEXT NOT NULL, enabled INTEGER NOT NULL, schedule_kind TEXT NOT NULL)",
        );
        database
          .prepare(
            "INSERT INTO cron_jobs (job_id, state_json, enabled, schedule_kind) VALUES (?, ?, ?, ?)",
          )
          .run("marker-bearing", JSON.stringify({ startupInterruptedRunAtMs: 1234 }), 1, "at");
        database
          .prepare(
            "INSERT INTO cron_jobs (job_id, state_json, enabled, schedule_kind) VALUES (?, ?, ?, ?)",
          )
          .run("safe", JSON.stringify({}), 1, "at");
      } finally {
        database.close();
      }
      const plan = fixturePlan();
      plan.host.stateDir = stateDir;
      const runtime = createDefaultHostActivationRuntime();
      expect(runtime.inspectDurableAtJobs(plan, "predecessor")).toEqual([
        { jobId: "marker-bearing", startupInterruptedRunAtMs: 1234 },
        { jobId: "safe", startupInterruptedRunAtMs: null },
      ]);
    } finally {
      rmSync(stateDir, { recursive: true, force: true });
    }
  });
});

describe("terminal contract enforcement", () => {
  it("classifies HOLD as a nonzero CLI result", () => {
    expect(hostActivationExitCode({ outcome: "HOLD" })).toBe(2);
    expect(hostActivationExitCode({ outcome: "ACTIVATED_VERIFIED" })).toBe(0);
    expect(hostActivationExitCode({ outcome: "PREFLIGHT_PASS" })).toBe(0);
  });

  it("validates generated receipts and rollback packets before persistence", () => {
    const activated = executeFixture().receipt;
    expect(validateHostActivationReceipt(activated)).toBe(activated);

    const held = executeFixture(fixturePlan(), {
      ambiguousPidAbsence: true,
    });
    expect(validateHostActivationReceipt(held.receipt)).toBe(held.receipt);
    const rollback = JSON.parse(
      held.fixture.writes.get(held.plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    expect(validateHostRollbackEvidence(rollback)).toBe(rollback);

    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    const validateRollbackSchema = compileContractSchema(
      "handoff-v2-host-rollback-evidence.v1.schema.json",
    );
    expect(validateReceiptSchema(activated), JSON.stringify(validateReceiptSchema.errors)).toBe(
      true,
    );
    expect(validateReceiptSchema(held.receipt), JSON.stringify(validateReceiptSchema.errors)).toBe(
      true,
    );
    expect(validateRollbackSchema(rollback), JSON.stringify(validateRollbackSchema.errors)).toBe(
      true,
    );
  });

  it("rejects receipt operation counts that do not match durable phases", () => {
    const receipt = mutableReceipt(structuredClone(executeFixture().receipt));
    receipt.operations.disableCount = 0;
    expect(() => validateHostActivationReceipt(receipt)).toThrow("durable phase ledger");
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt)).toBe(false);
  });

  it("rejects a receipt that changes its durable suspension binding", () => {
    const receipt = mutableReceipt(structuredClone(executeFixture().receipt));
    receipt.gatewaySuspension.suspendMode = "legacy-auto-expire/v1";
    expect(() => validateHostActivationReceipt(receipt)).toThrow(
      "activation receipt.gatewaySuspension.suspendMode",
    );
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt)).toBe(false);
  });

  it("rejects reordered terminal phases in both validators", () => {
    const receipt = mutableReceipt(structuredClone(executeFixture().receipt));
    const phase8 = requiredArrayEntry(receipt.ledger.phases, 8);
    const phase9 = requiredArrayEntry(receipt.ledger.phases, 9);
    [receipt.ledger.phases[8], receipt.ledger.phases[9]] = [phase9, phase8];
    phase9.sequence = 8;
    phase8.sequence = 9;
    expect(() => validateHostActivationReceipt(receipt)).toThrow("phase sequence");
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt)).toBe(false);
  });

  it("derives claim and terminal sequence identity without duplicate receipt fields", () => {
    const held = mutableReceipt(
      structuredClone(executeFixture(fixturePlan(), { ambiguousPidAbsence: true }).receipt),
    );
    expect(held.ledger).not.toHaveProperty("claimSha256");
    held.ledger.claimSha256 = requiredArrayEntry(held.ledger.phases, 0).sha256;
    expect(() => validateHostActivationReceipt(held)).toThrow("keys must be exactly");
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(held)).toBe(false);

    delete held.ledger.claimSha256;
    held.ledger.terminalPhase.sequence =
      held.ledger.phases.length + held.ledger.recoveryPhases.length;
    expect(() => validateHostActivationReceipt(held)).toThrow("keys must be exactly");
    expect(validateReceiptSchema(held)).toBe(false);
  });

  it("rejects malformed predecessor and successor proof identities", () => {
    const receipt = mutableReceipt(structuredClone(executeFixture().receipt));
    receipt.predecessor.commit = "";
    receipt.proofs.healthSha256 = "";
    expect(() => validateHostActivationReceipt(receipt)).toThrow();
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt)).toBe(false);
  });

  it("rejects HOLD observations outside the receipt interval", () => {
    const receipt = mutableReceipt(
      structuredClone(executeFixture(fixturePlan(), { driftStablePid: true }).receipt),
    );
    receipt.proofs.observedAt = "2026-07-28T07:59:59.999Z";
    expect(() => validateHostActivationReceipt(receipt)).toThrow("outside the receipt interval");
  });

  it("rejects duplicate recovery phases in both receipt validators", () => {
    const receipt = mutableReceipt(
      structuredClone(
        executeFixture(fixturePlan(), {
          failCommand: (_command, args) =>
            args[0] === "disable" ? "injected disable failure" : undefined,
        }).receipt,
      ),
    );
    const recoveryIndex = receipt.ledger.recoveryPhases.findIndex(
      (phase) => phase.phase === "pre-bootout-durable-suspension-retained",
    );
    const duplicate = structuredClone(
      requiredArrayEntry(receipt.ledger.recoveryPhases, recoveryIndex),
    );
    receipt.ledger.recoveryPhases.splice(recoveryIndex + 1, 0, duplicate);
    receipt.ledger.recoveryPhases.forEach((phase, index) => {
      phase.sequence = receipt.ledger.phases.length + index;
    });
    expect(() => validateHostActivationReceipt(receipt)).toThrow("recovery phase sequence");
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt)).toBe(false);
  });

  it("rejects impossible recovery ordering in both receipt validators", () => {
    const receipt = mutableReceipt(
      structuredClone(
        executeFixture(fixturePlan(), {
          failCommand: (_command, args) =>
            args[0] === "disable" ? "injected disable failure" : undefined,
        }).receipt,
      ),
    );
    const firstRecovery = requiredArrayEntry(receipt.ledger.recoveryPhases, 0);
    const secondRecovery = requiredArrayEntry(receipt.ledger.recoveryPhases, 1);
    [receipt.ledger.recoveryPhases[0], receipt.ledger.recoveryPhases[1]] = [
      secondRecovery,
      firstRecovery,
    ];
    receipt.ledger.recoveryPhases.forEach((phase, index) => {
      phase.sequence = receipt.ledger.phases.length + index;
    });
    expect(() => validateHostActivationReceipt(receipt)).toThrow("recovery phase sequence");
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt)).toBe(false);
  });

  it("accepts a HOLD after the full success prefix if success receipt persistence fails", () => {
    const receipt = mutableReceipt(structuredClone(executeFixture().receipt));
    receipt.outcome = "HOLD";
    receipt.proofs = {
      ...receipt.proofs,
      observedAt: receipt.completedAt,
    };
    delete receipt.proofs.stabilityWindowMs;
    receipt.ledger.terminalPhase = {
      phase: "hold",
      sha256: sha("f"),
    };
    receipt.rollbackPacketSha256 = sha("e");
    receipt.holdReason = "success receipt persistence failed";
    expect(validateHostActivationReceipt(receipt)).toBe(receipt);
    const validateReceiptSchema = compileContractSchema(
      "handoff-v2-host-activation-receipt.v1.schema.json",
    );
    expect(validateReceiptSchema(receipt), JSON.stringify(validateReceiptSchema.errors)).toBe(true);
  });

  it("rejects zero-duration stability evidence and mismatched predecessor build proof", () => {
    const activated = mutableReceipt(structuredClone(executeFixture().receipt));
    activated.completedAt = activated.startedAt;
    expect(() => validateHostActivationReceipt(activated)).toThrow("stability window");

    const preflight = mutableReceipt(
      structuredClone(executeFixture(fixturePlan(), {}, false).receipt),
    );
    preflight.proofs.predecessorBuild.commit = "f".repeat(40);
    expect(() => validateHostActivationReceipt(preflight)).toThrow(
      "proofs.predecessorBuild.commit",
    );
  });

  it("rejects arbitrary rollback phases and impossible unsafe-job counts", () => {
    const held = executeFixture(fixturePlan(), { ambiguousPidAbsence: true });
    const rollback = JSON.parse(
      held.fixture.writes.get(held.plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    rollback.phase = "hold";
    expect(() => validateHostRollbackEvidence(rollback)).toThrow("recoverable lifecycle phase");
    const validateRollbackSchema = compileContractSchema(
      "handoff-v2-host-rollback-evidence.v1.schema.json",
    );
    expect(validateRollbackSchema(rollback)).toBe(false);

    rollback.phase = "bootout-requested";
    rollback.atJobSafety.enabledAtJobCount = 0;
    rollback.atJobSafety.unsafeEnabledAtJobIds = ["impossible"];
    rollback.atJobSafety.disposition = "unsafe_marker_requires_manual_migration";
    rollback.predecessorPlistBackup.markerBearingAtJobsMayRun = true;
    expect(() => validateHostRollbackEvidence(rollback)).toThrow("unsafe at-job IDs");
  });

  it("cross-binds unloaded service recovery to the bootout invocation boundary", () => {
    const held = executeFixture(fixturePlan(), { ambiguousPidAbsence: true });
    const rollback = JSON.parse(
      held.fixture.writes.get(held.plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    const validateRollbackSchema = compileContractSchema(
      "handoff-v2-host-rollback-evidence.v1.schema.json",
    );
    rollback.serviceRecovery = {
      manualRollbackRequired: true,
      serviceState: "unloaded",
      launchdEnabled: true,
      predecessorPidDead: true,
      portFree: true,
      replacementProcessAbsent: true,
      replacementProcessProbe: "ps-axo-planned-gateway-commands-absent",
      handoff: {
        path: `${held.plan.host.stateDir}/gateway-suspend-handoff.json`,
        sha256: sha("a"),
        expiresAtMs: Date.parse("2026-07-28T08:32:00.000Z"),
        retained: true,
      },
      operations: {
        bootstrapCount: 0,
        automaticRollbackCount: 0,
        automaticSecondRestartCount: 0,
      },
    };
    rollback.phase = "claim";

    expect(() => validateHostRollbackEvidence(rollback)).toThrow(
      "phase for unloaded service recovery",
    );
    expect(validateRollbackSchema(rollback)).toBe(false);

    rollback.serviceRecovery = null;
    rollback.phase = "pre-bootout-service-unloaded-proven";
    expect(() => validateHostRollbackEvidence(rollback)).toThrow("recoverable lifecycle phase");
    expect(validateRollbackSchema(rollback)).toBe(false);
  });

  it("rejects an unsafe rollback disposition when no unsafe jobs exist", () => {
    const held = executeFixture(fixturePlan(), { ambiguousPidAbsence: true });
    const rollback = JSON.parse(
      held.fixture.writes.get(held.plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    rollback.atJobSafety.disposition = "unsafe_marker_requires_manual_migration";
    expect(() => validateHostRollbackEvidence(rollback)).toThrow(
      "safe_or_refused_before_lifecycle",
    );
    const validateRollbackSchema = compileContractSchema(
      "handoff-v2-host-rollback-evidence.v1.schema.json",
    );
    expect(validateRollbackSchema(rollback)).toBe(false);
  });

  it("timestamps rollback evidence when the packet is created", () => {
    const plan = fixturePlan();
    const fixture = createRuntime(plan, { ambiguousPidAbsence: true });
    let tick = 0;
    vi.mocked(fixture.runtime.now).mockImplementation(() =>
      new Date(Date.parse("2026-07-28T08:30:00.000Z") + tick++).toISOString(),
    );
    const receipt = executeHostActivation({
      planBytes: canonicalJsonBytes(plan),
      expectedPlanSha256: hash(canonicalJsonBytes(plan)),
      execute: true,
      runtime: fixture.runtime,
    });
    const rollback = JSON.parse(
      fixture.writes.get(plan.evidence.rollbackPacketPath)!.toString("utf8"),
    );
    expect(Date.parse(rollback.createdAt)).toBeGreaterThan(Date.parse(String(receipt.startedAt)));
  });
});

describe("real process absence proof", () => {
  it("distinguishes a live PID from an unallocated PID using the real kernel probe", () => {
    const runtime = createDefaultHostActivationRuntime();
    expect(() => verifyPidDead(process.pid, runtime)).toThrow("remains alive");
    expect(() => verifyPidDead(2_147_483_647, runtime)).not.toThrow();
    expect(() => runtime.assertClaimOwnerDead(process.pid)).toThrow("remains alive");
    expect(() => runtime.assertClaimOwnerDead(2_147_483_647)).not.toThrow();
  });

  it("atomically excludes a second default-runtime recovery owner", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-recovery-owner-"));
    const ownershipPath = path.join(directory, "recovery.lock");
    const runtime = createDefaultHostActivationRuntime();
    try {
      runtime.acquireRecoveryOwnership(ownershipPath, process.pid);
      expect(() => runtime.acquireRecoveryOwnership(ownershipPath, process.pid)).toThrow(
        "another process owns interrupted-attempt recovery",
      );
      runtime.releaseRecoveryOwnership(ownershipPath, process.pid);
      expect(runtime.readOptionalFile(ownershipPath, "released recovery ownership")).toBeNull();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("reclaims a recovery owner only after positive kernel death proof", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-recovery-stale-owner-"));
    const ownershipPath = path.join(directory, "recovery.lock");
    const runtime = createDefaultHostActivationRuntime();
    try {
      writeFileSync(ownershipPath, "2147483647\n", { mode: 0o600 });
      runtime.acquireRecoveryOwnership(ownershipPath, process.pid);
      expect(readFileSync(ownershipPath, "utf8")).toBe(`${process.pid}\n`);
      runtime.releaseRecoveryOwnership(ownershipPath, process.pid);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("fails closed on ambiguous recovery ownership", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-recovery-ambiguous-owner-"));
    const ownershipPath = path.join(directory, "recovery.lock");
    const runtime = createDefaultHostActivationRuntime();
    try {
      writeFileSync(ownershipPath, "not-a-pid\n", { mode: 0o600 });
      expect(() => runtime.acquireRecoveryOwnership(ownershipPath, process.pid)).toThrow(
        "recovery ownership is ambiguous",
      );
      expect(readFileSync(ownershipPath, "utf8")).toBe("not-a-pid\n");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("refuses wrong-owner release without deleting the live owner", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-recovery-wrong-release-"));
    const ownershipPath = path.join(directory, "recovery.lock");
    const runtime = createDefaultHostActivationRuntime();
    try {
      runtime.acquireRecoveryOwnership(ownershipPath, process.pid);
      expect(() => runtime.releaseRecoveryOwnership(ownershipPath, process.pid + 1)).toThrow(
        "recovery ownership changed before release",
      );
      expect(readFileSync(ownershipPath, "utf8")).toBe(`${process.pid}\n`);
      runtime.releaseRecoveryOwnership(ownershipPath, process.pid);
      expect(runtime.readOptionalFile(ownershipPath, "released recovery ownership")).toBeNull();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("fails closed when a stale owner is substituted with a live owner after death proof", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-recovery-substitution-"));
    const ownershipPath = path.join(directory, "recovery.lock");
    const runtime = createDefaultHostActivationRuntime();
    try {
      writeFileSync(ownershipPath, "2147483647\n", { mode: 0o600 });
      setRecoveryOwnershipTestHook((stage, targetPath) => {
        if (stage !== "after-owner-death-proof") {
          return;
        }
        unlinkSync(targetPath);
        writeFileSync(targetPath, `${process.pid}\n`, { mode: 0o600 });
      });
      expect(() => runtime.acquireRecoveryOwnership(ownershipPath, process.pid)).toThrow(
        "recovery ownership changed during verification",
      );
      expect(readFileSync(ownershipPath, "utf8")).toBe(`${process.pid}\n`);
    } finally {
      setRecoveryOwnershipTestHook();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("re-proves durable deletion when release observes ENOENT", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "openclaw-recovery-release-enoent-"));
    const ownershipPath = path.join(directory, "recovery.lock");
    const runtime = createDefaultHostActivationRuntime();
    try {
      runtime.acquireRecoveryOwnership(ownershipPath, process.pid);
      setRecoveryOwnershipTestHook((stage, targetPath) => {
        if (stage === "before-release-delete") {
          unlinkSync(targetPath);
        }
      });
      runtime.releaseRecoveryOwnership(ownershipPath, process.pid);
      expect(runtime.readOptionalFile(ownershipPath, "released recovery ownership")).toBeNull();
    } finally {
      setRecoveryOwnershipTestHook();
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
