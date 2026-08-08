import { createHash } from "node:crypto";
import {
  chmodSync,
  linkSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  HandoffV2Gate7Dependencies,
  HandoffV2Gate7VerifierRunResult,
} from "../../scripts/lib/handoff-v2-gate7-admission.d.mts";
import {
  HANDOFF_V2_GATE7_ADMISSION_SCHEMA,
  HandoffV2Gate7AdmissionError,
  verifyHandoffV2Gate7Admission,
} from "../../scripts/lib/handoff-v2-gate7-admission.mjs";

const FIXED_VERIFIER_RELATIVE_PATH =
  "extensions/ewt-handoff-contracts/dist/v2/host-activation-admission-verifier-cli.js";

function sha256Hex(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function sha256Pin(bytes: Buffer | string): `sha256:${string}` {
  return `sha256:${sha256Hex(bytes)}` as `sha256:${string}`;
}

function sha(char: string): string {
  return char.repeat(64);
}

function gitId(char: string): string {
  return char.repeat(40);
}

function isoAt(ms: number): string {
  return new Date(ms).toISOString();
}

function buildCanonicalAdmission(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const base: Record<string, unknown> = {
    schema: HANDOFF_V2_GATE7_ADMISSION_SCHEMA,
    status: "verified",
    acceptsHostActivationAuthority: true,
    receiptId: "receipt-rc17-shadow-001",
    receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
    generation: 17,
    targetMode: "shadow",
    generationKind: "activation",
    predecessorKind: "initial_shadow",
    sourceCommit: gitId("1"),
    sourceTree: gitId("2"),
    hostCommit: gitId("3"),
    hostTree: gitId("4"),
    authorityUseHash: "sha256:" + sha("c"),
    hostFenceHash: "sha256:" + sha("d"),
    issuedAt: "2026-08-01T00:00:00.000Z",
    expiresAt: "2026-08-01T01:00:00.000Z",
    verifiedAt: "2026-08-01T00:00:30.000Z",
  };
  return { ...base, ...overrides };
}

function canonicalCompactJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalCompactJson(entry)).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).toSorted();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${canonicalCompactJson(obj[key])}`)
      .join(",")}}`;
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null) {
    return "null";
  }
  throw new Error(`cannot canonicalize ${typeof value}`);
}

function compactOutput(payload: Record<string, unknown>): string {
  return `${canonicalCompactJson(payload)}\n`;
}

interface Harness {
  stateDir: string;
  verifierPath: string;
  receiptPath: string;
  receiptBytes: Buffer;
  expectedReceiptHash: `sha256:${string}`;
  runVerifier: ReturnType<typeof vi.fn>;
  dependencies: HandoffV2Gate7Dependencies;
  cleanup: () => void;
}

