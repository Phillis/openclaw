import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { a as sanitizeServerName, t as assignSafeServerNames } from "./agent-bundle-mcp-names-CP3ugHLh.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import { d as createSessionMcpRuntimeManager, f as setDefaultCreateSessionMcpRuntime, n as disposeAllSessionMcpRuntimes, o as getSessionMcpRuntimeManagerForTesting, v as mergeMcpToolCatalogs } from "./agent-bundle-mcp-manager-api-DUhEi3qH.js";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-9jrF06U6.js";
import { t as applyMcpConnectionOverride } from "./mcp-connection-resolver-z5xoSssd.js";
import { a as collectMcpPaginatedItems, c as redactMcpDiagnosticError, d as disposeMcpClient, f as isStatefulMcpHttpSessionExpired, i as normalizeMcpToolFilter, l as McpClientConnectTimeoutError, n as normalizeMcpToolCatalog, o as sanitizeMcpMetadataText, r as isMcpToolAllowed, s as createMcpJsonSchemaValidator, t as resolveMcpTransport, u as connectMcpClient } from "./mcp-transport-D6ND-y3b.js";
import { r as resolveMcpCodexToolApprovalMode, t as normalizeMcpCodexToolAnnotations } from "./mcp-codex-tool-approval-qXI1z_QK.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ErrorCode, ListToolsResultSchema, McpError } from "@modelcontextprotocol/sdk/types.js";
//#region src/agents/agent-bundle-mcp-request-context.ts
const requestSignals = resolveGlobalSingleton(Symbol.for("openclaw.sessionMcpRequestSignal"), () => new AsyncLocalStorage());
function getSessionMcpRequestSignal() {
	return requestSignals.getStore();
}
function runWithSessionMcpRequestSignal(signal, run) {
	return signal ? requestSignals.run(signal, run) : run();
}
//#endregion
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
			const requestController = new AbortController();
			const onAbort = () => requestController.abort(requestSignal.reason);
			requestSignal.addEventListener("abort", onAbort, { once: true });
			if (requestSignal.aborted) onAbort();
			try {
				const page = await client.request({
					method: "tools/list",
					params: cursor === void 0 ? void 0 : { cursor }
				}, ListToolsResultSchema, {
					timeout: requestTimeoutMs,
					maxTotalTimeout: requestTimeoutMs,
					signal: requestController.signal
				});
				return {
					items: page.tools,
					nextCursor: page.nextCursor,
					serializedValue: page
				};
			} finally {
				requestSignal.removeEventListener("abort", onAbort);
			}
		}
	});
}
function isMcpMethodNotFoundError(error) {
	if (isRecord(error) && error.code === ErrorCode.MethodNotFound) return true;
	const message = String(error);
	return message.includes("-32601") || /\b(?:method not found|unknown method)\b/i.test(message);
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
function disposeBundleMcpSession(session) {
	return disposeMcpClient(session, getBundleMcpTestState().disposeTimeoutMs ?? BUNDLE_MCP_DISPOSE_TIMEOUT_MS);
}
function buildMcpClientCapabilities(mcpAppsEnabled) {
	return mcpAppsEnabled ? { extensions: { [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] } } } : {};
}
function buildMcpClientOptions(mcpAppsEnabled) {
	return { capabilities: buildMcpClientCapabilities(mcpAppsEnabled) };
}
function normalizeToolUiVisibility(value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => entry === "app" || entry === "model");
	return [...new Set(normalized)].toSorted();
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
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
		session.connectPromise ??= connectMcpClient({
			client: session.client,
			transport: session.transport,
			timeoutMs: connectionTimeoutMs
		}).catch((error) => {
			if (error instanceof McpClientConnectTimeoutError) throw new Error(`MCP server "${session.serverName}" timed out: did not complete initialize within ${connectionTimeoutMs / 1e3}s`, { cause: error });
			throw error;
		}).then(() => {
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
		await disposeBundleMcpSession(session);
		return true;
	};
	const localRequestTimeouts = /* @__PURE__ */ new WeakSet();
	const runMcpRequest = async (session, request, parentSignal) => {
		const requestSignal = parentSignal ?? getSessionMcpRequestSignal();
		const abortController = new AbortController();
		const onParentAbort = () => abortController.abort(requestSignal?.reason);
		if (requestSignal?.aborted) onParentAbort();
		else requestSignal?.addEventListener("abort", onParentAbort, { once: true });
		const timeoutError = new McpError(ErrorCode.RequestTimeout, "Request timed out", { timeout: session.requestTimeoutMs });
		const timeout = setTimeout(() => {
			localRequestTimeouts.add(timeoutError);
			abortController.abort(timeoutError);
		}, session.requestTimeoutMs);
		timeout.unref?.();
		try {
			const signal = abortController.signal;
			signal.throwIfAborted();
			const result = await request(signal);
			requestSignal?.throwIfAborted();
			return result;
		} catch (error) {
			requestSignal?.throwIfAborted();
			throw error;
		} finally {
			requestSignal?.removeEventListener("abort", onParentAbort);
			clearTimeout(timeout);
		}
	};
	const runGuardedServerRequest = async (serverName, session, request, options) => {
		const requestSignal = getSessionMcpRequestSignal();
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
			const sessionExpired = isStatefulMcpHttpSessionExpired(session, error);
			let recycleReason;
			if (sessionExpired && !requestSignal?.aborted) recycleReason = "expired HTTP session";
			else if (tracksFailureBackoff && !requestSignal?.aborted) {
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
	const runGuardedMcpRequest = (serverName, session, request, options) => runGuardedServerRequest(serverName, session, () => runMcpRequest(session, request), options);
	const collectServerItems = (session, kind) => {
		const callerSignal = getSessionMcpRequestSignal();
		return collectMcpPaginatedItems({
			label: `MCP ${kind === "resources" ? "resource" : "prompt"} listing`,
			itemLabel: kind,
			timeoutMs: session.requestTimeoutMs,
			maxPages: BUNDLE_MCP_MAX_LIST_PAGES,
			maxItems: BUNDLE_MCP_MAX_LIST_ITEMS,
			maxBytes: BUNDLE_MCP_MAX_LIST_BYTES,
			signal: callerSignal ? AbortSignal.any([lifecycleAbortController.signal, callerSignal]) : lifecycleAbortController.signal,
			loadPage: ({ cursor, requestTimeoutMs: timeout, signal }) => runMcpRequest(session, async (requestSignal) => {
				const requestParams = cursor === void 0 ? void 0 : { cursor };
				const requestOptions = {
					timeout,
					maxTotalTimeout: timeout,
					signal: requestSignal
				};
				const page = kind === "resources" ? await session.client.listResources(requestParams, requestOptions) : await session.client.listPrompts(requestParams, requestOptions);
				return {
					items: page[kind],
					nextCursor: page.nextCursor,
					serializedValue: page
				};
			}, signal)
		});
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
						const schemaValidator = createMcpJsonSchemaValidator();
						if (!session) {
							const client = new Client({
								name: "openclaw-bundle-mcp",
								version: "0.0.0"
							}, {
								...buildMcpClientOptions(mcpAppsEnabled),
								jsonSchemaValidator: schemaValidator,
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
						try {
							failIfDisposed();
							await ensureSessionConnected(session, resolved.connectionTimeoutMs);
							failIfDisposed();
							const capabilities = summarizeServerCapabilities(session.client.getServerCapabilities());
							let listedTools;
							try {
								listedTools = await listAllTools(session.client, getCatalogListTimeoutMs(rawServer, resolved.requestTimeoutMs), lifecycleAbortController.signal);
							} catch (error) {
								if (!capabilities.tools && (capabilities.resources || capabilities.prompts) && isMcpMethodNotFoundError(error)) listedTools = [];
								else throw error;
							}
							failIfDisposed();
							const toolFilter = normalizeMcpToolFilter(isRecord(rawServer) ? rawServer.toolFilter : void 0);
							const denialMap = params.toolOverrides?.mcpToolsDeny;
							const deniedToolNames = new Set(denialMap && Object.hasOwn(denialMap, serverName) ? denialMap[serverName] : []);
							const normalizedTools = normalizeMcpToolCatalog(listedTools, schemaValidator, (toolName) => {
								if (!isMcpToolAllowed(toolFilter, toolName)) return "exclude";
								return deniedToolNames.has(toolName) ? "denied" : "include";
							});
							session.toolMetadata = normalizedTools.metadata;
							const exposedTools = normalizedTools.tools;
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
								...toolFilter ? { toolFilter } : {},
								...deniedToolNames.size > 0 ? { deniedToolNames: [...deniedToolNames].toSorted() } : {},
								codexApprovalMode: resolveMcpCodexToolApprovalMode(serverName, rawServer)
							};
							const toolEntries = [];
							for (const [tool, deniedBySession] of [...normalizedTools.tools.map((entry) => [entry, false]), ...normalizedTools.deniedTools.map((entry) => [entry, true])]) {
								const toolName = tool.name;
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
									...deniedBySession ? { deniedBySession: true } : {},
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
							if (!session.connected) await retireSessionIfCurrent(serverName, session);
							else if (!reusedSession && catalogInvalidationGeneration === catalogGeneration) await retireSessionIfCurrent(serverName, session);
							failIfDisposed();
							return {
								serverName,
								serverEntry: null,
								toolEntries: [],
								diagnostics: diags
							};
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
				await Promise.allSettled(Array.from(sessions.values(), (session) => disposeBundleMcpSession(session)));
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
		if (!catalog) {
			await loadCatalog();
			if (catalog) return catalog;
			const replayedCatalog = await loadCatalog();
			return catalog ?? replayedCatalog;
		}
		const staleCatalog = catalog;
		catalogRetryAfterMs = void 0;
		loadCatalog(staleCatalog).catch(() => {
			if (!disposed && catalog === staleCatalog && catalogRetryAfterMs === void 0) catalogRetryAfterMs = Date.now() + BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS;
		});
		return staleCatalog;
	};
	const getActiveSession = async (serverName) => {
		await getCatalog();
		return requireConnectedSession(serverName);
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
			const session = await getActiveSession(serverName);
			const validateResult = session.toolMetadata?.validatorForCall(toolName);
			const result = await runGuardedMcpRequest(serverName, session, (signal) => session.client.callTool({
				name: toolName,
				arguments: isRecord(input) ? input : {}
			}, void 0, {
				timeout: session.requestTimeoutMs,
				signal
			}));
			validateResult?.(result);
			return result;
		},
		async listTools(serverName, requestParams) {
			const session = await getActiveSession(serverName);
			return await runGuardedMcpRequest(serverName, session, (signal) => session.client.request({
				method: "tools/list",
				params: requestParams
			}, ListToolsResultSchema, {
				timeout: session.requestTimeoutMs,
				signal
			}));
		},
		async listResources(serverName, options) {
			const session = await getActiveSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => collectServerItems(session, "resources"), options);
		},
		async readResource(serverName, uri, options) {
			const session = await getActiveSession(serverName);
			return await runGuardedMcpRequest(serverName, session, (signal) => session.client.readResource({ uri }, {
				timeout: session.requestTimeoutMs,
				signal
			}), options);
		},
		async listResourceTemplates(serverName, requestParams) {
			const session = await getActiveSession(serverName);
			return await runGuardedMcpRequest(serverName, session, (signal) => session.client.listResourceTemplates(requestParams, {
				timeout: session.requestTimeoutMs,
				signal
			}));
		},
		async listPrompts(serverName) {
			const session = await getActiveSession(serverName);
			return await runGuardedServerRequest(serverName, session, async () => collectServerItems(session, "prompts"));
		},
		async getPrompt(serverName, name, args) {
			const session = await getActiveSession(serverName);
			return await runGuardedMcpRequest(serverName, session, (signal) => session.client.getPrompt({
				name,
				...args ? { arguments: args } : {}
			}, {
				timeout: session.requestTimeoutMs,
				signal
			}));
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
			await Promise.allSettled(sessionsToClose.map((session) => disposeBundleMcpSession(session)));
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
		const { testing: resolverTesting } = await import("./mcp-connection-resolver-Bqio4rQy.js");
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
	mergeMcpToolCatalogs
};
//#endregion
export { runWithSessionMcpRequestSignal as i, testing as n, getSessionMcpRequestSignal as r, createSessionMcpRuntime as t };
