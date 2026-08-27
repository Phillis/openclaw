import { n as validateAgentParams, r as validateAgentWaitParams } from "./src-BlUKtAtD.js";
import { t as createAgentTurnService } from "./agent-turn-service-DpDPMDhg.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as resolveAgentTurnRunObserver, r as prepareAgentRequestPreflight, t as captureAgentTurnPrincipal } from "./principal-DpCEKmpQ.js";
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
const agentWaitHandler = async ({ params, respond, context, isWebchatConnect }) => {
	if (!assertValidParams(params, validateAgentWaitParams, "agent.wait", respond)) return;
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
