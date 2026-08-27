import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { o as getUserProfileRole } from "./user-profiles-CBL8neN1.js";
//#region src/gateway/server-methods/gateway-client-identity.ts
function isGatewayClientProfilePending(client) {
	return Boolean(client?.authenticatedGitHubIdentitySync && !client.authenticatedUserProfile);
}
function authenticatedProfileUnavailableError() {
	return errorShape(ErrorCodes.UNAVAILABLE, "Authenticated profile verification is unavailable; retry the request.", {
		retryable: true,
		retryAfterMs: 1e3,
		details: { code: "AUTHENTICATED_PROFILE_UNAVAILABLE" }
	});
}
function gatewayClientSenderFields(client) {
	if (client?.internal?.senderAttribution) return { sender: client.internal.senderAttribution };
	const profile = client?.authenticatedUserProfile;
	if (profile) return { sender: {
		id: profile.profileId,
		...profile.displayName ? { name: profile.displayName } : {}
	} };
	if (client?.authenticatedGitHubIdentitySync) return {};
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
//#region src/gateway/operator-role-policy.ts
const operatorRoleLog = createSubsystemLogger("gateway/operator-roles");
const MAX_OPERATOR_ROLE_ASSIGNMENTS = 1024;
const operatorRoleAssignments = /* @__PURE__ */ new Map();
const reportedUnknownAssignments = /* @__PURE__ */ new Set();
const deniedOperatorRole = {
	sessions: { others: "none" },
	agents: [],
	scopes: []
};
function readOperatorRoleAssignment(profileId) {
	if (operatorRoleAssignments.has(profileId)) return operatorRoleAssignments.get(profileId) ?? null;
	const assignment = getUserProfileRole(profileId);
	if (operatorRoleAssignments.size >= MAX_OPERATOR_ROLE_ASSIGNMENTS) {
		const oldestProfileId = operatorRoleAssignments.keys().next().value;
		if (oldestProfileId !== void 0) {
			operatorRoleAssignments.delete(oldestProfileId);
			for (const reported of reportedUnknownAssignments) if (reported.startsWith(`${oldestProfileId}:`)) reportedUnknownAssignments.delete(reported);
		}
	}
	operatorRoleAssignments.set(profileId, assignment);
	return assignment;
}
/** Drops a changed assignment so subsequent authorization reads the durable owner. */
function invalidateOperatorRolePolicy(profileId) {
	operatorRoleAssignments.delete(profileId);
	for (const reported of reportedUnknownAssignments) if (reported.startsWith(`${profileId}:`)) reportedUnknownAssignments.delete(reported);
}
/** An enabled role boundary denies missing identity and unresolvable assignments. */
function resolveOperatorRolePolicyForProfile(profileId, cfg) {
	const roles = cfg.gateway?.roles;
	if (!roles) return;
	if (!profileId) return deniedOperatorRole;
	const assignedRole = readOperatorRoleAssignment(profileId);
	if (assignedRole && Object.hasOwn(roles.definitions, assignedRole)) return roles.definitions[assignedRole];
	if (assignedRole) {
		const reportKey = `${profileId}:${assignedRole}`;
		if (!reportedUnknownAssignments.has(reportKey)) {
			reportedUnknownAssignments.add(reportKey);
			operatorRoleLog.warn(`User profile ${profileId} references unknown Gateway role "${assignedRole}"; ${roles.default ? `applying default role "${roles.default}"` : "denying access"}. Update gateway.roles.definitions or clear the assignment with users.setRole.`);
		}
	}
	return (roles.default ? roles.definitions[roles.default] : void 0) ?? deniedOperatorRole;
}
/** Derives immutable session isolation only from its authenticated human creator. */
function resolveCreatorSandbox(cfg, creation) {
	const actor = creation?.actor;
	return actor?.type === "human" && actor.id && resolveOperatorRolePolicyForProfile(actor.id, cfg)?.sandbox === "required" ? "required" : void 0;
}
/** Resolves the current named policy from the connection's verified profile identity. */
function resolveGatewayOperatorRoleActor(client) {
	const actor = client?.internal?.operatorRoleActor;
	if (actor) return actor;
	const profileId = gatewayClientSessionCreator(client ?? null)?.id;
	return profileId ? {
		kind: "operator",
		profileId
	} : void 0;
}
/** Resolves the current named policy from an authoritative operator or system actor. */
function resolveOperatorRolePolicy(client, cfg) {
	const actor = resolveGatewayOperatorRoleActor(client);
	if (actor?.kind === "system") return;
	return resolveOperatorRolePolicyForProfile(actor?.profileId, cfg);
}
function operatorSessionCap(client, cfg) {
	return resolveOperatorRolePolicy(client, cfg)?.sessions.others;
}
function hasOperatorBoundary(client, cfg) {
	return operatorSessionCap(client, cfg) !== void 0;
}
/** Enforces the owning agent ceiling for session creation and run-start targets. */
function authorizeGatewaySessionCreation(params) {
	const actor = params.actor ?? ("client" in params ? resolveGatewayOperatorRoleActor(params.client) : void 0);
	if (actor?.kind === "system") return;
	const role = resolveOperatorRolePolicyForProfile(actor?.profileId ?? params.profileId, params.cfg);
	if (!role || role.agents === "*" || role.agents.includes(params.agentId)) return;
	return errorShape(ErrorCodes.FORBIDDEN, `Your operator role cannot create sessions for agent "${params.agentId}"; choose an allowed agent or ask a gateway administrator to update your role.`);
}
//#endregion
export { resolveCreatorSandbox as a, resolveOperatorRolePolicyForProfile as c, gatewayClientSessionCreator as d, isGatewayClientProfilePending as f, operatorSessionCap as i, authenticatedProfileUnavailableError as l, hasOperatorBoundary as n, resolveGatewayOperatorRoleActor as o, invalidateOperatorRolePolicy as r, resolveOperatorRolePolicy as s, authorizeGatewaySessionCreation as t, gatewayClientSenderFields as u };
