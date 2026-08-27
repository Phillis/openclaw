import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as allowsProcessHomeSessionScan } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds } from "./agent-scope-config-CUBiGmG3.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { d as getActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import { M as getPluginRegistryRuntime } from "./loader-BcKpDiEM.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Cr as validateSessionsCatalogContinueParams, Er as validateSessionsCatalogStartTerminalParams, Sr as validateSessionsCatalogArchiveParams, Tr as validateSessionsCatalogReadParams, wr as validateSessionsCatalogListParams } from "./src-4dv5TpeQ.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BQC2sTma.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRF7yKG5.js";
import { o as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import "./session-accessor-fcDZuc2H.js";
import { p as recordSessionStateEvent } from "./session-state-events-DvygRPJJ.js";
import { a as upsertSessionUpstreamLink } from "./session-upstream-links-BwxSZt9W.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { _ as createConversationBindingRecord, a as buildPluginBindingIdentity, b as unbindConversationBindingRecord, t as bindConversationNow, v as resolveConversationBindingRecord } from "./conversation-binding-C5Df563Z.js";
import { p as hasMultipleSessionSharingIdentities } from "./user-profiles-CBL8neN1.js";
import { l as projectSessionActor } from "./session-utils-list-D98WVYL8.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as operatorSessionCap, t as authorizeGatewaySessionCreation } from "./operator-role-policy-il7s4lXY.js";
import { g as resolveSessionSharingTarget, h as resolveSessionSharingRole } from "./session-sharing-DSLYm21V.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-0q-ojjmE.js";
import { statSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/plugins/session-conversation-binding.ts
const log = createSubsystemLogger("plugins/binding");
const pluginSessionBindQueue = new KeyedAsyncQueue();
/** Binds a plugin-owned runtime to one authenticated Control UI session. */
async function bindPluginSessionConversation(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) throw new Error("session key is required for a plugin session binding");
	return await pluginSessionBindQueue.enqueue(sessionKey, async () => bindPluginSessionConversationExclusive({
		...params,
		sessionKey
	}));
}
async function bindPluginSessionConversationExclusive(params) {
	const sessionKey = params.sessionKey;
	const conversation = {
		channel: INTERNAL_MESSAGE_CHANNEL,
		accountId: "default",
		conversationId: sessionKey
	};
	const previous = resolveConversationBindingRecord(conversation);
	const bindingAttemptId = crypto.randomUUID();
	const binding = await bindConversationNow({
		identity: buildPluginBindingIdentity(params),
		conversation,
		targetSessionKey: sessionKey,
		summary: params.binding.summary,
		detachHint: params.binding.detachHint,
		data: params.binding.data,
		bindingAttemptId
	});
	try {
		await params.afterBind?.();
		return binding;
	} catch (error) {
		const current = resolveConversationBindingRecord(conversation);
		if (current?.metadata?.bindingAttemptId !== bindingAttemptId) throw error;
		try {
			await unbindConversationBindingRecord({
				bindingId: current.bindingId,
				reason: "plugin-session-bind-rollback"
			});
			if (previous && (previous.expiresAt === void 0 || previous.expiresAt > Date.now())) await createConversationBindingRecord({
				targetSessionKey: previous.targetSessionKey,
				targetKind: previous.targetKind,
				conversation: previous.conversation,
				placement: "current",
				metadata: previous.metadata,
				...previous.expiresAt === void 0 ? {} : { ttlMs: Math.max(1, previous.expiresAt - Date.now()) }
			});
		} catch (rollbackError) {
			log.warn("plugin session binding finalization failed before rollback", { error });
			throw new Error("plugin session binding finalization failed and its previous binding could not be restored", { cause: rollbackError });
		}
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/session-catalog-list-admission.ts
var SessionCatalogListBusyError = class extends Error {
	constructor(maxConcurrent, maxQueued) {
		super(`session catalog is busy (${maxConcurrent} active, ${maxQueued} queued); retry shortly`);
		this.code = "catalog_busy";
		this.name = "SessionCatalogListBusyError";
	}
};
var SessionCatalogListAdmission = class {
	constructor(maxConcurrent, maxQueued) {
		this.maxConcurrent = maxConcurrent;
		this.maxQueued = maxQueued;
		this.active = 0;
		this.queue = [];
		if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1) throw new Error("maxConcurrent must be a positive integer");
		if (!Number.isInteger(maxQueued) || maxQueued < 0) throw new Error("maxQueued must be a non-negative integer");
	}
	run(task) {
		if (this.active < this.maxConcurrent) return this.start(task);
		if (this.queue.length >= this.maxQueued) return Promise.reject(new SessionCatalogListBusyError(this.maxConcurrent, this.maxQueued));
		return new Promise((resolve, reject) => {
			this.queue.push({ start: () => {
				this.start(task).then(resolve, reject);
			} });
		});
	}
	async start(task) {
		this.active += 1;
		try {
			return await task();
		} finally {
			this.active -= 1;
			this.drain();
		}
	}
	drain() {
		while (this.active < this.maxConcurrent) {
			const next = this.queue.shift();
			if (!next) return;
			next.start();
		}
	}
};
//#endregion
//#region src/gateway/server-methods/session-catalog-provider-access.ts
const MAX_CONCURRENT_SESSION_CATALOG_LISTS = 4;
const MAX_QUEUED_SESSION_CATALOG_LISTS = 32;
const PROCESS_HOME_CATALOG_SKIP_MESSAGE = "external session catalog HOME fallback skipped: isolated state; configure an explicit root to enable";
let reportedProcessHomeCatalogSkip = false;
function allowProcessHomeFallback(logGateway) {
	const allowed = allowsProcessHomeSessionScan();
	if (!allowed && !reportedProcessHomeCatalogSkip && logGateway) {
		reportedProcessHomeCatalogSkip = true;
		logGateway.warn(PROCESS_HOME_CATALOG_SKIP_MESSAGE, { reason: "isolated_state" });
	}
	return allowed;
}
const sessionCatalogListAdmission = new SessionCatalogListAdmission(MAX_CONCURRENT_SESSION_CATALOG_LISTS, MAX_QUEUED_SESSION_CATALOG_LISTS);
function listSessionCatalogProvider(provider, params) {
	return sessionCatalogListAdmission.run(() => provider.list(params));
}
function resolveSessionCatalogRegistry() {
	return getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry();
}
function createSessionCatalogRequestNodeSnapshot() {
	const registry = resolveSessionCatalogRegistry();
	const nodes = registry ? getPluginRegistryRuntime(registry)?.nodes : void 0;
	let request;
	return () => {
		request ??= nodes?.list() ?? Promise.reject(/* @__PURE__ */ new Error("Plugin node runtime is only available inside the Gateway."));
		return request;
	};
}
//#endregion
//#region src/gateway/server-methods/session-catalog-entry-snapshot.ts
function createSessionCatalogRequestEntrySnapshot(params) {
	const entriesByAgentId = /* @__PURE__ */ new Map();
	const entryIndexByAgentId = /* @__PURE__ */ new Map();
	const actorBySessionKey = /* @__PURE__ */ new Map();
	let catalogEntries;
	const entriesForAgent = (rawAgentId) => {
		const agentId = normalizeAgentId(rawAgentId);
		if (!entriesByAgentId.has(agentId)) entriesByAgentId.set(agentId, listSessionEntriesReadOnly({
			agentId,
			clone: false,
			projection: "list"
		}));
		return entriesByAgentId.get(agentId) ?? [];
	};
	const entriesForCatalog = () => {
		if (catalogEntries) return catalogEntries;
		catalogEntries = [params.fallbackAgentId, ...listAgentIds(params.cfg).filter((agentId) => agentId !== params.fallbackAgentId)].flatMap((agentId) => entriesForAgent(agentId).map((entry) => Object.assign({}, entry, { agentId })));
		return catalogEntries;
	};
	const entryIndexForAgent = (agentId) => {
		const normalizedAgentId = normalizeAgentId(agentId);
		const cached = entryIndexByAgentId.get(normalizedAgentId);
		if (cached) return cached;
		const index = new Map(entriesForAgent(normalizedAgentId).map(({ sessionKey, entry }) => [sessionKey, entry]));
		entryIndexByAgentId.set(normalizedAgentId, index);
		return index;
	};
	const createdActorForSession = (sessionKey) => {
		const agentId = resolveAgentIdFromSessionKey(sessionKey, tryResolveSessionCompatibilityOwnerAgentId(params.cfg, sessionKey) ?? params.fallbackAgentId);
		const actorCacheKey = `${agentId}\0${sessionKey}`;
		if (actorBySessionKey.has(actorCacheKey)) return actorBySessionKey.get(actorCacheKey);
		const index = entryIndexForAgent(agentId);
		const canonicalKey = resolveStoredSessionKeyForAgentStore({
			cfg: params.cfg,
			agentId,
			sessionKey
		});
		const candidates = /* @__PURE__ */ new Set([sessionKey, canonicalKey]);
		let freshest;
		for (const key of candidates) {
			const entry = index.get(key);
			if (entry && (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0))) freshest = entry;
		}
		const actor = projectSessionActor(freshest?.createdActor, void 0, params.cfg);
		actorBySessionKey.set(actorCacheKey, actor);
		return actor;
	};
	return {
		sessionEntries: {
			entriesForAgent,
			entriesForCatalog
		},
		projectHostCreatedActors: (host) => ({
			...host,
			sessions: host.sessions.map(({ createdActor: _providerCreatedActor, ...session }) => {
				const createdActor = session.sessionKey ? createdActorForSession(session.sessionKey) : void 0;
				return createdActor ? {
					...session,
					createdActor
				} : session;
			})
		})
	};
}
//#endregion
//#region src/gateway/server-methods/session-catalog-visibility.ts
function resolveSessionCatalogVisibility(client, config) {
	const admin = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).allowed;
	const multipleIdentities = hasMultipleSessionSharingIdentities();
	const profileId = client?.authenticatedUserProfile?.profileId;
	const others = admin ? void 0 : operatorSessionCap(client, config);
	const cacheKey = JSON.stringify({
		admin,
		multipleIdentities,
		profileId: profileId ?? null,
		others: others ?? null
	});
	if (admin || !multipleIdentities && !others) return {
		cacheKey,
		kind: "unrestricted"
	};
	if (!profileId) return {
		cacheKey,
		kind: "restricted-unprofiled"
	};
	return others && others !== "none" ? {
		cacheKey,
		kind: "restricted-shared",
		others,
		ownerProfileId: profileId
	} : {
		cacheKey,
		kind: "restricted-owner",
		ownerProfileId: profileId
	};
}
function isSharedCatalogSessionVisible(params) {
	if (params.session.createdActor?.id === params.visibility.ownerProfileId) return true;
	const sessionKey = params.session.sessionKey;
	if (!params.session.createdActor?.id || !sessionKey || isIncognitoSessionKey(sessionKey)) return false;
	const agentId = resolveAgentIdFromSessionKey(sessionKey, tryResolveSessionCompatibilityOwnerAgentId(params.config, sessionKey) ?? params.fallbackAgentId);
	const canonicalKey = resolveStoredSessionKeyForAgentStore({
		cfg: params.config,
		agentId,
		sessionKey
	});
	const entry = params.sessionEntries.entriesForAgent(agentId).find((candidate) => candidate.sessionKey === sessionKey || candidate.sessionKey === canonicalKey)?.entry;
	return entry !== void 0 && entry.visibility !== "draft" && entry.incognito !== true;
}
function filterSessionCatalogHost(host, visibility, params) {
	if (visibility.kind === "unrestricted") return host;
	if (visibility.kind === "restricted-unprofiled") return {
		...host,
		sessions: []
	};
	return {
		...host,
		sessions: host.sessions.filter((session) => {
			return visibility.kind === "restricted-shared" ? isSharedCatalogSessionVisible({
				...params,
				session,
				visibility
			}) : session.createdActor?.id === visibility.ownerProfileId;
		})
	};
}
async function isSessionCatalogThreadVisible(params) {
	if (params.visibility.kind === "unrestricted") return true;
	if (params.visibility.kind === "restricted-unprofiled") return false;
	const requestEntries = createSessionCatalogRequestEntrySnapshot({
		cfg: params.config,
		fallbackAgentId: params.fallbackAgentId
	});
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	while (true) {
		const host = (await params.list({
			agentId: params.fallbackAgentId,
			allowProcessHomeFallback: params.allowProcessHomeFallback,
			hostIds: [params.hostId],
			...cursor ? { cursors: { [params.hostId]: cursor } } : {},
			sessionEntries: requestEntries.sessionEntries,
			listNodes: params.listNodes
		})).find((candidate) => candidate.hostId === params.hostId);
		if (!host) return false;
		const session = requestEntries.projectHostCreatedActors(host).sessions.find((candidate) => candidate.threadId === params.threadId && (!params.sourceHomeId || candidate.sourceHomeId === params.sourceHomeId));
		if (session) {
			if (params.visibility.kind === "restricted-owner") return session.createdActor?.id === params.visibility.ownerProfileId;
			if (!isSharedCatalogSessionVisible({
				config: params.config,
				fallbackAgentId: params.fallbackAgentId,
				session,
				sessionEntries: requestEntries.sessionEntries,
				visibility: params.visibility
			})) return false;
			if (params.access === "read" || params.visibility.others === "write" || session.createdActor?.id === params.visibility.ownerProfileId) return true;
			const target = session.sessionKey ? resolveSessionSharingTarget({
				cfg: params.config,
				sessionKey: session.sessionKey
			}) : null;
			return target !== null && resolveSessionSharingRole({
				cfg: params.config,
				client: params.client,
				target
			}) === "member";
		}
		const nextCursor = host.nextCursor;
		if (!nextCursor || seenCursors.has(nextCursor)) return false;
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
}
//#endregion
//#region src/gateway/server-methods/session-catalog-authorization.ts
async function authorizeSessionCatalogThread(params) {
	const config = params.context.getRuntimeConfig();
	const allowHomeFallback = allowProcessHomeFallback(params.context.logGateway);
	const visibility = resolveSessionCatalogVisibility(params.client, config);
	if (await isSessionCatalogThreadVisible({
		access: params.access,
		allowProcessHomeFallback: allowHomeFallback,
		client: params.client,
		config,
		fallbackAgentId: params.agentId,
		hostId: params.request.hostId,
		list: (request) => listSessionCatalogProvider(params.provider, {
			...request,
			agentId: params.agentId
		}),
		listNodes: createSessionCatalogRequestNodeSnapshot(),
		...params.request.sourceHomeId ? { sourceHomeId: params.request.sourceHomeId } : {},
		threadId: params.request.threadId,
		visibility
	})) return { allowProcessHomeFallback: allowHomeFallback };
	params.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "session catalog thread is not visible to this caller"));
	return null;
}
//#endregion
//#region src/gateway/server-methods/session-catalog-terminal-start.ts
/** Builds the catalog terminal-start handler around the active provider registry. */
function catalogStartHandler(resolveProvider, resolveCreateTarget) {
	return async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateSessionsCatalogStartTerminalParams, "sessions.catalog.startTerminal", respond)) return;
		const request = params;
		const config = context.getRuntimeConfig();
		if (config.gateway?.cliAgents?.enabled !== true) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "CLI agent terminal start is disabled; enable gateway.cliAgents.enabled and retry"));
			return;
		}
		if (!context.isTerminalEnabled()) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is disabled; enable gateway.terminal.enabled and retry"));
			return;
		}
		if (!context.terminalSessions) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available; restart the Gateway with terminal support and retry"));
			return;
		}
		const provider = resolveProvider(request.catalogId);
		if (!provider) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${request.catalogId}`));
			return;
		}
		if (!provider.startTerminalSession) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session catalog cannot start terminal sessions; choose a catalog that advertises createSession.startTerminal"));
			return;
		}
		const creationError = authorizeGatewaySessionCreation({
			cfg: config,
			client: opts.client,
			agentId: request.agentId
		});
		if (creationError) {
			respond(false, void 0, creationError);
			return;
		}
		const createTarget = resolveCreateTarget(request.catalogId, request.agentId, config);
		if (!createTarget.ok) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, createTarget.message));
			return;
		}
		let nodeId;
		if (request.hostId && request.hostId !== "gateway:local") {
			nodeId = request.hostId.startsWith("node:") ? request.hostId.slice(5).trim() : void 0;
			if (!nodeId || request.hostId !== `node:${nodeId}`) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid catalog host; choose \"gateway:local\" or a listed \"node:<id>\" host and retry"));
				return;
			}
		}
		if (!nodeId) {
			let cwdIsDirectory = false;
			try {
				cwdIsDirectory = path.isAbsolute(request.cwd) && statSync(request.cwd).isDirectory();
			} catch {}
			if (!cwdIsDirectory) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cwd must be an existing absolute directory; create or choose a worktree and retry"));
				return;
			}
		}
		const startTerminalSession = provider.startTerminalSession;
		const { openTerminalSession, CATALOG_TERMINAL_INITIAL_SIZE } = await import("./terminal-Bsj6WzE7.js");
		await openTerminalSession(opts, {
			agentId: request.agentId,
			...CATALOG_TERMINAL_INITIAL_SIZE,
			...!nodeId ? { requiredCwd: request.cwd } : {},
			failureHint: "check the selected CLI, host, and terminal configuration, then retry",
			resolveCatalogPlan: async () => {
				const plan = await startTerminalSession.call(provider, {
					allowProcessHomeFallback: allowsProcessHomeSessionScan(),
					agentId: request.agentId,
					cwd: request.cwd,
					...request.initialMessage !== void 0 ? { initialMessage: request.initialMessage } : {},
					...nodeId ? { nodeId } : {}
				});
				if (plan.cwd !== request.cwd) throw new Error("session catalog did not preserve the requested cwd; choose the worktree again and retry");
				if (nodeId && (plan.kind !== "node" || plan.nodeId !== nodeId)) throw new Error("session catalog cannot start on the selected node; choose a supported host and retry");
				if (!nodeId && plan.kind !== "local") throw new Error("session catalog returned a remote plan for the local host; select its \"node:<id>\" host and retry");
				return plan;
			},
			catalogFailureMessage: "catalog terminal start failed"
		});
	};
}
//#endregion
//#region src/gateway/server-methods/session-catalog.ts
const SESSION_CATALOG_SEARCH_MAX_UTF16_UNITS = 500;
const SESSION_CATALOG_SHARE_WINDOW_MS = 3e3;
const SESSION_CATALOG_LIST_CACHE_MAX_ENTRIES = 128;
function normalizeSessionCatalogSearch(search) {
	const normalized = normalizeOptionalString(search);
	return normalized ? truncateUtf16Safe(normalized, SESSION_CATALOG_SEARCH_MAX_UTF16_UNITS) : void 0;
}
function catalogError(error) {
	const record = error && typeof error === "object" ? error : void 0;
	const recordMessage = typeof record?.message === "string" ? record.message.trim() : "";
	const fallbackMessage = typeof error === "string" ? error.trim() : "";
	return {
		code: typeof record?.code === "string" && record.code ? record.code : "catalog_error",
		message: recordMessage || fallbackMessage || "session catalog provider failed"
	};
}
let cachedCatalogRegistrations;
function catalogRegistrationSnapshot() {
	const registry = resolveSessionCatalogRegistry();
	const source = registry?.sessionCatalogs;
	if (cachedCatalogRegistrations?.registry === registry && cachedCatalogRegistrations.source === source) return cachedCatalogRegistrations;
	const sortedRegistrations = (source ?? []).toSorted((left, right) => left.provider.id.localeCompare(right.provider.id));
	cachedCatalogRegistrations = {
		registry,
		source,
		registrations: sortedRegistrations,
		providers: sortedRegistrations.map((entry) => entry.provider)
	};
	return cachedCatalogRegistrations;
}
function providers() {
	return catalogRegistrationSnapshot().providers;
}
function resolveSessionCatalogProvider(catalogId) {
	return providers().find((candidate) => candidate.id === catalogId);
}
function registrations() {
	return catalogRegistrationSnapshot().registrations;
}
const providerCreateTargetsByConfig = /* @__PURE__ */ new WeakMap();
const catalogListsByConfig = /* @__PURE__ */ new WeakMap();
function providerCreateTargetCache(config, provider) {
	let byProvider = providerCreateTargetsByConfig.get(config);
	if (!byProvider) {
		byProvider = /* @__PURE__ */ new WeakMap();
		providerCreateTargetsByConfig.set(config, byProvider);
	}
	let byAgent = byProvider.get(provider);
	if (!byAgent) {
		byAgent = /* @__PURE__ */ new Map();
		byProvider.set(provider, byAgent);
	}
	return byAgent;
}
function resolveProviderCreateTarget(provider, agentId, config) {
	const cache = providerCreateTargetCache(config, provider);
	const cached = cache.get(agentId);
	if (cached) return cached;
	let resolution;
	try {
		const target = provider.resolveCreateSession?.({ agentId });
		const model = target?.model.trim();
		const agentRuntime = target?.agentRuntime.trim();
		resolution = model && agentRuntime ? {
			ok: true,
			target: {
				model,
				agentRuntime
			}
		} : {
			ok: false,
			message: `session catalog ${provider.id} cannot create sessions`
		};
	} catch (error) {
		return {
			ok: false,
			message: catalogError(error).message
		};
	}
	cache.set(agentId, resolution);
	return resolution;
}
/** Resolves a catalog-owned create target at the start of sessions.create. */
function resolveRegisteredCatalogCreateTarget(catalogId, agentId, config) {
	const registration = registrations().find((entry) => entry.provider.id === catalogId);
	if (!registration) return {
		ok: false,
		message: `unknown session catalog: ${catalogId}`,
		unknownCatalog: true
	};
	const resolved = resolveProviderCreateTarget(registration.provider, agentId, config);
	return resolved.ok ? {
		ok: true,
		target: {
			...resolved.target,
			pluginOwnerId: registration.pluginId
		}
	} : resolved;
}
function sessionCatalogListKey(params) {
	const cursors = params.request.cursors ? Object.entries(params.request.cursors).toSorted(([left], [right]) => left.localeCompare(right)) : null;
	return JSON.stringify([
		params.agentId,
		params.request.catalogId ?? null,
		params.search ?? null,
		params.request.limitPerHost ?? null,
		params.request.hostIds ?? null,
		cursors,
		params.allowProcessHomeFallback,
		params.visibilityKey
	]);
}
function catalogListCache(config, registrationSnapshot) {
	let state = catalogListsByConfig.get(config);
	if (!state || state.registrations !== registrationSnapshot) {
		state = {
			registrations: registrationSnapshot,
			entries: /* @__PURE__ */ new Map()
		};
		catalogListsByConfig.set(config, state);
	}
	return state.entries;
}
function providerOrRespond(catalogId, respond) {
	const provider = resolveSessionCatalogProvider(catalogId);
	if (!provider) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${catalogId}`));
	return provider;
}
async function authorizeCatalogRequest(params) {
	const resolvedAgent = resolveAgentIdOrRespondError({
		rawAgentId: params.request.agentId,
		respond: params.respond,
		cfg: params.context.getRuntimeConfig(),
		normalize: normalizeOptionalString
	});
	if (!resolvedAgent) return null;
	const authorization = await authorizeSessionCatalogThread({
		access: params.access,
		agentId: resolvedAgent.agentId,
		client: params.client,
		context: params.context,
		provider: params.provider,
		request: params.request,
		respond: params.respond
	});
	return authorization ? {
		agentId: resolvedAgent.agentId,
		...authorization
	} : null;
}
function registrationOrRespond(catalogId, respond) {
	const registration = registrations().find((candidate) => candidate.provider.id === catalogId);
	if (!registration) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${catalogId}`));
	return registration;
}
function catalogResult(provider, hosts, error, createSession) {
	const result = {
		id: provider.id,
		label: provider.label,
		capabilities: {
			continueSession: Boolean(provider.continueSession),
			archive: Boolean(provider.archive),
			...provider.openTerminal ? { openTerminal: true } : {},
			...createSession ? { createSession } : {}
		},
		hosts
	};
	if (error) result.error = error;
	return result;
}
const sessionCatalogHandlers = {
	"sessions.catalog.list": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsCatalogListParams, "sessions.catalog.list", respond)) return;
		const request = params;
		if (request.cursors !== void 0 && request.catalogId === void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "catalogId is required when cursors are provided"));
			return;
		}
		const catalogRegistrations = catalogRegistrationSnapshot();
		let selected;
		if (request.catalogId) {
			const provider = catalogRegistrations.providers.find((candidate) => candidate.id === request.catalogId);
			if (!provider) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${request.catalogId}`));
				return;
			}
			selected = [provider];
		} else selected = catalogRegistrations.providers;
		const config = context.getRuntimeConfig();
		const resolvedAgent = resolveAgentIdOrRespondError({
			rawAgentId: request.agentId,
			respond,
			cfg: config,
			normalize: normalizeOptionalString
		});
		if (!resolvedAgent) return;
		const search = normalizeSessionCatalogSearch(request.search);
		const allowHomeFallback = allowProcessHomeFallback(context.logGateway);
		const visibility = resolveSessionCatalogVisibility(client, config);
		const progressId = request.progressId;
		const progressConnId = progressId && client?.connId ? client.connId : void 0;
		const listKey = sessionCatalogListKey({
			agentId: resolvedAgent.agentId,
			request,
			search,
			allowProcessHomeFallback: allowHomeFallback,
			visibilityKey: visibility.cacheKey
		});
		const cache = catalogListCache(config, catalogRegistrations);
		const cached = cache.get(listKey);
		if (cached && (cached.expiresAt === void 0 || cached.expiresAt > Date.now())) {
			if (cached.expiresAt === void 0 && progressConnId && progressId) cached.progressSubscribers.set(`${progressConnId}\0${progressId}`, {
				broadcastToConnIds: context.broadcastToConnIds,
				connId: progressConnId,
				progressId
			});
			cache.delete(listKey);
			cache.set(listKey, cached);
			respond(true, await cached.result);
			return;
		}
		if (cached) cache.delete(listKey);
		const progressSubscribers = /* @__PURE__ */ new Map();
		if (progressConnId && progressId) progressSubscribers.set(`${progressConnId}\0${progressId}`, {
			broadcastToConnIds: context.broadcastToConnIds,
			connId: progressConnId,
			progressId
		});
		const operation = (async () => {
			const requestEntries = createSessionCatalogRequestEntrySnapshot({
				cfg: config,
				fallbackAgentId: resolvedAgent.agentId
			});
			const listNodes = createSessionCatalogRequestNodeSnapshot();
			return { catalogs: await Promise.all(selected.map(async (provider) => {
				const createTarget = resolveProviderCreateTarget(provider, resolvedAgent.agentId, config);
				const createSession = createTarget.ok ? {
					model: createTarget.target.model,
					...provider.startTerminalSession ? { startTerminal: true } : {}
				} : void 0;
				const onHost = (host) => {
					const catalog = catalogResult(provider, [filterSessionCatalogHost(requestEntries.projectHostCreatedActors(host), visibility, {
						config,
						fallbackAgentId: resolvedAgent.agentId,
						sessionEntries: requestEntries.sessionEntries
					})], void 0, createSession);
					for (const subscriber of progressSubscribers.values()) subscriber.broadcastToConnIds("sessions.catalog.host", {
						progressId: subscriber.progressId,
						agentId: resolvedAgent.agentId,
						catalog
					}, /* @__PURE__ */ new Set([subscriber.connId]), { dropIfSlow: true });
				};
				try {
					return catalogResult(provider, (await listSessionCatalogProvider(provider, {
						agentId: resolvedAgent.agentId,
						allowProcessHomeFallback: allowHomeFallback,
						search,
						limitPerHost: request.limitPerHost,
						hostIds: request.hostIds,
						...request.cursors !== void 0 ? { cursors: request.cursors } : {},
						sessionEntries: requestEntries.sessionEntries,
						listNodes,
						onHost
					})).map((host) => filterSessionCatalogHost(requestEntries.projectHostCreatedActors(host), visibility, {
						config,
						fallbackAgentId: resolvedAgent.agentId,
						sessionEntries: requestEntries.sessionEntries
					})), void 0, createSession);
				} catch (error) {
					return catalogResult(provider, [], catalogError(error), createSession);
				}
			})) };
		})();
		const entry = {
			progressSubscribers,
			result: operation
		};
		cache.set(listKey, entry);
		pruneMapToMaxSize(cache, SESSION_CATALOG_LIST_CACHE_MAX_ENTRIES);
		try {
			const result = await operation;
			if (cache.get(listKey) === entry) entry.expiresAt = Date.now() + SESSION_CATALOG_SHARE_WINDOW_MS;
			respond(true, result);
		} catch (error) {
			if (cache.get(listKey) === entry) cache.delete(listKey);
			throw error;
		} finally {
			progressSubscribers.clear();
		}
	},
	"sessions.catalog.read": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsCatalogReadParams, "sessions.catalog.read", respond)) return;
		const request = params;
		const provider = providerOrRespond(request.catalogId, respond);
		if (!provider) return;
		try {
			const authorization = await authorizeCatalogRequest({
				access: "read",
				request,
				provider,
				respond,
				context,
				client
			});
			if (!authorization) return;
			const { catalogId: _catalogId, ...providerRequest } = request;
			respond(true, await provider.read({
				...providerRequest,
				agentId: authorization.agentId,
				allowProcessHomeFallback: authorization.allowProcessHomeFallback
			}));
		} catch (error) {
			const details = catalogError(error);
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, details.message, { details }));
		}
	},
	"sessions.catalog.continue": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionsCatalogContinueParams, "sessions.catalog.continue", respond)) return;
		const request = params;
		const registration = registrationOrRespond(request.catalogId, respond);
		if (!registration) return;
		const provider = registration.provider;
		if (!provider.continueSession) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "catalog is view-only"));
			return;
		}
		try {
			const authorization = await authorizeCatalogRequest({
				access: "mutate",
				request,
				provider,
				respond,
				context,
				client
			});
			if (!authorization) return;
			const creationError = authorizeGatewaySessionCreation({
				cfg: context.getRuntimeConfig(),
				client,
				agentId: authorization.agentId
			});
			if (creationError) {
				respond(false, void 0, creationError);
				return;
			}
			const { catalogId: _catalogId, ...providerRequest } = request;
			const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
			const result = await provider.continueSession({
				...providerRequest,
				agentId: authorization.agentId,
				allowProcessHomeFallback: authorization.allowProcessHomeFallback,
				clientScopes
			});
			if (result.conversationBinding) await bindPluginSessionConversation({
				pluginId: registration.pluginId,
				pluginName: registration.pluginName,
				pluginRoot: registration.rootDir?.trim() || registration.source,
				sessionKey: result.sessionKey,
				binding: result.conversationBinding,
				afterBind: result.afterConversationBound
			});
			const agentId = resolveAgentIdFromSessionKey(result.sessionKey);
			if (result.upstream) upsertSessionUpstreamLink({
				sessionKey: result.sessionKey,
				agentId,
				catalogId: request.catalogId,
				hostId: request.hostId,
				threadId: request.threadId,
				upstreamKind: result.upstream.kind,
				upstreamRef: result.upstream.ref,
				marker: result.upstream.marker
			});
			recordSessionStateEvent({
				sessionKey: result.sessionKey,
				agentId,
				kind: "adopted",
				actorType: "human",
				dedupeKey: `adopted:${result.sessionKey}`,
				summary: `adopted from ${request.catalogId}`,
				payload: {
					catalogId: request.catalogId,
					hostId: request.hostId
				}
			});
			respond(true, { sessionKey: result.sessionKey });
		} catch (error) {
			const details = catalogError(error);
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, details.message, { details }));
		}
	},
	"sessions.catalog.startTerminal": catalogStartHandler(resolveSessionCatalogProvider, resolveRegisteredCatalogCreateTarget),
	"sessions.catalog.archive": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsCatalogArchiveParams, "sessions.catalog.archive", respond)) return;
		const request = params;
		const provider = providerOrRespond(request.catalogId, respond);
		if (!provider) return;
		if (!provider.archive) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "catalog cannot archive"));
			return;
		}
		try {
			const authorization = await authorizeCatalogRequest({
				access: "mutate",
				request,
				provider,
				respond,
				context,
				client
			});
			if (!authorization) return;
			const { catalogId: _catalogId, ...providerRequest } = request;
			respond(true, await provider.archive({
				...providerRequest,
				agentId: authorization.agentId,
				allowProcessHomeFallback: authorization.allowProcessHomeFallback
			}));
		} catch (error) {
			const details = catalogError(error);
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, details.message, { details }));
		}
	}
};
//#endregion
export { resolveSessionCatalogProvider as n, sessionCatalogHandlers as r, resolveRegisteredCatalogCreateTarget as t };
