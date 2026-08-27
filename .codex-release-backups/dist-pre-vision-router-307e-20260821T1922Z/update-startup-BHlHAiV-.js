import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { R as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { d as resolveGatewaySystemdServiceName, f as resolveGatewayWindowsTaskName, s as resolveGatewayLaunchAgentLabel } from "./constants-B4HhnyPv.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { i as resolveNodeSqliteLocation } from "./node-sqlite-sCL6pEgr.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-Cr5lTl_D.js";
import { i as refreshRemoteModelCatalog, r as REMOTE_MODEL_CATALOG_TTL_MS } from "./model-catalog-CvIVbKms.js";
import { r as detectRespawnSupervisor, t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-DPGGuE_D.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { d as scheduleGatewaySigusr1Restart, l as resolveGatewayRestartDeferralTimeoutMs } from "./restart-CgqaA_Te.js";
import { t as forceKillChildProcessTree } from "./child-process-tree-xIY3C8pa.js";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-C1PhE00B.js";
import { h as updateInstallRootsMatch, m as resolveUpdateInstallRoot, u as readVerifiedGitUpdateReceipt } from "./restart-sentinel-CWrwiMK_.js";
import { a as channelToNpmTag, d as resolveEffectiveUpdateChannel, l as normalizeUpdateChannel } from "./update-channels-Dv2OGOSa.js";
import { n as compareSemverStrings, o as resolveNpmChannelTag, t as checkUpdateStatus } from "./update-check-Du5TJ6YP.js";
import { r as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON } from "./update-control-plane-sentinel-B7T4OA34.js";
import { n as applyDevUpdateTargetEnv, r as devUpdateTargetFromGitCampaign } from "./update-dev-target-CgOB-zhY.js";
import { t as MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX } from "./update-managed-service-handoff-cleanup-B18agwDB.js";
import { createHash, randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
//#region src/infra/update-campaign.ts
const CAMPAIGN_FORCE_DELAY_MS = 15 * 6e4;
const CAMPAIGN_COUNTDOWN_MS = 6e4;
const CAMPAIGN_HOLD_MS = 60 * 6e4;
const CAMPAIGN_POLL_MS = 5e3;
function sameTarget(a, b) {
	if (a.kind !== b.kind) return false;
	if (a.kind === "package" && b.kind === "package") return a.version === b.version;
	return a.kind === "git" && b.kind === "git" && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.commitsBehind === b.commitsBehind;
}
/** Owns the single in-memory automatic-update campaign for this process. */
var UpdateCampaignController = class {
	constructor(dependencies = {
		now: () => Date.now(),
		setTimer: (callback, delayMs) => setTimeout(callback, delayMs),
		clearTimer: (timer) => clearTimeout(timer),
		createId: randomUUID
	}) {
		this.dependencies = dependencies;
		this.held = false;
	}
	getState() {
		return this.campaign;
	}
	announce(announcement) {
		if (this.target && this.campaign && sameTarget(this.target, announcement.target)) {
			this.announcement = announcement;
			this.reconcile();
			return;
		}
		this.cancelTimer();
		this.held = false;
		this.target = announcement.target;
		this.announcement = announcement;
		const now = this.dependencies.now();
		this.campaign = {
			id: this.dependencies.createId(),
			state: "waiting-for-idle",
			announcedAtMs: now,
			forceAtMs: now + CAMPAIGN_FORCE_DELAY_MS,
			updatedAtMs: now
		};
		announcement.onChange(this.campaign);
		this.reconcile();
	}
	clear() {
		const onChange = this.announcement?.onChange;
		const hadCampaign = this.campaign !== void 0;
		this.reset();
		if (hadCampaign) onChange?.(void 0);
	}
	adopt() {
		const campaign = this.campaign;
		const target = this.target;
		if (!campaign || !target || campaign.state === "applying") return;
		this.beginApplying(false, false);
		return {
			campaignId: campaign.id,
			target: { ...target }
		};
	}
	hold(durationMs = CAMPAIGN_HOLD_MS) {
		const campaign = this.campaign;
		if (!campaign || campaign.state === "applying" || this.held) return false;
		this.cancelTimer();
		this.held = true;
		const now = this.dependencies.now();
		const holdUntilMs = now + durationMs;
		this.transition({
			id: campaign.id,
			state: "waiting-for-idle",
			announcedAtMs: campaign.announcedAtMs,
			holdUntilMs,
			forceAtMs: holdUntilMs + CAMPAIGN_FORCE_DELAY_MS,
			updatedAtMs: now
		});
		this.scheduleNext();
		return true;
	}
	resetForTest() {
		this.reset();
	}
	reset() {
		this.cancelTimer();
		this.campaign = void 0;
		this.target = void 0;
		this.announcement = void 0;
		this.held = false;
	}
	reconcile() {
		const campaign = this.campaign;
		const announcement = this.announcement;
		if (!campaign || !announcement || campaign.state === "applying") return;
		this.cancelTimer();
		const now = this.dependencies.now();
		if (campaign.holdUntilMs !== void 0 && now < campaign.holdUntilMs) {
			this.scheduleNext();
			return;
		}
		if (now >= campaign.forceAtMs) {
			this.beginApplying(true, true);
			return;
		}
		if (campaign.state === "waiting-for-idle") {
			let idle = false;
			try {
				idle = createGatewayActiveWorkSnapshot(announcement.inspect, { ignoreTerminalSessions: true }).idle;
			} catch {}
			if (!idle) {
				this.scheduleNext();
				return;
			}
			this.transition({
				id: campaign.id,
				state: "countdown",
				announcedAtMs: campaign.announcedAtMs,
				applyAtMs: now + CAMPAIGN_COUNTDOWN_MS,
				...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
				forceAtMs: campaign.forceAtMs,
				updatedAtMs: now
			});
			this.scheduleNext();
			return;
		}
		if (campaign.applyAtMs !== void 0 && now >= campaign.applyAtMs) {
			this.beginApplying(false, true);
			return;
		}
		this.scheduleNext();
	}
	transition(next) {
		const current = this.campaign;
		if (current?.state === next.state && current.applyAtMs === next.applyAtMs && current.holdUntilMs === next.holdUntilMs && current.forceAtMs === next.forceAtMs) return;
		this.campaign = next;
		this.announcement?.onChange(next);
	}
	beginApplying(forced, runApply) {
		const campaign = this.campaign;
		const announcement = this.announcement;
		if (!campaign || !announcement) return;
		this.cancelTimer();
		const now = this.dependencies.now();
		this.transition({
			id: campaign.id,
			state: "applying",
			announcedAtMs: campaign.announcedAtMs,
			...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
			forceAtMs: campaign.forceAtMs,
			updatedAtMs: now
		});
		if (runApply) announcement.apply({ forced }).then((outcome) => {
			if (outcome === "failed" && this.campaign?.id === campaign.id) this.clear();
		}, () => {
			if (this.campaign?.id === campaign.id) this.clear();
		});
	}
	scheduleNext() {
		const campaign = this.campaign;
		if (!campaign || campaign.state === "applying") return;
		const now = this.dependencies.now();
		const holdBoundaryMs = campaign.holdUntilMs !== void 0 && campaign.holdUntilMs > now ? campaign.holdUntilMs : Number.POSITIVE_INFINITY;
		const nextBoundaryMs = Math.min(campaign.forceAtMs, campaign.applyAtMs ?? Number.POSITIVE_INFINITY, holdBoundaryMs);
		const delayMs = Math.max(0, Math.min(CAMPAIGN_POLL_MS, nextBoundaryMs - now));
		this.timer = this.dependencies.setTimer(() => this.reconcile(), delayMs);
		this.timer.unref?.();
	}
	cancelTimer() {
		if (this.timer === void 0) return;
		this.dependencies.clearTimer(this.timer);
		this.timer = void 0;
	}
};
const gatewayUpdateCampaign = new UpdateCampaignController();
//#endregion
//#region src/infra/update-managed-service-handoff.ts
const PARENT_EXIT_SHUTDOWN_RESERVE_MS = 3e4;
const HANDOFF_READY_TIMEOUT_MS = 3e4;
const HANDOFF_READY_MARKER = "OPENCLAW_UPDATE_HANDOFF_READY\n";
const HANDOFF_BUSY_MARKER = "HANDOFF_BUSY ";
const HANDOFF_STATE_DATABASE_BUSY_TIMEOUT_MS = 5e3;
const SYSTEMD_RUN_CANDIDATE_PATHS = ["/usr/bin/systemd-run", "/bin/systemd-run"];
const SERVICE_IDENTITY_ENV_VARS = /* @__PURE__ */ new Set([
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
]);
const HANDOFF_COMMAND_RUNNER_SCRIPT = String.raw`
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const params = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const gateDeadline = Date.now() + 30000;
const waitBuffer = new Int32Array(new SharedArrayBuffer(4));
while (!fs.existsSync(params.runnerGatePath)) {
  if (Date.now() >= gateDeadline) {
    process.exit(1);
  }
  Atomics.wait(waitBuffer, 0, 0, 25);
}
if (process.platform !== "win32" && typeof process.execve === "function") {
  process.execve(params.commandArgv[0], params.commandArgv, process.env);
}
const child = spawn(params.commandArgv[0], params.commandArgv.slice(1), {
  cwd: params.commandCwd,
  env: process.env,
  stdio: "inherit",
});
child.once("error", () => {
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  process.exitCode = typeof code === "number" ? code : signal ? 1 : 0;
});
`;
const HANDOFF_SCRIPT = String.raw`
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const params = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));

function appendLog(line) {
  try {
    fs.mkdirSync(path.dirname(params.logPath), { recursive: true, mode: 0o700 });
    fs.appendFileSync(params.logPath, "[" + new Date().toISOString() + "] " + line + "\n", {
      mode: 0o600,
    });
  } catch {
    // Best effort only.
  }
}

function isPidAlive(pid) {
  if (!pid || typeof pid !== "number") {
    return false;
  }
  try {
    process.kill(pid, 0);
  } catch (err) {
    return Boolean(err && err.code === "EPERM");
  }
  if (process.platform === "linux") {
    try {
      const status = fs.readFileSync("/proc/" + pid + "/status", "utf8");
      return !/^State:\s+Z/m.test(status);
    } catch {
      return false;
    }
  }
  return true;
}

function parseWindowsProcessStartTime(raw) {
  const value = String(raw || "").trim().replace(/^CreationDate=/i, "");
  const parsedIso = Date.parse(value);
  if (Number.isFinite(parsedIso)) {
    return parsedIso;
  }
  const dmtf = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);
  if (!dmtf) return null;
  const localTimeMs = Date.UTC(
    Number(dmtf[1]),
    Number(dmtf[2]) - 1,
    Number(dmtf[3]),
    Number(dmtf[4]),
    Number(dmtf[5]),
    Number(dmtf[6]),
    Math.floor(Number(dmtf[7]) / 1000),
  );
  const offsetMs = Number(dmtf[9]) * 60000 * (dmtf[8] === "+" ? 1 : -1);
  return localTimeMs - offsetMs;
}

function readProcessStartIdentity(pid) {
  if (!isPidAlive(pid)) {
    return null;
  }
  if (process.platform === "linux") {
    try {
      const stat = fs.readFileSync("/proc/" + pid + "/stat", "utf8");
      const commEndIndex = stat.lastIndexOf(")");
      if (commEndIndex < 0) return null;
      const fields = stat.slice(commEndIndex + 1).trimStart().split(/\s+/);
      const starttime = Number(fields[19]);
      return Number.isInteger(starttime) && starttime >= 0 ? String(starttime) : null;
    } catch {
      return null;
    }
  }
  if (process.platform === "darwin") {
    try {
      const result = spawnSync("/bin/ps", ["-o", "lstart=", "-p", String(pid)], {
        encoding: "utf8",
        env: { ...process.env, LC_ALL: "C", TZ: "UTC" },
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 1000,
      });
      const value = typeof result.stdout === "string" ? result.stdout.trim() : "";
      return result.status === 0 && value ? value : null;
    } catch {
      return null;
    }
  }
  if (process.platform === "win32") {
    const powershell = spawnSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        '$process = Get-CimInstance Win32_Process -Filter "ProcessId = ' +
          pid +
          '" -ErrorAction Stop; [Console]::Out.Write($process.CreationDate.ToUniversalTime().ToString("o"))',
      ],
      { encoding: "utf8", timeout: 1500, windowsHide: true },
    );
    if (!powershell.error && powershell.status === 0) {
      const startedAt = parseWindowsProcessStartTime(powershell.stdout);
      if (startedAt !== null) return String(startedAt);
    }
    const wmic = spawnSync(
      "wmic.exe",
      ["process", "where", "ProcessId=" + pid, "get", "CreationDate", "/value"],
      { encoding: "utf8", timeout: 1500, windowsHide: true },
    );
    if (!wmic.error && wmic.status === 0) {
      const line = String(wmic.stdout || "")
        .split(/\r?\n/)
        .find((entry) => /^CreationDate=/i.test(entry.trim()));
      const startedAt = parseWindowsProcessStartTime(line);
      if (startedAt !== null) return String(startedAt);
    }
  }
  return null;
}

function parseLeaseCommandIdentity(value) {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value);
    if (
      !parsed ||
      parsed.version !== 1 ||
      !Number.isInteger(parsed.pid) ||
      parsed.pid <= 0 ||
      (parsed.startIdentity !== null && typeof parsed.startIdentity !== "string")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function leaseCommandIsAlive(payloadJson) {
  const identity = parseLeaseCommandIdentity(payloadJson);
  if (!identity || !isPidAlive(identity.pid)) {
    return false;
  }
  if (identity.startIdentity === null) {
    return true;
  }
  return readProcessStartIdentity(identity.pid) === identity.startIdentity;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanupSensitiveFiles() {
  for (const filePath of params.sensitivePaths || []) {
    try {
      fs.rmSync(filePath, { force: true });
    } catch {
      // Best effort only.
    }
  }
}

function resolveExistingDirectory(candidates) {
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "string") {
      continue;
    }
    try {
      const stat = fs.statSync(candidate);
      if (stat.isDirectory()) {
        return candidate;
      }
    } catch {
      // Try the next candidate.
    }
  }
  return undefined;
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function isPendingUpdatePayload(payload) {
  const reason = payload && payload.stats && payload.stats.reason;
  return (
    payload &&
    payload.kind === "update" &&
    payload.status === "skipped" &&
    (reason === "managed-service-handoff-started" || reason === "restart-health-pending")
  );
}

// Keep this self-contained helper aligned with resolveImmutableSqliteFileUri;
// the detached script cannot import the TypeScript runtime after replacement.
function resolveImmutableStateDatabaseUri(databasePath) {
  if (process.platform === "win32") {
    const namespacedPath = path.toNamespacedPath(path.resolve(databasePath));
    return "file:" + encodeURIComponent(namespacedPath) + "?mode=ro&immutable=1";
  }
  return pathToFileURL(path.resolve(databasePath)).href + "?mode=ro&immutable=1";
}

function assertStateDatabaseWriteAllowed(database) {
  if (
    !params.stateDatabasePath ||
    typeof params.stateDatabasePath !== "string" ||
    (!database && !fs.existsSync(params.stateDatabasePath))
  ) {
    return;
  }
  const ownsDatabase = !database;
  let db = database;
  if (!db) {
    const sqlite = require("node:sqlite");
    db = new sqlite.DatabaseSync(resolveImmutableStateDatabaseUri(params.stateDatabasePath), {
      readOnly: true,
    });
  }
  try {
    if (ownsDatabase) {
      db.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
    }
    const table = db
      .prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = 'config_machine_state' LIMIT 1")
      .get();
    if (!table) return;
    const row = db
      .prepare("SELECT value_json FROM config_machine_state WHERE state_key = 'gateway.supervision' LIMIT 1")
      .get();
    if (!row) return;
    let value = null;
    if (typeof row.value_json === "string") {
      try {
        value = JSON.parse(row.value_json);
      } catch {
        // The shared owner contract below rejects invalid JSON and shape together.
      }
    }
    const keys = value && typeof value === "object" && !Array.isArray(value)
      ? Object.keys(value).sort()
      : [];
    if (
      keys.join(",") !== "claimedAt,managerId,mode,version" ||
      value.version !== 1 ||
      value.mode !== "external" ||
      typeof value.managerId !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value.managerId) ||
      !Number.isSafeInteger(value.claimedAt) ||
      value.claimedAt < 0 ||
      value.claimedAt > 8640000000000000
    ) {
      throw new Error("shared-state ownership metadata is malformed");
    }
    if ((process.env.OPENCLAW_SUPERVISOR_MODE || "").trim().toLowerCase() !== "external") {
      throw new Error(
        "shared state is externally supervised by " +
          value.managerId +
          "; use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external",
      );
    }
  } finally {
    if (ownsDatabase) {
      db.close();
    }
  }
}

function openStateDatabase() {
  if (!params.stateDatabasePath || typeof params.stateDatabasePath !== "string") {
    return null;
  }
  let db = null;
  let transactionOpen = false;
  try {
    assertStateDatabaseWriteAllowed();
    const sqlite = require("node:sqlite");
    fs.mkdirSync(path.dirname(params.stateDatabasePath), { recursive: true, mode: 0o700 });
    db = new sqlite.DatabaseSync(params.nodeSqliteLocation);
    db.exec("PRAGMA busy_timeout = ${HANDOFF_STATE_DATABASE_BUSY_TIMEOUT_MS};");
    db.exec("BEGIN IMMEDIATE;");
    transactionOpen = true;
    assertStateDatabaseWriteAllowed(db);
    db.exec([
      "CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (",
      "sentinel_key TEXT NOT NULL PRIMARY KEY,",
      "version INTEGER NOT NULL,",
      "kind TEXT NOT NULL,",
      "status TEXT NOT NULL,",
      "ts INTEGER NOT NULL,",
      "session_key TEXT,",
      "thread_id TEXT,",
      "delivery_channel TEXT,",
      "delivery_to TEXT,",
      "delivery_account_id TEXT,",
      "message TEXT,",
      "continuation_json TEXT,",
      "doctor_hint TEXT,",
      "stats_json TEXT,",
      "payload_json TEXT NOT NULL,",
      "updated_at_ms INTEGER NOT NULL",
      ") STRICT;",
      "CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts",
      "ON gateway_restart_sentinel(ts DESC, sentinel_key);",
    ].join(" "));
    ensureGatewayRestartSentinelColumns(db);
    hardenStateDatabaseFiles();
    db.exec("COMMIT;");
    transactionOpen = false;
    return db;
  } catch (err) {
    if (transactionOpen) {
      try {
        db.exec("ROLLBACK;");
      } catch {}
    }
    try {
      db?.close();
    } catch {}
    appendLog("failed to open restart sentinel database: " + (err && err.stack ? err.stack : String(err)));
    return null;
  }
}

function tableHasColumn(db, tableName, columnName) {
  try {
    return db.prepare("PRAGMA table_info(" + tableName + ")").all().some((row) => row && row.name === columnName);
  } catch {
    return false;
  }
}

function ensureColumn(db, tableName, columnSql) {
  const columnName = columnSql.trim().split(/\s+/, 1)[0];
  if (!columnName || tableHasColumn(db, tableName, columnName)) {
    return;
  }
  db.exec("ALTER TABLE " + tableName + " ADD COLUMN " + columnSql + ";");
}

function ensureGatewayRestartSentinelColumns(db) {
  ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
}

function hardenStateDatabaseFiles() {
  if (!params.stateDatabasePath || typeof params.stateDatabasePath !== "string") {
    return;
  }
  for (const filePath of [
    params.stateDatabasePath,
    params.stateDatabasePath + "-wal",
    params.stateDatabasePath + "-shm",
  ]) {
    try {
      if (fs.existsSync(filePath)) {
        fs.chmodSync(filePath, 0o600);
      }
    } catch {
      // Best effort only.
    }
  }
}

// This profile-independent SQLite coordinator owns one updater per canonical
// install root. Process identity, not time, controls stale takeover.
let managedUpdateLease = null;
let managedUpdateLeaseOwned = false;

function assertManagedUpdateLeasePath(stat, label, expectedKind) {
  const validKind = expectedKind === "directory" ? stat.isDirectory() : stat.isFile();
  if (!validKind || stat.isSymbolicLink()) {
    throw new Error("managed update lease " + label + " is not a safe " + expectedKind);
  }
  const uid = typeof process.getuid === "function" ? process.getuid() : undefined;
  if (uid !== undefined && typeof stat.uid === "number" && stat.uid !== uid) {
    throw new Error("managed update lease " + label + " is owned by another user");
  }
  if (process.platform !== "win32" && typeof stat.mode === "number" && (stat.mode & 0o077) !== 0) {
    throw new Error("managed update lease " + label + " permissions are too broad");
  }
}

function openManagedUpdateLeaseDatabase() {
  const databasePath =
    typeof params.updateLeaseDatabasePath === "string"
      ? params.updateLeaseDatabasePath.trim()
      : "";
  if (!databasePath) {
    throw new Error("managed update lease database path is unavailable");
  }
  const sqlite = require("node:sqlite");
  const databaseDir = path.dirname(databasePath);
  fs.mkdirSync(databaseDir, { recursive: true, mode: 0o700 });
  const directoryStat = fs.lstatSync(databaseDir);
  if (
    !directoryStat.isDirectory() ||
    directoryStat.isSymbolicLink() ||
    (typeof process.getuid === "function" && directoryStat.uid !== process.getuid())
  ) {
    throw new Error("managed update lease directory is unsafe");
  }
  fs.chmodSync(databaseDir, 0o700);
  assertManagedUpdateLeasePath(fs.lstatSync(databaseDir), "directory", "directory");
  if (fs.existsSync(databasePath)) {
    assertManagedUpdateLeasePath(fs.lstatSync(databasePath), "database", "file");
  }
  const db = new sqlite.DatabaseSync(databasePath);
  db.exec("PRAGMA busy_timeout = ${HANDOFF_STATE_DATABASE_BUSY_TIMEOUT_MS};");
  db.exec([
    "CREATE TABLE IF NOT EXISTS managed_update_handoffs (",
    "install_root TEXT NOT NULL PRIMARY KEY,",
    "owner TEXT NOT NULL,",
    "payload_json TEXT NOT NULL,",
    "updated_at INTEGER NOT NULL",
    ") STRICT;",
  ].join(" "));
  fs.chmodSync(databasePath, 0o600);
  assertManagedUpdateLeasePath(fs.lstatSync(databasePath), "database", "file");
  return db;
}

function runManagedUpdateLeaseTransaction(db, operation) {
  let transactionOpen = false;
  try {
    db.exec("BEGIN IMMEDIATE;");
    transactionOpen = true;
    const result = operation();
    db.exec("COMMIT;");
    transactionOpen = false;
    return result;
  } catch (err) {
    if (transactionOpen) {
      try {
        db.exec("ROLLBACK;");
      } catch {}
    }
    throw err;
  }
}

function buildLeaseProcessPayload(pid) {
  return JSON.stringify({
    version: 1,
    pid,
    startIdentity: readProcessStartIdentity(pid),
  });
}

function acquireManagedUpdateLease() {
  const key = typeof params.updateLeaseKey === "string" ? params.updateLeaseKey.trim() : "";
  const owner = typeof params.updateLeaseOwner === "string" ? params.updateLeaseOwner.trim() : "";
  if (!key || !owner) {
    throw new Error("managed update lease identity is unavailable");
  }
  const db = openManagedUpdateLeaseDatabase();
  try {
    const result = runManagedUpdateLeaseTransaction(db, () => {
      const current = db
        .prepare(
          "SELECT owner, payload_json FROM managed_update_handoffs WHERE install_root = ?",
        )
        .get(key);
      if (current && leaseCommandIsAlive(current.payload_json)) {
        return {
          acquired: false,
          owner: typeof current.owner === "string" ? current.owner : undefined,
        };
      }
      if (current) {
        db.prepare(
          "DELETE FROM managed_update_handoffs WHERE install_root = ? AND owner = ?",
        ).run(key, current.owner);
      }
      const now = Date.now();
      db.prepare(
        [
          "INSERT INTO managed_update_handoffs (install_root, owner, payload_json, updated_at)",
          "VALUES (?, ?, ?, ?)",
        ].join(" "),
      ).run(key, owner, buildLeaseProcessPayload(process.pid), now);
      return { acquired: true };
    });
    if (!result.acquired) {
      db.close();
      return result;
    }
    managedUpdateLease = { db, key, owner };
    managedUpdateLeaseOwned = true;
    return result;
  } catch (err) {
    try {
      db.close();
    } catch {}
    throw err;
  }
}

function bindManagedUpdateLeaseToProcess(pid) {
  const lease = managedUpdateLease;
  if (!lease || !managedUpdateLeaseOwned || !Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    runManagedUpdateLeaseTransaction(lease.db, () => {
      const updated = lease.db
        .prepare(
          [
            "UPDATE managed_update_handoffs SET payload_json = ?, updated_at = ?",
            "WHERE install_root = ? AND owner = ?",
          ].join(" "),
        )
        .run(buildLeaseProcessPayload(pid), Date.now(), lease.key, lease.owner);
      if (updated.changes !== 1) {
        throw new Error("managed update lease process binding was lost");
      }
    });
    return true;
  } catch (err) {
    managedUpdateLeaseOwned = false;
    appendLog(
      "managed update lease binding failed: " +
        (err && err.stack ? err.stack : String(err)),
    );
    return false;
  }
}

function releaseManagedUpdateLease() {
  const lease = managedUpdateLease;
  managedUpdateLease = null;
  if (!lease) {
    return;
  }
  try {
    if (managedUpdateLeaseOwned) {
      runManagedUpdateLeaseTransaction(lease.db, () => {
        lease.db
          .prepare(
            "DELETE FROM managed_update_handoffs WHERE install_root = ? AND owner = ?",
          )
          .run(lease.key, lease.owner);
      });
    }
  } catch (err) {
    appendLog(
      "managed update lease release failed: " +
        (err && err.stack ? err.stack : String(err)),
    );
  } finally {
    managedUpdateLeaseOwned = false;
    try {
      lease.db.close();
    } catch {}
  }
}

function parseJsonColumn(value) {
  if (typeof value !== "string" || !value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readRestartSentinelRecord(db) {
  const row = db
    .prepare(
      [
        "SELECT version, kind, status, ts, session_key, thread_id,",
        "delivery_channel, delivery_to, delivery_account_id, message, continuation_json,",
        "doctor_hint, stats_json, updated_at_ms",
        "FROM gateway_restart_sentinel WHERE sentinel_key = ?",
      ].join(" "),
    )
    .get("current");
  if (
    !row ||
    row.version !== 1 ||
    typeof row.kind !== "string" ||
    typeof row.status !== "string" ||
    typeof row.ts !== "number" ||
    typeof row.updated_at_ms !== "number"
  ) {
    return null;
  }
  const payload = {
    kind: row.kind,
    status: row.status,
    ts: row.ts,
  };
  if (typeof row.session_key === "string") payload.sessionKey = row.session_key;
  if (typeof row.thread_id === "string") payload.threadId = row.thread_id;
  const deliveryContext = {};
  if (typeof row.delivery_channel === "string") deliveryContext.channel = row.delivery_channel;
  if (typeof row.delivery_to === "string") deliveryContext.to = row.delivery_to;
  if (typeof row.delivery_account_id === "string") deliveryContext.accountId = row.delivery_account_id;
  if (Object.keys(deliveryContext).length > 0) payload.deliveryContext = deliveryContext;
  if (typeof row.message === "string") payload.message = row.message;
  const continuation = parseJsonColumn(row.continuation_json);
  if (continuation) payload.continuation = continuation;
  if (typeof row.doctor_hint === "string") payload.doctorHint = row.doctor_hint;
  const stats = parseJsonColumn(row.stats_json);
  if (stats) payload.stats = stats;
  return { revision: row.updated_at_ms, payload };
}

function readRestartSentinelRevisionFloor(db) {
  const row = db
    .prepare("SELECT updated_at_ms FROM gateway_restart_sentinel WHERE sentinel_key = ?")
    .get("revision-floor");
  if (!row) return null;
  if (!Number.isSafeInteger(row.updated_at_ms)) {
    throw new Error("restart sentinel revision floor is outside the safe integer range");
  }
  return row.updated_at_ms;
}

function advanceRestartSentinelRevisionFloor(db, revision) {
  const payloadJson = JSON.stringify({ kind: "restart", status: "skipped", ts: revision });
  db.prepare(
    [
      "INSERT INTO gateway_restart_sentinel (",
      "sentinel_key, version, kind, status, ts, session_key, thread_id,",
      "delivery_channel, delivery_to, delivery_account_id, message, continuation_json,",
      "doctor_hint, stats_json, payload_json, updated_at_ms",
      ") VALUES ('revision-floor', 1, 'restart', 'skipped', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)",
      "ON CONFLICT(sentinel_key) DO UPDATE SET",
      "ts = excluded.ts, payload_json = excluded.payload_json, updated_at_ms = excluded.updated_at_ms",
    ].join(" "),
  ).run(revision, payloadJson, revision);
}

function writeRestartSentinelPayload(db, payload, currentRevision) {
  const revisionFloor = readRestartSentinelRevisionFloor(db);
  const updatedAtMs = Math.max(Date.now(), Math.max(currentRevision || 0, revisionFloor || 0) + 1);
  if (!Number.isSafeInteger(updatedAtMs)) {
    throw new Error("restart sentinel revision exhausted the safe integer range");
  }
  const values = [
    payload.kind,
    payload.status,
    payload.ts,
    payload.sessionKey || null,
    payload.threadId || null,
    payload.deliveryContext && typeof payload.deliveryContext.channel === "string"
      ? payload.deliveryContext.channel
      : null,
    payload.deliveryContext && typeof payload.deliveryContext.to === "string"
      ? payload.deliveryContext.to
      : null,
    payload.deliveryContext && typeof payload.deliveryContext.accountId === "string"
      ? payload.deliveryContext.accountId
      : null,
    payload.message || null,
    payload.continuation ? JSON.stringify(payload.continuation) : null,
    payload.doctorHint || null,
    payload.stats ? JSON.stringify(payload.stats) : null,
    JSON.stringify(payload),
    updatedAtMs,
  ];
  let changed;
  if (currentRevision === null) {
    changed = db.prepare(
      [
        "INSERT INTO gateway_restart_sentinel (",
        "sentinel_key, version, kind, status, ts, session_key, thread_id,",
        "delivery_channel, delivery_to, delivery_account_id, message, continuation_json,",
        "doctor_hint, stats_json, payload_json, updated_at_ms",
        ") VALUES ('current', 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ].join(" "),
    ).run(...values).changes === 1;
  } else {
    changed = db.prepare(
      [
        "UPDATE gateway_restart_sentinel SET",
        "version = 1, kind = ?, status = ?, ts = ?, session_key = ?, thread_id = ?,",
        "delivery_channel = ?, delivery_to = ?, delivery_account_id = ?, message = ?,",
        "continuation_json = ?, doctor_hint = ?, stats_json = ?, payload_json = ?, updated_at_ms = ?",
        "WHERE sentinel_key = 'current' AND updated_at_ms = ?",
      ].join(" "),
    ).run(...values, currentRevision).changes === 1;
  }
  if (changed) {
    // This runs inside the same BEGIN IMMEDIATE section as the guarded current-row write.
    advanceRestartSentinelRevisionFloor(db, updatedAtMs);
  }
  return changed;
}

function buildFallbackFailurePayload(reason) {
  const metaFile = params.metaPath ? readJsonFile(params.metaPath) : null;
  const meta = metaFile && metaFile.version === 1 && metaFile.meta ? metaFile.meta : {};
  const payload = {
    kind: "update",
    status: "error",
    ts: Date.now(),
    message: typeof meta.note === "string" ? meta.note : null,
    stats: {
      mode: "unknown",
      ...(typeof meta.root === "string" && meta.root.trim() ? { root: meta.root } : {}),
      ...(typeof meta.handoffId === "string" && meta.handoffId.trim()
        ? { handoffId: meta.handoffId }
        : {}),
      reason,
      steps: [],
      durationMs: 0,
    },
  };
  if (typeof meta.sessionKey === "string" && meta.sessionKey.trim()) {
    payload.sessionKey = meta.sessionKey;
  }
  if (meta.deliveryContext && typeof meta.deliveryContext === "object") {
    payload.deliveryContext = meta.deliveryContext;
  }
  if (typeof meta.threadId === "string" && meta.threadId.trim()) {
    payload.threadId = meta.threadId;
  }
  return payload;
}

function markUpdateSentinelFailureIfPending(reason) {
  const snapshotDb = openStateDatabase();
  if (!snapshotDb) return;
  let snapshot;
  try {
    snapshot = readRestartSentinelRecord(snapshotDb);
  } catch {
    return;
  } finally {
    try {
      snapshotDb.close();
    } catch {}
  }
  const fallbackPayload = snapshot === null ? buildFallbackFailurePayload(reason) : null;

  const db = openStateDatabase();
  if (!db) return;
  let transactionOpen = false;
  try {
    db.exec("BEGIN IMMEDIATE;");
    transactionOpen = true;
    assertStateDatabaseWriteAllowed(db);
    const current = readRestartSentinelRecord(db);
    if (
      (snapshot === null && current !== null) ||
      (snapshot !== null &&
        (current === null || current.revision !== snapshot.revision))
    ) {
      db.exec("COMMIT;");
      transactionOpen = false;
      return;
    }

    let payload = current && current.payload;
    if (payload && (payload.kind !== "update" || !isPendingUpdatePayload(payload))) {
      db.exec("COMMIT;");
      transactionOpen = false;
      return;
    }
    const handoffId = typeof params.handoffId === "string" ? params.handoffId.trim() : "";
    if (payload && handoffId && (!payload.stats || payload.stats.handoffId !== handoffId)) {
      db.exec("COMMIT;");
      transactionOpen = false;
      return;
    }
    if (payload) {
      payload = { ...payload, status: "error" };
      delete payload.continuation;
      payload.stats = { ...(payload.stats || {}), reason };
    } else {
      payload = fallbackPayload;
    }
    if (!payload) {
      throw new Error("restart sentinel disappeared before guarded failure write");
    }
    if (!writeRestartSentinelPayload(db, payload, current ? current.revision : null)) {
      throw new Error("restart sentinel changed before guarded failure write");
    }
    db.exec("COMMIT;");
    transactionOpen = false;
  } catch (err) {
    if (transactionOpen) {
      try {
        db.exec("ROLLBACK;");
      } catch {}
    }
    appendLog("failed to write update sentinel failure: " + (err && err.stack ? err.stack : String(err)));
  } finally {
    try {
      db.close();
    } catch {}
  }
}

function runCommandSync(command, args) {
  try {
    const result = spawnSync(command, args, { stdio: "ignore", timeout: 30000 });
    return typeof result.status === "number" ? result.status : 1;
  } catch {
    return 1;
  }
}

function runServiceCommand(command, args) {
  return managedUpdateLeaseOwned ? runCommandSync(command, args) : 1;
}

function startGatewayServiceBestEffort() {
  const recovery = params.serviceRecovery;
  if (!recovery || typeof recovery !== "object" || !recovery.kind) {
    return;
  }
  let target = "";
  let status = 1;
  if (recovery.kind === "systemd") {
    target = recovery.unit;
    status = runServiceCommand("systemctl", ["--user", "start", recovery.unit]);
  } else if (recovery.kind === "launchd") {
    target = recovery.label;
    const serviceTarget = "gui/" + recovery.uid + "/" + recovery.label;
    status = runServiceCommand("launchctl", ["kickstart", serviceTarget]);
    if (status !== 0) {
      runServiceCommand("launchctl", ["enable", serviceTarget]);
      status = runServiceCommand("launchctl", [
        "bootstrap",
        "gui/" + recovery.uid,
        recovery.plistPath,
      ]);
      if (status !== 0) {
        // Bootstrap can fail when the label is already loaded. Retry start-only
        // so recovery does not bounce a gateway that is already running.
        status = runServiceCommand("launchctl", ["kickstart", serviceTarget]);
      }
    }
  } else if (recovery.kind === "schtasks") {
    target = recovery.taskName;
    status = runServiceCommand("schtasks.exe", ["/Run", "/TN", recovery.taskName]);
  } else {
    return;
  }
  appendLog(
    "gateway service recovery " +
      (status === 0 ? "succeeded" : "failed status=" + status) +
      " target=" +
      target,
  );
}

(async () => {
  const lease = acquireManagedUpdateLease();
  if (!lease.acquired) {
    appendLog(
      "managed update handoff joined active owner=" + (lease.owner || "unknown"),
    );
    cleanupSensitiveFiles();
    fs.writeSync(1, ${JSON.stringify(HANDOFF_BUSY_MARKER)} + (lease.owner || "") + "\n");
    await sleep(25);
    return;
  }
  fs.writeSync(1, ${JSON.stringify(HANDOFF_READY_MARKER)});

  try {
    const deadline =
      typeof params.parentExitTimeoutMs === "number"
        ? Date.now() + params.parentExitTimeoutMs
        : null;
    while (isPidAlive(params.parentPid) && (deadline === null || Date.now() < deadline)) {
      await sleep(250);
    }
    if (deadline !== null && isPidAlive(params.parentPid)) {
      appendLog("gateway parent pid " + params.parentPid + " did not exit before handoff timeout");
      markUpdateSentinelFailureIfPending("managed-service-handoff-parent-timeout");
      process.exitCode = 1;
      return;
    }

    appendLog("starting managed update command: " + params.commandLabel);
    let outputFd;
    try {
      outputFd = fs.openSync(params.logPath, "a", 0o600);
      const commandCwd =
        resolveExistingDirectory([
          params.cwd,
          os.homedir(),
          os.tmpdir(),
          path.parse(process.execPath).root,
        ]) || params.cwd;
      if (commandCwd !== params.cwd) {
        appendLog("managed update command cwd fallback: " + params.cwd + " -> " + commandCwd);
      }
      fs.writeFileSync(
        params.runnerParamsPath,
        JSON.stringify({
          commandArgv: params.commandArgv,
          commandCwd,
          runnerGatePath: params.runnerGatePath,
        }),
        { mode: 0o600 },
      );
      const child = spawn(process.execPath, [params.runnerScriptPath, params.runnerParamsPath], {
        cwd: commandCwd,
        env: process.env,
        detached: true,
        stdio: ["ignore", outputFd, outputFd],
      });
      if (!bindManagedUpdateLeaseToProcess(child.pid)) {
        try {
          child.kill("SIGKILL");
        } catch {}
        throw new Error("managed update runner lease binding failed");
      }
      fs.writeFileSync(params.runnerGatePath, "go", { mode: 0o600 });
      appendLog("managed update command pid=" + (child.pid || "unknown"));
      const exit = await new Promise((resolve) => {
        child.once("error", (err) => resolve({ error: err }));
        child.once("exit", (code, signal) => resolve({ code, signal }));
      });
      if (!bindManagedUpdateLeaseToProcess(process.pid)) {
        process.exitCode = 1;
        return;
      }
      if (exit && exit.error) {
        appendLog("managed update command failed to start: " + (exit.error && exit.error.stack ? exit.error.stack : String(exit.error)));
        markUpdateSentinelFailureIfPending("managed-service-handoff-spawn-failed");
        startGatewayServiceBestEffort();
        process.exitCode = 1;
        return;
      }
      appendLog(
        "managed update command exited code=" +
          (exit && exit.code !== null && exit.code !== undefined ? exit.code : "null") +
          " signal=" +
          (exit && exit.signal ? exit.signal : "null"),
      );
      if (exit && typeof exit.code === "number" && exit.code !== 0) {
        markUpdateSentinelFailureIfPending("managed-service-handoff-failed");
        startGatewayServiceBestEffort();
        process.exitCode = exit.code;
      } else if (exit && exit.signal) {
        markUpdateSentinelFailureIfPending("managed-service-handoff-failed");
        startGatewayServiceBestEffort();
        process.exitCode = 1;
      }
    } finally {
      if (outputFd !== undefined) {
        try {
          fs.closeSync(outputFd);
        } catch {
          // Ignore close failures.
        }
      }
    }
  } catch (err) {
    appendLog("handoff failed: " + (err && err.stack ? err.stack : String(err)));
    markUpdateSentinelFailureIfPending("managed-service-handoff-helper-failed");
    if (managedUpdateLeaseOwned) {
      bindManagedUpdateLeaseToProcess(process.pid);
      startGatewayServiceBestEffort();
    }
    process.exitCode = 1;
  } finally {
    releaseManagedUpdateLease();
    cleanupSensitiveFiles();
  }
})().catch((err) => {
  appendLog("handoff setup failed: " + (err && err.stack ? err.stack : String(err)));
  cleanupSensitiveFiles();
  process.exitCode = 1;
});
`;
function isNodeLikeRuntime(execPath) {
	if (!execPath?.trim()) return false;
	const base = path.basename(execPath).toLowerCase();
	return base === "node" || base === "node.exe" || base === "bun" || base === "bun.exe";
}
function resolveUpdateCliArgv(params) {
	const updateArgs = [
		"update",
		"--yes",
		"--json"
	];
	if (params.channel) updateArgs.push("--channel", params.channel);
	if (params.tag) updateArgs.push("--tag", params.tag);
	if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) updateArgs.push("--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3))));
	const execPath = params.execPath?.trim();
	const argv1 = params.argv1?.trim();
	if (execPath && argv1) return [
		execPath,
		argv1,
		...updateArgs
	];
	if (execPath && !isNodeLikeRuntime(execPath)) return [execPath, ...updateArgs];
	return ["openclaw", ...updateArgs];
}
function formatManagedServiceUpdateCommand(params) {
	const args = [
		"openclaw",
		"update",
		"--yes"
	];
	if (params?.channel) args.push("--channel", params.channel);
	if (params?.tag) args.push("--tag", params.tag);
	if (typeof params?.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) args.push("--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3))));
	return args.join(" ");
}
function resolveGatewayServiceRecovery(supervisor, env) {
	if (supervisor === "systemd") {
		const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
		return {
			kind: "systemd",
			unit: override ? override.endsWith(".service") ? override : `${override}.service` : `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`
		};
	}
	if (supervisor === "launchd") {
		const label = env.OPENCLAW_LAUNCHD_LABEL?.trim() || resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
		const uid = typeof process.getuid === "function" ? process.getuid() : 501;
		const home = env.HOME?.trim() || os.homedir();
		return {
			kind: "launchd",
			uid,
			label,
			plistPath: path.join(home, "Library", "LaunchAgents", `${label}.plist`)
		};
	}
	if (supervisor === "schtasks") return {
		kind: "schtasks",
		taskName: env.OPENCLAW_WINDOWS_TASK_NAME?.trim() || resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE)
	};
}
function stripSupervisorHintEnv(env) {
	const next = { ...env };
	for (const key of SUPERVISOR_HINT_ENV_VARS) {
		if (SERVICE_IDENTITY_ENV_VARS.has(key)) continue;
		delete next[key];
	}
	return next;
}
async function resolveManagedServiceHandoffCwd(root) {
	const candidates = [
		os.homedir(),
		os.tmpdir(),
		path.dirname(process.execPath),
		root
	];
	for (const candidate of candidates) {
		if (!candidate.trim()) continue;
		try {
			if ((await fs.stat(candidate)).isDirectory()) return candidate;
		} catch {}
	}
	return root;
}
function resolveManagedUpdateLeaseDatabasePath() {
	return path.join(resolvePreferredOpenClawTmpDir(), "managed-update-handoffs.sqlite");
}
async function resolveExecutableOnPath(name, env, fallbackPaths) {
	const candidates = /* @__PURE__ */ new Set();
	const pathValue = env.PATH?.trim();
	if (pathValue) {
		for (const dir of pathValue.split(path.delimiter)) if (dir.trim()) candidates.add(path.join(dir, name));
	}
	for (const candidate of fallbackPaths) candidates.add(candidate);
	for (const candidate of candidates) try {
		await fs.access(candidate, fs.constants.X_OK);
		return candidate;
	} catch {}
	return null;
}
function sanitizeSystemdUnitFragment(value) {
	return (value?.trim().replace(/[^A-Za-z0-9_.:@-]+/gu, "-") ?? "").replace(/^-+|-+$/gu, "").slice(0, 80);
}
function buildSystemdHandoffUnitName(handoffId) {
	return `openclaw-update-${sanitizeSystemdUnitFragment(handoffId) || sanitizeSystemdUnitFragment(`${process.pid}-${Date.now()}`) || "handoff"}.scope`;
}
async function waitForHandoffReady(child) {
	const output = child.stdout;
	return await new Promise((resolve, reject) => {
		let settled = false;
		let buffered = "";
		const parseReadiness = () => {
			if (buffered.includes(HANDOFF_READY_MARKER)) return { status: "ready" };
			const busyIndex = buffered.indexOf(HANDOFF_BUSY_MARKER);
			if (busyIndex < 0) return null;
			const valueStart = busyIndex + 13;
			const valueEnd = buffered.indexOf("\n", valueStart);
			if (valueEnd < 0) return null;
			const handoffId = buffered.slice(valueStart, valueEnd).trim();
			return {
				status: "joined",
				...handoffId ? { handoffId } : {}
			};
		};
		const cleanup = () => {
			clearTimeout(timeout);
			child.removeListener("error", onError);
			child.removeListener("exit", onExit);
			output.removeListener("data", onData);
			output.removeListener("error", onOutputError);
			output.destroy();
		};
		const finish = (result, err) => {
			if (settled) return;
			settled = true;
			cleanup();
			if (err) reject(err);
			else if (result) resolve(result);
			else reject(/* @__PURE__ */ new Error("managed update handoff readiness result is unavailable"));
		};
		const onError = (err) => finish(null, err);
		const onExit = (code, signal) => {
			const readiness = parseReadiness();
			finish(readiness, readiness ? void 0 : /* @__PURE__ */ new Error(`managed update handoff exited before signaling readiness (code=${code ?? "null"}, signal=${signal ?? "null"})`));
		};
		const terminateBeforeFailure = () => {
			if (typeof child.pid !== "number" || child.pid <= 0) return;
			forceKillChildProcessTree(child);
		};
		const onOutputError = (err) => {
			terminateBeforeFailure();
			finish(null, err);
		};
		const onData = (chunk) => {
			buffered = `${buffered}${chunk.toString()}`.slice(-1024);
			const readiness = parseReadiness();
			if (readiness) finish(readiness);
		};
		const timeout = setTimeout(() => {
			terminateBeforeFailure();
			finish(null, /* @__PURE__ */ new Error("managed update handoff did not signal readiness within 30 seconds"));
		}, HANDOFF_READY_TIMEOUT_MS);
		child.once("error", onError);
		child.once("exit", onExit);
		output.once("error", onOutputError);
		output.on("data", onData);
	});
}
async function resolveHandoffSpawn(params) {
	if (params.supervisor !== "systemd") return {
		command: params.execPath,
		args: [params.scriptPath, params.paramsPath]
	};
	const systemdRunPath = await resolveExecutableOnPath("systemd-run", params.env, SYSTEMD_RUN_CANDIDATE_PATHS);
	if (!systemdRunPath) throw new Error("systemd-run is required to start the managed update handoff outside openclaw-gateway.service");
	return {
		command: systemdRunPath,
		args: [
			"--user",
			"--scope",
			"--collect",
			`--unit=${buildSystemdHandoffUnitName(params.handoffId)}`,
			params.execPath,
			params.scriptPath,
			params.paramsPath
		]
	};
}
async function spawnManagedServiceUpdateHandoff(params, rootIdentity) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX));
	const scriptPath = path.join(dir, "handoff.cjs");
	const paramsPath = path.join(dir, "handoff.json");
	const metaPath = path.join(dir, "sentinel-meta.json");
	const runnerScriptPath = path.join(dir, "update-runner.cjs");
	const runnerParamsPath = path.join(dir, "update-runner.json");
	const runnerGatePath = path.join(dir, "update-runner.go");
	const logPath = path.join(dir, "handoff.log");
	const commandArgv = resolveUpdateCliArgv({
		timeoutMs: params.timeoutMs,
		channel: params.channel,
		tag: params.tag,
		execPath: params.execPath ?? process.execPath,
		argv1: params.argv1 ?? process.argv[1]
	});
	const commandLabel = formatManagedServiceUpdateCommand({
		timeoutMs: params.timeoutMs,
		channel: params.channel,
		tag: params.tag
	});
	const handoffCwd = await resolveManagedServiceHandoffCwd(params.root);
	const metaFile = {
		version: 1,
		meta: {
			...params.meta,
			root: rootIdentity
		}
	};
	const stateDatabasePath = resolveOpenClawStateSqlitePath(params.env ?? process.env);
	const helperParams = {
		parentPid: params.parentPid ?? process.pid,
		parentExitTimeoutMs: params.restartDrainTimeoutMs === void 0 ? null : Math.max(0, params.restartDelayMs ?? 0) + Math.max(0, params.restartDrainTimeoutMs) + PARENT_EXIT_SHUTDOWN_RESERVE_MS,
		cwd: handoffCwd,
		commandArgv,
		commandLabel,
		handoffId: params.handoffId,
		logPath,
		metaPath,
		stateDatabasePath,
		nodeSqliteLocation: resolveNodeSqliteLocation(stateDatabasePath),
		updateLeaseDatabasePath: resolveManagedUpdateLeaseDatabasePath(),
		updateLeaseKey: rootIdentity,
		updateLeaseOwner: params.handoffId,
		runnerScriptPath,
		runnerParamsPath,
		runnerGatePath,
		sensitivePaths: [
			scriptPath,
			paramsPath,
			metaPath,
			runnerScriptPath,
			runnerParamsPath,
			runnerGatePath
		],
		serviceRecovery: resolveGatewayServiceRecovery(params.supervisor, params.env ?? process.env)
	};
	let child;
	let readiness;
	try {
		await fs.writeFile(scriptPath, `${HANDOFF_SCRIPT}\n`, { mode: 448 });
		await fs.writeFile(runnerScriptPath, `${HANDOFF_COMMAND_RUNNER_SCRIPT}\n`, { mode: 448 });
		await fs.writeFile(paramsPath, `${JSON.stringify(helperParams, null, 2)}\n`, { mode: 384 });
		await fs.writeFile(metaPath, `${JSON.stringify(metaFile, null, 2)}\n`, { mode: 384 });
		const childEnv = {
			...stripSupervisorHintEnv(params.env ?? process.env),
			[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV]: metaPath,
			OPENCLAW_UPDATE_RUN_HANDOFF: "1"
		};
		const env = params.devTarget ? applyDevUpdateTargetEnv(childEnv, params.devTarget) : childEnv;
		const spawnTarget = await resolveHandoffSpawn({
			supervisor: params.supervisor,
			env,
			execPath: params.execPath ?? process.execPath,
			scriptPath,
			paramsPath,
			handoffId: params.handoffId
		});
		child = spawn(spawnTarget.command, spawnTarget.args, {
			cwd: handoffCwd,
			env,
			detached: true,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		});
		readiness = await waitForHandoffReady(child);
	} catch (err) {
		await fs.rm(dir, {
			recursive: true,
			force: true
		}).catch(() => {});
		throw err;
	}
	child.unref();
	return {
		status: readiness.status === "ready" ? "started" : "joined",
		...readiness.status === "ready" && child.pid ? { pid: child.pid } : {},
		command: commandLabel,
		logPath,
		...readiness.status === "joined" ? readiness.handoffId ? { handoffId: readiness.handoffId } : {} : params.handoffId ? { handoffId: params.handoffId } : {}
	};
}
async function startManagedServiceUpdateHandoff(params) {
	const root = resolveUpdateInstallRoot(params.root);
	const handoffId = params.handoffId ?? randomUUID();
	return await spawnManagedServiceUpdateHandoff({
		...params,
		handoffId,
		meta: {
			...params.meta,
			handoffId: params.meta.handoffId ?? handoffId
		}
	}, root);
}
function buildManagedServiceHandoffUnavailableMessage(command) {
	return ["OpenClaw updates cannot safely run inside the live gateway process without a managed-service handoff.", `Run \`${command}\` from a shell outside the gateway service, or restart/update from the host UI.`].join("\n");
}
//#endregion
//#region src/infra/update-startup.ts
let updateAvailableCache = null;
let updateScheduleCache = null;
function getUpdateAvailable() {
	return updateAvailableCache;
}
function getUpdateSchedule() {
	return updateScheduleCache;
}
const UPDATE_CHECK_STATE_KEY = "default";
const UPDATE_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const ONE_HOUR_MS = 3600 * 1e3;
const AUTO_UPDATE_COMMAND_TIMEOUT_MS = 2700 * 1e3;
const AUTO_STABLE_DELAY_HOURS_DEFAULT = 6;
const AUTO_STABLE_JITTER_HOURS_DEFAULT = 12;
const AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT = 1;
const MANAGED_AUTO_UPDATE_SYSTEMD_RESTART_GRACE_MS = 2e3;
const DEV_COMMIT_LIMIT = 5;
const DEV_COMMIT_SUBJECT_MAX_LENGTH = 120;
const DEV_COMMIT_LOG_MAX_OUTPUT_BYTES = 8 * 1024;
function shouldSkipCheck(allowInTests) {
	if (allowInTests) return false;
	if (process.env.VITEST || false) return true;
	return false;
}
function resolveAutoUpdatePolicy(cfg) {
	const auto = cfg.update?.auto;
	return {
		enabled: Boolean(auto?.enabled),
		stableDelayHours: AUTO_STABLE_DELAY_HOURS_DEFAULT,
		stableJitterHours: AUTO_STABLE_JITTER_HOURS_DEFAULT,
		betaCheckIntervalHours: AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT
	};
}
function resolveCheckIntervalMs(cfg, installKind) {
	const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
	const auto = resolveAutoUpdatePolicy(cfg);
	if (!auto.enabled) return UPDATE_CHECK_INTERVAL_MS;
	if (channel === "beta") return Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS));
	if (channel === "stable") return ONE_HOUR_MS;
	if (channel === "dev" && installKind === "git") return ONE_HOUR_MS;
	return UPDATE_CHECK_INTERVAL_MS;
}
function presentString(value) {
	return value ?? void 0;
}
async function readState() {
	const database = openOpenClawStateDatabase();
	const stateDb = getNodeSqliteKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("update_check_state").selectAll().where("state_key", "=", UPDATE_CHECK_STATE_KEY));
	if (!row) return {};
	return {
		lastCheckedAt: presentString(row.last_checked_at),
		lastNotifiedVersion: presentString(row.last_notified_version),
		lastNotifiedTag: presentString(row.last_notified_tag),
		lastAvailableVersion: presentString(row.last_available_version),
		lastAvailableTag: presentString(row.last_available_tag),
		autoInstallId: presentString(row.auto_install_id),
		autoFirstSeenVersion: presentString(row.auto_first_seen_version),
		autoFirstSeenTag: presentString(row.auto_first_seen_tag),
		autoFirstSeenAt: presentString(row.auto_first_seen_at),
		autoLastAttemptVersion: presentString(row.auto_last_attempt_version),
		autoLastAttemptAt: presentString(row.auto_last_attempt_at),
		autoLastSuccessVersion: presentString(row.auto_last_success_version),
		autoLastSuccessAt: presentString(row.auto_last_success_at)
	};
}
async function writeState(state) {
	const updatedAtMs = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, stateDb.deleteFrom("update_check_state").where("state_key", "=", UPDATE_CHECK_STATE_KEY));
		executeSqliteQuerySync(db, stateDb.insertInto("update_check_state").values({
			state_key: UPDATE_CHECK_STATE_KEY,
			last_checked_at: state.lastCheckedAt ?? null,
			last_notified_version: state.lastNotifiedVersion ?? null,
			last_notified_tag: state.lastNotifiedTag ?? null,
			last_available_version: state.lastAvailableVersion ?? null,
			last_available_tag: state.lastAvailableTag ?? null,
			auto_install_id: state.autoInstallId ?? null,
			auto_first_seen_version: state.autoFirstSeenVersion ?? null,
			auto_first_seen_tag: state.autoFirstSeenTag ?? null,
			auto_first_seen_at: state.autoFirstSeenAt ?? null,
			auto_last_attempt_version: state.autoLastAttemptVersion ?? null,
			auto_last_attempt_at: state.autoLastAttemptAt ?? null,
			auto_last_success_version: state.autoLastSuccessVersion ?? null,
			auto_last_success_at: state.autoLastSuccessAt ?? null,
			updated_at_ms: updatedAtMs
		}));
	});
}
function sameUpdateAvailable(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.currentVersion === b.currentVersion && a.latestVersion === b.latestVersion && a.channel === b.channel && a.currentSha === b.currentSha && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.commitsBehind === b.commitsBehind && JSON.stringify(a.commits) === JSON.stringify(b.commits);
}
function sameUpdateSchedule(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function setUpdateScheduleCache(params) {
	if (sameUpdateSchedule(updateScheduleCache, params.next)) return;
	updateScheduleCache = params.next;
	params.onUpdateScheduleChange?.(params.next);
}
function withoutCampaign(schedule) {
	const { campaign: _campaign, ...rest } = schedule;
	return rest;
}
function withoutTarget(schedule) {
	const { target: _target, campaign: _campaign, ...rest } = schedule;
	return rest;
}
function setUpdateAvailableCache(params) {
	if (sameUpdateAvailable(updateAvailableCache, params.next)) return;
	updateAvailableCache = params.next;
	params.onUpdateAvailableChange?.(params.next);
}
function isPersistedAvailabilityForChannel(params) {
	const tag = params.state.lastAvailableTag?.trim();
	if (params.channel === "stable") return !tag || tag === "latest";
	if (params.channel === "beta") return tag === "beta" || tag === "latest";
	return tag === params.channel;
}
function resolvePersistedUpdateAvailable(state, channel) {
	const latestVersion = state.lastAvailableVersion?.trim();
	if (!latestVersion || !isPersistedAvailabilityForChannel({
		state,
		channel
	})) return null;
	const cmp = compareSemverStrings(VERSION, latestVersion);
	if (cmp == null || cmp >= 0) return null;
	return {
		currentVersion: VERSION,
		latestVersion,
		channel: state.lastAvailableTag?.trim() || channelToNpmTag(channel)
	};
}
function clearPersistedAvailabilityForChannel(nextState, channel) {
	if (!isPersistedAvailabilityForChannel({
		state: nextState,
		channel
	})) return;
	delete nextState.lastAvailableVersion;
	delete nextState.lastAvailableTag;
}
function resolveStableJitterMs(params) {
	if (params.jitterWindowMs <= 0) return 0;
	return createHash("sha256").update(`${params.installId}:${params.version}:${params.tag}`).digest().readUInt32BE(0) % (Math.floor(params.jitterWindowMs) + 1);
}
function resolveUpdateCheckNowMs(valueMs) {
	return asDateTimestampMs(valueMs) ?? asDateTimestampMs(Date.now()) ?? 0;
}
function resolveUpdateCheckTimestamp(valueMs) {
	return timestampMsToIsoString(valueMs) ?? timestampMsToIsoString(resolveUpdateCheckNowMs(Date.now())) ?? (/* @__PURE__ */ new Date()).toISOString();
}
function resolveStableAutoApplyAtMs(params) {
	if (!params.nextState.autoInstallId) params.nextState.autoInstallId = params.state.autoInstallId?.trim() || randomUUID();
	const installId = params.nextState.autoInstallId;
	if (!(params.state.autoFirstSeenVersion === params.version && params.state.autoFirstSeenTag === params.tag)) {
		params.nextState.autoFirstSeenVersion = params.version;
		params.nextState.autoFirstSeenTag = params.tag;
		params.nextState.autoFirstSeenAt = resolveUpdateCheckTimestamp(params.nowMs);
	} else {
		params.nextState.autoFirstSeenVersion = params.state.autoFirstSeenVersion;
		params.nextState.autoFirstSeenTag = params.state.autoFirstSeenTag;
		params.nextState.autoFirstSeenAt = params.state.autoFirstSeenAt;
	}
	const parsedFirstSeenMs = params.nextState.autoFirstSeenAt ? Date.parse(params.nextState.autoFirstSeenAt) : params.nowMs;
	const firstSeenMs = Number.isFinite(parsedFirstSeenMs) ? parsedFirstSeenMs : params.nowMs;
	const baseDelayMs = Math.max(0, params.stableDelayHours) * ONE_HOUR_MS;
	const jitterWindowMs = Math.max(0, params.stableJitterHours) * ONE_HOUR_MS;
	const jitterMs = resolveStableJitterMs({
		installId,
		version: params.version,
		tag: params.tag,
		jitterWindowMs
	});
	return firstSeenMs + baseDelayMs + jitterMs;
}
function resolveManagedAutoUpdateRestartDelayMs(supervisor) {
	return supervisor === "systemd" ? MANAGED_AUTO_UPDATE_SYSTEMD_RESTART_GRACE_MS : 0;
}
async function startManagedServiceAutoUpdateHandoff(params) {
	const restartDelayMs = resolveManagedAutoUpdateRestartDelayMs(params.supervisor);
	const handoffId = randomUUID();
	try {
		if (!params.root?.trim()) throw new Error("managed auto-update install root is unavailable");
		const started = await startManagedServiceUpdateHandoff({
			root: params.root,
			timeoutMs: params.timeoutMs,
			restartDrainTimeoutMs: params.restartDrainTimeoutMs,
			channel: params.channel,
			...params.packageTargetVersion ? { tag: params.packageTargetVersion } : {},
			restartDelayMs,
			supervisor: params.supervisor,
			handoffId,
			...params.devTarget ? { devTarget: params.devTarget } : {},
			meta: {
				handoffId,
				note: "background auto-update"
			}
		});
		if (started.status === "started") scheduleGatewaySigusr1Restart({
			delayMs: restartDelayMs,
			reason: "update.auto",
			skipCooldown: true,
			skipDeferral: true
		});
		return {
			ok: true,
			code: 0,
			reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
			command: started.command,
			logPath: started.logPath
		};
	} catch (err) {
		return {
			ok: false,
			code: null,
			reason: String(err)
		};
	}
}
async function runAutoUpdateCommand(params) {
	if (isGatewayExternallySupervised()) return {
		ok: false,
		code: null,
		reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
	};
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (supervisor) return await startManagedServiceAutoUpdateHandoff({
		channel: params.channel,
		timeoutMs: params.timeoutMs,
		restartDrainTimeoutMs: params.restartDrainTimeoutMs,
		root: params.root,
		...params.packageTargetVersion ? { packageTargetVersion: params.packageTargetVersion } : {},
		...params.devTarget ? { devTarget: params.devTarget } : {},
		supervisor
	});
	const baseArgs = [
		"update",
		"--yes",
		...[
			"--channel",
			params.channel,
			...params.packageTargetVersion ? ["--tag", params.packageTargetVersion] : []
		],
		"--json"
	];
	const execPath = process.execPath?.trim();
	const argv1 = process.argv[1]?.trim();
	const lowerExecBase = execPath ? normalizeLowercaseStringOrEmpty(path.basename(execPath)) : "";
	const runtimeIsNodeOrBun = lowerExecBase === "node" || lowerExecBase === "node.exe" || lowerExecBase === "bun" || lowerExecBase === "bun.exe";
	const argv = [];
	if (execPath && argv1) argv.push(execPath, argv1, ...baseArgs);
	else if (execPath && !runtimeIsNodeOrBun) argv.push(execPath, ...baseArgs);
	else if (execPath && params.root) {
		const candidates = [
			path.join(params.root, "dist", "entry.js"),
			path.join(params.root, "dist", "entry.mjs"),
			path.join(params.root, "dist", "index.js"),
			path.join(params.root, "dist", "index.mjs")
		];
		for (const candidate of candidates) try {
			await fs.access(candidate);
			argv.push(execPath, candidate, ...baseArgs);
			break;
		} catch {}
	}
	if (argv.length === 0) argv.push("openclaw", ...baseArgs);
	try {
		const res = await runCommandWithTimeout(argv, {
			timeoutMs: params.timeoutMs,
			...params.devTarget ? { env: applyDevUpdateTargetEnv({}, params.devTarget) } : {}
		});
		return {
			ok: res.code === 0,
			code: res.code,
			stdout: res.stdout,
			stderr: res.stderr,
			reason: res.code === 0 ? void 0 : "non-zero-exit"
		};
	} catch (err) {
		return {
			ok: false,
			code: null,
			reason: String(err)
		};
	}
}
function clearAutoState(nextState) {
	delete nextState.autoFirstSeenVersion;
	delete nextState.autoFirstSeenTag;
	delete nextState.autoFirstSeenAt;
}
async function resolveStartupInstallStatus(checkDevGit) {
	const [root, installReceipt] = await Promise.all([resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	}), readVerifiedGitUpdateReceipt()]);
	const gitUpstreamFallback = installReceipt?.upstreamRef && root && updateInstallRootsMatch(root, installReceipt.root) ? {
		currentSha: installReceipt.sha,
		upstreamRef: installReceipt.upstreamRef
	} : void 0;
	return {
		root,
		status: await checkUpdateStatus({
			root,
			timeoutMs: 2500,
			fetchGit: checkDevGit,
			includeRegistry: false,
			...checkDevGit ? { useDetachedDevUpstream: true } : {},
			...gitUpstreamFallback ? { gitUpstreamFallback } : {}
		}),
		installReceipt
	};
}
function gitCommitsMatch(left, right) {
	const normalizedLeft = left.trim().toLowerCase();
	const normalizedRight = right.trim().toLowerCase();
	return normalizedLeft.length >= 7 && normalizedRight.length >= 7 && (normalizedLeft.startsWith(normalizedRight) || normalizedRight.startsWith(normalizedLeft));
}
function resolveGitInstalledAtMs(git, installReceipt, root) {
	return installReceipt && root !== null && updateInstallRootsMatch(root, installReceipt.root) && git.sha && gitCommitsMatch(installReceipt.sha, git.sha) ? installReceipt.installedAtMs : void 0;
}
function resolveGitScheduleStatus(update, installReceipt, root) {
	if (update.installKind !== "git") return;
	const git = update.git;
	const installedAtMs = git ? resolveGitInstalledAtMs(git, installReceipt, root) : void 0;
	const metadata = git ? {
		...git.sha ? { currentSha: git.sha } : {},
		...typeof git.commitAtMs === "number" ? { commitAtMs: git.commitAtMs } : {},
		...installedAtMs === void 0 ? {} : { installedAtMs }
	} : {};
	if (!git || git.error || !git.sha) return {
		...metadata,
		status: "unavailable",
		reason: "git-unavailable"
	};
	if (git.fetchOk !== true) return {
		...metadata,
		status: "unavailable",
		reason: "fetch-failed"
	};
	if (!git.upstream) return {
		...metadata,
		status: "unavailable",
		reason: "no-upstream"
	};
	if (!git.upstreamSha) return {
		...metadata,
		status: "unavailable",
		reason: "no-upstream-sha"
	};
	if (git.ahead === null || git.behind === null) return {
		...metadata,
		status: "unavailable",
		reason: "comparison-failed"
	};
	if (git.ahead > 0 && git.behind > 0) return {
		...metadata,
		status: "diverged",
		commitsAhead: git.ahead,
		commitsBehind: git.behind
	};
	if (git.behind > 0) return {
		...metadata,
		status: "behind",
		commitsBehind: git.behind
	};
	if (git.ahead > 0) return {
		...metadata,
		status: "ahead",
		commitsAhead: git.ahead
	};
	return {
		...metadata,
		status: "current"
	};
}
function withInstallStatus(schedule, update, includeGitStatus, installReceipt, root) {
	const git = includeGitStatus ? resolveGitScheduleStatus(update, installReceipt, root) : void 0;
	return {
		...schedule,
		install: {
			kind: update.installKind,
			...git ? { git } : {}
		}
	};
}
/** Refreshes the read-only Dev checkout comparison used by update.status. */
async function refreshGatewayUpdateStatus(cfg) {
	const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
	if (channel !== "dev") return;
	const { root, status, installReceipt } = await resolveStartupInstallStatus(true);
	setUpdateScheduleCache({ next: withInstallStatus(updateScheduleCache?.channel === channel ? updateScheduleCache : {
		channel,
		autoEnabled: Boolean(cfg.update?.auto?.enabled)
	}, status, true, installReceipt, root) });
}
async function resolveDevGitCommits(params) {
	const result = await runCommandWithTimeout([
		"git",
		"-C",
		params.root,
		"log",
		"--format=%h%x09%s",
		`--max-count=${DEV_COMMIT_LIMIT}`,
		`${params.currentSha}..${params.upstreamSha}`
	], {
		timeoutMs: 2500,
		maxOutputBytes: {
			stdout: DEV_COMMIT_LOG_MAX_OUTPUT_BYTES,
			stderr: 1024
		}
	}).catch(() => null);
	if (!result || result.code !== 0 || result.termination !== "exit") return [];
	return result.stdout.split("\n").flatMap((line) => {
		const separator = line.indexOf("	");
		const sha = separator < 0 ? "" : line.slice(0, separator).trim();
		if (!sha) return [];
		return [{
			sha,
			subject: line.slice(separator + 1).trim().slice(0, DEV_COMMIT_SUBJECT_MAX_LENGTH)
		}];
	}).slice(0, DEV_COMMIT_LIMIT);
}
async function runCampaignUpdate(params) {
	const attemptAt = resolveUpdateCheckNowMs(Date.now());
	const attemptState = await readState();
	attemptState.autoLastAttemptVersion = params.version;
	attemptState.autoLastAttemptAt = resolveUpdateCheckTimestamp(attemptAt);
	await writeState(attemptState);
	const outcome = await params.runAuto({
		channel: params.channel,
		timeoutMs: AUTO_UPDATE_COMMAND_TIMEOUT_MS,
		restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
		...params.root ? { root: params.root } : {},
		...params.channel === "dev" ? {} : { packageTargetVersion: params.version },
		...params.devTarget ? { devTarget: params.devTarget } : {}
	});
	if (outcome.ok && outcome.reason === "managed-service-handoff-started") {
		params.log.info("auto-update handoff started", {
			channel: params.channel,
			version: params.version,
			tag: params.tag,
			forced: params.forced,
			...outcome.command ? { command: outcome.command } : {},
			...outcome.logPath ? { logPath: outcome.logPath } : {}
		});
		return "handoff";
	}
	if (outcome.ok) {
		const successState = await readState();
		successState.autoLastSuccessVersion = params.version;
		successState.autoLastSuccessAt = resolveUpdateCheckTimestamp(Date.now());
		await writeState(successState);
		params.log.info("auto-update applied", {
			channel: params.channel,
			version: params.version,
			tag: params.tag,
			forced: params.forced
		});
		return "applied";
	}
	params.log.info("auto-update attempt failed", {
		channel: params.channel,
		version: params.version,
		tag: params.tag,
		forced: params.forced,
		reason: outcome.reason ?? `exit:${outcome.code}`
	});
	return "failed";
}
async function runGatewayUpdateCheck(params) {
	if (shouldSkipCheck(Boolean(params.allowInTests))) return;
	if (params.isNixMode) return;
	const configChannel = normalizeUpdateChannel(params.cfg.update?.channel);
	const updateCampaign = params.updateCampaign ?? gatewayUpdateCampaign;
	const auto = resolveAutoUpdatePolicy(params.cfg);
	const autoDisabledByEnv = isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE);
	const autoDisabledByExternalSupervisor = isGatewayExternallySupervised();
	const shouldRunUpdateHints = params.cfg.update?.checkOnStart !== false;
	const potentialChannel = resolveEffectiveUpdateChannel({
		configChannel,
		currentVersion: VERSION,
		installKind: "package"
	}).channel;
	const potentialAutoDesired = (potentialChannel === "stable" || potentialChannel === "beta" || potentialChannel === "dev") && auto.enabled && !autoDisabledByEnv && !autoDisabledByExternalSupervisor;
	if (!shouldRunUpdateHints && !potentialAutoDesired && configChannel === "extended-stable") {
		updateCampaign.clear();
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		const priorSchedule = updateScheduleCache?.channel === potentialChannel ? updateScheduleCache : null;
		setUpdateScheduleCache({
			next: withoutTarget(priorSchedule ? {
				...priorSchedule,
				autoEnabled: auto.enabled
			} : {
				channel: potentialChannel,
				autoEnabled: auto.enabled
			}),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		return;
	}
	const mightUseInstalledExtendedStableChannel = configChannel === null && potentialChannel === "extended-stable";
	let installStatus;
	if (configChannel === "extended-stable" || configChannel === "dev" || mightUseInstalledExtendedStableChannel) installStatus = await resolveStartupInstallStatus(configChannel === "dev");
	const configuredChannel = resolveEffectiveUpdateChannel({
		configChannel,
		currentVersion: VERSION,
		installKind: installStatus?.status.installKind ?? "unknown",
		git: installStatus?.status.git
	}).channel;
	const autoDesired = (configuredChannel === "stable" || configuredChannel === "beta" || configuredChannel === "dev") && auto.enabled && !autoDisabledByEnv && !autoDisabledByExternalSupervisor;
	if (updateScheduleCache?.channel !== configuredChannel) updateCampaign.clear();
	const priorSchedule = updateScheduleCache?.channel === configuredChannel ? updateScheduleCache : null;
	const initialSchedule = priorSchedule ? {
		...priorSchedule,
		autoEnabled: auto.enabled
	} : {
		channel: configuredChannel,
		autoEnabled: auto.enabled
	};
	setUpdateScheduleCache({
		next: autoDesired ? initialSchedule : withoutCampaign(initialSchedule),
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	if (!autoDesired) updateCampaign.clear();
	const onCampaignChange = (campaign) => {
		const current = updateScheduleCache;
		if (!current || current.channel !== configuredChannel) return;
		const target = current.target?.kind === "package" ? current.target.version : current.target?.kind === "git" ? {
			upstreamSha: current.target.upstreamSha,
			commitsBehind: current.target.commitsBehind
		} : void 0;
		if (campaign) params.log.info(`update campaign ${campaign.state}`, {
			campaignId: campaign.id,
			state: campaign.state,
			channel: configuredChannel,
			...target === void 0 ? {} : { target },
			...campaign.applyAtMs === void 0 ? {} : { applyAtMs: campaign.applyAtMs },
			...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
			forceAtMs: campaign.forceAtMs
		});
		else params.log.info("update campaign ended", {
			...current.campaign?.id ? { campaignId: current.campaign.id } : {},
			channel: configuredChannel,
			...target === void 0 ? {} : { target }
		});
		setUpdateScheduleCache({
			next: campaign ? {
				...current,
				campaign
			} : withoutCampaign(current),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
	};
	if (!shouldRunUpdateHints && !autoDesired) {
		updateCampaign.clear();
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		setUpdateScheduleCache({
			next: withoutTarget(updateScheduleCache ?? initialSchedule),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		return;
	}
	if ((configuredChannel === "extended-stable" || configuredChannel === "dev") && !installStatus) installStatus = await resolveStartupInstallStatus(configuredChannel === "dev");
	if (installStatus && (configuredChannel === "extended-stable" || configuredChannel === "dev")) setUpdateScheduleCache({
		next: withInstallStatus(updateScheduleCache ?? initialSchedule, installStatus.status, configuredChannel === "dev", installStatus.installReceipt, installStatus.root),
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	if (configuredChannel === "extended-stable" && installStatus) {
		if (installStatus.status.installKind !== "package") {
			updateCampaign.clear();
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			setUpdateScheduleCache({
				next: withoutTarget(updateScheduleCache ?? initialSchedule),
				onUpdateScheduleChange: params.onUpdateScheduleChange
			});
			return;
		}
	}
	const isDevGit = configuredChannel === "dev" && installStatus?.status.installKind === "git";
	const shouldRunAutoUpdate = autoDesired && (configuredChannel === "stable" || configuredChannel === "beta" || isDevGit);
	if (!shouldRunAutoUpdate) updateCampaign.clear();
	if (!shouldRunUpdateHints && !shouldRunAutoUpdate) {
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		setUpdateScheduleCache({
			next: withoutTarget(updateScheduleCache ?? initialSchedule),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		return;
	}
	const state = await readState();
	const rawNow = Date.now();
	const now = resolveUpdateCheckNowMs(rawNow);
	const rawNowIsValid = asDateTimestampMs(rawNow) !== void 0;
	const lastCheckedAt = state.lastCheckedAt ? Date.parse(state.lastCheckedAt) : null;
	const persistedAvailable = shouldRunUpdateHints && !isDevGit ? resolvePersistedUpdateAvailable(state, configuredChannel) : null;
	const hasExtendedStableCheckMarker = state.lastAvailableTag?.trim() === "extended-stable";
	const shouldBypassSharedThrottle = isDevGit || configuredChannel === "extended-stable" && !hasExtendedStableCheckMarker;
	if (shouldRunUpdateHints) setUpdateAvailableCache({
		next: persistedAvailable,
		onUpdateAvailableChange: params.onUpdateAvailableChange
	});
	else setUpdateAvailableCache({
		next: null,
		onUpdateAvailableChange: params.onUpdateAvailableChange
	});
	if (persistedAvailable) setUpdateScheduleCache({
		next: {
			...updateScheduleCache ?? initialSchedule,
			target: {
				kind: "package",
				version: persistedAvailable.latestVersion
			}
		},
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	const checkIntervalMs = shouldRunAutoUpdate ? resolveCheckIntervalMs(params.cfg, installStatus?.status.installKind) : UPDATE_CHECK_INTERVAL_MS;
	if (!shouldBypassSharedThrottle && rawNowIsValid && lastCheckedAt && Number.isFinite(lastCheckedAt)) {
		if (now - lastCheckedAt < checkIntervalMs) return;
	}
	installStatus ??= await resolveStartupInstallStatus(false);
	const { root, status, installReceipt } = installStatus;
	setUpdateScheduleCache({
		next: withInstallStatus(updateScheduleCache ?? initialSchedule, status, isDevGit, installReceipt, root),
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	const nextState = {
		...state,
		lastCheckedAt: resolveUpdateCheckTimestamp(now)
	};
	if (isDevGit) {
		delete nextState.lastAvailableVersion;
		delete nextState.lastAvailableTag;
		clearAutoState(nextState);
		const git = status.git;
		if (typeof git?.behind !== "number" || git.behind <= 0 || !git.sha || !git.upstream || !git.upstreamSha) {
			updateCampaign.clear();
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			setUpdateScheduleCache({
				next: withoutTarget(updateScheduleCache ?? initialSchedule),
				onUpdateScheduleChange: params.onUpdateScheduleChange
			});
			await writeState(nextState);
			return;
		}
		const currentSha = git.sha;
		const upstreamRef = git.upstream;
		const upstreamSha = git.upstreamSha;
		const commitsBehind = git.behind;
		const commits = await resolveDevGitCommits({
			root: git.root,
			currentSha,
			upstreamSha
		});
		const target = {
			kind: "git",
			upstreamRef,
			upstreamSha,
			commitsBehind
		};
		setUpdateAvailableCache({
			next: shouldRunUpdateHints ? {
				currentVersion: VERSION,
				latestVersion: VERSION,
				channel: "dev",
				currentSha,
				upstreamRef,
				upstreamSha,
				commitsBehind,
				commits
			} : null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		setUpdateScheduleCache({
			next: {
				...updateScheduleCache ?? initialSchedule,
				target
			},
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		if (auto.enabled && autoDisabledByEnv) params.log.info("auto-update disabled by OPENCLAW_NO_AUTO_UPDATE", {
			version: upstreamSha,
			tag: "dev"
		});
		if (auto.enabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: upstreamSha,
			tag: "dev",
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		const hasTrackedDevUpstream = (git.branch === "main" || git.branch === "HEAD") && git.upstreamSource === "tracking";
		const hasReceiptBackedDetachedHead = git.branch === "HEAD" && git.upstreamSource === "receipt";
		const canRunTrackedDevCampaign = (hasTrackedDevUpstream || hasReceiptBackedDetachedHead) && git.ahead === 0;
		if (shouldRunAutoUpdate && canRunTrackedDevCampaign) {
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			if (!(state.autoLastAttemptVersion === upstreamSha && lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < ONE_HOUR_MS)) {
				const runAuto = params.runAutoUpdate ?? runAutoUpdateCommand;
				updateCampaign.announce({
					target,
					inspect: params.activeWorkInspectors,
					onChange: onCampaignChange,
					apply: async ({ forced }) => await runCampaignUpdate({
						channel: "dev",
						version: upstreamSha,
						tag: "dev",
						forced,
						root: root ?? status.root ?? void 0,
						devTarget: devUpdateTargetFromGitCampaign(target),
						log: params.log,
						runAuto
					})
				});
			}
		} else updateCampaign.clear();
		await writeState(nextState);
		return;
	}
	if (status.installKind !== "package") {
		delete nextState.lastAvailableVersion;
		delete nextState.lastAvailableTag;
		clearAutoState(nextState);
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		updateCampaign.clear();
		setUpdateScheduleCache({
			next: withoutTarget(updateScheduleCache ?? initialSchedule),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		await writeState(nextState);
		return;
	}
	const channel = configuredChannel;
	const resolved = await resolveNpmChannelTag({
		channel,
		timeoutMs: 2500
	});
	const tag = resolved.tag;
	if (!resolved.version) {
		if (channel === "extended-stable") {
			clearPersistedAvailabilityForChannel(nextState, channel);
			if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			updateCampaign.clear();
			setUpdateScheduleCache({
				next: withoutTarget(updateScheduleCache ?? initialSchedule),
				onUpdateScheduleChange: params.onUpdateScheduleChange
			});
		}
		await writeState(nextState);
		return;
	}
	const resolvedVersion = resolved.version;
	const cmp = compareSemverStrings(VERSION, resolvedVersion);
	if (cmp != null && cmp < 0) {
		const nextAvailable = {
			currentVersion: VERSION,
			latestVersion: resolved.version,
			channel: tag
		};
		const target = {
			kind: "package",
			version: resolved.version
		};
		setUpdateScheduleCache({
			next: {
				...updateScheduleCache ?? initialSchedule,
				target
			},
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		if (shouldRunUpdateHints) setUpdateAvailableCache({
			next: nextAvailable,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		nextState.lastAvailableVersion = resolved.version;
		nextState.lastAvailableTag = tag;
		const shouldNotify = state.lastNotifiedVersion !== resolved.version || state.lastNotifiedTag !== tag;
		if (shouldRunUpdateHints && shouldNotify) {
			params.log.info(`update available (${tag}): v${resolved.version} (current v${VERSION}). Run: ${formatCliCommand("openclaw update")}`);
			nextState.lastNotifiedVersion = resolved.version;
			nextState.lastNotifiedTag = tag;
		}
		if (channel !== "extended-stable" && auto.enabled && autoDisabledByEnv) params.log.info("auto-update disabled by OPENCLAW_NO_AUTO_UPDATE", {
			version: resolved.version,
			tag
		});
		if (channel !== "extended-stable" && auto.enabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: resolved.version,
			tag,
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		if (shouldRunAutoUpdate && (channel === "stable" || channel === "beta")) {
			const runAuto = params.runAutoUpdate ?? runAutoUpdateCommand;
			const attemptIntervalMs = channel === "beta" ? Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS)) : ONE_HOUR_MS;
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			const recentAttemptForSameVersion = state.autoLastAttemptVersion === resolved.version && lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < attemptIntervalMs;
			let dueNow = channel === "beta";
			let applyAfterMs = null;
			if (channel === "stable") {
				applyAfterMs = resolveStableAutoApplyAtMs({
					state,
					nextState,
					nowMs: now,
					version: resolved.version,
					tag,
					stableDelayHours: auto.stableDelayHours,
					stableJitterHours: auto.stableJitterHours
				});
				dueNow = now >= applyAfterMs;
			}
			if (!dueNow) params.log.info("auto-update deferred (stable rollout window active)", {
				version: resolved.version,
				tag,
				applyAfter: applyAfterMs ? resolveUpdateCheckTimestamp(applyAfterMs) : void 0
			});
			else if (recentAttemptForSameVersion) params.log.info("auto-update deferred (recent attempt exists)", {
				version: resolved.version,
				tag
			});
			else updateCampaign.announce({
				target,
				inspect: params.activeWorkInspectors,
				onChange: onCampaignChange,
				apply: async ({ forced }) => await runCampaignUpdate({
					channel,
					version: resolvedVersion,
					tag,
					forced,
					root: root ?? status.root ?? void 0,
					log: params.log,
					runAuto
				})
			});
		}
	} else {
		if (channel === "extended-stable") {
			clearPersistedAvailabilityForChannel(nextState, channel);
			if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
		} else {
			delete nextState.lastAvailableVersion;
			delete nextState.lastAvailableTag;
			clearAutoState(nextState);
		}
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		updateCampaign.clear();
		setUpdateScheduleCache({
			next: withoutTarget(updateScheduleCache ?? initialSchedule),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
	}
	await writeState(nextState);
}
function scheduleGatewayUpdateCheck(params) {
	const stopRemoteCatalogRefresh = scheduleRemoteModelCatalogRefresh(params);
	if ((normalizeUpdateChannel(params.cfg.update?.channel) ?? "stable") === "extended-stable" && params.cfg.update?.checkOnStart === false) return () => {
		stopRemoteCatalogRefresh();
		gatewayUpdateCampaign.clear();
	};
	let stopped = false;
	let timer = null;
	let running = false;
	const tick = async () => {
		if (stopped || running) return;
		running = true;
		try {
			await runGatewayUpdateCheck(params);
		} catch {} finally {
			running = false;
		}
		if (stopped) {
			gatewayUpdateCampaign.clear();
			return;
		}
		const intervalMs = resolveCheckIntervalMs(params.cfg, updateScheduleCache?.install?.kind);
		timer = setTimeout(() => {
			tick();
		}, intervalMs);
	};
	tick();
	return () => {
		stopRemoteCatalogRefresh();
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		gatewayUpdateCampaign.clear();
	};
}
function scheduleRemoteModelCatalogRefresh(params) {
	let stopped = false;
	let timer = null;
	let running = false;
	let activeAbortController = null;
	const tick = async () => {
		if (stopped || running) return;
		running = true;
		const abortController = new AbortController();
		activeAbortController = abortController;
		const result = await refreshRemoteModelCatalog({
			config: params.cfg,
			signal: abortController.signal
		});
		if (activeAbortController === abortController) activeAbortController = null;
		running = false;
		if (stopped) return;
		if (result.status === "error") params.log.info("remote model catalog refresh failed", { error: result.error });
		else if (result.status === "updated") params.log.info("remote model catalog updated; restart the Gateway to apply it", {
			providers: result.providers,
			models: result.models,
			generatedAt: result.generatedAt
		});
		const nextCheckInMs = result.status === "fresh" ? result.nextCheckInMs : REMOTE_MODEL_CATALOG_TTL_MS;
		timer = setTimeout(() => void tick(), nextCheckInMs);
		timer.unref?.();
	};
	tick();
	return () => {
		stopped = true;
		activeAbortController?.abort();
		activeAbortController = null;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};
}
//#endregion
export { scheduleGatewayUpdateCheck as a, startManagedServiceUpdateHandoff as c, runGatewayUpdateCheck as i, gatewayUpdateCampaign as l, getUpdateSchedule as n, buildManagedServiceHandoffUnavailableMessage as o, refreshGatewayUpdateStatus as r, formatManagedServiceUpdateCommand as s, getUpdateAvailable as t };
