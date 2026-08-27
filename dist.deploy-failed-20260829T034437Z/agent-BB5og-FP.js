import { s as getAgentRunContext } from "./agent-run-registry-t4kvUyNQ.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { n as validateAgentParams, r as validateAgentWaitParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { i as operatorSessionCap } from "./operator-role-policy-Bvt-UeJ1.js";
import { d as isGatewayAdmin, g as resolveSessionSharingTarget, u as createSessionListEntryFilter } from "./session-sharing-C4OmHGYo.js";
import { t as createAgentTurnService } from "./agent-turn-service-E37ppfMh.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { n as resolveAgentTurnRunObserver, r as prepareAgentRequestPreflight, t as captureAgentTurnPrincipal } from "./principal-D6XpKW3N.js";
//#region src/gateway/agent-turn/io.ts
function createAgentTurnIo(respond) {
	const emit = (frame, meta) => {
		if (meta === void 0) {
			respond(...frame);
			return;
		}
		respond(...frame, meta);
	};
	return {
		emitAcceptance: emit,
		emitFinal: emit
	};
}
//#endregion
//#region src/gateway/server-methods/agent-run-handler.ts
const agentRunHandler = async ({ params, respond, context, client, isWebchatConnect }) => {
	const io = createAgentTurnIo(respond);
	if (!assertValidParams(params, validateAgentParams, "agent", (ok, payload, error, meta) => io.emitAcceptance([
		ok,
		payload,
		error
	], meta))) return;
	const request = params;
	const principal = captureAgentTurnPrincipal(client);
	const preflight = prepareAgentRequestPreflight({
		request,
		context,
		client: principal,
		io
	});
	if (!preflight) return;
	const onRunObserved = resolveAgentTurnRunObserver({
		principal,
		registerToolEventRecipient: context.registerToolEventRecipient
	});
	await createAgentTurnService({
		context,
		isWebchatConnect
	}).startTurn({
		preflight,
		principal,
		io,
		onRunObserved
	});
};
//#endregion
//#region src/gateway/server-methods/agent-wait.ts
const agentWaitHandler = async ({ params, respond, context, client, isWebchatConnect }) => {
	if (!assertValidParams(params, validateAgentWaitParams, "agent.wait", respond)) return;
	const gatewayClient = client ?? null;
	if (gatewayClient?.authenticatedUserProfile && !isGatewayAdmin(gatewayClient)) {
		const cfg = context.getRuntimeConfig();
		if (operatorSessionCap(gatewayClient, cfg) === "none") {
			const run = getAgentRunContext(params.runId);
			const target = run?.sessionKey ? resolveSessionSharingTarget({
				cfg,
				sessionKey: run.sessionKey,
				agentId: run.agentId
			}) : null;
			const visibilityFilter = createSessionListEntryFilter({
				client: gatewayClient,
				cfg
			});
			if (!target || visibilityFilter?.(target.storeKey, target.entry) === false) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent run was not found"));
				return;
			}
		}
	}
	respond(true, await createAgentTurnService({
		context,
		isWebchatConnect
	}).waitForTurn(params));
};
//#endregion
//#region src/gateway/server-methods/agent.ts
const agentHandlers = {
	agent: agentRunHandler,
	"agent.wait": agentWaitHandler
};
//#endregion
export { agentHandlers };
