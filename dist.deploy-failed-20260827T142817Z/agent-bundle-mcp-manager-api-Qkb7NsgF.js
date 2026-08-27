import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as INTERNAL_RUNTIME_CONTEXT_END, s as escapeInternalRuntimeContextDelimiters, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-E3ku7Huk.js";
import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-Dfh0X01f.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-C8VGUeII.js";
import { m as requesterMcpOAuthIdentity } from "./mcp-oauth-store-Bo-TrnIS.js";
import { s as readMcpOAuthCredentialsStatus, u as startMcpOAuthAuthorization } from "./mcp-oauth-gyk8EYZu.js";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-ClX-LS-9.js";
import { i as partitionMcpServersByConnectionScope, n as buildMcpRequesterRuntimeCacheKey, o as resolveMcpConnectionRevalidateMs, r as hashMcpResolvedConnections, s as resolveRequesterScopedMcpConnections } from "./mcp-connection-resolver-CEb7peDa.js";
import { i as resolveSessionMcpRuntimeIdleTtlMs, n as SESSION_MCP_RUNTIME_MANAGER_KEY } from "./agent-bundle-mcp-runtime-shared-DkwjMxYn.js";
import { Type } from "typebox";
//#region src/agents/agent-bundle-mcp-combined.ts
const COMBINED_SESSION_MCP_RUNTIME = Symbol.for("openclaw.combinedSessionMcpRuntime");
function isCombinedSessionMcpRuntime(runtime) {
	return runtime[COMBINED_SESSION_MCP_RUNTIME] !== void 0;
}
/**
* Merge catalogs from static + requester partitions.
* Safe names are precomputed from the full declared set, so no re-suffix is needed.
*/
function mergeMcpToolCatalogs(catalogs) {
	const servers = {};
	const tools = [];
	const sessionDeniedTools = [];
	const diagnostics = [];
	for (const catalog of catalogs) {
		for (const [serverName, server] of Object.entries(catalog.servers).toSorted(([a], [b]) => a.localeCompare(b))) servers[serverName] = server;
		tools.push(...catalog.tools);
		if (catalog.sessionDeniedTools) sessionDeniedTools.push(...catalog.sessionDeniedTools);
		if (catalog.diagnostics) diagnostics.push(...catalog.diagnostics);
	}
	tools.sort((a, b) => {
		const serverOrder = a.safeServerName.localeCompare(b.safeServerName);
		if (serverOrder !== 0) return serverOrder;
		const toolOrder = a.toolName.localeCompare(b.toolName);
		if (toolOrder !== 0) return toolOrder;
		return a.serverName.localeCompare(b.serverName);
	});
	sessionDeniedTools.sort((a, b) => {
		return a.safeServerName.localeCompare(b.safeServerName) || a.toolName.localeCompare(b.toolName) || a.serverName.localeCompare(b.serverName);
	});
	return {
		version: 1,
		generatedAt: Math.max(0, ...catalogs.map((catalog) => catalog.generatedAt)),
		servers,
		tools,
		...sessionDeniedTools.length > 0 ? { sessionDeniedTools } : {},
		...diagnostics.length > 0 ? { diagnostics } : {}
	};
}
function createCombinedSessionMcpRuntime(params) {
	if (params.parts.length === 1) return params.parts[0];
	const parts = params.parts;
	let lastUsedAt = Math.max(...parts.map((part) => part.lastUsedAt));
	let cachedCatalog = null;
	let mergedSourceCatalogs = null;
	let catalogInFlight;
	const serverOwner = /* @__PURE__ */ new Map();
	const requesterConnect = parts.find((part) => part.requesterConnect)?.requesterConnect;
	const rememberServerOwners = (catalog, owner) => {
		for (const serverName of Object.keys(catalog.servers)) serverOwner.set(serverName, owner);
	};
	const cachedCatalogIsCurrent = () => cachedCatalog !== null && mergedSourceCatalogs !== null && parts.every((part, index) => part.peekCatalog() === mergedSourceCatalogs?.[index]);
	const loadCatalog = async () => {
		if (cachedCatalog && !cachedCatalog.diagnostics?.length && cachedCatalogIsCurrent()) return cachedCatalog;
		if (catalogInFlight) return catalogInFlight;
		const inFlight = (async () => {
			const catalogs = await Promise.all(parts.map((part) => part.getCatalog()));
			if (cachedCatalog && mergedSourceCatalogs?.every((source, index) => source === catalogs[index])) return cachedCatalog;
			serverOwner.clear();
			for (let index = 0; index < parts.length; index += 1) rememberServerOwners(catalogs[index], parts[index]);
			mergedSourceCatalogs = catalogs;
			cachedCatalog = mergeMcpToolCatalogs(catalogs);
			return cachedCatalog;
		})();
		catalogInFlight = inFlight;
		try {
			return await inFlight;
		} finally {
			if (catalogInFlight === inFlight) catalogInFlight = void 0;
		}
	};
	const ownerForServer = async (serverName) => {
		if (serverOwner.size === 0) await loadCatalog();
		const owner = serverOwner.get(serverName);
		if (owner) return owner;
		throw new Error(`bundle-mcp server "${serverName}" is not connected`);
	};
	return {
		[COMBINED_SESSION_MCP_RUNTIME]: true,
		managedParts: parts,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		configFingerprint: parts.map((part) => part.configFingerprint).join(":"),
		...requesterConnect ? { requesterConnect } : {},
		isRequesterScopedServer(serverName) {
			return serverOwner.get(serverName)?.requesterScope !== void 0;
		},
		mcpAppsEnabled: parts.some((part) => part.mcpAppsEnabled === true),
		createdAt: Math.min(...parts.map((part) => part.createdAt)),
		get lastUsedAt() {
			return lastUsedAt;
		},
		get activeLeases() {
			return parts.reduce((sum, part) => sum + (part.activeLeases ?? 0), 0);
		},
		acquireLease() {
			const releases = parts.map((part) => part.acquireLease?.());
			let released = false;
			return () => {
				if (released) return;
				released = true;
				for (const release of releases) release?.();
			};
		},
		getCatalog: loadCatalog,
		peekCatalog() {
			if (cachedCatalog && cachedCatalogIsCurrent()) return cachedCatalog;
			const peeked = parts.map((part) => part.peekCatalog());
			if (peeked.some((catalog) => catalog === null)) return null;
			return mergeMcpToolCatalogs(peeked);
		},
		getServerRequestTimeoutMs(serverName) {
			return serverOwner.get(serverName)?.getServerRequestTimeoutMs?.(serverName);
		},
		markUsed() {
			lastUsedAt = Date.now();
			for (const part of parts) part.markUsed();
		},
		async callTool(serverName, toolName, input) {
			return await (await ownerForServer(serverName)).callTool(serverName, toolName, input);
		},
		async listTools(serverName, requestParams) {
			const owner = await ownerForServer(serverName);
			if (!owner.listTools) throw new Error(`bundle-mcp server "${serverName}" does not support listTools`);
			return await owner.listTools(serverName, requestParams);
		},
		async listResources(serverName, options) {
			const owner = await ownerForServer(serverName);
			if (!owner.listResources) throw new Error(`bundle-mcp server "${serverName}" does not support listResources`);
			return await owner.listResources(serverName, options);
		},
		async readResource(serverName, uri, options) {
			const owner = await ownerForServer(serverName);
			if (!owner.readResource) throw new Error(`bundle-mcp server "${serverName}" does not support readResource`);
			return await owner.readResource(serverName, uri, options);
		},
		async listResourceTemplates(serverName, requestParams) {
			const owner = await ownerForServer(serverName);
			if (!owner.listResourceTemplates) throw new Error(`bundle-mcp server "${serverName}" does not support listResourceTemplates`);
			return await owner.listResourceTemplates(serverName, requestParams);
		},
		async listPrompts(serverName) {
			const owner = await ownerForServer(serverName);
			if (!owner.listPrompts) throw new Error(`bundle-mcp server "${serverName}" does not support listPrompts`);
			return await owner.listPrompts(serverName);
		},
		async getPrompt(serverName, name, args) {
			const owner = await ownerForServer(serverName);
			if (!owner.getPrompt) throw new Error(`bundle-mcp server "${serverName}" does not support getPrompt`);
			return await owner.getPrompt(serverName, name, args);
		},
		async dispose() {
			await Promise.allSettled(parts.map((part) => part.dispose()));
		}
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-requester-connect.ts
async function connectRequesterOAuthServer(params) {
	if (!params.publicOrigin) {
		const message = `MCP server "${params.serverName}" needs requester sign-in, but gateway.publicOrigin is not configured. Ask the operator to set the public Gateway HTTP(S) origin.`;
		return {
			content: [{
				type: "text",
				text: message
			}],
			details: {
				status: "error",
				error: message,
				mcpServer: params.serverName
			}
		};
	}
	const result = await startMcpOAuthAuthorization(requesterMcpOAuthIdentity(params.serverName, params.server.url, params.requesterScope), params.server, { redirectUrl: new URL("/oauth/mcp/callback", params.publicOrigin).href });
	if (result.status === "authorized") return {
		content: [{
			type: "text",
			text: `MCP server "${params.serverName}" is connected. Its tools become available on the next message.`
		}],
		details: { mcpServer: params.serverName }
	};
	return {
		content: [{
			type: "text",
			text: `Connect MCP server "${params.serverName}" at ${result.authorizationUrl}\nAfter sign-in completes, the server's tools become available on the next message.`
		}],
		details: { mcpConnect: {
			serverName: params.serverName,
			authorizationUrl: result.authorizationUrl
		} }
	};
}
function buildRequesterConnectCatalog(servers, safeServerNamesByServer) {
	const entries = [...servers.entries()];
	return {
		version: 1,
		generatedAt: Date.now(),
		servers: Object.fromEntries(entries.map(([serverName]) => [serverName, {
			serverName,
			safeServerName: safeServerNamesByServer.get(serverName),
			launchSummary: "Requester OAuth",
			toolCount: 1
		}])),
		tools: entries.map(([serverName]) => ({
			serverName,
			safeServerName: safeServerNamesByServer.get(serverName) ?? serverName,
			toolName: "connect",
			description: `Connect your ${serverName} account.`,
			fallbackDescription: `Connect your ${serverName} account.`,
			inputSchema: Type.Object({})
		}))
	};
}
/** Builds the per-message requester sign-in surface without opening MCP transports. */
async function createRequesterMcpConnect(params) {
	const servers = /* @__PURE__ */ new Map();
	const authorizedServerNames = [];
	for (const serverName of [...params.serverNames].toSorted((a, b) => a.localeCompare(b))) {
		const resolved = resolveMcpTransportConfig(serverName, params.mcpServers[serverName], { logWarnings: false });
		if (resolved?.kind !== "http" || resolved.auth !== "oauth" || resolved.oauth?.identity !== "per-requester") continue;
		servers.set(serverName, resolved);
		if ((await readMcpOAuthCredentialsStatus(requesterMcpOAuthIdentity(serverName, resolved.url, params.requesterScope))).state === "authorized") authorizedServerNames.push(serverName);
	}
	if (servers.size === 0) return;
	const configFingerprint = JSON.stringify({
		config: params.configFingerprint,
		authorizedServerNames,
		publicOrigin: params.cfg?.gateway?.publicOrigin
	});
	return {
		catalog: buildRequesterConnectCatalog(servers, params.safeServerNamesByServer),
		authorizedServerNames,
		configFingerprint,
		createExecute(serverName) {
			const server = servers.get(serverName);
			return server ? async () => await connectRequesterOAuthServer({
				serverName,
				server,
				requesterScope: params.requesterScope,
				publicOrigin: params.cfg?.gateway?.publicOrigin
			}) : void 0;
		}
	};
}
/** Adds transient connect entries only for servers absent from the live catalog. */
function mergeMcpConnectCatalog(liveCatalog, requesterConnect) {
	if (!requesterConnect) return liveCatalog;
	const missingServerNames = new Set(Object.keys(requesterConnect.catalog.servers).filter((serverName) => !Object.hasOwn(liveCatalog.servers, serverName)));
	if (missingServerNames.size === 0) return liveCatalog;
	return {
		...liveCatalog,
		generatedAt: Math.max(liveCatalog.generatedAt, requesterConnect.catalog.generatedAt),
		servers: {
			...liveCatalog.servers,
			...Object.fromEntries(Object.entries(requesterConnect.catalog.servers).filter(([serverName]) => missingServerNames.has(serverName)))
		},
		tools: [...liveCatalog.tools, ...requesterConnect.catalog.tools.filter((tool) => missingServerNames.has(tool.serverName))].toSorted((left, right) => left.safeServerName.localeCompare(right.safeServerName) || left.toolName.localeCompare(right.toolName) || left.serverName.localeCompare(right.serverName))
	};
}
//#endregion
//#region src/agents/mcp-app-model-context.ts
const MCP_APP_MODEL_CONTEXT_MAX_BYTES = 16 * 1024;
function clearMcpAppModelContext(runtime) {
	runtime.pendingMcpAppModelContext = void 0;
}
function revokeMcpAppModelContext(runtime) {
	clearMcpAppModelContext(runtime);
	runtime.mcpAppModelContextRevoked = true;
}
function allowMcpAppModelContext(runtime) {
	runtime.mcpAppModelContextRevoked = void 0;
}
function clearMcpAppModelContextForView(runtime, view) {
	if (runtime.pendingMcpAppModelContext?.owner === view) clearMcpAppModelContext(runtime);
}
function updateMcpAppModelContext(runtime, view, params) {
	if (runtime.mcpAppModelContextRevoked === true) throw new Error("MCP App model context is unavailable for this session");
	if (Object.hasOwn(params, "structuredContent")) throw new Error("MCP App structured model context is unsupported");
	if (params.content === void 0 || Array.isArray(params.content) && params.content.length === 0) {
		clearMcpAppModelContext(runtime);
		return;
	}
	if (!Array.isArray(params.content) || params.content.length !== 1) throw new Error("MCP App model context must contain exactly one text block");
	const block = params.content[0];
	if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("MCP App model context must contain exactly one text block");
	const { type, text } = block;
	if (type !== "text" || typeof text !== "string") throw new Error("MCP App model context must contain exactly one text block");
	if (text.length === 0) {
		clearMcpAppModelContext(runtime);
		return;
	}
	if (Buffer.byteLength(text, "utf8") > MCP_APP_MODEL_CONTEXT_MAX_BYTES) throw new Error(`MCP App model context exceeds ${MCP_APP_MODEL_CONTEXT_MAX_BYTES} bytes`);
	runtime.pendingMcpAppModelContext = {
		owner: view,
		text
	};
}
function leaseMcpAppModelContextForTurn(params) {
	const snapshot = params.runtime.pendingMcpAppModelContext;
	if (!snapshot || snapshot.leased === true || params.runtime.mcpAppModelContextRevoked === true) return;
	snapshot.leased = true;
	const encodedSnapshot = escapeInternalRuntimeContextDelimiters(JSON.stringify({ text: snapshot.text }));
	let committed = false;
	return {
		prompt: [
			INTERNAL_RUNTIME_CONTEXT_BEGIN,
			"MCP App context snapshot:",
			encodedSnapshot,
			INTERNAL_RUNTIME_CONTEXT_END,
			"",
			params.prompt
		].join("\n"),
		transcriptPrompt: params.transcriptPrompt ?? params.prompt,
		commit: () => {
			committed = true;
			if (params.runtime.pendingMcpAppModelContext === snapshot) clearMcpAppModelContext(params.runtime);
		},
		rollback: () => {
			if (!committed && params.runtime.pendingMcpAppModelContext === snapshot) snapshot.leased = void 0;
		}
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager-install.ts
const matchesStaticReuse = (params) => params.candidate.workspaceDir === params.workspaceDir && params.candidate.agentDir === params.agentDir && params.candidate.configFingerprint === params.configFingerprint;
function requesterRuntimeFingerprint(configFingerprint, requesterConnect) {
	return requesterConnect ? `${configFingerprint}:${requesterConnect.configFingerprint}` : configFingerprint;
}
function createSessionMcpRuntimeManagerInstall(lifecycle) {
	const { store } = lifecycle;
	const reconcileReusableRetirement = (sessionId, runtime) => {
		if (store.requiredRetirementSessionIds.has(sessionId)) {
			store.deferredRetirementSessionIds.add(sessionId);
			revokeMcpAppModelContext(runtime);
			return;
		}
		store.deferredRetirementSessionIds.delete(sessionId);
		allowMcpAppModelContext(runtime);
	};
	/** Static/session runtime get-or-create (createInFlight dedup for bare keys only). */
	const getOrCreateRuntimeEntry = async (params) => {
		const nextFingerprint = params.configFingerprint ?? loadSessionMcpConfig({
			workspaceDir: params.workspaceDir,
			cfg: params.cfg,
			logDiagnostics: false,
			manifestRegistry: params.manifestRegistry,
			includeServerNames: params.includeServerNames,
			excludeServerNames: params.excludeServerNames,
			redactConnectionServerNames: params.redactConnectionServerNames,
			safeServerNamesByServer: params.safeServerNamesByServer,
			toolOverrides: params.toolOverrides
		}).fingerprint;
		const existing = store.runtimesBySessionId.get(params.runtimeKey);
		if (existing) if (!matchesStaticReuse({
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			configFingerprint: nextFingerprint,
			candidate: existing
		})) {
			store.runtimesBySessionId.delete(params.runtimeKey);
			store.idleTtlMsBySessionId.delete(params.runtimeKey);
			store.connectionMetaByRuntimeKey.delete(params.runtimeKey);
			await existing.dispose();
		} else {
			reconcileReusableRetirement(params.sessionId, existing);
			existing.markUsed();
			store.idleTtlMsBySessionId.set(params.runtimeKey, params.idleTtlMs);
			return existing;
		}
		const inFlight = store.createInFlight.get(params.runtimeKey);
		if (inFlight) {
			if (matchesStaticReuse({
				workspaceDir: params.workspaceDir,
				agentDir: params.agentDir,
				configFingerprint: nextFingerprint,
				candidate: inFlight
			})) return inFlight.promise;
			store.createInFlight.delete(params.runtimeKey);
			const staleRuntime = await inFlight.promise.catch(() => void 0);
			store.runtimesBySessionId.delete(params.runtimeKey);
			store.idleTtlMsBySessionId.delete(params.runtimeKey);
			store.connectionMetaByRuntimeKey.delete(params.runtimeKey);
			await staleRuntime?.dispose();
		}
		const created = Promise.resolve(store.createRuntime({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			cfg: params.cfg,
			manifestRegistry: params.manifestRegistry,
			includeServerNames: params.includeServerNames,
			excludeServerNames: params.excludeServerNames,
			safeServerNamesByServer: params.safeServerNamesByServer,
			connectionOverrides: params.connectionOverrides,
			redactConnectionServerNames: params.redactConnectionServerNames,
			requesterScope: params.requesterScope,
			requesterConnect: params.requesterConnect,
			configFingerprint: nextFingerprint,
			toolOverrides: params.toolOverrides
		})).then((runtime) => {
			reconcileReusableRetirement(params.sessionId, runtime);
			runtime.markUsed();
			store.runtimesBySessionId.set(params.runtimeKey, runtime);
			store.idleTtlMsBySessionId.set(params.runtimeKey, params.idleTtlMs);
			return runtime;
		});
		store.createInFlight.set(params.runtimeKey, {
			promise: created,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			configFingerprint: nextFingerprint
		});
		try {
			return await created;
		} finally {
			store.createInFlight.delete(params.runtimeKey);
		}
	};
	/** Install or reuse one requester runtime. Must run under its runtime-key lock. */
	const installRequesterRuntime = async (params) => {
		const { fingerprint: resolvedFingerprint } = loadSessionMcpConfig({
			workspaceDir: params.workspaceDir,
			cfg: params.cfg,
			logDiagnostics: false,
			manifestRegistry: params.manifestRegistry,
			includeServerNames: params.includeServerNames,
			redactConnectionServerNames: params.redactConnectionServerNames,
			safeServerNamesByServer: params.safeServerNamesByServer,
			toolOverrides: params.toolOverrides
		});
		const runtimeFingerprint = requesterRuntimeFingerprint(resolvedFingerprint, params.requesterConnect);
		const connectionHash = hashMcpResolvedConnections(params.connectionOverrides);
		const existing = store.runtimesBySessionId.get(params.runtimeKey);
		const meta = store.connectionMetaByRuntimeKey.get(params.runtimeKey);
		if (existing && meta?.connectionHash === connectionHash && matchesStaticReuse({
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			configFingerprint: runtimeFingerprint,
			candidate: existing
		})) {
			reconcileReusableRetirement(params.sessionId, existing);
			existing.markUsed();
			store.idleTtlMsBySessionId.set(params.runtimeKey, params.idleTtlMs);
			store.connectionMetaByRuntimeKey.set(params.runtimeKey, {
				connectionHash,
				resolvedAt: store.now()
			});
			return existing;
		}
		if (existing) {
			store.runtimesBySessionId.delete(params.runtimeKey);
			store.idleTtlMsBySessionId.delete(params.runtimeKey);
			store.connectionMetaByRuntimeKey.delete(params.runtimeKey);
			await existing.dispose();
		}
		const runtime = await getOrCreateRuntimeEntry({
			runtimeKey: params.runtimeKey,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			cfg: params.cfg,
			manifestRegistry: params.manifestRegistry,
			idleTtlMs: params.idleTtlMs,
			includeServerNames: params.includeServerNames,
			safeServerNamesByServer: params.safeServerNamesByServer,
			connectionOverrides: params.connectionOverrides,
			redactConnectionServerNames: params.redactConnectionServerNames,
			requesterScope: params.requesterScope,
			requesterConnect: params.requesterConnect,
			configFingerprint: runtimeFingerprint,
			toolOverrides: params.toolOverrides
		});
		store.connectionMetaByRuntimeKey.set(params.runtimeKey, {
			connectionHash,
			resolvedAt: store.now()
		});
		return runtime;
	};
	/** Revoke cached scoped runtime (empty re-resolution). Auth boundary: leases do not block. */
	const revokeRequesterRuntime = async (runtimeKey) => {
		await lifecycle.disposeRuntimeKeyNow(runtimeKey);
	};
	/**
	* Full requester section for one runtimeKey: reuse / resolve / install / revoke.
	* Always invoked under runExclusiveOnRuntimeKey.
	*/
	const resolveAndInstallRequesterRuntime = async (params) => {
		const requesterConnect = await createRequesterMcpConnect({
			serverNames: params.oauthRequesterNameSet,
			mcpServers: params.mcpServers,
			safeServerNamesByServer: params.safeServerNamesByServer,
			requesterScope: params.requesterScope,
			cfg: params.cfg,
			configFingerprint: params.fullScopedFingerprint
		});
		const expectedLiveNameSet = /* @__PURE__ */ new Set([...requesterConnect?.authorizedServerNames ?? [], ...params.resolverRequesterServerNames]);
		const { fingerprint: expectedLiveFingerprint } = loadSessionMcpConfig({
			workspaceDir: params.workspaceDir,
			cfg: params.cfg,
			logDiagnostics: false,
			manifestRegistry: params.manifestRegistry,
			includeServerNames: expectedLiveNameSet,
			redactConnectionServerNames: new Set(params.resolverRequesterServerNames),
			safeServerNamesByServer: params.safeServerNamesByServer,
			toolOverrides: params.toolOverrides
		});
		const scopedFingerprint = requesterRuntimeFingerprint(expectedLiveFingerprint, requesterConnect);
		const existing = store.runtimesBySessionId.get(params.runtimeKey);
		const meta = store.connectionMetaByRuntimeKey.get(params.runtimeKey);
		const revalidateMs = resolveMcpConnectionRevalidateMs();
		if (meta !== void 0 && store.now() - meta.resolvedAt < revalidateMs && existing && matchesStaticReuse({
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			configFingerprint: scopedFingerprint,
			candidate: existing
		})) {
			reconcileReusableRetirement(params.sessionId, existing);
			existing.markUsed();
			store.idleTtlMsBySessionId.set(params.runtimeKey, params.idleTtlMs);
			return existing;
		}
		const connectionOverrides = await resolveRequesterScopedMcpConnections({
			serverNames: params.resolverRequesterServerNames,
			requesterSenderId: params.requesterSenderId,
			agentAccountId: params.agentAccountId,
			messageChannel: params.messageChannel
		});
		const activeNameSet = /* @__PURE__ */ new Set([...requesterConnect?.authorizedServerNames ?? [], ...connectionOverrides.keys()]);
		if (activeNameSet.size === 0 && !requesterConnect) {
			if (store.runtimesBySessionId.has(params.runtimeKey) || store.createInFlight.has(params.runtimeKey)) await revokeRequesterRuntime(params.runtimeKey);
			return;
		}
		return await installRequesterRuntime({
			runtimeKey: params.runtimeKey,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			cfg: params.cfg,
			manifestRegistry: params.manifestRegistry,
			idleTtlMs: params.idleTtlMs,
			safeServerNamesByServer: params.safeServerNamesByServer,
			includeServerNames: activeNameSet,
			requesterConnect,
			connectionOverrides,
			redactConnectionServerNames: new Set(params.resolverRequesterServerNames),
			requesterScope: params.requesterScope,
			toolOverrides: params.toolOverrides
		});
	};
	return {
		getOrCreateRuntimeEntry,
		resolveAndInstallRequesterRuntime
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager-lifecycle.ts
/** Session MCP runtime manager lifecycle: maps, idle sweep, dispose, advertised catalog. */
function parseRuntimeCacheSessionId(runtimeKey) {
	if (!runtimeKey.startsWith("{")) return runtimeKey;
	try {
		const parsed = JSON.parse(runtimeKey);
		return typeof parsed.sessionId === "string" ? parsed.sessionId : runtimeKey;
	} catch {
		return runtimeKey;
	}
}
function createSessionMcpRuntimeManagerStore(opts, createSessionMcpRuntime) {
	return {
		runtimesBySessionId: /* @__PURE__ */ new Map(),
		sessionIdBySessionKey: /* @__PURE__ */ new Map(),
		idleTtlMsBySessionId: /* @__PURE__ */ new Map(),
		deferredRetirementSessionIds: /* @__PURE__ */ new Set(),
		requiredRetirementSessionIds: /* @__PURE__ */ new Set(),
		connectionMetaByRuntimeKey: /* @__PURE__ */ new Map(),
		/**
		* Session-stable advertised catalogs for requester-scoped servers.
		* Keyed by sessionId → serverName. Specs must not vary per sender or shared
		* Codex threads rotate (dynamicToolsFingerprint churn).
		*/
		advertisedScopedCatalogBySessionId: /* @__PURE__ */ new Map(),
		/**
		* Per-runtimeKey serialization for requester resolve+install and dispose.
		* Sections never overlap for one key, so a slow resolve cannot clobber a newer install.
		* Entries are removed when their chain drains.
		*/
		requesterWorkChains: /* @__PURE__ */ new Map(),
		createRuntime: opts.createRuntime ?? createSessionMcpRuntime,
		now: opts.now ?? Date.now,
		createInFlight: /* @__PURE__ */ new Map(),
		idleSweepIntervalMs: opts.idleSweepIntervalMs ?? 6e4,
		maxIdleRequesterRuntimes: opts.maxIdleRequesterRuntimesPerSession ?? 64,
		enableIdleSweepTimer: opts.enableIdleSweepTimer !== false,
		idleSweepTimer: void 0,
		idleSweepInFlight: void 0
	};
}
function scopedCatalogToolsSignature(tools) {
	return JSON.stringify(tools.map((tool) => [
		tool.serverName,
		tool.safeServerName,
		tool.toolName,
		tool.title ?? "",
		tool.description ?? "",
		tool.fallbackDescription,
		tool.inputSchema,
		tool.uiResourceUri ?? "",
		tool.uiVisibility ?? null
	]));
}
function createSessionMcpRuntimeManagerLifecycle(store) {
	const forgetSessionKeysForSessionId = (sessionId) => {
		for (const [sessionKey, mappedSessionId] of store.sessionIdBySessionKey.entries()) if (mappedSessionId === sessionId) store.sessionIdBySessionKey.delete(sessionKey);
	};
	const runtimeKeysForSessionId = (sessionId) => {
		const keys = [];
		for (const [runtimeKey, runtime] of store.runtimesBySessionId.entries()) if (runtime.sessionId === sessionId) keys.push(runtimeKey);
		return keys;
	};
	const totalActiveLeasesForSessionId = (sessionId) => {
		let total = 0;
		for (const runtimeKey of runtimeKeysForSessionId(sessionId)) total += store.runtimesBySessionId.get(runtimeKey)?.activeLeases ?? 0;
		return total;
	};
	const runExclusiveOnRuntimeKey = (runtimeKey, work) => {
		const run = (store.requesterWorkChains.get(runtimeKey) ?? Promise.resolve()).catch(() => void 0).then(() => work());
		const settled = run.then(() => void 0, () => void 0);
		store.requesterWorkChains.set(runtimeKey, settled);
		settled.finally(() => {
			if (store.requesterWorkChains.get(runtimeKey) === settled) store.requesterWorkChains.delete(runtimeKey);
		});
		return run;
	};
	const sweepIdleRuntimes = async () => {
		const nowMs = store.now();
		const expired = [];
		for (const [runtimeKey, runtime] of store.runtimesBySessionId.entries()) {
			const idleTtlMs = store.idleTtlMsBySessionId.get(runtimeKey) ?? store.idleTtlMsBySessionId.get(runtime.sessionId) ?? 6e5;
			if (idleTtlMs <= 0 || (runtime.activeLeases ?? 0) > 0) continue;
			if (nowMs - runtime.lastUsedAt < idleTtlMs) continue;
			store.runtimesBySessionId.delete(runtimeKey);
			store.idleTtlMsBySessionId.delete(runtimeKey);
			store.connectionMetaByRuntimeKey.delete(runtimeKey);
			expired.push(runtime);
		}
		const touchedSessionIds = new Set(expired.map((runtime) => runtime.sessionId));
		for (const sessionId of touchedSessionIds) if (runtimeKeysForSessionId(sessionId).length === 0) {
			store.deferredRetirementSessionIds.delete(sessionId);
			forgetSessionKeysForSessionId(sessionId);
		}
		await Promise.allSettled(expired.map((runtime) => runtime.dispose()));
		return expired.length;
	};
	/**
	* A busy shared channel can otherwise accumulate one live scoped runtime per
	* sender until the idle TTL fires. Evict LRU zero-lease requester runtimes
	* beyond the cap; leased runtimes and the bare static runtime never evict.
	*/
	const enforceRequesterRuntimeCap = async (sessionId, keepRuntimeKey) => {
		const requesterKeys = runtimeKeysForSessionId(sessionId).filter((runtimeKey) => runtimeKey !== sessionId);
		const overflow = requesterKeys.length - store.maxIdleRequesterRuntimes;
		if (overflow <= 0) return;
		const evictable = requesterKeys.filter((runtimeKey) => runtimeKey !== keepRuntimeKey).map((runtimeKey) => ({
			runtimeKey,
			runtime: store.runtimesBySessionId.get(runtimeKey)
		})).filter((entry) => entry.runtime !== void 0 && (entry.runtime.activeLeases ?? 0) === 0).toSorted((a, b) => a.runtime.lastUsedAt - b.runtime.lastUsedAt).slice(0, overflow);
		for (const { runtimeKey, runtime } of evictable) await runExclusiveOnRuntimeKey(runtimeKey, async () => {
			const current = store.runtimesBySessionId.get(runtimeKey);
			if (current !== runtime || (current.activeLeases ?? 0) > 0) return;
			store.runtimesBySessionId.delete(runtimeKey);
			store.idleTtlMsBySessionId.delete(runtimeKey);
			store.connectionMetaByRuntimeKey.delete(runtimeKey);
			await current.dispose();
		});
	};
	const queueIdleSweep = () => {
		if (store.idleSweepInFlight) return;
		store.idleSweepInFlight = sweepIdleRuntimes().then(() => void 0).catch((error) => {
			logWarn(`bundle-mcp: idle runtime sweep failed: ${String(error)}`);
		}).finally(() => {
			store.idleSweepInFlight = void 0;
		});
	};
	const ensureIdleSweepTimer = () => {
		if (!store.enableIdleSweepTimer || store.idleSweepIntervalMs <= 0 || store.idleSweepTimer) return;
		store.idleSweepTimer = setInterval(queueIdleSweep, store.idleSweepIntervalMs);
		store.idleSweepTimer.unref?.();
	};
	const clearIdleSweepTimer = () => {
		if (!store.idleSweepTimer) return;
		clearInterval(store.idleSweepTimer);
		store.idleSweepTimer = void 0;
	};
	const disposeRuntimeKeyNow = async (runtimeKey) => {
		const inFlight = store.createInFlight.get(runtimeKey);
		store.createInFlight.delete(runtimeKey);
		let runtime = store.runtimesBySessionId.get(runtimeKey);
		if (!runtime && inFlight) runtime = await inFlight.promise.catch(() => void 0);
		store.runtimesBySessionId.delete(runtimeKey);
		store.idleTtlMsBySessionId.delete(runtimeKey);
		store.connectionMetaByRuntimeKey.delete(runtimeKey);
		if (runtime) await runtime.dispose();
	};
	const disposeManagedSession = async (sessionId, opts) => {
		store.deferredRetirementSessionIds.delete(sessionId);
		if (opts?.preserveRequiredRetirement !== true) store.requiredRetirementSessionIds.delete(sessionId);
		store.advertisedScopedCatalogBySessionId.delete(sessionId);
		const runtimeKeys = new Set(runtimeKeysForSessionId(sessionId));
		for (const runtimeKey of store.createInFlight.keys()) if (parseRuntimeCacheSessionId(runtimeKey) === sessionId) runtimeKeys.add(runtimeKey);
		for (const runtimeKey of store.requesterWorkChains.keys()) if (parseRuntimeCacheSessionId(runtimeKey) === sessionId) runtimeKeys.add(runtimeKey);
		await Promise.allSettled([...runtimeKeys].map((runtimeKey) => runtimeKey.startsWith("{") ? runExclusiveOnRuntimeKey(runtimeKey, () => disposeRuntimeKeyNow(runtimeKey)) : disposeRuntimeKeyNow(runtimeKey)));
		forgetSessionKeysForSessionId(sessionId);
	};
	const rememberAdvertisedScopedCatalog = (sessionId, catalog) => {
		let entry = store.advertisedScopedCatalogBySessionId.get(sessionId);
		if (!entry) {
			entry = {
				servers: /* @__PURE__ */ new Map(),
				toolsByServer: /* @__PURE__ */ new Map(),
				signaturesByServer: /* @__PURE__ */ new Map()
			};
			store.advertisedScopedCatalogBySessionId.set(sessionId, entry);
		}
		const toolsByServerName = /* @__PURE__ */ new Map();
		for (const tool of catalog.tools) {
			const list = toolsByServerName.get(tool.serverName) ?? [];
			list.push(tool);
			toolsByServerName.set(tool.serverName, list);
		}
		for (const [serverName, server] of Object.entries(catalog.servers)) {
			const tools = (toolsByServerName.get(serverName) ?? []).toSorted((a, b) => a.toolName.localeCompare(b.toolName));
			const signature = scopedCatalogToolsSignature(tools);
			if (entry.signaturesByServer.get(serverName) === signature) continue;
			entry.servers.set(serverName, server);
			entry.toolsByServer.set(serverName, tools);
			entry.signaturesByServer.set(serverName, signature);
		}
	};
	const getAdvertisedScopedCatalog = (sessionId) => {
		const entry = store.advertisedScopedCatalogBySessionId.get(sessionId);
		if (!entry || entry.servers.size === 0) return null;
		const servers = {};
		const tools = [];
		for (const serverName of [...entry.servers.keys()].toSorted((a, b) => a.localeCompare(b))) {
			servers[serverName] = entry.servers.get(serverName);
			tools.push(...entry.toolsByServer.get(serverName) ?? []);
		}
		tools.sort((a, b) => {
			const serverOrder = a.safeServerName.localeCompare(b.safeServerName);
			if (serverOrder !== 0) return serverOrder;
			return a.toolName.localeCompare(b.toolName);
		});
		return {
			version: 1,
			generatedAt: store.now(),
			servers,
			tools
		};
	};
	return {
		store,
		forgetSessionKeysForSessionId,
		runtimeKeysForSessionId,
		totalActiveLeasesForSessionId,
		runExclusiveOnRuntimeKey,
		sweepIdleRuntimes,
		enforceRequesterRuntimeCap,
		ensureIdleSweepTimer,
		clearIdleSweepTimer,
		disposeRuntimeKeyNow,
		disposeManagedSession,
		rememberAdvertisedScopedCatalog,
		getAdvertisedScopedCatalog
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager.ts
/** Session MCP runtime manager: get-or-create and requester-scoped install orchestration. */
/** Bound from agent-bundle-mcp-runtime.ts to avoid an import cycle with the facade. */
let defaultCreateSessionMcpRuntime;
function setDefaultCreateSessionMcpRuntime(fn) {
	defaultCreateSessionMcpRuntime = fn;
}
function resolveCreateSessionMcpRuntime(createRuntime) {
	const resolved = createRuntime ?? defaultCreateSessionMcpRuntime;
	if (!resolved) throw new Error("Session MCP runtime factory is not bound");
	return resolved;
}
function createSessionMcpRuntimeManager(opts = {}) {
	const store = createSessionMcpRuntimeManagerStore(opts, resolveCreateSessionMcpRuntime(opts.createRuntime));
	const lifecycle = createSessionMcpRuntimeManagerLifecycle(store);
	const install = createSessionMcpRuntimeManagerInstall(lifecycle);
	const materializeRequesterScopedRuntime = async (params) => {
		const oauthRequesterNameSet = new Set(params.oauthRequesterServerNames);
		const resolverRequesterNameSet = new Set(params.resolverRequesterServerNames);
		const agentAccountId = normalizeOptionalString(params.agentAccountId);
		const messageChannel = normalizeOptionalString(params.messageChannel);
		const runtimeKey = buildMcpRequesterRuntimeCacheKey({
			sessionId: params.sessionId,
			messageChannel,
			agentAccountId,
			requesterSenderId: params.requesterSenderId
		});
		const fullScopedFingerprint = loadSessionMcpConfig({
			workspaceDir: params.workspaceDir,
			cfg: params.cfg,
			logDiagnostics: false,
			manifestRegistry: params.manifestRegistry,
			includeServerNames: params.scopedNameSet,
			redactConnectionServerNames: resolverRequesterNameSet,
			safeServerNamesByServer: params.safeServerNamesByServer,
			toolOverrides: params.toolOverrides
		}).fingerprint;
		return {
			runtimeKey,
			runtime: await lifecycle.runExclusiveOnRuntimeKey(runtimeKey, () => install.resolveAndInstallRequesterRuntime({
				...params,
				runtimeKey,
				fullScopedFingerprint,
				oauthRequesterNameSet,
				agentAccountId,
				messageChannel,
				requesterScope: {
					requesterSenderId: params.requesterSenderId,
					...agentAccountId ? { agentAccountId } : {},
					...messageChannel ? { messageChannel } : {}
				}
			}))
		};
	};
	const manager = {
		async getOrCreate(params) {
			const idleTtlMs = resolveSessionMcpRuntimeIdleTtlMs();
			await lifecycle.sweepIdleRuntimes();
			if (idleTtlMs > 0) lifecycle.ensureIdleSweepTimer();
			if (params.sessionKey) store.sessionIdBySessionKey.set(params.sessionKey, params.sessionId);
			const fullConfig = loadSessionMcpConfig({
				workspaceDir: params.workspaceDir,
				cfg: params.cfg,
				logDiagnostics: false,
				manifestRegistry: params.manifestRegistry,
				toolOverrides: params.toolOverrides
			});
			const safeServerNamesByServer = assignSafeServerNames(Object.keys(fullConfig.loaded.mcpServers));
			const { staticServers, requesterScopedServerNames, oauthRequesterServerNames, resolverRequesterServerNames } = partitionMcpServersByConnectionScope(fullConfig.loaded.mcpServers);
			if (!(requesterScopedServerNames.length > 0)) return await install.getOrCreateRuntimeEntry({
				runtimeKey: params.sessionId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				agentDir: params.agentDir,
				cfg: params.cfg,
				manifestRegistry: params.manifestRegistry,
				idleTtlMs,
				safeServerNamesByServer,
				toolOverrides: params.toolOverrides
			});
			const parts = [];
			const scopedNameSet = new Set(requesterScopedServerNames);
			let emptyStaticRuntime;
			if (Object.keys(staticServers).length > 0) parts.push(await install.getOrCreateRuntimeEntry({
				runtimeKey: params.sessionId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				agentDir: params.agentDir,
				cfg: params.cfg,
				manifestRegistry: params.manifestRegistry,
				idleTtlMs,
				excludeServerNames: scopedNameSet,
				safeServerNamesByServer,
				toolOverrides: params.toolOverrides
			}));
			else emptyStaticRuntime = await install.getOrCreateRuntimeEntry({
				runtimeKey: params.sessionId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				agentDir: params.agentDir,
				cfg: params.cfg,
				manifestRegistry: params.manifestRegistry,
				idleTtlMs,
				includeServerNames: /* @__PURE__ */ new Set(),
				safeServerNamesByServer,
				toolOverrides: params.toolOverrides
			});
			const requesterSenderId = normalizeOptionalString(params.requesterSenderId);
			if (requesterSenderId) {
				const { runtimeKey, runtime: scopedRuntime } = await materializeRequesterScopedRuntime({
					...params,
					idleTtlMs,
					mcpServers: fullConfig.loaded.mcpServers,
					oauthRequesterServerNames,
					resolverRequesterServerNames,
					scopedNameSet,
					safeServerNamesByServer,
					requesterSenderId
				});
				if (scopedRuntime) parts.push(scopedRuntime);
				await lifecycle.enforceRequesterRuntimeCap(params.sessionId, runtimeKey);
			}
			if (parts.length === 0) return emptyStaticRuntime ?? await install.getOrCreateRuntimeEntry({
				runtimeKey: params.sessionId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				agentDir: params.agentDir,
				cfg: params.cfg,
				manifestRegistry: params.manifestRegistry,
				idleTtlMs,
				includeServerNames: /* @__PURE__ */ new Set(),
				safeServerNamesByServer,
				toolOverrides: params.toolOverrides
			});
			return createCombinedSessionMcpRuntime({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				agentDir: params.agentDir,
				parts
			});
		},
		async getOrCreateRequesterScoped(params) {
			const requesterSenderId = normalizeOptionalString(params.requesterSenderId);
			if (!requesterSenderId) return;
			const idleTtlMs = resolveSessionMcpRuntimeIdleTtlMs();
			await lifecycle.sweepIdleRuntimes();
			if (idleTtlMs > 0) lifecycle.ensureIdleSweepTimer();
			if (params.sessionKey) store.sessionIdBySessionKey.set(params.sessionKey, params.sessionId);
			const fullConfig = loadSessionMcpConfig({
				workspaceDir: params.workspaceDir,
				cfg: params.cfg,
				logDiagnostics: false,
				manifestRegistry: params.manifestRegistry,
				toolOverrides: params.toolOverrides
			});
			const { requesterScopedServerNames, oauthRequesterServerNames, resolverRequesterServerNames } = partitionMcpServersByConnectionScope(fullConfig.loaded.mcpServers);
			if (requesterScopedServerNames.length === 0) return;
			const safeServerNamesByServer = assignSafeServerNames(Object.keys(fullConfig.loaded.mcpServers));
			const scopedNameSet = new Set(requesterScopedServerNames);
			const { runtimeKey, runtime } = await materializeRequesterScopedRuntime({
				...params,
				idleTtlMs,
				mcpServers: fullConfig.loaded.mcpServers,
				oauthRequesterServerNames,
				resolverRequesterServerNames,
				scopedNameSet,
				safeServerNamesByServer,
				requesterSenderId
			});
			if (runtime) await lifecycle.enforceRequesterRuntimeCap(params.sessionId, runtimeKey);
			return runtime;
		},
		rememberAdvertisedScopedCatalog: lifecycle.rememberAdvertisedScopedCatalog,
		getAdvertisedScopedCatalog: lifecycle.getAdvertisedScopedCatalog,
		bindSessionKey(sessionKey, sessionId) {
			store.sessionIdBySessionKey.set(sessionKey, sessionId);
		},
		resolveSessionId(sessionKey) {
			return store.sessionIdBySessionKey.get(sessionKey);
		},
		peekSession(params) {
			const sessionId = params.sessionId ?? (params.sessionKey ? store.sessionIdBySessionKey.get(params.sessionKey) : void 0);
			return sessionId ? store.runtimesBySessionId.get(sessionId) : void 0;
		},
		async disposeSession(sessionId) {
			await lifecycle.disposeManagedSession(sessionId);
		},
		deferRetirement(sessionId, retirementOpts) {
			if (retirementOpts?.retainAcrossReuse === true) for (const runtimeKey of lifecycle.runtimeKeysForSessionId(sessionId)) {
				const runtime = store.runtimesBySessionId.get(runtimeKey);
				if (runtime) revokeMcpAppModelContext(runtime);
			}
			if (retirementOpts?.retainAcrossReuse === true) store.requiredRetirementSessionIds.add(sessionId);
			else store.requiredRetirementSessionIds.delete(sessionId);
			if (lifecycle.runtimeKeysForSessionId(sessionId).length === 0 && retirementOpts?.retainAcrossReuse !== true) return false;
			store.deferredRetirementSessionIds.add(sessionId);
			return true;
		},
		async completeDeferredRetirement(sessionId, runtime) {
			if (!store.deferredRetirementSessionIds.has(sessionId) || runtime !== void 0 && runtime.sessionId !== sessionId) return false;
			if (lifecycle.totalActiveLeasesForSessionId(sessionId) > 0 || (runtime?.activeLeases ?? 0) > 0) return false;
			const managed = lifecycle.runtimeKeysForSessionId(sessionId).map((runtimeKey) => store.runtimesBySessionId.get(runtimeKey)).filter((entry) => Boolean(entry));
			if (managed.length === 0) return false;
			const managedSet = new Set(managed);
			if (runtime !== void 0) {
				if (isCombinedSessionMcpRuntime(runtime)) {
					if (!runtime.managedParts.every((part) => managedSet.has(part))) return false;
				} else if (!managedSet.has(runtime)) return false;
			}
			await lifecycle.disposeManagedSession(sessionId, { preserveRequiredRetirement: store.requiredRetirementSessionIds.has(sessionId) });
			return true;
		},
		async disposeAll() {
			lifecycle.clearIdleSweepTimer();
			const chains = Array.from(store.requesterWorkChains.values());
			store.requesterWorkChains.clear();
			await Promise.allSettled(chains);
			const inFlightRuntimes = Array.from(store.createInFlight.values());
			store.createInFlight.clear();
			const runtimes = Array.from(store.runtimesBySessionId.values());
			store.runtimesBySessionId.clear();
			store.sessionIdBySessionKey.clear();
			store.idleTtlMsBySessionId.clear();
			store.deferredRetirementSessionIds.clear();
			store.requiredRetirementSessionIds.clear();
			store.connectionMetaByRuntimeKey.clear();
			store.advertisedScopedCatalogBySessionId.clear();
			const lateRuntimes = await Promise.all(inFlightRuntimes.map(async ({ promise }) => await promise.catch(() => void 0)));
			const allRuntimes = new Set(runtimes);
			for (const runtime of lateRuntimes) if (runtime) allRuntimes.add(runtime);
			await Promise.allSettled(Array.from(allRuntimes, (runtime) => runtime.dispose()));
		},
		sweepIdleRuntimes: lifecycle.sweepIdleRuntimes,
		listSessionIds() {
			return [...new Set(Array.from(store.runtimesBySessionId.values(), (runtime) => runtime.sessionId))].toSorted((a, b) => a.localeCompare(b));
		},
		listRuntimeKeys() {
			return Array.from(store.runtimesBySessionId.keys()).toSorted((a, b) => a.localeCompare(b));
		},
		totalActiveLeasesForSession(sessionId) {
			return lifecycle.totalActiveLeasesForSessionId(sessionId);
		}
	};
	Object.assign(manager, { bookkeepingSizesForTest: () => ({
		runtimes: store.runtimesBySessionId.size,
		connectionMeta: store.connectionMetaByRuntimeKey.size,
		createInFlight: store.createInFlight.size,
		requesterWorkChains: store.requesterWorkChains.size,
		sessionKeys: store.sessionIdBySessionKey.size,
		idleTtl: store.idleTtlMsBySessionId.size,
		deferredRetirement: store.deferredRetirementSessionIds.size,
		advertisedScopedCatalogs: store.advertisedScopedCatalogBySessionId.size
	}) });
	return manager;
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager-api.ts
/** Module-level session MCP runtime manager entry APIs. */
function getSessionMcpRuntimeManager() {
	return resolveGlobalSingleton(SESSION_MCP_RUNTIME_MANAGER_KEY, createSessionMcpRuntimeManager);
}
function peekSessionMcpRuntimeManager() {
	const globalStore = globalThis;
	return Object.hasOwn(globalStore, SESSION_MCP_RUNTIME_MANAGER_KEY) ? globalStore[SESSION_MCP_RUNTIME_MANAGER_KEY] : void 0;
}
async function getOrCreateSessionMcpRuntime(params) {
	return await getSessionMcpRuntimeManager().getOrCreate(params);
}
/**
* Requester-scoped MCP runtime only (no static partition).
* Shared-thread harnesses use this so static MCP stays harness-native.
*/
async function getOrCreateRequesterScopedMcpRuntime(params) {
	return await getSessionMcpRuntimeManager().getOrCreateRequesterScoped(params);
}
function rememberAdvertisedScopedMcpCatalog(sessionId, catalog) {
	getSessionMcpRuntimeManager().rememberAdvertisedScopedCatalog(sessionId, catalog);
}
function getAdvertisedScopedMcpCatalog(sessionId) {
	return getSessionMcpRuntimeManager().getAdvertisedScopedCatalog(sessionId);
}
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
function peekSessionMcpRuntime(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	return peekSessionMcpRuntimeManager()?.peekSession({
		...sessionId ? { sessionId } : {},
		...sessionKey ? { sessionKey } : {}
	});
}
async function disposeSessionMcpRuntime(sessionId) {
	await getSessionMcpRuntimeManager().disposeSession(sessionId);
}
async function retireSessionMcpRuntime(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return false;
	const manager = getSessionMcpRuntimeManager();
	const retainAcrossReuse = params.preserveActiveLeases === true && params.retainAcrossReuse === true;
	if (params.preserveActiveLeases === true) {
		manager.deferRetirement(sessionId, { retainAcrossReuse });
		if (manager.totalActiveLeasesForSession(sessionId) > 0) return true;
	}
	try {
		if (retainAcrossReuse) {
			await manager.completeDeferredRetirement(sessionId);
			return true;
		}
		await disposeSessionMcpRuntime(sessionId);
		return true;
	} catch (error) {
		params.onError?.(error, sessionId, params.reason);
		return false;
	}
}
/** Completes a one-shot retirement after its final run, view, or request lease releases. */
async function completeDeferredSessionMcpRuntimeRetirement(runtime) {
	return await getSessionMcpRuntimeManager().completeDeferredRetirement(runtime.sessionId, runtime);
}
async function retireSessionMcpRuntimeForSessionKey(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	return await retireSessionMcpRuntime({
		sessionId: getSessionMcpRuntimeManager().resolveSessionId(sessionKey),
		reason: params.reason,
		preserveActiveLeases: params.preserveActiveLeases,
		onError: params.onError
	});
}
async function disposeAllSessionMcpRuntimes() {
	await getSessionMcpRuntimeManager().disposeAll();
}
function getSessionMcpRuntimeManagerForTesting() {
	return getSessionMcpRuntimeManager();
}
//#endregion
export { mergeMcpToolCatalogs as _, getOrCreateSessionMcpRuntime as a, rememberAdvertisedScopedMcpCatalog as c, createSessionMcpRuntimeManager as d, setDefaultCreateSessionMcpRuntime as f, mergeMcpConnectCatalog as g, updateMcpAppModelContext as h, getOrCreateRequesterScopedMcpRuntime as i, retireSessionMcpRuntime as l, leaseMcpAppModelContextForTurn as m, disposeAllSessionMcpRuntimes as n, getSessionMcpRuntimeManagerForTesting as o, clearMcpAppModelContextForView as p, getAdvertisedScopedMcpCatalog as r, peekSessionMcpRuntime as s, completeDeferredSessionMcpRuntimeRetirement as t, retireSessionMcpRuntimeForSessionKey as u };
