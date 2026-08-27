import { c as redactSensitiveText, p as readLoggingConfig } from "./redact-DP7p9QfH.js";
import { t as loggingState } from "./state-CNIDfzP9.js";
import { r as stripAnsi } from "./ansi-9qL8iF9E.js";
import { t as isVerbose } from "./global-state-BCtvHc7P.js";
import { i as formatTimestamp, r as formatJsonConsoleLine } from "./json-console-line-D077TjlD.js";
import { r as normalizeLogLevel } from "./levels-CLdqNCQ3.js";
import { a as getLogger, g as resolveEnvLogLevelOverride } from "./logger-CufStxi-.js";
import util from "node:util";
//#region src/logging/console.ts
function normalizeConsoleLevel(level) {
	if (isVerbose()) return "debug";
	if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") return "silent";
	return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
	if (style === "compact" || style === "json" || style === "pretty") return style;
	if (!process.stdout.isTTY) return "compact";
	return "pretty";
}
function resolveConsoleSettings() {
	const envLevel = resolveEnvLogLevelOverride();
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) return {
		level: "silent",
		style: normalizeConsoleStyle(void 0)
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	return {
		level: envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel),
		style: normalizeConsoleStyle(cfg?.consoleStyle)
	};
}
function consoleSettingsChanged(a, b) {
	if (!a) return true;
	return a.level !== b.level || a.style !== b.style;
}
function getConsoleSettings() {
	const settings = resolveConsoleSettings();
	const cached = loggingState.cachedConsoleSettings;
	if (!cached || consoleSettingsChanged(cached, settings)) loggingState.cachedConsoleSettings = settings;
	return loggingState.cachedConsoleSettings;
}
function getResolvedConsoleSettings() {
	return getConsoleSettings();
}
function routeLogsToStderr() {
	loggingState.forceConsoleToStderr = true;
}
function setConsoleSubsystemFilter(filters) {
	if (!filters || filters.length === 0) {
		loggingState.consoleSubsystemFilter = null;
		return;
	}
	const normalized = filters.map((value) => value.trim()).filter((value) => value.length > 0);
	loggingState.consoleSubsystemFilter = normalized.length > 0 ? normalized : null;
}
/** Hides subsystem console lines for TTY-owned work while preserving file logging. */
async function withConsoleSubsystemsSuppressed(work) {
	const previousFilter = loggingState.consoleSubsystemFilter ? [...loggingState.consoleSubsystemFilter] : null;
	setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
	try {
		return await work();
	} finally {
		setConsoleSubsystemFilter(previousFilter);
	}
}
function setConsoleTimestampPrefix(enabled) {
	loggingState.consoleTimestampPrefix = enabled;
}
function normalizeConsoleSubsystem(subsystem) {
	if (typeof subsystem !== "string") return null;
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
	const filter = loggingState.consoleSubsystemFilter;
	if (!filter || filter.length === 0) return true;
	const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
	if (!normalizedSubsystem) return false;
	return filter.some((prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`));
}
const SUPPRESSED_CONSOLE_PREFIXES = [
	"Closing session:",
	"Opening session:",
	"Removing old closed session:",
	"Session already closed",
	"Session already open"
];
function shouldSuppressConsoleMessage(message) {
	if (SUPPRESSED_CONSOLE_PREFIXES.some((prefix) => message.startsWith(prefix))) return true;
	if (isVerbose()) return false;
	return false;
}
function isEpipeError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function formatConsoleTimestamp(style) {
	const now = /* @__PURE__ */ new Date();
	if (style === "pretty") return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
	return formatTimestamp(now, { style: "long" });
}
function captureConsoleTraceStack(message, caller) {
	const trace = new Error(message);
	trace.name = "Trace";
	Error.captureStackTrace(trace, caller);
	return trace.stack === void 0 ? `Trace: ${message}` : typeof trace.stack === "string" ? trace.stack : util.format(trace.stack);
}
function hasTimestampPrefix(value) {
	return /^(?:\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)/.test(value);
}
/**
* Route console.* calls through file logging while still emitting to stdout/stderr.
* This keeps user-facing output unchanged but guarantees every console call is captured in log files.
*/
function enableConsoleCapture() {
	if (loggingState.consolePatched) return;
	loggingState.consolePatched = true;
	if (!loggingState.streamErrorHandlersInstalled) {
		loggingState.streamErrorHandlersInstalled = true;
		for (const stream of [process.stdout, process.stderr]) stream.on("error", (err) => {
			if (isEpipeError(err)) {
				const exitCode = process.exitCode;
				process.exit(exitCode !== void 0 && exitCode !== 0 && exitCode !== "0" ? exitCode : 0);
				return;
			}
			throw err;
		});
	}
	let logger = null;
	const getLoggerLazy = () => {
		if (!logger) logger = getLogger();
		return logger;
	};
	const original = {
		log: console.log,
		info: console.info,
		warn: console.warn,
		error: console.error,
		debug: console.debug,
		trace: console.trace
	};
	loggingState.rawConsole = {
		log: original.log,
		info: original.info,
		warn: original.warn,
		error: original.error
	};
	const forward = (level, orig) => {
		const forwardedConsoleCall = (...args) => {
			const formatted = util.format(...args);
			if (shouldSuppressConsoleMessage(formatted)) return;
			const trimmed = stripAnsi(formatted).trimStart();
			const consoleStyle = getConsoleSettings().style;
			const timestamp = consoleStyle !== "json" && loggingState.consoleTimestampPrefix && trimmed.length > 0 && !hasTimestampPrefix(trimmed) ? formatConsoleTimestamp(consoleStyle) : "";
			try {
				const resolvedLogger = getLoggerLazy();
				if (level === "trace") resolvedLogger.trace(formatted);
				else if (level === "debug") resolvedLogger.debug(formatted);
				else if (level === "info") resolvedLogger.info(formatted);
				else if (level === "warn") resolvedLogger.warn(formatted);
				else if (level === "error" || level === "fatal") resolvedLogger.error(formatted);
				else resolvedLogger.info(formatted);
			} catch {}
			const jsonMessage = consoleStyle === "json" ? stripAnsi(formatted) : "";
			const jsonMeta = consoleStyle === "json" && level === "trace" ? { stack: stripAnsi(captureConsoleTraceStack(formatted, forwardedConsoleCall)) } : void 0;
			if (loggingState.forceConsoleToStderr) try {
				const redacted = redactSensitiveText(formatted);
				const line = consoleStyle === "json" ? formatJsonConsoleLine({
					level,
					message: jsonMessage,
					meta: jsonMeta
				}) : timestamp ? `${timestamp} ${redacted}` : redacted;
				process.stderr.write(`${line}\n`);
			} catch (err) {
				if (isEpipeError(err)) return;
				throw err;
			}
			else try {
				const redacted = redactSensitiveText(formatted);
				if (consoleStyle === "json") {
					const line = formatJsonConsoleLine({
						level,
						message: jsonMessage,
						meta: jsonMeta
					});
					if (level === "trace") original.error(line);
					else orig.call(console, line);
					return;
				}
				if (!timestamp) {
					if (args.length === 0) {
						orig.apply(console, args);
						return;
					}
					orig.call(console, redacted);
					return;
				}
				orig.call(console, redacted ? `${timestamp} ${redacted}` : timestamp);
			} catch (err) {
				if (isEpipeError(err)) return;
				throw err;
			}
		};
		return forwardedConsoleCall;
	};
	console.log = forward("info", original.log);
	console.info = forward("info", original.info);
	console.warn = forward("warn", original.warn);
	console.error = forward("error", original.error);
	console.debug = forward("debug", original.debug);
	console.trace = forward("trace", original.trace);
}
//#endregion
export { routeLogsToStderr as a, shouldLogSubsystemToConsole as c, getResolvedConsoleSettings as i, withConsoleSubsystemsSuppressed as l, formatConsoleTimestamp as n, setConsoleSubsystemFilter as o, getConsoleSettings as r, setConsoleTimestampPrefix as s, enableConsoleCapture as t };
