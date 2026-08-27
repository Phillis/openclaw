import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as redactSensitiveUrl, o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { P as resolvePositiveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { t as createDedupeCache } from "./dedupe-C9TI3O0j.js";
import { i as resolveOpenClawMcpTransportAlias } from "./mcp-config-normalize-dw5fHLEW.js";
import { a as normalizeEnvVarKey, i as isDangerousHostInheritedEnvVarName, r as isDangerousHostEnvVarName } from "./host-env-security-B_a4cpNH.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { t as redactSensitiveArgv } from "./redact-argv-lKJcCyS6.js";
//#region src/agents/mcp-config-shared.ts
/**
* Shared MCP config coercion helpers.
*
* MCP transport setup uses these functions to normalize loose JSON config into
* string records/arrays while dropping unsafe host environment variables.
*/
const MCP_EXPLICIT_CREDENTIAL_ENV_KEYS = /* @__PURE__ */ new Set([
	"AMQP_URL",
	"AWS_ACCESS_KEY_ID",
	"AWS_SECRET_ACCESS_KEY",
	"AWS_SECURITY_TOKEN",
	"AWS_SESSION_TOKEN",
	"AZURE_CLIENT_ID",
	"AZURE_CLIENT_SECRET",
	"DATABASE_URL",
	"GH_TOKEN",
	"GITHUB_TOKEN",
	"GITLAB_TOKEN",
	"MONGODB_URI",
	"NODE_AUTH_TOKEN",
	"NPM_TOKEN",
	"REDIS_URL"
]);
function isDangerousMcpStdioEnvVarName(rawKey) {
	if (isDangerousHostEnvVarName(rawKey)) return true;
	const key = normalizeEnvVarKey(rawKey);
	if (!key || MCP_EXPLICIT_CREDENTIAL_ENV_KEYS.has(key.toUpperCase())) return false;
	return isDangerousHostInheritedEnvVarName(key);
}
function toMcpFilteredStringRecord(value, options) {
	if (!isRecord(value)) return;
	let droppedByKey = false;
	const entries = Object.entries(value).map(([key, entry]) => {
		if (options?.shouldDropKey?.(key)) {
			droppedByKey = true;
			options?.onDroppedEntry?.(key, entry);
			return null;
		}
		if (typeof entry === "string") return [key, entry];
		if (typeof entry === "number" || typeof entry === "boolean") return [key, String(entry)];
		options?.onDroppedEntry?.(key, entry);
		return null;
	}).filter((entry) => entry !== null);
	if (entries.length === 0 && droppedByKey && options?.preserveEmptyWhenKeysDropped) return {};
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Coerces string/number/boolean entries from a config object into strings. */
function toMcpStringRecord(value, options) {
	return toMcpFilteredStringRecord(value, options);
}
/** Coerces MCP env config while dropping dangerous inherited host env names. */
function toMcpEnvRecord(value, options) {
	return toMcpFilteredStringRecord(value, {
		...options,
		preserveEmptyWhenKeysDropped: true,
		shouldDropKey: (key) => isDangerousMcpStdioEnvVarName(key)
	});
}
/** Coerces an MCP string-array config value, dropping non-string entries. */
function toMcpStringArray(value) {
	if (!Array.isArray(value)) return;
	const entries = value.filter((entry) => typeof entry === "string");
	return entries.length > 0 ? entries : [];
}
//#endregion
//#region src/agents/mcp-http.ts
/**
* HTTP MCP launch config normalization.
*
* MCP server setup uses this to validate SSE/streamable HTTP server records,
* sanitize headers, and redact sensitive URLs in diagnostics.
*/
/** Normalizes an HTTP MCP server config record into a launchable transport config. */
function resolveHttpMcpServerLaunchConfig(raw, options) {
	if (!isRecord(raw)) return {
		ok: false,
		reason: "server config must be an object"
	};
	if (typeof raw.url !== "string" || raw.url.trim().length === 0) return {
		ok: false,
		reason: "its url is missing"
	};
	const url = raw.url.trim();
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return {
			ok: false,
			reason: `its url is not a valid URL: ${redactSensitiveUrlLikeString(url)}`
		};
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
		ok: false,
		reason: `only http and https URLs are supported, got ${parsed.protocol}`
	};
	let headers;
	if (raw.headers !== void 0 && raw.headers !== null) if (!isRecord(raw.headers)) options?.onMalformedHeaders?.(raw.headers);
	else headers = toMcpStringRecord(raw.headers, { onDroppedEntry: options?.onDroppedHeader });
	return {
		ok: true,
		config: {
			transportType: options?.transportType ?? "sse",
			url,
			headers
		}
	};
}
/** Describes an HTTP MCP server launch config without leaking URL credentials. */
function describeHttpMcpServerLaunchConfig(config) {
	return redactSensitiveUrl(config.url);
}
//#endregion
//#region src/agents/mcp-stdio.ts
/**
* Stdio MCP launch config normalization.
* Accepts OpenClaw and upstream MCP config field names, keeping only
* command/args/env/cwd needed to spawn a stdio server.
*/
/** Resolve raw MCP server config into a stdio launch config. */
function resolveStdioMcpServerLaunchConfig(raw, options) {
	if (!isRecord(raw)) return {
		ok: false,
		reason: "server config must be an object"
	};
	if (typeof raw.command !== "string" || raw.command.trim().length === 0) {
		if (typeof raw.url === "string" && raw.url.trim().length > 0) return {
			ok: false,
			reason: "not a stdio server (has url)"
		};
		return {
			ok: false,
			reason: "its command is missing"
		};
	}
	const cwd = typeof raw.cwd === "string" && raw.cwd.trim().length > 0 ? raw.cwd : typeof raw.workingDirectory === "string" && raw.workingDirectory.trim().length > 0 ? raw.workingDirectory : void 0;
	return {
		ok: true,
		config: {
			command: raw.command,
			args: toMcpStringArray(raw.args),
			env: toMcpEnvRecord(raw.env, { onDroppedEntry: options?.onDroppedEnv }),
			cwd
		}
	};
}
/** Describe a stdio MCP launch config for diagnostics. */
function describeStdioMcpServerLaunchConfig(config) {
	const redactedArgs = Array.isArray(config.args) ? redactSensitiveArgv(config.args) : [];
	const args = redactedArgs.length > 0 ? ` ${redactedArgs.join(" ")}` : "";
	const cwd = config.cwd ? ` (cwd=${config.cwd})` : "";
	return `${config.command}${args}${cwd}`;
}
//#endregion
//#region src/agents/mcp-transport-config.ts
/**
* Resolves MCP transport command, environment, and timeout configuration.
*/
const DEFAULT_CONNECTION_TIMEOUT_MS = 3e4;
const DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
const warnedDroppedStdioEnvKeys = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function warnDroppedStdioEnvOnce(serverName, key) {
	const logServerName = sanitizeForLog(serverName);
	const logKey = sanitizeForLog(key);
	if (warnedDroppedStdioEnvKeys.check(JSON.stringify([serverName, key]))) return;
	logWarn(`bundle-mcp: server "${logServerName}": env "${logKey}" is blocked for stdio startup safety and was ignored.`);
}
function getPositiveNumber(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = asPositiveFiniteNumber(record[key]);
		if (value !== void 0) return value;
	}
}
function getConnectionTimeoutMs(rawServer) {
	const milliseconds = getPositiveNumber(rawServer, ["connectionTimeoutMs"]);
	if (milliseconds) return clampPositiveTimerTimeoutMs(milliseconds) ?? DEFAULT_CONNECTION_TIMEOUT_MS;
	return DEFAULT_CONNECTION_TIMEOUT_MS;
}
function resolveMcpRequestTimeoutMs(rawServer, fallbackMs = DEFAULT_REQUEST_TIMEOUT_MS) {
	const milliseconds = getPositiveNumber(rawServer, ["requestTimeoutMs"]);
	if (milliseconds) return clampPositiveTimerTimeoutMs(milliseconds) ?? DEFAULT_REQUEST_TIMEOUT_MS;
	return resolvePositiveTimerTimeoutMs(fallbackMs, DEFAULT_REQUEST_TIMEOUT_MS);
}
function getBooleanField(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "boolean") return value;
	}
}
function getStringField(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	return readTrimmedStringAlias(rawServer, keys);
}
function getRequestedTransport(rawServer) {
	if (!rawServer || typeof rawServer !== "object" || typeof rawServer.transport !== "string") return "";
	return normalizeLowercaseStringOrEmpty(rawServer.transport);
}
function getRequestedTransportAlias(rawServer) {
	if (!rawServer || typeof rawServer !== "object" || typeof rawServer.type !== "string") return "";
	return resolveOpenClawMcpTransportAlias(rawServer.type) ?? "";
}
function resolveHttpTransportConfig(serverName, rawServer, transportType, logWarnings) {
	const launch = resolveHttpMcpServerLaunchConfig(rawServer, logWarnings ? {
		transportType,
		onDroppedHeader: (key) => {
			logWarn(`bundle-mcp: server "${serverName}": header "${key}" has an unsupported value type and was ignored.`);
		},
		onMalformedHeaders: () => {
			logWarn(`bundle-mcp: server "${serverName}": "headers" must be a JSON object; the value was ignored.`);
		}
	} : { transportType });
	if (!launch.ok) return null;
	return {
		kind: "http",
		transportType: launch.config.transportType,
		url: launch.config.url,
		headers: launch.config.headers,
		...rawServer && typeof rawServer === "object" && rawServer.auth === "oauth" ? { auth: "oauth" } : {},
		...rawServer && typeof rawServer === "object" && rawServer.oauth && typeof rawServer.oauth === "object" && !Array.isArray(rawServer.oauth) ? { oauth: rawServer.oauth } : {},
		...getBooleanField(rawServer, ["sslVerify"]) !== void 0 ? { sslVerify: getBooleanField(rawServer, ["sslVerify"]) } : {},
		...getStringField(rawServer, ["clientCert"]) ? { clientCert: getStringField(rawServer, ["clientCert"]) } : {},
		...getStringField(rawServer, ["clientKey"]) ? { clientKey: getStringField(rawServer, ["clientKey"]) } : {},
		description: describeHttpMcpServerLaunchConfig(launch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: resolveMcpRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, ["supportsParallelToolCalls"]) ?? false
	};
}
/** Resolve one MCP server's launch transport config, or null when unsupported. */
function resolveMcpTransportConfig(serverName, rawServer, options) {
	const logWarnings = options?.logWarnings !== false;
	const requestedTransport = getRequestedTransport(rawServer);
	const requestedTransportAlias = requestedTransport ? "" : getRequestedTransportAlias(rawServer);
	const effectiveTransport = requestedTransport || requestedTransportAlias;
	const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer, logWarnings ? { onDroppedEnv: (key) => {
		warnDroppedStdioEnvOnce(serverName, key);
	} } : void 0);
	if (stdioLaunch.ok) return {
		kind: "stdio",
		transportType: "stdio",
		command: stdioLaunch.config.command,
		args: stdioLaunch.config.args,
		env: stdioLaunch.config.env,
		cwd: stdioLaunch.config.cwd,
		description: describeStdioMcpServerLaunchConfig(stdioLaunch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: resolveMcpRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, ["supportsParallelToolCalls"]) ?? false
	};
	if (effectiveTransport && effectiveTransport !== "sse" && effectiveTransport !== "streamable-http") {
		if (logWarnings) logWarn(`bundle-mcp: skipped server "${sanitizeForLog(serverName)}" because transport "${sanitizeForLog(effectiveTransport)}" is not supported.`);
		return null;
	}
	if (effectiveTransport === "streamable-http") {
		const httpTransport = resolveHttpTransportConfig(serverName, rawServer, "streamable-http", logWarnings);
		if (httpTransport) return httpTransport;
	}
	const sseTransport = resolveHttpTransportConfig(serverName, rawServer, "sse", logWarnings);
	if (sseTransport) return sseTransport;
	const httpLaunch = resolveHttpMcpServerLaunchConfig(rawServer);
	const httpReason = httpLaunch.ok ? "not an HTTP MCP server" : httpLaunch.reason;
	if (logWarnings) logWarn(`bundle-mcp: skipped server "${sanitizeForLog(serverName)}" because ${stdioLaunch.reason} and ${httpReason}.`);
	return null;
}
//#endregion
export { resolveStdioMcpServerLaunchConfig as i, resolveMcpTransportConfig as n, describeStdioMcpServerLaunchConfig as r, resolveMcpRequestTimeoutMs as t };