function setupHarness(
  options: {
    nowMs?: number;
    euid?: number;
    runVerifier?: ReturnType<typeof vi.fn>;
    receiptOverrides?: {
      mode?: number;
      makeSymlink?: boolean;
    };
    verifierOverrides?: {
      mode?: number;
      makeSymlink?: boolean;
      addHardLink?: boolean;
      modeParent?: number;
    };
    receiptContents?: Buffer;
    missingVerifier?: boolean;
    missingReceipt?: boolean;
  } = {},
): Harness {
  const stateDir = mkdtempSync(path.join(tmpdir(), "openclaw-gate7-"));
  const currentEuid = typeof process.geteuid === "function" ? process.geteuid() : 0;
  const verifierDir = path.dirname(path.join(stateDir, FIXED_VERIFIER_RELATIVE_PATH));
  mkdirSync(verifierDir, { recursive: true, mode: 0o700 });
  const verifierPath = path.join(stateDir, FIXED_VERIFIER_RELATIVE_PATH);
  const verifierContents = Buffer.from("#!/usr/bin/env node\n// stub verifier CLI\n");
  if (!options.missingVerifier) {
    writeFileSync(verifierPath, verifierContents, { mode: 0o600 });
    if (options.verifierOverrides?.mode !== undefined) {
      chmodSync(verifierPath, options.verifierOverrides.mode);
    }
    if (options.verifierOverrides?.addHardLink) {
      linkSync(verifierPath, `${verifierPath}.extra`);
    }
    if (options.verifierOverrides?.makeSymlink) {
      unlinkSync(verifierPath);
      symlinkSync("/bin/true", verifierPath);
    }
    if (options.verifierOverrides?.modeParent !== undefined) {
      chmodSync(verifierDir, options.verifierOverrides.modeParent);
    }
  }
  const receiptRelativePath = "host-activation-evidence/receipt.json";
  const receiptPath = path.join(stateDir, receiptRelativePath);
  mkdirSync(path.dirname(receiptPath), { recursive: true, mode: 0o700 });
  const receiptBytes = options.receiptContents ?? Buffer.from("placeholder-receipt-payload\n");
  if (!options.missingReceipt) {
    if (options.receiptOverrides?.makeSymlink) {
      const tempFile = path.join(stateDir, "real-receipt");
      writeFileSync(tempFile, receiptBytes, { mode: 0o600 });
      symlinkSync(tempFile, receiptPath);
    } else {
      writeFileSync(receiptPath, receiptBytes, { mode: 0o600 });
    }
    if (options.receiptOverrides?.mode !== undefined) {
      chmodSync(receiptPath, options.receiptOverrides.mode);
    }
  }
  const expectedReceiptHash = sha256Pin(receiptBytes);
  const runVerifier =
    options.runVerifier ??
    vi.fn(
      (): HandoffV2Gate7VerifierRunResult => ({
        status: 0,
        stdout: "",
        stderr: "",
        signal: null,
        error: null,
      }),
    );
  const nowFn = vi.fn(() => options.nowMs ?? Date.parse("2026-08-01T00:00:35.000Z"));
  const euidFn = vi.fn(() => options.euid ?? currentEuid);
  const dependencies: HandoffV2Gate7Dependencies = {
    runVerifier: (command, args, env, opts) => {
      const result = runVerifier(command, args, env, opts);
      return {
        status: result.status,
        stdout: typeof result.stdout === "string" ? result.stdout : "",
        stderr: typeof result.stderr === "string" ? result.stderr : "",
        signal: typeof result.signal === "string" ? result.signal : null,
        error: typeof result.error === "string" ? result.error : null,
      };
    },
    now: nowFn,
    euid: euidFn,
  };
  return {
    stateDir,
    verifierPath,
    receiptPath,
    receiptBytes,
    expectedReceiptHash,
    runVerifier,
    dependencies,
    cleanup: () => {
      try {
        rmSync(stateDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup failures
      }
    },
  };
}

let currentHarness: Harness | undefined;
afterEach(() => {
  currentHarness?.cleanup();
  currentHarness = undefined;
});

describe("verifyHandoffV2Gate7Admission", () => {
  describe("positive path", () => {
    let result: ReturnType<typeof verifyHandoffV2Gate7Admission>;
    beforeEach(() => {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      result = verifyHandoffV2Gate7Admission(
        {
          stateDir: harness.stateDir,
          receiptRelativePath: "host-activation-evidence/receipt.json",
          expectedReceiptHash: sha256Pin(harness.receiptBytes),
          requiredRemainingMs: 60_000,
        },
        harness.dependencies,
      );
    });

    it("returns a frozen admission with the closed schema fields", () => {
      expect(Object.isFrozen(result)).toBe(true);
      expect(Object.isFrozen(result.admission)).toBe(true);
      expect(result.admission.schema).toBe(HANDOFF_V2_GATE7_ADMISSION_SCHEMA);
      expect(result.admission.status).toBe("verified");
      expect(result.admission.acceptsHostActivationAuthority).toBe(true);
      expect(result.admission.targetMode).toBe("shadow");
      expect(result.admission.generationKind).toBe("activation");
      expect(result.admission.predecessorKind).toBe("initial_shadow");
    });

    it("pins the verifier path, command, argv, and env", () => {
      const harness = currentHarness!;
      expect(harness.runVerifier).toHaveBeenCalledTimes(1);
      const call = harness.runVerifier.mock.calls[0] as
        | [string, readonly string[], NodeJS.ProcessEnv, { timeoutMs: number }]
        | undefined;
      const [command, args, env] = call ?? ["", [], {} as NodeJS.ProcessEnv, { timeoutMs: 0 }];
      expect(command).toBe(process.execPath);
      expect(args).toEqual([
        realpathSync(harness.verifierPath),
        "--state-root",
        realpathSync(harness.stateDir),
        "--receipt",
        realpathSync(harness.receiptPath),
        "--expected-receipt-hash",
        sha256Pin(harness.receiptBytes),
      ]);
      expect(env).toMatchObject({ LANG: "C", LC_ALL: "C", TZ: "UTC" });
      const expectedKeys = ["LANG", "LC_ALL", "TZ"];
      if (process.env.HANDOFF_V2_ROLLOUT_KEY) {
        expectedKeys.push("HANDOFF_V2_ROLLOUT_KEY");
      }
      expect(Object.keys(env ?? {}).toSorted()).toEqual(expectedKeys.toSorted());
      if (process.env.HANDOFF_V2_ROLLOUT_KEY) {
        expect(env?.HANDOFF_V2_ROLLOUT_KEY).toBe(process.env.HANDOFF_V2_ROLLOUT_KEY);
      }
    });

    it("observes the verifier and receipt SHA-256 pins", () => {
      expect(result.verifierFileSha256).toBe(
        sha256Pin(Buffer.from("#!/usr/bin/env node\n// stub verifier CLI\n")),
      );
      expect(result.receiptFileSha256).toBe(sha256Pin(currentHarness!.receiptBytes));
    });

    it("does not mutate either inspected file", () => {
      const harness = currentHarness!;
      const verifierBytes = readFileSync(harness.verifierPath);
      const receiptBytes = readFileSync(harness.receiptPath);
      expect(verifierBytes.toString("utf8")).toBe("#!/usr/bin/env node\n// stub verifier CLI\n");
      expect(receiptBytes.equals(harness.receiptBytes)).toBe(true);
    });
  });

  it("accepts an immutable activation-plan binding when supplied", () => {
    const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
    const endedAtMs = startedAtMs + 50;
    const harness = setupHarness({
      nowMs: startedAtMs,
      runVerifier: vi.fn(
        (): HandoffV2Gate7VerifierRunResult => ({
          status: 0,
          stdout: compactOutput(
            buildCanonicalAdmission({
              receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
              verifiedAt: isoAt(startedAtMs + 25),
              receiptId: "binding-receipt-id",
              generation: 17,
              sourceCommit: gitId("e"),
              sourceTree: gitId("f"),
              hostCommit: gitId("9"),
              hostTree: gitId("8"),
              authorityUseHash: "sha256:" + sha("b"),
              hostFenceHash: "sha256:" + sha("c"),
              issuedAt: "2026-08-01T00:00:00.000Z",
              expiresAt: "2026-08-01T02:00:00.000Z",
            }),
          ),
          stderr: "",
          signal: null,
          error: null,
        }),
      ),
    });
    harness.dependencies.now = vi.fn(() => {
      if (harness.runVerifier.mock.calls.length === 0) {
        return startedAtMs;
      }
      return endedAtMs;
    });
    currentHarness = harness;
    const result = verifyHandoffV2Gate7Admission(
      {
        stateDir: harness.stateDir,
        receiptRelativePath: "host-activation-evidence/receipt.json",
        expectedReceiptHash: sha256Pin(harness.receiptBytes),
        requiredRemainingMs: 60_000,
        expectedBinding: {
          receiptId: "binding-receipt-id",
          receiptHash: sha256Pin(harness.receiptBytes),
          generation: 17,
          sourceCommit: gitId("e"),
          sourceTree: gitId("f"),
          hostCommit: gitId("9"),
          hostTree: gitId("8"),
          authorityUseHash: "sha256:" + sha("b"),
          hostFenceHash: "sha256:" + sha("c"),
          issuedAt: "2026-08-01T00:00:00.000Z",
          expiresAt: "2026-08-01T02:00:00.000Z",
        },
      },
      harness.dependencies,
    );
    expect(result.admission.receiptId).toBe("binding-receipt-id");
    expect(result.admission.sourceCommit).toBe(gitId("e"));
    expect(result.admission.authorityUseHash).toBe("sha256:" + sha("b"));
  });

  describe("invalid options", () => {
    it("rejects a non-absolute stateDir", () => {
      const harness = setupHarness();
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: "relative/state",
            receiptRelativePath: "rcpt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects an absolute receipt relative path", () => {
      const harness = setupHarness();
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "/etc/passwd",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a receipt relative path that escapes stateDir", () => {
      const harness = setupHarness();
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "../outside.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a receipt relative path with a '..' segment", () => {
      const harness = setupHarness();
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "evidence/../receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a malformed expected receipt hash pin", () => {
      const harness = setupHarness();
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: "not-a-pin" as `sha256:${string}`,
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a negative requiredRemainingMs", () => {
      const harness = setupHarness();
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
            requiredRemainingMs: -1,
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });
  });

  describe("verifier file inspection", () => {
    it("rejects a missing verifier file", () => {
      const harness = setupHarness({ missingVerifier: true });
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a verifier file that is a symlink leaf", () => {
      const harness = setupHarness({ verifierOverrides: { makeSymlink: true } });
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a verifier file with group/world write bits", () => {
      const harness = setupHarness({ verifierOverrides: { mode: 0o666 } });
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a verifier file with extra hard links", () => {
      const harness = setupHarness({ verifierOverrides: { addHardLink: true } });
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a verifier file owned by a different effective uid", () => {
      const harness = setupHarness({ euid: 9999 });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("UNSAFE_FILE");
    });
  });

  describe("receipt file inspection", () => {
    it("rejects a missing receipt file", () => {
      const harness = setupHarness({ missingReceipt: true });
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });

    it("rejects a receipt file that is a symlink leaf", () => {
      const harness = setupHarness({ receiptOverrides: { makeSymlink: true } });
      currentHarness = harness;
      expect(() =>
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(Buffer.from("x")),
          },
          harness.dependencies,
        ),
      ).toThrowError(HandoffV2Gate7AdmissionError);
    });
  });

  describe("verifier process envelope", () => {
    it("forbids a different verifier argv from being selected", () => {
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: "2026-08-01T00:00:35.000Z",
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      verifyHandoffV2Gate7Admission(
        {
          stateDir: harness.stateDir,
          receiptRelativePath: "host-activation-evidence/receipt.json",
          expectedReceiptHash: sha256Pin(harness.receiptBytes),
        },
        harness.dependencies,
      );
      const call = harness.runVerifier.mock.calls[0] as
        | [string, readonly string[], NodeJS.ProcessEnv, { timeoutMs: number }]
        | undefined;
      const [, args] = call ?? ["", [], {} as NodeJS.ProcessEnv, { timeoutMs: 0 }];
      expect(args?.[0]).toBe(realpathSync(harness.verifierPath));
      expect(args).not.toContain("--custom-arg");
      expect(args?.[1]).toBe("--state-root");
      expect(args?.[3]).toBe("--receipt");
      expect(args?.[5]).toBe("--expected-receipt-hash");
    });

    it("rejects a nonzero verifier exit status", () => {
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 2,
            stdout: "",
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("VERIFIER_NONZERO_EXIT");
    });

    it("rejects a verifier process interrupted by a signal", () => {
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: null,
            stdout: "",
            stderr: "",
            signal: "SIGTERM",
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("VERIFIER_INTERRUPTED");
    });

    it("rejects verifier output that wrote to stderr", () => {
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
              }),
            ),
            stderr: "noise",
            signal: null,
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("VERIFIER_STDERR_PRESENT");
    });

    it("rejects verifier output that is not newline terminated", () => {
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: canonicalCompactJson(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe(
        "VERIFIER_OUTPUT_NOT_NEWLINE_TERMINATED",
      );
    });

    it("rejects multiline verifier output", () => {
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout:
              canonicalCompactJson(
                buildCanonicalAdmission({
                  receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                }),
              ) +
              "\n" +
              canonicalCompactJson({ junk: true }) +
              "\n",
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("VERIFIER_OUTPUT_MULTILINE");
    });

    it("rejects verifier output that is not canonical compact JSON", () => {
      const payload = buildCanonicalAdmission({
        receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
      });
      const notCanonical = JSON.stringify(payload).replace(/"status":/, '"status" :'); // introduces whitespace
      const harness = setupHarness({
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: `${notCanonical}\n`,
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("VERIFIER_OUTPUT_NOT_CANONICAL");
    });
  });

  describe("closed success shape enforcement", () => {
    function runWithAdmission(extra: Record<string, unknown>): unknown {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
                ...extra,
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      try {
        return verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        return error;
      }
    }

    function expectReject(extra: Record<string, unknown>): void {
      const result = runWithAdmission(extra);
      expect(result).toBeInstanceOf(HandoffV2Gate7AdmissionError);
    }

    it("rejects an admission with an extra field", () => {
      expectReject({ surprise: "extra" });
    });

    it("rejects a wrong schema literal", () => {
      expectReject({ schema: "openclaw-other-schema/v1" });
    });

    it("rejects acceptsHostActivationAuthority false", () => {
      expectReject({ acceptsHostActivationAuthority: false });
    });

    it("rejects a non-shadow targetMode", () => {
      expectReject({ targetMode: "live" });
    });

    it("rejects a non-activation generationKind", () => {
      expectReject({ generationKind: "shadow" });
    });

    it("rejects a non-initial_shadow predecessorKind", () => {
      expectReject({ predecessorKind: "shadow" });
    });

    it("rejects a forged receiptHash that does not match the pin", () => {
      expectReject({ receiptHash: "sha256:" + sha("z") });
    });

    it("rejects a verifiedAt before the invocation start", () => {
      expectReject({ verifiedAt: "2026-08-01T00:00:00.000Z" });
    });

    it("rejects a verifiedAt after the invocation end", () => {
      expectReject({ verifiedAt: "2026-08-01T00:05:00.000Z" });
    });
  });

  describe("binding enforcement", () => {
    function runWithBindingAndAdmission(
      admission: Record<string, unknown>,
      binding: Record<string, unknown>,
      requiredRemainingMs = 60_000,
    ): unknown {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                ...admission,
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
                expiresAt: "2026-08-01T02:00:00.000Z",
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      try {
        return verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
            requiredRemainingMs,
            expectedBinding: {
              receiptId: "receipt-rc17-shadow-001",
              receiptHash: sha256Pin(harness.receiptBytes),
              generation: 17,
              sourceCommit: gitId("1"),
              sourceTree: gitId("2"),
              hostCommit: gitId("3"),
              hostTree: gitId("4"),
              authorityUseHash: "sha256:" + sha("c"),
              hostFenceHash: "sha256:" + sha("d"),
              issuedAt: "2026-08-01T00:00:00.000Z",
              expiresAt: "2026-08-01T02:00:00.000Z",
              ...binding,
            } as never,
          },
          harness.dependencies,
        );
      } catch (error) {
        return error;
      }
    }

    it("rejects an admission whose sourceCommit does not match the binding", () => {
      const result = runWithBindingAndAdmission(
        { sourceCommit: gitId("1") },
        { sourceCommit: gitId("9") },
      );
      expect(result).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((result as HandoffV2Gate7AdmissionError).code).toBe("ADMISSION_BINDING_MISMATCH");
    });

    it("rejects an admission whose expiresAt does not match the binding", () => {
      const result = runWithBindingAndAdmission(
        { expiresAt: "2026-08-01T02:00:00.000Z" },
        { expiresAt: "2026-08-01T03:00:00.000Z" },
      );
      expect(result).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((result as HandoffV2Gate7AdmissionError).code).toBe("ADMISSION_BINDING_MISMATCH");
    });
  });

  describe("lifetime enforcement", () => {
    it("rejects an admission whose expiresAt is at or before now", () => {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
                expiresAt: isoAt(endedAtMs - 1),
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe("ADMISSION_EXPIRED");
    });

    it("rejects an admission that does not outlive the required remaining lifetime", () => {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn(
          (): HandoffV2Gate7VerifierRunResult => ({
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
                expiresAt: isoAt(endedAtMs + 500),
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          }),
        ),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
            requiredRemainingMs: 60_000,
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe(
        "ADMISSION_INSUFFICIENT_REMAINING",
      );
    });
  });

  describe("TOCTOU replacement", () => {
    it("rejects when the receipt file is replaced around the verifier invocation", () => {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn((): HandoffV2Gate7VerifierRunResult => {
          unlinkSync(harness!.receiptPath);
          writeFileSync(harness!.receiptPath, Buffer.from("forged-receipt-payload\n"), {
            mode: 0o600,
          });
          return {
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          };
        }),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe(
        "FILE_REPLACED_DURING_VERIFICATION",
      );
    });

    it("rejects when the verifier file is replaced around the verifier invocation", () => {
      const startedAtMs = Date.parse("2026-08-01T00:00:30.000Z");
      const endedAtMs = startedAtMs + 50;
      const harness = setupHarness({
        nowMs: startedAtMs,
        runVerifier: vi.fn((): HandoffV2Gate7VerifierRunResult => {
          unlinkSync(harness!.verifierPath);
          writeFileSync(
            harness!.verifierPath,
            Buffer.from("#!/usr/bin/env node\n// replaced verifier\n"),
            { mode: 0o600 },
          );
          return {
            status: 0,
            stdout: compactOutput(
              buildCanonicalAdmission({
                receiptHash: sha256Pin(Buffer.from("placeholder-receipt-payload\n")),
                verifiedAt: isoAt(startedAtMs + 25),
              }),
            ),
            stderr: "",
            signal: null,
            error: null,
          };
        }),
      });
      harness.dependencies.now = vi.fn(() => {
        if (harness.runVerifier.mock.calls.length === 0) {
          return startedAtMs;
        }
        return endedAtMs;
      });
      currentHarness = harness;
      let caught: unknown;
      try {
        verifyHandoffV2Gate7Admission(
          {
            stateDir: harness.stateDir,
            receiptRelativePath: "host-activation-evidence/receipt.json",
            expectedReceiptHash: sha256Pin(harness.receiptBytes),
          },
          harness.dependencies,
        );
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(HandoffV2Gate7AdmissionError);
      expect((caught as HandoffV2Gate7AdmissionError).code).toBe(
        "FILE_REPLACED_DURING_VERIFICATION",
      );
    });
  });
});
