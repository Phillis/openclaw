import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { g as getActivePluginSessionExtensionRegistry, l as getActivePluginHttpRouteRegistry } from "./runtime-DMlUh4Cg.js";
import { a as READ_SCOPE, c as WRITE_SCOPE, i as QUESTIONS_SCOPE, l as isOperatorScope, n as APPROVALS_SCOPE, o as TALK_SCOPE, r as PAIRING_SCOPE, s as TALK_SECRETS_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { A as isBrowserProxyNodeInvokeCommand, k as isAdminOnlyNodeInvokeCommand } from "./node-commands-DRxP7loh.js";
import { a as isDynamicOperatorGatewayMethod, b as resolveReservedGatewayMethodScope, i as isCoreNodeGatewayMethod, l as resolveCoreOperatorGatewayMethodScope, r as isCoreGatewayMethodClassified } from "./core-descriptors-By5XY4Wa.js";
import { n as validateSessionsMoveParams, t as validateSessionsDispatchParams } from "./session-placement-validators-e045LQUU.js";
//#region src/shared/session-method-scopes-base.ts
const SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS = /* @__PURE__ */ new Set([
	"label",
	"icon",
	"category",
	"boardFace",
	"pinned",
	"archived",
	"unread",
	"model",
	"permissionMode"
]);
const SESSIONS_PATCH_WRITE_SCOPE_ENVELOPE_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"agentId",
	"expectedSessionId",
	"expectedLifecycleRevision",
	"expectedMarkedUnreadAt"
]);
const SESSIONS_DELETE_WRITE_SCOPE_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"agentId",
	"deleteTranscript",
	"expectedSessionId",
	"archivedOnly"
]);
function resolveSessionsPatchRequiredScope(params) {
	if (!isRecord(params)) return "operator.write";
	if (params.permissionMode === "full") return "operator.admin";
	return Object.keys(params).every((key) => SESSIONS_PATCH_WRITE_SCOPE_ENVELOPE_FIELDS.has(key) || SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS.has(key)) ? "operator.write" : "operator.admin";
}
function resolveSessionsPatchManyRequiredScope(params) {
	if (!isRecord(params) || !isRecord(params.patch)) return "operator.write";
	if (params.patch.permissionMode === "full") return "operator.admin";
	return Object.keys(params.patch).every((key) => SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS.has(key)) ? "operator.write" : "operator.admin";
}
function resolveSessionsCreateRequiredScope(params) {
	if (!isRecord(params)) return "operator.write";
	if (params.incognito === true || typeof params.key === "string" && isIncognitoSessionKey(params.key) || typeof params.parentSessionKey === "string" && isIncognitoSessionKey(params.parentSessionKey) || Object.hasOwn(params, "execNode") || Object.hasOwn(params, "toolOverrides") || params.permissionMode === "full") return "operator.admin";
	return "operator.write";
}
function resolveSessionsDeleteRequiredScope(params) {
	if (!isRecord(params) || params.archivedOnly !== true) return "operator.admin";
	return Object.keys(params).every((key) => SESSIONS_DELETE_WRITE_SCOPE_FIELDS.has(key)) ? "operator.write" : "operator.admin";
}
/** Browser-safe session mutation policy for methods without protocol validation. */
function resolveBaseSessionMutationRequiredScope(method, params) {
	if (method === "sessions.recover") return "operator.write";
	if (method === "sessions.create") return resolveSessionsCreateRequiredScope(params);
	if (method === "sessions.patch") return resolveSessionsPatchRequiredScope(params);
	if (method === "sessions.patchMany") return resolveSessionsPatchManyRequiredScope(params);
	if (method === "sessions.delete") return resolveSessionsDeleteRequiredScope(params);
}
//#endregion
//#region src/shared/session-method-scopes.ts
/** Returns the exact Gateway/CLI scope for params-aware session mutations. */
function resolveDynamicSessionMutationRequiredScope(method, params) {
	if (method === "sessions.dispatch") {
		if (!validateSessionsDispatchParams(params)) return "operator.write";
		return params.deviceId !== void 0 || params.autoDevice === true ? "operator.write" : "operator.admin";
	}
	if (method === "sessions.move") return validateSessionsMoveParams(params) && params.target.kind === "profile" ? "operator.admin" : "operator.write";
	return resolveBaseSessionMutationRequiredScope(method, params);
}
//#endregion
//#region src/gateway/agent-command-policy.ts
/** Commands routed through `agent` that mutate session lifecycle state. */
const AGENT_SESSION_RESET_COMMAND_RE = /^\/(new|reset)(?:\s+([\s\S]*))?$/i;
/** Returns true when an agent message requests a session reset. */
function isAgentSessionResetCommand(message) {
	return typeof message === "string" && AGENT_SESSION_RESET_COMMAND_RE.test(message);
}
//#endregion
//#region src/gateway/node-browser-proxy-policy.ts
function normalizeBrowserProxyPath(value) {
	const trimmed = value.trim();
	if (!trimmed) return trimmed;
	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	if (withLeadingSlash.length <= 1) return withLeadingSlash;
	return withLeadingSlash.replace(/\/+$/, "");
}
function isPersistentBrowserProxyMutation(method, path) {
	const normalizedPath = normalizeBrowserProxyPath(path);
	if (method === "POST" && (normalizedPath === "/profiles/create" || normalizedPath === "/reset-profile")) return true;
	return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
function isForbiddenBrowserProxyMutation(params) {
	if (!params || typeof params !== "object") return false;
	const candidate = params;
	const method = (normalizeOptionalString(candidate.method) ?? "").toUpperCase();
	const path = normalizeOptionalString(candidate.path) ?? "";
	return Boolean(method && path && isPersistentBrowserProxyMutation(method, path));
}
//#endregion
//#region src/gateway/method-scopes.ts
/** Default scopes granted to CLI/operator clients when no narrower local policy is known. */
const CLI_DEFAULT_OPERATOR_SCOPES = [
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SECRETS_SCOPE
];
function resolveScopedMethod(method) {
	const explicitScope = resolveCoreOperatorGatewayMethodScope(method);
	if (explicitScope) return explicitScope;
	const reservedScope = resolveReservedGatewayMethodScope(method);
	if (reservedScope) return reservedScope;
	const pluginScope = (getActivePluginHttpRouteRegistry()?.gatewayMethodDescriptors?.find((descriptor) => descriptor.name === method))?.scope;
	return pluginScope === "node" || pluginScope === "dynamic" ? void 0 : pluginScope;
}
/** Returns true when a method requires the approvals operator scope. */
function isApprovalMethod(method) {
	return resolveScopedMethod(method) === APPROVALS_SCOPE;
}
/** Returns true when a method is reserved for node-role clients instead of operators. */
function isNodeRoleMethod(method) {
	return isCoreNodeGatewayMethod(method);
}
/** Resolves the required static operator scope for a gateway method, if one exists. */
function resolveRequiredOperatorScopeForMethod(method) {
	return resolveScopedMethod(method);
}
function resolveSessionActionRegisteredScopes(params) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return;
	const pluginId = normalizeOptionalString(params.pluginId);
	const actionId = normalizeOptionalString(params.actionId);
	if (!pluginId || !actionId) return;
	const registration = getActivePluginSessionExtensionRegistry()?.sessionActions?.find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
	if (!registration) return;
	const requiredScopes = registration.action.requiredScopes;
	return requiredScopes && requiredScopes.length > 0 ? [...requiredScopes] : [WRITE_SCOPE];
}
function resolveSessionActionLeastPrivilegeScopes(params) {
	const registeredScopes = resolveSessionActionRegisteredScopes(params);
	if (registeredScopes) return registeredScopes;
	if (params && typeof params === "object" && !Array.isArray(params)) {
		const pluginId = normalizeOptionalString(params.pluginId);
		const actionId = normalizeOptionalString(params.actionId);
		if (pluginId && actionId) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	}
	return [WRITE_SCOPE];
}
function resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (method === "plugins.sessionAction") return resolveSessionActionLeastPrivilegeScopes(params);
	if (method === "agent") return isAgentSessionResetCommand(params && typeof params === "object" && !Array.isArray(params) ? params.message : void 0) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	if (method === "node.invoke") {
		const record = params && typeof params === "object" && !Array.isArray(params) ? params : void 0;
		const command = record?.command;
		if (isBrowserProxyNodeInvokeCommand(command) && isForbiddenBrowserProxyMutation(record?.params)) return [WRITE_SCOPE];
		return isAdminOnlyNodeInvokeCommand(command) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	}
	if (method === "talk.config") return (params && typeof params === "object" && !Array.isArray(params) ? params.includeSecrets : void 0) === true ? [READ_SCOPE, TALK_SECRETS_SCOPE] : [READ_SCOPE];
	if (method === "channels.pairing.approve") return (params && typeof params === "object" && !Array.isArray(params) ? params.bootstrapCommandOwner : void 0) === true ? [PAIRING_SCOPE, ADMIN_SCOPE] : [PAIRING_SCOPE];
	if (method === "fs.listDir") return [params !== null && typeof params === "object" && !Array.isArray(params) && Object.hasOwn(params, "nodeId") ? ADMIN_SCOPE : WRITE_SCOPE];
	if (method === "sessions.patch") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.patchMany") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.create") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.dispatch") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.move") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.delete") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.admin"];
	return [WRITE_SCOPE];
}
function findMissingOperatorScope(requiredScopes, scopes) {
	return requiredScopes.find((scope) => {
		return !scopes.includes(scope) && !(scope === "operator.read" && scopes.includes("operator.write"));
	});
}
/** Returns the narrowest known operator scopes needed to call a gateway method. */
function resolveLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (isDynamicOperatorGatewayMethod(method)) return resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params);
	const requiredScope = resolveRequiredOperatorScopeForMethod(method);
	if (requiredScope) return [requiredScope];
	return [];
}
/** Checks whether a presented operator scope set authorizes a gateway method call. */
function authorizeOperatorScopesForMethod(method, scopes, params) {
	if (scopes.includes("operator.admin")) return { allowed: true };
	if (isDynamicOperatorGatewayMethod(method)) {
		if (method === "plugins.sessionAction") {
			const registeredScopes = resolveSessionActionRegisteredScopes(params);
			if (!registeredScopes && params && typeof params === "object" && !Array.isArray(params)) {
				const pluginId = normalizeOptionalString(params.pluginId);
				const actionId = normalizeOptionalString(params.actionId);
				if (!pluginId || !actionId) return scopes.some((scope) => isOperatorScope(scope)) ? { allowed: true } : {
					allowed: false,
					missingScope: WRITE_SCOPE
				};
			}
			const missingScope = findMissingOperatorScope(registeredScopes ?? ["operator.write"], scopes);
			return missingScope ? {
				allowed: false,
				missingScope
			} : { allowed: true };
		}
		const missingScope = findMissingOperatorScope(resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params), scopes);
		return missingScope ? {
			allowed: false,
			missingScope
		} : { allowed: true };
	}
	return authorizeOperatorScopesForRequiredScope(resolveRequiredOperatorScopeForMethod(method) ?? "operator.admin", scopes);
}
/** Checks a method registry's already-resolved static scope against presented operator scopes. */
function authorizeOperatorScopesForRequiredScope(requiredScope, scopes) {
	if (scopes.includes("operator.admin")) return { allowed: true };
	if (requiredScope === "operator.read") {
		if (scopes.includes("operator.read") || scopes.includes("operator.write")) return { allowed: true };
		return {
			allowed: false,
			missingScope: READ_SCOPE
		};
	}
	if (requiredScope === "operator.talk") {
		if (scopes.includes("operator.talk") || scopes.includes("operator.write")) return { allowed: true };
		return {
			allowed: false,
			missingScope: TALK_SCOPE
		};
	}
	if (scopes.includes(requiredScope)) return { allowed: true };
	return {
		allowed: false,
		missingScope: requiredScope
	};
}
/** Returns true when a method has any core, node, dynamic, reserved, or plugin scope policy. */
function isGatewayMethodClassified(method) {
	if (isNodeRoleMethod(method)) return true;
	if (isDynamicOperatorGatewayMethod(method)) return true;
	return isCoreGatewayMethodClassified(method) || resolveRequiredOperatorScopeForMethod(method) !== void 0;
}
//#endregion
export { isGatewayMethodClassified as a, isForbiddenBrowserProxyMutation as c, isApprovalMethod as i, AGENT_SESSION_RESET_COMMAND_RE as l, authorizeOperatorScopesForMethod as n, isNodeRoleMethod as o, authorizeOperatorScopesForRequiredScope as r, resolveLeastPrivilegeOperatorScopesForMethod as s, CLI_DEFAULT_OPERATOR_SCOPES as t };
