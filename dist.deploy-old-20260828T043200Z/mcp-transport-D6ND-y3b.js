import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { t as filterStringEntries } from "./string-normalization-e_fvmxMf.js";
import { m as redactToolPayloadText } from "./redact-CWP17HFN.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as signalProcessTree } from "./kill-tree-CR2oLt9D.js";
import { r as normalizeJsonSchemaForTypeBox } from "./json-schema-DFcw9gk-.js";
import { n as findJsonSchemaShapeError } from "./schema-validator-yfJyG0DX.js";
import { t as mergeProcessEnv } from "./process-env-CW4bkwqq.js";
import { t as logDebug } from "./logger-D4iLuGk3.js";
import { n as truncateUtf8Suffix } from "./utf8-truncate-Dro7v_iB.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-CZdVn5YO.js";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import { m as requesterMcpOAuthIdentity, p as operatorMcpOAuthIdentity } from "./mcp-oauth-store-BSuWhVNF.js";
import { c as recordMcpOAuthAuthorizationRequired, d as buildMcpHttpFetch, f as withSameOriginMcpHttpHeaders, l as resolveMcpOAuthAccessToken, p as withoutMcpAuthorizationHeader } from "./mcp-oauth-eWr2mvUU.js";
import { i as withMcpAuthProfileBearer, n as resolveMcpAuthProfileId } from "./mcp-auth-profile-0t0fkMP1.js";
import process from "node:process";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { Compile } from "typebox/compile";
import { PassThrough } from "node:stream";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { extractWWWAuthenticateParams } from "@modelcontextprotocol/sdk/client/auth.js";
import { StreamableHTTPClientTransport, StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport, SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ReadBuffer, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
//#region src/agents/mcp-http-transport.ts
const STREAM_RETRY_EXHAUSTED_RE = /^Maximum reconnection attempts \(\d+\) exceeded\.$/;
const SESSION_TERMINATION_TIMEOUT_MS = 5e3;
var OpenClawMcpHttpTransport = class {
	constructor() {
		this.closed = false;
		this.closeEmitted = false;
	}
	emitClose() {
		if (this.closeEmitted) return;
		this.closeEmitted = true;
		this.onclose?.();
	}
	emitError(error) {
		if (!this.closed) this.onerror?.(error);
	}
};
/** Converts legacy SSE terminal HTTP failures into the lifecycle close the SDK omits. */
var OpenClawSSEClientTransport = class extends OpenClawMcpHttpTransport {
	constructor(url, options) {
		super();
		this.transport = new SSEClientTransport(url, options);
	}
	async start() {
		this.transport.onmessage = (message) => this.onmessage?.(message);
		this.transport.onclose = () => this.emitClose();
		this.transport.onerror = (error) => {
			this.emitError(error);
			if (error instanceof SseError && error.code !== void 0) this.close();
		};
		await this.transport.start();
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		await this.transport.close();
		this.emitClose();
	}
	async send(message) {
		if (this.closed) throw new Error("MCP SSE transport is closed");
		await this.transport.send(message);
	}
	setProtocolVersion(version) {
		this.transport.setProtocolVersion(version);
	}
};
/** Owns Streamable HTTP notification recovery and stateful cleanup around SDK 1.30.0. */
var OpenClawStreamableHTTPClientTransport = class extends OpenClawMcpHttpTransport {
	constructor(url, options = {}) {
		super();
		this.pendingExpiredNotificationGet = false;
		this.url = url;
		this.cleanupFetch = options.fetch ?? fetch;
		this.requestInit = options.requestInit;
		const runtimeFetch = async (input, init) => {
			if (this.closed) throw new Error("MCP Streamable HTTP transport is closed");
			const response = await this.cleanupFetch(input, init);
			if (init?.method === "GET" && response.status === 404 && this.sessionId !== void 0) this.pendingExpiredNotificationGet = true;
			return response;
		};
		this.transport = new StreamableHTTPClientTransport(url, {
			...options,
			fetch: runtimeFetch
		});
	}
	get sessionId() {
		return this.transport.sessionId;
	}
	get protocolVersion() {
		return this.transport.protocolVersion;
	}
	async start() {
		this.transport.onmessage = (message) => this.onmessage?.(message);
		this.transport.onclose = () => this.emitClose();
		this.transport.onerror = (error) => {
			if (this.closed) {
				setTimeout(() => void this.transport.close(), 0).unref?.();
				return;
			}
			this.emitError(error);
			const sessionExpired = this.pendingExpiredNotificationGet && error instanceof StreamableHTTPError && error.code === 404;
			if (sessionExpired) this.pendingExpiredNotificationGet = false;
			if (sessionExpired || STREAM_RETRY_EXHAUSTED_RE.test(error.message)) this.close();
		};
		await this.transport.start();
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		await this.transport.close();
		this.emitClose();
	}
	async send(message, options) {
		await this.transport.send(message, options);
	}
	setProtocolVersion(version) {
		this.transport.setProtocolVersion(version);
	}
	/** Uses a fresh request signal because failed initialization makes the SDK's signal unusable. */
	async terminateSession() {
		const sessionId = this.sessionId;
		if (!sessionId || sessionId === this.terminatedSessionId) return;
		const headers = new Headers(this.requestInit?.headers);
		headers.set("mcp-session-id", sessionId);
		if (this.protocolVersion) headers.set("mcp-protocol-version", this.protocolVersion);
		const response = await this.cleanupFetch(this.url, {
			...this.requestInit,
			method: "DELETE",
			headers,
			signal: AbortSignal.timeout(SESSION_TERMINATION_TIMEOUT_MS)
		});
		await response.body?.cancel();
		if (!response.ok && response.status !== 405) throw new StreamableHTTPError(response.status, `Failed to terminate session: ${response.statusText}`);
		this.terminatedSessionId = sessionId;
	}
};
//#endregion
//#region src/agents/mcp-stdio-transport.ts
/**
* OpenClaw stdio transport wrapper for MCP server subprocesses.
*/
const CLOSE_TIMEOUT_MS = 2e3;
const SIGKILL_REAP_TIMEOUT_MS = 500;
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms).unref();
	});
}
var OpenClawStdioClientTransport = class {
	constructor(serverParams) {
		this.serverParams = serverParams;
		this.readBuffer = new ReadBuffer();
		this.stderrStream = null;
		if (serverParams.stderr === "pipe" || serverParams.stderr === "overlapped") this.stderrStream = new PassThrough();
	}
	async start() {
		if (this.process) throw new Error("OpenClawStdioClientTransport already started; Client.connect() starts transports automatically.");
		const prepareDataDir = this.serverParams.prepareDataDir?.trim();
		if (prepareDataDir) try {
			await fs.mkdir(prepareDataDir, { recursive: true });
		} catch (error) {
			throw new Error(`unable to prepare PLUGIN_DATA directory "${prepareDataDir}": ${formatErrorMessage(error)}`, { cause: error });
		}
		await new Promise((resolve, reject) => {
			const baseEnv = mergeProcessEnv([getDefaultEnvironment(), this.serverParams.env]);
			const preparedSpawn = prepareOomScoreAdjustedSpawn(this.serverParams.command, this.serverParams.args ?? [], { env: baseEnv });
			const child = spawn(preparedSpawn.command, preparedSpawn.args, {
				cwd: this.serverParams.cwd,
				detached: process.platform !== "win32",
				env: preparedSpawn.env,
				shell: false,
				stdio: [
					"pipe",
					"pipe",
					this.serverParams.stderr ?? "inherit"
				],
				windowsHide: process.platform === "win32"
			});
			this.process = child;
			if (process.platform !== "win32" && child.pid) this.ownedProcessGroupId = child.pid;
			child.on("error", (error) => {
				reject(error);
				this.onerror?.(error);
			});
			child.on("spawn", () => resolve());
			child.on("close", () => {
				if (this.process === child) this.process = void 0;
				if (child.pid && this.ownedProcessGroupId === child.pid) {
					signalProcessTree(child.pid, "SIGKILL", { detached: true });
					this.ownedProcessGroupId = void 0;
				}
				this.onclose?.();
			});
			child.stdin?.on("error", (error) => this.onerror?.(error));
			child.stdout?.on("data", (chunk) => {
				try {
					this.readBuffer.append(chunk);
					this.processReadBuffer();
				} catch (error) {
					this.onerror?.(error instanceof Error ? error : new Error(String(error)));
					this.close();
				}
			});
			child.stdout?.on("error", (error) => this.onerror?.(error));
			if (this.stderrStream && child.stderr) {
				child.stderr.on("error", (error) => this.onerror?.(error));
				child.stderr.pipe(this.stderrStream);
			}
		});
	}
	get stderr() {
		return this.stderrStream ?? this.process?.stderr ?? null;
	}
	get pid() {
		return this.process?.pid ?? this.closingProcess?.pid ?? null;
	}
	processReadBuffer() {
		while (true) try {
			const message = this.readBuffer.readMessage();
			if (message === null) break;
			this.onmessage?.(message);
		} catch (error) {
			this.onerror?.(error instanceof Error ? error : new Error(String(error)));
		}
	}
	async close() {
		const processToClose = this.process ?? this.closingProcess;
		const ownedProcessGroupId = this.ownedProcessGroupId;
		this.process = void 0;
		this.closingProcess = processToClose;
		if (processToClose) {
			const closePromise = new Promise((resolve) => {
				processToClose.once("close", () => resolve());
			});
			try {
				processToClose.stdin?.end();
			} catch {}
			await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
			if (processToClose.exitCode === null && processToClose.pid) {
				signalProcessTree(processToClose.pid, "SIGTERM", { detached: true });
				await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
				if (processToClose.exitCode === null && processToClose.pid) {
					signalProcessTree(processToClose.pid, "SIGKILL", { detached: true });
					await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
				}
			}
		}
		if (this.closingProcess === processToClose) this.closingProcess = void 0;
		if (this.ownedProcessGroupId === ownedProcessGroupId) this.ownedProcessGroupId = void 0;
		this.readBuffer.clear();
	}
	async forceClose() {
		const processToClose = this.process ?? this.closingProcess;
		const ownedProcessGroupId = this.ownedProcessGroupId;
		this.process = void 0;
		if (processToClose?.pid && processToClose.exitCode === null) {
			const closePromise = new Promise((resolve) => {
				processToClose.once("close", () => resolve());
			});
			signalProcessTree(processToClose.pid, "SIGKILL", { detached: true });
			await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
		} else if (ownedProcessGroupId) signalProcessTree(ownedProcessGroupId, "SIGKILL", { detached: true });
		if (this.closingProcess === processToClose) this.closingProcess = void 0;
		if (this.ownedProcessGroupId === ownedProcessGroupId) this.ownedProcessGroupId = void 0;
		this.readBuffer.clear();
	}
	send(message) {
		return new Promise((resolve, reject) => {
			const stdin = this.process?.stdin;
			if (!stdin) throw new Error("Not connected");
			const json = serializeMessage(message);
			try {
				if (!stdin.write(json, (err) => {
					if (err) reject(err);
					else resolve();
				})) stdin.once("drain", () => {});
			} catch (err) {
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		});
	}
};
//#endregion
//#region src/agents/mcp-client-lifecycle.ts
var McpClientConnectTimeoutError = class extends Error {};
/** Matches the SDK's terminal signal for an expired stateful Streamable HTTP session. */
function isStatefulMcpHttpSessionExpired(session, error) {
	return session.transportType === "streamable-http" && session.transport instanceof OpenClawStreamableHTTPClientTransport && session.transport.sessionId !== void 0 && error instanceof StreamableHTTPError && error.code === 404;
}
async function connectMcpClient(params) {
	const deadline = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, deadline]) : deadline;
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("MCP startup aborted"));
		if (signal.aborted) onAbort();
		else signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		await Promise.race([params.client.connect(params.transport, {
			signal,
			timeout: params.timeoutMs,
			maxTotalTimeout: params.timeoutMs
		}), aborted]);
	} catch (error) {
		if (deadline.aborted || isRecord(error) && error.code === ErrorCode.RequestTimeout) {
			await disposeMcpClient({
				client: params.client,
				transport: params.transport,
				transportType: params.transport instanceof OpenClawStdioClientTransport ? "stdio" : params.transport instanceof OpenClawStreamableHTTPClientTransport ? "streamable-http" : "sse"
			}, Math.min(params.timeoutMs, 1e3));
			throw new McpClientConnectTimeoutError(`MCP server connection timed out after ${params.timeoutMs}ms`, { cause: error });
		}
		throw error;
	} finally {
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function settleWithin(promise, timeoutMs) {
	let timer;
	return await Promise.race([promise.then(() => true, () => true), new Promise((resolve) => {
		timer = setTimeout(() => resolve(false), timeoutMs);
		timer.unref?.();
	})]).finally(() => clearTimeout(timer));
}
async function ignoreCloseFailure(close) {
	try {
		await close();
	} catch {}
}
async function disposeMcpClient(session, timeoutMs = 5e3) {
	try {
		if (await settleWithin((async () => {
			if (session.transportType === "streamable-http") await ignoreCloseFailure(() => session.transport.terminateSession?.());
			await ignoreCloseFailure(() => session.transport.close());
			await ignoreCloseFailure(() => session.client.close());
		})(), timeoutMs)) return;
		const { transport } = session;
		const closeTransport = session.transportType === "stdio" && transport instanceof OpenClawStdioClientTransport ? () => transport.forceClose() : () => transport.close();
		await settleWithin(Promise.all([ignoreCloseFailure(closeTransport), ignoreCloseFailure(() => session.client.close())]), timeoutMs);
	} finally {
		session.detachStderr?.();
	}
}
//#endregion
//#region src/agents/mcp-error.ts
const STREAMABLE_RESPONSE_BODY_MARKER = "Error POSTing to endpoint:";
const LEGACY_RESPONSE_BODY_RE = /Error POSTing to endpoint \(HTTP \d+\):/;
/** Redacts MCP diagnostics, including response bodies the SDK includes in thrown errors. */
function redactMcpDiagnosticError(error) {
	let message = formatErrorMessage(error);
	const streamableIndex = message.indexOf(STREAMABLE_RESPONSE_BODY_MARKER);
	const legacyMatch = LEGACY_RESPONSE_BODY_RE.exec(message);
	const prefixEnd = streamableIndex >= 0 ? streamableIndex + 26 : legacyMatch ? legacyMatch.index + legacyMatch[0].length : void 0;
	if (prefixEnd !== void 0) message = `${message.slice(0, prefixEnd)} [redacted response body]`;
	return redactToolPayloadText(redactSensitiveUrlLikeString(message));
}
//#endregion
//#region src/agents/mcp-json-schema-validator.ts
const DRAFT_2020_12_SCHEMA = "https://json-schema.org/draft/2020-12/schema";
function isDraft202012Schema(schema) {
	return schema.$schema === DRAFT_2020_12_SCHEMA;
}
function formatTypeBoxErrors(errors) {
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join(", ") || "schema validation failed";
}
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
const schemaValueKeywords = /* @__PURE__ */ new Set([
	"additionalItems",
	"additionalProperties",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaArrayKeywords = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
function stripSchemaMapFormats(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, stripJsonSchemaFormats(entry)]));
}
function expandJsonSchemaTypeArray(schema) {
	const { type, ...rest } = schema;
	if (!Array.isArray(type)) return schema;
	return { anyOf: type.map((entry) => Object.assign({}, rest, { type: entry })) };
}
function stripJsonSchemaFormats(schema) {
	if (Array.isArray(schema)) return schema.map((entry) => stripJsonSchemaFormats(entry));
	if (!schema || typeof schema !== "object") return schema;
	const normalizedSchema = expandJsonSchemaTypeArray(schema);
	return Object.fromEntries(Object.entries(normalizedSchema).filter(([key]) => key !== "format").map(([key, value]) => {
		if (schemaMapKeywords.has(key)) return [key, stripSchemaMapFormats(value)];
		if (key === "dependencies") return [key, stripSchemaMapFormats(value)];
		if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key)) return [key, stripJsonSchemaFormats(value)];
		return [key, value];
	}));
}
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
function createMcpJsonSchemaValidator() {
	const defaultValidator = new AjvJsonSchemaValidator();
	return { getValidator(schema) {
		if (!isDraft202012Schema(schema)) return defaultValidator.getValidator(schema);
		let validator;
		try {
			const schemaError = findJsonSchemaShapeError(schema);
			if (schemaError) throw new Error(schemaError);
			validator = Compile(normalizeJsonSchemaForTypeBox(stripJsonSchemaFormats(schema)));
		} catch (error) {
			const setupError = toErrorObject(error, "schema setup failed");
			throw new Error(`Invalid MCP draft-2020-12 JSON Schema: ${setupError.message}`, { cause: error });
		}
		return (input) => {
			if (validator.Check(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			return {
				valid: false,
				data: void 0,
				errorMessage: formatTypeBoxErrors([...validator.Errors(input)])
			};
		};
	} };
}
//#endregion
//#region src/agents/mcp-metadata.ts
const MCP_METADATA_TEXT_LIMIT = 1200;
/** Scrubs untrusted MCP metadata before exposing it to a model. */
function sanitizeMcpMetadataText(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const scrubbed = normalized.replace(/ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/disregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/system\s+prompt/gi, "system prompt");
	return scrubbed.length > MCP_METADATA_TEXT_LIMIT ? `${truncateUtf16Safe(scrubbed, MCP_METADATA_TEXT_LIMIT)}...` : scrubbed;
}
//#endregion
//#region src/agents/mcp-pagination.ts
/** Shared bounded pagination for MCP list operations. */
function positiveInteger(value, label) {
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${label} must be a positive safe integer`);
	return value;
}
function abortError(signal, label) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error(`${label} aborted`);
}
async function collectMcpPaginatedItems(params) {
	const timeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs);
	if (timeoutMs === void 0) throw new Error(`${params.label} requires a positive timeout`);
	const maxPages = positiveInteger(params.maxPages, `${params.label} maxPages`);
	const maxItems = positiveInteger(params.maxItems, `${params.label} maxItems`);
	const maxBytes = positiveInteger(params.maxBytes, `${params.label} maxBytes`);
	const deadlineController = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, deadlineController.signal]) : deadlineController.signal;
	if (signal.aborted) throw abortError(signal, params.label);
	const deadlineAtMs = Date.now() + timeoutMs;
	const timeoutError = /* @__PURE__ */ new Error(`${params.label} timed out after ${timeoutMs}ms`);
	const deadlineTimer = setTimeout(() => deadlineController.abort(timeoutError), timeoutMs);
	deadlineTimer.unref?.();
	const assertActive = () => {
		if (signal.aborted) throw abortError(signal, params.label);
		if (Date.now() >= deadlineAtMs) {
			deadlineController.abort(timeoutError);
			throw timeoutError;
		}
	};
	let onAbort;
	const aborted = new Promise((_resolve, reject) => {
		onAbort = () => reject(abortError(signal, params.label));
		signal.addEventListener("abort", onAbort, { once: true });
	});
	const items = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let collectedBytes = 0;
	let cursor;
	try {
		for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
			assertActive();
			const page = await Promise.race([params.loadPage({
				cursor,
				requestTimeoutMs: timeoutMs,
				signal
			}), aborted]);
			assertActive();
			const measured = boundedJsonUtf8Bytes(page.serializedValue ?? {
				items: page.items,
				nextCursor: page.nextCursor
			}, maxBytes - collectedBytes);
			if (!measured.complete || collectedBytes + measured.bytes > maxBytes) throw new Error(`${params.label} exceeded ${maxBytes} bytes`);
			collectedBytes += measured.bytes;
			for (const item of page.items) {
				const mapped = params.mapItem ? params.mapItem(item) : item;
				if (mapped === void 0) continue;
				if (items.length >= maxItems) throw new Error(`${params.label} exceeded ${maxItems} ${params.itemLabel}`);
				items.push(mapped);
			}
			const nextCursor = page.nextCursor;
			assertActive();
			if (nextCursor === void 0) return items;
			if (seenCursors.has(nextCursor)) throw new Error(`${params.label} returned a repeated pagination cursor`);
			seenCursors.add(nextCursor);
			cursor = nextCursor;
		}
		throw new Error(`${params.label} exceeded ${maxPages} pages`);
	} finally {
		clearTimeout(deadlineTimer);
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region src/agents/mcp-tool-filter.ts
/** Match the documented MCP tool-filter glob syntax: exact text plus `*`. */
function matchesMcpToolFilterPattern(pattern, value) {
	const trimmed = pattern.trim();
	if (!trimmed) return false;
	if (!trimmed.includes("*")) return trimmed === value;
	const parts = trimmed.split("*");
	const first = parts[0] ?? "";
	const last = parts.at(-1) ?? "";
	if (first && !value.startsWith(first)) return false;
	let cursor = first.length;
	const endBound = last ? value.length - last.length : value.length;
	if (last && (!value.endsWith(last) || endBound < cursor)) return false;
	for (const part of parts.slice(1, -1)) {
		if (!part) continue;
		const index = value.indexOf(part, cursor);
		if (index === -1 || index + part.length > endBound) return false;
		cursor = index + part.length;
	}
	return true;
}
/** Normalizes open-world MCP tool filters into the runtime policy shape. */
function normalizeMcpToolFilter(raw) {
	if (!isRecord(raw)) return;
	const include = filterStringEntries(raw.include);
	const exclude = filterStringEntries(raw.exclude);
	if (include.length === 0 && exclude.length === 0) return;
	return {
		...include.length > 0 ? { include } : {},
		...exclude.length > 0 ? { exclude } : {}
	};
}
/** Applies the shared include-then-exclude policy. */
function isMcpToolAllowed(toolFilter, toolName) {
	const matches = (pattern) => matchesMcpToolFilterPattern(pattern, toolName);
	return (!toolFilter?.include?.length || toolFilter.include.some(matches)) && !toolFilter?.exclude?.some(matches);
}
//#endregion
//#region src/agents/mcp-tool-metadata.ts
/** Canonicalizes one server catalog before policy, publication, and call metadata diverge. */
function normalizeMcpToolCatalog(tools, schemaValidator, classify = () => "include") {
	const canonicalNames = tools.map((tool) => tool.name.trim());
	const nameCounts = /* @__PURE__ */ new Map();
	for (const toolName of canonicalNames) if (toolName) nameCounts.set(toolName, (nameCounts.get(toolName) ?? 0) + 1);
	const included = [];
	const deniedTools = [];
	const resultValidators = /* @__PURE__ */ new Map();
	for (const [index, sourceTool] of tools.entries()) {
		const toolName = canonicalNames[index] ?? "";
		if (!toolName || nameCounts.get(toolName) !== 1 || sourceTool.execution?.taskSupport === "required") continue;
		const disposition = classify(toolName);
		if (disposition === "exclude") continue;
		const tool = {
			...sourceTool,
			name: toolName
		};
		if (disposition === "include") {
			included.push(tool);
			if (tool.outputSchema) {
				const validator = schemaValidator.getValidator(tool.outputSchema);
				resultValidators.set(toolName, (result) => {
					if (result.structuredContent === void 0 && result.isError !== true) throw new McpError(ErrorCode.InvalidRequest, `Tool ${toolName} has an output schema but did not return structured content`);
					if (result.structuredContent === void 0) return;
					const validation = validator(result.structuredContent);
					if (!validation.valid) throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validation.errorMessage}`);
				});
			}
		} else deniedTools.push(tool);
	}
	return {
		tools: included,
		metadata: { validatorForCall(toolName) {
			return resultValidators.get(toolName);
		} },
		deniedTools
	};
}
//#endregion
//#region src/agents/mcp-oauth-fetch.ts
function withBearerHeader(request, accessToken) {
	const headers = new Headers(request.headers);
	headers.set("authorization", `Bearer ${accessToken}`);
	return new Request(request, { headers });
}
async function toFetchInit(request) {
	const streamBody = request.body ?? void 0;
	const body = request.keepalive && streamBody ? await request.arrayBuffer() : streamBody;
	return {
		method: request.method,
		headers: request.headers,
		body,
		cache: request.cache,
		credentials: request.credentials,
		integrity: request.integrity,
		keepalive: request.keepalive,
		mode: request.mode,
		redirect: request.redirect,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy,
		signal: request.signal,
		...streamBody && !request.keepalive ? { duplex: "half" } : {}
	};
}
async function dispatchRequest(fetchFn, request) {
	return await fetchFn(request.url, await toFetchInit(request));
}
/**
* Own native OAuth retries above the MCP SDK transport. The SDK otherwise runs
* refresh outside OpenClaw's cross-process OAuth lease on every 401/403.
*/
function withMcpOAuthBearer(params) {
	const resourceOrigin = new URL(params.identity.serverUrl).origin;
	return async (input, init) => {
		const source = input instanceof Request ? input.clone() : input;
		const request = new Request(source, init);
		if (new URL(request.url).origin !== resourceOrigin) return await dispatchRequest(params.fetchFn, request);
		const accessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			allowMissingToken: true,
			signal: request.signal
		});
		const retryRequest = request.clone();
		const firstRequest = accessToken ? withBearerHeader(request, accessToken) : request;
		const response = await dispatchRequest(params.fetchFn, firstRequest);
		const challenge = extractWWWAuthenticateParams(response);
		const insufficientScope = response.status === 403 && challenge.error === "insufficient_scope";
		if (!(response.status === 401 || insufficientScope)) return response;
		await response.body?.cancel().catch(() => void 0);
		const nextAccessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			authorizationChallenge: true,
			interactiveAuthorizationRequired: insufficientScope,
			rejectedAccessToken: accessToken,
			resourceMetadataUrl: challenge.resourceMetadataUrl,
			signal: request.signal,
			scope: challenge.scope
		});
		const authorizedRetry = withBearerHeader(retryRequest, nextAccessToken);
		const retryResponse = await dispatchRequest(params.fetchFn, authorizedRetry);
		const retryChallenge = extractWWWAuthenticateParams(retryResponse);
		const retryInsufficientScope = retryResponse.status === 403 && retryChallenge.error === "insufficient_scope";
		if (retryResponse.status === 401 || retryInsufficientScope) {
			const rejectedAccessToken = nextAccessToken;
			await recordMcpOAuthAuthorizationRequired({
				identity: params.identity,
				rejectedAccessToken,
				resourceMetadataUrl: retryChallenge.resourceMetadataUrl ?? challenge.resourceMetadataUrl,
				scope: retryChallenge.scope ?? challenge.scope,
				signal: request.signal
			});
		}
		return retryResponse;
	};
}
//#endregion
//#region src/agents/mcp-transport.ts
/**
* MCP client transport factory.
*
* This module turns normalized MCP server config into stdio, SSE, or
* streamable-HTTP SDK transports with OpenClaw auth, redirect, and logging rules.
*/
const MAX_MCP_STDERR_LINE_BYTES = 8 * 1024;
function attachStderrLogging(serverName, transport) {
	const stderr = transport.stderr;
	if (!stderr) return;
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let truncated = false;
	let progressTimer;
	const emit = (text) => {
		const tail = truncateUtf8Suffix(text, MAX_MCP_STDERR_LINE_BYTES);
		const message = `${truncated || tail !== text ? "[stderr line truncated] " : ""}${tail}`.trim();
		truncated = false;
		if (message) logDebug(`bundle-mcp:${serverName}: ${message}`);
	};
	const flushProgress = () => {
		progressTimer = void 0;
		const text = pending;
		pending = "";
		emit(text);
	};
	const onData = (chunk) => {
		const decoded = decoder.write(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
		const lines = (pending + decoded).split(/[\r\n]/);
		pending = lines.pop() ?? "";
		for (const line of lines) emit(line);
		const tail = truncateUtf8Suffix(pending, MAX_MCP_STDERR_LINE_BYTES);
		truncated ||= tail !== pending;
		pending = tail;
		if (pending && !progressTimer) {
			progressTimer = setTimeout(flushProgress, 250);
			progressTimer.unref();
		} else if (!pending) {
			clearTimeout(progressTimer);
			progressTimer = void 0;
		}
	};
	const finalize = () => {
		stderr.off("data", onData);
		stderr.off("end", finalize);
		stderr.off("close", finalize);
		clearTimeout(progressTimer);
		pending += decoder.end();
		flushProgress();
	};
	stderr.on("data", onData);
	stderr.on("end", finalize);
	stderr.on("close", finalize);
	return finalize;
}
function buildSseEventSourceFetch(headers, baseFetch) {
	return (url, init) => {
		const mergedHeaders = {};
		for (const [key, value] of new Headers(init?.headers)) mergedHeaders[key.toLowerCase()] = value;
		for (const [key, value] of Object.entries(headers)) mergedHeaders[key.toLowerCase()] = value;
		return baseFetch(url, {
			...init,
			headers: mergedHeaders
		});
	};
}
/** Resolves a configured MCP server into a live SDK transport instance. */
function resolveMcpTransport(serverName, rawServer, options) {
	const resolved = resolveMcpTransportConfig(serverName, rawServer);
	if (!resolved) return null;
	if (resolved.kind === "stdio") {
		const transport = new OpenClawStdioClientTransport({
			command: resolved.command,
			args: resolved.args,
			env: resolved.env,
			cwd: resolved.cwd,
			prepareDataDir: options?.prepareDataDir,
			stderr: "pipe"
		});
		return {
			transport,
			description: resolved.description,
			transportType: "stdio",
			connectionTimeoutMs: resolved.connectionTimeoutMs,
			requestTimeoutMs: resolved.requestTimeoutMs,
			supportsParallelToolCalls: resolved.supportsParallelToolCalls,
			detachStderr: attachStderrLogging(serverName, transport)
		};
	}
	const authProfileId = resolveMcpAuthProfileId(rawServer);
	const requesterScope = options?.requesterScope;
	let oauthIdentity;
	if (resolved.oauth?.identity === "per-requester") {
		if (!requesterScope) return null;
		oauthIdentity = requesterMcpOAuthIdentity(serverName, resolved.url, requesterScope);
	} else oauthIdentity = operatorMcpOAuthIdentity(serverName, resolved.url);
	const baseFetch = buildMcpHttpFetch({
		sslVerify: resolved.sslVerify,
		clientCert: resolved.clientCert,
		clientKey: resolved.clientKey,
		resourceUrl: resolved.url
	});
	const headers = resolved.auth === "oauth" || authProfileId ? withoutMcpAuthorizationHeader(resolved.headers) : resolved.headers;
	const resourceFetch = withSameOriginMcpHttpHeaders({
		fetchFn: baseFetch,
		headers,
		resourceUrl: resolved.url
	});
	const httpFetch = authProfileId ? withMcpAuthProfileBearer({
		fetchFn: baseFetch,
		serverName,
		resourceUrl: resolved.url,
		headers,
		authProfileId,
		cfg: options?.cfg,
		agentDir: options?.agentDir
	}) : resolved.auth === "oauth" ? withMcpOAuthBearer({
		fetchFn: resourceFetch,
		authFetchFn: resourceFetch,
		identity: oauthIdentity,
		config: resolved.oauth
	}) : baseFetch;
	if (resolved.transportType === "streamable-http") return {
		transport: new OpenClawStreamableHTTPClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !headers ? void 0 : { headers },
			fetch: httpFetch
		}),
		description: resolved.description,
		transportType: "streamable-http",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
	const sseHeaders = { ...headers };
	const hasHeaders = Object.keys(sseHeaders).length > 0;
	return {
		transport: new OpenClawSSEClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !hasHeaders ? void 0 : { headers: sseHeaders },
			fetch: httpFetch,
			eventSourceInit: { fetch: buildSseEventSourceFetch(resolved.auth === "oauth" ? {} : sseHeaders, httpFetch) }
		}),
		description: resolved.description,
		transportType: "sse",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
}
//#endregion
export { collectMcpPaginatedItems as a, redactMcpDiagnosticError as c, disposeMcpClient as d, isStatefulMcpHttpSessionExpired as f, normalizeMcpToolFilter as i, McpClientConnectTimeoutError as l, normalizeMcpToolCatalog as n, sanitizeMcpMetadataText as o, isMcpToolAllowed as r, createMcpJsonSchemaValidator as s, resolveMcpTransport as t, connectMcpClient as u };
