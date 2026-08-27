import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Jr as validateSessionsObserverVisibilityParams } from "./src-Bo4ezI_n.js";
import { l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
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
