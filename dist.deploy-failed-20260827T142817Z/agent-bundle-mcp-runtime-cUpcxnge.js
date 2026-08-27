import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as redactToolPayloadText } from "./redact-Cl7lwBnl.js";
import { i as sanitizeServerName, t as assignSafeServerNames } from "./agent-bundle-mcp-names-Dfh0X01f.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { _ as mergeMcpToolCatalogs, d as createSessionMcpRuntimeManager, f as setDefaultCreateSessionMcpRuntime, n as disposeAllSessionMcpRuntimes, o as getSessionMcpRuntimeManagerForTesting } from "./agent-bundle-mcp-manager-api-Qkb7NsgF.js";
import { a as createMcpJsonSchemaValidator, i as sanitizeMcpMetadataText, n as OpenClawStdioClientTransport, o as matchesMcpToolFilterPattern, r as collectMcpPaginatedItems, t as resolveMcpTransport } from "./mcp-transport-DgqCi3RO.js";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-ClX-LS-9.js";
import { t as applyMcpConnectionOverride } from "./mcp-connection-resolver-CEb7peDa.js";
import { i as resolveSessionMcpRuntimeIdleTtlMs } from "./agent-bundle-mcp-runtime-shared-DkwjMxYn.js";
import { r as resolveMcpCodexToolApprovalMode, t as normalizeMcpCodexToolAnnotations } from "./mcp-codex-tool-approval-qXI1z_QK.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport, StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
//#region src/agents/agent-bundle-mcp-runtime.ts
/** Session-scoped MCP runtime catalog loader and transport lifecycle. */
const MCP_APPS_CLIENT_EXTENSION = "io.modelcontextprotocol/ui";
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
const BUNDLE_MCP_FAILURE_THRESHOLD = 3;
const BUNDLE_MCP_FAILURE_COOLDOWN_MS = 6e4;
const BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS = 5e3;
const BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS = 1500;
const BUNDLE_MCP_DISPOSE_TIMEOUT_MS = 5e3;
const BUNDLE_MCP_CATALOG_CONNECT_CONCURRENCY = 6;
const BUNDLE_MCP_MAX_LIST_PAGES = 128;
const BUNDLE_MCP_MAX_LIST_ITEMS = 16384;
const BUNDLE_MCP_MAX_LIST_BYTES = 10 * 1024 * 1024;
let bundleMcpCatalogListTimeoutMs;
const BUNDLE_MCP_TEST_STATE_KEY = Symbol.for("openclaw.bundleMcpTestState");
function getBundleMcpTestState() {
	const globalStore = globalThis;
	const existing = globalStore[BUNDLE_MCP_TEST_STATE_KEY];
	if (existing) return existing;
	const state = {};
	globalStore[BUNDLE_MCP_TEST_STATE_KEY] = state;
	return state;
}
async function connectWithTimeout(serverName, client, transport, timeoutMs) {
	const abortController = new AbortController();
	let timeout;
	let deadlineExpired = false;
	try {
		await Promise.race([client.connect(transport, {
			signal: abortController.signal,
			timeout: timeoutMs,
			maxTotalTimeout: timeoutMs
		}), new Promise((_, reject) => {
			timeout = setTimeout(() => {
				deadlineExpired = true;
				abortController.abort();
				reject(/* @__PURE__ */ new Error("MCP connect deadline expired"));
			}, timeoutMs);
		})]);
	} catch (error) {
		if (deadlineExpired || isRecord(error) && error.code === ErrorCode.RequestTimeout) {
			if (transport instanceof OpenClawStdioClientTransport) await transport.forceClose();
			await settleWithin(client.close(), Math.min(timeoutMs, 1e3));
			throw new Error(`MCP server "${serverName}" timed out: did not complete initialize within ${timeoutMs / 1e3}s`, { cause: error });
		}
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function redactMcpDiagnosticError(error) {
	return redactToolPayloadText(redactSensitiveUrlLikeString(String(error)));
}
async function listAllTools(client, timeoutMs, signal) {
	return await collectMcpPaginatedItems({
		label: "MCP tool listing",
		itemLabel: "tools",
		timeoutMs,
		maxPages: BUNDLE_MCP_MAX_LIST_PAGES,
		maxItems: BUNDLE_MCP_MAX_LIST_ITEMS,
		maxBytes: BUNDLE_MCP_MAX_LIST_BYTES,
		signal,
		loadPage: async ({ cursor, requestTimeoutMs, signal: requestSignal }) => {
			const page = await client.listTools(cursor === void 0 ? void 0 : { cursor }, {
				timeout: requestTimeoutMs,
				maxTotalTimeout: requestTimeoutMs,
				signal: requestSignal
			});
			return {
				items: page.tools,
				nextCursor: page.nextCursor,
				serializedValue: page
			};
		}
	});
}
function isMcpMethodNotFoundError(error) {
	if (isRecord(error) && error.code === ErrorCode.MethodNotFound) return true;
	const message = String(error);
	return message.includes("-32601") || /\b(?:method not found|unknown method)\b/i.test(message);
}
async function listAllToolsBestEffort(params) {
	try {
		return await listAllTools(params.client, params.timeoutMs, params.signal);
	} catch (error) {
		if (params.suppressUnsupported && isMcpMethodNotFoundError(error)) return [];
		throw error;
	}
}
function hasConfiguredMcpRequestTimeout(rawServer) {
	if (!rawServer || typeof rawServer !== "object") return false;
	const record = rawServer;
	for (const key of ["requestTimeoutMs", "timeout"]) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return true;
	}
	return false;
}
function getCatalogListTimeoutMs(rawServer, requestTimeoutMs) {
	if (bundleMcpCatalogListTimeoutMs !== void 0) return bundleMcpCatalogListTimeoutMs;
	return hasConfiguredMcpRequestTimeout(rawServer) ? requestTimeoutMs : BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS;
}
function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs) {
	bundleMcpCatalogListTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function setBundleMcpDisposeTimeoutMsForTest(timeoutMs) {
	getBundleMcpTestState().disposeTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function buildMcpClientCapabilities(mcpAppsEnabled) {
	return mcpAppsEnabled ? { extensions: { [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] } } } : {};
}
function buildMcpClientOptions(mcpAppsEnabled) {
	return { capabilities: buildMcpClientCapabilities(mcpAppsEnabled) };
}
function normalizeStringList(value) {
	if (!Array.isArray(value)) return;
	const entries = value.filter((entry) => typeof entry === "string");
	return entries.length > 0 ? entries : void 0;
}
function normalizeToolUiVisibility(value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => entry === "app" || entry === "model");
	return [...new Set(normalized)].toSorted();
}
function getMcpToolSelection(rawServer) {
	if (!isRecord(rawServer) || !isRecord(rawServer.toolFilter)) return {};
	return {
		include: normalizeStringList(rawServer.toolFilter.include),
		exclude: normalizeStringList(rawServer.toolFilter.exclude)
	};
}
function shouldExposeMcpTool(selection, toolName) {
	const include = selection.include ?? [];
	const exclude = selection.exclude ?? [];
	if (include.length > 0 && !include.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName))) return false;
	return !exclude.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName));
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
}
async function settleWithin(promise, timeoutMs) {
	let timer;
	return await Promise.race([promise.then(() => true, () => true), new Promise((resolve) => {
		timer = setTimeout(() => {
			resolve();
		}, timeoutMs);
		timer.unref?.();
	}).then(() => false)]).finally(() => {
		if (timer) clearTimeout(timer);
	});
}
async function disposeSession(session) {
	session.detachStderr?.();
	const timeoutMs = getBundleMcpTestState().disposeTimeoutMs ?? BUNDLE_MCP_DISPOSE_TIMEOUT_MS;
	if (!await settleWithin((async () => {
		if (session.transportType === "streamable-http") await session.transport.terminateSession().catch(() => {});
		await session.transport.close().catch(() => {});
		await session.client.close().catch(() => {});
	})(), timeoutMs)) {
		const transportClose = session.transport instanceof OpenClawStdioClientTransport ? session.transport.forceClose() : session.transport.close();
		await settleWithin(Promise.allSettled([transportClose, session.client.close()]), timeoutMs);
	}
}
function createDisposedError(sessionId) {
	return /* @__PURE__ */ new Error(`bundle-mcp runtime disposed for session ${sessionId}`);
}
function createSessionMcpRuntime(params) {
	const { loaded, fingerprint: computedFingerprint } = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		logDiagnostics: true,
		manifestRegistry: params.manifestRegistry,
		includeServerNames: params.includeServerNames,
		excludeServerNames: params.excludeServerNames,
		redactConnectionServerNames: params.redactConnectionServerNames,
		safeServerNamesByServer: params.safeServerNamesByServer,
		toolOverrides: params.toolOverrides
	});
	const configFingerprint = params.configFingerprint ?? computedFingerprint;
	const mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const createdAt = Date.now();
	let lastUsedAt = createdAt;
	let activeLeases = 0;
	let disposed = false;
	const lifecycleAbortController = new AbortController();
	let catalog = null;
	let catalogRetryAfterMs;
	let catalogInFlight;
	let catalogInvalidationGeneration = 0;
	const invalidateCatalog = () => {
		catalogInvalidationGeneration += 1;
		catalog = null;
		catalogRetryAfterMs = void 0;
		catalogInFlight = void 0;
	};
	const scheduleCatalogServerRetry = (serverName, message) => {
		const currentCatalog = catalog;
		const server = currentCatalog?.servers[serverName];
		const existing = currentCatalog?.diagnostics?.find((diagnostic) => diagnostic.serverName === serverName);
		if (!currentCatalog) {
			invalidateCatalog();
			return;
		}
		let diagnostic;
		if (existing) diagnostic = {
			...existing,
			message
		};
		else if (server) diagnostic = {
			serverName,
			safeServerName: server.safeServerName ?? serverName,
			launchSummary: server.launchSummary,
			message
		};
		else {
			invalidateCatalog();
			return;
		}
		catalogInvalidationGeneration += 1;
		catalog = {
			...currentCatalog,
			diagnostics: [...currentCatalog.diagnostics?.filter((entry) => entry.serverName !== serverName) ?? [], diagnostic].toSorted((left, right) => left.serverName.localeCompare(right.serverName))
		};
		catalogRetryAfterMs = Date.now();
		catalogInFlight = void 0;
	};
	const catalogRetryIsDue = () => catalogRetryAfterMs !== void 0 && Date.now() >= catalogRetryAfterMs;
	const sessions = /* @__PURE__ */ new Map();
	const serverBackoff = /* @__PURE__ */ new Map();
	const recordServerToolFailure = (serverName, session, nowMs) => {
		if (sessions.get(serverName) !== session || session.retiring) return;
		const previous = serverBackoff.get(serverName);
		const failures = (previous?.session === session ? previous.failures : 0) + 1;
		const nextBackoff = {
			session,
			failures
		};
		if (failures >= BUNDLE_MCP_FAILURE_THRESHOLD) nextBackoff.retryAfterMs = nowMs + BUNDLE_MCP_FAILURE_COOLDOWN_MS;
		serverBackoff.set(serverName, nextBackoff);
		return failures;
	};
	const failIfDisposed = () => {
		if (disposed) throw createDisposedError(params.sessionId);
	};
	const requireConnectedSession = (serverName) => {
		const session = sessions.get(serverName);
		if (!session || !session.connected) throw new Error(session?.disconnectReason ? `bundle-mcp server "${serverName}" is disconnected: ${session.disconnectReason}` : `bundle-mcp server "${serverName}" is not connected`);
		return session;
	};
	const ensureSessionConnected = async (session, connectionTimeoutMs) => {
		if (session.retiring) throw new Error(`bundle-mcp server "${session.serverName}" is retiring`);
		if (session.connected) return;
		session.connectPromise ??= connectWithTimeout(session.serverName, session.client, session.transport, connectionTimeoutMs).then(() => {
			session.connected = true;
		}).finally(() => {
			session.connectPromise = void 0;
		});
		await session.connectPromise;
	};
	const retireSessionIfCurrent = async (serverName, session) => {
		if (sessions.get(serverName) !== session) return false;
		session.retiring = true;
		sessions.delete(serverName);
		await disposeSession(session);
		return true;
	};
	const localRequestTimeouts = /* @__PURE__ */ new WeakSet();
	const runMcpRequest = async (session, request, parentSignal) => {
		const abortController = new AbortController();
		const timeoutError = new McpError(ErrorCode.RequestTimeout, "Request timed out", { timeout: session.requestTimeoutMs });
		const timeout = setTimeout(() => {
			localRequestTimeouts.add(timeoutError);
			abortController.abort(timeoutError);
		}, session.requestTimeoutMs);
		timeout.unref?.();
		try {
			const signal = parentSignal ? AbortSignal.any([parentSignal, abortController.signal]) : abortController.signal;
			signal.throwIfAborted();
			return await request(signal);
		} finally {
			clearTimeout(timeout);
		}
	};
	const runGuardedServerRequest = async (serverName, session, request, options) => {
		const tracksFailureBackoff = options?.failureBackoff !== "ignore";
		const nowMs = Date.now();
		const backoff = serverBackoff.get(serverName);
		if (tracksFailureBackoff && backoff?.session === session && backoff.retryAfterMs && nowMs < backoff.retryAfterMs) throw new Error(`bundle-mcp server "${serverName}" is paused after repeated tool failures; retry after ${new Date(backoff.retryAfterMs).toISOString()}`);
		if (backoff && backoff.session !== session) serverBackoff.delete(serverName);
		try {
			const result = await request();
			if (tracksFailureBackoff && serverBackoff.get(serverName)?.session === session) serverBackoff.delete(serverName);
			return result;
		} catch (error) {
			const sessionExpired = session.transportType === "streamable-http" && session.transport instanceof StreamableHTTPClientTransport && session.transport.sessionId !== void 0 && error instanceof StreamableHTTPError && error.code === 404;
			let recycleReason;
			if (sessionExpired) recycleReason = "expired HTTP session";
			else if (tracksFailureBackoff) {
				const failures = recordServerToolFailure(serverName, session, nowMs);
				if (error !== null && typeof error === "object" && localRequestTimeouts.has(error) && failures && failures >= BUNDLE_MCP_FAILURE_THRESHOLD) recycleReason = "repeated request timeouts";
			}
			if (recycleReason) {
				serverBackoff.delete(serverName);
				scheduleCatalogServerRetry(serverName, recycleReason);
				const timedOut = recycleReason === "repeated request timeouts";
				logWarn(`bundle-mcp: recycling server "${serverName}" after ${timedOut ? "repeated timeouts" : "an expired HTTP session"}`);
				retireSessionIfCurrent(serverName, session).catch((retireError) => {
					logWarn(`bundle-mcp: failed to retire ${timedOut ? "timed-out" : "expired-session"} server "${serverName}": ${redactMcpDiagnosticError(retireError)}`);
				});
			}
			throw error;
		}
	};
	const loadCatalog = async (retryBaseCatalog) => {
		failIfDisposed();
		if (catalogInFlight) return catalogInFlight;
		const retryServerNames = retryBaseCatalog ? new Set(retryBaseCatalog.diagnostics?.map((diagnostic) => diagnostic.serverName)) : void 0;
		const catalogGeneration = catalogInvalidationGeneration;
		const inFlight = (async () => {
			if (Object.keys(loaded.mcpServers).length === 0) return {
				version: 1,
				generatedAt: Date.now(),
				servers: {},
				tools: []
			};
			const servers = Object.fromEntries(Object.entries(retryBaseCatalog?.servers ?? {}).filter(([serverName]) => !retryServerNames?.has(serverName)));
			const tools = (retryBaseCatalog?.tools ?? []).filter((tool) => !retryServerNames?.has(tool.serverName));
			const sessionDeniedTools = (retryBaseCatalog?.sessionDeniedTools ?? []).filter((tool) => !retryServerNames?.has(tool.serverName));
			const diagnostics = [];
			const safeServerNamesByServer = params.safeServerNamesByServer ?? assignSafeServerNames(Object.keys(loaded.mcpServers));
			const usedServerNames = new Set([...safeServerNamesByServer.values()].map((name) => normalizeLowercaseStringOrEmpty(name)));
			try {
				const preparedEntries = [];
				for (const [serverName, rawServer] of Object.entries(loaded.mcpServers)) {
					failIfDisposed();
					if (retryServerNames && !retryServerNames.has(serverName)) continue;
					const override = params.connectionOverrides?.get(serverName);
					const transportSource = override ? applyMcpConnectionOverride(rawServer, override) : rawServer;
					const dataDirOwnership = Object.hasOwn(loaded.prepareDataDirsByServer ?? {}, serverName) ? loaded.prepareDataDirsByServer?.[serverName] : void 0;
					const resolved = resolveMcpTransport(serverName, transportSource, {
						cfg: params.cfg,
						agentDir: params.agentDir,
						prepareDataDir: dataDirOwnership?.dataDir,
						requesterScope: params.requesterScope
					});
					if (!resolved) continue;
					const safeServerName = safeServerNamesByServer.get(serverName) ?? sanitizeServerName(serverName, usedServerNames);
					if (safeServerName !== serverName) logWarn(`bundle-mcp: server key "${serverName}" registered as "${safeServerName}" for provider-safe tool names.`);
					const launchDescription = override ? `${serverName}: requester-scoped connection` : resolved.description;
					preparedEntries.push({
						serverName,
						rawServer,
						resolved,
						safeServerName,
						launchDescription
					});
				}
				const { results, firstError, hasError } = await runTasksWithConcurrency({
					tasks: preparedEntries.map(({ serverName, rawServer, resolved, safeServerName, launchDescription }) => async () => {
						failIfDisposed();
						let session = sessions.get(serverName);
						while (session && !session.retiring && !session.connected && !session.connectPromise) {
							await retireSessionIfCurrent(serverName, session);
							session = sessions.get(serverName);
						}
						if (session?.retiring) session = void 0;
						const reusedSession = Boolean(session);
						if (!session) {
							const client = new Client({
								name: "openclaw-bundle-mcp",
								version: "0.0.0"
							}, {
								...buildMcpClientOptions(mcpAppsEnabled),
								jsonSchemaValidator: createMcpJsonSchemaValidator(),
								listChanged: { tools: {
									autoRefresh: false,
									debounceMs: 0,
									onChanged: (error) => {
										if (error) logWarn(`bundle-mcp: failed to refresh changed tool list for server "${serverName}": ${redactMcpDiagnosticError(error)}`);
										invalidateCatalog();
									}
								} }
							});
							const createdSession = {
								serverName,
								client,
								transport: resolved.transport,
								transportType: resolved.transportType,
								requestTimeoutMs: resolved.requestTimeoutMs,
								supportsParallelToolCalls: resolved.supportsParallelToolCalls,
								connected: false,
								retiring: false,
								catalogUseCount: 0,
								sharedAcrossCatalogGenerations: false,
								detachStderr: resolved.detachStderr
							};
							client.onclose = () => {
								const wasConnected = createdSession.connected;
								createdSession.connected = false;
								createdSession.disconnectReason = "mcp transport closed";
								if (wasConnected && !disposed && !createdSession.retiring && sessions.get(serverName) === createdSession) {
									scheduleCatalogServerRetry(serverName, "mcp transport closed");
									logWarn(`bundle-mcp: server "${serverName}" closed; next request reconnects`);
								}
							};
							session = createdSession;
							sessions.set(serverName, session);
						}
						if (session.catalogUseCount === 0) session.sharedAcrossCatalogGenerations = false;
						if (reusedSession && session.catalogUseCount > 0) session.sharedAcrossCatalogGenerations = true;
						session.catalogUseCount += 1;
						try {
							failIfDisposed();
							await ensureSessionConnected(session, resolved.connectionTimeoutMs);
							failIfDisposed();
							const capabilities = summarizeServerCapabilities(session.client.getServerCapabilities());
							const listedTools = await listAllToolsBestEffort({
								client: session.client,
								timeoutMs: getCatalogListTimeoutMs(rawServer, resolved.requestTimeoutMs),
								signal: lifecycleAbortController.signal,
								suppressUnsupported: Boolean(!capabilities.tools && (capabilities.resources || capabilities.prompts))
							});
							failIfDisposed();
							const selection = getMcpToolSelection(rawServer);
							const denialMap = params.toolOverrides?.mcpToolsDeny;
							const deniedToolNames = new Set(denialMap && Object.hasOwn(denialMap, serverName) ? denialMap[serverName] : []);
							const policyEligibleTools = listedTools.filter((tool) => shouldExposeMcpTool(selection, tool.name.trim()));
							const exposedTools = policyEligibleTools.filter((tool) => {
								const toolName = tool.name.trim();
								return !deniedToolNames.has(toolName);
							});
							const serverEntry = {
								serverName,
								safeServerName,
								launchSummary: launchDescription,
								toolCount: exposedTools.length,
								requestTimeoutMs: resolved.requestTimeoutMs,
								supportsParallelToolCalls: resolved.supportsParallelToolCalls,
								...capabilities.resources ? { resources: capabilities.resources } : {},
								...capabilities.prompts ? { prompts: capabilities.prompts } : {},
								...capabilities.tools ? { tools: {
									...capabilities.tools,
									...exposedTools.length !== listedTools.length ? { filteredCount: listedTools.length - exposedTools.length } : {}
								} } : {},
								...selection.include || selection.exclude ? { toolFilter: {
									...selection.include ? { include: [...selection.include] } : {},
									...selection.exclude ? { exclude: [...selection.exclude] } : {}
								} } : {},
								...deniedToolNames.size > 0 ? { deniedToolNames: [...deniedToolNames].toSorted() } : {},
								codexApprovalMode: resolveMcpCodexToolApprovalMode(serverName, rawServer)
							};
							const toolEntries = [];
							for (const tool of policyEligibleTools) {
								const toolName = tool.name.trim();
								if (!toolName) continue;
								const { _meta: metadata } = tool;
								const uiMeta = metadata?.ui && typeof metadata.ui === "object" && !Array.isArray(metadata.ui) ? metadata.ui : void 0;
								const rawResourceUri = uiMeta?.resourceUri ?? metadata?.["ui/resourceUri"];
								const uiResourceUri = typeof rawResourceUri === "string" && rawResourceUri.startsWith("ui://") ? rawResourceUri : void 0;
								const uiVisibility = normalizeToolUiVisibility(uiMeta?.visibility);
								toolEntries.push({
									serverName,
									safeServerName,
									toolName,
									title: tool.title,
									description: sanitizeMcpMetadataText(tool.description),
									inputSchema: tool.inputSchema,
									fallbackDescription: `Provided by bundle MCP server "${serverName}" (${launchDescription}).`,
									...uiResourceUri ? { uiResourceUri } : {},
									...uiVisibility ? { uiVisibility } : {},
									...deniedToolNames.has(toolName) ? { deniedBySession: true } : {},
									codexAnnotations: normalizeMcpCodexToolAnnotations(tool.annotations)
								});
							}
							return {
								serverName,
								serverEntry,
								toolEntries,
								diagnostics: []
							};
						} catch (error) {
							const message = redactMcpDiagnosticError(error);
							if (!disposed) logWarn(`bundle-mcp: failed to ${reusedSession ? "refresh" : "start"} server "${serverName}" (${launchDescription}): ${message}`);
							const diags = [{
								serverName,
								safeServerName,
								launchSummary: launchDescription,
								message
							}];
							const sharedWithNewerGeneration = session.sharedAcrossCatalogGenerations || session.catalogUseCount > 1;
							if (!session.connected) await retireSessionIfCurrent(serverName, session);
							else if (!reusedSession && !sharedWithNewerGeneration) await retireSessionIfCurrent(serverName, session);
							failIfDisposed();
							return {
								serverName,
								serverEntry: null,
								toolEntries: [],
								diagnostics: diags
							};
						} finally {
							session.catalogUseCount -= 1;
							if (session.catalogUseCount === 0) session.sharedAcrossCatalogGenerations = false;
						}
					}),
					limit: BUNDLE_MCP_CATALOG_CONNECT_CONCURRENCY,
					errorMode: "continue"
				});
				if (hasError) throw firstError;
				for (const result of results) {
					if (!result) continue;
					const { serverEntry, toolEntries, diagnostics: serverDiags } = result;
					if (serverEntry) servers[result.serverName] = serverEntry;
					for (const tool of toolEntries) if (tool.deniedBySession) sessionDeniedTools.push(tool);
					else tools.push(tool);
					diagnostics.push(...serverDiags);
				}
				failIfDisposed();
				return {
					version: 1,
					generatedAt: Date.now(),
					servers,
					tools,
					...sessionDeniedTools.length > 0 ? { sessionDeniedTools } : {},
					...diagnostics.length > 0 ? { diagnostics } : {}
				};
			} catch (error) {
				await Promise.allSettled(Array.from(sessions.values(), (session) => disposeSession(session)));
				sessions.clear();
				throw error;
			}
		})();
		catalogInFlight = inFlight;
		try {
			const nextCatalog = await inFlight;
			failIfDisposed();
			if (catalogInvalidationGeneration === catalogGeneration) {
				catalog = nextCatalog;
				catalogRetryAfterMs = nextCatalog.diagnostics?.length ? Date.now() + BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS : void 0;
			}
			return nextCatalog;
		} finally {
			if (catalogInFlight === inFlight) catalogInFlight = void 0;
		}
	};
	const getCatalog = async () => {
		failIfDisposed();
		if (catalog && !catalogRetryIsDue()) return catalog;
		if (!catalog) return loadCatalog();
		const staleCatalog = catalog;
		catalogRetryAfterMs = void 0;
		loadCatalog(staleCatalog).catch(() => {
			if (!disposed && catalog === staleCatalog && catalogRetryAfterMs === void 0) catalogRetryAfterMs = Date.now() + BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS;
		});
		return staleCatalog;
	};
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		configFingerprint,
		...params.requesterScope ? { requesterScope: params.requesterScope } : {},
		...params.requesterConnect ? { requesterConnect: params.requesterConnect } : {},
		isRequesterScopedServer: () => params.requesterScope !== void 0,
		mcpAppsEnabled,
		createdAt,
		get lastUsedAt() {
			return lastUsedAt;
		},
		get activeLeases() {
			return activeLeases;
		},
		acquireLease() {
			activeLeases += 1;
			let released = false;
			return () => {
				if (released) return;
				released = true;
				activeLeases = Math.max(0, activeLeases - 1);
			};
		},
		getCatalog,
		/** Synchronous catalog snapshot only; must not connect transports or issue tools/list. */
		peekCatalog() {
			return catalog;
		},
		/** Session-owned timeout that survives catalog invalidation. */
		getServerRequestTimeoutMs(serverName) {
			return sessions.get(serverName)?.requestTimeoutMs;
		},
		markUsed() {
			lastUsedAt = Date.now();
		},
		async callTool(serverName, toolName, input) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => await runMcpRequest(session, async (signal) => session.client.callTool({
				name: toolName,
				arguments: isRecord(input) ? input : {}
			}, void 0, {
				timeout: session.requestTimeoutMs,
				signal
			})));
		},
		async listTools(serverName, requestParams) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => runMcpRequest(session, async (signal) => session.client.listTools(requestParams, {
				timeout: session.requestTimeoutMs,
				signal
			})));
		},
		async listResources(serverName, options) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => collectMcpPaginatedItems({
				label: "MCP resource listing",
				itemLabel: "resources",
				timeoutMs: session.requestTimeoutMs,
				maxPages: BUNDLE_MCP_MAX_LIST_PAGES,
				maxItems: BUNDLE_MCP_MAX_LIST_ITEMS,
				maxBytes: BUNDLE_MCP_MAX_LIST_BYTES,
				signal: lifecycleAbortController.signal,
				loadPage: async ({ cursor, requestTimeoutMs, signal: paginationSignal }) => {
					const page = await runMcpRequest(session, async (signal) => await session.client.listResources(cursor === void 0 ? void 0 : { cursor }, {
						timeout: requestTimeoutMs,
						maxTotalTimeout: requestTimeoutMs,
						signal
					}), paginationSignal);
					return {
						items: page.resources,
						nextCursor: page.nextCursor,
						serializedValue: page
					};
				}
			}), options);
		},
		async readResource(serverName, uri, options) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => runMcpRequest(session, async (signal) => session.client.readResource({ uri }, {
				timeout: session.requestTimeoutMs,
				signal
			})), options);
		},
		async listResourceTemplates(serverName, requestParams) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => runMcpRequest(session, async (signal) => session.client.listResourceTemplates(requestParams, {
				timeout: session.requestTimeoutMs,
				signal
			})));
		},
		async listPrompts(serverName) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => collectMcpPaginatedItems({
				label: "MCP prompt listing",
				itemLabel: "prompts",
				timeoutMs: session.requestTimeoutMs,
				maxPages: BUNDLE_MCP_MAX_LIST_PAGES,
				maxItems: BUNDLE_MCP_MAX_LIST_ITEMS,
				maxBytes: BUNDLE_MCP_MAX_LIST_BYTES,
				signal: lifecycleAbortController.signal,
				loadPage: async ({ cursor, requestTimeoutMs, signal: paginationSignal }) => {
					const page = await runMcpRequest(session, async (signal) => await session.client.listPrompts(cursor === void 0 ? void 0 : { cursor }, {
						timeout: requestTimeoutMs,
						maxTotalTimeout: requestTimeoutMs,
						signal
					}), paginationSignal);
					return {
						items: page.prompts,
						nextCursor: page.nextCursor,
						serializedValue: page
					};
				}
			}));
		},
		async getPrompt(serverName, name, args) {
			failIfDisposed();
			await getCatalog();
			const session = requireConnectedSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => runMcpRequest(session, async (signal) => session.client.getPrompt({
				name,
				...args ? { arguments: args } : {}
			}, {
				timeout: session.requestTimeoutMs,
				signal
			})));
		},
		async dispose() {
			if (disposed) return;
			disposed = true;
			lifecycleAbortController.abort(createDisposedError(params.sessionId));
			catalog = null;
			catalogRetryAfterMs = void 0;
			catalogInFlight = void 0;
			const sessionsToClose = Array.from(sessions.values());
			sessions.clear();
			await Promise.allSettled(sessionsToClose.map((session) => disposeSession(session)));
		}
	};
}
setDefaultCreateSessionMcpRuntime(createSessionMcpRuntime);
const testing = {
	buildMcpClientCapabilities,
	createSessionMcpRuntimeManager,
	async resetSessionMcpRuntimeManager() {
		await disposeAllSessionMcpRuntimes();
		setBundleMcpCatalogListTimeoutMsForTest();
		setBundleMcpDisposeTimeoutMsForTest();
		const { testing: resolverTesting } = await import("./mcp-connection-resolver-MSyKR5Ld.js");
		resolverTesting.setMcpServerConnectionResolversForTest();
		resolverTesting.setMcpConnectionResolverTimeoutMsForTest();
		resolverTesting.setMcpConnectionRevalidateMsForTest();
	},
	getCachedSessionIds() {
		return getSessionMcpRuntimeManagerForTesting().listSessionIds();
	},
	getCachedRuntimeKeys() {
		return getSessionMcpRuntimeManagerForTesting().listRuntimeKeys();
	},
	getBookkeepingSizes(manager) {
		return manager.bookkeepingSizesForTest?.() ?? {};
	},
	setBundleMcpCatalogListTimeoutMsForTest,
	setBundleMcpDisposeTimeoutMsForTest,
	resolveSessionMcpRuntimeIdleTtlMs,
	mergeMcpToolCatalogs
};
//#endregion
export { testing as n, createSessionMcpRuntime as t };
