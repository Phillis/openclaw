import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-D9GLFAyB.js";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Pt as listSessionEntriesCore } from "./session-accessor-CIiPoGwM.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CdQ3kEkv.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { c as isSessionMember } from "./sessions-Bh837xaa.js";
import { A as resolveCanonicalSessionStoreMatchFromStoreKeys, N as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-row-xwseApeF.js";
import "./session-utils-DvNvk7rk.js";
import { a as verifyBoardViewTicket } from "./board-view-ticket-BF1ZeJAn.js";
//#region src/gateway/server-methods/gateway-client-identity.ts
function gatewayClientSenderFields(client) {
	if (client?.internal?.senderAttribution) return { sender: client.internal.senderAttribution };
	const profile = client?.authenticatedUserProfile;
	if (profile) return { sender: {
		id: profile.profileId,
		...profile.displayName ? { name: profile.displayName } : {}
	} };
	return client?.authenticatedUserId ? { sender: { id: client.authenticatedUserId } } : {};
}
/** Returns the same durable human profile identity used for session creation attribution. */
function gatewayClientSessionCreator(client) {
	const profile = client?.authenticatedUserProfile;
	return profile ? {
		type: "human",
		id: profile.profileId,
		...profile.displayName ? { label: profile.displayName } : {}
	} : void 0;
}
//#endregion
//#region src/gateway/session-sharing-snapshot-cache.ts
const SNAPSHOT_CACHE_LIMIT = 2048;
const snapshotCache = /* @__PURE__ */ new Map();
const snapshotAliases = /* @__PURE__ */ new Map();
const snapshotKeysBySessionKey = /* @__PURE__ */ new Map();
const aliasKeysBySessionKey = /* @__PURE__ */ new Map();
const aliasKeysByCanonicalKey = /* @__PURE__ */ new Map();
function snapshotKey(sessionKey, agentId) {
	return `${agentId ?? ""}\0${sessionKey}`;
}
function logicalSessionKey(key) {
	return key.slice(key.lastIndexOf("\0") + 1);
}
function addReverseIndex(index, key, value) {
	const values = index.get(key) ?? /* @__PURE__ */ new Set();
	values.add(value);
	index.set(key, values);
}
function removeReverseIndex(index, key, value) {
	const values = index.get(key);
	values?.delete(value);
	if (values?.size === 0) index.delete(key);
}
function removeSnapshotAlias(alias) {
	const canonical = snapshotAliases.get(alias);
	if (!canonical) return;
	snapshotAliases.delete(alias);
	removeReverseIndex(aliasKeysBySessionKey, logicalSessionKey(alias), alias);
	removeReverseIndex(aliasKeysByCanonicalKey, canonical, alias);
}
function removeSnapshot(key) {
	if (!snapshotCache.delete(key)) return;
	removeReverseIndex(snapshotKeysBySessionKey, logicalSessionKey(key), key);
	for (const alias of aliasKeysByCanonicalKey.get(key) ?? []) removeSnapshotAlias(alias);
}
function rememberSnapshot(key, snapshot) {
	const known = snapshotCache.delete(key);
	snapshotCache.set(key, snapshot);
	if (!known) addReverseIndex(snapshotKeysBySessionKey, logicalSessionKey(key), key);
	if (snapshotCache.size <= SNAPSHOT_CACHE_LIMIT) return;
	const oldest = snapshotCache.keys().next().value;
	if (oldest) removeSnapshot(oldest);
}
function rememberSnapshotAlias(alias, canonical) {
	removeSnapshotAlias(alias);
	snapshotAliases.set(alias, canonical);
	addReverseIndex(aliasKeysBySessionKey, logicalSessionKey(alias), alias);
	addReverseIndex(aliasKeysByCanonicalKey, canonical, alias);
	if (snapshotAliases.size <= SNAPSHOT_CACHE_LIMIT * 2) return;
	const oldest = snapshotAliases.keys().next().value;
	if (oldest) removeSnapshotAlias(oldest);
}
function invalidateSessionSharingSnapshot(sessionKey) {
	if (sessionKey) {
		const matchingCanonicalKeys = new Set(snapshotKeysBySessionKey.get(sessionKey));
		for (const alias of aliasKeysBySessionKey.get(sessionKey) ?? []) {
			const canonical = snapshotAliases.get(alias);
			if (canonical) matchingCanonicalKeys.add(canonical);
		}
		for (const key of matchingCanonicalKeys) removeSnapshot(key);
		return;
	}
	snapshotCache.clear();
	snapshotAliases.clear();
	snapshotKeysBySessionKey.clear();
	aliasKeysBySessionKey.clear();
	aliasKeysByCanonicalKey.clear();
}
function loadCachedSessionSharingSnapshot(params) {
	const requestedKey = snapshotKey(params.sessionKey, params.agentId);
	const aliasedKey = snapshotAliases.get(requestedKey);
	const cached = snapshotCache.get(aliasedKey ?? requestedKey);
	if (cached) return cached;
	const resolved = params.resolve();
	const canonicalKey = snapshotKey(resolved.canonicalKey, resolved.canonicalAgentId);
	const canonicalCached = snapshotCache.get(canonicalKey);
	if (canonicalCached) {
		rememberSnapshotAlias(requestedKey, canonicalKey);
		return canonicalCached;
	}
	rememberSnapshot(canonicalKey, resolved.snapshot);
	rememberSnapshotAlias(requestedKey, canonicalKey);
	return resolved.snapshot;
}
//#endregion
//#region src/gateway/session-sharing-target-input.ts
function resolveDirectIncognitoTargets(method, params) {
	if (method === "sessions.create" || method === "sessions.list") return [];
	if (!params || typeof params !== "object" || Array.isArray(params)) return [];
	const record = params;
	const candidates = [record.key, record.sessionKey];
	if (Array.isArray(record.keys)) candidates.push(...record.keys);
	if (Array.isArray(record.sessionKeys)) candidates.push(...record.sessionKeys);
	const agentId = normalizeOptionalString(record.agentId);
	return candidates.flatMap((candidate) => typeof candidate === "string" && isIncognitoSessionKey(candidate) ? [{
		sessionKey: candidate,
		...agentId ? { agentId } : {}
	}] : []);
}
function readSessionSharingStringParam(params, key) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return;
	return normalizeOptionalString(params[key]);
}
//#endregion
//#region src/gateway/session-sharing.ts
var SessionMutationAuthorizationChangedError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = "SessionMutationAuthorizationChangedError";
		this.error = error;
	}
};
function resolveSessionVisibility(entry) {
	return entry.visibility ?? "shared";
}
function isGatewayAdmin(client) {
	return client?.connect?.scopes?.includes("operator.admin") === true;
}
function allowedSessionVisibilities(cfg) {
	const policy = cfg.session?.sharing;
	return [
		"shared",
		...policy?.readOnly === false ? [] : ["read-only"],
		...policy?.suggest === false ? [] : ["suggest"],
		...policy?.drafts === false ? [] : ["draft"]
	];
}
function isSessionVisibilityAllowed(cfg, visibility) {
	return allowedSessionVisibilities(cfg).includes(visibility);
}
function resolveSessionSharingTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false,
		...params.projection ? { projection: params.projection } : {},
		...params.storeCache ? { storeCache: params.storeCache } : {},
		...params.targetDiscoveryCache ? { targetDiscoveryCache: params.targetDiscoveryCache } : {}
	});
	const match = resolveCanonicalSessionStoreMatchFromStoreKeys(target.store, target.storeKeys);
	return match ? {
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		entry: match.entry,
		storeKey: match.key,
		storeKeys: target.storeKeys,
		storePath: target.storePath
	} : null;
}
function resolveSessionSharingRole(params) {
	if (isGatewayAdmin(params.client)) return "admin";
	const identity = gatewayClientSessionCreator(params.client);
	if (!identity) return "owner";
	if (params.target.entry.createdActor?.id === identity.id) return "owner";
	if (params.isMember !== void 0) return params.isMember ? "member" : "viewer";
	if (params.includeMembership === false) return "viewer";
	if (isSessionMember({
		agentId: params.target.agentId,
		sessionKey: params.target.storeKey,
		storePath: params.target.storePath
	}, identity.id)) return "member";
	return "viewer";
}
function canManageSessionSharing(role) {
	return role === "admin" || role === "owner";
}
function canMutateSession(params) {
	if (params.visibility === "draft") return params.role === "admin" || params.role === "owner";
	return params.visibility === "shared" || params.role !== "viewer";
}
function incognitoSessionNotFound(sessionKey) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `Incognito session "${sessionKey}" was not found.`);
}
function authorizeIncognitoSessionTarget(params) {
	if (!(params.target ? params.target.entry.incognito === true || isIncognitoSessionKey(params.target.canonicalKey) : isIncognitoSessionKey(params.sessionKey))) return null;
	if (isGatewayAdmin(params.client)) return null;
	if (!gatewayClientSessionCreator(params.client)) return null;
	return incognitoSessionNotFound(params.sessionKey);
}
function canAccessIncognitoSession(params) {
	if (isGatewayAdmin(params.client)) return true;
	return authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target: resolveSessionSharingTarget(params)
	}) === null;
}
function authorizeResolvedSessionMutation(params) {
	if (isGatewayAdmin(params.client)) return null;
	const target = resolveSessionSharingTarget(params);
	const incognitoError = authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target
	});
	if (incognitoError) return incognitoError;
	if (!target) return null;
	return authorizeSessionSharingTarget({
		client: params.client,
		target
	});
}
function authorizeSessionSharingTarget(params) {
	const visibility = resolveSessionVisibility(params.target.entry);
	return canMutateSession({
		role: resolveSessionSharingRole({
			client: params.client,
			target: params.target
		}),
		visibility
	}) ? null : errorShape(ErrorCodes.INVALID_REQUEST, `session is ${visibility} for this connection`, { details: {
		code: "SESSION_PARTICIPATION_REQUIRED",
		sessionKey: params.target.canonicalKey,
		visibility
	} });
}
const SESSION_KEY_PARAM_BY_METHOD = /* @__PURE__ */ new Map([
	["agent", "sessionKey"],
	["board.event", "sessionKey"],
	["board.update", "sessionKey"],
	["board.widget.grant", "sessionKey"],
	["board.widget.put", "sessionKey"],
	["chat.abort", "sessionKey"],
	["chat.inject", "sessionKey"],
	["chat.send", "sessionKey"],
	["message.action", "sessionKey"],
	["plugins.sessionAction", "sessionKey"],
	["send", "sessionKey"],
	["session.discussion.open", "sessionKey"],
	["sessions.abort", "key"],
	["sessions.compaction.branch", "key"],
	["sessions.compaction.restore", "key"],
	["sessions.compact", "key"],
	["sessions.delete", "key"],
	["sessions.dispatch", "key"],
	["sessions.files.set", "sessionKey"],
	["sessions.fork", "key"],
	["sessions.patch", "key"],
	["sessions.pluginPatch", "key"],
	["sessions.reclaim", "key"],
	["sessions.reset", "key"],
	["sessions.rewind", "key"],
	["sessions.send", "key"],
	["sessions.steer", "key"],
	["sessions.branches.switch", "key"],
	["tools.invoke", "sessionKey"]
]);
const REQUIRED_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set([
	"board.action",
	"board.event",
	"board.update",
	"board.widget.grant",
	"board.widget.put",
	"chat.abort",
	"chat.inject",
	"chat.send",
	"session.discussion.open",
	"sessions.abort",
	"sessions.branches.switch",
	"sessions.compact",
	"sessions.compaction.branch",
	"sessions.compaction.restore",
	"sessions.delete",
	"sessions.dispatch",
	"sessions.files.set",
	"sessions.fork",
	"sessions.groups.delete",
	"sessions.groups.rename",
	"sessions.patch",
	"sessions.pluginPatch",
	"sessions.reclaim",
	"sessions.reset",
	"sessions.rewind",
	"sessions.send",
	"sessions.steer"
]);
function resolveSessionGroupMutationTargets(params) {
	const groupName = readSessionSharingStringParam(params.requestParams, "name");
	if (!groupName) return;
	return resolveAllAgentSessionStoreTargetsSync(params.getCfg()).flatMap((storeTarget) => listSessionEntriesCore({
		agentId: storeTarget.agentId,
		storePath: storeTarget.storePath
	}).flatMap(({ sessionKey, entry }) => entry.category?.trim() === groupName ? [{
		sessionKey,
		agentId: storeTarget.agentId
	}] : []));
}
function resolveApprovalSessionTarget(method, params, context) {
	const id = readSessionSharingStringParam(params, "id");
	if (!id) return;
	const kind = readSessionSharingStringParam(params, "kind");
	const manager = method === "plugin.approval.resolve" || kind === "plugin" ? context.pluginApprovalManager : method === "approval.resolve" && kind === "system-agent" ? context.systemAgentApprovalManager : context.execApprovalManager;
	const resolvedId = manager?.lookupApprovalId(id, { includeResolved: true });
	const recordId = resolvedId?.kind === "exact" || resolvedId?.kind === "prefix" ? resolvedId.id : id;
	const request = manager?.getSnapshot(recordId)?.request;
	const sessionKey = readSessionSharingStringParam(request, "sessionKey");
	const agentId = readSessionSharingStringParam(request, "agentId");
	return sessionKey ? {
		sessionKey,
		...agentId ? { agentId } : {}
	} : void 0;
}
function resolveSessionMutationTargets(params) {
	if (params.method === "sessions.patchMany") {
		const targets = params.requestParams?.targets;
		return Array.isArray(targets) ? targets.slice(0, 101).flatMap((target) => {
			const sessionKey = readSessionSharingStringParam(target, "key");
			const agentId = readSessionSharingStringParam(target, "agentId");
			return sessionKey ? [{
				sessionKey,
				...agentId ? { agentId } : {}
			}] : [];
		}) : void 0;
	}
	if (params.method === "sessions.groups.rename" || params.method === "sessions.groups.delete") return resolveSessionGroupMutationTargets({
		getCfg: params.getCfg,
		requestParams: params.requestParams
	});
	if (params.method === "exec.approval.resolve" || params.method === "plugin.approval.resolve" || params.method === "approval.resolve") {
		const target = resolveApprovalSessionTarget(params.method, params.requestParams, params.context);
		return target ? [target] : void 0;
	}
	const field = SESSION_KEY_PARAM_BY_METHOD.get(params.method);
	const directKey = field ? readSessionSharingStringParam(params.requestParams, field) : void 0;
	if (!directKey && (params.method === "board.event" || params.method === "board.action")) {
		const ticket = readSessionSharingStringParam(params.requestParams, "ticket");
		const claims = ticket ? verifyBoardViewTicket(ticket) : void 0;
		if (!claims) return;
		const requestedAgentId = readSessionSharingStringParam(params.requestParams, "agentId");
		if (requestedAgentId && requestedAgentId !== claims.agentId) return;
		return [{
			sessionKey: claims.sessionKey,
			...claims.agentId ? { agentId: claims.agentId } : {}
		}];
	}
	if (directKey || params.method !== "sessions.abort") {
		const agentId = readSessionSharingStringParam(params.requestParams, "agentId");
		return directKey ? [{
			sessionKey: directKey,
			...agentId ? { agentId } : {}
		}] : void 0;
	}
	const runId = readSessionSharingStringParam(params.requestParams, "runId");
	const run = runId ? params.context.chatAbortControllers.get(runId) : void 0;
	return run ? [{
		sessionKey: run.sessionKey,
		...run.agentId ? { agentId: run.agentId } : {}
	}] : void 0;
}
function resolveSessionMutationAuthorization(params) {
	if (isGatewayAdmin(params.client)) return { error: null };
	let cachedCfg;
	const getCfg = () => cachedCfg ??= params.context.getRuntimeConfig();
	const createLookupCaches = () => ({
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	});
	const lookupCaches = createLookupCaches();
	const resolveAuthorizedTarget = (targetRef) => {
		try {
			return { target: resolveSessionSharingTarget({
				cfg: getCfg(),
				sessionKey: targetRef.sessionKey,
				agentId: targetRef.agentId,
				...lookupCaches
			}) };
		} catch (error) {
			if (error instanceof AgentSelectionRequiredError) return { error: errorShape(ErrorCodes.INVALID_REQUEST, error.message) };
			throw error;
		}
	};
	for (const targetRef of resolveDirectIncognitoTargets(params.method, params.requestParams)) {
		const resolved = resolveAuthorizedTarget(targetRef);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		});
		if (error) return { error };
	}
	const targetRefs = resolveSessionMutationTargets({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context,
		getCfg
	});
	if (!targetRefs) {
		if (REQUIRED_SESSION_TARGET_METHODS.has(params.method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, "session mutation target is unavailable", { details: {
			code: "SESSION_MUTATION_TARGET_REQUIRED",
			method: params.method
		} }) };
		return { error: null };
	}
	const authorizedTargets = [];
	for (const targetRef of targetRefs) {
		const resolved = resolveAuthorizedTarget(targetRef);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = (params.method === "sessions.patchMany" ? authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		}) : null) ?? (target ? authorizeSessionSharingTarget({
			client: params.client,
			target
		}) : null);
		if (error) return { error };
		authorizedTargets.push({
			...targetRef,
			resolved: target ? {
				agentId: target.agentId,
				canonicalKey: target.canonicalKey,
				storeKey: target.storeKey,
				storePath: target.storePath
			} : null,
			sessionId: target?.entry.sessionId?.trim() || null
		});
	}
	return {
		error: null,
		authorization: (() => {
			const assertTargetCurrent = (targetRef, expected, currentCfg, currentLookupCaches) => {
				const current = resolveSessionSharingTarget({
					cfg: currentCfg,
					sessionKey: targetRef.sessionKey,
					agentId: targetRef.agentId,
					...currentLookupCaches
				});
				if (!(expected !== void 0 && (current === null ? expected.resolved === null : expected.resolved !== null && current.agentId === expected.resolved.agentId && current.canonicalKey === expected.resolved.canonicalKey && current.storeKey === expected.resolved.storeKey && current.storePath === expected.resolved.storePath && (current.entry.sessionId?.trim() || null) === expected.sessionId))) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, `session changed before ${params.method}; retry the request`, { details: {
					code: "SESSION_MUTATION_AUTHORIZATION_CHANGED",
					method: params.method,
					sessionKey: targetRef.sessionKey
				} }));
				if (!current) return;
				const error = (params.method === "sessions.patchMany" ? authorizeIncognitoSessionTarget({
					client: params.client,
					sessionKey: targetRef.sessionKey,
					target: current
				}) : null) ?? authorizeSessionSharingTarget({
					client: params.client,
					target: current
				});
				if (error) throw new SessionMutationAuthorizationChangedError(error);
			};
			return {
				assertCurrent: () => {
					const currentCfg = params.context.getRuntimeConfig();
					const currentLookupCaches = createLookupCaches();
					for (const authorized of authorizedTargets) assertTargetCurrent(authorized, authorized, currentCfg, currentLookupCaches);
				},
				assertTargetCurrent: (targetRef) => {
					const sessionKey = normalizeOptionalString(targetRef.sessionKey);
					const agentId = normalizeOptionalString(targetRef.agentId);
					const normalizedTarget = {
						sessionKey: sessionKey ?? targetRef.sessionKey,
						agentId
					};
					const expected = authorizedTargets.find((target) => target.sessionKey === sessionKey && target.agentId === agentId);
					assertTargetCurrent(normalizedTarget, expected, params.context.getRuntimeConfig());
				}
			};
		})()
	};
}
function loadSharingSnapshot(cfg, sessionKey, agentId) {
	return loadCachedSessionSharingSnapshot({
		agentId,
		sessionKey,
		resolve: () => {
			const target = resolveSessionSharingTarget({
				cfg,
				sessionKey,
				agentId
			});
			return {
				canonicalKey: target?.canonicalKey ?? sessionKey,
				canonicalAgentId: target?.agentId ?? agentId,
				snapshot: {
					visibility: target ? resolveSessionVisibility(target.entry) : "draft",
					incognito: target ? target.entry.incognito === true || isIncognitoSessionKey(target.canonicalKey) : isIncognitoSessionKey(sessionKey),
					...target ? { creatorId: target.entry.createdActor?.id } : {}
				}
			};
		}
	});
}
function canReceiveSessionEvent(params) {
	if (isGatewayAdmin(params.client)) return true;
	const identity = gatewayClientSessionCreator(params.client);
	if (!identity) return params.event !== "session.suggestion" && params.event !== "session.typing";
	const visible = params.sessionKeys.every((sessionKey) => {
		const snapshot = loadSharingSnapshot(params.cfg, sessionKey, params.agentId);
		if (snapshot.incognito) return false;
		if (snapshot.visibility !== "draft" || snapshot.creatorId === identity.id) return true;
		if (params.event !== "session.typing") return false;
		const target = resolveSessionSharingTarget({
			cfg: params.cfg,
			sessionKey,
			agentId: params.agentId
		});
		return target !== null && canManageSessionSharing(resolveSessionSharingRole({
			client: params.client,
			target
		}));
	});
	if (!visible || params.event !== "session.suggestion") return visible;
	if ((params.payload && typeof params.payload === "object" ? params.payload.suggestion?.author?.id : void 0) === identity.id) return true;
	return params.sessionKeys.every((sessionKey) => {
		const target = resolveSessionSharingTarget({
			cfg: params.cfg,
			sessionKey,
			agentId: params.agentId
		});
		return target !== null && resolveSessionSharingRole({
			client: params.client,
			target
		}) !== "viewer";
	});
}
function createSessionListEntryFilter(params) {
	const identity = gatewayClientSessionCreator(params.client);
	if (isGatewayAdmin(params.client) || !identity) return;
	return (sessionKey, entry) => {
		const owner = entry.createdActor?.id === identity.id;
		return !(entry.incognito === true || isIncognitoSessionKey(sessionKey)) && (owner || resolveSessionVisibility(entry) !== "draft");
	};
}
//#endregion
export { gatewayClientSenderFields as _, authorizeSessionSharingTarget as a, canReceiveSessionEvent as c, isSessionVisibilityAllowed as d, resolveSessionMutationAuthorization as f, invalidateSessionSharingSnapshot as g, resolveSessionVisibility as h, authorizeResolvedSessionMutation as i, createSessionListEntryFilter as l, resolveSessionSharingTarget as m, allowedSessionVisibilities as n, canAccessIncognitoSession as o, resolveSessionSharingRole as p, authorizeIncognitoSessionTarget as r, canManageSessionSharing as s, SessionMutationAuthorizationChangedError as t, isGatewayAdmin as u, gatewayClientSessionCreator as v };
