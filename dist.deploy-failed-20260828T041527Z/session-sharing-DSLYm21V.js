import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-DigoIwHb.js";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CUBiGmG3.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { _ as resolveSessionMutationTargets, f as isRequiredSessionTargetMethod, h as resolveDirectSessionTargets, m as resolveDirectIncognitoTargets, p as isSessionProfileDependentMethod } from "./core-descriptors-8FmEpKxY.js";
import { m as isSessionMember } from "./sessions-BI8dPUCI.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { c as resolveCanonicalSessionStoreMatchFromStoreKeys, f as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { d as gatewayClientSessionCreator, f as isGatewayClientProfilePending, i as operatorSessionCap, l as authenticatedProfileUnavailableError, o as resolveGatewayOperatorRoleActor, s as resolveOperatorRolePolicy, t as authorizeGatewaySessionCreation } from "./operator-role-policy-il7s4lXY.js";
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
//#region src/gateway/session-sharing.ts
const AGENT_RUN_START_METHODS = /* @__PURE__ */ new Set([
	"agent",
	"chat.send",
	"message.action",
	"send",
	"sessions.dispatch",
	"sessions.send",
	"sessions.steer",
	"talk.client.create",
	"talk.session.create",
	"tools.invoke",
	"wake"
]);
const VISIBILITY_AUTHORIZED_METHODS = /* @__PURE__ */ new Set(["sessions.assignOwner"]);
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
	return resolveSharingRole(params);
}
function resolveSharingRole(params, preparedCap) {
	if (isGatewayAdmin(params.client)) return "admin";
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = gatewayClientSessionCreator(params.client) ?? (operatorActor?.kind === "operator" ? {
		type: "human",
		id: operatorActor.profileId
	} : void 0);
	if (!identity) return params.client?.authenticatedGitHubIdentitySync || params.cfg?.gateway?.roles && operatorActor?.kind !== "system" ? "viewer" : "owner";
	if (params.target.entry.createdActor?.id === identity.id) return "owner";
	const sessionCap = preparedCap ? preparedCap.value : params.cfg && operatorSessionCap(params.client, params.cfg);
	if (sessionCap === "write" && resolveSessionVisibility(params.target.entry) !== "draft" && params.target.entry.incognito !== true && !isIncognitoSessionKey(params.target.canonicalKey)) return "member";
	if (sessionCap === "none") return "viewer";
	return params.isMember ?? (params.includeMembership !== false && isSessionMember({
		agentId: params.target.agentId,
		sessionKey: params.target.storeKey,
		storePath: params.target.storePath
	}, identity.id)) ? "member" : "viewer";
}
function canManageSessionSharing(role) {
	return role === "admin" || role === "owner";
}
function hiddenSessionNotFound(sessionKey, incognito = false) {
	const label = incognito ? "Incognito session" : "Session";
	return errorShape(ErrorCodes.INVALID_REQUEST, `${label} "${sessionKey}" was not found.`);
}
function isIncognitoSessionTarget(params) {
	return params.target ? params.target.entry.incognito === true || isIncognitoSessionKey(params.target.canonicalKey) : isIncognitoSessionKey(params.sessionKey);
}
function isResolvedIncognitoSession(params) {
	return isIncognitoSessionTarget({
		sessionKey: params.sessionKey,
		target: resolveSessionSharingTarget(params)
	});
}
function authorizeIncognitoSessionTarget(params) {
	if (!isIncognitoSessionTarget(params)) return null;
	if (isGatewayAdmin(params.client)) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	if (!gatewayClientSessionCreator(params.client)) return null;
	return hiddenSessionNotFound(params.sessionKey, true);
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
	if (isGatewayAdmin(params.client) && !params.cfg.gateway?.roles) return null;
	if (isGatewayClientProfilePending(params.client)) return authenticatedProfileUnavailableError();
	const target = resolveSessionSharingTarget(params);
	if (target) {
		const agentError = authorizeSessionAgentRun({
			cfg: params.cfg,
			client: params.client,
			target
		});
		if (agentError) return agentError;
	}
	if (isGatewayAdmin(params.client)) return null;
	const incognitoError = authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target
	});
	if (incognitoError) return incognitoError;
	if (!target) return null;
	return authorizeSessionSharingTarget({
		cfg: params.cfg,
		client: params.client,
		target
	});
}
function authorizeSessionAgentRun(params) {
	const agentError = authorizeGatewaySessionCreation({
		cfg: params.cfg,
		client: params.client,
		agentId: params.target.agentId
	});
	if (agentError) return agentError;
	if (params.cfg.gateway?.roles && params.target.entry.sandbox !== "required" && resolveOperatorRolePolicy(params.client, params.cfg)?.sandbox === "required") return errorShape(ErrorCodes.FORBIDDEN, `Your operator role requires a sandboxed session; create a new session instead of running in "${params.target.canonicalKey}".`);
	return null;
}
function authorizeSessionSharingTarget(params) {
	const visibility = resolveSessionVisibility(params.target.entry);
	const sessionCap = params.cfg && operatorSessionCap(params.client, params.cfg);
	const role = resolveSharingRole(params, { value: sessionCap });
	if (sessionCap === "none" && role !== "owner" && role !== "admin") return hiddenSessionNotFound(params.target.canonicalKey);
	return (visibility === "draft" ? canManageSessionSharing(role) : role !== "viewer" || visibility === "shared" && !(sessionCap === "view" || sessionCap === "suggest")) ? null : errorShape(ErrorCodes.INVALID_REQUEST, `session is ${visibility} for this connection`, { details: {
		code: "SESSION_PARTICIPATION_REQUIRED",
		sessionKey: params.target.canonicalKey,
		visibility
	} });
}
function authorizeSessionSharing(params) {
	const target = resolveSessionSharingTarget(params);
	return target && authorizeSessionSharingTarget({
		cfg: params.cfg,
		client: params.client,
		target
	});
}
function resolveSessionMutationAuthorization(params) {
	const authorizesAgentRun = AGENT_RUN_START_METHODS.has(params.method);
	if (isGatewayAdmin(params.client) && !authorizesAgentRun) return { error: null };
	if (isGatewayClientProfilePending(params.client) && isSessionProfileDependentMethod(params.method)) return { error: authenticatedProfileUnavailableError() };
	let cachedCfg;
	const getCfg = () => cachedCfg ??= params.context.getRuntimeConfig();
	const createLookupCaches = () => ({
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	});
	let lookupCaches;
	const resolveAuthorizedTarget = (targetRef) => {
		try {
			return { target: resolveSessionSharingTarget({
				cfg: getCfg(),
				sessionKey: targetRef.sessionKey,
				agentId: targetRef.agentId,
				...lookupCaches ??= createLookupCaches()
			}) };
		} catch (error) {
			if (error instanceof AgentSelectionRequiredError) return { error: errorShape(ErrorCodes.INVALID_REQUEST, error.message) };
			throw error;
		}
	};
	const directTargets = resolveDirectSessionTargets(params.method, params.requestParams);
	const hidesForeignSessions = directTargets.length > 0 && gatewayClientSessionCreator(params.client) && operatorSessionCap(params.client, getCfg()) === "none";
	const protectedTargets = hidesForeignSessions ? directTargets : resolveDirectIncognitoTargets(params.method, params.requestParams);
	for (const targetRef of protectedTargets) {
		const resolved = resolveAuthorizedTarget(targetRef);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		});
		if (error) return { error };
		if (hidesForeignSessions && target && target.entry.createdActor?.id !== params.client?.authenticatedUserProfile?.profileId) return { error: hiddenSessionNotFound(targetRef.sessionKey) };
	}
	const targetRefs = resolveSessionMutationTargets({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context,
		getCfg
	});
	if (!targetRefs) {
		if (isRequiredSessionTargetMethod(params.method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, "session mutation target is unavailable", { details: {
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
		const error = (target && authorizesAgentRun ? authorizeSessionAgentRun({
			cfg: getCfg(),
			client: params.client,
			target
		}) : null) ?? authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		}) ?? (target && !(VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (operatorSessionCap(params.client, getCfg()) ?? "write") === "write") ? authorizeSessionSharingTarget({
			cfg: getCfg(),
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
				const error = (authorizesAgentRun ? authorizeSessionAgentRun({
					cfg: currentCfg,
					client: params.client,
					target: current
				}) : null) ?? authorizeIncognitoSessionTarget({
					client: params.client,
					sessionKey: targetRef.sessionKey,
					target: current
				}) ?? authorizeSessionSharingTarget({
					cfg: currentCfg,
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
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = gatewayClientSessionCreator(params.client) ?? (operatorActor?.kind === "operator" ? {
		type: "human",
		id: operatorActor.profileId
	} : void 0);
	if (!identity) return (!params.cfg.gateway?.roles || operatorActor?.kind === "system") && params.event !== "session.suggestion" && params.event !== "session.typing";
	const hidesForeignSessions = operatorSessionCap(params.client, params.cfg) === "none";
	const visible = params.sessionKeys.every((sessionKey) => {
		const snapshot = loadSharingSnapshot(params.cfg, sessionKey, params.agentId);
		if (snapshot.incognito || hidesForeignSessions && snapshot.creatorId !== identity.id) return false;
		if (snapshot.visibility !== "draft" || snapshot.creatorId === identity.id) return true;
		if (params.event !== "session.typing") return false;
		const target = resolveSessionSharingTarget({
			cfg: params.cfg,
			sessionKey,
			agentId: params.agentId
		});
		return target !== null && canManageSessionSharing(resolveSessionSharingRole({
			cfg: params.cfg,
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
			cfg: params.cfg,
			client: params.client,
			target
		}) !== "viewer";
	});
}
function createSessionListEntryFilter(params) {
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = gatewayClientSessionCreator(params.client) ?? (operatorActor?.kind === "operator" ? {
		type: "human",
		id: operatorActor.profileId
	} : void 0);
	if (isGatewayAdmin(params.client) || !identity && operatorActor?.kind === "system") return;
	if (!identity) return params.cfg?.gateway?.roles ? () => false : void 0;
	const hidesForeignSessions = params.cfg && operatorSessionCap(params.client, params.cfg) === "none";
	return (sessionKey, entry) => entry.incognito !== true && !isIncognitoSessionKey(sessionKey) && (entry.createdActor?.id === identity.id || !hidesForeignSessions && resolveSessionVisibility(entry) !== "draft");
}
//#endregion
export { resolveSessionVisibility as _, authorizeSessionSharing as a, canManageSessionSharing as c, isGatewayAdmin as d, isResolvedIncognitoSession as f, resolveSessionSharingTarget as g, resolveSessionSharingRole as h, authorizeResolvedSessionMutation as i, canReceiveSessionEvent as l, resolveSessionMutationAuthorization as m, allowedSessionVisibilities as n, authorizeSessionSharingTarget as o, isSessionVisibilityAllowed as p, authorizeIncognitoSessionTarget as r, canAccessIncognitoSession as s, SessionMutationAuthorizationChangedError as t, createSessionListEntryFilter as u, invalidateSessionSharingSnapshot as v };
