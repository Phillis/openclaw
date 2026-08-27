import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Mr as validateSessionsCompanionAskParams, Nr as validateSessionsCompanionResetParams, Pr as validateSessionsCompanionStateParams } from "./src-4dv5TpeQ.js";
import { r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { d as errorShape, t as formatValidationErrors } from "./validation-errors-rELRlKfn.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { t as SessionCompanionAskError } from "./session-companion-ask-Cx-2DWLy.js";
//#region src/gateway/session-companion-rpc.ts
function resolveCompanionTarget(params, context) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) return requested;
	return {
		ok: true,
		agentId: requested.agentId,
		sessionKey: resolveSessionStoreKey({
			cfg,
			sessionKey: params.sessionKey,
			storeAgentId: requested.agentId
		})
	};
}
const sessionCompanionHandlers = {
	"sessions.companion.ask": async ({ params, respond, client, context, signal }) => {
		if (!validateSessionsCompanionAskParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.ask params: ${formatValidationErrors(validateSessionsCompanionAskParams.errors)}`));
			return;
		}
		const { sessionKey, agentId, question } = params;
		if (!question.trim()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "question must contain non-whitespace text"));
			return;
		}
		if (!client?.connId) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Session companion asks require a connected client."));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session companion is unavailable."));
			return;
		}
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		try {
			respond(true, await context.sessionCompanion.ask({
				sessionKey: target.sessionKey,
				agentId: target.agentId,
				question,
				connId: client.connId,
				...signal ? { signal } : {}
			}));
		} catch (error) {
			if (!(error instanceof SessionCompanionAskError)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The session companion could not answer right now."));
				return;
			}
			if (error.reason === "busy") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
					details: { code: GatewayErrorDetailCodes.SESSION_COMPANION_BUSY },
					retryable: true
				}));
				return;
			}
			const retryable = error.reason === "rate-limited" || error.reason === "context-unavailable";
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
				details: { reason: error.reason },
				retryable,
				...error.retryAfterMs ? { retryAfterMs: error.retryAfterMs } : {}
			}));
		}
	},
	"sessions.companion.state": ({ params, respond, context }) => {
		if (!validateSessionsCompanionStateParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.state params: ${formatValidationErrors(validateSessionsCompanionStateParams.errors)}`));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session companion is unavailable."));
			return;
		}
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		respond(true, context.sessionCompanion.state({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		}));
	},
	"sessions.companion.reset": ({ params, respond, context }) => {
		if (!validateSessionsCompanionResetParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.reset params: ${formatValidationErrors(validateSessionsCompanionResetParams.errors)}`));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session companion is unavailable."));
			return;
		}
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		context.sessionCompanion.reset({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		});
		respond(true, { ok: true });
	}
};
//#endregion
export { sessionCompanionHandlers };
