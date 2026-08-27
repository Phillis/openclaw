import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { n as signalProcessTree, t as killProcessTree } from "./kill-tree-B-nnBWyI.js";
import { r as normalizeJsonSchemaForTypeBox } from "./json-schema-DFcw9gk-.js";
import { n as findJsonSchemaShapeError } from "./schema-validator-C_mQvoOg.js";
import { t as mergeProcessEnv } from "./process-env-CW4bkwqq.js";
import { t as logDebug } from "./logger-frf2HPJn.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-BZJo62Yo.js";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import { m as requesterMcpOAuthIdentity, p as operatorMcpOAuthIdentity } from "./mcp-oauth-store-DaPLeF2u.js";
import { c as recordMcpOAuthAuthorizationRequired, d as buildMcpHttpFetch, f as withSameOriginMcpHttpHeaders, l as resolveMcpOAuthAccessToken, p as withoutMcpAuthorizationHeader } from "./mcp-oauth-FmpbBugK.js";
import { i as withMcpAuthProfileBearer, n as resolveMcpAuthProfileId } from "./mcp-auth-profile-DZiFUyJs.js";
import process from "node:process";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { Compile } from "typebox/compile";
import { PassThrough } from "node:stream";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { extractWWWAuthenticateParams } from "@modelcontextprotocol/sdk/client/auth.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ReadBuffer, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
//#region src/agents/agent-bundle-mcp-filter.ts
/** Match the documented MCP tool-filter glob syntax: exact text plus `*`. */
function matchesMcpToolFilterPattern(pattern, value) {
	const trimmed = pattern.trim();
	if (!trimmed) return false;
	if (!trimmed.includes("*")) return trimmed === value;
	const parts = trimmed.split("*");
	const first = parts[0] ?? "";
	const last = parts.at(-1) ?? "";
	let cursor = 0;
	if (first) {
		if (!value.startsWith(first)) return false;
		cursor = first.length;
	}
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
/** Collects one complete MCP list under a single bounded lifecycle. */
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
			child.on("error", (error) => {
				reject(error);
				this.onerror?.(error);
			});
			child.on("spawn", () => resolve());
			child.on("close", () => {
				this.process = void 0;
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
		this.process = void 0;
		this.closingProcess = processToClose;
		if (processToClose) this.closingProcess = processToClose;
		if (processToClose) {
			const closePromise = new Promise((resolve) => {
				processToClose.once("close", () => resolve());
			});
			try {
				processToClose.stdin?.end();
			} catch {}
			await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
			if (processToClose.exitCode === null && processToClose.pid) {
				killProcessTree(processToClose.pid, { detached: true });
				await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
				if (processToClose.exitCode === null && processToClose.pid) {
					signalProcessTree(processToClose.pid, "SIGKILL", { detached: true });
					await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
				}
			}
		}
		if (this.closingProcess === processToClose) this.closingProcess = void 0;
		this.readBuffer.clear();
	}
	async forceClose() {
		const processToClose = this.process ?? this.closingProcess;
		this.process = void 0;
		if (processToClose?.pid && processToClose.exitCode === null) {
			const closePromise = new Promise((resolve) => {
				processToClose.once("close", () => resolve());
			});
			signalProcessTree(processToClose.pid, "SIGKILL", { detached: true });
			await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
		}
		if (this.closingProcess === processToClose) this.closingProcess = void 0;
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
function attachStderrLogging(serverName, transport) {
	const stderr = transport.stderr;
	if (!stderr || typeof stderr.on !== "function") return;
	const onData = (chunk) => {
		const message = normalizeOptionalString(typeof chunk === "string" ? chunk : String(chunk)) ?? "";
		if (!message) return;
		for (const line of message.split(/\r?\n/)) {
			const trimmed = line.trim();
			if (trimmed) logDebug(`bundle-mcp:${serverName}: ${trimmed}`);
		}
	};
	stderr.on("data", onData);
	return () => {
		if (typeof stderr.off === "function") stderr.off("data", onData);
		else if (typeof stderr.removeListener === "function") stderr.removeListener("data", onData);
	};
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
		transport: new StreamableHTTPClientTransport(new URL(resolved.url), {
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
		transport: new SSEClientTransport(new URL(resolved.url), {
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
export { createMcpJsonSchemaValidator as a, sanitizeMcpMetadataText as i, OpenClawStdioClientTransport as n, matchesMcpToolFilterPattern as o, collectMcpPaginatedItems as r, resolveMcpTransport as t };
