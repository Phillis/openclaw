import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { ii as validateSessionsObserverVisibilityParams } from "./src-4dv5TpeQ.js";
import { d as errorShape, t as formatValidationErrors } from "./validation-errors-rELRlKfn.js";
//#region src/gateway/session-observer-rpc.ts
const sessionObserverHandlers = { "sessions.observer.visibility": ({ params, respond, client, context }) => {
	if (!validateSessionsObserverVisibilityParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.observer.visibility params: ${formatValidationErrors(validateSessionsObserverVisibilityParams.errors)}`));
		return;
	}
	if (!client?.connId) {
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Session observer visibility requires a connected client."));
		return;
	}
	if (!context.sessionObserver) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session observer is unavailable."));
		return;
	}
	const { visible } = params;
	context.sessionObserver.setConnectionVisibility(client.connId, visible);
	respond(true, { ok: true });
} };
//#endregion
export { sessionObserverHandlers };
