export const HANDOFF_V2_GATE7_ADMISSION_SCHEMA: "openclaw-handoff-host-activation-admission/v1";

export class HandoffV2Gate7AdmissionError extends Error {
  readonly code: string;
  constructor(code: string, message: string, options?: { cause?: unknown });
}

export type HandoffV2Gate7Admission = {
  schema: "openclaw-handoff-host-activation-admission/v1";
  status: "verified";
  acceptsHostActivationAuthority: true;
  receiptId: string;
  receiptHash: `sha256:${string}`;
  generation: number;
  targetMode: "shadow";
  generationKind: "activation";
  predecessorKind: "initial_shadow";
  sourceCommit: string;
  sourceTree: string;
  hostCommit: string;
  hostTree: string;
  authorityUseHash: `sha256:${string}`;
  hostFenceHash: `sha256:${string}`;
  issuedAt: string;
  expiresAt: string;
  verifiedAt: string;
};

export type HandoffV2Gate7Binding = {
  receiptId: string;
  receiptHash: `sha256:${string}`;
  generation: number;
  sourceCommit: string;
  sourceTree: string;
  hostCommit: string;
  hostTree: string;
  authorityUseHash: `sha256:${string}`;
  hostFenceHash: `sha256:${string}`;
  issuedAt: string;
  expiresAt: string;
};

export type HandoffV2Gate7VerifierRunResult = {
  status: number | null;
  stdout?: unknown;
  stderr?: unknown;
  signal?: unknown;
  error?: unknown;
};

export type HandoffV2Gate7RunVerifier = (
  command: string,
  args: readonly string[],
  env: NodeJS.ProcessEnv,
  options: { timeoutMs: number },
) => HandoffV2Gate7VerifierRunResult;

export type HandoffV2Gate7Dependencies = {
  runVerifier?: HandoffV2Gate7RunVerifier;
  now?: () => number;
  euid?: () => number;
};

export type HandoffV2Gate7AdmissionResult = {
  readonly admission: Readonly<HandoffV2Gate7Admission>;
  readonly verifierFileSha256: `sha256:${string}`;
  readonly receiptFileSha256: `sha256:${string}`;
};

export function verifyHandoffV2Gate7Admission(
  options: {
    stateDir: string;
    receiptRelativePath: string;
    expectedReceiptHash: `sha256:${string}`;
    requiredRemainingMs?: number;
    expectedBinding?: HandoffV2Gate7Binding;
  },
  dependencies?: HandoffV2Gate7Dependencies,
): HandoffV2Gate7AdmissionResult;
