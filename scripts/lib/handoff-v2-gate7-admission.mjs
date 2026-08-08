// Host-owned consumer for the Gate 7 host-activation admission verifier.
// The fixed plugin verifier is treated as an opaque subprocess; this module
// pins the verifier path, argv, env, and result contract, and never re-implements
// the plugin's RC17 cryptography.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

export const HANDOFF_V2_GATE7_ADMISSION_SCHEMA = "openclaw-handoff-host-activation-admission/v1";

const VERIFIER_RELATIVE_PATH =
  "extensions/ewt-handoff-contracts/dist/v2/host-activation-admission-verifier-cli.js";

const VERIFIER_FILE_MAX_BYTES = 16 * 1024 * 1024;
const RECEIPT_FILE_MAX_BYTES = 16 * 1024 * 1024;
const VERIFIER_STDOUT_MAX_BYTES = 1024 * 1024;
const INVOCATION_TIMEOUT_MS = 30_000;
const ROLLOUT_KEY_NAME = "HANDOFF_V2_ROLLOUT_KEY";

const SHA256_PIN_RE = /^sha256:[a-f0-9]{64}$/u;
const GIT_OBJECT_RE = /^[a-f0-9]{40}$/u;
const ISO_INSTANT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const RECEIPT_SEGMENT_RE = /^[A-Za-z0-9._-]+$/u;
const RECEIPT_HASH_PIN_RE = /^sha256:[a-f0-9]{64}$/u;
const RECEIPT_ID_RE = /^[A-Za-z0-9._:-]+$/u;

const STATUS_VERIFIED = "verified";
const TARGET_MODE_SHADOW = "shadow";
const GENERATION_KIND_ACTIVATION = "activation";
const PREDECESSOR_KIND_INITIAL_SHADOW = "initial_shadow";

const CLOSED_SUCCESS_KEYS = Object.freeze([
  "schema",
  "status",
  "acceptsHostActivationAuthority",
  "receiptId",
  "receiptHash",
  "generation",
  "targetMode",
  "generationKind",
  "predecessorKind",
  "sourceCommit",
  "sourceTree",
  "hostCommit",
  "hostTree",
  "authorityUseHash",
  "hostFenceHash",
  "issuedAt",
  "expiresAt",
  "verifiedAt",
]);

const BINDING_KEYS = Object.freeze([
  "receiptId",
  "receiptHash",
  "generation",
  "sourceCommit",
  "sourceTree",
  "hostCommit",
  "hostTree",
  "authorityUseHash",
  "hostFenceHash",
  "issuedAt",
  "expiresAt",
]);

export class HandoffV2Gate7AdmissionError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = "HandoffV2Gate7AdmissionError";
    this.code = code;
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function failClosed(code, message, options) {
  throw new HandoffV2Gate7AdmissionError(code, message, options);
}

function canonicalCompactJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalCompactJson(entry)).join(",")}]`;
  }
  if (isRecord(value)) {
    const keys = Object.keys(value).toSorted();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${canonicalCompactJson(value[key])}`)
      .join(",")}}`;
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      failClosed("OUTPUT_NOT_CANONICAL", "verifier emitted a non-finite number");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null) {
    return "null";
  }
  failClosed("OUTPUT_NOT_CANONICAL", "verifier emitted an unsupported JSON value type");
}

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function sha256Pin(bytes) {
  return `sha256:${sha256Hex(bytes)}`;
}

function normalizeStateDir(stateDir) {
  if (typeof stateDir !== "string" || stateDir.length === 0) {
    failClosed("INVALID_STATE_DIR", "options.stateDir must be a non-empty string");
  }
  const resolved = resolve(stateDir);
  if (resolved !== stateDir) {
    failClosed("INVALID_STATE_DIR", "options.stateDir must already be an absolute normalized path");
  }
  try {
    return realpathSync(resolved);
  } catch (error) {
    failClosed("INVALID_STATE_DIR", "options.stateDir must resolve to an existing directory", {
      cause: error,
    });
  }
}

function normalizeReceiptRelativePath(receiptRelativePath) {
  if (typeof receiptRelativePath !== "string" || receiptRelativePath.length === 0) {
    failClosed(
      "INVALID_RECEIPT_RELATIVE_PATH",
      "options.receiptRelativePath must be a non-empty string",
    );
  }
  if (receiptRelativePath.includes("\0")) {
    failClosed("INVALID_RECEIPT_RELATIVE_PATH", "options.receiptRelativePath must not contain NUL");
  }
  if (receiptRelativePath.startsWith("/")) {
    failClosed(
      "INVALID_RECEIPT_RELATIVE_PATH",
      "options.receiptRelativePath must be a state-relative path",
    );
  }
  const segments = receiptRelativePath.split("/");
  for (const segment of segments) {
    if (segment === "" || segment === "." || segment === "..") {
      failClosed(
        "INVALID_RECEIPT_RELATIVE_PATH",
        "options.receiptRelativePath segments must not be empty, '.', or '..'",
      );
    }
    if (!RECEIPT_SEGMENT_RE.test(segment)) {
      failClosed(
        "INVALID_RECEIPT_RELATIVE_PATH",
        `options.receiptRelativePath segment ${JSON.stringify(segment)} contains unsupported characters`,
      );
    }
  }
  return segments.join("/");
}

function normalizeReceiptHash(expectedReceiptHash) {
  if (typeof expectedReceiptHash !== "string" || !RECEIPT_HASH_PIN_RE.test(expectedReceiptHash)) {
    failClosed(
      "INVALID_EXPECTED_RECEIPT_HASH",
      "options.expectedReceiptHash must be a sha256:hex64 pin",
    );
  }
  return expectedReceiptHash;
}

function normalizeVerifierHash(expectedVerifierFileSha256) {
  if (
    typeof expectedVerifierFileSha256 !== "string" ||
    !RECEIPT_HASH_PIN_RE.test(expectedVerifierFileSha256)
  ) {
    failClosed(
      "INVALID_EXPECTED_VERIFIER_HASH",
      "options.expectedVerifierFileSha256 must be a sha256:hex64 pin",
    );
  }
  return expectedVerifierFileSha256;
}

function normalizeRequiredRemainingMs(requiredRemainingMs) {
  if (
    typeof requiredRemainingMs !== "number" ||
    !Number.isSafeInteger(requiredRemainingMs) ||
    requiredRemainingMs < 0
  ) {
    failClosed(
      "INVALID_REQUIRED_REMAINING_MS",
      "options.requiredRemainingMs must be a non-negative safe integer",
    );
  }
  return requiredRemainingMs;
}

function assertChainNoSymlinks(filePath, allowedRoot, description) {
  if (filePath !== allowedRoot && !filePath.startsWith(`${allowedRoot}/`)) {
    failClosed("PATH_ESCAPES_ROOT", `${description} escapes its allowed root`);
  }
  const rootStat = lstatSync(allowedRoot);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink() || (rootStat.mode & 0o022) !== 0) {
    failClosed("UNSAFE_ROOT", `${description} has an unsafe allowed root`);
  }
  const segments = filePath.slice(allowedRoot.length).split("/").filter(Boolean);
  let cursor = allowedRoot;
  for (const segment of segments) {
    cursor = `${cursor}/${segment}`;
    const isLeaf = cursor === filePath;
    const stat = lstatSync(cursor);
    if (isLeaf) {
      if (!stat.isFile() || stat.isSymbolicLink()) {
        failClosed("UNSAFE_FILE", `${description} must be a regular non-symlink file`);
      }
    } else {
      if (!stat.isDirectory() || stat.isSymbolicLink()) {
        failClosed("UNSAFE_PARENT", `${description} has an unsafe parent directory at ${cursor}`);
      }
      if ((stat.mode & 0o022) !== 0) {
        failClosed("UNSAFE_PARENT", `${description} parent at ${cursor} is group/world writable`);
      }
    }
  }
}

function inspectSecureFile({ filePath, allowedRoot, description, maxBytes, euid }) {
  let descriptor;
  try {
    assertChainNoSymlinks(filePath, allowedRoot, description);
    const stat = lstatSync(filePath);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      failClosed("UNSAFE_FILE", `${description} must be a regular non-symlink file`);
    }
    if ((stat.mode & 0o022) !== 0) {
      failClosed("UNSAFE_FILE", `${description} must not be group/world writable`);
    }
    if (euid !== undefined && stat.uid !== euid) {
      failClosed("UNSAFE_FILE", `${description} must be owned by the current effective uid`);
    }
    if (stat.size < 1 || stat.size > maxBytes) {
      failClosed("UNSAFE_FILE", `${description} size is outside the allowed range`);
    }
    descriptor = openSync(filePath, constants.O_RDONLY | constants.O_NOFOLLOW);
    const opened = fstatSync(descriptor);
    if (
      !opened.isFile() ||
      opened.nlink !== 1 ||
      (opened.mode & 0o022) !== 0 ||
      opened.size !== stat.size
    ) {
      failClosed("UNSAFE_FILE", `${description} failed descriptor-level security check`);
    }
    if (euid !== undefined && opened.uid !== euid) {
      failClosed("UNSAFE_FILE", `${description} failed descriptor-level owner check`);
    }
    const canonicalPath = realpathSync(filePath);
    if (canonicalPath !== allowedRoot && !canonicalPath.startsWith(`${allowedRoot}/`)) {
      failClosed("PATH_ESCAPES_ROOT", `${description} canonical path escapes its allowed root`);
    }
    return {
      path: filePath,
      canonicalPath,
      identity: {
        dev: opened.dev,
        ino: opened.ino,
        size: opened.size,
        mtimeMs: opened.mtimeMs,
        ctimeMs: opened.ctimeMs,
      },
    };
  } catch (error) {
    if (error instanceof HandoffV2Gate7AdmissionError) {
      throw error;
    }
    failClosed("UNSAFE_FILE", `${description} cannot be opened securely`, { cause: error });
  } finally {
    if (descriptor !== undefined) {
      closeSync(descriptor);
    }
  }
}

function recheckFileIdentity(filePath, before, description) {
  let descriptor;
  try {
    descriptor = openSync(filePath, constants.O_RDONLY | constants.O_NOFOLLOW);
    const after = fstatSync(descriptor);
    if (
      after.dev !== before.dev ||
      after.ino !== before.ino ||
      after.size !== before.size ||
      after.mtimeMs !== before.mtimeMs ||
      after.ctimeMs !== before.ctimeMs
    ) {
      failClosed(
        "FILE_REPLACED_DURING_VERIFICATION",
        `${description} was replaced around the verifier invocation`,
      );
    }
  } catch (error) {
    if (error instanceof HandoffV2Gate7AdmissionError) {
      throw error;
    }
    failClosed("UNSAFE_FILE", `${description} cannot be rechecked securely`, { cause: error });
  } finally {
    if (descriptor !== undefined) {
      closeSync(descriptor);
    }
  }
}

function readBytesSecurely(filePath, description) {
  let descriptor;
  try {
    descriptor = openSync(filePath, constants.O_RDONLY | constants.O_NOFOLLOW);
    const before = fstatSync(descriptor);
    const bytes = readFileSync(descriptor);
    const after = fstatSync(descriptor);
    if (
      before.dev !== after.dev ||
      before.ino !== after.ino ||
      before.size !== after.size ||
      before.mtimeMs !== after.mtimeMs ||
      before.ctimeMs !== after.ctimeMs
    ) {
      failClosed("UNSAFE_FILE", `${description} changed while it was read`);
    }
    return bytes;
  } catch (error) {
    if (error instanceof HandoffV2Gate7AdmissionError) {
      throw error;
    }
    failClosed("UNSAFE_FILE", `${description} cannot be read securely`, { cause: error });
  } finally {
    if (descriptor !== undefined) {
      closeSync(descriptor);
    }
  }
}

function defaultRunVerifier(command, args, env) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    env,
    shell: false,
    timeout: INVOCATION_TIMEOUT_MS,
    maxBuffer: VERIFIER_STDOUT_MAX_BYTES,
  });
  if (result.error) {
    if (result.error.code === "ETIMEDOUT") {
      failClosed("VERIFIER_TIMED_OUT", "host activation admission verifier timed out", {
        cause: result.error,
      });
    }
    if (result.error.code === "ENOBUFS") {
      failClosed(
        "VERIFIER_STDOUT_BOUND",
        "host activation admission verifier exceeded stdout bound",
        { cause: result.error },
      );
    }
    failClosed(
      "VERIFIER_INVOCATION_FAILED",
      "host activation admission verifier failed to execute",
      { cause: result.error },
    );
  }
  if (result.signal) {
    failClosed(
      "VERIFIER_INTERRUPTED",
      "host activation admission verifier was interrupted by a signal",
    );
  }
  if (!Number.isInteger(result.status)) {
    failClosed(
      "VERIFIER_NO_EXIT_STATUS",
      "host activation admission verifier produced no deterministic exit status",
    );
  }
  if (result.status !== 0) {
    failClosed(
      "VERIFIER_NONZERO_EXIT",
      "host activation admission verifier exited with a nonzero status",
    );
  }
  return {
    status: result.status,
    stdout: typeof result.stdout === "string" ? result.stdout : "",
    stderr: typeof result.stderr === "string" ? result.stderr : "",
  };
}

function buildClosedEnv() {
  const env = {
    LANG: "C",
    LC_ALL: "C",
    TZ: "UTC",
  };
  const existing = process.env?.[ROLLOUT_KEY_NAME];
  if (typeof existing === "string" && existing.length > 0) {
    env[ROLLOUT_KEY_NAME] = existing;
  }
  return env;
}

function parseVerifierStdout(stdout, stderr) {
  if (typeof stderr !== "string" || stderr.length !== 0) {
    failClosed("VERIFIER_STDERR_PRESENT", "verifier stderr must be empty on success");
  }
  if (typeof stdout !== "string" || stdout.length === 0) {
    failClosed("VERIFIER_EMPTY_STDOUT", "host activation admission verifier emitted no stdout");
  }
  if (stdout.length > VERIFIER_STDOUT_MAX_BYTES) {
    failClosed("VERIFIER_STDOUT_BOUND", "verifier stdout exceeded the allowed bound");
  }
  if (!stdout.endsWith("\n")) {
    failClosed("VERIFIER_OUTPUT_NOT_NEWLINE_TERMINATED", "verifier output must end with a newline");
  }
  const body = stdout.slice(0, -1);
  if (body.length === 0) {
    failClosed("VERIFIER_EMPTY_OUTPUT", "verifier output body was empty");
  }
  if (body.includes("\n")) {
    failClosed("VERIFIER_OUTPUT_MULTILINE", "verifier output must be a single line of JSON");
  }
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    failClosed("VERIFIER_OUTPUT_NOT_JSON", "verifier output was not valid JSON");
  }
  if (!isRecord(parsed)) {
    failClosed("VERIFIER_OUTPUT_NOT_OBJECT", "verifier output must be a JSON object");
  }
  const canonical = canonicalCompactJson(parsed);
  if (canonical !== body) {
    failClosed(
      "VERIFIER_OUTPUT_NOT_CANONICAL",
      "verifier output must be canonical compact JSON with sorted keys",
    );
  }
  return parsed;
}

function assertClosedSuccessShape(value) {
  const actualKeys = Object.keys(value).toSorted();
  const expectedKeys = [...CLOSED_SUCCESS_KEYS].toSorted();
  if (actualKeys.length !== expectedKeys.length) {
    failClosed(
      "ADMISSION_EXTRA_FIELDS",
      "verifier output must contain exactly the closed set of keys",
    );
  }
  for (let index = 0; index < expectedKeys.length; index += 1) {
    if (actualKeys[index] !== expectedKeys[index]) {
      failClosed(
        "ADMISSION_EXTRA_FIELDS",
        `verifier output key mismatch at index ${index}: expected ${expectedKeys[index]}, got ${actualKeys[index]}`,
      );
    }
  }
}

function ensureLiteral(value, expected, path) {
  if (value !== expected) {
    failClosed("ADMISSION_INVALID_LITERAL", `${path} must equal ${JSON.stringify(expected)}`);
  }
  return value;
}

function ensureString(value, path, pattern) {
  if (typeof value !== "string" || value.length === 0) {
    failClosed("ADMISSION_INVALID_STRING", `${path} must be a non-empty string`);
  }
  if (pattern && !pattern.test(value)) {
    failClosed("ADMISSION_INVALID_STRING", `${path} did not match the expected pattern`);
  }
  return value;
}

function ensureBool(value, path) {
  if (typeof value !== "boolean") {
    failClosed("ADMISSION_INVALID_BOOLEAN", `${path} must be a boolean`);
  }
  return value;
}

function ensurePin(value, path) {
  if (typeof value !== "string" || !SHA256_PIN_RE.test(value)) {
    failClosed("ADMISSION_INVALID_HASH", `${path} must be a sha256:hex64 pin`);
  }
  return value;
}

function ensureGitObject(value, path) {
  if (typeof value !== "string" || !GIT_OBJECT_RE.test(value)) {
    failClosed("ADMISSION_INVALID_HASH", `${path} must be a 40-character lowercase Git object id`);
  }
  return value;
}

function ensureInstant(value, path) {
  if (
    typeof value !== "string" ||
    !ISO_INSTANT_RE.test(value) ||
    !Number.isFinite(Date.parse(value))
  ) {
    failClosed("ADMISSION_INVALID_INSTANT", `${path} must be an ISO-8601 UTC instant`);
  }
  return value;
}

function validateAdmission(value, context) {
  assertClosedSuccessShape(value);
  ensureLiteral(value.schema, HANDOFF_V2_GATE7_ADMISSION_SCHEMA, "admission.schema");
  ensureLiteral(value.status, STATUS_VERIFIED, "admission.status");
  ensureBool(value.acceptsHostActivationAuthority, "admission.acceptsHostActivationAuthority");
  if (value.acceptsHostActivationAuthority !== true) {
    failClosed(
      "ADMISSION_AUTHORITY_REJECTED",
      "admission.acceptsHostActivationAuthority must be true",
    );
  }
  ensureString(value.receiptId, "admission.receiptId", RECEIPT_ID_RE);
  ensurePin(value.receiptHash, "admission.receiptHash");
  if (!Number.isSafeInteger(value.generation) || value.generation < 1) {
    failClosed(
      "ADMISSION_INVALID_GENERATION",
      "admission.generation must be a positive safe integer",
    );
  }
  ensureLiteral(value.targetMode, TARGET_MODE_SHADOW, "admission.targetMode");
  ensureLiteral(value.generationKind, GENERATION_KIND_ACTIVATION, "admission.generationKind");
  ensureLiteral(
    value.predecessorKind,
    PREDECESSOR_KIND_INITIAL_SHADOW,
    "admission.predecessorKind",
  );
  ensureGitObject(value.sourceCommit, "admission.sourceCommit");
  ensureGitObject(value.sourceTree, "admission.sourceTree");
  ensureGitObject(value.hostCommit, "admission.hostCommit");
  ensureGitObject(value.hostTree, "admission.hostTree");
  ensurePin(value.authorityUseHash, "admission.authorityUseHash");
  ensurePin(value.hostFenceHash, "admission.hostFenceHash");
  ensureInstant(value.issuedAt, "admission.issuedAt");
  ensureInstant(value.expiresAt, "admission.expiresAt");
  const verifiedAt = ensureInstant(value.verifiedAt, "admission.verifiedAt");

  if (value.receiptHash !== context.expectedReceiptHash) {
    failClosed(
      "ADMISSION_RECEIPT_HASH_MISMATCH",
      "admission.receiptHash does not equal the expected pin",
    );
  }
  const verifiedAtMs = Date.parse(verifiedAt);
  const expiresAtMs = Date.parse(value.expiresAt);
  const nowMs = context.nowMs;
  if (verifiedAtMs < context.invocationStartedAtMs) {
    failClosed(
      "ADMISSION_VERIFIED_BEFORE_INVOCATION",
      "admission.verifiedAt precedes the invocation start",
    );
  }
  if (verifiedAtMs > context.invocationEndedAtMs) {
    failClosed(
      "ADMISSION_VERIFIED_AFTER_INVOCATION",
      "admission.verifiedAt follows the invocation end",
    );
  }
  if (nowMs >= expiresAtMs) {
    failClosed("ADMISSION_EXPIRED", "admission.expiresAt is at or before now");
  }
  if (expiresAtMs - nowMs < context.requiredRemainingMs) {
    failClosed(
      "ADMISSION_INSUFFICIENT_REMAINING",
      "admission does not outlive the required remaining lifetime",
    );
  }
  if (context.expectedBinding !== undefined) {
    const binding = context.expectedBinding;
    for (const key of BINDING_KEYS) {
      if (value[key] !== binding[key]) {
        failClosed(
          "ADMISSION_BINDING_MISMATCH",
          `admission.${key} does not match the immutable activation-plan binding`,
        );
      }
    }
  }
  return Object.freeze({ ...value });
}

function normalizeBinding(binding) {
  if (binding === undefined) {
    return undefined;
  }
  if (!isRecord(binding)) {
    failClosed("INVALID_EXPECTED_BINDING", "options.expectedBinding must be an object");
  }
  const normalized = {};
  for (const key of BINDING_KEYS) {
    if (!Object.hasOwn(binding, key)) {
      failClosed(
        "INVALID_EXPECTED_BINDING",
        `options.expectedBinding is missing required field ${key}`,
      );
    }
    normalized[key] = binding[key];
  }
  for (const key of Object.keys(binding)) {
    if (!BINDING_KEYS.includes(key)) {
      failClosed(
        "INVALID_EXPECTED_BINDING",
        `options.expectedBinding must only contain binding keys: ${BINDING_KEYS.join(", ")}`,
      );
    }
  }
  return Object.freeze(normalized);
}

export function verifyHandoffV2Gate7Admission(options, dependencies = {}) {
  if (!isRecord(options)) {
    failClosed("INVALID_OPTIONS", "options must be an object");
  }
  const runVerifierImpl = dependencies.runVerifier ?? defaultRunVerifier;
  const nowImpl = dependencies.now ?? Date.now;
  const euidImpl =
    dependencies.euid ?? (() => (typeof process.geteuid === "function" ? process.geteuid() : -1));

  const stateDir = normalizeStateDir(options.stateDir);
  const receiptRelativePath = normalizeReceiptRelativePath(options.receiptRelativePath);
  const expectedReceiptHash = normalizeReceiptHash(options.expectedReceiptHash);
  const expectedVerifierFileSha256 = normalizeVerifierHash(options.expectedVerifierFileSha256);
  const requiredRemainingMs = normalizeRequiredRemainingMs(options.requiredRemainingMs ?? 0);
  const expectedBinding = normalizeBinding(options.expectedBinding);

  const verifierPath = resolve(stateDir, VERIFIER_RELATIVE_PATH);
  const verifierInspection = inspectSecureFile({
    filePath: verifierPath,
    allowedRoot: stateDir,
    description: "host activation admission verifier",
    maxBytes: VERIFIER_FILE_MAX_BYTES,
    euid: euidImpl(),
  });
  const verifierBytes = readBytesSecurely(
    verifierInspection.path,
    "host activation admission verifier",
  );
  const verifierFileSha256 = sha256Pin(verifierBytes);
  if (verifierFileSha256 !== expectedVerifierFileSha256) {
    failClosed(
      "VERIFIER_HASH_MISMATCH",
      "installed host activation admission verifier does not match the reviewed SHA-256 pin",
    );
  }

  const receiptPath = resolve(stateDir, receiptRelativePath);
  const receiptInspection = inspectSecureFile({
    filePath: receiptPath,
    allowedRoot: stateDir,
    description: "host activation receipt",
    maxBytes: RECEIPT_FILE_MAX_BYTES,
    euid: euidImpl(),
  });
  const receiptBytes = readBytesSecurely(receiptInspection.path, "host activation receipt");
  const receiptFileSha256 = sha256Pin(receiptBytes);

  const command = process.execPath;
  const args = [
    verifierInspection.path,
    "--state-root",
    stateDir,
    "--receipt",
    receiptInspection.path,
    "--expected-receipt-hash",
    expectedReceiptHash,
  ];
  const env = buildClosedEnv();

  const invocationStartedAtMs = nowImpl();
  let invocationError;
  let verifierResult;
  try {
    verifierResult = runVerifierImpl(command, args, env, {
      timeoutMs: INVOCATION_TIMEOUT_MS,
    });
  } catch (error) {
    invocationError = error;
  }
  const invocationEndedAtMs = nowImpl();

  recheckFileIdentity(
    verifierInspection.path,
    verifierInspection.identity,
    "host activation admission verifier",
  );
  recheckFileIdentity(
    receiptInspection.path,
    receiptInspection.identity,
    "host activation receipt",
  );

  if (invocationError !== undefined) {
    if (invocationError instanceof HandoffV2Gate7AdmissionError) {
      throw invocationError;
    }
    failClosed(
      "VERIFIER_INVOCATION_FAILED",
      "host activation admission verifier raised an unexpected error",
      { cause: invocationError },
    );
  }

  if (!isRecord(verifierResult)) {
    failClosed("VERIFIER_RESULT_INVALID", "verifier result must be an object");
  }
  if (typeof verifierResult.signal === "string" && verifierResult.signal.length > 0) {
    failClosed(
      "VERIFIER_INTERRUPTED",
      "host activation admission verifier was interrupted by a signal",
    );
  }
  if (verifierResult.status !== 0) {
    failClosed(
      "VERIFIER_NONZERO_EXIT",
      "host activation admission verifier exited with a nonzero status",
    );
  }
  if (typeof verifierResult.error === "string" && verifierResult.error.length > 0) {
    failClosed(
      "VERIFIER_INVOCATION_FAILED",
      "host activation admission verifier reported an execution error",
    );
  }
  if (typeof verifierResult.stdout !== "string") {
    failClosed("VERIFIER_STDOUT_INVALID", "verifier stdout must be a string");
  }

  const parsed = parseVerifierStdout(verifierResult.stdout, verifierResult.stderr);

  const admission = validateAdmission(parsed, {
    expectedReceiptHash,
    requiredRemainingMs,
    invocationStartedAtMs,
    invocationEndedAtMs,
    nowMs: invocationEndedAtMs,
    expectedBinding,
  });

  return Object.freeze({
    admission,
    verifierFileSha256,
    receiptFileSha256,
  });
}
