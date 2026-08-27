import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as redactSensitiveText, i as redactSecrets, p as readLoggingConfig } from "./redact-Cl7lwBnl.js";
import { n as appendRegularFileSync, t as appendRegularFile } from "./regular-file-CXw3t-8J.js";
import { t as expandHomePrefix } from "./home-dir-DcrXWQPU.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { t as loggingState } from "./state-CNIDfzP9.js";
import { n as resolvePreferredOpenClawTmpDir, t as DEFAULT_POSIX_TMP_ROOT } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { i as formatTimestamp, n as formatConsoleDiagnosticLine } from "./json-console-line-DT9WEeLV.js";
import { i as tryParseLogLevel, n as levelToMinLevel, r as normalizeLogLevel, t as ALLOWED_LOG_LEVELS } from "./levels-CLdqNCQ3.js";
import { A as isValidDiagnosticTraceFlags, O as getActiveDiagnosticTraceContext, j as isValidDiagnosticTraceId, k as isValidDiagnosticSpanId, n as emitDiagnosticEvent, r as emitDiagnosticEventWithTrustedTraceContext } from "./diagnostic-events-Djn4AVRp.js";
import "./regular-file-C2hsuc07.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { Logger } from "tslog";
//#region src/logging/env-log-level.ts
/** Resolves OPENCLAW_LOG_LEVEL once per value, warning only when the invalid value changes. */
function resolveEnvLogLevelOverride() {
	const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
	if (!trimmed) {
		loggingState.invalidEnvLogLevelValue = null;
		return;
	}
	const parsed = tryParseLogLevel(trimmed);
	if (parsed) {
		loggingState.invalidEnvLogLevelValue = null;
		return parsed;
	}
	if (loggingState.invalidEnvLogLevelValue !== trimmed) {
		loggingState.invalidEnvLogLevelValue = trimmed;
		const message = `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "warn",
			message
		})}\n`);
	}
}
//#endregion
//#region src/logging/log-file-shared.ts
const LOG_PREFIX = "openclaw";
const LOG_SUFFIX = ".log";
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
function formatLocalDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region src/logging/log-file-path.ts
const ROLLING_LOG_FILE_RE = /^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u;
const MAX_LOG_PROFILE_SEGMENT_LENGTH = 220;
function encodeLogProfileSegment(profile) {
	let encoded = "";
	for (const char of profile) if (/^[a-z0-9]$/u.test(char)) encoded += char;
	else if (char === "-") encoded += "--";
	else if (char === "_") encoded += "-0";
	else if (/^[A-Z]$/u.test(char)) encoded += `-1${char.toLowerCase()}`;
	else encoded += `-2${char.codePointAt(0)?.toString(16) ?? "0"}-`;
	return encoded;
}
function resolveLogProfileSegment(env) {
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || profile.toLowerCase() === "default") return null;
	const encoded = encodeLogProfileSegment(profile);
	if (encoded.length <= MAX_LOG_PROFILE_SEGMENT_LENGTH) return encoded;
	return `-3${createHash("sha256").update(profile).digest("hex")}`;
}
/** Resolves today's default rolling log path for the active CLI profile. */
function resolveDefaultRollingLogFile(options) {
	const date = options?.date ?? /* @__PURE__ */ new Date();
	const env = options?.env ?? process.env;
	const logDir = options?.logDir ?? (canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : "/tmp/openclaw");
	const profileSegment = resolveLogProfileSegment(env);
	const profileSuffix = profileSegment ? `-${profileSegment}` : "";
	return path.join(logDir, `${LOG_PREFIX}${profileSuffix}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Resolves the configured log file or today's rolling default log path. */
function resolveConfiguredLogFilePath(config, options) {
	return config?.logging?.file ?? resolveDefaultRollingLogFile(options);
}
/** Returns whether a path is one of OpenClaw's dated rolling log files. */
function isRollingLogFilePath(file) {
	return ROLLING_LOG_FILE_RE.test(path.basename(file));
}
/** Returns whether a configured path had the legacy default rolling filename shape. */
function isLegacyRollingLogFilePath(file) {
	const base = path.basename(file);
	return base.startsWith(`openclaw-`) && base.endsWith(".log") && base.length === `openclaw-YYYY-MM-DD.log`.length;
}
/** Advances a rolling log path to the requested date while preserving its profile family. */
function resolveRollingLogFilePathForDate(file, date) {
	const match = ROLLING_LOG_FILE_RE.exec(path.basename(file));
	if (!match) return isLegacyRollingLogFilePath(file) ? path.join(path.dirname(file), `${LOG_PREFIX}-${formatLocalDate(date)}${LOG_SUFFIX}`) : file;
	return path.join(path.dirname(file), `${match[1]}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Returns whether two dated rolling paths belong to the same profile family. */
function isSameRollingLogFileFamily(left, right) {
	const leftMatch = ROLLING_LOG_FILE_RE.exec(path.basename(left));
	const rightMatch = ROLLING_LOG_FILE_RE.exec(path.basename(right));
	return Boolean(leftMatch && rightMatch && leftMatch[1] === rightMatch[1]);
}
//#endregion
//#region src/logging/logger-file-transport.ts
const DEFAULT_MAX_QUEUED_RECORDS = 4096;
const MAX_ROTATED_LOG_FILES = 5;
let queue = [];
let queueStart = 0;
let activeBatch = null;
let activeIndex = 0;
let activeAppendInFlight = false;
let droppedCount = 0;
let droppedTarget = null;
let maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
let scheduledFlush = null;
let flushPromise = null;
let drainGeneration = 0;
let processExiting = false;
let processHooksInstalled = false;
let appendFile = appendRegularFile;
const warnedRotationFiles = /* @__PURE__ */ new Map();
function rotatedLogPath(file, index) {
	const ext = path.extname(file);
	return `${file.slice(0, file.length - ext.length)}.${index}${ext}`;
}
function rotateLogFile(file) {
	try {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
		for (let index = MAX_ROTATED_LOG_FILES - 1; index >= 1; index -= 1) {
			const from = rotatedLogPath(file, index);
			if (fs.existsSync(from)) fs.renameSync(from, rotatedLogPath(file, index + 1));
		}
		if (fs.existsSync(file)) fs.renameSync(file, rotatedLogPath(file, 1));
		return true;
	} catch {
		return false;
	}
}
async function getCurrentLogFileBytes(file) {
	try {
		return (await fs$1.stat(file)).size;
	} catch {
		return 0;
	}
}
function getCurrentLogFileBytesSync(file) {
	try {
		return fs.statSync(file).size;
	} catch {
		return 0;
	}
}
function buildDroppedMarker(target, count) {
	const date = /* @__PURE__ */ new Date();
	const message = `[openclaw] file log queue overflow; dropped ${count} oldest record${count === 1 ? "" : "s"}`;
	const record = {
		0: message,
		_meta: {
			date,
			hostname: target.hostname,
			logLevelName: "WARN",
			name: "openclaw"
		},
		time: formatTimestamp(date, { style: "long" }),
		hostname: target.hostname,
		message,
		dropped: count
	};
	return {
		...target,
		payload: `${redactSensitiveText(JSON.stringify(record))}\n`
	};
}
function warnAboutRotationFailure(entry) {
	if (warnedRotationFiles.get(entry.file) === entry.maxFileBytes) return;
	warnedRotationFiles.set(entry.file, entry.maxFileBytes);
	const message = `[openclaw] log file rotation failed; continuing writes file=${entry.file} maxFileBytes=${entry.maxFileBytes}`;
	try {
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "warn",
			message
		})}\n`);
	} catch {}
}
function claimQueuedEntries() {
	const entries = queueStart === 0 ? queue : [...queue.slice(queueStart), ...queue.slice(0, queueStart)];
	queue = [];
	queueStart = 0;
	if (droppedCount > 0 && droppedTarget) entries.unshift(buildDroppedMarker(droppedTarget, droppedCount));
	droppedCount = 0;
	droppedTarget = null;
	return entries;
}
function rotateIfNeeded(entry, cursor) {
	const payloadBytes = Buffer.byteLength(entry.payload, "utf8");
	if (cursor.bytes === 0 || cursor.bytes + payloadBytes <= entry.maxFileBytes) return;
	if (rotateLogFile(entry.file)) {
		cursor.bytes = 0;
		warnedRotationFiles.delete(entry.file);
	} else warnAboutRotationFailure(entry);
}
async function writeEntries(entries, generation) {
	const cursors = /* @__PURE__ */ new Map();
	let index = 0;
	while (index < entries.length) {
		if (generation !== drainGeneration || processExiting) return;
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: await getCurrentLogFileBytes(entry.file) };
			if (generation !== drainGeneration || processExiting) return;
			cursors.set(entry.file, cursor);
		}
		rotateIfNeeded(entry, cursor);
		const payloadBytes = Buffer.byteLength(entry.payload, "utf8");
		activeAppendInFlight = true;
		try {
			await appendFile({
				filePath: entry.file,
				content: entry.payload
			});
			cursor.bytes += payloadBytes;
		} catch {} finally {
			activeAppendInFlight = false;
		}
		activeIndex = index + 1;
		index += 1;
	}
}
function writeEntriesSync(entries) {
	const cursors = /* @__PURE__ */ new Map();
	let index = 0;
	while (index < entries.length) {
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: getCurrentLogFileBytesSync(entry.file) };
			cursors.set(entry.file, cursor);
		}
		rotateIfNeeded(entry, cursor);
		const payloadBytes = Buffer.byteLength(entry.payload, "utf8");
		try {
			appendRegularFileSync({
				filePath: entry.file,
				content: entry.payload
			});
			cursor.bytes += payloadBytes;
		} catch {}
		index += 1;
	}
}
async function runFlushLoop() {
	const generation = drainGeneration;
	for (;;) {
		if (generation !== drainGeneration || processExiting) return;
		const entries = claimQueuedEntries();
		if (entries.length === 0) return;
		activeBatch = entries;
		activeIndex = 0;
		await writeEntries(entries, generation);
		if (generation !== drainGeneration) return;
		activeBatch = null;
		activeIndex = 0;
	}
}
function startFlush() {
	if (flushPromise || processExiting) return;
	const running = runFlushLoop().catch(() => void 0);
	flushPromise = running;
	running.then(() => {
		if (flushPromise === running) flushPromise = null;
		if (queue.length > 0 || droppedCount > 0) scheduleFlush();
	});
}
function scheduleFlush() {
	if (scheduledFlush || flushPromise || processExiting) return;
	scheduledFlush = setImmediate(() => {
		scheduledFlush = null;
		startFlush();
	});
}
function handleProcessBeforeExit() {
	flushFileLogQueue();
}
function handleProcessExit() {
	processExiting = true;
	drainFileLogQueueSync();
}
function installProcessHooks() {
	if (processHooksInstalled) return;
	processHooksInstalled = true;
	process.on("beforeExit", handleProcessBeforeExit);
	process.on("exit", handleProcessExit);
}
function removeProcessHooks() {
	if (!processHooksInstalled) return;
	process.removeListener("beforeExit", handleProcessBeforeExit);
	process.removeListener("exit", handleProcessExit);
	processHooksInstalled = false;
}
if (process.env.VITEST !== "true") installProcessHooks();
/** Enqueues one serialized record without waiting for filesystem I/O. */
function enqueueFileLog(entry) {
	if (processExiting) {
		writeEntriesSync([entry]);
		return;
	}
	installProcessHooks();
	if (queue.length >= maxQueuedRecords) {
		const dropped = queue[queueStart];
		if (dropped) {
			droppedTarget ??= dropped;
			droppedCount += 1;
		}
		queue[queueStart] = entry;
		queueStart = (queueStart + 1) % queue.length;
	} else queue.push(entry);
	scheduleFlush();
}
/** Waits until every record currently queued for the async transport has settled. */
async function flushFileLogQueue() {
	for (;;) {
		if (scheduledFlush) {
			clearImmediate(scheduledFlush);
			scheduledFlush = null;
		}
		if (!flushPromise && (queue.length > 0 || droppedCount > 0)) startFlush();
		const running = flushPromise;
		if (!running) return;
		await running;
	}
}
/** Synchronously rescues pending records for process.exit() and crash-adjacent paths. */
function drainFileLogQueueSync() {
	if (scheduledFlush) {
		clearImmediate(scheduledFlush);
		scheduledFlush = null;
	}
	drainGeneration += 1;
	const drainIndex = activeIndex + (activeAppendInFlight ? 1 : 0);
	const entries = activeBatch ? activeBatch.slice(drainIndex) : [];
	activeBatch = null;
	activeIndex = 0;
	entries.push(...claimQueuedEntries());
	writeEntriesSync(entries);
}
function setFileLogQueueMaxRecordsForTests(value) {
	maxQueuedRecords = Math.max(1, value ?? DEFAULT_MAX_QUEUED_RECORDS);
}
function setFileLogAppenderForTests(value) {
	appendFile = value ?? appendRegularFile;
}
function resetFileLogTransportForTests() {
	drainFileLogQueueSync();
	removeProcessHooks();
	processExiting = false;
	appendFile = appendRegularFile;
	maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
	warnedRotationFiles.clear();
}
const fileLogTransport = {
	drainSync: drainFileLogQueueSync,
	enqueue: enqueueFileLog,
	flush: flushFileLogQueue,
	resetForTests: resetFileLogTransportForTests,
	setAppenderForTests: setFileLogAppenderForTests,
	setMaxQueuedRecordsForTests: setFileLogQueueMaxRecordsForTests
};
//#endregion
//#region src/logging/logger-hostname-state.ts
const defaultLoggerHostnameResolver = () => os.hostname();
const loggerHostnameState = {
	cached: null,
	resolver: defaultLoggerHostnameResolver
};
//#endregion
//#region src/logging/logger-settings-internal.ts
let resolveLoggerFileTarget;
function setLoggerFileTargetResolver(resolver) {
	resolveLoggerFileTarget = resolver;
}
function getResolvedLoggerFileTarget() {
	if (!resolveLoggerFileTarget) throw new Error("Logger file target resolver is not initialized");
	return resolveLoggerFileTarget();
}
//#endregion
//#region src/logging/logger.ts
function resolveDefaultLogDir() {
	return canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : DEFAULT_POSIX_TMP_ROOT;
}
function resolveDefaultLogFile(defaultLogDir) {
	return canUseNodeFs() ? path.join(defaultLogDir, "openclaw.log") : `${DEFAULT_POSIX_TMP_ROOT}/openclaw.log`;
}
const DEFAULT_LOG_DIR = resolveDefaultLogDir();
const DEFAULT_LOG_FILE = resolveDefaultLogFile(DEFAULT_LOG_DIR);
const MAX_LOG_AGE_MS = 1440 * 60 * 1e3;
const DEFAULT_MAX_LOG_FILE_BYTES = 100 * 1024 * 1024;
const MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8 * 1024;
const MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4 * 1024;
const loadLoggerConfigDefault = () => readLoggingConfig();
let loadLoggerConfig = loadLoggerConfigDefault;
function setLoggerConfigLoaderForTests(loader) {
	loadLoggerConfig = loader ?? loadLoggerConfigDefault;
	loggingState.cachedLogger = null;
	loggingState.cachedSettings = null;
}
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2 * 1024;
const MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
const MAX_FILE_LOG_MESSAGE_CHARS = 4 * 1024;
const MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
const DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
function clampDiagnosticLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
	return clampDiagnosticLogText(redactSensitiveText(clampDiagnosticLogText(value, maxChars)), maxChars);
}
function normalizeDiagnosticLogName(value) {
	if (!value || value.trim().startsWith("{")) return;
	const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
	if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) return;
	const normalizedKey = key.trim();
	if (isBlockedObjectKey(normalizedKey)) return;
	if (redactSensitiveText(normalizedKey) !== normalizedKey) return;
	if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) return;
	if (typeof value === "string") {
		attributes[normalizedKey] = sanitizeDiagnosticLogText(value, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS);
		state.count += 1;
		return;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		attributes[normalizedKey] = value;
		state.count += 1;
		return;
	}
	if (typeof value === "boolean") {
		attributes[normalizedKey] = value;
		state.count += 1;
	}
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
	if (!source) return;
	for (const key in source) {
		if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) break;
		if (!Object.hasOwn(source, key) || key === "trace") continue;
		assignDiagnosticLogAttribute(attributes, state, key, source[key]);
	}
}
function isPlainLogRecordObject(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const candidate = value;
	if (!isValidDiagnosticTraceId(candidate.traceId)) return;
	if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) return;
	if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) return;
	if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) return;
	return {
		traceId: candidate.traceId,
		...candidate.spanId ? { spanId: candidate.spanId } : {},
		...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
		...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
	};
}
function extractTraceContext(value) {
	const direct = normalizeTraceContext(value);
	if (direct) return direct;
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return normalizeTraceContext(value.trace);
}
function getSortedNumericLogArgs(logObj) {
	return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0])).map(([, value]) => value);
}
function clampFileLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
	if (typeof value === "string") {
		const normalized = value.trim();
		return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "boolean") return String(value);
}
function readFirstContextString(sources, keys) {
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			const value = normalizeFileLogContextValue(source[key]);
			if (value) return value;
		}
	}
}
function stringifyFileLogMessagePart(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (value instanceof Error) return value.message || value.name;
	if (isPlainLogRecordObject(value) && typeof value.message === "string") return value.message;
	if (value === null || value === void 0) return;
	try {
		return JSON.stringify(value);
	} catch {
		return;
	}
}
function buildFileLogMessage(numericArgs) {
	const parts = numericArgs.map(stringifyFileLogMessagePart).filter((part) => Boolean(part && part.trim()));
	if (parts.length === 0) return;
	return clampFileLogText(parts.join(" "), MAX_FILE_LOG_MESSAGE_CHARS);
}
function resolveLogHostname() {
	if (loggerHostnameState.cached) return loggerHostnameState.cached;
	const hostname = loggerHostnameState.resolver().trim();
	if (!hostname) return "unknown";
	loggerHostnameState.cached = hostname;
	return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return meta;
	return {
		...meta,
		hostname
	};
}
function extractLogBindingPrefix(numericArgs) {
	if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) try {
		const parsed = JSON.parse(numericArgs[0]);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			bindings: parsed,
			args: numericArgs.slice(1)
		};
	} catch {}
	return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
	const fromBindings = extractTraceContext(bindings);
	if (fromBindings) return fromBindings;
	for (const arg of numericArgs) {
		const fromArg = extractTraceContext(arg);
		if (fromArg) return fromArg;
	}
}
function resolveLogTraceContext(bindings, numericArgs) {
	const explicitTrace = findLogTraceContext(bindings, numericArgs);
	if (explicitTrace) return {
		trace: explicitTrace,
		trustedTraceContext: false
	};
	const activeTrace = getActiveDiagnosticTraceContext();
	return activeTrace ? {
		trace: activeTrace,
		trustedTraceContext: true
	} : { trustedTraceContext: false };
}
function buildTraceFileLogFields(logObj) {
	const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
	const { trace } = resolveLogTraceContext(bindings, args);
	if (!trace) return;
	return {
		traceId: trace.traceId,
		...trace.spanId ? { spanId: trace.spanId } : {},
		...trace.parentSpanId ? { parentSpanId: trace.parentSpanId } : {},
		...trace.traceFlags ? { traceFlags: trace.traceFlags } : {}
	};
}
function buildStructuredFileLogFields(logObj) {
	const { bindings, args } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
	const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
	const sources = [
		structuredArg,
		bindings,
		logObj
	];
	const message = buildFileLogMessage(structuredArg && typeof structuredArg.message !== "string" ? args.slice(1) : args);
	const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
	const sessionId = readFirstContextString(sources, [
		"session_id",
		"sessionId",
		"sessionKey"
	]);
	const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
	return {
		hostname: resolveLogHostname(),
		...message ? { message } : {},
		...agentId ? { agent_id: agentId } : {},
		...sessionId ? { session_id: sessionId } : {},
		...channel ? { channel } : {}
	};
}
function buildDiagnosticLogRecord(logObj) {
	const meta = logObj["_meta"];
	const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogArgs(logObj));
	const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
	const structuredArg = numericArgs[0];
	const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
	if (structuredBindings) numericArgs.shift();
	let message = "";
	if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") message = sanitizeDiagnosticLogText(String(numericArgs.pop()), MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS);
	else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
		message = String(numericArgs[0]);
		numericArgs.length = 0;
	}
	if (!message) message = "log";
	const attributes = Object.create(null);
	const attributeState = { count: 0 };
	addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
	addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
	const code = {};
	if (meta?.path?.fileLine) {
		const line = Number(meta.path.fileLine);
		if (Number.isFinite(line)) code.line = line;
	}
	if (meta?.path?.method) code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	const loggerName = normalizeDiagnosticLogName(meta?.name);
	const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
	return {
		event: {
			type: "log.record",
			level: meta?.logLevelName ?? "INFO",
			message,
			...loggerName ? { loggerName } : {},
			...loggerParents?.length ? { loggerParents } : {},
			...Object.keys(attributes).length > 0 ? { attributes } : {},
			...Object.keys(code).length > 0 ? { code } : {},
			...trace ? { trace } : {}
		},
		trustedTraceContext
	};
}
function redactLogRecordForTransport(record) {
	return redactSecrets(record);
}
function attachDiagnosticEventTransport(logger) {
	logger.attachTransport((logObj) => {
		try {
			const record = buildDiagnosticLogRecord(redactLogRecordForTransport(logObj));
			(record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent)(record.event);
		} catch {}
	});
}
function canUseSilentVitestFileLogFastPath(envLevel) {
	return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") return path.join(process.cwd(), ".artifacts", "test-logs", `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`);
	return resolveDefaultRollingLogFile({ logDir: DEFAULT_LOG_DIR });
}
function resolveSettings() {
	if (!canUseNodeFs()) return {
		level: "silent",
		file: DEFAULT_LOG_FILE,
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: false
	};
	const envLevel = resolveEnvLogLevelOverride();
	if (canUseSilentVitestFileLogFastPath(envLevel)) return {
		level: "silent",
		file: resolveDefaultRollingLogFile({ logDir: DEFAULT_LOG_DIR }),
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: true
	};
	const cfg = loggingState.overrideSettings ?? loadLoggerConfig();
	const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
	const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
	return {
		level: envLevel ?? fromConfig,
		file: cfg?.file ?? resolveDefaultActiveLogFile(),
		maxFileBytes: resolveMaxLogFileBytes(cfg?.maxFileBytes),
		rolling: cfg?.file ? isLegacyRollingLogFilePath(cfg.file) : true
	};
}
setLoggerFileTargetResolver(() => {
	const { file, rolling } = resolveSettings();
	return {
		file,
		rolling
	};
});
function settingsChanged(a, b) {
	if (!a) return true;
	return a.level !== b.level || a.file !== b.file || a.maxFileBytes !== b.maxFileBytes || a.rolling !== b.rolling;
}
function isFileLogLevelEnabled(level) {
	const settings = loggingState.cachedSettings ?? resolveSettings();
	if (!loggingState.cachedSettings) loggingState.cachedSettings = settings;
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function buildLogger(settings) {
	const silent = settings.level === "silent";
	const logger = new Logger({
		name: "openclaw",
		maskValuesOfKeys: [],
		minLevel: levelToMinLevel(silent ? "fatal" : settings.level),
		type: "hidden"
	});
	if (silent) {
		logger.settings.minLevel = levelToMinLevel("silent");
		attachDiagnosticEventTransport(logger);
		return logger;
	}
	const rollingFile = settings.rolling;
	let activeFile = resolveActiveLogFileWithMode(settings.file, rollingFile);
	fs.mkdirSync(path.dirname(activeFile), { recursive: true });
	if (rollingFile) pruneOldRollingLogs(path.dirname(activeFile));
	logger.attachTransport((logObj) => {
		try {
			const nextActiveFile = resolveActiveLogFileWithMode(settings.file, rollingFile);
			if (nextActiveFile !== activeFile) {
				activeFile = nextActiveFile;
				fs.mkdirSync(path.dirname(activeFile), { recursive: true });
				if (rollingFile) pruneOldRollingLogs(path.dirname(activeFile));
			}
			const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
			const traceFields = buildTraceFileLogFields(logObj);
			const structuredFields = buildStructuredFileLogFields(logObj);
			const record = {
				...logObj,
				_meta: withResolvedLogMetaHostname(logObj["_meta"], expectDefined(structuredFields.hostname, "structured log hostname")),
				time,
				...structuredFields,
				...traceFields
			};
			const line = redactSensitiveText(JSON.stringify(redactLogRecordForTransport(record)));
			fileLogTransport.enqueue({
				file: activeFile,
				hostname: expectDefined(structuredFields.hostname, "structured log hostname"),
				maxFileBytes: settings.maxFileBytes,
				payload: `${line}\n`
			});
		} catch {}
	});
	attachDiagnosticEventTransport(logger);
	return logger;
}
function resolveMaxLogFileBytes(raw) {
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getLogger() {
	const settings = resolveSettings();
	const cachedLogger = loggingState.cachedLogger;
	const cachedSettings = loggingState.cachedSettings;
	if (!cachedLogger || settingsChanged(cachedSettings, settings)) {
		loggingState.cachedLogger = buildLogger(settings);
		loggingState.cachedSettings = settings;
	}
	return loggingState.cachedLogger;
}
function getSubLoggerWithResolvedMinLevel(logger, settings, minLevel) {
	const silent = minLevel === levelToMinLevel("silent");
	const child = logger.getSubLogger({
		...settings,
		minLevel: silent ? levelToMinLevel("fatal") : minLevel
	});
	if (silent) child.settings.minLevel = minLevel;
	return child;
}
function getChildLogger(bindings, opts) {
	const base = getLogger();
	const minLevel = opts?.level ? levelToMinLevel(opts.level) : base.settings.minLevel;
	const name = bindings ? JSON.stringify(bindings) : void 0;
	return getSubLoggerWithResolvedMinLevel(base, {
		name,
		prefix: bindings ? [name ?? ""] : []
	}, minLevel);
}
function toPinoLikeLogger(logger, level) {
	const buildChild = (bindings) => toPinoLikeLogger(getSubLoggerWithResolvedMinLevel(logger, { name: bindings ? JSON.stringify(bindings) : void 0 }, logger.settings.minLevel), level);
	return {
		level,
		child: buildChild,
		trace: (...args) => logger.trace(...args),
		debug: (...args) => logger.debug(...args),
		info: (...args) => logger.info(...args),
		warn: (...args) => logger.warn(...args),
		error: (...args) => logger.error(...args),
		fatal: (...args) => logger.fatal(...args)
	};
}
function getResolvedLoggerSettings() {
	const { rolling: _rolling, ...settings } = resolveSettings();
	return settings;
}
/** Flushes queued file logs before a graceful owner exits the process. */
async function flushLogger() {
	await fileLogTransport.flush();
}
function setLoggerOverride(settings) {
	loggingState.overrideSettings = settings;
	loggingState.cachedLogger = null;
	loggingState.cachedSettings = null;
	loggingState.cachedConsoleSettings = null;
}
function resetLogger() {
	loggingState.cachedLogger = null;
	loggingState.cachedSettings = null;
	loggingState.cachedConsoleSettings = null;
	loggingState.overrideSettings = null;
	loadLoggerConfig = loadLoggerConfigDefault;
	loggerHostnameState.resolver = defaultLoggerHostnameResolver;
	loggerHostnameState.cached = null;
}
function resolveActiveLogFileWithMode(file, rolling) {
	const expandedFile = expandHomePrefix(file);
	return rolling ? resolveRollingLogFilePathForDate(expandedFile, /* @__PURE__ */ new Date()) : expandedFile;
}
function pruneOldRollingLogs(dir) {
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		const cutoff = Date.now() - MAX_LOG_AGE_MS;
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			if (!entry.name.startsWith(`openclaw-`) || !entry.name.endsWith(".log")) continue;
			const fullPath = path.join(dir, entry.name);
			try {
				if (fs.statSync(fullPath).mtimeMs < cutoff) fs.rmSync(fullPath, { force: true });
			} catch {}
		}
	} catch {}
}
//#endregion
export { getLogger as a, resetLogger as c, toPinoLikeLogger as d, getResolvedLoggerFileTarget as f, resolveEnvLogLevelOverride as g, resolveConfiguredLogFilePath as h, getChildLogger as i, setLoggerConfigLoaderForTests as l, isSameRollingLogFileFamily as m, DEFAULT_LOG_FILE as n, getResolvedLoggerSettings as o, isRollingLogFilePath as p, flushLogger as r, isFileLogLevelEnabled as s, DEFAULT_LOG_DIR as t, setLoggerOverride as u };
