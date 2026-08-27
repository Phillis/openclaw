import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { a as isSubagentSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as GatewaySecretRefUnavailableError } from "./credentials-BCdWdXTF.js";
import { h as isGatewayTransportError, s as callGateway, t as GatewayCredentialsRequiredError } from "./call-CZ1eu88h.js";
import { t as GatewayExplicitAuthRequiredError } from "./client-bootstrap-CVqtzbw5.js";
import "./client-3jXHeoWL.js";
import { t as GatewayClientRequestError } from "./request-error-Cviusa7U.js";
import { t as redactIdentifier } from "./redact-identifier-D3LO__f0.js";
import { s as listAmbientGroupWatchTargets } from "./session-state-events-DTKQ6kKc.js";
//#region src/plugin-sdk/session-visibility-internal.ts
/** Core-private spawned-session ownership lookup; not a published plugin SDK subpath. */
function classifyLookupFailure(error) {
	if (error instanceof GatewayClientRequestError && error.retryable) return "transient";
	if (isGatewayTransportError(error) && (error.kind === "timeout" || error.code === 1006 || error.code === 1013)) return "transient";
	if (error instanceof GatewayCredentialsRequiredError || error instanceof GatewayExplicitAuthRequiredError || error instanceof GatewaySecretRefUnavailableError) return "credentials";
	return "unknown";
}
function lookupFailedDenialSuffix(kind) {
	if (kind === "transient") return "spawned-session ownership lookup failed (transient); retry once, then ask the operator to inspect OpenClaw logs.";
	if (kind === "credentials") return "spawned-session ownership lookup failed; ask the operator to check gateway configuration and credentials.";
	return "spawned-session ownership lookup failed; ask the operator to inspect OpenClaw logs.";
}
function lookupFailedDenialMessage(action, kind) {
	return `${action === "list" ? "Session list" : `Session ${action}`} denied because ${lookupFailedDenialSuffix(kind)}`;
}
function lookupFailedOperationMessage(action, kind) {
	return `${action === "list" ? "Session list" : `Session ${action}`} failed because session lookup failed${kind === "transient" ? " (transient)" : ""}; ${kind === "transient" ? "retry once, then ask the operator to inspect OpenClaw logs" : kind === "credentials" ? "ask the operator to check gateway configuration and credentials" : "ask the operator to inspect OpenClaw logs"}.`;
}
function sessionOwnershipLookupFailure(error) {
	return {
		kind: classifyLookupFailure(error),
		diagnostic: formatErrorMessage(error)
	};
}
function logSessionOwnershipLookupFailure(params) {
	logWarn(`session-visibility: spawned-session ownership lookup failed for requester=${redactIdentifier(params.requesterSessionKey)}: ${params.failure.diagnostic}`);
}
/** List sessions spawned by the requester through the gateway session list method. */
async function listSpawnedSessionKeysWithResult(params) {
	const limit = typeof params.limit === "number" && Number.isFinite(params.limit) ? Math.max(1, Math.floor(params.limit)) : void 0;
	try {
		const list = await (params.callGateway ?? callGateway)({
			method: "sessions.list",
			params: {
				includeGlobal: false,
				includeUnknown: false,
				...limit !== void 0 ? { limit } : {},
				spawnedBy: params.requesterSessionKey
			}
		});
		if (!Array.isArray(list?.sessions)) return err({
			kind: "unknown",
			diagnostic: "gateway sessions.list returned an invalid response"
		});
		const sessions = list.sessions;
		const keys = normalizeTrimmedStringList(sessions.map((entry) => entry?.key));
		return ok(new Set(keys));
	} catch (error) {
		return err(sessionOwnershipLookupFailure(error));
	}
}
//#endregion
//#region src/plugin-sdk/session-visibility.ts
const scopedSessionAccessProviders = /* @__PURE__ */ new Set();
function registerScopedSessionAccessProvider(provider) {
	scopedSessionAccessProviders.add(provider);
	return () => scopedSessionAccessProviders.delete(provider);
}
function resolveScopedSessionAccess(request) {
	if (resolveIncognitoSessionAccessDenial(request.targetSessionKey)) return;
	for (const provider of scopedSessionAccessProviders) try {
		const expectedSessionId = normalizeOptionalString(provider(request)?.expectedSessionId);
		if (expectedSessionId) return { expectedSessionId };
	} catch {}
}
/** Public compatibility wrapper; direct guards use the richer private result. */
async function listSpawnedSessionKeys(params) {
	const result = await listSpawnedSessionKeysWithResult(params);
	if (!result.ok) {
		logSessionOwnershipLookupFailure({
			requesterSessionKey: params.requesterSessionKey,
			failure: result.error
		});
		return /* @__PURE__ */ new Set();
	}
	return result.value;
}
/** Resolve configured session-tool visibility, defaulting invalid or missing values to tree. */
function resolveSessionToolsVisibility(cfg) {
	const raw = cfg.tools?.sessions?.visibility;
	const value = normalizeLowercaseStringOrEmpty(raw);
	if (value === "self" || value === "tree" || value === "agent" || value === "all") return value;
	return "tree";
}
/** Resolve visibility after applying sandbox clamps for spawned-session-only agents. */
function resolveEffectiveSessionToolsVisibility(params) {
	const visibility = resolveSessionToolsVisibility(params.cfg);
	if (!params.sandboxed) return visibility;
	if ((params.cfg.agents?.defaults?.sandbox?.sessionToolsVisibility ?? "spawned") === "spawned" && visibility !== "tree") return "tree";
	return visibility;
}
/** Resolve sandbox-specific session visibility clamp for agent defaults. */
function resolveSandboxSessionToolsVisibility(cfg) {
	return cfg.agents?.defaults?.sandbox?.sessionToolsVisibility ?? "spawned";
}
function compileAgentAllowPattern(pattern) {
	const raw = normalizeOptionalString(pattern) ?? "";
	if (!raw) return { kind: "deny" };
	if (raw === "*") return { kind: "all" };
	if (!raw.includes("*")) return {
		kind: "exact",
		value: raw
	};
	const parts = raw.toLowerCase().split("*");
	return {
		kind: "wildcard",
		first: parts[0] ?? "",
		last: parts[parts.length - 1] ?? "",
		interior: parts.slice(1, -1).filter(Boolean)
	};
}
/**
* Linear-time case-insensitive glob matcher for precompiled `*` patterns.
* Checks prefix, suffix, then ordered interior segments without entering the
* regex engine, avoiding polynomial backtracking on repeated wildcards.
*/
function matchesCompiledWildcard(pattern, lower) {
	let pos = 0;
	if (pattern.first) {
		if (!lower.startsWith(pattern.first)) return false;
		pos = pattern.first.length;
	}
	const endBound = pattern.last ? lower.length - pattern.last.length : lower.length;
	if (pattern.last && (!lower.endsWith(pattern.last) || endBound < pos)) return false;
	for (const part of pattern.interior) {
		const idx = lower.indexOf(part, pos);
		if (idx === -1 || idx + part.length > endBound) return false;
		pos = idx + part.length;
	}
	return true;
}
/** Compile agent-to-agent allow rules into reusable matching predicates. */
function createAgentToAgentPolicy(cfg) {
	const routingA2A = cfg.tools?.agentToAgent;
	const enabled = routingA2A?.enabled === true;
	const allowPatterns = (Array.isArray(routingA2A?.allow) ? routingA2A.allow : []).map((pattern) => compileAgentAllowPattern(pattern));
	const hasWildcardPatterns = allowPatterns.some((pattern) => pattern.kind === "wildcard");
	const matchesAllow = (agentId) => {
		if (allowPatterns.length === 0) return true;
		const lowerAgentId = hasWildcardPatterns ? agentId.toLowerCase() : "";
		return allowPatterns.some((pattern) => {
			if (pattern.kind === "all") return true;
			if (pattern.kind === "deny") return false;
			if (pattern.kind === "exact") return pattern.value === agentId;
			return matchesCompiledWildcard(pattern, lowerAgentId);
		});
	};
	const isAllowed = (requesterAgentId, targetAgentId) => {
		if (requesterAgentId === targetAgentId) return true;
		if (!enabled) return false;
		return matchesAllow(requesterAgentId) && matchesAllow(targetAgentId);
	};
	return {
		enabled,
		matchesAllow,
		isAllowed
	};
}
function actionPrefix(action) {
	if (action === "history") return "Session history";
	if (action === "send") return "Session send";
	if (action === "status") return "Session status";
	return "Session list";
}
function a2aDisabledMessage(action) {
	if (action === "history") return "Agent-to-agent history is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent access.";
	if (action === "send") return "Agent-to-agent messaging is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent sends.";
	if (action === "status") return "Agent-to-agent status is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent access.";
	return "Agent-to-agent listing is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent visibility.";
}
function a2aDeniedMessage(action) {
	if (action === "history") return "Agent-to-agent history denied by tools.agentToAgent.allow.";
	if (action === "send") return "Agent-to-agent messaging denied by tools.agentToAgent.allow.";
	if (action === "status") return "Agent-to-agent status denied by tools.agentToAgent.allow.";
	return "Agent-to-agent listing denied by tools.agentToAgent.allow.";
}
function crossVisibilityMessage(action) {
	const suffix = "Set tools.sessions.visibility=all and tools.agentToAgent.enabled=true to allow cross-agent access; use tools.agentToAgent.allow to restrict permitted agent pairs.";
	if (action === "history") return `Session history visibility is restricted. ${suffix}`;
	if (action === "send") return `Session send visibility is restricted. ${suffix}`;
	if (action === "status") return `Session status visibility is restricted. ${suffix}`;
	return `Session list visibility is restricted. ${suffix}`;
}
function selfVisibilityMessage(action) {
	return `${actionPrefix(action)} visibility is restricted to the current session (tools.sessions.visibility=self).`;
}
function treeVisibilityMessage(action) {
	if (action === "send") return `${actionPrefix(action)} visibility is restricted to the current session tree (tools.sessions.visibility=tree).`;
	return `${actionPrefix(action)} visibility is restricted to the current session tree and any watched same-agent group sessions (tools.sessions.visibility=tree).`;
}
function resolveIncognitoSessionAccessDenial(targetSessionKey) {
	if (!isIncognitoSessionKey(targetSessionKey)) return;
	return {
		allowed: false,
		status: "forbidden",
		error: `Session not visible from session tools: ${targetSessionKey}`
	};
}
function createSessionVisibilityCheckerWithResult(params) {
	const spawnedKeys = params.spawnedKeys;
	let lookupFailureLogged = false;
	const rowChecker = createSessionVisibilityRowChecker({
		action: params.action,
		defaultAgentId: params.defaultAgentId,
		requesterAgentId: params.requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		visibility: params.visibility,
		a2aPolicy: params.a2aPolicy
	});
	const check = (targetSessionKey) => {
		const incognitoDenial = resolveIncognitoSessionAccessDenial(targetSessionKey);
		if (incognitoDenial) return incognitoDenial;
		if (params.action !== "list") {
			const scoped = resolveScopedSessionAccess({
				action: params.action,
				requesterSessionKey: params.requesterSessionKey,
				targetSessionKey
			});
			if (scoped) return {
				allowed: true,
				expectedSessionId: scoped.expectedSessionId
			};
		}
		const isSpawnedSession = (spawnedKeys?.ok ? spawnedKeys.value : void 0)?.has(targetSessionKey) === true;
		const result = rowChecker.check({
			key: targetSessionKey,
			spawnedBy: isSpawnedSession ? params.requesterSessionKey : void 0
		});
		if (!result.allowed) {
			const ownedResult = rowChecker.check({
				key: targetSessionKey,
				spawnedBy: params.requesterSessionKey
			});
			if (spawnedKeys !== null && !spawnedKeys.ok && targetSessionKey !== params.requesterSessionKey && targetSessionKey !== "current" && ownedResult.allowed) {
				if (!lookupFailureLogged) {
					lookupFailureLogged = true;
					logSessionOwnershipLookupFailure({
						requesterSessionKey: params.requesterSessionKey,
						failure: spawnedKeys.error
					});
				}
				return {
					allowed: false,
					status: "forbidden",
					error: lookupFailedDenialMessage(params.action, spawnedKeys.error.kind)
				};
			}
		}
		return result;
	};
	return { check };
}
/** Create a direct session-key visibility checker for one requester/action pair. */
function createSessionVisibilityCheckerImpl(params) {
	return createSessionVisibilityCheckerWithResult({
		...params,
		spawnedKeys: params.spawnedKeys ? {
			ok: true,
			value: params.spawnedKeys
		} : null
	});
}
/** Direct-key visibility checker plus registration for narrow host-owned grants. */
const createSessionVisibilityChecker = Object.assign(createSessionVisibilityCheckerImpl, {
	registerScopedAccessProvider: registerScopedSessionAccessProvider,
	resolveScopedAccess: resolveScopedSessionAccess
});
function rowOwnedByRequester(row, requesterSessionKey) {
	return row.ownerSessionKey === requesterSessionKey || row.spawnedBy === requesterSessionKey || row.parentSessionKey === requesterSessionKey;
}
/** Create a row-aware visibility checker that can use owner/spawn metadata. */
function createSessionVisibilityRowChecker(params) {
	const requesterAgentId = normalizeLowercaseStringOrEmpty(params.requesterAgentId) || resolveAgentIdFromSessionKey(params.requesterSessionKey, params.defaultAgentId);
	let watchedSessionKeys;
	const check = (row) => {
		const targetSessionKey = row.key;
		const incognitoDenial = resolveIncognitoSessionAccessDenial(targetSessionKey);
		if (incognitoDenial) return incognitoDenial;
		const isRequesterSession = targetSessionKey === params.requesterSessionKey || targetSessionKey === "current";
		let targetAgentId = normalizeLowercaseStringOrEmpty(row.agentId);
		if (!targetAgentId && (targetSessionKey === "current" || targetSessionKey === params.requesterSessionKey && !params.defaultAgentId?.trim())) targetAgentId = requesterAgentId;
		if (!targetAgentId) try {
			targetAgentId = resolveAgentIdFromSessionKey(targetSessionKey, params.defaultAgentId);
		} catch {
			return {
				allowed: false,
				status: "forbidden",
				error: `${actionPrefix(params.action)} denied because target agent ownership is unavailable.`
			};
		}
		const isWatchedRead = params.action !== "send" && params.visibility === "tree" && targetAgentId === requesterAgentId && (watchedSessionKeys ??= listAmbientGroupWatchTargets(params.requesterSessionKey)).has(targetSessionKey);
		const isRequesterOwned = rowOwnedByRequester(row, params.requesterSessionKey) || isWatchedRead;
		const isCrossAgent = targetAgentId !== requesterAgentId;
		if (!isRequesterSession && isRequesterOwned && (!isCrossAgent || isAcpSessionKey(targetSessionKey) || isSubagentSessionKey(targetSessionKey)) && (params.visibility === "tree" || params.visibility === "all")) return { allowed: true };
		if (isCrossAgent) {
			if (params.visibility !== "all") return {
				allowed: false,
				status: "forbidden",
				error: crossVisibilityMessage(params.action)
			};
			if (!params.a2aPolicy.enabled) return {
				allowed: false,
				status: "forbidden",
				error: a2aDisabledMessage(params.action)
			};
			if (!params.a2aPolicy.isAllowed(requesterAgentId, targetAgentId)) return {
				allowed: false,
				status: "forbidden",
				error: a2aDeniedMessage(params.action)
			};
			return { allowed: true };
		}
		if (params.visibility === "self" && !isRequesterSession) return {
			allowed: false,
			status: "forbidden",
			error: selfVisibilityMessage(params.action)
		};
		if (params.visibility === "tree" && !isRequesterSession && !isRequesterOwned) return {
			allowed: false,
			status: "forbidden",
			error: treeVisibilityMessage(params.action)
		};
		return { allowed: true };
	};
	return { check };
}
/** Create a visibility guard, loading spawned-session ownership when direct keys need it. */
async function createSessionVisibilityGuard(params) {
	const spawnedKeys = params.action !== "list" && (params.visibility === "tree" || params.visibility === "all") ? await listSpawnedSessionKeysWithResult({
		requesterSessionKey: params.requesterSessionKey,
		callGateway: params.callGateway
	}) : null;
	return createSessionVisibilityCheckerWithResult({
		action: params.action,
		defaultAgentId: params.defaultAgentId,
		requesterAgentId: params.requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		visibility: params.visibility,
		a2aPolicy: params.a2aPolicy,
		spawnedKeys
	});
}
//#endregion
export { listSpawnedSessionKeys as a, resolveSessionToolsVisibility as c, lookupFailedDenialMessage as d, lookupFailedOperationMessage as f, createSessionVisibilityRowChecker as i, listSpawnedSessionKeysWithResult as l, createSessionVisibilityChecker as n, resolveEffectiveSessionToolsVisibility as o, sessionOwnershipLookupFailure as p, createSessionVisibilityGuard as r, resolveSandboxSessionToolsVisibility as s, createAgentToAgentPolicy as t, logSessionOwnershipLookupFailure as u };
