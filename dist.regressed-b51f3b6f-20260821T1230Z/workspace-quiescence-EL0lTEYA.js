import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import { Et as array, Kn as tuple, Rn as string, Tn as object, dn as literal, wn as number } from "./schemas-CZ9Toj_c.js";
import { a as workerSshCommandOptions, o as workerSshOptions, s as workerSshRemoteCommand } from "./ssh-DfcMAYGe.js";
import { c as recordRemoteWorkspaceHashMetrics, l as serializeRemoteWorkspaceHashMemo, p as MAX_RECONCILIATION_ENTRIES } from "./workspace-actual-manifest-B7ccel6H.js";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-DLvOPcsX.js";
import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/gateway/worker-environments/workspace-quiescence-scripts.ts
const REMOTE_QUIESCENCE_PS_JS = String.raw`function processes() {
  const output = childProcess.execFileSync("ps", ["-axo", "pid=,ppid=,uid=,stat=,lstart="], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    timeout: 2000,
  });
  const rows = new Map();
  for (const line of output.split("\n")) {
    const match = line.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.+)$/);
    if (!match) continue;
    rows.set(Number(match[1]), {
      ppid: Number(match[2]),
      uid: Number(match[3]),
      state: match[4],
      start: match[5],
    });
  }
  return rows;
}
function ancestors(rows) {
  const result = new Set();
  let pid = process.pid;
  while (pid > 0 && !result.has(pid)) {
    result.add(pid);
    pid = rows.get(pid)?.ppid || 0;
  }
  return result;
}
function processIdentity(pid) {
  try {
    const start = require("node:child_process").execFileSync("ps", ["-o", "lstart=", "-p", String(pid)], {
      encoding: "utf8",
      maxBuffer: 4096,
    }).trim();
    return start || null;
  } catch (error) {
    if (error && error.status === 1) return null;
    throw error;
  }
}
function processStatus(pid) {
  try {
    const output = childProcess.execFileSync("ps", ["-o", "stat=,lstart=", "-p", String(pid)], { encoding: "utf8", maxBuffer: 4096, timeout: 2000 }).trim();
    const match = /^(\S+)\s+(.+)$/u.exec(output);
    return match ? { state: match[1], start: match[2] } : null;
  } catch (error) {
    if (error && error.status === 1) return null;
    throw error;
  }
}
function quiescenceCandidates(rows, expectedUid, excludedPids, frozen) {
  const preserved = ancestors(rows);
  return [...rows.entries()].filter(
    ([pid, row]) =>
      row.uid === expectedUid &&
      !preserved.has(pid) &&
      row.ppid !== process.pid &&
      !excludedPids.has(pid) &&
      (!frozen || !frozen.has(pid)) &&
      !row.state.startsWith("T") &&
      !row.state.startsWith("Z") &&
      !row.state.startsWith("X"),
  );
}`;
const REMOTE_QUIESCENCE_LEASE_JS = String.raw`function validProcessReference(value) {
  return value && Number.isSafeInteger(value.pid) && value.pid > 0 && typeof value.start === "string" && value.start.length > 0 && value.start.length <= 128;
}
function parseLease(raw, expectedNonce, options = {}) {
  const lease = JSON.parse(raw);
  if (
    !lease ||
    lease.version !== 1 ||
    lease.nonce !== expectedNonce ||
    (lease.sharedHost !== undefined && typeof lease.sharedHost !== "boolean") ||
    !Array.isArray(lease.processes) ||
    lease.processes.length > 4096 ||
    lease.processes.some((entry) => !validProcessReference(entry)) ||
    (lease.watchdog !== null && !validProcessReference(lease.watchdog)) ||
    (options.requireWatchdog && lease.watchdog === null) ||
    !Number.isSafeInteger(lease.expiresAtMs) ||
    lease.expiresAtMs < 1 ||
    (options.minimumRemainingMs && lease.expiresAtMs - Date.now() < options.minimumRemainingMs)
  ) {
    throw new Error(options.errorMessage || "invalid workspace quiescence lease");
  }
  return lease;
}
function persistLease(targetPath, lease, verifyCurrent) {
  if (verifyCurrent) verifyCurrent(JSON.parse(fs.readFileSync(targetPath, "utf8")));
  const temporary = targetPath + "." + process.pid + "." + crypto.randomBytes(8).toString("hex");
  fs.writeFileSync(temporary, JSON.stringify(lease), { mode: 0o600, flag: "wx" });
  fs.renameSync(temporary, targetPath);
}`;
const REMOTE_WORKSPACE_QUIESCE_JS = String.raw`const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const root = fs.realpathSync(process.argv[1]);
if (typeof process.getuid !== "function") throw new Error("workspace quiescence requires POSIX");
const uid = process.getuid();
if (uid === 0) throw new Error("workspace quiescence refuses root-owned worker sessions");
const sleeper = new Int32Array(new SharedArrayBuffer(4));
const leaseDirectory = path.join(os.homedir(), ".openclaw-worker", "quiescence");
fs.mkdirSync(leaseDirectory, { recursive: true, mode: 0o700 });
fs.chmodSync(leaseDirectory, 0o700);
const workspaceKey = crypto.createHash("sha256").update(root).digest("hex");
const nonce = crypto.randomBytes(16).toString("hex");
const leasePath = path.join(leaseDirectory, workspaceKey + "." + nonce + ".json");
const watchdogTimeoutMs = Number(process.argv[2] || 12 * 60 * 1000);
if (!Number.isSafeInteger(watchdogTimeoutMs) || watchdogTimeoutMs < 1) throw new Error("invalid watchdog timeout");
const isolationMode = process.argv[3] || "dedicated";
if (isolationMode !== "dedicated" && isolationMode !== "shared-host") throw new Error("invalid workspace quiescence isolation mode");
const sharedHost = isolationMode === "shared-host";
${REMOTE_QUIESCENCE_PS_JS}
${REMOTE_QUIESCENCE_LEASE_JS}
const frozen = new Map();
let watchdogReference = null;
function writeLease(expiresAtMs = Date.now() + watchdogTimeoutMs) {
  persistLease(leasePath, {
    version: 1,
    nonce,
    sharedHost,
    processes: [...frozen].map(([pid, start]) => ({ pid, start })),
    watchdog: watchdogReference,
    expiresAtMs,
  });
}
// EPERM on SIGCONT implies the target was never ours to freeze: kill permission checks are
// identical for SIGSTOP and SIGCONT, so any process this uid successfully stopped can be resumed.
function resumeProcesses(entries) {
  for (const entry of entries) {
    if (processIdentity(entry.pid) !== entry.start) continue;
    try {
      process.kill(entry.pid, "SIGCONT");
    } catch (error) {
      if (!error || (error.code !== "ESRCH" && error.code !== "EPERM")) throw error;
    }
  }
}
const orphanNames = fs.readdirSync(leaseDirectory).filter((name) =>
  name.startsWith(workspaceKey + ".") && name.endsWith(".json"),
);
if (orphanNames.length > 16) throw new Error("too many workspace quiescence leases");
for (const name of orphanNames) {
  const match = name.match(/^[a-f0-9]{64}\.([a-f0-9]{32})\.json$/);
  if (!match) continue;
  const orphanPath = path.join(leaseDirectory, name);
  const lease = parseLease(fs.readFileSync(orphanPath, "utf8"), match[1]);
  if (lease.watchdog !== null && processIdentity(lease.watchdog.pid) === lease.watchdog.start) {
    try { process.kill(lease.watchdog.pid, "SIGTERM"); } catch (error) { if (!error || (error.code !== "ESRCH" && error.code !== "EPERM")) throw error; }
  }
  resumeProcesses(lease.processes);
  fs.unlinkSync(orphanPath);
}
writeLease();
const watchdog = childProcess.spawn(
  process.execPath,
  ["-e", processIdentity.toString() + "\n(" + watchdogMain.toString() + ")(process.argv[1], process.argv[2])", leasePath, nonce],
  { detached: true, stdio: "ignore" },
);
watchdog.unref();
if (!Number.isSafeInteger(watchdog.pid) || watchdog.pid < 1) {
  fs.unlinkSync(leasePath);
  throw new Error("workspace quiescence watchdog did not start");
}
let watchdogStart = null;
for (let attempt = 0; attempt < 100 && !watchdogStart; attempt += 1) {
  watchdogStart = processIdentity(watchdog.pid);
  if (!watchdogStart) Atomics.wait(sleeper, 0, 0, 10);
}
if (!watchdogStart) {
  try { process.kill(watchdog.pid, "SIGTERM"); } catch {}
  fs.unlinkSync(leasePath);
  throw new Error("workspace quiescence watchdog identity was not observable");
}
watchdogReference = { pid: watchdog.pid, start: watchdogStart };
writeLease();
let quietScans = 0;
try {
  if (sharedHost) {
    // The worker has already published its terminal result. Manifest stability fences around
    // transfer, apply, renewal, and publication reject later writes; only the uid-wide SIGSTOP
    // sweep is skipped because this provider explicitly declared processes the lease does not own.
    process.stderr.write("workspace quiescence: shared host declared; skipping process freeze sweep\n");
    quietScans = 3;
  }
  for (let attempt = 0; !sharedHost && attempt < 250 && quietScans < 3; attempt += 1) {
    const candidates = quiescenceCandidates(
      processes(),
      uid,
      new Set([watchdog.pid]),
      frozen,
    );
    if (candidates.length + frozen.size > 4096) {
      throw new Error("too many worker processes to quiesce safely");
    }
    for (const [pid, row] of candidates) {
      try {
        frozen.set(pid, row.start);
        writeLease();
        if (processIdentity(pid) !== row.start) {
          frozen.delete(pid);
          writeLease();
          continue;
        }
        process.kill(pid, "SIGSTOP");
      } catch (error) {
        if (error && error.code === "EPERM") {
          frozen.delete(pid);
          writeLease();
          continue;
        }
        if (!error || error.code !== "ESRCH") throw error;
      }
    }
    Atomics.wait(sleeper, 0, 0, 20);
    const writable = quiescenceCandidates(
      processes(),
      uid,
      new Set([watchdog.pid]),
    ).length > 0;
    quietScans = writable ? 0 : quietScans + 1;
  }
  if (quietScans < 3) {
    throw new Error("worker processes did not reach a quiescent state");
  }
} catch (error) {
  if (processIdentity(watchdog.pid) === watchdogStart) {
    try { process.kill(watchdog.pid, "SIGTERM"); } catch (killError) { if (!killError || (killError.code !== "ESRCH" && killError.code !== "EPERM")) throw killError; }
  }
  resumeProcesses([...frozen].map(([pid, start]) => ({ pid, start })));
  try { fs.unlinkSync(leasePath); } catch (unlinkError) { if (!unlinkError || unlinkError.code !== "ENOENT") throw unlinkError; }
  throw error;
}
function watchdogMain(watchedLeasePath, watchedNonce) {
  const check = () => {
    try {
      const watchdogFs = require("node:fs");
      const lease = JSON.parse(watchdogFs.readFileSync(watchedLeasePath, "utf8"));
      if (
        !lease ||
        lease.version !== 1 ||
        lease.nonce !== watchedNonce ||
        !Array.isArray(lease.processes) ||
        !Number.isSafeInteger(lease.expiresAtMs)
      ) return;
      const remainingMs = lease.expiresAtMs - Date.now();
      if (remainingMs > 0) {
        setTimeout(check, Math.min(remainingMs, 60 * 1000));
        return;
      }
      // Re-read at expiry so a renewal that raced this wake-up wins before SIGCONT.
      const latest = JSON.parse(watchdogFs.readFileSync(watchedLeasePath, "utf8"));
      if (
        latest &&
        latest.version === 1 &&
        latest.nonce === watchedNonce &&
        Array.isArray(latest.processes) &&
        Number.isSafeInteger(latest.expiresAtMs) &&
        latest.expiresAtMs > Date.now()
      ) {
        setTimeout(check, Math.min(latest.expiresAtMs - Date.now(), 60 * 1000));
        return;
      }
      for (const entry of lease.processes) {
        if (
          !entry ||
          !Number.isSafeInteger(entry.pid) ||
          entry.pid < 1 ||
          typeof entry.start !== "string" ||
          processIdentity(entry.pid) !== entry.start
        ) continue;
        try { process.kill(entry.pid, "SIGCONT"); } catch (error) { if (!error || (error.code !== "ESRCH" && error.code !== "EPERM")) throw error; }
      }
      watchdogFs.unlinkSync(watchedLeasePath);
    } catch (error) {
      if (!error || error.code !== "ENOENT") process.exitCode = 1;
    }
  };
  check();
}
process.stdout.write("quiesced " + nonce + "\n");
`;
const REMOTE_WORKSPACE_RENEW_QUIESCENCE_JS = String.raw`const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const root = fs.realpathSync(process.argv[1]);
const nonce = process.argv[2];
const timeoutMs = Number(process.argv[3] || 12 * 60 * 1000);
const validationMode = process.argv[4] || "final";
const isolationMode = process.argv[5] || "dedicated";
if (typeof process.getuid !== "function") throw new Error("workspace quiescence requires POSIX");
const uid = process.getuid();
if (!/^[a-f0-9]{32}$/.test(nonce || "")) throw new Error("invalid workspace quiescence nonce");
if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 10 * 1000) throw new Error("invalid watchdog timeout");
if (validationMode !== "heartbeat" && validationMode !== "final") throw new Error("invalid workspace quiescence validation mode");
if (isolationMode !== "dedicated" && isolationMode !== "shared-host") throw new Error("invalid workspace quiescence isolation mode");
const sharedHost = isolationMode === "shared-host";
const leasePath = path.join(os.homedir(), ".openclaw-worker", "quiescence", crypto.createHash("sha256").update(root).digest("hex") + "." + nonce + ".json");
${REMOTE_QUIESCENCE_PS_JS}
${REMOTE_QUIESCENCE_LEASE_JS}
const input = parseLease(fs.readFileSync(leasePath, "utf8"), nonce, {
  requireWatchdog: true,
  minimumRemainingMs: 5000,
  errorMessage: "workspace quiescence lease is no longer active",
});
if ((input.sharedHost === true) !== sharedHost) throw new Error("workspace quiescence isolation mode changed");
function writeLease(processes, expiresAtMs) {
  // renewalQueue is the nonce's only writer; the watchdog only reads this lease.
  persistLease(leasePath, { ...input, processes, expiresAtMs }, (current) => {
    if (current.nonce !== nonce || current.watchdog?.pid !== input.watchdog.pid || current.watchdog?.start !== input.watchdog.start) {
      throw new Error("workspace quiescence lease changed during renewal");
    }
  });
}
function assertWatchdogActive() {
  const status = processStatus(input.watchdog.pid);
  if (!status || status.start !== input.watchdog.start) {
    throw new Error("workspace quiescence watchdog identity changed unexpectedly");
  }
  try { process.kill(input.watchdog.pid, 0); } catch (error) {
    if (error && error.code === "ESRCH") throw new Error("workspace quiescence watchdog exited unexpectedly");
    throw error;
  }
}
function refreshLease(processes) {
  assertWatchdogActive();
  input.expiresAtMs = Date.now() + timeoutMs;
  writeLease(processes, input.expiresAtMs);
}
for (const entry of input.processes) {
  const status = processStatus(entry.pid);
  if (!status || status.start !== entry.start) continue;
  if (status.state && !status.state.startsWith("T")) throw new Error("workspace quiescence process resumed unexpectedly");
}
refreshLease(input.processes);
if (validationMode === "final" && !sharedHost) {
  const frozen = new Map(input.processes.map((entry) => [entry.pid, entry.start]));
  let quietScans = 0;
  const sleeper = new Int32Array(new SharedArrayBuffer(4));
  // A control tunnel can reconnect after the initial freeze; enroll every late process.
  for (let attempt = 0; attempt < 250 && quietScans < 3; attempt += 1) {
    const candidates = quiescenceCandidates(
      processes(),
      uid,
      new Set([input.watchdog.pid]),
    );
    if (candidates.length + frozen.size > 4096) {
      throw new Error("too many worker processes to quiesce safely");
    }
    for (const [pid, row] of candidates) frozen.set(pid, row.start);
    let frozenEntries = [...frozen].map(([pid, start]) => ({ pid, start }));
    refreshLease(frozenEntries);
    for (const [pid, row] of candidates) {
      try {
        if (input.expiresAtMs - Date.now() < 5000) refreshLease(frozenEntries);
        const current = processStatus(pid);
        if (!current || current.start !== row.start) {
          frozen.delete(pid);
          continue;
        }
        if (input.expiresAtMs - Date.now() < 2500) refreshLease(frozenEntries);
        process.kill(pid, "SIGSTOP");
      } catch (error) {
        if (!error || (error.code !== "ESRCH" && error.code !== "EPERM")) throw error;
        // Fail-closed either way: the candidate scan below runs without the frozen filter,
        // so an EPERM-live process re-registers as a candidate and blocks quiescence.
        frozen.delete(pid);
      }
    }
    frozenEntries = [...frozen].map(([pid, start]) => ({ pid, start }));
    refreshLease(frozenEntries);
    Atomics.wait(sleeper, 0, 0, 20);
    const unknownProcess = quiescenceCandidates(
      processes(),
      uid,
      new Set([input.watchdog.pid]),
    ).length > 0;
    quietScans = candidates.length > 0 || unknownProcess ? 0 : quietScans + 1;
  }
  if (quietScans < 3) {
    throw new Error("worker processes did not return to a quiescent state");
  }
  input.processes = [...frozen].map(([pid, start]) => ({ pid, start }));
}
const renewed = { ...input, expiresAtMs: Date.now() + timeoutMs };
refreshLease(renewed.processes);
renewed.expiresAtMs = input.expiresAtMs;
const confirmed = JSON.parse(fs.readFileSync(leasePath, "utf8"));
if (confirmed.nonce !== nonce || confirmed.expiresAtMs !== renewed.expiresAtMs) {
  throw new Error("workspace quiescence renewal was not durable");
}
process.stdout.write("renewed " + nonce + "\n");
`;
const REMOTE_WORKSPACE_RESUME_JS = String.raw`const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
if (typeof process.getuid !== "function") throw new Error("workspace quiescence requires POSIX");
const root = fs.realpathSync(process.argv[1]);
const nonce = process.argv[2];
if (!/^[a-f0-9]{32}$/.test(nonce || "")) throw new Error("invalid workspace quiescence nonce");
const leasePath = path.join(os.homedir(), ".openclaw-worker", "quiescence", crypto.createHash("sha256").update(root).digest("hex") + "." + nonce + ".json");
let raw;
try { raw = fs.readFileSync(leasePath, "utf8"); } catch (error) {
  if (error && error.code === "ENOENT") process.exit(0);
  throw error;
}
${REMOTE_QUIESCENCE_PS_JS}
${REMOTE_QUIESCENCE_LEASE_JS}
const input = parseLease(raw, nonce);
if (input.watchdog !== null && processIdentity(input.watchdog.pid) === input.watchdog.start) {
  try { process.kill(input.watchdog.pid, "SIGTERM"); } catch (error) { if (!error || (error.code !== "ESRCH" && error.code !== "EPERM")) throw error; }
}
for (const entry of input.processes) {
  if (processIdentity(entry.pid) !== entry.start) continue;
  try { process.kill(entry.pid, "SIGCONT"); } catch (error) { if (!error || (error.code !== "ESRCH" && error.code !== "EPERM")) throw error; }
}
fs.unlinkSync(leasePath);
`;
//#endregion
//#region src/gateway/worker-environments/workspace-sync-helpers.ts
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const remoteWorkspaceManifestEnvelopeSchema = object({
	version: literal(1),
	manifestRef: string().regex(MANIFEST_REF_PATTERN),
	memo: array(tuple([string().regex(/^worker:\d+:\d+:\d+:\d+:\d+$/u), string().regex(/^[a-f0-9]{64}$/u)])).max(MAX_RECONCILIATION_ENTRIES),
	metrics: object({
		contentHashCount: number().finite().nonnegative(),
		contentHashDurationMs: number().finite().nonnegative(),
		memoHitCount: number().finite().nonnegative(),
		totalDurationMs: number().finite().nonnegative()
	}).strict()
}).strict();
const INBOUND_QUOTA_INITIAL_POLL_MS = 25;
const INBOUND_QUOTA_MAX_POLL_MS = 250;
const WORKER_WORKSPACE_RSYNC_DESTINATION = "openclaw-rsync-destination";
function waitForQuiescenceRenewal(signal, intervalMs) {
	if (signal.aborted) return Promise.resolve(false);
	return new Promise((resolve) => {
		const onAbort = () => {
			clearTimeout(timer);
			resolve(false);
		};
		const timer = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve(true);
		}, intervalMs);
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
function workerWorkspaceCommandSucceeded(result) {
	return result.termination === "exit" && result.code === 0;
}
function workspaceSyncError(result) {
	const detail = redactSensitiveText(result.stderr || result.stdout, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return /* @__PURE__ */ new Error(detail ? `Worker workspace sync failed: ${detail}` : "Worker workspace sync failed");
}
function workerWorkspaceRsyncRemoteCommand(prepared, port = prepared.port) {
	return workerSshRemoteCommand([
		"ssh",
		...workerSshOptions(prepared, { forwarding: "disabled" }),
		"-a",
		"-x",
		"-T",
		"-p",
		String(port)
	]);
}
function workerWorkspaceRsyncReceiverPath(params) {
	const context = Buffer.from(JSON.stringify([
		params.remoteWorkspaceDir,
		params.canonicalHome,
		params.remoteRelative
	])).toString("base64url");
	const command = [
		"node",
		params.receiverEntryPath,
		params.mode,
		context,
		params.nonce
	];
	if (command.some((word) => !/^[A-Za-z0-9_./-]+$/u.test(word))) throw new Error("Worker workspace rsync receiver command is not shell-safe");
	return command.join(" ");
}
function createWorkerWorkspaceRsyncReceiverPathFactory(params) {
	return (mode) => workerWorkspaceRsyncReceiverPath({
		...params,
		mode,
		nonce: randomBytes(16).toString("hex")
	});
}
function workerAcceptedWorkspaceRsyncReceiverPath(params) {
	const markerIndex = params.remoteWorkspaceDir.lastIndexOf("/.openclaw-worker/workspaces/");
	if (markerIndex < 1) throw new Error("Accepted workspace path is outside the managed workspace root");
	const canonicalHome = params.remoteWorkspaceDir.slice(0, markerIndex);
	const remoteRelative = params.remoteWorkspaceDir.slice(markerIndex + 1);
	return workerWorkspaceRsyncReceiverPath({
		receiverEntryPath: params.receiverEntryPath,
		remoteWorkspaceDir: params.remoteWorkspaceDir,
		canonicalHome,
		remoteRelative,
		mode: "accepted-next",
		nonce: params.nonce
	});
}
function workerWorkspaceRsyncReceiverEntryPath(bundleHash) {
	if (!/^[a-f0-9]{64}$/u.test(bundleHash)) throw new Error("Worker workspace rsync receiver bundle hash is invalid");
	return `.openclaw-worker/${bundleHash}/dist/worker/workspace-rsync-receiver.js`;
}
function workerWorkspaceSshArgv(prepared, remoteArgv, port = prepared.port) {
	return [
		"ssh",
		...workerSshOptions(prepared, { forwarding: "disabled" }),
		"-a",
		"-x",
		"-T",
		"-p",
		String(port),
		"--",
		prepared.sshTarget,
		workerSshRemoteCommand(remoteArgv)
	];
}
async function resolveRemoteWorkspaceBaseManifest(runWorkspaceCommand, remoteWorkspaceDir, expectedRef) {
	const baseDigest = MANIFEST_REF_PATTERN.test(expectedRef) ? expectedRef.slice(7) : "";
	if (!baseDigest) throw new Error("Worker workspace base manifest reference is invalid");
	const resolved = await runWorkspaceCommand({
		transportRetry: "idempotent",
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			remoteWorkspaceDir,
			"",
			"resolve",
			baseDigest
		]
	});
	if (!workerWorkspaceCommandSucceeded(resolved)) throw workspaceSyncError(resolved);
	if (parseManifestRef(resolved.stdout.trim()) !== expectedRef) throw new Error("Worker workspace base manifest resolution returned the wrong reference");
	return baseDigest;
}
async function resolveRemoteWorkspaceManifest(runWorkspaceCommand, remoteWorkspaceDir, expectedRef) {
	return await resolveRemoteWorkspaceBaseManifest(runWorkspaceCommand, remoteWorkspaceDir, expectedRef);
}
async function captureRemoteWorkspaceManifest(params) {
	params.metrics.remoteManifestCalls += 1;
	const startedAt = performance.now();
	const captured = await params.runWorkspaceCommand({
		transportRetry: "idempotent",
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			params.remoteWorkspaceDir,
			params.baseCommit ?? "",
			...params.baseCommit ? ["eligible"] : [],
			...params.priorManifestDigests,
			"memo-v1"
		],
		input: serializeRemoteWorkspaceHashMemo(params.hashMemo)
	}).finally(() => {
		params.metrics.remoteManifestWallDurationMs += performance.now() - startedAt;
	});
	if (!workerWorkspaceCommandSucceeded(captured)) throw workspaceSyncError(captured);
	let response;
	try {
		response = remoteWorkspaceManifestEnvelopeSchema.parse(JSON.parse(captured.stdout));
	} catch (error) {
		throw new Error("Worker workspace manifest returned an invalid memo response", { cause: error });
	}
	for (const identity of params.hashMemo.keys()) if (identity.startsWith("worker:")) params.hashMemo.delete(identity);
	for (const [identity, sha256] of response.memo) params.hashMemo.set(identity, sha256);
	recordRemoteWorkspaceHashMetrics(params.metrics, response.metrics);
	return response.manifestRef;
}
async function probeWorkspaceGitMode(params) {
	if (!await fs.lstat(path.join(params.localPath, ".git")).catch((error) => {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
		throw error;
	})) return {
		mode: "plain",
		gitRoot: params.localPath,
		baseCommit: ""
	};
	const [gitRootResult, gitBaseResult] = await Promise.all([params.runTask([
		"git",
		"-C",
		params.localPath,
		"rev-parse",
		"--show-toplevel"
	], params.commandOptions), params.runTask([
		"git",
		"-C",
		params.localPath,
		"rev-parse",
		"--verify",
		"--quiet",
		"HEAD"
	], params.commandOptions)]);
	if (!workerWorkspaceCommandSucceeded(gitRootResult)) throw workspaceSyncError(gitRootResult);
	if (workerWorkspaceCommandSucceeded(gitBaseResult)) return {
		mode: "git",
		gitRoot: gitRootResult.stdout.trim(),
		baseCommit: gitBaseResult.stdout.trim()
	};
	if (gitBaseResult.termination === "exit" && gitBaseResult.code === 1) return {
		mode: "plain",
		gitRoot: params.localPath,
		baseCommit: ""
	};
	throw workspaceSyncError(gitBaseResult);
}
function stableWorkerPathComponent(value, length) {
	return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function validateWorkspaceSyncRequest(request) {
	if (!request.sessionId.trim()) throw new Error("Worker workspace session id must be non-empty");
	if (!path.isAbsolute(request.localPath)) throw new Error("Worker workspace local path must be absolute");
	if (!Number.isSafeInteger(request.generation) || request.generation < 0) throw new Error("Worker workspace generation must be a non-negative safe integer");
}
function parseRemoteWorkspaceSetup(stdout, remoteRelative) {
	let response;
	try {
		response = JSON.parse(stdout);
	} catch {
		throw new Error("Worker workspace setup returned an invalid response");
	}
	const record = isRecord(response) ? response : void 0;
	const canonicalHome = record?.canonicalHome;
	const remoteWorkspaceDir = record?.canonicalWorkspace;
	if (record?.tag !== "openclaw-workspace-setup-v1" || typeof canonicalHome !== "string" || !path.posix.isAbsolute(canonicalHome) || path.posix.normalize(canonicalHome) !== canonicalHome || typeof remoteWorkspaceDir !== "string" || !path.posix.isAbsolute(remoteWorkspaceDir) || path.posix.normalize(remoteWorkspaceDir) !== remoteWorkspaceDir || remoteWorkspaceDir === "/" || remoteWorkspaceDir !== path.posix.join(canonicalHome, remoteRelative)) throw new Error("Worker workspace setup returned an invalid response");
	return {
		canonicalHome,
		remoteWorkspaceDir
	};
}
function parseManifestRef(stdout) {
	const lines = stdout.split(/\r?\n/u).filter(Boolean);
	const manifestRef = lines.length === 1 ? lines[0] : void 0;
	if (!manifestRef || !MANIFEST_REF_PATTERN.test(manifestRef)) throw new Error("Worker workspace sync returned an invalid manifest reference");
	return manifestRef;
}
async function readTransferredManifest(filePath) {
	const stats = await fs.lstat(filePath).catch((error) => {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
		throw error;
	});
	if (!stats?.isFile() || stats.isSymbolicLink() || stats.size > 64 * 1024 * 1024) throw new Error("Worker workspace manifest transfer is not a bounded regular file");
	return await fs.readFile(filePath, "utf8");
}
async function inboundDirectoryUsage(root, limits) {
	let bytes = 0;
	let entries = 0;
	const walk = async (directory) => {
		for await (const directoryEntry of await fs.opendir(directory)) {
			const candidate = path.join(directory, directoryEntry.name);
			const stats = await fs.lstat(candidate).catch((error) => {
				if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
				throw error;
			});
			if (!stats) continue;
			entries += 1;
			if (entries > limits.entries) return;
			if (stats.isDirectory() && !stats.isSymbolicLink()) await walk(candidate);
			else if (stats.isFile()) {
				bytes += stats.size;
				if (bytes > limits.bytes) return;
			}
			if (bytes > limits.bytes || entries > limits.entries) return;
		}
	};
	await walk(root);
	return {
		bytes,
		entries
	};
}
async function runBoundedInboundRsync(params) {
	const quotaAbort = new AbortController();
	const signal = AbortSignal.any([params.ownerSignal, quotaAbort.signal]);
	const transfer = params.runTask(params.argv, workerSshCommandOptions({
		timeoutMs: params.timeoutMs,
		signal
	}));
	const transferSettled = transfer.then(() => true, () => true);
	let quotaError;
	let pollIntervalMs = INBOUND_QUOTA_INITIAL_POLL_MS;
	while (!await Promise.race([transferSettled, setTimeout$1(pollIntervalMs).then(() => false)])) {
		const usage = await inboundDirectoryUsage(params.destinationRoot, {
			bytes: params.totalByteLimit,
			entries: params.entryLimit
		});
		if (usage.bytes > params.totalByteLimit || usage.entries > params.entryLimit) {
			quotaError = /* @__PURE__ */ new Error(`Cloud workspace inbound transfer exceeds its ${params.totalByteLimit} byte or ${params.entryLimit} entry limit`);
			quotaAbort.abort(quotaError);
			break;
		}
		pollIntervalMs = Math.min(pollIntervalMs * 2, INBOUND_QUOTA_MAX_POLL_MS);
	}
	let result;
	try {
		result = await transfer;
	} catch (error) {
		throw quotaError ?? error;
	}
	const finalUsage = await inboundDirectoryUsage(params.destinationRoot, {
		bytes: params.totalByteLimit,
		entries: params.entryLimit
	});
	if (quotaError || finalUsage.bytes > params.totalByteLimit || finalUsage.entries > params.entryLimit) throw quotaError ?? /* @__PURE__ */ new Error(`Cloud workspace inbound transfer exceeds its ${params.totalByteLimit} byte or ${params.entryLimit} entry limit`);
	return result;
}
//#endregion
//#region src/gateway/worker-environments/workspace-quiescence.ts
const WORKSPACE_QUIESCENCE_TIMEOUT_MS = 12 * 6e4;
const WORKSPACE_QUIESCENCE_RENEW_INTERVAL_MS = 4 * 6e4;
function createWorkerWorkspaceQuiescence(params) {
	return async (remoteWorkspaceDir) => {
		if (!path.posix.isAbsolute(remoteWorkspaceDir)) throw new Error("Worker workspace quiescence path must be absolute");
		const hostMode = params.sharedHost ? "shared-host" : "dedicated";
		const run = async (argv) => {
			const result = await params.runWorkspaceCommand({
				transportRetry: "never",
				argv
			});
			if (!workerWorkspaceCommandSucceeded(result)) throw workspaceSyncError(result);
			return result;
		};
		const result = await run([
			"node",
			"-e",
			REMOTE_WORKSPACE_QUIESCE_JS,
			remoteWorkspaceDir,
			String(WORKSPACE_QUIESCENCE_TIMEOUT_MS),
			hostMode
		]);
		const acknowledgement = /^quiesced ([a-f0-9]{32})$/u.exec(result.stdout.trim());
		if (!acknowledgement) throw new Error("Worker workspace quiescence returned an invalid acknowledgement");
		const nonce = acknowledgement[1];
		let resumed = false;
		let renewalFailure;
		const renewalAbort = new AbortController();
		const abortRenewal = () => renewalAbort.abort(params.ownerSignal.reason);
		params.ownerSignal.addEventListener("abort", abortRenewal, { once: true });
		let renewalQueue = Promise.resolve();
		const renew = (validationMode) => {
			const operation = renewalQueue.then(async () => {
				if ((await run([
					"node",
					"-e",
					REMOTE_WORKSPACE_RENEW_QUIESCENCE_JS,
					remoteWorkspaceDir,
					nonce,
					String(WORKSPACE_QUIESCENCE_TIMEOUT_MS),
					validationMode,
					hostMode
				])).stdout.trim() !== `renewed ${nonce}`) throw new Error("Worker workspace quiescence renewal returned an invalid acknowledgement");
			});
			renewalQueue = operation.catch(() => void 0);
			return operation;
		};
		const renewalLoop = (async () => {
			while (!renewalAbort.signal.aborted) {
				if (!await waitForQuiescenceRenewal(renewalAbort.signal, WORKSPACE_QUIESCENCE_RENEW_INTERVAL_MS)) return;
				try {
					await renew("heartbeat");
				} catch (error) {
					renewalFailure = error;
					return;
				}
			}
		})();
		return {
			assertActive: async () => {
				if (resumed) throw new Error("Worker workspace quiescence was already released");
				if (renewalFailure) throw new Error("Worker workspace quiescence renewal failed", { cause: renewalFailure });
				await renew("final");
			},
			resume: async () => {
				if (resumed) return;
				params.ownerSignal.removeEventListener("abort", abortRenewal);
				renewalAbort.abort();
				await renewalLoop;
				await run([
					"node",
					"-e",
					REMOTE_WORKSPACE_RESUME_JS,
					remoteWorkspaceDir,
					nonce
				]);
				resumed = true;
			}
		};
	};
}
//#endregion
export { workerWorkspaceSshArgv as _, parseManifestRef as a, readTransferredManifest as c, stableWorkerPathComponent as d, validateWorkspaceSyncRequest as f, workerWorkspaceRsyncRemoteCommand as g, workerWorkspaceRsyncReceiverEntryPath as h, createWorkerWorkspaceRsyncReceiverPathFactory as i, resolveRemoteWorkspaceManifest as l, workerWorkspaceCommandSucceeded as m, WORKER_WORKSPACE_RSYNC_DESTINATION as n, parseRemoteWorkspaceSetup as o, workerAcceptedWorkspaceRsyncReceiverPath as p, captureRemoteWorkspaceManifest as r, probeWorkspaceGitMode as s, createWorkerWorkspaceQuiescence as t, runBoundedInboundRsync as u, workspaceSyncError as v };
