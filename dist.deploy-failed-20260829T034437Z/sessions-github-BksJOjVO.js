import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { lr as validateSessionGitHubPublishParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { r as getGatewayToolCallerIdentity } from "./gateway-caller-context-D1DYQtHE.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-sharing-C4OmHGYo.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
//#region src/gateway/server-methods/sessions-github.ts
const sessionsGitHubHandlers = { "sessions.github.publish": async ({ params, respond, context, sessionMutationAuthorization }) => {
	if (!assertValidParams(params, validateSessionGitHubPublishParams, "sessions.github.publish", respond)) return;
	const coordinator = context.githubPublicationService;
	if (!coordinator) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication is unavailable on this Gateway"));
		return;
	}
	const caller = getGatewayToolCallerIdentity();
	const sessionKey = caller?.sessionKey ?? params.sessionKey;
	if (!sessionKey || caller && params.sessionKey && params.sessionKey !== caller.sessionKey) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session is invalid"));
		return;
	}
	const loaded = loadGatewaySessionEntryReadOnly(sessionKey, caller?.agentId ? { agentId: caller.agentId } : void 0);
	if (!loaded.entry?.sessionId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session was not found"));
		return;
	}
	try {
		sessionMutationAuthorization?.assertCurrent();
		const result = await coordinator.requestForSession({
			...params,
			sessionKey: loaded.canonicalKey,
			agentId: caller?.agentId ?? loaded.agentId,
			...caller?.operationalRunInstance?.runId ? { expectedRunId: caller.operationalRunInstance.runId } : {},
			...sessionMutationAuthorization ? { assertCurrent: sessionMutationAuthorization.assertCurrent } : {}
		});
		sessionMutationAuthorization?.assertCurrent();
		respond(true, result);
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "GitHub publication request failed"));
	}
} };
//#endregion
export { sessionsGitHubHandlers };
