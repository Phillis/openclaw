import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, l as resolveAgentDir, p as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-BdXMWufB.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
//#region src/gateway/server-methods/model-auth-agent-scope.ts
/** Resolves model-auth RPC scope without letting explicit garbage reach the default store. */
function resolveModelAuthAgentScope(cfg, requestedAgentId) {
	if (requestedAgentId === void 0 || requestedAgentId === "") {
		let defaultAgentId;
		try {
			defaultAgentId = resolveDefaultAgentId(cfg, {
				surface: "model auth",
				hint: "Pass agentId to select a configured agent."
			});
		} catch (error) {
			if (!(error instanceof AgentSelectionRequiredError)) throw error;
			return {
				ok: false,
				agentId: "",
				error: errorShape(ErrorCodes.INVALID_REQUEST, error.message)
			};
		}
		return {
			ok: true,
			agentId: defaultAgentId,
			agentDir: resolveAgentDir(cfg, defaultAgentId)
		};
	}
	if (typeof requestedAgentId !== "string") return {
		ok: false,
		agentId: requestedAgentId === null ? "null" : typeof requestedAgentId
	};
	const rawAgentId = requestedAgentId.trim();
	if (!rawAgentId) return {
		ok: false,
		agentId: requestedAgentId
	};
	const agentId = normalizeAgentId(rawAgentId);
	if (!/[A-Za-z0-9_]/u.test(rawAgentId) || !listAgentIds(cfg).includes(agentId)) return {
		ok: false,
		agentId: rawAgentId
	};
	return {
		ok: true,
		agentId,
		agentDir: resolveAgentDir(cfg, agentId)
	};
}
function modelAuthAgentScopeError(scope) {
	return scope.error ?? unknownModelAuthAgentIdError(scope.agentId);
}
function unknownModelAuthAgentIdError(agentId) {
	const details = {
		code: GatewayErrorDetailCodes.UNKNOWN_AGENT_ID,
		agentId
	};
	return errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${agentId}"`, { details });
}
//#endregion
export { resolveModelAuthAgentScope as n, modelAuthAgentScopeError as t };
