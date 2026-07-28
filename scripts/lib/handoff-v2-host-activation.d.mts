export const HOST_ACTIVATION_PLAN_SCHEMA: "handoff-v2-host-activation-plan/v1";
export const HOST_ACTIVATION_RECEIPT_SCHEMA: "handoff-v2-host-activation-receipt/v1";
export const SLACK_ACCESS_PROOF_SCHEMA: "openclaw-slack-access-proof/v1";

export function canonicalJson(value: unknown): unknown;
export function canonicalJsonBytes(value: unknown): Buffer;
export function validateHostActivationPlan<T>(
  value: T,
  options?: { nowMs?: number; allowExpired?: boolean },
): T;
export function validateHostActivationReceipt<T>(value: T): T;
export function validateHostRollbackEvidence<T>(value: T): T;
export function parseLaunchdServiceState(
  output: string,
  expectedLabel: string,
): { pid: number; runCount: number };
export function parseLaunchdEnabledState(output: string, expectedLabel: string): boolean;
export function verifyPidDead(pid: number, runtime: HostActivationRuntime): void;
export function hostActivationExitCode(receipt: unknown): 0 | 2;

export type HostActivationCommandResult = {
  status: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  error?: string;
};

export type HostActivationRuntime = {
  now(): string;
  sleep(milliseconds: number): void;
  run(
    command: string,
    args: string[],
    options?: { timeoutMs?: number; env?: NodeJS.ProcessEnv; input?: Buffer },
  ): HostActivationCommandResult;
  getHostIdentity(): { uid: number; homePath: string; executorPid: number };
  assertClaimOwnerDead(pid: number): void;
  acquireRecoveryOwnership(path: string, executorPid: number): void;
  releaseRecoveryOwnership(path: string, executorPid: number): void;
  verifyFile(path: string, sha256: string, description: string): Buffer;
  assertSecureDirectory(path: string, description: string): void;
  assertSecureDirectoryChain(path: string, allowedRoot: string, description: string): void;
  assertOutputAvailable(path: string, description: string): void;
  inspectDurableAtJobs(
    plan: Record<string, any>,
    generation: "predecessor" | "successor",
  ): Array<{ jobId: string; startupInterruptedRunAtMs: number | null }>;
  readOptionalFile(path: string, description: string): Buffer | null;
  listLedgerPhases(
    directory: string,
    planId: string,
    planSha256: string,
  ): Array<{
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
  ensureFileDurable(path: string): void;
  replaceFileDurably(bytes: Buffer, destination: string): void;
  removeFileDurably(path: string): void;
  installFile(bytes: Buffer, destination: string): void;
  preserveFile(source: string, destination: string): void;
  writeExclusive(path: string, bytes: Buffer): void;
};

export function createDefaultHostActivationRuntime(): HostActivationRuntime;
export function executeHostActivation(params: {
  planBytes: Buffer;
  expectedPlanSha256: string;
  execute: boolean;
  runtime?: HostActivationRuntime;
}): Record<string, unknown>;
export function loadPlanBytes(path: string): Buffer;
