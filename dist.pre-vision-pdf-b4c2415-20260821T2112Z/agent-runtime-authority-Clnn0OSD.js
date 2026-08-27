import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
//#region src/gateway/server-methods/agent-runtime-authority.ts
function hasActiveAgentRuntimeAuthority(client, context) {
	const identity = client?.internal?.agentRuntimeIdentity;
	const validate = context.validateAgentRuntimeApprovalAuthority;
	return !identity || !validate || validate(identity);
}
function assertActiveAgentRuntimeAuthority(client, context) {
	if (!hasActiveAgentRuntimeAuthority(client, context)) throw new TypeError("agent runtime authority is no longer active");
}
function ensureActiveAgentRuntimeAuthority(params) {
	if (hasActiveAgentRuntimeAuthority(params.client, params.context)) return true;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active"));
	return false;
}
function createAgentRuntimeAuthorityGuard(client, context, respond) {
	const hasActive = () => hasActiveAgentRuntimeAuthority(client, context);
	return {
		commitGuard: client?.internal?.agentRuntimeIdentity && context.validateAgentRuntimeApprovalAuthority ? () => assertActiveAgentRuntimeAuthority(client, context) : void 0,
		ensureActive: () => ensureActiveAgentRuntimeAuthority({
			client,
			context,
			respond
		}),
		handleClosedError(error) {
			if (error instanceof TypeError && !hasActive()) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			throw error;
		},
		hasActive
	};
}
//#endregion
export { createAgentRuntimeAuthorityGuard as n, hasActiveAgentRuntimeAuthority as r, assertActiveAgentRuntimeAuthority as t };
