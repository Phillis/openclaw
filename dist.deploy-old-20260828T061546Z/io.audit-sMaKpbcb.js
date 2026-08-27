import { c as redactSecrets } from "./redact-CWP17HFN.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-DApEwR_Y.js";
import { t as redactSensitiveArgv } from "./redact-argv-lKJcCyS6.js";
import { t as isSensitiveConfigPath } from "./sensitive-paths-uMRji-4g.js";
import fs from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
//#region src/config/config-journal-snapshot.ts
const CONFIG_SNAPSHOT_SCOPE = "config-snapshot";
const CONFIG_SNAPSHOT_KEY = "latest";
const CONFIG_JOURNAL_FINGERPRINT_KEY_FILENAME = "config-journal-fingerprint.key";
const CONFIG_JOURNAL_FINGERPRINT_KEY_BYTES = 32;
const CONFIG_JOURNAL_REDACTION_MARKER = "***";
const configJournalFingerprintKeys = /* @__PURE__ */ new Map();
function loadConfigJournalFingerprintKey(params) {
	const context = resolveConfigAuditStoreContext(params);
	const stateDir = resolveStateDir(context.env, context.homedir);
	const keyPath = path.join(stateDir, CONFIG_JOURNAL_FINGERPRINT_KEY_FILENAME);
	const cached = configJournalFingerprintKeys.get(keyPath);
	if (cached) return cached;
	try {
		let key;
		try {
			key = fs.readFileSync(keyPath);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			fs.mkdirSync(stateDir, {
				recursive: true,
				mode: 448
			});
			const created = randomBytes(CONFIG_JOURNAL_FINGERPRINT_KEY_BYTES);
			try {
				const descriptor = fs.openSync(keyPath, "wx", 384);
				try {
					fs.writeFileSync(descriptor, created);
				} finally {
					fs.closeSync(descriptor);
				}
				key = created;
			} catch (createError) {
				if (createError.code !== "EEXIST") throw createError;
				key = fs.readFileSync(keyPath);
			}
		}
		if (key.length !== CONFIG_JOURNAL_FINGERPRINT_KEY_BYTES) return null;
		fs.chmodSync(keyPath, 384);
		configJournalFingerprintKeys.set(keyPath, key);
		return key;
	} catch {
		return null;
	}
}
function fingerprintConfigSnapshotValue(value, key) {
	if (!key) return CONFIG_JOURNAL_REDACTION_MARKER;
	const serialized = JSON.stringify(value);
	return `fp:${createHmac("sha256", key).update(serialized ?? String(value)).digest("hex").slice(0, 12)}`;
}
function fingerprintConfigSnapshotLeaves(value, key) {
	if (Array.isArray(value)) return value.map((entry) => fingerprintConfigSnapshotLeaves(entry, key));
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([fieldKey, entry]) => [fieldKey, fingerprintConfigSnapshotLeaves(entry, key)]));
	return fingerprintConfigSnapshotValue(value, key);
}
function fingerprintConfigSnapshotAuthoredConfig(value, params) {
	const key = loadConfigJournalFingerprintKey(params);
	return fingerprintConfigSnapshotLeaves(structuredClone(value), key);
}
function openConfigSnapshotStore(env) {
	return createSqliteAuditRecordStore({
		scope: CONFIG_SNAPSHOT_SCOPE,
		maxEntries: 1,
		env
	});
}
function resolveConfigAuditStoreContext(params) {
	return {
		env: params?.env ?? process.env,
		homedir: params?.homedir ?? homedir
	};
}
function resolveConfigAuditStoreEnv(params) {
	return {
		...params.env,
		OPENCLAW_STATE_DIR: resolveStateDir(params.env, params.homedir)
	};
}
function readConfigSnapshotAuditRecord(params) {
	try {
		const snapshot = openConfigSnapshotStore(resolveConfigAuditStoreEnv(resolveConfigAuditStoreContext(params))).entries().find((candidate) => candidate.key === CONFIG_SNAPSHOT_KEY)?.value;
		return snapshot?.configPath === path.resolve(params.configPath) ? snapshot : null;
	} catch {
		return null;
	}
}
/** Single owner of the slot's path-identity convention (resolve-normalized). */
function configSnapshotAuditRecordMatchesPath(snapshot, configPath) {
	return snapshot?.configPath === path.resolve(configPath);
}
function readLatestConfigSnapshotAuditRecord(params) {
	try {
		return openConfigSnapshotStore(resolveConfigAuditStoreEnv(resolveConfigAuditStoreContext(params))).entries().find((candidate) => candidate.key === CONFIG_SNAPSHOT_KEY)?.value ?? null;
	} catch {
		return null;
	}
}
function upsertConfigSnapshotAuditRecord(params) {
	try {
		const context = resolveConfigAuditStoreContext(params);
		const snapshot = {
			configPath: path.resolve(params.configPath),
			rawHash: params.rawHash,
			fingerprintedAuthoredConfig: fingerprintConfigSnapshotAuthoredConfig(params.authoredConfig, context)
		};
		const store = openConfigSnapshotStore(resolveConfigAuditStoreEnv(context));
		if (params.expectedSnapshot !== void 0) return store.compareAndSet(CONFIG_SNAPSHOT_KEY, params.expectedSnapshot, snapshot) ? snapshot : null;
		store.upsert(CONFIG_SNAPSHOT_KEY, snapshot);
		return snapshot;
	} catch {
		return null;
	}
}
function restoreConfigSnapshotAuditRecord(params) {
	try {
		const store = openConfigSnapshotStore(resolveConfigAuditStoreEnv(resolveConfigAuditStoreContext(params)));
		if (params.expectedSnapshot !== void 0) {
			store.compareAndSet(CONFIG_SNAPSHOT_KEY, params.expectedSnapshot, params.snapshot);
			return;
		}
		if (params.snapshot) store.upsert(CONFIG_SNAPSHOT_KEY, params.snapshot);
		else store.delete(CONFIG_SNAPSHOT_KEY);
	} catch {}
}
//#endregion
//#region src/config/io.audit.ts
const CONFIG_AUDIT_ARGV_CAP = 8;
const CONFIG_AUDIT_PATH_CAP = 64;
const CONFIG_AUDIT_ISSUE_CAP = 64;
const CONFIG_SET_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	"--batch-file",
	"--batch-json",
	"--container",
	"--log-level",
	"--profile",
	"--provider-allowlist",
	"--provider-arg",
	"--provider-command",
	"--provider-env",
	"--provider-max-bytes",
	"--provider-max-output-bytes",
	"--provider-mode",
	"--provider-no-output-timeout-ms",
	"--provider-pass-env",
	"--provider-path",
	"--provider-source",
	"--provider-timeout-ms",
	"--provider-trusted-dir",
	"--ref-id",
	"--ref-provider",
	"--ref-source",
	"--section"
]);
function findConfigSetPositionals(argv, setIndex) {
	const positionals = [];
	let optionsEnded = false;
	for (let index = setIndex + 1; index < argv.length && positionals.length < 2; index += 1) {
		const arg = argv[index];
		if (arg === void 0) break;
		if (!optionsEnded && arg === "--") {
			optionsEnded = true;
			continue;
		}
		if (!optionsEnded && arg.startsWith("-")) {
			const equalsIndex = arg.indexOf("=");
			const optionName = equalsIndex < 0 ? arg : arg.slice(0, equalsIndex);
			if (equalsIndex < 0 && CONFIG_SET_VALUE_OPTIONS.has(optionName)) index += 1;
			continue;
		}
		positionals.push(index);
	}
	return positionals;
}
function findConfigSetCommandIndex(argv, configIndex) {
	let optionsEnded = false;
	for (let index = configIndex + 1; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === void 0) return -1;
		if (!optionsEnded && arg === "--") {
			optionsEnded = true;
			continue;
		}
		if (!optionsEnded && arg.startsWith("-")) {
			const equalsIndex = arg.indexOf("=");
			const optionName = equalsIndex < 0 ? arg : arg.slice(0, equalsIndex);
			if (equalsIndex < 0 && CONFIG_SET_VALUE_OPTIONS.has(optionName)) index += 1;
			continue;
		}
		return arg === "set" ? index : -1;
	}
	return -1;
}
function redactConfigAuditArgv(argv) {
	const redacted = redactSensitiveArgv(argv);
	let setIndex = -1;
	for (let index = 0; index < redacted.length; index += 1) {
		if (redacted[index] !== "config") continue;
		setIndex = findConfigSetCommandIndex(redacted, index);
		if (setIndex >= 0) break;
	}
	if (setIndex < 0) return redacted;
	for (let index = setIndex + 1; index < redacted.length; index += 1) {
		const arg = redacted[index];
		if (arg === void 0) break;
		if (arg === "--batch-json" && index + 1 < redacted.length) {
			redacted[index + 1] = "***";
			index += 1;
			continue;
		}
		if (arg.startsWith("--batch-json=")) redacted[index] = "--batch-json=***";
	}
	const positionals = findConfigSetPositionals(redacted, setIndex);
	if (positionals.length < 2) return redacted;
	const pathIndex = positionals[0];
	const valueIndex = positionals[1];
	const configPath = redacted[pathIndex];
	if (typeof configPath === "string" && isSensitiveConfigPath(configPath)) redacted[valueIndex] = "***";
	return redacted;
}
function capArgv(argv) {
	if (!Array.isArray(argv)) return [];
	return argv.slice(0, CONFIG_AUDIT_ARGV_CAP);
}
function snapshotConfigAuditProcessInfo() {
	return {
		pid: process.pid,
		ppid: process.ppid,
		cwd: process.cwd(),
		argv: redactConfigAuditArgv(capArgv(process.argv)),
		execArgv: redactConfigAuditArgv(capArgv(process.execArgv))
	};
}
const CONFIG_AUDIT_SCOPE = "config-audit";
const CONFIG_AUDIT_MAX_ENTRIES = 5e4;
const CONFIG_AUDIT_STORE_LABEL = "SQLite diagnostic_events/config-audit state (latest 50000 rows)";
const LEGACY_CONFIG_AUDIT_LOG_FILENAME = ["config-audit", "jsonl"].join(".");
function normalizeAuditLabel(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function resolveConfigAuditProcessInfo(processInfo) {
	if (processInfo) return {
		...processInfo,
		argv: redactConfigAuditArgv(capArgv(processInfo.argv)),
		execArgv: redactConfigAuditArgv(capArgv(processInfo.execArgv))
	};
	return snapshotConfigAuditProcessInfo();
}
function resolveLegacyConfigAuditLogPath(env, homedir) {
	return path.join(resolveStateDir(env, homedir), "logs", LEGACY_CONFIG_AUDIT_LOG_FILENAME);
}
function formatConfigOverwriteLogMessage(params) {
	const changeSummary = typeof params.changedPathCount === "number" ? `, changedPaths=${params.changedPathCount}` : "";
	return `Config overwrite: ${params.configPath} (sha256 ${params.previousHash ?? "unknown"} -> ${params.nextHash}, backup=${params.configPath}.bak${changeSummary})`;
}
function createConfigWriteAuditRecordBase(params) {
	const processSnapshot = resolveConfigAuditProcessInfo(params.processInfo);
	return {
		ts: params.now ?? (/* @__PURE__ */ new Date()).toISOString(),
		source: "config-io",
		event: "config.write",
		configPath: params.configPath,
		pid: processSnapshot.pid,
		ppid: processSnapshot.ppid,
		cwd: processSnapshot.cwd,
		argv: processSnapshot.argv,
		execArgv: processSnapshot.execArgv,
		watchMode: params.env.OPENCLAW_WATCH_MODE === "1",
		watchSession: normalizeAuditLabel(params.env.OPENCLAW_WATCH_SESSION),
		watchCommand: normalizeAuditLabel(params.env.OPENCLAW_WATCH_COMMAND),
		existsBefore: params.existsBefore,
		previousHash: params.previousHash,
		nextHash: params.nextHash,
		previousBytes: params.previousBytes,
		nextBytes: params.nextBytes,
		previousDev: params.previousMetadata.dev,
		previousIno: params.previousMetadata.ino,
		previousMode: params.previousMetadata.mode,
		previousNlink: params.previousMetadata.nlink,
		previousUid: params.previousMetadata.uid,
		previousGid: params.previousMetadata.gid,
		changedPathCount: typeof params.changedPathCount === "number" ? params.changedPathCount : null,
		...params.changedPaths ? { changedPaths: capConfigAuditPaths(params.changedPaths) } : {},
		...params.origin ? { origin: params.origin } : {},
		hasMetaBefore: params.hasMetaBefore,
		hasMetaAfter: params.hasMetaAfter,
		gatewayModeBefore: params.gatewayModeBefore,
		gatewayModeAfter: params.gatewayModeAfter,
		suspicious: params.suspicious
	};
}
function capConfigAuditEntries(values, cap) {
	if (values.length <= cap) return [...values];
	const visibleCount = Math.max(0, cap - 1);
	return [...values.slice(0, visibleCount), `…+${values.length - visibleCount} more`];
}
function capConfigAuditPaths(paths) {
	return capConfigAuditEntries([...new Set(paths)].toSorted(), CONFIG_AUDIT_PATH_CAP);
}
function capConfigAuditIssues(issues) {
	return capConfigAuditEntries(issues, CONFIG_AUDIT_ISSUE_CAP);
}
function finalizeConfigWriteAuditRecord(params) {
	const errorCode = params.err && typeof params.err === "object" && "code" in params.err && typeof params.err.code === "string" ? params.err.code : void 0;
	const errorMessage = params.err && typeof params.err === "object" && "message" in params.err && typeof params.err.message === "string" ? params.err.message : void 0;
	const nextMetadata = params.nextMetadata ?? {
		dev: null,
		ino: null,
		mode: null,
		nlink: null,
		uid: null,
		gid: null
	};
	const success = params.result !== "failed" && params.result !== "rejected";
	return {
		...params.base,
		result: params.result,
		nextHash: success ? params.base.nextHash : null,
		nextBytes: success ? params.base.nextBytes : null,
		nextDev: success ? nextMetadata.dev : null,
		nextIno: success ? nextMetadata.ino : null,
		nextMode: success ? nextMetadata.mode : null,
		nextNlink: success ? nextMetadata.nlink : null,
		nextUid: success ? nextMetadata.uid : null,
		nextGid: success ? nextMetadata.gid : null,
		...errorCode !== void 0 ? { errorCode } : {},
		...errorMessage !== void 0 ? { errorMessage } : {}
	};
}
function resolveConfigAuditAppendRecord(params) {
	if ("record" in params) return params.record;
	const { env: _env, homedir: _homedir, ...record } = params;
	return record;
}
async function scrubConfigAuditLog(params) {
	const auditPath = resolveLegacyConfigAuditLogPath(params.env, params.homedir);
	let raw;
	try {
		raw = await params.fs.promises.readFile(auditPath, "utf-8");
	} catch (err) {
		if (err?.code === "ENOENT") return {
			scanned: 0,
			rewritten: 0,
			skipped: 0,
			aborted: false
		};
		throw err;
	}
	const originalByteLength = Buffer.byteLength(raw, "utf-8");
	let scanned = 0;
	let rewritten = 0;
	let skipped = 0;
	let changed = false;
	const outLines = [];
	const lines = raw.split("\n");
	for (const line of lines) {
		if (line.length === 0) {
			outLines.push(line);
			continue;
		}
		scanned += 1;
		let record;
		try {
			record = JSON.parse(line);
		} catch {
			outLines.push(line);
			skipped += 1;
			continue;
		}
		if (!record || typeof record !== "object" || Array.isArray(record)) {
			outLines.push(line);
			skipped += 1;
			continue;
		}
		const obj = record;
		let mutated = false;
		for (const key of ["argv", "execArgv"]) {
			const value = obj[key];
			if (!Array.isArray(value)) continue;
			if (!value.every((entry) => typeof entry === "string")) continue;
			const redacted = redactConfigAuditArgv(value);
			let differs = false;
			for (let i = 0; i < redacted.length; i++) if (redacted[i] !== value[i]) {
				differs = true;
				break;
			}
			if (differs) {
				obj[key] = redacted;
				mutated = true;
			}
		}
		if (mutated) {
			rewritten += 1;
			changed = true;
			outLines.push(JSON.stringify(obj));
		} else outLines.push(line);
	}
	if (!changed || params.dryRun) return {
		scanned,
		rewritten,
		skipped,
		aborted: false
	};
	let preRenameSize;
	try {
		preRenameSize = (await params.fs.promises.stat(auditPath)).size;
	} catch {
		return {
			scanned,
			rewritten,
			skipped,
			aborted: true
		};
	}
	if (preRenameSize !== originalByteLength) return {
		scanned,
		rewritten,
		skipped,
		aborted: true
	};
	const tmpPath = `${auditPath}.scrub.tmp`;
	try {
		await params.fs.promises.writeFile(tmpPath, outLines.join("\n"), {
			encoding: "utf-8",
			mode: 384
		});
		let finalPreRenameSize;
		try {
			finalPreRenameSize = (await params.fs.promises.stat(auditPath)).size;
		} catch {
			try {
				await params.fs.promises.unlink(tmpPath);
			} catch {}
			return {
				scanned,
				rewritten,
				skipped,
				aborted: true
			};
		}
		if (finalPreRenameSize !== originalByteLength) {
			try {
				await params.fs.promises.unlink(tmpPath);
			} catch {}
			return {
				scanned,
				rewritten,
				skipped,
				aborted: true
			};
		}
		await params.fs.promises.rename(tmpPath, auditPath);
	} catch (err) {
		try {
			await params.fs.promises.unlink(tmpPath);
		} catch {}
		throw err;
	}
	return {
		scanned,
		rewritten,
		skipped,
		aborted: false
	};
}
function openConfigAuditStore(env) {
	return createSqliteAuditRecordStore({
		scope: CONFIG_AUDIT_SCOPE,
		maxEntries: CONFIG_AUDIT_MAX_ENTRIES,
		env
	});
}
function configAuditEntryKey(record) {
	return `${record.ts}:${record.event}:${randomUUID()}`;
}
function sanitizeConfigAuditRecord(record) {
	const sanitized = structuredClone(record);
	if (sanitized.event !== "config.external") {
		sanitized.argv = redactConfigAuditArgv(capArgv(sanitized.argv));
		sanitized.execArgv = redactConfigAuditArgv(capArgv(sanitized.execArgv));
	}
	return redactSecrets(sanitized);
}
async function appendConfigAuditRecord(params) {
	try {
		const record = sanitizeConfigAuditRecord(resolveConfigAuditAppendRecord(params));
		openConfigAuditStore(resolveConfigAuditStoreEnv(params)).register(configAuditEntryKey(record), record, Date.parse(record.ts));
	} catch {}
}
function appendConfigAuditRecordSync(params) {
	try {
		const record = sanitizeConfigAuditRecord(resolveConfigAuditAppendRecord(params));
		openConfigAuditStore(resolveConfigAuditStoreEnv(params)).register(configAuditEntryKey(record), record, Date.parse(record.ts));
	} catch {}
}
//#endregion
export { readConfigSnapshotAuditRecord as _, appendConfigAuditRecordSync as a, upsertConfigSnapshotAuditRecord as b, createConfigWriteAuditRecordBase as c, resolveLegacyConfigAuditLogPath as d, sanitizeConfigAuditRecord as f, fingerprintConfigSnapshotAuthoredConfig as g, configSnapshotAuditRecordMatchesPath as h, appendConfigAuditRecord as i, finalizeConfigWriteAuditRecord as l, snapshotConfigAuditProcessInfo as m, CONFIG_AUDIT_SCOPE as n, capConfigAuditIssues as o, scrubConfigAuditLog as p, CONFIG_AUDIT_STORE_LABEL as r, capConfigAuditPaths as s, CONFIG_AUDIT_MAX_ENTRIES as t, formatConfigOverwriteLogMessage as u, readLatestConfigSnapshotAuditRecord as v, restoreConfigSnapshotAuditRecord as y };
